import { getDb } from './init';
import type { ExpenseRow, ExpenseInsert } from './types';

export async function getExpensesByRecordId(recordId: number): Promise<ExpenseRow[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<ExpenseRow>(
    'SELECT * FROM expenses WHERE record_id = ? ORDER BY paid_on DESC',
    [recordId]
  );
  return rows;
}

export async function getAllExpenses(): Promise<ExpenseRow[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<ExpenseRow>('SELECT * FROM expenses ORDER BY paid_on DESC');
  return rows;
}

export async function getExpensesInRange(startDate: string, endDate: string): Promise<ExpenseRow[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<ExpenseRow>(
    'SELECT * FROM expenses WHERE paid_on >= ? AND paid_on <= ? ORDER BY paid_on DESC',
    [startDate, endDate]
  );
  return rows;
}

export async function getTotalExpensesByMonth(year: number, month: number): Promise<number> {
  const database = await getDb();
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  const row = await database.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE paid_on >= ? AND paid_on <= ?',
    [start, end]
  );
  return row?.total ?? 0;
}

export async function insertExpense(data: ExpenseInsert): Promise<number> {
  const database = await getDb();
  const result = await database.runAsync(
    'INSERT INTO expenses (record_id, amount, paid_on, mode) VALUES (?, ?, ?, ?)',
    [data.record_id, data.amount, data.paid_on, data.mode || 'other']
  );
  return result.lastInsertRowId;
}

export async function deleteExpense(id: number): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}
