import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Compass, HelpCircle, RotateCcw, Search, Undo2, Waypoints, X } from 'lucide-react';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { evaluateRetrievalAnswer } from '../lib/summaryEngine';
import { applySummaryAttempt } from '../lib/summaryStudy';
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { CONFIDENCE_LABEL } from '../lib/confidence';
import {
  buildVisualMap, chooseHiddenRelations, explainRelation, gradeReconstruction, minimalIntervention,
  nodeState, relationEvidence, relationState, NODE_STATE_LABEL, RELATION_LABEL,
  STAGE_LABEL,
  type NodeState, type ReconstructionGrade, type VisualMap,
} from '../lib/visualStudy';
import type { InteractiveSummary, RetrievalAttempt } from '../types/summary';
import { findBoard, supportsIllustratedBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';
import { ConceptChain } from './ConceptChain';
import { VisualJourney } from './VisualJourney';
import { MOTION_DURATION } from '../design-system/motion/tokens';
import './Visual.css';

type Mode = 'explorar' | 'testar' | 'reconstruir';

const MODE_LABEL: Record<Mode, string> = { explorar: 'Explorar', testar: 'Testar', reconstruir: 'Reconstruir' };
const MODE_HINT: Record<Mode, string> = {
  explorar: 'Observe a cena e percorra as etapas. Depois, teste o que aprendeu.',
  testar: 'Recupere sem consultar. O que você escrever vira evidência.',
  reconstruir: 'Recomponha os elos que o diagnóstico escondeu.',
};
const NODE_H = 62;
const NODE_GAP = 46;
const PLATE_W = 380;

function ModeGlyph({ mode }: { mode: Mode }) {
  if (mode === 'explorar') return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="m14.8 8.8-1.7 4.3-4.3 1.7 1.7-4.3 4.3-1.7Z" /><circle cx="12" cy="12" r="1" /></svg>
  );
  if (mode === 'testar') return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.5V6.8L12 3l7 3.8v11.7L12 22l-7-3.5Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>
  );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.3" /><circle cx="19" cy="6" r="2.3" /><circle cx="19" cy="18" r="2.3" /><path d="m7.2 11.1 9.6-4.2M7.2 12.9l9.6 4.2" /></svg>
  );
}

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




