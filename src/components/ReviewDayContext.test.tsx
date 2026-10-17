import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
vi.mock('../features/availability/useDailyStudyAvailability', () => ({ useDailyStudyAvailability: () => ({ loading: false, syncError: null, availability: { totalMinutes: 150, intervals: [0,1,2].map((i) => ({ start: `2026-10-17T${14+i}:30:00-03:00`, end: `2026-10-17T${15+i}:20:00-03:00`, durationMinutes: 50 })) } }) }));
vi.mock('../hooks/useStudentGoals', () => ({ useStudentGoals: () => ({ goals: { primaryGoal: 'Medicina', secondaryGoals: [], boardWeights: [{ board: 'Unicamp', weight: 1, phaseFocus: 'ambas' }] } }) }));
vi.mock('./ErrorRevisitPanel', () => ({ default: () => <div>Erros</div> }));
import ReviewDayContext from './ReviewDayContext';
it('mostra horários de véspera em São Paulo, inclusive finais recebidos em UTC', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-17T12:00:00Z'));
  try {
    render(<MemoryRouter><ReviewDayContext localDate="2026-10-17" /></MemoryRouter>);
    expect(screen.getByText(/14:30–15:20, 15:30–16:10/)).toBeInTheDocument();
  } finally { vi.useRealTimers(); }
});
