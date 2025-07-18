import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Video from 'react-native-video';

interface VideoElementProps {
  videoUrl: string;
  setVideoRef: (ref: any) => void;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  resizeMode: 'contain' | 'cover' | 'stretch';
  isFullscreen: boolean;
  onVideoPress: () => void;
  onProgress: (data: any) => void;
  onLoad: (data: any) => void;
  onBuffer: (meta: any) => void;
  onLoadStart: () => void;
  onEnd: () => void;
  onSeek: (data: any) => void;
  onTextTracks?: (data: any) => void;
  formattedTextTracks: any[];
  formattedSelectedTextTrack: any;
}

export const VideoElement: React.FC<VideoElementProps> = ({
  videoUrl,
  setVideoRef,
  isPlaying,
  isMuted,
  volume,
  playbackRate,
  resizeMode,
  isFullscreen,
  onVideoPress,
  onProgress,
  onLoad,
  onBuffer,
  onLoadStart,
  onEnd,
  onSeek,
  onTextTracks,
  formattedTextTracks,
  formattedSelectedTextTrack,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onVideoPress}>
      <View style={styles.touchableArea}>
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
          fullscreen={false}
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
  );
};

const styles = StyleSheet.create({
  touchableArea: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width: '100%',
    height: '100%',
  },
}); 