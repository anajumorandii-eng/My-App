import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, CloudOff, Pause, PlayCircle, PlayCircle as StartIcon, RotateCcw } from 'lucide-react';
import { formatIsoTimeInSaoPaulo, todayInSaoPaulo } from '../features/availability/time';
import { useDailyPlan } from '../hooks/useDailyPlan';
import type { AllocatedStudyAction } from '../types';

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function allocatedDurationSeconds(action: AllocatedStudyAction | undefined): number {
  if (!action) return 0;
  const intervalSeconds = (new Date(action.intervalEnd).getTime() - new Date(action.intervalStart).getTime()) / 1000;
  if (!Number.isFinite(intervalSeconds) || intervalSeconds <= 0) return 0;
  return Math.max(0, Math.floor(Math.min(action.allocatedMinutes * 60, intervalSeconds)));
}

export default function Sessao() {
  const { availability, allocatedActions, isPersisted } = useDailyPlan(todayInSaoPaulo());
  const [selectedActionId, setSelectedActionId] = useState<string | null>(allocatedActions[0]?.id ?? null);
  const selectedAction = allocatedActions.find(({ id }) => id === selectedActionId);
  const [secondsLeft, setSecondsLeft] = useState(() => allocatedDurationSeconds(allocatedActions[0]));
  const [isRunning, setIsRunning] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (selectedActionId && allocatedActions.some(({ id }) => id === selectedActionId)) return;
    setSelectedActionId(allocatedActions[0]?.id ?? null);
  }, [allocatedActions, selectedActionId]);

  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(allocatedDurationSeconds(selectedAction));
  }, [selectedAction?.allocatedMinutes, selectedAction?.id, selectedAction?.intervalEnd, selectedAction?.intervalStart]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((previous) => {
          if (previous <= 1) {
            setIsRunning(false);
            if (selectedAction) setCompletedIds((ids) => [...new Set([...ids, selectedAction.id])]);
            return 0;
          }
          return previous - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, selectedAction]);

  const selectAction = (action: AllocatedStudyAction) => {
    setIsRunning(false);
    setSelectedActionId(action.id);
    setSecondsLeft(allocatedDurationSeconds(action));
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(allocatedDurationSeconds(selectedAction));
  };

  const markComplete = () => {
    setIsRunning(false);
    if (selectedAction) setCompletedIds((ids) => [...new Set([...ids, selectedAction.id])]);
  };

  const totalSeconds = allocatedDurationSeconds(selectedAction);
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const isDone = selectedAction ? completedIds.includes(selectedAction.id) : false;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <StartIcon className="w-7 h-7 mr-3 text-indigo-500" />
          Sessão de Estudo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Escolha um bloco do seu plano e execute com foco cronometrado.
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          Disponibilidade efetiva: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{availability?.totalMinutes ?? 0} min</span>
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em &quot;Conexões Google&quot; para salvar seu progresso de verdade.
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-500 px-2 mb-2">Blocos de hoje</h3>
          <div className="space-y-1">
            {allocatedActions.map((action) => (
              <button
                key={action.id}
                onClick={() => selectAction(action)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center justify-between ${
                  selectedAction?.id === action.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{action.topicName}</p>
                  <p className="text-xs text-zinc-500">
                    {formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)} · {action.allocatedMinutes} min · {action.subject}
                  </p>
                </div>
                {completedIds.includes(action.id) && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
              </button>
            ))}
            {allocatedActions.length === 0 && (
              <p className="text-sm text-zinc-500 px-3 py-4">Nenhum bloco planejado para hoje.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
          {selectedAction ? (
            <>
              <p className="text-sm font-medium text-zinc-500 mb-1 capitalize">{selectedAction.type.replace('_', ' ')} • {selectedAction.subject}</p>
              <h2 className="text-2xl font-bold mb-2">{selectedAction.topicName}</h2>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-8">
                {formatIsoTimeInSaoPaulo(selectedAction.intervalStart)}–{formatIsoTimeInSaoPaulo(selectedAction.intervalEnd)}
              </p>

              <div className="relative w-56 h-56 mb-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-zinc-100 dark:stroke-zinc-800" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-1000 ease-linear"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold tabular-nums">{formatTimer(secondsLeft)}</span>
                </div>
              </div>

              {isDone && (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium mb-4">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Bloco concluído
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRunning((running) => !running)}
                  disabled={secondsLeft === 0}
                  className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                >
                  {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <PlayCircle className="w-5 h-5 mr-2" />}
                  {isRunning ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                  onClick={resetTimer}
                  aria-label="Reiniciar cronômetro"
                  className="flex items-center px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={markComplete}
                  disabled={isDone}
                  className="flex items-center px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Concluir
                </button>
              </div>
            </>
          ) : (
            <p className="text-zinc-500">Selecione um bloco de estudo à esquerda para começar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
