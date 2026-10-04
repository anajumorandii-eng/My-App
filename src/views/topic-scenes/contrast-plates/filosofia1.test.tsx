import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { filosofiaPlates1 } from './filosofia1';

const expectedMechanisms = [
  ['intuições', 'categorias', 'objeto conhecido'],
  ['testemunho', 'demonstração', 'vias distintas'],
  ['círculos desenhados', 'forma inteligível', 'participação'],
  ['sensação', 'ser percebido', 'feixe de percepções'],
  ['véu da ignorância', 'vínculos', 'deliberação'],
  ['fluxo', 'ser', 'potência', 'ato'],
  ['imparcialidade', 'aquisição', 'distribuição'],
  ['autonomia', 'cálculo instrumental', 'hierarquia colonial'],
];

describe('Oito pranchas filosóficas com operações próprias', () => {
  it.each(expectedMechanisms.map((words, index) => ({ words, index })))('mantém o mecanismo $index legível ao selecionar cada posição', ({ words, index }) => {
    const plate = filosofiaPlates1[index];
    expect(plate.positions).toHaveLength(3);
    expect(plate.context.length).toBeGreaterThan(70);
    for (const focus of [null, 0, 1, 2]) {
      const { container, unmount } = render(<svg>{plate.illustration(focus)}</svg>);
      for (const word of words) expect(container.textContent).toContain(word);
      expect(container.querySelectorAll('[data-contrast-mark]').length).toBeGreaterThanOrEqual(3);
      expect(container.querySelector('[opacity="0.32"]')).toBeNull();
      unmount();
    }
  });
});
