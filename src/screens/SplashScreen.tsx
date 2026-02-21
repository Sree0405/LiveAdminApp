import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BrandLogo } from '~/components/BrandLogo';
import { useApp } from '~/context/AppContext';

export interface SplashScreenProps {
  /**
   * Duration before auto-dismissing (ms)
   */
  autoDismissDelay?: number;
  /**
   * Callback when splash should close
   */
  onDismiss?: () => void;
}

/**
 * Animated splash/launch screen with app logo
 * Centered, with proper padding and responsive sizing
 */
export function SplashScreen({ autoDismissDelay, onDismiss }: SplashScreenProps) {
  const { theme } = useApp();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideUpAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const animations = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    animations.start();

    if (autoDismissDelay) {
      const timeout = setTimeout(() => {
        onDismiss?.();
      }, autoDismissDelay);

      return () => clearTimeout(timeout);
    }
  }, [fadeAnim, slideUpAnim, autoDismissDelay, onDismiss]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <BrandLogo
          size="large"
          accessibilityLabel="LifeAdminPro Logo"
          prefetch
        />

        <Animated.Text
          style={[
            styles.brandName,
            {
              color: theme.text,
              opacity: fadeAnim,
            },
          ]}
        >
          LifeAdmin Pro
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline,
            {
              color: theme.textSecondary,
              opacity: fadeAnim,
            },
          ]}
        >
          Manage your life seamlessly
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 24,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
});
