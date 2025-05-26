import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { useAnimations } from '@/hooks/useAnimations';
import { SquareButtonGrid } from '@/components/ui/SquareButtonGrid';
import { IconFamily } from '@/components/ui/SquareButton';

const INVENTORY_SCREEN_OPTIONS = [
    { title: 'Fly Ash', screen: "FlyAsh", iconFamily: 'FontAwesome', iconName: 'cloud' },
    { title: 'Quick Lime', screen: "QuickLime", iconFamily: 'FontAwesome', iconName: 'flask' },
    { title: 'Gypsum', screen: "Gypsum", iconFamily: 'FontAwesome', iconName: 'cubes' },
    { title: 'Aluminium Powder', screen: "AluminiumPowder", iconFamily: 'FontAwesome', iconName: 'snowflake-o' },
    { title: 'Mould Oil', screen: "MouldOil", iconFamily: 'FontAwesome', iconName: 'eyedropper' },
];

export default function InventoryReceiptScreen() {
    const { fadeAnimation, headerAnimation } = useAnimations();

    const handleNavigation = (material: string) => {
        if (!material.includes('EmptyPlaceholder')) {
            console.log(`Selected material: ${material}`);
            alert(`You selected ${material}. In a complete app, this would navigate to a form for receiving ${material}.`);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScreenHeader
                title="Inventory"
                subtitle="Raw Materials"
                icon="cubes"
                headerAnim={headerAnimation}
                onBack={() => router.back()}
            />

            <SquareButtonGrid
                options={INVENTORY_SCREEN_OPTIONS.map(option => ({
                    ...option,
                    iconFamily: option.iconFamily as IconFamily,
                }))}
                onPress={handleNavigation}
                columns={3}
                autoFillPlaceholders={true} // Disable placeholders as we're using expandLastItem
            />

            <ScreenFooter
                text="Record incoming raw materials inventory efficiently"
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