import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { visualCandidates } from '../visualRepresentation';
import { TopicExperiment } from '../topic-experiments/TopicExperiment';
import { findInstrument } from './registry';
import { PHILOSOPHY_OPERATIONS, PhilosophyOperation, type PhilosophyOperationId } from './PhilosophyOperations';

vi.mock('../topic-scenes/useSceneMotion', () => ({ useSceneMotion: () => ({ duration: 0 }) }));
afterEach(cleanup);
const ids = Object.keys(PHILOSOPHY_OPERATIONS) as PhilosophyOperationId[];
const summaryOf = (id: PhilosophyOperationId) => interactiveSummaries.find(item => item.subject === 'Filosofia' && item.topic === PHILOSOPHY_OPERATIONS[id].topic)!;

describe('Filosofia: o argumento desenhado a partir do próprio resumo', () => {
  it.each(ids)('%s abre a oficina própria e mantém o par dos nós 1 e 2', async id => {
    const summary = summaryOf(id);
    if (id === 'myth-logos') {
      expect(visualCandidates(summary)[0]).toEqual({ kind: 'experiment', id: 'myth' });
      render(<TopicExperiment summaryId={summary.id}/>);
      expect(document.querySelector('[data-operation="myth-logos"]')).not.toBeNull();
      return;
    }
    expect(visualCandidates(summary)[0]).toEqual({ kind: 'instrument', id });
    const instrument = findInstrument(summary)!;
    expect(findInstrument({ ...summary, subject: 'Sociologia' })).toBeNull();
    const map = buildVisualMap(summary);
    const onSelect = vi.fn();
    const view = render(<instrument.Component map={map} states={{}} selectedId={map.nodes[1].id} onSelect={onSelect} hiddenEdgeIds={[]} mode="explorar"/>);
    await act(async () => { await vi.dynamicImportSettled(); });
    await waitFor(() => expect(view.container.querySelector('[data-operation]')?.getAttribute('data-operation')).toBe(id));
    const left = view.container.querySelector('.vs-concept-card--expansion')!;
    expect(left.textContent).toContain(map.nodes[1].label);
    fireEvent.click(left);
    expect(onSelect).toHaveBeenCalledWith(map.nodes[1].id);
  });

  it.each(ids)('%s cita o resumo literalmente e muda o desenho a cada passo', id => {
    const summary = summaryOf(id);
    const view = render(<PhilosophyOperation id={id}/>);
    const drawings = new Set<string>();
    for (const state of PHILOSOPHY_OPERATIONS[id].states) {
      const section = summary.sections.find(item => item.title === state.section)!;
      expect(section.content, state.anchor).toContain(state.anchor);
      fireEvent.click(screen.getByRole('button', { name: state.label }));
      expect(view.container.querySelector('.lf-reading')!.textContent).toContain(state.conclusion);
      drawings.add(view.container.querySelector('svg')!.innerHTML);
    }
    expect(drawings.size).toBe(PHILOSOPHY_OPERATIONS[id].states.length);
  });

  it('o meio-termo se desloca com a situação, sem virar degrau rumo ao excesso', () => {
    const view = render(<PhilosophyOperation id="golden-mean"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Meio contextual' }));
    const before = view.container.querySelector('svg')!.innerHTML;
    fireEvent.click(screen.getByRole('button', { name: 'Ver como pedestre' }));
    expect(view.container.querySelector('svg')!.innerHTML).not.toBe(before);
    expect(screen.getByText(/pedestre sem preparo: seria temeridade/)).toBeInTheDocument();
  });

  it('o comerciante por reputação muda com o lucro; o por dever, não', () => {
    const view = render(<PhilosophyOperation id="kant-duty"/>);
    const before = view.container.querySelector('svg')!.innerHTML;
    fireEvent.click(screen.getByRole('button', { name: 'Tornar o engano mais lucrativo' }));
    expect(view.container.querySelector('svg')!.innerHTML).not.toBe(before);
    expect(screen.getByText('passa a enganar')).toBeInTheDocument();
  });

  it('a consciência de classe reorganiza os mesmos trabalhadores', () => {
    render(<PhilosophyOperation id="class-struggle"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Em si → para si' }));
    expect(screen.getByText('classe em si: dispersa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Formar consciência de classe' }));
    expect(screen.getByText('classe para si: organizada')).toBeInTheDocument();
  });

  it('a dúvida derruba um bloco por grau e o cogito resta', () => {
    const view = render(<PhilosophyOperation id="cartesian-doubt"/>);
    const struck = () => view.container.querySelectorAll('text[text-decoration="line-through"]').length;
    expect(struck()).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'Sonho' }));
    expect(struck()).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: 'Cogito' }));
    expect(struck()).toBe(3);
    expect(screen.getByText('penso, logo existo', { selector: 'text' })).toBeInTheDocument();
  });
});
