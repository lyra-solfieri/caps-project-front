import jsPDF from 'jspdf';

export function downloadPDF(data: any[], title: string): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 28, { align: 'center' });

  if (!data || data.length === 0) {
    doc.setFontSize(12);
    doc.text('Nenhum dado disponível para exportação.', pageWidth / 2, 40, { align: 'center' });
    doc.save(`${title}.pdf`);
    return;
  }

  const columns = Object.keys(data[0]);
  const headers = columns.map(col => col.charAt(0).toUpperCase() + col.slice(1));

  const rows = data.map(row =>
    columns.map(col => {
      const val = row[col];
      return val !== null && val !== undefined ? String(val) : '-';
    })
  );

  const colWidth = Math.min(40, (pageWidth - 20) / columns.length);

  let y = 38;
  const lineHeight = 8;

  doc.setFontSize(8);

  doc.setFillColor(0, 121, 107);
  doc.setTextColor(255, 255, 255);
  headers.forEach((h, i) => {
    doc.rect(10 + i * colWidth, y, colWidth, lineHeight, 'F');
    doc.text(h, 10 + i * colWidth + 1, y + 5);
  });
  y += lineHeight;

  doc.setTextColor(0, 0, 0);
  rows.forEach((row) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
      doc.setFillColor(0, 121, 107);
      doc.setTextColor(255, 255, 255);
      headers.forEach((h, i) => {
        doc.rect(10 + i * colWidth, y, colWidth, lineHeight, 'F');
        doc.text(h, 10 + i * colWidth + 1, y + 5);
      });
      y += lineHeight;
      doc.setTextColor(0, 0, 0);
    }

    row.forEach((cell, i) => {
      const display = cell.length > 20 ? cell.substring(0, 19) + '…' : cell;
      doc.text(display, 10 + i * colWidth + 1, y + 5);
    });
    y += lineHeight;
  });

  doc.save(`${title}.pdf`);
}
