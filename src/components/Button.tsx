import React from 'react';
import { Pressable, Text, StyleSheet, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { borderRadius } from '../theme/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: PressableProps['style'];
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth,
  style,
  ...rest
}: ButtonProps) {
  const { theme } = useApp();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg =
    variant === 'primary'
      ? theme.accent
      : variant === 'secondary'
        ? theme.surfaceSecondary
        : 'transparent';
  const fg = variant === 'primary' ? '#fff' : theme.text;
  const border = variant === 'outline' ? theme.border : undefined;
  const paddingVertical = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  return (
    <AnimatedPressable
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          paddingVertical,
          borderRadius: borderRadius.md,
          borderWidth: border ? 1 : 0,
          borderColor: border,
          alignSelf: fullWidth ? 'stretch' : undefined,
        },
        animatedStyle,
        style as object,
      ]}
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100 });
      }}
      {...rest}
    >
      <Text style={[styles.text, { color: fg, fontSize }]}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontWeight: '600',
  },
});
