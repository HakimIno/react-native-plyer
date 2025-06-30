// Types for BottomSheet components
export interface ScreenDimensions {
  width: number;
  height: number;
  isLandscape: boolean;
}

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  isFullscreen?: boolean;
}

export interface BottomSheetRefProps {
  isActive: () => boolean;
  close: () => void;
  open: () => void;
}

export interface VideoOptionsContentProps {
  isVisible?: boolean;
}

export interface MainOption {
  id: string;
  title: string;
  icon: string;
}

export type ViewType = 'main' | 'playback-speed' | 'subtitles'; 