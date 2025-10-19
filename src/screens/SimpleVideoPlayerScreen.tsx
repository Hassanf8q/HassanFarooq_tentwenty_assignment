import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { AppText } from '../components/AppText';
import { useHideBottomTabs } from '../hooks';
import CustomStatusBar from '../components/CustomStatusBar';

interface SimpleVideoPlayerScreenProps {
  navigation: any;
  route: {
    params: {
      trailerUrl: string;
      movieTitle?: string;
    };
  };
}

const SimpleVideoPlayerScreen: React.FC<SimpleVideoPlayerScreenProps> = ({ navigation, route }) => {
  const { trailerUrl, movieTitle } = route.params;
  const webViewRef = useRef<WebView>(null);
  const { state } = useTheme();
  const { theme } = state;

  // Hide bottom tabs when this screen is focused
  useHideBottomTabs(navigation);

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
      } else if (url.includes('youtu.be/')) {
        const match = url.match(/youtu\.be\/([^?]+)/);
        return match ? match[1] : null;
      }
      return null;
    } catch (error) {
      console.error('Error extracting video ID:', error);
      return null;
    }
  };

  const videoId = extractVideoId(trailerUrl);

  // Simple HTML with default YouTube controls
  const getYouTubeEmbedHTML = (vidId: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #000;
            overflow: hidden;
          }
          .video-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <iframe
            src="https://www.youtube.com/embed/${vidId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&start=0&end=0&loop=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        
        <script>
          // Listen for video end event
          let player;
          
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              events: {
                'onStateChange': onPlayerStateChange
              }
            });
          }
          
          function onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.ENDED) {
              // Auto-close when video ends
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'videoEnded'
              }));
            }
          }
          
          // Handle errors
          function onPlayerError(event) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              error: event.data
            }));
          }
        </script>
        
        <script src="https://www.youtube.com/iframe_api"></script>
      </body>
      </html>
    `;
  };

  // Handle messages from WebView
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'videoEnded':
          // Auto-close when video ends
          setTimeout(() => {
            navigation.goBack();
          }, 1000);
          break;
          
        case 'error':
          Alert.alert(
            'Video Error',
            'Unable to play the trailer. Please try again.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  }, [navigation]);

  const handleClose = () => {
    navigation.goBack();
  };

  if (!videoId) {
    Alert.alert(
      'Invalid Video',
      'Unable to load the trailer.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
    return null;
  }

  return (
    <View style={styles.container}>
      <CustomStatusBar hidden />
      
      {/* WebView with Default YouTube Controls */}
      <WebView
        ref={webViewRef}
        source={{ html: getYouTubeEmbedHTML(videoId) }}
        style={styles.webView}
        onMessage={handleWebViewMessage}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsFullscreenVideo={true}
        scalesPageToFit={true}
      />

      {/* Top Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      {/* Bottom Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />
      
      {/* Header with Done Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.doneButton}>
          <AppText variant="bold" size="lg" color="textLight">
            Done
          </AppText>
        </TouchableOpacity>
        
        {/* {movieTitle && (
          <AppText 
            variant="medium" 
            size="md" 
            color="textLight" 
            style={styles.movieTitle}
            numberOfLines={1}
          >
            {movieTitle}
          </AppText>
        )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 10,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  movieTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
    opacity: 0.9,
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
    // backgroundColor:'pink'
  },
  bottomGradient: {
    position: 'absolute',
    // backgroundColor:'pink',
    bottom: 0,
    left: 0,
    right: 0,
    height: 95,
    zIndex: 5,
  },
});

export default SimpleVideoPlayerScreen;
