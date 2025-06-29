import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFullscreen } from '../store/slices/videoSlice';

export const useFullscreen = () => {
  const dispatch = useAppDispatch();
  const isFullscreen = useAppSelector((state) => state.video.isFullscreen);

  // Enhanced fullscreen management with debug logs
  const enterFullscreen = () => {
    console.log('🔄 Entering fullscreen mode...');
    if (!isFullscreen) {
      dispatch(toggleFullscreen());
    }
  };

  const exitFullscreen = () => {
    console.log('🔄 Exiting fullscreen mode...');
    if (isFullscreen) {
      dispatch(toggleFullscreen());
    }
  };

  const toggleFullscreenMode = () => {
    console.log('🔄 Toggling fullscreen mode:', !isFullscreen);
    dispatch(toggleFullscreen());
  };

  // Debug log for fullscreen state changes
  useEffect(() => {
    console.log('📺 Fullscreen state changed:', isFullscreen);
  }, [isFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreenMode,
  };
}; 