import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import type { WritingInstrumentId } from '../../lib/writingInstrumentLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { writingInstrument } from './WritingInstrument';

const CHAPTERS: Array<[WritingInstrumentId, string]> = [
  ['essay-myths', 'summary-redacao-a-dissertacao-no-vestibular-mitos-e-verdades'],
  ['evaluation', 'summary-redacao-o-que-se-avalia-na-dissertacao-competencias-e-habilidades'],
  ['idea-map', 'summary-redacao-organizando-as-ideias-brainstorm-e-mind-maps'],
  ['repertoire', 'summary-redacao-repertorio-o-diferencial-de-redacoes-de-sucesso'],
  ['theme-axes', 'summary-redacao-qual-sera-o-tema-deste-ano-grandes-eixos-tematicos'],
  ['prompt-fit', 'summary-redacao-diferentes-graus-de-adequacao-a-proposta'],
  ['prompt-boundary', 'summary-redacao-tangenciamento-e-fuga-a-fronteira-do-tema'],
  ['genre-letter', 'summary-redacao-generos-e-sua-relacao-com-a-estrutura-do-texto'],
  ['genre-dissertation', 'summary-redacao-estrutura-classica-do-texto-dissertativo'],
  ['source-sense', 'summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-i'],
  ['source-visual', 'summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-ii'],
  ['source-authorship', 'summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-i'],
  ['source-dialogue', 'summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-ii'],
  ['repertoire-environment', 'summary-redacao-incrementando-o-repertorio-meio-ambiente'],
  ['repertoire-work', 'summary-redacao-incrementando-o-repertorio-educacao-e-trabalho'],
  ['repertoire-abstract', 'summary-redacao-incrementando-o-repertorio-temas-abstratos'],
  ['repertoire-body', 'summary-redacao-incrementando-o-repertorio-corpo-saude-e-sexualidade'],
  ['repertoire-violence', 'summary-redacao-incrementando-o-repertorio-violencia-leis-e-punicao'],
  ['repertoire-citizenship', 'summary-redacao-incrementando-o-repertorio-cidadania-e-poder'],
  ['repertoire-culture', 'summary-redacao-incrementando-o-repertorio-arte-cultura-e-relacoes-sociais'],
  ['repertoire-media', 'summary-redacao-incrementando-o-repertorio-midia-e-sociedade'],
  ['theme-environment', 'summary-redacao-analisando-tema-de-redacao-meio-ambiente'],
  ['theme-work', 'summary-redacao-analisando-tema-de-redacao-educacao-e-trabalho'],
  ['theme-abstract', 'summary-redacao-analisando-tema-abstrato-de-redacao'],
  ['theme-body', 'summary-redacao-analisando-tema-de-redacao-corpo-saude-e-sexualidade'],
  ['theme-violence', 'summary-redacao-analisando-tema-de-redacao-violencia-leis-e-punicao'],
  ['theme-citizenship', 'summary-redacao-analisando-tema-de-redacao-cidadania-e-poder'],
  ['theme-culture', 'summary-redacao-analisando-o-tema-de-redacao-arte-cultura-e-relacoes-sociais'],
  ['theme-media', 'summary-redacao-analisando-tema-de-redacao-midia-e-sociedade'],
];

function props(summaryId: string) {
  const summary = interactiveSummaries.find((item) => item.id === summaryId);
  if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos fundamentais de redação', () => {
  it('renderiza oficinas autorais com controle acessível', () => {
    for (const [id, summaryId] of CHAPTERS) {
      const Component = writingInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext');
      view.unmount();
    }
  });

  it('mostra quando o repertório passa de citação decorativa a evidência', () => {
    const Component = writingInstrument('repertoire');
    render(<Component {...props('summary-redacao-repertorio-o-diferencial-de-redacoes-de-sucesso')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getAllByText('repertório produtivo').length).toBeGreaterThan(0);
    expect(screen.getByText('explicar como a referência sustenta a tese')).toBeInTheDocument();
  });

  it('faz o diagnóstico mudar quando a tese se afasta do recorte', () => {
    const Component = writingInstrument('prompt-boundary');
    render(<Component {...props('summary-redacao-tangenciamento-e-fuga-a-fronteira-do-tema')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getAllByText('fora do alvo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('fuga temática: não há resposta à proposta').length).toBeGreaterThan(0);
  });
});
