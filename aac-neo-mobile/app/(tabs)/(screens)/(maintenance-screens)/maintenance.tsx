import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { useAnimations } from '@/hooks/useAnimations';

const { width, height } = Dimensions.get('window');

// Calculate responsive sizes
const getResponsiveSizes = () => {
  const iconSize = Math.min(Math.max(width * 0.06, 24), 32);
  const fontSize = Math.min(Math.max(width * 0.035, 12), 16);
  return { iconSize, fontSize }; // Slightly smaller for 3x3 grid
};

export default function MaintenanceScreen() {
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const { iconSize, fontSize } = getResponsiveSizes();

  const { fadeAnim, scaleAnim, headerAnim } = useAnimations();

  const handleNavigation = (screen: string) => {
    console.log(`Navigating to ${screen}`);
    // Implement navigation to nested screens here
    switch (screen) {
      case 'Daily':
        router.push('/(tabs)/(screens)/(maintenance-screens)/daily-check-screen');
        break;
      default:
        break;
    }
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
      <ScreenHeader title='Maintenance Control' subtitle='Management System'
        icon='wrench'
        headerAnim={headerAnim}
        onBack={() => {
          // Optional custom back logic here
          router.back();
        }} />

      <View style={styles.menuContainer}>
        <View style={styles.menuGrid}>
          {renderSquareButton(
            'Daily',
            <FontAwesome6
              name="calendar-day"
              size={iconSize}
              color={pressedButton === 'Daily' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Daily'
          )}

          {renderSquareButton(
            'Weekly',
            <FontAwesome6
              name="calendar-week"
              size={iconSize}
              color={pressedButton === 'Weekly' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Weekly'
          )}

          {renderSquareButton(
            'Monthly',
            <FontAwesome
              name="calendar"
              size={iconSize}
              color={pressedButton === 'Monthly' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Monthly'
          )}

          {/* Second row - first button */}
          {renderSquareButton(
            'Quarterly',
            <FontAwesome
              name="calendar-check-o"
              size={iconSize}
              color={pressedButton === 'Quarterly' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Quarterly'
          )}

          {/* Second row - second button (directly next to Quarterly) */}
          {renderSquareButton(
            'HalfYearly',
            <FontAwesome6
              name="calendar"
              size={iconSize}
              color={pressedButton === 'HalfYearly' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Half Yearly'
          )}

          {/* Empty third spot to maintain grid layout */}
          <View style={styles.buttonWrapper} />
        </View>
      </View>

      <ScreenFooter
        text="Schedule maintenance procedures efficiently"
        fadeAnim={fadeAnim}
      />
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
    width: '32%', // Changed from 48% to 32% for 3x3 grid
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
    padding: Math.min(width * 0.02, 12), // Slightly smaller padding for 3x3 grid
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