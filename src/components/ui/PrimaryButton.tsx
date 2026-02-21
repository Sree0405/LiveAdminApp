import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '~/context/AppContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  disabled,
  icon,
  style,
}: PrimaryButtonProps) {
  const { theme } = useApp();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  const bg =
    variant === 'primary'
      ? theme.accent
      : variant === 'secondary'
        ? theme.surfaceSecondary
        : variant === 'destructive'
          ? theme.error
          : 'transparent';
  const fg = variant === 'primary' || variant === 'destructive' ? theme.textInverse : theme.text;
  const border = variant === 'outline' ? theme.border : undefined;
  const py = size === 'sm' ? 10 : size === 'lg' ? 18 : 14;
  const fontSize = size === 'sm' ? 15 : size === 'lg' ? 18 : 16;

  return (
    <AnimatedPressable
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          paddingVertical: py,
          borderRadius: theme.borderRadius.md,
          borderWidth: border ? 1 : 0,
          borderColor: border,
          alignSelf: fullWidth ? 'stretch' : undefined,
          minHeight: 48,
        },
        animatedStyle,
        style as ViewStyle,
      ]}
      onPressIn={() => {
        if (!disabled) {
          scale.value = withSpring(0.98, { damping: 15 });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: fg, fontSize }]}>{title}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  text: { fontWeight: '600' },
});
