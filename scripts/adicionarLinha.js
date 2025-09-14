// scripts/adicionarLinha.js
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
    <td><input type="number" class="qtd-input" min="0"></td>
    <td><input type="text" class="unid-display" disabled></td>
    <td style="display:none;"><input type="text" class="tipo-display" disabled></td>
  `;

  tabela.appendChild(tr);

  const input = tr.querySelector('.prod-search');
  const dropdown = tr.querySelector('.dropdown');
  const unidHidden = tr.querySelector('.unid-hidden');
  const tipoHidden = tr.querySelector('.tipo-hidden');
  const unidDisplay = tr.querySelector('.unid-display');
  const tipoDisplay = tr.querySelector('.tipo-display');

  function atualizarDropdown() {
    dropdown.innerHTML = '';
    const texto = input.value.trim().toLowerCase();

    const escolhidos = Array.from(document.querySelectorAll('#tabela .prod-search'))
      .filter(el => el !== input)
      .map(el => el.value.trim().toLowerCase())
      .filter(v => v);

    const filtrados = insumos.filter(i => {
      const nome = i.produto.toLowerCase();
      return (!texto || nome.includes(texto)) && !escolhidos.includes(nome);
    });

    if (filtrados.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    filtrados.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.produto;

      // Aqui é que sumirá imediatamente ao clicar
      li.addEventListener('mousedown', ev => {
        ev.preventDefault(); // evita blur antes do mousedown
        input.value = item.produto;
        unidHidden.value = item.unid;
        tipoHidden.value = item.tipo;
        unidDisplay.value = item.unid;
        tipoDisplay.value = item.tipo;

        // ✅ força desaparecer imediatamente
        dropdown.style.display = 'none';

        // remove todos os listeners pendentes para blur que possam reabrir
        input.blur();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      dropdown.appendChild(li);
    });

    dropdown.style.display = 'block';
  }

  input.addEventListener('input', atualizarDropdown);

  // mantém um timeout curto para desaparecer quando sair do input
  input.addEventListener('blur', () => setTimeout(() => dropdown.style.display = 'none', 100));
}

