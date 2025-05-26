import React, { useState, useEffect, useRef } from 'react';
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
    ScrollView,
    ActivityIndicator,
    Modal
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormInput } from '@/components/ui/FormInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { tiltingCraneSchema } from '@/schema/batch.schema';
import type { TiltingCraneFormData } from '@/types/batch.types';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { TimePicker } from '@/components/TimePicker';
import { useBatch } from '@/context/BatchContext';
import { updateBatchTiltingCraneData } from '@/utils/batch-helpers';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { BatchInfoBanner } from '@/components/ui/BatchInfoBanner';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';
import { useAnimations } from '@/hooks/useAnimations';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

const { width, height } = Dimensions.get('window');

// Rising options for dropdown
const risingOptions = ['Under', 'Over', 'Ok'];

export default function TiltingCraneScreen() {
    const params = useLocalSearchParams();
    const { getBatchById, isLoading, setBatches, updateBatchStage } = useBatch();
    const keyboardVisible = useKeyboardVisibility();
    const [loadingBatch, setLoadingBatch] = useState(true);
    const [showRisingOptions, setShowRisingOptions] = useState(false);

    const initialStageUpdated = useRef(false);

    // Get batch and mould number from URL params
    const batchNumber = params.batchNumber as string || '';
    const mouldNumber = params.mouldNumber as string || '';

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TiltingCraneFormData>({
        resolver: zodResolver(tiltingCraneSchema),
        defaultValues: {
            risingQuality: '',
            temp: '',
            time: '',
            hardness: ''
        }
    });

    // Watch the risingQuality value
    const risingQuality = watch('risingQuality');

    // Animation values
    const { fadeAnimation: fadeAnim, scaleAnimation: scaleAnim, headerAnimation: headerAnim, bannerAnimation: bannerAnim } = useAnimations();

    // Load batch data if available
    useEffect(() => {
        if (!isLoading && batchNumber && !initialStageUpdated.current) {
            const batchRecord = getBatchById(batchNumber);

            if (batchRecord) {
                // If there's existing tilting crane data, populate the form
                const tiltingCraneData = batchRecord.processSteps.tiltingCrane;

                if (tiltingCraneData && tiltingCraneData.measurements.time) {
                    // Reset form with existing data
                    reset({
                        risingQuality: tiltingCraneData.measurements.risingQuality,
                        temp: tiltingCraneData.measurements.temp.toString(),
                        time: tiltingCraneData.measurements.time,
                        hardness: tiltingCraneData.measurements.hardness.toString()
                    });
                }

                // Only update batch stage once during initial load
                if (!initialStageUpdated.current) {
                    updateBatchStage(batchNumber, 'tilting', 'in-progress');
                    initialStageUpdated.current = true;
                }
            }

            setLoadingBatch(false);
        } else if (!isLoading) {
            setLoadingBatch(false);
        }
    }, [isLoading, batchNumber, getBatchById, reset, updateBatchStage]);

    // Handle rising quality selection
    const selectRisingOption = (option: string) => {
        setValue('risingQuality', option, { shouldValidate: true });
        setShowRisingOptions(false);
    };

    const onSubmit = (data: TiltingCraneFormData) => {
        Keyboard.dismiss();

        try {
            // Find the current batch
            const currentBatch = getBatchById(batchNumber);

            // console.log('In Tilting, Before Update - Batch data:', JSON.stringify(currentBatch, null, 2));

            if (!currentBatch) {
                throw new Error('Batch not found');
            }

            // Update the batch with new tilting crane data
            const updatedBatch = updateBatchTiltingCraneData(currentBatch, data);

            // Update the batches in context
            setBatches(prevBatches =>
                prevBatches.map(batch =>
                    batch.batchId === batchNumber ? updatedBatch : batch
                )
            );

            // Mark the tilting stage as completed
            updateBatchStage(batchNumber, 'tilting', 'completed');

            // Mark the next stage (cutting) as in-progress
            updateBatchStage(batchNumber, 'cutting', 'in-progress');

            console.log('Updated tilting crane data');

            // Navigate back with success message
            Alert.alert(
                'Success',
                `Tilting crane data for Batch ${batchNumber} recorded successfully!`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.navigate('/(tabs)/(screens)/(batch-screens)/batch')
                    }
                ]
            );
        } catch (error) {
            console.error('Error updating tilting crane data:', error);
            Alert.alert(
                'Error',
                'There was a problem saving the tilting crane data. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    if (isLoading || loadingBatch) {
        return (
            <ThemedView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#00D2E6" />
                <ThemedText style={{ marginTop: 20 }}>Loading batch data...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Header - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <ScreenHeader title='Tilting Crane'
                    subtitle={`Batch ${batchNumber}`}
                    icon='arrow-up'
                    headerAnim={headerAnim}
                    onBack={() => {
                        // Optional custom back logic here
                        router.back();
                    }} />
            )}

            {/* Batch Info Banner */}
            <BatchInfoBanner
                batchNumber={batchNumber}
                mouldNumber={mouldNumber}
                bannerAnim={bannerAnim}
            />

            {/* Main content with KeyboardAvoidingView */}
            <FormContainer
                fadeAnim={fadeAnim}
                scaleAnim={scaleAnim}>
                <ThemedText type="subtitle" style={styles.formSectionTitle}>
                    Enter Tilting Crane Measurements
                </ThemedText>

                {/* Measurements Section */}
                <View style={styles.formSection}>
                    <ThemedText type="defaultSemiBold" style={styles.formSectionSubtitle}>
                        Measurements
                    </ThemedText>

                    {/* Rising Quality Dropdown */}
                    <Controller
                        control={control}
                        name="risingQuality"
                        render={({ field: { value } }) => (
                            <CustomDropdown
                                label="Rising Quality"
                                required
                                icon="arrow-up"
                                value={value}
                                options={risingOptions}
                                error={errors.risingQuality?.message}
                                onSelect={(option) => setValue('risingQuality', option, { shouldValidate: true })}
                            />
                        )}
                    />

                    {/* Temperature */}
                    <Controller
                        control={control}
                        name="temp"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Temperature (°C)"
                                required
                                icon="thermometer-half"
                                placeholder="Enter temperature"
                                keyboardType="decimal-pad"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.temp?.message}
                            />
                        )}
                    />

                    {/* Time */}
                    <Controller
                        control={control}
                        name="time"
                        render={({ field: { onChange, value } }) => (
                            <TimePicker
                                label="Time (Clock Time)"
                                required
                                icon="clock-o"
                                value={value}
                                onChange={onChange}
                                error={errors.time?.message}
                            />
                        )}
                    />

                    {/* Hardness */}
                    <Controller
                        control={control}
                        name="hardness"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Hardness"
                                required
                                icon="tachometer"
                                placeholder="Enter hardness value"
                                keyboardType="decimal-pad"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.hardness?.message}
                            />
                        )}
                    />
                </View>

                {/* Action Buttons */}
                <ActionButtons
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => {
                        // Custom cancel logic if needed
                        router.back();
                    }}
                    fadeAnim={fadeAnim} />
            </FormContainer>

            {/* Footer - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <ScreenFooter
                    text="Record tilting crane parameters for quality control"
                    fadeAnim={fadeAnim}
                />
            )}


        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    formSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        color: '#00A3B4',
    },
    formSection: {
        marginBottom: 10,
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
});