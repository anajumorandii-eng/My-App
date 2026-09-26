import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('Lote 5: população e cidade', () => {
  it.each([
    ['summary-geografia-dinamica-demografica', /curvas de natalidade e mortalidade e a pirâmide etária/, 'base larga, topo estreito', 'Fase 4', 'reposição'],
    ['geo-bonus-demografico', /mão de obra passa do primário ao secundário e ao terciário/, 'países pobres: mão de obra no primário', 'Setor terciário', 'desindustrialização precoce'],
    ['summary-geografia-o-espaco-urbano-i', /centros locais, centros sub-regionais, metrópoles regionais e metrópole nacional/, 'serviços básicos para', 'Metrópole nacional', 'economia global'],
    ['summary-geografia-o-espaco-urbano-ii', /periferia na encosta e centro com infraestrutura/, 'renda mais baixa', 'Violência urbana', 'mais exposição à violência'],
    ['summary-geografia-mobilidade-populacional', /fatores de expulsão na origem e de atração no destino/, 'a origem empurra', 'Combinação exigida', 'raramente um fator sozinho'],
    ['summary-geografia-as-redes-de-transportes', /rodoviário, ferroviário, hidroviário e aéreo/, 'mais de 60% da carga', 'Hidro/aéreo', 'o mais caro de todos'],
  ] as const)('desenha o mecanismo de %s', async (chapterId, name, text, button, after) => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === chapterId)!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name });
    expect(diagram).toHaveTextContent(text);
    const target = screen.getByRole('button', { name: button });
    await user.click(target);
    expect(target).toHaveAttribute('aria-pressed', 'true');
    expect(diagram).toHaveTextContent(after);
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(`recorte ${entry.items.length}`));
  });
});
