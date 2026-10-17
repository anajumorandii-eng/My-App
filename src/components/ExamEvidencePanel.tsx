import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockTopics } from '../data/mockData';
import { canonicalExamBoard } from '../lib/questionExamFilters';
import { evidenceReviewedOn, evidenceSubject, examEvidenceCohorts, loadExamEvidenceCases, selectExamEvidence, type ExamEvidenceCase } from '../lib/examEvidence';
export function ExamEvidencePanel({ subject, topicIds, boards = [] }: { subject: string; topicIds?: string[]; boards?: string[] }) {
  const [board, setBoard] = useState('');
  const [phase, setPhase] = useState('');
  const [cases, setCases] = useState<ExamEvidenceCase[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(4);
  const target = evidenceSubject(subject);
  useEffect(() => { let cancelled = false; setError(false); void loadExamEvidenceCases().then(value => { if (!cancelled) setCases(value); }).catch(() => { if (!cancelled) setError(true); }); return () => { cancelled = true; }; }, [attempt]);
  const signature = boards.map(canonicalExamBoard).sort().join('|');
  const cohorts = useMemo(() => examEvidenceCohorts.filter(cohort => cohort.subjects.some(item => item.subject === target) &&
    (!signature || signature.split('|').includes(canonicalExamBoard(cohort.board))) && (!board || cohort.board === board) && (!phase || cohort.phaseGroup === phase)), [target, signature, board, phase]);
  const chosen = new Set(cohorts.map(cohort => cohort.id));
  const selected = cases?.filter(item => chosen.has(item.cohortId) && (!topicIds?.length || [item.topicId, ...item.relatedTopicIds].some(id => topicIds.includes(id)))) ?? [];
  const ordered = topicIds?.length ? selectExamEvidence(selected, topicIds, boards, selected.length) : selected;
  return <section className="ni-panel p-5 space-y-4" aria-label="Evidências de provas e formas de cobrança">
    <h2 className="font-display text-xl">Como as provas cobram este conteúdo</h2>
    <p className="text-sm">Provas e gabaritos oficiais conferidos em {evidenceReviewedOn.split('-').reverse().join('/')}. Classificação por tópico feita pelo CRIVO. O número mostra o que foi observado no recorte, sem prever a próxima prova.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      <label className="block text-sm">Banca das evidências<select className="field block w-full" value={board} onChange={event => { setBoard(event.target.value); setVisible(4); }}><option value="">Todas neste recorte</option>{[...new Set(examEvidenceCohorts.filter(cohort => !signature || signature.split('|').includes(canonicalExamBoard(cohort.board))).map(cohort => cohort.board))].map(name => <option key={name}>{name}</option>)}</select></label>
      <label className="block text-sm">Fase das evidências<select className="field block w-full" value={phase} onChange={event => { setPhase(event.target.value); setVisible(4); }}><option value="">Fases disponíveis, separadas abaixo</option><option value="1a">Objetivas / primeiro dia</option><option value="2a">Discursivas de segunda fase</option></select></label>
    </div>
    <details><summary className="cursor-pointer font-semibold text-sm">Cobertura e método de contagem</summary><p className="text-sm mt-2">Nos recortes completos, cada questão válida recebe um tópico principal e entra uma vez no denominador da matéria. Ligações entre conteúdos aparecem na análise, sem duplicar contagens. Percentual = questões do tópico ÷ questões classificadas da matéria nesta edição e fase. Questão anulada sai do denominador. Matérias seguem o agrupamento curricular do aplicativo, inclusive Literatura separada de Português. Nos recortes selecionados, mostramos apenas exemplos e contagens, sem extrapolar percentuais. Recorte pequeno não estabelece tendência. Primeira e segunda fases não são somadas.</p><p className="text-sm mt-2">Os percentuais antigos atribuídos ao relatório Anglo foram retirados do cálculo e da apresentação: faltavam denominadores e identificação do recorte de cada valor. Ausência de dado não significa ausência de cobrança.</p></details>
    {!cohorts.length && <p className="text-sm">Ainda não há recorte classificado para esta matéria, banca e fase. Isso não significa que o conteúdo não seja cobrado.</p>}
    {cohorts.map(cohort => {
      const group = cohort.subjects.find(item => item.subject === target)!;
      const topics = group.topics.filter(item => !topicIds?.length || topicIds.includes(item.topicId)).sort((a, b) => b.count - a.count);
      const complete = cohort.completeSubjects.includes(target);
      return <details key={cohort.id} className="border-t border-[var(--line)] pt-3">
        <summary className="cursor-pointer text-sm font-semibold">{cohort.board} {cohort.year} · {cohort.phase} · {complete ? 'Recorte completo da matéria' : 'Amostra selecionada'} · {group.total} questões</summary>
        <p className="text-xs mt-2">Versão {cohort.version}. {complete ? `${group.total} questões válidas classificadas nesta matéria.` : `${group.total} exemplos classificados de um caderno de ${cohort.totalQuestions} questões; amostra não representativa.`} {cohort.excludedNumbers.length ? `Anuladas excluídas: ${cohort.excludedNumbers.join(', ')}.` : ''}</p>
        <ul className="text-sm space-y-2 mt-3">{topics.map(row => <li key={row.topicId}>{mockTopics.find(topic => topic.id === row.topicId)?.name ?? row.topicId}: <b>{row.count}/{group.total}</b>{complete ? ` (${(row.count / group.total * 100).toFixed(1)}% observado)` : ' exemplos da seleção'} · questões {row.numbers.join(', ')}</li>)}</ul>
        {!topics.length && <p className="text-sm mt-2">Nenhuma questão recebeu este tópico principal neste recorte; relações secundárias podem aparecer nos exemplos abaixo.</p>}
        <div className="flex flex-wrap gap-4 mt-3 text-xs"><a className="underline" href={cohort.examUrl} target="_blank" rel="noreferrer">Prova oficial</a><a className="underline" href={cohort.answerKeyUrl} target="_blank" rel="noreferrer">Gabarito / respostas esperadas</a></div>
      </details>;
    })}
    <h3 className="font-semibold">Comandos, conceitos e pontos de atenção</h3>
    <p className="text-xs text-[var(--dim)]">As fichas são análises de questões identificadas. Palavras do comando orientam a leitura; não indicam sozinhas a resposta. Confira o enunciado integral na questão ou na fonte oficial.</p>
    {!cases && !error && <p role="status">Carregando análises de questões…</p>}
    {error && <div role="alert"><p>Não foi possível carregar as análises.</p><button type="button" className="underline" onClick={() => setAttempt(value => value + 1)}>Tentar novamente</button></div>}
    {ordered.slice(0, visible).map(item => { const cohort = examEvidenceCohorts.find(cohort => cohort.id === item.cohortId)!; return <article key={item.id} className="border border-[var(--line)] rounded-lg p-4 space-y-2 text-sm">
      <h4 className="font-semibold">{cohort.board} {cohort.year} · {cohort.phase} · questão {item.number}: {item.title}</h4>
      <p><b>Relação cobrada:</b> {item.concept}</p><p><b>Preste atenção:</b> {item.trap}</p>
      {item.commandWords.length > 0 && <p><b>Palavras do comando:</b> {item.commandWords.join(' · ')}</p>}
      {item.relatedTopicIds.length > 0 && <p><b>Conecta com:</b> {item.relatedTopicIds.map(id => mockTopics.find(topic => topic.id === id)?.name ?? id).join(' · ')}</p>}
      {item.steps.length > 0 && <details><summary className="cursor-pointer">Decisões de leitura</summary><ol className="list-decimal pl-5 mt-2">{item.steps.map(step => <li key={step}>{step}</li>)}</ol></details>}
      <div className="flex flex-wrap gap-4 text-xs"><a className="underline" href={cohort.examUrl} target="_blank" rel="noreferrer">Conferir enunciado na prova oficial</a>{item.questionId && <Link className="underline" to={`/questoes?topic=${encodeURIComponent(item.topicId)}&board=${encodeURIComponent(cohort.board)}`}>Resolver questões deste recorte</Link>}</div>
    </article>; })}
    {cases && !ordered.length && <p className="text-sm">Sem exemplo analisado para esta seleção. Consulte a prova oficial; não há base aqui para inferir um estilo específico.</p>}
    {ordered.length > visible && <button type="button" className="text-sm underline" onClick={() => setVisible(value => value + 4)}>Mostrar mais análises ({ordered.length - visible})</button>}
  </section>;
}
