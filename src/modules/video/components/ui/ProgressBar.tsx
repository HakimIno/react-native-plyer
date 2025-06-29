import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { FullscreenButton } from './FullscreenButton';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isSeekingInProgress?: boolean;
  showTimeLabels?: boolean;
  screenWidth?: number;
  isFullscreen: boolean;
  handleFullscreenPress: () => void;
}

const formatTime = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  isSeekingInProgress = false,
  showTimeLabels = true,
  screenWidth,
  isFullscreen,
  handleFullscreenPress,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSeekingPreview, setShowSeekingPreview] = useState(false);
  const [previewTimeValue, setPreviewTimeValue] = useState(0);
  const [userSeekTime, setUserSeekTime] = useState<number | null>(null);
  const [displayTime, setDisplayTime] = useState(currentTime);

  const currentScreenWidth = screenWidth || Dimensions.get('screen').width;
  const progressWidth = currentScreenWidth - 40; // 20px padding on each side
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const progress = useSharedValue(0);
  const thumbScale = useSharedValue(1);
  const barHeight = useSharedValue(2);
  
  // Derived value for seeking preview position to follow animated progress
  const seekingPreviewPosition = useDerivedValue(() => {
    return Math.min(currentScreenWidth - 100, Math.max(50, progress.value + 20));
  });

  const effectiveTime = userSeekTime !== null ? userSeekTime : currentTime;
  const effectiveProgress = duration > 0 ? (effectiveTime / duration) * progressWidth : 0;

  React.useEffect(() => {
    if (!isDragging) {
      progress.value = withSpring(effectiveProgress, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
      setDisplayTime(effectiveTime);
    }
  }, [effectiveProgress, isDragging, effectiveTime]);

  React.useEffect(() => {
    if (userSeekTime !== null && !isSeekingInProgress && !isDragging) {
      const timeDiff = Math.abs(currentTime - userSeekTime);
      if (timeDiff < 1) {
        setUserSeekTime(null);
      }
    }
  }, [currentTime, userSeekTime, isSeekingInProgress, isDragging]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const handleSeek = (seekTime: number) => {
    const clampedTime = Math.max(0, Math.min(duration, seekTime));

    setUserSeekTime(clampedTime);
    setDisplayTime(clampedTime);

    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }

    seekTimeoutRef.current = setTimeout(() => {
      setUserSeekTime(null);
    }, 3000);

    onSeek(clampedTime);
  };

  const setDragging = (dragging: boolean) => {
    setIsDragging(dragging);
  };

  const setSeekingPreview = (show: boolean) => {
    setShowSeekingPreview(show);
    
    // Clear existing timeout
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    
    // Set 3-second timeout to hide preview if showing
    if (show) {
      previewTimeoutRef.current = setTimeout(() => {
        setShowSeekingPreview(false);
      }, 3000);
    }
  };

  const updatePreviewTime = (time: number) => {
    setPreviewTimeValue(time);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setDragging)(true);
      runOnJS(setSeekingPreview)(true);
      thumbScale.value = withSpring(1.3, { damping: 15, stiffness: 200 });
      barHeight.value = withSpring(6, { damping: 15, stiffness: 200 });
    })
    .onUpdate((event) => {
      const clampedX = Math.max(0, Math.min(progressWidth, event.x));

      progress.value = clampedX;

      if (duration > 0) {
        const seekTime = (clampedX / progressWidth) * duration;
        runOnJS(updatePreviewTime)(seekTime);
        runOnJS(setDisplayTime)(seekTime);
      }
    })
    .onEnd(() => {
      const finalProgress = progress.value;

      runOnJS(setDragging)(false);
      runOnJS(setSeekingPreview)(false);
      thumbScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      barHeight.value = withSpring(2, { damping: 15, stiffness: 200 });

      if (duration > 0) {
        const seekTime = (finalProgress / progressWidth) * duration;
        runOnJS(handleSeek)(seekTime);
      }
    });

  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      const clampedX = Math.max(0, Math.min(progressWidth, event.x));

      progress.value = withSpring(clampedX, {
        damping: 20,
        stiffness: 300,
      });

      if (duration > 0) {
        const seekTime = (clampedX / progressWidth) * duration;
        runOnJS(handleSeek)(seekTime);
      }
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: Math.max(0, Math.min(progressWidth, progress.get())),
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const clampedX = Math.max(0, Math.min(progressWidth, progress.get()));
    return {
      transform: [
        { translateX: clampedX - 8 }, 
        { scale: thumbScale.get() }
      ],
    };
  });

  const trackStyle = useAnimatedStyle(() => {
    return {
      height: barHeight.get(),
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      height: barHeight.get(),
    };
  });

  const seekingPreviewStyle = useAnimatedStyle(() => {
    return {
      left: seekingPreviewPosition.get(),
    };
  });

  return (
    <View style={styles.container}>
      {showTimeLabels && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(displayTime)}  /  {formatTime(duration)}
          </Text>
          <FullscreenButton
              isFullscreen={isFullscreen}
              onPress={handleFullscreenPress}
              size={32}
            />
        </View>
      )}

      {/* Seeking Preview */}
      {showSeekingPreview && (
        <Animated.View style={[styles.seekingPreview, seekingPreviewStyle]}>
          <Text style={styles.seekingText}>
            {formatTime(previewTimeValue)}
          </Text>
        </Animated.View>
      )}

      <View style={styles.progressContainer}>
        <GestureDetector gesture={composedGesture}>
          <View style={[styles.progressTrack, { width: progressWidth }]}>
            <Animated.View style={[styles.trackBackground, trackStyle]} />
            <Animated.View style={[styles.progressFill, progressStyle, progressBarStyle]}>
              <LinearGradient
                colors={['#007AFF', '#007AFF', '#007AFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientFill}
              />
            </Animated.View>
            <Animated.View style={[styles.thumb, thumbStyle]}>
              <LinearGradient
                colors={['#ffffff', '#ffffff', '#ffffff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientThumb}
              />
            </Animated.View>
          </View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  seekingPreview: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    zIndex: 1000,
    transform: [{ translateX: -25 }],
  },
  seekingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  progressTrack: {
    height: 0,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    position: 'absolute',
    borderRadius: 3,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  gradientFill: {
    flex: 1,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
  },
  gradientThumb: {
    flex: 1,
    borderRadius: 6,
  },
}); 