import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  useVideoControls, 
  useVideoDimensions, 
  useVideoOrientation,
  OrientationPreset,
  getOrientationConfig
} from '../hooks';
import { VideoContainer, VideoPlaceholder } from '../components';
import { useVideoPlayer } from '../hooks';
import { BottomSheet, VideoOptionsContent, BottomSheetRefProps } from '../components/ui';

// Constants
const DEFAULT_AUTO_HIDE_DELAY = 3000;
const DEFAULT_PLAY_BUTTON_SIZE = 70;
const DEFAULT_SEEK_BUTTON_SIZE = 50;
const DEFAULT_SEEK_SECONDS = 10;
const DEFAULT_OPTIONS_BUTTON_SIZE = 25;
const DEFAULT_PLACEHOLDER_BUTTON_SIZE = 80;
const DEFAULT_PLACEHOLDER_BUTTON_COLOR = "#666";
const DEFAULT_PLACEHOLDER_BACKGROUND_COLOR = "#1a1a1a";

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
  
  // Orientation props
  orientationPreset?: OrientationPreset;
  allowFreeRotation?: boolean;
  enableSmartLocking?: boolean;
  lockPortraitWhenNotFullscreen?: boolean;
  
  // Placeholder props
  placeholderButtonSize?: number;
  placeholderButtonColor?: string;
  placeholderBackgroundColor?: string;
  
  // Event callbacks
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
  onVideoLoad?: (data: any) => void;
  onVideoEnd?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  style,
  autoHideControlsDelay = DEFAULT_AUTO_HIDE_DELAY,
  playButtonSize = DEFAULT_PLAY_BUTTON_SIZE,
  seekButtonSize = DEFAULT_SEEK_BUTTON_SIZE,
  seekSeconds = DEFAULT_SEEK_SECONDS,
  optionsButtonSize = DEFAULT_OPTIONS_BUTTON_SIZE,
  showTimeLabels = true,
  resizeMode = 'contain',
  orientationPreset = 'AUTO',
  allowFreeRotation,
  enableSmartLocking,
  lockPortraitWhenNotFullscreen,
  placeholderButtonSize = DEFAULT_PLACEHOLDER_BUTTON_SIZE,
  placeholderButtonColor = DEFAULT_PLACEHOLDER_BUTTON_COLOR,
  placeholderBackgroundColor = DEFAULT_PLACEHOLDER_BACKGROUND_COLOR,
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

  // Orientation configuration
  const orientationConfig = orientationPreset 
    ? getOrientationConfig(orientationPreset) 
    : {
        allowFreeRotation: allowFreeRotation ?? true,
        enableSmartLocking: enableSmartLocking ?? true,
        lockPortraitWhenNotFullscreen: lockPortraitWhenNotFullscreen ?? false,
      };

  useVideoOrientation({ 
    isFullscreen: videoState.isFullscreen,
    ...orientationConfig,
  });

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
    <View style={{ flex: 1 }}>
      <VideoContainer
        videoUrl={videoState.currentVideoUrl}
        setVideoRef={setVideoRef}
        isPlaying={videoState.isPlaying}
        isSeekingInProgress={videoState.isSeekingInProgress}
        isBuffering={videoState.isBuffering}
        currentTime={videoState.currentTime}
        duration={videoState.duration}
        volume={videoState.volume}
        isMuted={videoState.isMuted}
        playbackRate={videoState.playbackRate}
        isFullscreen={videoState.isFullscreen}
        screenWidth={screenData.width}
        isLandscape={screenData.isLandscape}
        safeAreaTop={top}
        showControls={showControls}
        controlsOpacity={controlsOpacity}
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
        style={style}
        resizeMode={resizeMode}
        playButtonSize={playButtonSize}
        seekButtonSize={seekButtonSize}
        seekSeconds={seekSeconds}
        optionsButtonSize={optionsButtonSize}
        showTimeLabels={showTimeLabels}
      />

      <BottomSheet
        ref={bottomSheetRef}
        isVisible={isBottomSheetVisible}
        isFullscreen={videoState.isFullscreen}
        onClose={handleBottomSheetClose}
      >
        <VideoOptionsContent />
      </BottomSheet>
    </View>
  );
}; 