import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, View, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type InputVariant = 'default' | 'outlined' | 'filled' | 'underline';
type InputSize = 'small' | 'medium' | 'large';

interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    variant?: InputVariant;
    size?: InputSize;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
    returnKeyType?: 'done' | 'next' | 'previous' | 'search' | 'send';
    editable?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    error?: boolean;
    disabled?: boolean;
    style?: any;
    label?: string;
    secureTextEntry?: boolean;
    onSubmitEditing?: () => void;
}

const Input = ({
    placeholder,
    value,
    onChangeText,
    variant = 'default',
    size = 'medium',
    autoCapitalize = 'none',
    autoCorrect = false,
    keyboardType = 'default',
    returnKeyType = 'done',
    editable = true,
    multiline = false,
    numberOfLines = 1,
    error = false,
    disabled = false,
    style,
    label,
    secureTextEntry = false,
    onSubmitEditing,
}: InputProps) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const animatedBorderWidth = useRef(new Animated.Value(0)).current;
    const animatedLabelValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        
        // Simple label animation
        Animated.timing(animatedLabelValue, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start();

        // Subtle border animation
        Animated.timing(animatedBorderWidth, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        
        if (!value) {
            Animated.timing(animatedLabelValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }

        Animated.timing(animatedBorderWidth, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const sizeStyles = {
        small: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontSize: 14,
            minHeight: multiline ? numberOfLines * 18 + 20 : 40,
        },
        medium: {
            paddingHorizontal: 20,
            paddingVertical: 14,
            fontSize: 16,
            minHeight: multiline ? numberOfLines * 20 + 28 : 52,
        },
        large: {
            paddingHorizontal: 24,
            paddingVertical: 18,
            fontSize: 18,
            minHeight: multiline ? numberOfLines * 22 + 36 : 64,
        },
    };

    const getVariantStyles = () => {
        const baseColors = {
            background: theme.colors.surface || '#ffffff',
            border: theme.colors.border || '#e5e7eb',
            borderFocus: theme.colors.primary || '#3b82f6',
            text: theme.colors.text.primary || '#111827',
            placeholder: theme.colors.text.secondary || '#6b7280',
        };

        if (error) {
            baseColors.border = theme.colors.error || '#ef4444';
            baseColors.borderFocus = theme.colors.error || '#ef4444';
        }

        if (disabled) {
            baseColors.background = theme.colors.disabled || '#f9fafb';
            baseColors.text = theme.colors.text.disabled || '#9ca3af';
        }

        switch (variant) {
            case 'outlined':
                return {
                    borderWidth: 1,
                    borderColor: isFocused ? baseColors.borderFocus : baseColors.border,
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                };

            case 'filled':
                return {
                    borderWidth: 0,
                    backgroundColor: baseColors.background,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                };

            case 'underline':
                return {
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    borderRadius: 0,
                    paddingHorizontal: 0,
                    paddingTop: 20,
                };

            default:
                return {
                    borderWidth: 1,
                    borderColor: isFocused ? baseColors.borderFocus : baseColors.border,
                    backgroundColor: baseColors.background,
                    borderRadius: 12,
                };
        }
    };

    const variantStyles = getVariantStyles();

    // Minimal label animation
    const labelStyle = {
        position: 'absolute' as const,
        left: 0,
        color: isFocused
            ? (error ? theme.colors.error || '#ef4444' : theme.colors.primary || '#3b82f6')
            : theme.colors.text.secondary || '#6b7280',
        fontSize: animatedLabelValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        top: animatedLabelValue.interpolate({
            inputRange: [0, 1],
            outputRange: [sizeStyles[size].paddingVertical, 2],
        }),
        fontWeight: '500' as const,
        opacity: animatedLabelValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
        }),
        fontFamily: 'Anuphan-Thai-400',
    };

    if (variant === 'underline') {
        return (
            <View style={[styles.underlineContainer, style]}>
                {(label || placeholder) && (isFocused || value) && (
                    <Animated.Text style={labelStyle}>
                        {label || placeholder}
                    </Animated.Text>
                )}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[
                            styles.base,
                            sizeStyles[size],
                            variantStyles,
                            {
                                color: disabled
                                    ? theme.colors.text.disabled || '#9ca3af'
                                    : error ? theme.colors.error || '#ef4444' : theme.colors.text.primary || '#111827',
                                paddingRight: secureTextEntry ? 50 : sizeStyles[size].paddingHorizontal,
                            },
                        ]}
                        placeholder={!isFocused && !value ? (label || placeholder) : ''}
                        placeholderTextColor={theme.colors.text.secondary || '#6b7280'}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        autoCapitalize={autoCapitalize}
                        autoCorrect={autoCorrect}
                        keyboardType={keyboardType}
                        returnKeyType={returnKeyType}
                        editable={editable && !disabled}
                        multiline={multiline}
                        numberOfLines={multiline ? numberOfLines : 1}
                        textAlignVertical={multiline ? 'top' : 'center'}
                        secureTextEntry={secureTextEntry && !showPassword}
                        onSubmitEditing={onSubmitEditing}
                    />
                    {secureTextEntry && (
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={togglePasswordVisibility}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color={theme.colors.text.secondary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={[styles.underlineBase, { backgroundColor: error ? theme.colors.error || '#ef4444' : theme.colors.border || '#e5e7eb' }]} />
                <Animated.View
                    style={[
                        styles.underlineBorder,
                        {
                            backgroundColor: error ? theme.colors.error || '#ef4444' : theme.colors.primary || '#3b82f6',
                            transform: [{
                                scaleX: error ? 1 : animatedBorderWidth,
                            }],
                        },
                    ]}
                />
            </View>
        );
    }

    return (
        <View style={styles.inputContainer}>
            {(label || placeholder) && (isFocused || value) && (
                <Animated.Text style={[labelStyle, { left: 16 }]}>
                    {label || placeholder}
                </Animated.Text>
            )}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[
                        styles.base,
                        sizeStyles[size],
                        variantStyles,
                        {
                            color: disabled
                                ? theme.colors.text.disabled || '#9ca3af'
                                : theme.colors.text.primary || '#111827',
                            paddingTop: (label || placeholder) && (isFocused || value) ? 24 : sizeStyles[size].paddingVertical,
                            paddingRight: secureTextEntry ? 50 : sizeStyles[size].paddingHorizontal,
                        },
                        style,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.text.secondary || '#6b7280'}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    editable={editable && !disabled}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : 1}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    secureTextEntry={secureTextEntry && !showPassword}
                    onSubmitEditing={onSubmitEditing}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color={theme.colors.text.secondary || '#6b7280'}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        letterSpacing: 0.3,
        fontFamily: 'Anuphan-Thai-400'
    },
    inputContainer: {
        position: 'relative',
    },
    inputWrapper: {
        position: 'relative',
    },
    underlineContainer: {
        position: 'relative',
        paddingTop: 10,
    },
    underlineBase: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        height: 1,
    },
    underlineBorder: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        height: 1.5,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -10 }],
        padding: 4,
    },
});

export default Input;