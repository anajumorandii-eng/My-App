import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { RecommendationFactor, RecommendationFactorKind } from '../../../types';
import { factorDecompose } from '../../../design-system/motion/variants';
import type { DecisionVisualPhase } from '../motion/useDecisionChoreography';

export const DECISION_FACTOR_LABELS: Record<RecommendationFactorKind, string> = {
  learning_gap: 'Lacuna de aprendizagem',
  review_urgency: 'Urgência de revisão',
  recurring_errors: 'Erros recorrentes',
  energy_adjustment: 'Ajuste de energia',
  exam_relevance: 'Relevância para a prova',
};

const FACTOR_POSITION: Record<RecommendationFactorKind, { className: string; offset: { x: number; y: number } }> = {
  learning_gap: { className: 'left-[1%] top-[14%]', offset: { x: -14, y: -10 } },
  review_urgency: { className: 'right-[1%] top-[14%]', offset: { x: 14, y: -10 } },
  recurring_errors: { className: 'left-[1%] bottom-[16%]', offset: { x: -16, y: 10 } },
  energy_adjustment: { className: 'left-[34%] bottom-[1%]', offset: { x: 0, y: 14 } },
  exam_relevance: { className: 'right-[1%] bottom-[16%]', offset: { x: 16, y: 10 } },
};

interface DecisionFactorFieldProps {
  factors: RecommendationFactor[];
  phase: DecisionVisualPhase;
}

function formatContribution(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

export function DecisionFactorField({ factors, phase }: DecisionFactorFieldProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <AnimatePresence initial={false}>
        {phase === 'decomposed' && factors.map((factor) => {
          const position = FACTOR_POSITION[factor.kind];
          return (
            <motion.div
              key={factor.kind}
              data-testid="decision-factor"
              className={`absolute w-[32%] min-w-24 max-w-40 rounded-control border border-border-subtle bg-surface-primary/90 px-2 py-1.5 shadow-sm backdrop-blur-sm ${position.className}`}
              custom={position.offset}
              initial={reducedMotion ? false : 'hidden'}
              animate="visible"
              exit={reducedMotion ? undefined : 'hidden'}
              variants={reducedMotion ? undefined : factorDecompose}
            >
              <span className="block text-[0.62rem] font-semibold leading-tight text-text-secondary">
                {DECISION_FACTOR_LABELS[factor.kind]}
              </span>
              <span className="mt-0.5 block font-mono text-[0.64rem] font-semibold tabular-nums text-action-primary">
                {formatContribution(factor.contribution)}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
