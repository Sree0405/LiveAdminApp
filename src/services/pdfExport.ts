import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { RecordRow } from '../database/types';
import type { ExpenseRow } from '../database/types';
import { formatDate } from '../utils/dates';

export async function canShare(): Promise<boolean> {
  return Sharing.isAvailableAsync();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function exportRecordsToPdf(
  records: RecordRow[],
  expenses: ExpenseRow[],
  title: string
): Promise<string> {
  const rows = records
    .map(
      (r) =>
        `<tr>
          <td>${escapeHtml(r.title)}</td>
          <td>${escapeHtml(r.category)}</td>
          <td>${formatDate(r.due_date)}</td>
          <td>${r.amount.toFixed(2)}</td>
          <td>${r.status}</td>
        </tr>`
    )
    .join('');

  const expenseRows = expenses
    .slice(0, 200)
    .map(
      (e) =>
        `<tr>
          <td>${e.record_id}</td>
          <td>${e.amount.toFixed(2)}</td>
          <td>${formatDate(e.paid_on)}</td>
          <td>${escapeHtml(e.mode)}</td>
        </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; color: #1e293b; }
    h1 { font-size: 24px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>Generated on ${formatDate(new Date().toISOString().slice(0, 10))}</p>
  <h2>Records</h2>
  <table>
    <thead><tr><th>Title</th><th>Category</th><th>Due</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5">No records</td></tr>'}</tbody>
  </table>
  <h2>Recent Expenses</h2>
  <table>
    <thead><tr><th>Record ID</th><th>Amount</th><th>Paid On</th><th>Mode</th></tr></thead>
    <tbody>${expenseRows || '<tr><td colspan="4">No expenses</td></tr>'}</tbody>
  </table>
</body>
</html>`;

  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}

export async function sharePdf(uri: string): Promise<void> {
  if (await canShare()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
  }
}
