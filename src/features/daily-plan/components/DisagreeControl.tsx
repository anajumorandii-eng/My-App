import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, AlertTriangle } from 'lucide-react';
import { DisagreeReason, PlanFeedback } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/cn';
import { confirmation } from '../../../design-system/motion/variants';

const DISAGREE_OPTIONS: { value: DisagreeReason; label: string }[] = [
  { value: 'ja_estudei', label: 'Já estudei isso' },
  { value: 'sem_material', label: 'Não tenho esse material' },
  { value: 'nao_consigo_agora', label: 'Não consigo fazer agora' },
  { value: 'prioridade_errada', label: 'Prioridade errada' },
  { value: 'quero_outra_atividade', label: 'Quero escolher outra atividade' },
];

export type FeedbackStatus = 'idle' | 'saving' | 'saved' | 'error';

interface PreviousFeedbackState {
  loading: boolean;
  error: string | null;
  feedback: PlanFeedback | null;
}

interface DisagreeControlProps {
  status: FeedbackStatus;
  previous: PreviousFeedbackState;
  onSelect: (reason: DisagreeReason) => void;
  confirmationKey: number;
  className?: string;
}

export function DisagreeControl({ status, previous, onSelect, confirmationKey, className }: DisagreeControlProps) {
  const reducedMotion = useReducedMotion();
  if (status === 'saved') {
    return (
      <motion.p
        key={confirmationKey}
        role="status"
        aria-live="polite"
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
        variants={reducedMotion ? undefined : confirmation}
        className={cn('flex items-center text-xs font-medium text-status-success', className)}
      >
        <Check className="w-3.5 h-3.5 mr-1.5 shrink-0" aria-hidden="true" />
        Registrado — o plano não muda sozinho por causa disso.
      </motion.p>
    );
  }

  return (
    <div className={className}>
      {previous.feedback && (
        <p className="text-xs text-text-muted mb-2">Você já marcou esta recomendação anteriormente.</p>
      )}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Motivo da discordância">
        {DISAGREE_OPTIONS.map(({ value, label }) => (
          <Button key={value} variant="secondary" size="sm" onClick={() => onSelect(value)} disabled={status === 'saving'}>
            {label}
          </Button>
        ))}
      </div>
      {status === 'error' && (
        <p className="flex items-center text-xs text-status-error mt-2">
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5 shrink-0" aria-hidden="true" />
          Não foi possível salvar agora. Tente de novo em instantes.
        </p>
      )}
    </div>
  );
}
