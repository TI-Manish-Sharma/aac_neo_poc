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
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormInput } from '@/components/ui/FormInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { batchIngredientSchema } from '@/schema/batch.schema';
import type { BatchIngredientFormData } from '@/types/batch.types';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { MaskedTimeInput } from '@/components/MaskedTimeInput';
import { TimePicker } from '@/components/TimePicker';

const { width, height } = Dimensions.get('window');

export default function BatchingFormScreen() {
    const params = useLocalSearchParams();
    const { setTabBarVisible } = useTabVisibility();
    const colorScheme = useColorScheme();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Get batch and mould number from URL params
    const batchNumber = params.batchNumber as string || 'NP';
    const mouldNumber = params.mouldNumber as string || 'NP';

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors } } = useForm<BatchIngredientFormData>({
        resolver: zodResolver(batchIngredientSchema),
        defaultValues: {
            freshSlurry: '',
            wasteSlurry: '',
            cement: '',
            lime: '',
            gypsum: '',
            aluminumPowder: '',
            dcPowder: '',
            water: '',
            soluOil: '',
            dischargeTemp: '',
            mixingTime: { hours: '', minutes: '' },  // New structure
            dischargeTime: ''
        }
    });

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];
    const headerAnim = useState(new Animated.Value(0))[0];
    const bannerAnim = useState(new Animated.Value(0))[0];

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
            Animated.timing(bannerAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onSubmit = (data: BatchIngredientFormData) => {
        Keyboard.dismiss();

        const formData = {
            batchNumber,
            mouldNumber,
            ingredients: {
                ...data,
                // Format the mixing time as a string
                mixingTimeFormatted: `${data.mixingTime.hours}:${data.mixingTime.minutes}`
            },
            timestamp: new Date().toISOString()
        };

        console.log('Submitting batch ingredient data:', formData);

        // Navigate back with success message
        Alert.alert(
            'Success',
            `Batch ${batchNumber} ingredients recorded successfully!`,
            [
                {
                    text: 'OK',
                    onPress: () => router.navigate('/(tabs)/(screens)/(batch-screens)/batch')
                }
            ]
        );
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
                                    Batch {batchNumber}
                                </ThemedText>
                                <ThemedText type="title" style={styles.headerTitle}>
                                    Ingredients
                                </ThemedText>
                            </View>
                            <FontAwesome
                                name="flask"
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

            {/* Batch Info Banner - only visible when keyboard is hidden */}
            {!keyboardVisible && (
                <Animated.View
                    style={[
                        styles.batchInfoBannerContainer,
                        {
                            opacity: bannerAnim,
                            transform: [{ scale: bannerAnim }],
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
            )}

            {/* Main content with KeyboardAwareScrollView */}
            {/* <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 100 : 20}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.scrollContainer,
                    {
                        paddingTop: keyboardVisible ? 10 : 20,
                        paddingBottom: keyboardVisible ? 20 : 80 // Adjust bottom padding based on keyboard
                    }
                ]}
                enableAutomaticScroll={true}> */}
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
                        <ThemedText type="subtitle" style={styles.formSectionTitle}>
                            Enter Ingredient Details
                        </ThemedText>

                        {/* Material Inputs Section */}
                        <View style={styles.formSection}>
                            <ThemedText type="defaultSemiBold" style={styles.formSectionSubtitle}>
                                Materials
                            </ThemedText>

                            <Controller
                                control={control}
                                name="freshSlurry"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Fresh Slurry (Kg)"
                                        required
                                        icon="tint"
                                        placeholder="Enter fresh slurry amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.freshSlurry?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="wasteSlurry"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Waste Slurry (Kg)"
                                        required
                                        icon="recycle"
                                        placeholder="Enter waste slurry amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.wasteSlurry?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="cement"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Cement (Kg)"
                                        required
                                        icon="industry"
                                        placeholder="Enter cement amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.cement?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="lime"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Lime (Kg)"
                                        required
                                        icon="flask"
                                        placeholder="Enter lime amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.lime?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="gypsum"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Gypsum (Kg)"
                                        required
                                        icon="cube"
                                        placeholder="Enter gypsum amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.gypsum?.message}
                                    />
                                )}
                            />
                        </View>

                        {/* Additives Section */}
                        <View style={styles.formSection}>
                            <ThemedText type="defaultSemiBold" style={styles.formSectionSubtitle}>
                                Additives
                            </ThemedText>

                            <Controller
                                control={control}
                                name="aluminumPowder"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Aluminum Powder (GM)"
                                        required
                                        icon="snowflake-o"
                                        placeholder="Enter aluminum powder amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.aluminumPowder?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="dcPowder"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="DC Powder (GM)"
                                        required
                                        icon="star-o"
                                        placeholder="Enter DC powder amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.dcPowder?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="water"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Water (Kg)"
                                        required
                                        icon="tint"
                                        placeholder="Enter water amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.water?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="soluOil"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Solu. Oil (Litre)"
                                        required
                                        icon="eyedropper"
                                        placeholder="Enter solu. oil amount"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.soluOil?.message}
                                    />
                                )}
                            />
                        </View>

                        {/* Process Parameters Section */}
                        <View style={styles.formSection}>
                            <ThemedText type="defaultSemiBold" style={styles.formSectionSubtitle}>
                                Process Parameters
                            </ThemedText>

                            <Controller
                                control={control}
                                name="dischargeTemp"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FormInput
                                        label="Discharge Temperature (°C)"
                                        required
                                        icon="thermometer-half"
                                        placeholder="Enter discharge temperature"
                                        keyboardType="decimal-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.dischargeTemp?.message}
                                    />
                                )}
                            />

                            {/* Mixing Time (Hours:Minutes) */}
                            <Controller
                                control={control}
                                name="mixingTime"
                                render={({ field: { onChange, value } }) => (
                                    <MaskedTimeInput
                                        label="Mixing Time (Hours:Minutes)"
                                        required
                                        value={{
                                            hours: value?.hours || '',
                                            minutes: value?.minutes || ''
                                        }}
                                        onChange={(timeValues) => {
                                            // Update the mixingTime object
                                            onChange(timeValues);

                                            // // If you still need to update individual fields for compatibility
                                            // if (setFieldValue) {
                                            //     setFieldValue('mixingTimeHours', timeValues.hours);
                                            //     setFieldValue('mixingTimeMinutes', timeValues.minutes);
                                            // }
                                        }}
                                        error={errors.mixingTime?.message}
                                    />
                                )}
                            />

                            {/* Discharge Time */}
                            <Controller
                                control={control}
                                name="dischargeTime"
                                render={({ field: { onChange, value } }) => (
                                    <TimePicker
                                        label="Discharge Time (Clock Time)"
                                        required
                                        icon="clock-o"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.dischargeTime?.message}
                                    />
                                )}
                            />
                        </View>
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
                            onPress={goBack}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit(onSubmit)}
                        >
                            <LinearGradient
                                colors={['#00D2E6', '#0088cc']}
                                style={styles.submitButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
            {/* </KeyboardAwareScrollView> */}

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
                                Record ingredients for precise batch tracking
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
    batchInfoBannerContainer: {
        marginHorizontal: 16,
        marginTop: 15,
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
    formSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        color: '#00A3B4',
    },
    formSection: {
        marginBottom: 25,
    },
    formSectionSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        color: '#555555',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 210, 230, 0.2)',
        paddingBottom: 5,
    },
    timeInputGroup: {
        marginBottom: 20,
    },
    timeLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeInputWrapper: {
        flex: 1,
    },
    timeFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        height: 50,
    },
    timeInputIcon: {
        paddingHorizontal: 12,
    },
    timeField: {
        flex: 1,
        textAlign: 'center',
    },
    timeSeparator: {
        paddingHorizontal: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555555',
    },
    inputError: {
        borderColor: '#ff4d4f',
        borderWidth: 1,
    },
    timeError: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 50,
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
    submitButton: {
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
    submitButtonGradient: {
        width: '100%',
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitButtonText: {
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