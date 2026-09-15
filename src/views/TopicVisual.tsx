import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';
import type { InteractiveSummary, SummarySection } from '../types/summary';
import { atlasPassages } from '../lib/topicAtlas';
import { AiText } from '../components/AiText';

export function TopicVisual(props: { summary: InteractiveSummary; section: SummarySection; index: number }) {
  return <PassageAtlas key={`${props.summary.id}:${props.section.id}`} {...props} />;
}

function PassageAtlas({ summary, section, index }: { summary: InteractiveSummary; section: SummarySection; index: number }) {
  const passages = atlasPassages(section);
  const [selected, setSelected] = useState(0);
  const [pinned, setPinned] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : MOTION_DURATION.panel, ease: MOTION_EASE };
  const current = passages[selected];
  if (!current) return null;
  return <figure className="topic-atlas" data-subject={summary.subject} data-section-id={section.id}
    aria-label={`Leitura em foco de ${section.title}`}>
    <figcaption className="ta-heading">
      <span className="ta-folio" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><small>{summary.topic} · leitura em foco</small><strong>{section.title}</strong></div>
    </figcaption>
    <div className="ta-reading-map">
      <nav aria-label="Trechos desta etapa" className="ta-spine">
        {passages.map((passage, i) => <button key={passage.id} type="button" aria-pressed={selected === i}
          aria-label={`Focar trecho ${i + 1}`} onClick={() => setSelected(i)}>
          <span className="ta-seal">{String(i + 1).padStart(2, '0')}</span>
          <span>Trecho {i + 1}{pinned === i && <small>Fixado para comparar</small>}</span>
        </button>)}
      </nav>
      <div className="ta-evidence" data-comparing={pinned !== null && pinned !== selected}>
        {pinned !== null && pinned !== selected && <aside className="ta-pinned"><small>Trecho {pinned + 1} · fixado</small><AiText text={passages[pinned].text} /></aside>}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={current.id} className="ta-active-passage" initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : 0 }} transition={transition}>
            <small>Trecho {selected + 1} de {passages.length}</small>
            <AiText text={current.text} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    {passages.length > 1 && <div className="ta-actions">
      <button type="button" aria-pressed={pinned !== null} onClick={() => setPinned(pinned === null ? selected : null)}>
        {pinned === null ? 'Fixar trecho para comparar' : 'Soltar trecho fixado'}
      </button>
      <button type="button" disabled={selected === passages.length - 1} onClick={() => setSelected(i => i + 1)}>Próximo trecho →</button>
    </div>}
    <p className="ta-provenance">Trechos de “{section.title}”. Selecione e compare sem perder o contexto da leitura.</p>
  </figure>;
}
