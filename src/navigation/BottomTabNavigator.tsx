import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from '../screens/home/HomeScreen';
import AddVideoScreen from '../screens/addVideo/AddVideoScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { BottomTabParamList } from '../types';

// Types
interface TabIconProps {
  focused: boolean;
  iconName: string;
  outlineIconName: string;
  label: string;
  size?: number;
  iconType?: 'ionicons' | 'octicons';
}

interface CustomTabBarButtonProps {
  onPress?: (e: any) => void;
}

interface TabScreenConfig {
  name: keyof BottomTabParamList;
  component: React.ComponentType<any>;
  iconName?: string;
  outlineIconName?: string;
  label?: string;
  size?: number;
  iconType?: 'ionicons' | 'octicons';
  isAddButton?: boolean;
}

// Constants
const TAB_BAR_CONFIG = {
  height: 70,
  iconSize: 24,
  addButtonSize: 40,
  addButtonRadius: 25,
  labelFontSize: 9,
  marginTop: 20,
} as const;

const COLORS = {
  primary: '#ffffff',
  secondary: '#748c94',
  addButton: '#FFF',
  gradient: {
    start: 'rgba(0, 0, 0, 1)',
    middle: 'rgb(9, 2, 31)',
    end: 'rgba(0, 0, 0, 1)',
  },
  border: 'rgba(255, 255, 255, 0.1)',
} as const;

const GRADIENT_CONFIG = {
  colors: [COLORS.gradient.start, COLORS.gradient.middle, COLORS.gradient.end],
  start: { x: 0, y: 0 },
  end: { x: 0.8, y: 0 },
} as const;

// Styles
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderColor: 'rgba(28, 10, 10, 0)',
    elevation: 10,
    height: TAB_BAR_CONFIG.height,
  },
  gradientTabBar: {
    flex: 1,
    overflow: 'hidden',
  },
  tabBarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
    marginTop: TAB_BAR_CONFIG.marginTop,
  },
  tabLabel: {
    fontSize: TAB_BAR_CONFIG.labelFontSize,
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  addButton: {
    width: TAB_BAR_CONFIG.addButtonSize + 5,
    height: TAB_BAR_CONFIG.addButtonSize + 5,
    borderRadius: TAB_BAR_CONFIG.addButtonRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Tab Icon Component
const TabIcon: React.FC<TabIconProps> = ({ 
  focused, 
  iconName, 
  outlineIconName, 
  label, 
  size = TAB_BAR_CONFIG.iconSize,
  iconType = 'ionicons' 
}) => {
  const iconColor = focused ? COLORS.primary : COLORS.secondary;
  const textColor = focused ? COLORS.primary : COLORS.secondary;
  
  const IconComponent = iconType === 'octicons' ? Octicons : Ionicons;
  const iconToShow = focused ? iconName : outlineIconName;

  return (
    <View style={styles.tabIconContainer}>
      <IconComponent name={iconToShow as any} size={size} color={iconColor} />
      <Text style={[styles.tabLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
};

// Custom Add Button Component
const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.addButtonContainer} onPress={onPress}>
    <View style={styles.addButton}>
      <Ionicons name="add" size={TAB_BAR_CONFIG.addButtonSize} color={COLORS.addButton} />
    </View>
  </TouchableOpacity>
);

// Custom Tab Bar Background Component
const CustomTabBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <LinearGradient
    colors={GRADIENT_CONFIG.colors}
    start={GRADIENT_CONFIG.start}
    end={GRADIENT_CONFIG.end}
    style={styles.gradientTabBar}
  >
    <View style={styles.tabBarContainer}>
      {children}
    </View>
  </LinearGradient>
);

// Tab Configuration
const TAB_SCREENS: TabScreenConfig[] = [
  {
    name: 'Home',
    component: HomeScreen,
    iconName: 'home',
    outlineIconName: 'home-outline',
    label: 'Home',
  },
  {
    name: 'Clips',
    component: HomeScreen,
    iconName: 'compass',
    outlineIconName: 'compass-outline',
    label: 'Clips',
    size: 26,
  },
  {
    name: 'AddVideo',
    component: AddVideoScreen,
    isAddButton: true,
  },
  {
    name: 'Follow',
    component: HomeScreen,
    iconName: 'bonfire',
    outlineIconName: 'bonfire-outline',
    label: 'Follow',
  },
  {
    name: 'Settings',
    component: SettingsScreen,
    iconName: 'settings',
    outlineIconName: 'settings-outline',
    label: 'Settings',
  },
];

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <CustomTabBar />,
      }}
    >
      {TAB_SCREENS.map((screen) => {
        if (screen.isAddButton) {
          return (
            <Tab.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
              options={{
                tabBarShowLabel: false,
                tabBarIcon: () => (
                  <Ionicons name="add" size={TAB_BAR_CONFIG.addButtonSize} color={COLORS.addButton} />
                ),
                tabBarButton: (props) => <CustomTabBarButton {...props} />,
              }}
            />
          );
        }

        return (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  iconName={screen.iconName!}
                  outlineIconName={screen.outlineIconName!}
                  label={screen.label!}
                  size={screen.size}
                  iconType={screen.iconType}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;