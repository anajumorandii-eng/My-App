import React, { useMemo } from 'react';
import { EfficiencyEngine } from '../lib/efficiencyEngine';
import { mockTopics, mockProfile } from '../data/mockData';
import { useUserMastery } from '../hooks/useUserMastery';
import { PlayCircle, Target, Brain, AlertCircle, CloudOff } from 'lucide-react';

export default function Dashboard() {
  const { mastery, isPersisted } = useUserMastery();

  const dailyPlan = useMemo(() => {
    // Determine plan for 120 minutes of study today
    return EfficiencyEngine.generateDailyPlan(mastery, mockTopics, mockProfile, 120);
  }, [mastery]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Hoje</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Seu foco para hoje, ordenado por prioridade de impacto.
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-4">
            <Target className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Tempo de Estudo</h3>
          </div>
          <p className="text-3xl font-bold">120<span className="text-lg font-normal text-zinc-500 ml-1">min</span></p>
          <p className="text-sm text-zinc-500 mt-1">Meta diária ajustada à energia (Média)</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-4">
            <Brain className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Autonomia</h3>
          </div>
          <p className="text-3xl font-bold">{mockProfile.autonomyIndex}<span className="text-lg font-normal text-zinc-500 ml-1">/100</span></p>
          <p className="text-sm text-zinc-500 mt-1">Crescimento lento e sustentável.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-rose-600 dark:text-rose-400 mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Prioridade Máxima</h3>
          </div>
          <p className="text-xl font-bold truncate">{dailyPlan.length > 0 ? dailyPlan[0].topicName : 'Tudo em dia'}</p>
          <p className="text-sm text-zinc-500 mt-1">Revisão e Prática</p>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Ações Recomendadas</h2>
        <div className="space-y-4">
          {dailyPlan.map((action, index) => (
            <div 
              key={action.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-4 text-zinc-500 font-medium">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{action.topicName}</h4>
                  <div className="flex items-center text-sm text-zinc-500 mt-1 space-x-3">
                    <span className="capitalize">{action.type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{action.subject}</span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{action.estimatedMinutes} min</span>
                  </div>
                </div>
              </div>
              <button className="hidden sm:flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-4 h-4 mr-2" />
                Iniciar
              </button>
            </div>
          ))}

          {dailyPlan.length === 0 && (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500">Sem metas para hoje. Descanse.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
