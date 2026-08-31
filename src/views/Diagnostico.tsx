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
import { KineticText } from '../components/ui/KineticText';
import { CrivoCore, CrivoCoreState } from '../components/CrivoCore';
import { SubjectAtmosphere } from '../features/daily-plan/components/SubjectAtmosphere';
import { MasteryMeter } from '../features/daily-plan/components/MasteryMeter';
import { getSubjectProfile, TYPOGRAPHY_PRESETS } from '../design-system/crivoSubjects';
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

// Fresh shuffle per attempt (not a stable sort) so the same handful of
// questions don't show up first every single time — the whole point of a
// bigger question bank is that it actually gets used, not just sliced at [0..n).
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

// Rascunho de retomada: espelha o estado da tela em sessionStorage (nunca
// Firestore — não é evidência, é só "onde eu parei", descartável a qualquer
// momento) para sobreviver a um F5 ou fechar/abrir aba. A pool do quiz é
// embaralhada com Math.random (buildQuizPool/shuffled), então reconstruí-la
// de novo a partir de topicId+chapter daria uma ORDEM DIFERENTE — por isso
// guardamos aqui a lista de itens (kind + id) na ordem exata já sorteada,
// e resolvemos de volta para os objetos reais no próximo mount.
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

// Mesmo padrão defensivo de parseAdaptiveRankingSnapshot (useAdaptiveRankingChange.ts):
// valida campo a campo, nunca lança, corrupção vira "sem rascunho" (não vira crash nem tela em branco).
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

