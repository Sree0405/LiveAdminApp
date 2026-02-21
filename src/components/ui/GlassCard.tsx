import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '~/context/AppContext';

const AnimatedView = Animated.createAnimatedComponent(View);

type GlassCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'glass' | 'outlined' | 'gradient';
  accentLeft?: boolean;
  delay?: number;
  noPadding?: boolean;
};

export function GlassCard({
  children,
  style,
  variant = 'elevated',
  accentLeft,
  delay = 0,
  noPadding,
}: GlassCardProps) {
  const { theme } = useApp();

  // Detect dark mode from theme
  const isDark = theme.text === '#FAFAFA';

  const isGlass = variant === 'glass';
  const isOutlined = variant === 'outlined';
  const isGradient = variant === 'gradient';

  const background = isGlass
    ? theme.surfaceGlass
    : isOutlined
    ? 'transparent'
    : theme.surface;

  const shadow =
    variant === 'elevated' || isGradient
      ? isDark
        ? theme.elevation.sm
        : theme.elevation.md
      : theme.elevation.none;

  const borderColor = isOutlined
    ? theme.border
    : !isDark
    ? 'rgba(0,0,0,0.04)'
    : 'transparent';

  return (
    <AnimatedView
      entering={FadeInDown.delay(delay).duration(260)}
      style={[
        styles.card,
        {
          backgroundColor: background,
          borderColor,
          borderWidth: isOutlined || !isDark ? 1 : 0,
          padding: noPadding ? 0 : theme.md,
          ...shadow,
        },
        style,
      ]}
    >
      {accentLeft && (
        <View
          style={[
            styles.accentBar,
            { backgroundColor: theme.accent },
          ]}
        />
      )}

      <View style={styles.content}>{children}</View>
    </AnimatedView>
  );
}
const styles = StyleSheet.create({
card: {
  borderRadius: 18, // slightly more premium
  overflow: 'hidden',
  position: 'relative',
  backgroundClip: 'padding-box',
},
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  content: { position: 'relative', zIndex: 1 },
});
