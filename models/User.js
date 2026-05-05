const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String },
  isActive: { type: Boolean, default: true },
  phoneIsVerified: { type: Boolean, default: false },
  emailIsVerified: { type: Boolean, default: false },
  notificationToken: { type: String },
  isOrderNotification: { type: Boolean, default: true },
  isOfferNotification: { type: Boolean, default: true },
  userType: { type: String, enum: ['default', 'google', 'apple', 'facebook'], default: 'default' },
  appleId: { type: String },
  googleId: { type: String },
  favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  addresses: [{
    label: { type: String },
    deliveryAddress: { type: String },
    details: { type: String },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    selected: { type: Boolean, default: false }
  }],
  otp: { type: String },
  otpExpiry: { type: Date },
}, { timestamps: true })

UserSchema.index({ 'addresses.location': '2dsphere' })

module.exports = mongoose.model('User', UserSchema)
