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

The project follows a well-organized, scalable architecture with clear separation of concerns:

### 🎯 **Core Application Structure**

```
HassanFarooq_tentwenty_assignment/
├── src/                                     # Main source code
│   ├── components/                          # Reusable UI Components
│   │   ├── AppText.tsx                      # Typography component
│   │   ├── CustomStatusBar.tsx              # Status bar management
│   │   └── MovieCard.tsx                   # Movie display card
│   ├── screens/                             # Screen Components
│   │   ├── WatchScreen.tsx                  # Movie listing & discovery
│   │   ├── SearchScreen.tsx                 # Movie search & filtering
│   │   ├── MovieDetailScreen.tsx             # Movie details & booking
│   │   ├── SeatBookingScreen.tsx             # Date & showtime selection
│   │   ├── SeatSelectionScreen.tsx          # Interactive seat map
│   │   ├── SimpleVideoPlayerScreen.tsx       # Video player
│   │   └── DashboardScreen.tsx              # Home dashboard
│   ├── navigation/                          # Navigation System
│   │   ├── AppNavigator.tsx                 # Main navigation setup
│   │   ├── types.ts                         # Navigation type definitions
│   │   └── stacks/                          # Stack navigators
│   │       ├── WatchStack.tsx               # Watch tab navigation
│   │       ├── DashboardStack.tsx           # Dashboard tab navigation
│   │       ├── MediaLibraryStack.tsx        # Media library navigation
│   │       └── MoreStack.tsx                # More tab navigation
│   ├── context/                             # State Management
│   │   ├── ThemeContext.tsx                 # Theme & UI state
│   │   └── MovieContext.tsx                 # Movie data state
│   ├── api/                                 # API Services
│   │   ├── movieService.ts                  # Movie data API
│   │   └── movieTrailerService.ts           # Trailer API
│   ├── hooks/                               # Custom React Hooks
│   │   └── useHideBottomTabs.ts             # Bottom tab visibility
│   ├── types/                               # TypeScript Definitions
│   │   └── index.ts                         # Type definitions
│   ├── constants/                           # App Constants
│   │   └── colors.ts                        # Color palette
│   └── assets/                              # Static Assets
│       ├── images/                          # Image assets
│       │   ├── allseats.png                 # Seat layout icon
│       │   ├── singleseat.png               # Individual seat icon
│       │   ├── upperlayer.png               # Upper layer icon
│       │   ├── dashboard.png                # Dashboard tab icon
│       │   ├── library.png                  # Library tab icon
│       │   ├── menu.png                     # More tab icon
│       │   └── watch.png                    # Watch tab icon
│       └── fonts/                           # Font assets
│           └── Poppins/                     # Poppins font family
├── ios/                                     # iOS Platform Files
│   ├── HassanFarooq_tentwenty_assignment/   # iOS app source
│   ├── Podfile                              # CocoaPods dependencies
│   └── Podfile.lock                         # Locked dependencies
├── android/                                 # Android Platform Files
│   ├── app/                                 # Android app source
│   ├── build.gradle                         # Build configuration
│   └── gradle.properties                    # Gradle properties
├── docs/                                    # Documentation
│   ├── README.md                            # Project documentation
│   ├── CONTRIBUTING.md                      # Contribution guidelines
│   ├── CHANGELOG.md                         # Version history
│   └── LICENSE                              # MIT License
├── config/                                  # Configuration Files
│   ├── package.json                         # Node.js dependencies
│   ├── package-lock.json                    # Locked dependencies
│   ├── tsconfig.json                        # TypeScript configuration
│   ├── babel.config.js                      # Babel configuration
│   ├── metro.config.js                      # Metro bundler configuration
│   ├── jest.config.js                       # Jest testing configuration
│   ├── .gitignore                           # Git ignore rules
│   └── .env.example                         # Environment variables template
└── root/                                    # Root Application Files
    ├── App.tsx                              # Main app component
    ├── index.js                             # App entry point
    └── react-native.config.js               # React Native configuration
```

### 🏗️ **Architecture Layers**

#### **1. Presentation Layer** (`screens/` + `components/`)
- **Screens**: Main application screens with business logic
- **Components**: Reusable UI components for consistency
- **Responsive Design**: Handles different screen sizes and orientations

#### **2. Navigation Layer** (`navigation/`)
- **App Navigator**: Main navigation configuration
- **Stack Navigators**: Individual tab navigation stacks
- **Type Safety**: TypeScript definitions for navigation

#### **3. State Management Layer** (`context/`)
- **Theme Context**: UI theme and styling state
- **Movie Context**: Movie data and API state management
- **Global State**: Shared state across components

#### **4. Data Layer** (`api/`)
- **Movie Service**: TMDB API integration for movie data
- **Trailer Service**: Video trailer API integration
- **Error Handling**: Comprehensive API error management

#### **5. Business Logic Layer** (`hooks/`)
- **Custom Hooks**: Reusable business logic
- **Tab Management**: Bottom tab visibility control
- **State Logic**: Complex state management patterns

#### **6. Configuration Layer** (`config/` + `constants/`)
- **App Configuration**: Build and runtime configuration
- **Constants**: App-wide constants and configurations
- **Environment**: Environment-specific settings

### 📂 **File Organization Principles**

#### **🎯 Separation of Concerns**
- **UI Components**: Pure presentation components
- **Business Logic**: Custom hooks and context
- **Data Access**: API services and data fetching
- **Configuration**: Settings and constants

#### **🔄 Reusability**
- **Components**: Highly reusable UI components
- **Hooks**: Reusable business logic
- **Services**: Reusable API calls
- **Types**: Shared type definitions

#### **📱 Platform Support**
- **iOS**: Native iOS configuration and dependencies
- **Android**: Native Android configuration and dependencies
- **Cross-Platform**: Shared React Native code

#### **🛠️ Development Experience**
- **TypeScript**: Full type safety throughout
- **Hot Reload**: Fast development iteration
- **Testing**: Jest configuration for unit tests
- **Linting**: ESLint for code quality

### 🎨 **Asset Organization**

#### **Images** (`assets/images/`)
- **UI Icons**: Tab icons and interface elements
- **Seat Icons**: Seat booking interface assets
- **App Icons**: Application branding assets

#### **Fonts** (`assets/fonts/`)
- **Poppins Family**: Complete font family integration
- **Typography**: Consistent text styling across app

### 🔧 **Configuration Files**

#### **Build Configuration**
- **Metro**: JavaScript bundler configuration
- **Babel**: JavaScript transpilation
- **TypeScript**: Type checking and compilation

#### **Development Tools**
- **ESLint**: Code quality and style enforcement
- **Jest**: Testing framework configuration
- **Git**: Version control ignore rules

#### **Platform Configuration**
- **iOS**: CocoaPods and Xcode configuration
- **Android**: Gradle build system configuration

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