import React from 'react';
import { View, StyleSheet, ColorValue, TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated';
import { VideoControls } from './VideoControls';
import { VideoTopControls } from './VideoTopControls';
import { VideoBottomControls } from './VideoBottomControls';

interface VideoOverlayProps {
  // Controls visibility
  showControls: boolean;
  controlsOpacity: SharedValue<number>;
  onVideoPress: () => void;
  // Video state
  isPlaying: boolean;
  isSeekingInProgress: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;

  // Screen info
  screenWidth: number;
  isLandscape: boolean;
  safeAreaTop: number;

  // Event handlers
  onPlayPause: () => void;
  onSeekBackward: (seconds: number) => void;
  onSeekForward: (seconds: number) => void;
  onSeek: (time: number) => void;
  onFullscreenPress: () => void;
  onOptionsPress: () => void;
  onChatPress: () => void;

  // Customization props
  playButtonSize?: number;
  seekButtonSize?: number;
  seekSeconds?: number;
  optionsButtonSize?: number;
  showTimeLabels?: boolean;

  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  isLive: boolean;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  showControls,
  onVideoPress,
  controlsOpacity,
  isPlaying,
  isSeekingInProgress,
  isBuffering,
  currentTime,
  duration,
  isFullscreen,
  screenWidth,
  isLandscape,
  safeAreaTop,
  onPlayPause,
  onSeekBackward,
  onSeekForward,
  onSeek,
  onFullscreenPress,
  onOptionsPress,
  onChatPress,
  playButtonSize = 70,
  seekButtonSize = 50,
  seekSeconds = 10,
  optionsButtonSize = 25,
  showTimeLabels = true,
  colors,
  isLive,
}) => {
  const controlsStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.get(),
    };
  });


  return (
    <TouchableWithoutFeedback onPress={onVideoPress}>
      <Animated.View
        style={[styles.controlsOverlay, controlsStyle]}
        pointerEvents={showControls ? 'auto' : 'box-none'}
      >
        {/* Center Controls */}
        <VideoControls
          isPlaying={isPlaying}
          isSeekingInProgress={isSeekingInProgress}
          isBuffering={isBuffering}
          onPlayPause={onPlayPause}
          onSeekBackward={onSeekBackward}
          onSeekForward={onSeekForward}
          playButtonSize={playButtonSize}
          seekButtonSize={seekButtonSize}
          seekSeconds={seekSeconds}
          isLive={isLive}
        />

        {/* Top Controls */}
        <VideoTopControls
          onOptionsPress={onOptionsPress}
          safeAreaTop={safeAreaTop}
          isLandscape={isLandscape}
          optionsButtonSize={optionsButtonSize}
          isLive={isLive}
          onChatPress={onChatPress}
        />

        {/* Bottom Controls */}
        <VideoBottomControls
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          isSeekingInProgress={isSeekingInProgress}
          isFullscreen={isFullscreen}
          onFullscreenPress={onFullscreenPress}
          screenWidth={screenWidth}
          isLandscape={isLandscape}
          showTimeLabels={showTimeLabels}
          colors={colors}
          isLive={isLive}
        />

        {/* Gradient Overlay */}
        <View style={styles.bottomGradient} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
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