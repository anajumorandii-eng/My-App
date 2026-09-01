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
import SummaryProgressDashboard from '../components/SummaryProgressDashboard';
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

const EVO_PALETTE = PALETTES.Matemática;

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 shadow-lg text-xs text-[var(--text)]">
      <p className="font-semibold">{item.name || item.subject}</p>
      <p className="text-[var(--dim)]">{Math.round(item.level ?? item.average)}% de domínio</p>
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
    <div
      className="ni-main"
      style={{
        '--primary': EVO_PALETTE.primary,
        '--secondary': EVO_PALETTE.secondary,
        '--wash': EVO_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>ANÁLISE</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <TrendingUp className="w-3 h-3" />
          </span>
          TELEMETRIA
        </span>
        <i />
        <b>EVOLUÇÃO & DOMÍNIO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Veja seu domínio crescer em tempo real.</h1>
          <p>Métricas de consistência, velocidade e domínio por matéria conectadas ao motor de eficiência.</p>
        </div>
        <div className="ni-state">
          <i /> domínio geral: {overallAverage}% · Crivo Telemetria
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-center text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5" />
          Sem dados de domínio sincronizados — conecte sua conta Google para acompanhar esse histórico.
        </p>
      )}

      <SummaryProgressDashboard model={summaryDashboard} loading={summaryLoading} error={summaryError} />

      {isPersisted ? (
        <>
          {/* AI Diagnostic Panel */}
          <Panel subject="Matemática" className="ni-panel p-6 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
              <h3 className="font-display font-medium text-base text-[var(--text)] flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-[var(--primary)]" />
                Diagnóstico com IA
              </h3>
              {!insight && (
                <button
                  onClick={fetchInsight}
                  disabled={loadingInsight}
                  className="flex items-center px-3 py-1.5 text-xs font-semibold text-[var(--primary)] border border-[var(--line)] rounded-lg hover:bg-[var(--surface2)] disabled:opacity-50 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingInsight ? 'animate-pulse' : ''}`} />
                  {loadingInsight ? 'Analisando...' : 'Gerar diagnóstico'}
                </button>
              )}
            </div>
            {insight ? (
              <div className="mt-3 p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)]">
                <AiText text={insight} className="leading-relaxed" />
              </div>
            ) : (
              <p className="text-xs text-[var(--dim)] mt-1">
                Peça uma análise personalizada do seu progresso e das suas prioridades para os próximos dias.
              </p>
            )}
          </Panel>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Panel subject="Matemática" interactive className="ni-panel p-5">
              <div className="flex items-center text-[var(--primary)] mb-2">
                <Gauge className="w-4 h-4 mr-2" />
                <h3 className="font-medium text-xs text-[var(--dim)]">Domínio médio geral</h3>
              </div>
              <p className="text-2xl font-bold font-mono text-[var(--text)]">
                {overallAverage}
                <span className="text-sm font-normal text-[var(--dim)] ml-1">/100</span>
              </p>
            </Panel>

            <Panel subject="Biologia" interactive className="ni-panel p-5">
              <div className="flex items-center text-[#86dca5] mb-2">
                <Trophy className="w-4 h-4 mr-2" />
                <h3 className="font-medium text-xs text-[var(--dim)]">Tópico mais forte</h3>
              </div>
              <p className="text-base font-display font-semibold truncate text-[var(--text)]">{strongest?.name}</p>
              <p className="text-xs font-mono text-[#86dca5] mt-0.5">{strongest?.level}% de domínio</p>
            </Panel>

            <Panel subject="História" interactive className="ni-panel p-5">
              <div className="flex items-center text-[#e08391] mb-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                <h3 className="font-medium text-xs text-[var(--dim)]">Precisa de atenção</h3>
              </div>
              <p className="text-base font-display font-semibold truncate text-[var(--text)]">{weakest?.name}</p>
              <p className="text-xs font-mono text-[#e08391] mt-0.5">{weakest?.level}% de domínio</p>
            </Panel>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <Panel subject="Matemática" className="ni-panel lg:col-span-3 p-5">
              <h3 className="font-display font-medium text-sm text-[var(--text)] mb-3">Domínio por tópico</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicRows} layout="vertical" margin={{ left: 4, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--line)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-[var(--dim)]" />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-[var(--dim)]" />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="level" radius={[0, 4, 4, 0]} barSize={14}>
                      {topicRows.map((row, i) => {
                        const pal = PALETTES[row.subject] ?? PALETTES.Matemática;
                        return <Cell key={i} fill={pal.primary} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel subject="Física" className="ni-panel lg:col-span-2 p-5">
              <h3 className="font-display font-medium text-sm text-[var(--text)] mb-3">Média por matéria</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={subjectAverages}>
                    <PolarGrid stroke="var(--line)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-[var(--dim)]" />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="average" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          {/* Topics List Panel */}
          <Panel subject="Matemática" className="ni-panel divide-y divide-[var(--line)] overflow-hidden">
            {topicRows.map((row) => {
              const isExpanded = expandedTopicId === row.topicId;
              const hasChapters = !!row.chapters?.length;
              const pal = PALETTES[row.subject] ?? PALETTES.Matemática;
              const SubIcon = SUBJECT_ICONS[row.subject] ?? TrendingUp;

              return (
                <div key={row.topicId}>
                  <button
                    onClick={() => hasChapters && setExpandedTopicId(isExpanded ? null : row.topicId)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--surface2)] transition-colors"
                  >
                    <div className="flex items-center min-w-0">
                      <span
                        className="w-5 h-5 rounded-full mr-3 shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: pal.primary, color: pal.wash }}
                      >
                        <SubIcon className="w-3 h-3" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-xs text-[var(--text)] truncate">{row.name}</p>
                        <p className="text-[11px] text-[var(--dim)]">
                          {row.subject}
                          {hasChapters && ` • ${row.chapters!.length} capítulos`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center shrink-0 ml-4">
                      <div className="w-28 flex items-center">
                        <div className="w-full h-1.5 bg-[var(--surface2)] rounded-full overflow-hidden mr-2">
                          <div className="h-full rounded-full" style={{ width: `${row.level}%`, backgroundColor: pal.primary }} />
                        </div>
                        <span className="text-[11px] font-mono text-[var(--dim)] w-8 text-right">{row.level}%</span>
                      </div>
                      {hasChapters && (
                        <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </button>
                  {isExpanded && hasChapters && (
                    <div className="px-4 pb-4 pl-12 bg-[var(--surface2)]/50">
                      <ol className="text-xs text-[var(--dim)] space-y-1 list-decimal list-inside">
                        {row.chapters!.map((chapter) => (
                          <li key={chapter}>{chapter}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </Panel>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] p-6 text-xs text-[var(--dim)] text-center">
          O domínio por tópicos aparecerá quando houver dados sincronizados.
        </div>
      )}
    </div>
  );
}
