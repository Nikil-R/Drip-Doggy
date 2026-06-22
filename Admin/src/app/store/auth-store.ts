import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        await new Promise((r) => setTimeout(r, 400));
        if (email === "admin@dripdoggy.com" && password === "admin123") {
          set({
            user: {
              id: "admin-1",
              email: "admin@dripdoggy.com",
              name: "Admin",
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "dripdoggy_admin_auth",
    }
  )
);
