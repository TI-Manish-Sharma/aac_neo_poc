import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnimations } from '@/hooks/useAnimations';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const getResponsiveSizes = () => {
    const calculatedIconSize = Math.min(Math.max(width * 0.06, 24), 32);
    const calculatedFontSize = Math.min(Math.max(width * 0.035, 12), 16);
    return { calculatedIconSize, calculatedFontSize };
};

export type IconFamily = 'FontAwesome' | 'MaterialIcons' | 'MaterialCommunityIcons';

interface SquareButtonProps {
    screen: string;
    title: string;
    iconFamily?: IconFamily;
    icon: string;
    isPressed?: boolean;
    onPressIn?: (screen: string) => void;
    onPressOut?: () => void;
    onPress?: (screen: string) => void;
    fadeAnim?: Animated.Value;
    scaleAnim?: Animated.Value;
    iconSize?: number;
    fontSize?: number;
    wrapperWidth?: `${number}%`;
    isEmpty?: boolean; // New prop to indicate if this is an empty placeholder
}

export const SquareButton: React.FC<SquareButtonProps> = ({
    screen,
    title,
    icon,
    iconFamily,
    isPressed,
    onPressIn,
    onPressOut,
    onPress,
    fadeAnim,
    scaleAnim,
    iconSize,
    fontSize,
    wrapperWidth = '48%',
    isEmpty = false
}) => {
    const { fadeAnimation, scaleAnimation } = useAnimations();

    const { calculatedIconSize, calculatedFontSize } = getResponsiveSizes();

    // If this is an empty placeholder, render an invisible button (maintaining the layout)
    if (isEmpty || screen === 'EmptyPlaceholder' || title === '') {
        return (
            <Animated.View
                style={[
                    styles.buttonWrapper,
                    {
                        width: wrapperWidth,
                        opacity: 0, // Make it invisible
                    },
                ]}
            >
                <View style={[styles.squareButton, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]}>
                    <View style={styles.squareButtonGradient} />
                </View>
            </Animated.View>
        );
    }

    // Render the appropriate icon based on the iconFamily
    const renderIcon = () => {
        const iconProps = {
            size: iconSize || calculatedIconSize,
            color: isPressed ? '#FFFFFF' : '#00D2E6',
        };

        switch (iconFamily) {
            case 'MaterialIcons':
                return <MaterialIcons name={icon as keyof typeof MaterialIcons['glyphMap']} {...iconProps} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons['glyphMap']} {...iconProps} />;
            default:
                return <FontAwesome name={icon as keyof typeof FontAwesome['glyphMap']} {...iconProps} />;
        }
    };

    return (
        <Animated.View
            style={[
                styles.buttonWrapper,
                {
                    width: wrapperWidth,
                    opacity: fadeAnim || fadeAnimation,
                    transform: [{ scale: scaleAnim || scaleAnimation }],
                },
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.squareButton,
                    isPressed && styles.activeButton,
                ]}
                onPress={() => onPress?.(screen)}
                onPressIn={() => onPressIn?.(screen)}
                onPressOut={onPressOut}
            >
                <LinearGradient
                    colors={isPressed ? ['#00D2E6', '#0088cc'] : ['#ffffff', '#f7f7f7']}
                    style={styles.squareButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.squareIconContainer}>
                        {renderIcon()}
                    </View>
                    <Text
                        style={[
                            styles.squareButtonText,
                            { fontSize: fontSize || calculatedFontSize },
                            isPressed && styles.activeButtonText,
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        aspectRatio: 1,
        marginBottom: height * 0.02,
    },
    squareButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    squareButtonGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Math.min(width * 0.03, 16),
    },
    activeButton: {
        borderColor: '#00D2E6',
    },
    squareIconContainer: {
        width: '50%',
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    squareButtonText: {
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    activeButtonText: {
        color: '#FFFFFF',
    },
});