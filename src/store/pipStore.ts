import { create } from 'zustand';

export interface PiPState {
  isPiPMode: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isDragging: boolean;
  isMinimized: boolean;
  videoUrl: string | null;
  videoTitle: string | null;
  currentTime: number;
  isPlaying: boolean;
  isTransitioning: boolean;
  originalVideoRef: any;
}

export interface PiPActions {
  enterPiPMode: (videoUrl?: string, videoTitle?: string, currentTime?: number, isPlaying?: boolean, videoRef?: any) => void;
  exitPiPMode: () => void;
  updatePosition: (x: number, y: number) => void;
  updateSize: (width: number, height: number) => void;
  setDragging: (isDragging: boolean) => void;
  minimize: () => void;
  maximize: () => void;
  resetPosition: () => void;
  updateVideoState: (currentTime: number, isPlaying: boolean) => void;
  setTransitioning: (isTransitioning: boolean) => void;
}

export type PiPStore = PiPState & PiPActions;

const DEFAULT_PIP_SIZE = { width: 200, height: 112 }; // 16:9 aspect ratio
const DEFAULT_PIP_POSITION = { x: 20, y: 100 };

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = require('react-native').Dimensions.get('window');

export const usePiPStore = create<PiPStore>((set, get) => ({
  // Initial state
  isPiPMode: false,
  position: DEFAULT_PIP_POSITION,
  size: DEFAULT_PIP_SIZE,
  isDragging: false,
  isMinimized: false,
  videoUrl: null,
  videoTitle: null,
  currentTime: 0,
  isPlaying: false,
  isTransitioning: false,
  originalVideoRef: null,

  // Actions
  enterPiPMode: (videoUrl, videoTitle, currentTime = 0, isPlaying = true, videoRef = null) => {
    console.log('Entering PiP mode with:', { videoUrl, videoTitle, currentTime, isPlaying });
    set({ 
      isPiPMode: true,
      isMinimized: false,
      isTransitioning: true,
      position: DEFAULT_PIP_POSITION,
      size: DEFAULT_PIP_SIZE,
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoTitle: videoTitle || 'Sample Video',
      currentTime,
      isPlaying,
      originalVideoRef: videoRef,
    });
    
    // หยุด transition หลังจาก animation เสร็จ
    setTimeout(() => {
      set({ isTransitioning: false });
    }, 300);
  },

  exitPiPMode: () => {
    set({ 
      isPiPMode: false,
      isMinimized: false,
      isDragging: false,
      isTransitioning: false,
      videoUrl: null,
      videoTitle: null,
      currentTime: 0,
      isPlaying: false,
      originalVideoRef: null,
    });
  },

  updatePosition: (x: number, y: number) => {
    const { size } = get();
    // Ensure position stays within screen bounds
    const clampedX = Math.max(0, Math.min(screenWidth - size.width, x));
    const clampedY = Math.max(0, Math.min(screenHeight - size.height - 100, y));
    set({ position: { x: clampedX, y: clampedY } });
  },

  updateSize: (width: number, height: number) => {
    set({ size: { width, height } });
  },

  setDragging: (isDragging: boolean) => {
    set({ isDragging });
  },

  minimize: () => {
    set({ isMinimized: true });
  },

  maximize: () => {
    set({ isMinimized: false });
  },

  resetPosition: () => {
    set({ position: DEFAULT_PIP_POSITION });
  },

  updateVideoState: (currentTime: number, isPlaying: boolean) => {
    set({ currentTime, isPlaying });
  },

  setTransitioning: (isTransitioning: boolean) => {
    set({ isTransitioning });
  },
}));
