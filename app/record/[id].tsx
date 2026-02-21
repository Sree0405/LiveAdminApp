import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRecords } from '~/hooks/useRecords';
import { useExpenses } from '~/hooks/useExpenses';
import { useApp } from '~/context/AppContext';
import { useToast } from '~/context/ToastContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { PrimaryButton } from '~/components/ui/PrimaryButton';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { formatDate } from '~/utils/dates';
import { getExpensesByRecordId } from '~/database/expenses';
import { pickDocument, saveAttachment } from '~/services/storage';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const toast = useToast();
  const { records, updateRecord, deleteRecord } = useRecords();
  const { addExpense } = useExpenses();
  const recordId = id ? parseInt(id, 10) : NaN;
  const record = records.find((r) => r.id === recordId);
  const [expenses, setExpenses] = useState<{ id: number; amount: number; paid_on: string; mode: string }[]>([]);

  const onAttach = async () => {
    if (!record) return;
    const picked = await pickDocument();
    if (!picked) return;
    try {
      const path = await saveAttachment(picked.uri, record.id, picked.name);
      await updateRecord(record.id, { attachment_path: path });
      toast.success('Attachment added');
    } catch {
      toast.error('Could not attach file');
    }
  };

  useEffect(() => {
    if (!isNaN(recordId)) getExpensesByRecordId(recordId).then(setExpenses);
  }, [recordId]);

  if (!record) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, padding: 24 }]}>
        <Text style={[styles.notFound, { color: theme.text }]}>Record not found</Text>
        <PrimaryButton title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete record', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRecord(record.id);
          router.back();
        },
      },
    ]);
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: 40 }]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backRow}>
        <Text style={[styles.backText, { color: theme.accent }]}>← Back</Text>
      </Pressable>

      <GlassCard variant="gradient" accentLeft>
        <Text style={[styles.title, { color: theme.text }]}>{record.title}</Text>
        {record.attachment_path ? (
          <Text style={[styles.attachment, { color: theme.textSecondary }]}>Attachment saved</Text>
        ) : null}
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {record.category} · Due {formatDate(record.due_date)}
        </Text>
        <Text style={[styles.amount, { color: theme.text }]}>{record.amount.toFixed(2)}</Text>
        {record.notes ? <Text style={[styles.notes, { color: theme.textSecondary }]}>{record.notes}</Text> : null}
      </GlassCard>

      <SectionHeader title="Expenses" subtitle={expenses.length ? `Total: ${totalExpenses.toFixed(2)}` : undefined} />
      {expenses.length === 0 ? (
        <GlassCard variant="outlined">
          <Text style={[styles.empty, { color: theme.textSecondary }]}>No expenses logged</Text>
        </GlassCard>
      ) : (
        expenses.map((e, i) => (
          <GlassCard key={e.id} delay={i * 40} style={styles.expenseRow}>
            <Text style={[styles.expenseAmount, { color: theme.text }]}>{e.amount.toFixed(2)}</Text>
            <Text style={[styles.expenseMeta, { color: theme.textSecondary }]}>{formatDate(e.paid_on)} · {e.mode}</Text>
          </GlassCard>
        ))
      )}

      <PrimaryButton title="Attach file" variant="outline" onPress={onAttach} fullWidth style={styles.btn} />
      <PrimaryButton
        title="Log expense"
        onPress={() => router.push({ pathname: '/expense/add', params: { recordId: String(record.id) } } as never)}
        fullWidth
        style={styles.btn}
      />
      <PrimaryButton title="Delete record" variant="destructive" onPress={handleDelete} fullWidth style={styles.btn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  backRow: { paddingVertical: 8, marginBottom: 16 },
  backText: { fontSize: 17, fontWeight: '600' },
  attachment: { fontSize: 12, marginTop: 4 },
  notFound: { padding: 24, textAlign: 'center', fontSize: 17 },
  title: { fontSize: 24, fontWeight: '700' },
  meta: { fontSize: 15, marginTop: 4 },
  amount: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  notes: { fontSize: 15, marginTop: 8 },
  expenseRow: { marginBottom: 12 },
  expenseAmount: { fontSize: 17, fontWeight: '600' },
  expenseMeta: { fontSize: 14, marginTop: 2 },
  empty: { fontSize: 15 },
  btn: { marginTop: 12 },
});
