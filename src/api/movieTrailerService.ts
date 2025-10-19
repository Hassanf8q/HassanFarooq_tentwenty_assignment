import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieVideosResponse {
  id: number;
  results: VideoResult[];
}

class MovieTrailerService {
  private client = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 10000,
  });

  /**
   * Fetch movie videos/trailers from TMDB API
   */
  async getMovieVideos(movieId: number): Promise<VideoResult[]> {
    try {
      const response = await this.client.get<MovieVideosResponse>(
        `/movie/${movieId}/videos`,
        {
          params: {
            api_key: API_CONFIG.API_KEY,
            language: 'en-US',
          },
        }
      );

      return response.data.results;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      throw error;
    }
  }

  /**
   * Get the best trailer URL for a movie
   * Priority: Official YouTube Trailer > First YouTube Video > null
   */
  async getMovieTrailer(movieId: number): Promise<string | null> {
    try {
      const videos = await this.getMovieVideos(movieId);
      
      if (!videos || videos.length === 0) {
        console.warn('No videos found for movie:', movieId);
        return null;
      }

      // 1️⃣ Try to get Official Trailer
      const trailer = videos.find(
        (v: VideoResult) =>
          v.site === 'YouTube' &&
          v.type === 'Trailer' &&
          (v.official || v.name.toLowerCase().includes('official trailer'))
      );

      // 2️⃣ If no official trailer, fallback to first YouTube video
      const fallback = videos.find((v: VideoResult) => v.site === 'YouTube');
      const selected = trailer || fallback;

      if (selected) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${selected.key}`;
        console.log('Found trailer:', selected.name, 'URL:', youtubeUrl);
        return youtubeUrl;
      } else {
        console.warn('No YouTube trailer found for movie:', movieId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  }

  /**
   * Extract YouTube video ID from URL
   */
  extractVideoId(trailerUrl: string): string | null {
    try {
      // Handle both full YouTube URLs and just video IDs
      if (trailerUrl.includes('youtube.com/watch?v=')) {
        const match = trailerUrl.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
      } else if (trailerUrl.includes('youtu.be/')) {
        const match = trailerUrl.match(/youtu\.be\/([^?]+)/);
        return match ? match[1] : null;
      } else {
        // Assume it's already a video ID
        return trailerUrl;
      }
    } catch (error) {
      console.error('Error extracting video ID:', error);
      return null;
    }
  }
}

export const movieTrailerService = new MovieTrailerService();
