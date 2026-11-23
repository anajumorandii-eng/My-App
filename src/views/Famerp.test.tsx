import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { Question } from '../types';
import Famerp from './Famerp';

const authHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const addUserErrorLogMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../lib/userData', () => ({ addUserAttempt: addUserAttemptMock, addUserErrorLog: addUserErrorLogMock }));

const question = (n: number, subject: string, correct: string): Question => ({
  id: `famerp_2025_v1_q${String(n).padStart(2, '0')}`, topicId: `t${n}`, subject, chapter: `Capítulo ${n}`,
  prompt: `Enunciado ${n}`, options: [{ id: 'a', text: 'Alfa' }, { id: 'b', text: 'Beta' }], correctOptionId: correct,
  explanation: `Explicação ${n}`, difficulty: 'medium',
  examSource: { board: 'FAMERP', year: 2025, questionNumber: n },
});

const updateMastery = vi.fn();

beforeEach(() => {
  localStorage.clear();
  authHook.mockReturnValue({ user: { uid: 'aj' } });
  masteryHook.mockReturnValue({ updateMastery });
  questionsHook.mockReturnValue({ questions: [question(2, 'Física', 'b'), question(1, 'Biologia', 'a')], loading: false });
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

const renderView = () => render(<MemoryRouter><Famerp /></MemoryRouter>);

it('faz a prova na ordem do caderno, sem revelar o gabarito antes da entrega', async () => {
  renderView();
  fireEvent.click(screen.getByRole('button', { name: 'Começar simulado' }));
  expect(screen.getByText('Enunciado 1')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('radio', { name: /Alfa/ }));
  expect(screen.queryByText('Explicação 1')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
  fireEvent.click(screen.getByRole('radio', { name: /Alfa/ }));
  fireEvent.click(screen.getByRole('button', { name: /Entregar prova/ }));

  expect(screen.getByRole('heading', { name: 'Famerp 2025: 1 de 2' })).toBeInTheDocument();
  expect(updateMastery).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/Questão 2 · Física/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Registrar erros e tentativas' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Registrado no Caderno de Erros' })).toBeDisabled());
  expect(addUserAttemptMock).toHaveBeenCalledTimes(2);
  expect(addUserErrorLogMock).toHaveBeenCalledTimes(1);
  expect(addUserErrorLogMock.mock.calls[0][1]).toMatchObject({ type: 'unknown', confidence: 'baixa', questionId: 'famerp_2025_v1_q02' });
});

it('retoma a prova em andamento depois de recarregar', () => {
  const first = renderView();
  fireEvent.click(screen.getByRole('button', { name: 'Começar simulado' }));
  fireEvent.click(screen.getByRole('radio', { name: /Alfa/ }));
  first.unmount();
  renderView();
  expect(screen.getByText(/1\/2 respondidas/)).toBeInTheDocument();
});

it('lista prioridades só com capítulos que se repetem entre os anos', () => {
  renderView();
  fireEvent.click(screen.getByRole('tab', { name: 'Prioridades' }));
  expect(screen.getByRole('heading', { name: 'O que mais se repete' })).toBeInTheDocument();
  expect(screen.queryByText('Capítulo 1')).not.toBeInTheDocument();
});
