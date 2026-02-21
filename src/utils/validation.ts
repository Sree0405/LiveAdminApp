export function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export function isValidAmount(value: unknown): boolean {
  if (typeof value === 'number') return value >= 0 && isFinite(value);
  if (typeof value === 'string') {
    const n = parseFloat(value);
    return !isNaN(n) && n >= 0;
  }
  return false;
}

export function sanitizeTitle(title: string): string {
  return title.trim().slice(0, 200);
}

export function sanitizeNotes(notes: string): string {
  return notes.trim().slice(0, 2000);
}
