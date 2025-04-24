import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    Keyboard,
    ActivityIndicator,
    Modal
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormInput } from '@/components/ui/FormInput';
import { BatchRecord, useBatch } from '@/context/BatchContext';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { BatchInfoBanner } from '@/components/ui/BatchInfoBanner';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';
import { useAnimations } from '@/hooks/useAnimations';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

const { width } = Dimensions.get('window');

// Define the segregation schema with Zod
// Define type for stage defects first
type StageDefects = {
    rainCracks: string;
    cornerCracks: string;
    cornerDamage: string;
    chippedBlocks: string;
};

// Then define the schema
const stageDefectSchema = z.object({
    rainCracks: z.string().regex(/^\d*$/, 'Please enter a valid number').transform(val => val || '0'),
    cornerCracks: z.string().regex(/^\d*$/, 'Please enter a valid number').transform(val => val || '0'),
    cornerDamage: z.string().regex(/^\d*$/, 'Please enter a valid number').transform(val => val || '0'),
    chippedBlocks: z.string().regex(/^\d*$/, 'Please enter a valid number').transform(val => val || '0'),
});

const segregationFormSchema = z.object({
    totalBlocks: z.string()
        .min(1, 'Total blocks is required')
        .regex(/^\d+$/, 'Please enter a valid number'),
    blockSize: z.string().min(1, 'Block size is required'),
    shift: z.string().min(1, 'Shift is required'),

    // Defects by stage
    stage1: stageDefectSchema,
    stage2: stageDefectSchema,
    stage3: stageDefectSchema,
    stage4: stageDefectSchema,
    stage5: stageDefectSchema,
    stage6: stageDefectSchema,
});

// Type for the full form data
type SegregationFormData = z.infer<typeof segregationFormSchema>;

// Block size options for dropdown
const blockSizeOptions = ['600x200x100', '600x250x100', '600x200x150'];

// Shift options
const shiftOptions = ['Morning', 'Afternoon', 'Night'];

