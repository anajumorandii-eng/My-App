import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import chapters from '../../data/deepSummaryContent.json';
import { buildVisualMap } from '../../lib/visualStudy';
import { visualCandidates } from '../visualRepresentation';
import { TopicExperiment } from '../topic-experiments/TopicExperiment';
import { findInstrument } from './registry';
import { LITERATURE_FOUNDATIONS, LiteratureOperation, type LiteratureFoundationId } from './LiteratureFoundations';

vi.mock('../topic-scenes/useSceneMotion', () => ({ useSceneMotion: () => ({ duration: 0 }) }));
afterEach(cleanup);
const ids = Object.keys(LITERATURE_FOUNDATIONS) as LiteratureFoundationId[];

describe('fundamentos de Literatura: operações sustentadas pelo capítulo', () => {
  it.each(ids)('%s chega à operação própria e mantém os conceitos selecionáveis', id => {
    const config = LITERATURE_FOUNDATIONS[id];
    const summary = interactiveSummaries.find(item => item.subject === 'Literatura' && item.topic === config.topic)!;
    expect(visualCandidates(summary)[0]).toEqual(id === 'literary-text' ? { kind: 'experiment', id: 'literary' } : { kind: 'instrument', id });
    if (id === 'literary-text') {
      render(<TopicExperiment summaryId={summary.id}/>);
      expect(document.querySelector('[data-literature-operation="literary-text"]')).not.toBeNull();
      return;
    }
    const instrument = findInstrument(summary)!;
    expect(findInstrument({ ...summary, subject: 'História' })).toBeNull();
    expect(findInstrument({ ...summary, topic: `${summary.topic} extra`, title: `${summary.title} extra` })).toBeNull();
    const map = buildVisualMap(summary);
    const onSelect = vi.fn();
    const view = render(<instrument.Component map={map} states={{}} selectedId={map.nodes[1].id} onSelect={onSelect} hiddenEdgeIds={[]} mode="explorar"/>);
    expect(view.container.querySelector('[data-literature-operation]')?.getAttribute('data-literature-operation')).toBe(id);
    const left = view.container.querySelector('.vs-concept-card--expansion')!;
    expect(left.textContent).toContain(map.nodes[1].label);
    fireEvent.click(left);
    expect(onSelect).toHaveBeenCalledWith(map.nodes[1].id);
  });

  it.each(ids)('%s muda o objeto demonstrado, além da leitura auxiliar', id => {
    const config = LITERATURE_FOUNDATIONS[id];
    const summary = interactiveSummaries.find(item => item.subject === 'Literatura' && item.topic === config.topic)!;
    const view = render(<LiteratureOperation id={id}/>);
    const drawings = new Set<string>();
    for (const state of config.states) {
      const section = summary.sections.find(item => item.title === state.section)!;
      expect(section.content, state.anchor).toContain(state.anchor);
      fireEvent.click(screen.getByRole('button', { name: state.label }));
      expect(screen.getByRole('button', { name: state.label })).toHaveAttribute('aria-pressed', 'true');
      expect(view.container.querySelector('.lf-reading')!.textContent).toContain(state.conclusion);
      // O nome acessível não basta: o desenho/texto interno também deve mudar.
      drawings.add(view.container.querySelector('svg')!.innerHTML);
    }
    expect(drawings.size).toBe(config.states.length);
    expect(screen.getByText(/Não são versos ou cenas/)).toBeInTheDocument();
  });

  it('reordena acontecimentos sem mudar a ordem histórica', async () => {
    const view = render(<LiteratureOperation id="narrative-elements"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Começar pela devolução' }));
    expect(screen.getByText('Discurso: por que Lia recusou entrar?')).toBeInTheDocument();
    expect(screen.getByText('História: encontro → hesitação → devolução')).toBeInTheDocument();
    await waitFor(() => expect(view.container.querySelectorAll('svg g')[0].getAttribute('style')).toContain('175'));
  });

  it('reordena a sintaxe sem eliminar a imagem paradoxal', async () => {
    const view = render(<LiteratureOperation id="baroque"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Ler em ordem direta' }));
    expect(screen.getByText('ouro frio + acende → imagem em tensão')).toBeInTheDocument();
    await waitFor(() => expect(view.container.querySelectorAll('svg g')[0].getAttribute('style')).toContain('170'));
    expect(screen.getByText('da noite')).toBeInTheDocument();
  });

  it('corta redundância preservando o adjetivo que constrói amenidade', async () => {
    const view = render(<LiteratureOperation id="neoclassic"/>);
    fireEvent.click(screen.getByRole('button', { name: 'Cortar acréscimo redundante' }));
    expect(screen.getByText('sereno', { exact: true })).toBeInTheDocument();
    await waitFor(() => expect(view.container.querySelector('svg g')).toHaveAttribute('opacity', '0'));
    fireEvent.click(screen.getByRole('button', { name: 'Repor acréscimo redundante' }));
    await waitFor(() => expect(view.container.querySelector('svg g')).toHaveAttribute('opacity', '1'));
  });

  it('oferece navegação espacial por teclado e botões sem capturar o teclado dos controles', () => {
    const view = render(<LiteratureOperation id="baroque"/>);
    const region = screen.getByRole('region', { name: /Percorrer demonstração/ });
    Object.defineProperty(region, 'scrollWidth', { value: 560 });
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(region.scrollLeft).toBe(160);
    fireEvent.keyDown(region, { key: 'End' });
    expect(region.scrollLeft).toBe(560);
    fireEvent.keyDown(view.container.querySelector('.lf-inline-control')!, { key: 'Home' });
    expect(region.scrollLeft).toBe(560);
    fireEvent.keyDown(region, { key: 'Home' });
    expect(region.scrollLeft).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Percorrer demonstração para a direita' }));
    expect(region.scrollLeft).toBe(160);
  });

  it('os lotes F e G têm dezesseis capítulos revisados, cinco etapas, armadilhas corrigidas e dois problemas resolvidos', () => {
    for (const config of Object.values(LITERATURE_FOUNDATIONS)) {
      const chapter = chapters.find(item => item.subject === 'Literatura' && item.topic === config.topic)!;
      expect(chapter.rev).toBe(2);
      expect(chapter.sections).toHaveLength(5);
      for (const section of chapter.sections) {
        expect(section.content.length).toBeGreaterThanOrEqual(900);
        expect(section.content.length).toBeLessThanOrEqual(1100);
      }
      expect(chapter.sections[3].content).toMatch(/6\./);
      expect(chapter.sections[4].content).toContain('Problema 1.');
      expect(chapter.sections[4].content).toContain('Problema 2.');
      expect(chapter.sections[4].content.match(/Resolução:/g)).toHaveLength(2);
    }
  });
});
