import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { ENTRIES_LOTE13 } from '../data/lote13';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';
import { SCENES_LOTE13, HEADERS_LOTE13 } from './HistoriaMundial';

describe('cenas autorais do Lote 13 (história mundial e colonial)', () => {
  it('toda entrada do lote tem lastro válido, cena e rótulo', () => {
    expect(ENTRIES_LOTE13).toHaveLength(7);
    for (const entry of ENTRIES_LOTE13) {
      expect(sceneFor(entry.chapterId), entry.chapterId).not.toBeNull();
      expect(SCENES_LOTE13[entry.chapterId], entry.chapterId).toBeDefined();
      expect(HEADERS_LOTE13[entry.chapterId], entry.chapterId).toBeTruthy();
    }
  });

  it('a linha das revoluções segue as datas: México antes da Rússia', () => {
    const entry = ENTRIES_LOTE13.find(item => item.chapterId === 'summary-historia-grandes-revolucoes-do-seculo-xx')!;
    expect(entry.items.map(item => item.label).slice(0, 3)).toEqual(['México, 1910', 'Rússia, 1917', 'China, 1949']);
  });

  it('a Segunda Guerra não traz batalha que o resumo não cita', () => {
    const entry = ENTRIES_LOTE13.find(item => item.chapterId === 'summary-historia-segunda-guerra-mundial-1939-1945')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Segunda Guerra Mundial/ });
    expect(diagram.textContent).not.toMatch(/Normandia|Midway|Atlântico/);
  });

  it.each([
    ['summary-historia-introducao-a-historia-e-primeiras-civilizacoes', /excedente.*Tigre e Eufrates.*Nilo/, 'cuneiforme', 'Vale do Nilo', 'previsíveis'],
    ['summary-historia-america-no-seculo-xix', /fragmentação da América hispânica/, 'Bolívar:', 'Neocolonialismo', 'Reino Unido'],
    ['summary-historia-grandes-revolucoes-do-seculo-xx', /México 1910, Rússia 1917, China 1949/, 'Constituição 1917', 'Cidade ou campo', 'operariado urbano × campesinato'],
    ['summary-historia-segunda-guerra-mundial-1939-1945', /blitzkrieg.*Pearl Harbor/, 'Stalingrado', 'Mundo do pós-guerra', '70 a 85 milhões de mortos'],
    ['summary-historia-guerra-fria', /Otan e Pacto de Varsóvia/, 'Muro de Berlim · 1961', 'Não alinhados', 'Nehru · Sukarno · Nasser'],
    ['summary-historia-america-latina-no-seculo-xx', /Operação Condor/, 'populismos · 1930–1960', 'Duas saídas', 'Malvinas 1982'],
    ['summary-historia-disputas-europeias-no-brasil-colonial', /França Antártica.*Caribe/, 'União Ibérica 1580–1640', 'Expulsão e Caribe', 'nasce um concorrente'],
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
