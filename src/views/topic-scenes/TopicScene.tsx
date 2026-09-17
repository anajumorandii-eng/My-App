import React from 'react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import {
  AtualidadesIcon,
  BiologiaIcon,
  EntendimentoIcon,
  FilosofiaIcon,
  FisicaIcon,
  GeografiaIcon,
  GramaticaIcon,
  HistoriaIcon,
  InglesIcon,
  LiteraturaIcon,
  MatematicaIcon,
  QuimicaIcon,
  RedacaoIcon,
  SociologiaIcon,
} from '../../components/subject-icons/SubjectIcons';
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
import './TopicSceneSubjects.css';

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

const SUBJECT_ICON: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'Física': FisicaIcon,
  'Atualidades': AtualidadesIcon,
  'Biologia': BiologiaIcon,
  'Geografia': GeografiaIcon,
  'História': HistoriaIcon,
  'Língua Inglesa': InglesIcon,
  'Redação': RedacaoIcon,
  'Gramática': GramaticaIcon,
  'Literatura': LiteraturaIcon,
  'Entendimento de Texto': EntendimentoIcon,
  'Matemática': MatematicaIcon,
  'Química': QuimicaIcon,
  'Filosofia': FilosofiaIcon,
  'Sociologia': SociologiaIcon,
};

export function TopicScene({ summaryId }: { summaryId: string }) {
  const entry = sceneFor(summaryId);
  if (!entry) return null;
  const summary = interactiveSummaries.find(item => item.id === summaryId);
  const subject = summary?.subject ?? 'Matemática';
  const Icon = SUBJECT_ICON[subject] ?? MatematicaIcon;
  const Familia = FAMILIAS[entry.family];

  return (
    <div className="vs-handdrawn-container" data-subject={subject} style={{ position: 'relative', overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
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

      <div className="tc-subject-signature" aria-hidden="true">
        <Icon strokeWidth={1.15} />
        <span>{subject}</span>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Familia entry={entry} />
      </div>
    </div>
  );
}
