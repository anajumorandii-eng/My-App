import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, HelpCircle, RotateCcw, Undo2 } from 'lucide-react';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { evaluateRetrievalAnswer } from '../lib/summaryEngine';
import { applySummaryAttempt } from '../lib/summaryStudy';
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { CONFIDENCE_LABEL } from '../lib/confidence';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';
import {
  buildVisualMap, chooseHiddenRelations, explainRelation, gradeReconstruction, minimalIntervention,
  nodeState, relationEvidence, relationState, NODE_STATE_LABEL, RELATION_LABEL,
  type NodeState, type ReconstructionGrade, type VisualMap,
} from '../lib/visualStudy';
import type { InteractiveSummary, RetrievalAttempt } from '../types/summary';
import './Visual.css';

type Mode = 'explorar' | 'testar' | 'reconstruir';

const MODE_LABEL: Record<Mode, string> = { explorar: 'Explorar', testar: 'Testar', reconstruir: 'Reconstruir' };
const MODE_HINT: Record<Mode, string> = {
  explorar: 'Leia a prancha inteira e abra o inspetor de cada nó.',
  testar: 'Recupere sem consultar. O que você escrever vira evidência.',
  reconstruir: 'Recomponha os elos que o diagnóstico escondeu.',
};
const STAGE_LABEL = {
  intuicao: 'Intuição', conceito: 'Conceito', aplicacao: 'Aplicação',
  exercicio: 'Exercício', estrategia: 'Estratégia',
} as const;

// Os rótulos das relações vêm de `expectedElements[].label`, em caixa baixa e
// sem acento. Não dá para corrigir o dado: o mesmo texto é gravado em
// `matchedElements` a cada tentativa, e renomeá-lo orfanaria a evidência já
// registrada no Caderno de Erros. Então a correção é só de exibição, e só da
// inicial — devolver acento por regra inventaria grafia.
const displayLabel = (label: string) => label.charAt(0).toUpperCase() + label.slice(1);

