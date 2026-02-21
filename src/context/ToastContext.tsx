import React, { createContext, useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from './AppContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  action?: { label: string; onPress: () => void };
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, action?: { label: string; onPress: () => void }) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { theme } = useApp();
  const insets = useSafeAreaInsets();

  const show = useCallback((message: string, type: ToastType = 'info', action?: { label: string; onPress: () => void }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((message: string) => show(message, 'success'), [show]);
  const error = useCallback((message: string) => show(message, 'error'), [show]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const bgByType = (type: ToastType) => {
    switch (type) {
      case 'success': return theme.successMuted;
      case 'error': return theme.errorMuted;
      case 'warning': return theme.warningMuted;
      default: return theme.surfaceSecondary;
    }
  };

  return (
    <ToastContext.Provider value={{ show, success, error }}>
      {children}
      <View style={[styles.container, { bottom: insets.bottom + 80 }]} pointerEvents="box-none">
        {toasts.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => dismiss(t.id)}
            style={[styles.toast, { backgroundColor: bgByType(t.type), borderColor: theme.border }]}
          >
            <Text style={[styles.message, { color: theme.text }]} numberOfLines={2}>{t.message}</Text>
            {t.action && (
              <Pressable onPress={() => { t.action?.onPress(); dismiss(t.id); }} hitSlop={8}>
                <Text style={[styles.action, { color: theme.accent }]}>{t.action.label}</Text>
              </Pressable>
            )}
          </Pressable>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: {
    maxWidth: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  message: { flex: 1, fontSize: 15 },
  action: { fontSize: 15, fontWeight: '600' },
});
