// context/ThemeContext.tsx

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  subText: string;
  inputBg: string;
}

export interface ThemeContextType {
  theme: {
    dark: boolean;
    colors: ThemeColors;
  };
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  primary: '#7E69C7',      // Brand purple (you may adjust)
  secondary: '#6FDB6F',    // secondary accent (green) if you keep
  background: '#FFFFFF',   // white background for light mode
  card: '#F5F5F5',         // very light gray card bg
  text: '#1E1E1E',         // dark text on light background
  subText: '#555555',      // sub-text gray
  inputBg: '#FFFFFF',      // input fields bg
};

const darkColors: ThemeColors = {
  primary: '#7E69C7',      // brand purple as accent — but may look more subtle on dark bg
  secondary: '#6FDB6F',    // secondary accent if used
  background: '#121212',   // very dark gray, better than colored bg for dark mode
  card: '#1E1E1E',         // slightly lighter dark gray for cards/panels
  text: '#E0E0E0',         // soft light gray text for readability
  subText: '#A0A0A0',      // muted gray for subtext
  inputBg: '#1E1E1E',      // input fields bg
};

const lightTheme = { dark: false, colors: lightColors };
const darkTheme = { dark: true, colors: darkColors };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
