import axios from "axios";
import { API_CONFIG } from "../utils/api-config";
import { getSessionToken } from "./auth-storage";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/cart`;

function getHeaders() {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface BackendCartItem {
  id: number;
  quantity: number;
  isActive: boolean;
  productVariantSizeId: number;
  sizeName: string;
  productName: string;
  variantName: string;
  price: number;
  primaryImageUrl: string;
}

export const cartApi = {
  getCart: async (): Promise<BackendCartItem[]> => {
    const response = await axios.get(BASE_URL, { headers: getHeaders() });
    return response.data.cartItems || [];
  },

  addToCart: async (productVariantSizeId: number, quantity: number): Promise<any> => {
    const response = await axios.post(
      BASE_URL,
      { productVariantSizeId, quantity },
      { headers: getHeaders() }
    );
    return response.data;
  },

  updateQuantity: async (cartItemId: number, quantity: number): Promise<any> => {
    const response = await axios.put(
      `${BASE_URL}/${cartItemId}`,
      null,
      {
        params: { quantity },
        headers: getHeaders()
      }
    );
    return response.data;
  },

  removeFromCart: async (cartItemId: number): Promise<any> => {
    const response = await axios.delete(`${BASE_URL}/${cartItemId}`, { headers: getHeaders() });
    return response.data;
  },

  clearCart: async (): Promise<any> => {
    const response = await axios.delete(BASE_URL, { headers: getHeaders() });
    return response.data;
  }
};
