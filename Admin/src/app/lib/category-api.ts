import axios from "axios";
import { API_CONFIG } from "../utils/api-config";
const BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`;

export interface BackendCategory {
  id: number;
  categoryName: string;
  imageUrl: string;
  imagePath?: string;
  description: string;
  subCategoryIds: string; // Comma separated list of IDs, or raw JSON, or empty string. E.g., "1,2,3"
  isActive: boolean;
  isDeleted: boolean;
}

export interface BackendSubCategory {
  subCategoryId: number;
  subcategoryName: string;
  imageUrl: string;
  imagePath?: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
}

// Full hydrated categories mapping to frontend's expected format
export interface HydratedCategory {
  id: string; // matches backend categoryId as string
  label: string; // matches backend categoryName
  sub: string; // matches backend description
  parent: string; // defaults to "Department" or matching name
  count: number;
  orders: number;
  status: "Active" | "Inactive";
  bannerImage: string;
  slug: string;
  subCategories: {
    id: string; // matches backend subCategoryId as string
    name: string; // matches backend subCategoryName
    description: string;
    imageUrl: string;
    isActive: boolean;
    categoryId: string;
  }[];
  revenueSales: number;
}

export const categoryApi = {
  // Fetch all categories from backend
  getAllCategories: async (token: string): Promise<BackendCategory[]> => {
    const response = await axios.get(`${BASE_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Fetch a category by ID
  getCategoryById: async (id: number, token: string): Promise<BackendCategory> => {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Add a new Category (Multipart Form)
  addCategory: async (categoryName: string, description: string, imageFile: File | null, subCategoryIds: string = "", token: string): Promise<BackendCategory> => {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("description", description);
    formData.append("subCategoryIds", subCategoryIds);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const response = await axios.post(`${BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  // Update Category By ID (Multipart Form)
  updateCategory: async (id: number, categoryName: string, description: string, imageFile: File | null, subCategoryIds: string = "", isActive: boolean = true, token: string): Promise<BackendCategory> => {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("description", description);
    formData.append("subCategoryIds", subCategoryIds);
    formData.append("isActive", String(isActive));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  // Toggle category active status (PATCH)
  toggleCategoryStatus: async (id: number, token: string): Promise<BackendCategory> => {
    const response = await axios.patch(`${BASE_URL}/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Soft delete category (DELETE)
  deleteCategory: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
};

const SUB_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBCATEGORIES}`;

export const subCategoryApi = {
  // Fetch all subcategories
  getAllSubCategories: async (token: string): Promise<BackendSubCategory[]> => {
    const response = await axios.get(`${SUB_BASE_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.details || [];
  },

  // Create Subcategory (Multipart form support)
  createSubCategory: async (
    subcategoryName: string,
    description: string,
    categoryId: number,
    imageFile: File | null,
    isActive: boolean = true,
    token: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("subcategoryName", subcategoryName);
    formData.append("description", description);
    formData.append("categoryId", String(categoryId));
    formData.append("isActive", String(isActive));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const response = await axios.post(`${SUB_BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  // Update Subcategory (Multipart form support)
  updateSubCategory: async (
    id: number,
    subcategoryName: string,
    description: string,
    categoryId: number,
    imageFile: File | null,
    isActive: boolean = true,
    token: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("subcategoryName", subcategoryName);
    formData.append("description", description);
    formData.append("categoryId", String(categoryId));
    formData.append("isActive", String(isActive));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const response = await axios.put(`${SUB_BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },

  // Delete Subcategory
  deleteSubCategory: async (id: number, token: string): Promise<any> => {
    const response = await axios.delete(`${SUB_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Toggle Subcategory active status
  toggleSubCategoryStatus: async (id: number, token: string): Promise<any> => {
    const response = await axios.patch(`${SUB_BASE_URL}/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
