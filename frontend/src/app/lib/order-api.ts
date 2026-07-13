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
  },

  getCustomerOrders: async (customerId?: number): Promise<any[]> => {
    const url = `${BASE_URL}/dripdoggy/api/customer/orders`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data || [];
  },

  cancelOrder: async (orderId: string, reason: string): Promise<any> => {
    const numericId = orderId.replace(/\D/g, "");
    const url = `${BASE_URL}/dripdoggy/api/customer/orders/${numericId}/cancel`;
    const response = await axios.patch(url, { cancelReason: reason }, { headers: getHeaders() });
    return response.data;
  },

  submitReturn: async (
    orderId: string,
    orderItemId: number,
    cancelReason: string,
    defectImages: File[],
    refundMethod: string,
    refundDetails: any
  ): Promise<any> => {
    const numericId = orderId.replace(/\D/g, "");
    const url = `${BASE_URL}/dripdoggy/api/customer/orders/${numericId}/returns`;
    
    const formData = new FormData();
    formData.append("orderItemId", String(orderItemId));
    formData.append("cancelReason", cancelReason);
    
    // Add exact 3 defect files
    defectImages.forEach(file => {
      formData.append("images", file);
    });

    if (refundMethod === "qr_code" && refundDetails.qrCodeFile) {
      formData.append("qrCodeImage", refundDetails.qrCodeFile);
    } else if (refundMethod === "upi") {
      formData.append("upiId", refundDetails.upiId || "");
      formData.append("upiPhone", refundDetails.phoneNumber || "");
    } else if (refundMethod === "bank_transfer") {
      formData.append("bankAccountName", refundDetails.accountHolderName || "");
      formData.append("bankName", refundDetails.bankName || "");
      formData.append("bankAccountNumber", refundDetails.accountNumber || "");
      formData.append("bankIfsc", refundDetails.ifscCode || "");
    }

    const response = await axios.post(url, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  },

  submitExchange: async (
    orderId: string,
    orderItemId: number,
    cancelReason: string,
    targetSize: string,
    targetVariantId: number,
    defectImages: File[],
    refundMethod?: string,
    refundDetails?: any
  ): Promise<any> => {
    const numericId = orderId.replace(/\D/g, "");
    const url = `${BASE_URL}/dripdoggy/api/customer/orders/${numericId}/exchanges`;

    const formData = new FormData();
    formData.append("orderItemId", String(orderItemId));
    formData.append("cancelReason", cancelReason);
    formData.append("targetSize", targetSize);
    formData.append("targetVariantId", String(targetVariantId));

    defectImages.forEach(file => {
      formData.append("images", file);
    });

    if (refundMethod && refundDetails) {
      if (refundMethod === "qr_code" && refundDetails.qrCodeFile) {
        formData.append("qrCodeImage", refundDetails.qrCodeFile);
      } else if (refundMethod === "upi") {
        formData.append("upiId", refundDetails.upiId || "");
        formData.append("upiPhone", refundDetails.phoneNumber || "");
      } else if (refundMethod === "bank_transfer") {
        formData.append("bankAccountName", refundDetails.accountHolderName || "");
        formData.append("bankName", refundDetails.bankName || "");
        formData.append("bankAccountNumber", refundDetails.accountNumber || "");
        formData.append("bankIfsc", refundDetails.ifscCode || "");
      }
    }

    const response = await axios.post(url, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }
};