export default function SegregationFormScreen() {
    const params = useLocalSearchParams();
    const { getBatchById, isLoading, setBatches, updateBatchStage, getAutoclavesByBatchId } = useBatch();
    const keyboardVisible = useKeyboardVisibility();
    const [loadingBatch, setLoadingBatch] = useState(true);

    const initialStageUpdated = useRef(false);

    // Get batch and mould number from URL params
    const batchNumber = params.batchNumber as string || '';
    const mouldNumber = params.mouldNumber as string || '';

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SegregationFormData>({
        resolver: zodResolver(segregationFormSchema),
        defaultValues: {
            totalBlocks: '252', // Default to 252 as specified in your mock
            blockSize: '',
            shift: '',
            stage1: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
            stage2: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
            stage3: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
            stage4: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
            stage5: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
            stage6: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' }
        }
    });

    // Animation values
    const { fadeAnim, scaleAnim, headerAnim, bannerAnim } = useAnimations();

    // Load batch data if available
    useEffect(() => {
        if (!isLoading && batchNumber && !initialStageUpdated.current) {
            const batchRecord = getBatchById(batchNumber);

            if (batchRecord) {
                // If there's existing segregation data, populate the form
                const segregationData = batchRecord.processSteps.segregation;

                if (segregationData && segregationData.totalBlocks > 0) {
                    // Create a complete form data object with default values first
                    const formValues: SegregationFormData = {
                        totalBlocks: segregationData.totalBlocks.toString(),
                        blockSize: segregationData.size,
                        shift: segregationData.shift,
                        // Initialize all stages with empty values
                        stage1: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
                        stage2: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
                        stage3: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
                        stage4: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
                        stage5: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
                        stage6: { rainCracks: '', cornerCracks: '', cornerDamage: '', chippedBlocks: '' },
                    };

                    type StageKey = `stage${1 | 2 | 3 | 4 | 5 | 6}`;

                    // Populate defects data for each stage that exists in the data
                    Object.entries(segregationData.defects).forEach(([stage, defects]) => {
                        const stageNumber = parseInt(stage);
                        if (stageNumber >= 1 && stageNumber <= 6) {
                            // const stageKey = `stage${stageNumber}` as keyof SegregationFormData;
                            const rawKey = `stage${stageNumber}`;
                            const stageKey = rawKey as StageKey;
                            // Type-safe assignment
                            formValues[stageKey] = {
                                rainCracks: defects.rainCracksCuts.toString(),
                                cornerCracks: defects.cornerCracksCuts.toString(),
                                cornerDamage: defects.cornerDamage.toString(),
                                chippedBlocks: defects.chippedBlocks.toString()
                            };
                        }
                    });

                    // Reset form with existing data
                    reset(formValues);
                }

                // Only update batch stage once during initial load
                if (!initialStageUpdated.current) {
                    updateBatchStage(batchNumber, 'segregation', 'in-progress');
                    initialStageUpdated.current = true;
                }
            }

            setLoadingBatch(false);
        } else if (!isLoading) {
            setLoadingBatch(false);
        }
    }, [isLoading, batchNumber, getBatchById, reset, updateBatchStage]);

    // Helper function to render a stage defects section
    const renderStageDefects = (stageNumber: number) => {
        type StageKey = `stage${1 | 2 | 3 | 4 | 5 | 6}`;
        const rawKey = `stage${stageNumber}`;
        const stageKey = rawKey as StageKey;
        // const stageKey = `stage${stageNumber}` as keyof SegregationFormData;

        return (
            <View style={styles.stageContainer}>
                <ThemedText type="defaultSemiBold" style={styles.stageTitle}>
                    Stage {stageNumber}
                </ThemedText>

                {/* Rain Cracks / Cuts */}
                <Controller
                    control={control}
                    name={`${stageKey}.rainCracks` as any}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                            label="Rain Cracks / Cuts"
                            icon="grain"
                            iconFamily="MaterialIcons"
                            placeholder="Enter number"
                            keyboardType="numeric"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors[stageKey]?.rainCracks?.message}
                        />
                    )}
                />

                {/* Corner Cracks / Cuts */}
                <Controller
                    control={control}
                    name={`${stageKey}.cornerCracks` as any}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                            label="Corner Cracks / Cuts"
                            icon="broken-image"
                            iconFamily="MaterialIcons"
                            placeholder="Enter number"
                            keyboardType="numeric"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors[stageKey]?.cornerCracks?.message}
                        />
                    )}
                />

                {/* Corner Damage */}
                <Controller
                    control={control}
                    name={`${stageKey}.cornerDamage` as any}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                            label="Corner Damage"
                            icon="cube"
                            placeholder="Enter number"
                            keyboardType="numeric"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors[stageKey]?.cornerDamage?.message}
                        />
                    )}
                />

                {/* Chipped Blocks */}
                <Controller
                    control={control}
                    name={`${stageKey}.chippedBlocks` as any}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                            label="Chipped Blocks"
                            icon="scatter-plot"
                            iconFamily="MaterialIcons"
                            placeholder="Enter number"
                            keyboardType="numeric"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors[stageKey]?.chippedBlocks?.message}
                        />
                    )}
                />
            </View>
        );
    };

    const onSubmit = (data: SegregationFormData) => {
        Keyboard.dismiss();

        try {
            // Find the current batch
            const currentBatch = getBatchById(batchNumber);

            if (!currentBatch) {
                throw new Error('Batch not found');
            }

            // Calculate total defects
            let totalDefects = 0;
            for (let i = 1; i <= 6; i++) {
                const stageKey = `stage${i}` as keyof SegregationFormData;
                const stageData = data[stageKey] as StageDefects;

                totalDefects += parseInt(stageData.rainCracks || '0');
                totalDefects += parseInt(stageData.cornerCracks || '0');
                totalDefects += parseInt(stageData.cornerDamage || '0');
                totalDefects += parseInt(stageData.chippedBlocks || '0');
            }

            // Create defects object in the format expected by the data model
            const defects: Record<string, any> = {};
            for (let i = 1; i <= 6; i++) {
                const stageKey = `stage${i}` as keyof SegregationFormData;
                const stageData = data[stageKey] as StageDefects;

                defects[i] = {
                    rainCracksCuts: parseInt(stageData.rainCracks || '0'),
                    cornerCracksCuts: parseInt(stageData.cornerCracks || '0'),
                    cornerDamage: parseInt(stageData.cornerDamage || '0'),
                    chippedBlocks: parseInt(stageData.chippedBlocks || '0')
                };
            }

            // Update the batch with new segregation data
            const updatedBatch: BatchRecord  = {
                ...currentBatch,
                processSteps: {
                    ...currentBatch.processSteps,
                    segregation: {
                        shift: data.shift,
                        totalBlocks: parseInt(data.totalBlocks),
                        size: data.blockSize,
                        defects,
                        totalDefects
                    }
                },
                metadata: {
                    ...currentBatch.metadata,
                    updatedAt: new Date().toISOString()
                },
                status: 'Completed' // Mark the batch as completed
            };

            // Update the batches in context
            setBatches(prevBatches =>
                prevBatches.map(batch =>
                    batch.batchId === batchNumber ? updatedBatch : batch
                )
            );

            // Mark the segregation stage as completed
            updateBatchStage(batchNumber, 'segregation', 'completed');

            console.log('Updated segregation data:', updatedBatch);

            // Navigate back with success message
            Alert.alert(
                'Success',
                `Segregation data for Batch ${batchNumber} recorded successfully!`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.navigate('/(tabs)/(screens)/(batch-screens)/batch')
                    }
                ]
            );
        } catch (error) {
            console.error('Error updating segregation data:', error);
            Alert.alert(
                'Error',
                'There was a problem saving the segregation data. Please try again.',
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
                <ScreenHeader
                    title='Segregation Form'
                    subtitle={`Batch ${batchNumber}`}
                    icon='shape-outline'
                    iconFamily='MaterialCommunityIcons'
                    headerAnim={headerAnim}
                    onBack={() => router.back()}
                />
            )}

            {/* Batch Info Banner */}
            <BatchInfoBanner
                batchNumber={batchNumber}
                mouldNumber={mouldNumber}
                bannerAnim={bannerAnim}
            />

            {/* Main content with FormContainer */}
            <FormContainer
                fadeAnim={fadeAnim}
                scaleAnim={scaleAnim}>
                <ThemedText type="subtitle" style={styles.formSectionTitle}>
                    General Information
                </ThemedText>

                {/* General Info Section */}
                <View style={styles.formSection}>
                    {/* Shift Dropdown */}
                    <Controller
                        control={control}
                        name="shift"
                        render={({ field: { value } }) => (
                            <CustomDropdown
                                label="Shift"
                                required
                                icon="clock-o"
                                value={value}
                                options={shiftOptions}
                                error={errors.shift?.message}
                                onSelect={(option) => setValue('shift', option, { shouldValidate: true })}
                            />
                        )}
                    />

                    {/* Total Blocks */}
                    <Controller
                        control={control}
                        name="totalBlocks"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Total Blocks"
                                required
                                icon="cubes"
                                placeholder="Enter total blocks"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.totalBlocks?.message}
                            />
                        )}
                    />

                    {/* Block Size Dropdown */}
                    <Controller
                        control={control}
                        name="blockSize"
                        render={({ field: { value } }) => (
                            <CustomDropdown
                                label="Block Size"
                                required
                                icon="th-large"
                                value={value}
                                options={blockSizeOptions}
                                error={errors.blockSize?.message}
                                onSelect={(option) => setValue('blockSize', option, { shouldValidate: true })}
                            />
                        )}
                    />
                </View>

                <ThemedText type="subtitle" style={styles.formSectionTitle}>
                    Defects by Stage
                </ThemedText>

                {/* Render all six stages */}
                {renderStageDefects(1)}
                {renderStageDefects(2)}
                {renderStageDefects(3)}
                {renderStageDefects(4)}
                {renderStageDefects(5)}
                {renderStageDefects(6)}

                {/* Action Buttons */}
                <ActionButtons
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => router.back()}
                    fadeAnim={fadeAnim}
                    submitText="Submit"
                />
            </FormContainer>

            {/* Footer - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <ScreenFooter
                    text="Record segregation data to complete the batch process"
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
        marginBottom: 20,
    },
    stageContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingBottom: 16,
    },
    stageTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        color: '#555555',
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        overflow: 'hidden'
    }
});