export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    bottomTabBackground: string;
    textPrimary: string;
    textSecondary: string;
    textLight: string;
    border: string;
    teal: string;
    pink: string;
    purple: string;
    gold: string;
    success: string;
    error: string;
    warning: string;
  };
  fonts: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
    weights: {
      light: string;
      regular: string;
      medium: string;
      semiBold: string;
      bold: string;
    };
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
      title: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }>;
}

export interface Seat {
  id: string;
  row: number;
  number: number;
  type: 'regular' | 'vip';
  price: number;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface Booking {
  movieId: number;
  movieTitle: string;
  showtime: string;
  date: string;
  seats: Seat[];
  totalPrice: number;
}
