import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/home-categories`;

export interface BackendHomeCategory {
  id: number;
  title: string;
  description?: string;
  route?: string;
  imageUrl?: string;
  comingSoon: boolean;
  comingSeason?: string;
  displayOrder: number;
  isActive: boolean;
}

export const adminHomeCategoryApi = {
  getAllCategories: async (token: string): Promise<BackendHomeCategory[]> => {
    const res = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  createCategory: async (formData: FormData, token: string): Promise<any> => {
    const res = await axios.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },

  updateCategory: async (id: number, formData: FormData, token: string): Promise<any> => {
    const res = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },

  deleteCategory: async (id: number, token: string): Promise<any> => {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  toggleCategoryActive: async (id: number, token: string): Promise<any> => {
    const res = await axios.patch(`${BASE_URL}/${id}/toggle-active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
