import { getDb } from './init';
import type { RecordRow, RecordInsert, RecordStatus } from './types';

export async function getAllRecords(): Promise<RecordRow[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<RecordRow>('SELECT * FROM records ORDER BY due_date ASC');
  return rows;
}

export async function getRecordsByStatus(status: RecordStatus): Promise<RecordRow[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<RecordRow>('SELECT * FROM records WHERE status = ? ORDER BY due_date ASC', [status]);
  return rows;
}

export async function getRecordById(id: number): Promise<RecordRow | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<RecordRow>('SELECT * FROM records WHERE id = ?', [id]);
  return row ?? null;
}

export async function getUpcomingRecords(limit: number): Promise<RecordRow[]> {
  const database = await getDb();
  const today = new Date().toISOString().slice(0, 10);
  const rows = await database.getAllAsync<RecordRow>(
    'SELECT * FROM records WHERE status = ? AND due_date >= ? ORDER BY due_date ASC LIMIT ?',
    ['active', today, limit]
  );
  return rows;
}

export async function getOverdueRecords(): Promise<RecordRow[]> {
  const database = await getDb();
  const today = new Date().toISOString().slice(0, 10);
  const rows = await database.getAllAsync<RecordRow>(
    'SELECT * FROM records WHERE status = ? AND due_date < ? ORDER BY due_date ASC',
    ['active', today]
  );
  return rows;
}

export async function insertRecord(data: RecordInsert): Promise<number> {
  const database = await getDb();
  const result = await database.runAsync(
    `INSERT INTO records (title, category, notes, amount, due_date, repeat_type, reminder_config, status, attachment_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.category || 'General',
      data.notes ?? null,
      data.amount ?? 0,
      data.due_date,
      data.repeat_type ?? 'none',
      data.reminder_config ?? '{"enabled":true,"daysBefore":[30,7,3,1,0],"dailyReminder":false}',
      data.status ?? 'active',
      data.attachment_path ?? null,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateRecord(id: number, data: Partial<RecordInsert>): Promise<void> {
  const database = await getDb();
  const record = await getRecordById(id);
  if (!record) return;

  await database.runAsync(
    `UPDATE records SET
      title = ?, category = ?, notes = ?, amount = ?, due_date = ?,
      repeat_type = ?, reminder_config = ?, status = ?, attachment_path = ?
     WHERE id = ?`,
    [
      data.title ?? record.title,
      data.category ?? record.category,
      data.notes !== undefined ? data.notes : record.notes,
      data.amount ?? record.amount,
      data.due_date ?? record.due_date,
      data.repeat_type ?? record.repeat_type,
      data.reminder_config ?? record.reminder_config,
      data.status ?? record.status,
      data.attachment_path !== undefined ? data.attachment_path : record.attachment_path,
      id,
    ]
  );
}

export async function deleteRecord(id: number): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM expenses WHERE record_id = ?', [id]);
  await database.runAsync('DELETE FROM records WHERE id = ?', [id]);
}
