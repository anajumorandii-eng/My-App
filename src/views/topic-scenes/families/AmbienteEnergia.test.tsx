import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { ENTRIES_LOTE17 } from '../data/lote17';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';
import { SCENES_LOTE17, HEADERS_LOTE17 } from './AmbienteEnergia';

describe('cenas do Lote 17: ambiente e energia', () => {
  it.each(ENTRIES_LOTE17.map(entry => [entry.chapterId] as const))('%s tem lastro válido, cena e cabeçalho', chapterId => {
    expect(sceneFor(chapterId)).not.toBeNull();
    expect(SCENES_LOTE17[chapterId]).toBeDefined();
    expect(HEADERS_LOTE17[chapterId]).toBeTruthy();
  });

  it.each([
    ['summary-geografia-desafios-ambientais-do-seculo-xxi', /Desafios ambientais do século XXI/, 'um aquecimento, efeitos diferentes', 'Responsabilidade histórica', 'justiça × urgência'],
    ['summary-geografia-geopolitica-ambiental', /Geopolítica ambiental/, 'sumidouro de carbono', 'Ártico em degelo', 'países nórdicos'],
    ['summary-geografia-politicas-ambientais-brasileiras', /Políticas ambientais brasileiras/, 'margem de rio', 'Lei × fiscalização', 'sem vontade política, a lei não basta'],
    ['summary-geografia-matriz-energetica', /Matriz energética/, 'tomada ≠ tanque', 'Transição muda o poder', 'lítio, cobalto, níquel, terras-raras'],
    ['summary-geografia-energia-eletrica-no-mundo', /Energia elétrica no mundo/, 'fósseis: cerca de 60%', 'China: os dois ao mesmo tempo', 'novas usinas para a demanda'],
    ['summary-geografia-producao-mineral', /Produção mineral/, 'Carajás (PA)', 'Garimpo e mercúrio', 'ouro "esquentado"'],
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

  it('a matriz energética não oferece controle para arrastar a participação fóssil', () => {
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-matriz-energetica')!;
    const { container } = render(<HistoriaGeografia entry={entry} />);
    expect(container.querySelector('input')).toBeNull();
  });
});
