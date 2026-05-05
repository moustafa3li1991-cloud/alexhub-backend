const mongoose = require('mongoose')

const ConfigurationSchema = new mongoose.Schema({
  currency: { type: String, default: 'EGP' },
  currencySymbol: { type: String, default: 'ج.م' },
  deliveryRate: { type: Number, default: 5 },
  twilioEnabled: { type: Boolean, default: false },
  androidClientID: { type: String },
  iOSClientID: { type: String },
  appAmplitudeApiKey: { type: String },
  googleApiKey: { type: String },
  expoClientID: { type: String },
  customerAppSentryUrl: { type: String },
  riderAppSentryUrl: { type: String },
  restaurantAppSentryUrl: { type: String },
  termsAndConditions: { type: String, default: 'https://alexhub.app/terms' },
  privacyPolicy: { type: String, default: 'https://alexhub.app/privacy' },
  testOtp: { type: String, default: '111111' },
  skipMobileVerification: { type: Boolean, default: true },
  skipEmailVerification: { type: Boolean, default: true },
  costType: { type: String, default: 'fixed' },
  password: { type: String },
  publishableKey: { type: String },
  secretKey: { type: String },
  googlePlacesApiBaseUrl: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Configuration', ConfigurationSchema)
