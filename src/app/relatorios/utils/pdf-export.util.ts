import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadPDF(data: any[], title: string): void {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cabeçalho e Título
  doc.setFontSize(18);
  doc.setTextColor(0, 121, 107);
  doc.text(title, pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dataExportacao = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerado em: ${dataExportacao}`, pageWidth / 2, 23, { align: 'center' });

  if (!data || data.length === 0) {
    doc.text('Nenhum dado disponível.', pageWidth / 2, 40, { align: 'center' });
    doc.save(`${title}.pdf`);
    return;
  }

  // 1. Configuração Dinâmica de Colunas
  let colunasChave: string[] = [];
  let headers: string[] = [];

  const relatorioTitle = title.toLowerCase();

  // Configuração Específica por Relatório (Pode adicionar os seus outros aqui)
  if (relatorioTitle.includes('paciente')) {
    colunasChave = ['id', 'nome', 'cpf', 'telefone', 'raca', 'genero'];
    headers = ['ID', 'Nome Completo', 'CPF', 'Telefone', 'Raça', 'Gênero'];
    
  } else if (relatorioTitle.includes('agendamento')) {
    // Agora podemos incluir a coluna "paciente" que é um objeto!
    colunasChave = ['id', 'paciente', 'tipoComunicacao', 'dataHoraAtendimento', 'destinatario'];
    headers = ['ID', 'Paciente', 'Comunicação', 'Data/Hora', 'Destinatário'];
    
  } else {
    // Fallback: Removemos o bloqueio de objetos! Pega as 7 primeiras chaves.
    colunasChave = Object.keys(data[0]).slice(0, 7);
    headers = colunasChave.map(col => col.charAt(0).toUpperCase() + col.slice(1));
  }

  // 2. Extração Inteligente de Dados
  const rows = data.map(row =>
    colunasChave.map(col => {
      const val = row[col];

      // Cenário A: Vazio ou Nulo
      if (val === null || val === undefined || val === '') return '-';

      // Cenário B: O dado é um Objeto Aninhado (Ex: paciente: { nome: 'Alexsander' })
      if (typeof val === 'object') {
        if (Array.isArray(val)) return `[ ${val.length} itens ]`;
        
        // Tenta achar o nome ou identificador dentro do objeto
        if (val.nome) return String(val.nome);
        if (val.descricao) return String(val.descricao);
        if (val.titulo) return String(val.titulo);
        if (val.logradouro) return `${val.logradouro}, ${val.numero || 'S/N'}`;
        if (val.id) return `Ref. ID: ${val.id}`; // Fallback para ID
        
        return 'Item Vinculado';
      }

      // Cenário C: Formatação automática de Data e Hora do Spring Boot (ISO 8601)
      // Ex: "2026-06-22T09:02:00" -> "22/06/2026 09:02"
      if (typeof val === 'string' && val.includes('T') && val.length >= 16) {
        const dataFormatada = new Date(val);
        if (!isNaN(dataFormatada.getTime())) {
          return dataFormatada.toLocaleDateString('pt-BR') + ' ' + 
                 dataFormatada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
      }

      // Cenário D: Dados primitivos normais (String, Number, Boolean)
      return String(val);
    })
  );

  // 3. Geração da Tabela
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 32,
    theme: 'grid', 
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [50, 50, 50],
    },
    headStyles: {
      fillColor: [0, 121, 107],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 } // ID centralizado
    }
  });

  doc.save(`${title}.pdf`);
}