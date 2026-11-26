import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import Erros from './Erros';
import type { ErrorLog } from '../types';

const mocks = vi.hoisted(() => ({ logs: [] as ErrorLog[], save: vi.fn().mockResolvedValue(undefined), stream: vi.fn() }));
// Objeto estável, como no app: um usuário novo a cada render recarregaria a lista do zero.
const auth = vi.hoisted(() => ({ user: { uid: 'aluna' }, isConnected: true }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../hooks/useStudyDataRevision', () => ({ useStudyDataRevision: () => 0 }));
vi.mock('../hooks/useSummaryProgress', () => ({ useSummaryProgress: () => ({ progress: {} }) }));
vi.mock('../components/SummaryErrorsPanel', () => ({ default: () => null }));
vi.mock('../lib/userData', () => ({ getUserErrorLogs: () => Promise.resolve(mocks.logs), addUserErrorLog: mocks.save }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: mocks.stream }));

const chagas: ErrorLog = {
  id: 'e1', topicId: 'bio_zoologia', questionId: 'disc_famerp_2023_q02', date: '2026-11-26T12:00:00.000Z', type: 'insufficient_justification', confidence: 'media',
  breakPoint: 'Destruição das fibras cardíacas, inflamação e fibrose, levando a cardiomegalia e insuficiência.',
  notes: 'Famerp 2023, item b: critério parcial.', evidence: 'O parasita ataca o coração.',
};
beforeEach(() => { vi.clearAllMocks(); mocks.logs = [{ ...chagas }]; });
// Espera os registros dela chegarem: antes disso a tela mostra os de demonstração.
const open = async () => {
  render(<MemoryRouter><Erros /></MemoryRouter>);
  await waitFor(() => expect(screen.getAllByRole('button', { name: /Abrir erro/ })).toHaveLength(1));
  fireEvent.click(screen.getByRole('button', { name: /Abrir erro/ }));
};

it('abre o erro com a questão, o que a banca esperava e o que ela escreveu', async () => {
  await open();
  expect(screen.getByText(/A questão · Famerp 2023/)).toBeInTheDocument();
  expect(screen.getAllByText(/Item b:/).length).toBeGreaterThan(0);
  expect(screen.getByText('O parasita ataca o coração.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Refazer esta questão/ })).toHaveAttribute('href', '/treino-2a-fase?banca=Famerp&questao=disc_famerp_2023_q02');
});

it('confirma ou corrige o diagnóstico e salva o relato', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: 'Foi isso mesmo' }));
  expect(mocks.save).toHaveBeenLastCalledWith('aluna', expect.objectContaining({ id: 'e1', confidence: 'confirmado' }));
  fireEvent.change(screen.getByRole('textbox', { name: /O que passou pela sua cabeça/ }), { target: { value: 'Achei que bastava dizer que atacava o coração.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar relato' }));
  expect(mocks.save).toHaveBeenLastCalledWith('aluna', expect.objectContaining({ reflection: 'Achei que bastava dizer que atacava o coração.' }));
});

it('marca como superado, tira dos ativos e permite voltar', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: /marcar como superado/ }));
  expect(mocks.save).toHaveBeenLastCalledWith('aluna', expect.objectContaining({ resolvedAt: expect.any(String) }));
  expect(screen.getByRole('tab', { name: 'Ativos (0)' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab', { name: 'Superados (1)' }));
  // O erro continua aberto ao trocar de aba.
  fireEvent.click(screen.getByRole('button', { name: /Voltar para os ativos/ }));
  const saved = mocks.save.mock.calls.at(-1)![1] as ErrorLog;
  expect(saved.resolvedAt).toBeUndefined();
  expect('resolvedAt' in saved).toBe(false);
});

it('gera a explicação da IA para um erro já registrado, sem gravar campo vazio', async () => {
  mocks.stream.mockResolvedValue({ text: 'Você descreveu o efeito, não o mecanismo.' });
  await open();
  fireEvent.click(screen.getByRole('button', { name: /Explicar este erro com IA/ }));
  await waitFor(() => expect(mocks.save).toHaveBeenCalled());
  const saved = mocks.save.mock.calls.at(-1)![1] as Record<string, unknown>;
  expect(saved.aiHypothesis).toBe('Você descreveu o efeito, não o mecanismo.');
  expect(Object.values(saved).includes(undefined)).toBe(false);
  await waitFor(() => expect(document.body.textContent).toContain('Você descreveu o efeito, não o mecanismo.'));
});
