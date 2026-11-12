import React, { Suspense, useState } from 'react';
import { challengeSectionIndex } from '../lib/visualChallenge';
import { SpatialChapterSupplement, hasSpatialSupplement } from './SpatialChapterSupplement';
import { HumanitiesConcepts } from './HumanitiesConcepts';
import { ChapterSceneFrame } from './ChapterSceneFrame';
import type { NodeState, VisualMap } from '../lib/visualStudy';
import type { InteractiveSummary } from '../types/summary';
import { TopicFallbackVisual } from './TopicFallbackVisual';
import { TopicExperiment } from './topic-experiments/TopicExperiment';
import { TopicScene } from './topic-scenes/TopicScene';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';
import type { VisualRepresentation } from './visualRepresentation';
import { Box, LayoutPanelTop } from 'lucide-react';
import { immersiveSceneFor } from './visual-immersive/registry';
import { ChapterOutline } from './ChapterOutline';

type StudyMode = 'explorar' | 'testar' | 'reconstruir';

interface VisualArtifactProps {
  summary: InteractiveSummary;
  representation: VisualRepresentation;
  map: VisualMap;
  states: Record<string, NodeState>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hiddenEdgeIds: string[];
  mode: StudyMode;
  activeIndex: number;
  onSelectStep: (index: number) => void;
  onPractice?: () => void;
  onReadChallenge?: () => void;
  onReadStep?: () => void;
}

/**
 * The chapter's single visual artifact, separated from the guided reading.
 *
 * This adapter is deliberately the only place that chooses among a board,
 * instrument, experiment, scene, or honest fallback. It lets Explore and
 * Rebuild work on the same object without making a recall answer visible in
 * Test mode.
 */
