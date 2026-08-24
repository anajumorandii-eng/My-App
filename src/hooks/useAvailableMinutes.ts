import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccessToken } from '../lib/auth';
import { CalendarEvent } from '../types';
import { computeFreeMinutes, getBusyIntervalsForDay, getDefaultStudyWindow } from '../lib/calendarPlanner';
import { isoToLocalDate } from '../features/availability/time';

const DEFAULT_MANUAL_MINUTES = 120;

export function useAvailableMinutes() {
  const { isConnected } = useAuth();
  const [autoMode, setAutoMode] = useState(true);
  const [manualMinutes, setManualMinutes] = useState(DEFAULT_MANUAL_MINUTES);
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
        const localDate = isoToLocalDate(new Date().toISOString());
        const res = await fetch(`/api/calendar/events?date=${encodeURIComponent(localDate)}`, { headers: { Authorization: `Bearer ${token}` } });
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

  const studyWindow = useMemo(() => getDefaultStudyWindow(), []);
  const autoMinutes = useMemo(
    () => computeFreeMinutes(events, studyWindow.start, studyWindow.end),
    [events, studyWindow]
  );
  const busyCount = useMemo(
    () => getBusyIntervalsForDay(events, studyWindow.start).length,
    [events, studyWindow]
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
  };
}
