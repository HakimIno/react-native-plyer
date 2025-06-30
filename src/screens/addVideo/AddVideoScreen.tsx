import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { RootStackParamList, VideoItem } from '../../types';
import { useVideoPlaylist } from '../../modules/video/hooks/useVideoPlayer';
import { isValidVideoUrl } from '../../modules/video/utility/helpers/networkUtils';
import { getCachedVideoThumbnail } from '../../modules/video/utility/helpers/thumbnailUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AddVideoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddVideo'>;

interface Props {
  navigation: AddVideoScreenNavigationProp;
}

const AddVideoScreen = ({ navigation }: Props) => {
  const { addToPlaylist } = useVideoPlaylist();
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddVideo = async () => {
    if (!newVideoUrl.trim()) {
      Alert.alert('Missing URL', 'Please enter a video URL to add.');
      return;
    }

    if (!isValidVideoUrl(newVideoUrl)) {
      Alert.alert('Invalid URL', 'The URL you entered is not valid. Please check and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const generatedThumbnail = await getCachedVideoThumbnail(
        newVideoUrl.trim(),
        undefined,
        { time: 2000, quality: 0.7 }
      );

      const newVideo: VideoItem = {
        id: Date.now().toString(),
        title: newVideoTitle.trim() || 'Untitled Video',
        url: newVideoUrl.trim(),
        thumbnail: generatedThumbnail,
        isLocal: false,
      };

      addToPlaylist(newVideo);
      Alert.alert('Success!', 'Video added to playlist with auto-generated thumbnail.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.log('Error adding video or generating thumbnail:', error);
      
      // Still add the video but with a fallback thumbnail
      const newVideo: VideoItem = {
        id: Date.now().toString(),
        title: newVideoTitle.trim() || 'Untitled Video',
        url: newVideoUrl.trim(),
        thumbnail: 'https://via.placeholder.com/320x180?text=Video',
        isLocal: false,
      };

      addToPlaylist(newVideo);
      Alert.alert(
        'Added with Caveat',
        'Video added to playlist, but thumbnail generation failed. It should still play fine!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickLocalVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setIsLoading(true);

        try {
          // Generate thumbnail for local video
          const generatedThumbnail = await getCachedVideoThumbnail(
            asset.uri,
            undefined,
            { time: 1000, quality: 0.7 }
          );

          const newVideo: VideoItem = {
            id: Date.now().toString(),
            title: newVideoTitle.trim() || asset.name || 'Local Video',
            url: asset.uri,
            thumbnail: generatedThumbnail,
            isLocal: true,
          };

          addToPlaylist(newVideo);
          Alert.alert('Success!', 'Local video added to playlist with auto-generated thumbnail.', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } catch (error) {
          console.log('Error generating thumbnail for local video:', error);
          
          // Still add the video but with a fallback thumbnail
          const newVideo: VideoItem = {
            id: Date.now().toString(),
            title: newVideoTitle.trim() || asset.name || 'Local Video',
            url: asset.uri,
            thumbnail: 'https://via.placeholder.com/320x180?text=Local+Video',
            isLocal: true,
          };

          addToPlaylist(newVideo);
          Alert.alert(
            'Added with Caveat',
            'Local video added to playlist, but thumbnail generation failed. It should still play fine!',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log('Error picking local video:', error);
      Alert.alert('Error', 'Failed to select video from device. Please try again.');
    }
  };

  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      
      {/* Header */}
      <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? 0 : top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Video</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Add Video from URL Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="globe-outline" size={24} color="#007AFF" />
              <Text style={styles.sectionTitle}>Add from URL</Text>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
              placeholderTextColor="#999"
              value={newVideoUrl}
              onChangeText={setNewVideoUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="next"
              editable={!isLoading}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Video title (optional)"
              placeholderTextColor="#999"
              value={newVideoTitle}
              onChangeText={setNewVideoTitle}
              returnKeyType="done"
              editable={!isLoading}
            />
            
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.disabledButton]} 
              onPress={handleAddVideo}
              disabled={isLoading}
            >
              <Ionicons name="globe-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Adding...' : 'Add from URL'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Add Video from Device Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="phone-portrait-outline" size={24} color="#34C759" />
              <Text style={styles.sectionTitle}>Add from Device</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, isLoading && styles.disabledButton]} 
              onPress={handlePickLocalVideo}
              disabled={isLoading}
            >
              <Ionicons name="phone-portrait-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>
                {isLoading ? 'Adding...' : 'Select from Device'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#999',
    marginHorizontal: 20,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddVideoScreen; 