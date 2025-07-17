import React, { useRef, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    withDelay,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface SeekButtonsProps {
    onSeekBackward?: (seconds: number) => void;
    onSeekForward?: (seconds: number) => void;
    size?: number;
    color?: string;
    seekSeconds?: number;
    type?: 'backward' | 'forward';
}

export const SeekButtons: React.FC<SeekButtonsProps> = ({
    onSeekBackward,
    onSeekForward = () => {},
    size = 50,
    color = '#fff',
    seekSeconds = 10,
    type = 'backward',
}) => {
    const backwardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const backwardCountRef = useRef(0);
    const [backwardDisplay, setBackwardDisplay] = useState(0);

    const forwardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const forwardCountRef = useRef(0);
    const [forwardDisplay, setForwardDisplay] = useState(0);

    const backwardScale = useSharedValue(1);
    const backwardTextOpacity = useSharedValue(0);
    const backwardTextTranslateY = useSharedValue(0);

    const forwardScale = useSharedValue(1);
    const forwardTextOpacity = useSharedValue(0);
    const forwardTextTranslateY = useSharedValue(0);

    const debouncedSeek = useCallback((event: 'backward' | 'forward') => {
        const isBackward = event === 'backward';
        const timeoutRef = isBackward ? backwardTimeoutRef : forwardTimeoutRef;
        const countRef = isBackward ? backwardCountRef : forwardCountRef;
        const setDisplay = isBackward ? setBackwardDisplay : setForwardDisplay;
        const textOpacity = isBackward ? backwardTextOpacity : forwardTextOpacity;
        const textTranslateY = isBackward ? backwardTextTranslateY : forwardTextTranslateY;
        const onSeek = isBackward ? onSeekBackward : onSeekForward;
        if (!onSeek) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        countRef.current += 1;
        const totalSeek = countRef.current * seekSeconds;
        setDisplay(totalSeek);

        textOpacity.value = 1;
        textTranslateY.value = withSpring(-20, { damping: 15, stiffness: 200 });

        timeoutRef.current = setTimeout(() => {
            onSeek(totalSeek);
            countRef.current = 0;

            textOpacity.value = withTiming(0, { duration: 300 });
            textTranslateY.value = withDelay(300, withTiming(0, { duration: 1 }));
        }, 500);
    }, [onSeekBackward, onSeekForward, seekSeconds]);

    const handleBackwardPress = () => {
        backwardScale.value = withSequence(
            withSpring(0.85, { damping: 15, stiffness: 400 }),
            withSpring(1, { damping: 15, stiffness: 400 })
        );
        debouncedSeek('backward');
    };

    const handleForwardPress = () => {
        forwardScale.value = withSequence(
            withSpring(0.85, { damping: 15, stiffness: 400 }),
            withSpring(1, { damping: 15, stiffness: 400 })
        );
        debouncedSeek('forward');
    };

    const backwardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: backwardScale.value }],
    }));
    const backwardTextAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backwardTextOpacity.value,
        transform: [{ translateY: backwardTextTranslateY.value }],
    }));

    const forwardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: forwardScale.value }],
    }));
    const forwardTextAnimatedStyle = useAnimatedStyle(() => ({
        opacity: forwardTextOpacity.value,
        transform: [{ translateY: forwardTextTranslateY.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Backward Button */}
            {type === 'backward' && (
                <View style={[styles.buttonContainer, { right: 120}]}>
                    <Animated.View style={[styles.textContainer, backwardTextAnimatedStyle]}>
                        <Text style={[styles.secondsText, { color }]}>-{backwardDisplay}s</Text>
                    </Animated.View>
                    <AnimatedTouchableOpacity
                        style={[styles.button, { width: size, height: size, borderRadius: size / 2 }, backwardAnimatedStyle]}
                        onPress={handleBackwardPress}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="replay-10" size={size * 0.6} color={color} />
                    </AnimatedTouchableOpacity>
                </View>
            )}

            {/* Forward Button */}
            {type === 'forward' && (
                <View style={[styles.buttonContainer, { left: 120 }]}>
                    <Animated.View style={[styles.textContainer, forwardTextAnimatedStyle]}>
                        <Text style={[styles.secondsText, { color }]}>+{forwardDisplay}s</Text>
                    </Animated.View>
                    <AnimatedTouchableOpacity
                        style={[styles.button, { width: size, height: size, borderRadius: size / 2 }, forwardAnimatedStyle]}
                        onPress={handleForwardPress}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="forward-10" size={size * 0.6} color={color} />
                    </AnimatedTouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: '15%',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 40,
    },
    secondsText: {
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});