export function downloadCSV(data: Record<string, any>[], filename: string): void {
  if (!data.length) return;

  // 1. Função auxiliar para extrair texto de objetos e formatar datas
  const formatarValor = (val: any) => {
    if (val === null || val === undefined || val === '') return '-';
    
    if (typeof val === 'object' && !Array.isArray(val)) {
      return val.email || val.descricao || val.titulo || 'Ver detalhes';
    }
    
    if (typeof val === 'string' && val.includes('T') && val.length >= 16) {
      const dateObj = new Date(val);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('pt-BR') + ' ' + 
               dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      }
    }
    
    return val;
  };

  const headers = Object.keys(data[0]);
  
  // 2. O escape agora stringifica o valor após passar pela formatação
  const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  // 3. Montagem do CSV interceptando o valor original da linha com o formatarValor()
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => escape(formatarValor(row[h]))).join(','))
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