import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// navigation types
type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
};

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth'>;
};

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent({ navigation }: SplashScreenProps) {
  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    if (fontsLoaded) {
      // Animate elements
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide splash after animation completes
      const timer = setTimeout(async () => {
        await SplashScreen.hideAsync();
        navigation.replace('Auth'); // Navigate to auth flow
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing while fonts are loading
  }

  return (
    <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.container as any}>
      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>CardioGuard</Text>
        <Text style={styles.subtitle}>Your Heart Health Partner</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View style={[styles.loadingIndicator, { opacity: fadeAnim }]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
    </LinearGradient>
  );
}

interface Styles {
  container: ViewStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  loadingIndicator: ViewStyle;
  dot: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#F8F9FA',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 80,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 3,
  },
});