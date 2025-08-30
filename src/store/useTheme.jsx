import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTheme = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const newTheme = !state.isDark;
          if (newTheme) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDark: newTheme };
        }),
    }),
    {
      name: "theme-storage",
    }
  )
);
