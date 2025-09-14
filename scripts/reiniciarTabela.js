import { adicionarLinha } from './adicionarLinha.js';

export function reiniciarTabelas() {
  if (confirm("Deseja realmente reiniciar as tabelas e apagar os dados salvos?")) {
    localStorage.removeItem('tabelaInsumos');
    localStorage.removeItem('tabelaFixos');

    const tbody = document.querySelector('#tabela tbody');
    tbody.innerHTML = '';
    for (let i = 0; i < 3; i++) adicionarLinha();

    document.querySelectorAll('#tabelaFixos tbody tr input.qtd-input').forEach(input => input.value = '');
  }
}

document.getElementById('limparLinhaBtn').addEventListener('click', reiniciarTabelas);
document.getElementById('addLinhaBtn').addEventListener('click', () => adicionarLinha());

