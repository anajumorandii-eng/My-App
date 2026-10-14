import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { QuestionStatement } from './QuestionStatement';
import type { Question } from '../types';

afterEach(cleanup);
const question: Question = {
  id: 'legacy', topicId: 'fis_circuitos', subject: 'Física', difficulty: 'medium',
  prompt: 'A figura 1 apresenta a potência; a figura 2, a temperatura. Leia os dois gráficos.',
  options: [{ id: 'a', text: '325 °C' }, { id: 'b', text: '3.000 °C' }],
  correctOptionId: 'b', explanation: 'Use a resistência para relacionar os gráficos.',
  originalPages: [{ url: '/question-media/apostilas/graficos.webp', page: 21 }],
};
it('não exibe páginas nem links, inclusive em questão antiga sem recortes', () => {
  render(<QuestionStatement question={question} />);
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.queryByRole('link')).toBeNull();
  expect(screen.getByText(question.prompt)).toBeInTheDocument();
});
it('substitui a página pelo recorte assim que a figura está disponível', () => {
  render(<QuestionStatement question={{ ...question, figures: [{ url: '/figura.webp' }] }} />);
  expect(screen.getAllByRole('img')).toHaveLength(1);
  expect(screen.getByRole('img').getAttribute('src')).toBe('/figura.webp');
  expect(screen.getByRole('img').closest('a')).toBeNull();
  expect(screen.getByRole('img')).not.toHaveClass('bg-white');
});
it('não repete a página de uma questão cujo texto é autossuficiente', () => {
  render(<QuestionStatement question={{ ...question, prompt: 'Qual é a potência para uma corrente de 2 A e resistência de 3 Ω?' }} />);
  expect(screen.queryByRole('img')).toBeNull();
});
it('não mostra a página quando a tabela já está transcrita e conferida', () => {
  render(<QuestionStatement question={{ ...question, statementComplete: true,
    prompt: 'A tabela indica temperaturas: A | B\n4 | −1\n10 | 8. Qual é a relação linear?' }} />);
  expect(screen.queryByRole('img')).toBeNull();
});
