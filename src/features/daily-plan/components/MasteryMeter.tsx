import React from 'react';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { PrecisionMark } from '../../../components/ui/PrecisionMark';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { confidenceFromUncertainty, CONFIDENCE_LABEL } from '../../../lib/confidence';

export interface MasteryMeterProps {
  level: number;
  uncertainty: number;
  topicName: string;
  className?: string;
}

// Shows domínio *and* how much to trust that number — never just a bar,
// since a bar alone implies more precision than a heuristic estimate has.
export function MasteryMeter({ level, uncertainty, topicName, className }: MasteryMeterProps) {
  const confidence = confidenceFromUncertainty(uncertainty);
  const roundedLevel = Math.round(Math.max(0, Math.min(100, level)));

  return (
    <PrecisionMark className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-text-secondary">Domínio estimado</span>
        <ConfidenceIndicator level={confidence} />
      </div>
      <ProgressBar
        value={level}
        label={`Domínio estimado em ${topicName}: ${roundedLevel} por cento. ${CONFIDENCE_LABEL[confidence]}.`}
      />
    </PrecisionMark>
  );
}
