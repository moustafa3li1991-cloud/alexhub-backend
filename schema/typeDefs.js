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
    unique_restaurant_id: String
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

  type Banner {
    _id: ID
    title: String
    description: String
    action: String
    screen: String
    file: String
    parameters: String
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
    vehicleType: String
    assigned: [String]
    zone: Zone
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
    zone: Zone
  }

  type OrderPaginated {
    totalCount: Int
    currentPage: Int
    totalPages: Int
    prevPage: Int
    nextPage: Int
    orders: [Order]
  }

  type Configuration {
    _id: ID
    email: String
    emailName: String
    password: String
    enableEmail: Boolean
    clientId: String
    clientSecret: String
    sandbox: Boolean
    publishableKey: String
    secretKey: String
    currency: String
    currencySymbol: String
    deliveryRate: Float
    twilioAccountSid: String
    twilioAuthToken: String
    twilioPhoneNumber: String
    twilioEnabled: Boolean
    skipWhatsAppOTP: Boolean
    twilioWhatsAppNumber: String
    formEmail: String
    sendGridApiKey: String
    sendGridEnabled: Boolean
    sendGridEmail: String
    sendGridEmailName: String
    sendGridPassword: String
    dashboardSentryUrl: String
    webSentryUrl: String
    apiSentryUrl: String
    customerAppSentryUrl: String
    restaurantAppSentryUrl: String
    riderAppSentryUrl: String
    googleApiKey: String
    cloudinaryUploadUrl: String
    cloudinaryApiKey: String
    webAmplitudeApiKey: String
    appAmplitudeApiKey: String
    webClientID: String
    androidClientID: String
    iOSClientID: String
    expoClientID: String
    googleMapLibraries: String
    googleColor: String
    termsAndConditions: String
    privacyPolicy: String
    testOtp: String
    firebaseKey: String
    authDomain: String
    projectId: String
    storageBucket: String
    msgSenderId: String
    appId: String
    measurementId: String
    isPaidVersion: Boolean
    skipEmailVerification: Boolean
    skipMobileVerification: Boolean
    costType: String
    vapidKey: String
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

  type DashboardUsers {
    usersCount: Int
    vendorsCount: Int
    restaurantsCount: Int
    ridersCount: Int
  }

  type DashboardPercentageChange {
    usersPercent: Float
    vendorsPercent: Float
    restaurantsPercent: Float
    ridersPercent: Float
  }

  type DashboardUsersByYear {
    usersCount: [Int]
    vendorsCount: [Int]
    restaurantsCount: [Int]
    ridersCount: [Int]
    percentageChange: DashboardPercentageChange
  }

  type DashboardChartData {
    value: Float
    label: String
  }

  type Vendor {
    unique_id: String
    _id: ID
    email: String
    userType: String
    isActive: Boolean
    name: String
    image: String
    restaurants: [Restaurant]
    firstName: String
    lastName: String
    phoneNumber: String
  }

  type RestaurantPaginated {
    data: [Restaurant]
    totalCount: Int
    currentPage: Int
    totalPages: Int
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

  input PaginationInput {
    pageNo: Int
    pageSize: Int
  }

  input FetchShopTypeFilter {
    isActive: Boolean
  }

  input FetchUniqueShopTypeInput {
    _id: ID
  }

  type PaginationResponse {
    total: Int
  }

  type WithdrawRequest {
    _id: ID
    requestId: String
    requestAmount: Float
    requestTime: String
    status: String
    createdAt: String
    rider: Rider
    store: Restaurant
  }

  type WithdrawRequestsResponse {
    message: String
    pagination: PaginationResponse
    data: [WithdrawRequest]
    success: Boolean
  }

  enum UserTypeEnum {
    VENDOR
    RIDER
  }

  type Query {
    # Dashboard Queries
    getDashboardUsers: DashboardUsers
    getDashboardUsersByYear(year: Int!): DashboardUsersByYear
    getDashboardOrdersByType: [DashboardChartData]
    getDashboardSalesByType: [DashboardChartData]

    profile: User
    users: [User]
    user(id: ID!): User
    
    vendors: [Vendor]
    getVendor(id: String!): Vendor
    
    restaurants: [Restaurant]
    restaurantsPaginated(page: Int, limit: Int, search: String): RestaurantPaginated
    
    riders: [Rider]
    availableRiders: [Rider]
    ridersByZone(id: String!): [Rider]

    order(id: String!): Order
    orders(offset: Int): [Order]
    allOrders(page: Int): [Order]
    allOrdersPaginated(page: Int, rows: Int, dateKeyword: String, starting_date: String, ending_date: String, orderStatus: [String], search: String): OrderPaginated
    allOrdersWithoutPagination(dateKeyword: String, starting_date: String, ending_date: String): [Order]
    getActiveOrders(restaurantId: ID, page: Int, rowsPerPage: Int, actions: [String], search: String): OrderPaginated
    ordersByRestId(restaurant: String!, page: Int, rows: Int, search: String): [Order]
    ordersByRestIdWithoutPagination(restaurant: String!, search: String): [Order]

    restaurant(id: String): Restaurant
    nearByRestaurants(latitude: Float, longitude: Float, shopType: String): NearbyRestaurants
    nearByRestaurantsPreview(latitude: Float, longitude: Float, shopType: String): NearbyRestaurantsPreview
    topRatedVendors(latitude: Float!, longitude: Float!): [Restaurant]
    topRatedVendorsPreview(latitude: Float!, longitude: Float!): [RestaurantPreview]
    cuisines: [Cuisine]
    banners: [Banner]
    coupons: [Coupon]
    fetchShopTypes(filter: FetchShopTypeFilter, pagination: PaginationInput): ShopTypePaginated
    fetchShopTypeByUnique(dto: FetchUniqueShopTypeInput): ShopType
    withdrawRequests(userType: UserTypeEnum, userId: String, pagination: PaginationInput, search: String): WithdrawRequestsResponse

    rider(id: String): Rider
    configuration: Configuration
    reviewsByRestaurant(restaurant: String!): ReviewsResult
    getCountryByIso(iso: String!): Country
    coupon(coupon: String!, restaurantId: ID!): CouponResult
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
    
    # User
    addFavourite(id: String!): User
    updateNotificationStatus(offerNotification: Boolean!, orderNotification: Boolean!): User
    pushToken(token: String): User
    
    # Check existence
    emailExist(email: String!): ExistUser
    phoneExist(phone: String!): ExistUser
    # Deactivate
    Deactivate(isActive: Boolean!, email: String!): User
    
    # Chat
    sendChatMessage(orderId: ID!, message: ChatMessageInput!): ChatResult
    
    # Activity
    createActivity(groupId: String!, module: String!, screenPath: String!, type: String!, details: String!): Boolean

    # === ADMIN RESTAURANT MUTATIONS ===
    createRestaurant(restaurant: RestaurantInput!, owner: ID!): Restaurant
    editRestaurant(restaurant: RestaurantProfileInput!): Restaurant
    deleteRestaurant(id: String!): Restaurant
    hardDeleteRestaurant(id: String!): Boolean
    updateRestaurantDelivery(id: ID!, minDeliveryFee: Float, deliveryDistance: Float, deliveryFee: Float): ResultWithData
    updateRestaurantBussinessDetails(id: String!, bussinessDetails: BussinessDetailsInput): ResultWithData
    updateDeliveryBoundsAndLocation(id: ID!, boundType: String!, bounds: [[[Float!]]], circleBounds: CircleBoundsInput, location: LocationInput!, address: String, postCode: String, city: String): ResultWithData

    # === ADMIN COUPON MUTATIONS ===
    createCoupon(couponInput: CouponInput!): Coupon
    editCoupon(couponInput: CouponInput!): Coupon
    deleteCoupon(id: String!): Boolean

    # === ADMIN ORDER/DISPATCH MUTATIONS ===
    updateStatus(id: String!, orderStatus: String!): Order
    assignRider(id: String!, riderId: String!): Order

    # === ADMIN CONFIGURATION MUTATIONS ===
    saveEmailConfiguration(configurationInput: EmailConfigurationInput!): Configuration
    saveFormEmailConfiguration(configurationInput: FormEmailConfigurationInput!): Configuration
    saveSendGridConfiguration(configurationInput: SendGridConfigurationInput!): Configuration
    saveFirebaseConfiguration(configurationInput: FirebaseConfigurationInput!): Configuration
    saveSentryConfiguration(configurationInput: SentryConfigurationInput!): Configuration
    saveGoogleApiKeyConfiguration(configurationInput: GoogleApiKeyConfigurationInput!): Configuration
    saveCloudinaryConfiguration(configurationInput: CloudinaryConfigurationInput!): Configuration
    saveAmplitudeApiKeyConfiguration(configurationInput: AmplitudeApiKeyConfigurationInput!): Configuration
    saveGoogleClientIDConfiguration(configurationInput: GoogleClientIDConfigurationInput!): Configuration
    saveWebConfiguration(configurationInput: WebConfigurationInput!): Configuration
    saveAppConfigurations(configurationInput: AppConfigurationsInput!): Configuration
    saveDeliveryRateConfiguration(configurationInput: DeliveryCostConfigurationInput!): Configuration
    savePaypalConfiguration(configurationInput: PaypalConfigurationInput!): Configuration
    saveStripeConfiguration(configurationInput: StripeConfigurationInput!): Configuration
    saveTwilioConfiguration(configurationInput: TwilioConfigurationInput!): Configuration
    saveVerificationsToggle(configurationInput: VerificationConfigurationInput!): Configuration
    saveCurrencyConfiguration(configurationInput: CurrencyConfigurationInput!): Configuration
    saveStatusWithdrawRequest(id: ID!, status: String!, paymentDetails: String): WithdrawRequest
    createWithdrawRequest(userType: String!, userId: ID!, amount: Float!, restaurantId: ID): WithdrawRequest
  }

  type ResultWithData {
    success: Boolean
    message: String
    data: Restaurant
  }

  input RestaurantInput {
    name: String!
    image: String
    username: String!
    password: String!
    orderPrefix: String
    phone: String
    address: String
    deliveryTime: Int
    minimumOrder: Float
    shopType: String
    location: LocationInput
    cuisines: [String]
  }

  input RestaurantProfileInput {
    _id: ID!
    name: String
    phone: String
    image: String
    logo: String
    slug: String
    address: String
    username: String
    password: String
    location: LocationInput
    isAvailable: Boolean
    minimumOrder: Float
    tax: Float
    openingTimes: [OpeningTimeInput]
    shopType: String
  }

  input OpeningTimeInput {
    day: String
    times: [TimeSlotInput]
  }

  input TimeSlotInput {
    startTime: String
    endTime: String
  }

  input BussinessDetailsInput {
    bankName: String
    accountName: String
    accountCode: String
    accountNumber: String
    bussinessRegNo: String
    companyRegNo: String
    taxRate: Float
  }

  input CircleBoundsInput {
    radius: Float
  }

  input CouponInput {
    _id: ID
    title: String
    discount: Float
    enabled: Boolean
    startDate: String
    endDate: String
    lifeTimeActive: Boolean
  }

  # Configuration Inputs
  input EmailConfigurationInput {
    email: String
    emailName: String
    password: String
    enableEmail: Boolean
  }
  input FormEmailConfigurationInput {
    formEmail: String
  }
  input SendGridConfigurationInput {
    sendGridApiKey: String
    sendGridEnabled: Boolean
    sendGridEmail: String
    sendGridEmailName: String
    sendGridPassword: String
  }
  input FirebaseConfigurationInput {
    firebaseKey: String
    authDomain: String
    projectId: String
    storageBucket: String
    msgSenderId: String
    appId: String
    measurementId: String
    vapidKey: String
  }
  input SentryConfigurationInput {
    dashboardSentryUrl: String
    webSentryUrl: String
    apiSentryUrl: String
    customerAppSentryUrl: String
    restaurantAppSentryUrl: String
    riderAppSentryUrl: String
  }
  input GoogleApiKeyConfigurationInput {
    googleApiKey: String
  }
  input CloudinaryConfigurationInput {
    cloudinaryUploadUrl: String
    cloudinaryApiKey: String
  }
  input AmplitudeApiKeyConfigurationInput {
    webAmplitudeApiKey: String
    appAmplitudeApiKey: String
  }
  input GoogleClientIDConfigurationInput {
    webClientID: String
    androidClientID: String
    iOSClientID: String
    expoClientID: String
  }
  input WebConfigurationInput {
    googleMapLibraries: String
    googleColor: String
  }
  input AppConfigurationsInput {
    termsAndConditions: String
    privacyPolicy: String
    testOtp: String
  }
  input DeliveryCostConfigurationInput {
    deliveryRate: Float
    costType: String
  }
  input PaypalConfigurationInput {
    clientId: String
    clientSecret: String
    sandbox: Boolean
  }
  input StripeConfigurationInput {
    publishableKey: String
    secretKey: String
  }
  input TwilioConfigurationInput {
    twilioAccountSid: String
    twilioAuthToken: String
    twilioPhoneNumber: String
    twilioEnabled: Boolean
    twilioWhatsAppNumber: String
  }
  input VerificationConfigurationInput {
    skipEmailVerification: Boolean
    skipMobileVerification: Boolean
    skipWhatsAppOTP: Boolean
  }
  input CurrencyConfigurationInput {
    currency: String
    currencySymbol: String
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
