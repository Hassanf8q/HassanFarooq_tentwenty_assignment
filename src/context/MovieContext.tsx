import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Movie, MovieDetails, Genre } from '../types';
import { movieApiService } from '../api/movieService';

// State interface
interface MovieState {
  upcomingMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  nowPlayingMovies: Movie[];
  searchResults: Movie[];
  genres: Array<{ id: number; name: string; backdrop?: string }>;
  selectedMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

// Action types
type MovieAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UPCOMING_MOVIES'; payload: { movies: Movie[]; page: number; totalPages: number; totalResults: number } }
  | { type: 'SET_POPULAR_MOVIES'; payload: { movies: Movie[]; page: number; totalPages: number; totalResults: number } }
  | { type: 'SET_TOP_RATED_MOVIES'; payload: { movies: Movie[]; page: number; totalPages: number; totalResults: number } }
  | { type: 'SET_NOW_PLAYING_MOVIES'; payload: { movies: Movie[]; page: number; totalPages: number; totalResults: number } }
  | { type: 'SET_SEARCH_RESULTS'; payload: { movies: Movie[]; page: number; totalPages: number; totalResults: number } }
  | { type: 'SET_GENRES'; payload: Array<{ id: number; name: string; backdrop?: string }> }
  | { type: 'SET_SELECTED_MOVIE'; payload: MovieDetails | null }
  | { type: 'APPEND_UPCOMING_MOVIES'; payload: { movies: Movie[]; page: number } }
  | { type: 'APPEND_POPULAR_MOVIES'; payload: { movies: Movie[]; page: number } }
  | { type: 'APPEND_TOP_RATED_MOVIES'; payload: { movies: Movie[]; page: number } }
  | { type: 'APPEND_NOW_PLAYING_MOVIES'; payload: { movies: Movie[]; page: number } }
  | { type: 'APPEND_SEARCH_RESULTS'; payload: { movies: Movie[]; page: number } };

// Initial state
const initialState: MovieState = {
  upcomingMovies: [],
  popularMovies: [],
  topRatedMovies: [],
  nowPlayingMovies: [],
  searchResults: [],
  genres: [],
  selectedMovie: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
};

// Reducer
const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_UPCOMING_MOVIES':
      return {
        ...state,
        upcomingMovies: action.payload.movies,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        loading: false,
        error: null,
      };
    
    case 'SET_POPULAR_MOVIES':
      return {
        ...state,
        popularMovies: action.payload.movies,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        loading: false,
        error: null,
      };
    
    case 'SET_TOP_RATED_MOVIES':
      return {
        ...state,
        topRatedMovies: action.payload.movies,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        loading: false,
        error: null,
      };
    
    case 'SET_NOW_PLAYING_MOVIES':
      return {
        ...state,
        nowPlayingMovies: action.payload.movies,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        loading: false,
        error: null,
      };
    
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload.movies,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        loading: false,
        error: null,
      };
    
    case 'SET_GENRES':
      return { ...state, genres: action.payload };
    
    case 'SET_SELECTED_MOVIE':
      return { ...state, selectedMovie: action.payload };
    
    case 'APPEND_UPCOMING_MOVIES':
      return {
        ...state,
        upcomingMovies: [...state.upcomingMovies, ...action.payload.movies],
        currentPage: action.payload.page,
        loading: false,
      };
    
    case 'APPEND_POPULAR_MOVIES':
      return {
        ...state,
        popularMovies: [...state.popularMovies, ...action.payload.movies],
        currentPage: action.payload.page,
        loading: false,
      };
    
    case 'APPEND_TOP_RATED_MOVIES':
      return {
        ...state,
        topRatedMovies: [...state.topRatedMovies, ...action.payload.movies],
        currentPage: action.payload.page,
        loading: false,
      };
    
    case 'APPEND_NOW_PLAYING_MOVIES':
      return {
        ...state,
        nowPlayingMovies: [...state.nowPlayingMovies, ...action.payload.movies],
        currentPage: action.payload.page,
        loading: false,
      };
    
    case 'APPEND_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: [...state.searchResults, ...action.payload.movies],
        currentPage: action.payload.page,
        loading: false,
      };
    
    default:
      return state;
  }
};

