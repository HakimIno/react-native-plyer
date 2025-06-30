import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, VideoItem } from '../../types';
import { useVideoPlayer, useVideoPlaylist } from '../../modules/video/hooks/useVideoPlayer';
import { formatTime } from '../../modules/video/utility/helpers/timeUtils';
import { getCachedVideoThumbnail } from '../../modules/video/utility/helpers/thumbnailUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: Props) => {
  const { setCurrentVideo } = useVideoPlayer();
  const { videoList, addToPlaylist } = useVideoPlaylist();
  const [thumbnailCache, setThumbnailCache] = useState<Map<string, string>>(new Map());

  // Sample video list for demonstration
  const sampleVideos: VideoItem[] = [
    {
      id: '1',
      title: 'Sample Video 1 (Auto Thumbnail)',
      url: 'https://storage.googleapis.com/for_test_f/Kitten-cute.mp4',
      thumbnail: '', // No thumbnail - will auto-generate
      duration: 661,
      isLocal: false,
    },
    {
      id: '2',
      title: 'Big Buck Bunny - Sample Video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: '',
      duration: 596,
      isLocal: false,
    },
    {
      id: '3',
      title: 'Sample Video 3 (Auto Thumbnail)',
      url: 'https://storage.googleapis.com/for_test_f/yung%20kai%20720.mp4',
      thumbnail: '', // No thumbnail - will auto-generate
      duration: 214,
      isLocal: false,
      
    },
    {
      id: '4',
      title: 'Sprite Fight',
      url: 'https://files.vidstack.io/sprite-fight/1080p.mp4',
      thumbnail: '',
      duration: 629,
      isLocal: false,
      textTracks: [
        {
          src: "https://files.vidstack.io/sprite-fight/subs/english.vtt",
          label: "English",
          language: "en-US",
          kind: "subtitles",
          type: "vtt",
          default: true
        },
        {
          src: "https://files.vidstack.io/sprite-fight/subs/spanish.vtt",
          label: "Spanish",
          language: "es-ES",
          kind: "subtitles",
          type: "vtt"
        },
        {
          src: "https://files.vidstack.io/sprite-fight/chapters.vtt",
          label: "Chapters",
          language: "en-US",
          kind: "chapters",
          type: "vtt",
          default: true
        }
      ]
    },
  ];

  useEffect(() => {
    if (videoList.length === 0) {
      sampleVideos.forEach(video => addToPlaylist(video));
    }
  }, []);





  const handlePlayVideo = (video: VideoItem, index: number) => {
    setCurrentVideo(video, index);
    navigation.navigate('Player');
  };

  useEffect(() => {
    const loadThumbnailsForVideos = async () => {
      const videosNeedingThumbnails = videoList.filter((video: VideoItem) => {
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
    const currentThumbnail = thumbnailCache.get(item.id) || item.thumbnail;
    const isGeneratingThumbnail = !currentThumbnail || currentThumbnail === '' || currentThumbnail.includes('placeholder');

    return (
      <TouchableOpacity
        style={styles.videoCard}
        onPress={() => handlePlayVideo(item, index)}
        activeOpacity={0.8}
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
              <Ionicons name="image-outline" size={100} color="#666" />
            </View>
          )}


          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>
                {formatTime(item.duration)}
              </Text>
            </View>
          )}


          <View style={styles.playOverlay}>
            <Ionicons name="play-circle" size={56} color="#fff" />
          </View>
        </View>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.videoMeta}>
            <Ionicons name={item.isLocal ? 'phone-portrait-outline' : 'globe-outline'} size={18} color="#aaa" />
            <Text style={styles.videoType}>
              {item.isLocal ? 'Local Video' : 'Online Stream'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const { top } = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />


      <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? 0 : top }]}>
        <Text style={styles.headerTitle}>Video Player</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddVideo')}
        >
          <Ionicons
            name="add"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>




      <View style={styles.playlistSection}>
        <Text style={styles.sectionTitle}>
          My Playlist ({videoList.length} videos)
        </Text>

        {videoList.length === 0 ? (
          <View style={styles.emptyPlaylistContainer}>
            <Ionicons name="film-outline" size={70} color="#666" />
            <Text style={styles.emptyPlaylistText}>Your playlist is empty!</Text>
            <Text style={styles.emptyPlaylistSubText}>
              Tap the '+' button at the top right to add your first video.
            </Text>
          </View>
        ) : (
          <FlatList
            data={videoList}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            numColumns={1}
            overScrollMode="never"
          />
        )}
      </View>
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
    paddingHorizontal: 18, // Increased padding
    paddingVertical: 12, // Increased vertical padding

  },
  headerTitle: {
    fontSize: 22, // Larger title
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.8, // Slightly more spacing
  },
  addButton: {
    width: 44, // Slightly larger touch target
    height: 44,
    borderRadius: 22, // Perfect circle
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 }, // Softer shadow
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  playlistSection: {
    flex: 1,
    paddingHorizontal: 15, // Increased padding
    paddingTop: 10, // Increased padding
  },
  sectionTitle: {
    fontSize: 16, // Larger section title
    fontWeight: '700', // Bolder
    marginBottom: 15, // More space
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingBottom: 40,
  },
  videoCard: {
    backgroundColor: 'rgba(20, 20, 20, 1)', // Slightly more opaque
    borderRadius: 10, // More rounded corners
    marginBottom: 20,
    overflow: 'hidden',

  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    justifyContent: 'center', // Center content when image is not loaded
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholderText: {
    color: '#999',
    marginTop: 10, // Adjusted margin
    fontSize: 15,
    fontWeight: '500',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10, // Slightly closer to bottom
    right: 10, // Slightly closer to right
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly less opaque
    paddingHorizontal: 8, // Slightly less padding
    paddingVertical: 4, // Slightly less padding
    borderRadius: 8, // Softer corners
  },
  durationText: {
    color: '#ffffff',
    fontSize: 11, // Slightly smaller font
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slightly more visible overlay
    borderRadius: 10, // Match card radius
  },
  videoInfo: {
    padding: 16, // Consistent padding
  },
  videoTitle: {
    fontSize: 19, // Slightly larger title
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10, // Reduced margin
    lineHeight: 26, // Better line height
    letterSpacing: 0.3,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Reduced gap
  },
  videoType: {
    fontSize: 13, // Slightly smaller
    color: '#aaa', // Softer grey
    fontWeight: '600',
  },
  emptyPlaylistContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, // Reduced padding
    marginTop: 40, // Reduced top margin
  },
  emptyPlaylistText: {
    fontSize: 24, // Larger
    color: '#ffffff',
    marginTop: 20, // Adjusted margin
    fontWeight: '800', // Bolder
    textAlign: 'center',
  },
  emptyPlaylistSubText: {
    fontSize: 15, // Slightly smaller
    color: '#888',
    marginTop: 10, // Adjusted margin
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300, // Wider
  },
});

export default HomeScreen;