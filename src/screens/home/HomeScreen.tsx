import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, VideoItem } from '../../types';
import { useVideoPlayer, useVideoPlaylist } from '../../hooks/useVideoPlayer';
import { isValidVideoUrl } from '../../modules/utility/helpers/networkUtils';
import { formatTime } from '../../modules/utility/helpers/timeUtils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setCurrentVideo } = useVideoPlayer();
  const { videoList, addToPlaylist } = useVideoPlaylist();
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sample video list for demonstration
  const sampleVideos: VideoItem[] = [
    {
      id: '1',
      title: 'Sample Video 1',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: 30,
      isLocal: false,
    },
    {
      id: '2',
      title: 'Big Buck Bunny - Sample Video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/320px-Big_buck_bunny_poster_big.jpg',
      duration: 596,
      isLocal: false,
    },
    {
      id: '3',
      title: 'Sample Video 3',
      url: 'https://storage.googleapis.com/for_test_f/yung%20kai%20720.mp4',
      thumbnail: 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?cs=srgb&dl=pexels-francesco-ungaro-281260.jpg&fm=jpg',
      duration: 100,
      isLocal: false,
    }
  ];

  useEffect(() => {
    if (videoList.length === 0) {
      sampleVideos.forEach(video => addToPlaylist(video));
    }
  }, []);

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) {
      Alert.alert('Error', 'Please enter a video URL');
      return;
    }

    if (!isValidVideoUrl(newVideoUrl)) {
      Alert.alert('Error', 'Please enter a valid video URL');
      return;
    }

    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: newVideoTitle.trim() || 'Untitled Video',
      url: newVideoUrl.trim(),
      thumbnail: 'https://via.placeholder.com/320x180?text=Video',
      isLocal: false,
    };

    addToPlaylist(newVideo);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setShowAddForm(false);
    Alert.alert('Success', 'Video added to playlist!');
  };

  const handlePlayVideo = (video: VideoItem, index: number) => {
    setCurrentVideo(video, index);
    navigation.navigate('Player');
  };

  const renderVideoItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handlePlayVideo(item, index)}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        {item.thumbnail ? (
          <Image 
            source={{ uri: item.thumbnail }} 
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="videocam" size={40} color="#666" />
          </View>
        )}
        
        {/* Duration Badge */}
        {item.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {formatTime(item.duration)}
            </Text>
          </View>
        )}
        
        {/* Play Icon Overlay */}
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={30} color="#fff" />
        </View>
      </View>

      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoMeta}>
          <Text style={styles.videoType}>
            {item.isLocal ? '📱 Local' : '🌐 Online'}
          </Text>
          {item.duration && (
            <Text style={styles.videoDuration}>
              {formatTime(item.duration)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Player</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons 
            name={showAddForm ? "close" : "add"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* Add Video Form */}
      {showAddForm && (
        <View style={styles.addVideoForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter video URL..."
            placeholderTextColor="#888"
            value={newVideoUrl}
            onChangeText={setNewVideoUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Video title (optional)"
            placeholderTextColor="#888"
            value={newVideoTitle}
            onChangeText={setNewVideoTitle}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddVideo}>
            <Text style={styles.submitButtonText}>Add Video</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Video List */}
      <View style={styles.playlistSection}>
        <Text style={styles.sectionTitle}>
          Playlist ({videoList.length} videos)
        </Text>
        
        <FlatList
          data={videoList}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addVideoForm: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#2a2a2a',
  },
  submitButton: {
    backgroundColor: '#ff0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistSection: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  videoCard: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16/9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 18,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoType: {
    fontSize: 12,
    color: '#aaa',
  },
  videoDuration: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default HomeScreen; 