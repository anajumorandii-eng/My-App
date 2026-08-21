import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccessToken } from '../lib/auth';
import { CalendarEvent } from '../types';
import { computeFreeMinutes, getBusyIntervalsForDay } from '../lib/calendarPlanner';
import { computeStudyBlocksForWeekday, applyBreakOverhead, StudyBlock } from '../lib/netStudyTime';

function timeOnDate(date: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0);
}

export function useAvailableMinutes() {
  const { isConnected } = useAuth();
  const [autoMode, setAutoMode] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      setEvents([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error('No Google access token available');
        const res = await fetch('/api/calendar/events', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`Calendar request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load calendar events for planning:', err);
        if (!cancelled) setError('Não foi possível carregar sua agenda do Google.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isConnected]);

  // Janela de estudo líquido de hoje: começa às 15h (ou mais tarde, se o
  // cursinho terminar depois disso naquele dia da semana) e vai até 20:30,
  // com pausas já descontadas — em vez de uma janela genérica 08h-22h.
  const today = useMemo(() => new Date(), []);
  const todayWindow = useMemo(() => computeStudyBlocksForWeekday(today.getDay()), [today]);
  const [manualMinutes, setManualMinutes] = useState(todayWindow.netMinutes);

  const windowStartDate = useMemo(() => timeOnDate(today, todayWindow.windowStart), [today, todayWindow]);
  const windowEndDate = useMemo(() => timeOnDate(today, todayWindow.windowEnd), [today, todayWindow]);

  // Minutos livres de verdade dentro da janela de estudo (depois de
  // descontar compromissos reais da agenda do Google), com o mesmo desconto
  // de pausas aplicado ao intervalo nominal — a agenda só reduz o tempo
  // bruto disponível, as pausas continuam valendo por cima disso.
  const autoMinutes = useMemo(() => {
    const rawFreeMinutes = computeFreeMinutes(events, windowStartDate, windowEndDate);
    return applyBreakOverhead(rawFreeMinutes, today.getDay());
  }, [events, windowStartDate, windowEndDate, today]);

  const busyCount = useMemo(
    () => getBusyIntervalsForDay(events, windowStartDate).length,
    [events, windowStartDate]
  );

  const usingAuto = isConnected && autoMode && !loading && !error;
  const minutes = usingAuto ? autoMinutes : manualMinutes;

  return {
    minutes,
    usingAuto,
    autoMode,
    setAutoMode,
    manualMinutes,
    setManualMinutes,
    autoMinutes,
    isConnected,
    loading,
    error,
    busyCount,
    // Janela de estudo líquido de hoje (com o horário do cursinho já
    // descontado) e seus blocos de estudo/pausa, pra exibir na tela.
    todayWindow,
  };
}

export type { StudyBlock };
