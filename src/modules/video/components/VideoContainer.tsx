import React from 'react';
import { View, StyleSheet, StatusBar, ColorValue } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { VideoOverlay } from './VideoOverlay';
import { TextTrack } from '../../../types';
import { SharedValue } from 'react-native-reanimated';
import { VideoElement } from './VideoElement';
import { ChatPanel } from './ChatPanel';
import {
  useVideoDimensions,
  usePinchGesture,
  useChatSystem,
  useChatPanel
} from '../hooks';
import { formatTextTracks, formatSelectedTextTrack } from '../utility/helpers/textTrackUtils';

interface VideoContainerProps {
  videoUrl: string;
  setVideoRef: (ref: any) => void;
  isPlaying: boolean;
  isSeekingInProgress: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  textTracks?: TextTrack[];
  selectedTextTrack?: {
    type: 'system' | 'disabled' | 'index' | 'language' | 'title';
    value?: string | number;
  };
  screenWidth: number;
  isLandscape: boolean;
  safeAreaTop: number;
  showControls: boolean;
  controlsOpacity: SharedValue<number>;
  onVideoPress: () => void;
  onProgress: (data: any) => void;
  onLoad: (data: any) => void;
  onBuffer: (meta: any) => void;
  onLoadStart: () => void;
  onEnd: () => void;
  onSeek: (data: any) => void;
  onTextTracks?: (data: any) => void;
  onPlayPause: () => void;
  onSeekBackward: (seconds: number) => void;
  onSeekForward: (seconds: number) => void;
  onSeekTo: (time: number) => void;
  onFullscreenPress: () => void;
  onOptionsPress: () => void;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  playButtonSize?: number;
  seekButtonSize?: number;
  seekSeconds?: number;
  optionsButtonSize?: number;
  showTimeLabels?: boolean;
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  isLive: boolean;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({
  videoUrl,
  setVideoRef,
  isPlaying,
  isSeekingInProgress,
  isBuffering,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  isFullscreen,
  textTracks = [],
  selectedTextTrack,
  screenWidth,
  isLandscape,
  safeAreaTop,
  showControls,
  controlsOpacity,
  onVideoPress,
  onProgress,
  onLoad,
  onBuffer,
  onLoadStart,
  onEnd,
  onSeek,
  onTextTracks,
  onPlayPause,
  onSeekBackward,
  onSeekForward,
  onSeekTo,
  onFullscreenPress,
  onOptionsPress,
  style,
  resizeMode = 'contain',
  playButtonSize = 70,
  seekButtonSize = 50,
  seekSeconds = 10,
  optionsButtonSize = 25,
  showTimeLabels = true,
  colors,
  isLive,
}) => {
  // Custom hooks
  const {
    videoDimensions,
    containerDimensions,
    maxScale,
    handleLayout,
    handleLoad,
  } = useVideoDimensions();

  const {
    isChatVisible,
    messages,
    commentText,
    setCommentText,
    handleChatPress,
    handleSendComment,
  } = useChatSystem(isFullscreen);

  const {
    pinchGesture,
    animatedVideoStyle,
  } = usePinchGesture(maxScale);

  const {
    animatedPanelStyle,
  } = useChatPanel(isChatVisible, isFullscreen);

  // Text track formatting
  const formattedTextTracks = formatTextTracks(textTracks);
  const formattedSelectedTextTrack = formatSelectedTextTrack(
    selectedTextTrack,
    formattedTextTracks,
    textTracks
  );

  const containerStyle = [
    styles.videoPlayerContainer,
    style,
  ];

  // Enhanced load handler that calls both hook and prop handler
  const enhancedHandleLoad = (data: any) => {
    handleLoad(data);
    onLoad(data);
  };


  return (
    <View style={styles.splitContainer}>
      <StatusBar hidden={isFullscreen} />
      <View style={containerStyle} onLayout={handleLayout}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.View style={[styles.animatedVideoWrapper, animatedVideoStyle]}>
            <VideoElement
              videoUrl={videoUrl}
              setVideoRef={setVideoRef}
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              playbackRate={playbackRate}
              resizeMode={resizeMode}
              isFullscreen={isFullscreen}
              onVideoPress={onVideoPress}
              onProgress={onProgress}
              onLoad={enhancedHandleLoad}
              onBuffer={onBuffer}
              onLoadStart={onLoadStart}
              onEnd={onEnd}
              onSeek={onSeek}
              onTextTracks={onTextTracks}
              formattedTextTracks={formattedTextTracks}
              formattedSelectedTextTrack={formattedSelectedTextTrack}
            />
          </Animated.View>
        </GestureDetector>

        <VideoOverlay
          onVideoPress={onVideoPress}
          showControls={showControls}
          controlsOpacity={controlsOpacity}
          isPlaying={isPlaying}
          isSeekingInProgress={isSeekingInProgress}
          isBuffering={isBuffering}
          currentTime={currentTime}
          duration={duration}
          isFullscreen={isFullscreen}
          screenWidth={containerDimensions.width}
          isLandscape={isLandscape}
          safeAreaTop={safeAreaTop}
          onPlayPause={onPlayPause}
          onSeekBackward={onSeekBackward}
          onSeekForward={onSeekForward}
          onSeek={onSeekTo}
          onFullscreenPress={onFullscreenPress}
          onOptionsPress={onOptionsPress}
          onChatPress={handleChatPress}
          playButtonSize={playButtonSize}
          seekButtonSize={seekButtonSize}
          seekSeconds={seekSeconds}
          optionsButtonSize={optionsButtonSize}
          showTimeLabels={showTimeLabels}
          colors={colors}
          isLive={isLive}
        />
      </View>

      {isFullscreen && (
        <Animated.View style={[styles.rightPanel, animatedPanelStyle]}>

          <ChatPanel
            isVisible={isChatVisible}
            messages={messages}
            commentText={commentText}
            onCommentTextChange={setCommentText}
            onSendComment={handleSendComment}
            safeAreaTop={safeAreaTop}
            animatedPanelStyle={animatedPanelStyle}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rightPanel: {
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  videoPlayerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  animatedVideoWrapper: {
    width: '100%',
    height: '100%',
  },
});