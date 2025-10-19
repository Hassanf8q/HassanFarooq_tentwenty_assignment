import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AppText } from './AppText';
import { Movie } from '../types';
import { movieApiService } from '../api/movieService';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  showGenres?: boolean;
  genres?: Array<{ id: number; name: string }>;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  showGenres = false,
  genres = [],
}) => {
  const { state } = useTheme();
  const { theme } = state;

  const getGenreNames = (genreIds: number[]): string[] => {
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getImageUrl = (posterPath: string | null): string => {
    if (!posterPath) return '';
    return movieApiService.getImageUrl(posterPath, 'w500');
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {movie.poster_path ? (
          <Image
            source={{ uri: getImageUrl(movie.poster_path) }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: theme.colors.border }]}>
            <AppText variant="medium" size="sm" color="textSecondary">
              No Image
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <AppText variant="semiBold" size="md" color="textPrimary" style={styles.title} numberOfLines={2}>
          {movie.title}
        </AppText>

        {movie.release_date && (
          <AppText variant="regular" size="sm" color="textSecondary" style={styles.releaseDate}>
            {formatDate(movie.release_date)}
          </AppText>
        )}

        {showGenres && movie.genre_ids && movie.genre_ids.length > 0 && (
          <View style={styles.genresContainer}>
            {getGenreNames(movie.genre_ids).slice(0, 2).map((genre, index) => (
              <View key={index} style={[styles.genreTag, { backgroundColor: theme.colors.primary }]}>
                <AppText variant="regular" size="xs" color="textLight">
                  {genre}
                </AppText>
              </View>
            ))}
          </View>
        )}

        <View style={styles.ratingContainer}>
          <AppText variant="medium" size="sm" color="textSecondary">
            ⭐ {movie.vote_average.toFixed(1)}/10
          </AppText>
          <AppText variant="regular" size="xs" color="textSecondary">
            ({movie.vote_count} votes)
          </AppText>
        </View>

        {movie.overview && (
          <AppText variant="regular" size="xs" color="textSecondary" style={styles.overview} numberOfLines={3}>
            {movie.overview}
          </AppText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 12,
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 4,
  },
  releaseDate: {
    marginBottom: 8,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  genreTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overview: {
    lineHeight: 16,
  },
});
