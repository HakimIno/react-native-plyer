import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

interface UseVideoOrientationProps {
  isFullscreen: boolean;
}

export const useVideoOrientation = ({ isFullscreen }: UseVideoOrientationProps) => {
  useEffect(() => {
    const handleOrientationChange = async () => {
      try {
        if (isFullscreen) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } else {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          setTimeout(async () => {
            await ScreenOrientation.unlockAsync();
          }, 500);
        }
      } catch (error) {
        console.warn('Orientation change error:', error);
      }
    };

    handleOrientationChange();

    return () => {
      ScreenOrientation.unlockAsync().catch(() => {
        // Silent fail for cleanup
      });
    };
  }, [isFullscreen]);
}; 