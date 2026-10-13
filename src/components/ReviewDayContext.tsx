import { formatIsoTimeInSaoPaulo } from '../features/availability/time';
import { Link } from 'react-router-dom';
import { useDailyStudyAvailability } from '../features/availability/useDailyStudyAvailability';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { applyExamDayLimits } from '../lib/examDayLimits';
import ErrorRevisitPanel from './ErrorRevisitPanel';

export default function ReviewDayContext({ localDate }: { localDate: string }) {
  const { availability, loading, syncError } = useDailyStudyAvailability(localDate);
  const { goals } = useStudentGoals();
  const intervals = applyExamDayLimits(availability?.intervals ?? [], localDate, goals);
  const reserved = intervals.filter((i) => i.purpose === 'review');
  const budget = Math.min(30, (reserved.length ? reserved : intervals).reduce((sum, i) => sum + i.durationMinutes, 0));
  return <div className="space-y-3 mb-4">
    <section className="ni-panel p-4 space-y-2" aria-labelledby="revisao-na-rotina">
      <h2 id="revisao-na-rotina" className="font-display text-lg">Revisão que cabe na rotina</h2>
      {loading ? <p role="status">Consultando suas janelas...</p> : <p className="text-sm text-[var(--dim)]">{budget} minutos para revisitas de erros neste dia. {reserved.length > 0 ? `Janelas reservadas: ${reserved.map((i) => `${formatIsoTimeInSaoPaulo(i.start)}–${formatIsoTimeInSaoPaulo(i.end)}`).join(', ')}.` : 'Sem janela exclusiva: confira o plano da agenda antes de encaixar a revisão.'}</p>}
      {syncError && <p role="alert" className="text-sm">{syncError}</p>}
      <Link to="/agenda" className="text-sm underline">Ajustar rotina, compromissos e prioridades do dia</Link>
      <a href="/study-guide.html" target="_blank" rel="noreferrer" className="ml-4 text-sm underline">Consultar guia de estudo</a>
    </section>
    {!loading && <ErrorRevisitPanel localDate={localDate} availableMinutes={budget} />}
  </div>;
}
