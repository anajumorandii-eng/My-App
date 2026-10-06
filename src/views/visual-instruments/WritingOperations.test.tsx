import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import chapters from '../../data/deepSummaryContent.json';
import { buildVisualMap } from '../../lib/visualStudy';
import { visualCandidates } from '../visualRepresentation';
import { findInstrument } from './registry';
import { WRITING_OPERATIONS, WritingOperation, type WritingOperationId } from './WritingOperations';

vi.mock('../topic-scenes/useSceneMotion', () => ({ useSceneMotion: () => ({ duration: 0 }) }));
afterEach(cleanup);
const ids = Object.keys(WRITING_OPERATIONS) as WritingOperationId[];
const summaryOf = (id: WritingOperationId) => interactiveSummaries.find(item => item.subject === 'Redação' && item.topic === WRITING_OPERATIONS[id].topic)!;

describe('Redação R1: repertório e análise de tema com o caso do próprio capítulo', () => {
  it.each(ids)('%s abre a oficina própria e mantém o par dos nós 1 e 2', id => {
    const summary = summaryOf(id);
    const candidate = visualCandidates(summary)[0];
    expect(candidate.kind).toBe('instrument');
    const instrument = findInstrument(summary)!;
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
    const view = render(<WritingOperation id={id}/>);
    const drawings = new Set<string>();
    for (const state of WRITING_OPERATIONS[id].states) {
      const section = summary.sections.find(item => item.title === state.section)!;
      expect(section.content, state.anchor).toContain(state.anchor);
      fireEvent.click(screen.getByRole('button', { name: state.label }));
      expect(view.container.querySelector('.lf-reading')!.textContent).toContain(state.conclusion);
      drawings.add(view.container.querySelector('svg')!.innerHTML);
    }
    expect(drawings.size).toBe(WRITING_OPERATIONS[id].states.length);
  });

  it('o conceito escolhido redesenha o mesmo caso', () => {
    const view = render(<WritingOperation id="rep-environment"/>);
    const before = view.container.querySelector('svg')!.innerHTML;
    fireEvent.click(screen.getByRole('button', { name: 'Justiça ambiental' }));
    // Trocar só o ícone do domínio foi o achado: a leitura do caso tem de mudar.
    expect(view.container.querySelector('svg')!.innerHTML).not.toBe(before);
    expect(screen.getByText('o dano cai nos mais pobres')).toBeInTheDocument();
  });

  it('cada elemento retirado da intervenção aparece como vaga vazia', () => {
    const view = render(<WritingOperation id="theme-violence"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Intervenção' }));
    expect(screen.getByText('Cinco elementos válidos: proposta completa.')).toBeInTheDocument();
    const before = view.container.querySelector('svg')!.innerHTML;
    fireEvent.click(screen.getByRole('button', { name: 'Agente' }));
    fireEvent.click(screen.getByRole('button', { name: 'Meio' }));
    expect(view.container.querySelector('svg')!.innerHTML).not.toBe(before);
    expect(screen.getByText(/3 de 5: falta agente, meio/)).toBeInTheDocument();
  });

  it('os dezesseis capítulos estão revisados no padrão do aprofundamento', () => {
    for (const config of Object.values(WRITING_OPERATIONS)) {
      const chapter = chapters.find(item => item.subject === 'Redação' && item.topic === config.topic)!;
      expect(chapter.rev).toBe(2);
      for (const section of chapter.sections) {
        expect(section.content.length).toBeGreaterThanOrEqual(900);
        expect(section.content.length).toBeLessThanOrEqual(1100);
      }
      expect(chapter.sections[3].content).toMatch(/6\./);
      expect(chapter.sections[4].content.match(/Resolução:/g)).toHaveLength(2);
    }
  });

  it('cidadania regulada é atribuída a Wanderley Guilherme dos Santos', () => {
    const chapter = chapters.find(item => item.topic === 'Incrementando o Repertório: Cidadania e Poder')!;
    // O texto antigo creditava o conceito a José Murilo de Carvalho, que o usa
    // na leitura histórica mas não o formulou.
    expect(chapter.sections[4].content).toContain('descrito por Wanderley Guilherme dos Santos');
  });
});
