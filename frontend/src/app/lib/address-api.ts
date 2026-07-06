import axios from "axios";
import { API_CONFIG } from "../utils/api-config";
import { getSessionToken } from "./auth-storage";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/address`;

function getHeaders() {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface AddressRequest {
  type: string;
  firstName: string;
  lastName: string;
  buildingNo: string;
  buildingName: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface AddressResponse {
  id: number;
  type: string;
  firstName: string;
  lastName: string;
  buildingNo: string;
  buildingName: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export const addressApi = {
  getAddresses: async (): Promise<AddressResponse[]> => {
    const response = await axios.get(BASE_URL, { headers: getHeaders() });
    return response.data.data || [];
  },

  createAddress: async (request: AddressRequest): Promise<any> => {
    const response = await axios.post(BASE_URL, request, { headers: getHeaders() });
    return response.data;
  },

  updateAddress: async (addressId: number, request: AddressRequest): Promise<any> => {
    const response = await axios.put(`${BASE_URL}/${addressId}`, request, { headers: getHeaders() });
    return response.data;
  },

  deleteAddress: async (addressId: number): Promise<any> => {
    const response = await axios.delete(`${BASE_URL}/${addressId}`, { headers: getHeaders() });
    return response.data;
  },

  setDefaultAddress: async (addressId: number): Promise<any> => {
    const response = await axios.patch(`${BASE_URL}/${addressId}/default`, null, { headers: getHeaders() });
    return response.data;
  }
};
