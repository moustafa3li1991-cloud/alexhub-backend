require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Rider = require('../models/Rider')
const Configuration = require('../models/Configuration')
const { Zone, Cuisine, Section, Offer } = require('../models/index')

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  // Clear existing
  await Promise.all([
    Configuration.deleteMany({}),
    Cuisine.deleteMany({}),
    Zone.deleteMany({}),
    Section.deleteMany({}),
    Offer.deleteMany({}),
  ])

  // === CONFIGURATION ===
  await Configuration.create({
    currency: 'EGP',
    currencySymbol: 'ج.م',
    deliveryRate: 10,
    testOtp: '111111',
    skipMobileVerification: true,
    skipEmailVerification: true,
    termsAndConditions: 'https://alexhub.app/terms',
    privacyPolicy: 'https://alexhub.app/privacy',
    costType: 'fixed',
  })
  console.log('✅ Configuration seeded')

  // === ZONE ===
  const zone = await Zone.create({
    title: 'الإسكندرية',
    description: 'منطقة الإسكندرية',
    tax: 14,
    isActive: true,
    location: {
      type: 'Polygon',
      coordinates: [[[29.9, 31.1], [29.9, 31.3], [30.1, 31.3], [30.1, 31.1], [29.9, 31.1]]]
    }
  })
  console.log('✅ Zone seeded')

  // === CUISINES ===
  await Cuisine.insertMany([
    { name: 'مأكولات مصرية', description: 'أشهى الأكلات المصرية', shopType: 'food' },
    { name: 'وجبات سريعة', description: 'بيتزا، برجر، وأكتر', shopType: 'food' },
    { name: 'مشويات', description: 'مشاوي طازجة', shopType: 'food' },
    { name: 'سوبر ماركت', description: 'كل احتياجاتك', shopType: 'grocery' },
    { name: 'صيدليات', description: 'أدوية ومستلزمات', shopType: 'pharmacy' },
  ])
  console.log('✅ Cuisines seeded')

  // === TEST RESTAURANT ===
  const existingRestaurant = await Restaurant.findOne({ username: 'alexhub_demo' })
  if (!existingRestaurant) {
    await Restaurant.create({
      name: 'مطعم AlexHub Demo',
      address: 'الإسكندرية، مصر',
      location: { type: 'Point', coordinates: [29.9187, 31.2001] },
      username: 'alexhub_demo',
      password: await bcrypt.hash('demo123', 12),
      deliveryTime: 30,
      minimumOrder: 50,
      shopType: 'food',
      isActive: true,
      isAvailable: true,
      rating: 4.5,
      zone: zone._id,
      cuisines: ['مأكولات مصرية'],
      categories: [
        {
          title: 'الوجبات الرئيسية',
          foods: [
            {
              title: 'كشري',
              description: 'كشري مصري أصيل',
              variations: [
                { title: 'صغير', price: 25, discounted: 0 },
                { title: 'وسط', price: 35, discounted: 0 },
                { title: 'كبير', price: 45, discounted: 0 },
              ]
            },
            {
              title: 'فول وطعمية',
              description: 'فطور مصري أصيل',
              variations: [{ title: 'عادي', price: 30, discounted: 0 }]
            },
          ]
        }
      ]
    })
    console.log('✅ Demo restaurant seeded')
  }

  // === SECTIONS ===
  const restaurant = await Restaurant.findOne({ username: 'alexhub_demo' })
  await Section.create({ name: 'الأكثر طلباً', restaurants: [restaurant._id], isActive: true })
  await Offer.create({ name: 'عروض اليوم', tag: 'OFFER', restaurants: [restaurant._id], isActive: true })
  console.log('✅ Sections & Offers seeded')

  // === TEST USER ===
  const existingUser = await User.findOne({ email: 'test@alexhub.app' })
  if (!existingUser) {
    await User.create({
      name: 'مستخدم تجريبي',
      email: 'test@alexhub.app',
      password: await bcrypt.hash('test123', 12),
      phone: '+201000000000',
      isActive: true,
      phoneIsVerified: true,
      emailIsVerified: true,
    })
    console.log('✅ Test user seeded: test@alexhub.app / test123')
  }

  console.log('\n🎉 Seed completed successfully!')
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed error:', err)
  process.exit(1)
})
