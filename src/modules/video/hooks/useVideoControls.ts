import { useState, useEffect, useRef, useCallback } from 'react';
import { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';

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
  const controlsOpacity = useSharedValue(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHidingRef = useRef(false);

  // Clear existing timeout
  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Start auto-hide timer
  const startAutoHideTimer = useCallback(() => {
    clearExistingTimeout();

    if (isPlaying && !isSeekingInProgress) {
      timeoutRef.current = setTimeout(() => {
        hideControls();
      }, autoHideDelay);
    }
  }, [isPlaying, isSeekingInProgress, autoHideDelay]);

  // Show controls with animation
  const showControlsHandler = useCallback(() => {
    clearExistingTimeout();
    isHidingRef.current = false;

    setShowControls(true);
    controlsOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });

    // Start timer to auto-hide if playing
    if (isPlaying && !isSeekingInProgress) {
      startAutoHideTimer();
    }
  }, [isPlaying, isSeekingInProgress, startAutoHideTimer]);

  // Hide controls with animation
  const hideControls = useCallback(() => {
    clearExistingTimeout();
    isHidingRef.current = true;

    controlsOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    }, (finished) => {
      if (finished && isHidingRef.current) {
        runOnJS(setShowControls)(false);
      }
    });
  }, []);

  // Toggle controls visibility
  const toggleControls = useCallback(() => {
    if (showControls && controlsOpacity.value > 0.5) {
      hideControls();
    } else {
      showControlsHandler();
    }
  }, [showControls, hideControls, showControlsHandler]);

  // Reset controls when user interacts (like seeking)
  const resetControls = useCallback(() => {
    showControlsHandler();
  }, [showControlsHandler]);

  // Effect to handle play/pause state changes
  useEffect(() => {
    if (!isPlaying || isSeekingInProgress) {
      // Always show controls when paused or seeking
      showControlsHandler();
    } else if (isPlaying && !isSeekingInProgress && showControls) {
      // Start auto-hide timer when playing
      startAutoHideTimer();
    }
  }, [isPlaying, isSeekingInProgress, showControls, showControlsHandler, startAutoHideTimer]);

  // Effect to handle seeking state changes
  useEffect(() => {
    if (isSeekingInProgress) {
      clearExistingTimeout();
      showControlsHandler();
    }
  }, [isSeekingInProgress, showControlsHandler, clearExistingTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, [clearExistingTimeout]);

  return {
    showControls,
    controlsOpacity,
    showControlsHandler,
    hideControls,
    toggleControls,
    resetControls,
  };
};