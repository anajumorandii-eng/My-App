import React from 'react';
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
} from '../components/subject-icons/SubjectIcons';
import { STAGE_LABEL } from '../lib/visualStudy';
import type { InteractiveSummary } from '../types/summary';
import './TopicFallbackVisual.css';

interface TopicFallbackVisualProps {
  summary: InteractiveSummary;
  activeIndex: number;
  onSelectStep: (index: number) => void;
}

type SubjectIconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SUBJECT_ICON: Record<string, SubjectIconType> = {
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

const WORLD_LABEL: Record<string, string> = {
  'Física': 'sistema e transformação',
  'Química': 'estrutura e transformação',
  'Biologia': 'estrutura, função e processo',
  'Matemática': 'relações e representação',
  'História': 'tempo, agentes e consequências',
  'Geografia': 'território, escala e relações',
  'Literatura': 'obra, forma e leitura',
  'Redação': 'tese, argumento e progressão',
  'Gramática': 'forma, função e uso',
  'Entendimento de Texto': 'pistas, inferência e sentido',
  'Língua Inglesa': 'forma, contexto e compreensão',
  'Filosofia': 'problema, conceito e posição',
  'Sociologia': 'atores, estruturas e relações',
  'Atualidades': 'acontecimento, contexto e impacto',
};

/**
 * Piso visual obrigatório para capítulos que ainda não têm uma prancha,
 * instrumento, cena-âncora ou experimento específico.
 *
 * A composição varia por matéria, mas tudo que afirma sobre o capítulo vem de
 * seus próprios metadados e seções. Não inventa gráfico, fórmula, mapa,
 * mecanismo ou relação científica para preencher espaço.
 */
export function TopicFallbackVisual({ summary, activeIndex, onSelectStep }: TopicFallbackVisualProps) {
  const Icon = SUBJECT_ICON[summary.subject] ?? MatematicaIcon;
  const active = summary.sections[activeIndex] ?? summary.sections[0];
  const nextIndex = Math.min(activeIndex + 1, summary.sections.length - 1);

  return (
    <section
      className="vs-topic-fallback"
      data-subject={summary.subject}
      aria-label={`Estrutura visual de ${summary.title}`}
    >
      <div className="vs-topic-fallback__atmosphere" aria-hidden="true">
        <span /><span /><span />
      </div>

      <div className="vs-topic-fallback__hero">
        <div className="vs-topic-fallback__mark" aria-hidden="true">
          <Icon strokeWidth={1.35} />
        </div>
        <div className="vs-topic-fallback__identity">
          <span>{summary.subject} · {WORLD_LABEL[summary.subject] ?? 'mapa do capítulo'}</span>
          <h3>{summary.topic}</h3>
          <p>{summary.title}</p>
        </div>
      </div>

      <div className="vs-topic-fallback__focus" aria-live="polite">
        <span className="vs-topic-fallback__focus-stage">
          {active ? STAGE_LABEL[active.stage] : 'Etapa'} · {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <strong>{active?.title}</strong>
        <div className="vs-topic-fallback__focus-line" aria-hidden="true">
          {summary.sections.map((section, index) => (
            <i key={section.id} data-active={index === activeIndex ? 'true' : undefined} />
          ))}
        </div>
      </div>

      <div className="vs-topic-fallback__rail" aria-label="Estrutura do capítulo">
        <span className="vs-topic-fallback__rail-label">Mapa editorial do capítulo</span>
        <ol>
          {summary.sections.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                aria-current={activeIndex === index ? 'step' : undefined}
                onClick={() => onSelectStep(index)}
              >
                <span className="vs-topic-fallback__number">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <small>{STAGE_LABEL[section.stage]}</small>
                  <b>{section.title}</b>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="vs-topic-fallback__actions">
        <p>
          Cobertura-base: identidade da matéria + estrutura real deste capítulo. Uma prancha específica continua sendo
          o nível seguinte quando houver representação validada para este tópico.
        </p>
        {nextIndex !== activeIndex && (
          <button type="button" onClick={() => onSelectStep(nextIndex)}>
            Avançar no mapa →
          </button>
        )}
      </div>
    </section>
  );
}
