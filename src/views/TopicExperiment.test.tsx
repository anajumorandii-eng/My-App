import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TopicExperiment } from './topic-experiments/TopicExperiment';
import { topicExperiments } from './topic-experiments/catalog';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { atlasPassages } from '../lib/topicAtlas';

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
    expect(screen.getByRole('status')).toHaveTextContent('56 km');
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
  it('troca o critério filosófico e só revela sua análise mediante ação', () => {
    render(<TopicExperiment summaryId="summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name:'Logos'}));
    fireEvent.click(screen.getByRole('button', {name:'Examinar o critério de aceitação'}));
    expect(screen.getByRole('status')).toHaveTextContent('examinada, contestada e corrigida');
  });
  it('modifica o exemplo e a explicação quando o conector muda de função', () => {
    render(<TopicExperiment summaryId="summary-entendimento-de-texto-fatores-de-textualidade" />);
    fireEvent.click(screen.getByRole('button',{name:'Contraste'}));
    expect(screen.getByText('a partida continuou.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('contra uma expectativa');
  });
});
