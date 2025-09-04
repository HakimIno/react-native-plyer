import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import { TabBarConfig, TabIconConfig, defaultTabConfig, defaultTabIconConfig, tabConfigPresets } from '../constants/tabConfig';
import { Theme } from '../constants/theme';

// Initialize MMKV storage
const storage = new MMKV();

interface TabConfigContextType {
  tabConfig: TabBarConfig;
  tabIconConfig: TabIconConfig;
  currentPreset: string;
  setTabPreset: (preset: string) => void;
  updateTabConfig: (config: Partial<TabBarConfig>) => void;
  updateTabIconConfig: (config: Partial<TabIconConfig>) => void;
  resetToDefault: () => void;
  availablePresets: string[];
}

const TabConfigContext = createContext<TabConfigContextType | undefined>(undefined);

interface TabConfigProviderProps {
  children: ReactNode;
  theme: Theme;
  initialPreset?: string;
}

export const TabConfigProvider: React.FC<TabConfigProviderProps> = ({ 
  children, 
  theme,
  initialPreset = 'default'
}) => {
  const [currentPreset, setCurrentPreset] = useState<string>(initialPreset);
  const [tabConfig, setTabConfig] = useState<TabBarConfig>(defaultTabConfig);
  const [tabIconConfig, setTabIconConfig] = useState<TabIconConfig>(defaultTabIconConfig);

  // Load saved tab configuration from storage
  useEffect(() => {
    loadSavedTabConfig();
  }, []);

  // Update configurations when theme changes
  useEffect(() => {
    updateConfigurationsForTheme(theme);
  }, [theme]);

  const loadSavedTabConfig = () => {
    try {
      const savedPreset = storage.getString('selectedTabPreset');
      if (savedPreset) {
        setCurrentPreset(savedPreset);
        applyPreset(savedPreset);
      }
    } catch (error) {
      console.error('Error loading saved tab config:', error);
    }
  };

  const applyPreset = (preset: string) => {
    if (preset === 'default') {
      setTabConfig(defaultTabConfig);
      setTabIconConfig(defaultTabIconConfig);
    } else if (tabConfigPresets[preset as keyof typeof tabConfigPresets]) {
      const presetConfig = tabConfigPresets[preset as keyof typeof tabConfigPresets];
      setTabConfig({ ...defaultTabConfig, ...presetConfig });
      setTabIconConfig(defaultTabIconConfig);
    }
  };

  const updateConfigurationsForTheme = (currentTheme: Theme) => {
    setTabConfig(prev => ({
      ...prev,
      backgroundColor: currentTheme.colors.tabBar.background[0],
      customButtonConfig: prev.customButtonConfig ? {
        ...prev.customButtonConfig,
        backgroundColor: currentTheme.colors.button.primary,
        borderColor: currentTheme.colors.button.secondary,
      } : undefined,
    }));

    setTabIconConfig(prev => ({
      ...prev,
      activeColor: currentTheme.colors.tabBar.text.active,
      inactiveColor: currentTheme.colors.tabBar.text.inactive,
      labelActiveColor: currentTheme.colors.tabBar.text.active,
      labelInactiveColor: currentTheme.colors.tabBar.text.inactive,
    }));
  };

  const setTabPreset = (preset: string) => {
    setCurrentPreset(preset);
    applyPreset(preset);
    
    try {
      storage.set('selectedTabPreset', preset);
    } catch (error) {
      console.error('Error saving tab preset:', error);
    }
  };

  const updateTabConfig = (config: Partial<TabBarConfig>) => {
    setTabConfig(prev => ({ ...prev, ...config }));
  };

  const updateTabIconConfig = (config: Partial<TabIconConfig>) => {
    setTabIconConfig(prev => ({ ...prev, ...config }));
  };

  const resetToDefault = () => {
    setTabPreset('default');
  };

  const availablePresets = ['default', ...Object.keys(tabConfigPresets)];

  const value: TabConfigContextType = {
    tabConfig,
    tabIconConfig,
    currentPreset,
    setTabPreset,
    updateTabConfig,
    updateTabIconConfig,
    resetToDefault,
    availablePresets,
  };

  return (
    <TabConfigContext.Provider value={value}>
      {children}
    </TabConfigContext.Provider>
  );
};

export const useTabConfig = (): TabConfigContextType => {
  const context = useContext(TabConfigContext);
  if (context === undefined) {
    throw new Error('useTabConfig must be used within a TabConfigProvider');
  }
  return context;
};

export const useTabBarConfig = () => {
  const { tabConfig } = useTabConfig();
  return tabConfig;
};

export const useTabIconConfig = () => {
  const { tabIconConfig } = useTabConfig();
  return tabIconConfig;
}; 