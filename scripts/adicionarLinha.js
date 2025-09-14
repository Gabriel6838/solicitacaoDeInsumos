import { insumos } from './insumos.js';

export function adicionarLinha() {
  const tabela = document.querySelector('#tabela tbody');
  if (!tabela) return;

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td style="position:relative;">
      <input type="text" class="prod-search" placeholder="Digite para buscar..." autocomplete="off">
      <input type="hidden" class="unid-hidden">
      <input type="hidden" class="tipo-hidden">
      <ul class="dropdown"></ul>
    </td>
    <td><input type="number" class="qtd-input" min="0" style="width:100%;"></td>
    <td><input type="text" class="unid-display" disabled></td>
    <!-- Categoria não aparece na tela -->
  `;

  tabela.appendChild(tr);

  const input = tr.querySelector('.prod-search');
  const dropdown = tr.querySelector('.dropdown');
  const unidHidden = tr.querySelector('.unid-hidden');
  const tipoHidden = tr.querySelector('.tipo-hidden');
  const unidDisplay = tr.querySelector('.unid-display');

  function atualizarDropdown() {
    dropdown.innerHTML = '';
    const texto = input.value.trim().toLowerCase();

    const escolhidos = Array.from(document.querySelectorAll('#tabela .prod-search'))
      .filter(el => el !== input)
      .map(el => el.value.trim().toLowerCase())
      .filter(v => v);

    const filtrados = insumos.filter(i => {
      const nome = i.produto.toLowerCase();
      if (texto && !nome.includes(nome)) return false;
      if (escolhidos.includes(nome)) return false;
      return true;
    });

    if (filtrados.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    filtrados.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.produto;
      li.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        input.value = item.produto;
        unidHidden.value = item.unid;
        tipoHidden.value = item.tipo;
        unidDisplay.value = item.unid;
        // Dropdown desaparece imediatamente
        dropdown.style.display = 'none';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      dropdown.appendChild(li);
    });
    dropdown.style.display = 'block';
  }

  input.addEventListener('input', atualizarDropdown);
  input.addEventListener('blur', () => setTimeout(() => dropdown.style.display = 'none', 200));
}
