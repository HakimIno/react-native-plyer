import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar } from './ui/ProgressBar';

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomControls: {
    paddingBottom: 20,
  },
  bottomControlsLandscape: {
    paddingBottom: 10,
  },
}); 