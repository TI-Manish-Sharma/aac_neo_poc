// hooks/useAnimations.ts
import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface AnimationOptions {
    fadeInitial?: number;
    scaleInitial?: number;
    headerInitial?: number;
    bannerInitial?: number;
    autoStart?: boolean;
    durations?: {
        fade?: number;
        scale?: number;
        header?: number;
        banner?: number;
    };
}

export function useAnimations(options: AnimationOptions = {}) {
    const {
        fadeInitial = 0,
        scaleInitial = 0.95,
        headerInitial = 0,
        bannerInitial = 0,
        autoStart = true,
        durations = {
            fade: 800,
            scale: 500,
            header: 600,
            banner: 700
        }
    } = options;

    // Create animation values
    const fadeAnim = useRef(new Animated.Value(fadeInitial)).current;
    const scaleAnim = useRef(new Animated.Value(scaleInitial)).current;
    const headerAnim = useRef(new Animated.Value(headerInitial)).current;
    const bannerAnim = useRef(new Animated.Value(bannerInitial)).current;

    // Function to start animations
    const startAnimations = () => {
        // Create animations
        const animations = [
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: durations.fade,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: durations.scale,
                useNativeDriver: true,
            }),
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: durations.header,
                useNativeDriver: true,
            })
        ];

        // Only add banner animation if it's being used
        if (durations.banner) {
            animations.push(
                Animated.timing(bannerAnim, {
                    toValue: 1,
                    duration: durations.banner,
                    useNativeDriver: true,
                })
            );
        }

        // Start all animations in parallel
        Animated.parallel(animations).start();
    };

    // Reset animations to initial values
    const resetAnimations = () => {
        fadeAnim.setValue(fadeInitial);
        scaleAnim.setValue(scaleInitial);
        headerAnim.setValue(headerInitial);
        bannerAnim.setValue(bannerInitial);
    };

    // Auto-start animations when component mounts
    useEffect(() => {
        if (autoStart) {
            startAnimations();
        }

        return () => {
            // Optional cleanup if needed
        };
    }, []);

    return {
        fadeAnim,
        scaleAnim,
        headerAnim,
        bannerAnim,
        startAnimations,
        resetAnimations
    };
}

// Helper functions for common animation styles
export function getHeaderAnimatedStyle(headerAnim: Animated.Value) {
    return {
        opacity: headerAnim,
        transform: [{
            translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
            })
        }]
    };
}

export function getBannerAnimatedStyle(bannerAnim: Animated.Value) {
    return {
        opacity: bannerAnim,
        transform: [{ scale: bannerAnim }]
    };
}

export function getContentAnimatedStyle(fadeAnim: Animated.Value, scaleAnim: Animated.Value) {
    return {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
    };
}

export function getFooterAnimatedStyle(fadeAnim: Animated.Value) {
    return {
        opacity: fadeAnim,
        transform: [{
            translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0]
            })
        }]
    };
}