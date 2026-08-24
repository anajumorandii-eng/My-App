import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyStudyAvailability } from '../features/availability/types';
import type { DailyPlanState } from '../hooks/useDailyPlan';
import type { AllocatedStudyAction, StudyAction } from '../types';
import Dashboard from './Dashboard';
import Plano from './Plano';
import Sessao from './Sessao';

const dailyPlanHook = vi.hoisted(() => vi.fn());
const profileHook = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useDailyPlan', () => ({ useDailyPlan: dailyPlanHook }));
vi.mock('../hooks/useUserProfile', () => ({ useUserProfile: profileHook }));

const LOCAL_DATE = '2026-08-24';
const FIRST_TOPIC = 'Genética Molecular';

const availability: DailyStudyAvailability = {
  localDate: LOCAL_DATE,
  timeZone: 'America/Sao_Paulo',
  intervals: [
    { start: '2026-08-24T14:40:00.000Z', end: '2026-08-24T15:30:00.000Z', durationMinutes: 50 },
    { start: '2026-08-24T15:40:00.000Z', end: '2026-08-24T16:30:00.000Z', durationMinutes: 50 },
    { start: '2026-08-24T17:00:00.000Z', end: '2026-08-24T17:50:00.000Z', durationMinutes: 50 },
    { start: '2026-08-24T18:00:00.000Z', end: '2026-08-24T18:50:00.000Z', durationMinutes: 50 },
    { start: '2026-08-24T19:00:00.000Z', end: '2026-08-24T19:50:00.000Z', durationMinutes: 50 },
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
    topicId: 'bio-genetics',
    topicName: FIRST_TOPIC,
    subject: 'Biologia',
    estimatedMinutes: 45,
    priorityScore: 100,
    intervalStart: '2026-08-24T14:40:00.000Z',
    intervalEnd: '2026-08-24T15:00:00.000Z',
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
    intervalStart: '2026-08-24T15:40:00.000Z',
    intervalEnd: '2026-08-24T16:25:00.000Z',
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
    intervalStart: '2026-08-24T17:00:00.000Z',
    intervalEnd: '2026-08-24T17:15:00.000Z',
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
    intervalStart: '2026-08-24T18:00:00.000Z',
    intervalEnd: '2026-08-24T18:30:00.000Z',
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
    intervalStart: '2026-08-24T19:00:00.000Z',
    intervalEnd: '2026-08-24T19:20:00.000Z',
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
    render(<View />);

    expect(screen.getByText('250 min')).toBeInTheDocument();
    expect(screen.getAllByText(FIRST_TOPIC).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/11:40/).length).toBeGreaterThan(0);
  });

  it('Plano removes manual and Calendar-primary controls while retaining warnings and unallocated priorities', () => {
    render(<Plano />);

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
        intervalEnd: '2026-08-24T14:55:00.000Z',
      }],
    };

    render(<Sessao />);

    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('Sessão selects the first allocated action when the loaded daily plan arrives', () => {
    currentPlan = loadingPlan;
    const rendered = render(<Sessao />);
    expect(screen.queryByText(FIRST_TOPIC)).not.toBeInTheDocument();

    currentPlan = sharedPlan;
    rendered.rerender(<Sessao />);

    expect(screen.getAllByText(FIRST_TOPIC).length).toBeGreaterThan(0);
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });
});
