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
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormInput } from '@/components/ui/FormInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ferryCartSchema } from '@/schema/batch.schema';
import type { FerryCartFormData } from '@/types/batch.types';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { TimePicker } from '@/components/TimePicker';
import { useBatch } from '@/context/BatchContext';
import { updateBatchFerryCartData } from '@/utils/batch-helpers';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { BatchInfoBanner } from '@/components/ui/BatchInfoBanner';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { useAnimations } from '@/hooks/useAnimations';
import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';

const { width, height } = Dimensions.get('window');

export default function FerryCartScreen() {
    const params = useLocalSearchParams();
    const { getBatchById, isLoading, setBatches, updateBatchStage } = useBatch();
    const keyboardVisible = useKeyboardVisibility();
    const [loadingBatch, setLoadingBatch] = useState(true);

    const initialStageUpdated = useRef(false);

    // Get batch and mould number from URL params
    const batchNumber = params.batchNumber as string || '';
    const mouldNumber = params.mouldNumber as string || '';

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FerryCartFormData>({
        resolver: zodResolver(ferryCartSchema),
        defaultValues: {
            flow: '',
            temp: '',
            height: '',
            time: ''
        }
    });

    // Animation values
    const { fadeAnim, scaleAnim, headerAnim, bannerAnim } = useAnimations();

    // Load batch data if available
    useEffect(() => {
        if (!isLoading && batchNumber && !initialStageUpdated.current) {
            const batchRecord = getBatchById(batchNumber);

            if (batchRecord) {
                // If there's existing ferry cart data, populate the form
                const ferryCartData = batchRecord.processSteps.ferryCarts;

                if (ferryCartData && ferryCartData.measurements.flow > 0) {
                    // Reset form with existing data
                    reset({
                        flow: ferryCartData.measurements.flow.toString(),
                        temp: ferryCartData.measurements.temp.toString(),
                        height: ferryCartData.measurements.height.toString(),
                        time: ferryCartData.measurements.time
                    });
                }

                // Only update batch stage once during initial load
                if (!initialStageUpdated.current) {
                    updateBatchStage(batchNumber, 'ferryCart', 'in-progress');
                    initialStageUpdated.current = true;
                }
            }

            setLoadingBatch(false);
        } else if (!isLoading) {
            setLoadingBatch(false);
        }
    }, [isLoading, batchNumber, getBatchById, reset, updateBatchStage]);

    const onSubmit = (data: FerryCartFormData) => {
        Keyboard.dismiss();

        try {
            // Find the current batch
            const currentBatch = getBatchById(batchNumber);

            if (!currentBatch) {
                throw new Error('Batch not found');
            }

            // Update the batch with new ferry cart data
            const updatedBatch = updateBatchFerryCartData(currentBatch, data);

            // Update the batches in context
            setBatches(prevBatches =>
                prevBatches.map(batch =>
                    batch.batchId === batchNumber ? updatedBatch : batch
                )
            );

            // Mark the ferry cart stage as completed
            updateBatchStage(batchNumber, 'ferryCart', 'completed');

            // Mark the next stage (tilting) as in-progress
            updateBatchStage(batchNumber, 'tilting', 'in-progress');

            console.log('Updated ferry cart data');

            // Navigate back with success message
            Alert.alert(
                'Success',
                `Ferry cart data for Batch ${batchNumber} recorded successfully!`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.navigate('/(tabs)/(screens)/(batch-screens)/batch')
                    }
                ]
            );
        } catch (error) {
            console.error('Error updating ferry cart data:', error);
            Alert.alert(
                'Error',
                'There was a problem saving the ferry cart data. Please try again.',
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
                <ScreenHeader title='Ferry Cart'
                    subtitle={`Batch ${batchNumber}`}
                    icon='truck'
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
                    Enter Ferry Cart Measurements
                </ThemedText>

                {/* Measurements Section */}
                <View style={styles.formSection}>
                    <ThemedText type="defaultSemiBold" style={styles.formSectionSubtitle}>
                        Measurements
                    </ThemedText>

                    <Controller
                        control={control}
                        name="flow"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Flow (cm)"
                                required
                                icon="ruler"
                                iconFamily='Entypo'
                                placeholder="Enter flow measurement"
                                keyboardType="decimal-pad"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.flow?.message}
                            />
                        )}
                    />

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

                    <Controller
                        control={control}
                        name="height"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Height (cm)"
                                required
                                icon="arrows-v"
                                placeholder="Enter height measurement"
                                keyboardType="decimal-pad"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.height?.message}
                            />
                        )}
                    />

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
            {
                !keyboardVisible && (
                    <ScreenFooter
                        text="Record ferry cart measurements for precise batch tracking"
                        fadeAnim={fadeAnim}
                    />
                )
            }
        </ThemedView >
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