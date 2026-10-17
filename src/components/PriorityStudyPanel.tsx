import { StudyReflectionPanel } from './StudyReflectionPanel';
import { useStudyTargets } from '../hooks/useStudyTargets';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockTopics } from '../data/mockData';
import { studyProtocols, studyBoardProfiles, studyAreaForTopic } from '../data/studyProtocols';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import { completeTopicEvidence } from '../lib/examEvidence';
import { useUserMastery } from '../hooks/useUserMastery';
import { canonicalExamBoard } from '../lib/questionExamFilters';
import { buildActionablePriorities, priorityStudyBlock, prioritySummarySubject } from '../lib/actionablePriorities';

const names = { diagnostic: 'Diagnosticar antes de decidir', base: 'Reconstruir a base', review: 'Recuperar e revisar', practice: 'Treinar aplicação e transferência' };
export function PriorityStudyPanel({ subject }: { subject: string }) {
  const { targets, loading: targetsLoading, error: targetsError } = useStudyTargets();
  const { mastery, isPersisted, loading, syncError } = useUserMastery();
  const [board, setBoard] = useState('');
  const [approach, setApproach] = useState<'explicar' | 'ensinar' | 'comparar' | 'questao'>('explicar');
  const [minutes, setMinutes] = useState<15 | 30 | 45>(30);
  const [visible, setVisible] = useState(5);
  const subjectName = subject === 'Língua Portuguesa' ? 'Português' : subject === 'Língua Inglesa' ? 'Inglês' : subject;
  const topics = useMemo(() => mockTopics.filter(topic => studyAreaForTopic(topic) === subjectName), [subjectName]);
  const priorities = useMemo(() => buildActionablePriorities(topics, mastery, isPersisted, board || undefined, new Date(), targets), [topics, mastery, isPersisted, board, targets]);
  const profile = studyBoardProfiles.find(item => item.board === board);
  const hasBoardEvidence = topics.some(topic => completeTopicEvidence(topic, board || undefined).length > 0);
  return <section aria-labelledby="priority-study-title" className="ni-panel p-5 space-y-4">
    <h2 id="priority-study-title" className="font-display text-xl">Da prioridade ao próximo passo</h2>
    <p className="text-sm text-[var(--dim)]">Combine lacunas registradas, revisão, incerteza e referência histórica. Escolha uma prioridade para o bloco; concluir atividades atualiza o progresso, consultar esta lista não.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      <label>Banca das prioridades<select className="block w-full field" value={board} onChange={event => { setBoard(event.target.value); setVisible(5); }}><option value="">{targets.length ? 'Todas as bancas cadastradas' : 'Referência regional'}</option>{studyBoardProfiles.map(item => <option key={item.board}>{item.board}</option>)}</select></label>
      <label>Como vou demonstrar compreensão<select className="block w-full field" value={approach} onChange={event => setApproach(event.target.value as typeof approach)}><option value="explicar">Reconstruir a explicação</option><option value="ensinar">Ensinar em voz alta</option><option value="comparar">Comparar e criar contraexemplos</option><option value="questao">Explicar uma questão passo a passo</option></select></label>
      <label>Tempo do bloco<select className="block w-full field" value={minutes} onChange={event => setMinutes(Number(event.target.value) as 15 | 30 | 45)}>{[15, 30, 45].map(value => <option key={value} value={value}>{value} minutos</option>)}</select></label>
    </div>
    {targetsLoading && <p role="status">Carregando suas bancas e pesos…</p>}
    {targetsError && <p role="alert">{targetsError}</p>}
    {!board && targets.length > 0 && <p className="text-sm">Plano de todas as bancas: {targets.map(target => `${target.board} (${Math.round(target.weight * 100)}%)`).join(' · ')}. A proximidade de uma prova não remove as demais metas.</p>}
    {loading && <p role="status">Carregando seu progresso…</p>}
    {syncError && <p role="alert">{syncError}</p>}
    {!isPersisted && !loading && <p className="text-sm">Sem evidência pessoal carregada: a ordem usa somente os recortes completos de provas classificados, quando disponíveis. O primeiro passo é diagnosticar; dados de demonstração não são tratados como seu desempenho.</p>}
    {board && !hasBoardEvidence && <p className="text-xs">Não há recorte completo classificado de {board} para esta matéria. A parcela histórica fica em zero; isso significa falta de dados, não ausência de cobrança.</p>}
    <details><summary className="cursor-pointer font-semibold text-sm">Como esta ordem é calculada</summary><p className="text-sm mt-2">Regra editorial de 0 a 100 pontos: lacuna de domínio até 45; urgência de revisão até 25; incerteza até 15; referência histórica até 15. Apenas registros pessoais válidos entram nas três primeiras parcelas. O total ordena ações; não estima nota nem chance de uma questão cair. Vínculos de pré-requisito podem mudar o primeiro conteúdo a estudar.</p><p className="text-xs mt-2">Base histórica: apenas questões de recortes completos identificados por banca, edição e fase. O sinal é ocorrências/(total da matéria + 20), uma redução conservadora para amostras pequenas. As fases disponíveis recebem pesos iguais; não se somam percentuais regionais e da banca. É uma regra editorial de ordenação, não previsão nem intervalo de confiança. Amostras selecionadas e percentuais antigos sem denominador ficam fora do cálculo.</p></details>
    {profile && <details><summary className="cursor-pointer font-semibold text-sm">Como preparar a resolução para {board}</summary><p className="mt-2 text-sm">{profile.format}</p><p className="mt-2 text-sm">{profile.training}</p><a className="underline text-xs" href={profile.source} target="_blank" rel="noreferrer">Consultar fonte institucional{profile.confirmed ? '' : ' e confirmar edital'}</a></details>}
    <ol className="space-y-3">
      {priorities.slice(0, visible).map((entry, index) => {
        const prerequisite = mockTopics.find(item => item.id === entry.blockers[0]);
        const focus = prerequisite ?? entry.topic;
        const protocol = studyProtocols.find(item => item.subject === studyAreaForTopic(focus));
        const retrieval = mockTopicDiscursivePrompts.find(item => item.topicId === focus.id);
        return <li key={entry.topic.id}><details className="border border-[var(--line)] rounded-lg p-3" open={index === 0 ? true : undefined}>
          <summary className="cursor-pointer"><b>{index + 1}. {entry.topic.name}</b><span className="block text-sm text-[var(--dim)]">{names[entry.action as keyof typeof names]} · {entry.score.toFixed(1)} pontos de prioridade</span></summary>
          <div className="space-y-3 mt-3 text-sm">
            <p><b>Por que agora:</b> {entry.evidence ? `Domínio registrado ${Math.round(entry.evidence.level)}%; urgência ${Math.round(entry.urgency)}/100; incerteza ${Math.round(entry.evidence.uncertainty * 100)}%.` : 'Este tópico ainda não tem evidência pessoal válida para avaliar domínio ou atraso.'}</p>
            <p className="text-xs">Parcelas: lacuna {entry.factors.gap.toFixed(1)} · revisão {entry.factors.review.toFixed(1)} · incerteza {entry.factors.uncertainty.toFixed(1)} · histórico {entry.factors.history.toFixed(1)}.</p>
            {entry.boardFactors.length > 1 && <details><summary className="cursor-pointer">Contribuição de cada banca nesta prioridade</summary><ul>{entry.boardFactors.map(item => <li key={item.board}>{item.board}: peso {Math.round(item.weight * 100)}% · sinal histórico {item.history.toFixed(1)}/15{item.specificHistory ? ' · recorte completo classificado' : ' · sem recorte completo; contribuição zero'}</li>)}</ul></details>}
            <p><b>Pré-requisitos:</b> {entry.topic.prerequisites.map(id => mockTopics.find(item => item.id === id)?.name ?? id).join(' · ') || 'Sem vínculo cadastrado; confira os conceitos básicos no exercício.'}</p>
            {prerequisite && <p><b>Comece pela base:</b> {prerequisite.name} tem domínio registrado abaixo de 50%. Reconstrua esse conceito antes de avançar em {entry.topic.name}.</p>}
            {!!focus.chapters?.length && <details><summary className="cursor-pointer font-semibold">Capítulos do conteúdo em foco</summary><ul className="list-disc pl-5 mt-2">{focus.chapters.map(chapter => <li key={chapter}>{chapter}</li>)}</ul><p className="text-xs mt-2">Ordem do currículo, não um diagnóstico individual por capítulo. Comece pelo conceito ausente identificado no exercício.</p></details>}
            <StudyReflectionPanel topicId={focus.id} topicName={focus.name} subject={studyAreaForTopic(focus)} />
            <p><b>Foco deste bloco:</b> {focus.name}. {protocol?.focus}</p>
            <ol className="list-decimal pl-5 space-y-2" aria-label={`Bloco de ${minutes} minutos para ${entry.topic.name}`}>{priorityStudyBlock(minutes, approach).map(step => <li key={step.task}><b>{step.minutes} min:</b> {step.task}</li>)}</ol>
            {protocol && <details><summary className="cursor-pointer font-semibold">Estratégia, pegadinhas e conferência</summary><ol className="list-decimal pl-5 space-y-2 mt-2">{protocol.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="mt-2"><b>Conferir:</b> {protocol.check}</p><ul className="list-disc pl-5 mt-2">{protocol.pitfalls.map(trap => <li key={trap}>{trap}</li>)}</ul><p className="mt-2"><b>Revisão:</b> {protocol.review}</p></details>}
            {protocol && <details><summary className="cursor-pointer font-semibold">Exemplo autoral e transferência da área</summary><p className="mt-2">{protocol.example.prompt}</p><ol className="list-decimal pl-5 mt-2">{protocol.example.solution.map(step => <li key={step}>{step}</li>)}</ol><p className="mt-2"><b>Transferência:</b> {protocol.example.transfer}</p><details><summary className="cursor-pointer">Conferir a transferência</summary><p>{protocol.example.expected}</p></details></details>}
            {retrieval && <details><summary className="cursor-pointer font-semibold">Teste de recuperação antes de consultar</summary><p className="mt-2">{retrieval.prompt}</p><details className="mt-2"><summary className="cursor-pointer">Conferir critérios de resposta</summary><ul className="list-disc pl-5">{retrieval.keyPoints.map(point => <li key={point}>{point}</li>)}</ul><p className="mt-2">{retrieval.modelAnswer}</p></details></details>}
            <p><b>Para avançar:</b> justifique a relação central, mostre suas condições de validade e explique um exemplo ou contraexemplo. Se trabalhou uma questão, justifique cada decisão, inclusive o caminho que descartou. Se faltar um desses passos, retome a base e faça uma nova aplicação antes de mudar de tópico.</p>
            <div className="flex flex-wrap gap-3"><Link className="underline" to={`/estrategias?topic=${encodeURIComponent(focus.id)}${board ? `&board=${encodeURIComponent(board)}` : ''}`}>Aprofundar com fontes e provas</Link><Link className="underline" to={`/podcast?topic=${encodeURIComponent(focus.id)}${board ? `&board=${encodeURIComponent(board)}` : ''}`}>Estudar esta prioridade em áudio</Link><Link className="underline" to={`/questoes?topic=${encodeURIComponent(focus.id)}${board ? `&board=${encodeURIComponent(canonicalExamBoard(board))}` : ''}`}>Resolver questões deste tópico</Link><Link className="underline" to={`/resumos?subject=${encodeURIComponent(prioritySummarySubject(focus))}`}>Abrir resumos da matéria</Link><Link className="underline" to="/revisoes">Programar ou realizar revisão</Link></div>
          </div>
        </details></li>;
      })}
    </ol>
    {priorities.length > visible && <button className="ni-button" onClick={() => setVisible(value => value + 5)}>Mostrar mais prioridades</button>}
    {priorities.length === 0 && <p>Não há tópico curricular mapeado para esta matéria.</p>}
  </section>;
}
