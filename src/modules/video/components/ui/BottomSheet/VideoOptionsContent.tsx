import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../../store';
import PlaybackSpeedSelector from '../PlaybackSpeedSelector';
import SubtitleSelector from '../SubtitleSelector';
import { VideoOptionsContentProps, ViewType, ScreenDimensions } from './types';
import { SLIDE_ANIMATION_DURATION } from './constants';
import { getMainOptions } from './utils';
import { styles } from './styles';

export const VideoOptionsContent: React.FC<VideoOptionsContentProps> = ({ isVisible = true }) => {
  const windowDimensions = useWindowDimensions();
  const [currentView, setCurrentView] = useState<ViewType>('main');
  
  // Redux selectors
  const selectedSpeed = useSelector((state: RootState) => (state.video as any).playbackRate);
  const { availableTextTracks, selectedTextTrack } = useSelector((state: RootState) => state.video as any);

  // Reset to main view when component becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setCurrentView('main');
    }
  }, [isVisible]);
  
  // Calculate screen dimensions
  const screenData: ScreenDimensions = useMemo(() => ({
    width: windowDimensions.width,
    height: windowDimensions.height,
    isLandscape: windowDimensions.width > windowDimensions.height,
  }), [windowDimensions.width, windowDimensions.height]);
  
  // Animation values
  const slideX = useSharedValue(0);
  const screenWidth = useSharedValue(screenData.width);

  // Update screen width when dimensions change
  useEffect(() => {
    screenWidth.value = screenData.width;
  }, [screenData.width]);

  // Handle slide animations based on current view
  useEffect(() => {
    const getTranslateX = () => {
      switch (currentView) {
        case 'playback-speed':
          return -screenWidth.value;
        case 'subtitles':
          return -screenWidth.value * 2;
        default:
          return 0;
      }
    };

    slideX.value = withTiming(getTranslateX(), {
      duration: SLIDE_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [currentView, slideX, screenWidth]);

  // Get main options
  const mainOptions = useMemo(() => getMainOptions(), []);

  // Handle main option press
  const handleMainOptionPress = useCallback((optionId: string) => {
    switch (optionId) {
      case 'playback-speed':
        setCurrentView('playback-speed');
        break;
      case 'quality':
        // TODO: Implement quality selector
        break;
      case 'subtitles':
        setCurrentView('subtitles');
        break;
      case 'audio':
        // TODO: Implement audio track selector
        break;
      default:
        break;
    }
  }, []);

  // Handle back press from sub-views
  const handleBackPress = useCallback(() => {
    setCurrentView('main');
  }, []);

  // Get current value text for options
  const getCurrentValueText = useCallback((optionId: string) => {
    switch (optionId) {
      case 'playback-speed':
        return `${selectedSpeed}x`;
      case 'subtitles':
        if (selectedTextTrack.type === 'disabled') {
          return 'Off';
        }
        if (selectedTextTrack.type === 'index' && availableTextTracks[selectedTextTrack.value as number]) {
          return availableTextTracks[selectedTextTrack.value as number].label || `Track ${(selectedTextTrack.value as number) + 1}`;
        }
        return availableTextTracks.length > 0 
          ? availableTextTracks[0].label || 'Track 1'
          : 'None';
      default:
        return null;
    }
  }, [selectedSpeed, selectedTextTrack, availableTextTracks]);

  // Animated styles for slide views
  const mainViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const speedViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value + screenWidth.value }],
  }));

  const subtitleViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value + screenWidth.value * 2 }],
  }));

  // Render main option item
  const renderOptionItem = useCallback((option: any) => {
    const currentValue = getCurrentValueText(option.id);
    
    return (
      <TouchableOpacity 
        key={option.id} 
        style={[styles.optionItem, screenData.isLandscape && styles.optionItemLandscape]}
        onPress={() => handleMainOptionPress(option.id)}
      >
        <Ionicons name={option.icon as any} size={20} color="#fff" />
        <Text style={styles.optionText}>{option.title}</Text>
        {currentValue && (
          <Text style={styles.currentValueText}>{currentValue}</Text>
        )}
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>
    );
  }, [screenData.isLandscape, handleMainOptionPress, getCurrentValueText]);

  return (
    <View style={[styles.optionsContainer, screenData.isLandscape && styles.optionsContainerLandscape]}>
      <View style={styles.slideContainer}>
        {/* Main Options View */}
        <Animated.View style={[styles.slideView, mainViewStyle]}>
          {mainOptions.map(renderOptionItem)}
        </Animated.View>

        {/* Playback Speed View */}
        <Animated.View style={[styles.slideView, speedViewStyle]}>
          <PlaybackSpeedSelector onBackPress={handleBackPress} />
        </Animated.View>

        {/* Subtitles View */}
        <Animated.View style={[styles.slideView, subtitleViewStyle]}>
          <SubtitleSelector onBackPress={handleBackPress} />
        </Animated.View>
      </View>
    </View>
  );
}; 