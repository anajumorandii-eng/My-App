import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BiologiaFisiologia } from './BiologiaFisiologia';
import type { SceneEntry } from '../types';

const entry = (chapterId: string): SceneEntry => ({
  chapterId,
  family: 'cadeia-de-derivacao',
  question: 'Como o mecanismo funciona?',
  items: [
    { label: 'Entrada', claim: 'Primeira etapa anatômica.', section: 'Mecanismo', quote: 'A primeira etapa inicia o processo.' },
    { label: 'Integração', claim: 'Segunda etapa anatômica.', section: 'Mecanismo', quote: 'A segunda etapa integra o sinal.' },
    { label: 'Resposta', claim: 'Terceira etapa anatômica.', section: 'Mecanismo', quote: 'A terceira etapa produz a resposta.' },
    { label: 'Controle', claim: 'Quarta etapa anatômica.', section: 'Mecanismo', quote: 'A quarta etapa controla o processo.' },
    { label: 'Efetor', claim: 'Quinta etapa anatômica.', section: 'Mecanismo', quote: 'A quinta etapa executa a resposta.' },
  ],
});

describe('BiologiaFisiologia', () => {
  it.each([
    ['summary-biologia-fisiologia-da-digestao', 'digestive'],
    ['summary-biologia-fisiologia-da-excrecao', 'nephron'],
    ['summary-biologia-fisiologia-da-coordenacao-nervosa-i', 'synapse'],
    ['summary-biologia-coordenacao-nervosa-ii', 'reflex-arc'],
    ['summary-biologia-coordenacao-endocrina-ii', 'endocrine-axis'],
  ])('usa prancha anatômica própria em %s', (chapterId, system) => {
    const { container } = render(<BiologiaFisiologia entry={entry(chapterId)} />);
    expect(container.querySelector(`[data-bio-system="${system}"]`)).toBeInTheDocument();
  });

  it('mantém a prancha e troca o detalhe lastreado ao selecionar uma etapa', () => {
    const { container } = render(<BiologiaFisiologia entry={entry('summary-biologia-fisiologia-da-excrecao')} />);
    const board = container.querySelector('[data-bio-system="nephron"]');
    fireEvent.click(screen.getByRole('button', { name: /03 resposta/i }));
    expect(screen.getByRole('status')).toHaveTextContent('Terceira etapa anatômica');
    expect(screen.getByRole('status')).toHaveTextContent('A terceira etapa produz a resposta');
    expect(container.querySelector('[data-bio-system="nephron"]')).toBe(board);
  });
});
