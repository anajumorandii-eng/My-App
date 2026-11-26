import { StudyExportButton } from '../components/StudyExportButton';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UNSAFE_LocationContext } from 'react-router-dom';
import { discursiveQuestions, boardExamStructure } from '../data/discursiveQuestions';
import { famerpExpectedChecks } from '../data/famerpExpectedChecks';
import { DiscursiveGrader, HowToGradeGuide } from '../components/DiscursiveGrader';
import { criterionIds, errorLogsFromGrading, missSummary, MISS_LABELS, parseAiScore, parseCriteriaVerdicts, ratingFromScore, splitIdealAnswer, stripCriteriaBlock, type DiscursiveGrading } from '../lib/discursiveGrading';
import { addUserErrorLog } from '../lib/userData';
import { secondPhaseProtocols } from '../data/resolutionStrategies';
import { useDiscursiveAttempts } from '../hooks/useDiscursiveAttempts';
import { useUserMastery } from '../hooks/useUserMastery';
import { registerStudySelfRating } from '../lib/studySelfRating';
import { aiErrorMessage, requestAiTextStream } from '../lib/aiClient';
import { AiText } from '../components/AiText';
import { DiscursiveQuestion } from '../types';
import {
  ClipboardEdit,
  AlertTriangle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Sparkles,
  Check,
  CloudOff,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';
import { useAmbienteDaTela } from './visual-boards/ambiente';
import { ambienteDaMateria } from '../lib/visualAmbiente';

import { useAuth } from '../context/AuthContext';
import { useStudyDraft, isText } from '../hooks/useStudyDraft';
import { StudyDraftNotice } from '../components/StudyDraftNotice';
import { StudyReflectionPanel } from '../components/StudyReflectionPanel';
import { StudyJourneyLinks } from '../components/StudyJourneyLinks';

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function fullQuestionText(q: DiscursiveQuestion): string {
  let text = q.prompt;
  if (q.subItems) {
    text += '\n' + q.subItems.map((s) => `(${s.letter}) ${s.prompt}`).join('\n');
  }
  return text;
}

type Rating = 'fraco' | 'mediano' | 'forte';

const RATING_LABELS: { value: Rating; label: string; classes: string }[] = [
  { value: 'fraco', label: 'Fraco', classes: 'bg-rose-600 border-rose-600 text-white' },
  { value: 'mediano', label: 'Mediano', classes: 'bg-amber-500 border-amber-500 text-white' },
  { value: 'forte', label: 'Forte', classes: 'bg-emerald-600 border-emerald-600 text-white' },
];

export default function Treino2aFase() {
  const { user } = useAuth();
  return <DiscursiveTraining key={user?.uid ?? 'guest'} />;
}
function DiscursiveTraining() {
  const { user } = useAuth();
  const { attempts, addAttempt, isPersisted, syncError } = useDiscursiveAttempts();
  const misses = useMemo(() => missSummary(attempts).slice(0, 3), [attempts]);
  const { updateMastery, syncing: masterySyncing, syncError: masterySyncError } = useUserMastery();

  const boards = useMemo(() => ['Todas', ...new Set(discursiveQuestions.map((q) => q.board))], []);
  // A tela da Famerp abre esta aba já filtrada (?banca=Famerp); banca
  // desconhecida cai em "Todas" em vez de mostrar uma lista vazia.
  const locationContext = useContext(UNSAFE_LocationContext);
  const requestedBoard = new URLSearchParams(locationContext?.location.search ?? window.location.search).get('banca');
  // ?questao=<id> vem do Caderno de Erros ("Refazer esta questão"): abre a
  // própria questão, filtrando pelo tópico dela para que fique na tela.
  const requestedQuestion = discursiveQuestions.find((q) => q.id === new URLSearchParams(locationContext?.location.search ?? window.location.search).get('questao'));
  const [boardFilter, setBoardFilter] = useState(() => requestedQuestion?.board ?? (requestedBoard && boards.includes(requestedBoard) ? requestedBoard : 'Todas'));
  const subjects = useMemo(() => {
    const pool = boardFilter === 'Todas' ? discursiveQuestions : discursiveQuestions.filter((q) => q.board === boardFilter);
    return ['Todas', ...new Set(pool.map((q) => q.subject))];
  }, [boardFilter]);
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [topicFilter, setTopicFilter] = useState(() => requestedQuestion?.topic ?? 'Todos');
  const [index, setIndex] = useState(0);

  // Recorte antes do tópico, para que a lista de tópicos mostre só o que a
  // banca e a matéria já selecionadas realmente têm.
  const scoped = useMemo(() => {
    let result = boardFilter === 'Todas' ? discursiveQuestions : discursiveQuestions.filter((q) => q.board === boardFilter);
    if (subjectFilter !== 'Todas') result = result.filter((q) => q.subject === subjectFilter);
    return result;
  }, [boardFilter, subjectFilter]);

  // As discursivas trazem topicId e topic, mas não capítulo — por isso aqui a
  // navegação para no tópico, sem o nível de subtópico das objetivas.
  const topicOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const q of scoped) counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
  }, [scoped]);

  const pool = useMemo(
    () => (topicFilter === 'Todos' ? scoped : scoped.filter((q) => q.topic === topicFilter)),
    [scoped, topicFilter],
  );

  // Se o tópico tem mais de uma questão, posiciona na pedida pelo Caderno.
  useEffect(() => {
    const position = requestedQuestion ? pool.findIndex((q) => q.id === requestedQuestion.id) : -1;
    if (position > 0) setIndex(position);
    // Só na entrada: depois, a navegação é dela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const question = pool.length > 0 ? pool[index % pool.length] : null;
  const checks = question ? famerpExpectedChecks[question.id] : undefined;
  const checkLetters = useMemo(() => (question?.subItems ?? []).map((s) => s.letter), [question]);
  const checkIds = useMemo(() => (checks ? criterionIds(checks, checkLetters) : undefined), [checks, checkLetters]);
  // A cor da tela segue a matéria em foco pelo ambiente do app, em vez da
  // paleta que antes ficava fixa no contêiner e vencia o ambiente.
  const materiaDoAmbiente = question?.subject ?? null;
  const ambiente = useMemo(() => (materiaDoAmbiente ? ambienteDaMateria(materiaDoAmbiente) : null), [materiaDoAmbiente]);
  useAmbienteDaTela(ambiente);

  const [answer, setAnswer, answerStatus] = useStudyDraft(`discursiva:${question?.id}:answer`, '', isText);
  const [revealed, setRevealed] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [aiFeedback, setAiFeedback, feedbackStatus] = useStudyDraft(`discursiva:${question?.id}:feedback`, '', isText);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [savingRating, setSavingRating] = useState(false);
  const [gradingResult, setGradingResult] = useState<{ score: number; logged: number } | null>(null);
  const [toNotebook, setToNotebook] = useState(true);
  const feedbackEpoch = useRef(0);
  useEffect(() => () => { feedbackEpoch.current++; }, []);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  // A marcação da IA só entra quando a correção terminou: no meio do fluxo o
  // bloco JSON ainda está incompleto. A chave remonta a correção guiada para
  // receber a marcação nova sem misturar com a anterior.
  const aiSuggested = useMemo(() => (checkIds && aiFeedback && !loadingFeedback ? parseCriteriaVerdicts(aiFeedback, checkIds.flat()) : undefined), [checkIds, aiFeedback, loadingFeedback]);
  const feedbackParts = useMemo(() => splitIdealAnswer(stripCriteriaBlock(aiFeedback ?? '')), [aiFeedback]);
  const aiSuggestionKey = aiSuggested && Object.keys(aiSuggested).length > 0 ? `ia-${aiFeedback.length}` : 'manual';

  const [secondsLeft, setSecondsLeft] = useState((question?.suggestedMinutes ?? 15) * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setRevealed(false);
    setShowProtocol(false);
    setRating(null);
    setGradingResult(null);
    feedbackEpoch.current++;
    setFeedbackError(null);
    setLoadingFeedback(false);
    setSavingRating(false);
    setIsRunning(false);
    setSecondsLeft((question?.suggestedMinutes ?? 15) * 60);
  }, [question?.id]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const changeFilter = (setter: (v: string) => void, value: string) => {
    setter(value);
    setIndex(0);
  };

  const protocol = question
    ? secondPhaseProtocols.find((p) => p.board === question.board && !p.scope.toLowerCase().includes('literatura'))
    : undefined;

  const rate = async (value: Rating) => {
    if (!question || rating || savingRating) return;
    const epoch = feedbackEpoch.current;
    setSavingRating(true); setFeedbackError(null);
    const saved = await addAttempt({
      id: `disc_attempt_${Date.now()}`,
      questionId: question.id,
      topicId: question.topicId,
      selfRating: value,
      date: new Date().toISOString(),
    });
    if (feedbackEpoch.current !== epoch) return;
    setSavingRating(false);
    if (!saved) { setFeedbackError('Não foi possível salvar a avaliação. Sua resposta está preservada; tente novamente.'); return; }
    setRating(value);
    const masterySaved = await updateMastery(items => registerStudySelfRating(items, question.topicId, value));
    if (feedbackEpoch.current !== epoch) return;
    if (!masterySaved) setFeedbackError('A avaliação foi registrada, mas não foi possível atualizar o domínio. Sua resposta foi preservada.');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  // Correção guiada: a nota sai dos critérios, e cada ponto perdido pode ir
  // para o Caderno de Erros com o tipo que ela escolheu.
  const saveGrading = async (grading: DiscursiveGrading, toNotebook: boolean) => {
    if (!question || rating || savingRating) return;
    const epoch = feedbackEpoch.current;
    const value = ratingFromScore(grading.score);
    const date = new Date().toISOString();
    setSavingRating(true); setFeedbackError(null);
    // A gravação (tentativa, Caderno, domínio) vai até o fim mesmo se ela
    // passar para a próxima questão no meio: a época só decide se a tela
    // ainda mostra o resultado. Antes, avançar durante o salvamento descartava
    // os pontos perdidos que ela pediu para mandar ao Caderno.
    const current = question;
    const saved = await addAttempt({ id: `disc_attempt_${Date.now()}`, questionId: current.id, topicId: current.topicId, selfRating: value, date, grading });
    if (!saved) {
      if (feedbackEpoch.current === epoch) { setSavingRating(false); setFeedbackError('Não foi possível salvar a correção. Sua resposta está preservada; tente novamente.'); }
      return;
    }
    let logged = 0; let notebookFailed = false;
    if (toNotebook && user) {
      const logs = errorLogsFromGrading(grading, current, date, () => `error_${crypto.randomUUID()}`, answer);
      try { await Promise.all(logs.map((log) => addUserErrorLog(user.uid, log))); logged = logs.length; }
      catch { notebookFailed = true; }
    }
    const masterySaved = await updateMastery(items => registerStudySelfRating(items, current.topicId, value));
    if (feedbackEpoch.current !== epoch) return;
    setSavingRating(false);
    setRating(value);
    setGradingResult({ score: grading.score, logged });
    if (notebookFailed) setFeedbackError('A correção foi salva, mas não foi possível mandar os pontos perdidos ao Caderno de Erros.');
    else if (!masterySaved) setFeedbackError('A correção foi registrada, mas não foi possível atualizar o domínio. Sua resposta foi preservada.');
  };

  const fetchAiFeedback = async () => {
    if (!question || !answer.trim()) return;
    const epoch = ++feedbackEpoch.current;
    setLoadingFeedback(true); setFeedbackError(null);
    try {
      let acumulado = '';
      const data = await requestAiTextStream('discursive-feedback', {
        board: question.board,
        subject: question.subject,
        prompt: fullQuestionText(question),
        // A lista do corretor vai junto: sem ela a IA julgava pela resposta-modelo
        // inteira e dava como certo quem acertava o raciocínio mas omitia o termo
        // exato ou a unidade que a correção exige.
        modelAnswer: [...question.modelAnswer, ...checksText(question)],
        studentAnswer: answer,
        ...(checks ? { criteria: checks.flatMap((item, i) => item.map((c, j) => `${checkIds![i][j]}: ${c}`)) } : {}),
      }, (delta) => {
        acumulado += delta;
        if (feedbackEpoch.current === epoch) setAiFeedback(acumulado);
      });
      if (feedbackEpoch.current === epoch) setAiFeedback(data.text);
    } catch (error) {
      if (feedbackEpoch.current === epoch) setFeedbackError(aiErrorMessage(error));
    } finally {
      if (feedbackEpoch.current === epoch) setLoadingFeedback(false);
    }
  };

  const attemptCountForQuestion = question ? attempts.filter((a) => a.questionId === question.id).length : 0;
  const SubjIcon = SUBJECT_ICONS[question?.subject ?? 'Matemática'] ?? ClipboardEdit;

  return (
    <div className="ni-main" data-study-export data-print-subject={question?.subject} data-print-topic={question?.topic || "Treino discursivo"} data-print-board={question?.board} data-print-purpose="Resolução e correção de questões discursivas">
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>Estudar</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--action-primary)] text-[var(--text-inverse)]">
            <SubjIcon className="w-3 h-3" />
          </span>
          DISCURSIVAS
        </span>
        <i />
        <b>TREINO DE 2ª FASE</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Discursivas exigem raciocínio explícito.</h1>
          <p>Questões abertas com rubrica analítica — treine a argumentação e o rigor exigidos na segunda fase.</p>
        </div>
        <div className="ni-state">
          <i /> {pool.length} questões disponíveis
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google em "Conexões" para salvar seu histórico de treino.
        </p>
      )}
      {(syncError || masterySyncError) && <p className="text-xs text-rose-800 dark:text-rose-300 mb-2">{syncError || masterySyncError}</p>}

      <div className="mb-4"><StudyExportButton title={`Discursiva — ${question?.topic ?? 'Estudo'}`} /></div>
      {/* Filter bars */}
      <div className="space-y-2 mb-4">
        <div className="ni-subjects" style={{ margin: 0 }}>
          {boards.map((b) => {
            const active = boardFilter === b;
            return (
              <button
                key={b}
                onClick={() => {
                  changeFilter(setBoardFilter, b);
                  changeFilter(setSubjectFilter, 'Todas');
                  changeFilter(setTopicFilter, 'Todos');
                }}
                style={
                  active
                    ? { backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)', borderRadius: '4px', padding: '2px 8px' }
                    : undefined
                }
              >
                {b}
              </button>
            );
          })}
        </div>

        <div className="ni-subjects" style={{ margin: 0 }}>
          {subjects.map((s) => {
            const active = subjectFilter === s;
            const subPal = PALETTES[s] ?? PALETTES.Matemática;
            const Icon = SUBJECT_ICONS[s] ?? ClipboardEdit;
            return (
              <button
                key={s}
                onClick={() => { changeFilter(setSubjectFilter, s); changeFilter(setTopicFilter, 'Todos'); }}
                // Estado ativo pelo design system, como nas Questões e nas
                // Revisões: "Todas", que não é matéria, caía no azul de Matemática.
                className={active ? 'active' : ''}
                aria-pressed={active}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                {s !== 'Todas' && <Icon className="w-3 h-3" style={{ color: subPal.primary }} />}
                <span>{s}</span>
              </button>
            );
          })}
        </div>
        <div className="ni-subjects" style={{ margin: 0 }}>
          {['Todos', ...topicOptions.map(([topic]) => topic)].map((t) => {
            const active = topicFilter === t;
            const count = t === 'Todos' ? scoped.length : topicOptions.find(([topic]) => topic === t)?.[1] ?? 0;
            return (
              <button
                key={t}
                onClick={() => changeFilter(setTopicFilter, t)}
                style={
                  active
                    ? { backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)', borderRadius: '4px', padding: '2px 8px' }
                    : undefined
                }
              >
                {t} <span style={{ opacity: 0.6 }}>({count})</span>
              </button>
            );
          })}
        </div>
        {boardFilter !== 'Todas' && boardExamStructure[boardFilter] && (
          <p className="text-[11px] text-[var(--dim)] font-mono">{boardExamStructure[boardFilter]}</p>
        )}
      </div>

      {misses.length > 0 && (
        <section aria-label="Onde você mais perde ponto" className="rounded-xl border border-[var(--line)] p-3 text-xs">
          <p className="font-semibold text-[var(--text)]">Onde você mais perde ponto nas discursivas</p>
          <ul className="mt-1 space-y-0.5">{misses.map((m) => <li key={m.where} className="text-[var(--dim)]"><b className="text-[var(--text)]">{MISS_LABELS[m.where].label}</b>: {m.count} {m.count === 1 ? 'critério' : 'critérios'}. {MISS_LABELS[m.where].hint}</li>)}</ul>
        </section>
      )}

      {!question ? (
        <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-2xl text-xs text-[var(--dim)]">
          Nenhuma questão disponível ainda para esse filtro.
        </div>
      ) : (
        <Panel
          key={question.id}
          subject={question.subject}
          className="ni-panel p-6 sm:p-8 space-y-6"
        >
          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)' }}
              >
                {question.board} {question.year}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--dim)]">{question.subject}</span>
              {attemptCountForQuestion > 0 && (
                <span className="text-[11px] font-mono text-[var(--dim)]">treinada {attemptCountForQuestion}x</span>
              )}
            </div>
            <span className="text-xs font-mono text-[var(--dim)]">Questão {(index % pool.length) + 1} de {pool.length}</span>
          </div>

          {/* Question text */}
          <div>
            <p className="text-xs font-semibold text-[var(--dim)] mb-1">{question.topic}</p>
            <p className="text-sm font-display text-[var(--text)] leading-relaxed whitespace-pre-line">{question.prompt}</p>
            {question.figures?.map((f) => (
              <img key={f.url} src={f.url} alt={f.alt} loading="lazy" className="mt-3 max-w-full h-auto rounded-lg border border-[var(--line)] bg-white" />
            ))}
            {question.subItems && (
              <ul className="mt-3 space-y-2">
                {question.subItems.map((s) => (
                  <li key={s.letter} className="text-xs text-[var(--text)] flex">
                    <span className="font-semibold mr-2 shrink-0 subject-text">({s.letter})</span>
                    <span>{s.prompt}</span>
                  </li>
                ))}
              </ul>
            )}
            {question.uncertain && question.note && (
              <div className="flex items-start p-2.5 mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-amber-800 dark:text-amber-300" />
                <p>{question.note}</p>
              </div>
            )}
          </div>

          {/* Protocol popup */}
          {protocol && (
            <div className="border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--surface2)]/50">
              <button
                onClick={() => setShowProtocol((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-medium subject-text"
              >
                <span className="flex items-center">
                  <Compass className="w-3.5 h-3.5 mr-2" />
                  Protocolo sugerido para {protocol.board}: {protocol.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 ml-3 transition-transform ${showProtocol ? 'rotate-180' : ''}`} />
              </button>
              {showProtocol && (
                <div className="px-4 pb-4 space-y-2">
                  {protocol.steps.map((step) => (
                    <div key={step.letter} className="flex items-start text-xs">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center mr-2 shrink-0 font-bold text-[10px] font-mono"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)' }}
                      >
                        {step.letter}
                      </span>
                      <div>
                        <p className="font-medium text-[var(--text)]">{step.title}</p>
                        <p className="text-[var(--dim)]">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timer row */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
            <div className="flex items-center">
              <Timer className="w-4 h-4 mr-2 text-[var(--dim)]" />
              <span className="text-xs text-[var(--dim)] mr-3">Tempo sugerido: {question.suggestedMinutes} min</span>
              <span className="text-xl font-bold font-mono text-[var(--text)] tabular-nums">{formatTime(secondsLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label={isRunning ? 'Pausar cronômetro da questão' : 'Iniciar cronômetro da questão'}
                onClick={() => setIsRunning((r) => !r)}
                disabled={secondsLeft === 0}
                className="flex items-center px-3 py-1.5 bg-[var(--action-primary)] text-[var(--text-inverse)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                aria-label="Reiniciar cronômetro da questão"
                onClick={() => { setIsRunning(false); setSecondsLeft(question.suggestedMinutes * 60); }}
                className="flex items-center px-2.5 py-1.5 border border-[var(--line)] rounded-lg text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <StudyDraftNotice statuses={[answerStatus, feedbackStatus]} />
          <details><summary className="text-sm font-semibold cursor-pointer">Antes da resposta: o que lembro e por que escolho esse caminho?</summary><StudyReflectionPanel topicId={question.topicId} topicName={question.topic} subject={question.subject} /></details>
          <StudyJourneyLinks topicId={question.topicId} />
          {feedbackError && <p role="alert" className="text-sm text-status-error">{feedbackError}</p>}
          {/* Answer textarea */}
          <div>
            <label htmlFor="answer" className="text-xs font-medium text-[var(--dim)] mb-1.5 block">
              Sua resposta (redija com rigor)
            </label>
            <textarea
              id="answer"
              disabled={savingRating}
              value={answer}
              maxLength={12000}
              onChange={(e) => { feedbackEpoch.current++; setAnswer(e.target.value); setAiFeedback(''); setLoadingFeedback(false); setFeedbackError(null); setRating(null); }}
              rows={8}
              placeholder="Escreva sua resposta como se estivesse na prova — demonstre o raciocínio e os passos intermediários."
              className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] leading-relaxed focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {checks && !revealed && <HowToGradeGuide />}

          {/* Reveal button or answer feedback */}
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center py-2.5 border border-[var(--primary)] subject-text rounded-xl text-xs font-semibold hover:bg-[var(--surface2)] transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Revelar gabarito comentado
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs leading-relaxed text-[var(--text)]">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">{checks ? 'Resposta esperada' : 'Pontos esperados na resposta'}</p>
                <ul className="space-y-1.5">
                  {question.modelAnswer.map((m, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-emerald-800 dark:text-emerald-300">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
                {checks && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/30">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">O que o corretor confere</p>
                    <p className="text-[11px] text-[var(--dim)] mb-2">Lista do CRIVO no formato das respostas esperadas da Vunesp (termo exato, justificativa curta, conta com unidade), conferida questão por questão com a resolução comentada do Etapa.</p>
                    {checks.map((item, i) => (
                      <div key={i} className="mb-1.5">
                        <p className="font-medium">Item {question.subItems?.[i]?.letter ?? i + 1}</p>
                        <ul className="space-y-0.5">{item.map((c) => <li key={c} className="flex items-start"><span className="mr-2" aria-hidden>☐</span><span>{c}</span></li>)}</ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(!aiFeedback || feedbackError) && (
                <button
                  onClick={fetchAiFeedback}
                  disabled={loadingFeedback || savingRating || !answer.trim()}
                  className="w-full flex items-center justify-center py-2.5 border border-[var(--primary)] subject-text rounded-xl font-semibold text-xs hover:bg-[var(--surface2)] disabled:opacity-50 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingFeedback ? 'animate-pulse' : ''}`} />
                  {loadingFeedback ? 'Corrigindo com IA...' : answer.trim() ? 'Corrigir minha resposta com IA' : 'Escreva sua resposta para pedir correção'}
                </button>
              )}

              {aiFeedback && (
                <div className="p-4 rounded-xl text-xs leading-relaxed border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--text)]">
                  {!loadingFeedback && parseAiScore(aiFeedback) && (
                    <p className="mb-3 text-sm">Nota estimada pela IA: <b>{parseAiScore(aiFeedback)}</b> <span className="text-[11px] text-[var(--dim)]">(estimativa, não a nota oficial)</span></p>
                  )}
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 subject-text shrink-0 mt-0.5" />
                    <AiText text={feedbackParts.rest} className="flex-1" />
                  </div>
                </div>
              )}

              {/* Pedido da estudante: ver lado a lado como fez e como deveria
                  ter feito. No celular as colunas empilham. */}
              {aiFeedback && feedbackParts.ideal && (
                <section aria-label="Comparação das respostas" className="grid gap-3 md:grid-cols-2 text-xs leading-relaxed">
                  <div className="rounded-xl border border-[var(--line)] p-4 min-w-0">
                    <h3 className="font-semibold text-sm mb-2 text-[var(--text)]">Como você fez</h3>
                    <p className="whitespace-pre-wrap text-[var(--text)]">{answer.trim() || 'Resposta em branco.'}</p>
                  </div>
                  <div className="rounded-xl border p-4 min-w-0" style={{ borderColor: 'var(--status-success)', background: 'color-mix(in srgb, var(--status-success) 8%, transparent)' }}>
                    <h3 className="font-semibold text-sm mb-2 text-[var(--text)]">Como deveria ter feito</h3>
                    <AiText text={feedbackParts.ideal} />
                  </div>
                </section>
              )}

              {checks ? (gradingResult ? (
                <div role="status" className="rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--text)]">
                  <p className="font-semibold">Correção salva: nota estimada {gradingResult.score.toLocaleString('pt-BR')} de 4.</p>
                  <p className="text-[var(--dim)] mt-1">{gradingResult.logged > 0 ? `${gradingResult.logged} ${gradingResult.logged === 1 ? 'ponto perdido foi' : 'pontos perdidos foram'} para o Caderno de Erros.` : 'Nenhum ponto foi para o Caderno de Erros.'} Agora reescreva só o item que perdeu ponto, em até três linhas.</p>
                </div>
              ) : (
                <DiscursiveGrader key={`${question.id}:${aiSuggestionKey}`} checks={checks} letters={checkLetters} ids={checkIds} suggested={aiSuggested} disabled={savingRating} toNotebook={toNotebook} onToNotebookChange={setToNotebook} onSave={(g, n) => void saveGrading(g, n)} />
              )) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[var(--dim)]">Como você avalia sua resposta?</p>
                  {savedFlash && (
                    <p className="flex items-center text-xs text-emerald-800 dark:text-emerald-300 font-medium font-mono">
                      <Check className="w-3 h-3 mr-1" />
                      {isPersisted ? 'Salvo' : 'Avaliação nesta sessão'}
                    </p>
                  )}
                  {masterySyncing && <p className="text-[11px] text-[var(--dim)]">Sincronizando domínio...</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {RATING_LABELS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => rate(r.value)}
                      disabled={rating !== null || savingRating}
                      className="px-3 py-2 rounded-lg text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] hover:border-[var(--primary)] text-[var(--text)] transition-colors disabled:opacity-60"
                      style={rating === r.value ? { backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)' } : undefined}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              )}

              <button
                onClick={() => setIndex((i) => i + 1)}
                className="w-full py-2.5 bg-[var(--action-primary)] text-[var(--text-inverse)] rounded-xl font-semibold text-xs hover:bg-action-primary-hover transition-colors"
              >
                Próxima questão
              </button>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

function checksText(question: DiscursiveQuestion): string[] {
  return (famerpExpectedChecks[question.id] ?? []).map((item, i) => `Item ${question.subItems?.[i]?.letter ?? i + 1}, o corretor confere: ${item.join(' ')}`);
}
