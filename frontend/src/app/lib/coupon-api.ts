import axios from "axios";
import { API_CONFIG } from "../utils/api-config";
import { getSessionToken } from "./auth-storage";

const BASE_URL = API_CONFIG.BASE_URL;

function getHeaders() {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface PublicCoupon {
  id: number;
  code: string;
  description?: string;
  discountType: "percentage" | "flat" | "freeship";
  discountValue: number;
  minOrder: number;
}

export interface CustomerCoupon {
  id: number;
  code: string;
  description?: string;
  discountType: "percentage" | "flat" | "freeship";
  discountValue: number;
  minOrder: number;
  expiryDate?: string;
}

export interface ValidateCouponRequest {
  code: string;
  orderAmount: number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  discountAmount?: number;
  discountType?: "percentage" | "flat" | "freeship";
  discountValue?: number;
  message?: string;
}

export const couponApi = {
  // Public: Fetch available coupons for display (home banners, checkout)
  fetchPublicCoupons: async (): Promise<PublicCoupon[]> => {
    const url = BASE_URL + API_CONFIG.ENDPOINTS.PUBLIC_COUPONS;
    const response = await axios.get<PublicCoupon[]>(url);
    return response.data || [];
  },

  // Authenticated: Fetch coupons available for the logged-in customer
  fetchCustomerCoupons: async (): Promise<CustomerCoupon[]> => {
    const url = BASE_URL + API_CONFIG.ENDPOINTS.CUSTOMER_COUPONS;
    const response = await axios.get<CustomerCoupon[]>(url, {
      headers: getHeaders()
    });
    return response.data?.data || response.data || [];
  },

  // Authenticated: Validate a coupon code against an order amount
  validateCoupon: async (code: string, orderAmount: number): Promise<ValidateCouponResponse> => {
    const url = BASE_URL + API_CONFIG.ENDPOINTS.VALIDATE_COUPON;
    const response = await axios.post<ValidateCouponResponse>(
      url,
      { code, orderAmount } as ValidateCouponRequest,
      { headers: getHeaders() }
    );
    return response.data;
  }
};
