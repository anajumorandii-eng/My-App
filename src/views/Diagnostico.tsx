import React, { useMemo, useRef, useState } from 'react';
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

export default function Diagnostico() {
  const { user } = useAuth();
  const { mastery, updateMastery, isPersisted, syncError } = useUserMastery();
  const { questions: mockQuestions, syncError: questionsSyncError } = useQuestions();

  const subjects = useMemo(() => [...new Set(mockTopics.map((t) => t.subject))], []);
  const [subjectFilter, setSubjectFilter] = useState(subjects[0]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [phase, setPhase] = useState<Phase>('pick');
  const [selfState, setSelfState] = useState<number | null>(null);
  const [dontKnow, setDontKnow] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizPool, setQuizPool] = useState<QuizItem[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ questionId: string; signal: QuizSignal }[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [discursiveRevealed, setDiscursiveRevealed] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);
  const [quizChapter, setQuizChapter] = useState<string | null>(null);
  const [chapterFallback, setChapterFallback] = useState(false);

  const topic = selectedTopicId ? mockTopics.find((t) => t.id === selectedTopicId) : null;
  const topicMastery = selectedTopicId ? mastery.find((m) => m.topicId === selectedTopicId) : null;
  const currentItem = quizPool[quizIndex];
  const answered = currentItem?.kind === 'mc' ? selectedOptionId !== null : discursiveRevealed;
  const isCorrect = currentItem?.kind === 'mc' && selectedOptionId !== null
    ? selectedOptionId === currentItem.question.correctOptionId
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Stethoscope className="w-7 h-7 mr-3 text-indigo-500" />
          Diagnóstico
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Meça seu domínio real em qualquer tópico, a qualquer momento — não só na primeira vez que você abre o app. Recalibrar de vez em quando é normal e esperado.
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu diagnóstico de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
        {questionsSyncError && <p className="text-xs text-rose-500 mt-2">{questionsSyncError}</p>}
      </header>

      {phase === 'pick' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  subjectFilter === s
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockTopics
              .filter((t) => t.subject === subjectFilter)
              .map((t) => {
                const m = mastery.find((mm) => mm.topicId === t.id);
                const hasQuiz = mockQuestions.some((q) => q.topicId === t.id) || mockTopicDiscursivePrompts.some((p) => p.topicId === t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => startDiagnostic(t.id)}
                    className="text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{t.name}</p>
                      <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center">
                      {m ? (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Diagnosticado há {daysAgo(m.lastReviewed)} dias · {m.level}% de domínio
                        </>
                      ) : (
                        'Nunca diagnosticado'
                      )}
                      {hasQuiz && <span className="ml-2 text-indigo-500">• com teste rápido</span>}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {phase === 'selfreport' && topic && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{topic.subject}</p>
            <h2 className="text-xl font-bold">{topic.name}</h2>
          </div>
          {!!topic.chapters?.length && (
            <div>
              <label htmlFor="diag-subtopic" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Capítulo específico (opcional)
              </label>
              <p className="text-xs text-zinc-500 mb-2">
                O domínio salvo continua sendo da frente inteira — isso só deixa sua autoavaliação mais precisa sobre o que você está pensando agora.
              </p>
              <select
                id="diag-subtopic"
                value={selectedSubtopic}
                onChange={(e) => setSelectedSubtopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Frente inteira ({topic.name})</option>
                {topic.chapters!.map((chapter) => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>
          )}
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Antes de qualquer teste: com que honestidade você diria que está
            {selectedSubtopic ? ` em "${selectedSubtopic}"` : ' esse tópico'} hoje?
          </p>
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setSelfState(n)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                  selfState === n
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <p className="font-medium text-sm">{n} — {STATE_LABELS[n]}</p>
                <p className={`text-xs mt-0.5 ${selfState === n ? 'text-indigo-100' : 'text-zinc-500'}`}>{STATE_DESCRIPTIONS[n]}</p>
              </button>
            ))}
          </div>
          <button
            onClick={confirmSelfReport}
            disabled={selfState === null}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
          >
            {quizPool.length > 0 ? 'Continuar para o teste rápido' : 'Ver resultado'}
          </button>
          {quizPool.length > 0 && (
            <button
              onClick={chooseDontKnow}
              className="w-full py-3 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-xl font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Não sei — é isso que eu quero descobrir com o teste
            </button>
          )}
        </div>
      )}

      {phase === 'quiz' && topic && currentItem && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {topic.subject}{quizChapter ? ` · ${quizChapter}` : ''} · Teste rápido
            </p>
            <span className="text-sm text-zinc-400">Questão {quizIndex + 1} de {quizPool.length}</span>
          </div>
          {chapterFallback && (
            <p className="text-xs text-zinc-500 -mt-3">
              Ainda não há questões suficientes específicas de "{selectedSubtopic}" — este teste está usando a frente inteira de {topic.name}.
            </p>
          )}
          {dontKnow && (
            <p className="text-xs text-zinc-500 -mt-3">
              Sem autoavaliação prévia — o resultado vai sair só dessas {quizPool.length} questões, com confiança baixa por serem poucas.
            </p>
          )}

          {currentItem.kind === 'mc' && (
            <>
              <p className="text-lg font-medium leading-relaxed">{currentItem.question.prompt}</p>
              <div className="space-y-3">
                {currentItem.question.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrectOption = option.id === currentItem.question.correctOptionId;
                  let stateClasses = 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800';
                  if (answered && isCorrectOption) stateClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                  else if (answered && isSelected && !isCorrectOption) stateClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-900/20';
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectQuizOption(option.id)}
                      disabled={answered}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-colors flex items-center justify-between ${stateClasses}`}
                    >
                      <span>{option.text}</span>
                      {answered && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-3" />}
                      {answered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-3" />}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`p-4 rounded-xl text-sm leading-relaxed ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300'}`}>
                  <p className="font-semibold mb-1">{isCorrect ? 'Correto!' : 'Não foi dessa vez.'}</p>
                  <p>{currentItem.question.explanation}</p>
                </div>
              )}
              <button
                onClick={nextQuizStep}
                disabled={!answered}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
              >
                {quizIndex + 1 < quizPool.length ? 'Próxima questão' : 'Ver resultado'}
              </button>
            </>
          )}

          {currentItem.kind === 'discursive' && (
            <>
              <div className="flex items-center text-xs font-medium text-indigo-500">
                <PenLine className="w-3.5 h-3.5 mr-1.5" />
                Questão discursiva — sem múltipla escolha, você mesma avalia sua resposta
              </div>
              <p className="text-lg font-medium leading-relaxed">{currentItem.prompt.prompt}</p>
              {!discursiveRevealed ? (
                <button
                  onClick={revealDiscursiveAnswer}
                  className="w-full py-3 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-xl font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Pensei na resposta — ver o gabarito
                </button>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-sm leading-relaxed space-y-3">
                    <div>
                      <p className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1">Resposta modelo</p>
                      <p className="text-indigo-900 dark:text-indigo-200">{currentItem.prompt.modelAnswer}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1">Pontos-chave que sua resposta deveria cobrir</p>
                      <ul className="list-disc list-inside text-indigo-900 dark:text-indigo-200 space-y-0.5">
                        {currentItem.prompt.keyPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Comparando com o que você pensou, como foi sua resposta?</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => rateDiscursiveAnswer('fraco')}
                        className="py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        Fraco
                      </button>
                      <button
                        onClick={() => rateDiscursiveAnswer('mediano')}
                        className="py-2.5 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      >
                        Mediano
                      </button>
                      <button
                        onClick={() => rateDiscursiveAnswer('forte')}
                        className="py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        Forte
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {phase === 'result' && topic && computedResult && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{topic.subject}</p>
            <h2 className="text-xl font-bold">{topic.name}{selectedSubtopic ? ` — ${selectedSubtopic}` : ''}</h2>
            {selectedSubtopic && (
              <p className="text-xs text-zinc-500 mt-1">O domínio abaixo é salvo para a frente inteira ({topic.name}), não só para este capítulo.</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Domínio calculado</p>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{computedResult.level}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${computedResult.level}%` }} />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
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
          </div>

          {savedFlash ? (
            <div className="flex items-center justify-center py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Diagnóstico salvo — já atualizado em Hoje, Plano e Evolução & Domínio
            </div>
          ) : (
            <div className="space-y-2">
              {saveError && <p className="text-xs text-rose-500">{saveError}</p>}
              <button
                onClick={saveDiagnostic}
                disabled={saving}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
              >
                {saving ? 'Salvando…' : saveError ? 'Tentar novamente' : 'Salvar diagnóstico'}
              </button>
            </div>
          )}

          <button
            onClick={reset}
            className="w-full flex items-center justify-center py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Diagnosticar outro tópico
          </button>
        </div>
      )}
    </div>
  );
}
