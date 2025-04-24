import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated
} from 'react-native';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

type IconFamily =
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'FontAwesome6'
    | 'Ionicons'
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'Entypo';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string; // name of the icon
    iconFamily?: IconFamily;
    iconSize?: number;
    onBack?: () => void;
    headerAnim?: Animated.Value;
    showBackButton?: boolean;
}

export function ScreenHeader({
    title,
    subtitle,
    icon,
    iconFamily = 'FontAwesome',
    iconSize = 28,
    onBack,
    headerAnim,
    showBackButton = true
}: ScreenHeaderProps) {
    const colorScheme = useColorScheme();
    const defaultAnim = React.useMemo(() => new Animated.Value(1), []);
    const animValue = headerAnim || defaultAnim;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const renderIcon = () => {
        if (!icon) return null;

        const iconProps = {
            name: icon as any,
            size: iconSize,
            color: Colors[colorScheme ?? 'light'].tint,
            style: styles.headerIcon
        };

        switch (iconFamily) {
            case 'FontAwesome5':
                return <FontAwesome5 {...iconProps} />;
            case 'FontAwesome6':
                return <FontAwesome6 {...iconProps} />;
            case 'Ionicons':
                return <Ionicons {...iconProps} />;
            case 'MaterialIcons':
                return <MaterialIcons {...iconProps} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons {...iconProps} />;
            case 'Entypo':
                return <Entypo {...iconProps} />;
            default:
                return <FontAwesome {...iconProps} />;
        }
    };

    return (
        <Animated.View
            style={[
                styles.headerContainer,
                {
                    opacity: animValue,
                    transform: [{
                        translateY: animValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0]
                        })
                    }]
                }
            ]}
        >
            <LinearGradient
                colors={colorScheme === 'dark'
                    ? ['#004052', '#002535']
                    : ['#e6f7ff', '#ccf2ff']}
                style={styles.headerGradient}
            >
                {showBackButton && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={18}
                            color={Colors[colorScheme ?? 'light'].tint}
                        />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.headerContent}>
                    <View style={styles.headerTextContainer}>
                        {subtitle && (
                            <ThemedText type="subtitle" style={styles.headerSubtitle}>
                                {subtitle}
                            </ThemedText>
                        )}
                        <ThemedText type="title" style={styles.headerTitle}>
                            {title}
                        </ThemedText>
                    </View>
                    {renderIcon()}
                </View>

                <View style={styles.headerDividerContainer}>
                    <View style={styles.headerDivider} />
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        zIndex: 10,
        marginBottom: 10,
    },
    headerGradient: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 16,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    backButtonText: {
        color: '#00D2E6',
        marginLeft: 5,
        fontWeight: '600',
        fontSize: 14,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: 80,
        paddingRight: 10,
    },
    headerTextContainer: {
        alignItems: 'flex-end',
        marginRight: 15,
    },
    headerIcon: {},
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    headerSubtitle: {
        fontSize: 14,
        opacity: 0.8,
        textAlign: 'right',
    },
    headerDividerContainer: {
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    headerDivider: {
        height: 2,
        width: '40%',
        backgroundColor: '#00D2E6',
        marginTop: 10,
        borderRadius: 2,
    },
});
