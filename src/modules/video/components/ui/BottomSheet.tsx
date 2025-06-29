import React, { useEffect, useImperativeHandle, forwardRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../../../store';
import PlaybackSpeedSelector from './PlaybackSpeedSelector';

// Constants
const SHEET_HEIGHT_PORTRAIT = 0.3;
const SHEET_HEIGHT_LANDSCAPE = 0.65;
const ANIMATION_DURATION = 250;
const CLOSE_ANIMATION_DURATION = 200;
const Z_INDEX_NORMAL = 1500;
const Z_INDEX_FULLSCREEN = 2000;

// Types
interface ScreenDimensions {
  width: number;
  height: number;
  isLandscape: boolean;
}

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  isFullscreen?: boolean;
}

export interface BottomSheetRefProps {
  isActive: () => boolean;
  close: () => void;
  open: () => void;
}

// Utilities
const getScreenDimensions = (): ScreenDimensions => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isLandscape: width > height,
  };
};

const calculateSheetHeight = (screenData: ScreenDimensions): number => {
  const percentage = screenData.isLandscape ? SHEET_HEIGHT_LANDSCAPE : SHEET_HEIGHT_PORTRAIT;
  return screenData.height * percentage;
};

export const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ isVisible, onClose, children, isFullscreen = false }, ref) => {
    const { bottom } = useSafeAreaInsets();
    
    // Animated values
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({ y: 0 });
    
    // Screen dimensions
    const [screenData, setScreenData] = useState(getScreenDimensions);
    
    // Shared values for worklets
    const screenHeight = useSharedValue(screenData.height);
    const isLandscape = useSharedValue(screenData.isLandscape);

    // Cached values to reduce calculations
    const sheetConfig = useMemo(() => ({
      height: calculateSheetHeight(screenData),
      zIndex: isFullscreen ? Z_INDEX_FULLSCREEN : Z_INDEX_NORMAL,
    }), [screenData, isFullscreen]);

    // Update shared values when screen data changes
    useEffect(() => {
      screenHeight.value = screenData.height;
      isLandscape.value = screenData.isLandscape;
    }, [screenData]);

    // Dimension change handler
    useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        const newData = {
          width: window.width,
          height: window.height,
          isLandscape: window.width > window.height,
        };
        setScreenData(newData);
      });

      return () => subscription?.remove();
    }, []);

    // Animation functions
    const open = () => {
      'worklet';
      active.value = true;
      const currentHeight = isLandscape.value
        ? screenHeight.value * SHEET_HEIGHT_LANDSCAPE
        : screenHeight.value * SHEET_HEIGHT_PORTRAIT;
      const maxTranslateY = -currentHeight;
      
      translateY.value = withTiming(maxTranslateY, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      });
    };

    const close = () => {
      'worklet';
      active.value = false;
      translateY.value = withTiming(0, {
        duration: CLOSE_ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      });
    };

    const isActive = () => active.value;

    // Imperative handle
    useImperativeHandle(ref, () => ({ open, close, isActive }), []);

    // Visibility effect
    useEffect(() => {
      if (isVisible) {
        open();
      } else {
        close();
      }
    }, [isVisible]);

    // Gesture handlers
    const panGesture = Gesture.Pan()
      .onStart(() => {
        'worklet';
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        'worklet';
        const currentHeight = isLandscape.value
          ? screenHeight.value * SHEET_HEIGHT_LANDSCAPE
          : screenHeight.value * SHEET_HEIGHT_PORTRAIT;
        const maxTranslateY = -currentHeight;
        
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, maxTranslateY);
        translateY.value = Math.min(translateY.value, 50);
      })
      .onEnd((event) => {
        'worklet';
        const currentHeight = isLandscape.value
          ? screenHeight.value * SHEET_HEIGHT_LANDSCAPE
          : screenHeight.value * SHEET_HEIGHT_PORTRAIT;
        const maxTranslateY = -currentHeight;
        
        const velocityY = event.velocityY;
        const shouldClose = translateY.value > -currentHeight / 2 || velocityY > 500;
        
        if (shouldClose) {
          translateY.value = withTiming(0, {
            duration: CLOSE_ANIMATION_DURATION,
            easing: Easing.out(Easing.quad),
          });
          runOnJS(onClose)();
        } else {
          translateY.value = withTiming(maxTranslateY, {
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.quad),
          });
        }
      });

    const tapGesture = Gesture.Tap().onStart(() => {
      'worklet';
      translateY.value = withTiming(0, {
        duration: CLOSE_ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      });
      runOnJS(onClose)();
    });

    // Animated styles
    const rBottomSheetStyle = useAnimatedStyle(() => {
      const currentHeight = isLandscape.value
        ? screenHeight.value * SHEET_HEIGHT_LANDSCAPE
        : screenHeight.value * SHEET_HEIGHT_PORTRAIT;
      const maxTranslateY = -currentHeight;
      
      const borderRadius = interpolate(
        translateY.value,
        [maxTranslateY + 50, maxTranslateY],
        [25, 25],
        Extrapolate.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    const rBackdropStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isVisible ? 1 : 0, {
          duration: CLOSE_ANIMATION_DURATION,
          easing: Easing.out(Easing.quad),
        }),
      };
    }, [isVisible]);

    // Memoized container style
    const containerStyle = useMemo((): ViewStyle => ({
      height: sheetConfig.height,
      top: screenData.height,
      paddingBottom: bottom,
      width: (screenData.isLandscape ? '50%' : '95%') as any,
      alignSelf: 'center',
      maxWidth: screenData.isLandscape ? 600 : undefined,
      zIndex: sheetConfig.zIndex,
      elevation: sheetConfig.zIndex,
    }), [sheetConfig, screenData, bottom]);

    const backdropStyle = useMemo((): ViewStyle => ({
      zIndex: sheetConfig.zIndex,
      elevation: sheetConfig.zIndex,
    }), [sheetConfig.zIndex]);

    return (
      <>
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={[styles.backdrop, backdropStyle, rBackdropStyle]} pointerEvents={isVisible ? 'auto' : 'none'} />
        </GestureDetector>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.bottomSheetContainer, containerStyle, rBottomSheetStyle]}>
            <View style={styles.line} />
            <View style={[styles.content, screenData.isLandscape && styles.contentLandscape]}>
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

