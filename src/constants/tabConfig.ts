import { Ionicons } from '@expo/vector-icons';
import { Theme } from './theme';

export interface TabItem {
  name: string;
  label: string;
  icon: {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  };
  component: any;
  options?: {
    showLabel?: boolean;
    isCustomButton?: boolean;
    customButtonConfig?: {
      icon: keyof typeof Ionicons.glyphMap;
      size: number;
      backgroundColor: string;
      borderColor: string;
    };
  };
}

export interface TabBarConfig {
  height: number;
  position: 'absolute' | 'relative';
  backgroundColor: string;
  borderColor: string;
  elevation: number;
  showLabels: boolean;
  customButtonConfig?: {
    size: number;
    backgroundColor: string;
    borderColor: string;
    shadow: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export interface TabIconConfig {
  size: number;
  activeColor: string;
  inactiveColor: string;
  labelSize: number;
  labelActiveColor: string;
  labelInactiveColor: string;
  containerStyle?: {
    alignItems: 'center' | 'flex-start' | 'flex-end';
    justifyContent: 'center' | 'flex-start' | 'flex-end';
    width?: number;
    height?: number;
    marginTop?: number;
  };
}

// Default Tab Configuration
export const defaultTabConfig: TabBarConfig = {
  height: 70,
  position: 'absolute',
  backgroundColor: 'transparent',
  borderColor: 'rgba(28, 10, 10, 0)',
  elevation: 10,
  showLabels: false,
  customButtonConfig: {
    size: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
    },
  },
};

export const defaultTabIconConfig: TabIconConfig = {
  size: 24,
  activeColor: '#ffffff',
  inactiveColor: '#748c94',
  labelSize: 10,
  labelActiveColor: '#ffffff',
  labelInactiveColor: '#748c94',
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginTop: 20,
  },
};

// Tab Items Configuration
export const getTabItems = (): TabItem[] => [
  {
    name: 'Home',
    label: 'Home',
    icon: {
      active: 'home',
      inactive: 'home-outline',
    },
    component: require('../screens/home/HomeScreen').default,
    options: {
      showLabel: true,
    },
  },
  {
    name: 'AddVideo',
    label: 'Add Video',
    icon: {
      active: 'add',
      inactive: 'add',
    },
    component: require('../screens/addVideo/AddVideoScreen').default,
    options: {
      showLabel: false,
      isCustomButton: true,
      customButtonConfig: {
        icon: 'add',
        size: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  {
    name: 'Settings',
    label: 'Settings',
    icon: {
      active: 'settings',
      inactive: 'settings-outline',
    },
    component: require('../screens/settings/SettingsScreen').default,
    options: {
      showLabel: true,
    },
  },
];

// Dynamic Configuration Functions
export const createTabConfig = (theme: Theme, customConfig?: Partial<TabBarConfig>): TabBarConfig => {
  return {
    ...defaultTabConfig,
    backgroundColor: theme.colors.tabBar.background[0],
    customButtonConfig: {
      ...defaultTabConfig.customButtonConfig!,
      backgroundColor: theme.colors.button.primary,
      borderColor: theme.colors.button.secondary,
    },
    ...customConfig,
  };
};

export const createTabIconConfig = (theme: Theme, customConfig?: Partial<TabIconConfig>): TabIconConfig => {
  return {
    ...defaultTabIconConfig,
    activeColor: theme.colors.tabBar.text.active,
    inactiveColor: theme.colors.tabBar.text.inactive,
    labelActiveColor: theme.colors.tabBar.text.active,
    labelInactiveColor: theme.colors.tabBar.text.inactive,
    ...customConfig,
  };
};

// Preset Configurations
export const tabConfigPresets = {
  minimal: {
    height: 60,
    showLabels: false,
    customButtonConfig: {
      size: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 3,
      },
    },
  },
  modern: {
    height: 80,
    showLabels: true,
    customButtonConfig: {
      size: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
      },
    },
  },
  compact: {
    height: 50,
    showLabels: false,
    customButtonConfig: {
      size: 35,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
      },
    },
  },
}; 