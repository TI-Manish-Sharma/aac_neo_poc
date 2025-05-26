import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { useAnimations } from '@/hooks/useAnimations';
import { SquareButtonGrid } from '@/components/ui/SquareButtonGrid';
import { IconFamily } from '@/components/ui/SquareButton';

const DISPATCH_SCREEN_OPTIONS = [
    { title: 'Create', screen: 'CreateOrder', iconFamily: 'FontAwesome', iconName: 'plus-circle' },
    { title: 'View', screen: 'ViewOrders', iconFamily: 'FontAwesome', iconName: 'list' },
    { title: 'Dispatch', screen: 'DispatchOrders', iconFamily: 'FontAwesome', iconName: 'truck' },
    { title: 'Delete', screen: 'DeleteOrders', iconFamily: 'FontAwesome', iconName: 'trash' },
    { title: 'Link to Invoice', screen: 'LinkToInvoice', iconFamily: 'FontAwesome', iconName: 'link' },
];

export default function DispatchScreen() {
    const { fadeAnimation, headerAnimation } = useAnimations();

    const handleNavigation = (screen: string) => {
        if (!screen.includes('EmptyPlaceholder')) {
            console.log(`Navigating to: ${screen}`);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScreenHeader
                title="Dispatch"
                subtitle="Order Management"
                icon="truck"
                headerAnim={headerAnimation}
                onBack={() => router.back()}
            />

            <SquareButtonGrid
                options={DISPATCH_SCREEN_OPTIONS.map(option => ({
                    ...option,
                    iconFamily: option.iconFamily as IconFamily,
                }))}
                onPress={handleNavigation}
                columns={3}
                autoFillPlaceholders={true}
            />

            <ScreenFooter
                text="Manage and dispatch customer orders efficiently"
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