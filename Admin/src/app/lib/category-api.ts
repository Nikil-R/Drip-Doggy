import axios from "axios";

const BASE_URL = "http://localhost:8081/dripdoggy/api/admin";

export interface BackendCategory {
  categoryId: number;
  categoryName: string;
  imagePath: string;
  description: string;
  subCategoryIds: string; // Comma separated list of IDs, or raw JSON, or empty string. E.g., "1,2,3"
  isActive: boolean;
  isDeleted: boolean;
}

export interface BackendSubCategory {
  subCategoryId: number;
  subCategoryName: string;
  imagePath: string;
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
  getAllCategories: async (): Promise<BackendCategory[]> => {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  },

  // Fetch a category by ID
  getCategoryById: async (id: number): Promise<BackendCategory> => {
    const response = await axios.get(`${BASE_URL}/categories/${id}`);
    return response.data;
  },

  // Add a new Category (Multipart Form)
  addCategory: async (categoryName: string, description: string, imageFile: File | null, subCategoryIds: string = ""): Promise<BackendCategory> => {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("description", description);
    formData.append("subCategoryIds", subCategoryIds);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const response = await axios.post(`${BASE_URL}/categories`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update Category By ID (Multipart Form)
  updateCategory: async (id: number, categoryName: string, description: string, imageFile: File | null, subCategoryIds: string = "", isActive: boolean = true): Promise<BackendCategory> => {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("description", description);
    formData.append("subCategoryIds", subCategoryIds);
    formData.append("isActive", String(isActive));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const response = await axios.put(`${BASE_URL}/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Toggle category active status (PATCH)
  toggleCategoryStatus: async (id: number): Promise<BackendCategory> => {
    const response = await axios.patch(`${BASE_URL}/categories/${id}`);
    return response.data;
  },

  // Soft delete category (DELETE)
  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/categories/${id}`);
  },
};
