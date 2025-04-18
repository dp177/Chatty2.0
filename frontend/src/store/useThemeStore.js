import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "dark", // 🌙 default to dark
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme); // persist choice
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));
