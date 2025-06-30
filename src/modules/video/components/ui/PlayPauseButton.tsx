import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onPress,
  size = 60, 
  color = '#fff',
  backgroundColor = 'rgba(0, 0, 0, 0.3)', 
}) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { duration: 80 }), 
      withSpring(1, { duration: 80 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.get() }],
    };
  });

  const iconName = isPlaying ? 'pause' : 'play';
  const iconSize = size * 0.5; 

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.button,
        {
          width: size - 5,
          height: size - 5,
          borderRadius: size / 2,
          backgroundColor: backgroundColor,

        },
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} 
    >
      <Ionicons
        name={iconName}
        size={iconSize}
        color={color}
        style={[
          styles.icon,
          !isPlaying && { marginLeft: size * 0.05 }, 
        ]}
      />
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});