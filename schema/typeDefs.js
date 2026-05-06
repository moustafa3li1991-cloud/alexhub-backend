const { gql } = require('graphql-tag')

const typeDefs = gql`
  scalar Date

  # ============================================================
  #  BASIC TYPES
  # ============================================================

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

  type User {
    _id: ID!
    unique_id: String
    name: String
    firstName: String
    lastName: String
    email: String
    phone: String
    phoneNumber: String
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
    image: String
    restaurants: [Restaurant]
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

  # ============================================================
  #  FOOD / MENU TYPES
  # ============================================================

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

  # ============================================================
  #  RESTAURANT TYPES
  # ============================================================

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
    bussinessDetails: String
    deliveryInfo: DeliveryInfo
    createdAt: String
    updatedAt: String
  }

  type DeliveryInfo {
    minDeliveryFee: Float
    deliveryDistance: Float
    deliveryFee: Float
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

  type RestaurantPaginated {
    data: [Restaurant]
    totalCount: Int
    currentPage: Int
    totalPages: Int
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

  # ============================================================
  #  ZONE / CUISINE / BANNER / SECTION / OFFER
  # ============================================================

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

  # ============================================================
  #  RIDER
  # ============================================================

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

  # ============================================================
  #  ORDER TYPES
  # ============================================================

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
    isPickedUp: Boolean
    review: Review
    zone: Zone
    isActive: Boolean
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

  # ============================================================
  #  REVIEW
  # ============================================================

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

  # ============================================================
  #  CONFIGURATION
  # ============================================================

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

  # ============================================================
  #  SHOP TYPE
  # ============================================================

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

  # ============================================================
  #  WITHDRAW REQUEST
  # ============================================================

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

  # ============================================================
  #  MISC TYPES
  # ============================================================

  type Result {
    result: Boolean
    success: Boolean
    message: String
    data: Restaurant
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

  # ============================================================
  #  CHAT TYPES
  # ============================================================

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

  # ============================================================
  #  DASHBOARD TYPES
  # ============================================================

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

  # ============================================================
  #  INPUTS
  # ============================================================

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

  # ============================================================
  #  QUERY - 33 resolvers (matched 1:1 from resolvers.js)
  # ============================================================

  type Query {
    # Profile (line 34-40)
    profile: User
    users: [User]
    user(id: ID!): User

    # Vendors (line 43-74)
    vendors: [User]
    getVendor(id: ID!): User

    # Riders (line 78-81)
    riders: [Rider]
    availableRiders: [Rider]
    ridersByZone(id: String!): [Rider]
    rider(id: String): Rider

    # Dashboard (line 84-111)
    getDashboardUsers: DashboardUsers
    getDashboardUsersByYear(year: Int): DashboardUsersByYear
    getDashboardOrdersByType: [DashboardStats]
    getDashboardSalesByType: [DashboardStats]

    # Extras (line 114-188)
    banners: [Banner]
    coupons: [Coupon]
    coupon(coupon: String!, restaurantId: ID!): CouponResult
    cuisines: [Cuisine]
    fetchShopTypes(filter: FetchShopTypeFilter, pagination: PaginationInput): ShopTypePaginated
    fetchShopTypeByUnique(dto: FetchUniqueShopTypeInput): ShopType
    withdrawRequests(userType: String, userId: String, pagination: PaginationInput, search: String): WithdrawRequestsResponse

    # Orders (line 191-263)
    allOrders(page: Int): [Order]
    allOrdersPaginated(page: Int, rows: Int, search: String): OrderPaginated
    allOrdersWithoutPagination: [Order]
    getActiveOrders(restaurantId: ID, page: Int, rowsPerPage: Int, search: String): OrderPaginated
    ordersByRestId(restaurant: String!, page: Int, rows: Int, search: String): [Order]
    ordersByRestIdWithoutPagination(restaurant: String!, search: String): [Order]
    order(id: String!): Order
    orders(offset: Int): [Order]

    # Restaurants (line 266-353)
    restaurant(id: String): Restaurant
    restaurants: [Restaurant]
    restaurantsPaginated(page: Int, limit: Int, search: String): RestaurantPaginated
    nearByRestaurants(latitude: Float, longitude: Float, shopType: String): NearbyRestaurants
    nearByRestaurantsPreview(latitude: Float, longitude: Float, shopType: String): NearbyRestaurantsPreview
    topRatedVendors(latitude: Float, longitude: Float): [Restaurant]
    topRatedVendorsPreview(latitude: Float, longitude: Float): [RestaurantPreview]

    # Config & Reviews (line 356-388)
    configuration: Configuration
    reviewsByRestaurant(restaurant: String!): ReviewsResult
    getCountryByIso(iso: String!): Country
  }

  # ============================================================
  #  MUTATION - 42+ resolvers (matched 1:1 from resolvers.js)
  # ============================================================

  type Mutation {
    # Auth (line 393-434)
    ownerLogin(email: String!, password: String!): OwnerAuthData

    # Auth (line 438-510)
    login(email: String, password: String, type: String!, appleId: String, name: String, notificationToken: String): AuthData
    createUser(phone: String, email: String, password: String, name: String, notificationToken: String, appleId: String, emailIsVerified: Boolean, isPhoneExists: Boolean): AuthData
    updateUser(name: String!, phone: String, phoneIsVerified: Boolean, emailIsVerified: Boolean): User

    # OTP (line 513-541)
    sendOtpToEmail(email: String!): Result
    sendOtpToPhoneNumber(phone: String!): Result
    verifyOtp(otp: String!, email: String, phone: String): Result

    # Password (line 544-567)
    forgotPassword(email: String!): Result
    resetPassword(password: String!, email: String!): Result
    changePassword(oldPassword: String!, newPassword: String!): Boolean

    # Address (line 570-604)
    createAddress(addressInput: AddressInput!): User
    editAddress(addressInput: AddressInput!): User
    deleteAddress(id: ID!): User
    deleteBulkAddresses(ids: [ID!]!): User
    selectAddress(id: String!): User

    # Orders (line 607-729)
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

    # User (line 733-773)
    addFavourite(id: String!): User
    updateNotificationStatus(offerNotification: Boolean!, orderNotification: Boolean!): User
    pushToken(token: String): User
    emailExist(email: String!): ExistUser
    phoneExist(phone: String!): ExistUser
    Deactivate(isActive: Boolean!, email: String!): User

    # Coupon mutation (line 776-780)
    coupon(coupon: String!, restaurantId: ID!): CouponResult

    # Chat (line 782-795)
    sendChatMessage(orderId: ID!, message: ChatMessageInput!): ChatResult

    # Activity (line 797)
    createActivity: Boolean

    # Admin Restaurant (line 800-842)
    createRestaurant(restaurant: RestaurantInput!, owner: ID!): Restaurant
    editRestaurant(restaurant: RestaurantInput!): Restaurant
    deleteRestaurant(id: ID!): Boolean
    hardDeleteRestaurant(id: ID!): Boolean
    updateRestaurantDelivery(id: ID!, minDeliveryFee: Float, deliveryDistance: Float, deliveryFee: Float): Result
    updateRestaurantBussinessDetails(id: ID!, bussinessDetails: String!): Result
    updateDeliveryBoundsAndLocation(id: ID!, location: LocationInput, bounds: [[[Float]]], boundType: String): Result

    # Admin Coupon (line 845-855)
    createCoupon(couponInput: CouponInput!): Coupon
    editCoupon(couponInput: CouponInput!): Coupon
    deleteCoupon(id: ID!): Boolean

    # Admin Order/Dispatch (line 858-910)
    updateStatus(id: ID!, orderStatus: String!): Order
    assignRider(id: ID!, riderId: ID!): Order

    # Admin Configuration (line 913-980)
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

    # Withdraw (line 949-964)
    saveStatusWithdrawRequest(id: ID!, status: String!, paymentDetails: String): WithdrawRequest
    createWithdrawRequest(userType: String!, userId: ID!, amount: Float!, restaurantId: ID): WithdrawRequest
  }

  # ============================================================
  #  SUBSCRIPTION - 4 resolvers (matched 1:1 from resolvers.js)
  # ============================================================

  type Subscription {
    subscriptionOrder(id: ID!): Order
    subscriptionRiderLocation(riderId: ID!): Rider
    orderStatusChanged(userId: ID!): Order
    subscriptionNewMessage(order: ID!): ChatMessage
  }
`

module.exports = typeDefs
