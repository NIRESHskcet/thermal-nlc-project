import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "thermal_nlc_theme";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    }, []);

    const value = useMemo(
        () => ({ theme, isDark: theme === "dark", setTheme, toggleTheme }),
        [theme, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
