export const API_ENDPOINTS = {
  // Movie API endpoints
  MOVIES: {
    POPULAR: '/movie/popular',
    TOP_RATED: '/movie/top_rated',
    NOW_PLAYING: '/movie/now_playing',
    UPCOMING: '/movie/upcoming',
    DETAILS: (id: string) => `/movie/${id}`,
    SEARCH: '/search/movie',
    GENRES: '/genre/movie/list',
  },
  
  // TV Shows API endpoints
  TV_SHOWS: {
    POPULAR: '/tv/popular',
    TOP_RATED: '/tv/top_rated',
    ON_THE_AIR: '/tv/on_the_air',
    DETAILS: (id: string) => `/tv/${id}`,
    SEARCH: '/search/tv',
    GENRES: '/genre/tv/list',
  },
  
  // Common endpoints
  COMMON: {
    SEARCH_MULTI: '/search/multi',
    CONFIGURATION: '/configuration',
    IMAGES: (path: string) => `https://image.tmdb.org/t/p/w500${path}`,
  },
};
