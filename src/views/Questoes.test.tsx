import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Question } from '../types';
import Questoes from './Questoes';

const authHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const addUserErrorLogMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const requestAiTextMock = vi.hoisted(() => vi.fn());

vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../lib/userData', () => ({
  addUserAttempt: addUserAttemptMock,
  addUserErrorLog: addUserErrorLogMock,
}));
vi.mock('../lib/aiClient', () => ({ requestAiText: requestAiTextMock }));

const QUESTION: Question = {
  id: 'q1',
  subject: 'Biologia',
  topicId: 'topic-1',
  prompt: 'Onde ocorre a glicólise?',
  options: [
    { id: 'a', text: 'Citoplasma' },
    { id: 'b', text: 'Mitocôndria' },
  ],
  correctOptionId: 'a',
  explanation: 'A glicólise ocorre no citoplasma.',
  difficulty: 'easy',
};

beforeEach(() => {
  vi.clearAllMocks();
  authHook.mockReturnValue({ user: { uid: 'user-1' } });
  masteryHook.mockReturnValue({ updateMastery: vi.fn(), isPersisted: true, syncError: null });
  questionsHook.mockReturnValue({ questions: [QUESTION], syncError: null });
  requestAiTextMock.mockResolvedValue({
    text: JSON.stringify({
      type: 'concept_confusion',
      breakPoint: 'Confundiu organela com compartimento.',
      evidence: 'Marcou mitocôndria.',
      confidence: 'media',
      intervention: { type: 'revisao_dirigida', description: 'Revisar respiração celular.' },
    }),
  });
});

describe('Questoes — estados de persistência (regressão da migração instrumental)', () => {
  it('mostra o aviso de modo demonstração quando o domínio não está sendo persistido', () => {
    masteryHook.mockReturnValue({ updateMastery: vi.fn(), isPersisted: false, syncError: null });
    render(<Questoes />);
    expect(screen.getByText(/Modo demonstração/i)).toBeInTheDocument();
  });

  it('mostra o erro de sincronização do banco de questões', () => {
    questionsHook.mockReturnValue({ questions: [QUESTION], syncError: 'Falha ao sincronizar questões.' });
    render(<Questoes />);
    expect(screen.getByText('Falha ao sincronizar questões.')).toBeInTheDocument();
  });
});

describe('Questoes — diagnóstico de erro salvo no Caderno', () => {
  it('grava o ErrorLog como fato confirmado e intervenção pendente ao salvar', async () => {
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Mitocôndria/ }));

    const saveButton = await screen.findByRole('button', { name: /Salvar no Caderno de Erros/i });
    await user.click(saveButton);

    await waitFor(() => expect(addUserErrorLogMock).toHaveBeenCalled());
    const [, log] = addUserErrorLogMock.mock.calls[0];
    expect(log).toMatchObject({
      questionId: 'q1',
      topicId: 'topic-1',
      type: 'concept_confusion',
      confidence: 'confirmado',
      interventionStatus: 'pendente',
    });
  });
});
