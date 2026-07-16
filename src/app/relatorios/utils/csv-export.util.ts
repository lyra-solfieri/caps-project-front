export function downloadCSV(data: Record<string, any>[], filename: string): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => escape(row[h])).join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
