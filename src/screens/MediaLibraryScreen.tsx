import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useMovies } from '../context/MovieContext';
import { AppText } from '../components/AppText';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types';

interface MediaLibraryScreenProps {
  navigation: any;
}

const MediaLibraryScreen: React.FC<MediaLibraryScreenProps> = ({ navigation }) => {
  const { state, toggleTheme } = useTheme();
  const { theme } = state;
  
  const {
    state: movieState,
    fetchUpcomingMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    fetchGenres,
    clearError,
  } = useMovies();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchUpcomingMovies();
    fetchPopularMovies();
    fetchTopRatedMovies();
    fetchNowPlayingMovies();
    fetchGenres();
  }, []);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    clearError();
    try {
      await Promise.all([
        fetchUpcomingMovies(),
        fetchPopularMovies(),
        fetchTopRatedMovies(),
        fetchNowPlayingMovies(),
        fetchGenres(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderMovieList = (movies: Movie[], title: string) => {
    if (movieState.loading && movies.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <AppText variant="medium" size="sm" color="textSecondary" style={styles.loadingText}>
            Loading {title.toLowerCase()}...
          </AppText>
        </View>
      );
    }

    if (movies.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <AppText variant="medium" size="sm" color="textSecondary">
            No {title.toLowerCase()} yet
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.moviesList}>
        {movies.slice(0, 5).map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onPress={handleMoviePress}
            showGenres={true}
            genres={movieState.genres}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <AppText variant="bold" size="xxl" color="textPrimary">
            Media Library
          </AppText>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <AppText variant="medium" size="sm" color="primary">
              Toggle Theme
            </AppText>
          </TouchableOpacity>
        </View>

        {movieState.error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
            <AppText variant="medium" size="sm" color="error">
              {movieState.error}
            </AppText>
            <TouchableOpacity onPress={clearError} style={styles.retryButton}>
              <AppText variant="medium" size="sm" color="primary">
                Retry
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            My Favorites
          </AppText>
          <View style={styles.emptyContainer}>
            <AppText variant="medium" size="sm" color="textSecondary">
              No favorites yet
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Watchlist
          </AppText>
          <View style={styles.emptyContainer}>
            <AppText variant="medium" size="sm" color="textSecondary">
              No watchlist yet
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Recently Watched
          </AppText>
          <View style={styles.emptyContainer}>
            <AppText variant="medium" size="sm" color="textSecondary">
              No recently watched yet
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Recommended for You
          </AppText>
          {renderMovieList(movieState.popularMovies, 'Recommended for You')}
        </View>

        <View style={styles.section}>
          <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Trending Now
          </AppText>
          {renderMovieList(movieState.topRatedMovies, 'Trending Now')}
        </View>

        <View style={styles.section}>
          <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Browse by Genre
          </AppText>
          
          <View style={styles.categoriesGrid}>
            {movieState.genres.slice(0, 6).map((genre) => (
              <TouchableOpacity 
                key={genre.id}
                style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}
              >
                <AppText variant="medium" size="sm" color="textPrimary">
                  {genre.name}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:50
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(97, 195, 242, 0.1)',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  moviesList: {
    // Container for movie cards
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(97, 195, 242, 0.1)',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MediaLibraryScreen;
