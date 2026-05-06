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
    status: String
    lastLogin: String
    notes: String
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

  type OwnerAuthData {
    userId: ID
    token: String
    email: String
    userType: String
    shopType: String
    permissions: [String]
    userTypeId: ID
    image: String
    name: String
    restaurants: [Restaurant]
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

  type Restaurant {
    _id: ID
    orderId: Int
    orderPrefix: String
    name: String
    image: String
    logo: String
    address: String
    location: Location
    deliveryBounds: Location
    categories: [Category]
    options: [Option]
    addons: [Addon]
    username: String
    deliveryTime: Int
    minimumOrder: Float
    tax: Float
    rating: Float
    isActive: Boolean
    isAvailable: Boolean
    notificationToken: String
    shopType: String
    cuisines: [String]
    keywords: [String]
    tags: [String]
    phone: String
    owner: User
    zone: Zone
    reviewCount: Int
    reviewAverage: Float
    createdAt: String
    updatedAt: String
  }

  type RestaurantPreview {
    _id: ID
    name: String
    image: String
    logo: String
    address: String
    location: Location
    rating: Float
    reviewCount: Int
    reviewAverage: Float
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

  type Zone {
    _id: ID
    title: String
    description: String
    tax: Float
    location: Location
    isActive: Boolean
  }

  type Cuisine {
    _id: ID
    name: String
    description: String
    image: String
    shopType: String
    isActive: Boolean
  }

  type Coupon {
    _id: ID
    title: String
    discount: Int
    enabled: Boolean
    restaurant: ID
  }

  type CouponResult {
    success: Boolean
    message: String
    coupon: Coupon
  }

  type Banner {
    _id: ID
    title: String
    description: String
    action: String
    screen: String
    file: String
    parameters: String
  }

  type Section {
    _id: ID
    name: String
    restaurants: [String]
  }

  type Offer {
    _id: ID
    name: String
    tag: String
    restaurants: [String]
  }

  type Rider {
    _id: ID
    name: String
    username: String
    phone: String
    available: Boolean
    isActive: Boolean
    location: Location
    zone: Zone
    notificationToken: String
  }

  type OrderItem {
    _id: ID
    title: String
    food: ID
    quantity: Int
    variation: FoodVariation
    addons: [OrderItemAddon]
    specialInstructions: String
  }

  type OrderItemAddon {
    _id: ID
    title: String
    options: [OrderItemOption]
  }

  type OrderItemOption {
    _id: ID
    title: String
    price: Float
  }

  type Order {
    _id: ID
    orderId: String
    restaurant: Restaurant
    user: User
    rider: Rider
    items: [OrderItem]
    deliveryAddress: Address
    paymentMethod: String
    paidAmount: Float
    orderAmount: Float
    orderStatus: String
    paymentStatus: String
    tipping: Float
    taxationAmount: Float
    deliveryCharges: Float
    discountAmount: Float
    instructions: String
    orderDate: String
    expectedTime: String
    acceptedAt: String
    pickedAt: String
    deliveredAt: String
    cancelledAt: String
    assignedAt: String
    review: Review
    zone: Zone
    createdAt: String
  }

  type OrderPaginated {
    totalCount: Int
    orders: [Order]
    currentPage: Int
    totalPages: Int
    prevPage: Int
    nextPage: Int
  }

  type Review {
    _id: ID
    order: Order
    restaurant: Restaurant
    rating: Int
    description: String
    createdAt: String
  }

  type ReviewsResult {
    reviews: [Review]
    ratings: Float
    total: Int
  }

  type Configuration {
    _id: ID
    currency: String
    currencySymbol: String
    deliveryRate: Float
    googleApiKey: String
    termsAndConditions: String
    privacyPolicy: String
    testOtp: String
    isPaidVersion: Boolean
    skipMobileVerification: Boolean
    skipEmailVerification: Boolean
    skipWhatsAppOTP: Boolean
    cloudinaryUploadUrl: String
    cloudinaryApiKey: String
    googlePlacesApiBaseUrl: String
    webClientID: String
    androidClientID: String
    iOSClientID: String
    expoClientID: String
    firebaseKey: String
    authDomain: String
    projectId: String
    storageBucket: String
    msgSenderId: String
    appId: String
    measurementId: String
    vapidKey: String
  }

  type ShopType {
    _id: ID
    name: String
    image: String
    isActive: Boolean
  }

  type ShopTypePaginated {
    data: [ShopType]
    total: Int
    page: Int
    pageSize: Int
    totalPages: Int
    hasNextPage: Boolean
    hasPrevPage: Boolean
  }

  type WithdrawRequest {
    _id: ID
    requestId: String
    userType: String
    user: User
    userModel: String
    restaurant: Restaurant
    requestAmount: Float
    status: String
    paymentDetails: String
    createdAt: String
  }

  type WithdrawRequestsResponse {
    data: [WithdrawRequest]
    success: Boolean
    message: String
    pagination: Pagination
  }

  type Pagination {
    total: Int
  }

  type Result {
    result: Boolean
  }

  type ExistUser {
    _id: ID
    email: String
    phone: String
    userType: String
  }

  type Country {
    cities: [City]
  }

  type City {
    id: ID
    name: String
    latitude: Float
    longitude: Float
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

  type DashboardUsers {
    usersCount: Int
    vendorsCount: Int
    restaurantsCount: Int
    ridersCount: Int
  }

  type DashboardUsersByYear {
    usersCount: [Int]
    vendorsCount: [Int]
    restaurantsCount: [Int]
    ridersCount: [Int]
    percentageChange: DashboardPercentageChange
  }

  type DashboardPercentageChange {
    usersPercent: Float
    vendorsPercent: Float
    restaurantsPercent: Float
    ridersPercent: Float
  }

  type DashboardStats {
    label: String
    value: Int
  }

  input OrderInput {
    food: ID!
    quantity: Int!
    variation: ID!
    addons: [ID]
    specialInstructions: String
  }

  input ReviewInput {
    order: ID!
    rating: Int!
    description: String
  }

  input PaginationInput {
    pageNo: Int
    pageSize: Int
  }

  input FetchShopTypeFilter {
    isActive: Boolean
  }

  input FetchUniqueShopTypeInput {
    _id: ID!
  }

  input ChatMessageInput {
    message: String!
    user: ChatUserInput!
  }

  input ChatUserInput {
    id: ID!
    name: String!
  }

  input RestaurantInput {
    _id: ID
    name: String
    image: String
    logo: String
    address: String
    location: LocationInput
    username: String
    deliveryTime: Int
    minimumOrder: Float
    tax: Float
    isActive: Boolean
    shopType: String
  }

  input CouponInput {
    _id: ID
    title: String
    discount: Int
    enabled: Boolean
    restaurant: ID
  }

  input ConfigurationInput {
    currency: String
    currencySymbol: String
    deliveryRate: Float
    googleApiKey: String
    testOtp: String
    skipMobileVerification: Boolean
    skipEmailVerification: Boolean
    skipWhatsAppOTP: Boolean
    firebaseKey: String
    authDomain: String
    projectId: String
    storageBucket: String
    msgSenderId: String
    appId: String
    measurementId: String
    vapidKey: String
  }

  type Query {
    # Profile
    profile: User
    users: [User]
    user(id: ID!): User
    
    # Dashboard
    vendors: [User]
    getVendor(id: ID!): User
    getDashboardUsers: DashboardUsers
    getDashboardUsersByYear(year: Int): DashboardUsersByYear
    getDashboardOrdersByType: [DashboardStats]
    getDashboardSalesByType: [DashboardStats]
    
    # Riders
    riders: [Rider]
    availableRiders: [Rider]
    ridersByZone(id: String!): [Rider]

    # Orders
    order(id: String!): Order
    orders(offset: Int): [Order]
    allOrders(page: Int): [Order]
    allOrdersPaginated(page: Int, rows: Int, search: String): OrderPaginated
    allOrdersWithoutPagination: [Order]
    getActiveOrders(restaurantId: ID, page: Int, rowsPerPage: Int, search: String): OrderPaginated
    ordersByRestId(restaurant: String!, page: Int, rows: Int, search: String): [Order]
    ordersByRestIdWithoutPagination(restaurant: String!, search: String): [Order]

    # Restaurants
    restaurant(id: String): Restaurant
    restaurants: [Restaurant]
    restaurantsPaginated(page: Int, limit: Int, search: String): RestaurantPaginated
    nearByRestaurants(latitude: Float, longitude: Float, shopType: String): NearbyRestaurants
    nearByRestaurantsPreview(latitude: Float, longitude: Float, shopType: String): NearbyRestaurantsPreview
    topRatedVendors(latitude: Float, longitude: Float): [Restaurant]
    topRatedVendorsPreview(latitude: Float, longitude: Float): [RestaurantPreview]
    
    # Extra
    banners: [Banner]
    coupons: [Coupon]
    coupon(coupon: String!, restaurantId: ID!): CouponResult
    cuisines: [Cuisine]
    fetchShopTypes(filter: FetchShopTypeFilter, pagination: PaginationInput): ShopTypePaginated
    fetchShopTypeByUnique(dto: FetchUniqueShopTypeInput): ShopType
    withdrawRequests(userType: String, userId: String, pagination: PaginationInput, search: String): WithdrawRequestsResponse
    
    rider(id: String): Rider
    configuration: Configuration
    reviewsByRestaurant(restaurant: String!): ReviewsResult
    getCountryByIso(iso: String!): Country
  }

  type Mutation {
    # Auth
    ownerLogin(email: String!, password: String!): OwnerAuthData
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
    updateStatus(id: ID!, orderStatus: String!): Order
    assignRider(id: ID!, riderId: ID!): Order
    
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
    createCoupon(couponInput: CouponInput!): Coupon
    editCoupon(couponInput: CouponInput!): Coupon
    deleteCoupon(id: ID!): Boolean
    
    # Chat
    sendChatMessage(orderId: ID!, message: ChatMessageInput!): ChatResult
    
    # Activity
    createActivity: Boolean

    # Admin Operations
    createRestaurant(restaurant: RestaurantInput!, owner: ID!): Restaurant
    editRestaurant(restaurant: RestaurantInput!): Restaurant
    deleteRestaurant(id: ID!): Boolean
    hardDeleteRestaurant(id: ID!): Boolean
    updateRestaurantDelivery(id: ID!, minDeliveryFee: Float, deliveryDistance: Float, deliveryFee: Float): Result
    updateRestaurantBussinessDetails(id: ID!, bussinessDetails: String!): Result
    updateDeliveryBoundsAndLocation(id: ID!, location: LocationInput, bounds: [[[Float]]], boundType: String): Result
    
    # Configurations
    saveEmailConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveFormEmailConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveSendGridConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveFirebaseConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveSentryConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveGoogleApiKeyConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveCloudinaryConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveAmplitudeApiKeyConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveGoogleClientIDConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveWebConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveAppConfigurations(configurationInput: ConfigurationInput!): Configuration
    saveDeliveryRateConfiguration(configurationInput: ConfigurationInput!): Configuration
    savePaypalConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveStripeConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveTwilioConfiguration(configurationInput: ConfigurationInput!): Configuration
    saveVerificationsToggle(configurationInput: ConfigurationInput!): Configuration
    saveCurrencyConfiguration(configurationInput: ConfigurationInput!): Configuration
    
    # Withdraws
    saveStatusWithdrawRequest(id: ID!, status: String!, paymentDetails: String): WithdrawRequest
    createWithdrawRequest(userType: String!, userId: ID!, amount: Float!, restaurantId: ID): WithdrawRequest
  }

  type Subscription {
    subscriptionOrder(id: ID!): Order
    subscriptionRiderLocation(riderId: ID!): Rider
    orderStatusChanged(userId: ID!): Order
    subscriptionNewMessage(order: ID!): ChatMessage
  }
`

module.exports = typeDefs
