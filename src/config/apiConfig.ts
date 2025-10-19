// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: '5d0170093b0fb2b95ac4be23c83b9fcc', // Replace with your actual API key
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  DEFAULT_LANGUAGE: 'en-US',
  DEFAULT_REGION: 'US',
};

// Image sizes for different use cases
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w200',
    MEDIUM: 'w300',
    LARGE: 'w500',
    XLARGE: 'w780',
  },
  BACKDROP: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original',
  },
  PROFILE: {
    SMALL: 'w45',
    MEDIUM: 'w185',
    LARGE: 'w632',
  },
};

// API endpoints
export const API_ENDPOINTS = {
  MOVIES: {
    UPCOMING: '/movie/upcoming',
    POPULAR: '/movie/popular',
    TOP_RATED: '/movie/top_rated',
    NOW_PLAYING: '/movie/now_playing',
    DETAILS: (id: string) => `/movie/${id}`,
    SEARCH: '/search/movie',
    GENRES: '/genre/movie/list',
    VIDEOS: (id: string) => `/movie/${id}/videos`,
    IMAGES: (id: string) => `/movie/${id}/images`,
  },
  TV_SHOWS: {
    POPULAR: '/tv/popular',
    TOP_RATED: '/tv/top_rated',
    ON_THE_AIR: '/tv/on_the_air',
    DETAILS: (id: string) => `/tv/${id}`,
    SEARCH: '/search/tv',
    GENRES: '/genre/tv/list',
  },
  COMMON: {
    SEARCH_MULTI: '/search/multi',
    CONFIGURATION: '/configuration',
  },
};
