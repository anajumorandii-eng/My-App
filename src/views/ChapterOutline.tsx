import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { STAGE_LABEL } from '../lib/visualStudy';
import type { InteractiveSummary } from '../types/summary';
import './ChapterOutline.css';

/** Navegação editorial do capítulo, sem repetir o fenômeno da cena imersiva. */
export function ChapterOutline({ summary, activeIndex, onSelectStep }: {
  summary: InteractiveSummary; activeIndex: number; onSelectStep: (index: number) => void;
}) {
  return <nav className="vs-chapter-outline" aria-label="Assuntos do capítulo">
    <h2>Assuntos do capítulo</h2>
    <ol>
      {summary.sections.map((section, index) => <li key={section.id}>
        <button type="button" aria-current={activeIndex === index ? 'step' : undefined} onClick={() => onSelectStep(index)}>
          <span className="vs-chapter-outline-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="vs-chapter-outline-topic"><small>{STAGE_LABEL[section.stage]}</small><strong>{section.title}</strong></span>
          <ArrowUpRight aria-hidden="true" />
        </button>
      </li>)}
    </ol>
  </nav>;
}
