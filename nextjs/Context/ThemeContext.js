"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children, initialTheme = false }) => {
  const [isDark, setIsDark] = useState(initialTheme);

  const themeToggle = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `theme=${isDark ? "dark" : "light"}; path=/; expires=${expires.toUTCString()}`;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, themeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
