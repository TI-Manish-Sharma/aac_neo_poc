// import React, { useState } from 'react';
// import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// import StaticHeaderView from '@/components/StaticHeaderView';

// export default function Home() {
//   const navigation = useNavigation();
//   const [pressedButton, setPressedButton] = useState<string | null>(null);

//   const handleNavigation = (screen: string) => {
//     navigation.navigate(screen as never);
//     console.log(`Navigating to ${screen}`);
//   };

//   return (
//     <StaticHeaderView
//       headerBackgroundColor={{ light: '#FFFFFF', dark: '#1A1A1A' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/aac-neo-logo.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       }>
//       <View style={styles.menuContainer}>
//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'BatchScreen' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('BatchScreen')}
//           onPressIn={() => setPressedButton('BatchScreen')}
//           onPressOut={() => setPressedButton(null)}>
//           <MaterialIcons
//             name="batch-prediction"
//             size={24}
//             color={pressedButton === 'BatchScreen' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'BatchScreen' && styles.activeButtonText
//             ]}>
//             Batch
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'AutoclaveScreen' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('AutoclaveScreen')}
//           onPressIn={() => setPressedButton('AutoclaveScreen')}
//           onPressOut={() => setPressedButton(null)}>
//           <MaterialCommunityIcons
//             name="car-brake-low-pressure"
//             size={24}
//             color={pressedButton === 'AutoclaveScreen' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'AutoclaveScreen' && styles.activeButtonText
//             ]}>
//             Autoclave
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'SegregationScreen' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('SegregationScreen')}
//           onPressIn={() => setPressedButton('SegregationScreen')}
//           onPressOut={() => setPressedButton(null)}>
//           <MaterialCommunityIcons
//             name="shape-outline"
//             size={24}
//             color={pressedButton === 'SegregationScreen' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'SegregationScreen' && styles.activeButtonText
//             ]}>
//             Segregation
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'MaintenanceScreen' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('MaintenanceScreen')}
//           onPressIn={() => setPressedButton('MaintenanceScreen')}
//           onPressOut={() => setPressedButton(null)}>
//           <FontAwesome
//             name="wrench"
//             size={24}
//             color={pressedButton === 'MaintenanceScreen' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'MaintenanceScreen' && styles.activeButtonText
//             ]}>
//             Maintenance
//           </Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'CreateBatch' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('CreateBatch')}
//           onPressIn={() => setPressedButton('CreateBatch')}
//           onPressOut={() => setPressedButton(null)}>
//           <FontAwesome
//             name="plus-square"
//             size={24}
//             color={pressedButton === 'CreateBatch' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'CreateBatch' && styles.activeButtonText
//             ]}>
//             Create Batch
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'SearchBatch' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('SearchBatch')}
//           onPressIn={() => setPressedButton('SearchBatch')}
//           onPressOut={() => setPressedButton(null)}>
//           <FontAwesome
//             name="search"
//             size={24}
//             color={pressedButton === 'SearchBatch' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'SearchBatch' && styles.activeButtonText
//             ]}>
//             Search Batch
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'InProgressBatches' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('InProgressBatches')}
//           onPressIn={() => setPressedButton('InProgressBatches')}
//           onPressOut={() => setPressedButton(null)}>
//           <FontAwesome
//             name="hourglass-half"
//             size={24}
//             color={pressedButton === 'InProgressBatches' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'InProgressBatches' && styles.activeButtonText
//             ]}>
//             In Progress Batches
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'CompletedBatches' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('CompletedBatches')}
//           onPressIn={() => setPressedButton('CompletedBatches')}
//           onPressOut={() => setPressedButton(null)}>
//           <FontAwesome
//             name="check-square-o"
//             size={24}
//             color={pressedButton === 'CompletedBatches' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'CompletedBatches' && styles.activeButtonText
//             ]}>
//             Completed Batches
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.menuButton,
//             pressedButton === 'MaintenanceTracker' && styles.activeButton
//           ]}
//           onPress={() => handleNavigation('MaintenanceTracker')}
//           onPressIn={() => setPressedButton('MaintenanceTracker')}
//           onPressOut={() => setPressedButton(null)}>
//           <FontAwesome
//             name="wrench"
//             size={24}
//             color={pressedButton === 'MaintenanceTracker' ? '#FFFFFF' : '#00D2E6'}
//           />
//           <Text
//             style={[
//               styles.buttonText,
//               pressedButton === 'MaintenanceTracker' && styles.activeButtonText
//             ]}>
//             Maintenance Tracker
//           </Text>
//         </TouchableOpacity> */}
//       </View>

