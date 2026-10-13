import { buildStudyHorizon } from '../lib/studyHorizon';
import type { WeeklySchedule } from '../features/availability/types';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { DailyStudyAvailability } from '../features/availability/types';
import { useUserMastery } from '../hooks/useUserMastery';
import { useUserProfile } from '../hooks/useUserProfile';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { EfficiencyEngine } from '../lib/efficiencyEngine';
import { allocateStudyActions } from '../lib/studyActionAllocator';
import { applyExamDayLimits } from '../lib/examDayLimits';
import { mockTopics } from '../data/mockData';
import { sameBoard, vestibularCalendar2026 } from '../data/examCalendar';
import { SAO_PAULO_TIME_ZONE } from '../features/availability/types';
const time = (iso: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: SAO_PAULO_TIME_ZONE }).format(new Date(iso));
const activityNames = { theory: 'Base e exemplo resolvido', practice: 'Prática independente', review: 'Recuperação ativa', error_analysis: 'Correção e transferência' };

export default function AdaptiveStudyDay({ localDate, availability, schedule }: { localDate: string; availability?: DailyStudyAvailability; schedule?: WeeklySchedule }) {
  const mastery = useUserMastery(); const profile = useUserProfile(); const { goals, loading: goalsLoading } = useStudentGoals();
  const ranked = useMemo(() => EfficiencyEngine.rankStudyActions(mastery.mastery, mockTopics, profile.profile, goals, new Date(`${localDate}T12:00:00-03:00`)), [mastery.mastery, profile.profile, goals, localDate]);
  const intervals = applyExamDayLimits(availability?.intervals ?? [], localDate, goals);
  const actions = allocateStudyActions(ranked, intervals);
  const allocatedIds = new Set(actions.map((action) => action.id));
  const deferred = ranked.filter((action) => !allocatedIds.has(action.id));
  const total = intervals.reduce((sum, i) => sum + i.durationMinutes, 0);
  const limited = total < (availability?.totalMinutes ?? 0);
  const horizon = useMemo(() => schedule && localDate >= '2025-12-13' ? buildStudyHorizon(schedule, goals, localDate) : [], [schedule, goals, localDate]);
  const upcoming = vestibularCalendar2026.filter((exam) => exam.date >= localDate && goals.boardWeights.some((goal) => goal.weight > 0 && sameBoard(goal.board, exam.board) && (goal.phaseFocus === 'ambas' || exam.phase === 'unica' || goal.phaseFocus === exam.phase))).sort((a,b) => a.date.localeCompare(b.date));
  return <section className="ni-panel p-4 space-y-3" aria-labelledby="plano-rotina">
    <h2 id="plano-rotina" className="font-display text-xl">O que cabe neste dia</h2>
    <p className="text-sm text-[var(--dim)]">{total} minutos líquidos. O plano combina domínio estimado, erros, revisão e objetivos. Revisões ocupam primeiro a janela reservada; o restante fica explícito.</p>
    {limited && <p role="status" className="text-sm">{total === 0 ? 'Dia de prova ativa: estudo autônomo bloqueado para proteger a prova e o descanso.' : 'Véspera de prova ativa: no máximo 90 minutos de revisão leve, sem lista nova.'}</p>}
    {(mastery.loading || profile.loading || goalsLoading) ? <p role="status">Carregando as prioridades...</p> : <ol className="space-y-2">{actions.slice(0, 8).map((action) => <li key={action.id} className="border-t border-[var(--line)] pt-2 text-sm"><b>{time(action.intervalStart)}–{time(action.intervalEnd)}</b> · {action.subject}: {action.topicName}<p className="text-xs text-[var(--dim)]">{activityNames[action.type]} · {action.estimatedMinutes} min · <Link to={action.type === 'review' ? '/revisoes' : action.type === 'error_analysis' ? '/erros' : action.type === 'theory' ? '/resumos' : '/questoes'} className="underline">Abrir atividade</Link></p></li>)}</ol>}
    {actions.length > 8 && <details><summary className="cursor-pointer text-sm">Mais {actions.length - 8} atividades alocadas</summary><ul>{actions.slice(8).map((action) => <li key={action.id} className="text-xs py-1">{time(action.intervalStart)}–{time(action.intervalEnd)} · {action.topicName} · {activityNames[action.type]}</li>)}</ul></details>}
    {deferred.length > 0 && <details><summary className="cursor-pointer text-sm">{deferred.length} prioridades ficam para depois</summary><p className="text-xs text-[var(--dim)] my-2">Não cabem nas janelas compatíveis deste dia. Não aumente a noite para compensar tudo; replaneje após registrar o resultado.</p><ul className="text-xs space-y-1">{deferred.slice(0, 10).map((action) => <li key={action.id}>{action.subject} · {action.topicName} · {action.estimatedMinutes} min</li>)}</ul></details>}
    <details><summary className="cursor-pointer text-sm">Marcos até o fim das provas</summary><p className="text-xs text-[var(--dim)] my-2">Bancas ativas nos seus objetivos. Segunda fase depende de convocação. Datas a confirmar não bloqueiam automaticamente a agenda.</p><ul className="space-y-2">{upcoming.map((exam) => <li key={exam.id} className="text-sm">{exam.date.split('-').reverse().join('/')} · {exam.label}{exam.confidence !== 'alta' && <span> · a confirmar</span>}{exam.source.startsWith('https://') && <a href={exam.source} target="_blank" rel="noreferrer" className="ml-2 text-xs underline">Fonte</a>}</li>)}</ul><Link to="/perfil" className="text-xs underline">Conferir bancas e fases nos objetivos</Link></details>
    {horizon.length > 0 && <details><summary className="cursor-pointer text-sm">Capacidade semanal até a última prova prevista</summary><p className="text-xs text-[var(--dim)] my-2">Estimativa baseada na rotina salva. Calendar e exceções de datas futuras ainda não foram consultados. Confira inscrições, convocação e datas pendentes.</p><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr><th className="text-left p-2">Período</th><th className="text-left p-2">Tempo líquido</th><th className="text-left p-2">Foco próximo</th></tr></thead><tbody>{horizon.map((week) => <tr key={week.start} className="border-t border-[var(--line)]"><td className="p-2">{week.start.slice(5).split('-').reverse().join('/')}–{week.end.slice(5).split('-').reverse().join('/')}</td><td className="p-2">{Math.floor(week.minutes/60)}h {week.minutes%60}min</td><td className="p-2">{week.days[0].focus}</td></tr>)}</tbody></table></div></details>}
    <a href="/study-guide.html" target="_blank" rel="noreferrer" className="inline-block text-sm underline">Guia de estudo, revisão e preparação até as provas</a>
  </section>;
}
