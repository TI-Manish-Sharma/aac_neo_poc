import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, Text, View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTabVisibility } from '@/context/TabVisibilityContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isTabBarVisible } = useTabVisibility();

  // Fake user data (replace with real auth context later)
  const user = {
    name: "Mukund Joshi",
    profileImage: "https://i.pravatar.cc/150?img=8"
  };

  // Custom header component to display user info
  const UserHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Welcome, {user?.name || 'Guest'}
        </Text>
        {user?.profileImage && (
          <Image
            source={{ uri: user.profileImage }}
            style={styles.profileImage}
          />
        )}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: isTabBarVisible ? Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            // Use a solid background on Android and web
            backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground
          },
        }) : { display: 'none' },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground,
        },
        // Add the UserHeader component as the header right component
        headerRight: () => <UserHeader />,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={'#000'} />,
          headerTitle: '',
        }}
      />
      <Tabs.Screen
        name="askneo"
        options={{
          title: 'Ask Neo',
          tabBarIcon: ({ color }) => <Image source={require('@/assets/images/aac-neo-logo-wo-tagline.png')} style={{ width: 30, height: 30 }} />,
        }}
      />
      <Tabs.Screen
        name="(screens)"
        options={{
          title: '',
          href: null, // This hides the tab but allows navigation
          // tabBarButton: () => null
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  headerText: {
    fontSize: 16,
    marginRight: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});