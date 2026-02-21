import { useCallback, useEffect, useState } from 'react';
import { getUpcomingRecords, getOverdueRecords } from '../database/records';
import { getTotalExpensesByMonth } from '../database/expenses';
import type { RecordRow } from '../database/types';

interface DashboardData {
  upcoming: RecordRow[];
  overdue: RecordRow[];
  expenseTotalThisMonth: number;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    upcoming: [],
    overdue: [],
    expenseTotalThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const now = new Date();
      const [upcoming, overdue, expenseTotalThisMonth] = await Promise.all([
        getUpcomingRecords(10),
        getOverdueRecords(),
        getTotalExpensesByMonth(now.getFullYear(), now.getMonth() + 1),
      ]);
      setData({ upcoming, overdue, expenseTotalThisMonth });
    } catch {
      setData({ upcoming: [], overdue: [], expenseTotalThisMonth: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, refresh: load };
}
