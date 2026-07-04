import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/products`;

export interface BackendProduct {
  id: number;
  productName: string;
  skuCode: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subcategoryName: string;
  baseTitle: string;
  productDescription: string;
  isActive: boolean;
  specification?: {
    id: number;
    fabric: string;
    fit: string;
    waterproofing: string;
    hardware: string;
    pocketDesign: string;
    pattern: string;
    neckCollarType: string;
    sleeveType: string;
    pockets: string;
    washCare: string;
    customSpecs?: Record<string, string>;
  };
  features?: {
    id: number;
    featureName: string;
    isActive: boolean;
  }[];
  variants?: {
    id: number;
    variantName: string;
    skuCode: string;
    mrp: number;
    price: number;
    discountType: "PERCENTAGE" | "FLAT";
    discountValue: number;
    isActive: boolean;
    imageUrls: string[];
    sizes: {
      id: number;
      sizeName: string;
      stockQuantity: number;
      isActive: boolean;
    }[];
    primaryImageUrl?: string;
  }[];
}

export const productApi = {
  // Fetch all products
  fetchAllProducts: async (token: string): Promise<BackendProduct[]> => {
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.details || [];
  },

  // Fetch product by ID
  fetchProductById: async (id: number, token: string): Promise<BackendProduct> => {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.details;
  },

  // Create new product (Multipart Form Data)
  createProduct: async (formData: FormData, token: string): Promise<any> => {
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Update existing product (Multipart Form Data)
  updateProduct: async (id: number, formData: FormData, token: string): Promise<any> => {
    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Soft delete product
  deleteProduct: async (id: number, token: string): Promise<any> => {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Toggle active status
  toggleProductStatus: async (id: number, token: string): Promise<any> => {
    const response = await axios.patch(`${BASE_URL}/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
