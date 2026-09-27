import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopicScene } from '../TopicScene';
import { sceneFor } from '../sceneFor';
import { FISICA_FENOMENO_CENAS } from './FisicaFenomenos';

const ids = Object.keys(FISICA_FENOMENO_CENAS);

describe('FisicaFenomenos', () => {
  it('tem desenho para exatamente os rótulos que os dados do capítulo trazem', () => {
    // Rótulo sem desenho viraria quadro vazio; desenho sem rótulo, prancha
    // escrita e nunca vista.
    for (const id of ids) {
      const entry = sceneFor(id);
      expect(entry, id).not.toBeNull();
      expect(entry!.items.map((it) => it.label).sort(), id).toEqual([...FISICA_FENOMENO_CENAS[id].rotulos].sort());
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
});

