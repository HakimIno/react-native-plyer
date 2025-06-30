import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { PlayerScreen } from '../screens/player/PlayerScreen';
import HomeScreen from '../screens/home/HomeScreen';
import AddVideoScreen from '../screens/addVideo/AddVideoScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Video Player',
            headerShown: false,
            animation: 'fade',
          }}
          
        />
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen}
          options={{
            title: 'Video Player',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="AddVideo" 
          component={AddVideoScreen}
          options={{
            title: 'Add Video',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 