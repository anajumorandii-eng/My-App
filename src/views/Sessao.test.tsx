import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { DailyPlanState } from '../hooks/useDailyPlan';
import type { AllocatedStudyAction, Question, TopicMastery } from '../types';
import Sessao from './Sessao';

const dailyPlanHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const authHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const saveUserStudySessionMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('../hooks/useDailyPlan', () => ({ useDailyPlan: dailyPlanHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../lib/userData', () => ({
  addUserAttempt: addUserAttemptMock,
  saveUserStudySession: saveUserStudySessionMock,
}));

function renderSessao(topicId?: string) {
  const initialEntries = [topicId ? `/sessao?topic=${topicId}` : '/sessao'];
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Sessao />
    </MemoryRouter>
  );
}

function makeAction(overrides: Partial<AllocatedStudyAction>): AllocatedStudyAction {
  return {
    id: 'action-id',
    type: 'practice',
    topicId: 'topic-id',
    topicName: 'Tópico',
    subject: 'Matéria',
    estimatedMinutes: 30,
    priorityScore: 90,
    reasons: [],
    factors: [],
    snapshot: { masteryLevel: 0, uncertainty: 0, calculatedAt: new Date().toISOString() },
    intervalStart: '2026-08-24T15:40:00-03:00',
    intervalEnd: '2026-08-24T16:10:00-03:00',
    allocatedMinutes: 30,
    ...overrides,
  };
}

function planWith(allocatedActions: AllocatedStudyAction[], loading = false): DailyPlanState {
  return {
    availability: undefined,
    prioritizedActions: allocatedActions,
    allocatedActions,
    loading,
    warnings: [],
    isPersisted: true,
  };
}

function makeQuestion(overrides: Partial<Question>): Question {
  return {
    id: 'q1',
    topicId: 'topic-id',
    subject: 'Matéria',
    prompt: 'Pergunta',
    options: [{ id: 'a', text: 'Opção A' }, { id: 'b', text: 'Opção B' }],
    correctOptionId: 'a',
    explanation: 'Explicação.',
    difficulty: 'easy',
    ...overrides,
  };
}

