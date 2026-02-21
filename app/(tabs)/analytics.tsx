import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '~/context/AppContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { getTotalExpensesByMonth } from '~/database/expenses';
import { getAllRecords } from '~/database/records';

const MONTHS = 6;
const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const [monthTotals, setMonthTotals] = useState<{ label: string; value: number }[]>([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const now = new Date();
    const data: { label: string; value: number }[] = [];
    for (let i = 0; i < MONTHS; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const total = await getTotalExpensesByMonth(y, m);
      data.push({
        label: `${d.toLocaleString('default', { month: 'short' })} ${y}`,
        value: total,
      });
    }
    setMonthTotals(data);
    const records = await getAllRecords();
    setRecordsCount(records.length);
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const maxVal = Math.max(...monthTotals.map((x) => x.value), 1);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      refreshControl={
        <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={theme.accent} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Spending & overview</Text>

      <GlassCard variant="gradient" style={styles.summaryCard}>
        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total records</Text>
        <Text style={[styles.summaryValue, { color: theme.text }]}>{recordsCount}</Text>
      </GlassCard>

      <SectionHeader title="Expenses by month" />
      {monthTotals.map((item, i) => (
        <GlassCard key={item.label} delay={i * 50} style={styles.barCard}>
          <View style={styles.barRow}>
            <Text style={[styles.barLabel, { color: theme.text }]}>{item.label}</Text>
            <Text style={[styles.barValue, { color: theme.text }]}>{item.value.toFixed(2)}</Text>
          </View>
          <View style={[styles.barBg, { backgroundColor: theme.surfaceSecondary }]}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${(item.value / maxVal) * 100}%`,
                  backgroundColor: theme.accent,
                },
              ]}
            />
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 17, marginTop: 4, marginBottom: 24 },
  summaryCard: { marginBottom: 24 },
  summaryLabel: { fontSize: 15 },
  summaryValue: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  barCard: { marginBottom: 12 },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  barLabel: { fontSize: 15, fontWeight: '500' },
  barValue: { fontSize: 15 },
  barBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
});
