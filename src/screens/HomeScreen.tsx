import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useMovies } from '../context/MovieContext';
import { AppText } from '../components/AppText';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types';

const HomeScreen: React.FC = () => {
  const { state, toggleTheme } = useTheme();
  const { theme } = state;
  
  const {
    state: movieState,
    fetchUpcomingMovies,
    fetchPopularMovies,
    fetchGenres,
    clearError,
  } = useMovies();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchUpcomingMovies();
    fetchPopularMovies();
    fetchGenres();
  }, []);

  const handleMoviePress = (movie: Movie) => {
    // Navigate to movie details
    console.log('Movie pressed:', movie.title);
    // TODO: Implement navigation to movie details
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    clearError();
    try {
      await Promise.all([
        fetchUpcomingMovies(),
        fetchPopularMovies(),
        fetchGenres(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Create sections data for FlatList
  const sections = [
    {
      id: 'header',
      type: 'header',
      data: [{ id: 'header-item' }],
    },
    {
      id: 'error',
      type: 'error',
      data: movieState.error ? [{ id: 'error-item' }] : [],
    },
    {
      id: 'upcoming',
      type: 'section',
      title: 'Upcoming Movies',
      data: movieState.upcomingMovies.slice(0, 5),
    },
    {
      id: 'popular',
      type: 'section',
      title: 'Popular Movies',
      data: movieState.popularMovies.slice(0, 5),
    },
    {
      id: 'categories',
      type: 'categories',
      data: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'],
    },
  ];

  const renderSectionItem = ({ item, section }: { item: any; section: any }) => {
    switch (section.type) {
      case 'header':
        return (
          <View style={styles.header}>
            <AppText variant="bold" size="xxl" color="textPrimary">
              Watch
            </AppText>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
              <AppText variant="medium" size="sm" color="primary">
                Toggle Theme
              </AppText>
            </TouchableOpacity>
          </View>
        );

      case 'error':
        return (
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
        );

      case 'section':
        return (
          <View style={styles.section}>
            <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
              {section.title}
            </AppText>
            <View style={styles.moviesList}>
              {section.data.map((movie: Movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onPress={handleMoviePress}
                  showGenres={true}
                  genres={movieState.genres}
                />
              ))}
            </View>
          </View>
        );

      case 'categories':
        return (
          <View style={styles.section}>
            <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
              Categories
            </AppText>
            <View style={styles.categoriesGrid}>
              {section.data.map((category: string) => (
                <TouchableOpacity 
                  key={category}
                  style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}
                >
                  <AppText variant="medium" size="sm" color="textPrimary">
                    {category}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        sections={sections}
        renderItem={renderSectionItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
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

export default HomeScreen;
