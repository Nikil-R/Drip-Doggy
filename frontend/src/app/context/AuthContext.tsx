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
} from "../lib/auth-storage";
import { authApi } from "../lib/auth-api";

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

  useEffect(() => {
    seedTestUser();
    const sessionUser = getSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    const pending = getPendingIdentifier();
    if (pending) {
      setPendingIdentifier(pending);
    }
    setIsLoading(false);
  }, []);

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
          
          if (res.userExists && res.user) {
            const authUser: AuthUser = {
              id: res.user.id,
              firstName: res.user.firstName,
              lastName: res.user.lastName,
              email: res.user.email,
              phone: res.user.phone,
              gender: res.user.gender,
              dateOfBirth: res.user.dateOfBirth,
            };
            saveSessionUser(authUser);
            setUser(authUser);
            clearPendingIdentifier();
            setPendingIdentifier(null);
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
      if (!pending) {
        return { success: false, message: "No pending verification found. Please start over." };
      }

      const isEmailInput = pending.includes("@");
      const storedUser = createUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: isEmailInput ? pending : "",
        phone: isEmailInput ? "" : pending,
      });

      const updatedUser = updateUserProfile(pending, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
      });

      const finalUser = updatedUser || storedUser;
      const authUser: AuthUser = {
        id: finalUser.id,
        firstName: finalUser.firstName,
        lastName: finalUser.lastName,
        email: finalUser.email,
        phone: finalUser.phone,
        gender: finalUser.gender,
        dateOfBirth: finalUser.dateOfBirth,
      };

      saveSessionUser(authUser);
      setUser(authUser);
      clearPendingIdentifier();
      setPendingIdentifier(null);
      return { success: true };
    },
    []
  );

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
    setUser(null);
    setPendingIdentifier(null);
  }, []);

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
