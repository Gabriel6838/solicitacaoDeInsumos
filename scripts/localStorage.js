// scripts/localStorage.js
import { adicionarLinha } from './adicionarLinha.js';

export function salvarTabelaCustom() {
  const dados = [];
  document.querySelectorAll('#tabela tbody tr').forEach(tr => {
    const produto = tr.querySelector('.prod-search')?.value || '';
    const qtd = tr.querySelector('.qtd-input')?.value || '';
    const unid = tr.querySelector('.unid-hidden')?.value || '';
    const tipo = tr.querySelector('.tipo-hidden')?.value || '';
    // só salvar linhas vazias se precisar, aqui salvo tudo
    dados.push({ produto, qtd, unid, tipo });
  });
  localStorage.setItem('tabelaInsumos', JSON.stringify(dados));
}

export function salvarTabelaFixos() {
  const dados = [];
  document.querySelectorAll('#tabelaFixos tbody tr').forEach(tr => {
    const qtd = tr.querySelector('input.qtd-input')?.value || '';
    const desc = tr.cells[0]?.textContent.trim() || '';
    dados.push({ desc, qtd });
  });
  localStorage.setItem('tabelaFixos', JSON.stringify(dados));
}

export function carregarTabelas() {
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  const dadosCustom = JSON.parse(localStorage.getItem('tabelaInsumos') || '[]');
  if (dadosCustom.length > 0) {
    for (const d of dadosCustom) {
      adicionarLinha();
      const ultima = tbody.lastElementChild;
      ultima.querySelector('.prod-search').value = d.produto || '';
      ultima.querySelector('.qtd-input').value = d.qtd || '';
      ultima.querySelector('.unid-hidden').value = d.unid || '';
      ultima.querySelector('.tipo-hidden').value = d.tipo || '';
      ultima.querySelector('.unid-display').value = d.unid || '';
      ultima.querySelector('.tipo-display').value = d.tipo || '';
    }
  } else {
    // 3 linhas iniciais
    for (let i = 0; i < 3; i++) adicionarLinha();
  }

  const dadosFixos = JSON.parse(localStorage.getItem('tabelaFixos') || '[]');
  if (dadosFixos.length > 0) {
    document.querySelectorAll('#tabelaFixos tbody tr').forEach((tr, idx) => {
      if (dadosFixos[idx]) tr.querySelector('input.qtd-input').value = dadosFixos[idx].qtd || '';
    });
  }
}
