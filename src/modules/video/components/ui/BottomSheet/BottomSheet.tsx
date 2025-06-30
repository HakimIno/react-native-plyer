import React, { useEffect, useImperativeHandle, forwardRef, useState, useMemo, useCallback } from 'react';
import { View, Dimensions, ViewStyle, ScrollView } from 'react-native';
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

import { BottomSheetProps, BottomSheetRefProps, ScreenDimensions } from './types';
import { 
  SHEET_HEIGHT_PORTRAIT, 
  SHEET_HEIGHT_LANDSCAPE, 
  ANIMATION_DURATION, 
  CLOSE_ANIMATION_DURATION, 
  Z_INDEX_NORMAL, 
  Z_INDEX_FULLSCREEN,
  VELOCITY_THRESHOLD,
  CLOSE_THRESHOLD_RATIO,
  MAX_OVERSCROLL
} from './constants';
import { getScreenDimensions, calculateSheetHeight } from './utils';
import { styles } from './styles';

export const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ isVisible, onClose, children, isFullscreen = false }, ref) => {
    const { bottom } = useSafeAreaInsets();
    
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({ y: 0 });
    
    const [screenData, setScreenData] = useState<ScreenDimensions>(getScreenDimensions);
    
    const screenHeight = useSharedValue(screenData.height);
    const isLandscape = useSharedValue(screenData.isLandscape);

    const sheetConfig = useMemo(() => ({
      height: calculateSheetHeight(screenData),
      zIndex: isFullscreen ? Z_INDEX_FULLSCREEN : Z_INDEX_NORMAL,
    }), [screenData, isFullscreen]);

    // Update shared values when screen data changes
    useEffect(() => {
      screenHeight.value = screenData.height;
      isLandscape.value = screenData.isLandscape;
    }, [screenData]);

    // Listen for orientation changes
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

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({ open, close, isActive }), [open, close, isActive]);

    // Handle visibility changes
    useEffect(() => {
      if (isVisible) {
        open();
      } else {
        close();
      }
    }, [isVisible, open, close]);

    // Pan gesture for the header area to avoid ScrollView conflicts
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
        translateY.value = Math.min(translateY.value, MAX_OVERSCROLL);
      })
      .onEnd((event) => {
        'worklet';
        const currentHeight = isLandscape.value
          ? screenHeight.value * SHEET_HEIGHT_LANDSCAPE
          : screenHeight.value * SHEET_HEIGHT_PORTRAIT;
        const maxTranslateY = -currentHeight;
        
        const velocityY = event.velocityY;
        const shouldClose = translateY.value > -currentHeight * CLOSE_THRESHOLD_RATIO || velocityY > VELOCITY_THRESHOLD;
        
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

    // Tap gesture for backdrop
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

    // Container styles
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
          <Animated.View 
            style={[styles.backdrop, backdropStyle, rBackdropStyle]} 
            pointerEvents={isVisible ? 'auto' : 'none'} 
          />
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