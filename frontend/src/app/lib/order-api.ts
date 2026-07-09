import axios from "axios";
import { API_CONFIG } from "../utils/api-config";
import { getSessionToken } from "./auth-storage";

const BASE_URL = API_CONFIG.BASE_URL;

function getHeaders() {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface CheckoutOtpRequest {
  phoneNo: string;
}

export interface CheckoutOtpVerifyRequest {
  phoneNo: string;
  otpCode: string;
}

export interface OrderPreviewRequest {
  deliveryMethod: string; // "STANDARD" or "EXPRESS"
  couponCode?: string;
}

export interface OrderPreviewResponse {
  subtotal?: number;
  subTotal?: number;
  discount: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
}

export interface OrderRequest {
  addressId: number;
  phoneNo: string;
  deliveryMethod: string; // "STANDARD" or "EXPRESS"
  couponCode?: string;
}

export interface OrderResponse {
  orderNumber: string;
  orderTimestamp: string;
  totalAmount: number;
  discount: number;
  tax: number;
  platformFee: number;
  shippingFee: number;
  deliveryMethod: string;
  deliveryStatus: string;
  paymentStatus: string;
  phoneNumber: string;
  email: string;
  customerName: string;
  destination?: string;
  destinationAddress?: string;
}

export const orderApi = {
  sendCheckoutOtp: async (phoneNo: string): Promise<any> => {
    const url = BASE_URL + API_CONFIG.ENDPOINTS.ORDERS_SEND_OTP;
    const response = await axios.post(url, { phoneNo }, { headers: getHeaders() });
    return response.data;
  },

  verifyCheckoutOtp: async (phoneNo: string, otpCode: string): Promise<any> => {
    const url = BASE_URL + API_CONFIG.ENDPOINTS.ORDERS_VERIFY_OTP;
    const response = await axios.post(url, { phoneNo, otpCode }, { headers: getHeaders() });
    return response.data;
  },

  previewOrder: async (request: OrderPreviewRequest): Promise<OrderPreviewResponse> => {
    const url = BASE_URL + API_CONFIG.ENDPOINTS.ORDERS_PREVIEW;
    const response = await axios.post(url, request, { headers: getHeaders() });
    return response.data;
  },

  placeOrder: async (request: OrderRequest): Promise<OrderResponse> => {
    const url = BASE_URL + API_CONFIG.ENDPOINTS.ORDERS_PLACE;
    const response = await axios.post(url, request, { headers: getHeaders() });
    return response.data;
  }
};
