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
  }
};