function VisualLibrary({ onOpen }: { onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [limit, setLimit] = useState(60);
  const subjects = useMemo(() => [...new Set(interactiveSummaries.map((item) => item.subject))].sort(), []);
  const list = useMemo(() => {
    const folded = query.trim().toLowerCase();
    return interactiveSummaries
      .filter((item) => (subject ? item.subject === subject : true))
      .filter((item) => !folded || `${item.title} ${item.topic}`.toLowerCase().includes(folded));
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
            onChange={(event) => { setSubject(event.target.value); setLimit(60); }}
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
              onChange={(event) => { setQuery(event.target.value); setLimit(60); }}
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
          {list.slice(0, limit).map((item) => (
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
      <p role="status">{Math.min(limit, list.length)} de {list.length} capítulos</p>
      {limit < list.length && <button className="vs-diagnostic-button" onClick={() => setLimit(value => value + 60)}>Mostrar mais capítulos</button>}
    </div>
  );
}


function Inspector({
  map, summary, nodeId, answers, onOpenSummary, onDisagree, disagreed, onClose, onModeChange,
}: {
  map: VisualMap;
  summary: InteractiveSummary;
  nodeId: string | null;
  answers: RetrievalAttempt[];
  onOpenSummary: (sectionId: string) => void;
  onDisagree: () => void;
  disagreed: boolean;
  onClose: () => void;
  onModeChange: (mode: Mode) => void;
}) {
  const node = map.nodes.find((item) => item.id === nodeId);
  if (!node) return null;
  const section = summary.sections.find((item) => item.id === node.sectionId);

  return (
    <div className="vs-inspector" role="dialog" aria-label="Conceito selecionado">
      <div className="vs-inspector-head">
        <div>
          <span>Conceito selecionado</span>
          <h3>{node.label}</h3>
        </div>
        <button type="button" className="vs-icon-button" onClick={onClose} aria-label="Fechar inspetor">
          <X aria-hidden="true" />
        </button>
      </div>

      <p className="vs-inspector-excerpt">{node.excerpt}</p>

      <section className="vs-inspector-learning">
        <h4>Expectativa de aprendizagem</h4>
        <p>{section?.callout ?? summary.retrieval.find(item => item.sectionId === section?.id)?.prompt ?? summary.overview}</p>
      </section>

      <section>
        <h4>Por que isso?</h4>
        <ul className="vs-relation-list">
          {map.relations.map((relation) => {
            const why = explainRelation(relation, answers);
            return (
              <li key={relation.id}>
                <div>
                  <strong>{displayLabel(relation.label)}</strong>
                  <StateBadge state={why.state} />
                </div>
                <p>{CONFIDENCE_LABEL[why.confidence]} · {why.evidence.join(' ')}</p>
                {why.caveat && <p className="vs-caveat">{why.caveat}</p>}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="vs-inspector-actions" aria-label="Ações do conceito">
        <button type="button" onClick={() => onOpenSummary(node.sectionId)}>Explicar</button>
        <button type="button" onClick={() => onOpenSummary(node.sectionId)}>Comparar</button>
        <button type="button" onClick={() => onModeChange('testar')}>Testar</button>
        <button type="button" onClick={() => onModeChange('reconstruir')}>Reconstruir</button>
      </div>

      <button type="button" className="vs-diagnostic-button" onClick={onDisagree} aria-pressed={disagreed}>
        {disagreed ? 'Discordância registrada' : 'Discordo deste diagnóstico'}
      </button>

      {disagreed && (
        <p role="status" className="vs-disagree-note">
          Anotado. O estado continua como hipótese até uma nova evidência em Testar ou Reconstruir.
        </p>
      )}

      {section?.callout && <p className="vs-callout">{section.callout}</p>}
    </div>
  );
}

export default function Visual() {
  const reducedMotion = useReducedMotion();
  const { progress, update, loading, syncError } = useSummaryProgress();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const summaryId = searchParams.get('summary');
  const [mode, setMode] = useState<Mode>('explorar');
  const [journeyStep, setJourneyStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [disagreed, setDisagreed] = useState(false);
  const [mostrarDominio, setMostrarDominio] = useState(false);
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

  const changeMode = (next: Mode) => {
    setMode(next);
    setSelectedNode(null);
    setDisagreed(false);
  };

  // Trocar de capítulo tem de limpar a mesa: manter resposta e peças da anterior
  // faria a reconstrução corrigir o texto errado contra o mapa novo.
  useEffect(() => {
    setJourneyStep(0); setMode('explorar'); setSelectedNode(null); setDisagreed(false); setDraft(''); setFeedback(null);
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


  // A prancha vem do registro, não de um componente fixo: é o que permite
  // ilustrar um capítulo novo sem tocar nesta tela. Cena autoral primeiro;
  // instrumento manipulável quando não há cena desenhada para o capítulo.
  //
  // Antes daqui saía um `return` que descartava a tela inteira quando não havia
  // prancha — e não era só a ilustração que sumia: iam junto o mapa, os três
  // modos e o diagnóstico, em 576 dos 613 capítulos. O aviso agora é uma peça
  // dentro da tela, não a tela.
  const Plate = (findBoard(summary) ?? findInstrument(summary))?.Component ?? null;

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
    <div className="crivo-visual pb-16">
      <header className="vs-topic-bar">
        <button onClick={() => setSearchParams({})} className="vs-back-button" aria-label="Voltar à biblioteca visual">
          <ArrowLeft aria-hidden="true" />
        </button>
        <div className="vs-topic-identity">
          <span>{summary.subject} / {summary.topic}</span>
          <strong>{summary.title}</strong>
        </div>
        <span className="vs-hand-note" aria-hidden="true">Explore. Conecte.<br />Compreenda de verdade.</span>
      </header>

      {syncError && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{syncError}</div>}

      <div className="vs-study-toolbar">
      <div className="vs-mode-row">
      <div role="tablist" aria-label="Modo de estudo" className="vs-modes">
        {(Object.keys(MODE_LABEL) as Mode[]).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            onClick={() => changeMode(key)}
            className="transition"
          >
            <ModeGlyph mode={key} />
            {MODE_LABEL[key]}
          </button>
        ))}
      </div>

      {/* "Mostrar domínio": a leitura do capítulo inteiro de uma vez, em vez de
          nó por nó pelo inspetor. Não é dado novo — é o mesmo `states` que já
          colore cada cartão, reunido numa lista com a legenda ao lado. Sem a
          legenda, a cor sozinha não diz o que significa para quem abriu a tela
          pela primeira vez. */}
      <button
        type="button"
        className="vs-domain-toggle"
        aria-pressed={mostrarDominio}
        onClick={() => setMostrarDominio((v) => !v)}
      >
        <span className="vs-domain-switch" aria-hidden="true" />
        Mostrar domínio
      </button>
      </div>
      <p className="vs-mode-hint">{MODE_HINT[mode]}</p>
      </div>

      {mostrarDominio && (
        <section className="vs-domain" aria-label="Domínio de cada conceito do capítulo">
          <ol>
            {map.nodes.map((no) => {
              const estado = states[no.id] ?? 'nao-avaliado';
              return (
                <li key={no.id} data-state={estado}>
                  <span className="vs-swatch" aria-hidden="true" />
                  <b>{no.label}</b>
                  <span>{NODE_STATE_LABEL[estado]}</span>
                </li>
              );
            })}
          </ol>
          <div className="vs-domain-legend">
            <span className="vs-domain-legend-title">Legenda dos estados</span>
            <ul>
              {(Object.keys(NODE_STATE_LABEL) as NodeState[]).map((estado) => (
                <li key={estado} data-state={estado}>
                  <span className="vs-swatch" aria-hidden="true" />{NODE_STATE_LABEL[estado]}
                </li>
              ))}
            </ul>
            {/* A regressão fica fora da escada de propósito (NODE_STATE_RANK):
                é alerta sobre um degrau perdido, não um degrau a mais. */}
            <p>Possível regressão não é um degrau da escada: é aviso de que um degrau já alcançado deixou de aparecer na evidência.</p>
          </div>
        </section>
      )}

      <div data-study-mode={mode} className={`vs-workspace${!selectedNode && !intervention ? ' vs-workspace--solo' : ''}`}>
        <motion.main key={mode} className="vs-main" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : MOTION_DURATION.component }}>
          {mode === 'explorar' && Plate ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={summary.id}
                initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <Plate map={map} states={states} selectedId={selectedNode} onSelect={setSelectedNode} hiddenEdgeIds={hiddenEdgeIds} mode={mode} />
              </motion.div>
            </AnimatePresence>
          ) : null}

          {mode === 'explorar' && <VisualJourney key={summary.id} summary={summary} initialIndex={journeyStep} onStepChange={setJourneyStep} onPractice={() => changeMode('testar')} />}


          {mode !== 'testar' && <ConceptChain
            map={map}
            states={states}
            selectedId={selectedNode}
            onSelect={setSelectedNode}
            hiddenEdgeIds={hiddenEdgeIds}
            escondendo={mode === 'reconstruir'}
          />}

          {/* Quantas conexões o diagnóstico escondeu. Vivia dentro da prancha
              adiabática — a única das 26 que não usava o BoardShell —, então
              valia para um capítulo só. Aqui vale para todos, e a frase sobre
              "responder sem consultar" saiu porque o MODE_HINT acima já a diz. */}
          {mode === 'reconstruir' && hiddenEdgeIds.length > 0 && (
            <p className="vs-active-mode-note" role="status">
              {hiddenEdgeIds.length === 1
                ? '1 conexão frágil priorizada para reconstrução.'
                : `${hiddenEdgeIds.length} conexões frágeis priorizadas para reconstrução.`}
            </p>
          )}

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
                        <li
                          key={item.relationId}
                          className="vs-gap rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                          onDragOver={(event) => {
                            if (event.dataTransfer.types.includes('text/plain')) event.preventDefault();
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            const label = event.dataTransfer.getData('text/plain');
                            if (bank.includes(label)) place(item.relationId, label);
                          }}
                        >
                          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Lacuna {index + 1}</p>
                          <p className="mt-1 text-sm">Qual relação preenche este elo?</p>
                          <div className="vs-drop-target" aria-live="polite">
                            <span aria-hidden="true">{placements[item.relationId] ? '✓' : '↳'}</span>
                            {placements[item.relationId]
                              ? displayLabel(placements[item.relationId])
                              : 'Arraste uma relação para este espaço'}
                          </div>
                          <div className="vs-bank mt-3 flex flex-wrap gap-2">
                            {bank.map((label) => {
                              const chosen = placements[item.relationId] === label;
                              const takenElsewhere = !chosen && usedLabels.includes(label);
                              return (
                                <button
                                  key={label}
                                  disabled={takenElsewhere}
                                  draggable={!takenElsewhere}
                                  aria-pressed={chosen}
                                  onDragStart={(event) => {
                                    event.dataTransfer.effectAllowed = 'move';
                                    event.dataTransfer.setData('text/plain', label);
                                  }}
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
        </motion.main>


        {mode === 'explorar' && selectedNode ? (
          <aside className="vs-inspector-shell">
            <Inspector
              map={map}
              summary={summary}
              nodeId={selectedNode}
              answers={answers}
              disagreed={disagreed}
              onClose={() => setSelectedNode(null)}
              onDisagree={() => setDisagreed((value) => !value)}
              onModeChange={changeMode}
              onOpenSummary={(sectionId) => navigate('/resumos?summary=' + encodeURIComponent(summary.id) + '#' + sectionId)}
            />
          </aside>
        ) : mode === 'explorar' && intervention ? (
          <aside className="vs-priority-panel">
            <span className="vs-priority-kicker"><Compass aria-hidden="true" /> Diagnóstico vivo</span>
            <h2>Seu próximo elo</h2>
            <StateBadge state={intervention.state} />
            <p><strong>{displayLabel(intervention.label)}</strong></p>
            <p>{intervention.why}</p>
            <small>{CONFIDENCE_LABEL[intervention.confidence]}</small>
            <button type="button" onClick={() => changeMode('reconstruir')}>{intervention.action}</button>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
