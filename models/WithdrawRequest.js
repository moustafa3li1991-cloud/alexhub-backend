const mongoose = require('mongoose');

const WithdrawRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  userType: { type: String, enum: ['VENDOR', 'RIDER'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, enum: ['User', 'Rider'], required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }, // For vendors
  requestAmount: { type: Number, required: true },
  requestTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['PENDING', 'PAID', 'CANCELLED'], default: 'PENDING' },
  paymentDetails: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('WithdrawRequest', WithdrawRequestSchema);
