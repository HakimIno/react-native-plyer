import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Text,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import { usePiPStore } from '../../store/pipStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PiPVideoPlayerProps {
  videoUrl: string;
  onExpand?: () => void;
}

export const PiPVideoPlayer: React.FC<PiPVideoPlayerProps> = ({
  videoUrl,
  onExpand,
}) => {
  const {
    position,
    size,
    isDragging,
    isMinimized,
    currentTime,
    isPlaying: storeIsPlaying,
    videoTitle,
    isTransitioning,
    updatePosition,
    setDragging,
    exitPiPMode,
    updateVideoState,
  } = usePiPStore();

  const [isPlaying, setIsPlaying] = useState(storeIsPlaying);
  const [showControls, setShowControls] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<any>(null);
  const lastPosition = useRef(position);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animation effect when PiP starts
  useEffect(() => {
    if (isTransitioning) {
      // Start with small scale and fade in
      scaleAnim.setValue(0.3);
      opacityAnim.setValue(0);
      
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Ensure full opacity when not transitioning
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [isTransitioning, scaleAnim, opacityAnim]);

  // Update lastPosition when position changes
  useEffect(() => {
    lastPosition.current = position;
  }, [position]);

  // Sync with store video state
  useEffect(() => {
    setIsPlaying(storeIsPlaying);
  }, [storeIsPlaying]);

  // Track if we've already seeked to avoid infinite loops
  const hasInitialSeeked = useRef(false);

  // Reset seek flag when video URL changes
  useEffect(() => {
    hasInitialSeeked.current = false;
  }, [videoUrl]);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      setShowControls(true);
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isPlaying]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only start dragging if movement is significant
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },
    onPanResponderGrant: () => {
      setDragging(true);
      lastPosition.current = position;
    },
    onPanResponderMove: (_, gestureState) => {
      if (isMinimized) {
        return;
      }

      const newX = lastPosition.current.x + gestureState.dx;
      const newY = lastPosition.current.y + gestureState.dy;
      
      updatePosition(newX, newY);
    },
    onPanResponderRelease: () => {
      setDragging(false);
      lastPosition.current = position;
    },
    onPanResponderTerminate: () => {
      setDragging(false);
    },
  });

  const handleVideoPress = () => {
    if (!isDragging) {
      const newPlayingState = !isPlaying;
      setIsPlaying(newPlayingState);
      // Don't update currentTime here to avoid loops
      setShowControls(true);
    }
  };

  const handleExpand = () => {
    exitPiPMode();
    onExpand?.();
  };

  const handleClose = () => {
    exitPiPMode();
  };

  const currentSize = isMinimized 
    ? { width: size.width * 0.6, height: size.height * 0.6 }
    : size;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x,
          top: position.y,
          width: currentSize.width,
          height: currentSize.height,
          opacity: isDragging ? 0.8 : opacityAnim,
          transform: [
            { scale: isDragging ? 1.05 : scaleAnim },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.videoContainer}>
          <View
            style={styles.videoWrapper}
            onTouchEnd={handleVideoPress}
          >
            <Video
              ref={(ref) => {
                videoRef.current = ref;
              }}
              source={{ uri: videoUrl }}
              style={styles.video}
              paused={!isPlaying}
              repeat={false}
              resizeMode="contain"
              controls={false}
              onProgress={(data) => {
                if (data.currentTime !== undefined) {
                  // More frequent updates for better sync (reduced from 0.5 to 0.1 seconds)
                  const timeDiff = Math.abs(data.currentTime - currentTime);
                  if (timeDiff > 0.1) {
                    updateVideoState(data.currentTime, isPlaying);
                  }
                }
              }}
              onLoad={(data) => {
                console.log('PiP Video loaded:', data);
                // Video is loaded and ready - seek to stored time once
                if (!hasInitialSeeked.current && videoRef.current && currentTime > 0) {
                  hasInitialSeeked.current = true;
                  setTimeout(() => {
                    if (videoRef.current) {
                      console.log('Seeking to:', currentTime);
                      videoRef.current.seek(currentTime);
                    }
                  }, 500); // Longer delay to ensure video is ready
                }
              }}
              onError={(error) => {
                console.log('PiP Video error:', error);
              }}
              onLoadStart={() => {
                console.log('PiP Video loading started');
              }}
              onEnd={() => {
                setIsPlaying(false);
                // Video ended, don't need to update time
              }}
            />
          </View>

          {/* Video Title */}
          {showControls && videoTitle && (
            <View style={styles.titleOverlay} pointerEvents="box-none">
              <Text style={styles.videoTitle} numberOfLines={1}>
                {videoTitle}
              </Text>
            </View>
          )}

          {/* Controls Overlay */}
          {showControls && (
            <View style={styles.controlsOverlay} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <View style={styles.closeButton}>
                <View style={styles.closeIcon} />
                <View style={styles.closeIcon2} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleExpand}
              activeOpacity={0.7}
            >
              <View style={styles.expandButton}>
                <View style={styles.expandIcon} />
                <View style={styles.expandIcon2} />
              </View>
            </TouchableOpacity>
          </View>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && showControls && (
            <View style={styles.playOverlay} pointerEvents="box-none">
              <TouchableOpacity
                style={styles.playButton}
                onPress={handleVideoPress}
                activeOpacity={0.7}
              >
                <View style={styles.playIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent', // เพิ่มให้โปร่งใส
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden', // เพิ่มเพื่อให้ border radius ทำงาน
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  titleOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 60,
    zIndex: 10,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  controlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 12,
    height: 2,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  closeIcon2: {
    width: 12,
    height: 2,
    backgroundColor: '#fff',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
  },
  expandButton: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#fff',
    borderTopWidth: 0,
    borderRightWidth: 0,
    transform: [{ rotate: '45deg' }],
  },
  expandIcon2: {
    width: 4,
    height: 4,
    borderWidth: 1,
    borderColor: '#fff',
    borderTopWidth: 0,
    borderRightWidth: 0,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 2,
    left: 2,
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
    zIndex: 5,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
});
