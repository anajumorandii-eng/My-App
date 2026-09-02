"use client";

import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react';
import {
  Aperture, BookText, ChartSpline, Dna, FilePenLine, FlaskConical, Landmark,
  Map, Newspaper, TextQuote, type LucideIcon,
} from 'lucide-react';
import physicsDossier from '../../../assets/subject-dossiers/fisica-dossie-v4.webp';
import mathematicsDossier from '../../../assets/subject-dossiers/matematica-dossie-v4.webp';
import biologyDossier from '../../../assets/subject-dossiers/biologia-dossie-v4.webp';
import chemistryDossier from '../../../assets/subject-dossiers/quimica-dossie-v4.webp';
import historyDossier from '../../../assets/subject-dossiers/historia-dossie-v4.webp';
import geographyDossier from '../../../assets/subject-dossiers/geografia-dossie-v4.webp';
import portugueseDossier from '../../../assets/subject-dossiers/portugues-dossie-v4.webp';
import literatureDossier from '../../../assets/subject-dossiers/literatura-dossie-v4.webp';
import writingDossier from '../../../assets/subject-dossiers/redacao-dossie-v4.webp';
import currentAffairsDossier from '../../../assets/subject-dossiers/atualidades-dossie-v4.webp';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE_EMPHASIZED,
  MOTION_SCALE,
  MOTION_SPRINGS,
} from '../../../design-system/motion/tokens';

type EvidenceDefinition = {
  icon: LucideIcon;
  label: string;
  dossier?: string;
  artifact: string;
};

/** The selector and evidence stage share a single subject registry. */
export const SUBJECT_EVIDENCE: Record<string, EvidenceDefinition> = {
  Física: { icon: Aperture, label: 'Bancada óptica', dossier: physicsDossier, artifact: 'caderno de experimento óptico' },
  Matemática: { icon: ChartSpline, label: 'Construção matemática', dossier: mathematicsDossier, artifact: 'prancha de demonstração matemática' },
  Biologia: { icon: Dna, label: 'Mapa biológico', dossier: biologyDossier, artifact: 'arquivo de espécimes e relações biológicas' },
  Química: { icon: FlaskConical, label: 'Caderno de reação', dossier: chemistryDossier, artifact: 'caderno de evidências de reação' },
  História: { icon: Landmark, label: 'Caderno de evidências', dossier: historyDossier, artifact: 'dossiê histórico de linha do tempo' },
  Geografia: { icon: Map, label: 'Leitura de território', dossier: geographyDossier, artifact: 'dossiê cartográfico de território' },
  Português: { icon: TextQuote, label: 'Arquitetura da frase', dossier: portugueseDossier, artifact: 'arquivo de construção da frase' },
  Literatura: { icon: BookText, label: 'Arquivo literário', dossier: literatureDossier, artifact: 'arquivo de leitura literária' },
  Redação: { icon: FilePenLine, label: 'Mapa argumentativo', dossier: writingDossier, artifact: 'dossiê de construção argumentativa' },
  Atualidades: { icon: Newspaper, label: 'Linha de contexto', dossier: currentAffairsDossier, artifact: 'arquivo de evidências contemporâneas' },
};

export function subjectEvidenceFor(subject: string): EvidenceDefinition {
  return SUBJECT_EVIDENCE[subject] ?? SUBJECT_EVIDENCE.Matemática;
}

export function SubjectEvidence({ subject, topic }: { subject: string; topic: string }) {
  const reducedMotion = useReducedMotion();
  const evidence = subjectEvidenceFor(subject);
  const [scope, animate] = useAnimate();

  // A short, interrupt-safe settle makes a new subject feel placed rather
  // than swapped. It deliberately runs after the declarative entrance and is
  // disabled completely for people who request reduced motion.
  useEffect(() => {
    if (reducedMotion) return;

    void animate(
      '.subject-dossier__artifact',
      { opacity: [0.96, 1], y: [MOTION_DISTANCE.xs, 0], rotate: [0.35, 0] },
      MOTION_SPRINGS.gentle,
    );
  }, [animate, reducedMotion, subject, topic]);

  return (
    <div ref={scope} className="subject-evidence subject-dossier" aria-label={`${evidence.label}: ${topic}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={`${subject}-${topic}`}
          className="subject-dossier__figure"
          initial={reducedMotion ? false : { opacity: 0, y: MOTION_DISTANCE.md, scale: MOTION_SCALE.dossierEnter, rotate: -2.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -MOTION_DISTANCE.sm, scale: MOTION_SCALE.dossierExit, rotate: 1.5 }}
          transition={{ duration: reducedMotion ? MOTION_DURATION.panel : MOTION_DURATION.entrance, ease: MOTION_EASE_EMPHASIZED }}
        >
          <motion.div className="subject-dossier__recompose" aria-hidden="true">
            {[0, 1, 2].map((layer) => (
              <motion.i
                key={layer}
                initial={reducedMotion ? false : { opacity: 0, x: MOTION_DISTANCE.lg - layer * MOTION_DISTANCE.sm, y: MOTION_DISTANCE.lg - layer * MOTION_DISTANCE.xs, rotate: 5 - layer * 4 }}
                animate={reducedMotion ? { opacity: 0 } : {
                  opacity: [0, 0.72 - layer * 0.14, 0],
                  x: [MOTION_DISTANCE.lg - layer * MOTION_DISTANCE.sm, 0, -12 + layer * 5],
                  y: [MOTION_DISTANCE.lg - layer * MOTION_DISTANCE.xs, 0, -MOTION_DISTANCE.xs],
                  rotate: [5 - layer * 4, 0, -1 + layer],
                }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -MOTION_DISTANCE.lg + layer * MOTION_DISTANCE.sm, y: -MOTION_DISTANCE.sm, rotate: -4 + layer * 2 }}
                transition={{ duration: MOTION_DURATION.entrance, delay: layer * MOTION_DURATION.micro, ease: MOTION_EASE_EMPHASIZED, times: [0, 0.58, 1] }}
              />
            ))}
          </motion.div>
          <motion.div
            className="subject-dossier__artifact"
            initial={reducedMotion ? false : { opacity: 0, x: MOTION_DISTANCE.lg, y: MOTION_DISTANCE.sm, rotate: 3 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, rotate: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -MOTION_DISTANCE.lg, y: -MOTION_DISTANCE.sm, rotate: -2 }}
            transition={{ duration: reducedMotion ? MOTION_DURATION.subjectTween : MOTION_DURATION.entrance, delay: reducedMotion ? 0 : MOTION_DURATION.micro, ease: MOTION_EASE_EMPHASIZED }}
          >
            {evidence.dossier ? (
              <img src={evidence.dossier} alt="" aria-hidden="true" />
            ) : (
              <div className="subject-dossier__pending" data-subject={subject} aria-hidden="true">
                <evidence.icon strokeWidth={1.2} />
                <span>{evidence.label}</span><i /><b>{evidence.artifact}</b><em /><em /><em />
              </div>
            )}
          </motion.div>
          <figcaption className="sr-only">{evidence.artifact} para {topic}</figcaption>
        </motion.figure>
      </AnimatePresence>
    </div>
  );
}
