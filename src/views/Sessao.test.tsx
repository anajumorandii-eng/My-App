import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import type { DailyPlanState } from '../hooks/useDailyPlan';
import type { AllocatedStudyAction, Question, StudySessionRecord, TopicMastery } from '../types';
import Sessao from './Sessao';

const dailyPlanHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const authHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const getUserStudySessionsForDateMock = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const saveUserStudySessionMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('../hooks/useDailyPlan', () => ({ useDailyPlan: dailyPlanHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../lib/userData', () => ({
  addUserAttempt: addUserAttemptMock,
  getUserStudySessionsForDate: getUserStudySessionsForDateMock,
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
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    authHook.mockReturnValue({ user: { uid: 'student-1' } });
    getUserStudySessionsForDateMock.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('mostra um aviso não bloqueante e cai para a primeira ação do plano quando ?topic= não existe em dailyPlan', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    renderSessao('does-not-exist-anymore');

    expect(
      screen.getByText('O tópico solicitado não está mais no plano de hoje — mostrando sua prioridade atual.')
    ).toBeInTheDocument();
    expect((await screen.findAllByText('Genética Molecular')).length).toBeGreaterThan(0);
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

  it('reconcilia um bloco já concluído hoje antes de qualquer interação', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    const persistedSession: StudySessionRecord = {
      id: 'genetics-previous-session',
      actionId: theoryAction.id,
      topicId: theoryAction.topicId,
      actionType: theoryAction.type,
      plannedMinutes: theoryAction.allocatedMinutes,
      completedMinutes: theoryAction.allocatedMinutes,
      completedAt: '2026-08-24T15:00:00.000Z',
      verification: 'sem_apoio',
    };
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });
    getUserStudySessionsForDateMock.mockResolvedValue([persistedSession]);

    renderSessao();

    expect(await screen.findByText('Tempo de estudo registrado')).toBeInTheDocument();
    expect(screen.getByText('Checagem registrada; o plano foi recalculado com essa evidência.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Concluir' })).toBeDisabled();
  });

  it('não exibe uma ação já derivada enquanto a autenticação tardia reconcilia o novo UID', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    let currentUser: { uid: string } | null = null;
    authHook.mockImplementation(() => ({ user: currentUser }));
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });
    getUserStudySessionsForDateMock.mockReturnValue(new Promise<StudySessionRecord[]>(() => {}));

    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    try {
      flushSync(() => root.render(<MemoryRouter><Sessao /></MemoryRouter>));
      await waitFor(() => expect(host.textContent).toContain('Genética Molecular'));

      currentUser = { uid: 'student-1' };
      flushSync(() => root.render(<MemoryRouter><Sessao /></MemoryRouter>));

      expect(host.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
      expect(host.textContent).not.toContain('Genética Molecular');
    } finally {
      root.unmount();
      host.remove();
    }
  });

  it('limpa a conclusão da conta anterior quando a leitura da nova conta falha', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    const previousSession: StudySessionRecord = {
      id: 'genetics-student-one',
      actionId: theoryAction.id,
      topicId: theoryAction.topicId,
      actionType: theoryAction.type,
      plannedMinutes: theoryAction.allocatedMinutes,
      completedMinutes: theoryAction.allocatedMinutes,
      completedAt: '2026-08-24T15:00:00.000Z',
      verification: 'sem_apoio',
    };
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });
    getUserStudySessionsForDateMock
      .mockResolvedValueOnce([previousSession])
      .mockRejectedValueOnce(new Error('student-two-offline'));

    const rendered = renderSessao();
    expect(await screen.findByText('Tempo de estudo registrado')).toBeInTheDocument();

    authHook.mockReturnValue({ user: { uid: 'student-2' } });
    rendered.rerender(<MemoryRouter><Sessao /></MemoryRouter>);

    expect(await screen.findByText('Não foi possível recuperar os blocos já concluídos hoje. Você ainda pode estudar normalmente.')).toBeInTheDocument();
    expect(screen.queryByText('Tempo de estudo registrado')).not.toBeInTheDocument();
    expect(screen.queryByText('Checagem registrada; o plano foi recalculado com essa evidência.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Concluir' })).toBeEnabled();
  });

  it('pausa o cronômetro ao trocar de conta antes de selecionar o bloco da nova conta', async () => {
    const theoryAction = makeAction({
      id: 'genetics',
      type: 'theory',
      topicId: 'bio-genetics',
      topicName: 'Genética Molecular',
      allocatedMinutes: 1,
    });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });
    getUserStudySessionsForDateMock.mockResolvedValue([]);

    const rendered = renderSessao();
    fireEvent.click(await screen.findByRole('button', { name: 'Iniciar' }));
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();

    authHook.mockReturnValue({ user: { uid: 'student-2' } });
    rendered.rerender(<MemoryRouter><Sessao /></MemoryRouter>);

    expect(await screen.findByRole('button', { name: 'Iniciar' })).toBeInTheDocument();
    expect(screen.queryByText('Tempo de estudo registrado')).not.toBeInTheDocument();
  });

  it('continua renderizando a sessão e mostra um aviso quando a reconciliação falha', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });
    getUserStudySessionsForDateMock.mockRejectedValue(new Error('offline'));

    renderSessao();

    expect(await screen.findByText('Não foi possível recuperar os blocos já concluídos hoje. Você ainda pode estudar normalmente.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  it('mostra skeleton enquanto reconcilia as sessões persistidas', () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });
    getUserStudySessionsForDateMock.mockReturnValue(new Promise<StudySessionRecord[]>(() => {}));

    const { container } = renderSessao();

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('type practice com questões disponíveis: mini-atividade real aparece antes do cronômetro e responder grava tentativa + domínio', async () => {
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
      expect(await screen.findByText('Pergunta 1')).toBeInTheDocument();
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

    fireEvent.click(await screen.findByText('Resposta certa 1'));

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

  it('type theory: sem mini-atividade, cronômetro direto e texto honesto visível', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular' });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    // Mesmo havendo questões no banco para OUTRO tópico, 'theory' nunca monta a mini-atividade.
    questionsHook.mockReturnValue({ questions: [makeQuestion({ topicId: 'bio-genetics' })], syncError: null });

    renderSessao();

    expect(screen.queryByText(/Mini-atividade antes do cronômetro/)).not.toBeInTheDocument();
    expect(await screen.findByText('Reconstrua a base sem apoio; ao final, avalie o que conseguiu.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  it('type practice sem nenhuma questão para o tópico: cai no cronômetro focado com o mesmo aviso honesto, sem quebrar', async () => {
    const practiceAction = makeAction({ id: 'stoichiometry', type: 'practice', topicId: 'chem-stoichiometry', topicName: 'Estequiometria' });
    dailyPlanHook.mockReturnValue(planWith([practiceAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    expect(() => renderSessao()).not.toThrow();
    expect(screen.queryByText(/Mini-atividade antes do cronômetro/)).not.toBeInTheDocument();
    expect(await screen.findByText('Reconstrua a base sem apoio; ao final, avalie o que conseguiu.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  it('respeita redução de movimento no anel de progresso sem alterar o tempo exibido', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular', allocatedMinutes: 30 });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    vi.resetModules();
    const motionDom = await import('motion-dom');
    motionDom.hasReducedMotionListener.current = false;
    motionDom.prefersReducedMotion.current = null;
    const { default: ReducedMotionSessao } = await import('./Sessao');
    const { container } = render(
      <MemoryRouter>
        <ReducedMotionSessao />
      </MemoryRouter>
    );

    expect((await screen.findAllByText('30:00')).length).toBeGreaterThan(0);
    const progressRing = container.querySelector('circle[stroke-linecap="round"]');
    expect(progressRing).toBeInTheDocument();
    expect(progressRing).not.toHaveClass('transition-all');
  });

  it('anuncia o tempo do cronômetro ao cruzar um minuto e ao concluir', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular', allocatedMinutes: 2 });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    const { container } = renderSessao();
    expect((await screen.findAllByText('02:00')).length).toBeGreaterThan(0);
    vi.useFakeTimers();

    const liveTimer = container.querySelector('[aria-live="polite"]');

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(liveTimer).toHaveTextContent('Tempo restante: 01:00');

    act(() => vi.advanceTimersByTime(60_000));
    expect(liveTimer).toHaveTextContent('Cronômetro concluído: 00:00');
    expect(screen.getByText('Tempo de estudo registrado')).toBeInTheDocument();
  });

  it('anuncia iniciar, pausar e concluir manualmente sem anunciar o segundo intermediário', async () => {
    const theoryAction = makeAction({ id: 'genetics', type: 'theory', topicId: 'bio-genetics', topicName: 'Genética Molecular', allocatedMinutes: 2 });
    dailyPlanHook.mockReturnValue(planWith([theoryAction]));
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn().mockResolvedValue(true), isPersisted: true });
    questionsHook.mockReturnValue({ questions: [], syncError: null });

    const { container } = renderSessao();
    expect((await screen.findAllByText('02:00')).length).toBeGreaterThan(0);
    vi.useFakeTimers();
    const liveTimer = container.querySelector('[aria-live="polite"]');

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }));
    expect(liveTimer).toHaveTextContent('Cronômetro iniciado: 02:00');

    act(() => vi.advanceTimersByTime(1_000));
    expect(liveTimer).toHaveTextContent('Cronômetro iniciado: 02:00');

    fireEvent.click(screen.getByRole('button', { name: 'Pausar' }));
    expect(liveTimer).toHaveTextContent('Cronômetro pausado: 01:59');

    fireEvent.click(screen.getByRole('button', { name: 'Concluir' }));
    expect(liveTimer).toHaveTextContent('Cronômetro concluído: 01:59');
    expect(screen.getByText('Tempo de estudo registrado')).toBeInTheDocument();
  });
});
