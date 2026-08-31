import React, { useId, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DisagreeReason } from '../../types';
import { Button } from '../ui/Button';

const DISAGREE_OPTIONS: { value: DisagreeReason; label: string }[] = [
  { value: 'ja_estudei', label: 'Já domino isso' },
  { value: 'prioridade_errada', label: 'Isso não é prioridade' },
  { value: 'nao_consigo_agora', label: 'Não tenho tempo agora' },
  { value: 'quero_outra_atividade', label: 'Prefiro outra intervenção' },
  { value: 'sem_material', label: 'Recomendação não faz sentido' },
];

export interface DecisionExplanationProps {
  reasons: string[];
  confidence?: 'baixa' | 'moderada' | 'alta';
  onDisagree?: (reason: DisagreeReason) => void;
}

export function DecisionExplanation({ reasons, confidence, onDisagree }: DecisionExplanationProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [showDisagree, setShowDisagree] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitDisagreement = (reason: DisagreeReason) => {
    onDisagree?.(reason);
    setShowDisagree(false);
    setSubmitted(true);
  };

  return (
    <div className="aj-decision-explanation">
      <button
        type="button"
        className="aj-disclosure-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        Por que isso?
        {open ? <ChevronUp aria-hidden="true" size={18} /> : <ChevronDown aria-hidden="true" size={18} />}
      </button>

      {open ? (
        <div id={panelId} className="aj-decision-explanation__panel">
          {confidence ? <p className="aj-confidence">Confiança {confidence}</p> : null}
          <ul>
            {reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>

          {submitted ? (
            <p className="aj-feedback-confirmation" role="status">
              Feedback registrado. A recomendação não muda sem sua decisão.
            </p>
          ) : showDisagree ? (
            <div className="aj-disagree-options" aria-label="Motivo da discordância">
              {DISAGREE_OPTIONS.map((option) => (
                <button key={option.value} type="button" onClick={() => submitDisagreement(option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="aj-decision-explanation__actions">
              <Button variant="secondary" onClick={() => setOpen(false)}>Entendi</Button>
              <Button variant="ghost" onClick={() => setShowDisagree(true)}>Discordo</Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
