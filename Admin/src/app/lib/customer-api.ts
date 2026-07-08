import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/customers`;

export interface CustomerListItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  registered: string;
  orders: number;
  cartItems: number;
  wishlistItems: number;
  status: "Active" | "Inactive" | "New" | "Blocked" | string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeThisMonth: number;
  newThisWeek: number;
  inactiveCustomers: number;
}

export interface CustomerDetail {
  onboardingProfile: {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    email: string;
    phone: string;
  };
  shippingAddresses: {
    id: number;
    firstName: string;
    lastName: string;
    addressLine1?: string;
    addressLine2?: string;
    buildingNo?: string;
    buildingName?: string;
    street?: string;
    area?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    phone: string;
    type?: string;
  }[];
  purchaseSummary: {
    totalOrders: number;
    lastPurchase: string;
    dateJoined: string;
  };
  recentOrders: {
    id: string;
    date: string;
    amount: number;
    status: string;
    payment: string;
  }[];
  shoppingCartItems: {
    id: number;
    productName: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
  wishlistStyles: string[];
}

export const customerApi = {
  getAllCustomers: async (token: string): Promise<CustomerListItem[]> => {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  getCustomerStats: async (token: string): Promise<CustomerStats> => {
    const response = await axios.get(`${BASE_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  getCustomerDetails: async (id: number, token: string): Promise<CustomerDetail> => {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  toggleCustomerBlockStatus: async (id: number, token: string): Promise<any> => {
    const response = await axios.patch(`${BASE_URL}/${id}/toggle-block`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
