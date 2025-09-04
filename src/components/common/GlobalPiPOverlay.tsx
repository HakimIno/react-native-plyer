import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePiPStore } from '../../store/pipStore';
import { PiPVideoPlayer } from './PiPVideoPlayer';

export const GlobalPiPOverlay: React.FC = () => {
  const { isPiPMode, exitPiPMode, videoUrl } = usePiPStore();
  const navigation = useNavigation();

  if (!isPiPMode || !videoUrl) {
    return null;
  }

  const handleExpand = () => {
    console.log('Expanding PiP...');
    // First exit PiP mode, then navigate back to main app
    exitPiPMode();
    // Small delay to ensure PiP mode is closed before navigation
    setTimeout(() => {
      console.log('Navigating to MainTabs...');
      try {
        navigation.navigate('MainTabs' as never);
      } catch (error) {
        console.log('Navigation error:', error);
        // Fallback - try to go back
        navigation.goBack();
      }
    }, 100);
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <PiPVideoPlayer
        videoUrl={videoUrl}
        onExpand={handleExpand}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 10,
    backgroundColor: 'transparent', // ทำให้โปร่งใส
  },
});
