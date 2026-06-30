import axios from "axios";
import { API_CONFIG } from "../utils/api-config";

const BASE_URL = API_CONFIG.BASE_URL;

export interface OtpResponse {
  message?: string;
  status?: string;
}

export interface VerifyOtpResponse {
  token?: string;
  userExists?: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender?: string;
    dateOfBirth?: string;
  };
}

export const authApi = {
  // 1. Request/Send OTP code to email or phone identifier
  sendOtp: async (identifier: string): Promise<OtpResponse> => {
    const response = await axios.post(`${BASE_URL}${API_CONFIG.ENDPOINTS.SEND_OTP}`, {
      identifier
    });
    return response.data;
  },

  // 2. Verify login OTP code
  verifyOtp: async (identifier: string, otpCode: string): Promise<VerifyOtpResponse> => {
    const response = await axios.post(`${BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_OTP}`, {
      identifier,
      otpCode
    });
    return response.data;
  },

  // 3. Invalidate current auth session token
  logout: async (token: string): Promise<void> => {
    await axios.post(`${BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
