import React, { useState } from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import EmailScreen from './EmailScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

export type AuthStackParamList = {
  Email: undefined;
  Login: { email: string };
  Register: { email: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Email" component={EmailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
