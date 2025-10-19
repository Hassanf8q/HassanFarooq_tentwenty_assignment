/**
 * HassanFarooq_tentwenty_assignment
 * React Native Movie Booking App
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { MovieProvider } from './src/context/MovieContext';
import AppNavigator from './src/navigation/AppNavigator';
import CustomStatusBar from './src/components/CustomStatusBar';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MovieProvider>
        <CustomStatusBar barStyle="dark-content" backgroundColor="white" />
        <AppNavigator />
      </MovieProvider>
    </ThemeProvider>
  );
};

export default App;
