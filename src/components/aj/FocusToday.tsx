import React from 'react';
import { ArrowRight, Clock3 } from 'lucide-react';
import type { DisagreeReason } from '../../types';
import { Button } from '../ui/Button';
import { DecisionExplanation } from './DecisionExplanation';

export interface FocusTodayProps {
  priorityLabel: string;
  topic: string;
  subject: string;
  actionLabel: string;
  durationMinutes: number;
  scheduledTime?: string;
  diagnosticReason: string;
  reasons: string[];
  confidence?: 'baixa' | 'moderada' | 'alta';
  onStart: () => void;
  onDisagree?: (reason: DisagreeReason) => void;
}

export function FocusToday({
  priorityLabel,
  topic,
  subject,
  actionLabel,
  durationMinutes,
  scheduledTime,
  diagnosticReason,
  reasons,
  confidence,
  onStart,
  onDisagree,
}: FocusTodayProps) {
  return (
    <article className="aj-focus-today" aria-labelledby="aj-focus-title">
      <header className="aj-focus-today__header">
        <p className="aj-eyebrow">{priorityLabel}</p>
        <p className="aj-focus-today__subject">{subject}</p>
      </header>

      <div className="aj-focus-today__body">
        <div className="aj-focus-today__copy">
          <h2 id="aj-focus-title">{topic}</h2>
          <p className="aj-focus-today__action">{actionLabel}</p>
          <p className="aj-focus-today__reason">{diagnosticReason}</p>
        </div>

        <div className="aj-focus-today__decision">
          <p className="aj-duration">
            <Clock3 aria-hidden="true" size={20} />
            {scheduledTime ? <span>{scheduledTime} ·</span> : null}
            <span>{durationMinutes} min</span>
          </p>
          <Button onClick={onStart}>
            Começar
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
        </div>
      </div>

      <DecisionExplanation reasons={reasons} confidence={confidence} onDisagree={onDisagree} />
    </article>
  );
}
