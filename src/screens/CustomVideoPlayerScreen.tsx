import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { AppText } from '../components/AppText';

interface CustomVideoPlayerScreenProps {
  navigation: any;
  route: {
    params: {
      trailerUrl: string;
      movieTitle?: string;
    };
  };
}

const CustomVideoPlayerScreen: React.FC<CustomVideoPlayerScreenProps> = ({ navigation, route }) => {
  const { trailerUrl } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [_currentTime, setCurrentTime] = useState(0);
  const [_duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsOpacity] = useState(new Animated.Value(1));

  // Hide bottom tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        // Hide tabs
        parent.setOptions({
          tabBarStyle: { display: 'none' }
        });

        return () => {
          // Restore tabs when leaving
          setTimeout(() => {
            parent.setOptions({
              tabBarStyle: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 90,
                backgroundColor: '#2E2739',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTopWidth: 0,
                paddingBottom: 25,
                paddingTop: 8,
                paddingHorizontal: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
              }
            });
          }, 100);
        };
      }
    }, [navigation])
  );

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

  // Controls visibility
  const hideControls = useCallback(() => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false);
    });
  }, [controlsOpacity]);

  const showControlsTemporarily = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Custom HTML for YouTube embed with minimal branding
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
          .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <div class="loading" id="loading">Loading video...</div>
          <iframe
            id="player"
            src="https://www.youtube.com/embed/${vidId}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0&end=0&loop=0&playlist=${vidId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            onload="hideLoading()"
          ></iframe>
        </div>
        
        <script>
          let player;
          let isPlaying = false;
          let currentVolume = 1;
          let isMuted = false;
          
          function hideLoading() {
            document.getElementById('loading').style.display = 'none';
          }
          
          // YouTube API ready
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
              }
            });
          }
          
          function onPlayerReady(event) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ready',
              duration: player.getDuration()
            }));
            setIsLoading(false);
          }
          
          function onPlayerStateChange(event) {
            const state = event.data;
            isPlaying = state === YT.PlayerState.PLAYING;
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'stateChange',
              state: state,
              currentTime: player.getCurrentTime(),
              duration: player.getDuration()
            }));
            
            if (state === YT.PlayerState.ENDED) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ended'
              }));
            }
          }
          
          function onPlayerError(event) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              error: event.data
            }));
          }
          
          // Control functions
          function togglePlayPause() {
            if (isPlaying) {
              player.pauseVideo();
            } else {
              player.playVideo();
            }
          }
          
          function setVolume(vol) {
            currentVolume = vol;
            player.setVolume(vol * 100);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'volumeChanged',
              volume: vol
            }));
          }
          
          function toggleMute() {
            isMuted = !isMuted;
            if (isMuted) {
              player.mute();
            } else {
              player.unMute();
            }
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'muteToggled',
              muted: isMuted
            }));
          }
          
          function seekTo(time) {
            player.seekTo(time);
          }
          
          // Listen for messages from React Native
          window.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);
            switch(data.action) {
              case 'play':
                player.playVideo();
                break;
              case 'pause':
                player.pauseVideo();
                break;
              case 'setVolume':
                setVolume(data.volume);
                break;
              case 'toggleMute':
                toggleMute();
                break;
              case 'seek':
                seekTo(data.time);
                break;
            }
          });
          
          // Auto-hide controls
          let controlsTimeout;
          function resetControlsTimeout() {
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'hideControls'
              }));
            }, 2000); // Reduced to 2 seconds for cleaner experience
          }
          
          document.addEventListener('click', resetControlsTimeout);
          document.addEventListener('touchstart', resetControlsTimeout);
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
        case 'ready':
          setDuration(data.duration);
          break;
          
        case 'stateChange':
          setIsPlaying(data.state === 1); // YT.PlayerState.PLAYING
          setCurrentTime(data.currentTime);
          setDuration(data.duration);
          break;
          
        case 'ended':
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
          
        case 'hideControls':
          hideControls();
          break;
          
        case 'volumeChanged':
          setVolume(data.volume);
          break;
          
        case 'muteToggled':
          setIsMuted(data.muted);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  }, [navigation, hideControls]);

  // Control functions
  const togglePlayPause = () => {
    const action = isPlaying ? 'pause' : 'play';
    webViewRef.current?.postMessage(JSON.stringify({ action }));
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    webViewRef.current?.postMessage(JSON.stringify({ 
      action: 'setVolume', 
      volume: newVolume 
    }));
  };

  const toggleMute = () => {
    webViewRef.current?.postMessage(JSON.stringify({ action: 'toggleMute' }));
  };

  const handleScreenPress = () => {
    if (showControls) {
      hideControls();
    } else {
      showControlsTemporarily();
    }
  };

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
      <StatusBar hidden />
      
      {/* Video Player */}
      <TouchableOpacity 
        style={styles.videoContainer} 
        activeOpacity={1}
        onPress={handleScreenPress}
      >
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
        />
      </TouchableOpacity>

      {/* Custom Controls Overlay - Minimal */}
      <Animated.View 
        style={[
          styles.controlsOverlay,
          { opacity: controlsOpacity }
        ]}
        pointerEvents={showControls ? 'auto' : 'none'}
      >
        {/* Top Controls - Done Button Only */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={handleClose} style={styles.doneButton}>
            <AppText variant="bold" size="lg" color="textLight">
              Done
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Center Controls - Play/Pause */}
        <View style={styles.centerControls}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <AppText variant="bold" size="xxxl" color="textLight">
              {isPlaying ? '⏸' : '▶'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Bottom Controls - Volume Only */}
        <View style={styles.bottomControls}>
          <View style={styles.volumeControl}>
            <TouchableOpacity onPress={toggleMute} style={styles.volumeButton}>
              <AppText variant="bold" size="lg" color="textLight">
                {isMuted ? '🔇' : '🔊'}
              </AppText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.volumeSlider}
              onPress={(e) => {
                const { locationX } = e.nativeEvent;
                const newVolume = Math.max(0, Math.min(1, locationX / 80));
                handleVolumeChange(newVolume);
              }}
            >
              <View style={styles.volumeTrack}>
                <View
                  style={[
                    styles.volumeProgress,
                    { width: `${volume * 100}%` }
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  // Top Controls - Done Button Only
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  // Center Controls - Play/Pause
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  // Bottom Controls - Volume Only
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  volumeButton: {
    padding: 4,
    marginRight: 8,
  },
  volumeSlider: {
    width: 80,
    height: 20,
    justifyContent: 'center',
  },
  volumeTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  volumeProgress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default CustomVideoPlayerScreen;
