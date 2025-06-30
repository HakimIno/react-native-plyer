import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OptionsButton } from './ui';

interface VideoTopControlsProps {
  onOptionsPress: () => void;
  safeAreaTop: number;
  isLandscape: boolean;
  optionsButtonSize?: number;
  optionsButtonColor?: string;
}

export const VideoTopControls: React.FC<VideoTopControlsProps> = ({
  onOptionsPress,
  safeAreaTop,
  optionsButtonSize = 25,
  optionsButtonColor = '#fff',
}) => {
  const topControlsStyle = [
    styles.topControls,
    { top: safeAreaTop + 20, right: 20 },
  ];

  return (
    <View style={topControlsStyle}>
      <OptionsButton
        isOptions={true}
        onPress={onOptionsPress}
        size={optionsButtonSize}
        color={optionsButtonColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topControls: {
    position: 'absolute',
  },
  
}); 