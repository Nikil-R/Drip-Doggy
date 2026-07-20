import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/orders`;

export interface OrderItemDetail {
  productName: string;
  sku: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface AdminOrderResponse {
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
  customerEmail: string;
  customerName: string;
  destinationAddress: string;
  trackingNumber: string;
  pendingAt?: string;
  processingAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  items: OrderItemDetail[];
}

export interface AdminReturnResponse {
  id: number;
  orderId: number;
  orderNumber: string;
  orderItemId: number;
  requestType: "RETURN" | "EXCHANGE" | string;
  cancelReason: string;
  defectImageUrl1?: string;
  defectImageUrl2?: string;
  defectImageUrl3?: string;
  targetSize?: string;
  targetVariantId?: number;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productSize: string;
  productPrice: number;
  productQuantity: number;
  productColor?: string;
  targetColor?: string;
  upiId?: string;
  upiPhone?: string;
  qrCodeImageUrl?: string;
  bankAccountName?: string;
  bankName?: string;
  bankIfsc?: string;
  bankAccountNumber?: string;
}

export const adminOrderApi = {
  getAllOrders: async (token: string): Promise<AdminOrderResponse[]> => {
    const res = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  getOrderDetails: async (id: number | string, token: string): Promise<AdminOrderResponse> => {
    const res = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  updateOrderStatus: async (id: number | string, status: string, token: string): Promise<any> => {
    const res = await axios.patch(`${BASE_URL}/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  updateOrderTracking: async (id: number | string, trackingNumber: string, token: string): Promise<any> => {
    const res = await axios.patch(`${BASE_URL}/${id}/tracking`, { trackingNumber }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  cancelOrder: async (id: number | string, reason: string | undefined, token: string): Promise<any> => {
    const payload = reason ? { cancelReason: reason } : {};
    const res = await axios.patch(`${BASE_URL}/${id}/cancel`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  getAllReturnRequests: async (token: string): Promise<AdminReturnResponse[]> => {
    const res = await axios.get(`${BASE_URL}/returns`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  updateReturnStatus: async (returnId: number, status: string, token: string): Promise<any> => {
    const res = await axios.patch(`${BASE_URL}/returns/${returnId}/status/${status}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  resolveReturnRequest: async (
    returnId: number,
    action: "REFUND" | "EXCHANGE",
    trackingNumber: string,
    transactionId: string | null,
    token: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("action", action);
    formData.append("trackingNumber", trackingNumber);
    if (transactionId) {
      formData.append("transactionId", transactionId);
    }
    const res = await axios.patch(`${BASE_URL}/returns/${returnId}/resolve`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  }
};
