import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

import { MaskedTimeInput } from '@/components/MaskedTimeInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TimePicker } from '@/components/TimePicker';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { BatchInfoBanner } from '@/components/ui/BatchInfoBanner';
import { FormInput } from '@/components/ui/FormInput';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useBatch } from '@/context/BatchContext';
import { useTabVisibility } from '@/context/TabVisibilityContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { batchIngredientSchema } from '@/schema/batch.schema';
import type { BatchIngredientFormData } from '@/types/batch.types';
import { updateBatchIngredients } from '@/utils/batch-helpers';
import { useAnimations } from '@/hooks/useAnimations';
import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';

const { width, height } = Dimensions.get('window');

export default function BatchingForm() {
    const params = useLocalSearchParams();
    const { getBatchById, isLoading, setBatches, updateBatchStage } = useBatch();
    const keyboardVisible = useKeyboardVisibility();
    const [loadingBatch, setLoadingBatch] = useState(true);

    const initialBatchStageUpdated = useRef(false);

    // Get batch and mould number from URL params
    const batchNumber = params.batchNumber as string || '';
    const mouldNumber = params.mouldNumber as string || '';

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors }, reset } = useForm<BatchIngredientFormData>({
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
            mixingTime: { hours: '', minutes: '' },
            dischargeTime: ''
        }
    });

    const { fadeAnimation, scaleAnimation, headerAnimation, bannerAnimation } = useAnimations();

    // Load batch data if available
    useEffect(() => {
        if (!isLoading && batchNumber && !initialBatchStageUpdated.current) {
            const batchRecord = getBatchById(batchNumber);

            if (batchRecord) {
                // If there's existing ingredient data, populate the form
                const batchingData = batchRecord.processSteps.batching;

                if (batchingData) {
                    // Convert the decimal mixing time to hours and minutes
                    const totalMinutes = batchingData.process.mixingTime * 60;
                    const hours = Math.floor(totalMinutes / 60).toString();
                    const minutes = Math.floor(totalMinutes % 60).toString();

                    // Reset form with existing data
                    // reset({
                    //     freshSlurry: batchingData.materials.freshSlurry.toString(),
                    //     wasteSlurry: batchingData.materials.wasteSlurry.toString(),
                    //     cement: batchingData.materials.cement.toString(),
                    //     lime: batchingData.materials.lime.toString(),
                    //     gypsum: batchingData.materials.gypsum.toString(),
                    //     aluminumPowder: batchingData.materials.aluminumPowder.toString(),
                    //     dcPowder: batchingData.materials.dcPowder.toString(),
                    //     water: batchingData.materials.water.toString(),
                    //     soluOil: batchingData.materials.solutionOil.toString(),
                    //     dischargeTemp: batchingData.process.dischargeTemp.toString(),
                    //     mixingTime: { hours, minutes },
                    //     dischargeTime: batchingData.process.dischargeTime
                    // });
                    reset({
                        freshSlurry: batchingData.materials.freshSlurry?.toString() || '',
                        wasteSlurry: batchingData.materials.wasteSlurry?.toString() || '',
                        cement: batchingData.materials.cement?.toString() || '',
                        lime: batchingData.materials.lime?.toString() || '',
                        gypsum: batchingData.materials.gypsum?.toString() || '',
                        aluminumPowder: batchingData.materials.aluminumPowder?.toString() || '',
                        dcPowder: batchingData.materials.dcPowder?.toString() || '',
                        water: batchingData.materials.water?.toString() || '',
                        soluOil: batchingData.materials.solutionOil?.toString() || '',
                        dischargeTemp: batchingData.process.dischargeTemp?.toString() || '',
                        mixingTime: {
                            hours: hours || '',
                            minutes: minutes || ''
                        },
                        dischargeTime: batchingData.process.dischargeTime || ''
                    });
                }

                // Only update batch stage once during initial load
                if (!initialBatchStageUpdated.current) {
                    updateBatchStage(batchNumber, 'batching', 'in-progress');
                    initialBatchStageUpdated.current = true;
                }
            }

            setLoadingBatch(false);
        } else if (!isLoading) {
            setLoadingBatch(false);
        }
    }, [isLoading, batchNumber, getBatchById, reset, updateBatchStage]);

    const onSubmit = (data: BatchIngredientFormData) => {
        Keyboard.dismiss();

        try {
            // Find the current batch
            const currentBatch = getBatchById(batchNumber);

            if (!currentBatch) {
                throw new Error('Batch not found');
            }

            // Update the batch with new ingredient data
            const updatedBatch = updateBatchIngredients(currentBatch, data);

            // Update the batches in context
            setBatches(prevBatches =>
                prevBatches.map(batch =>
                    batch.batchId === batchNumber ? updatedBatch : batch
                )
            );

            // Mark the batching stage as completed
            updateBatchStage(batchNumber, 'batching', 'completed');

            // Mark the next stage (ferry cart) as in-progress
            updateBatchStage(batchNumber, 'ferryCart', 'in-progress');

            console.log('Updated batch ingredients');

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
        } catch (error) {
            console.error('Error updating batch ingredients:', error);
            Alert.alert(
                'Error',
                'There was a problem saving the batch ingredients. Please try again.',
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
                <ScreenHeader title="Ingredients Entry"
                    subtitle={`Batch ${batchNumber}`}
                    icon="flask"
                    headerAnim={headerAnimation}
                    onBack={() => {
                        // Optional custom back logic here
                        router.back();
                    }} />
            )}

            {/* Batch Info Banner */}
            <BatchInfoBanner
                batchNumber={batchNumber}
                mouldNumber={mouldNumber}
                bannerAnim={bannerAnimation}
            />

            {/* Main content with KeyboardAvoidingView */}
            <FormContainer
                fadeAnim={fadeAnimation}
                scaleAnim={scaleAnimation}>
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
                                    onChange(timeValues);
                                }}
                                // Change this line to check for nested errors
                                error={errors.mixingTime?.hours?.message || errors.mixingTime?.minutes?.message || errors.mixingTime?.message}
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

                {/* Action Buttons */}
                <ActionButtons
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => {
                        // Custom cancel logic if needed
                        router.back();
                    }}
                    fadeAnim={fadeAnimation} />
            </FormContainer>

            {/* Footer - conditionally rendered based on keyboard visibility */}
            {
                !keyboardVisible && (
                    <ScreenFooter
                        text="Record ingredients for precise batch tracking"
                        fadeAnim={fadeAnimation}
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
    }
});