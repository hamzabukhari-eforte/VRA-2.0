"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Initialize theme from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
      if (switchable && typeof window !== "undefined") {
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || stored === "light") {
          setTheme(stored as Theme);
        }
      }
    });
  }, [switchable]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable && mounted) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable, mounted]);

  const toggleTheme = switchable
    ? () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
