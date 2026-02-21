import { useCallback, useEffect, useState } from 'react';
import * as expensesDb from '../database/expenses';
import type { ExpenseRow, ExpenseInsert } from '../database/types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await expensesDb.getAllExpenses();
      setExpenses(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addExpense = useCallback(async (data: ExpenseInsert): Promise<number> => {
    const id = await expensesDb.insertExpense(data);
    const all = await expensesDb.getAllExpenses();
    setExpenses(all);
    return id;
  }, []);

  const deleteExpense = useCallback(async (id: number) => {
    await expensesDb.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { expenses, loading, error, refresh: load, addExpense, deleteExpense };
}
