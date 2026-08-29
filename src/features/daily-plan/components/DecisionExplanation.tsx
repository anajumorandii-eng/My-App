import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RecommendationFactor, RecommendationFactorKind, RecommendationSnapshot } from '../../../types';
import { confidenceFromUncertainty, CONFIDENCE_LABEL } from '../../../lib/confidence';
import { Button } from '../../../components/ui/Button';
import { PrecisionMark } from '../../../components/ui/PrecisionMark';
import { cn } from '../../../lib/cn';
import { disclosurePanel } from '../../../design-system/motion/variants';

const FACTOR_LABEL: Record<RecommendationFactorKind, string> = {
  learning_gap: 'Lacuna de aprendizagem',
  review_urgency: 'Urgência de revisão',
  recurring_errors: 'Erros recorrentes',
  energy_adjustment: 'Ajuste de energia',
  exam_relevance: 'Relevância para a prova',
};

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

const CONTRIBUTION_EPSILON = 0.01;

interface DecisionExplanationProps {
  mainReason: string;
  factors: RecommendationFactor[];
  snapshot: RecommendationSnapshot;
  onDisagree: () => void;
  className?: string;
}

export function DecisionExplanation({ mainReason, factors, snapshot, onDisagree, className }: DecisionExplanationProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reducedMotion = useReducedMotion();
  const confidence = confidenceFromUncertainty(snapshot.uncertainty);

  const ranked = [...factors].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const activeFactors = ranked.filter((f) => Math.abs(f.contribution) > CONTRIBUTION_EPSILON);
  const inactiveFactors = ranked.filter((f) => Math.abs(f.contribution) <= CONTRIBUTION_EPSILON);
  const totalActive = activeFactors.reduce((sum, f) => sum + Math.abs(f.contribution), 0);

  return (
    <div className={className}>
      <p className="text-sm text-text-secondary">{mainReason}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-small px-1 -mx-1 min-h-9"
      >
        Por que isso?
        {open ? <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
      </button>

      <motion.div
        id={panelId}
        initial={false}
        animate={open ? 'expanded' : 'collapsed'}
        variants={reducedMotion ? undefined : disclosurePanel}
        style={reducedMotion ? { height: open ? 'auto' : 0, opacity: open ? 1 : 0 } : undefined}
        className="overflow-hidden"
      >
        <div className="pt-3 space-y-4">
          {/* Explicação: os fatores que realmente pesaram, em ordem de peso. */}
          <div className="space-y-2.5">
            {activeFactors.map((factor) => {
              const widthPct = totalActive > 0 ? (Math.abs(factor.contribution) / totalActive) * 100 : 0;
              return (
                <div key={factor.kind}>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-medium text-text-primary">{FACTOR_LABEL[factor.kind]}</span>
                    <span className="text-text-muted shrink-0">{FACTOR_HELP[factor.kind]}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-strong overflow-hidden mt-1">
                    <div className="h-full rounded-full bg-action-primary" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
            {inactiveFactors.length > 0 && (
              <p className="text-xs text-text-muted">
                Sem efeito hoje: {inactiveFactors.map((f) => FACTOR_LABEL[f.kind]).join(', ')}.
              </p>
            )}
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
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Entendi
            </Button>
            <Button variant="ghost" size="sm" onClick={onDisagree}>
              Discordo
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
