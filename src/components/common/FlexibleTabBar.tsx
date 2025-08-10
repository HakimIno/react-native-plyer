import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTabConfig } from '../../contexts/TabConfigContext';
import { TabBarConfig, TabIconConfig } from '../../constants/tabConfig';

interface FlexibleTabBarProps {
  children: React.ReactNode;
  customConfig?: Partial<TabBarConfig>;
  customGradient?: string[];
  customStyle?: any;
}

export const FlexibleTabBar: React.FC<FlexibleTabBarProps> = ({
  children,
  customConfig,
  customGradient,
  customStyle,
}) => {
  const { theme } = useTheme();
  const { tabConfig } = useTabConfig();

  // Merge custom config with default config
  const finalConfig = { ...tabConfig, ...customConfig };
  
  // Use custom gradient or theme gradient
  const gradientColors = customGradient || theme.colors.tabBar.background;

  const containerStyle = [
    styles.container,
    {
      height: finalConfig.height,
      backgroundColor: finalConfig.backgroundColor,
      borderColor: finalConfig.borderColor,
      elevation: finalConfig.elevation,
    },
    customStyle,
  ];

  return (
    <LinearGradient
      colors={gradientColors as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={containerStyle}
    >
      <View style={styles.tabBarContainer}>
        {children}
      </View>
    </LinearGradient>
  );
};

interface FlexibleTabIconProps {
  focused: boolean;
  iconName: string;
  label?: string;
  customConfig?: Partial<TabIconConfig>;
  onPress?: () => void;
}

export const FlexibleTabIcon: React.FC<FlexibleTabIconProps> = ({
  focused,
  iconName,
  label,
  customConfig,
  onPress,
}) => {
  const { tabIconConfig } = useTabConfig();
  
  // Merge custom config with default config
  const finalConfig = { ...tabIconConfig, ...customConfig };

  const iconColor = focused ? finalConfig.activeColor : finalConfig.inactiveColor;
  const labelColor = focused ? finalConfig.labelActiveColor : finalConfig.labelInactiveColor;

  const containerStyle = [
    styles.iconContainer,
    finalConfig.containerStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={iconName as any} 
        size={finalConfig.size} 
        color={iconColor} 
      />
      {label && (
        <Text style={[
          styles.label,
          {
            color: labelColor,
            fontSize: finalConfig.labelSize,
          }
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

interface FlexibleCustomButtonProps {
  iconName: string;
  onPress?: () => void;
  customConfig?: {
    size?: number;
    backgroundColor?: string;
    borderColor?: string;
    shadow?: any;
  };
}

export const FlexibleCustomButton: React.FC<FlexibleCustomButtonProps> = ({
  iconName,
  onPress,
  customConfig,
}) => {
  const { tabConfig } = useTabConfig();
  const { theme } = useTheme();

  const buttonConfig = tabConfig.customButtonConfig;
  const finalConfig = { ...buttonConfig, ...customConfig };

  const buttonStyle = [
    styles.customButton,
    {
      width: finalConfig.size,
      height: finalConfig.size,
      borderRadius: finalConfig.size! / 2,
      backgroundColor: finalConfig.backgroundColor,
      borderColor: finalConfig.borderColor,
      ...finalConfig.shadow,
    },
  ];

  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={buttonStyle}>
        <Ionicons 
          name={iconName as any} 
          size={finalConfig.size! * 0.8} 
          color={theme.colors.text.primary} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabBarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    fontWeight: '500',
  },
  customButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
}); 