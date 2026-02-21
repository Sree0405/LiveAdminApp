import type { RecordRow } from '../database/types';
import type { RepeatType } from '../database/types';
import { updateRecord } from '../database/records';
import { addMonths } from '../utils/dates';

const MONTH_MAP: Record<RepeatType, number> = {
  none: 0,
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '12m': 12,
  custom: 0,
};

export async function maybeAutoRenew(record: RecordRow): Promise<RecordRow | null> {
  if (record.status !== 'active') return null;
  const months = MONTH_MAP[record.repeat_type];
  if (months <= 0) return null;

  const today = new Date().toISOString().slice(0, 10);
  if (record.due_date > today) return null;

  const nextDue = addMonths(record.due_date, months);
  await updateRecord(record.id, { due_date: nextDue, status: 'active' });
  return { ...record, due_date: nextDue };
}

export function getNextDueDate(dueDate: string, repeatType: RepeatType): string | null {
  const months = MONTH_MAP[repeatType];
  if (months <= 0) return null;
  return addMonths(dueDate, months);
}
