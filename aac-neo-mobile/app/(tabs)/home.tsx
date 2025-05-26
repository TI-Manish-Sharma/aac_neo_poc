import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Animated,
  SafeAreaView
} from 'react-native';

import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconFamily } from '@/components/ui/SquareButton';
import { TwoRowFooter } from '@/components/ui/TwoRowFooter';
import { SquareButtonGrid } from '@/components/ui/SquareButtonGrid';
import { useAnimations } from '@/hooks/useAnimations';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const colorScheme = useColorScheme() || 'light';

  // Animation values
  const { fadeAnimation, scaleAnimation } = useAnimations();
  const footerAnim = useState(new Animated.Value(0))[0];
  const poweredByAnim = useState(new Animated.Value(0))[0];
  const shimmerAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(poweredByAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleNavigation = (screen: string) => {
    if (screen === 'BatchScreen') {
      router.navigate('/(tabs)/(screens)/(batch-screens)/batch');
    } else if (screen === 'AutoclaveScreen') {
      router.navigate('/(tabs)/(screens)/(autoclave-screens)/autoclave');
    } else if (screen === 'InventoryScreen') {
      router.navigate('/(tabs)/(screens)/(inventory-screens)/inventory');
    } else if (screen === 'DispatchScreen') {
      router.navigate('/(tabs)/(screens)/(dispatch-screens)/dispatch');
    }
    // else if (screen === 'SegregationScreen') {
    //   router.navigate('/(tabs)/(screens)/segregation');
    // } 
    // else if (screen === 'MaintenanceScreen') {
    //   router.navigate('/(tabs)/(screens)/(maintenance-screens)/maintenance');
    // }
    console.log(`Navigating to ${screen}`);
  };

  const backgroundColor = colorScheme === 'dark' ? '#1A1A1A' : '#f0f9ff';

  const HOME_SCREEN_OPTIONS = [
    { title: 'Inventory', screen: "InventoryScreen", iconFamily: 'MaterialIcons', iconName: 'inventory' },
    { title: 'Batch', screen: 'BatchScreen', iconFamily: 'MaterialIcons', iconName: 'batch-prediction' },
    { title: 'Autoclave', screen: 'AutoclaveScreen', iconFamily: 'MaterialCommunityIcons', iconName: 'car-brake-low-pressure' },
    { title: 'Dispatch', screen: 'DispatchScreen', iconFamily: 'MaterialCommunityIcons', iconName: 'truck-cargo-container' },
    // { title: 'Segregation', screen: 'SegregationScreen', iconFamily: 'MaterialCommunityIcons', iconName: 'shape-outline' },
    // { title: 'Maintenance', screen: 'MaintenanceScreen', iconFamily: 'FontAwesome', iconName: 'wrench' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        <Animated.View
          style={{
            opacity: fadeAnimation,
            transform: [{ scale: scaleAnimation }],
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('@/assets/images/aac-neo-logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <SquareButtonGrid
        options={HOME_SCREEN_OPTIONS.map(option => ({
          ...option,
          iconFamily: option.iconFamily as IconFamily,
        }))}
        onPress={handleNavigation}
      />

      {/* Footer */}
      <TwoRowFooter colorScheme='light' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: Math.min(height * 0.2, 160),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Math.min(width * 0.6, 250),
    height: Math.min(height * 0.2, 150),
  }
});