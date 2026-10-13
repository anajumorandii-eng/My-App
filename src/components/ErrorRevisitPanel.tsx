import { isoToLocalDate } from '../features/availability/time';
import { Link } from 'react-router-dom';
import { useErrorReviewHistory } from '../hooks/useErrorReviewHistory';
import { buildErrorRevisitPlan } from '../lib/reviewInsights';
import { mockTopics } from '../data/mockData';

export default function ErrorRevisitPanel({ localDate, availableMinutes = 30 }: { localDate: string; availableMinutes?: number }) {
  const { errors, loading, saving, warning, complete, isPersonal } = useErrorReviewHistory();
  const revisits = buildErrorRevisitPlan(errors, localDate);
  const attemptsToday = new Set(errors.flatMap((error) => Object.values(error.revisitResults ?? {}).filter((result) => result && Number.isFinite(Date.parse(result.completedAt)) && isoToLocalDate(result.completedAt) === localDate).map((result) => `${error.id}:${result!.completedAt}`)));
  const remainingMinutes = Math.max(0, availableMinutes - attemptsToday.size * 15);
  const count = Math.max(0, Math.floor(remainingMinutes / 15));
  return <section className="ni-panel p-4 space-y-3" aria-labelledby="revisitas-erros">
    <h2 id="revisitas-erros" className="font-display text-lg">Erros de 1, 3 e 7 dias: recuperar, variar, transferir</h2>
    <p className="text-xs text-[var(--dim)]">Sequência inicial do cronograma, ajustável pelo desempenho. Cada tentativa dura cerca de 15 minutos. Um atraso gera uma revisita consolidada, sem cobrar todas de uma vez. Aqui você registra a tentativa; o domínio só muda pelas atividades avaliadas. Com ajuda ou sem conseguir, a revisita reaparece no dia seguinte: use uma atividade de recuperação antes da nova tentativa.</p>
    <p className="text-xs text-[var(--dim)]">{remainingMinutes} minutos restantes no orçamento de hoje · {attemptsToday.size} tentativa(s) registrada(s).</p>
    {loading && <p role="status">Carregando seu caderno de erros...</p>}
    {!isPersonal && <p className="text-sm text-[var(--dim)]">Conecte sua conta para usar erros reais e salvar revisitas.</p>}
    {warning && <p role="alert" className="text-sm">{warning}</p>}
    {isPersonal && !loading && !warning && revisits.length === 0 && <p className="text-sm">Nenhuma revisita pendente nos registros carregados.</p>}
    {revisits.slice(0, count).map((revisit) => <article key={revisit.key} className="border-t border-[var(--line)] pt-3 space-y-2">
      <h3 className="font-semibold text-sm">{mockTopics.find((t) => t.id === revisit.topicId)?.name ?? 'Tópico do caderno de erros'} · D+{revisit.day} · {revisit.minutes} min</h3>
      <p className="text-xs text-[var(--dim)]">{revisit.overdue ? 'Revisita atrasada desde ' : 'Agendada para '}{revisit.dueDate.split('-').reverse().join('/')}. {revisit.action}</p>
      <p className="text-xs"><b>Questão:</b> {errors.find((error) => error.id === revisit.errorId)?.questionId || 'Registro manual'} · erro de {isoToLocalDate(errors.find((error) => error.id === revisit.errorId)!.date).split('-').reverse().join('/')}</p>
      <p className="text-xs text-[var(--dim)]">{errors.find((error) => error.id === revisit.errorId)?.breakPoint || errors.find((error) => error.id === revisit.errorId)?.notes || 'Sem relato: reconstrua o caminho antes de atribuir uma causa.'}</p>
      <Link to={`/erros?registro=${encodeURIComponent(revisit.errorId)}`} className="text-xs underline">Abrir este registro no caderno de erros</Link>
      <div className="flex flex-wrap gap-2">{([['independente','Consegui sem ajuda'],['com_ajuda','Precisei de ajuda'],['nao_consegui','Não consegui']] as const).map(([rating, label]) => <button key={rating} disabled={saving !== null} onClick={() => void complete(revisit, rating)} className="text-xs rounded-lg border border-[var(--line)] px-3 py-2 disabled:opacity-50">{saving === revisit.key ? 'Salvando...' : label}</button>)}</div>
    </article>)}
    {revisits.length > count && <p className="text-xs text-[var(--dim)]">{revisits.length - count} revisita(s) ficam pendentes: não cabem no orçamento restante de {remainingMinutes} minutos. Distribua nos próximos dias pela agenda.</p>}
  </section>;
}
