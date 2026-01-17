import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Strict Dark Mode - No toggling allowed
    const theme = 'dark';

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
