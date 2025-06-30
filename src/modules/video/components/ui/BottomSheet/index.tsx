// Main exports for BottomSheet components
export { BottomSheet } from './BottomSheet';
export { VideoOptionsContent } from './VideoOptionsContent';

// Export types for external use
export type { 
  BottomSheetProps, 
  BottomSheetRefProps, 
  VideoOptionsContentProps,
  ScreenDimensions,
  MainOption,
  ViewType
} from './types';

// Export constants if needed externally
export {
  SHEET_HEIGHT_PORTRAIT,
  SHEET_HEIGHT_LANDSCAPE,
  ANIMATION_DURATION,
  CLOSE_ANIMATION_DURATION,
  Z_INDEX_NORMAL,
  Z_INDEX_FULLSCREEN
} from './constants';

// Export utilities if needed externally
export {
  getScreenDimensions,
  calculateSheetHeight,
  getMainOptions
} from './utils';