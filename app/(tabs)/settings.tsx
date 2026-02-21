import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Switch, Alert, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '~/context/AppContext';
import { GlassCard } from '~/components/ui/GlassCard';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { PrimaryButton } from '~/components/ui/PrimaryButton';
import { getLockEnabled, setLockEnabled } from '~/database/settings';
import { hasPin, setPin, clearPin } from '~/services/security';
import { setTheme } from '~/database/settings';
import { exportRecordsToPdf, sharePdf } from '~/services/pdfExport';
import { getAllRecords } from '~/database/records';
import { getAllExpenses } from '~/database/expenses';
import { requestPermissions, rescheduleAllReminders } from '~/services/reminders';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themePreference, setThemePreference } = useApp();
  const [lockEnabled, setLockEnabledState] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinValue, setPinValue] = useState('');

  React.useEffect(() => {
    getLockEnabled().then(setLockEnabledState);
  }, []);

  const onLockToggle = async (value: boolean) => {
    if (value) {
      const hasPinAlready = await hasPin();
      if (!hasPinAlready) {
        setShowPinInput(true);
        return;
      }
      await setLockEnabled(true);
      setLockEnabledState(true);
    } else {
      await clearPin();
      await setLockEnabled(false);
      setLockEnabledState(false);
    }
  };

  const confirmPin = async () => {
    if (pinValue.length >= 4) {
      await setPin(pinValue);
      await setLockEnabled(true);
      setLockEnabledState(true);
      setPinValue('');
      setShowPinInput(false);
    } else {
      Alert.alert('PIN must be at least 4 digits');
    }
  };

  const onTheme = (t: 'light' | 'dark' | 'system') => {
    setThemePreference(t);
    setTheme(t);
  };

  const onExportPdf = async () => {
    setExporting(true);
    try {
      const [records, expenses] = await Promise.all([getAllRecords(), getAllExpenses()]);
      const uri = await exportRecordsToPdf(records, expenses, 'LifeAdmin Pro Export');
      await sharePdf(uri);
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : 'Could not export PDF');
    } finally {
      setExporting(false);
    }
  };

  const onRequestNotifications = async () => {
    const granted = await requestPermissions();
    if (granted) {
      await rescheduleAllReminders();
      Alert.alert('Done', 'Reminders are enabled.');
    } else {
      Alert.alert('Permission denied', 'Enable notifications in device settings for reminders.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>App preferences</Text>

      <SectionHeader title="Appearance" />
      <GlassCard style={styles.card}>
        <View style={styles.themeRow}>
          <PrimaryButton
            title="Light"
            variant={themePreference === 'light' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => onTheme('light')}
            style={styles.themeBtn}
          />
          <PrimaryButton
            title="Dark"
            variant={themePreference === 'dark' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => onTheme('dark')}
            style={styles.themeBtn}
          />
          <PrimaryButton
            title="System"
            variant={themePreference === 'system' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => onTheme('system')}
            style={styles.themeBtn}
          />
        </View>
      </GlassCard>

      <SectionHeader title="Security" />
      <GlassCard style={styles.card}>
        <View style={[styles.switchRow, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
          <Text style={[styles.switchLabel, { color: theme.text }]}>App lock</Text>
          <Switch
            value={lockEnabled}
            onValueChange={onLockToggle}
            trackColor={{ false: theme.surfaceSecondary, true: theme.accentMuted }}
            thumbColor="#fff"
          />
        </View>
      </GlassCard>

      <SectionHeader title="Data" />
      <GlassCard style={styles.card}>
        <PrimaryButton title="Enable reminders" variant="outline" onPress={onRequestNotifications} fullWidth style={styles.mb} />
        <PrimaryButton title={exporting ? 'Exporting…' : 'Export to PDF'} variant="outline" onPress={onExportPdf} disabled={exporting} fullWidth />
      </GlassCard>

      <Modal visible={showPinInput} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.pinCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.pinTitle, { color: theme.text }]}>Set PIN (4–6 digits)</Text>
            <TextInput
              value={pinValue}
              onChangeText={setPinValue}
              placeholder="PIN"
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.pinInput, { backgroundColor: theme.surfaceSecondary, color: theme.text, borderColor: theme.border } as const]}
              placeholderTextColor={theme.textSecondary}
            />
            <View style={styles.pinButtons}>
              <PrimaryButton title="Cancel" variant="outline" onPress={() => { setShowPinInput(false); setPinValue(''); }} style={styles.pinBtn} />
              <PrimaryButton title="Set PIN" onPress={confirmPin} style={styles.pinBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 17, marginTop: 4, marginBottom: 24 },
  card: { marginBottom: 20 },
  themeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  themeBtn: { minWidth: 80 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  switchLabel: { fontSize: 17 },
  mb: { marginBottom: 12 },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 24 },
  pinCard: { padding: 24, borderRadius: 20 },
  pinTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  pinInput: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 18, marginBottom: 20 },
  pinButtons: { flexDirection: 'row', gap: 12 },
  pinBtn: { flex: 1 },
});
