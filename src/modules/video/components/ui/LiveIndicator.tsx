import React, { useEffect, useMemo, memo } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constants for easier maintenance
const DEFAULT_COLORS = {
  liveRed: '#FF4444',
  textColor: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
};

const SIZES = {
  dotSize: 6,
  fontSize: 12,
  iconSize: 14,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
};

// Interfaces
interface Colors {
  liveRed?: string;
  textColor?: string;
  backgroundColor?: string;
}

interface LiveIndicatorProps {
  isLive?: boolean;
  viewerCount?: number;
  showViewerCount?: boolean;
  style?: ViewStyle;
  colors?: Colors;
}

// Utility function for viewer count formatting
const formatViewerCount = (count?: number): string => {
  if (count === undefined || count < 0) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}m`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  isLive = true,
  viewerCount,
  showViewerCount = true,
  style,
  colors = DEFAULT_COLORS,
}) => {
  const pulseAnim = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    if (isLive) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isLive, pulseAnim]);

  if (!isLive) return null;

  return (
    <View style={[styles.container, style]} accessible accessibilityLabel={`Live indicator${viewerCount ? ` with ${viewerCount} viewers` : ''}`}>
      {/* Live Badge */}
      <View style={[styles.liveBadge, { backgroundColor: colors.backgroundColor }]}>
        <Animated.View
          style={[
            styles.pulseDot,
            {
              backgroundColor: colors.liveRed,
              opacity: pulseAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Text style={[styles.liveText, { color: colors.textColor }]}>LIVE</Text>
      </View>

      {/* Viewer Count */}
      {showViewerCount && viewerCount !== undefined && (
        <View style={[styles.viewerCountContainer, { backgroundColor: colors.backgroundColor }]}>
          <Ionicons name="eye-outline" size={SIZES.iconSize} color={colors.textColor} />
          <Text style={[styles.viewerCountText, { color: colors.textColor }]}>
            {formatViewerCount(viewerCount)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: SIZES.paddingVertical,
    borderRadius: SIZES.borderRadius,
    gap: 4,
   
  },
  pulseDot: {
    width: SIZES.dotSize,
    height: SIZES.dotSize,
    borderRadius: 2,
  },
  liveText: {
    fontSize: SIZES.fontSize,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  viewerCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: SIZES.paddingVertical,
    borderRadius: SIZES.borderRadius,
    gap: 3,
   
  },
  viewerCountText: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
  },
});

export default memo(LiveIndicator);