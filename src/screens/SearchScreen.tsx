import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useMovies } from '../context/MovieContext';
import { AppText } from '../components/AppText';
import { Movie } from '../types';
import { movieApiService } from '../api/movieService';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2; // 2 columns with padding

interface SearchScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { state } = useTheme();
  const { theme } = state;
  
  const {
    state: movieState,
    searchMovies,
    discoverMoviesByGenre,
    clearSearchResults,
    clearError,
    fetchGenres,
  } = useMovies();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showResultsHeader, setShowResultsHeader] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    clearSearchResults();
    fetchGenres();
  }, []);

  const handleSearch = async (query: string, showHeader: boolean = false) => {
    if (query.trim().length < 2) {
      clearSearchResults();
      setShowResultsHeader(false);
      setIsTyping(false);
      return;
    }

    setIsSearching(true);
    try {
      await searchMovies(query.trim());
      if (showHeader) {
        setShowResultsHeader(true);
        setIsTyping(false);
      } else {
        setIsTyping(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenrePress = async (genreId: number) => {
    setIsSearching(true);
    try {
      await discoverMoviesByGenre(genreId);
    } catch (error) {
      console.error('Genre search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearchResults();
    setShowResultsHeader(false);
    setIsTyping(false);
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  const handleBackPress = () => {
    clearSearchResults();
    setSearchQuery('');
    setShowResultsHeader(false);
    setIsTyping(false);
    navigation.goBack();
  };

  const getImageUrl = (posterPath: string | null): string => {
    if (!posterPath) return '';
    return movieApiService.getImageUrl(posterPath, 'w500');
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieResultCard}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >

      
      <Image
        source={{ uri: getImageUrl(item.poster_path) }}
        style={styles.movieThumbnail}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <AppText variant="bold" size="lg" color="textPrimary" style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText variant="regular" size="sm" color="textSecondary" style={styles.movieGenre}>
          {item.genre_ids && item.genre_ids.length > 0 
            ? movieState.genres
                .filter(genre => item.genre_ids?.includes(genre.id))
                .slice(0, 1)
                .map(genre => genre.name)
                .join(', ')
            : 'Movie'
          }
        </AppText>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <AppText variant="bold" size="xl" color="primary" style={styles.moreButtonText}>
          ⋯
        </AppText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (searchQuery.length === 0) {
      return (
        <View style={styles.genresContainer}>
          {/* <AppText variant="semiBold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Browse by Genre
          </AppText> */}
          <View style={styles.genresGrid}>
            {movieState.genres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={styles.genreCard}
                onPress={() => handleGenrePress(genre.id)}
                activeOpacity={0.8}
              >
                {genre.backdrop ? (
                  <Image
                    source={{ uri: genre.backdrop }}
                    style={styles.genreImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.genreImage, { backgroundColor: theme.colors.border }]} />
                )}
                
                {/* Linear Gradient Overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
                  locations={[0, 0.6, 1]}
                  style={styles.genreGradientOverlay}
                />
                
                {/* Genre Name */}
                <View style={styles.genreNameContainer}>
                  <AppText variant="bold"  size="lg" weight="medium" color="textLight" style={styles.genreName}>
                    {genre.name}
                  </AppText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <AppText variant="medium" size="md" color="textSecondary" style={styles.emptyText}>
          No results found for "{searchQuery}"
        </AppText>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        {showResultsHeader && movieState.searchResults.length > 0 ? (
          <View style={styles.resultsHeader}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <AppText variant="medium" size="lg" color="textPrimary">
                ←
              </AppText>
            </TouchableOpacity>
            <AppText variant="bold" size="lg" color="textPrimary">
              {movieState.searchResults.length} Results Found
            </AppText>
          </View>
        ) : (
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <AppText variant="medium" size="lg" color="textPrimary">
                ←
              </AppText>
            </TouchableOpacity>
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
              <AppText variant="medium" size="md" color="textSecondary">
                🔍
              </AppText>
              <TextInput
                style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                placeholder="TV shows, movies and more"
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  
                  // Clear previous timeout
                  if (searchTimeout) {
                    clearTimeout(searchTimeout);
                  }
                  
                  // Set new timeout for instant search (without header)
                  const timeoutId = setTimeout(() => {
                    handleSearch(text, false); // Don't show header while typing
                  }, 300);
                  
                  setSearchTimeout(timeoutId);
                }}
                onSubmitEditing={() => {
                  // Keep keyboard open and show results header
                  if (searchQuery.trim().length >= 2) {
                    handleSearch(searchQuery, true); // Show header when Search is pressed
                  }
                }}
                returnKeyType="search"
                blurOnSubmit={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch}>
                  <AppText variant="medium" size="md" color="textSecondary">
                    ✕
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isTyping && movieState.searchResults.length > 0 && (
          <View style={styles.topResultsHeader}>
            <AppText variant="bold" size="lg" color="textPrimary">
              Top Results
            </AppText>
            <View style={styles.divider} />
          </View>
        )}
        <FlatList
          data={movieState.searchResults}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topResultsHeader: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 12,
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 15,
  },
  movieResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    marginBottom: 15,
  },
  movieThumbnail: {
    width: 170,
    height: 110,
    borderRadius: 12,
    marginRight: 16,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    marginBottom: 6,
    fontSize: 18,
  },
  movieGenre: {
    fontSize: 14,
  },
  moreButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
  },
  genresContainer: {
    paddingVertical: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreCard: {
    width: itemWidth,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  genreImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  genreGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
  genreNameContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  genreName: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingVertical: 7,
    paddingHorizontal:5
  },
});

export default SearchScreen;