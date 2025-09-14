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
        const desc = tr.cells[0]?.querySelector('.prod-search')?.value?.trim() || tr.cells[0]?.textContent?.trim() || '';
        const qtd  = tr.cells[1]?.querySelector('input')?.value || '0';
        const unid = tr.cells[2]?.querySelector('input')?.value || tr.cells[2]?.textContent || '';
        rows.push([desc, qtd, '', unid, '']); // Quantidade Separada fica em branco, Check em branco
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

    const forno = document.getElementById('fornoNome').value || "Forno Não Definido";

    // Título
    doc.setFontSize(18);
    doc.setFont("Courier", "normal");
    doc.text("SOLICITAÇÃO DE INSUMOS", pageWidth/2, cursorY, {align:'center'});
    cursorY += 20;
    doc.setFontSize(11);
    doc.text("Forno: " + forno, margin, cursorY);
    doc.text("Data: " + formatarDataHoje(), pageWidth - margin, cursorY, {align:'right'});
    cursorY += 18;

    // Linhas das tabelas
    const linhasCustom = coletarLinhasTabela('tabela');

    const colWidths = [
        0.35*usableWidth, 0.15*usableWidth, 0.15*usableWidth,
        0.15*usableWidth, 0.20*usableWidth
    ];

    // Tabela de itens
    doc.autoTable({
        startY: cursorY + 6,
        head: [['DESCRIÇÃO','QTD.','Quantidade Separada','UNID.','Check']],
        body: linhasCustom,
        styles: { font: "Courier", fontSize: 10, cellPadding: 4, textColor: 0 },
        headStyles: { fillColor: [200,200,200], textColor: 0, halign: 'center' },
        columnStyles: {
            0: {cellWidth: colWidths[0]},
            1: {cellWidth: colWidths[1], halign:'center'},
            2: {cellWidth: colWidths[2], halign:'center'},
            3: {cellWidth: colWidths[3], halign:'center'},
            4: {cellWidth: colWidths[4], halign:'center'}
        },
        margin:{left:margin,right:margin},
        theme:'grid',
    });

    cursorY = doc.lastAutoTable.finalY + 20;

    // Tabela de sobras
    doc.setFontSize(12);
    doc.text("Sobras de Porcionados", margin, cursorY);
    cursorY += 8;

    const linhasFixos = [];
    document.querySelectorAll('#tabelaFixos tbody tr').forEach(tr => {
        const desc = tr.cells[0]?.textContent?.trim() || '';
        const qtd  = tr.cells[1]?.querySelector('input')?.value || '0';
        const unid = tr.cells[2]?.textContent || '';
        linhasFixos.push([desc, qtd, '', unid, '']); // Check em branco
    });

    doc.autoTable({
        startY: cursorY + 6,
        head: [['DESCRIÇÃO','QTD.','Quantidade Separada','UNID.','Check']],
        body: linhasFixos,
        styles: { font: "Courier", fontSize: 10, cellPadding: 4, textColor: 0 },
        headStyles: { fillColor: [200,200,200], textColor: 0, halign: 'center' },
        columnStyles: {
            0: {cellWidth: colWidths[0]},
            1: {cellWidth: colWidths[1], halign:'center'},
            2: {cellWidth: colWidths[2], halign:'center'},
            3: {cellWidth: colWidths[3], halign:'center'},
            4: {cellWidth: colWidths[4], halign:'center'}
        },
        margin:{left:margin,right:margin},
        theme:'grid',
        didDrawPage: function() {
            const str = "Página " + doc.internal.getNumberOfPages();
            doc.setFontSize(9);
            doc.text(str, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, {align:'right'});
        }
    });

    doc.save('Solicitacao_Insumos.pdf');
}


