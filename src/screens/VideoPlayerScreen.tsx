import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface VideoPlayerScreenProps {
  navigation: any;
  route: {
    params: {
      trailerUrl: string;
      movieTitle?: string;
    };
  };
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ navigation, route }) => {
  const { state } = useTheme();
  const { theme } = state;
  
  const { trailerUrl, movieTitle } = route.params;
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch (error) {
      console.error('Error extracting video ID:', error);
      return null;
    }
  };

  const videoId = extractVideoId(trailerUrl);

  const onStateChange = useCallback((state: string) => {
    console.log('Video state changed:', state);
    
    if (state === 'ended') {
      setPlaying(false);
      // Auto close after finished
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  }, [navigation]);

  const onReady = useCallback(() => {
    console.log('Video player ready');
    setLoading(false);
  }, []);

  const handleClose = () => {
    setPlaying(false);
    navigation.goBack();
  };

  const handleError = (error: string) => {
    console.error('Video player error:', error);
    setLoading(false);
    Alert.alert(
      'Video Error',
      'Unable to play the trailer. Please try again.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (!videoId) {
    Alert.alert(
      'Invalid Video',
      'Unable to load the trailer.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <AppText variant="bold" size="xxl" color="textLight" style={styles.closeIcon}>
            ✕
          </AppText>
          <AppText variant="medium" size="lg" color="textLight" style={styles.doneText}>
            Done
          </AppText>
        </TouchableOpacity>
        
        {movieTitle && (
          <AppText variant="medium" size="md" color="textLight" style={styles.movieTitle} numberOfLines={1}>
            {movieTitle}
          </AppText>
        )}
      </View>

      {/* Video Player */}
      <View style={styles.videoWrapper}>
        {loading && (
          <View style={styles.loadingContainer}>
            <AppText variant="medium" size="lg" color="textLight">
              Loading trailer...
            </AppText>
          </View>
        )}
        
        <YoutubePlayer
          ref={playerRef}
          height={height * 0.6}
          width={width}
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
          onReady={onReady}
          onError={handleError}
          forceAndroidAutoplay={true}
          initialPlayerParams={{
            controls: true, // hides control bar
            modestbranding: true,
            rel: false,
            mute: false, // Start unmuted for better UX
            autoplay: true,
            start: 0,
            end: 0,
            loop: false,
            fs: true, // Allow fullscreen
            cc_load_policy: 0, // Hide captions by default
            iv_load_policy: 3, // Hide annotations
            showinfo: false, // hides title bar (legacy param)
          }}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <AppText variant="regular" size="sm" color="textLight" style={styles.instructions}>
          Tap "Done" to close or wait for the trailer to finish
        </AppText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  closeIcon: {
    marginRight: 8,
  },
  doneText: {
    fontWeight: '600',
  },
  movieTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
    opacity: 0.9,
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  instructions: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default VideoPlayerScreen;
