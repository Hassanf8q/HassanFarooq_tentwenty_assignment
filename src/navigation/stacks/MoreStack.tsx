import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import MoreScreen from '../../screens/MoreScreen';
import MovieDetailScreen from '../../screens/MovieDetailScreen';

// Import types
import { MoreStackParamList } from '../types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

const MoreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoreMain"
        component={MoreScreen}
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
