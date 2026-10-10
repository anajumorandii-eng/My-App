import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopicExperiment } from './topic-experiments/TopicExperiment';
import { topicExperiments } from './topic-experiments/catalog';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { atlasPassages } from '../lib/topicAtlas';
import { buildVisualMap } from '../lib/visualStudy';
import { findInstrument } from './visual-instruments/registry';

describe('Personalização com vínculo explícito ao conteúdo', () => {
  it('preserva o texto de todas as etapas do catálogo ao segmentar a leitura', () => {
    for (const summary of interactiveSummaries) for (const section of summary.sections) {
      const passages = atlasPassages(section);
      expect(passages.length, section.id).toBeGreaterThan(0);
      expect(passages.map(p => p.text).join(' ').replace(/\s+/g,' ').trim(), section.id)
        .toBe(section.content.replace(/\s+/g,' ').trim());
      expect(new Set(passages.map(p=>p.id)).size).toBe(passages.length);
    }
  });
  it('só seleciona experimentos para capítulos existentes e explicitamente cadastrados', () => {
    const ids = new Set(interactiveSummaries.map(s=>s.id));
    for (const id of Object.keys(topicExperiments)) expect(ids.has(id), id).toBe(true);
    const { container } = render(<TopicExperiment summaryId="summary-geografia-sistema-de-fusos-horarios" />);
    expect(container).toBeEmptyDOMElement();
  });
  it('recalcula a distância longitudinal conforme a latitude e respeita os hemisférios', () => {
    render(<TopicExperiment summaryId="summary-geografia-coordenadas-geograficas" />);
    fireEvent.change(screen.getByLabelText(/Latitude:/), { target: {value:'60'} });
    expect(screen.getByRole('status', { name: 'Distância por grau' })).toHaveTextContent('56 km');
    fireEvent.change(screen.getByLabelText(/Longitude:/), { target: {value:'-45'} });
    expect(screen.getByLabelText(/Longitude:/)).toHaveAccessibleName('Longitude: 45° O');
  });
  it('calcula fatores e produto, em vez de desenhar uma curva sem significado', () => {
    render(<TopicExperiment summaryId="summary-matematica-potencias-e-radicais" />);
    fireEvent.change(screen.getByLabelText(/Primeiro expoente:/), { target: {value:'4'} });
    fireEvent.change(screen.getByLabelText(/Segundo expoente:/), { target: {value:'3'} });
    expect(screen.getByRole('status')).toHaveTextContent('16 × 8 = 128');
    expect(screen.getByRole('img')).toHaveAccessibleName('4 fatores 2 mais 3 fatores 2: 7 fatores no produto');
  });
  // A Entrega L trocou o botão "Examinar o critério" pela oficina de argumento:
  // a auditoria pedia a justificativa no desenho, e a leitura passa a seguir o
  // estado escolhido, como nos demais capítulos de Humanas.
  it('troca o critério filosófico e mostra a objeção no desenho', () => {
    const { container } = render(<TopicExperiment summaryId="summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos" />);
    expect(screen.getByRole('status')).toHaveTextContent('Não há porta para objeção');
    fireEvent.click(screen.getByRole('button', {name:'Logos'}));
    expect(screen.getByRole('status')).toHaveTextContent('exigência de justificar');
    expect(container.querySelector('svg')!.textContent).toContain('objeção');
  });
  it('altera a leitura de Textualidade quando o aviso recebe uma conclusão coerente', async () => {
    const summary = interactiveSummaries.find(item => item.id === 'summary-entendimento-de-texto-fatores-de-textualidade')!;
    const Component = findInstrument(summary)!.Component;
    const { container } = render(<Component map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={() => {}} hiddenEdgeIds={[]} mode="explorar" />);
    await act(async () => { await vi.dynamicImportSettled(); });
    await waitFor(() => expect(container.querySelector('.reading-finding')).toHaveTextContent('Aviso coeso, mas incoerente: proibir não autoriza entrar.'));
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(container.querySelector('.reading-finding')).toHaveTextContent('Aviso coerente: a proibição justifica esperar fora.');
    expect(container.querySelector('.reading-annotation')).toHaveTextContent('ação compatível com a primeira');
  });
});
