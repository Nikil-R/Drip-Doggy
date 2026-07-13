import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/reviews`;

export interface BackendReview {
  id: number;
  productName: string;
  productSku: string;
  customerName: string;
  location: string;
  rating: number;
  reviewContent: string;
  createdAt: string;
  isActive: boolean;
  productSize?: string;
  productColor?: string;
  images: Array<{ id: number; imageUrl: string }>;
}

export const adminReviewApi = {
  getAllReviews: async (token: string): Promise<BackendReview[]> => {
    const res = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  toggleReviewActive: async (id: number, token: string): Promise<any> => {
    const res = await axios.patch(`${BASE_URL}/${id}/toggle-active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  deleteReview: async (id: number, token: string): Promise<any> => {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
