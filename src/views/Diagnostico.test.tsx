import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { STATE_LABELS } from '../lib/backlogEngine';
import type { Question } from '../types';
import Diagnostico from './Diagnostico';

const authHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const addUserDiscursiveAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../lib/userData', () => ({
  addUserAttempt: addUserAttemptMock,
  addUserDiscursiveAttempt: addUserDiscursiveAttemptMock,
}));

const MC_TOPIC_ID = 'topic-mc';
const DISC_TOPIC_ID = 'topic-disc';

// Catálogo mínimo e determinístico: um tópico só com questão de múltipla
// escolha, outro só com prompt discursivo — evita depender do currículo real
// (grande, muda com frequência) para montar cada cenário de teste.
vi.mock('../data/mockData', () => ({
  mockTopics: [
    { id: 'topic-mc', name: 'Tópico MC', subject: 'Matemática', prerequisites: [] },
    { id: 'topic-disc', name: 'Tópico Discursivo', subject: 'Matemática', prerequisites: [] },
  ],
}));

vi.mock('../data/topicDiscursivePrompts', () => ({
  mockTopicDiscursivePrompts: [
    {
      id: 'disc-1',
      topicId: 'topic-disc',
      subject: 'Matemática',
      prompt: 'Explique o conceito X.',
      modelAnswer: 'Resposta modelo.',
      keyPoints: ['ponto-chave 1'],
      difficulty: 'medium',
    },
  ],
}));

const mcQuestion: Question = {
  id: 'q1',
  topicId: MC_TOPIC_ID,
  subject: 'Matemática',
  prompt: 'Quanto é 2 + 2?',
  options: [
    { id: 'a', text: '3' },
    { id: 'b', text: '4' },
  ],
  correctOptionId: 'b',
  explanation: 'Porque 2 + 2 = 4.',
  difficulty: 'easy',
};

function setup({
  user = { uid: 'user-1' } as { uid: string } | null,
  updateMastery = vi.fn().mockResolvedValue(true),
  questions = [mcQuestion],
}: {
  user?: { uid: string } | null;
  updateMastery?: ReturnType<typeof vi.fn>;
  questions?: Question[];
} = {}) {
  authHook.mockReturnValue({ user, isConnected: !!user });
  masteryHook.mockReturnValue({
    mastery: [],
    updateMastery,
    loading: false,
    syncError: null,
    isPersisted: !!user,
  });
  questionsHook.mockReturnValue({ questions, syncError: null });
  render(<Diagnostico />);
  return { updateMastery };
}

// Autoavaliação (estado 2 = "Aplicação guiada") seguida de confirmação —
// mesmo passo em todo cenário, então fica isolado num helper.
function selfReport(stateIndex = 2) {
  fireEvent.click(screen.getByText(`${stateIndex} — ${STATE_LABELS[stateIndex]}`));
  fireEvent.click(screen.getByText(/Continuar para o teste rápido|Ver resultado/));
}

describe('Diagnostico', () => {
  it('grava um QuestionAttempt real ao responder uma questão de múltipla escolha', () => {
    setup();
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));

    expect(addUserAttemptMock).toHaveBeenCalledTimes(1);
    expect(addUserAttemptMock).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        questionId: 'q1',
        topicId: MC_TOPIC_ID,
        correct: true,
        date: expect.any(String),
      })
    );
  });

  it('não grava tentativa em modo demonstração (sem usuário autenticado)', () => {
    setup({ user: null });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));

    expect(addUserAttemptMock).not.toHaveBeenCalled();
  });

  it('grava um DiscursiveAttempt ao autoavaliar uma discursiva como "mediano"', () => {
    setup({ questions: [] });
    fireEvent.click(screen.getByText('Tópico Discursivo'));
    selfReport();
    fireEvent.click(screen.getByText('Pensei na resposta — ver o gabarito'));
    fireEvent.click(screen.getByText('Mediano'));

    expect(addUserDiscursiveAttemptMock).toHaveBeenCalledTimes(1);
    expect(addUserDiscursiveAttemptMock).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        questionId: 'disc-1',
        topicId: DISC_TOPIC_ID,
        selfRating: 'mediano',
        date: expect.any(String),
      })
    );
  });

  it('mostra "Diagnóstico salvo" quando updateMastery resolve true', async () => {
    setup({ updateMastery: vi.fn().mockResolvedValue(true) });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    fireEvent.click(screen.getByText('Salvar diagnóstico'));

    await waitFor(() => expect(screen.getByText(/Diagnóstico salvo/)).toBeInTheDocument());
  });

  it('mostra um erro real (e não "salvo") quando updateMastery resolve false', async () => {
    setup({ updateMastery: vi.fn().mockResolvedValue(false) });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    fireEvent.click(screen.getByText('Salvar diagnóstico'));

    await waitFor(() => expect(screen.getByText(/Não foi possível salvar/)).toBeInTheDocument());
    expect(screen.queryByText(/Diagnóstico salvo/)).not.toBeInTheDocument();
  });

  it('a entrada passada para updateMastery inclui origin "diagnostic"', async () => {
    const updateMastery = vi.fn().mockResolvedValue(true);
    setup({ updateMastery });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    fireEvent.click(screen.getByText('Salvar diagnóstico'));

    await waitFor(() => expect(updateMastery).toHaveBeenCalledTimes(1));
    const updater = updateMastery.mock.calls[0][0] as (prev: unknown[]) => { topicId: string; origin?: string }[];
    const result = updater([]);
    expect(result[0]).toMatchObject({ topicId: MC_TOPIC_ID, origin: 'diagnostic' });
  });

  it('clicar "Salvar diagnóstico" duas vezes rápido só resulta em uma chamada de updateMastery', async () => {
    let resolvePending: (value: boolean) => void = () => {};
    const updateMastery = vi.fn().mockImplementation(
      () => new Promise<boolean>((resolve) => { resolvePending = resolve; })
    );
    setup({ updateMastery });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    const saveButton = screen.getByText('Salvar diagnóstico');
    fireEvent.click(saveButton);
    fireEvent.click(saveButton);

    expect(updateMastery).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePending(true);
      await Promise.resolve();
    });
  });
});
