"use client";

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Aperture, BookText, ChartSpline, Dna, FilePenLine, FlaskConical, Landmark,
  Map, Newspaper, TextQuote, type LucideIcon,
} from 'lucide-react';
import physicsDossier from '../../../assets/subject-dossiers/fisica-dossie.png';
import mathematicsDossier from '../../../assets/subject-dossiers/matematica-dossie.png';
import biologyDossier from '../../../assets/subject-dossiers/biologia-dossie.png';
import historyDossier from '../../../assets/subject-dossiers/historia-dossie.png';
import chemistryDossier from '../../../assets/subject-dossiers/quimica-dossie.png';
import geographyDossier from '../../../assets/subject-dossiers/geografia-dossie.png';
import portugueseDossier from '../../../assets/subject-dossiers/portugues-dossie.png';
import literatureDossier from '../../../assets/subject-dossiers/literatura-dossie.png';
import writingDossier from '../../../assets/subject-dossiers/redacao-dossie.png';
import currentAffairsDossier from '../../../assets/subject-dossiers/atualidades-dossie.png';
import { MOTION_DURATION, MOTION_EASE_EMPHASIZED } from '../../../design-system/motion/tokens';

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

  return (
    <div className="subject-evidence subject-dossier" aria-label={`${evidence.label}: ${topic}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={`${subject}-${topic}`}
          className="subject-dossier__figure"
          initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
          transition={{ duration: MOTION_DURATION.panel, ease: MOTION_EASE_EMPHASIZED }}
        >
          <motion.div
            className="subject-dossier__artifact"
            initial={reducedMotion ? false : { opacity: 0, x: 18, rotate: 1.2 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, rotate: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -14, rotate: -1 }}
            transition={{ duration: MOTION_DURATION.subjectTween, ease: MOTION_EASE_EMPHASIZED }}
          >
            {evidence.dossier ? (
              <img src={evidence.dossier} alt="" aria-hidden="true" />
            ) : (
              <div className="subject-dossier__pending" aria-hidden="true">
                <span>{evidence.label}</span><i /><b>{evidence.artifact}</b>
              </div>
            )}
          </motion.div>
          <figcaption className="sr-only">{evidence.artifact} para {topic}</figcaption>
        </motion.figure>
      </AnimatePresence>
    </div>
  );
}
