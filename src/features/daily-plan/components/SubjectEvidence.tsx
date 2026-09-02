"use client";

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Aperture, BookText, ChartSpline, Dna, FilePenLine, FlaskConical, Landmark,
  Map, Newspaper, TextQuote, type LucideIcon,
} from 'lucide-react';
import { MOTION_DURATION, MOTION_EASE_EMPHASIZED } from '../../../design-system/motion/tokens';

type EvidenceDefinition = {
  icon: LucideIcon;
  label: string;
  dossier?: string;
  artifact: string;
};

/** The selector and evidence stage share a single subject registry. */
export const SUBJECT_EVIDENCE: Record<string, EvidenceDefinition> = {
  Física: { icon: Aperture, label: 'Bancada óptica', artifact: 'caderno de experimento óptico' },
  Matemática: { icon: ChartSpline, label: 'Construção matemática', artifact: 'prancha de demonstração matemática' },
  Biologia: { icon: Dna, label: 'Mapa biológico', artifact: 'arquivo de espécimes e relações biológicas' },
  Química: { icon: FlaskConical, label: 'Caderno de reação', artifact: 'caderno de evidências de reação' },
  História: { icon: Landmark, label: 'Caderno de evidências', artifact: 'dossiê histórico de linha do tempo' },
  Geografia: { icon: Map, label: 'Leitura de território', artifact: 'dossiê cartográfico de território' },
  Português: { icon: TextQuote, label: 'Arquitetura da frase', artifact: 'arquivo de construção da frase' },
  Literatura: { icon: BookText, label: 'Arquivo literário', artifact: 'arquivo de leitura literária' },
  Redação: { icon: FilePenLine, label: 'Mapa argumentativo', artifact: 'dossiê de construção argumentativa' },
  Atualidades: { icon: Newspaper, label: 'Linha de contexto', artifact: 'arquivo de evidências contemporâneas' },
};

export function subjectEvidenceFor(subject: string): EvidenceDefinition {
  return SUBJECT_EVIDENCE[subject] ?? SUBJECT_EVIDENCE.Matemática;
}

export function SubjectEvidence({ subject, topic }: { subject: string; topic: string }) {
  const reducedMotion = useReducedMotion();
  const evidence = subjectEvidenceFor(subject);

  return (
    <div className="subject-evidence subject-dossier" aria-label={`${evidence.label}: ${topic}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={`${subject}-${topic}`}
          className="subject-dossier__figure"
          initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.94, rotate: -2.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -24, scale: 1.035, rotate: 1.5 }}
          transition={{ duration: reducedMotion ? MOTION_DURATION.panel : 0.58, ease: MOTION_EASE_EMPHASIZED }}
        >
          <motion.div className="subject-dossier__recompose" aria-hidden="true">
            {[0, 1, 2].map((layer) => (
              <motion.i
                key={layer}
                initial={reducedMotion ? false : { opacity: 0, x: 42 - layer * 24, y: 34 + layer * 13, rotate: 5 - layer * 4 }}
                animate={reducedMotion ? { opacity: 0 } : { opacity: 0.72 - layer * 0.14, x: 0, y: 0, rotate: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -36 + layer * 18, y: -20, rotate: -4 + layer * 2 }}
                transition={{ duration: 0.48, delay: 0.08 + layer * 0.1, ease: MOTION_EASE_EMPHASIZED }}
              />
            ))}
          </motion.div>
          <motion.div
            className="subject-dossier__artifact"
            initial={reducedMotion ? false : { opacity: 0, x: 42, y: 18, rotate: 3 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, rotate: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -34, y: -14, rotate: -2 }}
            transition={{ duration: reducedMotion ? MOTION_DURATION.subjectTween : 0.5, delay: reducedMotion ? 0 : 0.16, ease: MOTION_EASE_EMPHASIZED }}
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
