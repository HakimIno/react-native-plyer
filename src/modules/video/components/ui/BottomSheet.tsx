import React, { useEffect, useImperativeHandle, forwardRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ViewStyle, useWindowDimensions, ScrollView } from 'react-native';
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
import SubtitleSelector from './SubtitleSelector';

// Constants
const SHEET_HEIGHT_PORTRAIT = 0.35;
const SHEET_HEIGHT_LANDSCAPE = 0.7;
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
    
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({ y: 0 });
    
    const [screenData, setScreenData] = useState(getScreenDimensions);
    
    const screenHeight = useSharedValue(screenData.height);
    const isLandscape = useSharedValue(screenData.isLandscape);

    const sheetConfig = useMemo(() => ({
      height: calculateSheetHeight(screenData),
      zIndex: isFullscreen ? Z_INDEX_FULLSCREEN : Z_INDEX_NORMAL,
    }), [screenData, isFullscreen]);

    useEffect(() => {
      screenHeight.value = screenData.height;
      isLandscape.value = screenData.isLandscape;
    }, [screenData]);

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

    const open = useCallback(() => {
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
    }, []);

    const close = useCallback(() => {
      'worklet';
      active.value = false;
      translateY.value = withTiming(0, {
        duration: CLOSE_ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      });
    }, []);

    const isActive = useCallback(() => active.value, []);

    useImperativeHandle(ref, () => ({ open, close, isActive }), [open, close, isActive]);

    useEffect(() => {
      if (isVisible) {
        open();
      } else {
        close();
      }
    }, [isVisible]);

    // Pan gesture only for the line/header area to avoid ScrollView conflicts
    const headerPanGesture = Gesture.Pan()
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

    const containerStyle = useMemo((): ViewStyle => ({
      height: sheetConfig.height,
      top: screenData.height,
      paddingBottom: bottom,
      width: (screenData.isLandscape ? '55%' : '93%') as any,
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

        <Animated.View style={[styles.bottomSheetContainer, containerStyle, rBottomSheetStyle]}>
          <GestureDetector gesture={headerPanGesture}>
            <View style={styles.headerDragArea}>
              <View style={styles.line} />
            </View>
          </GestureDetector>
          <ScrollView 
            style={[styles.content, screenData.isLandscape && styles.contentLandscape]}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            scrollEnabled={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </>
    );
  }
);

interface VideoOptionsContentProps {
  isVisible?: boolean;
}

const VideoOptionsContent: React.FC<VideoOptionsContentProps> = ({ isVisible = true }) => {
  const windowDimensions = useWindowDimensions();
  const [currentView, setCurrentView] = useState<'main' | 'playback-speed' | 'subtitles'>('main');
  const selectedSpeed = useSelector((state: RootState) => (state.video as any).playbackRate);
  const { availableTextTracks, selectedTextTrack } = useSelector((state: RootState) => state.video as any);

  useEffect(() => {
    if (!isVisible) {
      setCurrentView('main');
    }
  }, [isVisible]);
  
  const screenData = useMemo(() => ({
    width: windowDimensions.width,
    height: windowDimensions.height,
    isLandscape: windowDimensions.width > windowDimensions.height,
  }), [windowDimensions.width, windowDimensions.height]);
  
  const slideX = useSharedValue(0);
  const screenWidth = useSharedValue(screenData.width);

  useEffect(() => {
    screenWidth.value = screenData.width;
  }, [screenData.width]);

  useEffect(() => {
    if (currentView === 'playback-speed') {
      slideX.value = withTiming(-screenWidth.value, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
    } else if (currentView === 'subtitles') {
      slideX.value = withTiming(-screenWidth.value * 2, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      slideX.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [currentView, slideX, screenWidth]);

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
        break;
      case 'subtitles':
        setCurrentView('subtitles');
        break;
      case 'audio':
        break;
      default:
        break;
    }
  }, []);

  const handleBackPress = useCallback(() => {
    setCurrentView('main');
  }, []);

  const mainViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value }],
    };
  });

  const speedViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value + screenWidth.value }],
    };
  });

  const subtitleViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value + screenWidth.value * 2 }],
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
              {option.id === 'subtitles' && (
                <Text style={styles.currentValueText}>
                  {selectedTextTrack.type === 'disabled' 
                    ? 'Off' 
                    : selectedTextTrack.type === 'index' && availableTextTracks[selectedTextTrack.value as number]
                    ? availableTextTracks[selectedTextTrack.value as number].label || `Track ${(selectedTextTrack.value as number) + 1}`
                    : availableTextTracks.length > 0 
                    ? availableTextTracks[0].label || 'Track 1'
                    : 'None'}
                </Text>
              )}
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Playback Speed View */}
        <Animated.View style={[styles.slideView, speedViewStyle]}>
          <PlaybackSpeedSelector
            onBackPress={handleBackPress}
          />
        </Animated.View>

        {/* Subtitles View */}
        <Animated.View style={[styles.slideView, subtitleViewStyle]}>
          <SubtitleSelector
            onBackPress={handleBackPress}
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
  },
  contentLandscape: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  optionsContainer: {
    paddingHorizontal: 0,
  },
  optionsContainerLandscape: {
    paddingHorizontal: 0,
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
  headerDragArea: {
    padding: 10,
  },
});

export { VideoOptionsContent }; 