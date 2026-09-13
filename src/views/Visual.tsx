import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Compass, HelpCircle, Layers, RotateCcw, Search, Undo2, Waypoints } from 'lucide-react';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { evaluateRetrievalAnswer } from '../lib/summaryEngine';
import { applySummaryAttempt } from '../lib/summaryStudy';
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { CONFIDENCE_LABEL } from '../lib/confidence';
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

const NODE_H = 62;
const NODE_GAP = 46;
const PLATE_W = 380;

function plateGeometry(count: number) {
  const nodes = Array.from({ length: count }, (_, index) => ({ y: 10 + index * (NODE_H + NODE_GAP) }));
  return { nodes, height: 20 + count * NODE_H + Math.max(0, count - 1) * NODE_GAP };
}

// O texto do nó é o título da seção e não cabe numa linha só do SVG. Quebrar em
// JS (em vez de confiar num <foreignObject>) mantém a prancha exportável e
// legível no Safari do iPad, onde o foreignObject some na impressão.
function wrapLabel(label: string, perLine = 34): string[] {
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > perLine && current) { lines.push(current); current = word; }
    else current = candidate;
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

// Os rótulos das relações vêm de `expectedElements[].label`, em caixa baixa e
// sem acento. Não dá para corrigir o dado: o mesmo texto é gravado em
// `matchedElements` a cada tentativa, e renomeá-lo orfanaria a evidência já
// registrada no Caderno de Erros. Então a correção é só de exibição, e só da
// inicial — devolver acento por regra inventaria grafia.
const displayLabel = (label: string) => label.charAt(0).toUpperCase() + label.slice(1);

