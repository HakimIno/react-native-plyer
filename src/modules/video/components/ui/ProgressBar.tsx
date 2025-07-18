import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator, Vibration, ColorValue } from 'react-native';
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
import { formatTime } from '../../utility/helpers/timeUtils';
import LiveIndicator from './LiveIndicator';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isSeekingInProgress?: boolean;
  showTimeLabels?: boolean;
  screenWidth?: number;
  isFullscreen: boolean;
  handleFullscreenPress: () => void;
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  isLive: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  isSeekingInProgress = false,
  showTimeLabels = true,
  screenWidth,
  isFullscreen,
  handleFullscreenPress,
  colors,
  isLive,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSeekingPreview, setShowSeekingPreview] = useState(false);
  const [previewTimeValue, setPreviewTimeValue] = useState(0);
  const [userSeekTime, setUserSeekTime] = useState<number | null>(null);
  const [displayTime, setDisplayTime] = useState(currentTime);
  const [hasActuallyDragged, setHasActuallyDragged] = useState(false);

  const currentScreenWidth = screenWidth || Dimensions.get('screen').width;
  const progressWidth = currentScreenWidth - 40; // 20px padding on each side
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const barResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const progress = useSharedValue(0);
  const thumbScale = useSharedValue(1);
  const barHeight = useSharedValue(2.5);

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

  React.useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      if (barResetTimeoutRef.current) {
        clearTimeout(barResetTimeoutRef.current);
      }
    };
  }, []);

  const handleSeek = (seekTime: number) => {
    const clampedTime = Math.max(0, Math.min(duration, seekTime));

    setUserSeekTime(clampedTime);
    setDisplayTime(clampedTime);

    Vibration.vibrate(10);

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

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }

    if (show) {
      previewTimeoutRef.current = setTimeout(() => {
        setShowSeekingPreview(false);
      }, 3000);
    }
  };

  const updatePreviewTime = (time: number) => {
    setPreviewTimeValue(time);
  };

  const resetBarToNormal = () => {
    thumbScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    barHeight.value = withSpring(2.5, { damping: 15, stiffness: 200 });
  };

  const setBarToActive = () => {
    if (barResetTimeoutRef.current) {
      clearTimeout(barResetTimeoutRef.current);
    }

    thumbScale.value = withSpring(1.3, { damping: 15, stiffness: 200 });
    barHeight.value = withSpring(6, { damping: 15, stiffness: 200 });

    // ตั้งเวลาให้บาร์กลับสู่สถานะปกติหลังจาก 2 วินาที หากไม่มีการลากต่อ
    barResetTimeoutRef.current = setTimeout(() => {
      resetBarToNormal();
    }, 2000);
  };

  const panGesture = Gesture.Pan()
    .hitSlop({ top: 10, bottom: 10, left: 5, right: 5 })
    .minDistance(3)
    .shouldCancelWhenOutside(false)
    .onStart((event) => {
      runOnJS(setDragging)(true);
      runOnJS(setSeekingPreview)(true);
      runOnJS(setBarToActive)();
      runOnJS(setHasActuallyDragged)(false);

      if (duration > 0) {
        const seekTime = (Math.max(0, Math.min(progressWidth, event.x)) / progressWidth) * duration;
        runOnJS(updatePreviewTime)(seekTime);
        runOnJS(setDisplayTime)(seekTime);
      }
    })
    .onUpdate((event) => {
      runOnJS(setHasActuallyDragged)(true);

      const clampedX = Math.max(0, Math.min(progressWidth, event.x));
      progress.value = clampedX;

      if (duration > 0) {
        const seekTime = (clampedX / progressWidth) * duration;
        runOnJS(updatePreviewTime)(seekTime);
        runOnJS(setDisplayTime)(seekTime);
      }
    })
    .onEnd(() => {
      if (barResetTimeoutRef.current) {
        clearTimeout(barResetTimeoutRef.current);
        barResetTimeoutRef.current = null;
      }

      runOnJS(setDragging)(false);
      runOnJS(setSeekingPreview)(false);
      runOnJS(resetBarToNormal)();

      if (hasActuallyDragged && duration > 0) {
        const finalProgress = progress.value;
        const seekTime = (finalProgress / progressWidth) * duration;
        runOnJS(handleSeek)(seekTime);
      } else if (duration > 0) {
        runOnJS(handleSeek)(previewTimeValue);
      }

      runOnJS(setHasActuallyDragged)(false);
    })
    .onTouchesCancelled(() => {
      if (barResetTimeoutRef.current) {
        clearTimeout(barResetTimeoutRef.current);
        barResetTimeoutRef.current = null;
      }

      runOnJS(setDragging)(false);
      runOnJS(setSeekingPreview)(false);
      runOnJS(resetBarToNormal)();
      runOnJS(setHasActuallyDragged)(false);
    });

  const composedGesture = panGesture;

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

      {(showTimeLabels || isLive) && (
        <View style={styles.timeContainer}>
          {isLive ? (
            <LiveIndicator
              isLive={isLive}
              viewerCount={139000}
            />
          ) : (
            <Text style={styles.timeText}>
              {formatTime(displayTime)}  /  {formatTime(duration)}
            </Text>
          )}

          <FullscreenButton
            isFullscreen={isFullscreen}
            onPress={handleFullscreenPress}
            size={32}
          />
        </View>
      )}

      {/* Seeking Preview */}
      {isLive || showSeekingPreview && (
        <Animated.View style={[styles.seekingPreview, seekingPreviewStyle]}>
          <Text style={styles.seekingText}>
            {formatTime(previewTimeValue)}
          </Text>
        </Animated.View>
      )}

     {!isLive && (
      <View style={styles.progressContainer} pointerEvents="box-only">
        <GestureDetector gesture={composedGesture}>
          <View style={[styles.progressTrack, { width: progressWidth }]}>
            <View style={styles.touchArea} />

            <View style={styles.visualTrack}>
              <Animated.View style={[styles.trackBackground, trackStyle]} />
              <Animated.View style={[styles.progressFill, progressStyle, progressBarStyle]}>
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientFill}
                />
              </Animated.View>
              <Animated.View style={[styles.thumb, thumbStyle]}>
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientThumb}
                />
              </Animated.View>
            </View>
          </View>
        </GestureDetector>
      </View>
     )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  progressTrack: {
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 0,
    height: 30,
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  visualTrack: {
    height: 6,
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
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  gradientThumb: {
    flex: 1,
    borderRadius: 6,
  },
});