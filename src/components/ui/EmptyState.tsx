import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '~/context/AppContext';
import { PrimaryButton } from './PrimaryButton';

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const { theme } = useApp();
  return (
    <View style={[styles.wrap, { paddingVertical: theme.xxl }]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      {action && (
        <PrimaryButton
          title={action.label}
          onPress={action.onPress}
          variant="primary"
          style={{ marginTop: theme.lg, alignSelf: 'center' }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 32 },
  iconWrap: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
