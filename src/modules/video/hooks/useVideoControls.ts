import { useState, useEffect, useRef } from 'react';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

interface UseVideoControlsProps {
  isPlaying: boolean;
  isSeekingInProgress: boolean;
  autoHideDelay?: number;
}

export const useVideoControls = ({
  isPlaying,
  isSeekingInProgress,
  autoHideDelay = 3000,
}: UseVideoControlsProps) => {
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const controlsOpacity = useSharedValue(1);

  useEffect(() => {
    if (showControls && isPlaying) {
      const timeout = setTimeout(() => {
        hideControls();
      }, autoHideDelay);
      setControlsTimeout(timeout);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    } else if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }
  }, [showControls, isPlaying, autoHideDelay]);

  useEffect(() => {
    if (!isPlaying || isSeekingInProgress) {
      showControlsHandler();
    }
  }, [isPlaying, isSeekingInProgress]);

  const showControlsHandler = () => {
    setShowControls(true);
    controlsOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  };

  const hideControls = () => {
    setShowControls(false);
    controlsOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  };

  const toggleControls = () => {
    if (showControls) {
      hideControls();
    } else {
      showControlsHandler();
    }
  };

  return {
    showControls,
    controlsOpacity,
    showControlsHandler,
    hideControls,
    toggleControls,
  };
}; 