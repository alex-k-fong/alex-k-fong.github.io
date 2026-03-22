import {createContext, useContext, useState, useEffect} from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system preference on initial load
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Listen for changes to system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const currentTheme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
export default ThemeContext;