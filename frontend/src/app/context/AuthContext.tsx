import axios from "axios";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type AuthUser,
  getSessionUser,
  saveSessionUser,
  clearSessionUser,
  seedTestUser,
  savePendingIdentifier,
  getPendingIdentifier,
  clearPendingIdentifier,
  updateUserProfile,
  createUser,
  saveSessionToken,
  getSessionToken,
  clearSessionToken,
} from "../lib/auth-storage";
import { authApi } from "../lib/auth-api";
import { syncCart, mergeLocalCartToBackend } from "../lib/cart-sync";
import { syncWishlist, mergeLocalWishlistToBackend } from "../lib/wishlist-sync";

type AuthActionResult = {
  success: boolean;
  message?: string;
  userExists?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (identifier: string) => Promise<AuthActionResult>;
  verifyOtp: (identifier: string, otp: string) => Promise<AuthActionResult>;
  completeOnboarding: (profile: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
  }) => Promise<AuthActionResult>;
  pendingIdentifier: string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingIdentifier, setPendingIdentifier] = useState<string | null>(null);

  const logout = useCallback(async () => {
    const token = getSessionToken();
    if (token) {
      try {
        await authApi.logout(token);
      } catch (e) {
        console.error("Logout request failed", e);
      }
    }
    clearSessionUser();
    clearPendingIdentifier();
    clearSessionToken();
    setUser(null);
    setPendingIdentifier(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("wishlist-updated"));
  }, []);

  useEffect(() => {
    seedTestUser();
    const sessionUser = getSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
      syncCart();
      syncWishlist();
    }
    const pending = getPendingIdentifier();
    if (pending) {
      setPendingIdentifier(pending);
    }
    setIsLoading(false);

    // Global Axios Interceptor to sign out if user gets blocked/forbidden
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          const msg = error.response.data?.message || "";
          if (msg.toLowerCase().includes("block") || error.response.status === 403) {
            logout();
            window.location.href = "/login?blocked=true";
          }
        }
        return Promise.reject(error);
      }
    );

    // Global Axios Request Interceptor to attach Bearer Token to all outgoing requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("dripdoggy_auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [logout]);

  const requestOtp = useCallback(
    async (identifier: string): Promise<AuthActionResult> => {
      if (!identifier.trim()) {
        return { success: false, message: "Please enter an email or phone number." };
      }
      try {
        await authApi.sendOtp(identifier);
        return { success: true };
      } catch (err: any) {
        return { 
          success: false, 
          message: err?.response?.data?.message || "Failed to request OTP. Please try again." 
        };
      }
    },
    []
  );

  const verifyOtp = useCallback(
    async (identifier: string, otp: string): Promise<AuthActionResult> => {
      if (!otp.trim() || otp.length !== 6) {
        return { success: false, message: "Please enter a valid 6-digit OTP." };
      }
      try {
        const res = await authApi.verifyOtp(identifier, otp);
        if (res.token) {
          saveSessionToken(res.token);
          
          if (res.userExists) {
            const authUser: AuthUser = {
              id: res.user?.id || identifier,
              firstName: res.user?.firstName || "",
              lastName: res.user?.lastName || "",
              email: identifier.includes("@") ? identifier : (res.user?.email || ""),
              phone: identifier.includes("@") ? (res.user?.phone || "") : identifier,
              gender: res.user?.gender || "",
              dateOfBirth: res.user?.dateOfBirth || "",
            };
            saveSessionUser(authUser);
            setUser(authUser);
            clearPendingIdentifier();
            setPendingIdentifier(null);
            mergeLocalCartToBackend();
            mergeLocalWishlistToBackend();
            return { success: true, userExists: true };
          } else {
            // Save to pending state so onboarding can read this email/phone parameter
            savePendingIdentifier(identifier);
            setPendingIdentifier(identifier);
            return { success: true, userExists: false };
          }
        } else {
          return { success: false, message: "Server did not issue a valid authentication token." };
        }
      } catch (err: any) {
        return { 
          success: false, 
          message: err?.response?.data?.message || "Invalid verification code. Please try again." 
        };
      }
    },
    []
  );

  const completeOnboarding = useCallback(
    async (profile: {
      firstName: string;
      lastName: string;
      gender: string;
      dateOfBirth: string;
    }): Promise<AuthActionResult> => {
      const pending = getPendingIdentifier();
      const token = getSessionToken();
      if (!pending) {
        return { success: false, message: "No pending verification found. Please start over." };
      }
      if (!token) {
        return { success: false, message: "Authentication session expired. Please verify again." };
      }

      try {
        // Convert yyyy-mm-dd to dd/MM/yyyy for backend compatibility
        let formattedDob = profile.dateOfBirth;
        if (profile.dateOfBirth && profile.dateOfBirth.includes("-")) {
          const parts = profile.dateOfBirth.split("-"); // [yyyy, mm, dd]
          if (parts.length === 3) {
            formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        }

        const backendUser = await authApi.registerCustomer(
          profile.firstName,
          profile.lastName,
          formattedDob, // pass converted dd/MM/yyyy string
          profile.gender,
          token
        );

        const authUser: AuthUser = {
          id: String(backendUser.id || pending),
          firstName: backendUser.firstName || profile.firstName,
          lastName: backendUser.lastName || profile.lastName,
          email: pending.includes("@") ? pending : "",
          phone: pending.includes("@") ? "" : pending,
          gender: backendUser.gender || profile.gender,
          dateOfBirth: backendUser.dob || profile.dateOfBirth,
        };

        saveSessionUser(authUser);
        setUser(authUser);
        clearPendingIdentifier();
        setPendingIdentifier(null);
        mergeLocalCartToBackend();
        mergeLocalWishlistToBackend();
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          message: err?.response?.data?.message || "Failed to update onboarding profile. Please try again."
        };
      }
    },
    []
  );



  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        requestOtp,
        verifyOtp,
        completeOnboarding,
        pendingIdentifier,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
