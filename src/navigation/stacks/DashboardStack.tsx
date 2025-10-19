import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import DashboardScreen from '../../screens/DashboardScreen';
import MovieDetailScreen from '../../screens/MovieDetailScreen';

// Import types
import { DashboardStackParamList } from '../types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;
