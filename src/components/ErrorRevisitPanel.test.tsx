import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import type { ErrorLog } from '../types';
const history = vi.hoisted(() => ({ errors: [] as ErrorLog[], complete: vi.fn() }));
vi.mock('../hooks/useErrorReviewHistory', () => ({ useErrorReviewHistory: () => ({ ...history, loading: false, saving: null, warning: '', isPersonal: true }) }));
import ErrorRevisitPanel from './ErrorRevisitPanel';
const error = (id: string): ErrorLog => ({ id, topicId: 'bio_genetica', questionId: `questao-${id}`, date: '2026-10-12T12:00:00Z', type: 'unknown', notes: `Relato específico ${id}` });
beforeEach(() => { history.errors = [error('a'), error('b'), error('c')]; });
it('identifica qual questão e relato serão retomados e abre registro correspondente', () => {
  render(<MemoryRouter><ErrorRevisitPanel localDate="2026-10-13" /></MemoryRouter>);
  expect(screen.getByText(/questao-a/)).toBeInTheDocument();
  expect(screen.getByText(/Relato específico a/)).toBeInTheDocument();
  expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/erros?registro=a');
});
it('desconta uma tentativa de hoje uma única vez quando checkpoints foram consolidados', () => {
  const result = { completedAt: '2026-10-13T12:00:00Z', rating: 'independente' as const };
  history.errors[0] = { ...history.errors[0], revisitResults: { '1': result, '3': result, '7': result } };
  const { rerender } = render(<MemoryRouter><ErrorRevisitPanel localDate="2026-10-13" availableMinutes={30} /></MemoryRouter>);
  expect(screen.getAllByRole('button', { name: 'Consegui sem ajuda' })).toHaveLength(1);
  history.errors[1] = { ...history.errors[1], revisitResults: { '1': result } };
  rerender(<MemoryRouter><ErrorRevisitPanel localDate="2026-10-13" availableMinutes={30} /></MemoryRouter>);
  expect(screen.queryByRole('button', { name: 'Consegui sem ajuda' })).toBeNull();
  expect(screen.getByText(/0 minutos restantes/)).toBeInTheDocument();
});
