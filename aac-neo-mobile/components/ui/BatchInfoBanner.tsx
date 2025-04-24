// components/ui/BatchInfoBanner.tsx
import React from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BatchInfoBannerProps {
    batchNumber: string;
    mouldNumber: string;
    bannerAnim?: Animated.Value; // Optional animation value
}

export function BatchInfoBanner({
    batchNumber,
    mouldNumber,
    bannerAnim
}: BatchInfoBannerProps) {
    // Default animation if not provided
    const defaultAnim = React.useMemo(() => new Animated.Value(1), []);
    const animValue = bannerAnim || defaultAnim;

    return (
        <Animated.View
            style={[
                styles.batchInfoBannerContainer,
                bannerAnim && {
                    opacity: animValue,
                    transform: [{ scale: animValue }],
                }
            ]}
        >
            <LinearGradient
                colors={['#00D2E6', '#0088cc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.batchInfoBanner}
            >
                <View style={styles.batchInfoItem}>
                    <Text style={styles.batchInfoLabel}>Batch Number</Text>
                    <Text style={styles.batchInfoValue}>{batchNumber}</Text>
                </View>
                <View style={styles.batchInfoItem}>
                    <Text style={styles.batchInfoLabel}>Mould Number</Text>
                    <Text style={styles.batchInfoValue}>{mouldNumber}</Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    batchInfoBannerContainer: {
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    batchInfoBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    batchInfoItem: {
        flex: 1,
    },
    batchInfoLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    batchInfoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 3,
    },
});