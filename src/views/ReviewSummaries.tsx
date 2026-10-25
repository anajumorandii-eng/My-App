import { SubtopicSelector } from '../components/SubtopicSelector';
import { describeStudySelection, normalizeTopicCuts } from '../lib/topicCuts';
import { AdditionalStudyTopics } from '../components/AdditionalStudyTopics';
import { readAdditionalSelections, combineStudyReflections } from '../lib/strategySelection';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ReviewSummaryText } from '../components/ReviewSummaryText';
import { DeleteStudyMaterial } from '../components/DeleteStudyMaterial';
import { StudySourcesPanel } from '../components/StudySourcesPanel';
import { useAuth } from '../context/AuthContext';
import { mockTopics } from '../data/mockData';
import { studyAreaForTopic, studyProtocols } from '../data/studyProtocols';
import { useStrategyGuides } from '../hooks/useStrategyGuides';
import { useStudyTargets } from '../hooks/useStudyTargets';
import { useErrorReviewHistory } from '../hooks/useErrorReviewHistory';
import { AiRequestError, requestAiTextStream } from '../lib/aiClient';
import { loadStudyPacket } from '../lib/loadStudyPacket';
import { reviewSummaryKey, selectReviewSummaries } from '../lib/reviewSummaries';
import { normalizeReviewOptions, reviewBoards, reviewBoard, reviewBoardLabels, reviewDepths, reviewScopes, reviewScopeLabels, reviewSelectionLabel, splitReviewAnswers, type ReviewOptions, type ReviewScope } from '../lib/strategicReview';
import { reviewErrorHistory } from '../lib/reviewPersonalization';
import { renderStudyReference, type StudyPacket } from '../lib/studySources';
import { getLiteraryWorks } from '../lib/literaryCatalog';
import type { LiteraryWork } from '../types/literaryWorks';
import { BEFORE_ASSET_RELOAD } from '../lib/assetRecovery';
import { readReviewReloadSelection, saveReviewReloadSelection, clearReviewReloadSelection } from '../lib/reviewReloadRecovery';
import type { StrategyGuide } from '../lib/strategyGuides';
const ReviewPdf = lazy(() => import('../components/DeepeningPdf').then(module => ({ default: module.DeepeningPdf })));

