// Main components
export { VideoPlayer as VideoPlayerRefactored } from './player/VideoPlayer';

// Reusable components
export * from './components';

// Custom hooks
export * from './hooks';

// Re-export existing hooks for backward compatibility
export { useVideoPlayer, useVideoPlaylist } from './hooks/useVideoPlayer'; 