//       <Text style={styles.versionText}>v1.0.0</Text>
//     </StaticHeaderView>
//   );
// }

// const styles = StyleSheet.create({
//   logo: {
//     width: 250,
//     height: 200,
//   },
//   menuContainer: {
//     paddingHorizontal: 5,
//   },
//   menuButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   activeButton: {
//     backgroundColor: '#00D2E6',
//     borderColor: '#00D2E6',
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333333',
//     marginLeft: 12,
//   },
//   activeButtonText: {
//     color: '#FFFFFF',
//   },
//   versionText: {
//     textAlign: 'center',
//     color: '#999999',
//     fontSize: 12,
//     marginTop: 20,
//   },
// });

// With Square Buttons
// import React, { useState, useEffect } from 'react';
// import { Image, StyleSheet, TouchableOpacity, View, Text, Dimensions, Animated, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// import StaticHeaderView from '@/components/StaticHeaderView'; // Adjust path as needed
// import { router } from 'expo-router';

// const { width, height } = Dimensions.get('window');

// // Calculate responsive sizes
// const getResponsiveSizes = () => {
//   // Calculate icon size based on screen width
//   const iconSize = Math.min(Math.max(width * 0.06, 24), 32); // Min 24, max 32

//   // Calculate button text size
//   const fontSize = Math.min(Math.max(width * 0.035, 12), 16); // Min 12, max 16

//   return { iconSize: 32, fontSize };
// };

// export default function Home() {
//   const navigation = useNavigation();
//   const [pressedButton, setPressedButton] = useState<string | null>(null);
//   const { iconSize, fontSize } = getResponsiveSizes();

//   // Animation values
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const scaleAnim = useState(new Animated.Value(0.9))[0];

//   useEffect(() => {
//     // Entrance animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const handleNavigation = (screen: string) => {
//     if (screen === 'BatchScreen') {
//       router.push('/(tabs)/(screens)/batch');
//     } else if (screen === 'AutoclaveScreen') {
//       router.push('/(tabs)/(screens)/autoclave'); // Assuming you'll create this route
//     } else if (screen === 'SegregationScreen') {
//       router.push('/(tabs)/(screens)/segregation'); // Assuming you'll create this route
//     } else if (screen === 'MaintenanceScreen') {
//       router.push('/(tabs)/(screens)/maintenance'); // Assuming you'll create this route
//     }
//     console.log(`Navigating to ${screen}`);
//   };

//   const renderSquareButton = (screen: string, icon: React.ReactNode, title: string) => {
//     const isPressed = pressedButton === screen;

