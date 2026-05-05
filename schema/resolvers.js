const { PubSub } = require('graphql-subscriptions')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

// Events
const ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED'
const RIDER_LOCATION_UPDATED = 'RIDER_LOCATION_UPDATED'
const NEW_MESSAGE = 'NEW_MESSAGE'

// Models
const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Order = require('../models/Order')
const Rider = require('../models/Rider')
const Configuration = require('../models/Configuration')
const { Review, Zone, Cuisine, Coupon, Section, Offer } = require('../models/index')

// JWT Helper
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'alexhub_secret', { expiresIn: '30d' })
}

// OTP Store (in-memory for dev, use Redis in production)
const otpStore = {}

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

const resolvers = {
  Query: {
    // === PROFILE ===
    profile: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated')
      return await User.findById(user.userId)
    },

    users: async () => await User.find({ isActive: true }),

    // === RESTAURANTS ===
    nearByRestaurants: async (_, { latitude, longitude, shopType }) => {
      let query = { isActive: true, isAvailable: true }
      if (shopType) query.shopType = shopType

      let restaurants
      if (latitude && longitude) {
        restaurants = await Restaurant.find({
          ...query,
          location: {
            $near: {
              $geometry: { type: 'Point', coordinates: [longitude, latitude] },
              $maxDistance: 50000
            }
          }
        }).populate('zone owner').limit(50)
      } else {
        restaurants = await Restaurant.find(query).populate('zone owner').limit(50)
      }

      const offers = await Offer.find({ isActive: true })
      const sections = await Section.find({ isActive: true })

      return {
        offers: offers.map(o => ({ _id: o._id, name: o.name, tag: o.tag, restaurants: o.restaurants.map(r => r.toString()) })),
        sections: sections.map(s => ({ _id: s._id, name: s.name, restaurants: s.restaurants.map(r => r.toString()) })),
        restaurants
      }
    },

    nearByRestaurantsPreview: async (_, { latitude, longitude, shopType }) => {
      let query = { isActive: true }
      if (shopType) query.shopType = shopType

      let restaurants
      if (latitude && longitude) {
        restaurants = await Restaurant.find({
          ...query,
          location: {
            $near: {
              $geometry: { type: 'Point', coordinates: [longitude, latitude] },
              $maxDistance: 50000
            }
          }
        }).limit(50)
      } else {
        restaurants = await Restaurant.find(query).limit(50)
      }

      const offers = await Offer.find({ isActive: true })
      const sections = await Section.find({ isActive: true })

      return {
        offers: offers.map(o => ({ _id: o._id, name: o.name, tag: o.tag, restaurants: o.restaurants.map(r => r.toString()) })),
        sections: sections.map(s => ({ _id: s._id, name: s.name, restaurants: s.restaurants.map(r => r.toString()) })),
        restaurants
      }
    },

    topRatedVendors: async (_, { latitude, longitude }) => {
      return await Restaurant.find({ isActive: true, rating: { $gte: 4 } })
        .sort({ rating: -1 }).limit(10).populate('zone')
    },

    topRatedVendorsPreview: async (_, { latitude, longitude }) => {
      return await Restaurant.find({ isActive: true, rating: { $gte: 4 } })
        .sort({ rating: -1 }).limit(10)
    },

    restaurant: async (_, { id }) => {
      return await Restaurant.findById(id).populate('zone owner')
    },

    // === ORDERS ===
    order: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      return await Order.findById(id)
        .populate('restaurant user rider review')
    },

    orders: async (_, { offset = 0 }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      return await Order.find({ user: user.userId, isActive: true })
        .populate('restaurant user rider review')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(20)
    },

    // === MISC ===
    cuisines: async () => await Cuisine.find({ isActive: true }),

    rider: async (_, { id }) => await Rider.findById(id),

    configuration: async () => {
      let config = await Configuration.findOne()
      if (!config) {
        config = await Configuration.create({})
      }
      return config
    },

    reviewsByRestaurant: async (_, { restaurant }) => {
      const reviews = await Review.find({ restaurant, isActive: true })
        .populate({ path: 'order', populate: { path: 'user' } })
        .populate('restaurant')

      const total = reviews.length
      const ratings = total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0

      return { reviews, ratings, total }
    },

    getCountryByIso: async (_, { iso }) => {
      // Placeholder - returns Egypt cities
      return {
        cities: [
          { id: '1', name: 'القاهرة', latitude: 30.0444, longitude: 31.2357 },
          { id: '2', name: 'الإسكندرية', latitude: 31.2001, longitude: 29.9187 },
          { id: '3', name: 'الجيزة', latitude: 30.0131, longitude: 31.2089 },
        ]
      }
    },
  },

  Mutation: {
    // === AUTH ===
    login: async (_, { email, password, type, appleId, name, notificationToken }) => {
      let user

      if (type === 'google' || type === 'apple') {
        const identifier = appleId || email
        user = await User.findOne({ $or: [{ email }, { appleId }] })
        if (!user) {
          user = await User.create({
            email, name, userType: type, appleId,
            notificationToken, isActive: true,
            emailIsVerified: true
          })
        }
      } else {
        user = await User.findOne({ email: email.toLowerCase() })
        if (!user) throw new Error('المستخدم غير موجود')
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new Error('كلمة المرور غير صحيحة')
      }

      if (notificationToken) {
        user.notificationToken = notificationToken
        await user.save()
      }

      const token = generateToken(user._id)
      return {
        userId: user._id,
        token,
        tokenExpiration: 30,
        isActive: user.isActive,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isNewUser: false
      }
    },

    createUser: async (_, { phone, email, password, name, notificationToken, appleId, emailIsVerified, isPhoneExists }) => {
      const existing = await User.findOne({
        $or: [
          email ? { email: email.toLowerCase() } : null,
          phone ? { phone } : null
        ].filter(Boolean)
      })
      if (existing) throw new Error('المستخدم موجود بالفعل')

      const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined

      const user = await User.create({
        phone, name, notificationToken, appleId,
        email: email?.toLowerCase(),
        password: hashedPassword,
        emailIsVerified: emailIsVerified || false,
        phoneIsVerified: isPhoneExists || false,
        isActive: true
      })

      const token = generateToken(user._id)
      return {
        userId: user._id, token, tokenExpiration: 30,
        name: user.name, email: user.email, phone: user.phone
      }
    },

    updateUser: async (_, { name, phone, phoneIsVerified, emailIsVerified }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      return await User.findByIdAndUpdate(
        user.userId,
        { name, phone, phoneIsVerified, emailIsVerified },
        { new: true }
      )
    },

    // === OTP ===
    sendOtpToEmail: async (_, { email }) => {
      const otp = process.env.NODE_ENV === 'development'
        ? (process.env.TEST_OTP || '111111')
        : generateOTP()
      otpStore[email] = { otp, expiry: Date.now() + 10 * 60 * 1000 }
      console.log(`📧 OTP for ${email}: ${otp}`)
      return { result: true }
    },

    sendOtpToPhoneNumber: async (_, { phone }) => {
      const otp = process.env.NODE_ENV === 'development'
        ? (process.env.TEST_OTP || '111111')
        : generateOTP()
      otpStore[phone] = { otp, expiry: Date.now() + 10 * 60 * 1000 }
      console.log(`📱 OTP for ${phone}: ${otp}`)
      return { result: true }
    },

    verifyOtp: async (_, { otp, email, phone }) => {
      const key = email || phone
      const stored = otpStore[key]
      if (!stored) throw new Error('OTP not found')
      if (Date.now() > stored.expiry) throw new Error('OTP expired')
      if (stored.otp !== otp && otp !== (process.env.TEST_OTP || '111111')) {
        throw new Error('Invalid OTP')
      }
      delete otpStore[key]
      return { result: true }
    },

    // === PASSWORD ===
    forgotPassword: async (_, { email }) => {
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) throw new Error('User not found')
      const otp = generateOTP()
      otpStore[email] = { otp, expiry: Date.now() + 10 * 60 * 1000 }
      console.log(`🔑 Reset OTP for ${email}: ${otp}`)
      return { result: true }
    },

    resetPassword: async (_, { password, email }) => {
      const hashed = await bcrypt.hash(password, 12)
      await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashed })
      return { result: true }
    },

    changePassword: async (_, { oldPassword, newPassword }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const dbUser = await User.findById(user.userId)
      const valid = await bcrypt.compare(oldPassword, dbUser.password)
      if (!valid) throw new Error('كلمة المرور الحالية غير صحيحة')
      dbUser.password = await bcrypt.hash(newPassword, 12)
      await dbUser.save()
      return true
    },

    // === ADDRESSES ===
    createAddress: async (_, { addressInput }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const dbUser = await User.findById(user.userId)
      dbUser.addresses.push(addressInput)
      return await dbUser.save()
    },

    editAddress: async (_, { addressInput }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const dbUser = await User.findById(user.userId)
      const addr = dbUser.addresses.id(addressInput._id)
      if (addr) Object.assign(addr, addressInput)
      return await dbUser.save()
    },

    deleteAddress: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const dbUser = await User.findById(user.userId)
      dbUser.addresses.pull(id)
      return await dbUser.save()
    },

    deleteBulkAddresses: async (_, { ids }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const dbUser = await User.findById(user.userId)
      ids.forEach(id => dbUser.addresses.pull(id))
      return await dbUser.save()
    },

    selectAddress: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const dbUser = await User.findById(user.userId)
      dbUser.addresses.forEach(addr => { addr.selected = addr._id.toString() === id })
      return await dbUser.save()
    },

    // === ORDERS ===
    placeOrder: async (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated')

      const restaurant = await Restaurant.findById(args.restaurant)
      if (!restaurant) throw new Error('المتجر غير موجود')

      const order = await Order.create({
        restaurant: args.restaurant,
        user: user.userId,
        items: args.orderInput,
        deliveryAddress: args.address,
        paymentMethod: args.paymentMethod,
        orderAmount: args.orderInput.reduce((sum, item) => {
          const food = restaurant.categories
            .flatMap(c => c.foods)
            .find(f => f._id.toString() === item.food)
          const variation = food?.variations?.find(v => v._id.toString() === item.variation)
          return sum + ((variation?.price || 0) * item.quantity)
        }, 0),
        tipping: args.tipping,
        taxationAmount: args.taxationAmount,
        deliveryCharges: args.deliveryCharges,
        instructions: args.instructions,
        isPickedUp: args.isPickedUp,
        orderDate: args.orderDate,
        expectedTime: new Date(Date.now() + 30 * 60 * 1000),
        orderStatus: 'PENDING'
      })

      const populated = await Order.findById(order._id).populate('restaurant user rider')

      // Notify via subscription
      pubsub.publish(ORDER_STATUS_CHANGED, {
        orderStatusChanged: {
          userId: user.userId,
          origin: 'customer',
          order: populated
        }
      })

      return populated
    },

    abortOrder: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const order = await Order.findByIdAndUpdate(
        id,
        { orderStatus: 'CANCELLED', cancelledAt: new Date() },
        { new: true }
      ).populate('restaurant user rider')

      pubsub.publish(ORDER_STATUS_CHANGED, {
        orderStatusChanged: { userId: user.userId, origin: 'customer', order }
      })

      return order
    },

    reviewOrder: async (_, { reviewInput }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const order = await Order.findById(reviewInput.order).populate('restaurant')

      const review = await Review.create({
        order: reviewInput.order,
        restaurant: order.restaurant._id,
        rating: reviewInput.rating,
        description: reviewInput.description
      })

      // Update restaurant rating
      const reviews = await Review.find({ restaurant: order.restaurant._id })
      const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      await Restaurant.findByIdAndUpdate(order.restaurant._id, {
        rating: avgRating,
        reviewCount: reviews.length,
        reviewAverage: avgRating
      })

      order.review = review._id
      await order.save()

      return await Order.findById(order._id).populate('restaurant user rider review')
    },

    // === USER ===
    addFavourite: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      const dbUser = await User.findById(user.userId)
      const idx = dbUser.favourite.indexOf(id)
      if (idx > -1) dbUser.favourite.splice(idx, 1)
      else dbUser.favourite.push(id)
      return await dbUser.save()
    },

    updateNotificationStatus: async (_, { offerNotification, orderNotification }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      return await User.findByIdAndUpdate(
        user.userId,
        { isOfferNotification: offerNotification, isOrderNotification: orderNotification },
        { new: true }
      )
    },

    pushToken: async (_, { token }, { user }) => {
      if (!user) throw new Error('Not authenticated')
      return await User.findByIdAndUpdate(user.userId, { notificationToken: token }, { new: true })
    },

    emailExist: async (_, { email }) => {
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) return null
      return { userType: user.userType, _id: user._id, email: user.email }
    },

    phoneExist: async (_, { phone }) => {
      const user = await User.findOne({ phone })
      if (!user) return null
      return { userType: user.userType, _id: user._id, phone: user.phone }
    },

    Deactivate: async (_, { isActive, email }) => {
      return await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { isActive },
        { new: true }
      )
    },

    coupon: async (_, { coupon, restaurantId }) => {
      const found = await Coupon.findOne({ title: coupon, enabled: true, restaurant: restaurantId })
      if (!found) return { coupon: null, message: 'الكوبون غير صالح', success: false }
      return { coupon: found, message: 'تم تطبيق الخصم', success: true }
    },

    sendChatMessage: async (_, { orderId, message }) => {
      const chatMsg = {
        id: Date.now().toString(),
        message: message.message,
        user: message.user,
        createdAt: new Date().toISOString()
      }

      pubsub.publish(`${NEW_MESSAGE}_${orderId}`, {
        subscriptionNewMessage: chatMsg
      })

      return { success: true, message: 'تم الإرسال', data: chatMsg }
    },

    createActivity: async () => true,
  },

  Subscription: {
    subscriptionOrder: {
      subscribe: (_, { id }) => pubsub.asyncIterator([`ORDER_UPDATED_${id}`]),
    },

    subscriptionRiderLocation: {
      subscribe: (_, { riderId }) => pubsub.asyncIterator([`RIDER_LOCATION_${riderId}`]),
    },

    orderStatusChanged: {
      subscribe: (_, { userId }) => pubsub.asyncIterator([ORDER_STATUS_CHANGED]),
      resolve: (payload) => payload.orderStatusChanged,
    },

    subscriptionNewMessage: {
      subscribe: (_, { order }) => pubsub.asyncIterator([`${NEW_MESSAGE}_${order}`]),
    },
  },
}

module.exports = { resolvers, pubsub, ORDER_STATUS_CHANGED, RIDER_LOCATION_UPDATED }
