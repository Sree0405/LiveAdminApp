import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { useRecords } from '~/hooks/useRecords';
import { useApp } from '~/context/AppContext';
import { useToast } from '~/context/ToastContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { PremiumInput } from '~/components/ui/PremiumInput';
import { PrimaryButton } from '~/components/ui/PrimaryButton';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { DatePickerModal } from '~/components/ui/DatePickerModal';
import { SmartDropdown } from '~/components/ui/SmartDropdown';
import { useValidation, rules } from '~/hooks/useValidation';
import { sanitizeTitle, sanitizeNotes } from '~/utils/validation';
import type { RepeatType } from '~/database/types';

const STEPS = ['Basic Info', 'Dates & Renewal', 'Reminders', 'Notes'];
const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'none', label: 'No repeat' },
  { value: '1m', label: 'Every month' },
  { value: '3m', label: 'Every 3 months' },
  { value: '6m', label: 'Every 6 months' },
  { value: '12m', label: 'Every year' },
];

export default function AddRecordScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const { addRecord } = useRecords();
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [showRepeatDropdown, setShowRepeatDropdown] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { errors, validate } = useValidation<{ title: string; dueDate: string; amount: string }>({
    title: [rules.required('Title is required'), rules.maxLength(200)],
    dueDate: [rules.dateRequired(), rules.dateNotPast()],
    amount: [rules.positiveNumber('Enter a valid amount')],
  });

  const handleSave = async () => {
    const values = { title, dueDate, amount, category };
    if (!validate({ title, dueDate, amount })) {
      toast.error('Please fix the errors');
      return;
    }
    setSaving(true);
    try {
      await addRecord({
        title: sanitizeTitle(title),
        category: category.trim() || 'General',
        notes: notes ? sanitizeNotes(notes) : null,
        amount: amount ? parseFloat(amount) : 0,
        due_date: dueDate,
        repeat_type: repeatType,
      });
      toast.success('Record saved');
      router.back();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const canNext = step === 0 ? title.trim().length > 0 : true;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={[styles.title, { color: theme.text }]}>New record</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{STEPS[step]}</Text>
        <View style={[styles.progressWrap, { backgroundColor: theme.surfaceSecondary }]}>
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: theme.accent, width: `${progress}%` },
            ]}
          />
        </View>
      </Animated.View>

      {step === 0 && (
        <Animated.View entering={FadeInRight.duration(300)}>
          <GlassCard style={styles.card}>
            <PremiumInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Insurance renewal"
              error={errors.title}
            />
            <PremiumInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              placeholder="General"
            />
            <PremiumInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.amount}
            />
          </GlassCard>
        </Animated.View>
      )}

      {step === 1 && (
        <Animated.View entering={FadeInRight.duration(300)}>
          <GlassCard style={styles.card}>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateTouch}>
              <PremiumInput
                label="Due date"
                value={dueDate}
                editable={false}
                error={errors.dueDate}
              />
            </Pressable>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Repeat</Text>
            <Pressable
              onPress={() => setShowRepeatDropdown(true)}
              style={[styles.dropdownTouch, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            >
              <Text style={[styles.dropdownText, { color: theme.text }]}>
                {REPEAT_OPTIONS.find((o) => o.value === repeatType)?.label ?? 'Select'}
              </Text>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>▼</Text>
            </Pressable>
          </GlassCard>
        </Animated.View>
      )}

      {step === 2 && (
        <Animated.View entering={FadeInRight.duration(300)}>
          <GlassCard style={styles.card}>
            <Text style={[styles.helper, { color: theme.textSecondary }]}>
              Reminders are set in Settings. We&apos;ll notify you 30, 7, 3 and 1 day before due.
            </Text>
          </GlassCard>
        </Animated.View>
      )}

      {step === 3 && (
        <Animated.View entering={FadeInRight.duration(300)}>
          <GlassCard style={styles.card}>
            <PremiumInput
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add details..."
              multiline
              numberOfLines={4}
            />
            <View style={[styles.preview, { borderTopColor: theme.border }]}>
              <Text style={[styles.previewTitle, { color: theme.textSecondary }]}>Preview</Text>
              <Text style={[styles.previewText, { color: theme.text }]}>{title || '—'}</Text>
              <Text style={[styles.previewMeta, { color: theme.textTertiary }]}>
                {dueDate} · {repeatType !== 'none' ? REPEAT_OPTIONS.find((o) => o.value === repeatType)?.label : 'No repeat'}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      )}

      <View style={styles.actions}>
        {step > 0 ? (
          <PrimaryButton title="Back" variant="outline" onPress={() => setStep((s) => s - 1)} style={styles.btn} />
        ) : null}
        {step < STEPS.length - 1 ? (
          <PrimaryButton
            title="Next"
            onPress={() => setStep((s) => s + 1)}
            disabled={!canNext}
            style={(step === 0 ? [styles.btn, styles.btnSingle] : styles.btn) as ViewStyle}
          />
        ) : (
          <PrimaryButton
            title={saving ? 'Saving…' : 'Save record'}
            onPress={handleSave}
            disabled={saving}
            style={(step === 0 ? [styles.btn, styles.btnSingle] : styles.btn) as ViewStyle}
          />
        )}
      </View>

      <DatePickerModal
        visible={showDatePicker}
        value={new Date(dueDate)}
        onConfirm={(d) => {
          setDueDate(d.toISOString().slice(0, 10));
          setShowDatePicker(false);
        }}
        onDismiss={() => setShowDatePicker(false)}
        minimumDate={new Date()}
      />
      <SmartDropdown
        visible={showRepeatDropdown}
        options={REPEAT_OPTIONS}
        selectedValue={repeatType}
        onSelect={setRepeatType}
        onDismiss={() => setShowRepeatDropdown(false)}
        title="Repeat"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 16 },
  progressWrap: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 24 },
  progressBar: { height: '100%', borderRadius: 3 },
  card: { marginBottom: 24 },
  fieldLabel: { fontSize: 14, marginBottom: 8 },
  dropdownTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  dropdownText: { fontSize: 16 },
  chevron: { fontSize: 12 },
  dateTouch: { marginBottom: 4 },
  helper: { fontSize: 14, lineHeight: 20 },
  preview: { marginTop: 20, paddingTop: 20 },
  previewTitle: { fontSize: 12, marginBottom: 4 },
  previewText: { fontSize: 17, fontWeight: '600' },
  previewMeta: { fontSize: 14, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1 },
  btnSingle: { flex: 1 },
});
