import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("stayEasy_theme");
    return saved === "day" ? "day" : "night";
  });

  useEffect(() => {
    localStorage.setItem("stayEasy_theme", theme);
    const root = document.documentElement;

    if (theme === "night") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      document.body.style.backgroundColor = "#070A13";
      document.body.style.color = "#F8FAFC";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      document.body.style.backgroundColor = "#F8FAFC";
      document.body.style.color = "#0F172A";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "night" ? "day" : "night"));
  };

  const isNight = theme === "night";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isNight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
