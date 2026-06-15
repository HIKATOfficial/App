/* ==============================
   HI • KAT CONFIG FILE
   ============================== */

const CONFIG = {
  /* App Brand */
  APP_NAME: "HI • KAT",
  APP_TAGLINE: "Wear Your Story",

  /* Offer Text */
  SHIPPING_TEXT: "FREE SHIPPING on every product",

  /* Page Links */
  LOGIN_PAGE: "index.html",
  HOME_PAGE: "home.html",
  PRODUCTS_PAGE: "products.html",
  CART_PAGE: "cart.html",
  ORDERS_PAGE: "orders.html",
  PROFILE_PAGE: "profile.html",

  /* Theme Colors */
  COLORS: {
    PRIMARY: "#5B1A9C",
    ROYAL_PURPLE: "#6D28D9",
    DARK_PURPLE: "#3B0764",
    SOFT_PURPLE: "#F4ECFF",
    LIGHT_PURPLE: "#FAF5FF",
    GOLD: "#D4AF37",
    WHITE: "#FFFFFF",
    BLACK: "#111827",
    GRAY: "#6B7280",
    BORDER: "#E9D5FF",
    SUCCESS: "#16A34A",
    DANGER: "#DC2626",
    WARNING: "#F59E0B"
  },

  /* Fonts */
  FONTS: {
    LOGO: "'Playfair Display', serif",
    HEADING: "'Playfair Display', serif",
    BODY: "'Poppins', sans-serif"
  },

  /* Supabase */
  SUPABASE_URL: "PASTE_YOUR_SUPABASE_URL_HERE",
  SUPABASE_ANON_KEY: "PASTE_YOUR_SUPABASE_ANON_KEY_HERE",

  /* Cloudinary */
  CLOUDINARY_CLOUD_NAME: "PASTE_CLOUDINARY_CLOUD_NAME_HERE",
  CLOUDINARY_UPLOAD_PRESET: "PASTE_UPLOAD_PRESET_HERE",

  /* Razorpay */
  RAZORPAY_KEY_ID: "PASTE_RAZORPAY_KEY_ID_HERE",

  /* WhatsApp Seller Number */
  SELLER_WHATSAPP: "91XXXXXXXXXX",

  /* Product Rules */
  PRODUCT_ID_PREFIX: "DS",
  PRODUCT_ID_START: 1,
  PRODUCT_ID_END: 99999,
  PRODUCT_NAME_WORD_LIMIT: 4,
  PRODUCT_IMAGE_LIMIT: 4,

  /* Shipping */
  FREE_SHIPPING: true,
  SHIPPING_CHARGE: 0,

  /* Coupon Codes */
  COUPONS: {
    WELCOME: "WELCOME",
    SPECIAL: "SPECIAL"
  },

  /* Coupon Discount Options */
  DISCOUNT_OPTIONS: [5, 10, 15, 20],

  /* Order Status */
  ORDER_STATUS: [
    "Order Processing",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
    "Cancelled"
  ],

  /* Customer Labels */
  CUSTOMER_LABELS: [
    "New Customer",
    "Regular Customer",
    "VIP Customer",
    "Cart No Order",
    "Coupon Sent",
    "Stock Request",
    "High Buyer"
  ],

  /* Admin Analytics Tabs */
  ANALYTICS_TABS: [
    "Last 3 Days",
    "Last 7 Days",
    "Last Month"
  ],

  /* Local Storage Keys */
  STORAGE_KEYS: {
    USER_ID: "hikat_user_id",
    USER_NAME: "hikat_user_name",
    USER_PHONE: "hikat_user_phone",
    CART_COUNT: "hikat_cart_count",
    DEVICE_ID: "hikat_device_id"
  },

  /* Product Size Options */
  SIZES: [
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "Free Size",
    "Standard Size"
  ],

  /* Product Categories */
  CATEGORIES: [
    "All",
    "Sarees",
    "Kurtis",
    "Dresses",
    "Tops",
    "Lehenga",
    "Gown",
    "Kids",
    "Nighty",
    "Palazzo"
  ],

  /* Offer Types */
  OFFER_TYPES: [
    "Today Offer",
    "Flat Discount",
    "Big Day Sale",
    "Festival Offer"
  ],

  /* Messages */
  MESSAGES: {
    LOGIN_REQUIRED: "Please sign in first",
    NAME_REQUIRED: "Please enter your name",
    PHONE_REQUIRED: "Please enter your phone number",
    INVALID_PHONE: "Please enter a valid phone number",
    LOGIN_SUCCESS: "Welcome to HI • KAT",
    LOGOUT_SUCCESS: "Logged out successfully",
    SIZE_REQUIRED: "Please select a size",
    CART_ADDED: "Product added to cart",
    ADDRESS_REQUIRED: "Please fill all address details",
    PROFILE_UPDATED: "Profile updated successfully",
    ORDER_SUCCESS: "Order placed successfully"
  }
};

/* Make config global */
window.CONFIG = CONFIG;
