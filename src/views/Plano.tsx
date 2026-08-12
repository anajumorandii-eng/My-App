import React, { useMemo, useState } from 'react';
import { EfficiencyEngine } from '../lib/efficiencyEngine';
import { mockTopics, mockProfile } from '../data/mockData';
import { useUserMastery } from '../hooks/useUserMastery';
import { useAvailableMinutes } from '../hooks/useAvailableMinutes';
import { Map, Clock, Battery, BatteryLow, BatteryFull, CloudOff, CalendarCheck2 } from 'lucide-react';

const SUBJECT_COLORS: Record<string, string> = {
  Biologia: 'bg-emerald-500',
  Matemática: 'bg-indigo-500',
  Física: 'bg-amber-500',
};

export default function Plano() {
  const { mastery, isPersisted, syncError } = useUserMastery();
  const {
    minutes: minutesToday,
    usingAuto,
    autoMode,
    setAutoMode,
    manualMinutes,
    setManualMinutes,
    isConnected: calendarConnected,
    loading: calendarLoading,
    error: calendarError,
    busyCount,
  } = useAvailableMinutes();
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>(mockProfile.currentEnergyLevel);

  const profile = useMemo(() => ({ ...mockProfile, currentEnergyLevel: energyLevel }), [energyLevel]);

  const dailyPlan = useMemo(
    () => EfficiencyEngine.generateDailyPlan(mastery, mockTopics, profile, minutesToday),
    [mastery, profile, minutesToday]
  );

  const plannedTopicIds = new Set(dailyPlan.map((a) => a.topicId));
  const backlog = mockTopics
    .map((topic) => ({ topic, mastery: mastery.find((m) => m.topicId === topic.id) }))
    .filter((entry) => entry.mastery && !plannedTopicIds.has(entry.topic.id))
    .sort((a, b) => (a.mastery?.level ?? 0) - (b.mastery?.level ?? 0));

  const totalPlannedMinutes = dailyPlan.reduce((sum, a) => sum + a.estimatedMinutes, 0);

  const energyOptions: { value: 'low' | 'medium' | 'high'; label: string; icon: React.ElementType }[] = [
    { value: 'low', label: 'Baixa', icon: BatteryLow },
    { value: 'medium', label: 'Média', icon: Battery },
    { value: 'high', label: 'Alta', icon: BatteryFull },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Map className="w-7 h-7 mr-3 text-indigo-500" />
          Plano de Estudo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Ajuste seu tempo e energia disponíveis para ver o plano se recalcular na hora.
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
        {calendarConnected && (
          <div className="flex items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center min-w-0">
              <CalendarCheck2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium">Calcular pela agenda do Google</p>
                <p className="text-xs text-zinc-500 truncate">
                  {calendarLoading
                    ? 'Carregando sua agenda...'
                    : calendarError
                    ? calendarError
                    : `${busyCount} compromisso${busyCount === 1 ? '' : 's'} hoje até as 22h`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoMode((v) => !v)}
              disabled={calendarLoading || !!calendarError}
              aria-label="Alternar cálculo automático pela agenda"
              className={`relative w-11 h-6 rounded-full shrink-0 ml-4 transition-colors disabled:opacity-40 ${
                autoMode ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoMode ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="minutes" className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300">
              <Clock className="w-4 h-4 mr-2 text-zinc-400" />
              Minutos disponíveis hoje
              {usingAuto && <span className="ml-2 text-xs font-normal text-indigo-500">(via agenda)</span>}
            </label>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{minutesToday} min</span>
          </div>
          <input
            id="minutes"
            type="range"
            min={15}
            max={240}
            step={15}
            value={usingAuto ? minutesToday : manualMinutes}
            disabled={usingAuto}
            onChange={(e) => setManualMinutes(Number(e.target.value))}
            className={`w-full accent-indigo-600 ${usingAuto ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {usingAuto && (
            <p className="text-xs text-zinc-500 mt-2">
              Calculado a partir do seu tempo livre entre agora e 22h, descontando os compromissos da sua agenda.
            </p>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nível de energia hoje</p>
          <div className="flex gap-2">
            {energyOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setEnergyLevel(value)}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  energyLevel === value
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Plano de Hoje</h2>
          <span className="text-sm text-zinc-500">
            {totalPlannedMinutes} de {minutesToday} min ocupados
          </span>
        </div>

        <div className="space-y-3">
          {dailyPlan.map((action, index) => (
            <div
              key={action.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center min-w-0">
                <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-4 shrink-0 text-zinc-500 font-medium text-sm">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold truncate">{action.topicName}</h4>
                  <div className="flex items-center text-sm text-zinc-500 mt-1 space-x-3">
                    <span className="capitalize">{action.type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{action.subject}</span>
                  </div>
                </div>
              </div>
              <span className="shrink-0 ml-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {action.estimatedMinutes} min
              </span>
            </div>
          ))}

          {dailyPlan.length === 0 && (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500">Nenhum tópico coube no tempo disponível. Aumente os minutos acima.</p>
            </div>
          )}
        </div>
      </section>

      {backlog.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Fila de Espera</h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
            {backlog.map(({ topic, mastery }) => (
              <div key={topic.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <span className={`w-2 h-2 rounded-full mr-3 shrink-0 ${SUBJECT_COLORS[topic.subject] ?? 'bg-zinc-400'}`} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{topic.name}</p>
                    <p className="text-xs text-zinc-500">{topic.subject}</p>
                  </div>
                </div>
                <div className="flex items-center shrink-0 ml-4 w-32">
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mr-2">
                    <div
                      className={`h-full ${SUBJECT_COLORS[topic.subject] ?? 'bg-zinc-400'}`}
                      style={{ width: `${mastery?.level ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-8 text-right">{mastery?.level ?? 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
