import React from 'react';
import { sceneFor } from './sceneFor';
import { ContrasteDePosicoes } from './families/ContrasteDePosicoes';
import { EscalaDeGraus } from './families/EscalaDeGraus';
import { CadeiaDeDerivacao } from './families/CadeiaDeDerivacao';
import { CamadasDeDeterminacao } from './families/CamadasDeDeterminacao';
import { MovimentoDialetico } from './families/MovimentoDialetico';
import { Tipologia } from './families/Tipologia';
import { CriteriosConjuntivos } from './families/CriteriosConjuntivos';
import { GradeDeEixos } from './families/GradeDeEixos';
import type { SceneEntry, SceneFamily } from './types';

const FAMILIAS: Record<SceneFamily, React.ComponentType<{ entry: SceneEntry }>> = {
  'contraste-de-posicoes': ContrasteDePosicoes,
  'escala-de-graus': EscalaDeGraus,
  'cadeia-de-derivacao': CadeiaDeDerivacao,
  'camadas-de-determinacao': CamadasDeDeterminacao,
  'movimento-dialetico': MovimentoDialetico,
  'tipologia': Tipologia,
  'criterios-conjuntivos': CriteriosConjuntivos,
  'grade-de-eixos': GradeDeEixos,
};
import { GenerativeTopicIcon } from '../../components/subject-icons/GenerativeTopicIcon';

export function TopicScene({ summaryId }: { summaryId: string }) {
  const entry = sceneFor(summaryId);
  if (!entry) return null;
  const Familia = FAMILIAS[entry.family];
  return (
    <div className="vs-handdrawn-container" style={{ position: 'relative', overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="sketch-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="sketch-filter-heavy" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      {/* Generative Hand-drawn Watermark Map */}
      <div className="vs-generative-watermark" aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GenerativeTopicIcon topic={entry.question} strokeWidth={0.8} style={{ width: '150%', height: '150%', color: 'var(--vs-blue)', filter: 'url(#sketch-filter-heavy)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, filter: 'url(#sketch-filter)' }}>
        <Familia entry={entry} />
      </div>
    </div>
  );
}