// Context interface
interface MovieContextType {
  state: MovieState;
  // Actions
  fetchUpcomingMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchPopularMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchTopRatedMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchNowPlayingMovies: (page?: number, append?: boolean) => Promise<void>;
  searchMovies: (query: string, page?: number, append?: boolean) => Promise<void>;
  discoverMoviesByGenre: (genreId: number, page?: number, append?: boolean) => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  fetchGenres: () => Promise<void>;
  clearSearchResults: () => void;
  clearError: () => void;
}

// Context
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Provider component
interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Fetch upcoming movies
  const fetchUpcomingMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const response = await movieApiService.getUpcomingMovies(page);
      
      if (append) {
        dispatch({
          type: 'APPEND_UPCOMING_MOVIES',
          payload: { movies: response.results, page },
        });
      } else {
        dispatch({
          type: 'SET_UPCOMING_MOVIES',
          payload: {
            movies: response.results,
            page,
            totalPages: response.total_pages,
            totalResults: response.total_results,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch upcoming movies',
      });
    }
  };

  // Fetch popular movies
  const fetchPopularMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const response = await movieApiService.getPopularMovies(page);
      
      if (append) {
        dispatch({
          type: 'APPEND_POPULAR_MOVIES',
          payload: { movies: response.results, page },
        });
      } else {
        dispatch({
          type: 'SET_POPULAR_MOVIES',
          payload: {
            movies: response.results,
            page,
            totalPages: response.total_pages,
            totalResults: response.total_results,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch popular movies',
      });
    }
  };

  // Fetch top rated movies
  const fetchTopRatedMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const response = await movieApiService.getTopRatedMovies(page);
      
      if (append) {
        dispatch({
          type: 'APPEND_TOP_RATED_MOVIES',
          payload: { movies: response.results, page },
        });
      } else {
        dispatch({
          type: 'SET_TOP_RATED_MOVIES',
          payload: {
            movies: response.results,
            page,
            totalPages: response.total_pages,
            totalResults: response.total_results,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch top rated movies',
      });
    }
  };

  // Fetch now playing movies
  const fetchNowPlayingMovies = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const response = await movieApiService.getNowPlayingMovies(page);
      
      if (append) {
        dispatch({
          type: 'APPEND_NOW_PLAYING_MOVIES',
          payload: { movies: response.results, page },
        });
      } else {
        dispatch({
          type: 'SET_NOW_PLAYING_MOVIES',
          payload: {
            movies: response.results,
            page,
            totalPages: response.total_pages,
            totalResults: response.total_results,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch now playing movies',
      });
    }
  };

  // Search movies
  const searchMovies = async (query: string, page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const response = await movieApiService.searchMovies(query, page);
      
      if (append) {
        dispatch({
          type: 'APPEND_SEARCH_RESULTS',
          payload: { movies: response.results, page },
        });
      } else {
        dispatch({
          type: 'SET_SEARCH_RESULTS',
          payload: {
            movies: response.results,
            page,
            totalPages: response.total_pages,
            totalResults: response.total_results,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to search movies',
      });
    }
  };

  // Discover movies by genre
  const discoverMoviesByGenre = async (genreId: number, page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const response = await movieApiService.discoverMoviesByGenre(genreId, page);
      
      if (append) {
        dispatch({
          type: 'APPEND_SEARCH_RESULTS',
          payload: { movies: response.results, page },
        });
      } else {
        dispatch({
          type: 'SET_SEARCH_RESULTS',
          payload: {
            movies: response.results,
            page,
            totalPages: response.total_pages,
            totalResults: response.total_results,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to discover movies by genre',
      });
    }
  };

  // Fetch movie details
  const fetchMovieDetails = async (movieId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await movieApiService.getMovieDetails(movieId);
      
      dispatch({ type: 'SET_SELECTED_MOVIE', payload: response });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch movie details',
      });
    }
  };

  // Fetch genres with backdrops
  const fetchGenres = async () => {
    try {
      const genresWithBackdrops = await movieApiService.getGenresWithBackdrops();
      dispatch({ type: 'SET_GENRES', payload: genresWithBackdrops });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch genres',
      });
    }
  };

  // Clear search results
  const clearSearchResults = () => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: { movies: [], page: 1, totalPages: 0, totalResults: 0 } });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: MovieContextType = {
    state,
    fetchUpcomingMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    searchMovies,
    discoverMoviesByGenre,
    fetchMovieDetails,
    fetchGenres,
    clearSearchResults,
    clearError,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

// Hook to use movie context
export const useMovies = (): MovieContextType => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
