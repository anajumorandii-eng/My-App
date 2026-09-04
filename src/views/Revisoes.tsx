import React, { useMemo, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { TopicMastery } from '../types';
import { useUserMastery } from '../hooks/useUserMastery';
import { requestAiText } from '../lib/aiClient';
import { AiText } from '../components/AiText';
import { urgencyOf } from '../lib/reviewUrgency';
import { applyReviewOutcome, qualityFromSelfRating } from '../lib/spacedRepetition';
import { Repeat, CheckCircle2, AlertTriangle, CloudOff, Sparkles, Frown, Meh, Smile } from 'lucide-react';
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { interactiveSummaries } from '../data/interactiveSummaries';
import SummaryReviewsPanel from '../components/SummaryReviewsPanel';
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

type SelfRating = 'fraco' | 'mediano' | 'forte';

const RATING_OPTIONS: { value: SelfRating; label: string; icon: typeof Frown }[] = [
  { value: 'fraco', label: 'Esqueci', icon: Frown },
  { value: 'mediano', label: 'Foi difícil', icon: Meh },
  { value: 'forte', label: 'Lembrei fácil', icon: Smile },
];

export default function Revisoes() {
  const { mastery: masteryState, updateMastery, isPersisted, syncError } = useUserMastery();
  const { progress: summaryProgress } = useSummaryProgress();
  const [tips, setTips] = useState<Record<string, string>>({});
  const [loadingTipFor, setLoadingTipFor] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState('Todas');

  const queue = useMemo(() => {
    return masteryState
      .map((mastery) => {
        const topic = mockTopics.find((t) => t.id === mastery.topicId);
        return { mastery, topic, urgency: urgencyOf(mastery) };
      })
      .filter((entry) => entry.topic)
      .sort((a, b) => b.urgency - a.urgency);
  }, [masteryState]);

  const subjects = useMemo(() => {
    const subs = new Set<string>();
    queue.forEach((q) => {
      if (q.topic?.subject) subs.add(q.topic.subject);
    });
    return ['Todas', ...Array.from(subs)];
  }, [queue]);

  const filteredQueue = useMemo(() => {
    if (subjectFilter === 'Todas') return queue;
    return queue.filter((q) => q.topic?.subject === subjectFilter);
  }, [queue, subjectFilter]);

  const pendingToday = queue.filter((entry) => entry.urgency > 50).length;

  const rateReview = (topicId: string, rating: SelfRating) => {
    updateMastery((prev: TopicMastery[]) =>
      prev.map((m) => (m.topicId === topicId ? { ...m, ...applyReviewOutcome(m, qualityFromSelfRating(rating)) } : m))
    );
  };

  const fetchTip = async (mastery: TopicMastery, topicName: string, subject: string) => {
    setLoadingTipFor(mastery.topicId);
    try {
      const daysSinceReview = Math.round((Date.now() - new Date(mastery.lastReviewed).getTime()) / 86400000);
      const data = await requestAiText('review-tip', { topic: topicName, subject, level: mastery.level, daysSinceReview });
      setTips((prev) => ({ ...prev, [mastery.topicId]: data.text }));
    } catch (error) {
      console.error('Failed to fetch review tip:', error);
    } finally {
      setLoadingTipFor(null);
    }
  };

  const currentPalette = PALETTES[subjectFilter] ?? PALETTES.Matemática;
  const FirstIcon = SUBJECT_ICONS[queue[0]?.topic?.subject ?? 'Matemática'] ?? Repeat;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>PRACTICE</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <FirstIcon className="w-3 h-3" />
          </span>
          REPETIÇÃO ESPAÇADA
        </span>
        <i />
        <b>REVISÕES ADAPTATIVAS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Revise antes que o prazo vença.</h1>
          <p>O algoritmo SM-2 calcula o momento exato de revisar cada tópico para blindar a retenção.</p>
        </div>
        <div className="ni-state">
          <i /> {pendingToday > 0 ? `${pendingToday} revisões urgentes hoje` : 'retenção em dia'}
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google em "Perfil" para sincronização em nuvem.
        </p>
      )}
      {syncError && <p className="text-xs text-rose-500 mb-2">{syncError}</p>}

      {/* Subject Filter Bar */}
      <div className="ni-subjects">
        {subjects.map((subj) => {
          const active = subjectFilter === subj;
          const Icon = SUBJECT_ICONS[subj] ?? Repeat;
          const subPalette = PALETTES[subj] ?? PALETTES.Matemática;
          return (
            <button
              key={subj}
              onClick={() => setSubjectFilter(subj)}
              style={
                active
                  ? { backgroundColor: subPalette.primary, color: subPalette.wash, display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '4px', padding: '2px 8px' }
                  : { display: 'inline-flex', alignItems: 'center', gap: '6px' }
              }
            >
              {subj !== 'Todas' && <Icon className="w-3 h-3" style={{ color: active ? subPalette.wash : subPalette.primary }} />}
              <span>{subj}</span>
            </button>
          );
        })}
      </div>

      <SummaryReviewsPanel progress={summaryProgress} summaries={interactiveSummaries} />

      {/* Metric summary panel */}
      <Panel subject="Matemática" className="ni-panel p-5 flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: pendingToday > 0 ? 'rgba(239, 191, 97, 0.2)' : 'rgba(134, 220, 165, 0.2)',
            color: pendingToday > 0 ? '#efbf61' : '#86dca5',
          }}
        >
          {pendingToday > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-xl font-display font-bold text-[var(--text)]">{pendingToday}</p>
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--dim)]">
            {pendingToday > 0 ? 'revisões com alta urgência' : 'nenhuma revisão urgente pendente'}
          </p>
        </div>
      </Panel>

      {/* Reviews queue */}
      <div className="space-y-3 mt-4">
        {filteredQueue.map(({ mastery, topic, urgency }) => {
          const tip = tips[mastery.topicId];
          const isLoadingTip = loadingTipFor === mastery.topicId;
          const subPalette = PALETTES[topic!.subject] ?? PALETTES.Matemática;
          const SubjIcon = SUBJECT_ICONS[topic!.subject] ?? Repeat;

          return (
            <Panel
              key={mastery.topicId}
              subject={topic!.subject}
              interactive
              className="ni-panel p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <span
                    className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full mr-3 shrink-0 flex items-center gap-1.5"
                    style={{ backgroundColor: subPalette.primary, color: subPalette.wash }}
                  >
                    <SubjIcon className="w-3 h-3" />
                    {topic!.subject}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display font-medium text-base text-[var(--text)] truncate">{topic!.name}</h4>
                    <p className="text-xs text-[var(--dim)] mt-0.5">
                      Domínio: <b className="text-[var(--text)]">{mastery.level}%</b> • Última revisão: {new Date(mastery.lastReviewed).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center shrink-0 ml-4 gap-3">
                  <div className="hidden sm:flex items-center w-28">
                    <div className="w-full h-1.5 bg-[var(--surface2)] rounded-full overflow-hidden mr-2">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${urgency}%`,
                          backgroundColor: urgency > 70 ? '#e08391' : urgency > 40 ? '#efbf61' : '#86dca5',
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[var(--dim)] w-8 text-right">{Math.round(urgency)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--line)]">
                <p className="text-xs text-[var(--dim)] mb-2">Sem consultar o resumo: você recuperou esse conceito agora?</p>
                <div className="grid grid-cols-3 gap-2">
                  {RATING_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => rateReview(mastery.topicId, value)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium border border-[var(--line)] bg-[var(--surface2)] hover:border-[var(--primary)] text-[var(--text)] transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 mr-1.5 text-[var(--primary)]" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {!tip && (
                <button
                  onClick={() => fetchTip(mastery, topic!.name, topic!.subject)}
                  disabled={isLoadingTip}
                  className="mt-3 inline-flex items-center px-3 py-1 text-xs font-medium text-[var(--primary)] border border-[var(--line)] rounded-lg hover:bg-[var(--surface2)] disabled:opacity-50 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isLoadingTip ? 'animate-pulse' : ''}`} />
                  {isLoadingTip ? 'Gerando dica...' : 'Dica rápida com IA'}
                </button>
              )}

              {tip && (
                <div className="mt-3 p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)]">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                    <AiText text={tip} className="flex-1" />
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
