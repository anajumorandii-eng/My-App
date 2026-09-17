import React from 'react';
import { GenerativeTopicIcon } from '../components/subject-icons/GenerativeTopicIcon';
import type { InteractiveSummary } from '../types/summary';
import './TopicFallbackVisual.css';

interface TopicFallbackVisualProps {
  summary: InteractiveSummary;
  activeIndex: number;
  onSelectStep: (index: number) => void;
}

/**
 * Piso visual obrigatório para capítulos que ainda não têm prancha, instrumento,
 * cena-âncora ou experimento próprio.
 *
 * Ele usa somente estrutura editorial real do capítulo. Não inventa gráfico,
 * fórmula, mapa, mecanismo ou relação científica para preencher espaço.
 */
export function TopicFallbackVisual({ summary, activeIndex, onSelectStep }: TopicFallbackVisualProps) {
  return (
    <section
      className="vs-topic-fallback"
      data-subject={summary.subject}
      aria-label={`Estrutura visual de ${summary.title}`}
    >
      <div className="vs-topic-fallback__hero">
        <div className="vs-topic-fallback__mark" aria-hidden="true">
          <GenerativeTopicIcon topic={`${summary.subject}:${summary.topic}`} />
        </div>
        <div className="vs-topic-fallback__identity">
          <span>{summary.subject}</span>
          <h3>{summary.topic}</h3>
          <p>{summary.title}</p>
        </div>
      </div>

      <div className="vs-topic-fallback__rail" aria-label="Estrutura do capítulo">
        <span className="vs-topic-fallback__rail-label">Estrutura do capítulo</span>
        <ol>
          {summary.sections.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                aria-current={activeIndex === index ? 'step' : undefined}
                onClick={() => onSelectStep(index)}
              >
                <span className="vs-topic-fallback__number">{String(index + 1).padStart(2, '0')}</span>
                <span>{section.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p className="vs-topic-fallback__note">
        Este capítulo ainda não possui uma prancha autoral dedicada. A estrutura acima mantém identidade visual,
        navegação e interação sem atribuir ao conteúdo uma ilustração que não foi validada para ele.
      </p>
    </section>
  );
}
