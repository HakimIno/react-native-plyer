import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { useMemo } from 'react';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Optimized selectors to prevent unnecessary re-renders
export const useVideoList = () => {
  return useAppSelector((state) => state.video.videoList);
};

export const useVideoListLength = () => {
  return useAppSelector((state) => state.video.videoList.length);
};

export const useCurrentVideoIndex = () => {
  return useAppSelector((state) => state.video.currentVideoIndex);
};

export const useVideoPlaybackState = () => {
  return useAppSelector((state) => ({
    isPlaying: state.video.isPlaying,
    currentTime: state.video.currentTime,
    duration: state.video.duration,
    isBuffering: state.video.isBuffering,
    isFullscreen: state.video.isFullscreen,
  }));
}; 