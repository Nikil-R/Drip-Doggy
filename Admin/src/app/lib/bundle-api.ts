import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/bundles`;

export interface BundleRequest {
  title: string;
  mainProductVariantId: number;
  discountType: "PERCENTAGE" | "FLAT" | "FREE_SHIPPING";
  discountValue: number;
  productVariantIds: number[];
  isActive?: boolean;
}

export interface ProductVariantSizeResponse {
  id: number;
  sizeName: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface BundleVariantResponse {
  variantId: number;
  variantName: string;
  productId: number;
  productName: string;
  primaryImageUrl: string;
  price: number;
  mrp: number;
  sizes: ProductVariantSizeResponse[];
}

export interface BundleResponse {
  id: number;
  title: string;
  mainProductVariantId: number;
  discountType: "PERCENTAGE" | "FLAT" | "FREE_SHIPPING";
  discountValue: number;
  originalTotal: number;
  bundlePrice: number;
  isActive: boolean;
  variants: BundleVariantResponse[];
}

export const bundleApi = {
  // Fetch all bundles
  fetchAllBundles: async (token: string): Promise<BundleResponse[]> => {
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || [];
  },

  // Create or update a bundle
  createOrUpdateBundle: async (bundle: BundleRequest, token: string): Promise<any> => {
    const response = await axios.post(BASE_URL, bundle, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete a bundle
  deleteBundle: async (id: number, token: string): Promise<any> => {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Toggle active status
  toggleBundleStatus: async (id: number, token: string): Promise<any> => {
    const response = await axios.patch(`${BASE_URL}/${id}/toggle-active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
