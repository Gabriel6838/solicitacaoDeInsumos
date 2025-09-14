// scripts/localStorage.js
import { adicionarLinha } from './adicionarLinha.js';

// Salvar tabela custom (incluindo categoria)
export function salvarTabelaCustom() {
  const dados = [];
  document.querySelectorAll('#tabela tbody tr').forEach(tr => {
    const produto = tr.querySelector('.prod-search')?.value || '';
    const qtd = tr.querySelector('.qtd-input')?.value || '';
    const unid = tr.querySelector('.unid-hidden')?.value || '';
    const tipo = tr.querySelector('.tipo-hidden')?.value || '';
    dados.push({ produto, qtd, unid, tipo });
  });
  localStorage.setItem('tabelaInsumos', JSON.stringify(dados));
}

// Salvar tabela fixos (categoria sempre "Porcionados")
export function salvarTabelaFixos() {
  const dados = [];
  document.querySelectorAll('#tabelaFixos tbody tr').forEach(tr => {
    const qtd = tr.querySelector('input.qtd-input')?.value || '';
    const desc = tr.cells[0]?.textContent || '';
    const tipo = 'Porcionados';
    dados.push({ desc, qtd, tipo });
  });
  localStorage.setItem('tabelaFixos', JSON.stringify(dados));
}

// Carregar tabelas
export function carregarTabelas() {
  const dadosCustom = JSON.parse(localStorage.getItem('tabelaInsumos') || '[]');
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';
  if (dadosCustom.length > 0) {
    dadosCustom.forEach(dado => {
      adicionarLinha();
      const ultima = tbody.lastChild;
      ultima.querySelector('.prod-search').value = dado.produto;
      ultima.querySelector('.qtd-input').value = dado.qtd;
      ultima.querySelector('.unid-hidden').value = dado.unid;
      ultima.querySelector('.tipo-hidden').value = dado.tipo;
      ultima.querySelector('.unid-display').value = dado.unid;
    });
  } else {
    for (let i = 0; i < 3; i++) adicionarLinha();
  }

  const dadosFixos = JSON.parse(localStorage.getItem('tabelaFixos') || '[]');
  dadosFixos.forEach((item, index) => {
    const tr = document.querySelectorAll('#tabelaFixos tbody tr')[index];
    if (tr) tr.querySelector('input.qtd-input').value = item.qtd;
  });
}

// Auto-save
document.addEventListener('input', () => {
  salvarTabelaCustom();
  salvarTabelaFixos();
});

// Carregar ao iniciar
window.addEventListener('load', carregarTabelas);


