import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ENTRIES_LOTE14 } from '../data/lote14';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';
import { HEADERS_LOTE14, SCENES_LOTE14 } from './BrasilRepublica';

describe('Lote 14: Brasil República', () => {
  it('mantém os seis capítulos com lastro e cena própria', () => {
    expect(ENTRIES_LOTE14).toHaveLength(6);
    for (const entry of ENTRIES_LOTE14) {
      expect(sceneFor(entry.chapterId), entry.chapterId).not.toBeNull();
      expect(SCENES_LOTE14[entry.chapterId], entry.chapterId).toBeDefined();
      expect(HEADERS_LOTE14[entry.chapterId], entry.chapterId).toBeTruthy();
    }
  });

  it('mostra que Diretas Já não levou à eleição direta em 1985', async () => {
    const entry = ENTRIES_LOTE14.find(item => item.chapterId === 'summary-historia-regime-militar-1964-1985-ii')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Regime Militar II/ });
    const diretas = screen.getByRole('button', { name: 'Diretas Já' });
    await userEvent.setup().click(diretas);
    expect(diretas).toHaveAttribute('aria-pressed', 'true');
    expect(diagram).toHaveTextContent('Emenda Dante de Oliveira');
    expect(diagram).toHaveTextContent('rejeitada por margem estreita');
  });
});
