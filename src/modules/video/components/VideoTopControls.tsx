import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OptionsButton } from './ui';
import { ChatButton } from './ui/ChatButton';

interface VideoTopControlsProps {
  onOptionsPress: () => void;
  onChatPress: () => void;
  safeAreaTop: number;
  isLandscape: boolean;
  optionsButtonSize?: number;
  optionsButtonColor?: string;
  isLive: boolean;
}

export const VideoTopControls: React.FC<VideoTopControlsProps> = ({
  onOptionsPress,
  safeAreaTop,
  optionsButtonSize = 25,
  optionsButtonColor = '#fff',
  onChatPress,
  isLive,
}) => {
  const topControlsStyle = [
    styles.topControls,
    { top: safeAreaTop + 10, right: 10 },
  ];

  return (
    <View style={[topControlsStyle, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
      {isLive && (
        <ChatButton
          isOptions={true}
          onPress={onChatPress}
          size={32}
          color={optionsButtonColor}
        />
      )}
      <OptionsButton
        isOptions={true}
        onPress={onOptionsPress}
        size={32}
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