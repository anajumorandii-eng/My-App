import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AiText } from '../components/AiText';
import { StudySourcesPanel } from '../components/StudySourcesPanel';
import { useAuth } from '../context/AuthContext';
import { mockTopics } from '../data/mockData';
import { studyAreaForTopic, studyBoardProfiles, studyProtocols } from '../data/studyProtocols';
import { useStrategyGuides } from '../hooks/useStrategyGuides';
import { useStudyTargets } from '../hooks/useStudyTargets';
import { AiRequestError, requestAiTextStream } from '../lib/aiClient';
import { loadStudyPacket } from '../lib/loadStudyPacket';
import { canonicalExamBoard } from '../lib/questionExamFilters';
import { reviewSummaryKey, selectReviewSummaries } from '../lib/reviewSummaries';
import type { StrategyGuide } from '../lib/strategyGuides';

export default function ReviewSummaries() {
  const { user } = useAuth();
  return <ReviewSummariesContent key={user?.uid ?? 'guest'} uid={user?.uid ?? null} />;
}

function ReviewSummariesContent({ uid }: { uid: string | null }) {
  const [params] = useSearchParams();
  const requestedTopic = mockTopics.find(topic => topic.id === params.get('topic'));
  const [subject, setSubject] = useState(requestedTopic ? studyAreaForTopic(requestedTopic) : 'Matemática');
  const topics = mockTopics.filter(topic => studyAreaForTopic(topic) === subject);
  const [topicId, setTopicId] = useState(requestedTopic?.id ?? topics[0]?.id ?? '');
  const [chapter, setChapter] = useState(() => requestedTopic?.chapters?.includes(params.get('chapter') ?? '') ? params.get('chapter')! : '');
  const [board, setBoard] = useState(canonicalExamBoard(params.get('board') ?? ''));
  const { targets } = useStudyTargets();
  const banks = [...new Set([...studyBoardProfiles.map(item => item.board), ...targets.map(item => item.board)].map(canonicalExamBoard))].filter(Boolean);
  const { guides, persist, loading, error, reload, saveMessage, setSaveMessage } = useStrategyGuides(uid);
  const [generating, setGenerating] = useState(false);
  const [stream, setStream] = useState('');
  const [problem, setProblem] = useState('');
  const [librarySubject, setLibrarySubject] = useState('');
  const [libraryBoard, setLibraryBoard] = useState('');
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const topic = topics.find(item => item.id === topicId) ?? topics[0];
  const key = reviewSummaryKey(subject, topic?.id ?? '', chapter, board);
  useEffect(() => { setProblem(''); setStream(''); setSaveMessage(''); }, [key]);
  const current = guides[key];
  const saved = selectReviewSummaries(guides, librarySubject, libraryBoard);
  const allSaved = selectReviewSummaries(guides);
  const savedSubjects = [...new Set(allSaved.map(item => item.subject))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const savedBoards = [...new Set(allSaved.map(item => canonicalExamBoard(item.board)))].sort();
  const openSaved = (guide: StrategyGuide) => {
    if (busy.current) return;
    setSubject(guide.subject); setTopicId(guide.topicId); setChapter(guide.chapter); setBoard(canonicalExamBoard(guide.board));
  };
  const generate = async () => {
    if (busy.current || !topic || !board) return;
    busy.current = true; setGenerating(true); setProblem(''); setStream(''); setSaveMessage('');
    try {
      const packet = await loadStudyPacket(topic, chapter, [board]);
      if (!mounted.current) return;
      let text = '';
      const result = await requestAiTextStream('review-tip', {
        topic: topic.name, subject, chapter: chapter || undefined, board, targetBoards: [board],
        guideMode: 'review-summary', level: 40, daysSinceReview: 0, referenceText: packet.referenceText || undefined,
      }, delta => { text += delta; if (mounted.current) setStream(text); });
      if (!mounted.current) return;
      if (!result.text.trim()) throw new Error('Resumo vazio');
      await persist({ kind: 'review-summary', key, subject, topicId: topic.id, topicName: topic.name,
        chapter, board, targetBoards: [board], text: result.text, savedAt: new Date().toISOString(),
        studyPacket: result.serverSources?.length ? { ...packet, sources: [...packet.sources, ...result.serverSources] } : packet,
      });
    } catch (error) {
      if (mounted.current) setProblem(error instanceof AiRequestError ? error.message : 'Não foi possível gerar o resumo agora. Os resumos já salvos continuam disponíveis. Tente novamente.');
    } finally {
      busy.current = false;
      if (mounted.current) { setGenerating(false); setStream(''); }
    }
  };
  return <section className="space-y-5" aria-labelledby="review-summary-title">
    <div className="ni-panel p-5 space-y-3">
      <h2 id="review-summary-title" className="font-display text-2xl">Resumo de revisão por banca</h2>
      <p className="text-sm text-[var(--dim)]">Retome o essencial de cada conteúdo com conceitos, fórmulas, formas de cobrança, pegadinhas e perguntas para responder sem consulta.</p>
      <fieldset disabled={generating} className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Conteúdo do resumo</legend>
        <label className="text-sm">Matéria do resumo<select className="field block w-full" value={subject} onChange={event => {
          setSubject(event.target.value); setTopicId(mockTopics.find(item => studyAreaForTopic(item) === event.target.value)?.id ?? ''); setChapter('');
        }}>{studyProtocols.map(item => <option key={item.subject}>{item.subject}</option>)}</select></label>
        <label className="text-sm">Banca do resumo<select className="field block w-full" value={board} onChange={event => setBoard(event.target.value)}>
          <option value="">Escolha a banca</option>{board && !banks.includes(board) && <option>{board}</option>}{banks.map(name => <option key={name}>{name}</option>)}
        </select></label>
        <label className="text-sm">Tópico do resumo<select className="field block w-full" value={topic?.id ?? ''} onChange={event => { setTopicId(event.target.value); setChapter(''); }}>
          {topics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select></label>
        <label className="text-sm">Capítulo do resumo<select className="field block w-full" value={chapter} onChange={event => setChapter(event.target.value)}>
          <option value="">Visão geral do tópico</option>{topic?.chapters?.map(name => <option key={name}>{name}</option>)}
        </select></label>
      </fieldset>
      <p className="text-xs text-[var(--dim)]">A cobrança da banca só é descrita quando há evidência nas fontes. Gerar ou ler um resumo não conclui uma revisão nem altera seu agendamento.</p>
      <button type="button" disabled={generating || !topic || !board} onClick={() => void generate()} className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-semibold disabled:opacity-50">
        {generating ? 'Preparando resumo…' : current ? 'Gerar nova versão do resumo' : 'Gerar resumo de revisão'}
      </button>
      {generating && <p role="status" className="text-sm">Preparando o resumo de {chapter || topic?.name} para {board}…</p>}
      {problem && <p role="alert" className="text-sm">{problem}</p>}
      {saveMessage && <p role="status" className="text-sm">{saveMessage}</p>}
    </div>
    {(stream || current) && <article className="ni-panel p-5 space-y-4 min-w-0" aria-label="Resumo selecionado" aria-busy={generating}>
      <h3 className="font-display text-xl">{subject} · {chapter || topic?.name} · {board}</h3>
      <AiText text={stream || current?.text || ''} className="text-sm leading-relaxed" />
      {!generating && current?.studyPacket && <details><summary className="cursor-pointer text-sm font-semibold">Conferir as fontes deste resumo</summary><StudySourcesPanel packet={current.studyPacket} /></details>}
      {!generating && current && /Não foi possível/.test(saveMessage) && <button type="button" className="underline text-sm" onClick={() => void persist(current)}>Tentar salvar novamente</button>}
      <Link className="underline text-sm" to={`/estrategias?${new URLSearchParams({ topic: topic?.id ?? '', board, ...(chapter ? { chapter } : {}) })}`}>Aprofundar este conteúdo</Link>
    </article>}
    <section className="ni-panel p-5 space-y-4" aria-labelledby="saved-review-summaries">
      <h3 id="saved-review-summaries" className="font-display text-xl">Meus resumos de revisão ({allSaved.length})</h3>
      {loading && <p role="status">Carregando os resumos da conta…</p>}
      {error && <div role="alert"><p>{error}</p><button type="button" className="underline" onClick={reload}>Tentar carregar novamente</button></div>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Matéria dos resumos salvos<select className="field block w-full" value={librarySubject} onChange={event => setLibrarySubject(event.target.value)}><option value="">Todas as matérias</option>{savedSubjects.map(name => <option key={name}>{name}</option>)}</select></label>
        <label className="text-sm">Banca dos resumos salvos<select className="field block w-full" value={libraryBoard} onChange={event => setLibraryBoard(event.target.value)}><option value="">Todas as bancas</option>{savedBoards.map(name => <option key={name}>{name}</option>)}</select></label>
      </div>
      {!saved.length && <p className="text-sm text-[var(--dim)]">{allSaved.length ? 'Nenhum resumo salvo para estes filtros.' : 'Seus resumos aparecerão aqui depois da primeira geração.'}</p>}
      <ul className="space-y-2">{saved.map(item => <li key={item.key}>
        <button type="button" disabled={generating} aria-pressed={item.key === key} onClick={() => openSaved(item)} className="w-full rounded-lg border border-[var(--line)] p-3 text-left disabled:opacity-50">
          <b className="block text-sm">{item.chapter || item.topicName} · {item.board}</b>
          <span className="text-xs text-[var(--dim)]">{item.subject} · {item.topicName} · {new Date(item.savedAt).toLocaleDateString('pt-BR')}</span>
        </button>
      </li>)}</ul>
    </section>
  </section>;
}
