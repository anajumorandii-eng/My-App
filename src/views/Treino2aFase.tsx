import React, { useEffect, useMemo, useState } from 'react';
import { discursiveQuestions, boardExamStructure } from '../data/discursiveQuestions';
import { secondPhaseProtocols } from '../data/resolutionStrategies';
import { useDiscursiveAttempts } from '../hooks/useDiscursiveAttempts';
import { parseAiErrorMessage, AI_NETWORK_ERROR_MESSAGE } from '../lib/aiError';
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
  const { attempts, addAttempt, isPersisted, syncError } = useDiscursiveAttempts();

  const boards = useMemo(() => ['Todas', ...new Set(discursiveQuestions.map((q) => q.board))], []);
  const [boardFilter, setBoardFilter] = useState('Todas');
  const subjects = useMemo(() => {
    const pool = boardFilter === 'Todas' ? discursiveQuestions : discursiveQuestions.filter((q) => q.board === boardFilter);
    return ['Todas', ...new Set(pool.map((q) => q.subject))];
  }, [boardFilter]);
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [index, setIndex] = useState(0);

  const pool = useMemo(() => {
    let result = boardFilter === 'Todas' ? discursiveQuestions : discursiveQuestions.filter((q) => q.board === boardFilter);
    if (subjectFilter !== 'Todas') result = result.filter((q) => q.subject === subjectFilter);
    return result;
  }, [boardFilter, subjectFilter]);

  const question = pool.length > 0 ? pool[index % pool.length] : null;

  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const [secondsLeft, setSecondsLeft] = useState((question?.suggestedMinutes ?? 15) * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setAnswer('');
    setRevealed(false);
    setShowProtocol(false);
    setRating(null);
    setAiFeedback(null);
    setFeedbackError(null);
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

  const rate = (value: Rating) => {
    if (!question) return;
    setRating(value);
    addAttempt({
      id: `disc_attempt_${Date.now()}`,
      questionId: question.id,
      selfRating: value,
      date: new Date().toISOString(),
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const fetchAiFeedback = async () => {
    if (!question || !answer.trim()) return;
    setLoadingFeedback(true);
    setFeedbackError(null);
    try {
      const res = await fetch('/api/ai/discursive-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: question.board,
          subject: question.subject,
          prompt: fullQuestionText(question),
          modelAnswer: question.modelAnswer,
          studentAnswer: answer,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiFeedback(data.text);
      } else {
        setFeedbackError(await parseAiErrorMessage(res));
      }
    } catch (error) {
      console.error('Failed to fetch AI feedback:', error);
      setFeedbackError(AI_NETWORK_ERROR_MESSAGE);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const attemptCountForQuestion = question ? attempts.filter((a) => a.questionId === question.id).length : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <ClipboardEdit className="w-7 h-7 mr-3 text-indigo-500" />
          Treino de 2ª Fase Discursiva
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Questões reais de segunda fase, com tempo sugerido, gabarito comentado e feedback — para treinar o que realmente vale ponto: o raciocínio no papel.
        </p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {!isPersisted && (
            <p className="flex items-center text-xs text-zinc-400">
              <CloudOff className="w-3.5 h-3.5 mr-1.5" />
              Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu histórico de treino.
            </p>
          )}
        </div>
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      <div className="flex items-start p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs">
        <AlertTriangle className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" />
        <p>
          As questões foram reconstruídas a partir de sites de resolução de cursinhos (o ambiente não permite baixar os PDFs oficiais diretamente) — o conteúdo e a lógica de resolução têm boa confiança, mas a redação exata pode diferir da prova original em detalhes pontuais. A cobertura ainda é desigual entre bancas e matérias (ex.: sem Física ainda para Famerp, sem Matemática/Física ainda para Comvest e Unifesp) — mais questões serão adicionadas aos poucos.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {boards.map((b) => (
            <button
              key={b}
              onClick={() => { changeFilter(setBoardFilter, b); changeFilter(setSubjectFilter, 'Todas'); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                boardFilter === b
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => changeFilter(setSubjectFilter, s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                subjectFilter === s
                  ? 'bg-zinc-800 dark:bg-zinc-100 border-zinc-800 dark:border-zinc-100 text-white dark:text-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {boardFilter !== 'Todas' && boardExamStructure[boardFilter] && (
          <p className="text-xs text-zinc-500">{boardExamStructure[boardFilter]}</p>
        )}
      </div>

      {!question ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">Nenhuma questão disponível ainda para esse filtro.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                {question.board} {question.year}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{question.subject}</span>
              {attemptCountForQuestion > 0 && (
                <span className="text-xs text-zinc-400">treinada {attemptCountForQuestion}x</span>
              )}
            </div>
            <span className="text-sm text-zinc-400">Questão {(index % pool.length) + 1} de {pool.length}</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{question.topic}</p>
            <p className="text-base leading-relaxed">{question.prompt}</p>
            {question.subItems && (
              <ul className="mt-3 space-y-2">
                {question.subItems.map((s) => (
                  <li key={s.letter} className="text-sm flex">
                    <span className="font-semibold mr-2 shrink-0">({s.letter})</span>
                    <span>{s.prompt}</span>
                  </li>
                ))}
              </ul>
            )}
            {question.uncertain && question.note && (
              <div className="flex items-start p-3 mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" />
                <p>{question.note}</p>
              </div>
            )}
          </div>

          {protocol && (
            <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowProtocol((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400"
              >
                <span className="flex items-center">
                  <Compass className="w-4 h-4 mr-2" />
                  Protocolo sugerido para {protocol.board}: {protocol.name}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 ml-3 transition-transform ${showProtocol ? 'rotate-180' : ''}`} />
              </button>
              {showProtocol && (
                <div className="px-4 pb-4 space-y-2">
                  {protocol.steps.map((step) => (
                    <div key={step.letter} className="flex items-start text-sm">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3 shrink-0 font-bold text-xs">
                        {step.letter}
                      </span>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-zinc-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <div className="flex items-center">
              <Timer className="w-4 h-4 mr-2 text-zinc-400" />
              <span className="text-sm text-zinc-500 mr-3">Tempo sugerido: {question.suggestedMinutes} min</span>
              <span className="text-2xl font-bold tabular-nums">{formatTime(secondsLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning((r) => !r)}
                disabled={secondsLeft === 0}
                className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setIsRunning(false); setSecondsLeft(question.suggestedMinutes * 60); }}
                className="flex items-center px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="answer" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Sua resposta
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={8}
              placeholder="Escreva sua resposta como se estivesse na prova — mostre o raciocínio, não só o resultado final."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center py-3 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Revelar gabarito comentado
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm leading-relaxed">
                <p className="font-semibold mb-2">Pontos esperados na resposta</p>
                <ul className="space-y-1.5">
                  {question.modelAnswer.map((m, i) => (
                    <li key={i} className="flex">
                      <span className="mr-2">•</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {!aiFeedback && (
                <div>
                  <button
                    onClick={fetchAiFeedback}
                    disabled={loadingFeedback || !answer.trim()}
                    className="w-full flex items-center justify-center py-2.5 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className={`w-4 h-4 mr-2 ${loadingFeedback ? 'animate-pulse' : ''}`} />
                    {loadingFeedback ? 'Corrigindo com IA...' : answer.trim() ? 'Corrigir minha resposta com IA' : 'Escreva sua resposta para pedir correção com IA'}
                  </button>
                  {feedbackError && <p className="text-xs text-rose-500 mt-2">{feedbackError}</p>}
                </div>
              )}

              {aiFeedback && (
                <div className="flex items-start p-4 rounded-xl text-sm leading-relaxed bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300">
                  <Sparkles className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <p>{aiFeedback}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Como você avalia sua resposta?</p>
                  {savedFlash && (
                    <p className="flex items-center text-xs text-emerald-500 font-medium">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Salvo
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {RATING_LABELS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => rate(r.value)}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        rating === r.value
                          ? r.classes
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIndex((i) => i + 1)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                Próxima questão
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
