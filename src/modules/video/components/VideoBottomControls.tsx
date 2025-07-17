import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
import { ProgressBar } from './ui';

interface VideoBottomControlsProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isSeekingInProgress: boolean;
  isFullscreen: boolean;
  onFullscreenPress: () => void;
  screenWidth: number;
  isLandscape: boolean;
  showTimeLabels?: boolean;
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  isLive: boolean;
}

export const VideoBottomControls: React.FC<VideoBottomControlsProps> = ({
  currentTime,
  duration,
  onSeek,
  isSeekingInProgress,
  isFullscreen,
  onFullscreenPress,
  screenWidth,
  isLandscape,
  showTimeLabels = true,
  colors,
  isLive,
}) => {
  const bottomControlsStyle = [
    styles.bottomControls,
    isLandscape && styles.bottomControlsLandscape
  ];

  return (
    <View style={bottomControlsStyle}>
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
        isSeekingInProgress={isSeekingInProgress}
        showTimeLabels={showTimeLabels}
        screenWidth={screenWidth}
        isFullscreen={isFullscreen}
        handleFullscreenPress={onFullscreenPress}
        colors={colors}
        isLive={isLive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomControls: {
    paddingBottom: 20,
  },
  bottomControlsLandscape: {
    paddingBottom: 15,
  },
}); 