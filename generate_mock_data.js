const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

// Create Schemas just for seeding
const orderSchema = new mongoose.Schema({}, { strict: false, collection: 'orders' });
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const couponSchema = new mongoose.Schema({}, { strict: false, collection: 'coupons' });
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

const bannerSchema = new mongoose.Schema({}, { strict: false, collection: 'banners' });
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

const cuisineSchema = new mongoose.Schema({}, { strict: false, collection: 'cuisines' });
const Cuisine = mongoose.models.Cuisine || mongoose.model('Cuisine', cuisineSchema);

const shopTypeSchema = new mongoose.Schema({}, { strict: false, collection: 'shoptypes' });
const ShopType = mongoose.models.ShopType || mongoose.model('ShopType', shopTypeSchema);

async function seed() {
  try {
    // 1. Orders
    await Order.deleteMany({ orderId: { $regex: 'TEST-' } });
    await Order.create({
      orderId: 'TEST-1001',
      orderAmount: 250.50,
      paidAmount: 250.50,
      paymentMethod: 'CASH',
      orderStatus: 'PENDING',
      paymentStatus: 'PENDING',
      deliveryCharges: 20,
      tipping: 10,
      taxationAmount: 15,
      isPickedUp: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await Order.create({
      orderId: 'TEST-1002',
      orderAmount: 150.00,
      paidAmount: 150.00,
      paymentMethod: 'CARD',
      orderStatus: 'DELIVERED',
      paymentStatus: 'PAID',
      deliveryCharges: 15,
      tipping: 5,
      taxationAmount: 10,
      isPickedUp: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Orders seeded.');

    // 2. Coupons
    await Coupon.deleteMany({});
    await Coupon.create({
      title: 'WELCOME50',
      discount: 50,
      enabled: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30*24*60*60*1000), // 30 days
      lifeTimeActive: false
    });
    console.log('Coupons seeded.');

    // 3. Banners
    await Banner.deleteMany({});
    await Banner.create({
      title: 'New Year Offer',
      description: 'Get 50% off on your first order',
      action: 'NAVIGATE',
      screen: 'Home',
      file: 'https://via.placeholder.com/800x400',
      parameters: ''
    });
    console.log('Banners seeded.');

    // 4. Cuisines
    await Cuisine.deleteMany({});
    await Cuisine.create({
      name: 'Burger',
      description: 'Best burgers in town',
      image: 'https://via.placeholder.com/150',
      shopType: 'Food'
    });
    await Cuisine.create({
      name: 'Pizza',
      description: 'Italian pizza',
      image: 'https://via.placeholder.com/150',
      shopType: 'Food'
    });
    console.log('Cuisines seeded.');

    // 5. Shop Types
    await ShopType.deleteMany({});
    await ShopType.create({
      name: 'Food',
      image: 'https://via.placeholder.com/150',
      isActive: true
    });
    await ShopType.create({
      name: 'Grocery',
      image: 'https://via.placeholder.com/150',
      isActive: true
    });
    console.log('ShopTypes seeded.');

    console.log('Seeding completed perfectly!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
