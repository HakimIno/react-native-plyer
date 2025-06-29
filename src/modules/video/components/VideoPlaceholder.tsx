import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlayPauseButton } from './ui/PlayPauseButton';

interface VideoPlaceholderProps {
  style?: any;
  onPress?: () => void;
  buttonSize?: number;
  buttonColor?: string;
  backgroundColor?: string;
}

export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  style,
  onPress = () => {},
  buttonSize = 80,
  buttonColor = "#666",
  backgroundColor = "#1a1a1a",
}) => {
  const containerStyle = [
    styles.container,
    { backgroundColor },
    style
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.placeholder}>
        <PlayPauseButton
          isPlaying={false}
          onPress={onPress}
          size={buttonSize}
          color={buttonColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 