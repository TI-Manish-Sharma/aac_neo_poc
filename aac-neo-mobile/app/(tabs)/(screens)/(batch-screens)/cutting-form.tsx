import React, { useState } from 'react';
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
    Modal
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
import { TimePicker } from '@/components/TimePicker';
import { cuttingFormSchema } from '@/schema/batch.schema';
import { CuttingFormData } from '@/types/batch.types';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { BatchInfoBanner } from '@/components/ui/BatchInfoBanner';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { useAnimations } from '@/hooks/useAnimations';
import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';
import { useBatch } from '@/context/BatchContext';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

const { width } = Dimensions.get('window');

// Block size options for dropdown
const blockSizeOptions = ['600x200x100', '600x250x100', '600x200x150'];

export default function CuttingFormScreen() {
    const params = useLocalSearchParams();
    const keyboardVisible = useKeyboardVisibility();
    const [showBlockSizeOptions, setShowBlockSizeOptions] = useState(false);

    // Get batch context for updating batch data
    const { getBatchById, batches, setBatches, updateBatchStage } = useBatch();

    // Get batch and mould number from URL params
    const batchNumber = params.batchNumber as string || 'Unknown';
    const mouldNumber = params.mouldNumber as string || 'Unknown';

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<CuttingFormData>({
        resolver: zodResolver(cuttingFormSchema),
        defaultValues: {
            cuttingTime: '',
            blockSize: '',
            tiltingCraneRejection: '',
            chippingRejection: '',
            sideCutterRejection: '',
            joinedRejection: '',
            trimmingRejection: '',
            wireBrokenHC: '',
            wireBrokenVC: '',
            rejectedDueToHC: '',
            rejectedDueToVC: '',
            dimensionCheck: ''
        }
    });

    // Watch the blockSize value
    const blockSize = watch('blockSize');

    const { fadeAnim, scaleAnim, headerAnim, bannerAnim } = useAnimations();

    // Handle block size selection
    const selectBlockSizeOption = (option: string) => {
        setValue('blockSize', option, { shouldValidate: true });
        setShowBlockSizeOptions(false);
    };

    const onSubmit = (data: CuttingFormData) => {
        Keyboard.dismiss();

        // Convert form string values to numbers where needed
        const numericData = {
            ...data,
            tiltingCraneRejection: data.tiltingCraneRejection ? parseInt(data.tiltingCraneRejection) : 0,
            chippingRejection: data.chippingRejection ? parseInt(data.chippingRejection) : 0,
            sideCutterRejection: data.sideCutterRejection ? parseInt(data.sideCutterRejection) : 0,
            joinedRejection: data.joinedRejection ? parseInt(data.joinedRejection) : 0,
            trimmingRejection: data.trimmingRejection ? parseInt(data.trimmingRejection) : 0,
            wireBrokenHC: data.wireBrokenHC ? parseInt(data.wireBrokenHC) : 0,
            wireBrokenVC: data.wireBrokenVC ? parseInt(data.wireBrokenVC) : 0,
            rejectedDueToHC: data.rejectedDueToHC ? parseInt(data.rejectedDueToHC) : 0,
            rejectedDueToVC: data.rejectedDueToVC ? parseInt(data.rejectedDueToVC) : 0,
            dimensionCheck: data.dimensionCheck ? parseInt(data.dimensionCheck) : 0
        };

        // Find the batch to update
        const batch = getBatchById(batchNumber);

        if (batch) {
            // Create updated batch with new cutting data
            const updatedBatches = batches.map(b => {
                if (b.batchId === batchNumber) {
                    return {
                        ...b,
                        processSteps: {
                            ...b.processSteps,
                            cutting: {
                                cuttingTime: data.cuttingTime,
                                blockSize: data.blockSize,
                                tiltingCraneRejection: numericData.tiltingCraneRejection,
                                chippingRejection: numericData.chippingRejection,
                                sideCutterRejection: numericData.sideCutterRejection,
                                joinedRejection: numericData.joinedRejection,
                                trimmingRejection: numericData.trimmingRejection,
                                wireBrokenHC: numericData.wireBrokenHC,
                                wireBrokenVC: numericData.wireBrokenVC,
                                rejectedDueToHC: numericData.rejectedDueToHC,
                                rejectedDueToVC: numericData.rejectedDueToVC,
                                dimensionCheck: numericData.dimensionCheck
                            }
                        },
                        metadata: {
                            ...b.metadata,
                            updatedAt: new Date().toISOString()
                        }
                    };
                }
                return b;
            });

            // Update batches in context
            setBatches(updatedBatches);

            // Update batch stage status
            updateBatchStage(batchNumber, 'cutting', 'completed');

            // Mark next stage as in-progress
            updateBatchStage(batchNumber, 'autoclave', 'in-progress');

            console.log('Updated Cutting Form data');

            // Navigate back with success message
            Alert.alert(
                'Success',
                `Cutting data for Batch ${batchNumber} recorded successfully!`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.navigate('/(tabs)/(screens)/(batch-screens)/batch')
                    }
                ]
            );
        } else {
            // Handle case where batch is not found
            Alert.alert(
                'Error',
                `Batch ${batchNumber} not found. Please try again.`,
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <ScreenHeader title='Cutting Form'
                    subtitle={`Batch ${batchNumber}`}
                    icon='cut'
                    headerAnim={headerAnim}
                    onBack={() => {
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
                    Cutting Information
                </ThemedText>

                {/* Primary Cutting Info Section */}
                <View style={styles.formSection}>
                    {/* Cutting Time */}
                    <Controller
                        control={control}
                        name="cuttingTime"
                        render={({ field: { onChange, value } }) => (
                            <TimePicker
                                label="Cutting Time (Clock Time)"
                                required
                                icon="clock-o"
                                value={value}
                                onChange={onChange}
                                error={errors.cuttingTime?.message}
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
                                icon="cubes"
                                value={value}
                                options={blockSizeOptions}
                                error={errors.blockSize?.message}
                                onSelect={(option) => setValue('blockSize', option, { shouldValidate: true })}
                            />
                        )}
                    />
                </View>

                {/* Rejection Details Section */}
                <ThemedText type="subtitle" style={styles.formSectionTitle}>
                    Rejection Details
                </ThemedText>

                <View style={styles.formSection}>
                    {/* Tilting Crane Rejection */}
                    <Controller
                        control={control}
                        name="tiltingCraneRejection"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Tilting Crane Rejection"
                                icon="exclamation-triangle"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.tiltingCraneRejection?.message}
                            />
                        )}
                    />

                    {/* Chipping Rejection */}
                    <Controller
                        control={control}
                        name="chippingRejection"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Chipping Rejection"
                                icon="exclamation-circle"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.chippingRejection?.message}
                            />
                        )}
                    />

                    {/* Side Cutter Rejection */}
                    <Controller
                        control={control}
                        name="sideCutterRejection"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Side Cutter Rejection"
                                icon="scissors"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.sideCutterRejection?.message}
                            />
                        )}
                    />

                    {/* Joined Rejection */}
                    <Controller
                        control={control}
                        name="joinedRejection"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Joined Rejection"
                                icon="link"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.joinedRejection?.message}
                            />
                        )}
                    />

                    {/* Trimming Rejection */}
                    <Controller
                        control={control}
                        name="trimmingRejection"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Trimming Rejection"
                                icon="cut"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.trimmingRejection?.message}
                            />
                        )}
                    />
                </View>

                {/* Wire Issues Section */}
                <ThemedText type="subtitle" style={styles.formSectionTitle}>
                    Wire Issues
                </ThemedText>

                <View style={styles.formSection}>
                    {/* Wire Broken HC */}
                    <Controller
                        control={control}
                        name="wireBrokenHC"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Wire Broken HC"
                                icon="minus"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.wireBrokenHC?.message}
                            />
                        )}
                    />

                    {/* Wire Broken VC */}
                    <Controller
                        control={control}
                        name="wireBrokenVC"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Wire Broken VC"
                                icon="arrows-v"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.wireBrokenVC?.message}
                            />
                        )}
                    />

                    {/* Rejected Due to HC */}
                    <Controller
                        control={control}
                        name="rejectedDueToHC"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Rejected Due to HC"
                                icon="ban"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.rejectedDueToHC?.message}
                            />
                        )}
                    />

                    {/* Rejected Due to VC */}
                    <Controller
                        control={control}
                        name="rejectedDueToVC"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Rejected Due to VC"
                                icon="ban"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.rejectedDueToVC?.message}
                            />
                        )}
                    />

                    {/* Dimension Check */}
                    <Controller
                        control={control}
                        name="dimensionCheck"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Dimension Check"
                                icon="arrows-alt"
                                placeholder="Enter number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.dimensionCheck?.message}
                            />
                        )}
                    />
                </View>

                {/* Action Buttons */}
                <ActionButtons
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => router.back()}
                    fadeAnim={fadeAnim} />
            </FormContainer>

            {/* Footer - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <ScreenFooter
                    text="Record cutting details and identify rejections"
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
    formSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        color: '#00A3B4',
    },
    formSection: {
        marginBottom: 10,
    },
});