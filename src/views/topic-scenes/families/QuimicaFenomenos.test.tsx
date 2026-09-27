import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopicScene } from '../TopicScene';
import { sceneFor } from '../sceneFor';
import { QUIMICA_FENOMENO_CENAS, QUIMICA_FENOMENO_TESTE } from './QuimicaFenomenos';

const ids = Object.keys(QUIMICA_FENOMENO_CENAS);

describe('QuimicaFenomenos', () => {
  it('tem desenho para exatamente os rótulos que os dados do capítulo trazem', () => {
    // Rótulo sem desenho viraria quadro vazio; desenho sem rótulo, prancha
    // escrita e nunca vista.
    for (const id of ids) {
      const entry = sceneFor(id);
      expect(entry, id).not.toBeNull();
      expect(entry!.items.map((it) => it.label).sort(), id).toEqual([...QUIMICA_FENOMENO_CENAS[id].rotulos].sort());
    }
  });

  it('abre desenho em SVG, não cartões, e troca o caso selecionado', () => {
    for (const id of ids) {
      const entry = sceneFor(id)!;
      const view = render(<TopicScene summaryId={id} />);
      expect(view.container.querySelector('.qf-scene svg')).not.toBeNull();
      const ultimo = entry.items.at(-1)!;
      fireEvent.click(screen.getByRole('button', { name: ultimo.label }));
      expect(screen.getByRole('status')).toHaveTextContent(ultimo.claim);
      expect(screen.getByRole('img', { name: new RegExp(`^${ultimo.label}:`) })).toBeInTheDocument();
      view.unmount();
    }
  });

  it('só desenha os elétrons de valência que a citação de cada família dá', () => {
    const entry = sceneFor('summary-quimica-organizacao-da-tabela-periodica-dos-elementos')!;
    const porExtenso: Record<number, string> = { 1: 'apenas um elétron', 2: 'dois elétrons', 7: 'sete elétrons', 8: 'oito elétrons' };
    for (const it of entry.items) {
      const n = QUIMICA_FENOMENO_TESTE.VALENCIA[it.label];
      expect(it.quote, it.label).toContain(porExtenso[n]);
    }
  });
});
