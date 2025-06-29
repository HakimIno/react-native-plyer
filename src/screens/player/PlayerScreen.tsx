import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoPlayer } from '../../modules/video/player/VideoPlayer';

export const PlayerScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <VideoPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
}); 