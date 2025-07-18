import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export const usePinchGesture = (maxScale: number) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.max(1, Math.min(newScale, maxScale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedVideoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    scale,
    pinchGesture,
    animatedVideoStyle,
  };
}; 