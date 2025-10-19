import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from '../../screens/HomeScreen';
import MovieDetailScreen from '../../screens/MovieDetailScreen';

// Import types
import { MoreStackParamList } from '../types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

const MoreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoreMain"
        component={HomeScreen}
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

export default MoreStack;
