import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/dashboard`;

export interface DashboardOverview {
  kpis: {
    label: string;
    value: string;
    rawValue: number;
    change: string;
    trend: "up" | "down";
    subtitle: string;
  }[];
  revenueChart: {
    day: string;
    date: string;
    revenue: number;
    orders: number;
    returns: number;
  }[];
  categorySales: {
    name: string;
    value: number; // percentage
    revenue: number;
    color: string;
  }[];
  sizeDistribution: {
    size: string;
    stock: number;
    sold: number;
  }[];
  topProducts: {
    name: string;
    sku: string;
    price: number;
    orders: number;
    revenue: number;
    image: string;
  }[];
  recentOrders: {
    id: string;
    customer: string;
    date: string;
    amount: number;
    payment: string;
    status: string;
  }[];
  citySales: {
    city: string;
    sales: number;
    orders: number;
    growth: string;
    pct: string;
  }[];
}

export const adminDashboardApi = {
  getOverview: async (
    token: string,
    params: {
      period?: string;
      startDate?: string;
      endDate?: string;
      vsPeriod?: string;
    }
  ): Promise<DashboardOverview> => {
    const res = await axios.get(`${BASE_URL}/overview`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return res.data;
  }
};
