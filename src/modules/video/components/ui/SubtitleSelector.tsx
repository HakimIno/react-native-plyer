import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setSelectedTextTrack } from '../../../../store/slices/videoSlice';

interface SubtitleSelectorProps {
  onBackPress: () => void;
}

interface SubtitleOption {
  id: string;
  label: string;
  value: {
    type: 'system' | 'disabled' | 'index' | 'language' | 'title';
    value?: string | number;
  };
  isSelected: boolean;
  icon?: string;
}

const SubtitleSelector: React.FC<SubtitleSelectorProps> = ({ onBackPress }) => {
  const dispatch = useDispatch();
  const windowDimensions = useWindowDimensions();
  const { selectedTextTrack, availableTextTracks } = useSelector((state: RootState) => state.video);

  // Calculate screen data from window dimensions
  const screenData = useMemo(() => ({
    width: windowDimensions.width,
    height: windowDimensions.height,
    isLandscape: windowDimensions.width > windowDimensions.height,
  }), [windowDimensions.width, windowDimensions.height]);

  // Generate subtitle options
  const subtitleOptions = useMemo((): SubtitleOption[] => {
    const options: SubtitleOption[] = [
      {
        id: 'disabled',
        label: 'Off',
        value: { type: 'disabled' },
        isSelected: selectedTextTrack.type === 'disabled',
        icon: 'close-circle-outline',
      },
    ];

    // Add available text tracks
    availableTextTracks.forEach((track, index) => {
      const isSelected = selectedTextTrack.type === 'index' && selectedTextTrack.value === index;

      // Format label with language and title information
      let label = track.label || `Track ${index + 1}`;
      if (track.language && track.language !== track.label) {
        label += ` (${track.language})`;
      }

      options.push({
        id: `track-${index}`,
        label,
        value: { type: 'index', value: index },
        isSelected,
        icon: 'chatbox-ellipses-outline',
      });
    });

    return options;
  }, [availableTextTracks, selectedTextTrack]);

  const handleSubtitleSelection = (option: SubtitleOption) => {
    dispatch(setSelectedTextTrack(option.value));
  };

  return (
    <View style={[styles.container, screenData.isLandscape && styles.containerLandscape]}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={onBackPress} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Subtitles</Text>
        <View style={styles.headerSpacer} />
      </TouchableOpacity>

      {/* Subtitle Options */}
      <ScrollView
        style={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled={true}>
        {subtitleOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              screenData.isLandscape && styles.optionItemLandscape,
            ]}
            onPress={() => handleSubtitleSelection(option)}
          >
            <View style={styles.optionContent}>
              <Ionicons
                name={option.icon as any}
                size={20}
                color="#fff"
                style={styles.optionIcon}
              />
              <Text style={styles.optionLabel}>{option.label}</Text>
            </View>

            {option.isSelected && (
              <Ionicons name="checkmark" size={20} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}

        {/* Info Message */}
        {availableTextTracks.length === 0 && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
            <Text style={styles.infoText}>
              No subtitles available for this video
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  containerLandscape: {
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    gap: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginRight: 32,
  },
  headerSpacer: {
    width: 32,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionItemLandscape: {
    paddingVertical: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    textAlign: 'center',
  },
});

export default SubtitleSelector; 