describe('Sessao', () => {
  beforeEach(() => {
    authHook.mockReturnValue({ user: { uid: 'student-1' } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('mostra um aviso não bloqueante e cai para a primeira ação do plano quando ?topic= não existe em dailyPlan', () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    renderSessao('does-not-exist-anymore');

    expect(
      screen.getByText('O tópico solicitado não está mais no plano de hoje — mostrando sua prioridade atual.')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Genética Molecular').length).toBeGreaterThan(0);
  });

  it('não mostra o aviso quando ?topic= corresponde a uma ação do plano', () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    renderSessao('bio-genetics');

    expect(screen.queryByText(/não está mais no plano de hoje/)).not.toBeInTheDocument();
  });

  it('não mostra o aviso enquanto o plano ainda está carregando', () => {
    dailyPlanHook.mockReturnValue(planWith([], true));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    renderSessao('qualquer-topico');

    expect(screen.queryByText(/não está mais no plano de hoje/)).not.toBeInTheDocument();
  });

  it('type practice com questões disponíveis: mini-atividade real aparece antes do cronômetro e responder grava tentativa + domínio', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    try {
      const practiceAction = makeAction({
        id: 'functions',
        type: 'practice',
        topicId: 'math-functions',
        topicName: 'Funções Exponenciais',
      });
      const q1 = makeQuestion({
        id: 'q1',
        topicId: 'math-functions',
        prompt: 'Pergunta 1',
        options: [{ id: 'a', text: 'Resposta certa 1' }, { id: 'b', text: 'Resposta errada 1' }],
        correctOptionId: 'a',
        explanation: 'Explicação 1',
      });
      const q2 = makeQuestion({
        id: 'q2',
        topicId: 'math-functions',
        prompt: 'Pergunta 2',
        options: [{ id: 'a', text: 'Resposta errada 2' }, { id: 'b', text: 'Resposta certa 2' }],
        correctOptionId: 'b',
        explanation: 'Explicação 2',
      });
      dailyPlanHook.mockReturnValue(planWith([practiceAction]));
      const updateMastery = vi.fn().mockResolvedValue(true);
      const initialMastery: TopicMastery[] = [
        { topicId: 'math-functions', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
      ];
      masteryHook.mockReturnValue({ mastery: initialMastery, updateMastery, isPersisted: true });
      questionsHook.mockReturnValue({ questions: [q1, q2], syncError: null });

      renderSessao();

      // A mini-atividade aparece ANTES do cronômetro: nenhum controle de
      // cronômetro (botão "Iniciar") deve existir ainda.
      expect(screen.getByText('Pergunta 1')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /iniciar/i })).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Resposta certa 1'));

      expect(addUserAttemptMock).toHaveBeenCalledTimes(1);
      expect(addUserAttemptMock).toHaveBeenCalledWith(
        'student-1',
        expect.objectContaining({
          questionId: 'q1',
          topicId: 'math-functions',
          correct: true,
          date: expect.any(String),
        })
      );
      expect(updateMastery).toHaveBeenCalledTimes(1);
      const firstUpdater = updateMastery.mock.calls[0][0] as (prev: TopicMastery[]) => TopicMastery[];
      expect(firstUpdater(initialMastery)[0].level).toBe(5); // qualityFromAnswerCorrectness(true) = 4 -> levelDelta +5

      fireEvent.click(screen.getByText('Próxima questão'));

      expect(screen.getByText('Pergunta 2')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Resposta errada 2'));

      expect(addUserAttemptMock).toHaveBeenCalledTimes(2);
      expect(addUserAttemptMock).toHaveBeenLastCalledWith(
        'student-1',
        expect.objectContaining({ questionId: 'q2', topicId: 'math-functions', correct: false })
      );
      expect(updateMastery).toHaveBeenCalledTimes(2);
      const secondUpdater = updateMastery.mock.calls[1][0] as (prev: TopicMastery[]) => TopicMastery[];
      expect(secondUpdater(initialMastery)[0].level).toBe(0); // qualityFromAnswerCorrectness(false) = 1 -> levelDelta -4, clamped at 0

      fireEvent.click(screen.getByText('Concluir mini-atividade e iniciar cronômetro'));

      // Só agora o cronômetro (e seus controles) aparece.
      expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
      expect(screen.getByText(/Mini-atividade concluída/)).toBeInTheDocument();
    } finally {
      randomSpy.mockRestore();
    }
  });

  it('quando updateMastery falha (resolve false) na mini-atividade, mostra aviso não bloqueante sem descartar silenciosamente a resposta nem travar o avanço', async () => {
    const practiceAction = makeAction({ id: 'functions', type: 'practice', topicId: 'math-functions', topicName: 'Funções Exponenciais' });
    const q1 = makeQuestion({
      id: 'q1',
      topicId: 'math-functions',
      prompt: 'Pergunta 1',
      options: [{ id: 'a', text: 'Resposta certa 1' }, { id: 'b', text: 'Resposta errada 1' }],
      correctOptionId: 'a',
    });
    dailyPlanHook.mockReturnValue(planWith([practiceAction]));
    const updateMastery = vi.fn().mockResolvedValue(false);
    masteryHook.mockReturnValue({ mastery: [], updateMastery, isPersisted: true });
    questionsHook.mockReturnValue({ questions: [q1], syncError: null });

    renderSessao();

    fireEvent.click(screen.getByText('Resposta certa 1'));

    // updateMastery foi chamado (a tentativa não é descartada silenciosamente
    // antes de tentar persistir) e, como resolveu false, o aviso aparece —
    // sem bloquear a mini-atividade.
    expect(updateMastery).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(
        screen.getByText('Não foi possível registrar essa resposta no seu domínio. Ela pode não persistir.')
      ).toBeInTheDocument()
    );

    // Não bloqueante: o aluno ainda consegue concluir a mini-atividade e chegar ao cronômetro.
    fireEvent.click(screen.getByText('Concluir mini-atividade e iniciar cronômetro'));
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  it('type theory: sem mini-atividade, cronômetro direto e texto honesto visível', () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    // Mesmo havendo questões no banco para OUTRO tópico, 'theory' nunca monta a mini-atividade.
    questionsHook.mockReturnValue({ questions: [makeQuestion({ topicId: 'bio-genetics' })], syncError: null });

    renderSessao();

    expect(screen.queryByText(/Mini-atividade antes do cronômetro/)).not.toBeInTheDocument();
    expect(screen.getByText('Reconstrua a base sem apoio; ao final, avalie o que conseguiu.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  it('type practice sem nenhuma questão para o tópico: cai no cronômetro focado com o mesmo aviso honesto, sem quebrar', () => {
    const practiceAction = makeAction({ id: 'stoichiometry', type: 'practice', topicId: 'chem-stoichiometry', topicName: 'Estequiometria' });
    dailyPlanHook.mockReturnValue(planWith([practiceAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    expect(() => renderSessao()).not.toThrow();
    expect(screen.queryByText(/Mini-atividade antes do cronômetro/)).not.toBeInTheDocument();
    expect(screen.getByText('Reconstrua a base sem apoio; ao final, avalie o que conseguiu.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });
});
