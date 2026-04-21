"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

interface ThemeCtxValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({ theme: "dark", toggle: () => {} });

function applyTheme(t: Theme) {
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  html.classList.add(t);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Read saved preference on mount
  useEffect(() => {
    const saved = (localStorage.getItem("fj-theme") as Theme) ?? "dark";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("fj-theme", next);
    applyTheme(next);
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
