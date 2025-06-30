import { Dimensions } from 'react-native';
import { ScreenDimensions } from './types';
import { SHEET_HEIGHT_PORTRAIT, SHEET_HEIGHT_LANDSCAPE } from './constants';

// Utilities
export const getScreenDimensions = (): ScreenDimensions => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isLandscape: width > height,
  };
};

export const calculateSheetHeight = (screenData: ScreenDimensions): number => {
  const percentage = screenData.isLandscape ? SHEET_HEIGHT_LANDSCAPE : SHEET_HEIGHT_PORTRAIT;
  return screenData.height * percentage;
};

export const getMainOptions = () => [
  { id: 'playback-speed', title: 'Playback Speed', icon: 'speedometer-outline' },
  { id: 'quality', title: 'Video Quality', icon: 'settings-outline' },
  { id: 'subtitles', title: 'Subtitles', icon: 'chatbox-ellipses-outline' },
  { id: 'audio', title: 'Audio Track', icon: 'volume-high-outline' },
]; 