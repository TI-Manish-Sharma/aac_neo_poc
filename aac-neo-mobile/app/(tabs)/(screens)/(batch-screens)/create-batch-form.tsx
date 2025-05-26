import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, {  } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Keyboard,
    StyleSheet
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { FormInput } from '@/components/ui/FormInput';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useBatch } from '@/context/BatchContext';
import { batchFormSchema } from '@/schema/batch.schema';
import type { BatchFormData } from '@/types/batch.types';
import { createNewBatch } from '@/utils/batch-helpers';
import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';
import { useAnimations } from '@/hooks/useAnimations';

export default function CreateBatchScreen() {
    const { addBatch } = useBatch();
    const keyboardVisible = useKeyboardVisibility();
    const { fadeAnimation, scaleAnimation, headerAnimation } = useAnimations();

    // Set up React Hook Form with Zod validation
    const { control, handleSubmit, formState: { errors } } = useForm<BatchFormData>({
        resolver: zodResolver(batchFormSchema),
        defaultValues: {
            batchNumber: '',
            mouldNumber: ''
        }
    });

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

    return (
        <ThemedView style={styles.container}>
            {/* Header - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <ScreenHeader title="Create New Batch"
                    subtitle="Batch Management"
                    icon="plus-square"
                    headerAnim={headerAnimation}
                    onBack={() => {
                        // Optional custom back logic here
                        router.back();
                    }} />
            )}

            {/* Main content with KeyboardAvoidingView */}
            <FormContainer
                fadeAnim={fadeAnimation}
                scaleAnim={scaleAnimation}>
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

                <ActionButtons
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => {
                        // Custom cancel logic if needed
                        router.back();
                    }}
                    submitText="Create Batch"
                    cancelText="Cancel"
                    fadeAnim={fadeAnimation} />
            </FormContainer>

            {/* Footer - conditionally rendered based on keyboard visibility */}
            {!keyboardVisible && (
                <ScreenFooter
                    text="Create a new batch to start tracking your progress"
                    fadeAnim={fadeAnimation}
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
});