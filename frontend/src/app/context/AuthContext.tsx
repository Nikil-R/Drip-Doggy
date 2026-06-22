import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type AuthUser,
  getSessionUser,
  saveSessionUser,
  clearSessionUser,
  seedTestUser,
  findUserByIdentifier,
  getMockOtp,
  savePendingIdentifier,
  getPendingIdentifier,
  clearPendingIdentifier,
  updateUserProfile,
  createUser,
} from "../lib/auth-storage";

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
      await new Promise((r) => setTimeout(r, 600));
      if (!identifier.trim()) {
        return { success: false, message: "Please enter an email or phone number." };
      }
      return { success: true };
    },
    []
  );

  const verifyOtp = useCallback(
    async (identifier: string, otp: string): Promise<AuthActionResult> => {
      await new Promise((r) => setTimeout(r, 500));

      if (otp !== getMockOtp()) {
        return { success: false, message: "Invalid OTP. Please try again." };
      }

      const foundUser = findUserByIdentifier(identifier);
      if (foundUser) {
        const authUser = {
          id: foundUser.id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          phone: foundUser.phone,
          gender: foundUser.gender,
          dateOfBirth: foundUser.dateOfBirth,
        };
        saveSessionUser(authUser);
        setUser(authUser);
        clearPendingIdentifier();
        setPendingIdentifier(null);
        return { success: true, userExists: true };
      }

      savePendingIdentifier(identifier);
      setPendingIdentifier(identifier);
      return { success: true, userExists: false };
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
      await new Promise((r) => setTimeout(r, 500));

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

  const logout = useCallback(() => {
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
