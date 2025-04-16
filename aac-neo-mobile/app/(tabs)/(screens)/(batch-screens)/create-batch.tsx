import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    Platform,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormInput } from '@/components/ui/FormInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { batchFormSchema } from '@/schema/batch.schema';
import type { BatchFormData } from '@/types/batch.types';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { useBatch } from '@/context/BatchContext';
import { createNewBatch } from '@/utils/batch-helpers';

const { width, height } = Dimensions.get('window');

export default function CreateBatchScreen() {
    const { setTabBarVisible } = useTabVisibility();
    const { addBatch } = useBatch();
    const colorScheme = useColorScheme();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors } } = useForm<BatchFormData>({
        resolver: zodResolver(batchFormSchema),
        defaultValues: {
            batchNumber: '',
            mouldNumber: ''
        }
    });

    // Animation values for opacity and translation (can use native driver)
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];
    const headerAnim = useState(new Animated.Value(0))[0];

    // Detect keyboard visibility
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
                setTabBarVisible(false); // Hide tabs
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setTabBarVisible(true); // Show tabs
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            setTabBarVisible(true);
        };
    }, [setTabBarVisible]);

    // Initial animations
    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onSubmit = (data: BatchFormData) => {
        Keyboard.dismiss();

        try {
            // Create a new batch record using our helper function
            const newBatch = createNewBatch(data.batchNumber, data.mouldNumber);
            
            // Add to context
            addBatch(newBatch);
            
            console.log('Created new batch:', newBatch);

            // Navigate to batching form with success message
            Alert.alert(
                'Success',
                `Batch ${data.batchNumber} created successfully!`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.push({
                            pathname: '/(tabs)/(screens)/(batch-screens)/batching-form',
                            params: {
                                batchNumber: data.batchNumber,
                                mouldNumber: data.mouldNumber
                            }
                        })
                    }
                ]
            );
        } catch (error) {
            console.error('Error creating batch:', error);
            Alert.alert(
                'Error',
                'There was a problem creating the batch. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const goBack = () => {
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <Animated.View
                    style={[
                        styles.headerContainer,
                        {
                            opacity: headerAnim,
                            transform: [{
                                translateY: headerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-20, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <LinearGradient
                        colors={colorScheme === 'dark' ?
                            ['#004052', '#002535'] :
                            ['#e6f7ff', '#ccf2ff']}
                        style={styles.headerGradient}
                    >
                        {/* Back button on left side */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={goBack}
                        >
                            <FontAwesome
                                name="chevron-left"
                                size={18}
                                color={Colors[colorScheme ?? 'light'].tint}
                            />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>

                        {/* Right-aligned header content */}
                        <View style={styles.headerContent}>
                            <View style={styles.headerTextContainer}>
                                <ThemedText type="subtitle" style={styles.headerSubtitle}>
                                    Batch Management
                                </ThemedText>
                                <ThemedText type="title" style={styles.headerTitle}>
                                    Create New Batch
                                </ThemedText>
                            </View>
                            <FontAwesome
                                name="plus-square"
                                size={28}
                                color={Colors[colorScheme ?? 'light'].tint}
                                style={styles.headerIcon}
                            />
                        </View>

                        {/* Right-aligned divider */}
                        <View style={styles.headerDividerContainer}>
                            <View style={styles.headerDivider} />
                        </View>
                    </LinearGradient>
                </Animated.View>
            )}

            {/* Main content with KeyboardAvoidingView */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[
                        styles.scrollContainer,
                        {
                            paddingTop: keyboardVisible ? 10 : 20,
                            paddingBottom: keyboardVisible ? 20 : 80
                        }
                    ]}>
                    <Animated.View
                        style={[
                            styles.formCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            }
                        ]}
                    >
                        {/* Batch Number Field */}
                        <Controller
                            control={control}
                            name="batchNumber"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FormInput
                                    label="Batch Number"
                                    required
                                    icon="hashtag"
                                    placeholder="Enter batch number"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="characters"
                                    error={errors.batchNumber?.message}
                                />
                            )}
                        />

                        {/* Mould Number Field */}
                        <Controller
                            control={control}
                            name="mouldNumber"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FormInput
                                    label="Mould Number"
                                    required
                                    icon="cube"
                                    placeholder="Enter mould number"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="characters"
                                    error={errors.mouldNumber?.message}
                                />
                            )}
                        />
                    </Animated.View>

                    {/* Action Buttons */}
                    <Animated.View
                        style={[
                            styles.buttonContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    })
                                }]
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={goBack}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={handleSubmit(onSubmit)}
                        >
                            <LinearGradient
                                colors={['#00D2E6', '#0088cc']}
                                style={styles.createButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.createButtonText}>Create Batch</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <Animated.View
                    style={[
                        styles.enhancedFooterContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [10, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <LinearGradient
                        colors={colorScheme === 'dark' ?
                            ['rgba(0,40,50,0.8)', 'rgba(0,40,50,0.5)'] :
                            ['rgba(230,247,255,0.8)', 'rgba(204,242,255,0.5)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.enhancedFooterGradient}
                    >
                        <View style={styles.footerContent}>
                            <Text style={styles.footerText}>
                                Create a new batch to start tracking your progress
                            </Text>
                        </View>
                    </LinearGradient>
                </Animated.View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
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
    headerIcon: {
        // Icon styling if needed
    },
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
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: width * 0.04,
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        paddingVertical: 14,
        marginRight: 8,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
    },
    createButton: {
        flex: 1,
        marginLeft: 8,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    createButtonGradient: {
        width: '100%',
        paddingVertical: 14,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    enhancedFooterContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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