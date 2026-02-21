import * as SQLite from 'expo-sqlite';

const DB_NAME = 'lifeadminpro.db';

let db: SQLite.SQLiteDatabase | null = null;

const RECORDS_TABLE = `
CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  notes TEXT,
  amount REAL NOT NULL DEFAULT 0,
  due_date TEXT NOT NULL,
  repeat_type TEXT NOT NULL DEFAULT 'none',
  reminder_config TEXT NOT NULL DEFAULT '{"enabled":true,"daysBefore":[30,7,3,1,0],"dailyReminder":false}',
  status TEXT NOT NULL DEFAULT 'active',
  attachment_path TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

const EXPENSES_TABLE = `
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  paid_on TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'other',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE
);
`;

const SETTINGS_TABLE = `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

const INDEXES = `
CREATE INDEX IF NOT EXISTS idx_records_due_date ON records(due_date);
CREATE INDEX IF NOT EXISTS idx_records_status ON records(status);
CREATE INDEX IF NOT EXISTS idx_expenses_record_id ON expenses(record_id);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_on ON expenses(paid_on);
`;

const DEFAULT_SETTINGS = `
INSERT OR IGNORE INTO settings (key, value) VALUES ('lock_enabled', 'false');
INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'system');
INSERT OR IGNORE INTO settings (key, value) VALUES ('premium', 'false');
`;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(RECORDS_TABLE + EXPENSES_TABLE + SETTINGS_TABLE + INDEXES + DEFAULT_SETTINGS);
  return db;
}

export function closeDb(): void {
  if (db) {
    db.closeAsync();
    db = null;
  }
}
