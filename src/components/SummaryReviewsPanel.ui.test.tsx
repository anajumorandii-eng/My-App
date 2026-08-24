import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { applySummaryAttempt } from '../lib/summaryStudy';
import SummaryReviewsPanel from './SummaryReviewsPanel';

const summary = interactiveSummaries[0];
const question = summary.retrieval[0];

it('mostra revisão automática vencida com retorno à pergunta', () => {
  const progress = applySummaryAttempt({}, summary, question, { answer: 'não sei', matchedElements: [], firstMissingElement: 'temperatura constante', transferUnlocked: false }, '2026-08-20T12:00:00.000Z');
  render(<MemoryRouter><SummaryReviewsPanel progress={progress} summaries={interactiveSummaries} now={new Date('2026-08-24T12:00:00.000Z')}/></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Revisões de resumos' })).toBeInTheDocument();
  expect(screen.getByText('Revisão vencida')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Responder novamente/ })).toHaveAttribute('href', expect.stringContaining('question=calor-r1'));
});

it('expõe estado vazio quando ainda não há revisão programada', () => {
  render(<MemoryRouter><SummaryReviewsPanel progress={{}} summaries={interactiveSummaries}/></MemoryRouter>);
  expect(screen.getByRole('status')).toHaveTextContent('Nenhuma revisão de resumo programada');
});
