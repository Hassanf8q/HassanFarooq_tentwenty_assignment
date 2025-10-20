import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { Platform, Image } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { WatchStack, DashboardStack, MediaLibraryStack, MoreStack } from './stacks';
import images from '../assets/images';

// Enable screens for better performance
enableScreens();

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { state } = useTheme();
  const { theme } = state;

  return (
    <Tab.Navigator
      initialRouteName="Watch"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource: any;

          if (route.name === 'Dashboard') {
            iconSource = images.dashboard;
          } else if (route.name === 'Watch') {
            iconSource = images.watch;
          } else if (route.name === 'MediaLibrary') {
            iconSource = images.library;
          } else if (route.name === 'More') {
            iconSource = images.more;
          } else {
            iconSource = images.more; // fallback
          }

          return (
            <Image 
              source={iconSource} 
              style={{ 
                width: Platform.OS === 'android' ? 18 : 22, 
                height: Platform.OS === 'android' ? 18 : 22, 
                tintColor: color,
                opacity: focused ? 1 : 0.6 
              }} 
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: theme.colors.textLight, // usually white
        tabBarInactiveTintColor: theme.colors.textSecondary, // light gray
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 90 : 68,
          backgroundColor: theme.colors.bottomTabBackground || '#2E2739',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: Platform.OS === 'ios' ? 8 : 6,
          paddingHorizontal: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.medium,
          fontSize: theme.fonts.sizes.xs,
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Watch" 
        component={WatchStack}
        options={{ tabBarLabel: 'Watch' }}
      />
      <Tab.Screen 
        name="MediaLibrary" 
        component={MediaLibraryStack}
        options={{ tabBarLabel: 'Media Library' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreStack}
        options={{ tabBarLabel: 'More' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => (
  <NavigationContainer>
    <BottomTabs />
  </NavigationContainer>
);

export default AppNavigator;
