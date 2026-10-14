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
it('mantém dados visuais disponíveis em questão antiga que ainda não recebeu recortes', () => {
  render(<QuestionStatement question={question} />);
  expect(screen.getByRole('img').getAttribute('src')).toBe(question.originalPages![0].url);
  expect(screen.getByRole('img').closest('a')).toBeNull();
});
it('substitui a página pelo recorte assim que a figura está disponível', () => {
  render(<QuestionStatement question={{ ...question, figures: [{ url: '/figura.webp' }] }} />);
  expect(screen.getAllByRole('img')).toHaveLength(1);
  expect(screen.getByRole('img').getAttribute('src')).toBe('/figura.webp');
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
