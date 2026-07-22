import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/coming-soon-banners`;
const PUBLIC_BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/public/coming-soon-banners`;

export interface ComingSoonBanner {
  id: number;
  taglineBadge: string;
  releaseTitle: string;
  description: string;
  backgroundImageUrl: string;
  buttonText: string;
  actionLink: string;
  displayOrder: number;
  isActive: boolean;
  targetCategoryId?: number;
  targetSubCategoryId?: number;
  targetProductId?: number;
}

export const adminComingSoonApi = {
  getAllBanners: async (token: string): Promise<ComingSoonBanner[]> => {
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
    const res = await axios.post(`${BASE_URL}/${id}`, formData, {
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

export const publicComingSoonApi = {
  getActiveBanners: async (): Promise<ComingSoonBanner[]> => {
    const res = await axios.get(PUBLIC_BASE_URL);
    return res.data;
  }
};
