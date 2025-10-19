import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import MediaLibraryScreen from '../../screens/MediaLibraryScreen';
import MovieDetailScreen from '../../screens/MovieDetailScreen';

// Import types
import { MediaLibraryStackParamList } from '../types';

const Stack = createNativeStackNavigator<MediaLibraryStackParamList>();

const MediaLibraryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MediaLibraryMain"
        component={MediaLibraryScreen}
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

export default MediaLibraryStack;
