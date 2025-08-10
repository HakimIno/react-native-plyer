import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { VideoPlayer } from '../../modules/video/player/VideoPlayer';
import { LinearGradient } from 'expo-linear-gradient';

// ActionButton component extracted for clarity
const ActionButton = ({ icon, label }: { icon: string; label: string }) => (
  <TouchableOpacity style={styles.actionBtn}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export const PlayerScreen: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const creator = {
    name: 'Sergi Martínez Miró',
    avatar: 'https://img.icons8.com/ios-filled/500/popeye.png',
    subscriber: '7.4 M Subscriber',
  };

  const videoMeta = {
    title: 'From Dawn to Dusk in Tokyo: ...',
    views: '105 views',
    date: '3 days ago',
    comments: 428,
  };


  return (
    <View style={styles.container}>
      <VideoPlayer
        autoPlay={true}
        onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
      />

      {/* Show UI only when not in fullscreen */}
      {!isFullscreen && (

        <ScrollView style={styles.bottomSheet}>
          <View style={{ position: 'relative' }}>
            
            {/* Creator Info */}
            <View style={styles.creatorRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: creator.avatar }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorName}>{creator.name}</Text>
                <Text style={styles.subscriber}>{creator.subscriber}</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Video Title & Meta */}
          <Text style={styles.title}>{videoMeta.title}</Text>
          <Text style={styles.meta}>{`${videoMeta.views} • ${videoMeta.date}`}</Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <ActionButton icon="👍" label="3.4k" />
            <ActionButton icon="👎" label="2" />
            <ActionButton icon="🔗" label="Share" />
            <ActionButton icon="⬇️" label="Download" />
          </View>

          {/* Comments */}
          <Text style={styles.commentHeader}>{`Comments (${videoMeta.comments})`}</Text>
          {/* <CommentList ... /> */}

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  bottomSheet: {
    marginTop: -10,
    backgroundColor: '#101010',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,

  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    gap: 10,
  },
  avatarWrapper: {
    padding: 5,
    borderRadius: 130,
    backgroundColor: 'white',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  creatorInfo: { flex: 1 },
  creatorName: { color: '#fff', fontWeight: 'bold' },
  subscriber: { color: '#aaa', fontSize: 12 },
  followBtn: {
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  followText: { color: '#fff', fontWeight: 'bold' },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
  },
  meta: {
    color: '#aaa',
    fontSize: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  actionBtn: { alignItems: 'center' },
  actionIcon: { fontSize: 20, color: '#fff' },
  actionLabel: { color: '#fff', fontSize: 12 },
  commentHeader: {
    color: '#fff',
    fontWeight: 'bold',
    margin: 16,
    fontSize: 16,
  },
  analysisIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  analysisText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
});