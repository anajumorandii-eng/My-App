import React, { useEffect, useMemo, useRef, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import { useAuth } from '../context/AuthContext';
import { useUserMastery } from '../hooks/useUserMastery';
import { useQuestions } from '../hooks/useQuestions';
import { addUserAttempt, addUserDiscursiveAttempt } from '../lib/userData';
import { STATE_LABELS, STATE_DESCRIPTIONS } from '../lib/backlogEngine';
import { Question, TopicDiscursivePrompt, TopicMastery } from '../types';
import {
  Stethoscope,
  CheckCircle2,
  XCircle,
  CloudOff,
  RotateCcw,
  ArrowRight,
  Clock,
  PenLine,
} from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { MasteryMeter } from '../features/daily-plan/components/MasteryMeter';
import { CrivoCore, CrivoCoreState } from '../components/CrivoCore';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';
import { cn } from '../lib/cn';

const STATE_BASE_LEVEL: Record<number, number> = { 0: 8, 1: 28, 2: 50, 3: 72, 4: 92 };

type QuizItem =
  | { kind: 'mc'; question: Question }
  | { kind: 'discursive'; prompt: TopicDiscursivePrompt };

type QuizSignal = 'correct' | 'wrong' | 'neutral';

const SELF_RATING_SIGNAL: Record<'fraco' | 'mediano' | 'forte', QuizSignal> = {
  fraco: 'wrong',
  mediano: 'neutral',
  forte: 'correct',
};

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function daysAgo(dateIso: string): number {
  return Math.floor((Date.now() - new Date(dateIso).getTime()) / 86400000);
}

type Phase = 'pick' | 'selfreport' | 'quiz' | 'result';

const DIAGNOSTICO_DRAFT_KEY_PREFIX = 'crivo_diagnostico_draft:';

type QuizPoolItemRef = { kind: 'mc' | 'discursive'; id: string };

interface DiagnosticoDraft {
  topicId: string;
  selectedSubtopic: string;
  phase: Exclude<Phase, 'pick'>;
  selfState: number | null;
  dontKnow: boolean;
  quizIndex: number;
  quizAnswers: { questionId: string; signal: QuizSignal }[];
  quizChapter: string | null;
  chapterFallback: boolean;
  quizPoolItems: QuizPoolItemRef[];
}

const DRAFT_PHASES: ReadonlySet<string> = new Set(['selfreport', 'quiz', 'result']);
const DRAFT_SIGNALS: ReadonlySet<string> = new Set(['correct', 'wrong', 'neutral']);

function isValidDraftAnswer(value: unknown): value is { questionId: string; signal: QuizSignal } {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.questionId === 'string' && !!candidate.questionId &&
    typeof candidate.signal === 'string' && DRAFT_SIGNALS.has(candidate.signal)
  );
}

function isValidDraftPoolItem(value: unknown): value is QuizPoolItemRef {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' && !!candidate.id &&
    (candidate.kind === 'mc' || candidate.kind === 'discursive')
  );
}

function parseDiagnosticoDraft(raw: string | null): DiagnosticoDraft | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const candidate = parsed as Record<string, unknown>;

    if (typeof candidate.topicId !== 'string' || !candidate.topicId) return null;
    if (typeof candidate.selectedSubtopic !== 'string') return null;
    if (typeof candidate.phase !== 'string' || !DRAFT_PHASES.has(candidate.phase)) return null;
    if (candidate.selfState !== null && typeof candidate.selfState !== 'number') return null;
    if (typeof candidate.dontKnow !== 'boolean') return null;
    if (typeof candidate.quizIndex !== 'number' || candidate.quizIndex < 0) return null;
    if (!Array.isArray(candidate.quizAnswers) || !candidate.quizAnswers.every(isValidDraftAnswer)) return null;
    if (candidate.quizChapter !== null && typeof candidate.quizChapter !== 'string') return null;
    if (typeof candidate.chapterFallback !== 'boolean') return null;
    if (!Array.isArray(candidate.quizPoolItems) || !candidate.quizPoolItems.every(isValidDraftPoolItem)) return null;

    return {
      topicId: candidate.topicId,
      selectedSubtopic: candidate.selectedSubtopic,
      phase: candidate.phase as Exclude<Phase, 'pick'>,
      selfState: candidate.selfState as number | null,
      dontKnow: candidate.dontKnow,
      quizIndex: candidate.quizIndex,
      quizAnswers: candidate.quizAnswers as DiagnosticoDraft['quizAnswers'],
      quizChapter: candidate.quizChapter as string | null,
      chapterFallback: candidate.chapterFallback,
      quizPoolItems: candidate.quizPoolItems as QuizPoolItemRef[],
    };
  } catch {
    return null;
  }
}

