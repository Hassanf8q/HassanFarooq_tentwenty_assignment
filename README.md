# 🎬 HassanFarooq Movie Booking App

A modern React Native movie booking application with comprehensive features for browsing, searching, and booking movie tickets. Built with TypeScript and featuring a beautiful UI with light/dark theme support.

## 📱 Features

### 🎯 Core Functionality
- **Movie Discovery**: Browse upcoming movies with detailed information
- **Search & Filter**: Advanced search with genre filtering
- **Movie Details**: Comprehensive movie information with trailers
- **Seat Booking**: Interactive seat selection with different pricing tiers
- **Video Player**: Full-screen trailer playback with YouTube integration
- **Responsive Design**: Optimized for both portrait and landscape orientations

### 🎨 UI/UX Features
- **Theme Support**: Light and dark mode with smooth transitions
- **Custom Typography**: Poppins font family integration
- **Interactive Components**: Touch-friendly interface with smooth animations
- **Status Bar Management**: Consistent status bar handling across all screens
- **Bottom Tab Navigation**: Intuitive navigation with custom icons
- **Linear Gradients**: Beautiful gradient overlays for enhanced visuals

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Context API**: Centralized state management for themes and movies
- **API Integration**: TMDB (The Movie Database) API integration
- **Custom Hooks**: Reusable logic for common functionality
- **Error Handling**: Comprehensive error handling and loading states
- **Performance Optimized**: Efficient rendering with proper memoization

## 🚀 Getting Started

### Prerequisites

Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide before proceeding.

- **Node.js**: >= 20.0.0
- **React Native CLI**: Latest version
- **iOS**: Xcode 14+ (for iOS development)
- **Android**: Android Studio with SDK 33+ (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HassanFarooq_tentwenty_assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   # Install CocoaPods dependencies
   cd ios && pod install && cd ..
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

### Running the App

1. **Start Metro Bundler**
   ```bash
npm start
   # or
yarn start
```

2. **Run on iOS**
   ```bash
   npm run ios
   # or
   yarn ios
   ```

3. **Run on Android**
   ```bash
npm run android
   # or
yarn android
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AppText.tsx      # Custom text component with typography
│   ├── CustomStatusBar.tsx # Status bar management
│   └── MovieCard.tsx    # Movie card component
├── screens/             # Screen components
│   ├── WatchScreen.tsx  # Main movie listing screen
│   ├── SearchScreen.tsx # Movie search functionality
│   ├── MovieDetailScreen.tsx # Movie details and booking
│   ├── SeatBookingScreen.tsx # Date and showtime selection
│   ├── SeatSelectionScreen.tsx # Interactive seat map
│   ├── SimpleVideoPlayerScreen.tsx # Video player
│   └── DashboardScreen.tsx # Dashboard/home screen
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx # Main navigation setup
│   ├── types.ts        # Navigation type definitions
│   └── stacks/          # Stack navigators
├── context/            # State management
│   ├── ThemeContext.tsx # Theme management
│   └── MovieContext.tsx # Movie data management
├── api/                # API services
│   ├── movieService.ts  # Movie data API
│   └── movieTrailerService.ts # Trailer API
├── hooks/              # Custom React hooks
│   └── useHideBottomTabs.ts # Bottom tab visibility
├── types/              # TypeScript type definitions
├── constants/          # App constants
│   └── colors.ts       # Color definitions
└── assets/             # Static assets
    ├── images/         # Image assets
    └── fonts/          # Font files
```

## 🎨 Design System

### Typography
- **Primary Font**: Poppins
- **Variants**: Regular, Medium, SemiBold, Bold
- **Sizes**: xs, sm, md, lg, xl, xxl

### Color Palette
- **Primary**: #61C3F2 (Light Blue)
- **Surface**: Dynamic based on theme
- **Text**: Primary, Secondary, Light variants
- **Status**: Success, Warning, Error states

### Components
- **AppText**: Consistent typography component
- **MovieCard**: Standardized movie display
- **CustomStatusBar**: Unified status bar management

## 🔌 API Integration

### TMDB (The Movie Database)
- **Base URL**: `https://api.themoviedb.org/3`
- **Endpoints**:
  - `/movie/upcoming` - Get upcoming movies
  - `/movie/{id}` - Get movie details
  - `/movie/{id}/images` - Get movie images
  - `/movie/{id}/videos` - Get movie trailers
  - `/search/movie` - Search movies
  - `/genre/movie/list` - Get movie genres

### API Configuration
```typescript
// API configuration
const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.TMDB_API_KEY,
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500'
};
```

## 🎬 Screen Descriptions

### Watch Screen
- Displays upcoming movies in a responsive grid
- Supports both portrait (2 columns) and landscape (3 columns) layouts
- Pull-to-refresh functionality
- Smooth scrolling with optimized performance

### Search Screen
- Real-time movie search with debouncing
- Genre-based filtering with visual grid
- Search results with detailed movie information
- Dynamic result counter

### Movie Detail Screen
- Comprehensive movie information display
- Responsive layout for portrait and landscape
- Interactive trailer playback
- Seat booking integration
- Action buttons for booking and trailer

### Seat Booking Screens
- **SeatBookingScreen**: Date and showtime selection
- **SeatSelectionScreen**: Interactive seat map with zoom functionality
- Visual seat layout with different pricing tiers
- Real-time seat availability and selection

### Video Player Screen
- Full-screen video playback
- YouTube integration with custom controls
- Auto-play and auto-close functionality
- Responsive design for all orientations

## 🛠️ Development

### Available Scripts

```bash
# Development
npm start          # Start Metro bundler
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator

# Code Quality
npm run lint       # Run ESLint
npm test          # Run tests

# Build
npm run build:ios     # Build for iOS
npm run build:android # Build for Android
```

### Code Style
- **ESLint**: Configured with React Native rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Conventional Commits**: Standardized commit messages

## 🔧 Configuration

### Environment Variables
```env
# Required
TMDB_API_KEY=your_api_key_here

# Optional
TMDB_BASE_URL=https://api.themoviedb.org/3
DEBUG_MODE=false
```

### Metro Configuration
- Custom resolver for worklets
- Asset handling for fonts and images
- TypeScript support

### Babel Configuration
- React Native preset
- Environment variable support
- Worklets support

## 📱 Platform-Specific Features

### iOS
- **Status Bar**: Custom handling with animations
- **Safe Areas**: Proper safe area handling
- **Gestures**: Native gesture support
- **Performance**: Optimized for iOS rendering

### Android
- **Status Bar**: Consistent white status bar
- **Navigation**: Material Design principles
- **Performance**: Optimized for Android rendering
- **Permissions**: Proper permission handling

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS build issues**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build issues**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

4. **Status bar issues**
   - Ensure CustomStatusBar is imported correctly
   - Check platform-specific configurations

### Debug Mode
Enable debug mode by setting `DEBUG_MODE=true` in your environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB**: For providing the movie database API
- **React Native Community**: For excellent tooling and libraries
- **Poppins Font**: For beautiful typography
- **Contributors**: All contributors who helped build this app

## 📞 Support

For support, email support@example.com or create an issue in the repository.

---

**Built with ❤️ using React Native**