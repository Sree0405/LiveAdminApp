import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState as RNAppState, useColorScheme } from 'react-native';
import { setTheme as dbSetTheme, getLockEnabled, getTheme } from '../database/settings';
import { prefetchLogo } from '../services/logoCaching';
import type { Theme } from '../theme/theme';
import { darkTheme, lightTheme } from '../theme/theme';

type ThemePreference = 'light' | 'dark' | 'system';

interface AppState {
  themePreference: ThemePreference;
  theme: Theme;
  lockEnabled: boolean;
  unlocked: boolean;
  isReady: boolean;
}

interface AppContextValue extends AppState {
  setThemePreference: (p: ThemePreference) => Promise<void>;
  setLockEnabled: (v: boolean) => void;
  setUnlocked: (v: boolean) => void;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [lockEnabled, setLockEnabledState] = useState(false);
  const [unlocked, setUnlocked] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const theme: Theme = useMemo(() => {
    const effective = themePreference === 'system' ? (systemScheme ?? 'light') : themePreference;
    return effective === 'dark' ? darkTheme : lightTheme;
  }, [themePreference, systemScheme]);

  const refresh = useCallback(async () => {
    try {
      const pref = await getTheme();
      setThemePreferenceState(pref);
      const lock = await getLockEnabled();
      setLockEnabledState(lock);
      if (lock) setUnlocked(false);
    } catch {
      setThemePreferenceState('system');
      setLockEnabledState(false);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (state) => {
      if (state === 'background' && lockEnabled) setUnlocked(false);
    });
    return () => sub.remove();
  }, [lockEnabled]);

  const setThemePreference = useCallback(async (p: ThemePreference) => {
    await dbSetTheme(p);
    setThemePreferenceState(p);
  }, []);

  useEffect(() => {
    // Prefetch logo for better performance
    prefetchLogo().catch(() => {
      // Silently fail - logo prefetch shouldn't block app startup
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setLockEnabledCb = useCallback((v: boolean) => setLockEnabledState(v), []);
  const setUnlockedCb = useCallback((v: boolean) => setUnlocked(v), []);

  const value: AppContextValue = useMemo(
    () => ({
      themePreference,
      theme,
      lockEnabled,
      unlocked,
      isReady,
      setThemePreference,
      setLockEnabled: setLockEnabledCb,
      setUnlocked: setUnlockedCb,
      refresh,
    }),
    [themePreference, theme, lockEnabled, unlocked, isReady, setThemePreference, setLockEnabledCb, setUnlockedCb, refresh]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