function StateBadge({ state }: { state: NodeState }) {
  return (
    <span data-state={state} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-xs font-semibold">
      <span className="vs-swatch" aria-hidden="true" />
      {NODE_STATE_LABEL[state]}
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
  const geometry = plateGeometry(map.nodes.length);
  return (
    <div className="vs-plate p-3 sm:p-4">
      <p className="px-1 pb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--vs-plate-dim)' }}>
        {map.subject} › {map.centerLabel}
      </p>
      <svg viewBox={`0 0 ${PLATE_W} ${geometry.height}`} role="img" aria-label={`Mapa de relações de ${map.title}`}>
        {map.edges.map((edge, index) => {
          const top = geometry.nodes[index].y + NODE_H;
          const bottom = geometry.nodes[index + 1].y;
          const hidden = hiddenEdgeIds.includes(edge.id);
          return (
            <g key={edge.id} className={`vs-edge${hidden ? ' is-hidden' : ''}`}>
              <line x1={PLATE_W / 2} y1={top} x2={PLATE_W / 2} y2={bottom} />
              <text x={PLATE_W / 2 + 8} y={(top + bottom) / 2 + 3}>
                {hidden ? '???' : RELATION_LABEL[edge.kind]}
              </text>
            </g>
          );
        })}
        {map.nodes.map((node, index) => {
          const state = states[node.id] ?? 'nao-avaliado';
          const lines = wrapLabel(node.label);
          const y = geometry.nodes[index].y;
          return (
            <g
              key={node.id}
              className="vs-node"
              data-state={state}
              role="button"
              tabIndex={0}
              aria-pressed={selectedId === node.id}
              aria-label={`${node.label} — ${NODE_STATE_LABEL[state]}`}
              onClick={() => onSelect(node.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(node.id); }
              }}
            >
              <rect x={30} y={y} width={PLATE_W - 60} height={NODE_H} rx={12} />
              <text className="vs-node-stage" x={44} y={y + 19}>{STAGE_LABEL[node.stage]}</text>
              {lines.map((line, lineIndex) => (
                <text key={line} x={44} y={y + 38 + lineIndex * 15}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
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
    <div className="space-y-5">
      <header className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-8">
        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">
          <Waypoints className="mr-2 h-3.5 w-3.5" aria-hidden="true" />Visual
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">Veja as relações antes de decorar as respostas.</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Mapa para compreender relações. Recuperação ativa para consolidar. A evidência que você produz
          aqui é a mesma que alimenta o Caderno de Erros e as suas revisões.
        </p>
      </header>

      {/* Mais de sessenta tópicos não cabem em fileira de chips: campo agrupado. */}
      <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-zinc-600 dark:text-zinc-400">Disciplina</span>
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-transparent px-3 py-2.5 dark:border-zinc-700"
          >
            <option value="">Todas</option>
            {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-zinc-600 dark:text-zinc-400">Buscar capítulo</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Termodinâmica, Revolução Francesa…"
              className="w-full rounded-xl border border-zinc-300 bg-transparent py-2.5 pl-9 pr-3 dark:border-zinc-700"
            />
          </span>
        </label>
      </div>

      {list.length === 0 ? (
        <p role="status" className="rounded-2xl border border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800">
          Nenhum capítulo encontrado com esses filtros.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onOpen(item.id)}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {item.subject} · {item.topic}
                </span>
                <span className="mt-1 block font-bold">{item.title}</span>
                <span className="mt-1 block text-sm text-zinc-500">{item.sections.length} nós · {item.retrieval[0]?.expectedElements.length ?? 0} relações</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Inspector({
  map, summary, nodeId, answers, onOpenSummary, onDisagree, disagreed,
}: {
  map: VisualMap;
  summary: InteractiveSummary;
  nodeId: string | null;
  answers: RetrievalAttempt[];
  onOpenSummary: (sectionId: string) => void;
  onDisagree: () => void;
  disagreed: boolean;
}) {
  const node = map.nodes.find((item) => item.id === nodeId);
  if (!node) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 p-5 text-sm text-zinc-500 dark:border-zinc-700">
        Selecione um nó da prancha para ver o diagnóstico que sustenta o estado dele.
      </p>
    );
  }
  const section = summary.sections.find((item) => item.id === node.sectionId);
  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{STAGE_LABEL[node.stage]}</p>
        <h3 className="mt-1 text-lg font-bold">{node.label}</h3>
      </div>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{node.excerpt}</p>

      <section>
        <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Relações avaliadas neste capítulo</h4>
        <ul className="mt-2 space-y-2">
          {map.relations.map((relation) => {
            const why = explainRelation(relation, answers);
            return (
              <li key={relation.id} className="rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{displayLabel(relation.label)}</span>
                  <StateBadge state={why.state} />
                </div>
                <p className="mt-1.5 text-xs text-zinc-500">{CONFIDENCE_LABEL[why.confidence]} · {why.evidence.join(' ')}</p>
                {/* Hipótese aparece como hipótese: com evidência rasa o texto diz
                    que o diagnóstico ainda pode mudar, em vez de afirmar domínio. */}
                {why.caveat && <p className="mt-1.5 text-xs italic text-amber-700 dark:text-amber-300">{why.caveat}</p>}
              </li>
            );
          })}
          {map.relations.length === 0 && (
            <li className="text-sm text-zinc-500">Este capítulo ainda não tem pergunta de recuperação, então não há relação avaliável.</li>
          )}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onOpenSummary(node.sectionId)}
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Ler a seção no resumo
        </button>
        <button
          onClick={onDisagree}
          aria-pressed={disagreed}
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Discordo deste diagnóstico
        </button>
      </div>
      {/* A IA recomenda; a estudante decide. Discordar não apaga a evidência —
          registra que ela pede nova medida antes de aceitar o estado. */}
      {disagreed && (
        <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          Anotado. O estado continua visível como hipótese: faça uma reconstrução em Testar ou Reconstruir
          para produzir a evidência nova que muda o diagnóstico.
        </p>
      )}
      {section?.callout && (
        <p className="rounded-xl bg-zinc-100 p-3 text-sm dark:bg-zinc-800">{section.callout}</p>
      )}
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
    return <div role="status" className="py-24 text-center text-zinc-500"><Waypoints className="mx-auto mb-3 h-8 w-8 animate-pulse" />Carregando o mapa e suas evidências…</div>;
  }

  if (!summaryId || !map || !summary) {
    if (summaryId && !summary) {
      return (
        <div className="crivo-visual space-y-5">
          <button onClick={() => setSearchParams({})} className="inline-flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300">
            <ArrowLeft className="mr-2 h-4 w-4" />Voltar ao Visual
          </button>
          <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/20">
            <h1 className="font-bold">Capítulo indisponível</h1>
            <p className="mt-2 text-sm">Este capítulo não existe mais. O histórico de evidências continua no Caderno de Erros.</p>
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

  return (
    <div className="crivo-visual space-y-6 pb-16">
      <button onClick={() => setSearchParams({})} className="inline-flex items-center text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">
        <ArrowLeft className="mr-2 h-4 w-4" />Voltar ao Visual
      </button>

      {syncError && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{syncError}</div>}

      <header className="rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{summary.subject} · {summary.topic}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{summary.title}</h1>
        <p className="mt-3 max-w-3xl text-zinc-300">{summary.overview}</p>
        {summary.prerequisites.length > 0 && (
          <p className="mt-4 text-sm text-zinc-400">
            <Layers className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
            Pré-requisitos: {summary.prerequisites.join(' · ')}
          </p>
        )}
      </header>

      <div role="tablist" aria-label="Modo de estudo" className="vs-modes flex flex-wrap gap-2">
        {(Object.keys(MODE_LABEL) as Mode[]).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              mode === key ? 'bg-indigo-600 text-white' : 'border border-zinc-300 dark:border-zinc-700'
            }`}
          >
            {MODE_LABEL[key]}
          </button>
        ))}
      </div>
      <p className="-mt-3 text-sm text-zinc-500">{MODE_HINT[mode]}</p>

      {intervention && (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <Compass className="h-4 w-4 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <h2 className="font-bold">Menor lacuna que explica o problema</h2>
            <StateBadge state={intervention.state} />
          </div>
          {/* Intervenção mínima eficaz: aponta o elo, não manda rever o capítulo. */}
          <p className="mt-2 text-sm">{displayLabel(intervention.label)} — {intervention.why}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{CONFIDENCE_LABEL[intervention.confidence]}</p>
          <button onClick={() => setMode('reconstruir')} className="mt-3 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
            {intervention.action}
          </button>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-5">
          <Plate map={map} states={states} selectedId={selectedNode} onSelect={setSelectedNode} hiddenEdgeIds={hiddenEdgeIds} />

          {mode === 'testar' && (
            <section className="rounded-2xl border-2 border-indigo-200 bg-white p-5 dark:border-indigo-900 dark:bg-zinc-900">
              <h2 className="font-bold">Recuperação sem consulta</h2>
              {question ? (
                <>
                  <p className="mt-2 font-semibold">{question.prompt}</p>
                  <textarea
                    aria-label="Sua resposta"
                    rows={5}
                    value={draft}
                    onChange={(event) => { setDraft(event.target.value); setFeedback(null); }}
                    placeholder="Reconstrua a relação entre os conceitos, sem voltar ao texto…"
                    className="mt-3 w-full rounded-xl border border-zinc-300 bg-transparent p-3 dark:border-zinc-700"
                  />
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-zinc-500">Preciso de uma pista</summary>
                    <p className="mt-2 text-sm">{question.hint}</p>
                  </details>
                  <button
                    disabled={!draft.trim()}
                    onClick={submitRecall}
                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white disabled:opacity-40"
                  >
                    Enviar para correção
                  </button>
                  {feedback && (
                    <div role="status" className="mt-4 rounded-xl bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
                      <p><strong>Você preservou:</strong> {feedback.matched.length ? feedback.matched.join(', ') : 'ainda nenhuma relação identificável'}</p>
                      {feedback.missing
                        ? <p className="mt-2 text-amber-700 dark:text-amber-300"><strong>Primeiro elo ausente:</strong> {feedback.missing}.</p>
                        : <p className="mt-2 text-emerald-700 dark:text-emerald-300"><strong>Estrutura essencial completa.</strong> {question.transferPrompt}</p>}
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">Este capítulo ainda não tem pergunta de recuperação.</p>
              )}
            </section>
          )}

          {mode === 'reconstruir' && (
            <section className="rounded-2xl border-2 border-indigo-200 bg-white p-5 dark:border-indigo-900 dark:bg-zinc-900">
              <h2 className="font-bold">Reconstrução ativa</h2>
              {hidden.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">Não há relação para ocultar neste capítulo.</p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    O CRIVO ocultou primeiro as relações em que suas evidências são mais frágeis.
                  </p>
                  <button
                    onClick={() => setShowWhyHidden((value) => !value)}
                    aria-expanded={showWhyHidden}
                    className="mt-1 inline-flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300"
                  >
                    <HelpCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />Por que estas?
                  </button>
                  {showWhyHidden && (
                    <ul className="mt-2 space-y-1 rounded-xl bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
                      {hidden.map((item) => <li key={item.relationId}>{item.reason}</li>)}
                    </ul>
                  )}

                  <ol className="mt-4 space-y-4">
                    {hidden.map((item, index) => {
                      const graded = grades[item.relationId];
                      return (
                        <li key={item.relationId} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Lacuna {index + 1}</p>
                          <p className="mt-1 text-sm">Qual relação preenche este elo?</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {bank.map((label) => {
                              const chosen = placements[item.relationId] === label;
                              const takenElsewhere = !chosen && usedLabels.includes(label);
                              return (
                                <button
                                  key={label}
                                  disabled={takenElsewhere}
                                  aria-pressed={chosen}
                                  onClick={() => place(item.relationId, label)}
                                  className={`rounded-lg border px-3 py-1.5 text-sm disabled:opacity-35 ${
                                    chosen ? 'border-indigo-500 bg-indigo-50 font-semibold dark:bg-indigo-950/40' : 'border-zinc-300 dark:border-zinc-700'
                                  }`}
                                >
                                  {displayLabel(label)}
                                </button>
                              );
                            })}
                          </div>
                          {graded && (
                            <p
                              role="status"
                              className={`mt-3 rounded-lg p-3 text-sm ${
                                graded.grade === 'correta' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                                  : graded.grade === 'parcial' ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                                    : 'bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200'
                              }`}
                            >
                              {graded.feedback}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ol>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      disabled={Object.keys(placements).length === 0}
                      onClick={submitReconstruction}
                      className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white disabled:opacity-40"
                    >
                      Conferir reconstrução
                    </button>
                    <button
                      disabled={history.length === 0}
                      onClick={() => { setPlacements(history[history.length - 1]); setHistory((items) => items.slice(0, -1)); setGrades({}); }}
                      className="inline-flex items-center rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium disabled:opacity-40 dark:border-zinc-700"
                    >
                      <Undo2 className="mr-1.5 h-4 w-4" aria-hidden="true" />Desfazer
                    </button>
                    <button
                      onClick={() => { setPlacements({}); setHistory([]); setGrades({}); }}
                      className="inline-flex items-center rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium dark:border-zinc-700"
                    >
                      <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />Reiniciar
                    </button>
                  </div>
                </>
              )}
            </section>
          )}
        </main>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Inspector
            map={map}
            summary={summary}
            nodeId={selectedNode}
            answers={answers}
            disagreed={disagreed}
            onDisagree={() => setDisagreed((value) => !value)}
            onOpenSummary={(sectionId) => navigate(`/resumos?summary=${encodeURIComponent(summary.id)}#${sectionId}`)}
          />
          <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Legenda dos estados</h3>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {(Object.keys(NODE_STATE_LABEL) as NodeState[]).map((state) => (
                <li key={state} data-state={state} className="flex items-center gap-1.5 text-xs">
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
