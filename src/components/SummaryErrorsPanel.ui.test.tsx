import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { applySummaryAttempt } from '../lib/summaryStudy';
import SummaryErrorsPanel from './SummaryErrorsPanel';

const summary = interactiveSummaries[0];
const question = summary.retrieval[0];
const partialProgress = applySummaryAttempt({}, summary, question, {
  answer: 'A temperatura fica constante.', matchedElements: ['temperatura constante'], firstMissingElement: 'mudança de fase', transferUnlocked: false,
}, '2026-08-24T12:00:00.000Z');

describe('erros derivados dos resumos', () => {
  it('mostra erro parcial com vínculo direto, metadados e histórico sem duplicatas', () => {
    render(<MemoryRouter><SummaryErrorsPanel progress={partialProgress} summaries={interactiveSummaries}/></MemoryRouter>);
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText('Resposta parcial')).toBeInTheDocument();
    expect(screen.getByText(/Física · Termologia/)).toBeInTheDocument();
    expect(screen.getByText(/Fuvest/)).toBeInTheDocument();
    expect(screen.getByText(/pod_fis_04/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Retomar pergunta/ })).toHaveAttribute('href', expect.stringContaining('question=calor-r1'));
    expect(screen.getByText(/1 tentativa/)).toBeInTheDocument();
  });

  it('filtra resolvidos e apresenta estado vazio acessível', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SummaryErrorsPanel progress={partialProgress} summaries={interactiveSummaries}/></MemoryRouter>);
    await user.selectOptions(screen.getByLabelText('Filtrar erros dos resumos'), 'resolvidos');
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum erro de resumo neste filtro');
  });

  it('mantém evidência de referência removida sem oferecer link quebrado', () => {
    render(<MemoryRouter><SummaryErrorsPanel progress={partialProgress} summaries={[]}/></MemoryRouter>);
    expect(screen.getByText(/conteúdo original não está mais disponível/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Retomar pergunta/ })).not.toBeInTheDocument();
  });
});
