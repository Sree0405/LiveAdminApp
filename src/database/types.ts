export type RepeatType = 'none' | '1m' | '3m' | '6m' | '12m' | 'custom';

export type RecordStatus = 'active' | 'expired' | 'cancelled';

export interface ReminderConfig {
  enabled: boolean;
  daysBefore: number[]; // e.g. [30, 7, 3, 1, 0]
  dailyReminder: boolean;
}

export interface RecordRow {
  id: number;
  title: string;
  category: string;
  notes: string | null;
  amount: number;
  due_date: string;
  repeat_type: RepeatType;
  reminder_config: string;
  status: RecordStatus;
  attachment_path: string | null;
  created_at: string;
}

export interface ExpenseRow {
  id: number;
  record_id: number;
  amount: number;
  paid_on: string;
  mode: string;
  created_at?: string;
}

export interface SettingsRow {
  key: string;
  value: string;
}

export interface RecordInsert {
  title: string;
  category: string;
  notes?: string | null;
  amount: number;
  due_date: string;
  repeat_type?: RepeatType;
  reminder_config?: string;
  status?: RecordStatus;
  attachment_path?: string | null;
}

export interface ExpenseInsert {
  record_id: number;
  amount: number;
  paid_on: string;
  mode: string;
}
