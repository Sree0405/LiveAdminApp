import { getDb } from './init';

export async function getSetting(key: string): Promise<string | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', [key]);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDb();
  await database.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
}

export async function getLockEnabled(): Promise<boolean> {
  const v = await getSetting('lock_enabled');
  return v === 'true';
}

export async function setLockEnabled(enabled: boolean): Promise<void> {
  await setSetting('lock_enabled', enabled ? 'true' : 'false');
}

export async function getTheme(): Promise<'light' | 'dark' | 'system'> {
  const v = await getSetting('theme');
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
}

export async function setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
  await setSetting('theme', theme);
}

export async function getPremium(): Promise<boolean> {
  const v = await getSetting('premium');
  return v === 'true';
}
