import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type AuthUser,
  getSessionUser,
  saveSessionUser,
  clearSessionUser,
  seedTestUser,
  findUserByIdentifier,
  emailExists,
  phoneExists,
  createUser,
  toAuthUser,
  getMockOtp,
} from "../lib/auth-storage";

type AuthActionResult = {
  success: boolean;
  message?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestLoginOtp: (identifier: string) => Promise<AuthActionResult>;
  verifyLoginOtp: (identifier: string, otp: string) => Promise<AuthActionResult>;
  requestRegisterOtp: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => Promise<AuthActionResult>;
  verifyRegisterOtp: (
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    },
    otp: string
  ) => Promise<AuthActionResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, seed test user and hydrate session
  useEffect(() => {
    seedTestUser();
    const sessionUser = getSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setIsLoading(false);
  }, []);

  const requestLoginOtp = useCallback(
    async (identifier: string): Promise<AuthActionResult> => {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 600));
      // For mock mode, always succeed if identifier is non-empty
      if (!identifier.trim()) {
        return { success: false, message: "Please enter an email or phone number." };
      }
      return { success: true };
    },
    []
  );

  const verifyLoginOtp = useCallback(
    async (identifier: string, otp: string): Promise<AuthActionResult> => {
      await new Promise((r) => setTimeout(r, 500));

      if (otp !== getMockOtp()) {
        return { success: false, message: "Invalid OTP. Please try again." };
      }

      const foundUser = findUserByIdentifier(identifier);
      if (!foundUser) {
        return {
          success: false,
          message:
            "No account found for this email or phone number. Please create an account.",
        };
      }

      const authUser = toAuthUser(foundUser);
      saveSessionUser(authUser);
      setUser(authUser);
      return { success: true };
    },
    []
  );

  const requestRegisterOtp = useCallback(
    async (payload: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }): Promise<AuthActionResult> => {
      await new Promise((r) => setTimeout(r, 600));

      if (emailExists(payload.email)) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }
      if (phoneExists(payload.phone)) {
        return {
          success: false,
          message: "An account with this phone number already exists.",
        };
      }
      return { success: true };
    },
    []
  );

  const verifyRegisterOtp = useCallback(
    async (
      payload: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      },
      otp: string
    ): Promise<AuthActionResult> => {
      await new Promise((r) => setTimeout(r, 500));

      if (otp !== getMockOtp()) {
        return { success: false, message: "Invalid OTP. Please try again." };
      }

      // Re-check duplicates before final creation
      if (emailExists(payload.email)) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }
      if (phoneExists(payload.phone)) {
        return {
          success: false,
          message: "An account with this phone number already exists.",
        };
      }

      const storedUser = createUser(payload);
      const authUser = toAuthUser(storedUser);
      saveSessionUser(authUser);
      setUser(authUser);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    clearSessionUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        requestLoginOtp,
        verifyLoginOtp,
        requestRegisterOtp,
        verifyRegisterOtp,
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
