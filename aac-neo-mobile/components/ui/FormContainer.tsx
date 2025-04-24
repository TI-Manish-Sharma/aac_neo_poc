// components/ui/FormContainer.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Animated,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { useTabVisibility } from '@/context/TabVisibilityContext';

const { width } = Dimensions.get('window');

interface FormContainerProps {
    children: ReactNode;
    fadeAnim?: Animated.Value; // Optional animation value from parent
    scaleAnim?: Animated.Value; // Optional animation value from parent
    contentContainerStyle?: object; // Additional styling for content container
    onKeyboardVisibilityChange?: (visible: boolean) => void; // Optional callback for keyboard visibility changes
}

export function FormContainer({
    children,
    fadeAnim: externalFadeAnim,
    scaleAnim: externalScaleAnim,
    contentContainerStyle,
    onKeyboardVisibilityChange
}: FormContainerProps) {
    const { setTabBarVisible } = useTabVisibility();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Create animation values if not provided
    const internalFadeAnim = React.useRef(new Animated.Value(0)).current;
    const internalScaleAnim = React.useRef(new Animated.Value(0.95)).current;

    // Use either the externally provided or internal animation values
    const fadeAnim = externalFadeAnim || internalFadeAnim;
    const scaleAnim = externalScaleAnim || internalScaleAnim;

    // Handle keyboard visibility
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
                setTabBarVisible(false); // Hide tabs
                onKeyboardVisibilityChange?.(true);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setTabBarVisible(true); // Show tabs
                onKeyboardVisibilityChange?.(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            setTabBarVisible(true);
        };
    }, [setTabBarVisible, onKeyboardVisibilityChange]);

    // Initial animations if using internal animation values
    useEffect(() => {
        if (!externalFadeAnim && !externalScaleAnim) {
            Animated.parallel([
                Animated.timing(internalFadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(internalScaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [externalFadeAnim, externalScaleAnim, internalFadeAnim, internalScaleAnim]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.scrollContainer,
                    {
                        paddingTop: keyboardVisible ? 10 : 20,
                        paddingBottom: keyboardVisible ? 20 : 80
                    },
                    contentContainerStyle
                ]}
            >
                <Animated.View
                    style={[
                        styles.formCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        }
                    ]}
                >
                    {children}
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Export keyboard visibility as a separate hook that can be used elsewhere
export function useKeyboardVisibility() {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return isKeyboardVisible;
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: width * 0.04,
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});