//     return (
//       <Animated.View
//         style={[
//           styles.buttonWrapper,
//           {
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//           }
//         ]}
//       >
//         <TouchableOpacity
//           style={[
//             styles.squareButton,
//             isPressed && styles.activeButton
//           ]}
//           onPress={() => handleNavigation(screen)}
//           onPressIn={() => setPressedButton(screen)}
//           onPressOut={() => setPressedButton(null)}
//         >
//           <LinearGradient
//             colors={isPressed ? ['#00D2E6', '#0088cc'] : ['#ffffff', '#f7f7f7']}
//             style={styles.squareButtonGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             <View style={styles.squareIconContainer}>
//               {icon}
//             </View>
//             <Text
//               style={[
//                 styles.squareButtonText,
//                 { fontSize: fontSize },
//                 isPressed && styles.activeButtonText
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {title}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   return (
//     <StaticHeaderView
//       headerBackgroundColor={{ light: '#f0f9ff', dark: '#1A1A1A' }}
//       headerImage={
//         <Animated.View
//           style={{
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//             alignItems: 'center',
//             marginTop: 10,
//             marginBottom: 0,
//           }}>
//           <Image
//             source={require('@/assets/images/aac-neo-logo.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </Animated.View>
//       }>

//       {/* Powered By Area */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginTop: 5,
//         }}>
//         <View style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           overflow: 'hidden',
//         }}>
//           <Text style={[styles.companyText, { marginRight: 0 }]}>Powered by:</Text>
//           <Image
//             source={require('@/assets/images/aac-institute.png')}
//             style={{ height: 20, width: 60 }}
//             resizeMode="contain" />
//         </View>
//       </View>

//       {/* Body Area */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent}
//         showsVerticalScrollIndicator={false}>
//         {/* Button Area */}
//         <View style={styles.menuContainer}>
//           <View style={styles.menuGrid}>
//             {renderSquareButton(
//               'BatchScreen',
//               <MaterialIcons
//                 name="batch-prediction"
//                 size={iconSize}
//                 color={pressedButton === 'BatchScreen' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Batch'
//             )}

//             {renderSquareButton(
//               'AutoclaveScreen',
//               <MaterialCommunityIcons
//                 name="car-brake-low-pressure"
//                 size={iconSize}
//                 color={pressedButton === 'AutoclaveScreen' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Autoclave'
//             )}

//             {renderSquareButton(
//               'SegregationScreen',
//               <MaterialCommunityIcons
//                 name="shape-outline"
//                 size={iconSize}
//                 color={pressedButton === 'SegregationScreen' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Segregation'
//             )}

//             {renderSquareButton(
//               'MaintenanceScreen',
//               <FontAwesome
//                 name="wrench"
//                 size={iconSize}
//                 color={pressedButton === 'MaintenanceScreen' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Maintenance'
//             )}
//           </View>
//         </View>

//         {/* Footer Area */}
//         <View style={styles.footerContainer}>
//           <LinearGradient
//             colors={['rgba(0,210,230,0.1)', 'rgba(0,210,230,0)']}
//             style={styles.footerGradient}
//           >
//             <Text style={styles.versionText}>v1.0.0</Text>
//             <View style={styles.companyContainer}>
//               <Text style={styles.companyText}>Managed by </Text>
//               <Text style={styles.companyNameText}>Technizer Edge Pvt. Ltd.</Text>
//             </View>
//           </LinearGradient>
//         </View>
//       </ScrollView>
//     </StaticHeaderView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     width: '100%',
//     marginTop: 10,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//   },
//   logo: {
//     width: Math.min(width * 0.6, 250),
//     height: Math.min(height * 0.2, 150),
//   },
//   menuContainer: {
//     flex: 1,
//     paddingHorizontal: width * 0.04,
//     paddingTop: 10,
//     paddingBottom: 20,
//   },
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   buttonWrapper: {
//     width: '48%', // Almost half the container width
//     aspectRatio: 1,
//     marginBottom: height * 0.02,
//   },
//   squareButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//   },
//   squareButtonGradient: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: Math.min(width * 0.03, 16),
//   },
//   activeButton: {
//     borderColor: '#00D2E6',
//   },
//   squareIconContainer: {
//     width: '50%',
//     aspectRatio: 1,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   squareButtonText: {
//     fontWeight: '700',
//     color: '#333333',
//     textAlign: 'center',
//     paddingHorizontal: 4,
//   },
//   activeButtonText: {
//     color: '#FFFFFF',
//   },
//   footerContainer: {
//     width: '100%',
//     marginTop: 'auto',
//   },
//   footerGradient: {
//     paddingVertical: height * 0.02,
//     alignItems: 'center',
//   },
//   versionText: {
//     textAlign: 'center',
//     color: '#666666',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   companyContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   companyText: {
//     color: '#888888',
//     fontSize: 11,
//     fontWeight: '400',
//   },
//   companyNameText: {
//     color: '#00A3B4',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

//With Fixed Footer
// import React, { useState, useEffect } from 'react';
// import { Image, StyleSheet, TouchableOpacity, View, Text, Dimensions, Animated } from 'react-native';
// import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// import StaticHeaderView from '@/components/StaticHeaderView';
// import { router } from 'expo-router';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Colors } from '@/constants/Colors';

// const { width, height } = Dimensions.get('window');

// // Calculate responsive sizes
// const getResponsiveSizes = () => {
//   const iconSize = Math.min(Math.max(width * 0.06, 24), 32);
//   const fontSize = Math.min(Math.max(width * 0.035, 12), 16);
//   return { iconSize: 32, fontSize };
// };

// export default function Home() {
//   const colorScheme = useColorScheme();
//   const [pressedButton, setPressedButton] = useState<string | null>(null);
//   const { iconSize, fontSize } = getResponsiveSizes();

//   // Animation values
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const scaleAnim = useState(new Animated.Value(0.9))[0];
//   const footerAnim = useState(new Animated.Value(0))[0];
//   const poweredByAnim = useState(new Animated.Value(0))[0];
//   const shimmerAnim = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     // Entrance animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//       Animated.timing(footerAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(poweredByAnim, {
//         toValue: 1,
//         duration: 1200,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Shimmer animation loop
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(shimmerAnim, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(shimmerAnim, {
//           toValue: 0,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const handleNavigation = (screen: string) => {
//     if (screen === 'BatchScreen') {
//       router.navigate('/(tabs)/(screens)/batch');
//     } else if (screen === 'AutoclaveScreen') {
//       router.navigate('/(tabs)/(screens)/autoclave');
//     } else if (screen === 'SegregationScreen') {
//       router.navigate('/(tabs)/(screens)/segregation');
//     } else if (screen === 'MaintenanceScreen') {
//       router.navigate('/(tabs)/(screens)/maintenance');
//     }
//     console.log(`Navigating to ${screen}`);
//   };

//   const renderSquareButton = (screen: string, icon: React.ReactNode, title: string) => {
//     const isPressed = pressedButton === screen;

//     return (
//       <Animated.View
//         style={[
//           styles.buttonWrapper,
//           {
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//           }
//         ]}
//       >
//         <TouchableOpacity
//           style={[
//             styles.squareButton,
//             isPressed && styles.activeButton
//           ]}
//           onPress={() => handleNavigation(screen)}
//           onPressIn={() => setPressedButton(screen)}
//           onPressOut={() => setPressedButton(null)}
//         >
//           <LinearGradient
//             colors={isPressed ? ['#00D2E6', '#0088cc'] : ['#ffffff', '#f7f7f7']}
//             style={styles.squareButtonGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             <View style={styles.squareIconContainer}>
//               {icon}
//             </View>
//             <Text
//               style={[
//                 styles.squareButtonText,
//                 { fontSize: fontSize },
//                 isPressed && styles.activeButtonText
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {title}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   return (
//     <StaticHeaderView
//       headerBackgroundColor={{ light: '#f0f9ff', dark: '#1A1A1A' }}
//       headerImage={
//         <Animated.View
//           style={{
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//             alignItems: 'center',
//             marginTop: 10,
//             marginBottom: 0,
//           }}
//         >
//           <Image
//             source={require('@/assets/images/aac-neo-logo.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </Animated.View>
//       }>

//       {/* Main content without ScrollView */}
//       <View style={styles.contentContainer}>
//         <View style={styles.menuContainer}>
//           <View style={styles.menuGrid}>
//             {renderSquareButton(
//               'BatchScreen',
//               <MaterialIcons
//                 name="batch-prediction"
//                 size={iconSize}
//                 color={pressedButton === 'batch' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Batch'
//             )}

//             {renderSquareButton(
//               'AutoclaveScreen',
//               <MaterialCommunityIcons
//                 name="car-brake-low-pressure"
//                 size={iconSize}
//                 color={pressedButton === 'AutoclaveScreen' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Autoclave'
//             )}

//             {renderSquareButton(
//               'SegregationScreen',
//               <MaterialCommunityIcons
//                 name="shape-outline"
//                 size={iconSize}
//                 color={pressedButton === 'SegregationScreen' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Segregation'
//             )}

//             {renderSquareButton(
//               'MaintenanceScreen',
//               <FontAwesome
//                 name="wrench"
//                 size={iconSize}
//                 color={pressedButton === 'MaintenanceScreen' ? '#FFFFFF' : '#00D2E6'}
//               />,
//               'Maintenance'
//             )}
//           </View>
//         </View>
//       </View>

//       {/* Enhanced Premium Footer */}
//       <View style={styles.footerWrapper}>
//         <Animated.View
//           style={[
//             styles.enhancedFooterContainer,
//             {
//               opacity: footerAnim,
//               transform: [{
//                 translateY: footerAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [10, 0]
//                 })
//               }]
//             }
//           ]}
//         >
//           <LinearGradient
//             colors={colorScheme === 'dark' ?
//               ['rgba(0,40,60,0.95)', 'rgba(0,30,45,0.85)'] :
//               ['rgba(235,250,255,0.95)', 'rgba(210,240,250,0.85)']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 0, y: 1 }}
//             style={styles.enhancedFooterGradient}
//           >
//             {/* Modern Powered by section */}
//             <Animated.View
//               style={[
//                 styles.poweredByContainer,
//                 {
//                   opacity: poweredByAnim,
//                   transform: [{
//                     scale: poweredByAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [0.9, 1]
//                     })
//                   }]
//                 }
//               ]}
//             >
//               <View style={styles.poweredByWrapper}>
//                 <Text style={styles.poweredByText}>Powered by</Text>
//                 <View style={styles.poweredByLogoContainer}>
//                   <Image
//                     source={require('@/assets/images/aac-institute.png')}
//                     style={styles.poweredByImage}
//                     resizeMode="contain"
//                   />
//                   {/* Animated shimmer effect */}
//                   <Animated.View
//                     style={[
//                       styles.shimmerOverlay,
//                       {
//                         opacity: shimmerAnim.interpolate({
//                           inputRange: [0, 0.5, 1],
//                           outputRange: [0, 0.3, 0]
//                         }),
//                         transform: [
//                           {
//                             translateX: shimmerAnim.interpolate({
//                               inputRange: [0, 1],
//                               outputRange: [-80, 80]
//                             })
//                           }
//                         ]
//                       }
//                     ]}
//                   />
//                 </View>
//               </View>
//             </Animated.View>

//             <View style={styles.footerContentContainer}>
//               <View style={styles.footerContent}>
//                 <View style={styles.footerLeft}>
//                   <Text style={styles.versionText}>v1.0.0</Text>
//                 </View>

//                 <View style={styles.verticalDivider} />

//                 <View style={styles.footerRight}>
//                   <Text style={styles.companyText}>Managed by </Text>
//                   <Text style={styles.companyNameText}>Technizer Edge Pvt. Ltd.</Text>
//                 </View>
//               </View>
//             </View>
//           </LinearGradient>
//         </Animated.View>
//       </View>
//     </StaticHeaderView>
//   );
// }

// const styles = StyleSheet.create({
//   contentContainer: {
//     flex: 1,
//     width: '100%',
//     marginTop: 10,
//     paddingBottom: 90, // Add space at bottom to prevent content from being hidden behind footer
//   },
//   logo: {
//     width: Math.min(width * 0.6, 250),
//     height: Math.min(height * 0.2, 150),
//   },
//   menuContainer: {
//     flex: 1,
//     paddingHorizontal: width * 0.04,
//     paddingTop: 10,
//     paddingBottom: 20,
//   },
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   buttonWrapper: {
//     width: '48%', // Almost half the container width
//     aspectRatio: 1,
//     marginBottom: height * 0.02,
//   },
//   squareButton: {
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//   },
//   squareButtonGradient: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: Math.min(width * 0.03, 16),
//   },
//   activeButton: {
//     borderColor: '#00D2E6',
//   },
//   squareIconContainer: {
//     width: '50%',
//     aspectRatio: 1,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   squareButtonText: {
//     fontWeight: '700',
//     color: '#333333',
//     textAlign: 'center',
//     paddingHorizontal: 4,
//   },
//   activeButtonText: {
//     color: '#FFFFFF',
//   },
//   // Premium footer styles
//   footerWrapper: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     width: width,
//     alignItems: 'center',
//     zIndex: 10, // Ensure footer is above other content
//   },
//   enhancedFooterContainer: {
//     width: '100%',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     overflow: 'hidden',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//   },
//   enhancedFooterGradient: {
//     paddingTop: 18,
//     paddingBottom: 22,
//     paddingHorizontal: 25,
//   },
//   // Premium powered by styles
//   poweredByContainer: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//   },
//   poweredByWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 18,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 210, 230, 0.2)',
//   },
//   poweredByText: {
//     color: '#555555',
//     fontSize: 12,
//     fontWeight: '600',
//     marginRight: 8,
//     letterSpacing: 0.3,
//   },
//   poweredByLogoContainer: {
//     position: 'relative',
//     overflow: 'hidden',
//     borderRadius: 8,
//   },
//   poweredByImage: {
//     height: 25,
//     width: 75,
//   },
//   shimmerOverlay: {
//     position: 'absolute',
//     top: -10,
//     left: -20,
//     width: 40,
//     height: 50,
//     backgroundColor: 'white',
//     transform: [{ rotate: '30deg' }],
//   },
//   footerContentContainer: {
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0, 210, 230, 0.15)',
//     paddingTop: 12,
//     marginTop: 2,
//   },
//   footerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   footerLeft: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   verticalDivider: {
//     height: 20,
//     width: 1,
//     backgroundColor: 'rgba(0, 210, 230, 0.3)',
//     marginHorizontal: 12,
//   },
//   footerRight: {
//     flex: 3,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   versionText: {
//     color: '#555555',
//     fontSize: 12,
//     fontWeight: '600',
//     letterSpacing: 0.5,
//   },
//   companyText: {
//     color: '#666666',
//     fontSize: 12,
//     fontWeight: '400',
//   },
//   companyNameText: {
//     color: '#00A3B4',
//     fontSize: 14,
//     fontWeight: '600',
//     letterSpacing: 0.2,
//   },
// });

// Without StaticHeader View
import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

// Calculate responsive sizes
const getResponsiveSizes = () => {
  const iconSize = Math.min(Math.max(width * 0.06, 24), 32);
  const fontSize = Math.min(Math.max(width * 0.035, 12), 16);
  return { iconSize: 32, fontSize };
};

export default function Home() {
  const colorScheme = useColorScheme() || 'light';
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const { iconSize, fontSize } = getResponsiveSizes();

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const footerAnim = useState(new Animated.Value(0))[0];
  const poweredByAnim = useState(new Animated.Value(0))[0];
  const shimmerAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Entrance animation
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
    } // else if (screen === 'SegregationScreen') {
    //   router.navigate('/(tabs)/(screens)/segregation');
    // } 
    else if (screen === 'MaintenanceScreen') {
      router.navigate('/(tabs)/(screens)/(maintenance-screens)/maintenance');
    }
    console.log(`Navigating to ${screen}`);
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

  // Background color based on color scheme
  const backgroundColor = colorScheme === 'dark' ? '#1A1A1A' : '#f0f9ff';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          <Image
            source={require('@/assets/images/aac-neo-logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Main content */}
      <View style={styles.contentContainer}>
        <View style={styles.menuGrid}>
          {renderSquareButton(
            'InventoryScreen',
            <MaterialIcons
              name="inventory"
              size={iconSize}
              color={pressedButton === 'InventoryScreen' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Inventory'
          )}

          {renderSquareButton(
            'BatchScreen',
            <MaterialIcons
              name="batch-prediction"
              size={iconSize}
              color={pressedButton === 'batch' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Batch'
          )}

          {renderSquareButton(
            'AutoclaveScreen',
            <MaterialCommunityIcons
              name="car-brake-low-pressure"
              size={iconSize}
              color={pressedButton === 'AutoclaveScreen' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Autoclave'
          )}



          {renderSquareButton(
            'DispatchScreen',
            <MaterialCommunityIcons
              name="truck-cargo-container"
              size={iconSize}
              color={pressedButton === 'InventoryScreen' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Dispatch'
          )}

          {/* {renderSquareButton(
            'SegregationScreen',
            <MaterialCommunityIcons
              name="shape-outline"
              size={iconSize}
              color={pressedButton === 'SegregationScreen' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Segregation'
          )} */}

          {/* {renderSquareButton(
            'MaintenanceScreen',
            <FontAwesome
              name="wrench"
              size={iconSize}
              color={pressedButton === 'MaintenanceScreen' ? '#FFFFFF' : '#00D2E6'}
            />,
            'Maintenance'
          )} */}
        </View>
      </View>

      {/* Two-Row Footer */}
      <View style={styles.footerWrapper}>
        <Animated.View
          style={[
            styles.enhancedFooterContainer,
            {
              opacity: footerAnim,
              transform: [{
                translateY: footerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0]
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={colorScheme === 'dark' ?
              ['rgba(0,40,60,0.95)', 'rgba(0,30,45,0.85)'] :
              ['rgba(235,250,255,0.95)', 'rgba(210,240,250,0.85)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.enhancedFooterGradient}
          >
            {/* Product by section - first row */}
            <Animated.View
              style={[
                styles.poweredByContainer,
                {
                  opacity: poweredByAnim,
                  transform: [{
                    scale: poweredByAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1]
                    })
                  }]
                }
              ]}
            >
              <View style={styles.poweredByWrapper}>
                <Text style={styles.poweredByText}>Product by:</Text>
                <View style={styles.poweredByLogoContainer}>
                  <Image
                    source={require('@/assets/images/aac-institute.png')}
                    style={styles.poweredByImage}
                    resizeMode="contain"
                  />
                  {/* Animated shimmer effect */}
                  <Animated.View
                    style={[
                      styles.shimmerOverlay,
                      {
                        opacity: shimmerAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, 0.3, 0]
                        }),
                        transform: [
                          {
                            translateX: shimmerAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-80, 80]
                            })
                          }
                        ]
                      }
                    ]}
                  />
                </View>
              </View>
            </Animated.View>

            {/* Second row with version and managed by */}
            <View style={styles.footerContentContainer}>
              <View style={styles.footerContent}>
                <View style={styles.footerLeft}>
                  <Text style={styles.versionText}>v1.0.0</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.footerRight}>
                  <Text style={styles.companyText}>Managed by </Text>
                  <Text style={styles.companyNameText}>Technizer Edge Pvt. Ltd.</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
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
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: width * 0.04,
    paddingTop: 20, // Increased top margin to create more space below the logo
    paddingBottom: 60, // Compact footer space
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buttonWrapper: {
    width: '48%', // Almost half the container width
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

  // Footer styles
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: width,
    alignItems: 'center',
    zIndex: 10,
  },
  enhancedFooterContainer: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  enhancedFooterGradient: {
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  // Powered by styles
  poweredByContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  poweredByWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 230, 0.2)',
  },
  poweredByText: {
    color: '#555555',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  poweredByLogoContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
  },
  poweredByImage: {
    height: 28,  // Increased size
    width: 85,   // Increased size
  },
  shimmerOverlay: {
    position: 'absolute',
    top: -10,
    left: -20,
    width: 40,
    height: 50,
    backgroundColor: 'white',
    transform: [{ rotate: '30deg' }],
  },
  footerContentContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 210, 230, 0.15)',
    paddingTop: 5,
    marginTop: 0,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    height: 16,
    width: 1,
    backgroundColor: 'rgba(0, 210, 230, 0.3)',
    marginHorizontal: 10,
  },
  footerRight: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    color: '#555555',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  companyText: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '400',
  },
  companyNameText: {
    color: '#00A3B4',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});