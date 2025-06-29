import React, { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  useVideoControls, 
  useVideoDimensions, 
  useVideoOrientation 
} from '../hooks';
import { 
  VideoContainer, 
  VideoPlaceholder 
} from '../components';
import { useVideoPlayer } from '../hooks';
import { BottomSheet, VideoOptionsContent, BottomSheetRefProps } from '../components/ui';

interface VideoPlayerProps {
  style?: any;
  
  // Customization props
  autoHideControlsDelay?: number;
  playButtonSize?: number;
  seekButtonSize?: number;
  seekSeconds?: number;
  optionsButtonSize?: number;
  showTimeLabels?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  
  // Placeholder props
  placeholderButtonSize?: number;
  placeholderButtonColor?: string;
  placeholderBackgroundColor?: string;
  
  // Event callbacks (optional)
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
  onVideoLoad?: (data: any) => void;
  onVideoEnd?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  style,
  autoHideControlsDelay = 3000,
  playButtonSize = 70,
  seekButtonSize = 50,
  seekSeconds = 10,
  optionsButtonSize = 25,
  showTimeLabels = true,
  resizeMode = 'contain',
  placeholderButtonSize = 80,
  placeholderButtonColor = "#666",
  placeholderBackgroundColor = "#1a1a1a",
  onPlay,
  onPause,
  onSeek,
  onFullscreenToggle,
  onVideoLoad,
  onVideoEnd,
}) => {
  // State
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  
  // Refs
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  
  // Hooks
  const { top } = useSafeAreaInsets();
  const screenData = useVideoDimensions();
  const {
    videoState,
    setVideoRef,
    handleProgress,
    handleLoad,
    handleBuffer,
    handleLoadStart,
    handleEnd,
    handleSeek,
    togglePlayPause,
    toggleFullscreen,
    seek,
    seekBackward,
    seekForward,
  } = useVideoPlayer();

  const {
    showControls,
    controlsOpacity,
    showControlsHandler,
    toggleControls,
  } = useVideoControls({
    isPlaying: videoState.isPlaying,
    isSeekingInProgress: videoState.isSeekingInProgress,
    autoHideDelay: autoHideControlsDelay,
  });

  useVideoOrientation({ isFullscreen: videoState.isFullscreen });

  // Event handlers
  const handleVideoPress = () => {
    if (videoState.currentVideoUrl) {
      toggleControls();
    }
  };

  const handlePlayPausePress = () => {
    const wasPlaying = videoState.isPlaying;
    togglePlayPause();
    showControlsHandler();
    
    // Callbacks
    if (wasPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const handleSeekBackward = () => {
    seekBackward(seekSeconds);
    showControlsHandler();
  };

  const handleSeekForward = () => {
    seekForward(seekSeconds);
    showControlsHandler();
  };

  const handleSeekTo = (time: number) => {
    seek(time);
    showControlsHandler();
    onSeek?.(time);
  };

  const handleFullscreenPress = () => {
    const wasFullscreen = videoState.isFullscreen;
    toggleFullscreen();
    showControlsHandler();
    onFullscreenToggle?.(!wasFullscreen);
  };

  const handleOptionsPress = () => {
    setIsBottomSheetVisible(true);
    showControlsHandler();
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetVisible(false);
  };

  const handleVideoLoad = (data: any) => {
    handleLoad(data);
    onVideoLoad?.(data);
  };

  const handleVideoEnd = () => {
    handleEnd();
    onVideoEnd?.();
  };

  // Render placeholder if no video
  if (!videoState.currentVideoUrl) {
    return (
      <VideoPlaceholder
        style={style}
        buttonSize={placeholderButtonSize}
        buttonColor={placeholderButtonColor}
        backgroundColor={placeholderBackgroundColor}
      />
    );
  }

  // Render video player
  return (
    <>
      <VideoContainer
        // Video source and ref
        videoUrl={videoState.currentVideoUrl}
        setVideoRef={setVideoRef}
        
        // Video state
        isPlaying={videoState.isPlaying}
        isSeekingInProgress={videoState.isSeekingInProgress}
        isBuffering={videoState.isBuffering}
        currentTime={videoState.currentTime}
        duration={videoState.duration}
        volume={videoState.volume}
        isMuted={videoState.isMuted}
        playbackRate={videoState.playbackRate}
        isFullscreen={videoState.isFullscreen}
        
        // Screen info
        screenWidth={screenData.width}
        isLandscape={screenData.isLandscape}
        safeAreaTop={top}
        
        // Controls
        showControls={showControls}
        controlsOpacity={controlsOpacity}
        
        // Event handlers
        onVideoPress={handleVideoPress}
        onProgress={handleProgress}
        onLoad={handleVideoLoad}
        onBuffer={handleBuffer}
        onLoadStart={handleLoadStart}
        onEnd={handleVideoEnd}
        onSeek={handleSeek}
        onPlayPause={handlePlayPausePress}
        onSeekBackward={handleSeekBackward}
        onSeekForward={handleSeekForward}
        onSeekTo={handleSeekTo}
        onFullscreenPress={handleFullscreenPress}
        onOptionsPress={handleOptionsPress}
        
        // Style props
        style={style}
        resizeMode={resizeMode}
        
        // Customization props
        playButtonSize={playButtonSize}
        seekButtonSize={seekButtonSize}
        seekSeconds={seekSeconds}
        optionsButtonSize={optionsButtonSize}
        showTimeLabels={showTimeLabels}
      />

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        isVisible={isBottomSheetVisible}
        onClose={handleBottomSheetClose}
      >
        <VideoOptionsContent />
      </BottomSheet>
    </>
  );
}; 