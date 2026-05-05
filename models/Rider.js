const mongoose = require('mongoose')

const RiderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  phone: { type: String, unique: true, sparse: true },
  image: { type: String },
  available: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  notificationToken: { type: String },
  currentWalletAmount: { type: Number, default: 0 },
  totalWalletAmount: { type: Number, default: 0 },
  withdrawnWalletAmount: { type: Number, default: 0 },
  accountNumber: { type: String },
}, { timestamps: true })

RiderSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Rider', RiderSchema)
