const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
  title: String,
  food: { type: mongoose.Schema.Types.ObjectId },
  description: String,
  image: String,
  quantity: { type: Number, default: 1 },
  variation: {
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    price: Number,
    discounted: Number
  },
  addons: [{
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    quantityMinimum: Number,
    quantityMaximum: Number,
    options: [{
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      description: String,
      price: Number
    }]
  }],
  specialInstructions: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const OrderSchema = new mongoose.Schema({
  orderId: { type: String },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
  items: [OrderItemSchema],
  deliveryAddress: {
    label: String,
    deliveryAddress: String,
    details: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  paymentMethod: { type: String, enum: ['COD', 'CARD', 'WALLET'], default: 'COD' },
  paidAmount: { type: Number, default: 0 },
  orderAmount: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentStatus: { type: String, enum: ['UNPAID', 'PAID'], default: 'UNPAID' },
  tipping: { type: Number, default: 0 },
  taxationAmount: { type: Number, default: 0 },
  deliveryCharges: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  instructions: { type: String },
  reason: { type: String },
  isActive: { type: Boolean, default: true },
  isPickedUp: { type: Boolean, default: false },
  completionTime: { type: Number },
  preparationTime: { type: Number, default: 20 },
  orderDate: { type: Date, default: Date.now },
  expectedTime: { type: Date },
  acceptedAt: { type: Date },
  pickedAt: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  assignedAt: { type: Date },
  isRinged: { type: Boolean, default: false },
  isRiderRinged: { type: Boolean, default: false },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
}, { timestamps: true })

// Auto-generate orderId
OrderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderId = `AH-${String(count + 1).padStart(6, '0')}`
  }
  next()
})

module.exports = mongoose.model('Order', OrderSchema)
