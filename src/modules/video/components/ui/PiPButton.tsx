import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface PiPButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
}

export const PiPButton: React.FC<PiPButtonProps> = ({
  onPress,
  size = 32,
  color = '#fff',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {/* Outer rectangle */}
        <View style={[styles.outerRect, { borderColor: color }]} />
        {/* Inner rectangle (PiP window) */}
        <View style={[styles.innerRect, { backgroundColor: color }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
  iconContainer: {
    width: 18,
    height: 12,
    position: 'relative',
  },
  outerRect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 18,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
  },
  innerRect: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 4,
    borderRadius: 1,
  },
});
