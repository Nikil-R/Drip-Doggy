import axios from "axios";
import { API_CONFIG } from "@/app/utils/api-config";

export interface SubCategory {
  subCategoryId: number;
  subcategoryName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
  subCategories?: SubCategory[];
}

export const categoryApi = {
  fetchCategories: async (): Promise<Category[]> => {
    const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES;
    const response = await axios.get<Category[]>(url);
    return response.data || [];
  },

  fetchCategoryById: async (id: number): Promise<Category> => {
    const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORY_BY_ID + `/${id}`;
    const response = await axios.get<Category>(url);
    return response.data;
  },

  fetchSubCategories: async (): Promise<SubCategory[]> => {
    const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SUBCATEGORIES;
    const response = await axios.get<SubCategory[]>(url);
    return response.data?.details || response.data || [];
  },

  fetchSubCategoryById: async (id: number): Promise<SubCategory> => {
    const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SUBCATEGORY_BY_ID + `/${id}`;
    const response = await axios.get<SubCategory>(url);
    return response.data;
  }
};
