// import React, { ReactElement, PropsWithChildren } from 'react';
// import { StyleSheet, View, StatusBar } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withTiming,
//     Easing,
// } from 'react-native-reanimated';

// import { ThemedView } from '@/components/ThemedView';
// import { useColorScheme } from '@/hooks/useColorScheme';

// const HEADER_HEIGHT = 220; // Adjusted for logo height

// type StaticHeaderViewProps = PropsWithChildren<{
//     headerImage?: ReactElement; // Made optional
//     headerBackgroundColor: { dark: string; light: string };
//     disableAnimation?: boolean;
//     showHeader?: boolean; // Optional flag to control header visibility
// }>;

// export default function StaticHeaderView({
//     children,
//     headerImage,
//     headerBackgroundColor,
//     disableAnimation = false,
//     showHeader = true, // Default to showing header
// }: StaticHeaderViewProps) {
//     const colorScheme = useColorScheme() ?? 'light';
//     const headerScale = useSharedValue(disableAnimation ? 1 : 0.95);
//     const contentOpacity = useSharedValue(disableAnimation ? 1 : 0);

//     // When component mounts, animate the header scale and content opacity
//     React.useEffect(() => {
//         if (!disableAnimation) {
//             headerScale.value = withTiming(1, {
//                 duration: 600,
//                 easing: Easing.out(Easing.cubic)
//             });

//             contentOpacity.value = withTiming(1, {
//                 duration: 800,
//                 easing: Easing.out(Easing.cubic)
//             });
//         }
//     }, []);

//     const headerAnimatedStyle = useAnimatedStyle(() => {
//         return {
//             transform: [{ scale: headerScale.value }],
//         };
//     });

//     const contentAnimatedStyle = useAnimatedStyle(() => {
//         return {
//             opacity: contentOpacity.value,
//         };
//     });

//     const backgroundColor = headerBackgroundColor[colorScheme];

//     return (
//         <SafeAreaView
//             style={[
//                 styles.container,
//                 { backgroundColor }
//             ]}
//             edges={['right', 'left']} // Only apply safe area to left and right, not top
//         >
//             <StatusBar
//                 backgroundColor={backgroundColor}
//                 barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
//             />
//             <View style={styles.mainContainer}>
//                 {showHeader && (
//                     <Animated.View
//                         style={[
//                             styles.header,
//                             { backgroundColor },
//                             headerAnimatedStyle,
//                         ]}>
//                         {headerImage}
//                     </Animated.View>
//                 )}
//                 <Animated.View
//                     style={[
//                         styles.content,
//                         contentAnimatedStyle,
//                         !showHeader && styles.noHeaderContent
//                     ]}>
//                     <ThemedView
//                         style={[
//                             styles.contentInner,
//                             { backgroundColor: backgroundColor }
//                         ]}>
//                         {children}
//                     </ThemedView>
//                 </Animated.View>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     mainContainer: {
//         flex: 1,
//     },
//     header: {
//         height: HEADER_HEIGHT,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//         overflow: 'hidden',
//     },
//     content: {
//         flex: 1,
//     },
//     noHeaderContent: {
//         paddingTop: 10, // Add some padding when there's no header
//     },
//     contentInner: {
//         flex: 1,
//         paddingHorizontal: 20,
//         paddingTop: 20,
//         paddingBottom: 10,
//     },
// });

import React, { ReactElement, PropsWithChildren } from 'react';
import { StyleSheet, View, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width, height } = Dimensions.get('window');
// Responsive header height based on device size
const HEADER_HEIGHT = Math.min(height * 0.22, 180); // 22% of screen height, max 180px

type StaticHeaderViewProps = PropsWithChildren<{
    headerImage?: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
    disableAnimation?: boolean;
    showHeader?: boolean;
}>;

export default function StaticHeaderView({
    children,
    headerImage,
    headerBackgroundColor,
    disableAnimation = false,
    showHeader = true,
}: StaticHeaderViewProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const headerScale = useSharedValue(disableAnimation ? 1 : 0.95);
    const contentOpacity = useSharedValue(disableAnimation ? 1 : 0);

    // When component mounts, animate the header scale and content opacity
    React.useEffect(() => {
        if (!disableAnimation) {
            headerScale.value = withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.cubic)
            });

            contentOpacity.value = withTiming(1, {
                duration: 800,
                easing: Easing.out(Easing.cubic)
            });
        }
    }, []);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: headerScale.value }],
        };
    });

    const contentAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: contentOpacity.value,
        };
    });

    const backgroundColor = headerBackgroundColor[colorScheme];

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor }
            ]}
            edges={['right', 'left']} // Only apply safe area to left and right, not top
        >
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
            />
            <View style={styles.mainContainer}>
                {showHeader && (
                    <Animated.View
                        style={[
                            styles.header,
                            { backgroundColor },
                            headerAnimatedStyle,
                        ]}>
                        {headerImage}
                    </Animated.View>
                )}
                <Animated.View
                    style={[
                        styles.content,
                        contentAnimatedStyle,
                        !showHeader && styles.noHeaderContent
                    ]}>
                    <ThemedView
                        style={[
                            styles.contentInner,
                            { backgroundColor: backgroundColor }
                        ]}>
                        {children}
                    </ThemedView>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
    },
    header: {
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
    noHeaderContent: {
        paddingTop: height * 0.01, // Responsive padding (1% of screen height)
    },
    contentInner: {
        flex: 1,
        paddingHorizontal: width * 0.04, // 4% of screen width
        paddingVertical: height * 0.01, // 1% of screen height
    },
});