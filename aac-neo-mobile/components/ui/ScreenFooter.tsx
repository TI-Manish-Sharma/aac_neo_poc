// components/BatchScreenFooter.tsx
import React from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ScreenFooterProps {
    text: string;
    fadeAnim?: Animated.Value; // Optional animation value from parent
    absolutePosition?: boolean; // Whether footer should be absolutely positioned at bottom
}

export function ScreenFooter({
    text,
    fadeAnim,
    absolutePosition = true
}: ScreenFooterProps) {
    const colorScheme = useColorScheme();

    // Default animation if not provided by parent
    const defaultFadeAnim = React.useMemo(() => new Animated.Value(1), []);
    const animValue = fadeAnim || defaultFadeAnim;

    return (
        <Animated.View
            style={[
                styles.enhancedFooterContainer,
                absolutePosition && styles.absolutePositioned,
                fadeAnim && {
                    opacity: animValue,
                    transform: [{
                        translateY: animValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0]
                        })
                    }]
                }
            ]}
        >
            <LinearGradient
                colors={colorScheme === 'dark' ?
                    ['rgba(0,40,50,1)', 'rgba(0,40,50,1)'] :
                    ['rgba(230,247,255,1)', 'rgba(204,242,255,1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.enhancedFooterGradient}
            >
                <View style={styles.footerContent}>
                    <Text style={styles.footerText}>
                        {text}
                    </Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    enhancedFooterContainer: {
        width: '100%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        zIndex: 5,
    },
    absolutePositioned: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    enhancedFooterGradient: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: '#00A3B4',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});