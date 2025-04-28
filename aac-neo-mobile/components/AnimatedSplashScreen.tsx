// AnimatedSplashScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Image, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';

// Prevent auto-hiding of the splash screen
SplashScreen.preventAutoHideAsync();

// Get screen dimensions
const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
    children: React.ReactNode;
    image?: any; // Replace 'any' with the appropriate type for the image if known
    lottieSource?: any; // Replace 'any' with the appropriate type for the lottie source if known
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ children, image, lottieSource }) => {
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;

    // Background opacity for the transition
    const backgroundFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Prepare background, then hide the native splash screen
        async function prepare() {
            try {
                // Wait for your assets/resources to load here
                await SplashScreen.hideAsync();

                // Start the entrance animation for your custom splash
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateYAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    })
                ]).start();

                // Set app as ready after a slight delay to show animation
                setTimeout(() => {
                    setAppReady(true);
                }, 2200);
            } catch (e) {
                console.warn(e);
            }
        }

        prepare();
    }, []);

    // Triggered when app is ready to show
    useEffect(() => {
        if (isAppReady) {
            Animated.timing(backgroundFade, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
                delay: 300,
            }).start(() => {
                setSplashAnimationComplete(true);
            });
        }
    }, [isAppReady, backgroundFade]);

    // Function to be triggered when Lottie animation is done
    const onLottieFinish = () => {
        // We could trigger additional animations here
    };

    if (!isSplashAnimationComplete) {
        return (
            <View style={styles.container}>
                {isAppReady && children}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        StyleSheet.absoluteFill,
                        styles.splashBackground,
                        { opacity: backgroundFade }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { scale: scaleAnim },
                                    { translateY: translateYAnim }
                                ]
                            }
                        ]}
                    >
                        {lottieSource ? (
                            <LottieView
                                source={lottieSource}
                                autoPlay
                                loop={false}
                                style={styles.lottie}
                                onAnimationFinish={onLottieFinish}
                                resizeMode="contain"
                            />
                        ) : (
                            <Image
                                source={image}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        )}
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    splashBackground: {
        flex: 1,
        backgroundColor: '#121212', // Dark background for dramatic effect, adjust to your brand color
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.6,
        height: width * 0.6,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
});