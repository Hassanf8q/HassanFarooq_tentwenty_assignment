import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import WatchScreen from '../../screens/WatchScreen';
import SearchScreen from '../../screens/SearchScreen';
import MovieDetailScreen from '../../screens/MovieDetailScreen';
import SimpleVideoPlayerScreen from '../../screens/SimpleVideoPlayerScreen';
import SeatBookingScreen from '../../screens/SeatBookingScreen';
import SeatSelectionScreen from '../../screens/SeatSelectionScreen';
import PaymentScreen from '../../screens/PaymentScreen';

// Import types
import { WatchStackParamList } from '../types';

const Stack = createNativeStackNavigator<WatchStackParamList>();

const WatchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WatchMain"
        component={WatchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={SimpleVideoPlayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeatBooking"
        component={SeatBookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeatSelection"
        component={SeatSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default WatchStack;
