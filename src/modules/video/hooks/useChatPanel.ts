import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export const useChatPanel = (isChatVisible: boolean, isFullscreen: boolean) => {
  const panelWidth = useSharedValue(0);

  useEffect(() => {
    if (isFullscreen) {
      panelWidth.value = withTiming(isChatVisible ? 300 : 0, { duration: 300 });
    } else {
    
      panelWidth.value = 0; 
    }
  }, [isChatVisible, isFullscreen, panelWidth]);

  const animatedPanelStyle = useAnimatedStyle(() => {
    return {
      width: panelWidth.value,
    };
  });

  return {
    animatedPanelStyle,
  };
}; 