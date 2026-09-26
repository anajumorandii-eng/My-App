import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('cenas autorais do Lote 8 (séculos XIX e XX no mundo)', () => {
  it.each([
    ['summary-historia-europa-no-seculo-xix', /caminho da revolução.*reforma gradual/, 'Manifesto, 1848', 'Divisão estratégica', 'SPD: voto e negociação'],
    ['summary-historia-imperialismo-e-belle-epoque', /dominação direta francesa e dominação indireta britânica/, 'Conferência de Berlim, 1884–1885', 'Mesmo fenômeno', 'chefia local mantida'],
    ['summary-historia-primeira-guerra-mundial-1914-1918', /alianças rígidas.*Sarajevo como estopim/, 'Tríplice Entente', 'Sarajevo como estopim', 'causa suficiente'],
    ['summary-historia-o-periodo-entreguerras-1918-1939', /Crise de 1929.*apaziguamento/, 'outubro de 1929', 'Fracasso do apaziguamento', 'cada concessão encoraja a próxima exigência'],
    ['summary-historia-o-nazismo-na-alemanha', /só em combinação levam a 1933/, 'democracia alemã', 'Nenhum fator isolado', 'Lei de Plenos Poderes'],
    ['summary-historia-descolonizacao-afro-asiatica', /Índia em 1947.*Argélia até 1962/, 'maioria muçulmana', 'Trajetórias diversas', 'postura da metrópole +'],
    ['summary-historia-o-fim-da-guerra-fria', /não intervenção soviética.*dissolução da URSS em 1991/, 'Tchecoslováquia', 'Dissolução da URSS', '15 repúblicas'],
  ] as const)('desenha o mecanismo de %s e reage ao último recorte', async (chapterId, name, text, button, after) => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === chapterId)!;
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
