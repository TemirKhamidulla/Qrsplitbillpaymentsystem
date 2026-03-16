import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  isDark: false;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggle: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ isDark: false, toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// iOS 26 Liquid Glass System Colors
export const LG = {
  blue: '#007AFF',
  green: '#30D158',
  red: '#FF453A',
  orange: '#FF9F0A',
  yellow: '#FFD60A',
  teal: '#64D2FF',
  indigo: '#5E5CE6',
  purple: '#BF5AF2',
  pink: '#FF375F',
  mint: '#66D4CF',

  // Labels
  label: 'rgba(0, 0, 0, 0.88)',
  labelSecondary: 'rgba(60, 60, 67, 0.55)',
  labelTertiary: 'rgba(60, 60, 67, 0.28)',
  labelQuaternary: 'rgba(60, 60, 67, 0.16)',

  // Glass
  glassBg: 'rgba(255, 255, 255, 0.45)',
  glassBorder: 'rgba(255, 255, 255, 0.55)',
  separator: 'rgba(60, 60, 67, 0.06)',
  fill: 'rgba(120, 120, 128, 0.08)',
};

// Backward compat alias
export const IOS = LG;
