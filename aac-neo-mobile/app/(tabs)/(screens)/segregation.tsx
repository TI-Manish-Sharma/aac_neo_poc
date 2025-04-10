import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// Calculate responsive sizes
const getResponsiveSizes = () => {
  const iconSize = Math.min(Math.max(width * 0.06, 24), 32);
  const fontSize = Math.min(Math.max(width * 0.035, 12), 16);
  return { iconSize: 32, fontSize };
};

export default function SegregationScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const { iconSize, fontSize } = getResponsiveSizes();

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const headerAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNavigation = (screen: string) => {
    console.log(`Navigating to ${screen}`);
    // Implement navigation to nested screens here
  };

  const goBack = () => {
    router.back();
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
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={colorScheme === 'dark' ?
            ['#004052', '#002535'] :
            ['#e6f7ff', '#ccf2ff']}
          style={styles.headerGradient}
        >
          {/* Back button on left side */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
          >
            <FontAwesome
              name="chevron-left"
              size={18}
              color={Colors[colorScheme ?? 'light'].tint}
            />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Right-aligned header content */}
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <ThemedText type="subtitle" style={styles.headerSubtitle}>
                Management System
              </ThemedText>
              <ThemedText type="title" style={styles.headerTitle}>
                Segregation Control
              </ThemedText>
            </View>
            <MaterialCommunityIcons
              name="shape-outline"
              size={28}
              color={Colors[colorScheme ?? 'light'].tint}
              style={styles.headerIcon}
            />
          </View>

          {/* Right-aligned divider */}
          <View style={styles.headerDividerContainer}>
            <View style={styles.headerDivider} />
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.menuContainer}>
        <View style={styles.menuGrid}>
          {renderSquareButton(
            'EnterSegregationData',
            <FontAwesome
              name="edit"
              size={iconSize}
              color={pressedButton === 'EnterSegregationData' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Enter Segregation Data'
          )}
        </View>
      </View>

      <Animated.View
        style={[
          styles.enhancedFooterContainer,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0]
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={colorScheme === 'dark' ?
            ['rgba(0,40,50,0.8)', 'rgba(0,40,50,0.5)'] :
            ['rgba(230,247,255,0.8)', 'rgba(204,242,255,0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.enhancedFooterGradient}
        >
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Track segregation information efficiently
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  backButtonText: {
    color: '#00D2E6',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Right align content
    paddingLeft: 80, // Allow space for back button
    paddingRight: 10, // Some padding on the right
  },
  headerTextContainer: {
    alignItems: 'flex-end', // Right align the text
    marginRight: 15, // Space between text and icon
  },
  headerIcon: {
    // Icon is now on the right
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'right',
  },
  headerDividerContainer: {
    alignItems: 'flex-end', // Right align divider
    paddingRight: 10,
  },
  headerDivider: {
    height: 2,
    width: '40%',
    backgroundColor: '#00D2E6',
    marginTop: 10,
    borderRadius: 2,
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
  enhancedFooterContainer: {
    width: '100%',
    position: 'absolute',  // Position absolutely
    bottom: 0,            // Stick to bottom
    left: 0,              // Align with left edge
    right: 0,             // Align with right edge
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginLeft: 0,        // Explicitly set zero margins
    marginRight: 0,
  },
  enhancedFooterGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#00A3B4',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});