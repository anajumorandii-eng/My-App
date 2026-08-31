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
import { getSubjectProfile } from '../design-system/crivoSubjects';
import SummaryReviewsPanel from '../components/SummaryReviewsPanel';

type SelfRating = 'fraco' | 'mediano' | 'forte';

const RATING_OPTIONS: { value: SelfRating; label: string; icon: typeof Frown; classes: string }[] = [
  { value: 'fraco', label: 'Esqueci', icon: Frown, classes: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50' },
  { value: 'mediano', label: 'Foi difícil', icon: Meh, classes: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50' },
  { value: 'forte', label: 'Lembrei fácil', icon: Smile, classes: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50' },
];

const SUBJECT_COLORS: Record<string, string> = {
  Biologia: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  Matemática: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
  Física: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  Química: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20',
  Geografia: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20',
  História: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
  Português: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20',
  Inglês: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20',
  Filosofia: 'text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-900/20',
  Sociologia: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
};

export default function Revisoes() {
  const { mastery: masteryState, updateMastery, isPersisted, syncError } = useUserMastery();
  const { progress: summaryProgress } = useSummaryProgress();
  const [tips, setTips] = useState<Record<string, string>>({});
  const [loadingTipFor, setLoadingTipFor] = useState<string | null>(null);

  const queue = useMemo(() => {
    return masteryState
      .map((mastery) => {
        const topic = mockTopics.find((t) => t.id === mastery.topicId);
        return { mastery, topic, urgency: urgencyOf(mastery) };
      })
      .filter((entry) => entry.topic)
      .sort((a, b) => b.urgency - a.urgency);
  }, [masteryState]);

  const pendingToday = queue.filter((entry) => entry.urgency > 50).length;

  // Repetição espaçada de verdade (SM-2 — ver spacedRepetition.ts): a
  // autoavaliação da lembrança decide o próximo intervalo, não um simples
  // "revisado" genérico — lembrar fácil adia bastante a próxima revisão,
  // lembrar com dificuldade adia pouco, e esquecer reseta o ciclo.
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

  const firstSubject = queue[0]?.topic?.subject;

  return (
    <SubjectAtmosphere subject={firstSubject} focus={0.35}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Repetição Espaçada SM-2 · Crivo</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
            <Repeat className="w-7 h-7 text-action-primary" />
            Revisões Adaptativas
          </h1>
          <p className="text-text-secondary mt-1 max-w-2xl text-base">
            O algoritmo SM-2 calcula o momento exato de revisar cada tópico antes que a curva do esquecimento apague o conteúdo.
          </p>
          {!isPersisted && (
            <p className="flex items-center text-xs text-text-muted mt-2">
              <CloudOff className="w-3.5 h-3.5 mr-1.5" />
              Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
            </p>
          )}
          {syncError && <p className="text-xs text-status-error mt-2">{syncError}</p>}
        </header>

        <SummaryReviewsPanel progress={summaryProgress} summaries={interactiveSummaries} />

        <div className="bg-surface-default border border-border-subtle rounded-2xl p-6 shadow-soft-sm flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${pendingToday > 0 ? 'bg-status-warning/15 text-status-warning' : 'bg-status-success/15 text-status-success'}`}>
            {pendingToday > 0 ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-text-primary">{pendingToday}</p>
            <p className="text-xs font-mono uppercase tracking-wider text-text-muted">
              {pendingToday > 0 ? 'revisões urgentes pendentes hoje' : 'nenhuma revisão urgente — retenção em dia'}
            </p>
          </div>
        </div>

      <div className="space-y-3">
        {queue.map(({ mastery, topic, urgency }) => {
          const tip = tips[mastery.topicId];
          const isLoadingTip = loadingTipFor === mastery.topicId;
          return (
            <div
              key={mastery.topicId}
              data-geometry={topic ? getSubjectProfile(topic.subject).fieldType : undefined}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-4 shrink-0 ${SUBJECT_COLORS[topic!.subject] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    {topic!.subject}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-semibold truncate">{topic!.name}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Domínio: {mastery.level}% • Última revisão: {new Date(mastery.lastReviewed).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center shrink-0 ml-4 gap-4">
                  <div className="hidden sm:flex items-center w-24">
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mr-2">
                      <div
                        className={`h-full ${urgency > 70 ? 'bg-rose-500' : urgency > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${urgency}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 w-8 text-right">{Math.round(urgency)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">Sem olhar o material: você lembrou desse tópico agora?</p>
                <div className="flex gap-2">
                  {RATING_OPTIONS.map(({ value, label, icon: Icon, classes }) => (
                    <button
                      key={value}
                      onClick={() => rateReview(mastery.topicId, value)}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${classes}`}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {!tip && (
                <button
                  onClick={() => fetchTip(mastery, topic!.name, topic!.subject)}
                  disabled={isLoadingTip}
                  className="mt-4 flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isLoadingTip ? 'animate-pulse' : ''}`} />
                  {isLoadingTip ? 'Gerando dica...' : 'Dica rápida com IA'}
                </button>
              )}

              {tip && (
                <div className="flex items-start mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm">
                  <Sparkles className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <AiText text={tip} className="flex-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </SubjectAtmosphere>
  );
}
