import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { DailyStudyAvailability } from '../features/availability/types';
import type { DailyPlanState } from '../hooks/useDailyPlan';
import type { AllocatedStudyAction, StudyAction } from '../types';
import Dashboard from './Dashboard';
import Plano from './Plano';
import Sessao from './Sessao';

const dailyPlanHook = vi.hoisted(() => vi.fn());
const profileHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const goalsHook = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useDailyPlan', () => ({ useDailyPlan: dailyPlanHook }));
vi.mock('../hooks/useUserProfile', () => ({ useUserProfile: profileHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useStudentGoals', () => ({ useStudentGoals: goalsHook }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: undefined }) }));

function renderView(view: React.ReactNode) {
  return render(<MemoryRouter>{view}</MemoryRouter>);
}

const LOCAL_DATE = '2026-08-24';
const FIRST_TOPIC = 'Genética Molecular';

const availability: DailyStudyAvailability = {
  localDate: LOCAL_DATE,
  timeZone: 'America/Sao_Paulo',
  intervals: [
    { start: '2026-08-24T14:40:00-03:00', end: '2026-08-24T15:30:00-03:00', durationMinutes: 50 },
    { start: '2026-08-24T15:40:00-03:00', end: '2026-08-24T16:30:00-03:00', durationMinutes: 50 },
    { start: '2026-08-24T17:00:00-03:00', end: '2026-08-24T17:50:00-03:00', durationMinutes: 50 },
    { start: '2026-08-24T18:00:00-03:00', end: '2026-08-24T18:50:00-03:00', durationMinutes: 50 },
    { start: '2026-08-24T19:00:00-03:00', end: '2026-08-24T19:50:00-03:00', durationMinutes: 50 },
  ],
  totalMinutes: 250,
  status: 'degraded',
  warnings: [
    { code: 'calendar-disconnected', message: 'Google Calendar não está conectado.' },
    { code: 'schedule-unavailable', message: 'A disponibilidade semanal está degradada.' },
  ],
};

const allocatedActions: AllocatedStudyAction[] = [
  {
    id: 'genetics',
    type: 'theory',
    topicId: 'bio_genetica',
    topicName: FIRST_TOPIC,
    subject: 'Biologia',
    estimatedMinutes: 45,
    priorityScore: 100,
    reasons: ['dominio_insuficiente', 'revisao_urgente', 'proximidade_prova', 'tempo_disponivel'],
    factors: [
      { kind: 'learning_gap', rawValue: 65, contribution: 26 },
      { kind: 'review_urgency', rawValue: 73, contribution: 21.9 },
      { kind: 'recurring_errors', rawValue: 2, contribution: 12 },
      { kind: 'energy_adjustment', rawValue: 1, contribution: 0 },
      { kind: 'exam_relevance', rawValue: 1.08225, contribution: 4.93 },
    ],
    snapshot: { masteryLevel: 35, uncertainty: 0.3, calculatedAt: '2026-08-24T12:00:00.000Z' },
    intervalStart: '2026-08-24T14:40:00-03:00',
    intervalEnd: '2026-08-24T15:00:00-03:00',
    allocatedMinutes: 20,
  },
  {
    id: 'functions',
    type: 'practice',
    topicId: 'math-functions',
    topicName: 'Funções Exponenciais',
    subject: 'Matemática',
    estimatedMinutes: 45,
    priorityScore: 90,
    reasons: [],
    factors: [],
    snapshot: { masteryLevel: 0, uncertainty: 0, calculatedAt: new Date().toISOString() },
    intervalStart: '2026-08-24T15:40:00-03:00',
    intervalEnd: '2026-08-24T16:25:00-03:00',
    allocatedMinutes: 45,
  },
  {
    id: 'mechanics',
    type: 'review',
    topicId: 'physics-mechanics',
    topicName: 'Mecânica',
    subject: 'Física',
    estimatedMinutes: 15,
    priorityScore: 80,
    reasons: [],
    factors: [],
    snapshot: { masteryLevel: 0, uncertainty: 0, calculatedAt: new Date().toISOString() },
    intervalStart: '2026-08-24T17:00:00-03:00',
    intervalEnd: '2026-08-24T17:15:00-03:00',
    allocatedMinutes: 15,
  },
  {
    id: 'stoichiometry',
    type: 'practice',
    topicId: 'chem-stoichiometry',
    topicName: 'Estequiometria',
    subject: 'Química',
    estimatedMinutes: 30,
    priorityScore: 70,
    reasons: [],
    factors: [],
    snapshot: { masteryLevel: 0, uncertainty: 0, calculatedAt: new Date().toISOString() },
    intervalStart: '2026-08-24T18:00:00-03:00',
    intervalEnd: '2026-08-24T18:30:00-03:00',
    allocatedMinutes: 30,
  },
  {
    id: 'ecology',
    type: 'error_analysis',
    topicId: 'bio-ecology',
    topicName: 'Ecologia',
    subject: 'Biologia',
    estimatedMinutes: 20,
    priorityScore: 60,
    reasons: [],
    factors: [],
    snapshot: { masteryLevel: 0, uncertainty: 0, calculatedAt: new Date().toISOString() },
    intervalStart: '2026-08-24T19:00:00-03:00',
    intervalEnd: '2026-08-24T19:20:00-03:00',
    allocatedMinutes: 20,
  },
];

const waitingAction: StudyAction = {
  id: 'renal-physiology',
  type: 'review',
  topicId: 'bio-renal',
  topicName: 'Fisiologia Renal',
  subject: 'Biologia',
  estimatedMinutes: 30,
  priorityScore: 50,
  reasons: [],
  factors: [],
  snapshot: { masteryLevel: 0, uncertainty: 0, calculatedAt: new Date().toISOString() },
};

const prioritizedActions: StudyAction[] = [
  ...allocatedActions.map(({ intervalStart: _start, intervalEnd: _end, allocatedMinutes: _minutes, ...action }) => action),
  waitingAction,
];

const sharedPlan: DailyPlanState = {
  availability,
  prioritizedActions,
  allocatedActions,
  loading: false,
  warnings: availability.warnings,
  isPersisted: true,
};

const loadingPlan: DailyPlanState = {
  availability: undefined,
  prioritizedActions: [],
  allocatedActions: [],
  loading: true,
  warnings: [],
  isPersisted: true,
};

let currentPlan: DailyPlanState;

describe('daily plan consistency across views', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-24T12:00:00.000Z'));
    currentPlan = sharedPlan;
    dailyPlanHook.mockImplementation((localDate: string) => localDate === LOCAL_DATE ? currentPlan : loadingPlan);
    profileHook.mockReturnValue({
      profile: {
        targetCourse: 'Medicina',
        targetUniversities: ['USP'],
        targetExams: ['FUVEST'],
        availableHoursPerWeek: 20,
        currentEnergyLevel: 'medium',
        autonomyIndex: 70,
      },
      loading: false,
      syncError: null,
      isPersisted: true,
      updateProfile: vi.fn(),
    });
    masteryHook.mockReturnValue({
      mastery: [],
      updateMastery: vi.fn().mockResolvedValue(true),
      loading: false,
      syncError: null,
      isPersisted: true,
    });
    goalsHook.mockReturnValue({
      goals: {
        primaryGoal: 'Medicina',
        secondaryGoals: [],
        boardWeights: [{ board: 'FUVEST', weight: 1, phaseFocus: 'ambas' }],
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it.each([
    ['Dashboard', Dashboard],
    ['Plano', Plano],
    ['Sessão', Sessao],
  ])('%s shows the shared effective minutes, first action, and scheduled start', (_name, View) => {
    expect(allocatedActions.every((action, index) => index === 0 || action.intervalStart >= allocatedActions[index - 1].intervalStart)).toBe(true);
    renderView(<View />);

    expect(screen.getByText('250 min')).toBeInTheDocument();
    expect(screen.getAllByText(FIRST_TOPIC).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/14:40/).length).toBeGreaterThan(0);
  });

  it('Dashboard mostra cada ação priorizada uma vez em uma sequência ranqueada', async () => {
    renderView(<Dashboard />);

    const sequence = screen.getByRole('region', { name: 'Sequência de decisão' });
    const laterActions = within(sequence);
    const waitingDisclosure = screen.getByRole('group', { name: 'Pode esperar' });

    expect(screen.getByRole('heading', { name: FIRST_TOPIC })).toBeInTheDocument();
    expect(laterActions.queryByText(FIRST_TOPIC)).not.toBeInTheDocument();
    for (const action of allocatedActions.slice(1)) {
      expect(laterActions.getAllByText(action.topicName)).toHaveLength(1);
    }
    const waitingButton = within(waitingDisclosure).getByRole('button', { name: 'Pode esperar' });
    expect(waitingDisclosure).not.toHaveAttribute('aria-expanded');
    expect(waitingButton).toHaveAttribute('aria-expanded', 'false');
    expect(within(waitingDisclosure).queryByText(waitingAction.topicName)).not.toBeInTheDocument();

    fireEvent.click(waitingButton);
    expect(waitingButton).toHaveAttribute('aria-expanded', 'true');
    expect(within(waitingDisclosure).getAllByText(waitingAction.topicName)).toHaveLength(1);

    expect(Array.from(sequence.querySelectorAll<HTMLElement>('[data-action-id]')).map((node) => node.dataset.actionId))
      .toEqual([...allocatedActions.slice(1), waitingAction].map((action) => action.id));
  });

  it('Dashboard renders one immersive decision and removes generic dashboard blocks', () => {
    renderView(<Dashboard />);
    const stage = screen.getByTestId('today-decision-stage');
    expect(within(stage).getByRole('heading', { name: FIRST_TOPIC })).toBeInTheDocument();
    expect(within(stage).getByRole('button', { name: 'Começar' })).toBeInTheDocument();
    expect(within(stage).getByTestId('crivo-core')).toHaveAttribute('data-scale', 'hero');
    const signals = within(stage).getByLabelText('Sinais usados na decisão');
    expect(signals.tagName).toBe('DL');
    for (const label of ['Domínio', 'Confiança', 'Urgência', 'Tempo']) {
      expect(within(signals).getByText(label)).toBeInTheDocument();
    }
    for (const value of ['35%', '70%', '73%', '20 min']) {
      expect(within(signals).getByText(value)).toBeInTheDocument();
    }
    expect(screen.queryByText('Prioridade Máxima')).not.toBeInTheDocument();
    expect(screen.queryByText('Prioridade Fuvest')).not.toBeInTheDocument();
  });

  it('Dashboard discloses only context causally supported by the current action', () => {
    renderView(<Dashboard />);

    const context = screen.getByText('Contexto que entrou na decisão').closest('details');
    expect(context).not.toBeNull();
    expect(within(context!).getByText('250 min')).toBeInTheDocument();
    expect(within(context!).getByText('73% de urgência neste tópico')).toBeInTheDocument();
    expect(within(context!).getByText('FUVEST — 1ª fase')).toBeInTheDocument();
    expect(within(context!).queryByText(/Santa Casa/)).not.toBeInTheDocument();
  });

  it('Dashboard omits decision context when no current-action signal contributed', () => {
    currentPlan = {
      ...sharedPlan,
      allocatedActions: [{
        ...allocatedActions[0],
        reasons: ['dominio_insuficiente'],
        factors: allocatedActions[0].factors.map((factor) => ({
          ...factor,
          rawValue: factor.kind === 'exam_relevance' ? 1 : factor.rawValue,
          contribution: 0,
        })),
      }],
    };

    renderView(<Dashboard />);

    expect(screen.queryByText('Contexto que entrou na decisão')).not.toBeInTheDocument();
  });

  it('Plano removes manual and Calendar-primary controls while retaining warnings and unallocated priorities', () => {
    renderView(<Plano />);

    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(screen.queryByText('Calcular pela agenda do Google')).not.toBeInTheDocument();
    expect(screen.queryByText(/tempo livre entre agora e 22h/i)).not.toBeInTheDocument();
    expect(screen.getByText('Google Calendar não está conectado.')).toBeInTheDocument();
    expect(screen.getByText('A disponibilidade semanal está degradada.')).toBeInTheDocument();
    const waitingList = screen.getByRole('heading', { name: 'Fila de Espera' }).closest('section');
    expect(waitingList).not.toBeNull();
    expect(within(waitingList!).getByText('Fisiologia Renal')).toBeInTheDocument();
    expect(within(waitingList!).queryByText(FIRST_TOPIC)).not.toBeInTheDocument();
  });

  it('Sessão caps its timer at the allocated interval instead of using the estimate', () => {
    currentPlan = {
      ...sharedPlan,
      allocatedActions: [{
        ...allocatedActions[0],
        estimatedMinutes: 45,
        allocatedMinutes: 20,
        intervalEnd: '2026-08-24T15:00:00-03:00',
      }],
    };

    renderView(<Sessao />);

    expect(screen.getAllByText((_content, element) => element?.textContent?.includes('14:40–15:00') ?? false).length).toBeGreaterThan(0);
  });

  it('Sessão selects the first allocated action when the loaded daily plan arrives', () => {
    currentPlan = loadingPlan;
    const rendered = renderView(<Sessao />);
    expect(screen.queryByText(FIRST_TOPIC)).not.toBeInTheDocument();

    currentPlan = sharedPlan;
    rendered.rerender(<MemoryRouter><Sessao /></MemoryRouter>);

    expect(screen.getAllByText(FIRST_TOPIC).length).toBeGreaterThan(0);
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });
});
