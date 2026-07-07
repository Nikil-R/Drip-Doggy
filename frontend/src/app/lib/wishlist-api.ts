import axios from "axios";
import { API_CONFIG } from "../utils/api-config";
import { getSessionToken } from "./auth-storage";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/wishlist`;

function getHeaders() {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface BackendWishlistItem {
  id: number;
  isActive: boolean;
  productVariantSizeId: number;
  sizeName: string;
  productName: string;
  variantName: string;
  price: number;
  primaryImageUrl: string;
}

export const wishlistApi = {
  getWishlist: async (): Promise<BackendWishlistItem[]> => {
    const response = await axios.get(BASE_URL, { headers: getHeaders() });
    return response.data.data || [];
  },

  addToWishlist: async (productVariantSizeId: number): Promise<any> => {
    const response = await axios.post(
      BASE_URL,
      { productVariantSizeId },
      { headers: getHeaders() }
    );
    return response.data;
  },

  removeFromWishlist: async (wishlistItemId: number): Promise<any> => {
    const response = await axios.delete(`${BASE_URL}/${wishlistItemId}`, { headers: getHeaders() });
    return response.data;
  },

  toggleWishlistActive: async (wishlistItemId: number): Promise<any> => {
    const response = await axios.patch(
      `${BASE_URL}/${wishlistItemId}`,
      {},
      { headers: getHeaders() }
    );
    return response.data;
  }
};