function resolveDraftPool(items: QuizPoolItemRef[], mockQuestions: Question[]): QuizItem[] | null {
  const pool: QuizItem[] = [];
  for (const item of items) {
    if (item.kind === 'mc') {
      const question = mockQuestions.find((q) => q.id === item.id);
      if (!question) return null;
      pool.push({ kind: 'mc', question });
    } else {
      const prompt = mockTopicDiscursivePrompts.find((p) => p.id === item.id);
      if (!prompt) return null;
      pool.push({ kind: 'discursive', prompt });
    }
  }
  return pool;
}

export default function Diagnostico() {
  const { user } = useAuth();
  const { mastery, updateMastery, isPersisted, syncError, loading: masteryLoading } = useUserMastery();
  const { questions: mockQuestions, syncError: questionsSyncError } = useQuestions();

  const draftKey = `${DIAGNOSTICO_DRAFT_KEY_PREFIX}${user?.uid ?? 'demo'}`;

  const initialDraftRef = useRef<{ draft: DiagnosticoDraft; pool: QuizItem[] } | null | undefined>(undefined);
  if (initialDraftRef.current === undefined) {
    initialDraftRef.current = (() => {
      try {
        if (typeof window === 'undefined') return null;
        const draft = parseDiagnosticoDraft(window.sessionStorage.getItem(draftKey));
        if (!draft) return null;
        if (!mockTopics.some((t) => t.id === draft.topicId)) return null;
        const pool = resolveDraftPool(draft.quizPoolItems, mockQuestions);
        if (!pool) return null;
        return { draft, pool };
      } catch {
        return null;
      }
    })();
  }
  const initialDraft = initialDraftRef.current;

  const subjects = useMemo(() => [...new Set(mockTopics.map((t) => t.subject))], []);
  const [subjectFilter, setSubjectFilter] = useState(subjects[0]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(initialDraft?.draft.topicId ?? null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(initialDraft?.draft.selectedSubtopic ?? '');
  const [phase, setPhase] = useState<Phase>(initialDraft?.draft.phase ?? 'pick');
  const [selfState, setSelfState] = useState<number | null>(initialDraft?.draft.selfState ?? null);
  const [dontKnow, setDontKnow] = useState(initialDraft?.draft.dontKnow ?? false);
  const [quizIndex, setQuizIndex] = useState(initialDraft?.draft.quizIndex ?? 0);
  const [quizPool, setQuizPool] = useState<QuizItem[]>(initialDraft?.pool ?? []);
  const [quizAnswers, setQuizAnswers] = useState<{ questionId: string; signal: QuizSignal }[]>(initialDraft?.draft.quizAnswers ?? []);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [discursiveRevealed, setDiscursiveRevealed] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);
  const [quizChapter, setQuizChapter] = useState<string | null>(initialDraft?.draft.quizChapter ?? null);
  const [chapterFallback, setChapterFallback] = useState(initialDraft?.draft.chapterFallback ?? false);

  const topic = selectedTopicId ? mockTopics.find((t) => t.id === selectedTopicId) : null;
  const currentItem = quizPool[quizIndex];
  const currentAnswerRecord = currentItem?.kind === 'mc'
    ? quizAnswers.find((a) => a.questionId === currentItem.question.id)
    : undefined;
  const answered = currentItem?.kind === 'mc'
    ? selectedOptionId !== null || !!currentAnswerRecord
    : discursiveRevealed;
  const isCorrect = currentItem?.kind === 'mc'
    ? (selectedOptionId !== null ? selectedOptionId === currentItem.question.correctOptionId : currentAnswerRecord?.signal === 'correct')
    : false;

  const MIN_CHAPTER_ITEMS = 3;

  function buildQuizPool(topicId: string, chapter?: string): { pool: QuizItem[]; usedChapterFilter: boolean } {
    const allMc: QuizItem[] = mockQuestions
      .filter((q) => q.topicId === topicId)
      .map((question) => ({ kind: 'mc', question }));
    const allDiscursive: QuizItem[] = mockTopicDiscursivePrompts
      .filter((p) => p.topicId === topicId)
      .map((prompt) => ({ kind: 'discursive', prompt }));
    const all = [...allMc, ...allDiscursive];
    if (!chapter) return { pool: shuffled(all), usedChapterFilter: false };
    const filtered = all.filter((item) =>
      item.kind === 'mc' ? item.question.chapter === chapter : item.prompt.chapter === chapter
    );
    if (filtered.length >= MIN_CHAPTER_ITEMS) {
      return { pool: shuffled(filtered), usedChapterFilter: true };
    }
    return { pool: shuffled(all), usedChapterFilter: false };
  }

  const startDiagnostic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setSelectedSubtopic('');
    setSelfState(null);
    setDontKnow(false);
    setQuizIndex(0);
    setQuizPool(buildQuizPool(topicId).pool);
    setQuizChapter(null);
    setChapterFallback(false);
    setQuizAnswers([]);
    setSelectedOptionId(null);
    setDiscursiveRevealed(false);
    setSaveError(null);
    setPhase('selfreport');
  };

  const confirmSelfReport = () => {
    if (selfState === null) return;
    setDontKnow(false);
    const chapter = selectedSubtopic || undefined;
    const { pool, usedChapterFilter } = buildQuizPool(selectedTopicId!, chapter);
    setQuizPool(pool);
    setQuizIndex(0);
    setQuizChapter(usedChapterFilter ? chapter! : null);
    setChapterFallback(!!chapter && !usedChapterFilter);
    if (pool.length > 0) {
      setPhase('quiz');
    } else {
      setPhase('result');
    }
  };

  const chooseDontKnow = () => {
    const chapter = selectedSubtopic || undefined;
    const { pool, usedChapterFilter } = buildQuizPool(selectedTopicId!, chapter);
    if (pool.length === 0) return;
    setQuizPool(pool);
    setQuizIndex(0);
    setQuizChapter(usedChapterFilter ? chapter! : null);
    setChapterFallback(!!chapter && !usedChapterFilter);
    setSelfState(null);
    setDontKnow(true);
    setPhase('quiz');
  };

  const selectQuizOption = (optionId: string) => {
    if (answered || !currentItem || currentItem.kind !== 'mc') return;
    const correct = optionId === currentItem.question.correctOptionId;
    setSelectedOptionId(optionId);
    setQuizAnswers((prev) => [...prev, { questionId: currentItem.question.id, signal: correct ? 'correct' : 'wrong' }]);

    if (user && selectedTopicId) {
      addUserAttempt(user.uid, {
        id: `attempt_${Date.now()}`,
        questionId: currentItem.question.id,
        topicId: selectedTopicId,
        correct,
        date: new Date().toISOString(),
      }).catch((error) => console.error('Failed to save diagnostic attempt:', error));
    }
  };

  const revealDiscursiveAnswer = () => {
    if (!currentItem || currentItem.kind !== 'discursive') return;
    setDiscursiveRevealed(true);
  };

  const rateDiscursiveAnswer = (rating: 'fraco' | 'mediano' | 'forte') => {
    if (!currentItem || currentItem.kind !== 'discursive') return;
    setQuizAnswers((prev) => [...prev, { questionId: currentItem.prompt.id, signal: SELF_RATING_SIGNAL[rating] }]);
    if (user && selectedTopicId) {
      addUserDiscursiveAttempt(user.uid, {
        id: `disc_attempt_${Date.now()}`,
        questionId: currentItem.prompt.id,
        topicId: selectedTopicId,
        selfRating: rating,
        date: new Date().toISOString(),
      }).catch((error) => console.error('Failed to save diagnostic discursive attempt:', error));
    }
    nextQuizStep();
  };

  const nextQuizStep = () => {
    if (quizIndex + 1 < quizPool.length) {
      setQuizIndex((i) => i + 1);
      setSelectedOptionId(null);
      setDiscursiveRevealed(false);
    } else {
      setPhase('result');
    }
  };

  const computedResult = useMemo(() => {
    const correctCount = quizAnswers.filter((a) => a.signal === 'correct').length;
    const wrongCount = quizAnswers.filter((a) => a.signal === 'wrong').length;
    if (dontKnow) {
      if (quizAnswers.length === 0) return null;
      const ratio = correctCount / quizAnswers.length;
      const level = Math.min(100, Math.max(0, Math.round(20 + ratio * 60)));
      return { level, uncertainty: 0.55, errorSignals: wrongCount };
    }
    if (selfState === null) return null;
    let level = STATE_BASE_LEVEL[selfState];
    level = Math.min(100, Math.max(0, level + correctCount * 6 - wrongCount * 6));
    const uncertainty = quizAnswers.length > 0 ? 0.15 : 0.35;
    return { level: Math.round(level), uncertainty, errorSignals: wrongCount };
  }, [selfState, dontKnow, quizAnswers]);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      if (phase === 'pick' || !selectedTopicId) {
        window.sessionStorage.removeItem(draftKey);
        return;
      }
      const draft: DiagnosticoDraft = {
        topicId: selectedTopicId,
        selectedSubtopic,
        phase,
        selfState,
        dontKnow,
        quizIndex,
        quizAnswers,
        quizChapter,
        chapterFallback,
        quizPoolItems: quizPool.map((item) =>
          item.kind === 'mc' ? { kind: 'mc', id: item.question.id } : { kind: 'discursive', id: item.prompt.id }
        ),
      };
      window.sessionStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      // Session storage unavailable fallback
    }
  }, [draftKey, phase, selectedTopicId, selectedSubtopic, selfState, dontKnow, quizIndex, quizAnswers, quizChapter, chapterFallback, quizPool]);

  const saveDiagnostic = async () => {
    if (!selectedTopicId || !computedResult || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError(null);
    const entry: TopicMastery = {
      topicId: selectedTopicId,
      level: computedResult.level,
      uncertainty: computedResult.uncertainty,
      lastReviewed: new Date().toISOString(),
      errorSignals: computedResult.errorSignals,
      origin: 'diagnostic',
    };
    const saved = await updateMastery((prev) => {
      const exists = prev.some((m) => m.topicId === selectedTopicId);
      return exists ? prev.map((m) => (m.topicId === selectedTopicId ? entry : m)) : [...prev, entry];
    });
    savingRef.current = false;
    setSaving(false);
    if (saved) {
      try {
        if (typeof window !== 'undefined') window.sessionStorage.removeItem(draftKey);
      } catch {
        // Safe clear
      }
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
    } else {
      setSaveError('Não foi possível salvar essa alteração. Ela pode não persistir.');
    }
  };

  const reset = () => {
    setSelectedTopicId(null);
    setSelectedSubtopic('');
    setPhase('pick');
    setSelfState(null);
    setDontKnow(false);
    setQuizIndex(0);
    setQuizAnswers([]);
    setSelectedOptionId(null);
    setSaveError(null);
  };

  const currentSubject = topic?.subject ?? subjectFilter;
  const currentPalette = PALETTES[currentSubject] ?? PALETTES.Matemática;
  const SubIcon = SUBJECT_ICONS[currentSubject] ?? Stethoscope;

  const coreState: CrivoCoreState | null = !topic
    ? null
    : phase === 'selfreport'
      ? (selfState !== null || dontKnow ? 'analyzing' : 'idle')
      : phase === 'quiz'
        ? (answered ? (isCorrect ? 'ready' : 'recalibrating') : 'listening')
        : phase === 'result'
          ? (computedResult !== null && computedResult.level >= 70 ? 'ready' : 'converging')
          : 'idle';

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>DECISÃO</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <SubIcon className="w-3 h-3" />
          </span>
          AVALIAÇÃO INICIAL
        </span>
        <i />
        <b>DIAGNÓSTICO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Mapeie sua estrutura de conhecimento.</h1>
          <p>Avaliação calibrada que afina o motor de recomendação — feita uma vez, atualizada a qualquer momento.</p>
        </div>
        <div className="ni-state">
          <i /> {mockTopics.length} tópicos monitorados · Crivo Diagnostic
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-center text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 shrink-0" />
          Modo demonstração — conecte sua conta Google em "Perfil" para salvar seu diagnóstico permanentemente.
        </p>
      )}
      {(syncError || questionsSyncError) && <p className="text-xs text-rose-500 mb-2">{syncError || questionsSyncError}</p>}

      {phase === 'pick' && (
        <div className="space-y-4">
          <div className="ni-subjects">
            {subjects.map((s) => {
              const active = subjectFilter === s;
              const subPal = PALETTES[s] ?? PALETTES.Matemática;
              const Icon = SUBJECT_ICONS[s] ?? Stethoscope;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubjectFilter(s)}
                  style={
                    active
                      ? { backgroundColor: subPal.primary, color: subPal.wash, borderRadius: '4px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }
                      : { display: 'inline-flex', alignItems: 'center', gap: '5px' }
                  }
                >
                  <Icon className="w-3 h-3" style={{ color: active ? subPal.wash : subPal.primary }} />
                  <span>{s}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockTopics
              .filter((t) => t.subject === subjectFilter)
              .map((t) => {
                const m = mastery.find((mm) => mm.topicId === t.id);
                const hasQuiz = mockQuestions.some((q) => q.topicId === t.id) || mockTopicDiscursivePrompts.some((p) => p.topicId === t.id);
                return (
                  <Panel
                    key={t.id}
                    subject={t.subject}
                    interactive
                    onClick={() => startDiagnostic(t.id)}
                    className="ni-panel p-4 cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display font-medium text-xs text-[var(--text)]">{t.name}</p>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--dim)] shrink-0 ml-2" />
                    </div>
                    {masteryLoading ? (
                      <Skeleton className="h-3 w-36 mt-1.5" />
                    ) : (
                      <p className="text-[11px] text-[var(--dim)] mt-1 flex items-center flex-wrap gap-x-2 font-mono">
                        {m ? (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Diagnosticado há {daysAgo(m.lastReviewed)} dias · {m.level}% domínio
                          </span>
                        ) : (
                          'Nunca diagnosticado'
                        )}
                        {hasQuiz && <span className="text-[var(--primary)]">• com teste rápido</span>}
                      </p>
                    )}
                  </Panel>
                );
              })}
          </div>
        </div>
      )}

      {phase === 'selfreport' && topic && (
        <Panel subject={topic.subject} className="ni-panel p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--dim)] font-mono">{topic.subject}</p>
              <h2 className="font-display text-xl font-semibold text-[var(--text)] mt-1">{topic.name}</h2>
            </div>
            {coreState && <CrivoCore state={coreState} subject={topic.subject} topicId={topic.id} size={44} className="shrink-0" />}
          </div>

          {!!topic.chapters?.length && (
            <div>
              <label htmlFor="diag-subtopic" className="text-xs font-medium text-[var(--text)] mb-1 block">
                Capítulo específico (opcional)
              </label>
              <p className="text-[11px] text-[var(--dim)] mb-2">
                O domínio salvo continua sendo da frente inteira — isso só afina sua autoavaliação.
              </p>
              <select
                id="diag-subtopic"
                value={selectedSubtopic}
                onChange={(e) => setSelectedSubtopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
              >
                <option value="" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Frente inteira ({topic.name})</option>
                {topic.chapters!.map((chapter) => (
                  <option key={chapter} value={chapter} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{chapter}</option>
                ))}
              </select>
            </div>
          )}

          <fieldset className="space-y-2 border-0 p-0 m-0">
            <legend className="text-xs text-[var(--dim)] p-0 mb-2 font-mono">
              Com que honestidade você diria que está{selectedSubtopic ? ` em "${selectedSubtopic}"` : ' este tópico'} hoje?
            </legend>
            {[0, 1, 2, 3, 4].map((n) => (
              <label
                key={n}
                className="flex items-start gap-3 rounded-xl border border-[var(--line)] p-3 cursor-pointer transition-colors hover:bg-[var(--surface2)]"
                style={selfState === n ? { borderColor: currentPalette.primary, backgroundColor: 'var(--surface2)' } : undefined}
              >
                <input
                  type="radio"
                  name="selfState"
                  value={n}
                  checked={selfState === n}
                  onChange={() => setSelfState(n)}
                  className="mt-1 accent-[var(--primary)] shrink-0"
                />
                <span>
                  <span className="block font-medium text-xs text-[var(--text)]">{n} — {STATE_LABELS[n]}</span>
                  <span className="block text-[11px] text-[var(--dim)] mt-0.5">{STATE_DESCRIPTIONS[n]}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <button
            onClick={confirmSelfReport}
            disabled={selfState === null}
            className="w-full py-2.5 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-xl text-xs font-semibold transition-opacity"
          >
            {quizPool.length > 0 ? 'Continuar para o teste rápido' : 'Ver resultado'}
          </button>
          {quizPool.length > 0 && (
            <button
              onClick={chooseDontKnow}
              className="w-full py-2 border border-[var(--line)] rounded-xl text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors"
            >
              Não sei — é isso que eu quero descobrir com o teste
            </button>
          )}
        </Panel>
      )}

      {phase === 'quiz' && topic && currentItem && (
        <Panel subject={topic.subject} className="ni-panel p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--dim)] font-mono">
                {topic.subject}{quizChapter ? ` · ${quizChapter}` : ''} · Teste rápido
              </p>
              <span className="text-xs text-[var(--dim)] font-mono">
                Questão {quizIndex + 1} de {quizPool.length}
              </span>
            </div>
            {coreState && <CrivoCore state={coreState} subject={topic.subject} topicId={topic.id} size={44} className="shrink-0" />}
          </div>
          {chapterFallback && (
            <p className="text-[11px] text-[var(--dim)] -mt-2">
              Ainda não há questões suficientes de "{selectedSubtopic}" — usando a frente inteira de {topic.name}.
            </p>
          )}
          {dontKnow && (
            <p className="text-[11px] text-[var(--dim)] -mt-2">
              Sem autoavaliação prévia — o resultado vai sair destas {quizPool.length} questões.
            </p>
          )}

          {currentItem.kind === 'mc' && (
            <>
              <p className="text-xs font-display text-[var(--text)] leading-relaxed">{currentItem.question.prompt}</p>
              <div className="space-y-2">
                {currentItem.question.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrectOption = option.id === currentItem.question.correctOptionId;
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectQuizOption(option.id)}
                      disabled={answered}
                      className="w-full text-left px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] transition-colors flex items-center justify-between text-xs text-[var(--text)]"
                      style={
                        answered && isCorrectOption
                          ? { borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' }
                          : answered && isSelected && !isCorrectOption
                          ? { borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.1)' }
                          : undefined
                      }
                    >
                      <span>{option.text}</span>
                      {answered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                      {answered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-[#e08391] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div aria-live="polite" className={cn('p-3 rounded-xl text-xs leading-relaxed', isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-[#e08391]')}>
                  <p className="font-semibold mb-0.5">{isCorrect ? 'Correto!' : 'Não foi dessa vez.'}</p>
                  <p className="text-[var(--text)]">{currentItem.question.explanation}</p>
                </div>
              )}
              <button
                onClick={nextQuizStep}
                disabled={!answered}
                className="w-full py-2.5 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-xl text-xs font-semibold transition-opacity"
              >
                {quizIndex + 1 < quizPool.length ? 'Próxima questão' : 'Ver resultado'}
              </button>
            </>
          )}

          {currentItem.kind === 'discursive' && (
            <>
              <div className="flex items-center text-xs font-medium text-[var(--primary)]">
                <PenLine className="w-3.5 h-3.5 mr-1.5" />
                Questão discursiva — sem múltipla escolha, você mesma avalia sua resposta
              </div>
              <p className="text-xs font-display text-[var(--text)] leading-relaxed">{currentItem.prompt.prompt}</p>
              {!discursiveRevealed ? (
                <button
                  onClick={revealDiscursiveAnswer}
                  className="w-full py-2.5 border border-[var(--primary)] text-[var(--primary)] rounded-xl text-xs font-semibold hover:bg-[var(--surface2)] transition-colors"
                >
                  Pensei na resposta — ver o gabarito
                </button>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs leading-relaxed space-y-2">
                    <div>
                      <p className="font-semibold text-[var(--text)] mb-0.5">Resposta modelo</p>
                      <p className="text-[var(--dim)]">{currentItem.prompt.modelAnswer}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text)] mb-0.5">Pontos-chave esperados</p>
                      <ul className="list-disc list-inside text-[var(--dim)] space-y-0.5">
                        {currentItem.prompt.keyPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--dim)] mb-2">Comparando com o que você pensou, como foi sua resposta?</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => rateDiscursiveAnswer('fraco')}
                        className="py-2 border border-rose-500/30 text-[#e08391] hover:bg-rose-500/10 rounded-lg text-xs font-semibold"
                      >
                        Fraco
                      </button>
                      <button
                        onClick={() => rateDiscursiveAnswer('mediano')}
                        className="py-2 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs font-semibold"
                      >
                        Mediano
                      </button>
                      <button
                        onClick={() => rateDiscursiveAnswer('forte')}
                        className="py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs font-semibold"
                      >
                        Forte
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </Panel>
      )}

      {phase === 'quiz' && topic && !currentItem && (
        <EmptyState
          icon={Stethoscope}
          title="Nenhuma questão disponível"
          description="Este tópico ainda não tem questões cadastradas para o teste rápido. Volte e escolha outro tópico."
          action={<Button variant="secondary" onClick={reset}>Escolher outro tópico</Button>}
        />
      )}

      {phase === 'result' && topic && computedResult && (
        <Panel subject={topic.subject} className="ni-panel p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--dim)] font-mono">
                {topic.subject}{selectedSubtopic ? ` · ${selectedSubtopic}` : ''}
              </p>
              <h2 className="font-display text-xl font-semibold text-[var(--text)] mt-1">{topic.name}</h2>
              {selectedSubtopic && (
                <p className="text-[11px] text-[var(--dim)] mt-0.5">O domínio abaixo é salvo para a frente inteira ({topic.name}).</p>
              )}
            </div>
            {coreState && <CrivoCore state={coreState} subject={topic.subject} topicId={topic.id} size={44} className="shrink-0" />}
          </div>

          <MasteryMeter level={computedResult.level} uncertainty={computedResult.uncertainty} topicName={topic.name} className="max-w-sm" />

          <p className="text-xs text-[var(--dim)] leading-relaxed">
            {dontKnow ? (
              <>
                Sem autoavaliação — calculado por {quizAnswers.filter((a) => a.signal === 'correct').length} acerto(s) e {quizAnswers.filter((a) => a.signal === 'wrong').length} erro(s) em {quizAnswers.length} questões.
              </>
            ) : (
              <>
                Ponto de partida pela sua autoavaliação ({STATE_LABELS[selfState ?? 0]})
                {quizAnswers.length > 0 && `, ajustado por ${quizAnswers.filter((a) => a.signal === 'correct').length} acerto(s) e ${quizAnswers.filter((a) => a.signal === 'wrong').length} erro(s) no teste rápido`}.
              </>
            )}
          </p>

          {savedFlash ? (
            <div className="flex items-center justify-center py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Diagnóstico salvo — atualizado em Hoje, Plano e Evolução
            </div>
          ) : (
            <div className="space-y-2">
              {saveError && <p className="text-xs text-rose-500">{saveError}</p>}
              <button
                onClick={saveDiagnostic}
                disabled={saving}
                className="w-full py-2.5 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-xl text-xs font-semibold transition-opacity"
              >
                {saving ? 'Salvando…' : saveError ? 'Tentar novamente' : 'Salvar diagnóstico'}
              </button>
            </div>
          )}

          <button
            onClick={reset}
            className="w-full py-2 border border-[var(--line)] rounded-xl text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Diagnosticar outro tópico
          </button>
        </Panel>
      )}
    </div>
  );
}
