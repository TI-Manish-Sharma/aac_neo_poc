import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TabVisibilityProvider } from '@/context/TabVisibilityContext';
import { BatchProvider } from '@/context/BatchContext';
import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/Inter.ttf'),
    // Add more custom fonts here if needed
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load any data or assets here
        // For example, you might want to fetch initial app data while splash is showing

        // Artificially delay for a better splash experience
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []); ``

  if (!loaded || !appIsReady) {
    return null;
  }

  // Add your app logo/image path here
  const splashImage = require('../assets/images/aac-neo-logo2.png');

  // If using Lottie animations, add your animation file path here
  // const lottieAnimation = require('../assets/splash-animation.json');

  // Background color based on color scheme
  
  return (
    <AnimatedSplashScreen
      image={splashImage}
    // lottieSource={lottieAnimation} // Uncomment if using Lottie
    >
      <BatchProvider>
        <TabVisibilityProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  animation: 'fade',
                  contentStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
                  },
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </TabVisibilityProvider>
      </BatchProvider>
    </AnimatedSplashScreen>
  );
}