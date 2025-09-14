// scripts/gerarPdf.js

export function formatarDataHoje() {
  const d = new Date();
  const dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy} ${dias[d.getDay()]}`;
}

function coletarLinhasTabela(tabelaId) {
  const rows = [];
  document.querySelectorAll(`#${tabelaId} tbody tr`).forEach(tr => {
    const desc = tr.cells[0]?.querySelector('.prod-search')?.value?.trim() || '';
    const qtd  = tr.cells[1]?.querySelector('input')?.value || '';
    const unid = tr.cells[2]?.querySelector('input')?.value || tr.cells[2]?.textContent || '';

    // Ignora linhas sem descrição e quantidade
    if (!desc && !qtd) return;

    rows.push([desc, qtd, '', unid, '']); // Quantidade Separada e Check em branco
  });
  return rows;
}

function coletarLinhasFixos() {
  const rows = [];
  document.querySelectorAll('#tabelaFixos tbody tr').forEach(tr => {
    const desc = tr.cells[0]?.textContent?.trim() || '';
    const qtd  = tr.cells[1]?.querySelector('input')?.value || '';
    const unid = tr.cells[2]?.textContent || '';

    if (!desc && !qtd) return;

    rows.push([desc, qtd, '', unid, '']); // Check em branco
  });
  return rows;
}

export function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const usableWidth = pageWidth - margin*2;
  let cursorY = 40;

  const forno = document.getElementById('fornoNome')?.value || "Forno Não Definido";
  doc.setFontSize(18);
  doc.setFont("Courier", "normal");
  doc.text("SOLICITAÇÃO DE INSUMOS", pageWidth/2, cursorY, {align:'center'});
  cursorY += 20;
  doc.setFontSize(11);
  doc.text("Forno: " + forno, margin, cursorY);
  doc.text("Data: " + formatarDataHoje(), pageWidth - margin, cursorY, {align:'right'});
  cursorY += 18;

  const linhasCustom = coletarLinhasTabela('tabela');
  const linhasFixos  = coletarLinhasFixos();

  const colWidths = [
    0.45*usableWidth, // DESCRIÇÃO
    0.15*usableWidth, // QTD
    0.15*usableWidth, // Quantidade Separada
    0.15*usableWidth, // UNID
    0.10*usableWidth  // Check
  ];

  // Função para gerar tabela
  function gerarTabela(body, titulo) {
    if(body.length === 0) return;

    doc.setFontSize(12);
    doc.text(titulo, margin, cursorY);
    cursorY += 8;

    doc.autoTable({
      startY: cursorY + 6,
      head: [['DESCRIÇÃO','QTD.','Quantidade Separada','UNID.','Check']],
      body: body,
      styles: { font: "Courier", fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: colWidths[0] },
        1: { cellWidth: colWidths[1], halign:'center' },
        2: { cellWidth: colWidths[2], halign:'center' },
        3: { cellWidth: colWidths[3], halign:'center' },
        4: { cellWidth: colWidths[4], halign:'center' }
      },
      headStyles: { fillColor: [200,200,200], halign:'center', textColor: 0 },
      margin: { left: margin, right: margin },
      theme: 'grid',
      didDrawPage: function() {
        const str = "Página " + doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(str, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, {align:'right'});
      }
    });
    cursorY = doc.lastAutoTable.finalY + 20;
  }

  gerarTabela(linhasCustom, "Itens");
  gerarTabela(linhasFixos, "Sobras de Porcionados");

  doc.save('Solicitacao_Insumos.pdf');
}


