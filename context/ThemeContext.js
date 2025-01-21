import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const localStorageTheme = localStorage.getItem('isDarkMode');
    if (localStorageTheme) {
      localStorage.setItem('isDarkMode', !isDarkMode);
      console.log('localStorageTheme :', localStorageTheme);
    }

    setIsDarkMode((prev) => !prev);
    document.documentElement.className = !isDarkMode ? 'dark' : 'light';
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
