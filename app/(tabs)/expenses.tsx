import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useExpenses } from '~/hooks/useExpenses';
import { useRecords } from '~/hooks/useRecords';
import { useApp } from '~/context/AppContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { EmptyState } from '~/components/ui/EmptyState';
import { formatDate } from '~/utils/dates';

export default function ExpensesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const { expenses, loading, refresh } = useExpenses();
  const { records } = useRecords();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const getRecordTitle = (recordId: number) => records.find((r) => r.id === recordId)?.title ?? `#${recordId}`;
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      refreshControl={
        <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={theme.accent} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Expenses</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Logged payments</Text>

      <GlassCard variant="gradient" style={styles.heroCard}>
        <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>Total logged</Text>
        <Text style={[styles.heroAmount, { color: theme.text }]}>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
      </GlassCard>

      {expenses.length === 0 ? (
        <GlassCard variant="outlined">
          <EmptyState
            title="No expenses yet"
            message="Log expenses from a record's detail screen to track spending."
          />
        </GlassCard>
      ) : (
        <>
          <SectionHeader title="Recent" />
          {expenses.map((e, i) => (
            <GlassCard key={e.id} delay={i * 40} style={styles.row}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>{getRecordTitle(e.record_id)}</Text>
              <Text style={[styles.rowAmount, { color: theme.text }]}>{e.amount.toFixed(2)}</Text>
              <Text style={[styles.rowMeta, { color: theme.textSecondary }]}>
                {formatDate(e.paid_on)} · {e.mode}
              </Text>
            </GlassCard>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 17, marginTop: 4, marginBottom: 24 },
  heroCard: { marginBottom: 24 },
  heroLabel: { fontSize: 15, marginBottom: 8 },
  heroAmount: { fontSize: 28, fontWeight: '700' },
  row: { marginBottom: 12 },
  rowTitle: { fontSize: 17, fontWeight: '600' },
  rowAmount: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  rowMeta: { fontSize: 14, marginTop: 2 },
});
