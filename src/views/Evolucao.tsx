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
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildSummaryProgressDashboard } from '../lib/summaryProgressDashboard';
import { getSubjectProfile } from '../design-system/crivoSubjects';
import { getMotionConfigForSubject } from '../design-system/crivoMotionPresets';
import { motion } from 'motion/react';
import SummaryProgressDashboard from '../components/SummaryProgressDashboard';

const getSubjectColor = (subject: string) => getSubjectProfile(subject).palettes.dark.primary;

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
  const { progress: summaryProgress, loading: summaryLoading, syncError: summaryError } = useSummaryProgress();
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const summaryDashboard = useMemo(
    () => buildSummaryProgressDashboard({ summaries: interactiveSummaries, progress: summaryProgress }),
    [summaryProgress],
  );

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
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Telemetria & Curvas de Domínio · Crivo</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-action-primary" />
          Evolução & Domínio
        </h1>
        <p className="text-text-secondary mt-1 max-w-2xl text-base">Acompanhe seu domínio consolidado por tópico, matéria e projeção para o vestibular.</p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-text-muted mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Sem dados de domínio sincronizados — conecte sua conta Google para acompanhar esse histórico.
          </p>
        )}
      </header>

      <SummaryProgressDashboard model={summaryDashboard} loading={summaryLoading} error={summaryError} />

      {isPersisted ? <>
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
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-surface-default border border-border-subtle rounded-2xl p-6 shadow-soft-sm"
        >
          <div className="flex items-center text-action-primary mb-3">
            <Gauge className="w-5 h-5 mr-2" />
            <h3 className="font-medium text-sm">Domínio médio geral</h3>
          </div>
          <p className="text-3xl font-bold font-mono">{overallAverage}<span className="text-lg font-normal text-text-muted ml-1">/100</span></p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-surface-default border border-border-subtle rounded-2xl p-6 shadow-soft-sm"
        >
          <div className="flex items-center text-status-success mb-3">
            <Trophy className="w-5 h-5 mr-2" />
            <h3 className="font-medium text-sm">Tópico mais forte</h3>
          </div>
          <p className="text-lg font-bold truncate text-text-primary">{strongest?.name}</p>
          <p className="text-sm font-mono text-text-muted">{strongest?.level}% de domínio</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-surface-default border border-border-subtle rounded-2xl p-6 shadow-soft-sm"
        >
          <div className="flex items-center text-status-error mb-3">
            <AlertCircle className="w-5 h-5 mr-2" />
            <h3 className="font-medium text-sm">Precisa de mais atenção</h3>
          </div>
          <p className="text-lg font-bold truncate text-text-primary">{weakest?.name}</p>
          <p className="text-sm font-mono text-text-muted">{weakest?.level}% de domínio</p>
        </motion.div>
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
                    <Cell key={i} fill={getSubjectColor(row.subject)} />
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
                <Radar dataKey="average" stroke="var(--action-primary, #6366f1)" fill="var(--action-primary, #6366f1)" fillOpacity={0.35} />
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
          const color = getSubjectColor(row.subject);
          return (
            <div key={row.topicId}>
              <button
                onClick={() => hasChapters && setExpandedTopicId(isExpanded ? null : row.topicId)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center min-w-0">
                  <span className="w-2 h-2 rounded-full mr-3 shrink-0" style={{ backgroundColor: color }} />
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
                      <div className="h-full" style={{ width: `${row.level}%`, backgroundColor: color }} />
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
      </> : <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">O domínio por tópicos aparecerá quando houver dados sincronizados. Nenhum valor demonstrativo é usado neste painel.</div>}
    </div>
  );
}
