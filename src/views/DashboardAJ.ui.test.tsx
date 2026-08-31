import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from './Dashboard';

const mocks = vi.hoisted(() => ({
  addPlanFeedback: vi.fn(() => Promise.resolve()),
  dailyPlan: [
    {
      id: 'action-1',
      type: 'practice' as const,
      topicId: 'funcao-exponencial',
      topicName: 'Função exponencial',
      subject: 'Matemática',
      estimatedMinutes: 35,
      allocatedMinutes: 35,
      priorityScore: 90,
      reasons: ['erro_recorrente', 'prerequisito_bloqueado', 'tempo_disponivel'] as const,
      factors: [
        { kind: 'recurring_errors' as const, rawValue: 3, contribution: 0.45 },
        { kind: 'learning_gap' as const, rawValue: 40, contribution: 0.35 },
      ],
      snapshot: {
        masteryLevel: 42,
        uncertainty: 0.3,
        calculatedAt: '2026-08-26T18:00:00-03:00',
      },
      intervalStart: '2026-08-26T18:00:00-03:00',
      intervalEnd: '2026-08-26T18:35:00-03:00',
    },
  ],
}));

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'ana' } }) }));
vi.mock('../hooks/useUserMastery', () => ({
  useUserMastery: () => ({
    mastery: [{ topicId: 'funcao-exponencial', level: 42, uncertainty: 0.4, lastReviewed: '2026-08-20', errorSignals: 3 }],
    isPersisted: true,
  }),
}));
vi.mock('../hooks/useUserProfile', () => ({
  useUserProfile: () => ({ profile: { autonomyIndex: 64 } }),
}));
vi.mock('../hooks/useDailyPlan', () => ({
  useDailyPlan: () => ({
    availability: { totalMinutes: 90 },
    allocatedActions: mocks.dailyPlan,
  }),
}));
vi.mock('../lib/userData', () => ({
  addPlanFeedback: mocks.addPlanFeedback,
  getPlanFeedback: vi.fn(() => Promise.resolve([])),
  getStudentGoals: vi.fn(() => Promise.resolve({ boards: [], customExams: [] })),
}));
vi.mock('../lib/reviewUrgency', () => ({ pendingReviewCount: () => 2 }));
vi.mock('../data/examCalendar', () => ({ nextExams: () => [], daysUntil: () => 0 }));

describe('AJ Hoje', () => {
  beforeEach(() => mocks.addPlanFeedback.mockClear());

  it('answers priority, reason, duration and action in the first decision surface', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    expect(screen.getByText('Hoje · decisão principal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Função exponencial' })).toBeInTheDocument();
    expect(screen.getAllByText('35 min').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Por que isso?' }));
    expect(screen.getAllByText('Erros recorrentes')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Lacuna de aprendizagem')[0]).toBeInTheDocument();
  });

  it('persists structured disagreement through the existing feedback seam', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Por que isso?' }));
    await user.click(screen.getByRole('button', { name: 'Discordo' }));
    await user.click(screen.getByRole('button', { name: 'Já estudei isso' }));

    expect(mocks.addPlanFeedback).toHaveBeenCalledWith('ana', expect.objectContaining({
      actionId: 'action-1',
      topicId: 'funcao-exponencial',
      reason: 'ja_estudei',
    }));
  });
});
