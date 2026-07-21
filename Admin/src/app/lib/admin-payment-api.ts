import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/payments`;

export interface PaymentSummary {
  totalActiveCashFlow: number;
  todayRevenue: number;
  cancelledOrdersCount: number;
  lostMoney: number;
}

export interface PaymentItem {
  orderNumber: string;
  customerName: string;
  paymentType: string;
  amount: number;
  orderDate: string;
  paymentStatus: string;
  bankSettlementStatus: "BANK_DEPOSITED" | "PENDING_DEPOSIT" | string;
}

export interface PaymentLedgerResponse {
  summary: PaymentSummary;
  payments: PaymentItem[];
}

export const adminPaymentApi = {
  getPaymentLedger: async (
    token: string,
    params?: { status?: string; dateRange?: string; search?: string }
  ): Promise<PaymentLedgerResponse> => {
    const res = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return res.data;
  },

  updateBankSettlement: async (
    orderNumber: string,
    bankSettlementStatus: "BANK_DEPOSITED" | "PENDING_DEPOSIT",
    token: string
  ): Promise<{ statusCode: number; message: string }> => {
    const cleanOrderNum = orderNumber.replace("#", "").trim();
    const res = await axios.patch(
      `${BASE_URL}/${cleanOrderNum}/bank-settlement`,
      { bankSettlementStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return res.data;
  }
};
