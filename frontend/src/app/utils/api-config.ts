export const API_CONFIG = {
  BASE_URL: "",
  ENDPOINTS: {
    SEND_OTP: "/dripdoggy/api/auth/send-otp",
    VERIFY_OTP: "/dripdoggy/api/auth/verify-otp",
    LOGOUT: "/dripdoggy/api/auth/logout",
    REGISTER: "/dripdoggy/api/auth/register",
    CATEGORIES: "/dripdoggy/api/public/categories",
    CATEGORY_BY_ID: "/dripdoggy/api/public/categories",
    SUBCATEGORIES: "/dripdoggy/api/public/subcategories",
    SUBCATEGORY_BY_ID: "/dripdoggy/api/public/subcategories",
    PUBLIC_COUPONS: "/dripdoggy/api/public/coupons",
    CUSTOMER_COUPONS: "/dripdoggy/api/customer/coupons",
    VALIDATE_COUPON: "/dripdoggy/api/customer/coupons/validate",
    ORDERS_SEND_OTP: "/dripdoggy/api/customer/orders/send-otp",
    ORDERS_VERIFY_OTP: "/dripdoggy/api/customer/orders/verify-otp",
    ORDERS_PREVIEW: "/dripdoggy/api/customer/orders/preview",
    ORDERS_PLACE: "/dripdoggy/api/customer/orders"
  }
};