export function VisualArtifact({
  summary, representation, map, states, selectedId, onSelect, hiddenEdgeIds,
  mode, activeIndex, onSelectStep, onPractice, onReadChallenge, onReadStep,
}: VisualArtifactProps) {
  const Board = representation === 'board'
    ? findBoard(summary)?.Component ?? null
    : representation === 'instrument'
      ? findInstrument(summary)?.Component ?? null
      : null;

  const challengeSection = summary.sections[challengeSectionIndex(summary)];

  // Uma leitura por vez. A página empilhava o esquema plano, o modelo 3D, os
  // conceitos e o mapa: quatro interpretações do mesmo capítulo, de cinco a
  // nove telas de altura, e a Ana Júlia apontou que isso atrapalhava mais do
  // que ajudava — a cena 3D é que devia ser a experiência. Em Explorar o palco
  // 3D abre primeiro e sozinho; o esquema plano continua a um toque, no mesmo
  // lugar, para quem quer a operação que só ele tem (o quadro de Punnett, o
  // gráfico manipulável). Em Reconstruir o esquema continua sendo a cena,
  // porque é ele que sabe esconder os vínculos frágeis.
  const Imersiva = immersiveSceneFor(summary.id);
  const temPalco = mode === 'explorar' && (!!Imersiva || hasSpatialSupplement(summary.id));
  // A escolha vale para o capítulo em que foi feita. Guardada junto do id, ela
  // volta a "cena" já no primeiro quadro do capítulo seguinte; com um efeito
  // para zerá-la, esse quadro ainda saía com o esquema do capítulo anterior.
  const [escolha, setEscolha] = useState<{ id: string; vista: 'cena' | 'esquema' }>({ id: summary.id, vista: 'cena' });
  const vista = escolha.id === summary.id ? escolha.vista : 'cena';
  const setVista = (nova: 'cena' | 'esquema') => setEscolha({ id: summary.id, vista: nova });
  const mostraEsquema = !temPalco || vista === 'esquema';
  // A PCR já tem uma cena própria. O esquema de Biotecnologia organiza os
  // assuntos da leitura, em vez de abrir outro laboratório da mesma reação.
  const mostraPercurso = summary.id === 'summary-biologia-biotecnologia' && mode === 'explorar' && vista === 'esquema';
  const fluxoEnxuto = summary.id === 'summary-biologia-biotecnologia';

  return (
    <div data-visual-representation={representation} data-study-artifact-mode={mode}
      data-humanities-workspace={summary.subject === 'Geografia' ? 'geography' : summary.subject === 'História' ? 'history' : undefined}>
      <ChapterSceneFrame chapterId={summary.id} subject={summary.subject} title={summary.title} topic={summary.topic} showComparison={!mostraPercurso}
        lead={temPalco ? <div className="vs-vista-toggle" role="group" aria-label="Vista do capítulo">
          <button type="button" aria-pressed={vista === 'cena'} onClick={() => setVista('cena')}><Box aria-hidden="true" />Cena 3D</button>
          <button type="button" aria-pressed={vista === 'esquema'} onClick={() => setVista('esquema')}><LayoutPanelTop aria-hidden="true" />Esquema</button>
        </div> : undefined}>
      {closeFocus => <>
      {temPalco && vista === 'cena' && (Imersiva
        ? <Suspense fallback={<p role="status">Preparando a cena…</p>}><Imersiva key={`imersiva-${summary.id}`} onPractice={fluxoEnxuto ? undefined : onPractice} /></Suspense>
        : <SpatialChapterSupplement key={`espacial-${summary.id}`} chapterId={summary.id} />)}
      {mostraPercurso && <ChapterOutline summary={summary} activeIndex={activeIndex} onSelectStep={index => {
        const reading = document.getElementById('visual-chapter-reading');
        closeFocus(); onSelectStep(index);
        requestAnimationFrame(() => {
          if (!reading?.isConnected) return;
          reading.scrollIntoView({ block: 'start' }); reading.focus({ preventScroll: true });
        });
      }} />}
      {mostraEsquema && !mostraPercurso && <>
      {Board && <Board map={map} states={states} selectedId={selectedId} onSelect={id => { closeFocus(); onSelect(id); }} hiddenEdgeIds={hiddenEdgeIds} mode={mode}
        activeStep={activeIndex} onStepChange={onSelectStep} challengeActive={mode !== 'explorar'} focusTarget={selectedId} />}
      {representation === 'experiment' && <TopicExperiment key={summary.id} summaryId={summary.id}
        stage={{ map, sections: summary.sections, activeStep: activeIndex, onStepChange: onSelectStep, selectedId, onSelect, mode, hiddenEdgeIds }} />}
      {representation === 'scene' && <TopicScene key={`cena-${summary.id}`} summaryId={summary.id}
        stage={{ map, sections: summary.sections, activeStep: activeIndex, onStepChange: onSelectStep, selectedId, onSelect, mode, hiddenEdgeIds }} />}
      {representation === 'fallback' && <TopicFallbackVisual summary={summary} activeIndex={activeIndex} onSelectStep={onSelectStep} />}
      {mode === 'explorar' &&
        <HumanitiesConcepts map={map} states={states} selectedId={selectedId} onSelect={id => { closeFocus(); onSelect(id); }} />}
      </>}
      </>}
      </ChapterSceneFrame>
      {mode === 'explorar' && !mostraPercurso && fluxoEnxuto && <section className="vs-reading-handoff" aria-label="Continuar o estudo">
        <div><small>PRÓXIMO PASSO</small><h3>{summary.sections[activeIndex]?.title ?? summary.title}</h3></div>
        {onReadStep && <button type="button" onClick={onReadStep}>Continuar na leitura <span aria-hidden="true">↓</span></button>}
      </section>}
      {mode === 'explorar' && !mostraPercurso && !fluxoEnxuto && <section className="vs-scene-bridge" aria-label="Da cena à compreensão">
        <div><small>RELACIONE COM O CAPÍTULO</small><h3>{summary.sections[activeIndex]?.title ?? summary.title}</h3>
          <p>{map.recallPrompt}</p>
          {challengeSection && <p className="vs-scene-challenge-context">Explicação do desafio: {challengeSection.title}</p>}</div>
        <div className="vs-scene-bridge-actions">
          {/* "Entender esta etapa" só rolava a tela até a leitura, que agora
              vem logo abaixo: era um terceiro botão para um caminho óbvio. */}
          {onReadChallenge && <button type="button" onClick={onReadChallenge}>Entender o desafio</button>}
          {onPractice && <button type="button" onClick={onPractice}>Responder ao desafio</button>}
        </div>
      </section>}

    </div>
  );
}
