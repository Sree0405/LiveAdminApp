import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecords } from '~/hooks/useRecords';
import { useExpenses } from '~/hooks/useExpenses';
import { useApp } from '~/context/AppContext';
import { useToast } from '~/context/ToastContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { PremiumInput } from '~/components/ui/PremiumInput';
import { PrimaryButton } from '~/components/ui/PrimaryButton';
import { DatePickerModal } from '~/components/ui/DatePickerModal';
import { isValidAmount } from '~/utils/validation';
import { Pressable } from 'react-native';

export default function AddExpenseScreen() {
  const { recordId } = useLocalSearchParams<{ recordId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const toast = useToast();
  const { records } = useRecords();
  const { addExpense } = useExpenses();
  const id = recordId ? parseInt(recordId, 10) : NaN;
  const record = records.find((r) => r.id === id);
  const [amount, setAmount] = useState('');
  const [paidOn, setPaidOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState('other');
  const [saving, setSaving] = useState(false);

  if (!record) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, padding: 24 }]}>
        <Text style={[styles.err, { color: theme.text }]}>Record not found</Text>
        <PrimaryButton title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleSave = async () => {
    if (!isValidAmount(amount)) {
      toast.error('Enter a valid amount');
      return;
    }
    setSaving(true);
    try {
      await addExpense({
        record_id: record.id,
        amount: parseFloat(amount),
        paid_on: paidOn,
        mode,
      });
      toast.success('Expense logged');
      router.back();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top, paddingBottom: 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.text }]}>Log expense</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{record.title}</Text>

      <GlassCard style={styles.card}>
        <PremiumInput label="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" />
        <Pressable onPress={() => setShowDatePicker(true)}>
          <PremiumInput label="Paid on" value={paidOn} editable={false} />
        </Pressable>
        <PremiumInput label="Mode" value={mode} onChangeText={setMode} placeholder="e.g. card, cash" />
        <PrimaryButton title={saving ? 'Saving…' : 'Save'} onPress={handleSave} disabled={saving} fullWidth style={styles.btn} />
      </GlassCard>

      <DatePickerModal
        visible={showDatePicker}
        value={new Date(paidOn)}
        onConfirm={(d) => {
          setPaidOn(d.toISOString().slice(0, 10));
          setShowDatePicker(false);
        }}
        onDismiss={() => setShowDatePicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 24 },
  err: { marginBottom: 16 },
  card: { marginBottom: 24 },
  btn: { marginTop: 8 },
});
