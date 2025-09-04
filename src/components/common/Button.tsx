import React, { useState, useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Animated,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AutoFontText from './AutoFontText';

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'ghost' | 'gradient' | 'glass';
type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';
type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    color?: ButtonColor;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    rounded?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    style?: any;
    textStyle?: any;
}

const Button = ({
    title,
    onPress,
    variant = 'filled',
    size = 'medium',
    color = 'primary',
    disabled = false,
    loading = false,
    fullWidth = false,
    rounded = false,
    leftIcon,
    rightIcon,
    style,
    textStyle,
}: ButtonProps) => {
    const { theme } = useTheme();
    const [isPressed, setIsPressed] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const colorMap = {
        primary: theme.colors.primary || '#4338ca',
        secondary: theme.colors.secondary || '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        error: theme.colors.error || '#ef4444',
        info: '#06b6d4',
        google: theme.colors.button.google || '#4285F4',
        apple: theme.colors.button.apple || '#000000',
        facebook: '#1877F2',
        twitter: '#1DA1F2',
        linkedin: '#0077B5',
        instagram: '#C13584',
        youtube: '#FF0000',
    };

    const sizeStyles = {
        small: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            fontSize: 14,
            minHeight: 40,
            iconSize: 16,
        },
        medium: {
            paddingHorizontal: 24,
            paddingVertical: 8,
            fontSize: 16,
            minHeight: 48,
            iconSize: 18,
        },
        large: {
            paddingHorizontal: 32,
            paddingVertical: 12,
            fontSize: 18,
            minHeight: 56,
            iconSize: 20,
        },
        xlarge: {
            paddingHorizontal: 40,
            paddingVertical: 16,
            fontSize: 20,
            minHeight: 60,
            iconSize: 22,
        },
    };

    const currentSize = sizeStyles[size];
    const currentColor = colorMap[color];

    const handlePressIn = () => {
        setIsPressed(true);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        setIsPressed(false);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const getVariantStyles = () => {
        const baseStyles = {
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            flexDirection: 'row' as const,
            borderRadius: rounded ? currentSize.minHeight / 2 : 12,
            minHeight: currentSize.minHeight,
            paddingHorizontal: currentSize.paddingHorizontal,
            paddingVertical: currentSize.paddingVertical,
        };

        switch (variant) {
            case 'filled':
                return {
                    ...baseStyles,
                    backgroundColor: disabled ? 'rgba(97, 0, 253, 0.3)' : currentColor,
                    shadowColor: currentColor,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: disabled ? 0 : 0.2,
                    shadowRadius: 8,
                    elevation: disabled ? 0 : 4,
                };

            case 'outlined':
                return {
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: disabled ? '#e5e7eb' : currentColor,
                };

            case 'text':
                return {
                    ...baseStyles,
                    backgroundColor: 'transparent',
                };

            case 'ghost':
                return {
                    ...baseStyles,
                    backgroundColor: disabled ? 'rgba(0,0,0,0.05)' : `${currentColor}15`,
                };

            case 'gradient':
                return {
                    ...baseStyles,
                    backgroundColor: disabled ? 'rgba(168, 114, 255, 0.05)' : currentColor,
                    shadowColor: currentColor,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: disabled ? 0 : 0.3,
                    shadowRadius: 12,
                    elevation: disabled ? 0 : 6,
                };

            case 'glass':
                return {
                    ...baseStyles,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 32,
                    elevation: 8,
                };

            default:
                return baseStyles;
        }
    };

    const getTextColor = () => {
        if (disabled) return 'rgba(255, 255, 255, 0.5)';

        switch (variant) {
            case 'filled':
            case 'gradient':
                return '#ffffff';
            case 'outlined':
            case 'text':
            case 'ghost':
                return currentColor;
            case 'glass':
                return theme.colors.text.primary || '#1f2937';
            default:
                return currentColor;
        }
    };

    const buttonStyles = getVariantStyles();
    const textColor = getTextColor();

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={disabled || loading ? undefined : onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                fullWidth && { width: '100%' },
                style,
            ]}
            disabled={disabled || loading}
        >
            <Animated.View
                style={[
                    buttonStyles,
                    fullWidth && { width: '100%' },
                    {
                        opacity: disabled ? 0.5 : opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={textColor}
                        style={{ marginRight: title ? 8 : 0 }}
                    />
                ) : leftIcon ? (
                    <View style={{ marginRight: 8 }}>
                        {leftIcon}
                    </View>
                ) : null}

                {title && !loading && (
                    <AutoFontText
                        typographyStyle='h1'
                        customWeight={700}
                        textColor={textColor}
                        style={[
                            styles.buttonText,
                            {
                                fontSize: currentSize.fontSize,
                                letterSpacing: 0.5,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </AutoFontText>
                )}

                {loading && title && (
                    <AutoFontText
                        typographyStyle='h1'
                        customWeight={700}
                        textColor={textColor}
                        style={[
                            styles.buttonText,
                            {
                                fontSize: currentSize.fontSize,
                                letterSpacing: 0.5,
                                opacity: 0.7,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </AutoFontText>
                )}

                {rightIcon && !loading && (
                    <View style={{ marginLeft: 8 }}>
                        {rightIcon}
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        textAlign: 'center' as const,
    },
});

export default Button;