import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisualJourney } from './VisualJourney';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { NewtonLab, AtomLab } from './visual-boards/MechanismLab';

vi.mock('../components/AiText', () => ({ AiText: ({ text }: { text: string }) => <div>{text}</div> }));

describe('Percurso ligado ao conteúdo', () => {
  it('leva ao teste apenas por ação explícita e conserva todas as etapas do capítulo', async () => {
    const summary = interactiveSummaries.find(s => s.subject === 'História')!;
    const practice = vi.fn();
    render(<VisualJourney summary={summary} onPractice={practice} />);
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
});
