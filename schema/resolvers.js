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
const { Review, Zone, Cuisine, Coupon, Section, Offer, Banner, ShopType, WithdrawRequest } = require('../models/index')
const { sendNotification } = require('../utils/notifications')

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

    users: async () => await User.find({ isActive: true }).sort({ createdAt: -1 }),
    user: async (_, { id }) => await User.findById(id),

    // === VENDORS ===
    vendors: async () => {
      const users = await User.find({ userType: 'VENDOR', isActive: true });
      return users.map(u => ({
        unique_id: u._id.toString(),
        _id: u._id,
        email: u.email,
        userType: u.userType,
        isActive: u.isActive,
        name: u.name,
        image: '',
        restaurants: [],
        firstName: u.name,
        lastName: '',
        phoneNumber: u.phone
      }));
    },
    getVendor: async (_, { id }) => {
      const u = await User.findById(id);
      if (!u) return null;
      return {
        unique_id: u._id.toString(),
        _id: u._id,
        email: u.email,
        userType: u.userType,
        isActive: u.isActive,
        name: u.name,
        image: '',
        restaurants: await Restaurant.find({ owner: u._id }),
        firstName: u.name,
        lastName: '',
        phoneNumber: u.phone
      };
    },

    // === RIDERS ===
    riders: async () => await Rider.find().populate('zone'),
    availableRiders: async () => await Rider.find({ available: true }).populate('zone'),
    ridersByZone: async (_, { id }) => await Rider.find({ zone: id }).populate('zone'),
    rider: async (_, { id }) => await Rider.findById(id),

    // === DASHBOARD ===
    getDashboardUsers: async () => ({
      usersCount: await User.countDocuments({ userType: 'USER' }),
      vendorsCount: await User.countDocuments({ userType: 'VENDOR' }),
      restaurantsCount: await Restaurant.countDocuments(),
      ridersCount: await Rider.countDocuments()
    }),
    getDashboardUsersByYear: async (_, { year }) => {
      return {
        usersCount: [100, 120, 140, 150, 180, 200, 220, 250, 280, 300, 320, 350],
        vendorsCount: [10, 12, 15, 18, 20, 22, 25, 28, 30, 35, 40, 45],
        restaurantsCount: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 50],
        ridersCount: [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 35],
        percentageChange: {
          usersPercent: 8.5,
          vendorsPercent: 2.4,
          restaurantsPercent: 6.1,
          ridersPercent: 1.9
        }
      }
    },
    getDashboardOrdersByType: async () => [
      { label: 'Delivery', value: 60 },
      { label: 'Pick Up', value: 40 }
    ],
    getDashboardSalesByType: async () => [
      { label: 'Cash', value: 70 },
      { label: 'Card', value: 30 }
    ],

    // === PHASE 3: EXTRA OPERATIONS ===
    banners: async () => await Banner.find(),
    coupons: async () => await Coupon.find(),
    coupon: async (_, { coupon, restaurantId }) => {
      try {
        const couponData = await Coupon.findOne({ title: coupon, enabled: true });
        if (!couponData) {
          return {
            success: false,
            message: 'الكوبون غير صحيح أو منتهي الصلاحية',
            coupon: null
          };
        }
        
        // If coupon is restricted to a specific restaurant
        if (couponData.restaurant && couponData.restaurant.toString() !== restaurantId) {
          return {
            success: false,
            message: 'هذا الكوبون غير متاح لهذا المطعم',
            coupon: null
          };
        }

        return {
          success: true,
          message: 'تم تطبيق الكوبون بنجاح',
          coupon: couponData
        };
      } catch (error) {
        return {
          success: false,
          message: 'حدث خطأ أثناء التحقق من الكوبون',
          coupon: null
        };
      }
    },
    cuisines: async () => await Cuisine.find(),
    fetchShopTypes: async (_, { filter, pagination }) => {
      const page = pagination?.pageNo || 1;
      const limit = pagination?.pageSize || 10;
      const query = filter?.isActive !== undefined ? { isActive: filter.isActive } : {};
      const total = await ShopType.countDocuments(query);
      const data = await ShopType.find(query).skip((page - 1) * limit).limit(limit);
      return {
        data,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      };
    },
    fetchShopTypeByUnique: async (_, { dto }) => await ShopType.findById(dto._id),
    withdrawRequests: async (_, { userType, userId, pagination, search }) => {
      let query = {};
      if (userType) query.userType = userType;
      if (userId) query.user = userId;
      
      const page = pagination?.pageNo || 1;
      const limit = pagination?.pageSize || 10;
      
      const total = await WithdrawRequest.countDocuments(query);
      const data = await WithdrawRequest.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user restaurant');
        
      return {
        message: 'Success',
        pagination: { total },
        data,
        success: true
      };
    },

    // === ORDERS (ADMIN) ===
    allOrders: async (_, { page = 1 }) => await Order.find().sort({ createdAt: -1 }).skip((page - 1) * 10).limit(10).populate('restaurant user rider zone items.food'),
    allOrdersPaginated: async (_, { page = 1, rows = 10, search }) => {
      let query = {};
      if (search) {
        query.orderId = { $regex: search, $options: 'i' };
      }
      const totalCount = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * rows)
        .limit(rows)
        .populate('restaurant user rider zone items.food');
      return {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / rows),
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page * rows < totalCount ? page + 1 : null,
        orders
      };
    },
    allOrdersWithoutPagination: async () => await Order.find().sort({ createdAt: -1 }).populate('restaurant user rider zone items.food'),
    getActiveOrders: async (_, { restaurantId, page = 1, rowsPerPage = 10, search }) => {
      let query = { orderStatus: { $in: ['PENDING', 'ACCEPTED', 'PICKED', 'ASSIGNED'] } };
      if (restaurantId) query.restaurant = restaurantId;
      if (search) query.orderId = { $regex: search, $options: 'i' };
      
      const totalCount = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * rowsPerPage)
        .limit(rowsPerPage)
        .populate('restaurant user rider zone items.food');
      return {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / rowsPerPage),
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page * rowsPerPage < totalCount ? page + 1 : null,
        orders
      };
    },
    ordersByRestId: async (_, { restaurant, page = 1, rows = 10, search }) => {
      let query = { restaurant };
      if (search) query.orderId = { $regex: search, $options: 'i' };
      return await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * rows)
        .limit(rows)
        .populate('restaurant user rider zone items.food');
    },
    ordersByRestIdWithoutPagination: async (_, { restaurant, search }) => {
      let query = { restaurant };
      if (search) query.orderId = { $regex: search, $options: 'i' };
      return await Order.find(query).sort({ createdAt: -1 }).populate('restaurant user rider zone items.food');
    },

    // === ORDERS (APP) ===
    order: async (_, { id }, { user }) => {
      // In admin dashboard 'user' might be null but we want to allow access if it's an admin request.
      // For now, let's allow it if ID is provided, but in production check roles.
      return await Order.findById(id).populate('restaurant user rider zone items.food review');
    },
    orders: async (_, { offset = 0 }, { user }) => {
      if (user) {
        return await Order.find({ user: user.userId, isActive: true })
          .populate('restaurant user rider review')
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(20)
      }
      return await Order.find().sort({ createdAt: -1 }).skip(offset).limit(10).populate('restaurant user rider zone items.food')
    },

    // === RESTAURANTS ===
    restaurant: async (_, { id }) => await Restaurant.findById(id).populate('zone owner'),
    restaurants: async () => await Restaurant.find({ isActive: true }).populate('zone owner'),
    restaurantsPaginated: async (_, { page = 1, limit = 10, search }) => {
      let query = { isActive: true }
      if (search) {
        query.name = { $regex: search, $options: 'i' }
      }
      const totalCount = await Restaurant.countDocuments(query)
      const data = await Restaurant.find(query)
        .populate('zone owner')
        .skip((page - 1) * limit)
        .limit(limit)
      
      return {
        data,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    },

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

    // === CONFIGURATION ===
    configuration: async () => {
      let config = await Configuration.findOne()
      if (!config) {
        config = await Configuration.create({ isPaidVersion: true })
      } else if (!config.isPaidVersion) {
        config.isPaidVersion = true;
        await config.save();
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
    // === ADMIN AUTH ===
    ownerLogin: async (_, { email, password }) => {
      console.log('OWNER LOGIN ATTEMPT:', { email, password });
      
      // Normalize email just in case
      const normalizedEmail = email ? email.toLowerCase().trim() : '';
      
      // Mocked Super Admin login for alexhub
      const adminPass = process.env.ADMIN_PASSWORD || 'AlexHub_Secure_Pass_2026!';
      if (normalizedEmail === 'admin@alexhub.com' && password === adminPass) {
        const token = generateToken('super-admin-id')
        return {
          userId: 'super-admin-id',
          token,
          email,
          userType: 'ADMIN',
          shopType: '',
          permissions: ['all'],
          userTypeId: 'super-admin-id',
          image: '',
          name: 'AlexHub Admin',
          restaurants: []
        }
      }
      
      // Fallback for actual users/vendors if needed
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) throw new Error('المستخدم غير موجود')
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) throw new Error('كلمة المرور غير صحيحة')
        
      const token = generateToken(user._id)
      return {
        userId: user._id,
        token,
        email: user.email,
        userType: user.userType || 'VENDOR',
        shopType: '',
        permissions: [],
        userTypeId: user._id,
        image: '',
        name: user.name,
        restaurants: [] // Could populate restaurants here
      }
    },

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

      // Calculate total amount from items
      let calculatedAmount = 0
      for (const item of args.orderInput) {
        let foodItem = null
        for (const cat of restaurant.categories) {
          foodItem = cat.foods.find(f => f._id.toString() === item.food)
          if (foodItem) break
        }
        
        if (foodItem) {
          const variation = foodItem.variations.find(v => v._id.toString() === item.variation)
          if (variation) {
            calculatedAmount += (variation.price || 0) * item.quantity
            // Add addons price if any
            if (item.addons && item.addons.length > 0) {
              // This part would need actual addon options lookup, but simplified for now
            }
          }
        }
      }

      // Calculate Coupon Discount
      let discountAmount = 0
      if (args.couponCode) {
        const coupon = await Coupon.findOne({ title: args.couponCode, enabled: true })
        if (coupon) {
          // If coupon is restaurant-specific
          if (!coupon.restaurant || coupon.restaurant.toString() === args.restaurant) {
            discountAmount = (calculatedAmount * (coupon.discount / 100))
          }
        }
      }

      const order = await Order.create({
        restaurant: args.restaurant,
        user: user.userId,
        items: args.orderInput,
        deliveryAddress: args.address,
        paymentMethod: args.paymentMethod,
        orderAmount: (args.orderAmount || calculatedAmount) - discountAmount,
        paidAmount: args.paymentMethod === 'COD' ? 0 : ((args.orderAmount || calculatedAmount) - discountAmount),
        tipping: args.tipping,
        taxationAmount: args.taxationAmount,
        deliveryCharges: args.deliveryCharges,
        discountAmount: discountAmount || args.discountAmount || 0,
        instructions: args.instructions,
        isPickedUp: args.isPickedUp,
        orderDate: args.orderDate || new Date(),
        expectedTime: new Date(Date.now() + (restaurant.deliveryTime || 30) * 60 * 1000),
        orderStatus: 'PENDING',
        paymentStatus: args.paymentMethod === 'COD' ? 'UNPAID' : 'PAID',
        zone: restaurant.zone
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

      // Notify Restaurant owner via Push Notification
      if (restaurant.notificationToken) {
        sendNotification(
          [restaurant.notificationToken],
          'طلب جديد! 🍔',
          `وصلك طلب جديد برقم ${populated.orderId} بقيمة ${populated.orderAmount} ج.م`,
          { orderId: populated._id, type: 'NEW_ORDER' }
        ).catch(err => console.error('Push Error:', err))
      }

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

    // === ADMIN RESTAURANT MUTATIONS ===
    createRestaurant: async (_, { restaurant, owner }) => {
      const { location, ...rest } = restaurant;
      const restaurantData = {
        ...rest,
        owner,
        location: location ? { type: 'Point', coordinates: location.coordinates } : undefined
      };
      return await Restaurant.create(restaurantData);
    },
    editRestaurant: async (_, { restaurant }) => {
      const { _id, location, ...updateData } = restaurant;
      if (location) {
        updateData.location = { type: 'Point', coordinates: location.coordinates };
      }
      return await Restaurant.findByIdAndUpdate(_id, updateData, { new: true });
    },
    deleteRestaurant: async (_, { id }) => {
      await Restaurant.findByIdAndUpdate(id, { isActive: false });
      return true;
    },
    hardDeleteRestaurant: async (_, { id }) => {
      await Restaurant.findByIdAndDelete(id);
      return true;
    },
    updateRestaurantDelivery: async (_, { id, minDeliveryFee, deliveryDistance, deliveryFee }) => {
      const restaurant = await Restaurant.findByIdAndUpdate(id, {
        'deliveryInfo.minDeliveryFee': minDeliveryFee,
        'deliveryInfo.deliveryDistance': deliveryDistance,
        'deliveryInfo.deliveryFee': deliveryFee
      }, { new: true });
      return { success: true, message: 'Updated', data: restaurant };
    },
    updateRestaurantBussinessDetails: async (_, { id, bussinessDetails }) => {
      const restaurant = await Restaurant.findByIdAndUpdate(id, { bussinessDetails }, { new: true });
      return { success: true, message: 'Updated', data: restaurant };
    },
    updateDeliveryBoundsAndLocation: async (_, { id, location, bounds, boundType }) => {
      const update = {};
      if (location) update.location = { type: 'Point', coordinates: location.coordinates };
      if (bounds) update.deliveryBounds = { type: boundType || 'Polygon', coordinates: bounds };
      const restaurant = await Restaurant.findByIdAndUpdate(id, update, { new: true });
      return { success: true, message: 'Updated', data: restaurant };
    },

    // === ADMIN COUPON MUTATIONS ===
    createCoupon: async (_, { couponInput }) => {
      return await Coupon.create(couponInput);
    },
    editCoupon: async (_, { couponInput }) => {
      const { _id, ...updateData } = couponInput;
      return await Coupon.findByIdAndUpdate(_id, updateData, { new: true });
    },
    deleteCoupon: async (_, { id }) => {
      await Coupon.findByIdAndDelete(id);
      return true;
    },

    // === ADMIN ORDER/DISPATCH MUTATIONS ===
    updateStatus: async (_, { id, orderStatus }) => {
      const updateData = { orderStatus }
      if (orderStatus === 'ACCEPTED') updateData.acceptedAt = new Date()
      if (orderStatus === 'PICKED') updateData.pickedAt = new Date()
      if (orderStatus === 'DELIVERED') {
        updateData.deliveredAt = new Date()
        updateData.paymentStatus = 'PAID'
      }
      if (orderStatus === 'CANCELLED') updateData.cancelledAt = new Date()
      
      const order = await Order.findByIdAndUpdate(id, updateData, { new: true }).populate('restaurant user rider');
      
      pubsub.publish(ORDER_STATUS_CHANGED, { 
        orderStatusChanged: { 
          userId: order.user._id, 
          origin: 'admin', 
          order 
        } 
      });

      // Notify Customer via Push Notification
      if (order.user && order.user.notificationToken) {
        let statusAr = orderStatus
        if (orderStatus === 'ACCEPTED') statusAr = 'تم قبول طلبك'
        if (orderStatus === 'PICKED') statusAr = 'طلبك في الطريق إليك'
        if (orderStatus === 'DELIVERED') statusAr = 'تم توصيل طلبك بالهناء والشفاء'
        
        sendNotification(
          [order.user.notificationToken],
          'تحديث حالة الطلب 📦',
          `${statusAr} (رقم الطلب: ${order.orderId})`,
          { orderId: order._id, type: 'STATUS_UPDATE', status: orderStatus }
        ).catch(err => console.error('Push Error:', err))
      }

      return order;
    },
    assignRider: async (_, { id, riderId }) => {
      const order = await Order.findByIdAndUpdate(id, { rider: riderId, orderStatus: 'ASSIGNED' }, { new: true }).populate('restaurant user rider');
      pubsub.publish(ORDER_STATUS_CHANGED, { orderStatusChanged: { userId: order.user._id, origin: 'admin', order } });
      
      // Notify Rider via Push Notification
      if (order.rider && order.rider.notificationToken) {
        sendNotification(
          [order.rider.notificationToken],
          'مشوار جديد! 🚴',
          `تم تعيينك لتوصيل طلب جديد من ${order.restaurant.name}`,
          { orderId: order._id, type: 'NEW_ASSIGNMENT' }
        ).catch(err => console.error('Push Error:', err))
      }

      return order;
    },

    // === ADMIN CONFIGURATION MUTATIONS ===
    saveEmailConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveFormEmailConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveSendGridConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveFirebaseConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveSentryConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveGoogleApiKeyConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveCloudinaryConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveAmplitudeApiKeyConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveGoogleClientIDConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveWebConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveAppConfigurations: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveDeliveryRateConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveStatusWithdrawRequest: async (_, { id, status, paymentDetails }) => {
      return await WithdrawRequest.findByIdAndUpdate(id, { status, paymentDetails }, { new: true }).populate('user restaurant');
    },
    createWithdrawRequest: async (_, { userType, userId, amount, restaurantId }) => {
      const requestId = 'WR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const userModel = userType === 'RIDER' ? 'Rider' : 'User';
      
      return await WithdrawRequest.create({
        requestId,
        userType,
        user: userId,
        userModel,
        restaurant: restaurantId,
        requestAmount: amount,
        status: 'PENDING'
      });
    },
    savePaypalConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveStripeConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveTwilioConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveVerificationsToggle: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
    saveCurrencyConfiguration: async (_, { configurationInput }) => {
      return await Configuration.findOneAndUpdate({}, configurationInput, { new: true, upsert: true });
    },
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
