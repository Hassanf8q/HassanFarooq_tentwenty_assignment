import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/apiConfig';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 10000,
    params: {
      api_key: API_CONFIG.API_KEY,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// API client instance
export const apiClient = createApiClient();

// Request interceptor for logging (optional)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service Class
export class MovieApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = apiClient;
  }

  // Get upcoming movies
  async getUpcomingMovies(page: number = 1): Promise<any> {
    try {
      const response = await this.client.get(API_ENDPOINTS.MOVIES.UPCOMING, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<any> {
    try {
      const response = await this.client.get(API_ENDPOINTS.MOVIES.POPULAR, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<any> {
    try {
      const response = await this.client.get(API_ENDPOINTS.MOVIES.TOP_RATED, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }

  // Get now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<any> {
    try {
      const response = await this.client.get(API_ENDPOINTS.MOVIES.NOW_PLAYING, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<any> {
    try {
      const response = await this.client.get(API_ENDPOINTS.MOVIES.DETAILS(movieId.toString()));
      console.log("MOVIE RESPONSE IS ", response)
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  // Get movie images
  async getMovieImages(movieId: number): Promise<any> {
    try {
      const response = await this.client.get(`/movie/${movieId}/images`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie images:', error);
      throw error;
    }
  }

  // Get movie videos/trailers
  async getMovieVideos(movieId: number): Promise<any> {
    try {
      const response = await this.client.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      throw error;
    }
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<any> {
    try {
      const response = await this.client.get(API_ENDPOINTS.MOVIES.SEARCH, {
        params: { 
          query,
          page,
          include_adult: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  // Discover movies by genre
  async discoverMoviesByGenre(genreId: number, page: number = 1): Promise<any> {
    try {
      const response = await this.client.get('/discover/movie', {
        params: { 
          with_genres: genreId,
          page,
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies by genre:', error);
      throw error;
    }
  }

  // Get backdrop image for a genre by fetching first movie from that genre
  async getGenreBackdrop(genreId: number): Promise<string> {
    try {
      const response = await this.discoverMoviesByGenre(genreId, 1);
      if (response.results && response.results.length > 0) {
        const firstMovie = response.results[0];
        return this.getBackdropUrl(firstMovie.backdrop_path, 'w780');
      }
      return '';
    } catch (error) {
      console.error('Error getting genre backdrop:', error);
      return '';
    }
  }

  // Get genre data with backdrop images
  async getGenresWithBackdrops(): Promise<Array<{ id: number; name: string; backdrop: string }>> {
    try {
      const genresResponse = await this.client.get(API_ENDPOINTS.MOVIES.GENRES);
      const genresWithBackdrops = await Promise.all(
        genresResponse.data.genres.map(async (genre: any) => {
          const backdrop = await this.getGenreBackdrop(genre.id);
          return {
            id: genre.id,
            name: genre.name,
            backdrop: backdrop,
          };
        })
      );
      return genresWithBackdrops;
    } catch (error) {
      console.error('Error getting genres with backdrops:', error);
      return [];
    }
  }

  // Get image URL helper
  getImageUrl(path: string, size: 'w200' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
    if (!path) return '';
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
  }

  // Get backdrop URL helper
  getBackdropUrl(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return '';
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
  }
}

// Export singleton instance
export const movieApiService = new MovieApiService();
