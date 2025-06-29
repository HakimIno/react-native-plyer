import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface OptionsButtonProps {
    isOptions: boolean;
    onPress: () => void;
    size?: number;
    color?: string;
}

const OptionsButton: React.FC<OptionsButtonProps> = ({ size, color, onPress, isOptions }) => {

    const scale = useSharedValue(1);

    const handlePress = () => {
        scale.value = withSequence(
            withSpring(0.8, { damping: 15, stiffness: 300 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
        onPress?.();
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
            activeOpacity={0.7}
        >
            <Ionicons name="settings-outline" size={24} color="white" />
        </AnimatedTouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
});

export default OptionsButton;   