import { create } from "zustand";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem("theme_mode");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getInitialTheme(),

  toggleTheme: () =>
    set((state) => {
      const nextMode: ThemeMode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("theme_mode", nextMode);
      return { mode: nextMode };
    }),

  setTheme: (mode) => {
    localStorage.setItem("theme_mode", mode);
    set({ mode });
  },
}));