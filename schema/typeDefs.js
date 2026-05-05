const { gql } = require('graphql-tag')

const typeDefs = gql`
  scalar Date

  type Location {
    coordinates: [Float]
  }

  type Address {
    _id: ID
    id: ID
    label: String
    deliveryAddress: String
    details: String
    location: Location
    selected: Boolean
  }

  input AddressInput {
    _id: ID
    label: String
    deliveryAddress: String
    details: String
    location: LocationInput
    selected: Boolean
  }

  input LocationInput {
    coordinates: [Float]
  }

  type User {
    _id: ID!
    name: String
    email: String
    phone: String
    phoneIsVerified: Boolean
    emailIsVerified: Boolean
    notificationToken: String
    isActive: Boolean
    isOrderNotification: Boolean
    isOfferNotification: Boolean
    addresses: [Address]
    favourite: [ID]
    userType: String
    password: String
    createdAt: String
    updatedAt: String
  }

  type AuthData {
    userId: ID
    token: String
    tokenExpiration: Int
    isActive: Boolean
    name: String
    email: String
    phone: String
    isNewUser: Boolean
  }

  type FoodVariation {
    _id: ID
    title: String
    price: Float
    discounted: Float
    addons: [String]
  }

  type Food {
    _id: ID
    title: String
    description: String
    image: String
    subCategory: String
    isActive: Boolean
    isOutOfStock: Boolean
    variations: [FoodVariation]
    createdAt: String
    updatedAt: String
  }

  type Category {
    _id: ID
    title: String
    foods: [Food]
    createdAt: String
    updatedAt: String
  }

  type Option {
    _id: ID
    title: String
    description: String
    price: Float
  }

  type Addon {
    _id: ID
    title: String
    description: String
    options: [String]
    quantityMinimum: Int
    quantityMaximum: Int
  }

  type OpeningTime {
    day: String
    times: [TimeSlot]
  }

  type TimeSlot {
    startTime: String
    endTime: String
  }

  type ReviewData {
    reviews: [Review]
    ratings: Float
    total: Int
  }

  type Restaurant {
    _id: ID!
    orderId: Int
    orderPrefix: String
    name: String!
    image: String
    logo: String
    address: String
    location: Location
    categories: [Category]
    options: [Option]
    addons: [Addon]
    username: String
    password: String
    deliveryTime: Int
    minimumOrder: Float
    sections: [String]
    rating: Float
    isActive: Boolean
    isAvailable: Boolean
    openingTimes: [OpeningTime]
    slug: String
    commissionRate: Float
    tax: Float
    notificationToken: String
    enableNotification: Boolean
    shopType: String
    cuisines: [String]
    keywords: [String]
    tags: [String]
    phone: String
    restaurantUrl: String
    stripeDetailsSubmitted: Boolean
    owner: User
    zone: Zone
    reviewData: ReviewData
    reviewCount: Int
    reviewAverage: Float
    distanceWithCurrentLocation: Float
    freeDelivery: Boolean
    acceptVouchers: Boolean
    deliveryBounds: Location
    createdAt: String
    updatedAt: String
  }

  type RestaurantPreview {
    _id: ID!
    orderId: Int
    orderPrefix: String
    name: String
    image: String
    logo: String
    address: String
    location: Location
    username: String
    password: String
    deliveryTime: Int
    minimumOrder: Float
    sections: [String]
    rating: Float
    isActive: Boolean
    isAvailable: Boolean
    openingTimes: [OpeningTime]
    slug: String
    commissionRate: Float
    tax: Float
    notificationToken: String
    enableNotification: Boolean
    shopType: String
    cuisines: [String]
    keywords: [String]
    tags: [String]
    reviewCount: Int
    reviewAverage: Float
    distanceWithCurrentLocation: Float
    freeDelivery: Boolean
    acceptVouchers: Boolean
  }

  type NearbyRestaurants {
    offers: [Offer]
    sections: [Section]
    restaurants: [Restaurant]
  }

  type NearbyRestaurantsPreview {
    offers: [Offer]
    sections: [Section]
    restaurants: [RestaurantPreview]
  }

  type Offer {
    _id: ID
    name: String
    tag: String
    restaurants: [String]
  }

  type Section {
    _id: ID
    name: String
    restaurants: [String]
  }

  type Cuisine {
    _id: ID
    name: String
    description: String
    image: String
    shopType: String
  }

  type Zone {
    _id: ID
    title: String
    description: String
    tax: Float
    location: Location
    isActive: Boolean
  }

  type OrderItem {
    _id: ID
    id: ID
    title: String
    food: ID
    description: String
    image: String
    quantity: Int
    variation: OrderVariation
    addons: [OrderAddon]
    specialInstructions: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  type OrderVariation {
    _id: ID
    id: ID
    title: String
    price: Float
    discounted: Float
  }

  type OrderAddon {
    _id: ID
    id: ID
    title: String
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
    options: [OrderOption]
  }

  type OrderOption {
    _id: ID
    id: ID
    title: String
    description: String
    price: Float
  }

  type Review {
    _id: ID
    order: Order
    restaurant: Restaurant
    rating: Int
    description: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  type ReviewsResult {
    reviews: [Review]
    ratings: Float
    total: Int
  }

  type Rider {
    _id: ID
    name: String
    email: String
    username: String
    password: String
    phone: String
    image: String
    available: Boolean
    isActive: Boolean
    location: Location
    currentWalletAmount: Float
    totalWalletAmount: Float
    withdrawnWalletAmount: Float
    accountNumber: String
    createdAt: String
    updatedAt: String
  }

  type Order {
    _id: ID!
    orderId: String
    id: ID
    restaurant: Restaurant
    user: User
    rider: Rider
    items: [OrderItem]
    deliveryAddress: Address
    paymentMethod: String
    paidAmount: Float
    orderAmount: Float!
    orderStatus: String
    paymentStatus: String
    status: String
    tipping: Float
    taxationAmount: Float
    deliveryCharges: Float
    discountAmount: Float
    instructions: String
    reason: String
    isActive: Boolean
    isPickedUp: Boolean
    completionTime: Int
    preparationTime: Int
    orderDate: String
    expectedTime: String
    acceptedAt: String
    pickedAt: String
    deliveredAt: String
    cancelledAt: String
    assignedAt: String
    isRinged: Boolean
    isRiderRinged: Boolean
    review: Review
    createdAt: String
    updatedAt: String
  }

  type Configuration {
    _id: ID
    currency: String
    currencySymbol: String
    deliveryRate: Float
    twilioEnabled: Boolean
    androidClientID: String
    iOSClientID: String
    appAmplitudeApiKey: String
    googleApiKey: String
    expoClientID: String
    customerAppSentryUrl: String
    termsAndConditions: String
    privacyPolicy: String
    testOtp: String
    skipMobileVerification: Boolean
    skipEmailVerification: Boolean
    costType: String
    password: String
    publishableKey: String
    secretKey: String
    googlePlacesApiBaseUrl: String
  }

  type Coupon {
    _id: ID
    title: String
    discount: Float
    enabled: Boolean
  }

  type CouponResult {
    coupon: Coupon
    message: String
    success: Boolean
  }

  type Result {
    result: Boolean
  }

  type ExistUser {
    userType: String
    _id: ID
    email: String
    phone: String
  }

  type ChatMessage {
    id: ID
    message: String
    user: ChatUser
    createdAt: String
  }

  type ChatUser {
    id: ID
    name: String
  }

  type ChatResult {
    success: Boolean
    message: String
    data: ChatMessage
  }

  type City {
    id: ID
    name: String
    latitude: Float
    longitude: Float
  }

  type Country {
    cities: [City]
  }

  type OrderStatusPayload {
    userId: String
    origin: String
    order: Order
  }

  input OrderInput {
    food: String
    quantity: Int
    variation: ID
    addons: [String]
    specialInstructions: String
  }

  input ChatMessageInput {
    message: String
    user: ChatUserInput
  }

  input ChatUserInput {
    id: ID
    name: String
  }

  type Query {
    profile: User
    users: [User]
    order(id: String!): Order
    orders(offset: Int): [Order]
    restaurant(id: String): Restaurant
    nearByRestaurants(latitude: Float, longitude: Float, shopType: String): NearbyRestaurants
    nearByRestaurantsPreview(latitude: Float, longitude: Float, shopType: String): NearbyRestaurantsPreview
    topRatedVendors(latitude: Float!, longitude: Float!): [Restaurant]
    topRatedVendorsPreview(latitude: Float!, longitude: Float!): [RestaurantPreview]
    cuisines: [Cuisine]
    rider(id: String): Rider
    configuration: Configuration
    reviewsByRestaurant(restaurant: String!): ReviewsResult
    getCountryByIso(iso: String!): Country
  }

  type Mutation {
    # Auth
    login(email: String, password: String, type: String!, appleId: String, name: String, notificationToken: String): AuthData
    createUser(phone: String, email: String, password: String, name: String, notificationToken: String, appleId: String, emailIsVerified: Boolean, isPhoneExists: Boolean): AuthData
    updateUser(name: String!, phone: String, phoneIsVerified: Boolean, emailIsVerified: Boolean): User
    
    # OTP
    sendOtpToEmail(email: String!): Result
    sendOtpToPhoneNumber(phone: String!): Result
    verifyOtp(otp: String!, email: String, phone: String): Result
    
    # Password
    forgotPassword(email: String!): Result
    resetPassword(password: String!, email: String!): Result
    changePassword(oldPassword: String!, newPassword: String!): Boolean
    
    # Address
    createAddress(addressInput: AddressInput!): User
    editAddress(addressInput: AddressInput!): User
    deleteAddress(id: ID!): User
    deleteBulkAddresses(ids: [ID!]!): User
    selectAddress(id: String!): User
    
    # Orders
    placeOrder(
      restaurant: String!
      orderInput: [OrderInput!]!
      paymentMethod: String!
      couponCode: String
      tipping: Float!
      taxationAmount: Float!
      address: AddressInput!
      orderDate: String!
      isPickedUp: Boolean!
      deliveryCharges: Float!
      instructions: String
    ): Order
    
    abortOrder(id: String!): Order
    reviewOrder(reviewInput: ReviewInput!): Order
    
    # User
    addFavourite(id: String!): User
    updateNotificationStatus(offerNotification: Boolean!, orderNotification: Boolean!): User
    pushToken(token: String): User
    
    # Check existence
    emailExist(email: String!): ExistUser
    phoneExist(phone: String!): ExistUser
    Deactivate(isActive: Boolean!, email: String!): User
    
    # Coupon
    coupon(coupon: String!, restaurantId: ID!): CouponResult
    
    # Chat
    sendChatMessage(orderId: ID!, message: ChatMessageInput!): ChatResult
    
    # Activity
    createActivity(groupId: String!, module: String!, screenPath: String!, type: String!, details: String!): Boolean
  }

  input ReviewInput {
    order: String!
    rating: Int!
    description: String
  }

  type Subscription {
    subscriptionOrder(id: String!): Order
    subscriptionRiderLocation(riderId: String!): Rider
    orderStatusChanged(userId: String!): OrderStatusPayload
    subscriptionNewMessage(order: ID!): ChatMessage
  }
`

module.exports = typeDefs
