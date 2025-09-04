import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { TabConfigProvider } from './src/contexts/TabConfigContext';
import { useFonts } from 'expo-font'
import { View, Text } from 'react-native';

// Wrapper component to provide theme to TabConfigProvider
const AppWithProviders: React.FC = () => {
  const { theme } = useTheme();
  const [fontsLoaded] = useFonts({
    // Thai fonts
    'Anuphan-Thai-100': require('./assets/fonts/anuphan-thai-100-normal.ttf'),
    'Anuphan-Thai-200': require('./assets/fonts/anuphan-thai-200-normal.ttf'),
    'Anuphan-Thai-300': require('./assets/fonts/anuphan-thai-300-normal.ttf'),
    'Anuphan-Thai-400': require('./assets/fonts/anuphan-thai-400-normal.ttf'),
    'Anuphan-Thai-500': require('./assets/fonts/anuphan-thai-500-normal.ttf'),
    'Anuphan-Thai-600': require('./assets/fonts/anuphan-thai-600-normal.ttf'),
    'Anuphan-Thai-700': require('./assets/fonts/anuphan-thai-700-normal.ttf'),
    
    // Latin fonts
    'Anuphan-Latin-100': require('./assets/fonts/anuphan-latin-100-normal.ttf'),
    'Anuphan-Latin-200': require('./assets/fonts/anuphan-latin-200-normal.ttf'),
    'Anuphan-Latin-300': require('./assets/fonts/anuphan-latin-300-normal.ttf'),
    'Anuphan-Latin-400': require('./assets/fonts/anuphan-latin-400-normal.ttf'),
    'Anuphan-Latin-500': require('./assets/fonts/anuphan-latin-500-normal.ttf'),
    'Anuphan-Latin-600': require('./assets/fonts/anuphan-latin-600-normal.ttf'),
    'Anuphan-Latin-700': require('./assets/fonts/anuphan-latin-700-normal.ttf'),
    
    // Latin Extended fonts (for additional Latin characters)
    'Anuphan-LatinExt-100': require('./assets/fonts/anuphan-latin-ext-100-normal.ttf'),
    'Anuphan-LatinExt-200': require('./assets/fonts/anuphan-latin-ext-200-normal.ttf'),
    'Anuphan-LatinExt-300': require('./assets/fonts/anuphan-latin-ext-300-normal.ttf'),
    'Anuphan-LatinExt-400': require('./assets/fonts/anuphan-latin-ext-400-normal.ttf'),
    'Anuphan-LatinExt-500': require('./assets/fonts/anuphan-latin-ext-500-normal.ttf'),
    'Anuphan-LatinExt-600': require('./assets/fonts/anuphan-latin-ext-600-normal.ttf'),
    'Anuphan-LatinExt-700': require('./assets/fonts/anuphan-latin-ext-700-normal.ttf'),
  });

  if (!fontsLoaded) {
    return <View><Text>Loading fonts...</Text></View>;
  }

  return (
    <TabConfigProvider theme={theme}>
      <AppNavigator />
    </TabConfigProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppWithProviders />
      </ThemeProvider>
    </Provider>
  );
} 