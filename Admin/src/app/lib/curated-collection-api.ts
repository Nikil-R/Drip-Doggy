import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/curated-collections`;

export interface BackendCuratedProduct {
  id: number;
  productName: string;
  baseTitle?: string;
  price: number;
  originalPrice?: number;
  primaryImageUrl?: string;
}

export interface BackendCuratedCollection {
  sectionKey: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  products: BackendCuratedProduct[];
}

export const adminCuratedCollectionApi = {
  getCollection: async (sectionKey: string, token: string): Promise<BackendCuratedCollection> => {
    const res = await axios.get(`${BASE_URL}/${sectionKey}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  updateCollection: async (
    sectionKey: string,
    data: { title: string; subtitle?: string; isActive: boolean; productIds: number[] },
    token: string
  ): Promise<any> => {
    const res = await axios.put(`${BASE_URL}/${sectionKey}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  }
};
