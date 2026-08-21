import * as XLSX from 'xlsx';

export function downloadExcel(data: Record<string, any>[], filename: string): void {
  if (!data.length) return;

  // 1. Tratamento e formatação dos dados antes de gerar a planilha
  const dadosFormatados = data.map(row => {
    const newRow: Record<string, any> = {};
    
    for (const key in row) {
      const val = row[key];
      
      if (val === null || val === undefined || val === '') {
        newRow[key] = '-';
      } 
      // Extrai propriedades vitais se for um objeto aninhado (Ex: paciente.nome)
      else if (typeof val === 'object' && !Array.isArray(val)) {
        newRow[key] = val.nome || val.descricao || val.titulo || 'Ver detalhes';
      } 
      // Formata as datas ISO vindas do backend
      else if (typeof val === 'string' && val.includes('T') && val.length >= 16) {
        const dateObj = new Date(val);
        if (!isNaN(dateObj.getTime())) {
          newRow[key] = dateObj.toLocaleDateString('pt-BR') + ' ' + 
                        dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else {
          newRow[key] = val;
        }
      } 
      // Dados primitivos seguem normalmente
      else {
        newRow[key] = val;
      }
    }
    return newRow;
  });

  // 2. Geração da Planilha usando os dados já limpos
  const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}