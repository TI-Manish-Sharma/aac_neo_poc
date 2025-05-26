// components/ui/EnhancedFooter.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Props {
    colorScheme: 'dark' | 'light';
}

export const TwoRowFooter: React.FC<Props> = ({ colorScheme }) => {
    const [footerAnim] = useState(new Animated.Value(0));
    const [poweredByAnim] = useState(new Animated.Value(0));
    const [shimmerAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(footerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(poweredByAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.footerWrapper}>
            <Animated.View
                style={[
                    styles.enhancedFooterContainer,
                    {
                        opacity: footerAnim,
                        transform: [{
                            translateY: footerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0]
                            })
                        }]
                    }
                ]}
            >
                <LinearGradient
                    colors={colorScheme === 'dark'
                        ? ['rgba(0,40,60,0.95)', 'rgba(0,30,45,0.85)']
                        : ['rgba(235,250,255,0.95)', 'rgba(210,240,250,0.85)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.enhancedFooterGradient}
                >
                    <Animated.View
                        style={[
                            styles.poweredByContainer,
                            {
                                opacity: poweredByAnim,
                                transform: [{
                                    scale: poweredByAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.9, 1]
                                    })
                                }]
                            }
                        ]}
                    >
                        <View style={styles.poweredByWrapper}>
                            <Text style={styles.poweredByText}>Product by:</Text>
                            <View style={styles.poweredByLogoContainer}>
                                <Image
                                    source={require('@/assets/images/aac-institute.png')}
                                    style={styles.poweredByImage}
                                    resizeMode="contain"
                                />
                                <Animated.View
                                    style={[
                                        styles.shimmerOverlay,
                                        {
                                            opacity: shimmerAnim.interpolate({
                                                inputRange: [0, 0.5, 1],
                                                outputRange: [0, 0.3, 0]
                                            }),
                                            transform: [
                                                {
                                                    translateX: shimmerAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [-80, 80]
                                                    })
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    </Animated.View>

                    <View style={styles.footerContentContainer}>
                        <View style={styles.footerContent}>
                            <View style={styles.footerLeft}>
                                <Text style={styles.versionText}>v1.0.0</Text>
                            </View>
                            <View style={styles.verticalDivider} />
                            <View style={styles.footerRight}>
                                <Text style={styles.companyText}>Managed by </Text>
                                <Text style={styles.companyNameText}>Technizer Edge Pvt. Ltd.</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: width,
        alignItems: 'center',
        zIndex: 10,
    },
    enhancedFooterContainer: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    enhancedFooterGradient: {
        paddingTop: 6,
        paddingBottom: 8,
        paddingHorizontal: 20,
    },
    poweredByContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    poweredByWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 210, 230, 0.2)',
    },
    poweredByText: {
        color: '#555555',
        fontSize: 12,
        fontWeight: '600',
        marginRight: 8,
        letterSpacing: 0.3,
    },
    poweredByLogoContainer: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 8,
    },
    poweredByImage: {
        height: 28,
        width: 85,
    },
    shimmerOverlay: {
        position: 'absolute',
        top: -10,
        left: -20,
        width: 40,
        height: 50,
        backgroundColor: 'white',
        transform: [{ rotate: '30deg' }],
    },
    footerContentContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 210, 230, 0.15)',
        paddingTop: 5,
        marginTop: 0,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerLeft: {
        flex: 1,
        alignItems: 'center',
    },
    verticalDivider: {
        height: 16,
        width: 1,
        backgroundColor: 'rgba(0, 210, 230, 0.3)',
        marginHorizontal: 10,
    },
    footerRight: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    versionText: {
        color: '#555555',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    companyText: {
        color: '#666666',
        fontSize: 11,
        fontWeight: '400',
    },
    companyNameText: {
        color: '#00A3B4',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});
