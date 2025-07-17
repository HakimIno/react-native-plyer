import React, { useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar, ColorValue, TouchableWithoutFeedback } from 'react-native';
import Video from 'react-native-video';
import { Gesture, GestureDetector, PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { VideoOverlay } from './VideoOverlay';
import { TextTrack } from '../../../types';
import { SharedValue } from 'react-native-reanimated';

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
  const [videoDimensions, setVideoDimensions] = useState({ width: 1, height: 1 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const maxScale = useMemo(() => {
    if (videoDimensions.height === 1 || containerDimensions.height === 0) {
      return 1;
    }
    const videoAspectRatio = videoDimensions.width / videoDimensions.height;
    const containerAspectRatio = containerDimensions.width / containerDimensions.height;

    if (videoAspectRatio > containerAspectRatio) {
      return videoAspectRatio / containerAspectRatio;
    }
    else {
      return containerAspectRatio / videoAspectRatio;
    }
  }, [videoDimensions, containerDimensions]);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.max(1, Math.min(newScale, maxScale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formattedTextTracks = textTracks.map((track) => ({
    title: track.label,
    language: track.language.substring(0, 2).toLowerCase() as any,
    type: 'text/vtt' as any,
    uri: track.src,
  }));

  const formattedSelectedTextTrack = selectedTextTrack
    ? (() => {
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
          const defaultTrack = formattedTextTracks.findIndex((track) =>
            textTracks.find((original) => original.src === track.uri)?.default
          );
          if (defaultTrack >= 0) {
            return { type: 'index' as any, value: defaultTrack };
          }
          return formattedTextTracks.length > 0
            ? { type: 'index' as any, value: 0 }
            : { type: 'disabled' as any };
      }
    })()
    : formattedTextTracks.length > 0
      ? { type: 'index' as any, value: 0 }
      : { type: 'disabled' as any };

  const containerStyle = [
    styles.container,
    isFullscreen && styles.fullscreenContainer,
    style,
  ];

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  const handleLoad = (data: any) => {
    setVideoDimensions({
      width: data.naturalSize.width,
      height: data.naturalSize.height,
    });
    onLoad(data);
  };

  return (
    <View style={containerStyle} onLayout={handleLayout}>
      <StatusBar hidden={isFullscreen} />

      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={[styles.videoContainer, animatedStyle]}>
          <TouchableWithoutFeedback onPress={onVideoPress}>
            <View style={styles.touchableArea}>
              <Video
                ref={setVideoRef}
                source={{ uri: videoUrl }}
                style={styles.video}
                onProgress={onProgress}
                onLoad={handleLoad}
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
                fullscreenOrientation="all"
                controls={false}
                repeat={false}
                ignoreSilentSwitch="ignore"
                mixWithOthers="duck"
                playWhenInactive={false}
                playInBackground={false}
                progressUpdateInterval={100}
                textTracks={formattedTextTracks}
                subtitleStyle={{
                  paddingBottom: isFullscreen ? 120 : 10,
                  fontSize: isFullscreen ? 18 : 16,
                  opacity: 0.8,
                  
                }}
                selectedTextTrack={formattedSelectedTextTrack}
              />
            </View>
          </TouchableWithoutFeedback>
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
        isLive={isLive}
      />
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
  touchableArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});