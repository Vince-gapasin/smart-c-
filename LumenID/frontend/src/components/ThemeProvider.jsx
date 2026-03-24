import * as React from "react";

const initialState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = React.createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "lumenid-theme",
  ...props
}) {
  const [theme, setTheme] = React.useState(
    () => {
      try {
        return localStorage.getItem(storageKey) || defaultTheme;
      } catch {
        return defaultTheme;
      }
    }
  );

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      try {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      } catch {
        setTheme(theme);
      }
    },
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Fail silently if localStorage is not available
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};