// Troca as referências (kind + id) do rascunho pelos objetos reais de questão/prompt,
// preservando a ordem exata gravada. Se algum id não existir mais no banco atual
// (conteúdo mudou), a pool não é reconstruível com fidelidade — trata como rascunho inválido.
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

  // Lido uma única vez, na primeira renderização (via ref, não useEffect),
  // pra tela já nascer na fase certa em vez de "piscar" em 'pick' antes de saltar.
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
  const topicMastery = selectedTopicId ? mastery.find((m) => m.topicId === selectedTopicId) : null;
  const currentItem = quizPool[quizIndex];
  // Ao retomar um rascunho no meio do quiz, a questão MC do índice atual pode
  // já ter sido respondida antes do recarregamento — a alternativa exata
  // clicada não é persistida, só o sinal final em quizAnswers. Usamos esse
  // registro pra mostrar o resultado certo e não deixar responder de novo
  // (o que contaria a mesma questão 2x). Isso só se aplica ao lado MC: no
  // lado discursivo, o registro em quizAnswers e o avanço de índice
  // (nextQuizStep) acontecem no mesmo handler síncrono de rateDiscursiveAnswer
  // — não existe um estado remontável em que a questão discursiva atual já
  // tenha registro e ainda seja a atual, então não há nada pra este guard
  // proteger ali.
  const currentAnswerRecord = currentItem?.kind === 'mc'
    ? quizAnswers.find((a) => a.questionId === currentItem.question.id)
    : undefined;
  const answered = currentItem?.kind === 'mc'
    ? selectedOptionId !== null || !!currentAnswerRecord
    : discursiveRevealed;
  const isCorrect = currentItem?.kind === 'mc'
    ? (selectedOptionId !== null ? selectedOptionId === currentItem.question.correctOptionId : currentAnswerRecord?.signal === 'correct')
    : false;

  // Below this, a chapter-filtered quiz would be too thin to mean anything —
  // falls back to the whole topic's pool instead (disclosed in the UI via
  // chapterFallback) rather than firing a 1-2 question "diagnostic".
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

  // For when the honest answer is "eu não sei" — forcing a pick among 0-4
  // would just be a guess dressed up as data. Only offered when there's a
  // quiz to actually answer the question, since without one there's no
  // signal at all to build a result from.
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

    // Mesma evidência durável por tentativa que Questoes.tsx já grava para o
    // banco de questões geral — aqui alimentando o histórico do Diagnóstico,
    // não só o resultado calculado em memória. Ausente em modo demonstração,
    // como o resto do app já faz honestamente para "sem persistir".
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
      // No self-report anchor at all — the level comes purely from how she
      // did on the quiz. That's not enough to claim real precision, so it
      // starts from a neutral midpoint and stays at high uncertainty
      // regardless of the score, instead of pretending a handful of
      // questions can pin down an exact level the way a self-report + quiz
      // combo can.
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

  // Espelha o estado de retomada em sessionStorage a cada mudança relevante.
  // Sai de 'pick' -> grava; volta a 'pick' (reset()) -> o próprio efeito apaga.
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
      // Modo privado / sessionStorage indisponível — sem rascunho, sem drama.
    }
  }, [draftKey, phase, selectedTopicId, selectedSubtopic, selfState, dontKnow, quizIndex, quizAnswers, quizChapter, chapterFallback, quizPool]);

  const saveDiagnostic = async () => {
    // Guarda por ref (não só o estado `saving`) porque um segundo clique
    // pode chegar antes do React repintar o botão desabilitado — o guard
    // síncrono é o que realmente impede a gravação duplicada.
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
      // Virou evidência de verdade (Firestore, via updateMastery) — o rascunho
      // local perde o sentido de existir, mesmo a fase não voltando pra 'pick'.
      try {
        if (typeof window !== 'undefined') window.sessionStorage.removeItem(draftKey);
      } catch {
        // Sem rascunho pra apagar não é um erro.
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

  // Núcleo do Crivo (CrivoCore) desta tela: acompanha a fase real do fluxo,
  // não é decorativo. 'pick' não tem tópico ainda, então não há núcleo (nada
  // de matéria pra representar). Uma vez escolhido o tópico: 'listening'
  // durante a autoavaliação e enquanto o quiz aguarda a próxima resposta;
  // 'analyzing' na janela entre responder e avançar (mesma janela que já
  // mostra certo/errado); em 'result', 'recalibrating' enquanto o salvamento
  // está em voo, 'ready' já com o salvamento confirmado (savedFlash) e, no
  // meio — resultado calculado mas ainda não salvo/salvo com erro —
  // 'converging' (o resultado convergiu, mas ainda não virou evidência).
  const coreState: CrivoCoreState | null = !topic
    ? null
    : phase === 'selfreport'
    ? 'listening'
    : phase === 'quiz'
    ? (answered ? 'analyzing' : 'listening')
    : phase === 'result'
    ? (saving ? 'recalibrating' : savedFlash ? 'ready' : 'converging')
    : null;

  // Tipografia cinética (Fase 1) do nome do tópico — mesma composição de
  // TodayFocus: TYPOGRAPHY_PRESETS por matéria, via getSubjectProfile.
  const typographyPreset = topic ? TYPOGRAPHY_PRESETS[getSubjectProfile(topic.subject).tipografia] : null;

  // syncError/questionsSyncError vêm dos hooks e não são limpos por transição
  // de fase — podem estar presentes em 'pick', 'selfreport', 'quiz' ou
  // 'result' igualmente. O aria-describedby que os associa (nível de grupo/
  // região, não por controle individual) por isso precisa acompanhar
  // qualquer fase em que o header os renderize, não só 'pick'.
  const headerErrorDescribedByIds = [
    syncError ? 'diagnostico-mastery-sync-error' : null,
    questionsSyncError ? 'diagnostico-questions-sync-error' : null,
  ].filter((id): id is string => !!id);
  const headerErrorDescribedBy = headerErrorDescribedByIds.length > 0 ? headerErrorDescribedByIds.join(' ') : undefined;

  return (
    <SubjectAtmosphere subject={topic?.subject}>
      <div className="space-y-8">
        <header>
          <h1 className="font-display text-3xl font-semibold text-text-primary flex items-center gap-3">
            <Stethoscope className="w-7 h-7 text-text-muted" aria-hidden="true" />
            Diagnóstico
          </h1>
          <p className="text-text-secondary mt-2">
            Meça seu domínio real em qualquer tópico, a qualquer momento — não só na primeira vez que você abre o app. Recalibrar de vez em quando é normal e esperado.
          </p>
          {!isPersisted && (
            <p className="flex items-center text-xs text-text-muted mt-2">
              <CloudOff className="w-3.5 h-3.5 mr-1.5 shrink-0" aria-hidden="true" />
              Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu diagnóstico de verdade.
            </p>
          )}
          {syncError && <p id="diagnostico-mastery-sync-error" className="text-xs text-status-error mt-2">{syncError}</p>}
          {questionsSyncError && <p id="diagnostico-questions-sync-error" className="text-xs text-status-error mt-2">{questionsSyncError}</p>}
        </header>

        {phase === 'pick' && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por matéria">
              {subjects.map((s) => {
                const active = subjectFilter === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubjectFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                      active
                        ? 'bg-action-primary text-warm-50 font-bold shadow-sm ring-1 ring-white/20'
                        : 'border border-border-subtle hover:border-text-primary text-text-muted hover:text-text-primary bg-surface-default/70'
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              role="group"
              aria-label="Tópicos disponíveis"
              aria-describedby={headerErrorDescribedBy}
            >
              {mockTopics
                .filter((t) => t.subject === subjectFilter)
                .map((t) => {
                  const m = mastery.find((mm) => mm.topicId === t.id);
                  const hasQuiz = mockQuestions.some((q) => q.topicId === t.id) || mockTopicDiscursivePrompts.some((p) => p.topicId === t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => startDiagnostic(t.id)}
                      className="text-left rounded-card border border-border-subtle bg-surface-default shadow-soft-sm p-4 hover:border-action-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-base"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-text-primary">{t.name}</p>
                        <ArrowRight className="w-4 h-4 text-text-muted shrink-0 ml-2" aria-hidden="true" />
                      </div>
                      {masteryLoading ? (
                        <Skeleton className="h-3 w-36 mt-1.5" />
                      ) : (
                        <p className="text-xs text-text-muted mt-1 flex items-center flex-wrap gap-x-2">
                          {m ? (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                              Diagnosticado há {daysAgo(m.lastReviewed)} dias · {m.level}% de domínio
                            </span>
                          ) : (
                            'Nunca diagnosticado'
                          )}
                          {hasQuiz && <span className="text-ember-600 dark:text-ember-400">• com teste rápido</span>}
                        </p>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {phase === 'selfreport' && topic && (
          <Panel elevation="elevated" className="p-6 sm:p-8 space-y-5" aria-describedby={headerErrorDescribedBy}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{topic.subject}</p>
                <KineticText
                  as="h2"
                  runKey={topic.id}
                  text={topic.name}
                  className="font-display text-2xl font-semibold text-text-primary mt-1.5 block"
                  stagger={typographyPreset!.stagger}
                  duration={typographyPreset!.duration}
                  ease={typographyPreset!.ease}
                />
              </div>
              {coreState && <CrivoCore state={coreState} subject={topic.subject} topicId={topic.id} size={44} className="shrink-0" />}
            </div>

            {!!topic.chapters?.length && (
              <div>
                <label htmlFor="diag-subtopic" className="text-sm font-medium text-text-primary mb-2 block">
                  Capítulo específico (opcional)
                </label>
                <p className="text-xs text-text-muted mb-2">
                  O domínio salvo continua sendo da frente inteira — isso só deixa sua autoavaliação mais precisa sobre o que você está pensando agora.
                </p>
                <select
                  id="diag-subtopic"
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-control border border-border-subtle bg-surface-default text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring"
                >
                  <option value="">Frente inteira ({topic.name})</option>
                  {topic.chapters!.map((chapter) => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
            )}

            <fieldset className="space-y-2 border-0 p-0 m-0">
              <legend className="text-sm text-text-secondary p-0 mb-2">
                Antes de qualquer teste: com que honestidade você diria que está
                {selectedSubtopic ? ` em "${selectedSubtopic}"` : ' esse tópico'} hoje?
              </legend>
              {[0, 1, 2, 3, 4].map((n) => (
                <label
                  key={n}
                  className="flex items-start gap-3 rounded-card border border-border-subtle p-4 cursor-pointer transition-colors has-[:checked]:border-action-primary has-[:checked]:bg-action-primary/5 hover:bg-surface-secondary"
                >
                  <input
                    type="radio"
                    name="selfState"
                    value={n}
                    checked={selfState === n}
                    onChange={() => setSelfState(n)}
                    aria-label={`${n} — ${STATE_LABELS[n]}`}
                    aria-describedby={`self-state-desc-${n}`}
                    className="mt-1 accent-action-primary shrink-0"
                  />
                  <span>
                    <span className="block font-medium text-sm text-text-primary">{n} — {STATE_LABELS[n]}</span>
                    <span id={`self-state-desc-${n}`} className="block text-xs text-text-secondary mt-0.5">{STATE_DESCRIPTIONS[n]}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <Button onClick={confirmSelfReport} disabled={selfState === null} className="w-full">
              {quizPool.length > 0 ? 'Continuar para o teste rápido' : 'Ver resultado'}
            </Button>
            {quizPool.length > 0 && (
              <Button variant="secondary" onClick={chooseDontKnow} className="w-full">
                Não sei — é isso que eu quero descobrir com o teste
              </Button>
            )}
          </Panel>
        )}

        {phase === 'quiz' && topic && currentItem && (
          <Panel elevation="elevated" className="p-6 sm:p-8 space-y-6" aria-describedby={headerErrorDescribedBy}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  {topic.subject}{quizChapter ? ` · ${quizChapter}` : ''} · Teste rápido
                </p>
                <span aria-live="polite" className="text-sm text-text-muted">
                  Questão {quizIndex + 1} de {quizPool.length}
                </span>
              </div>
              {coreState && <CrivoCore state={coreState} subject={topic.subject} topicId={topic.id} size={44} className="shrink-0" />}
            </div>
            {chapterFallback && (
              <p className="text-xs text-text-muted -mt-3">
                Ainda não há questões suficientes específicas de "{selectedSubtopic}" — este teste está usando a frente inteira de {topic.name}.
              </p>
            )}
            {dontKnow && (
              <p className="text-xs text-text-muted -mt-3">
                Sem autoavaliação prévia — o resultado vai sair só dessas {quizPool.length} questões, com confiança baixa por serem poucas.
              </p>
            )}

            {currentItem.kind === 'mc' && (
              <>
                <p className="text-lg font-medium leading-relaxed text-text-primary">{currentItem.question.prompt}</p>
                <div className="space-y-3">
                  {currentItem.question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrectOption = option.id === currentItem.question.correctOptionId;
                    let stateClasses = 'border-border-subtle hover:bg-surface-secondary';
                    if (answered && isCorrectOption) stateClasses = 'border-status-success bg-status-success/10';
                    else if (answered && isSelected && !isCorrectOption) stateClasses = 'border-status-error bg-status-error/10';
                    return (
                      <button
                        key={option.id}
                        onClick={() => selectQuizOption(option.id)}
                        disabled={answered}
                        aria-pressed={!answered ? isSelected : undefined}
                        className={cn('w-full text-left px-5 py-4 rounded-card border transition-colors flex items-center justify-between text-text-primary', stateClasses)}
                      >
                        <span>{option.text}</span>
                        {answered && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 ml-3" aria-hidden="true" />}
                        {answered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-status-error shrink-0 ml-3" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div aria-live="polite" className={cn('p-4 rounded-card text-sm leading-relaxed', isCorrect ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error')}>
                    <p className="font-semibold mb-1">{isCorrect ? 'Correto!' : 'Não foi dessa vez.'}</p>
                    <p>{currentItem.question.explanation}</p>
                  </div>
                )}
                <Button onClick={nextQuizStep} disabled={!answered} className="w-full">
                  {quizIndex + 1 < quizPool.length ? 'Próxima questão' : 'Ver resultado'}
                </Button>
              </>
            )}

            {currentItem.kind === 'discursive' && (
              <>
                <div className="flex items-center text-xs font-medium text-ember-600 dark:text-ember-400">
                  <PenLine className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  Questão discursiva — sem múltipla escolha, você mesma avalia sua resposta
                </div>
                <p className="text-lg font-medium leading-relaxed text-text-primary">{currentItem.prompt.prompt}</p>
                {!discursiveRevealed ? (
                  <Button variant="secondary" onClick={revealDiscursiveAnswer} className="w-full">
                    Pensei na resposta — ver o gabarito
                  </Button>
                ) : (
                  <>
                    <div className="p-4 rounded-card bg-surface-secondary text-sm leading-relaxed space-y-3">
                      <div>
                        <p className="font-semibold text-text-primary mb-1">Resposta modelo</p>
                        <p className="text-text-secondary">{currentItem.prompt.modelAnswer}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary mb-1">Pontos-chave que sua resposta deveria cobrir</p>
                        <ul className="list-disc list-inside text-text-secondary space-y-0.5">
                          {currentItem.prompt.keyPoints.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-2">Comparando com o que você pensou, como foi sua resposta?</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => rateDiscursiveAnswer('fraco')}
                          className="border-status-error/30 text-status-error hover:bg-status-error/10"
                        >
                          Fraco
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => rateDiscursiveAnswer('mediano')}
                          className="border-status-warning/30 text-status-warning hover:bg-status-warning/10"
                        >
                          Mediano
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => rateDiscursiveAnswer('forte')}
                          className="border-status-success/30 text-status-success hover:bg-status-success/10"
                        >
                          Forte
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </Panel>
        )}

        {phase === 'quiz' && topic && !currentItem && (
          // EmptyState não repassa aria-describedby (sua interface não tem
          // ...props) — o wrapper carrega a associação com o erro do header.
          <div aria-describedby={headerErrorDescribedBy}>
            <EmptyState
              icon={Stethoscope}
              title="Nenhuma questão disponível"
              description="Este tópico ainda não tem questões cadastradas para o teste rápido. Volte e escolha outro tópico."
              action={<Button variant="secondary" onClick={reset}>Escolher outro tópico</Button>}
            />
          </div>
        )}

        {phase === 'result' && topic && computedResult && (
          <Panel elevation="elevated" className="p-6 sm:p-8 space-y-6" aria-describedby={headerErrorDescribedBy}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  {topic.subject}{selectedSubtopic ? ` · ${selectedSubtopic}` : ''}
                </p>
                <KineticText
                  as="h2"
                  runKey={topic.id}
                  text={topic.name}
                  className="font-display text-2xl font-semibold text-text-primary mt-1.5 block"
                  stagger={typographyPreset!.stagger}
                  duration={typographyPreset!.duration}
                  ease={typographyPreset!.ease}
                />
                {selectedSubtopic && (
                  <p className="text-xs text-text-muted mt-1">O domínio abaixo é salvo para a frente inteira ({topic.name}), não só para este capítulo.</p>
                )}
              </div>
              {coreState && <CrivoCore state={coreState} subject={topic.subject} topicId={topic.id} size={44} className="shrink-0" />}
            </div>

            <MasteryMeter level={computedResult.level} uncertainty={computedResult.uncertainty} topicName={topic.name} className="max-w-sm" />

            <p aria-live="polite" className="text-xs text-text-secondary">
              {dontKnow ? (
                <>
                  Sem autoavaliação — calculado só por {quizAnswers.filter((a) => a.signal === 'correct').length} acerto(s) e {quizAnswers.filter((a) => a.signal === 'wrong').length} erro(s) em {quizAnswers.length} questões
                  {quizAnswers.some((a) => a.signal === 'neutral') && ` (incluindo ${quizAnswers.filter((a) => a.signal === 'neutral').length} discursiva(s) autoavaliada(s) como "mediano", que não pesam nem para acerto nem para erro)`}.
                  Confiança baixa de propósito: poucas questões não dão pra cravar um número exato.
                </>
              ) : (
                <>
                  Ponto de partida pela sua autoavaliação ({STATE_LABELS[selfState ?? 0]})
                  {quizAnswers.length > 0 && `, ajustado por ${quizAnswers.filter((a) => a.signal === 'correct').length} acerto(s) e ${quizAnswers.filter((a) => a.signal === 'wrong').length} erro(s) no teste rápido`}.
                </>
              )}
            </p>

            {savedFlash ? (
              <div aria-live="polite" className="flex items-center justify-center py-3 bg-status-success/10 text-status-success rounded-card font-medium text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" aria-hidden="true" />
                Diagnóstico salvo — já atualizado em Hoje, Plano e Evolução & Domínio
              </div>
            ) : (
              <div className="space-y-2">
                {saveError && <p id="save-diagnostic-error" aria-live="polite" className="text-xs text-status-error">{saveError}</p>}
                <Button
                  onClick={saveDiagnostic}
                  loading={saving}
                  aria-describedby={saveError ? 'save-diagnostic-error' : undefined}
                  className="w-full"
                >
                  {saving ? 'Salvando…' : saveError ? 'Tentar novamente' : 'Salvar diagnóstico'}
                </Button>
              </div>
            )}

            <Button variant="secondary" onClick={reset} className="w-full">
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Diagnosticar outro tópico
            </Button>
          </Panel>
        )}
      </div>
    </SubjectAtmosphere>
  );
}
