import React, { } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAnimations } from '@/hooks/useAnimations';
import { IconFamily } from '@/components/ui/SquareButton';
import { SquareButtonGrid } from '@/components/ui/SquareButtonGrid';

const BATCH_SCREEN_OPTIONS = [
    { title: 'Create', screen: "CreateBatch", iconFamily: 'FontAwesome', iconName: 'plus-square' },
    { title: 'Search', screen: "SearchBatch", iconFamily: 'FontAwesome', iconName: 'search' },
    { title: 'In Progress', screen: "InProgressBatches", iconFamily: 'FontAwesome', iconName: 'hourglass-half' },
    { title: 'Completed', screen: "CompletedBatches", iconFamily: 'FontAwesome', iconName: 'check-square-o' },
];

export default function BatchScreen() {
    const { fadeAnimation, headerAnimation } = useAnimations();

    const handleNavigation = (screen: string) => {
        if (screen === 'CreateBatch') {
            router.push('/(tabs)/(screens)/(batch-screens)/create-batch');
        } else if (screen === 'SearchBatch') {
            router.push('/(tabs)/(screens)/(batch-screens)/search-batch');
        } else if (screen === 'InProgressBatches') {
            router.push('/(tabs)/(screens)/(batch-screens)/in-progress-batches');
        } else if (screen === 'CompletedBatches') {
            router.push('/(tabs)/(screens)/(batch-screens)/completed-batches');
        }

        console.log(`Navigating to ${screen}`);
    };

    return (
        <ThemedView style={styles.container}>
            <ScreenHeader title='Batch Control' subtitle='Management System' icon='cubes' headerAnim={headerAnimation}
                onBack={() => {
                    router.back();
                }} />

            <SquareButtonGrid
                options={BATCH_SCREEN_OPTIONS.map(option => ({
                    ...option,
                    iconFamily: option.iconFamily as IconFamily,
                }))}
                onPress={handleNavigation}
            />

            <ScreenFooter
                text="Manage batches efficiently"
                fadeAnim={fadeAnimation}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    }
});