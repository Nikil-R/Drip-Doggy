import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/coupons`;

export interface CouponRequest {
  code: string;
  discountType: "percentage" | "flat" | "freeship";
  discountValue: number;
  minOrder: number;
  startingDate?: string; // YYYY-MM-DD
  expiryDate?: string;   // YYYY-MM-DD
  limit: number;
  isActive?: boolean;
  description?: string;
}

export interface CouponResponse {
  id: number;
  code: string;
  discountType: "percentage" | "flat" | "freeship";
  discountValue: number;
  minOrder: number;
  startingDate?: string;
  expiryDate?: string;
  limit: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
}

export const couponApi = {
  // Fetch all coupons
  fetchAllCoupons: async (token: string): Promise<CouponResponse[]> => {
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || [];
  },

  // Fetch coupon by ID
  fetchCouponById: async (id: number, token: string): Promise<CouponResponse> => {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Create new coupon
  createCoupon: async (coupon: CouponRequest, token: string): Promise<any> => {
    const response = await axios.post(BASE_URL, coupon, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update existing coupon
  updateCoupon: async (id: number, coupon: CouponRequest, token: string): Promise<any> => {
    const response = await axios.put(`${BASE_URL}/${id}`, coupon, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (id: number, token: string): Promise<any> => {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Toggle active status
  toggleCouponStatus: async (id: number, token: string): Promise<any> => {
    const response = await axios.patch(`${BASE_URL}/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
