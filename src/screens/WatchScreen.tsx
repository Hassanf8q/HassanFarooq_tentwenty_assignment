import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useMovies } from '../context/MovieContext';
import { AppText } from '../components/AppText';
import { Movie } from '../types';
import { movieApiService } from '../api/movieService';
import CustomStatusBar from '../components/CustomStatusBar';
import images from '../assets/images';
import AppImage from '../components/AppImage';

interface WatchScreenProps {
  navigation: any;
}

const WatchScreen: React.FC<WatchScreenProps> = ({ navigation }) => {
  const { state } = useTheme();
  const { theme } = state;
  
  const {
    state: movieState,
    fetchUpcomingMovies,
    fetchGenres,
  } = useMovies();

  const [refreshing, setRefreshing] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const hasFetchedData = useRef(false);

  useEffect(() => {
    // Only fetch data once when component mounts
    if (!hasFetchedData.current) {
      fetchUpcomingMovies();
      fetchGenres();
      hasFetchedData.current = true;
    }
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to prevent re-fetching

  // Use ref to avoid dependency issues
  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Simple tab restoration when screen is focused - similar to MovieDetailScreen approach
  useFocusEffect(
    useCallback(() => {
      // Restore tabs when WatchScreen is focused
      const restoreTabs = () => {
        const defaultTabBarStyle = {
          position: 'absolute' as const,
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 90 : 68,
          backgroundColor: themeRef.current.colors.bottomTabBackground || '#2E2739',
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

        // Try to find tab navigator by going up the hierarchy
        let currentNav = navigation;
        for (let i = 0; i < 5; i++) {
          currentNav = currentNav.getParent();
          if (currentNav) {
            try {
              currentNav.setOptions({
                tabBarStyle: defaultTabBarStyle
              });
            } catch {
              // Ignore errors
            }
          } else {
            break;
          }
        }
      };

      restoreTabs();
    }, [navigation])
  );

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUpcomingMovies(),
        fetchGenres(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getImageUrl = (posterPath: string | null): string => {
    if (!posterPath) return '';
    return movieApiService.getImageUrl(posterPath, 'w500');
  };

  const renderMovieItem = ({ item }: { item: Movie }) => {
    const isLandscape = screenData.width > screenData.height;
    const posterStyle = isLandscape 
      ? StyleSheet.flatten([styles.moviePoster, styles.moviePosterLandscape])
      : styles.moviePoster;
    
    return (
      <TouchableOpacity
        style={[styles.movieItem, isLandscape && styles.movieItemLandscape]}
        onPress={() => handleMoviePress(item)}
        activeOpacity={0.8}
      >
        <AppImage
          source={{ uri: getImageUrl(item.poster_path) }}
          style={posterStyle}
          fit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,1)']}
          locations={[0, 0.5, 1]}
          style={styles.movieOverlay}
        >
          <AppText weight="medium"  variant="bold" size="xl"  color="textLight" style={styles.movieTitle}>
            {item.title}
          </AppText>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomStatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <AppText weight="regular" variant="medium" size="xxl" color="textPrimary">
          Watch
        </AppText>
        <TouchableOpacity onPress={handleSearchPress} style={styles.searchButton}>
          <AppImage source={images.search} size={17} />
        </TouchableOpacity>
      </View>

      {/* Movie List */}
      <FlatList
        key={screenData.width > screenData.height ? 'landscape' : 'portrait'}
        data={movieState.upcomingMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={screenData.width > screenData.height ? 2 : 1}
        contentContainerStyle={styles.movieList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.textPrimary}
            colors={[theme.colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchButton: {
    padding: 8,
  },
  movieList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 100, // Add space for bottom tab bar
  },
  movieItem: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  moviePoster: {
    width: '100%',
    height: Platform.OS === 'android' ? 180 : 220,


  },
  movieOverlay: {
    // backgroundColor:'pink',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    width: '100%',
    justifyContent: 'flex-end',

  },
  movieTitle: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  // Landscape-specific styles
  movieItemLandscape: {
    flex: 1,
    marginHorizontal: 4,
  },
  moviePosterLandscape: {
    height: Platform.OS === 'android' ? 150 : 180,
  },
});

export default WatchScreen;
