import React, {  } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { useAnimations } from '@/hooks/useAnimations';
import { SquareButtonGrid } from '@/components/ui/SquareButtonGrid';
import { IconFamily } from '@/components/ui/SquareButton';

const AUTOCLAVE_SCREEN_OPTIONS = [
  { title: 'Create', screen: "CreateAutoclave", iconFamily: 'FontAwesome', iconName: 'plus-square' },
  { title: 'In Progress', screen: "InProgressBatch", iconFamily: 'FontAwesome', iconName: 'hourglass-half' },
  { title: 'Completed', screen: "CompletedBatch", iconFamily: 'FontAwesome', iconName: 'check-square-o' },
];

export default function AutoclaveScreen() {
  const { fadeAnimation, headerAnimation } = useAnimations();

  const handleNavigation = (screen: string) => {
    if (screen === 'CreateAutoclave') {
      router.push('/(tabs)/(screens)/(autoclave-screens)/autoclave-form');
    }
    console.log(`Navigating to ${screen}`);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ScreenHeader title='Autoclave Control' subtitle='Management System'
        icon='car-brake-low-pressure'
        iconFamily='MaterialCommunityIcons'
        headerAnim={headerAnimation}
        onBack={() => {
          router.back();
        }} />

      <SquareButtonGrid
        options={AUTOCLAVE_SCREEN_OPTIONS.map(option => ({
          ...option,
          iconFamily: option.iconFamily as IconFamily,
        }))}
        onPress={handleNavigation}
        autoFillPlaceholders={true}
      />

      <ScreenFooter
        text="Manage autoclave processes efficiently"
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