import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('cenas do Lote 18: globalização, redes, ordem internacional e União Europeia', () => {
  it.each([
    ['summary-geografia-globalizacao-e-processos-economicos-atuais', /cadeia global de valor do smartphone/i, 'Taiwan · Coreia do Sul', 'Críticas e reconfiguração', 'comércio: ainda elevado'],
    ['summary-geografia-geografia-das-redes-mundiais', /nós e vazios, a hierarquia das cidades globais/, 'longe no mapa, perto na rede', 'Data centers', 'países nórdicos'],
    ['summary-geografia-unilateralismo-e-multilateralismo', /um país que age sozinho, o mesmo país à mesa/, 'decide sem buscar consenso', 'Problema sem fronteira', 'nenhum país resolve sozinho'],
    ['summary-geografia-uniao-europeia', /CECA de 1951, Tratado de Maastricht de 1992/, 'Alemanha, França e mais 4 fundadores', 'Refugiados e Brexit', 'a primeira saída desde a fundação'],
  ] as const)('desenha o mecanismo de %s', async (chapterId, name, text, button, after) => {
    expect(sceneFor(chapterId), 'o lastro da entrada precisa bater com o resumo').not.toBeNull();
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
