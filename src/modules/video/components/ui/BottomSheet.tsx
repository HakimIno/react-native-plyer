import React, { useEffect, useImperativeHandle, forwardRef, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isLandscape: width > height,
  };
};

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface BottomSheetRefProps {
  isActive: () => boolean;
  close: () => void;
  open: () => void;
}

export const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ isVisible, onClose, children }, ref) => {
    const { bottom } = useSafeAreaInsets();
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({ y: 0 });
    
    const [screenData, setScreenData] = useState(getScreenDimensions);

    useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        setScreenData({
          width: window.width ,
          height: window.height,
          isLandscape: window.width > window.height,
        });
      });

      return () => subscription?.remove();
    }, []);

    // Calculate dynamic values based on current orientation
    const BOTTOM_SHEET_HEIGHT = screenData.isLandscape 
      ? screenData.height * 0.75  // 75% in landscape
      : screenData.height * 0.35; // 35% in portrait
    
    const MAX_TRANSLATE_Y = -BOTTOM_SHEET_HEIGHT;

    const open = useCallback(() => {
      'worklet';
      active.value = true;
      translateY.value = withTiming(MAX_TRANSLATE_Y, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, []);

    const close = useCallback(() => {
      'worklet';
      active.value = false;
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ open, close, isActive }), [open, close, isActive]);

    useEffect(() => {
      if (isVisible) {
        open();
      } else {
        close();
      }
    }, [isVisible, open, close]);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    const panGesture = Gesture.Pan()
      .onStart(() => {
        'worklet';
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        'worklet';
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        translateY.value = Math.min(translateY.value, 50);
      })
      .onEnd((event) => {
        'worklet';
        const velocityY = event.velocityY;
        const shouldClose = translateY.value > -BOTTOM_SHEET_HEIGHT / 2 || velocityY > 500;
        
        if (shouldClose) {
          translateY.value = withTiming(0, {
            duration: 250,
            easing: Easing.out(Easing.cubic),
          });
          runOnJS(handleClose)();
        } else {
          translateY.value = withTiming(MAX_TRANSLATE_Y, {
            duration: 300,
            easing: Easing.out(Easing.back(1.2)),
          });
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
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
          duration: 250,
          easing: Easing.out(Easing.quad),
        }),
      };
    }, [isVisible]);

    const tapGesture = Gesture.Tap().onStart(() => {
      'worklet';
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
      runOnJS(handleClose)();
    });

    return (
      <>
        {/* Backdrop */}
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={[styles.backdrop, rBackdropStyle]} />
        </GestureDetector>

        {/* Bottom Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[
            styles.bottomSheetContainer, 
            {
              height: BOTTOM_SHEET_HEIGHT,
              top: screenData.height,
              paddingBottom: bottom,
              width: screenData.isLandscape ? '50%' : '95%',
              alignSelf: 'center',
              maxWidth: screenData.isLandscape ? 600 : undefined,
            },
            rBottomSheetStyle
          ]}>
            <View style={styles.line} />
            
           

            {/* Content */}
            <View style={[styles.content, screenData.isLandscape && styles.contentLandscape]}>
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

const VideoOptionsContent: React.FC = () => {
  const [screenData, setScreenData] = useState(getScreenDimensions);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({
        width: window.width,
        height: window.height,
        isLandscape: window.width > window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  const options = [
    { id: 'playback-speed', title: 'Playback Speed', icon: 'speedometer-outline' },
    { id: 'quality', title: 'Video Quality', icon: 'settings-outline' },
    { id: 'subtitles', title: 'Subtitles', icon: 'chatbox-ellipses-outline' },
    { id: 'audio', title: 'Audio Track', icon: 'volume-high-outline' },
  ];

  return (
    <View style={[styles.optionsContainer, screenData.isLandscape && styles.optionsContainerLandscape]}>
      {options.map((option) => (
        <TouchableOpacity key={option.id} style={[styles.optionItem, screenData.isLandscape && styles.optionItemLandscape]}>
          <Ionicons name={option.icon as any} size={20} color="#fff" />
          <Text style={styles.optionText}>{option.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheetContainer: {
    backgroundColor: 'rgba(20, 20, 20, 1)',
    position: 'absolute',
    borderRadius: 15,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerLandscape: {
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
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
    paddingVertical: 18,
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
});

export { VideoOptionsContent }; 