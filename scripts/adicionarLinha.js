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
    <td><input type="text" class="tipo-display" disabled></td>
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

    // Itens já escolhidos
    const escolhidos = Array.from(document.querySelectorAll('#tabela .prod-search'))
      .filter(el => el !== input)
      .map(el => el.value.trim().toLowerCase())
      .filter(v => v);

    const filtrados = insumos.filter(i => {
      const nome = i.produto.toLowerCase();
      if (texto && !nome.includes(texto)) return false;
      if (escolhidos.includes(nome)) return false;
      return true;
    });

    if (filtrados.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    for (const item of filtrados) {
      const li = document.createElement('li');
      li.textContent = item.produto;

      li.addEventListener('click', () => {
        input.value = item.produto;
        unidHidden.value = item.unid;
        tipoHidden.value = item.tipo;
        unidDisplay.value = item.unid;
        tipoDisplay.value = item.tipo;

        // >>> FECHAR LISTA IMEDIATAMENTE <<<
        dropdown.innerHTML = '';
        dropdown.style.display = 'none';

        // dispara evento para salvar no localStorage
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      dropdown.appendChild(li);
    }

    dropdown.style.display = 'block';
  }

  input.addEventListener('input', atualizarDropdown);

  // só esconde ao sair, SE não escolher nada
  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) {
        dropdown.innerHTML = '';
        dropdown.style.display = 'none';
      }
    }, 150);
  });
}
