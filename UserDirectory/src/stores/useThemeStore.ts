import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

type ThemeStore = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",

      toggleTheme: () => {
        const current = get().theme;
        set({ theme: current === "light" ? "dark" : "light" });
      },

      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: "theme-storage", 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);