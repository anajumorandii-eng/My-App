import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { mockTopics } from '../data/mockData';
import { useUserMastery } from '../hooks/useUserMastery';
import { requestAiText } from '../lib/aiClient';
import { AiText } from '../components/AiText';
import { TrendingUp, Trophy, AlertCircle, Gauge, CloudOff, Sparkles, ChevronDown } from 'lucide-react';

const SUBJECT_HEX: Record<string, string> = {
  Biologia: '#10b981',
  Matemática: '#6366f1',
  Física: '#f59e0b',
  Química: '#f43f5e',
  Geografia: '#14b8a6',
  História: '#f97316',
  Português: '#8b5cf6',
  Inglês: '#0ea5e9',
};

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold">{item.name || item.subject}</p>
      <p className="text-zinc-500">{Math.round(item.level ?? item.average)}% de domínio</p>
    </div>
  );
}

export default function Evolucao() {
  const { mastery: masteryData, isPersisted } = useUserMastery();
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const topicRows = useMemo(
    () =>
      mockTopics
        .map((topic) => {
          const mastery = masteryData.find((m) => m.topicId === topic.id);
          return {
            topicId: topic.id,
            name: topic.name,
            subject: topic.subject,
            level: mastery?.level ?? 0,
            chapters: topic.chapters,
          };
        })
        .sort((a, b) => b.level - a.level),
    [masteryData]
  );

  const subjectAverages = useMemo(() => {
    const bySubject = new Map<string, number[]>();
    topicRows.forEach((row) => {
      const list = bySubject.get(row.subject) ?? [];
      list.push(row.level);
      bySubject.set(row.subject, list);
    });
    return Array.from(bySubject.entries()).map(([subject, levels]) => ({
      subject,
      average: levels.reduce((a, b) => a + b, 0) / levels.length,
    }));
  }, [topicRows]);

  const overallAverage = Math.round(topicRows.reduce((sum, r) => sum + r.level, 0) / topicRows.length);
  const strongest = topicRows[0];
  const weakest = topicRows[topicRows.length - 1];

  const fetchInsight = async () => {
    if (!strongest || !weakest) return;
    setLoadingInsight(true);
    try {
      const data = await requestAiText('progress-insight', {
        topics: topicRows.map((r) => ({ name: r.name, subject: r.subject, level: r.level })),
        overallAverage,
        strongest: strongest.name,
        weakest: weakest.name,
      });
      setInsight(data.text);
    } catch (error) {
      console.error('Failed to fetch progress insight:', error);
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-indigo-500" />
          Evolução & Domínio
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">Seu domínio atual por tópico e por matéria.</p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
          <h3 className="font-semibold flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
            Diagnóstico com IA
          </h3>
          {!insight && (
            <button
              onClick={fetchInsight}
              disabled={loadingInsight}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-colors"
            >
              <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingInsight ? 'animate-pulse' : ''}`} />
              {loadingInsight ? 'Analisando...' : 'Gerar diagnóstico'}
            </button>
          )}
        </div>
        {insight ? (
          <AiText text={insight} className="text-sm text-zinc-600 dark:text-zinc-300 mt-3" />
        ) : (
          <p className="text-sm text-zinc-500 mt-1">
            Peça uma análise personalizada do seu progresso e das suas prioridades para os próximos dias.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-3">
            <Gauge className="w-5 h-5 mr-2" />
            <h3 className="font-medium text-sm">Domínio médio geral</h3>
          </div>
          <p className="text-3xl font-bold">{overallAverage}<span className="text-lg font-normal text-zinc-500 ml-1">/100</span></p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-3">
            <Trophy className="w-5 h-5 mr-2" />
            <h3 className="font-medium text-sm">Tópico mais forte</h3>
          </div>
          <p className="text-lg font-bold truncate">{strongest?.name}</p>
          <p className="text-sm text-zinc-500">{strongest?.level}% de domínio</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-rose-600 dark:text-rose-400 mb-3">
            <AlertCircle className="w-5 h-5 mr-2" />
            <h3 className="font-medium text-sm">Precisa de mais atenção</h3>
          </div>
          <p className="text-lg font-bold truncate">{weakest?.name}</p>
          <p className="text-sm text-zinc-500">{weakest?.level}% de domínio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Domínio por tópico</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicRows} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-zinc-100 dark:stroke-zinc-800" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-zinc-400" />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-zinc-500" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                <Bar dataKey="level" radius={[0, 6, 6, 0]} barSize={18}>
                  {topicRows.map((row, i) => (
                    <Cell key={i} fill={SUBJECT_HEX[row.subject] ?? '#a1a1aa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Média por matéria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={subjectAverages}>
                <PolarGrid className="stroke-zinc-200 dark:stroke-zinc-800" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-zinc-500" />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="average" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
        {topicRows.map((row) => {
          const isExpanded = expandedTopicId === row.topicId;
          const hasChapters = !!row.chapters?.length;
          return (
            <div key={row.topicId}>
              <button
                onClick={() => hasChapters && setExpandedTopicId(isExpanded ? null : row.topicId)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center min-w-0">
                  <span className="w-2 h-2 rounded-full mr-3 shrink-0" style={{ backgroundColor: SUBJECT_HEX[row.subject] ?? '#a1a1aa' }} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{row.name}</p>
                    <p className="text-xs text-zinc-500">
                      {row.subject}
                      {hasChapters && ` • ${row.chapters!.length} capítulos da apostila`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center shrink-0 ml-4">
                  <div className="w-32 flex items-center">
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mr-2">
                      <div className="h-full" style={{ width: `${row.level}%`, backgroundColor: SUBJECT_HEX[row.subject] ?? '#a1a1aa' }} />
                    </div>
                    <span className="text-xs text-zinc-500 w-8 text-right">{row.level}%</span>
                  </div>
                  {hasChapters && (
                    <ChevronDown className={`w-4 h-4 text-zinc-400 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </button>
              {isExpanded && hasChapters && (
                <div className="px-4 pb-4 pl-8">
                  <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-decimal list-inside">
                    {row.chapters!.map((chapter) => (
                      <li key={chapter}>{chapter}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
