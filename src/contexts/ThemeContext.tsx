import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, themes, defaultTheme } from '../constants/theme';

interface ThemeContextType {
  theme: Theme;
  currentThemeName: string;
  setTheme: (themeName: string) => void;
  toggleTheme: () => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'dark' 
}) => {
  const [currentThemeName, setCurrentThemeName] = useState<string>(initialTheme);
  const [theme, setCurrentTheme] = useState<Theme>(themes[initialTheme as keyof typeof themes] || defaultTheme);

  // Load saved theme from storage
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      if (savedTheme && themes[savedTheme as keyof typeof themes]) {
        setCurrentThemeName(savedTheme);
        setCurrentTheme(themes[savedTheme as keyof typeof themes]);
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }
  };

  const setTheme = async (themeName: string) => {
    if (themes[themeName as keyof typeof themes]) {
      setCurrentThemeName(themeName);
      setCurrentTheme(themes[themeName as keyof typeof themes]);
      
      try {
        await AsyncStorage.setItem('selectedTheme', themeName);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = currentThemeName === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const availableThemes = Object.keys(themes);

  const value: ThemeContextType = {
    theme,
    currentThemeName,
    setTheme,
    toggleTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

export const useThemeShadows = () => {
  const { theme } = useTheme();
  return theme.shadows;
}; 