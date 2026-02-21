import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useApp } from '../context/AppContext';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined';
}

export function Card({ style, variant = 'elevated', ...rest }: CardProps) {
  const { theme } = useApp();
  const shadow = variant === 'elevated' ? theme.elevation.lg : undefined;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderRadius: theme.borderRadius.md,
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: theme.border,
          ...(shadow ?? {}),
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
});
