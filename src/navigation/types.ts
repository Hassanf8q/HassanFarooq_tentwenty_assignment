import { StackScreenProps } from '@react-navigation/stack';

// Watch Stack Types
export type WatchStackParamList = {
  WatchMain: undefined;
  Search: undefined;
  MovieDetail: { movie: any };
  VideoPlayer: { trailerUrl: string; movieTitle?: string };
  SeatBooking: { movie: any };
  SeatSelection: { movie: any; showtime: any; date: string };
  Payment: { movie: any; showtime: any; date: string; selectedSeats: string[]; total: number };
};

export type WatchStackScreenProps<T extends keyof WatchStackParamList> = StackScreenProps<WatchStackParamList, T>;

// Dashboard Stack Types
export type DashboardStackParamList = {
  DashboardMain: undefined;
  MovieDetail: { movie: any };
};

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> = StackScreenProps<DashboardStackParamList, T>;

// Media Library Stack Types
export type MediaLibraryStackParamList = {
  MediaLibraryMain: undefined;
  MovieDetail: { movie: any };
};

export type MediaLibraryStackScreenProps<T extends keyof MediaLibraryStackParamList> = StackScreenProps<MediaLibraryStackParamList, T>;

// More Stack Types
export type MoreStackParamList = {
  MoreMain: undefined;
  MovieDetail: { movie: any };
};

export type MoreStackScreenProps<T extends keyof MoreStackParamList> = StackScreenProps<MoreStackParamList, T>;
