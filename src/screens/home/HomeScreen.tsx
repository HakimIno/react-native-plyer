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
  StatusBar, 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, VideoItem } from '../../types';
import { useVideoPlayer, useVideoPlaylist } from '../../modules/video/hooks/useVideoPlayer';
import { isValidVideoUrl } from '../../modules/video/utility/helpers/networkUtils';
import { formatTime } from '../../modules/video/utility/helpers/timeUtils';
import { getCachedVideoThumbnail } from '../../modules/video/utility/helpers/thumbnailUtils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: Props) => {
  const { setCurrentVideo } = useVideoPlayer();
  const { videoList, addToPlaylist } = useVideoPlaylist();
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [thumbnailCache, setThumbnailCache] = useState<Map<string, string>>(new Map());

  // Sample video list for demonstration
  const sampleVideos: VideoItem[] = [
    {
      id: '1',
      title: 'Sample Video 1 (Auto Thumbnail)',
      url: 'https://storage.googleapis.com/for_test_f/Kitten-cute.mp4',
      thumbnail: '', // No thumbnail - will auto-generate
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
      title: 'Sample Video 3 (Auto Thumbnail)',
      url: 'https://storage.googleapis.com/for_test_f/yung%20kai%20720.mp4',
      thumbnail: '', // No thumbnail - will auto-generate
      duration: 100,
      isLocal: false,
    },
    {
      id: '4',
      title: 'Sprite Fight',
      url: 'https://files.vidstack.io/sprite-fight/1080p.mp4',
      thumbnail: 'https://files.vidstack.io/sprite-fight/poster.webp',
      duration: 1000,
      isLocal: false,
    },
  ];

  useEffect(() => {
    if (videoList.length === 0) {
      sampleVideos.forEach(video => addToPlaylist(video));
    }
  }, []);

  const handleAddVideo = async () => {
    if (!newVideoUrl.trim()) {
      Alert.alert('Error', 'Please enter a video URL');
      return;
    }

    if (!isValidVideoUrl(newVideoUrl)) {
      Alert.alert('Error', 'Please enter a valid video URL');
      return;
    }

    // Show loading state
    Alert.alert('Processing', 'Adding video and generating thumbnail...');

    try {
      // Generate thumbnail for the new video
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
      setNewVideoUrl('');
      setNewVideoTitle('');
      setShowAddForm(false);
      Alert.alert('Success', 'Video added to playlist with auto-generated thumbnail!');
    } catch (error) {
      console.log('Error adding video:', error);
      
      // Still add the video but without thumbnail
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
      Alert.alert('Success', 'Video added to playlist! (Thumbnail generation failed, but video is ready to play)');
    }
  };

  const handlePlayVideo = (video: VideoItem, index: number) => {
    setCurrentVideo(video, index);
    navigation.navigate('Player');
  };

  // Load video thumbnails automatically
  useEffect(() => {
    const loadThumbnailsForVideos = async () => {
      const videosNeedingThumbnails = videoList.filter(video => {
        const shouldGenerateThumbnail = !video.thumbnail || 
          video.thumbnail.includes('placeholder') || 
          video.thumbnail.includes('via.placeholder.com') ||
          video.thumbnail === '';
        
        return shouldGenerateThumbnail && !thumbnailCache.has(video.id);
      });

      for (const video of videosNeedingThumbnails) {
        try {
          const generatedThumbnail = await getCachedVideoThumbnail(
            video.url,
            video.thumbnail,
            { time: 2000, quality: 0.7 }
          );
          
          if (generatedThumbnail) {
            setThumbnailCache(prev => {
              const newCache = new Map(prev);
              newCache.set(video.id, generatedThumbnail);
              return newCache;
            });
          }
        } catch (error) {
          console.log('Error generating thumbnail for video:', video.title, error);
        }
      }
    };

    if (videoList.length > 0) {
      loadThumbnailsForVideos();
    }
  }, [videoList]);

  const renderVideoItem = ({ item, index }: { item: VideoItem; index: number }) => {
    // Get thumbnail from cache or use original
    const currentThumbnail = thumbnailCache.get(item.id) || item.thumbnail;
    const isGeneratingThumbnail = !currentThumbnail || currentThumbnail === '' || currentThumbnail.includes('placeholder');

    return (
      <TouchableOpacity
        style={styles.videoCard}
        onPress={() => handlePlayVideo(item, index)}
        activeOpacity={0.7}
      >
        <View style={styles.thumbnailContainer}>
          {currentThumbnail && !isGeneratingThumbnail ? (
            <Image
              source={{ uri: currentThumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
              onError={() => {
                console.log('Failed to load thumbnail:', currentThumbnail);
              }}
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="image-outline" size={40} color="#666" />
              <Text style={styles.thumbnailPlaceholderText}>
                {isGeneratingThumbnail ? 'Generating Thumbnail...' : 'No Thumbnail'}
              </Text>
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
            <Ionicons name="play-circle" size={50} color="#fff" />
          </View>
        </View>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.videoMeta}>
            <Ionicons name={item.isLocal ? 'phone-portrait-outline' : 'globe-outline'} size={16} color="#b0b0b0" />
            <Text style={styles.videoType}>
              {item.isLocal ? 'Local' : 'Online'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

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
            placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
            placeholderTextColor="#888"
            value={newVideoUrl}
            onChangeText={setNewVideoUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <TextInput
            style={styles.input}
            placeholder="Video title (optional)"
            placeholderTextColor="#888"
            value={newVideoTitle}
            onChangeText={setNewVideoTitle}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddVideo}>
            <Text style={styles.submitButtonText}>Add Video to Playlist</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Video List */}
      <View style={styles.playlistSection}>
        <Text style={styles.sectionTitle}>
          My Playlist ({videoList.length} videos)
        </Text>

        {videoList.length === 0 ? (
          <View style={styles.emptyPlaylistContainer}>
            <Ionicons name="film-outline" size={60} color="#666" />
            <Text style={styles.emptyPlaylistText}>Your playlist is empty!</Text>
            <Text style={styles.emptyPlaylistSubText}>Add a video using the '+' button above.</Text>
          </View>
        ) : (
          <FlatList
            data={videoList}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            numColumns={1}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Deeper black for more premium feel
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addVideoForm: {
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    padding: 24,
    margin: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'rgba(40, 40, 40, 0.6)',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  playlistSection: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  listContainer: {
    paddingBottom: 40,
  },
  videoCard: {
    backgroundColor: 'rgba(25, 25, 25, 0.6)',
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden',

    transform: [{ scale: 1 }], // For potential animation
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  thumbnailPlaceholderText: {
    color: '#999',
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  videoInfo: {
    padding: 15,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoType: {
    fontSize: 12,
    color: '#b0b0b0',
    fontWeight: '600',
  },
  videoDuration: {
    fontSize: 14,
    color: '#b0b0b0',
    fontWeight: '500',
  },
  emptyPlaylistContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyPlaylistText: {
    fontSize: 22,
    color: '#ffffff',
    marginTop: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyPlaylistSubText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});

export default HomeScreen;