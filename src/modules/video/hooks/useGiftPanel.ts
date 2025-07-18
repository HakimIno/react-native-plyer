import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export const useGiftPanel = (isGiftVisible: boolean) => {
    const panelHeight = useSharedValue(0);

    useEffect(() => {
        panelHeight.value = withTiming(isGiftVisible ? Dimensions.get('window').height : 0, { duration: 300 });
    }, [isGiftVisible, panelHeight]);

    const animatedGiftPanelStyle = useAnimatedStyle(() => {
        return {
            width: '100%',
            height: panelHeight.value,
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 9999,
            borderRadius: 10,
            backgroundColor: '#1a1a1a',
        };
    });

    return {
        animatedGiftPanelStyle,
    };
}; 