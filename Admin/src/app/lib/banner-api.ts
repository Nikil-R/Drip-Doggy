import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/banners`;

export interface BackendBanner {
  id: number;
  title: string;
  tagline?: string;
  description?: string;
  redirectTo?: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string;
}

export const adminBannerApi = {
  getAllBanners: async (token: string): Promise<BackendBanner[]> => {
    const res = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  createBanner: async (formData: FormData, token: string): Promise<any> => {
    const res = await axios.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },

  updateBanner: async (id: number, formData: FormData, token: string): Promise<any> => {
    const res = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },

  deleteBanner: async (id: number, token: string): Promise<any> => {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  toggleBannerActive: async (id: number, token: string): Promise<any> => {
    const res = await axios.patch(`${BASE_URL}/${id}/toggle-active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
