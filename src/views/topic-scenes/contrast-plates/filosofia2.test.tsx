import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { filosofiaPlates2 } from './filosofia2';

const operations = [
  ['condensação', 'rarefação'],
  ['fria para Lia', 'agradável para Rui'],
  ['princípios em conflito', 'bem devido ausente'],
  ['bem comum', 'interesse do governante'],
  ['sem transmissão causal', 'coordenação prévia'],
  ['recusa informada', 'benefício esperado'],
  ['necessário: 4 h', 'excedente: 6 h', 'necessário: 2 h'],
  ['proibir', 'classificar', 'normalizar'],
];

describe('Pranchas concretas de Filosofia — segunda frente', () => {
  it('tem oito mecanismos originais e três leituras na ordem das posições', () => {
    expect(filosofiaPlates2).toHaveLength(8);
    expect(new Set(filosofiaPlates2.map(p => p.chapterId)).size).toBe(8);
    for (const plate of filosofiaPlates2) {
      expect(plate.positions).toHaveLength(3);
      expect(plate.context.length).toBeGreaterThan(60);
      expect(plate.annotation.length).toBeGreaterThan(40);
      expect(plate.positions.every(p => p.reading.length > 70 && p.focus.length > 0)).toBe(true);
    }
  });
  it.each(operations.map((labels, i) => [i, labels] as const))('mantém as operações visíveis em todos os focos da prancha %i', (i, labels) => {
    for (const focus of [null, 0, 1, 2]) {
      const { container, unmount } = render(<svg>{filosofiaPlates2[i].illustration(focus)}</svg>);
      labels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument());
      expect(container.querySelector('[opacity="0.32"]')).toBeNull();
      const marks = [...container.querySelectorAll('[data-contrast-mark]')].map(e => e.getAttribute('data-contrast-mark'));
      filosofiaPlates2[i].positions.forEach(p => p.focus.forEach(mark => expect(marks).toContain(mark)));
      unmount();
    }
  });
});
