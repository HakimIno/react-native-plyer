import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setPlaybackRate } from '../../../../store/slices/videoSlice';

interface PlaybackSpeedSelectorProps {
  onBackPress: () => void;
}

const PlaybackSpeedSelector: React.FC<PlaybackSpeedSelectorProps> = ({
  onBackPress,
}) => {
  const dispatch = useDispatch();
  const windowDimensions = useWindowDimensions();
  const selectedSpeed = useSelector((state: RootState) => state.video.playbackRate, 
    (left, right) => left === right
  );

  // Use internal orientation detection for real-time updates
  const isLandscape = useMemo(() => 
    windowDimensions.width > windowDimensions.height,
    [windowDimensions.width, windowDimensions.height]
  );
  const playbackSpeedOptions = useMemo(() => [
    { speed: 0.25, label: '0.25x' },
    { speed: 0.5, label: '0.5x' },
    { speed: 0.75, label: '0.75x' },
    { speed: 1, label: '1x' },
    { speed: 1.25, label: '1.25x' },
    { speed: 1.5, label: '1.5x' },
    { speed: 1.75, label: '1.75x' },
    { speed: 2, label: '2x' },
  ], []);

  const handleSpeedSelection = (speed: number) => {
    dispatch(setPlaybackRate(speed));
  };

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      {/* Back button */}
      <TouchableOpacity 
        style={[styles.backButton, isLandscape && styles.backButtonLandscape]}
        onPress={onBackPress}
      >
        <Ionicons name="chevron-back" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Playback Speed</Text>
      </TouchableOpacity>

      {/* Speed options in horizontal layout */}
      <View style={[styles.speedOptionsContainer, isLandscape && styles.speedOptionsContainerLandscape]}>
        {playbackSpeedOptions.map((option) => (
          <TouchableOpacity 
            key={option.speed} 
            style={[
              styles.speedOption,
              selectedSpeed === option.speed && styles.selectedSpeedOption,
              isLandscape && styles.speedOptionLandscape
            ]}
            onPress={() => handleSpeedSelection(option.speed)}
          >
            <Text style={[
              styles.speedOptionText,
              selectedSpeed === option.speed && styles.selectedSpeedText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
  containerLandscape: {

  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButtonLandscape: {
    paddingVertical: 10,
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    fontWeight: '600',
  },
  speedOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  speedOptionsContainerLandscape: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  speedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 13,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 12,
    width: '23%',
    minHeight: 40,
  },
  speedOptionLandscape: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 60,
    width: '23%',
    minHeight: 45,
    marginBottom: 10,
  },
  selectedSpeedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderColor: '#007AFF',
  },
  speedOptionText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedSpeedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlaybackSpeedSelector; 