import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRecords } from '~/hooks/useRecords';
import { useApp } from '~/context/AppContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { EmptyState } from '~/components/ui/EmptyState';
import { formatDate } from '~/utils/dates';
import type { RecordRow } from '~/database/types';

export default function RecordsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const { records, loading, error, refresh } = useRecords();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const openDetail = (id: number) => router.push(`/record/${id}` as never);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      refreshControl={
        <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={theme.accent} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Records</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Manage renewals & deadlines</Text>

      {error ? (
        <GlassCard variant="outlined" style={styles.errorCard}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </GlassCard>
      ) : records.length === 0 ? (
        <GlassCard variant="outlined">
          <EmptyState
            title="No records yet"
            message="Add your first record to track renewals, subscriptions, and deadlines."
            action={{ label: 'Add record', onPress: () => router.push('/(tabs)/add' as never) }}
          />
        </GlassCard>
      ) : (
        <>
          <SectionHeader title={`${records.length} record${records.length === 1 ? '' : 's'}`} />
          {records.map((r: RecordRow, i: number) => (
            <Pressable key={r.id} onPress={() => openDetail(r.id)}>
              <GlassCard
                accentLeft
                delay={i * 50}
                style={styles.card}
              >
                <View style={[styles.statusBadge, { backgroundColor: r.status === 'active' ? theme.accentMuted + '40' : theme.surfaceSecondary }]}>
                  <Text style={[styles.statusText, { color: theme.text }]}>{r.status}</Text>
                </View>
                <Text style={[styles.recordTitle, { color: theme.text }]}>{r.title}</Text>
                <Text style={[styles.recordMeta, { color: theme.textSecondary }]}>
                  {r.category} · Due {formatDate(r.due_date)}
                </Text>
                <Text style={[styles.recordAmount, { color: theme.text }]}>{r.amount.toFixed(2)}</Text>
              </GlassCard>
            </Pressable>
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
  errorCard: { marginBottom: 16 },
  errorText: { fontSize: 15 },
  card: { marginBottom: 12 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  recordTitle: { fontSize: 17, fontWeight: '600' },
  recordMeta: { fontSize: 14, marginTop: 4 },
  recordAmount: { fontSize: 18, fontWeight: '700', marginTop: 8 },
});
