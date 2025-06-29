import React from 'react';
import { TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable);

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen,
  onPress,
  size = 40,
  color = '#fff',
}) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.8, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.get() }],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
    >
      <Ionicons
        name={isFullscreen ? "contract-outline" : "expand-outline"}
        size={size * 0.6}
        color={color}
      />
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
}); 