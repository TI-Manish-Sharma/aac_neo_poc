import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAnimations } from '@/hooks/useAnimations';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

// Calculate responsive sizes
const getResponsiveSizes = () => {
  const iconSize = Math.min(Math.max(width * 0.06, 24), 32);
  const fontSize = Math.min(Math.max(width * 0.035, 12), 16);
  return { iconSize, fontSize };
};

export default function SegregationScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const { iconSize, fontSize } = getResponsiveSizes();

  const { fadeAnimation: fadeAnim, scaleAnimation: scaleAnim, headerAnimation: headerAnim } = useAnimations();

  const handleNavigation = (screen: string) => {
    console.log(`Navigating to ${screen}`);
    switch (screen) {
      case 'SegregationForm':
        router.push('/(tabs)/(screens)/(segregation-screens)/segregation-form');
        break;
      default:
        break;
    }
    
    // Implement navigation to nested screens here
  };

  const renderSquareButton = (screen: string, icon: React.ReactNode, title: string) => {
    const isPressed = pressedButton === screen;

    return (
      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.squareButton,
            isPressed && styles.activeButton
          ]}
          onPress={() => handleNavigation(screen)}
          onPressIn={() => setPressedButton(screen)}
          onPressOut={() => setPressedButton(null)}
        >
          <LinearGradient
            colors={isPressed ? ['#00D2E6', '#0088cc'] : ['#ffffff', '#f7f7f7']}
            style={styles.squareButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.squareIconContainer}>
              {icon}
            </View>
            <Text
              style={[
                styles.squareButtonText,
                { fontSize: fontSize },
                isPressed && styles.activeButtonText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Enhanced Header Section with left back button and right-aligned content */}
      <ScreenHeader title='Segregation Control' subtitle='Management System'
        icon='shape-outline'
        iconFamily='MaterialCommunityIcons'
        headerAnim={headerAnim}
        onBack={() => {
          // Optional custom back logic here
          router.back();
        }} />

      <View style={styles.menuContainer}>
        <View style={styles.menuGrid}>
          {renderSquareButton(
            'SegregationForm',
            <FontAwesome
              name="edit"
              size={iconSize}
              color={pressedButton === 'EnterSegregationData' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Segregation Form'
          )}
        </View>
      </View>

      <ScreenFooter
        text="Track segregation information efficiently"
        fadeAnim={fadeAnim} />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buttonWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: height * 0.02,
  },
  squareButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  squareButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Math.min(width * 0.03, 16),
  },
  activeButton: {
    borderColor: '#00D2E6',
  },
  squareIconContainer: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  squareButtonText: {
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
});