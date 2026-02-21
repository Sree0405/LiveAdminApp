import React from 'react';
import { View, TextInput, Text, StyleSheet, type TextInputProps } from 'react-native';
import { useApp } from '../context/AppContext';
import { borderRadius } from '../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  const { theme } = useApp();
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: error ? theme.error : theme.border,
            color: theme.text,
            borderRadius: borderRadius.sm,
          },
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={[styles.err, { color: theme.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  err: { fontSize: 12, marginTop: 4 },
});
