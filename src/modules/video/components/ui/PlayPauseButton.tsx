import React, { useEffect } from 'react'; // 👈 [1] Import useEffect
import { TouchableOpacity, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming, // 👈 [2] Import withTiming สำหรับ Cross-fade
} from 'react-native-reanimated';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  isLoading?: boolean;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onPress,
  size = 60,
  color = '#fff',
  backgroundColor = 'rgba(0, 0, 0, 0.3)',
  isLoading = false,
}) => {
  const scale = useSharedValue(1);
  const iconAnimation = useSharedValue(isPlaying ? 1 : 0);

  useEffect(() => {
    iconAnimation.value = withTiming(isPlaying ? 1 : 0, {
      duration: 250,
    });
  }, [isPlaying]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedPlayIconStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - iconAnimation.value,
      transform: [{ scale: 1 - iconAnimation.value }],
    };
  });

  const animatedPauseIconStyle = useAnimatedStyle(() => {
    return {
      opacity: iconAnimation.value,
      transform: [{ scale: iconAnimation.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const iconSize = size * 0.5;

  return (
    <Animated.View style={animatedContainerStyle}>
      {isLoading ? (
        <ActivityIndicator size={size / 1.1} color="#fff" />
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: size / 1.1,
              height: size / 1.1,
              borderRadius: size / 2,
              backgroundColor: backgroundColor,
            },
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <View style={styles.iconContainer}>
            <Animated.View style={[{ position: 'absolute' }, animatedPlayIconStyle]}>
              <Ionicons
                name="play"
                size={iconSize}
                color={color}
                style={{ marginLeft: size * 0.05 }}
              />
            </Animated.View>

            <Animated.View style={[{ position: 'absolute' }, animatedPauseIconStyle]}>
              <Ionicons
                name="pause"
                size={iconSize}
                color={color}
              />
            </Animated.View>
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});