// VideoOptionsContent
const VideoOptionsContent: React.FC = () => {
  const [screenData, setScreenData] = useState(getScreenDimensions);
  const [currentView, setCurrentView] = useState<'main' | 'playback-speed'>('main');
  const selectedSpeed = useSelector((state: RootState) => state.video.playbackRate);
  
  // Animation for slide transition
  const slideX = useSharedValue(0);

  useEffect(() => {
    const handleDimensionChange = ({ window }: { window: { width: number; height: number } }) => {
      const newData = {
        width: window.width,
        height: window.height,
        isLandscape: window.width > window.height,
      };
      setScreenData(prevData => {
        // Only update if data actually changed
        if (prevData.width !== newData.width || 
            prevData.height !== newData.height || 
            prevData.isLandscape !== newData.isLandscape) {
          return newData;
        }
        return prevData;
      });
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionChange);
    return () => subscription?.remove();
  }, []);

  // Animate slide transition when currentView changes
  useEffect(() => {
    if (currentView === 'playback-speed') {
      // Slide to show playback speed view (slide main view to left, bring speed view from right)
      slideX.value = withTiming(-screenData.width, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    } else {
      // Slide back to main view (slide speed view to right, bring main view from left)
      slideX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [currentView, screenData.width]);

  const mainOptions = useMemo(() => [
    { id: 'playback-speed', title: 'Playback Speed', icon: 'speedometer-outline' as const },
    { id: 'quality', title: 'Video Quality', icon: 'settings-outline' as const },
    { id: 'subtitles', title: 'Subtitles', icon: 'chatbox-ellipses-outline' as const },
    { id: 'audio', title: 'Audio Track', icon: 'volume-high-outline' as const },
  ], []);

  const handleMainOptionPress = useCallback((optionId: string) => {
    switch (optionId) {
      case 'playback-speed':
        setCurrentView('playback-speed');
        break;
      case 'quality':
        // Handle quality selection
        break;
      case 'subtitles':
        // Handle subtitles selection
        break;
      case 'audio':
        // Handle audio track selection
        break;
      default:
        break;
    }
  }, []);

  const handleBackPress = useCallback(() => {
    setCurrentView('main');
  }, []);

  // Animated styles for both views
  const mainViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value }],
    };
  });

  const speedViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value + screenData.width }],
    };
  });

  return (
    <View style={[styles.optionsContainer, screenData.isLandscape && styles.optionsContainerLandscape]}>
      <View style={styles.slideContainer}>
        {/* Main Options View */}
        <Animated.View style={[styles.slideView, mainViewStyle]}>
          {mainOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={[styles.optionItem, screenData.isLandscape && styles.optionItemLandscape]}
              onPress={() => handleMainOptionPress(option.id)}
            >
              <Ionicons name={option.icon as any} size={20} color="#fff" />
              <Text style={styles.optionText}>{option.title}</Text>
              {option.id === 'playback-speed' && (
                <Text style={styles.currentValueText}>{selectedSpeed}x</Text>
              )}
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Playback Speed View */}
        <Animated.View style={[styles.slideView, speedViewStyle]}>
          <PlaybackSpeedSelector
            onBackPress={handleBackPress}
            isLandscape={screenData.isLandscape}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheetContainer: {
    backgroundColor: 'rgba(10, 10, 10, 1)',
    position: 'absolute',
    borderRadius: 15,
    pointerEvents: 'auto',
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: '#666',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  contentLandscape: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionsContainerLandscape: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionItemLandscape: {
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
    flex: 1,
  },
  currentValueText: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  slideContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
  },
  slideView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
});

export { VideoOptionsContent }; 