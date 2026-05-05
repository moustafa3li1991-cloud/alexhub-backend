const mongoose = require('mongoose')

// Review Model
const ReviewSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  rating: { type: Number, min: 1, max: 5 },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Zone Model
const ZoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tax: { type: Number, default: 0 },
  location: {
    type: { type: String, default: 'Polygon' },
    coordinates: { type: [[[Number]]] }
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Cuisine Model
const CuisineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  shopType: { type: String, default: 'food' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Coupon Model
const CouponSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discount: { type: Number, required: true },
  enabled: { type: Boolean, default: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
}, { timestamps: true })

// Section Model (for homepage sections like "Trending", "New")
const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Offer Model
const OfferSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tag: { type: String },
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = {
  Review: mongoose.model('Review', ReviewSchema),
  Zone: mongoose.model('Zone', ZoneSchema),
  Cuisine: mongoose.model('Cuisine', CuisineSchema),
  Coupon: mongoose.model('Coupon', CouponSchema),
  Section: mongoose.model('Section', SectionSchema),
  Offer: mongoose.model('Offer', OfferSchema),
}
