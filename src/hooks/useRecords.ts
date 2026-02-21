import { useCallback, useEffect, useState } from 'react';
import * as recordsDb from '../database/records';
import type { RecordRow, RecordInsert } from '../database/types';
import { scheduleRecordReminders } from '../services/reminders';
import { maybeAutoRenew } from '../services/autoRenew';

export function useRecords() {
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await recordsDb.getAllRecords();
      setRecords(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addRecord = useCallback(
    async (data: RecordInsert): Promise<number> => {
      const id = await recordsDb.insertRecord(data);
      const record = await recordsDb.getRecordById(id);
      if (record) {
        await scheduleRecordReminders(record);
        setRecords((prev) => [...prev, record].sort((a, b) => a.due_date.localeCompare(b.due_date)));
      }
      return id;
    },
    []
  );

  const updateRecord = useCallback(async (id: number, data: Partial<RecordInsert>) => {
    await recordsDb.updateRecord(id, data);
    const updated = await recordsDb.getRecordById(id);
    if (updated) {
      await scheduleRecordReminders(updated);
      setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  }, []);

  const deleteRecord = useCallback(async (id: number) => {
    await recordsDb.deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const renewIfNeeded = useCallback(async (record: RecordRow) => {
    const renewed = await maybeAutoRenew(record);
    if (renewed) await load();
  }, [load]);

  return {
    records,
    loading,
    error,
    refresh: load,
    addRecord,
    updateRecord,
    deleteRecord,
    renewIfNeeded,
  };
}