function wrapLabel(label: string, perLine: number, maxLines = 2): string[] {
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > perLine && current) { lines.push(current); current = word; }
    else current = candidate;
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  return [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1].slice(0, perLine - 1)}…`];
}

/*
 * A prancha não é uma corrente de caixas empilhadas: o conceito central fica no
 * medalhão do topo e as etapas descem ramificando à esquerda e à direita de uma
 * espinha, que é onde os elos são nomeados. No estreito a mesma estrutura vira
 * uma linha do tempo com a espinha à esquerda — ramificar em 360 px deixaria
 * cada nó com 150 px e o título ilegível.
 */
function plateLayout(count: number, compact: boolean) {
  const width = compact ? 360 : 760;
  const anchorCx = width / 2;
  const anchorCy = compact ? 74 : 84;
  const ringOuter = compact ? 40 : 46;
  const nodeH = compact ? 66 : 70;
  const step = compact ? 92 : 88;
  const firstY = compact ? 168 : 176;
  const spineX = compact ? 30 : anchorCx;

  const nodes = Array.from({ length: count }, (_, index) => {
    const y = firstY + index * step;
    const side: 'left' | 'right' = compact ? 'right' : index % 2 === 0 ? 'left' : 'right';
    const nodeW = compact ? width - 72 : 300;
    const x = compact ? 52 : side === 'left' ? 34 : width - 34 - nodeW;
    return { x, y, w: nodeW, h: nodeH, side, cy: y + nodeH / 2 };
  });

  const links = nodes.map((node) => {
    const innerX = node.side === 'left' ? node.x + node.w : node.x;
    const pull = node.side === 'left' ? -34 : 34;
    return `M ${spineX} ${node.cy - 40} C ${spineX} ${node.cy}, ${innerX + pull} ${node.cy}, ${innerX} ${node.cy}`;
  });

  return {
    width,
    height: (nodes.at(-1)?.y ?? firstY) + nodeH + 22,
    anchor: { cx: anchorCx, cy: anchorCy, ringOuter, ringMid: ringOuter - 12, core: compact ? 13 : 15 },
    spineX,
    spineTop: anchorCy + ringOuter + (compact ? 44 : 48),
    nodes,
    links,
    compact,
    titleChars: compact ? 30 : 34,
  };
}

function useCompactPlate() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(max-width: 720px)');
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);
  return compact;
}

function StateChip({ state }: { state: NodeState }) {
  return (
    <span className="vs-chip" data-state={state}>
      <span className="vs-swatch" aria-hidden="true" />{NODE_STATE_LABEL[state]}
    </span>
  );
}

function Plate({
  map, states, selectedId, onSelect, hiddenEdgeIds,
}: {
  map: VisualMap;
  states: Record<string, NodeState>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hiddenEdgeIds: string[];
}) {
  const compact = useCompactPlate();
  const reducedMotion = useReducedMotion();
  const layout = useMemo(() => plateLayout(map.nodes.length, compact), [map.nodes.length, compact]);
  const anchorLines = wrapLabel(map.centerLabel, compact ? 30 : 40, 2);

  return (
    <div className="vs-plate">
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={`Mapa de relações de ${map.title}`}>
        {/* medalhão do conceito central */}
        <g>
          <text className="vs-anchor-kicker" x={layout.anchor.cx} y={layout.anchor.cy - layout.anchor.ringOuter - 14} textAnchor="middle">CONCEITO CENTRAL</text>
          {[1, 2, 3].map((ring) => (
            <circle
              key={ring}
              className="vs-anchor-orbit"
              cx={layout.anchor.cx}
              cy={layout.anchor.cy}
              r={layout.anchor.ringOuter + 14 + ring * 17}
              opacity={0.5 / ring}
            />
          ))}
          <circle className="vs-anchor-halo" cx={layout.anchor.cx} cy={layout.anchor.cy} r={layout.anchor.ringOuter + 10} />
          <circle className="vs-anchor-ring vs-anchor-ring--ticks" cx={layout.anchor.cx} cy={layout.anchor.cy} r={layout.anchor.ringOuter} />
          <circle className="vs-anchor-ring" cx={layout.anchor.cx} cy={layout.anchor.cy} r={layout.anchor.ringMid} />
          <circle className="vs-anchor-core" cx={layout.anchor.cx} cy={layout.anchor.cy} r={layout.anchor.core} />
          {anchorLines.map((line, index) => (
            <text
              key={line}
              className="vs-anchor-text"
              x={layout.anchor.cx}
              y={layout.anchor.cy + layout.anchor.ringOuter + 22 + index * 17}
              textAnchor="middle"
            >
              {line}
            </text>
          ))}
        </g>

        <line className="vs-spine" x1={layout.spineX} y1={layout.spineTop} x2={layout.spineX} y2={(layout.nodes.at(-1)?.cy ?? 0)} />

        {layout.links.map((path, index) => (
          <path key={map.nodes[index].id} className="vs-link" d={path} />
        ))}

        {map.edges.map((edge, index) => {
          const from = layout.nodes[index];
          const to = layout.nodes[index + 1];
          const hidden = hiddenEdgeIds.includes(edge.id);
          const label = hidden ? '? ? ?' : RELATION_LABEL[edge.kind].toUpperCase();
          return (
            <g key={edge.id}>
              {hidden && (
                <path
                  className="vs-link is-hidden"
                  d={`M ${layout.spineX} ${from.cy} L ${layout.spineX} ${to.cy}`}
                />
              )}
              <rect
                className="vs-link-plate"
                x={layout.spineX + 6}
                y={(from.cy + to.cy) / 2 - 7}
                width={label.length * 6.4 + 12}
                height={15}
                rx={7}
              />
              <text
                className={`vs-link-label${hidden ? ' is-hidden' : ''}`}
                x={layout.spineX + 12}
                y={(from.cy + to.cy) / 2 + 3.5}
                textAnchor="start"
              >
                {label}
              </text>
            </g>
          );
        })}

        {map.nodes.map((node, index) => {
          const geometry = layout.nodes[index];
          const state = states[node.id] ?? 'nao-avaliado';
          const lines = wrapLabel(node.label, layout.titleChars);
          const textX = geometry.x + 18;
          return (
            <motion.g
              key={node.id}
              className="vs-node"
              data-state={state}
              role="button"
              tabIndex={0}
              aria-pressed={selectedId === node.id}
              aria-label={`${node.label} — ${NODE_STATE_LABEL[state]}`}
              onClick={() => onSelect(node.id)}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(node.id); }
              }}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE, delay: reducedMotion ? 0 : index * 0.05 }}
            >
              <rect className="vs-node-box" x={geometry.x} y={geometry.y} width={geometry.w} height={geometry.h} rx={13} />
              <circle className="vs-node-dot" cx={geometry.x + 11} cy={geometry.y + 15} r={3.5} />
              <text className="vs-node-stage" x={textX} y={geometry.y + 19}>{STAGE_LABEL[node.stage].toUpperCase()}</text>
              {lines.map((line, lineIndex) => (
                <text key={line} className="vs-node-title" x={textX} y={geometry.y + 42 + lineIndex * 17}>{line}</text>
              ))}
            </motion.g>
          );
        })}
      </svg>

      {map.recallPrompt && (
        <div className="vs-keystone">
          <p className="vs-meta">Relação fundamental</p>
          <q>{map.recallPrompt}</q>
        </div>
      )}
    </div>
  );
}

function VisualLibrary({ onOpen }: { onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const subjects = useMemo(() => [...new Set(interactiveSummaries.map((item) => item.subject))].sort(), []);
  const list = useMemo(() => {
    const folded = query.trim().toLowerCase();
    return interactiveSummaries
      .filter((item) => (subject ? item.subject === subject : true))
      .filter((item) => !folded || `${item.title} ${item.topic}`.toLowerCase().includes(folded))
      .slice(0, 60);
  }, [query, subject]);

  return (
    <>
      <header>
        <p className="vs-kicker"><i aria-hidden="true" />Visual · mapa de relações</p>
        <h1>Veja as relações antes de decorar as respostas.</h1>
        <p className="vs-lede">
          Mapa para compreender relações. Recuperação ativa para consolidar. A evidência que você produz
          aqui é a mesma que alimenta o Caderno de Erros e as suas revisões.
        </p>
      </header>

      {/* Mais de sessenta tópicos não cabem em fileira de chips: campo agrupado. */}
      <div className="vs-filters">
        <label className="vs-field">
          <span>Disciplina</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="">Todas</option>
            {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="vs-field">
          <span>Buscar capítulo</span>
          <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Termodinâmica, Revolução Francesa…" />
        </label>
      </div>

      {list.length === 0 ? (
        <p role="status" className="vs-panel vs-dim">Nenhum capítulo encontrado com esses filtros.</p>
      ) : (
        <ul className="vs-catalog">
          {list.map((item) => (
            <li key={item.id}>
              <button onClick={() => onOpen(item.id)}>
                <span className="vs-kicker">{item.subject} · {item.topic}</span>
                <b>{item.title}</b>
                <span className="vs-meta">{item.sections.length} nós · {item.retrieval[0]?.expectedElements.length ?? 0} relações</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Inspector({
  map, summary, nodeId, answers, onOpenSummary, onDisagree, disagreed, onTest, onRebuild,
}: {
  map: VisualMap;
  summary: InteractiveSummary;
  nodeId: string | null;
  answers: RetrievalAttempt[];
  onOpenSummary: (sectionId: string) => void;
  onDisagree: () => void;
  disagreed: boolean;
  onTest: () => void;
  onRebuild: () => void;
}) {
  const node = map.nodes.find((item) => item.id === nodeId);
  if (!node) {
    return (
      <div className="vs-panel">
        <p className="vs-meta">Inspetor</p>
        <p className="vs-dim" style={{ marginBottom: 0 }}>Selecione um nó da prancha para ver o diagnóstico que sustenta o estado dele.</p>
      </div>
    );
  }
  const section = summary.sections.find((item) => item.id === node.sectionId);
  const explanations = map.relations.map((relation) => ({ relation, why: explainRelation(relation, answers) }));
  return (
    <div className="vs-panel">
      <p className="vs-kicker"><i aria-hidden="true" />{STAGE_LABEL[node.stage]}</p>
      <h3 style={{ margin: '9px 0 8px' }}>{node.label}</h3>
      <p className="vs-dim">{node.excerpt}</p>

      <p className="vs-meta" style={{ marginTop: 18 }}>Relações avaliadas neste capítulo</p>
      <ul className="vs-relations">
        {explanations.map(({ relation, why }) => (
          <li key={relation.id} data-state={why.state}>
            <b>{displayLabel(relation.label)}</b>
            <div style={{ margin: '8px 0' }}><StateChip state={why.state} /></div>
            <p className="vs-dim" style={{ margin: 0, fontSize: 11.5 }}>
              {CONFIDENCE_LABEL[why.confidence]} · {why.evidence.join(' ')}
              {/* Hipótese aparece como hipótese. Repetir o aviso inteiro em cada
                  relação virava parede de texto e perdia o efeito: aqui fica a
                  marca, e a explicação vem uma vez só ao pé da lista. */}
              {why.caveat && <> <span className="vs-hypothesis">Hipótese.</span></>}
            </p>
          </li>
        ))}
        {map.relations.length === 0 && (
          <li className="vs-dim">Este capítulo ainda não tem pergunta de recuperação, então não há relação avaliável.</li>
        )}
      </ul>
      {explanations.some(({ why }) => why.caveat) && (
        <p className="vs-note vs-note--hypothesis" style={{ marginTop: 10 }}>
          As relações marcadas como hipótese ainda não têm evidência suficiente. Uma nova reconstrução muda o diagnóstico.
        </p>
      )}

      <div className="vs-actions">
        <button className="vs-ghost" onClick={() => onOpenSummary(node.sectionId)}>Explicar <ArrowUpRight aria-hidden="true" size={13} /></button>
        <button className="vs-ghost" onClick={onTest}>Testar <ArrowUpRight aria-hidden="true" size={13} /></button>
        <button className="vs-ghost" onClick={onRebuild}>Reconstruir <ArrowUpRight aria-hidden="true" size={13} /></button>
        <button className="vs-ghost" onClick={onDisagree} aria-pressed={disagreed}>Discordo deste diagnóstico</button>
      </div>
      {/* A IA recomenda; a estudante decide. Discordar não apaga a evidência —
          registra que ela pede nova medida antes de aceitar o estado. */}
      {disagreed && (
        <p role="status" className="vs-note vs-note--hypothesis" style={{ marginTop: 12 }}>
          Anotado. O estado continua visível como hipótese: faça uma reconstrução em Testar ou Reconstruir
          para produzir a evidência nova que muda o diagnóstico.
        </p>
      )}
      {section?.callout && <p className="vs-note vs-note--hypothesis" style={{ marginTop: 12 }}>{section.callout}</p>}
    </div>
  );
}

export default function Visual() {
  const { progress, update, loading, syncError } = useSummaryProgress();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const summaryId = searchParams.get('summary');
  const [mode, setMode] = useState<Mode>('explorar');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [disagreed, setDisagreed] = useState(false);
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<{ matched: string[]; missing: string | null } | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [grades, setGrades] = useState<Record<string, { grade: ReconstructionGrade; feedback: string }>>({});
  const [showWhyHidden, setShowWhyHidden] = useState(false);

  const summary = summaryId ? interactiveSummaries.find((item) => item.id === summaryId) : undefined;
  const map = useMemo(() => (summary ? buildVisualMap(summary) : null), [summary]);
  const itemProgress = summary ? progress[summary.id] : undefined;
  const answers = useMemo(
    () => (itemProgress?.answers ?? []).filter((attempt) => attempt.questionId === map?.questionId),
    [itemProgress, map],
  );

  const hidden = useMemo(() => (map ? chooseHiddenRelations(map, answers) : []), [map, answers]);
  const intervention = useMemo(() => (map ? minimalIntervention(map, answers) : null), [map, answers]);

  const states = useMemo(() => {
    if (!map) return {};
    const relationStates = map.relations.map((relation) => relationState(relationEvidence(relation, answers)));
    return Object.fromEntries(map.nodes.map((node) => [node.id, nodeState(node, itemProgress, relationStates)]));
  }, [map, answers, itemProgress]);

  // Trocar de capítulo tem de limpar a mesa: manter resposta e peças da anterior
  // faria a reconstrução corrigir o texto errado contra o mapa novo.
  useEffect(() => {
    setSelectedNode(null); setDisagreed(false); setDraft(''); setFeedback(null);
    setPlacements({}); setHistory([]); setGrades({}); setShowWhyHidden(false);
  }, [summaryId]);

  if (loading) {
    return <p role="status" className="crivo-visual vs-dim">Carregando o mapa e suas evidências…</p>;
  }

  if (!summaryId || !map || !summary) {
    if (summaryId && !summary) {
      return (
        <div className="crivo-visual">
          <button className="vs-back" onClick={() => setSearchParams({})}><ArrowLeft aria-hidden="true" size={13} />Voltar ao Visual</button>
          <div role="alert" className="vs-panel">
            <h2>Capítulo indisponível</h2>
            <p className="vs-dim">Este capítulo não existe mais. O histórico de evidências continua no Caderno de Erros.</p>
          </div>
        </div>
      );
    }
    return <div className="crivo-visual"><VisualLibrary onOpen={(id) => setSearchParams({ summary: id })} /></div>;
  }

  const question = summary.retrieval[0] ?? null;
  // A relação de índice i é desenhada sobre a aresta de índice i. O vínculo é
  // convencional — relação vem da pergunta de recuperação, aresta vem da
  // sequência das seções — mas precisa ser estável: marcar as N primeiras
  // arestas fazia a lacuna pular de lugar quando a ordem de ocultação mudava.
  const hiddenEdgeIds = mode === 'reconstruir'
    ? hidden
        .map((item) => map.relations.findIndex((relation) => relation.id === item.relationId))
        .flatMap((index) => (index >= 0 && index < map.edges.length ? [map.edges[index].id] : []))
    : [];
  const bank = map.relations.map((relation) => relation.label);
  const usedLabels = Object.values(placements);

  const place = (relationId: string, label: string) => {
    setHistory((items) => [...items, placements]);
    setPlacements((current) => ({ ...current, [relationId]: label }));
    setGrades((current) => {
      const next = { ...current };
      delete next[relationId];
      return next;
    });
  };

  const submitReconstruction = () => {
    const graded: Record<string, { grade: ReconstructionGrade; feedback: string }> = {};
    for (const item of hidden) {
      const answer = placements[item.relationId];
      if (!answer) continue;
      const result = gradeReconstruction(map, item.relationId, answer);
      graded[item.relationId] = { grade: result.grade, feedback: result.feedback };
    }
    setGrades(graded);
    // A reconstrução vira evidência pela mesma porta da recuperação ativa: o que
    // ela montou é avaliado por evaluateRetrievalAnswer, então o Caderno de Erros
    // e as revisões leem exatamente o que o mapa leu.
    if (question && Object.keys(placements).length > 0) {
      const written = Object.values(placements).join('. ');
      const evaluation = evaluateRetrievalAnswer(question, written);
      update(summary.id, (current) => applySummaryAttempt({ [summary.id]: current }, summary, question, { answer: written, ...evaluation })[summary.id]);
    }
  };

  const submitRecall = () => {
    if (!question || !draft.trim()) return;
    const evaluation = evaluateRetrievalAnswer(question, draft);
    update(summary.id, (current) => applySummaryAttempt({ [summary.id]: current }, summary, question, { answer: draft, ...evaluation })[summary.id]);
    setFeedback({ matched: evaluation.matchedElements, missing: evaluation.firstMissingElement });
  };

  const noteClass = (grade: ReconstructionGrade) =>
    grade === 'correta' ? 'vs-note vs-note--right' : grade === 'parcial' ? 'vs-note vs-note--near' : 'vs-note vs-note--wrong';

  return (
    <div className="crivo-visual">
      <button className="vs-back" onClick={() => setSearchParams({})}><ArrowLeft aria-hidden="true" size={13} />Voltar ao Visual</button>

      {syncError && <p role="alert" className="vs-note vs-note--near">{syncError}</p>}

      <header>
        <p className="vs-kicker"><i aria-hidden="true" />{summary.subject} · {summary.topic}</p>
        <h1>{summary.title}</h1>
        <p className="vs-lede">{summary.overview}</p>
        {summary.prerequisites.length > 0 && (
          <p className="vs-meta" style={{ marginTop: 14 }}>Pré-requisitos · {summary.prerequisites.join(' · ')}</p>
        )}
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
        <div role="tablist" aria-label="Modo de estudo" className="vs-modes">
          {(Object.keys(MODE_LABEL) as Mode[]).map((key) => (
            <button key={key} role="tab" aria-selected={mode === key} onClick={() => setMode(key)}>{MODE_LABEL[key]}</button>
          ))}
        </div>
        <p className="vs-dim" style={{ margin: 0 }}>{MODE_HINT[mode]}</p>
      </div>

      {intervention && (
        <section className="vs-panel" style={{ borderColor: 'color-mix(in srgb, var(--primary) 48%, transparent)' }}>
          <p className="vs-kicker"><i aria-hidden="true" />Intervenção mínima eficaz</p>
          <h2 style={{ marginTop: 10 }}>Menor lacuna que explica o problema</h2>
          {/* Aponta o elo, não manda rever o capítulo inteiro. */}
          <p style={{ marginTop: 10 }}>{displayLabel(intervention.label)} — {intervention.why}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <StateChip state={intervention.state} />
            <span className="vs-meta">{CONFIDENCE_LABEL[intervention.confidence]}</span>
          </div>
          <div className="vs-actions">
            <button className="vs-primary" onClick={() => setMode('reconstruir')}>{intervention.action}</button>
          </div>
        </section>
      )}

      <div className="vs-stage">
        <main style={{ display: 'grid', gap: 18, minWidth: 0 }}>
          <Plate map={map} states={states} selectedId={selectedNode} onSelect={setSelectedNode} hiddenEdgeIds={hiddenEdgeIds} />

          {/* Atalhos de intenção da proposta: a estudante diz o que quer, em vez
              de traduzir sozinha "estou perdida" num modo de estudo. */}
          {mode === 'explorar' && (
            <div className="vs-intents">
              <button className="vs-ghost" onClick={() => setMode('testar')}>Estudar melhor.</button>
              <button className="vs-ghost" onClick={() => setMode('reconstruir')}>Ir além.</button>
            </div>
          )}

          {mode === 'testar' && (
            <section className="vs-panel">
              <p className="vs-kicker"><i aria-hidden="true" />Recuperação sem consulta</p>
              {question ? (
                <>
                  <h2 style={{ margin: '10px 0 0' }}>{question.prompt}</h2>
                  <div style={{ marginTop: 14 }}>
                    <textarea
                      aria-label="Sua resposta"
                      rows={5}
                      value={draft}
                      onChange={(event) => { setDraft(event.target.value); setFeedback(null); }}
                      placeholder="Reconstrua a relação entre os conceitos, sem voltar ao texto…"
                    />
                  </div>
                  <details style={{ marginTop: 10 }}>
                    <summary className="vs-meta" style={{ cursor: 'pointer' }}>Preciso de uma pista</summary>
                    <p className="vs-dim">{question.hint}</p>
                  </details>
                  <div className="vs-actions">
                    <button className="vs-primary" disabled={!draft.trim()} onClick={submitRecall}>Enviar para correção</button>
                  </div>
                  {feedback && (
                    <div role="status" className={noteClass(feedback.missing ? (feedback.matched.length ? 'parcial' : 'incorreta') : 'correta')} style={{ marginTop: 14 }}>
                      <p style={{ margin: 0 }}><strong>Você preservou:</strong> {feedback.matched.length ? feedback.matched.map(displayLabel).join(', ') : 'ainda nenhuma relação identificável'}</p>
                      {feedback.missing
                        ? <p style={{ marginBottom: 0 }}><strong>Primeiro elo ausente:</strong> {displayLabel(feedback.missing)}.</p>
                        : <p style={{ marginBottom: 0 }}><strong>Estrutura essencial completa.</strong> {question.transferPrompt}</p>}
                    </div>
                  )}
                </>
              ) : (
                <p className="vs-dim">Este capítulo ainda não tem pergunta de recuperação.</p>
              )}
            </section>
          )}

          {mode === 'reconstruir' && (
            <section className="vs-panel">
              <p className="vs-kicker"><i aria-hidden="true" />Reconstrução ativa</p>
              {hidden.length === 0 ? (
                <p className="vs-dim" style={{ marginTop: 10 }}>Não há relação para ocultar neste capítulo.</p>
              ) : (
                <>
                  <h2 style={{ margin: '10px 0 0' }}>O CRIVO ocultou primeiro as relações em que suas evidências são mais frágeis.</h2>
                  <div className="vs-actions">
                    <button className="vs-ghost" onClick={() => setShowWhyHidden((value) => !value)} aria-expanded={showWhyHidden}>
                      <HelpCircle aria-hidden="true" size={13} />Por que estas?
                    </button>
                  </div>
                  {showWhyHidden && (
                    <ul className="vs-relations">
                      {hidden.map((item) => <li key={item.relationId} className="vs-dim">{item.reason}</li>)}
                    </ul>
                  )}

                  <ol style={{ display: 'grid', gap: 12, margin: '16px 0 0', padding: 0, listStyle: 'none' }}>
                    {hidden.map((item, index) => {
                      const graded = grades[item.relationId];
                      return (
                        <li key={item.relationId} className="vs-gap">
                          <p className="vs-meta" style={{ margin: 0 }}>Lacuna {index + 1}</p>
                          <h3 style={{ marginTop: 7 }}>Qual relação preenche este elo?</h3>
                          <div className="vs-bank">
                            {bank.map((label) => {
                              const chosen = placements[item.relationId] === label;
                              const takenElsewhere = !chosen && usedLabels.includes(label);
                              return (
                                <button
                                  key={label}
                                  className="vs-ghost"
                                  disabled={takenElsewhere}
                                  aria-pressed={chosen}
                                  onClick={() => place(item.relationId, label)}
                                >
                                  {displayLabel(label)}
                                </button>
                              );
                            })}
                          </div>
                          {graded && <p role="status" className={noteClass(graded.grade)} style={{ marginTop: 12, marginBottom: 0 }}>{graded.feedback}</p>}
                        </li>
                      );
                    })}
                  </ol>

                  <div className="vs-actions">
                    <button className="vs-primary" disabled={Object.keys(placements).length === 0} onClick={submitReconstruction}>Conferir reconstrução</button>
                    <button
                      className="vs-ghost"
                      disabled={history.length === 0}
                      onClick={() => { setPlacements(history[history.length - 1]); setHistory((items) => items.slice(0, -1)); setGrades({}); }}
                    >
                      <Undo2 aria-hidden="true" size={13} />Desfazer
                    </button>
                    <button className="vs-ghost" onClick={() => { setPlacements({}); setHistory([]); setGrades({}); }}>
                      <RotateCcw aria-hidden="true" size={13} />Reiniciar
                    </button>
                  </div>
                </>
              )}
            </section>
          )}
        </main>

        <aside className="vs-aside">
          <Inspector
            map={map}
            summary={summary}
            nodeId={selectedNode}
            answers={answers}
            disagreed={disagreed}
            onDisagree={() => setDisagreed((value) => !value)}
            onTest={() => setMode('testar')}
            onRebuild={() => setMode('reconstruir')}
            onOpenSummary={(sectionId) => navigate(`/resumos?summary=${encodeURIComponent(summary.id)}#${sectionId}`)}
          />
          <div className="vs-panel">
            <p className="vs-meta">Legenda dos estados</p>
            <ul className="vs-legend">
              {(Object.keys(NODE_STATE_LABEL) as NodeState[]).map((state) => (
                <li key={state} data-state={state}>
                  <span className="vs-swatch" aria-hidden="true" />{NODE_STATE_LABEL[state]}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
