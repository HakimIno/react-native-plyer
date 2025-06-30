import React, { useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface SeekButtonsProps {
    onSeekBackward: () => void;
    onSeekForward: () => void;
    size?: number;
    color?: string;
    seekSeconds?: number;
    type?: 'backward' | 'forward';
}

export const SeekButtons: React.FC<SeekButtonsProps> = ({
    onSeekBackward,
    onSeekForward,
    size = 45,
    color = '#fff',
    seekSeconds = 10,
    type = 'backward',
}) => {
    const backwardScale = useSharedValue(1);
    const forwardScale = useSharedValue(1);
    
    const backwardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const forwardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const backwardCountRef = useRef(0);
    const forwardCountRef = useRef(0);

    const debouncedBackward = useCallback(() => {
        if (backwardTimeoutRef.current) {
            clearTimeout(backwardTimeoutRef.current);
        }
        
        backwardCountRef.current += 1;
        
        backwardTimeoutRef.current = setTimeout(() => {
            for (let i = 0; i < backwardCountRef.current; i++) {
                onSeekBackward();
            }
            backwardCountRef.current = 0;
        }, 300); 
    }, [onSeekBackward]);

    const debouncedForward = useCallback(() => {
        if (forwardTimeoutRef.current) {
            clearTimeout(forwardTimeoutRef.current);
        }
        
        forwardCountRef.current += 1;
        
        forwardTimeoutRef.current = setTimeout(() => {
            for (let i = 0; i < forwardCountRef.current; i++) {
                onSeekForward();
            }
            forwardCountRef.current = 0;
        }, 300); 
    }, [onSeekForward]);

    const handleBackwardPress = () => {
        backwardScale.value = withSequence(
            withSpring(0.85, { duration: 80 }),
            withSpring(1, { duration: 80 })
        );
        debouncedBackward();
    };

    const handleForwardPress = () => {
        forwardScale.value = withSequence(
            withSpring(0.85, { duration: 80 }),
            withSpring(1, { duration: 80 })
        );
        debouncedForward();
    };

    const backwardAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: backwardScale.get() }],
        };
    });

    const forwardAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: forwardScale.get() }],
        };
    });

    return (
        <View style={styles.container}>
            {/* Backward Button */}
            {type === 'backward' ? (
                <AnimatedTouchableOpacity
                    style={[
                        styles.button,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        },
                        backwardAnimatedStyle,
                    ]}
                    onPress={handleBackwardPress}
                    activeOpacity={0.7}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <View style={styles.iconContainer}>
                        {/* <Ionicons
                            name="play-skip-back"
                            size={size * 0.4}
                            color={color}
                            style={styles.icon}
                        /> */}
                        <MaterialIcons name="replay-10" size={size * 0.5} color={color} style={styles.icon} />
                    </View>
                </AnimatedTouchableOpacity>
            ) : (
                <View style={styles.button} />
            )}

            {/* Forward Button */}
            {type === 'forward' ? (
                <AnimatedTouchableOpacity
                    style={[
                        styles.button,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        },
                        forwardAnimatedStyle,
                    ]}
                    onPress={handleForwardPress}
                    activeOpacity={0.7}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <View style={styles.iconContainer}>
                        {/* <Ionicons
                            name="play-skip-forward"
                            size={size * 0.4}
                            color={color}
                            style={styles.icon}
                        /> */}
                        <MaterialIcons name="forward-10" size={size * 0.5} color={color} style={styles.icon} />
                        {/* <Text style={[styles.secondsText, { color, fontSize: size * 0.2 }]}>
                            {seekSeconds}
                        </Text> */}
                    </View>
                </AnimatedTouchableOpacity>
            ) : (
                <View style={styles.button} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 25,
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    secondsText: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: -2,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
}); 