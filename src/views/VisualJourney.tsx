import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AiText } from '../components/AiText';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';
import { STAGE_LABEL } from '../lib/visualStudy';
import type { InteractiveSummary } from '../types/summary';

/** The section order and all teaching text come from the chapter, not a subject template. */
export function VisualJourney({ summary, onPractice, initialIndex = 0, onStepChange }: {
  summary: InteractiveSummary; onPractice: () => void; initialIndex?: number; onStepChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const section = summary.sections[index];
  if (!section) return null;
  const go = (next: number) => { setDirection(next > index ? 1 : -1); setIndex(next); onStepChange?.(next); };
  return (
    <section className="vs-journey" aria-label="Percurso do capítulo" data-subject={summary.subject}>
      <header className="vs-journey-heading">
        <div><span className="vs-board-kicker">{summary.subject} · {summary.topic}</span><h2>{summary.title}</h2></div>
        <span className="vs-journey-count">{index + 1} / {summary.sections.length}</span>
      </header>
      {summary.overview !== summary.sections[0]?.content && summary.overview.length < 400 && <p>{summary.overview}</p>}
      <nav aria-label="Etapas do capítulo"><ol className="vs-journey-steps">
        {summary.sections.map((item, i) => <li key={item.id}>
          <button type="button" aria-current={index === i ? 'step' : undefined} onClick={() => go(i)}>
            <span className="vs-journey-number">{String(i + 1).padStart(2, '0')}</span>
            <span><small>{STAGE_LABEL[item.stage]}</small><strong>{item.title}</strong></span>
          </button>
        </li>)}
      </ol></nav>
      <div className="vs-journey-progress" aria-hidden="true"><motion.div
        animate={{ scaleX: (index + 1) / summary.sections.length }}
        transition={{ duration: reduced ? 0 : MOTION_DURATION.panel, ease: MOTION_EASE }} /></div>
      <AnimatePresence initial={false} mode="wait">
        <motion.article key={section.id} className="vs-journey-page"
          initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : direction * 12 }}
          animate={{ opacity: 1, x: 0 }} exit={{ opacity: reduced ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : MOTION_DURATION.component, ease: MOTION_EASE }}>
          <span className="vs-board-kicker">{STAGE_LABEL[section.stage]}{section.evidenceKind ? ` · ${section.evidenceKind}` : ''}</span>
          <h3>{section.title}</h3>
          <AiText text={section.content} />
          {section.callout && <aside className="vs-journey-callout"><AiText text={section.callout} /></aside>}
        </motion.article>
      </AnimatePresence>
      <footer className="vs-journey-controls">
        <button type="button" disabled={index === 0} onClick={() => go(index - 1)}>← Etapa anterior</button>
        <button type="button" onClick={() => index < summary.sections.length - 1 ? go(index + 1) : onPractice()}>
          {index < summary.sections.length - 1 ? `Continuar: ${STAGE_LABEL[summary.sections[index + 1].stage]}` : 'Testar o que aprendi'} →
        </button>
      </footer>
      <details className="vs-journey-sources"><summary>Fontes e pré-requisitos deste capítulo</summary>
        {summary.prerequisites.length > 0 && <p>Antes de começar: {summary.prerequisites.join(' · ')}</p>}
        <ul>{summary.sources.map((source, i) => <li key={`${source.label}-${i}`}>
          {source.url && /^https?:\/\//.test(source.url) ? <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a> : source.label}
          {source.chapter && ` · ${source.chapter}`}
        </li>)}</ul>
      </details>
    </section>
  );
}
