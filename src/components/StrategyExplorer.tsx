import { AdditionalStudyTopics } from './AdditionalStudyTopics';
import { isReviewSummary } from '../lib/reviewSummaries';
import { DeepeningPdf } from './DeepeningPdf';
import { Link } from 'react-router-dom';
import { ExamEvidencePanel } from './ExamEvidencePanel';
import { combineStudyReflections, readAdditionalSelections, strategySelectionKey } from '../lib/strategySelection';
import { StudyReflectionPanel } from './StudyReflectionPanel';
import { reflectionForTutor } from '../lib/learningReflection';
import { useStudyTargets } from '../hooks/useStudyTargets';
import { loadStudyPacket } from '../lib/loadStudyPacket';
import type { StudyPacket } from '../lib/studySources';
import { StudySourcesPanel } from './StudySourcesPanel';
import { useEffect, useRef, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { studyAreaForTopic, studyBoardProfiles, studyProtocols } from '../data/studyProtocols';
import { requestAiTextStream } from '../lib/aiClient';
import { ReviewSummaryText } from './ReviewSummaryText';

import { useAuth } from '../context/AuthContext';
import { strategyGuideUrl } from '../lib/strategyGuides';
import { useStrategyGuides } from '../hooks/useStrategyGuides';
import { printStrategyGuide } from '../lib/printStrategyGuide';

export default function StrategyExplorer() {
  const { user } = useAuth();
  return <StrategyExplorerContent key={user?.uid ?? 'guest'} uid={user?.uid ?? null} />;
}

function StrategyExplorerContent({ uid }: { uid: string | null }) {
  const searchParams = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const requestedTopic = mockTopics.find(item => item.id === searchParams.get('topic'));
  const { targets, loading: targetsLoading, error: targetsError } = useStudyTargets();
  const [packetState, setPacketState] = useState<{ key: string; packet?: StudyPacket; error?: string } | null>(null);
  const { guides, persist, error: guidesError, reload: reloadGuides, saveMessage, setSaveMessage } = useStrategyGuides(uid);
  const printContent = useRef<HTMLDivElement>(null);
  const [subject, setSubject] = useState(requestedTopic ? studyAreaForTopic(requestedTopic) : 'Matemática');
  const topics = mockTopics.filter((topic) => studyAreaForTopic(topic) === subject);
  const [topicId, setTopicId] = useState(requestedTopic?.id ?? topics[0]?.id ?? '');
  const [additional, setAdditional] = useState(() => readAdditionalSelections(searchParams.get('topics'), mockTopics, requestedTopic?.id ?? topics[0]?.id ?? ''));
  const [chapter, setChapter] = useState(searchParams.get('chapter') || '');
  const [board, setBoard] = useState(searchParams.get('board') || 'Todas as bancas');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const busy = useRef(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const topic = topics.find((topic) => topic.id === topicId) ?? topics[0];
  const protocol = studyProtocols.find((item) => item.subject === subject)!;
  const boardProfile = studyBoardProfiles.find((item) => item.board === board);
  const targetBoards = board === 'Todas as bancas' ? targets.map(item => item.board) : [board];
  const targetSignature = targetBoards.join('|');
  const extras = additional.flatMap(item => { const selected = topics.find(topic => topic.id === item.topicId && topic.id !== topicId); return selected ? [{ topic: selected, chapter: item.chapter }] : []; });
  const selections = topic ? [{ topicId: topic.id, topicName: topic.name, chapter }, ...extras.map(item => ({ topicId: item.topic.id, topicName: item.topic.name, chapter: item.chapter }))] : [];
  const focusName = selections.map(item => item.topicName).join(' + ');
  const scopeName = selections.length > 1 ? focusName : chapter || topic?.name;
  const key = strategySelectionKey(subject, selections, board);
  useEffect(() => { setSaveMessage(''); }, [key]);
  useEffect(() => {
    let cancelled = false;
    if (!topic) return;
    setPacketState(null);
    void loadStudyPacket(topic, chapter, targetBoards, extras).then(packet => { if (!cancelled) setPacketState({ key, packet }); }).catch(() => { if (!cancelled) setPacketState({ key, error: 'Não foi possível carregar as fontes. Tente aprofundar novamente para recarregá-las.' }); });
    return () => { cancelled = true; };
  }, [key, targetSignature]);
  const changeSubject = (value: string) => { setSubject(value); setTopicId(mockTopics.find((topic) => studyAreaForTopic(topic) === value)?.id ?? ''); setChapter(''); setAdditional([]); };
  const generate = async () => {
    if (!topic || busy.current || (board === 'Todas as bancas' && targetsLoading)) return;
    busy.current = true; setLoadingKey(key); setErrors((prev) => ({ ...prev, [key]: '' }));
    try {
      const packet = await loadStudyPacket(topic, chapter, targetBoards, extras);
      setPacketState({ key, packet });
      let text = '';
      const result = await requestAiTextStream('review-tip', { topic: focusName, subject, board, chapter: selections.length > 1 ? 'Seleção combinada de tópicos' : chapter || undefined, chapters: selections.map(item => `${item.topicName}: ${item.chapter || 'visão geral'}`).join('; '), level: 40, daysSinceReview: 0, guideMode: selections.length > 1 ? 'combined-strategy' : 'strategy', learnerReflection: combineStudyReflections(selections.map(item => ({ topicName: item.topicName, text: reflectionForTutor(uid, item.topicId) }))), targetBoards, referenceText: packet.referenceText || undefined }, (delta) => {
        text += delta; setAnswers((prev) => ({ ...prev, [key]: text }));
      });
      if (!result.text.trim()) throw new Error('Guia vazio');
      setAnswers((prev) => { const next = { ...prev }; delete next[key]; return next; });
      void persist({ key, subject, topicId: topic.id, topicName: focusName, chapter: selections.length > 1 ? '' : chapter, ...(selections.length > 1 ? { selections } : {}), board, targetBoards, studyPacket: result.serverSources?.length ? { ...packet, sources: [...packet.sources, ...result.serverSources] } : packet, text: result.text, savedAt: new Date().toISOString() });
    } catch {
      setAnswers((prev) => { const next = { ...prev }; delete next[key]; return next; });
      setErrors((prev) => ({ ...prev, [key]: 'Não foi possível aprofundar agora. O protocolo e o exemplo abaixo continuam disponíveis; tente novamente.' }));
    } finally { busy.current = false; setLoadingKey(null); }
  };
  return <section className="space-y-4" aria-labelledby="guia-estrategias">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] p-4">
      <p className="text-sm text-[var(--dim)]">Os guias que você gera ficam organizados na sua biblioteca.</p>
      <Link to="/aprofundamentos" className="text-sm font-semibold underline">Meus aprofundamentos ({Object.values(guides).filter(guide => !isReviewSummary(guide)).length})</Link>
    </div>
    {guidesError && <div role="alert" className="text-sm"><p>{guidesError}</p><button type="button" className="underline" onClick={reloadGuides}>Tentar carregar novamente</button></div>}
    <div className="ni-panel p-4 space-y-3">
      <h2 id="guia-estrategias" className="font-display text-xl">Banca, matéria e tópico: decidir cada passo</h2>
      <p className="text-sm text-[var(--dim)]">Escolha o recorte do currículo. O protocolo e o exemplo são autorais; o guia aprofundado usa os resumos editoriais disponíveis como referência e deve ser conferido com questões e gabaritos.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Matéria do guia<select className="field w-full" value={subject} onChange={(event) => changeSubject(event.target.value)}>{studyProtocols.map((item) => <option key={item.subject}>{item.subject}</option>)}</select></label>
        <label className="text-sm">Banca do guia<select className="field w-full" value={board} onChange={(event) => setBoard(event.target.value)}><option>Todas as bancas</option>{[...new Set([...studyBoardProfiles.map(item => item.board), ...targetBoards])].filter(name => !studyBoardProfiles.some(item => item.board === name)).map(name => <option key={name}>{name}</option>)}{studyBoardProfiles.map((item) => <option key={item.board}>{item.board}</option>)}</select></label>
        <label className="text-sm">Tópico do guia<select className="field w-full" value={topic?.id ?? ''} onChange={(event) => { setTopicId(event.target.value); setChapter(''); setAdditional(previous => previous.filter(item => item.topicId !== event.target.value)); }}>{topics.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-sm">Capítulo do guia<select className="field w-full" value={chapter} onChange={(event) => setChapter(event.target.value)}><option value="">Visão geral do tópico</option>{topic?.chapters?.map((name) => <option key={name}>{name}</option>)}</select></label>
      </div>
      <AdditionalStudyTopics subject={subject} topics={topics} primaryId={topic?.id ?? ''} value={additional} onChange={setAdditional} kind="deepening" />
      <p className="text-sm"><b>Recortes do aprofundamento:</b> {selections.map(item => `${item.topicName}${item.chapter ? ` — ${item.chapter}` : ' — visão geral'}`).join(' + ')}</p>
      <p className="text-xs text-[var(--dim)]"><b>Pré-requisitos no currículo:</b> {topic?.prerequisites.map((id) => mockTopics.find((item) => item.id === id)?.name ?? id).join(', ') || 'Nenhum vínculo cadastrado. Isso não significa ausência de conhecimentos prévios necessários.'}</p>
    </div>
    {selections.map(item => <details key={item.topicId} open={selections.length === 1}><summary className="cursor-pointer text-sm font-semibold">O que lembro de {item.topicName}</summary><StudyReflectionPanel topicId={item.topicId} topicName={item.topicName} subject={subject} /></details>)}
    {targetsLoading && <p role="status">Carregando suas bancas…</p>}
    {targetsError && <p role="alert">{targetsError}</p>}
    {board === 'Todas as bancas' && <p className="text-sm">{targets.length ? `Bancas do seu perfil: ${targets.map(item => item.board).join(' · ')}.` : 'Sem bancas pessoais carregadas: o estudo usa as origens disponíveis no recorte, sem assumir suas inscrições.'}</p>}
    {packetState?.key === key && packetState.error && <p role="alert">{packetState.error}</p>}
    {(guides[key]?.studyPacket || (packetState?.key === key && packetState.packet)) && <StudySourcesPanel packet={guides[key]?.studyPacket ?? packetState!.packet!} />}
    <ExamEvidencePanel key={key} subject={subject} topicIds={selections.map(item => item.topicId)} boards={targetBoards} />
    <article className="ni-panel p-4 space-y-3">
      <h3 className="font-display text-lg">Como preparar este conteúdo para {board}</h3>
      <p className="text-sm">{boardProfile?.format ?? 'Compare os comandos, os dados e as representações das questões de cada origem disponível.'}</p><p className="text-sm text-[var(--dim)]">{boardProfile?.training ?? 'A análise deve separar o que foi observado nas fontes de uma adaptação didática. Uma amostra não representa toda a banca.'}</p>
      {boardProfile && <a href={boardProfile.source} target="_blank" rel="noreferrer" className="text-xs underline">Consultar fonte institucional{!boardProfile.confirmed ? ' e confirmar o edital' : ''}</a>}
    </article>
    <article className="ni-panel p-4 space-y-3">
      <h3 className="font-display text-lg">Passo a passo de {subject}</h3><p className="text-sm">{protocol.focus}</p>
      <ol className="list-decimal pl-5 space-y-3 text-sm leading-relaxed">{protocol.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <p className="text-sm"><b>Conferência:</b> {protocol.check}</p>
      <details><summary className="cursor-pointer text-sm font-semibold">Exemplo resolvido e questão de transferência</summary><p className="text-sm my-3">{protocol.example.prompt}</p><ol className="list-decimal pl-5 space-y-2 text-sm">{protocol.example.solution.map((step) => <li key={step}>{step}</li>)}</ol><p className="text-sm mt-3"><b>Sem consultar:</b> {protocol.example.transfer}</p><details className="mt-2"><summary className="text-sm cursor-pointer">Conferir critérios de resposta</summary><p className="text-sm mt-2">{protocol.example.expected}</p></details></details>
      <details><summary className="cursor-pointer text-sm font-semibold">Pegadinhas e revisão desta área</summary><ul className="list-disc pl-5 text-sm space-y-2 mt-3">{protocol.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul><p className="text-sm mt-3">{protocol.review}</p></details>
    </article>
    <div className="ni-panel p-4 space-y-3">
      <h3 className="font-display text-lg">Aprofundamento: {scopeName}</h3>
      <p className="text-xs text-[var(--dim)]">Conceitos, representações, decisão de estratégia, resolução justificada, contrastes, pegadinhas e exercícios. Comparações de cobrança devem indicar evidência; frequência não é inferida pelo nome da banca.</p>
      <button type="button" disabled={pdfBusy || loadingKey !== null || (board === 'Todas as bancas' && targetsLoading)} onClick={() => void generate()} className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm disabled:opacity-50">{loadingKey === key || pdfBusy ? 'Preparando aprofundamento…' : guides[key] ? 'Gerar novo aprofundamento' : 'Aprofundar este tópico e sua cobrança'}</button>
      {loadingKey === key && <p role="status" className="text-sm">Preparando seu aprofundamento completo…</p>}
      {errors[key] && <p role="alert" className="text-sm">{errors[key]}</p>}
      {saveMessage && !pdfBusy && loadingKey === null && <p role="status" className="text-xs text-[var(--dim)]">{saveMessage}</p>}
      {guides[key] && !saveMessage && !pdfBusy && <p className="text-xs text-[var(--dim)]">Salvo neste navegador · {new Date(guides[key].savedAt).toLocaleString('pt-BR')}</p>}
      {guides[key]?.targetBoards?.length ? <p className="text-xs">Bancas deste guia salvo: {guides[key].targetBoards!.join(' · ')}</p> : null}
      <a className="text-sm underline block" href={`/podcast?topic=${encodeURIComponent(topic?.id ?? '')}${chapter ? `&chapter=${encodeURIComponent(chapter)}` : ''}${board !== 'Todas as bancas' ? `&board=${encodeURIComponent(board)}` : ''}`}>{selections.length > 1 ? `Estudar ${topic?.name} em podcast aprofundado` : 'Transformar este recorte em podcast aprofundado'}</a>
      {guides[key] && loadingKey !== key && <div className="flex flex-wrap gap-3">
        <Link to={strategyGuideUrl(guides[key])} className="text-sm underline">Abrir este guia na biblioteca</Link>
        {uid ? <DeepeningPdf key={key} getContent={() => printContent.current}
          guideKey={key} revision={guides[key].savedAt}
          title={`Aprofundamento — ${subject} — ${scopeName} — ${board}`}
          generateCover onBusyChange={setPdfBusy} /> :
          <button type="button" className="underline" onClick={() => {
            try { if (printContent.current) printStrategyGuide(printContent.current, `Aprofundamento — ${subject} — ${scopeName} — ${board}`); setErrors(previous => ({ ...previous, [key]: '' })); }
            catch { setErrors(previous => ({ ...previous, [key]: 'Não foi possível abrir a impressão. Tente novamente.' })); }
          }}>Imprimir / Salvar em PDF</button>}
        {uid && /Não foi possível/.test(saveMessage) && <button type="button" className="text-sm underline" onClick={() => void persist(guides[key])}>Salvar novamente na conta</button>}
      </div>}
      {(answers[key] || guides[key]) && <div ref={printContent} data-print-subject={subject} data-print-topic={focusName} data-print-subtopic={selections.map(item => `${item.topicName}: ${item.chapter || 'visão geral'}`).join(' · ')} data-print-board={guides[key]?.targetBoards?.join(' · ') || board} data-print-purpose="Aprofundamento dos conceitos e de como são cobrados nas provas">
        <h4 className="font-display text-lg">{subject} · {focusName}{selections.length === 1 && chapter ? ` · ${chapter}` : ''} · {board}</h4>
        <ReviewSummaryText text={answers[key] || guides[key]?.text || ''} />
        {guides[key]?.studyPacket && <div className="hidden" data-print-only><StudySourcesPanel packet={guides[key].studyPacket!} /></div>}
      </div>}
    </div>
    <a href="/study-guide.html" target="_blank" rel="noreferrer" className="text-sm underline">Abrir guia completo para consultar ou imprimir</a>
  </section>;
}
