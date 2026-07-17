import axios from "axios";
import { API_CONFIG } from "@/app/utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/public/bundles`;

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
  // Fetch active bundle containing the specified variant ID
  fetchBundleByVariantId: async (variantId: number): Promise<BundleResponse | null> => {
    try {
      const response = await axios.get(`${BASE_URL}/variant/${variantId}`);
      return response.data || null;
    } catch (err) {
      console.warn("No active bundle found or error fetching for variant:", variantId);
      return null;
    }
  }
};
