import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RecommendationFactor, RecommendationFactorKind, RecommendationSnapshot } from '../../../types';
import { confidenceFromUncertainty, CONFIDENCE_LABEL } from '../../../lib/confidence';
import { Button } from '../../../components/ui/Button';
import { PrecisionMark } from '../../../components/ui/PrecisionMark';
import { cn } from '../../../lib/cn';
import { disclosurePanel } from '../../../design-system/motion/variants';
import { DECISION_FACTOR_LABELS } from './DecisionFactorField';

// A ranking model isn't the same thing as availability/allocation/
// interleaving (see efficiencyEngine.ts) — these factors only explain *why
// this topic ranked where it did*, not why it got the time slot it got.
const FACTOR_HELP: Record<RecommendationFactorKind, string> = {
  learning_gap: 'quanto falta para dominar esse tópico',
  review_urgency: 'quanto tempo passou desde a última revisão eficaz',
  recurring_errors: 'erros recentes e consecutivos nesse tópico',
  energy_adjustment: 'seu nível de energia informado hoje',
  exam_relevance: 'proximidade e incidência das provas que você priorizou',
};

export interface DecisionExplanationProps {
  mainReason: string;
  factors: RecommendationFactor[];
  snapshot: RecommendationSnapshot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisagree: () => void;
  className?: string;
}

export function DecisionExplanation({ mainReason, factors, snapshot, open, onOpenChange, onDisagree, className }: DecisionExplanationProps) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousOpen = useRef(open);
  const reducedMotion = useReducedMotion();
  const confidence = confidenceFromUncertainty(snapshot.uncertainty);

  useEffect(() => {
    if (previousOpen.current && !open) triggerRef.current?.focus();
    previousOpen.current = open;
  }, [open]);

  const ranked = [...factors].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const totalContribution = ranked.reduce((sum, factor) => sum + Math.abs(factor.contribution), 0);

  return (
    <div className={className}>
      <p className="text-sm text-text-secondary">{mainReason}</p>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-small px-1 -mx-1 min-h-9"
      >
        Por que isso?
        {open ? <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
      </button>

      <AnimatePresence initial={false}>
        {open && <motion.div
          id={panelId}
          role="region"
          aria-label="Fatores da recomendação"
          initial={reducedMotion ? false : 'collapsed'}
          animate={reducedMotion ? undefined : 'expanded'}
          exit={reducedMotion ? undefined : 'collapsed'}
          variants={reducedMotion ? undefined : disclosurePanel}
          className="overflow-hidden"
        >
        <div className="pt-3 space-y-4">
          {/* Explicação: os fatores que realmente pesaram, em ordem de peso. */}
          <div className="space-y-2.5">
            {ranked.map((factor) => {
              const widthPct = totalContribution > 0 ? (Math.abs(factor.contribution) / totalContribution) * 100 : 0;
              return (
                <div key={factor.kind}>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-medium text-text-primary">{DECISION_FACTOR_LABELS[factor.kind]}</span>
                    <span className="text-text-muted shrink-0 tabular-nums">
                      {FACTOR_HELP[factor.kind]} · {factor.contribution > 0 ? '+' : ''}{factor.contribution.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-strong overflow-hidden mt-1">
                    <div className="h-full rounded-full bg-action-primary" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-text-muted italic">
              Pesos de uma heurística inicial determinística — ainda não validados cientificamente.
            </p>
          </div>

          {/* Evidência: o snapshot exato usado para gerar esta recomendação. */}
          <PrecisionMark className="text-xs text-text-secondary border-t border-border-subtle pt-3">
            <p>
              Domínio estimado no momento do cálculo: <strong className="text-text-primary">{Math.round(snapshot.masteryLevel)}%</strong>
              {' '}({CONFIDENCE_LABEL[confidence]}).
            </p>
            {confidence === 'insufficient_data' && (
              <p className="mt-1">Ainda não há evidência suficiente para uma estimativa confiável neste tópico.</p>
            )}
            <p className="mt-1 text-text-muted">
              Calculado em {new Date(snapshot.calculatedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}.
            </p>
          </PrecisionMark>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Entendi
            </Button>
            <Button variant="ghost" size="sm" onClick={onDisagree}>
              Discordo
            </Button>
          </div>
        </div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
