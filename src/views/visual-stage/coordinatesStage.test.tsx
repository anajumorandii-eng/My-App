import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { TopicExperiment } from '../topic-experiments/TopicExperiment';
import { COORDINATES_CHAPTER, COORDINATES_STEPS } from '../topic-experiments/coordinatesStage';
import { resolveVisualRepresentation } from '../visualRepresentation';
import { resolveStageDeclaration } from './contract';
import { stageDeclarationFor } from './declarations';
import type { SceneStageBridge } from './stageCases';

const summary = interactiveSummaries.find((item) => item.id === COORDINATES_CHAPTER)!;
const map = buildVisualMap(summary);

function bridge(over: Partial<SceneStageBridge> = {}): SceneStageBridge {
  return {
    map, sections: summary.sections, activeStep: 0, onStepChange: vi.fn(), selectedId: null,
    onSelect: vi.fn(), mode: 'explorar', hiddenEdgeIds: [], ...over,
  };
}

const latitude = () => (screen.getByLabelText(/^Latitude/) as HTMLInputElement).value;
const longitude = () => (screen.getByLabelText(/^Longitude/) as HTMLInputElement).value;

describe('palco → globo de Coordenadas Geográficas', () => {
  it('o capítulo abre pelo experimento, e cada etapa cita a própria seção', () => {
    expect(resolveVisualRepresentation(summary)).toBe('experiment');
    map.nodes.forEach((node, step) => {
      expect(summary.sections[step].content).toContain(COORDINATES_STEPS[node.stage].cita);
      const preset = COORDINATES_STEPS[node.stage].preset;
      // Só põe o ponto numa coordenada que a seção escreve.
      if (preset && node.stage === 'aplicacao') expect(summary.sections[step].content).toContain('23°S, 46°O');
    });
  });

  it('trocar de etapa muda o que o globo acende e leva o ponto à coordenada da leitura resolvida', () => {
    let stage = bridge();
    const view = render(<TopicExperiment summaryId={COORDINATES_CHAPTER} stage={stage} />);
    const svg = () => view.container.querySelector('svg.ts-coord')!;
    expect(screen.getByRole('group', { name: 'Etapa no palco' })).toHaveAttribute('data-stage-step', '0');
    const vistos = new Set<string>();
    map.nodes.forEach((node, step) => {
      stage = { ...stage, activeStep: step };
      view.rerender(<TopicExperiment summaryId={COORDINATES_CHAPTER} stage={stage} />);
      expect(svg().getAttribute('data-stage-coord-focus')).toBe(COORDINATES_STEPS[node.stage].focus);
      vistos.add(svg().outerHTML);
      if (node.stage === 'aplicacao') { expect(latitude()).toBe('-23'); expect(longitude()).toBe('-46'); }
      if (node.stage === 'conceito') { expect(latitude()).toBe('0'); expect(longitude()).toBe('0'); }
    });
    expect(vistos.size).toBe(map.nodes.length);
  });

  it('a missão do exercício pede 40°N na cena e não registra evidência própria', () => {
    const step = map.nodes.findIndex((node) => node.stage === 'exercicio');
    const stage = bridge({ activeStep: step });
    render(<TopicExperiment summaryId={COORDINATES_CHAPTER} stage={stage} />);
    expect(document.querySelector('[data-coord-alvo]')).toHaveAttribute('data-coord-alvo', 'pendente');
    fireEvent.change(screen.getByLabelText(/^Latitude/), { target: { value: '40' } });
    const feito = document.querySelector('[data-coord-alvo]')!;
    expect(feito).toHaveAttribute('data-coord-alvo', 'alcancado');
    expect(feito).toHaveTextContent('cerca de 85 km');
    expect(stage.onSelect).not.toHaveBeenCalled();
    expect(stage.onStepChange).not.toHaveBeenCalled();
  });

  it('Reconstruir pede observação na cena; fora do palco o globo é o de antes', () => {
    const view = render(<TopicExperiment summaryId={COORDINATES_CHAPTER} stage={bridge({ mode: 'reconstruir' })} />);
    expect(screen.getByRole('note')).toHaveTextContent('Desafio na cena');
    expect(view.container.querySelector('svg.ts-coord')!.hasAttribute('data-stage-coord-focus')).toBe(false);
    view.unmount();
    render(<TopicExperiment summaryId={COORDINATES_CHAPTER} />);
    expect(screen.queryByRole('group', { name: 'Etapa no palco' })).toBeNull();
    expect(latitude()).toBe('20');
  });

  it('declara um ponto de investigação por etapa', () => {
    const declared = resolveStageDeclaration(map, stageDeclarationFor(summary, 'experiment'));
    expect(declared.hotspots.map((spot) => spot.label)).toEqual(map.nodes.map((node) => COORDINATES_STEPS[node.stage].label));
  });
});
