const mongoose = require('mongoose')

const ConfigurationSchema = new mongoose.Schema({
  currency: { type: String, default: 'EGP' },
  currencySymbol: { type: String, default: 'ج.م' },
  deliveryRate: { type: Number, default: 5 },
  
  // Auth & Verification
  testOtp: { type: String, default: '111111' },
  skipMobileVerification: { type: Boolean, default: true },
  skipEmailVerification: { type: Boolean, default: true },
  skipWhatsAppOTP: { type: Boolean, default: true },
  
  // External APIs
  googleApiKey: { type: String },
  cloudinaryUploadUrl: { type: String },
  cloudinaryApiKey: { type: String },
  googlePlacesApiBaseUrl: { type: String },
  
  // Client IDs
  webClientID: { type: String },
  androidClientID: { type: String },
  iOSClientID: { type: String },
  expoClientID: { type: String },
  
  // Sentry
  dashboardSentryUrl: { type: String },
  webSentryUrl: { type: String },
  apiSentryUrl: { type: String },
  customerAppSentryUrl: { type: String },
  riderAppSentryUrl: { type: String },
  restaurantAppSentryUrl: { type: String },
  
  // Amplitude
  webAmplitudeApiKey: { type: String },
  appAmplitudeApiKey: { type: String },

  // Stripe
  publishableKey: { type: String },
  secretKey: { type: String },
  
  // Paypal
  clientId: { type: String },
  clientSecret: { type: String },
  sandbox: { type: Boolean, default: true },

  // Twilio
  twilioEnabled: { type: Boolean, default: false },
  twilioAccountSid: { type: String },
  twilioAuthToken: { type: String },
  twilioPhoneNumber: { type: String },
  twilioWhatsAppNumber: { type: String },

  // Email
  email: { type: String },
  emailName: { type: String },
  password: { type: String },
  enableEmail: { type: Boolean, default: false },
  formEmail: { type: String },
  
  // SendGrid
  sendGridApiKey: { type: String },
  sendGridEnabled: { type: Boolean, default: false },
  sendGridEmail: { type: String },
  sendGridEmailName: { type: String },
  sendGridPassword: { type: String },

  // Firebase
  firebaseKey: { type: String },
  authDomain: { type: String },
  projectId: { type: String },
  storageBucket: { type: String },
  msgSenderId: { type: String },
  appId: { type: String },
  measurementId: { type: String },
  vapidKey: { type: String },

  // Web Config
  googleMapLibraries: { type: String },
  googleColor: { type: String },
  
  // CMS
  termsAndConditions: { type: String, default: 'https://alexhub.app/terms' },
  privacyPolicy: { type: String, default: 'https://alexhub.app/privacy' },
  
  costType: { type: String, default: 'fixed' },
  isPaidVersion: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Configuration', ConfigurationSchema)
