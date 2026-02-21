import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useApp } from '~/context/AppContext';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  const { theme } = useApp();
  return (
    <View style={[styles.wrap, { marginBottom: theme.sm }]}>
      <View style={styles.row}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {action && (
          <Pressable onPress={action.onPress} hitSlop={8}>
            <Text style={[styles.action, { color: theme.accent }]}>{action.label}</Text>
          </Pressable>
        )}
      </View>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  action: { fontSize: 15, fontWeight: '600' },
  subtitle: { fontSize: 14, marginTop: 4 },
});
