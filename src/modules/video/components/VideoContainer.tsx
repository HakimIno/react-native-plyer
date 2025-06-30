import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, StatusBar, ColorValue } from 'react-native';
import Video from 'react-native-video';
import { VideoOverlay } from './VideoOverlay';
import { SharedValue } from 'react-native-reanimated';
import { TextTrack } from '../../../types';

interface VideoContainerProps {
  // Video source and ref
  videoUrl: string;
  setVideoRef: (ref: any) => void;
  
  // Video state
  isPlaying: boolean;
  isSeekingInProgress: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;

  // Subtitle state
  textTracks?: TextTrack[];
  selectedTextTrack?: {
    type: 'system' | 'disabled' | 'index' | 'language' | 'title';
    value?: string | number;
  };
  
  // Screen info
  screenWidth: number;
  isLandscape: boolean;
  safeAreaTop: number;
  
  // Controls
  showControls: boolean;
  controlsOpacity: SharedValue<number>;
  
  // Event handlers
  onVideoPress: () => void;
  onProgress: (data: any) => void;
  onLoad: (data: any) => void;
  onBuffer: (meta: any) => void;
  onLoadStart: () => void;
  onEnd: () => void;
  onSeek: (data: any) => void;
  onTextTracks?: (data: any) => void;
  onPlayPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onSeekTo: (time: number) => void;
  onFullscreenPress: () => void;
  onOptionsPress: () => void;
  
  // Style props
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  
  // Customization props
  playButtonSize?: number;
  seekButtonSize?: number;
  seekSeconds?: number;
  optionsButtonSize?: number;
  showTimeLabels?: boolean;
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
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
}) => {
  const formattedTextTracks = textTracks.map(track => ({
    title: track.label,
    language: track.language.substring(0, 2).toLowerCase() as any,
    type: 'text/vtt' as any,
    uri: track.src,
  }));

  const formattedSelectedTextTrack = selectedTextTrack ? (() => {
    switch (selectedTextTrack.type) {
      case 'disabled':
        return { type: 'disabled' as any };
      case 'index':
        const index = selectedTextTrack.value as number;
        if (index >= 0 && index < formattedTextTracks.length) {
          return { type: 'index' as any, value: index };
        }
        return { type: 'disabled' as any };
      case 'language':
        return { type: 'language' as any, value: selectedTextTrack.value };
      case 'title':
        return { type: 'title' as any, value: selectedTextTrack.value };
      case 'system':
      default:
        const defaultTrack = formattedTextTracks.findIndex(track => 
          textTracks.find(original => original.src === track.uri)?.default
        );
        if (defaultTrack >= 0) {
          return { type: 'index' as any, value: defaultTrack };
        }
        return formattedTextTracks.length > 0 
          ? { type: 'index' as any, value: 0 }
          : { type: 'disabled' as any };
    }
  })() : formattedTextTracks.length > 0 
    ? { type: 'index' as any, value: 0 }
    : { type: 'disabled' as any };


  const containerStyle = [
    styles.container,
    isFullscreen && styles.fullscreenContainer,
    style
  ];

  return (
    <View style={containerStyle}>
      <StatusBar hidden={isFullscreen} />

      <TouchableWithoutFeedback onPress={onVideoPress}>
        <View style={styles.videoContainer}>
          <Video
            ref={setVideoRef}
            source={{ uri: videoUrl }}
            style={styles.video}
            onProgress={onProgress}
            onLoad={onLoad}
            onBuffer={onBuffer}
            onLoadStart={onLoadStart}
            onEnd={onEnd}
            onSeek={onSeek}
            onTextTracks={onTextTracks}
            paused={!isPlaying}
            volume={isMuted ? 0 : volume}
            rate={playbackRate}
            resizeMode={resizeMode}
            fullscreenAutorotate={true}
            fullscreenOrientation='all'
            controls={false}
            repeat={false}
            ignoreSilentSwitch="ignore"
            mixWithOthers="duck"
            playWhenInactive={false}
            playInBackground={false}
            progressUpdateInterval={100}
            textTracks={formattedTextTracks}
            subtitleStyle={{ paddingBottom: isFullscreen ? 100 : 10, fontSize: isFullscreen ? 18 : 16, opacity: 1, }}
            selectedTextTrack={formattedSelectedTextTrack}
            
          />

          <VideoOverlay
            showControls={showControls}
            controlsOpacity={controlsOpacity}
            isPlaying={isPlaying}
            isSeekingInProgress={isSeekingInProgress}
            isBuffering={isBuffering}
            currentTime={currentTime}
            duration={duration}
            isFullscreen={isFullscreen}
            screenWidth={screenWidth}
            isLandscape={isLandscape}
            safeAreaTop={safeAreaTop}
            onPlayPause={onPlayPause}
            onSeekBackward={onSeekBackward}
            onSeekForward={onSeekForward}
            onSeek={onSeekTo}
            onFullscreenPress={onFullscreenPress}
            onOptionsPress={onOptionsPress}
            playButtonSize={playButtonSize}
            seekButtonSize={seekButtonSize}
            seekSeconds={seekSeconds}
            optionsButtonSize={optionsButtonSize}
            showTimeLabels={showTimeLabels}
            colors={colors}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
}); 