import { useEffect, useRef, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { studyAreaForTopic, studyBoardProfiles, studyProtocols } from '../data/studyProtocols';
import { requestAiTextStream } from '../lib/aiClient';
import type { Question } from '../types';
import { QuestionStatement } from './QuestionStatement';
import { AiText } from './AiText';

import { useAuth } from '../context/AuthContext';
import { cacheStrategyGuides, loadStrategyGuides, readStrategyGuides, saveStrategyGuide, type StrategyGuide } from '../lib/strategyGuides';
import { printStrategyGuide } from '../lib/printStrategyGuide';

export default function StrategyExplorer() {
  const { user } = useAuth();
  return <StrategyExplorerContent key={user?.uid ?? 'guest'} uid={user?.uid ?? null} />;
}

function StrategyExplorerContent({ uid }: { uid: string | null }) {
  const [guides, setGuides] = useState(() => readStrategyGuides(uid));
  const guidesRef = useRef(guides);
  const printContent = useRef<HTMLDivElement>(null);
  const [saveMessage, setSaveMessage] = useState('');
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    void loadStrategyGuides(uid).then(remote => {
      if (cancelled) return;
      const merged = { ...remote };
      for (const [key, guide] of Object.entries(guidesRef.current)) {
        if (!merged[key] || guide.savedAt >= merged[key].savedAt) merged[key] = guide;
      }
      guidesRef.current = merged;
      setGuides(merged);
      try { cacheStrategyGuides(uid, merged); } catch { /* A cópia da conta continua disponível. */ }
    }).catch(() => { if (!cancelled) setSaveMessage('Não foi possível carregar os guias da conta. As cópias deste navegador continuam disponíveis.'); });
    return () => { cancelled = true; };
  }, [uid]);
  const persist = async (guide: StrategyGuide) => {
    const next = { ...guidesRef.current, [guide.key]: guide };
    guidesRef.current = next;
    setGuides(next);
    let cached = false;
    try { cacheStrategyGuides(uid, next); cached = true; } catch { /* Mostra a falha abaixo. */ }
    if (uid) {
      setSaveMessage(cached ? 'Salvo neste navegador. Sincronizando com sua conta...' : 'Salvando na sua conta...');
      try { await saveStrategyGuide(uid, guide); setSaveMessage('Salvo na sua conta.'); }
      catch { setSaveMessage(cached ? 'Salvo neste navegador. Não foi possível sincronizar com sua conta; tente salvar novamente.' : 'Não foi possível salvar. Imprima ou tente salvar novamente antes de sair.'); }
    } else {
      setSaveMessage(cached ? 'Salvo neste navegador. Entre na sua conta para salvar guias na conta.' : 'Não foi possível salvar neste navegador. Imprima o guia antes de sair.');
    }
  };
  const [subject, setSubject] = useState('Matemática');
  const topics = mockTopics.filter((topic) => studyAreaForTopic(topic) === subject);
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [chapter, setChapter] = useState('');
  const [board, setBoard] = useState('Unicamp');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const busy = useRef(false);
  const [examples, setExamples] = useState<Record<string, Question[]>>({});
  const topic = topics.find((topic) => topic.id === topicId) ?? topics[0];
  const protocol = studyProtocols.find((item) => item.subject === subject)!;
  const boardProfile = studyBoardProfiles.find((item) => item.board === board)!;
  const key = JSON.stringify([subject, topic?.id, chapter, board]);
  useEffect(() => { setSaveMessage(''); }, [key]);
  const changeSubject = (value: string) => { setSubject(value); setTopicId(mockTopics.find((topic) => studyAreaForTopic(topic) === value)?.id ?? ''); setChapter(''); };
  const generate = async () => {
    if (!topic || busy.current) return;
    busy.current = true; setLoadingKey(key); setErrors((prev) => ({ ...prev, [key]: '' }));
    try {
      // Conteúdo editorial carregado apenas quando solicitado, sem aumentar o pacote inicial.
      const [{ interactiveSummaries }, { getLocalQuestionBank }] = await Promise.all([import('../data/interactiveSummaries'), import('../lib/contentCatalog')]);
      const bank = await getLocalQuestionBank().catch(() => [] as Question[]);
      const normalizeBoard = (name: string) => name.toLowerCase().replace(/comvest/g, 'unicamp').replace(/[^a-z]/g, '');
      const observed = bank.filter((question) => question.topicId === topic.id && question.examSource && normalizeBoard(question.examSource.board) === normalizeBoard(board) && !question.originalPages?.length && (!chapter || question.chapter === chapter) && question.prompt.length < 3000).sort((a,b) => (b.examSource?.year ?? 0) - (a.examSource?.year ?? 0)).slice(0,2);
      setExamples((prev) => ({ ...prev, [key]: observed }));
      const summaries = interactiveSummaries.filter((summary) => (summary.subject === topic.subject || summary.subject === subject || (subject === 'Português' && ['Gramática', 'Entendimento de Texto'].includes(summary.subject)) || (subject === 'Inglês' && summary.subject === 'Língua Inglesa')) && (topic.chapters?.includes(summary.topic) ?? false) && (!chapter || summary.topic === chapter));
      const selected = summaries.slice(0, chapter ? 1 : 3);
      const editorialText = selected.map((summary) => `Resumo editorial do CRIVO: ${summary.topic}\n${summary.sections.map((section) => `${section.title}: ${section.content}`).join('\n')}`).join('\n\n').slice(0, 8000);
      const observedText = observed.map((question) => `Questão observada no banco CRIVO: ${question.id}, ${question.examSource!.board}, ${question.examSource!.year ?? 'ano não informado'}, origem ${question.examSource!.sourceUrl ?? 'apostila, sem URL oficial cadastrada'}.\n${question.prompt}\nAlternativas: ${question.options.map((option) => `${option.id}: ${option.text}`).join('; ')}\nComentário cadastrado: ${question.explanation}`).join('\n\n');
      const referenceText = `${editorialText}\n\n${observedText ? observedText : 'Nenhuma questão textual com origem identificada encontrada neste recorte. Não atribua padrões específicos a provas que não foram fornecidas.'}`.slice(0, 12000);
      let text = '';
      const result = await requestAiTextStream('review-tip', { topic: topic.name, subject, board, chapter: chapter || undefined, chapters: topic.chapters?.join('; '), level: 40, daysSinceReview: 0, guideMode: 'strategy', referenceText: referenceText || undefined }, (delta) => {
        text += delta; setAnswers((prev) => ({ ...prev, [key]: text }));
      });
      if (!result.text.trim()) throw new Error('Guia vazio');
      setAnswers((prev) => { const next = { ...prev }; delete next[key]; return next; });
      void persist({ key, subject, topicId: topic.id, topicName: topic.name, chapter, board, text: result.text, savedAt: new Date().toISOString() });
    } catch {
      setAnswers((prev) => { const next = { ...prev }; delete next[key]; return next; });
      setErrors((prev) => ({ ...prev, [key]: 'Não foi possível aprofundar agora. O protocolo e o exemplo abaixo continuam disponíveis; tente novamente.' }));
    } finally { busy.current = false; setLoadingKey(null); }
  };
  return <section className="space-y-4" aria-labelledby="guia-estrategias">
    {Object.keys(guides).length > 0 && <div className="ni-panel p-4 space-y-2">
      <h2 className="font-display text-lg">Aprofundamentos salvos</h2>
      <ul className="space-y-2">{Object.values(guides).sort((a, b) => b.savedAt.localeCompare(a.savedAt)).map(guide => <li key={guide.key}>
        <button type="button" className="text-sm underline text-left" onClick={() => { setSubject(guide.subject); setTopicId(guide.topicId); setChapter(guide.chapter); setBoard(guide.board); }}>{guide.subject} · {guide.topicName}{guide.chapter ? ` · ${guide.chapter}` : ''} · {guide.board}</button>
      </li>)}</ul>
    </div>}
    <div className="ni-panel p-4 space-y-3">
      <h2 id="guia-estrategias" className="font-display text-xl">Banca, matéria e tópico: decidir cada passo</h2>
      <p className="text-sm text-[var(--dim)]">Escolha o recorte do currículo. O protocolo e o exemplo são autorais; o guia aprofundado usa os resumos editoriais disponíveis como referência e deve ser conferido com questões e gabaritos.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Matéria do guia<select className="field w-full" value={subject} onChange={(event) => changeSubject(event.target.value)}>{studyProtocols.map((item) => <option key={item.subject}>{item.subject}</option>)}</select></label>
        <label className="text-sm">Banca do guia<select className="field w-full" value={board} onChange={(event) => setBoard(event.target.value)}>{studyBoardProfiles.map((item) => <option key={item.board}>{item.board}</option>)}</select></label>
        <label className="text-sm">Tópico do guia<select className="field w-full" value={topic?.id ?? ''} onChange={(event) => { setTopicId(event.target.value); setChapter(''); }}>{topics.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-sm">Capítulo do guia<select className="field w-full" value={chapter} onChange={(event) => setChapter(event.target.value)}><option value="">Visão geral do tópico</option>{topic?.chapters?.map((name) => <option key={name}>{name}</option>)}</select></label>
      </div>
      <p className="text-xs text-[var(--dim)]"><b>Pré-requisitos no currículo:</b> {topic?.prerequisites.map((id) => mockTopics.find((item) => item.id === id)?.name ?? id).join(', ') || 'Nenhum vínculo cadastrado. Isso não significa ausência de conhecimentos prévios necessários.'}</p>
    </div>
    <article className="ni-panel p-4 space-y-3">
      <h3 className="font-display text-lg">Como preparar este conteúdo para {board}</h3>
      <p className="text-sm">{boardProfile.format}</p><p className="text-sm text-[var(--dim)]">{boardProfile.training}</p>
      <a href={boardProfile.source} target="_blank" rel="noreferrer" className="text-xs underline">Consultar fonte institucional{!boardProfile.confirmed ? ' e confirmar o edital' : ''}</a>
    </article>
    <article className="ni-panel p-4 space-y-3">
      <h3 className="font-display text-lg">Passo a passo de {subject}</h3><p className="text-sm">{protocol.focus}</p>
      <ol className="list-decimal pl-5 space-y-3 text-sm leading-relaxed">{protocol.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <p className="text-sm"><b>Conferência:</b> {protocol.check}</p>
      <details><summary className="cursor-pointer text-sm font-semibold">Exemplo resolvido e questão de transferência</summary><p className="text-sm my-3">{protocol.example.prompt}</p><ol className="list-decimal pl-5 space-y-2 text-sm">{protocol.example.solution.map((step) => <li key={step}>{step}</li>)}</ol><p className="text-sm mt-3"><b>Sem consultar:</b> {protocol.example.transfer}</p><details className="mt-2"><summary className="text-sm cursor-pointer">Conferir critérios de resposta</summary><p className="text-sm mt-2">{protocol.example.expected}</p></details></details>
      <details><summary className="cursor-pointer text-sm font-semibold">Pegadinhas e revisão desta área</summary><ul className="list-disc pl-5 text-sm space-y-2 mt-3">{protocol.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul><p className="text-sm mt-3">{protocol.review}</p></details>
    </article>
    <div className="ni-panel p-4 space-y-3">
      <h3 className="font-display text-lg">Aprofundamento: {chapter || topic?.name}</h3>
      <p className="text-xs text-[var(--dim)]">Conceitos, representações, decisão de estratégia, resolução justificada, contrastes, pegadinhas e exercícios. Comparações de cobrança devem indicar evidência; frequência não é inferida pelo nome da banca.</p>
      <button type="button" disabled={loadingKey !== null} onClick={() => void generate()} className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm disabled:opacity-50">{loadingKey === key ? 'Preparando guia...' : guides[key] ? 'Gerar novo aprofundamento' : 'Aprofundar este tópico e sua cobrança'}</button>
      {errors[key] && <p role="alert" className="text-sm">{errors[key]}</p>}
      {examples[key] && <details><summary className="cursor-pointer text-sm">Questões com origem identificada neste recorte: {examples[key].length}</summary>
        {examples[key].length === 0 && <p className="text-xs mt-2">Não há exemplo textual elegível no banco local para este recorte. Questões com figuras devem ser conferidas na tela de questões; a ausência aqui não mede incidência.</p>}
        {examples[key].map((question) => <article key={question.id} className="border-t border-[var(--line)] pt-3 mt-3 text-sm"><h4 className="font-semibold">{question.examSource?.board} · {question.examSource?.year ?? 'ano não informado'} · {question.id}</h4><QuestionStatement question={question} />{question.examSource?.sourceUrl && <a href={question.examSource.sourceUrl} target="_blank" rel="noreferrer" className="text-xs underline">Conferir origem cadastrada</a>}<p className="text-xs text-[var(--dim)]">A origem pode ser reprodução em apostila ou fonte secundária; confira a prova e o gabarito oficiais.</p></article>)}
      </details>}
      {saveMessage && <p role="status" className="text-xs text-[var(--dim)]">{saveMessage}</p>}
      {guides[key] && !saveMessage && <p className="text-xs text-[var(--dim)]">Salvo neste navegador · {new Date(guides[key].savedAt).toLocaleString('pt-BR')}</p>}
      {guides[key] && <div className="flex flex-wrap gap-3">
        <button type="button" disabled={loadingKey !== null} className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm disabled:opacity-50" onClick={() => { if (printContent.current) printStrategyGuide(printContent.current, `Aprofundamento — ${subject} — ${chapter || topic?.name} — ${board}`); }}>Imprimir / Salvar em PDF</button>
        {uid && <button type="button" className="text-sm underline" onClick={() => void persist(guides[key])}>Salvar novamente na conta</button>}
      </div>}
      {(answers[key] || guides[key]) && <div ref={printContent}>
        <h4 className="font-display text-lg">{subject} · {topic?.name}{chapter ? ` · ${chapter}` : ''} · {board}</h4>
        <AiText text={answers[key] || guides[key]?.text || ''} className="text-sm leading-relaxed" />
      </div>}
    </div>
    <a href="/study-guide.html" target="_blank" rel="noreferrer" className="text-sm underline">Abrir guia completo para consultar ou imprimir</a>
  </section>;
}
