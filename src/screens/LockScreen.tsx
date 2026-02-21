import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { PrimaryButton } from '~/components/ui/PrimaryButton';
import { useApp } from '~/context/AppContext';
import * as security from '~/services/security';

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { theme } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const triedBiometrics = React.useRef(false);

  const tryBiometrics = useCallback(async () => {
    const ok = await security.authenticateWithBiometrics('Unlock LifeAdmin Pro');
    if (ok) onUnlock();
  }, [onUnlock]);

  React.useEffect(() => {
    if (triedBiometrics.current) return;
    triedBiometrics.current = true;
    security.hasHardware().then((has) => {
      if (!has) return;
      security.isEnrolled().then((enrolled) => {
        if (enrolled) tryBiometrics();
      });
    });
  }, [tryBiometrics]);

  const submitPin = useCallback(async () => {
    const valid = await security.verifyPin(pin);
    if (valid) {
      setError('');
      onUnlock();
    } else {
      setError('Wrong PIN');
      setPin('');
    }
  }, [pin, onUnlock]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>LifeAdmin Pro</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Enter PIN to unlock</Text>
      <TextInput
        value={pin}
        onChangeText={(t) => { setPin(t); setError(''); }}
        placeholder="PIN"
        secureTextEntry
        keyboardType="number-pad"
        maxLength={6}
        style={[
          styles.input,
          { backgroundColor: theme.surface, borderColor: error ? theme.error : theme.border, color: theme.text },
        ]}
        placeholderTextColor={theme.textSecondary}
      />
      {error ? <Text style={[styles.err, { color: theme.error }]}>{error}</Text> : null}
      <PrimaryButton title="Unlock" onPress={submitPin} fullWidth style={styles.btn} />
      <PrimaryButton title="Use Biometrics" variant="outline" onPress={tryBiometrics} fullWidth style={styles.btn} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, marginBottom: 28 },
  input: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  err: { fontSize: 14, marginBottom: 12 },
  btn: { marginTop: 12 },
});
