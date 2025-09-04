import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Dimensions,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, BottomTabParamList, VideoItem } from '../../types';
import { useVideoPlayer, useVideoPlaylist } from '../../modules/video/hooks/useVideoPlayer';
import { useThumbnailCache } from '../../modules/video/hooks';
import { formatTime } from '../../modules/video/utility/helpers/timeUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoList, useVideoListLength } from '../../store/hooks';

const { width: screenWidth } = Dimensions.get('window');

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

// Memoized VideoItem component to prevent unnecessary re-renders
const VideoItemComponent = React.memo(({ 
  item, 
  index, 
  onPress, 
  getThumbnail,
  isThumbnailLoading
}: { 
  item: VideoItem; 
  index: number; 
  onPress: (video: VideoItem, index: number) => void;
  getThumbnail: (videoId: string, fallbackThumbnail?: string) => string;
  isThumbnailLoading: (videoId: string) => boolean;
}) => {
  const currentThumbnail = getThumbnail(item.id, item.thumbnail);
  const isLoading = isThumbnailLoading(item.id);
  const isGeneratingThumbnail = !currentThumbnail || currentThumbnail === '' || currentThumbnail.includes('placeholder');

  return (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => onPress(item, index)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        {currentThumbnail && !isGeneratingThumbnail ? (
          <Image
            source={{ uri: currentThumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            {isLoading ? (
              <Ionicons name="hourglass-outline" size={40} color="#666" />
            ) : (
              <Ionicons name="play-circle-outline" size={60} color="#666" />
            )}
          </View>
        )}

        {item.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {formatTime(item.duration)}
            </Text>
          </View>
        )}

        {item.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}

        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={30} color="#fff" />
          </View>
        </View>
      </View>

      <View style={styles.videoInfo}>
        <View style={styles.videoHeader}>
          <View style={styles.channelAvatar}>
            <Ionicons name="person" size={20} color="rgb(100, 100, 100)" />
          </View>
          <View style={styles.videoDetails}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.channelName}>Video Channel</Text>
            <View style={styles.videoStats}>
              <Text style={styles.videoStatsText}>1.2K views</Text>
              <Text style={styles.videoStatsText}>•</Text>
              <Text style={styles.videoStatsText}>2 days ago</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const HomeScreen = React.memo(({ navigation }: Props) => {
  const { setCurrentVideo } = useVideoPlayer();
  const { addToPlaylist } = useVideoPlaylist();
  const videoList = useVideoList();
  const videoListLength = useVideoListLength();
  const [isInitialized, setIsInitialized] = useState(false);

  // Use optimized thumbnail cache hook
  const { getThumbnail, isThumbnailLoading } = useThumbnailCache(videoList);

  // Memoize sample videos to prevent recreation on every render
  const sampleVideos: VideoItem[] = useMemo(() => [
    {
      id: '2',
      title: 'Big Buck Bunny - Sample Video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: '',
      duration: 596,
      isLocal: false,
      isLive: false,
    },
    {
      id: '3',
      title: 'Sample Video 3 (Auto Thumbnail)',
      url: 'https://storage.googleapis.com/for_test_f/yung%20kai%20720.mp4',
      thumbnail: '', // No thumbnail - will auto-generate
      duration: 214,
      isLocal: false,
      isLive: false,
    },
    {
      id: '4',
      title: 'Sprite Fight',
      url: 'https://files.vidstack.io/sprite-fight/1080p.mp4',
      thumbnail: '',
      duration: 629,
      isLocal: false,
      isLive: false,
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
    {
      id: '5',
      title: 'Cartoon Network',
      url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
      thumbnail: 'https://uibundle.s3.amazonaws.com/images/product-cover-1631523089-product-cover-1626754257-cover-jpg-jpeg',
      isLocal: false,
      isLive: true,
    },
    {
      id: '6',
      title: 'ช่อง 3 TV',
      url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffae/3hd/3hd.m3u8',
      thumbnail: 'https://f.ptcdn.info/428/018/000/1398937824-33logo-o.jpg',
      isLocal: false,
      isLive: true,
    },
  ], []);

  // Initialize playlist only once
  useEffect(() => {
    if (!isInitialized && videoListLength === 0) {
      sampleVideos.forEach(video => addToPlaylist(video));
      setIsInitialized(true);
    }
  }, [isInitialized, videoListLength, addToPlaylist, sampleVideos]);

  const handlePlayVideo = useCallback((video: VideoItem, index: number) => {
    setCurrentVideo(video, index);
    navigation.navigate('Player');
  }, [setCurrentVideo, navigation]);

  const renderVideoItem = useCallback(({ item, index }: { item: VideoItem; index: number }) => (
    <VideoItemComponent
      item={item}
      index={index}
      onPress={handlePlayVideo}
      getThumbnail={getThumbnail}
      isThumbnailLoading={isThumbnailLoading}
    />
  ), [handlePlayVideo, getThumbnail, isThumbnailLoading]);

  const { top } = useSafeAreaInsets();

  // Memoize categories data
  const categories = useMemo(() => ['All', 'Music', 'Gaming', 'Live', 'News', 'Sports'], []);

  const renderCategoryItem = useCallback(({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        index === 0 && styles.categoryButtonActive
      ]}
    >
      <Text style={[
        styles.categoryText,
        index === 0 && styles.categoryTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  ), []);

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: VideoItem) => item.id, []);

  // Memoize navigation handlers
  const handleAddVideoPress = useCallback(() => {
    navigation.navigate('AddVideo');
  }, [navigation]);

  const handleSharePress = useCallback(() => {
    // Handle share functionality
  }, []);

  const handleNotificationsPress = useCallback(() => {
    // Handle notifications functionality
  }, []);

  const handleSearchPress = useCallback(() => {
    // Handle search functionality
  }, []);

  // Memoize header style
  const headerStyle = useMemo(() => [
    styles.header, 
    { marginTop: Platform.OS === 'ios' ? 0 : top }
  ], [top]);

  // Memoize FlatList props
  const flatListProps = useMemo(() => ({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: styles.listContainer,
    numColumns: 1,
    overScrollMode: "never" as const,
    removeClippedSubviews: true,
    maxToRenderPerBatch: 3,
    windowSize: 5,
    initialNumToRender: 2,
    getItemLayout: (data: any, index: number) => ({
      length: 280, // Approximate height of each item
      offset: 280 * index,
      index,
    }),
  }), []);

  const categoryListProps = useMemo(() => ({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    overScrollMode: 'never' as const,
    contentContainerStyle: styles.categoriesList,
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    windowSize: 5,
    initialNumToRender: 6,
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <LinearGradient
        colors={['rgb(22, 3, 85)', 'rgba(0, 0, 0, 1)']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.3, y: 0.3 }}
        style={styles.container}
      >

        <View style={headerStyle}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="dog" size={24} color="white" />
            <Text style={styles.headerTitle}>Kube</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton} onPress={handleSharePress}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleNotificationsPress}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleSearchPress}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            {...categoryListProps}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={renderCategoryItem}
          />
        </View>

        <View style={styles.contentContainer}>
          {videoListLength === 0 ? (
            <View style={styles.emptyPlaylistContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="play-circle-outline" size={80} color="#666" />
              </View>
              <Text style={styles.emptyPlaylistText}>No videos yet</Text>
              <Text style={styles.emptyPlaylistSubText}>
                Add your first video to start watching
              </Text>
              <TouchableOpacity
                style={styles.addFirstVideoButton}
                onPress={handleAddVideoPress}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addFirstVideoText}>Add Video</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              {...flatListProps}
              data={videoList}
              renderItem={renderVideoItem}
              keyExtractor={keyExtractor}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#fff',
  },
  categoryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#000',
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
  videoCard: {
    marginBottom: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    backgroundColor: '#1a1a1a',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
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
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff0000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  channelAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoDetails: {
    flex: 1,
    marginRight: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 22,
  },
  channelName: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 2,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoStatsText: {
    fontSize: 12,
    color: '#aaa',
  },
  moreButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPlaylistContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyPlaylistText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyPlaylistSubText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  addFirstVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  addFirstVideoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;