import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Platform } from 'react-native';

interface UseHideBottomTabsOptions {
  /**
   * Whether to hide bottom tabs when this screen is focused
   * @default true
   */
  hideOnFocus?: boolean;
  
  /**
   * Whether to restore bottom tabs when leaving this screen
   * @default true
   */
  restoreOnUnfocus?: boolean;
  
  /**
   * Custom delay before restoring tabs (in milliseconds)
   * @default 100
   */
  restoreDelay?: number;
}

/**
 * Custom hook to hide bottom tabs for specific screens
 * 
 * @param navigation - Navigation object from React Navigation
 * @param options - Configuration options for tab hiding behavior
 * 
 * @example
 * ```tsx
 * // Basic usage - hide tabs when screen is focused
 * useHideBottomTabs(navigation);
 * 
 * // Advanced usage with options
 * useHideBottomTabs(navigation, {
 *   hideOnFocus: true,
 *   restoreOnUnfocus: true,
 *   restoreDelay: 200
 * });
 * 
 * // Hide tabs but don't restore them (useful for child screens)
 * useHideBottomTabs(navigation, {
 *   hideOnFocus: true,
 *   restoreOnUnfocus: false
 * });
 * ```
 */
export const useHideBottomTabs = (
  navigation: any,
  options: UseHideBottomTabsOptions = {}
) => {
  const { state } = useTheme();
  const { theme } = state;
  
  const {
    hideOnFocus = true,
    restoreOnUnfocus = true,
    restoreDelay = 100
  } = options;

  // Function to hide tabs with multiple strategies
  const hideTabs = useCallback(() => {
    // Strategy 1: Direct parent
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }

    // Strategy 2: Grandparent (in case of nested navigators)
    const grandparent = navigation.getParent()?.getParent();
    if (grandparent) {
      grandparent.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }

    // Strategy 3: Try to find tab navigator by going up the hierarchy
    let currentNav = navigation;
    for (let i = 0; i < 5; i++) { // Try up to 5 levels
      currentNav = currentNav.getParent();
      if (currentNav) {
        try {
          currentNav.setOptions({
            tabBarStyle: { display: 'none' }
          });
        } catch (error) {
          // Ignore errors - this navigator might not have tabBarStyle
        }
      } else {
        break;
      }
    }
  }, [navigation]);

  // Function to restore tabs with multiple strategies
  const restoreTabs = useCallback(() => {
    const defaultTabBarStyle = {
      position: 'absolute' as const,
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
    };

    // Strategy 1: Direct parent
    const parent = navigation.getParent();
    if (parent) {
      try {
        parent.setOptions({
          tabBarStyle: defaultTabBarStyle
        });
      } catch (error) {
        // Ignore errors
      }
    }

    // Strategy 2: Grandparent
    const grandparent = navigation.getParent()?.getParent();
    if (grandparent) {
      try {
        grandparent.setOptions({
          tabBarStyle: defaultTabBarStyle
        });
      } catch (error) {
        // Ignore errors
      }
    }

    // Strategy 3: Try to find tab navigator by going up the hierarchy
    let currentNav = navigation;
    for (let i = 0; i < 5; i++) { // Try up to 5 levels
      currentNav = currentNav.getParent();
      if (currentNav) {
        try {
          currentNav.setOptions({
            tabBarStyle: defaultTabBarStyle
          });
        } catch (error) {
          // Ignore errors - this navigator might not have tabBarStyle
        }
      } else {
        break;
      }
    }
  }, [navigation, theme.colors.bottomTabBackground]);

  // Hide tabs when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!hideOnFocus) return;

      // Hide tabs immediately
      hideTabs();

      // Hide tabs again after a short delay to ensure it sticks
      const timeout1 = setTimeout(hideTabs, 50);
      const timeout2 = setTimeout(hideTabs, 100);
      const timeout3 = setTimeout(hideTabs, 200);

      // Cleanup function
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        
        if (!restoreOnUnfocus) return;
        
        setTimeout(() => {
          restoreTabs();
        }, restoreDelay);
      };
    }, [hideOnFocus, restoreOnUnfocus, restoreDelay, hideTabs, restoreTabs])
  );

  // Continuous monitoring to ensure tabs stay hidden
  useEffect(() => {
    if (!hideOnFocus) return;

    const interval = setInterval(() => {
      hideTabs();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [hideOnFocus, hideTabs]);

  // Return functions for manual control if needed
  return {
    hideTabs,
    restoreTabs
  };
};

export default useHideBottomTabs;
