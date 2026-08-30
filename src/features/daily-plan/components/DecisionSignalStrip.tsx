import React from 'react';

export interface DecisionSignalStripProps {
  mastery: number;
  uncertainty: number;
  urgency: number;
  minutes: number;
}

function boundedPercent(value: number): number {
  return Math.round(Math.max(0, Math.min(100, value)));
}

export function DecisionSignalStrip({ mastery, uncertainty, urgency, minutes }: DecisionSignalStripProps) {
  const confidence = boundedPercent((1 - Math.max(0, Math.min(1, uncertainty))) * 100);

  return (
    <dl className="crivo-decision-signals" aria-label="Sinais usados na decisão">
      <div>
        <dt>Domínio</dt>
        <dd>{boundedPercent(mastery)}%</dd>
      </div>
      <div>
        <dt>Confiança</dt>
        <dd>{confidence}%</dd>
      </div>
      <div>
        <dt>Urgência</dt>
        <dd>{boundedPercent(urgency)}%</dd>
      </div>
      <div>
        <dt>Tempo</dt>
        <dd>{Math.max(0, Math.round(minutes))} min</dd>
      </div>
    </dl>
  );
}
