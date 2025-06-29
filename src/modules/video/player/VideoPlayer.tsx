import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, StatusBar, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
  Easing
} from 'react-native-reanimated';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';
import { PlayPauseButton } from '../../ui/components/PlayPauseButton';
import { ProgressBar } from '../../ui/components/ProgressBar';
import { SeekButtons } from '../../ui/components/SeekButtons';
import OptionsButton from '../../ui/components/OptionsButoon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VideoPlayerProps {
  style?: any;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ style }) => {
  const {
    videoState,
    setVideoRef,
    handleProgress,
    handleLoad,
    handleBuffer,
    handleLoadStart,
    handleEnd,
    handleSeek,
    togglePlayPause,
    toggleFullscreen,
    seek,
    seekBackward,
    seekForward,
  } = useVideoPlayer();

  const { top } = useSafeAreaInsets()

  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [screenData, setScreenData] = useState(() => {
    const screen = Dimensions.get('screen');
    return {
      width: screen.width,
      height: screen.height,
      isLandscape: screen.width > screen.height
    };
  });

  const controlsOpacity = useSharedValue(1);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setScreenData({
        width: screen.width,
        height: screen.height,
        isLandscape: screen.width > screen.height
      });
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (showControls && videoState.isPlaying) {
      const timeout = setTimeout(() => {
        hideControls();
      }, 3000);
      setControlsTimeout(timeout);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    } else if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }
  }, [showControls, videoState.isPlaying]);

  useEffect(() => {
    if (!videoState.isPlaying || videoState.isSeekingInProgress) {
      showControlsHandler();
    }
  }, [videoState.isPlaying, videoState.isSeekingInProgress]);

  useEffect(() => {
    const handleOrientationChange = async () => {
      if (videoState.isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setTimeout(async () => {
          await ScreenOrientation.unlockAsync();
        }, 500);
      }
    };

    handleOrientationChange();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [videoState.isFullscreen]);

  const showControlsHandler = () => {
    setShowControls(true);
    controlsOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  };

  const hideControls = () => {
    setShowControls(false);
    controlsOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  };

  const toggleControls = () => {
    if (showControls) {
      hideControls();
    } else {
      showControlsHandler();
    }
  };

  const controlsStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.get(),
    };
  });

  const handleVideoPress = () => {
    if (videoState.currentVideoUrl) {
      toggleControls();
    }
  };

  const handlePlayPausePress = () => {
    togglePlayPause();
    showControlsHandler();
  };

  const handleSeekBackward = () => {
    seekBackward(10);
    showControlsHandler();
  };

  const handleSeekForward = () => {
    seekForward(10);
    showControlsHandler();
  };

  const handleFullscreenPress = () => {
    toggleFullscreen();
    showControlsHandler();
  };

  const containerStyle = [
    styles.container,
    videoState.isFullscreen && styles.fullscreenContainer,
    style
  ];

  const bottomControlsStyle = [
    styles.bottomControls,
    screenData.isLandscape && styles.bottomControlsLandscape
  ];

  const topControlsStyle = [
    styles.topControls, { top: top, right: 10 },
    screenData.isLandscape && styles.topControlsLandscape
  ];

  if (!videoState.currentVideoUrl) {
    return (
      <View style={containerStyle}>
        <View style={styles.placeholder}>
          <PlayPauseButton
            isPlaying={false}
            onPress={() => { }}
            size={80}
            color="#666"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <StatusBar hidden={videoState.isFullscreen} />

      <TouchableWithoutFeedback onPress={handleVideoPress}>
        <View style={styles.videoContainer}>
          <Video
            ref={setVideoRef}
            source={{ uri: videoState.currentVideoUrl }}
            style={styles.video}
            onProgress={handleProgress}
            onLoad={handleLoad}
            onBuffer={handleBuffer}
            onLoadStart={handleLoadStart}
            onEnd={handleEnd}
            onSeek={handleSeek}
            paused={!videoState.isPlaying}
            volume={videoState.isMuted ? 0 : videoState.volume}
            rate={videoState.playbackRate}
            resizeMode="contain"
            fullscreenAutorotate={true}
            fullscreenOrientation='all'
            controls={false}
            repeat={false}
            ignoreSilentSwitch="ignore"
            mixWithOthers="duck"
            playWhenInactive={false}
            playInBackground={false}
            progressUpdateInterval={100}
          />

          {/* Controls Overlay */}
          <Animated.View style={[styles.controlsOverlay, controlsStyle]} pointerEvents={showControls ? 'auto' : 'none'}>
            {/* Center Controls - Seek Backward | Play/Pause | Seek Forward */}
            <View style={styles.centerControls}>
              <View style={[styles.playbackControls, { top: 25 }]}>
                <View style={[styles.playPauseContainer, { gap: 40 }]}>
                  <SeekButtons
                    onSeekBackward={handleSeekBackward}
                    onSeekForward={handleSeekForward}
                    size={50}
                    seekSeconds={10}
                    type="backward"
                  />
                  <PlayPauseButton
                    isPlaying={videoState.isPlaying}
                    onPress={handlePlayPausePress}
                    size={70}
                  />
                  <SeekButtons
                    onSeekBackward={handleSeekBackward}
                    onSeekForward={handleSeekForward}
                    size={50}
                    seekSeconds={10}
                    type="forward"
                  />
                </View>
              </View>
            </View>

            {/* Top Controls */}
            <View style={topControlsStyle}>
              <OptionsButton
                isOptions={true}
                onPress={() => { }}
                size={30}
                color="#fff"
              />
            </View>

            {/* Bottom Controls */}
            <View style={bottomControlsStyle}>
              <ProgressBar
                currentTime={videoState.currentTime}
                duration={videoState.duration}
                onSeek={seek}
                isSeekingInProgress={videoState.isSeekingInProgress}
                showTimeLabels={true}
                screenWidth={screenData.width}
                isFullscreen={videoState.isFullscreen}
                handleFullscreenPress={handleFullscreenPress}
              />
            </View>

            {/* Gradient Overlays for better text readability */}
            <View style={styles.bottomGradient} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  bottomControls: {
    paddingBottom: 20,
  },
  bottomControlsLandscape: {
    paddingBottom: 10,
  },
  bottomRightControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomRightControlsLandscape: {
    bottom: 10,
    right: 10,
  },
  topControls: {
    position: 'absolute',
  },
  topControlsLandscape: {
    top: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: 'rgba(0,0,0,0.1)',
    pointerEvents: 'none',
  },
}); 