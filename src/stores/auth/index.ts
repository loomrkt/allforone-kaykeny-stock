import UserContext from "@/interfaces/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Auth {
  user: UserContext | null;
}

interface Actions {
  setContext: (user?: UserContext) => void;
  deleteContext: () => void;
}

export const useAuthStore = create(
  persist<Auth & Actions>(
    (set) => ({
      user: null,
      setContext: async (user) => {
        if (!user?.token || !user?.refreshToken) return set({ user: null });
        if (user) return set({ user: user as UserContext });
      },
      deleteContext: async () => set({ user: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
