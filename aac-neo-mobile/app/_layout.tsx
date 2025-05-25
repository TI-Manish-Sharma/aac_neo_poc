// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';
// import { TabVisibilityProvider } from '@/context/TabVisibilityContext';
// import { BatchProvider } from '@/context/BatchContext';

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
// SplashScreen.setOptions({
//   duration:1000,
//   fade: true
// })

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <BatchProvider>
//       <TabVisibilityProvider>
//         <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//           <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen
//               name="(tabs)"
//               options={{
//                 headerShown: false,
//                 animation: 'fade',
//                 contentStyle: {
//                   backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
//                 },
//               }}
//             />
//             <Stack.Screen name="+not-found" />
//           </Stack>
//           <StatusBar style="auto" />
//         </ThemeProvider>
//       </TabVisibilityProvider>
//     </BatchProvider>
//   );
// }

// RootLayout.js
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
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
  }, []);

  if (!loaded || !appIsReady) {
    return null;
  }

  // Add your app logo/image path here
  const splashImage = require('../assets/images/aac-neo-logo2.png');

  // If using Lottie animations, add your animation file path here
  // const lottieAnimation = require('../assets/splash-animation.json');

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