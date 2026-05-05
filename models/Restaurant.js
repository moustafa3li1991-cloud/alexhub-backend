const mongoose = require('mongoose')

const FoodVariationSchema = new mongoose.Schema({
  title: String,
  price: { type: Number, default: 0 },
  discounted: { type: Number, default: 0 },
  addons: [String]
})

const FoodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  subCategory: { type: String },
  isActive: { type: Boolean, default: true },
  isOutOfStock: { type: Boolean, default: false },
  variations: [FoodVariationSchema]
}, { timestamps: true })

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  foods: [FoodSchema]
}, { timestamps: true })

const OptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 }
})

const AddonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [String],
  quantityMinimum: { type: Number, default: 0 },
  quantityMaximum: { type: Number, default: 1 }
})

const OpeningTimeSchema = new mongoose.Schema({
  day: { type: String },
  times: [{
    startTime: String,
    endTime: String
  }]
})

const RestaurantSchema = new mongoose.Schema({
  orderId: { type: Number, default: 0 },
  orderPrefix: { type: String },
  name: { type: String, required: true },
  image: { type: String },
  logo: { type: String },
  address: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  deliveryBounds: {
    type: { type: String, default: 'Polygon' },
    coordinates: { type: [[[Number]]] }
  },
  categories: [CategorySchema],
  options: [OptionSchema],
  addons: [AddonSchema],
  username: { type: String, unique: true },
  password: { type: String },
  deliveryTime: { type: Number, default: 30 },
  minimumOrder: { type: Number, default: 0 },
  sections: [String],
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  openingTimes: [OpeningTimeSchema],
  slug: { type: String, unique: true, sparse: true },
  commissionRate: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  notificationToken: { type: String },
  enableNotification: { type: Boolean, default: true },
  shopType: { type: String, default: 'food' },
  cuisines: [String],
  keywords: [String],
  tags: [String],
  phone: { type: String },
  restaurantUrl: { type: String },
  stripeDetailsSubmitted: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  reviewCount: { type: Number, default: 0 },
  reviewAverage: { type: Number, default: 0 },
}, { timestamps: true })

RestaurantSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Restaurant', RestaurantSchema)