export default function ReviewSummaries() {
  const { user } = useAuth();
  return <ReviewSummariesContent key={user?.uid ?? 'guest'} uid={user?.uid ?? null} />;
}
function ReviewSummariesContent({ uid }: { uid: string | null }) {
  const [params] = useSearchParams();
  const [recoveredSelection] = useState(() => readReviewReloadSelection(uid));
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(Boolean(recoveredSelection));
  useEffect(() => { clearReviewReloadSelection(uid); }, [uid]);
  const requestedTopic = mockTopics.find(topic => topic.id === params.get('topic'));
  const [subject, setSubject] = useState(recoveredSelection?.subject ?? (requestedTopic ? studyAreaForTopic(requestedTopic) : 'Matemática'));
  const topics = mockTopics.filter(topic => studyAreaForTopic(topic) === subject);
  const [topicId, setTopicId] = useState(recoveredSelection?.topicId ?? requestedTopic?.id ?? topics[0]?.id ?? '');
  const [chapter, setChapter] = useState(() => recoveredSelection?.chapter ?? (requestedTopic?.chapters?.includes(params.get('chapter') ?? '') ? params.get('chapter')! : ''));
  const [additional, setAdditional] = useState(() => readAdditionalSelections(recoveredSelection?.additional ? JSON.stringify(recoveredSelection.additional) : params.get('topics'), mockTopics, recoveredSelection?.topicId ?? requestedTopic?.id ?? topics[0]?.id ?? ''));
  const [options, setOptions] = useState(() => normalizeReviewOptions(recoveredSelection?.options ?? { boards: params.get('board') ? [params.get('board')!] : [] }));
  const { targets } = useStudyTargets();
  const banks = [...new Set([...reviewBoards, ...targets.map(item => reviewBoard(item.board)), ...options.boards])].filter(Boolean);
  const history = useErrorReviewHistory();
  const [works, setWorks] = useState<LiteraryWork[]>([]);
  const [workProblem, setWorkProblem] = useState('');
  useEffect(() => {
    if (options.sourceMode !== 'work' || works.length) return;
    let active = true;
    getLiteraryWorks().then(value => { if (active) { setWorks(value); if (!value.length) setWorkProblem('O catálogo de obras está vazio. Você pode usar um trecho informado.'); } }).catch(() => { if (active) setWorkProblem('Não foi possível carregar as obras. Você pode usar um trecho informado.'); });
    return () => { active = false; };
  }, [options.sourceMode]);
  const { guides, persist, remove, loading, error, reload, saveMessage, setSaveMessage } = useStrategyGuides(uid);
  const [configurationOpen, setConfigurationOpen] = useState(recoveredSelection?.configurationOpen ?? true);
  const [createdRevision, setCreatedRevision] = useState('');
  const [pdfBusy, setPdfBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [stream, setStream] = useState('');
  const [problem, setProblem] = useState('');
  const [libraryQuery,setLibraryQuery]=useState('');
  const [librarySubject, setLibrarySubject] = useState('');
  const [libraryBoard, setLibraryBoard] = useState('');
  const [openedKey, setOpenedKey] = useState(recoveredSelection?.openedKey ?? '');
  const printContent = useRef<HTMLElement>(null);
  const configurationRef=useRef<HTMLDetailsElement>(null);
  const busy = useRef(false), mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const selectedWork = works.find(work => `obra:${work.slug}` === topicId);
  const topic = options.sourceMode === 'work' ? (selectedWork ? { id: topicId, name: selectedWork.title, subject: 'Literatura', prerequisites: [] } : undefined) : topics.find(item => item.id === topicId);
  const extras = options.sourceMode === 'catalog' ? readAdditionalSelections(JSON.stringify(additional), topics, topic?.id ?? '').flatMap(item => {
    const selected = topics.find(value => value.id === item.topicId);
    return selected ? [{ topic: selected, chapter: item.chapter }] : [];
  }) : [];
  const setCuts = (id:string,cuts:string[]) => {setOpenedKey('');if(id===topic?.id)setChapter('');setOptions(previous=>({...previous,topicCuts:normalizeTopicCuts({...previous.topicCuts,[id]:cuts})}));};
  const selections = options.sourceMode === 'catalog' && topic ? [{ topicId: topic.id, topicName: topic.name, chapter }, ...extras.map(item => ({ topicId: item.topic.id, topicName: item.topic.name, chapter: item.chapter }))].map(item=>({...item,...(options.topicCuts?.[item.topicId]?.length ? {cuts:options.topicCuts[item.topicId]} : {})})) : [];
  const combined = selections.length > 1;
  const focusName = combined ? selections.map(item => item.topicName).join(' + ') : topic?.name ?? options.sourceTitle;
  const key = reviewSummaryKey(subject, topic?.id ?? topicId, chapter, '', options, selections);
  useEffect(() => { setProblem(''); setStream(''); setSaveMessage(''); }, [key]);
  const current = guides[openedKey || key];
  const working = generating || pdfBusy;
  useEffect(() => {
    const preserveSelection = () => saveReviewReloadSelection(uid, {
      subject, topicId, chapter, options, additional, openedKey: current?.key ?? openedKey, configurationOpen,
    });
    window.addEventListener(BEFORE_ASSET_RELOAD, preserveSelection);
    return () => window.removeEventListener(BEFORE_ASSET_RELOAD, preserveSelection);
  }, [uid, subject, topicId, chapter, options, additional, current?.key, openedKey, configurationOpen]);

  const saved = selectReviewSummaries(guides, librarySubject, libraryBoard).filter(item=>`${item.subject} ${item.topicName} ${item.chapter} ${Object.values(item.reviewOptions?.topicCuts??{}).flat().join(' ')}`.toLocaleLowerCase('pt-BR').includes(libraryQuery.toLocaleLowerCase('pt-BR')));
  const allSaved = selectReviewSummaries(guides);
  const savedSubjects = [...new Set(allSaved.map(item => item.subject))].sort((a,b) => a.localeCompare(b,'pt-BR'));
  const savedBoards = [...new Set(allSaved.flatMap(item => item.targetBoards ?? [item.board]).filter(Boolean))].sort();
  const scopedErrors = options.sourceMode === 'provided' ? '' : combined ? combineStudyReflections(selections.map(item => ({ topicName: item.topicName, text: reviewErrorHistory(history.errors, item.topicId) }))) : reviewErrorHistory(history.errors, topic?.id ?? topicId);
  const edit = (patch: Partial<ReviewOptions>) => { setOpenedKey(''); setOptions(previous => normalizeReviewOptions({ ...previous, ...patch })); };
  const openSaved = (guide: StrategyGuide) => {
    if (busy.current || pdfBusy) return;
    setShowRecoveryNotice(false);
    setSubject(guide.subject); setTopicId(guide.topicId); setChapter(guide.selections?.[0]?.chapter ?? guide.chapter);
    setAdditional(readAdditionalSelections(JSON.stringify(guide.selections?.slice(1) ?? []), mockTopics, guide.topicId));
    setStream('');
    setOptions(normalizeReviewOptions(guide.reviewOptions ?? { boards: guide.targetBoards ?? (guide.board ? [guide.board] : []) }));
    setOpenedKey(guide.key); setCreatedRevision(''); setConfigurationOpen(false);
  };
  const canGenerate = options.sourceMode === 'provided' ? Boolean(options.sourceText.trim() && options.sourceTitle.trim()) : Boolean(topic);
  const generate = async () => {
    if (busy.current || pdfBusy || !canGenerate) return;
    setShowRecoveryNotice(false);
    busy.current = true; setGenerating(true); setProblem(''); setStream(''); setSaveMessage(''); setOpenedKey('');
    try {
      const activeOptions=normalizeReviewOptions({...options,topicCuts:Object.fromEntries(selections.flatMap(item=>item.cuts?.length?[[item.topicId,item.cuts]]:[]))});
      const primaryCuts=activeOptions.topicCuts?.[topic?.id??'']??[];
      const activeChapter=primaryCuts.length===1?primaryCuts[0]:chapter;
      const activeTopic = topic ?? { id: topicId, name: options.sourceTitle, subject, prerequisites: [] };
      const packet: StudyPacket = options.sourceMode === 'provided' ? {
        topicId: activeTopic.id, chapter, coverage: [], referenceText: '',
        sources: [{ id: 'F1', title: `${options.sourceTitle}${options.sourceDate ? ` · ${options.sourceDate}` : ' · data não informada'}`, kind: 'resumo', format: 'markdown', content: options.sourceText, excerpt: true, ...(options.sourceUrl ? { url: options.sourceUrl } : {}) }],
      } : await loadStudyPacket(activeTopic, chapter, options.boards, extras, activeOptions);
      if (options.sourceMode === 'provided') packet.referenceText = renderStudyReference(packet);
      if (!mounted.current) return;
      let text = '';
      const result = await requestAiTextStream('review-tip', {
        topic: options.sourceMode === 'provided' ? options.sourceTitle : focusName, subject, chapter: combined ? undefined : activeChapter || undefined,
        ...((combined || selections.some(item=>item.cuts?.length)) ? { chapters: selections.map(describeStudySelection).join('; ') } : {}),
        targetBoards: options.boards, reviewOptions: activeOptions, errorHistory: options.useHistory && scopedErrors ? scopedErrors : undefined,
        guideMode: 'review-summary', level: 40, daysSinceReview: 0, referenceText: packet.referenceText || undefined,
      }, delta => { text += delta; if (mounted.current) setStream(text); });
      if (!mounted.current) return;
      if (!result.text.trim()) throw new Error('Revisão vazia');
      setStream(result.text);
      if (!splitReviewAnswers(result.text).answers || !/recuperação ativa/i.test(splitReviewAnswers(result.text).body)) {
        setProblem('Não foi possível gerar a revisão completa: faltou a recuperação ativa ou seu gabarito separado. O texto recebido está abaixo como rascunho; copie-o antes de tentar novamente.');
        return;
      }
      const savedAt = new Date().toISOString();
      setCreatedRevision(savedAt);
      await persist({ kind: 'review-summary', key, subject, topicId: activeTopic.id, topicName: options.sourceMode === 'provided' ? options.sourceTitle : focusName,
        chapter: combined ? '' : activeChapter, ...((combined || selections.some(item=>item.cuts?.length)) ? { selections } : {}), board: options.boards.join(' / '), targetBoards: options.boards, reviewOptions: activeOptions,
        text: result.text, savedAt,
        studyPacket: result.serverSources?.length ? { ...packet, sources: [...packet.sources, ...result.serverSources] } : packet,
      });
      if (mounted.current) { setStream(''); setConfigurationOpen(false); }
    } catch (failure) {
      if (mounted.current) setProblem(failure instanceof AiRequestError ? failure.message : 'Não foi possível gerar o resumo agora. Os resumos já salvos continuam disponíveis. Tente novamente.');
    } finally {
      busy.current = false;
      if (mounted.current) setGenerating(false);
    }
  };
  const displayedSelections = current?.selections ?? selections;
  const recortes = displayedSelections.map(describeStudySelection).join(' · ');
  const displayedPrimaryChapter = displayedSelections[0]?.chapter ?? current?.chapter ?? chapter;
  const displayedOptions = current?.reviewOptions ?? options;
  const legacy = Boolean(current && !current.reviewOptions && !generating);
  const selectionDescription = legacy ? `${current!.board || 'Geral'} · Versão anterior: etapa e profundidade não registradas` : `${reviewSelectionLabel(displayedOptions)} · ${reviewDepths[displayedOptions.depth]}`;
  const title = `Revisão · ${current?.chapter || current?.topicName || (combined ? focusName : chapter || topic?.name || options.sourceTitle)}`;
  return <section className="grid min-w-0 grid-cols-1 gap-5 [&_.field]:min-h-11 [&_summary]:min-h-11 xl:grid-cols-[minmax(0,1fr)_20rem]" aria-labelledby="review-summary-title">
    <div className="flex flex-wrap items-center justify-between gap-3 xl:col-span-2">
      <h2 id="review-summary-title" className="font-display text-2xl">Criar e retomar revisões</h2>
      <div className="flex flex-wrap items-center gap-4 text-sm"><a className="underline" href="#saved-review-summaries">Meus resumos ({allSaved.length})</a>
        {current && <button type="button" disabled={working} className="underline disabled:opacity-50" onClick={() => setConfigurationOpen(true)}>Configurar nova revisão</button>}
      </div>
    </div>
    {showRecoveryNotice && <p role="status" aria-label="Atualização do aplicativo" className="ni-panel p-4 text-sm">O Crivo foi atualizado para carregar os arquivos necessários. Sua seleção foi mantida. Gere a revisão novamente para continuar; se o texto já estiver salvo, abra seu resumo e use Exportar revisão em PDF.</p>}
    <details ref={configurationRef} className="ni-panel min-w-0 xl:col-start-1" open={configurationOpen} onToggle={event => setConfigurationOpen(event.currentTarget.open)}>
      <summary className="cursor-pointer p-4 text-sm font-semibold">Criar revisão · {subject} · {reviewDepths[options.depth]}</summary>
      <div className="px-5 pb-5 space-y-3">
      <p className="text-sm text-[var(--dim)]">Escolha o conteúdo e o foco. A revisão inclui explicações, treino e recuperação ativa.</p>
      <h3 className="font-semibold">Conteúdo</h3>
      <fieldset disabled={working} className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Conteúdo da revisão</legend>
        {options.sourceMode !== 'work' && <label className="text-sm">Matéria do resumo<select className="field block w-full" value={subject} onChange={event => {
          setOpenedKey(''); setAdditional([]); setSubject(event.target.value); setTopicId(mockTopics.find(item => studyAreaForTopic(item) === event.target.value)?.id ?? ''); setChapter('');
        }}>{studyProtocols.map(item => <option key={item.subject}>{item.subject}</option>)}</select></label>}
        {options.sourceMode === 'catalog' && <>
          <label className="text-sm">Tópico do resumo<select className="field block w-full" value={topic?.id ?? ''} onChange={event => { setOpenedKey(''); setTopicId(event.target.value); setChapter(''); setAdditional(previous => previous.filter(item => item.topicId !== event.target.value)); }}>
            <option value="">Selecione um tópico</option>{topics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select></label>
          <div className="sm:col-span-2">{topic && <SubtopicSelector topic={topic} value={options.topicCuts?.[topic.id]??(chapter?[chapter]:[])} onChange={cuts=>setCuts(topic.id,cuts)} disabled={working}/>}</div>
        </>}
        {options.sourceMode === 'work' && <label className="text-sm">Obra<select className="field block w-full" value={topicId} onChange={event => { setOpenedKey(''); setTopicId(event.target.value); }}>
          <option value="">Escolha a obra</option>{works.map(work => <option key={work.id} value={`obra:${work.slug}`}>{work.title} — {work.author}</option>)}
        </select>{workProblem && <span role="status">{workProblem}</span>}</label>}
        {options.sourceMode === 'provided' && <>
          <label className="text-sm">Título do material<input className="field block w-full" maxLength={300} value={options.sourceTitle} onChange={event => edit({ sourceTitle: event.target.value })} /></label>
          <label className="text-sm">Data da fonte (opcional)<input type="date" className="field block w-full" value={options.sourceDate} onChange={event => edit({ sourceDate: event.target.value })} /></label>
          <label className="text-sm">Link da fonte (opcional)<input type="url" className="field block w-full" maxLength={1500} value={options.sourceUrl} onChange={event => edit({ sourceUrl: event.target.value })} /></label>
          <label className="text-sm sm:col-span-2">Texto ou extração do material<textarea className="field block w-full min-h-36" maxLength={12000} value={options.sourceText} onChange={event => edit({ sourceText: event.target.value })} /></label>
        </>}

      </fieldset>
      {options.sourceMode === 'catalog' && <>
        <AdditionalStudyTopics subject={subject} topics={topics} primaryId={topic?.id ?? ''} value={additional} onChange={value => { setOpenedKey(''); setAdditional(value); }} kind="review" cuts={options.topicCuts} onCutsChange={setCuts} disabled={working} />
        <section aria-label="Conferir conteúdo selecionado" className="space-y-2 py-3"><h3 className="text-sm font-semibold">Antes de gerar · {subject}</h3><ul className="divide-y divide-[var(--line)]">{selections.map(item=><li key={item.topicId} className="flex flex-wrap items-start gap-x-4 gap-y-1 py-3 text-sm"><span className="basis-full min-w-0 break-words">{describeStudySelection(item)}</span><button type="button" disabled={working} className="min-h-11 px-2 underline" onClick={()=>{configurationRef.current?.querySelectorAll('details').forEach(detail=>{if(detail.querySelector('summary')?.textContent?.includes(`Selecionar subtópicos de ${item.topicName}`)) {detail.open=true;let parent=detail.parentElement?.closest('details');while(parent){parent.open=true;parent=parent.parentElement?.closest('details');}detail.querySelector('summary')?.focus();}});}} aria-label={`Editar recortes de ${item.topicName}`}>Editar recortes</button><button type="button" disabled={working} className="min-h-11 px-2 text-[var(--dim)] underline" onClick={()=>{setOpenedKey('');if(item.topicId===topic?.id){const next=additional[0];setTopicId(next?.topicId??'');setChapter(next?.chapter??'');setAdditional(previous=>previous.slice(1));}else setAdditional(previous=>previous.filter(value=>value.topicId!==item.topicId));}} aria-label={`Remover ${item.topicName}`}>Remover tópico</button></li>)}</ul>{!selections.length&&<p className="text-sm text-[var(--dim)]">Escolha um tópico para começar.</p>}</section>
      </>}
      <details className="border-t border-[var(--line)] pt-3"><summary className="cursor-pointer py-2 text-sm font-semibold">Banca e profundidade · {reviewDepths[options.depth]}</summary>
      <fieldset disabled={working} className="space-y-3 pt-3">
        <label className="text-sm">Profundidade<select className="field block w-full" value={options.depth} onChange={event => edit({ depth: event.target.value as ReviewOptions['depth'] })}>
          {Object.entries(reviewDepths).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
        <legend className="text-sm font-semibold">Bancas — selecione uma, várias ou nenhuma</legend>
        <p className="text-xs text-[var(--dim)]">Sem seleção, a revisão é geral. Etapas conforme documentos de ingresso 2027; ENEM 2026. As fontes de formato acompanham a revisão.</p>
        <div className="grid gap-3 sm:grid-cols-2">{banks.map(bank => <div key={bank} className="space-y-2 py-1">
          <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={options.boards.includes(bank)} onChange={event => edit({ boards: event.target.checked ? [...options.boards,bank] : options.boards.filter(value => value !== bank) })} />{reviewBoardLabels[bank] ?? bank}</label>
          {options.boards.includes(bank) && (reviewScopes(bank).length > 1 ? <label className="text-xs">Etapa — {reviewBoardLabels[bank] ?? bank}<select className="field block w-full" value={options.scopes[bank]} onChange={event => edit({ scopes: { ...options.scopes, [bank]: event.target.value as ReviewScope } })}>
            {reviewScopes(bank).map(scope => <option key={scope} value={scope}>{scope === 'all' && ['FUVEST','UNICAMP','UNESP'].includes(bank) ? 'Ambas as fases' : reviewScopeLabels[scope]}</option>)}
          </select></label> : <p className="text-xs text-[var(--dim)]">{bank === 'ENEM' ? 'Exame sem divisão em fases.' : 'Formato delimitado às fontes disponíveis.'}</p>)}
        </div>)}</div>
        {scopedErrors ? <label className="flex gap-2 text-sm"><input type="checkbox" checked={options.useHistory} onChange={event => edit({ useHistory: event.target.checked })} />Usar meus erros registrados {combined ? 'nos tópicos selecionados' : 'neste tópico'} para direcionar a revisão</label> : <p className="text-xs text-[var(--dim)]">{history.loading ? 'Carregando histórico de erros…' : history.warning || 'Sem histórico de erros disponível para este recorte. A revisão será gerada normalmente.'}</p>}
      </fieldset>
      </details>
      <details className="border-t border-[var(--line)] pt-3"><summary className="cursor-pointer py-2 text-sm font-semibold">Origem e tipo de material</summary><fieldset disabled={working} className="grid gap-3 pt-3 sm:grid-cols-2">        <label className="text-sm">Material de origem<select className="field block w-full" value={options.sourceMode} onChange={event => { setAdditional([]); setChapter(''); edit({ sourceMode: event.target.value as ReviewOptions['sourceMode'], useHistory: false, ...(event.target.value === 'work' ? { materialKind: 'literature' as const } : {}) }); if (event.target.value === 'work') { setSubject('Literatura'); setChapter(''); } else if (topicId.startsWith('obra:')) setTopicId(''); }}>
          <option value="catalog">Conteúdo do Crivo</option><option value="provided">Texto ou extração informada</option><option value="work">Obra da biblioteca</option>
        </select></label>
        <label className="text-sm">Tipo de material<select className="field block w-full" value={options.materialKind} onChange={event => edit({ materialKind: event.target.value as ReviewOptions['materialKind'] })} disabled={options.sourceMode === 'work'}>
          <option value="disciplinary">Conteúdo disciplinar</option><option value="current-affairs">Atualidades</option><option value="literature">Literatura e obras</option>
        </select></label>
</fieldset></details>
      {options.materialKind === 'current-affairs' && <p className="text-xs text-[var(--dim)]">Esta revisão usa as fontes fornecidas, sem atualização de notícias em tempo real. Informe a data para delimitar os fatos.</p>}
      <p className="text-xs text-[var(--dim)]">A cobrança só é descrita como observada quando há evidência nas fontes. Gerar ou ler não conclui uma revisão nem altera seu agendamento.</p>
      <button type="button" disabled={working || !canGenerate || Boolean(options.useHistory && history.loading)} onClick={() => void generate()} className="min-h-11 rounded-lg bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">
        {pdfBusy ? 'Preparando capa e PDF…' : generating ? 'Preparando resumo…' : current ? 'Gerar nova versão do resumo' : 'Gerar resumo de revisão'}
      </button>
      {generating && <p role="status" className="text-sm">Preparando {reviewDepths[options.depth].toLowerCase()} · {reviewSelectionLabel(options)}…</p>}
      {problem && <p role="alert" className="text-sm">{problem}</p>}
      {saveMessage && <p role="status" className="text-sm">{saveMessage}</p>}
      </div>
    </details>
    {(stream || current) && <article className="ni-panel p-5 space-y-4 min-w-0 xl:col-start-1" aria-label="Resumo selecionado" aria-busy={generating}>
      <div ref={printContent as React.RefObject<HTMLDivElement>} data-print-subject={current?.subject || subject} data-print-topic={current?.topicName || topic?.name || options.sourceTitle} data-print-subtopic={displayedSelections.length > 1 || displayedSelections.some(item=>item.cuts?.length) ? recortes : current?.chapter || chapter || 'Visão geral'} data-print-board={legacy ? current!.board || 'Geral' : reviewSelectionLabel(displayedOptions)} data-print-purpose={legacy ? 'Revisão salva — etapa e profundidade não registradas' : reviewDepths[displayedOptions.depth]}>
        <h3 className="break-words font-display text-xl">{current?.subject || subject} · {current?.chapter || current?.topicName || (combined ? focusName : chapter || topic?.name || options.sourceTitle)}</h3>
        <p className="text-sm text-[var(--dim)]">{selectionDescription}</p>
        {(displayedSelections.length > 1 || displayedSelections.some(item=>item.cuts?.length)) && <p className="text-sm">Recortes: {recortes}</p>}
        {!generating && stream && <p role="status">Rascunho incompleto — ainda não foi salvo como revisão concluída. Copie o texto antes de sair ou tentar novamente.</p>}
        <ReviewSummaryText text={stream || current?.text || ''} />
        {!generating && current?.studyPacket && <details data-review-sources><summary className="cursor-pointer text-sm font-semibold">Conferir as fontes deste resumo</summary><StudySourcesPanel packet={current.studyPacket} /></details>}
      </div>
      {!generating && !stream && current && <>
        <Suspense fallback={<p role="status">Consultando PDF salvo…</p>}><ReviewPdf key={current.key} getContent={() => printContent.current} title={title} guideKey={current.key} revision={current.savedAt} materialLabel="Revisão" generateCover autoGenerate={current.savedAt === createdRevision} onBusyChange={setPdfBusy} /></Suspense>
        {/Não foi possível/.test(saveMessage) && <button type="button" className="underline text-sm" onClick={() => void persist(current)}>Tentar salvar novamente</button>}
      </>}
      {current && !generating && <button type="button" disabled={working} className="min-h-11 text-sm underline" onClick={()=>setConfigurationOpen(true)}>Editar configurações desta revisão</button>}
      <Link className="block underline text-sm" to={`/estrategias?${new URLSearchParams({ topic: topic?.id ?? topicId, ...(displayedOptions.topicCuts?{cuts:JSON.stringify(displayedOptions.topicCuts)}:{}), ...(options.boards.length === 1 ? { board: options.boards[0] } : {}), ...(displayedPrimaryChapter ? { chapter: displayedPrimaryChapter } : {}), ...(displayedSelections.length > 1 ? { topics: JSON.stringify(displayedSelections.slice(1)) } : {}) })}`}>Aprofundar este conteúdo</Link>
    </article>}
    <section className="ni-panel min-w-0 self-start p-5 space-y-4 xl:col-start-2 xl:row-start-2 xl:row-span-3" aria-labelledby="saved-review-summaries">
      <h3 id="saved-review-summaries" className="font-display text-xl">Meus resumos de revisão ({allSaved.length})</h3>
      {loading && <p role="status">Carregando os resumos da conta…</p>}
      {error && <div role="alert"><p>{error}</p><button type="button" className="underline" onClick={reload}>Tentar carregar novamente</button></div>}
      {allSaved.length>0 && <label className="block text-sm">Buscar revisões<input type="search" className="field mt-1 block w-full" value={libraryQuery} onChange={e=>setLibraryQuery(e.target.value)} placeholder="Título, matéria ou recorte"/></label>}
      {allSaved.length>0&&<details><summary className="cursor-pointer py-2 text-sm">Filtrar revisões salvas</summary><div className="grid gap-3 py-3 sm:grid-cols-2">
        <label className="text-sm">Matéria dos resumos salvos<select className="field block w-full" value={librarySubject} onChange={event => setLibrarySubject(event.target.value)}><option value="">Todas as matérias</option>{savedSubjects.map(name => <option key={name}>{name}</option>)}</select></label>
        <label className="text-sm">Banca dos resumos salvos<select className="field block w-full" value={libraryBoard} onChange={event => setLibraryBoard(event.target.value)}><option value="">Todas as bancas</option>{savedBoards.map(name => <option key={name}>{name}</option>)}</select></label>
      </div>
      </details>}
      {!saved.length && <p className="text-sm text-[var(--dim)]">{allSaved.length ? 'Nenhum resumo salvo para estes filtros.' : 'Seus resumos aparecerão aqui depois da primeira geração.'}</p>}
      <ul className="space-y-2">{saved.map(item => <li key={item.key}>
        <button type="button" disabled={working} aria-pressed={item.key === current?.key} onClick={() => openSaved(item)} className="w-full rounded-lg border border-[var(--line)] p-3 text-left disabled:opacity-50">
          <b className="block break-words text-sm">{item.chapter || item.topicName} · {item.board || 'Geral'}</b>
          <span className="text-xs text-[var(--dim)]">{item.subject} · {item.reviewOptions ? reviewDepths[item.reviewOptions.depth] : 'Revisão salva'} · {new Date(item.savedAt).toLocaleDateString('pt-BR')}</span>
        </button>
        <details className="text-sm"><summary className="cursor-pointer py-2 text-[var(--dim)]">Mais ações para {item.chapter || item.topicName}</summary><DeleteStudyMaterial key={item.key} title={item.chapter || item.topicName} disabled={working} remove={() => remove(item.key)} onDeleted={() => { if (current?.key === item.key) { setOpenedKey(''); setStream(''); setConfigurationOpen(true); } }} /></details>
      </li>)}</ul>
    </section>
  </section>;
}
