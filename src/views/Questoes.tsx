import React, { useMemo, useState } from 'react';
import { mockQuestions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useUserMastery } from '../hooks/useUserMastery';
import { addUserAttempt } from '../lib/userData';
import { TopicMastery } from '../types';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, CloudOff, Sparkles } from 'lucide-react';

export default function Questoes() {
  const { user } = useAuth();
  const { updateMastery, isPersisted, syncError } = useUserMastery();
  const subjects = useMemo(() => ['Todas', ...new Set(mockQuestions.map((q) => q.subject))], []);
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [deepExplanation, setDeepExplanation] = useState<string | null>(null);
  const [loadingDeepExplanation, setLoadingDeepExplanation] = useState(false);

  const pool = useMemo(
    () => (subjectFilter === 'Todas' ? mockQuestions : mockQuestions.filter((q) => q.subject === subjectFilter)),
    [subjectFilter]
  );

  const question = pool[index % pool.length];
  const answered = selectedOptionId !== null;
  const isCorrect = answered && selectedOptionId === question.correctOptionId;
  const correctCount = history.filter((h) => h.correct).length;

  const changeSubject = (subject: string) => {
    setSubjectFilter(subject);
    setIndex(0);
    setSelectedOptionId(null);
    setDeepExplanation(null);
  };

  const selectOption = (optionId: string) => {
    if (answered) return;
    const correct = optionId === question.correctOptionId;
    setSelectedOptionId(optionId);
    setHistory((h) => [...h, { questionId: question.id, correct }]);

    // Practicing nudges the topic's mastery: small gain on a correct
    // answer, a small dip plus an error signal on a wrong one.
    updateMastery((prev: TopicMastery[]) =>
      prev.map((m) =>
        m.topicId === question.topicId
          ? {
              ...m,
              level: Math.min(100, Math.max(0, m.level + (correct ? 3 : -2))),
              errorSignals: correct ? Math.max(0, m.errorSignals - 1) : m.errorSignals + 1,
            }
          : m
      )
    );

    if (user) {
      addUserAttempt(user.uid, {
        id: `attempt_${Date.now()}`,
        questionId: question.id,
        topicId: question.topicId,
        correct,
        date: new Date().toISOString(),
      }).catch((error) => console.error('Failed to save attempt:', error));
    }
  };

  const nextQuestion = () => {
    setIndex((i) => i + 1);
    setSelectedOptionId(null);
    setDeepExplanation(null);
  };

  const resetSession = () => {
    setIndex(0);
    setSelectedOptionId(null);
    setHistory([]);
    setDeepExplanation(null);
  };

  const fetchDeepExplanation = async () => {
    if (!selectedOptionId) return;
    setLoadingDeepExplanation(true);
    try {
      const selectedOption = question.options.find((o) => o.id === selectedOptionId);
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      const res = await fetch('/api/ai/question-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: question.prompt,
          subject: question.subject,
          selectedAnswer: selectedOption?.text ?? '',
          correctAnswer: correctOption?.text ?? '',
          isCorrect,
          baseExplanation: question.explanation,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeepExplanation(data.text);
      }
    } catch (error) {
      console.error('Failed to fetch deep explanation:', error);
    } finally {
      setLoadingDeepExplanation(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <HelpCircle className="w-7 h-7 mr-3 text-indigo-500" />
          Questões & Tentativas
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">Pratique com feedback imediato e explicação de cada questão.</p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => changeSubject(subject)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                subjectFilter === subject
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span>
            Acertos: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{correctCount}</span> / {history.length}
          </span>
          <button onClick={resetSession} className="flex items-center hover:text-zinc-900 dark:hover:text-zinc-100">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {question.subject} • {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
          </span>
          <span className="text-sm text-zinc-400">Questão {(index % pool.length) + 1} de {pool.length}</span>
        </div>

        <p className="text-lg font-medium mb-6 leading-relaxed">{question.prompt}</p>

        <div className="space-y-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === question.correctOptionId;
            let stateClasses = 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800';
            if (answered && isCorrectOption) {
              stateClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
            } else if (answered && isSelected && !isCorrectOption) {
              stateClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-900/20';
            }

            return (
              <button
                key={option.id}
                onClick={() => selectOption(option.id)}
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
          <div
            className={`p-4 rounded-xl mb-6 text-sm leading-relaxed ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300'
            }`}
          >
            <p className="font-semibold mb-1">{isCorrect ? 'Correto!' : 'Não foi dessa vez.'}</p>
            <p>{question.explanation}</p>
          </div>
        )}

        {answered && !deepExplanation && (
          <button
            onClick={fetchDeepExplanation}
            disabled={loadingDeepExplanation}
            className="w-full flex items-center justify-center py-2.5 mb-6 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-colors"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${loadingDeepExplanation ? 'animate-pulse' : ''}`} />
            {loadingDeepExplanation ? 'Gerando explicação com IA...' : 'Aprofundar explicação com IA'}
          </button>
        )}

        {deepExplanation && (
          <div className="flex items-start p-4 rounded-xl mb-6 text-sm leading-relaxed bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
            <p>{deepExplanation}</p>
          </div>
        )}

        <button
          onClick={nextQuestion}
          disabled={!answered}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
        >
          Próxima questão
        </button>
      </div>
    </div>
  );
}
