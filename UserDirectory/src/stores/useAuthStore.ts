import { create } from "zustand"
import { deleteSecure, getSecure, saveSecure } from "../services/secureStorage";

const TOKEN_KEY = "auth_token"; 

type AuthStore = {
  token: string | null;
  isLoading: boolean;

  initialize: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  isLoading: true,

  initialize: async () => {
    try {
      let token = await getSecure(TOKEN_KEY);

      // First launch case
      if (!token) {
        token = "mock-jwt-abc123";
        await saveSecure(TOKEN_KEY, token);
      }

      set({ token });
    } 
    finally {
      set({ isLoading: false });
    }
  },

  setToken: async (token: string) => {
    await saveSecure(TOKEN_KEY, token);
    set({ token });
  },

  clearToken: async () => {
    await deleteSecure(TOKEN_KEY);
    set({ token: null });
  },
}));

