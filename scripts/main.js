// scripts/main.js
import { adicionarLinha } from './adicionarLinha.js';
import { carregarTabelas, salvarTabelaCustom, salvarTabelaFixos } from './localStorage.js';
import { reiniciarTabelas } from './reiniciarTabela.js';
import { gerarPDF } from './gerarPdf.js';

window.addEventListener('DOMContentLoaded', () => {
  // carregar dados salvos (ou criar 3 linhas vazias)
  carregarTabelas();

  // botões
  const addBtn = document.getElementById('addLinhaBtn');
  const limparBtn = document.getElementById('limparLinhaBtn');
  const gerarBtn = document.getElementById('gerarPdfBtn');

  if (addBtn) addBtn.addEventListener('click', () => {
    adicionarLinha();
    // opcional: focar no último input
    const ultima = document.querySelector('#tabela tbody tr:last-child .prod-search');
    if (ultima) ultima.focus();
  });

  if (limparBtn) limparBtn.addEventListener('click', reiniciarTabelas);
  if (gerarBtn) gerarBtn.addEventListener('click', gerarPDF);

  // salvar automaticamente ao alterar
  document.addEventListener('input', () => {
    salvarTabelaCustom();
    salvarTabelaFixos();
  });
});
