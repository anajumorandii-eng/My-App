import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { readingInstrument } from './ReadingInstrument';
import type { ReadingInstrumentId } from '../../lib/readingInstrumentLab';

const CHAPTERS: Array<[ReadingInstrumentId, string]> = [
  ['levels','summary-entendimento-de-texto-os-dois-niveis-da-leitura'], ['intertext','summary-entendimento-de-texto-intertextualidade-e-interdiscursividade'], ['genres','summary-entendimento-de-texto-generos-textuais'], ['narrative','summary-entendimento-de-texto-generos-narrativos-e-niveis-de-compreensao'], ['nonverbal','summary-entendimento-de-texto-generos-nao-verbais-fundamentos-de-leitura'], ['functions','summary-entendimento-de-texto-funcoes-da-linguagem'], ['poetic','summary-entendimento-de-texto-funcao-poetica-e-linguagem-literaria'], ['figures','summary-entendimento-de-texto-figuras-de-linguagem'], ['distortions','summary-entendimento-de-texto-modelos-de-leitura-e-distorcoes-interpretativas'], ['comic','summary-entendimento-de-texto-leitura-de-textos-comicos'], ['tdic','summary-entendimento-de-texto-tecnologias-digitais-da-informacao-e-comunicacao-tdic-impactos-sociais'],
];

function props(summaryId: string) { const summary = interactiveSummaries.find((item) => item.id === summaryId); if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`); return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }

describe('instrumentos de entendimento de texto', () => {
  it('dá a cada operação de leitura uma oficina e controle acessível', () => {
    for (const [id, summaryId] of CHAPTERS) { const Component = readingInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('img')).toHaveAccessibleName(); expect(screen.getByRole('slider')).toHaveAccessibleName(); view.unmount(); }
  });
  it('troca a leitura literal pela inferência apoiada em pistas', () => {
    const Component = readingInstrument('levels'); render(<Component {...props('summary-entendimento-de-texto-os-dois-niveis-da-leitura')} />); fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } }); expect(screen.getAllByText('inferencial').length).toBeGreaterThan(0); expect(screen.getByText('explicar quais marcas sustentam a inferência')).toBeInTheDocument();
  });
});
