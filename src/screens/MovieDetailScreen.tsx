import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { AppText } from '../components/AppText';
import { Movie, MovieDetails } from '../types';
import { movieApiService } from '../api/movieService';
import { movieTrailerService } from '../api/movieTrailerService';
import { useHideBottomTabs } from '../hooks';
import CustomStatusBar from '../components/CustomStatusBar';
import images from '../assets/images';
import AppImage from '../components/AppImage';
import { s, vs, spacing } from '../utils/responsive';

interface MovieDetailScreenProps {
  navigation: any;
  route: {
    params: {
      movie: Movie;
    };
  };
}

const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({ navigation, route }) => {
  const { state } = useTheme();
  const { theme } = state;
  
  const { movie: initialMovie } = route.params;
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  const loadMovieDetails = useCallback(async () => {
    try {
      const details = await movieApiService.getMovieDetails(initialMovie.id);
      setMovieDetails(details);
    } catch (error) {
      console.error('Error loading movie details:', error);
    }
  }, [initialMovie.id]);

  useEffect(() => {
    loadMovieDetails();
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, [loadMovieDetails]);

  // Hide bottom tabs when this screen is focused
  useHideBottomTabs(navigation);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleGetTickets = () => {
    navigation.navigate('SeatBooking', { movie: movieDetails || initialMovie });
  };

  const handleWatchTrailer = async () => {
    try {
      console.log('Fetching trailer for movie:', movie.id);
      const trailerUrl = await movieTrailerService.getMovieTrailer(movie.id);
      
      if (trailerUrl) {
        console.log('Trailer found, navigating to player:', trailerUrl);
        navigation.navigate('VideoPlayer', { 
          trailerUrl,
          movieTitle: movie.title 
        });
      } else {
        Alert.alert(
          'No Trailer Available',
          'Sorry, no trailer is available for this movie at the moment.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      Alert.alert(
        'Error',
        'Unable to load the trailer. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const getBackdropUrl = (backdropPath: string | null): string => {
    if (!backdropPath) return '';
    return movieApiService.getBackdropUrl(backdropPath, 'w1280');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const movie = movieDetails || initialMovie;
  const isLandscape = screenData.width > screenData.height;

  return (
    <View style={styles.container}>
      {/* Status Bar - Responsive */}
      <CustomStatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent
      />
      
      {isLandscape ? (
        // Landscape Layout - Two Column Split
        <View style={styles.landscapeContainer}>
          {/* Left Column - Movie Image */}
          <View style={styles.landscapeImageColumn}>
            <Image
              source={{ uri: getBackdropUrl(movie.backdrop_path) }}
              style={styles.landscapeMovieImage}
              resizeMode="cover"
            />
            
            {/* Linear Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,1)']}
              locations={[0, 0.5, 1]}
              style={styles.landscapeMovieOverlay}
            />
            
            {/* Header Overlay */}
            <View style={styles.landscapeHeaderOverlay}>
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <AppImage source={images.back} size={15} tintColor={'white'} />
              </TouchableOpacity>
              <AppText variant="bold" weight="bold" size="xxl" color="textLight">
                Watch
              </AppText>
            </View>
            
            {/* Movie Title and Info */}
            <View style={styles.landscapeMovieInfoOverlay}>
              <AppText variant="bold" size="xl" color="textLight" style={styles.movieTitle}>
                {movie.title}
              </AppText>
              {movie.release_date && (
                <AppText variant="medium" size="md" weight="semiBold" color="textLight" style={styles.releaseDate}>
                  In Theaters {formatDate(movie.release_date)}
                </AppText>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.landscapeButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.landscapeGetTicketsButton,
                  { backgroundColor: theme.colors.primary },
                  Platform.OS === 'android' && { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6 }
                ]}
                onPress={handleGetTickets}
              >
                <AppText variant="bold" size="lg" weight="semiBold" color="textLight">
                  Get Tickets
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.landscapeWatchTrailerButton,
                  { borderColor: theme.colors.textLight },
                  Platform.OS === 'android' && { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 6, marginLeft: 6 }
                ]}
                onPress={handleWatchTrailer}
              >
                <AppText variant="medium" size="md" color="textLight" style={[styles.playIcon, Platform.OS === 'android' && { marginRight: 6 }]}>
                  ▶
                </AppText>
                <AppText variant="bold" size="lg" weight="semiBold" color="textLight">
                  Watch Trailer
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column - Details */}
          <View style={styles.landscapeDetailsColumn}>
            <ScrollView 
              style={styles.landscapeScrollContainer} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.landscapeScrollContent}
            >
              {/* Details Section */}
              <View style={styles.landscapeDetailsSection}>
                {/* Genres */}
                {movieDetails?.genres && movieDetails.genres.length > 0 && (
                  <View style={styles.genresContainer}>
                    <AppText variant="bold" size="xl" color="textPrimary" style={styles.sectionTitle}>
                      Genres
                    </AppText>
                    <View style={styles.genresList}>
                      {movieDetails.genres.map((genre, index) => (
                        <View
                          key={genre.id}
                          style={[
                            styles.genreTag,
                            {
                              backgroundColor: [
                                theme.colors.teal,
                                theme.colors.pink,
                                theme.colors.purple,
                                theme.colors.gold,
                              ][index % 4],
                            },
                          ]}
                        >
                          <AppText variant="medium" size="sm" color="textLight">
                            {genre.name}
                          </AppText>
                        </View>
                      ))}
                    </View>
                    
                    {/* Divider Line */}
                    <View style={styles.divider} />
                  </View>
                )}

                {/* Overview */}
                <View style={styles.overviewContainer}>
                  <AppText variant="bold" size="xl" color="textPrimary" style={styles.sectionTitle}>
                    Overview
                  </AppText>
                  <AppText variant="regular" size="md" color="textSecondary" style={styles.overviewText}>
                    {movie.overview}
                  </AppText>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        // Portrait Layout - Original Design
        <>
          {/* Movie Image Section - Responsive */}
          <View style={[styles.imageSection, { height: isLandscape ? screenData.height * 0.7 : screenData.height * 0.6 }]}>
            <Image
              source={{ uri: getBackdropUrl(movie.backdrop_path) }}
              style={styles.movieImage}
              resizeMode="cover"
            />
            
            {/* Linear Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,1)']}
              locations={[0, 0.5, 1]}
              style={styles.movieOverlay}
            />
            
            {/* Header Overlay */}
            <View style={[styles.headerOverlay, styles.headerOverlayPortrait]}>
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <AppImage source={images.back} size={15} tintColor={'white'} />
              </TouchableOpacity>
              <AppText variant="bold" weight="bold" size="xl" color="textLight">
                Watch
              </AppText>
            </View>
            
            {/* Movie Title and Info - Center Aligned */}
            <View style={[styles.movieInfoOverlay, styles.movieInfoOverlayPortrait]}>
              <AppText variant="bold" size={isLandscape ? "xl" : "xxl"} color="textLight" style={styles.movieTitle}>
                {movie.title}
              </AppText>
              {movie.release_date && (
                <AppText variant="medium" size="md" weight="semiBold" color="textLight" style={styles.releaseDate}>
                  In Theaters {formatDate(movie.release_date)}
                </AppText>
              )}
            </View>

            {/* Action Buttons - Center Aligned */}
            <View style={[styles.buttonsContainer, styles.buttonsContainerPortrait]}>
              <TouchableOpacity
                style={[styles.getTicketsButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleGetTickets}
              >
                <AppText variant="bold" size="lg"  weight="semiBold" color="textLight">
                  Get Tickets
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.watchTrailerButton, { borderColor: theme.colors.textLight }]}
                onPress={handleWatchTrailer}
              >
                <AppText variant="medium" size="md" color="textLight" style={styles.playIcon}>
                  ▶
                </AppText>
                <AppText variant="bold" size="lg"  weight="semiBold" color="textLight">
                  Watch Trailer
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            style={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.colors.surface }]}
          >

            {/* Details Section */}
            <View style={[styles.detailsSection, { backgroundColor: theme.colors.surface }]}>
              {/* Genres */}
              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  <AppText variant="bold" size="xl" color="textPrimary" style={styles.sectionTitle}>
                    Genres
                  </AppText>
                  <View style={styles.genresList}>
                    {movieDetails.genres.map((genre, index) => (
                      <View
                        key={genre.id}
                        style={[
                          styles.genreTag,
                          {
                            backgroundColor: [
                              theme.colors.teal,
                              theme.colors.pink,
                              theme.colors.purple,
                              theme.colors.gold,
                            ][index % 4],
                          },
                        ]}
                      >
                        <AppText variant="medium" size="sm" color="textLight">
                          {genre.name}
                        </AppText>
                      </View>
                    ))}
                  </View>
                  
                  {/* Divider Line */}
                  <View style={styles.divider} />
                </View>
              )}

              {/* Overview */}
              <View style={styles.overviewContainer}>
                <AppText variant="bold" size="xl" color="textPrimary" style={styles.sectionTitle}>
                  Overview
                </AppText>
                <AppText variant="regular" size="sm" weight='regular' color="textSecondary" style={styles.overviewText}>
                  {movie.overview}
                </AppText>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageSection: {
    position: 'relative',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 140 : 170,
    width: '100%',
    justifyContent: 'flex-end',
  },
  movieInfoOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 70 : 80,
    left: Platform.OS === 'android' ? 16 : 20,
    right: Platform.OS === 'android' ? 16 : 20,
    alignItems: 'center',
  },
  movieTitle: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: Platform.OS === 'android' ? 5 : 8,
  },
  releaseDate: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 16 : 20,
    left: Platform.OS === 'android' ? 16 : 20,
    right: Platform.OS === 'android' ? 16 : 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
  },
  getTicketsButton: {
    width: '80%',
    paddingVertical: Platform.OS === 'android' ? 10 : 12,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    borderRadius: Platform.OS === 'android' ? 8 : 8,
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 10 : 12,
  },
  watchTrailerButton: {
    width: '80%',
    paddingVertical: Platform.OS === 'android' ? 10 : 12,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    borderRadius: Platform.OS === 'android' ? 8 : 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginRight: Platform.OS === 'android' ? 6 : 8,
  },
  detailsSection: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    paddingVertical: Platform.OS === 'android' ? 20 : 24,
    marginTop: -20,
    minHeight: 300,
  },
  genresContainer: {
    paddingVertical: Platform.OS === 'android' ? 10 : 15,
    marginBottom: Platform.OS === 'android' ? 1 : 24,
  },
  sectionTitle: {
   
    marginBottom: Platform.OS === 'android' ? 10 : 16,
    fontSize: Platform.OS === 'android' ? 18 : 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: Platform.OS === 'android' ? 10 : 20,
    marginBottom: 4,
  },
  genresList: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    paddingHorizontal: Platform.OS === 'android' ? 10 : 12,
    paddingVertical: Platform.OS === 'android' ? 5 : 6,
    borderRadius: Platform.OS === 'android' ? 14 : 16,
    marginRight: Platform.OS === 'android' ? 6 : 8,
    marginBottom: Platform.OS === 'android' ? 6 : 8,
  },
  overviewContainer: {
    
    // Overview container styling
  },
  overviewText: {
    lineHeight: Platform.OS === 'android' ? 20 : 22,
  },
  // Landscape Layout Styles
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeImageColumn: {
    flex: 1,
    position: 'relative',
  },
  landscapeMovieImage: {
    width: '100%',
    height: '100%',
  },
  landscapeMovieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    width: '100%',
    justifyContent: 'flex-end',
  },
  landscapeHeaderOverlay: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  landscapeMovieInfoOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  landscapeButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  landscapeDetailsColumn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  landscapeScrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  landscapeDetailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 60, // Account for status bar
  },
  landscapeScrollContent: {
    paddingBottom: 20,
  },
  // Portrait-specific styles
  headerOverlayPortrait: {
    top: 50,
  },
  movieInfoOverlayPortrait: {
    bottom: 140,
  },
  buttonsContainerPortrait: {
    bottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Landscape-specific button styles
  landscapeGetTicketsButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  landscapeWatchTrailerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default MovieDetailScreen;