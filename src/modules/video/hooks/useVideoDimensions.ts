import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

interface ScreenData {
  width: number;
  height: number;
  isLandscape: boolean;
}

export const useVideoDimensions = () => {
  const [screenData, setScreenData] = useState<ScreenData>(() => {
    const screen = Dimensions.get('screen');
    return {
      width: screen.width,
      height: screen.height,
      isLandscape: screen.width > screen.height
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setScreenData({
        width: screen.width,
        height: screen.height,
        isLandscape: screen.width > screen.height
      });
    });

    return () => subscription?.remove();
  }, []);

  return screenData;
}; 