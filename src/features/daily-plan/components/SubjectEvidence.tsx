"use client";

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  FisicaIcon,
  AtualidadesIcon,
  BiologiaIcon,
  GeografiaIcon,
  HistoriaIcon,
  InglesIcon,
  RedacaoIcon,
  GramaticaIcon,
  LiteraturaIcon,
  EntendimentoIcon,
  MatematicaIcon,
  QuimicaIcon,
  FilosofiaIcon,
  SociologiaIcon,
} from '../../../components/subject-icons/SubjectIcons';

import { MOTION_DURATION, MOTION_EASE_EMPHASIZED } from '../../../design-system/motion/tokens';

type EvidenceDefinition = {
  icon: React.ComponentType<any>;
  label: string;
  artifact: string;
};

/** The selector and evidence stage share a single subject registry. */
export const SUBJECT_EVIDENCE: Record<string, EvidenceDefinition> = {
  Física: { icon: FisicaIcon, label: 'Bancada óptica', artifact: 'caderno de experimento óptico' },
  Matemática: { icon: MatematicaIcon, label: 'Construção matemática', artifact: 'prancha de demonstração matemática' },
  Biologia: { icon: BiologiaIcon, label: 'Mapa biológico', artifact: 'arquivo de espécimes e relações biológicas' },
  Química: { icon: QuimicaIcon, label: 'Caderno de reação', artifact: 'caderno de evidências de reação' },
  História: { icon: HistoriaIcon, label: 'Caderno de evidências', artifact: 'dossiê histórico de linha do tempo' },
  Geografia: { icon: GeografiaIcon, label: 'Leitura de território', artifact: 'dossiê cartográfico de território' },
  'Língua Inglesa': { icon: InglesIcon, label: 'Arquitetura idiomática', artifact: 'arquivo de estruturas idiomáticas' },
  Gramática: { icon: GramaticaIcon, label: 'Estrutura gramatical', artifact: 'arquivo de normas gramaticais' },
  'Entendimento de Texto': { icon: EntendimentoIcon, label: 'Análise discursiva', artifact: 'dossiê de análise de texto' },
  Literatura: { icon: LiteraturaIcon, label: 'Arquivo literário', artifact: 'arquivo de leitura literária' },
  Redação: { icon: RedacaoIcon, label: 'Mapa argumentativo', artifact: 'dossiê de construção argumentativa' },
  Atualidades: { icon: AtualidadesIcon, label: 'Linha de contexto', artifact: 'arquivo de evidências contemporâneas' },
  Filosofia: { icon: FilosofiaIcon, label: 'Cadeia de raciocínio', artifact: 'registro de investigação filosófica' },
  Sociologia: { icon: SociologiaIcon, label: 'Dinâmica social', artifact: 'dossiê de fenômenos sociais' },
};

export function subjectEvidenceFor(subject: string): EvidenceDefinition {
  return SUBJECT_EVIDENCE[subject] ?? SUBJECT_EVIDENCE.Matemática;
}

import { GenerativeTopicIcon } from '../../../components/subject-icons/GenerativeTopicIcon';

export function SubjectEvidence({ subject, topic, subdued = false }: { subject: string; topic: string; subdued?: boolean }) {
  const reducedMotion = useReducedMotion();
  const evidence = subjectEvidenceFor(subject);
  return (
    <div className="subject-evidence subject-dossier" aria-label={`${evidence.label}: ${topic}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={`${subject}-${topic}`}
          className="subject-dossier__figure"
          initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.94, rotate: -2.5 }}
          animate={reducedMotion || !subdued
            ? { opacity: 1, x: 0, y: 0, scale: 1 }
            : { opacity: 0.22, x: 54, y: -72, scale: 0.76 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -24, scale: 1.035, rotate: 1.5 }}
          transition={{ duration: reducedMotion ? MOTION_DURATION.panel : 0.58, ease: MOTION_EASE_EMPHASIZED }}
        >
          <motion.div className="subject-dossier__recompose" aria-hidden="true">
            {[0, 1, 2].map((layer) => (
              <motion.i
                key={layer}
                initial={reducedMotion ? false : { opacity: 0, x: 42 - layer * 24, y: 34 + layer * 13, rotate: 5 - layer * 4 }}
                animate={reducedMotion ? { opacity: 0 } : {
                  opacity: [0, 0.72 - layer * 0.14, 0],
                  x: [42 - layer * 24, 0, -12 + layer * 5],
                  y: [34 + layer * 13, 0, -8],
                  rotate: [5 - layer * 4, 0, -1 + layer],
                }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -36 + layer * 18, y: -20, rotate: -4 + layer * 2 }}
                transition={{ duration: 0.66, delay: 0.04 + layer * 0.08, ease: MOTION_EASE_EMPHASIZED, times: [0, 0.58, 1] }}
              />
            ))}
          </motion.div>
          <motion.div
            className="subject-dossier__artifact"
            initial={reducedMotion ? false : { opacity: 0, x: 42, y: 18, rotate: 3 }}
            animate={reducedMotion ? { opacity: subdued ? 0.22 : 1 } : { opacity: 1, x: 0, rotate: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -34, y: -14, rotate: -2 }}
            transition={{ duration: reducedMotion ? MOTION_DURATION.subjectTween : 0.5, delay: reducedMotion ? 0 : 0.16, ease: MOTION_EASE_EMPHASIZED }}
          >
            <div className="subject-dossier__animated" data-subject={subject} aria-hidden="true">
              <evidence.icon strokeWidth={1.2} style={{ position: 'absolute', right: '28px', top: '26px', width: '62px', height: '62px', opacity: 0.75 }} />
              <GenerativeTopicIcon topic={topic} strokeWidth={1} style={{ position: 'absolute', right: '30px', bottom: '26px', width: '42px', height: '42px', opacity: 0.45 }} />
              <span style={{ position: 'relative', zIndex: 1 }}>{evidence.label}</span>
              <i style={{ position: 'relative', zIndex: 1 }} />
              <b style={{ position: 'relative', zIndex: 1 }}>{evidence.artifact}</b>
              <em /><em /><em />
            </div>
          </motion.div>
          <figcaption className="sr-only">{evidence.artifact} para {topic}</figcaption>
        </motion.figure>
      </AnimatePresence>
    </div>
  );
}
