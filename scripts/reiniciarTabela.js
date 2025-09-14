// scripts/reiniciarTabela.js
import { adicionarLinha } from './adicionarLinha.js';

export function reiniciarTabelas() {
  if (!confirm("Deseja realmente reiniciar as tabelas e apagar os dados salvos?")) return;

  localStorage.removeItem('tabelaInsumos');
  localStorage.removeItem('tabelaFixos');

  // Limpar tabela custom
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';
  for (let i = 0; i < 3; i++) adicionarLinha();

  // Limpar tabela fixos
  document.querySelectorAll('#tabelaFixos tbody tr input.qtd-input').forEach(input => input.value = '');
}

