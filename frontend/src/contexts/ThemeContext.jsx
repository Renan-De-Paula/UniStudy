import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('unistudy_theme');
      if (saved) return saved === 'dark';
    } catch {
      // fallback
    }
    return true;
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.body.classList.remove('light-theme');
        localStorage.setItem('unistudy_theme', 'dark');
      } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('unistudy_theme', 'light');
      }
    } catch {
      // fallback
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
