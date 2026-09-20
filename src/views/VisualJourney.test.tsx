import React from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisualJourney } from './VisualJourney';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { NewtonLab, AtomLab } from './visual-boards/MechanismLab';
import { resolveVisualRepresentation } from './visualRepresentation';
import { topicExperiments } from './topic-experiments/catalog';
import { sceneFor } from './topic-scenes/sceneFor';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';

const sceneOnlySummary = interactiveSummaries.find(
  (item) => sceneFor(item.id) && !topicExperiments[item.id] && !findBoard(item) && !findInstrument(item),
)!;

vi.mock('../components/AiText', () => ({ AiText: ({ text }: { text: string }) => <div>{text}</div> }));

describe('Percurso ligado ao conteúdo', () => {
  it('mantém a cena-âncora montada ao trocar de etapa do capítulo', () => {
    const summary = sceneOnlySummary;
    const scene = sceneFor(summary.id)!;
    render(<VisualJourney summary={summary} representation={resolveVisualRepresentation(summary)} onPractice={() => {}} />);
    const cena = screen.getByLabelText(scene.question);
    fireEvent.click(screen.getAllByRole('button', { name: /Continuar:/ })[0]);
    expect(screen.getByLabelText(scene.question)).toBe(cena);
  });
  it('leva ao teste apenas por ação explícita e conserva todas as etapas do capítulo', async () => {
    const summary = interactiveSummaries.find(s => s.subject === 'História')!;
    const practice = vi.fn();
    render(<VisualJourney summary={summary} representation={resolveVisualRepresentation(summary)} onPractice={practice} />);
    expect(screen.getByText(summary.sections[0].content)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Etapas do capítulo' });
    const steps = within(nav).getAllByRole('button');
    expect(steps).toHaveLength(summary.sections.length);
    fireEvent.click(steps[steps.length - 1]);
    expect(await screen.findByText(summary.sections.at(-1)!.content)).toBeInTheDocument();
    expect(practice).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Testar o que aprendi/ }));
    expect(practice).toHaveBeenCalledOnce();
  });
  it('não simula um carrinho sem execução e calcula força/massa após executar', () => {
    render(<NewtonLab />);
    expect(screen.getByRole('status')).toHaveTextContent('Escolha força e massa');
    fireEvent.change(screen.getByLabelText(/Força:/), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar força por 1 segundo' }));
    expect(screen.getByRole('status')).toHaveTextContent('4 m/s²');
    expect(screen.getByRole('status')).toHaveTextContent('2 m.');
    fireEvent.change(screen.getByLabelText(/Massa:/), { target: { value: '4' } });
    expect(screen.getByRole('status')).toHaveTextContent('Escolha força e massa');
  });
  it('distingue absorção de emissão ao mudar o nível de energia', () => {
    render(<AtomLab />);
    fireEvent.click(screen.getByRole('button', { name: 'Nível n = 2' }));
    expect(screen.getByRole('status')).toHaveTextContent('Absorção de 10,2 eV');
    fireEvent.click(screen.getByRole('button', { name: 'Nível n = 1' }));
    expect(screen.getByRole('status')).toHaveTextContent('Emissão de 10,2 eV');
  });
  it('oferece leitura em foco do conteúdo de todas as matérias, sem afirmar ilustração autoral', () => {
    const subjects = [...new Set(interactiveSummaries.map(summary => summary.subject))];
    expect(subjects).toHaveLength(14);
    for (const subject of subjects) {
      const summary = interactiveSummaries.find(item => item.subject === subject)!;
      const view = render(<VisualJourney summary={summary} representation={resolveVisualRepresentation(summary)} onPractice={() => {}} />);
      fireEvent.click(screen.getByText('Explorar e comparar trechos desta etapa'));
      expect(screen.getByRole('figure', { name: `Leitura em foco de ${summary.sections[0].title}` })).toHaveAttribute('data-subject', subject);
      view.unmount();
      cleanup();
    }
  });
  it('dá identidade visual e navegação a capítulo sem cena, prancha, instrumento ou experimento', () => {
    const summary = interactiveSummaries.find(item => item.id === 'atu-cop30-belem')!;
    render(<VisualJourney summary={summary} representation={resolveVisualRepresentation(summary)} onPractice={() => {}} />);
    const fallback = screen.getByLabelText(`Estrutura visual de ${summary.title}`);
    expect(fallback).toHaveAttribute('data-subject', 'Atualidades');
    const secondStep = within(fallback).getByRole('button', { name: new RegExp(summary.sections[1].title) });
    fireEvent.click(secondStep);
    expect(screen.getByText(summary.sections[1].content)).toBeInTheDocument();
  });
  it('não duplica fallback quando o capítulo já possui cena dedicada', () => {
    const summary = sceneOnlySummary;
    render(<VisualJourney summary={summary} representation={resolveVisualRepresentation(summary)} onPractice={() => {}} />);
    expect(screen.queryByLabelText(`Estrutura visual de ${summary.title}`)).not.toBeInTheDocument();
  });
});
