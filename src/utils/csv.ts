import type { ValidationTask } from '../Zustand/Store';

const HEADERS: string[] = ['ID', 'Status', 'Vault Name', 'Owner', 'Amount', 'Deadline', 'Milestone', 'Notes'];

function escapeCell(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toRow(task: ValidationTask): string {
  const cells = [
    task.id,
    task.status,
    task.vaultName,
    task.owner,
    task.amount,
    task.deadline,
    task.milestone,
    task.notes ?? '',
  ];
  return cells.map(escapeCell).join(',');
}

export function toCsv(tasks: ValidationTask[]): string {
  const headerRow = HEADERS.join(',');
  if (tasks.length === 0) return headerRow;
  const rows = tasks.map(toRow);
  return [headerRow, ...rows].join('\r\n');
}

export function downloadCsv(csv: string, filename: string): void {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
