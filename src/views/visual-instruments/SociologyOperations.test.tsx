import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import chapters from '../../data/deepSummaryContent.json';
import { buildVisualMap } from '../../lib/visualStudy';
import { visualCandidates } from '../visualRepresentation';
import { TopicExperiment } from '../topic-experiments/TopicExperiment';
import { findInstrument } from './registry';
import { SOCIOLOGY_OPERATIONS, SociologyOperation, type SociologyOperationId } from './SociologyOperations';

vi.mock('../topic-scenes/useSceneMotion', () => ({ useSceneMotion: () => ({ duration: 0 }) }));
afterEach(cleanup);
const ids = Object.keys(SOCIOLOGY_OPERATIONS) as SociologyOperationId[];
const summaryOf = (id: SociologyOperationId) => interactiveSummaries.find(item => item.subject === 'Sociologia' && item.topic === SOCIOLOGY_OPERATIONS[id].topic)!;

describe('Sociologia H3: o conceito aplicado a casos do próprio capítulo', () => {
  it.each(ids)('%s abre a oficina própria e mantém o par dos nós 1 e 2', id => {
    const summary = summaryOf(id);
    if (id === 'solidarity-types') {
      expect(visualCandidates(summary)[0]).toEqual({ kind: 'experiment', id: 'solidarity' });
      render(<TopicExperiment summaryId={summary.id}/>);
      expect(document.querySelector('[data-operation="solidarity-types"]')).not.toBeNull();
      return;
    }
    expect(visualCandidates(summary)[0]).toEqual({ kind: 'instrument', id });
    const instrument = findInstrument(summary)!;
    expect(findInstrument({ ...summary, subject: 'Filosofia' })).toBeNull();
    const map = buildVisualMap(summary);
    const onSelect = vi.fn();
    const view = render(<instrument.Component map={map} states={{}} selectedId={map.nodes[1].id} onSelect={onSelect} hiddenEdgeIds={[]} mode="explorar"/>);
    expect(view.container.querySelector('[data-operation]')?.getAttribute('data-operation')).toBe(id);
    const left = view.container.querySelector('.vs-concept-card--expansion')!;
    expect(left.textContent).toContain(map.nodes[1].label);
    fireEvent.click(left);
    expect(onSelect).toHaveBeenCalledWith(map.nodes[1].id);
  });

  it.each(ids)('%s ancora cada estado no texto e muda o desenho', id => {
    const summary = summaryOf(id);
    const view = render(<SociologyOperation id={id}/>);
    const drawings = new Set<string>();
    for (const state of SOCIOLOGY_OPERATIONS[id].states) {
      const section = summary.sections.find(item => item.title === state.section)!;
      expect(section.content, state.anchor).toContain(state.anchor);
      fireEvent.click(screen.getByRole('button', { name: state.label }));
      expect(view.container.querySelector('.lf-reading')!.textContent).toContain(state.conclusion);
      drawings.add(view.container.querySelector('svg')!.innerHTML);
    }
    expect(drawings.size).toBe(SOCIOLOGY_OPERATIONS[id].states.length);
    expect(screen.getByText(/Casos didáticos autorais/)).toBeInTheDocument();
  });

  it('retirar um traço desfaz o fato social', () => {
    const view = render(<SociologyOperation id="social-fact"/>);
    expect(screen.getByText('Os três traços presentes: fato social.')).toBeInTheDocument();
    const before = view.container.querySelector('svg')!.innerHTML;
    fireEvent.click(screen.getByRole('button', { name: 'Coerção' }));
    // O veredito sozinho foi o defeito apontado: o desenho também precisa mudar.
    expect(view.container.querySelector('svg')!.innerHTML).not.toBe(before);
    expect(screen.getByRole('button', { name: 'Coerção' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/Falta coerção: não é fato social/)).toBeInTheDocument();
  });

  it('conexão sem as outras camadas não é inclusão', () => {
    render(<SociologyOperation id="information-society"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Uso crítico' }));
    expect(screen.getByText(/Há conexão, mas falta uso crítico/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Conexão' }));
    expect(screen.getByText(/Sem conexão: exclusão total/)).toBeInTheDocument();
  });

  it('reconhecer sem redistribuir deixa a justiça pela metade', () => {
    render(<SociologyOperation id="identity-difference"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Duas condições' }));
    fireEvent.click(screen.getByRole('button', { name: 'Redistribuição' }));
    expect(screen.getByText(/Só reconhecimento/)).toBeInTheDocument();
  });

  it('o lote tem sete capítulos revisados no padrão do aprofundamento', () => {
    for (const config of Object.values(SOCIOLOGY_OPERATIONS)) {
      const chapter = chapters.find(item => item.subject === 'Sociologia' && item.topic === config.topic)!;
      expect(chapter.rev).toBe(2);
      for (const section of chapter.sections) {
        expect(section.content.length).toBeGreaterThanOrEqual(900);
        expect(section.content.length).toBeLessThanOrEqual(1100);
      }
      expect(chapter.sections[3].content).toMatch(/6\./);
      expect(chapter.sections[4].content.match(/Resolução:/g)).toHaveLength(2);
    }
  });
});
