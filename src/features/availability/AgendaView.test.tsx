import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createInitialWeeklySchedule } from './weeklyScheduleSeed';
import { SAO_PAULO_TIME_ZONE, type DailyStudyAvailability, type WeeklySchedule } from './types';

const availabilityState = vi.hoisted(() => ({
  schedule: undefined as WeeklySchedule | undefined,
  saveSchedule: vi.fn(),
  saveException: vi.fn(),
}));

vi.mock('./useDailyStudyAvailability', () => ({
  useDailyStudyAvailability: () => ({
    availability: {
      localDate: '2026-08-24',
      timeZone: SAO_PAULO_TIME_ZONE,
      intervals: [
        { start: '2026-08-24T14:40:00-03:00', end: '2026-08-24T15:30:00-03:00', durationMinutes: 50 },
        { start: '2026-08-24T15:40:00-03:00', end: '2026-08-24T16:30:00-03:00', durationMinutes: 50 },
        { start: '2026-08-24T16:40:00-03:00', end: '2026-08-24T17:30:00-03:00', durationMinutes: 50 },
        { start: '2026-08-24T18:00:00-03:00', end: '2026-08-24T18:50:00-03:00', durationMinutes: 50 },
        { start: '2026-08-24T19:00:00-03:00', end: '2026-08-24T19:50:00-03:00', durationMinutes: 50 },
      ],
      totalMinutes: 250,
      status: 'ready',
      warnings: [{ code: 'calendar-disconnected', message: 'Google Calendar nÃ£o estÃ¡ conectado.' }],
    } satisfies DailyStudyAvailability,
    schedule: availabilityState.schedule,
    exception: undefined,
    loading: false,
    syncError: null,
    saveSchedule: availabilityState.saveSchedule,
    saveException: availabilityState.saveException,
    deleteException: vi.fn(),
  }),
}));

vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}));

import AgendaView from './AgendaView';
import Layout from '../../components/Layout';
import App from '../../App';

describe('AgendaView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-24T15:00:00.000Z'));
    availabilityState.schedule = createInitialWeeklySchedule('2026-08-24T15:00:00.000Z');
    availabilityState.saveSchedule.mockReset().mockResolvedValue(true);
    availabilityState.saveException.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('shows Monday study blocks and marks estimated recurring entries as editable', () => {
    render(<AgendaView />);

    expect(screen.queryByText(/Ingl\u00eas/i)).not.toBeInTheDocument();
    expect(screen.getByText('14:40\u201315:30')).toBeInTheDocument();
    expect(screen.getByText('250 min')).toBeInTheDocument();
    expect(screen.getAllByText(/Estimativa edit\u00e1vel/i).length).toBeGreaterThan(0);
  });

  it('confirms an estimated weekly study window when it is saved', () => {
    render(<AgendaView />);

    fireEvent.change(screen.getByLabelText('In\u00edcio de quinta-feira'), { target: { value: '17:40' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar semana' }));

    const savedSchedule = availabilityState.saveSchedule.mock.calls[0][0];
    const confirmedThursdayStudy = savedSchedule.days.thursday.find((entry) => entry.id === 'thu-study');
    expect(confirmedThursdayStudy).toMatchObject({ id: 'thu-study', start: '17:40' });
    expect(confirmedThursdayStudy).not.toHaveProperty('isEstimate');
  });

  it('keeps an estimated edit open and explains invalid weekly time ordering', async () => {
    render(<AgendaView />);

    fireEvent.change(screen.getByLabelText('Fim de quinta-feira'), { target: { value: '17:30' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Salvar semana' }));
    });

    expect(availabilityState.saveSchedule).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/fim precisa ser posterior ao in\u00edcio/i);
    const thursdayCard = screen.getByRole('heading', { name: 'Quinta-feira' }).closest('article')!;
    expect(within(thursdayCard).getByText(/Estimativa edit\u00e1vel/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Fim de quinta-feira')).toHaveValue('17:30');
  });

  it('keeps an estimated edit open when the weekly save reports failure', async () => {
    availabilityState.saveSchedule.mockResolvedValue(false);
    render(<AgendaView />);

    fireEvent.change(screen.getByLabelText('In\u00edcio de quinta-feira'), { target: { value: '17:40' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Salvar semana' }));
    });

    expect(screen.getByRole('alert')).toHaveTextContent(/n\u00e3o foi poss\u00edvel salvar a semana/i);
    const thursdayCard = screen.getByRole('heading', { name: 'Quinta-feira' }).closest('article')!;
    expect(within(thursdayCard).getByText(/Estimativa edit\u00e1vel/i)).toBeInTheDocument();
    expect(screen.getByLabelText('In\u00edcio de quinta-feira')).toHaveValue('17:40');
  });

  it('removes the prior save error after a successful retry confirms the weekly edit', async () => {
    availabilityState.saveSchedule.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<AgendaView />);

    fireEvent.change(screen.getByLabelText('In\u00edcio de quinta-feira'), { target: { value: '17:40' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Salvar semana' }));
    });
    expect(screen.getByRole('alert')).toHaveTextContent(/n\u00e3o foi poss\u00edvel salvar a semana/i);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Salvar semana' }));
    });

    expect(availabilityState.saveSchedule).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    const thursdayCard = screen.getByRole('heading', { name: 'Quinta-feira' }).closest('article')!;
    expect(within(thursdayCard).queryByText(/Estimativa edit\u00e1vel/i)).not.toBeInTheDocument();
  });

  it('saves a date-only early departure without changing the weekly schedule', () => {
    render(<AgendaView />);

    fireEvent.change(screen.getByLabelText('Data da exce\u00e7\u00e3o'), { target: { value: '2026-08-24' } });
    fireEvent.change(screen.getByLabelText('Motivo'), { target: { value: 'early_departure' } });
    fireEvent.change(screen.getByLabelText('Opera\u00e7\u00e3o'), { target: { value: 'early_departure' } });
    fireEvent.change(screen.getByLabelText('Hor\u00e1rio de sa\u00edda'), { target: { value: '18:30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar exce\u00e7\u00e3o' }));

    expect(availabilityState.saveException).toHaveBeenCalledWith(expect.objectContaining({
      localDate: '2026-08-24',
      reason: 'early_departure',
      operation: 'early_departure',
      departureTime: '18:30',
      timeZone: SAO_PAULO_TIME_ZONE,
    }));
    expect(availabilityState.saveSchedule).not.toHaveBeenCalled();
    expect(availabilityState.schedule).toEqual(createInitialWeeklySchedule('2026-08-24T15:00:00.000Z'));
  });

  it('links to the Agenda from the primary navigation', () => {
    localStorage.setItem('juju_onboarding', 'true');
    render(<MemoryRouter><Layout /></MemoryRouter>);

    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute('href', '/agenda');
  });

  it('renders the Agenda at its application route', () => {
    window.history.pushState({}, '', '/agenda');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Agenda' })).toBeInTheDocument();
  });
});
