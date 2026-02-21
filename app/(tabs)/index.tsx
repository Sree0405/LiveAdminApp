import React from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useDashboard } from '~/hooks/useDashboard';
import { useApp } from '~/context/AppContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { EmptyState } from '~/components/ui/EmptyState';
import { formatDate, daysUntil } from '~/utils/dates';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const router = useRouter();
  const { upcoming, overdue, expenseTotalThisMonth, loading, refresh } = useDashboard();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      refreshControl={
        <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={theme.accent} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Animated.Text
        entering={FadeIn.duration(300)}
        style={[styles.title, { color: theme.text }]}
      >
        Dashboard
      </Animated.Text>
      <Animated.Text
        entering={FadeIn.delay(80).duration(300)}
        style={[styles.subtitle, { color: theme.textSecondary }]}
      >
        Your overview
      </Animated.Text>

      <GlassCard variant="gradient" delay={100} style={styles.heroCard}>
        <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>This month&apos;s expenses</Text>
        <Text style={[styles.heroAmount, { color: theme.text }]}>
          {expenseTotalThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      </GlassCard>

      {overdue.length > 0 && (
        <SectionHeader title="Overdue" subtitle={`${overdue.length} need attention`} />
      )}
      {overdue.slice(0, 5).map((r, i) => (
        <Pressable key={r.id} onPress={() => router.push(`/record/${r.id}` as never)}>
          <GlassCard key={r.id} accentLeft delay={120 + i * 40} style={styles.recordCard}>
            <View style={[styles.urgencyDot, { backgroundColor: theme.urgencyHigh }]} />
            <Text style={[styles.recordTitle, { color: theme.text }]}>{r.title}</Text>
            <Text style={[styles.recordMeta, { color: theme.textSecondary }]}>
              Due {formatDate(r.due_date)} · {r.amount.toFixed(2)}
            </Text>
          </GlassCard>
        </Pressable>
      ))}

      <SectionHeader
        title="Upcoming"
        subtitle={upcoming.length ? `${upcoming.length} coming up` : undefined}
        action={upcoming.length > 0 ? { label: 'See all', onPress: () => router.push('/(tabs)/records' as never) } : undefined}
      />
      {upcoming.length === 0 && !overdue.length ? (
        <GlassCard variant="outlined">
          <EmptyState
            title="All clear"
            message="No upcoming or overdue records. Add one to stay on top of renewals and deadlines."
            action={{ label: 'Add record', onPress: () => router.push('/(tabs)/add' as never) }}
          />
        </GlassCard>
      ) : upcoming.length === 0 ? (
        <GlassCard variant="outlined">
          <EmptyState title="No upcoming" message="Nothing due soon." />
        </GlassCard>
      ) : (
        upcoming.slice(0, 5).map((r, i) => {
          const days = daysUntil(r.due_date);
          const urgency = days <= 3 ? theme.urgencyHigh : days <= 7 ? theme.urgencyMedium : theme.urgencyLow;
          return (
            <Pressable key={r.id} onPress={() => router.push(`/record/${r.id}` as never)}>
              <GlassCard key={r.id} accentLeft delay={140 + i * 40} style={styles.recordCard}>
                <View style={[styles.urgencyDot, { backgroundColor: urgency }]} />
                <Text style={[styles.recordTitle, { color: theme.text }]}>{r.title}</Text>
                <Text style={[styles.recordMeta, { color: theme.textSecondary }]}>
                  {formatDate(r.due_date)} {days <= 7 ? `· ${days} days` : ''} · {r.amount.toFixed(2)}
                </Text>
              </GlassCard>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 16 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 17, marginTop: 4, marginBottom: 24 },
  heroCard: { marginBottom: 32 },
  heroLabel: { fontSize: 15, marginBottom: 8 },
  heroAmount: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  recordCard: { marginBottom: 12 },
  urgencyDot: {
    position: 'absolute',
    left: -15,
    top: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recordTitle: { fontSize: 17, fontWeight: '600', paddingLeft: 4 },
  recordMeta: { fontSize: 14, marginTop: 4, paddingLeft: 4 },
});
