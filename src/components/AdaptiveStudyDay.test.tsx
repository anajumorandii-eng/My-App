import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import { mockProfile, mockStudentGoals } from '../data/mockData';
import { createInitialWeeklySchedule } from '../features/availability/weeklyScheduleSeed';
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ mastery: [], loading: false }) }));
vi.mock('../hooks/useUserProfile', () => ({ useUserProfile: () => ({ profile: mockProfile, loading: false }) }));
vi.mock('../hooks/useStudentGoals', () => ({ useStudentGoals: () => ({ goals: mockStudentGoals, loading: false }) }));
import AdaptiveStudyDay from './AdaptiveStudyDay';
it('data histórica válida não derruba a agenda por limite do horizonte opcional', () => {
  expect(() => render(<MemoryRouter><AdaptiveStudyDay localDate="2025-01-01" schedule={createInitialWeeklySchedule('2026-10-13T12:00:00Z')} /></MemoryRouter>)).not.toThrow();
  expect(screen.getByRole('heading', { name: 'O que cabe neste dia' })).toBeInTheDocument();
});
