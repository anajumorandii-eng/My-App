import React, { useMemo, useState } from 'react';
import { mockTopics, mockQuestions } from '../data/mockData';
import { useUserMastery } from '../hooks/useUserMastery';
import { STATE_LABELS, STATE_DESCRIPTIONS } from '../lib/backlogEngine';
import { Question } from '../types';
import {
  Stethoscope,
  CheckCircle2,
  XCircle,
  CloudOff,
  RotateCcw,
  ArrowRight,
  Clock,
} from 'lucide-react';

const STATE_BASE_LEVEL: Record<number, number> = { 0: 8, 1: 28, 2: 50, 3: 72, 4: 92 };
const QUIZ_LENGTH = 3;

function daysAgo(dateIso: string): number {
  return Math.floor((Date.now() - new Date(dateIso).getTime()) / 86400000);
}

type Phase = 'pick' | 'selfreport' | 'quiz' | 'result';

export default function Diagnostico() {
  const { mastery, updateMastery, isPersisted, syncError } = useUserMastery();

  const subjects = useMemo(() => [...new Set(mockTopics.map((t) => t.subject))], []);
  const [subjectFilter, setSubjectFilter] = useState(subjects[0]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('pick');
  const [selfState, setSelfState] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const topic = selectedTopicId ? mockTopics.find((t) => t.id === selectedTopicId) : null;
  const topicMastery = selectedTopicId ? mastery.find((m) => m.topicId === selectedTopicId) : null;
  const quizPool: Question[] = useMemo(
    () => (selectedTopicId ? mockQuestions.filter((q) => q.topicId === selectedTopicId).slice(0, QUIZ_LENGTH) : []),
    [selectedTopicId]
  );
  const currentQuestion = quizPool[quizIndex];
  const answered = selectedOptionId !== null;
  const isCorrect = answered && currentQuestion ? selectedOptionId === currentQuestion.correctOptionId : false;

  const startDiagnostic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setSelfState(null);
    setQuizIndex(0);
    setQuizAnswers([]);
    setSelectedOptionId(null);
    setPhase('selfreport');
  };

  const confirmSelfReport = () => {
    if (selfState === null) return;
    if (quizPool.length > 0) {
      setPhase('quiz');
    } else {
      setPhase('result');
    }
  };

  const selectQuizOption = (optionId: string) => {
    if (answered || !currentQuestion) return;
    const correct = optionId === currentQuestion.correctOptionId;
    setSelectedOptionId(optionId);
    setQuizAnswers((prev) => [...prev, { questionId: currentQuestion.id, correct }]);
  };

  const nextQuizStep = () => {
    if (quizIndex + 1 < quizPool.length) {
      setQuizIndex((i) => i + 1);
      setSelectedOptionId(null);
    } else {
      setPhase('result');
    }
  };

  const computedResult = useMemo(() => {
    if (selfState === null) return null;
    let level = STATE_BASE_LEVEL[selfState];
    const correctCount = quizAnswers.filter((a) => a.correct).length;
    const wrongCount = quizAnswers.length - correctCount;
    level = Math.min(100, Math.max(0, level + correctCount * 6 - wrongCount * 6));
    const uncertainty = quizAnswers.length > 0 ? 0.15 : 0.35;
    return { level: Math.round(level), uncertainty, errorSignals: wrongCount };
  }, [selfState, quizAnswers]);

  const saveDiagnostic = () => {
    if (!selectedTopicId || !computedResult) return;
    updateMastery((prev) => {
      const exists = prev.some((m) => m.topicId === selectedTopicId);
      const entry = {
        topicId: selectedTopicId,
        level: computedResult.level,
        uncertainty: computedResult.uncertainty,
        lastReviewed: new Date().toISOString(),
        errorSignals: computedResult.errorSignals,
      };
      return exists ? prev.map((m) => (m.topicId === selectedTopicId ? entry : m)) : [...prev, entry];
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const reset = () => {
    setSelectedTopicId(null);
    setPhase('pick');
    setSelfState(null);
    setQuizIndex(0);
    setQuizAnswers([]);
    setSelectedOptionId(null);
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
                const hasQuiz = mockQuestions.some((q) => q.topicId === t.id);
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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Antes de qualquer teste: com que honestidade você diria que está esse tópico hoje?
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
        </div>
      )}

      {phase === 'quiz' && topic && currentQuestion && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{topic.subject} · Teste rápido</p>
            <span className="text-sm text-zinc-400">Questão {quizIndex + 1} de {quizPool.length}</span>
          </div>
          <p className="text-lg font-medium leading-relaxed">{currentQuestion.prompt}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = option.id === currentQuestion.correctOptionId;
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
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
          <button
            onClick={nextQuizStep}
            disabled={!answered}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
          >
            {quizIndex + 1 < quizPool.length ? 'Próxima questão' : 'Ver resultado'}
          </button>
        </div>
      )}

      {phase === 'result' && topic && computedResult && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{topic.subject}</p>
            <h2 className="text-xl font-bold">{topic.name}</h2>
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
              Ponto de partida pela sua autoavaliação ({STATE_LABELS[selfState ?? 0]})
              {quizAnswers.length > 0 && `, ajustado por ${quizAnswers.filter((a) => a.correct).length} acerto(s) e ${quizAnswers.filter((a) => !a.correct).length} erro(s) no teste rápido`}.
            </p>
          </div>

          {savedFlash ? (
            <div className="flex items-center justify-center py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Diagnóstico salvo — já atualizado em Hoje, Plano e Evolução & Domínio
            </div>
          ) : (
            <button
              onClick={saveDiagnostic}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Salvar diagnóstico
            </button>
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
