import { useEffect, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

// Constants
const UNLOCK_DELAY = 800;
const FORCE_CHANGE_DELAY = 100;

// Types
interface UseVideoOrientationProps {
  isFullscreen: boolean;
  allowFreeRotation?: boolean;
  enableSmartLocking?: boolean;
  lockPortraitWhenNotFullscreen?: boolean;
}

type OrientationTarget = ScreenOrientation.OrientationLock | 'unlock';

// Preset configurations
export const OrientationPresets = {
  CLASSIC: {
    allowFreeRotation: false,
    enableSmartLocking: false,
    lockPortraitWhenNotFullscreen: true,
  },
  AUTO: {
    allowFreeRotation: true,
    enableSmartLocking: true,
    lockPortraitWhenNotFullscreen: true,
  },
  MODERN: {
    allowFreeRotation: true,
    enableSmartLocking: true,
    lockPortraitWhenNotFullscreen: false,
  },
  MOBILE_FIRST: {
    allowFreeRotation: true,
    enableSmartLocking: true,
    lockPortraitWhenNotFullscreen: true,
  },
  TABLET_OPTIMIZED: {
    allowFreeRotation: true,
    enableSmartLocking: true,
    lockPortraitWhenNotFullscreen: false,
  },
  STRICT: {
    allowFreeRotation: false,
    enableSmartLocking: true,
    lockPortraitWhenNotFullscreen: true,
  },
  FREE: {
    allowFreeRotation: true,
    enableSmartLocking: false,
    lockPortraitWhenNotFullscreen: false,
  },
} as const;

export type OrientationPreset = keyof typeof OrientationPresets;

export const getOrientationConfig = (preset: OrientationPreset) => {
  return OrientationPresets[preset];
};

// Utility functions
const getTargetOrientation = (
  isFullscreen: boolean,
  justExitedFullscreen: boolean,
  lockPortraitWhenNotFullscreen: boolean,
  allowFreeRotation: boolean
): { orientation: OrientationTarget; forceChange: boolean; shouldDelayUnlock: boolean } => {
  if (isFullscreen) {
    return {
      orientation: ScreenOrientation.OrientationLock.LANDSCAPE,
      forceChange: false,
      shouldDelayUnlock: false,
    };
  }

  if (lockPortraitWhenNotFullscreen) {
    return {
      orientation: ScreenOrientation.OrientationLock.PORTRAIT_UP,
      forceChange: justExitedFullscreen,
      shouldDelayUnlock: allowFreeRotation,
    };
  }

  return {
    orientation: 'unlock',
    forceChange: false,
    shouldDelayUnlock: false,
  };
};

const shouldApplyOrientation = (
  targetOrientation: OrientationTarget,
  currentOrientation: ScreenOrientation.OrientationLock | null,
  forceChange: boolean,
  isFullscreen: boolean,
  lockPortraitWhenNotFullscreen: boolean
): boolean => {
  if (forceChange) return true;
  if (currentOrientation !== targetOrientation) return true;
  
  return !isFullscreen && 
    lockPortraitWhenNotFullscreen && 
    targetOrientation === ScreenOrientation.OrientationLock.PORTRAIT_UP;
};

const applyOrientationChange = async (
  targetOrientation: OrientationTarget,
  forceChange: boolean,
  currentOrientationRef: React.MutableRefObject<ScreenOrientation.OrientationLock | null>
): Promise<void> => {
  if (targetOrientation === 'unlock') {
    await ScreenOrientation.unlockAsync();
    currentOrientationRef.current = null;
    return;
  }

  if (forceChange) {
    await ScreenOrientation.unlockAsync();
    await new Promise(resolve => setTimeout(resolve, FORCE_CHANGE_DELAY));
  }

  await ScreenOrientation.lockAsync(targetOrientation);
  currentOrientationRef.current = targetOrientation;
};

export const useVideoOrientation = ({ 
  isFullscreen, 
  allowFreeRotation = true,
  enableSmartLocking = true,
  lockPortraitWhenNotFullscreen = false
}: UseVideoOrientationProps) => {
  const currentOrientation = useRef<ScreenOrientation.OrientationLock | null>(null);
  const isChangingOrientation = useRef(false);
  const prevIsFullscreen = useRef(isFullscreen);

  useEffect(() => {
    const handleOrientationChange = async () => {
      if (isChangingOrientation.current) return;

      try {
        isChangingOrientation.current = true;
        
        const justExitedFullscreen = prevIsFullscreen.current && !isFullscreen;
        prevIsFullscreen.current = isFullscreen;

        const { orientation: targetOrientation, forceChange, shouldDelayUnlock } = getTargetOrientation(
          isFullscreen,
          justExitedFullscreen,
          lockPortraitWhenNotFullscreen,
          allowFreeRotation
        );

        const shouldApply = enableSmartLocking
          ? shouldApplyOrientation(
              targetOrientation,
              currentOrientation.current,
              forceChange,
              isFullscreen,
              lockPortraitWhenNotFullscreen
            )
          : true;

        if (shouldApply || targetOrientation === 'unlock') {
          await applyOrientationChange(targetOrientation, forceChange, currentOrientation);
        }

        // Handle delayed unlock
        if (shouldDelayUnlock && !isFullscreen) {
          setTimeout(async () => {
            try {
              if (!isFullscreen && 
                  currentOrientation.current === ScreenOrientation.OrientationLock.PORTRAIT_UP) {
                await ScreenOrientation.unlockAsync();
                currentOrientation.current = null;
              }
            } catch (error) {
              console.warn('Delayed unlock error:', error);
            }
          }, UNLOCK_DELAY);
        }

      } catch (error) {
        console.warn('Orientation change error:', error);
      } finally {
        isChangingOrientation.current = false;
      }
    };

    handleOrientationChange();

    return () => {
      if (!isChangingOrientation.current) {
        ScreenOrientation.unlockAsync().catch(() => {});
      }
      currentOrientation.current = null;
    };
  }, [isFullscreen, allowFreeRotation, enableSmartLocking, lockPortraitWhenNotFullscreen]);

  // Manual control functions
  const forcePortrait = async () => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      currentOrientation.current = ScreenOrientation.OrientationLock.PORTRAIT_UP;
    } catch (error) {
      console.warn('Force portrait error:', error);
    }
  };

  const forceLandscape = async () => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      currentOrientation.current = ScreenOrientation.OrientationLock.LANDSCAPE;
    } catch (error) {
      console.warn('Force landscape error:', error);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
      currentOrientation.current = null;
    } catch (error) {
      console.warn('Unlock error:', error);
    }
  };

  return {
    forcePortrait,
    forceLandscape,
    unlock,
    currentOrientation: currentOrientation.current,
  };
}; 