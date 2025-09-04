import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { PlayerScreen } from '../screens/player/PlayerScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from '../screens/auth/AuthNavigator';
import { GlobalPiPOverlay } from '../components/common';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isAuthenticated = true

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'MainTabs' : 'AuthNavigator'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />

      </Stack.Navigator>
      <GlobalPiPOverlay />
    </NavigationContainer>
  );
};

export default AppNavigator; 