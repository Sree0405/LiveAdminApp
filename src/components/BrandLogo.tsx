import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useApp } from '~/context/AppContext';

const LOGO_SOURCE = require('../../assets/image/app-logo.png');

export interface BrandLogoProps {
  /**
   * Logo size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'hero';
  /**
   * Custom fixed width (overrides size)
   */
  width?: number;
  /**
   * Custom fixed height (overrides size)
   */
  height?: number;
  /**
   * Whether to show loading indicator
   */
  showLoading?: boolean;
  /**
   * Custom accessibility label
   */
  accessibilityLabel?: string;
  /**
   * Container style
   */
  style?: any;
  /**
   * Whether to prefetch image
   * @default true
   */
  prefetch?: boolean;
}

const SIZE_MAP = {
  small: { width: 40, height: 40 },
  medium: { width: 80, height: 80 },
  large: { width: 120, height: 120 },
  hero: { width: 200, height: 200 },
} as const;


/**
 * Reusable brand logo component
 * Handles caching, error handling, and fallback states
 */
export function BrandLogo({
  size = 'medium',
  width,
  height,
  showLoading = false,
  accessibilityLabel = 'LifeAdminPro Logo',
  style,
  prefetch = true,
}: BrandLogoProps) {
  const { theme } = useApp();
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(showLoading);

  const dims = width && height ? { width, height } : SIZE_MAP[size];

  // Prefetch image for better performance
  useEffect(() => {
    if (prefetch) {
      Image.prefetch(Image.resolveAssetSource(LOGO_SOURCE).uri).catch((err) => {
        console.warn('[BrandLogo] Failed to prefetch image:', err);
      });
    }
  }, [prefetch]);

  const handleLoadStart = () => {
    if (showLoading) setImageLoading(true);
  };

  const handleLoadEnd = () => {
    setImageLoading(false);
  };

  const handleError = (err: any) => {
    console.warn('[BrandLogo] Image load error:', err);
    setImageError(true);
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <View
        style={[
          styles.container,
          dims,
          { backgroundColor: theme.surfaceTertiary },
          style,
        ]}
        accessible
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={[styles.fallbackText, { color: theme.textSecondary }]}>
          ✓
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, dims, style]}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <Image
        source={LOGO_SOURCE}
        style={[
          styles.image,
          dims,
          { opacity: imageLoading ? 0.5 : 1 },
        ]}
        resizeMode="contain"
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
      {imageLoading && (
        <ActivityIndicator
          size="small"
          color={theme.accent}
          style={styles.spinner}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 1,
  },
  spinner: {
    position: 'absolute',
  },
  fallbackText: {
    fontSize: 32,
    fontWeight: '700',
  },
});
