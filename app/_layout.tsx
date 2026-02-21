import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { AppProvider, useApp } from '~/context/AppContext';
import { ToastProvider } from '~/context/ToastContext';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { LockScreen } from '~/screens/LockScreen';
import { getDb } from '~/database/init';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootContent() {
  const { lockEnabled, unlocked, isReady, theme, setUnlocked } = useApp();

  if (!isReady) return null;

  const showLock = lockEnabled && !unlocked;

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="record/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="expense/add" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      {showLock && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <LockScreen onUnlock={() => setUnlocked(true)} />
        </View>
      )}
      <StatusBar style={theme.background === '#09090B' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  React.useEffect(() => {
    getDb().catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <RootContent />
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
