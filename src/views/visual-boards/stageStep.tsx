import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Crosshair, Target } from 'lucide-react';
import { STAGE_LABEL, type VisualMap } from '../../lib/visualStudy';
import type { PedagogicalStage } from '../../types/summary';
import {
  challengeReached, changedReadouts, planStageParameters,
  type StageParam, type StageReadout,
} from '../../lib/stageParameters';
import type { StageMode } from '../visual-stage/contract';
import type { BoardProps } from './types';
import './stageStep.css';

/**
 * A etapa do palco chegando à prancha sem passar prop por prop.
 *
 * Os 43 instrumentos e as pranchas autorais montam o `BoardShell` com props
 * explícitas, e nenhum deles repassava `activeStep`: trocar de etapa no trilho
 * mudava o texto ao lado e deixava a cena parada. O `lazyBoard`, por onde toda
 * prancha registrada passa, publica aqui o contrato do palco; o `BoardShell`
 * e os instrumentos leem daqui. Fora do palco (testes que montam a prancha
 * direto, sem `activeStep`), não há contexto e tudo fica como era.
 */
export interface StageStepValue {
  map: VisualMap;
  activeStep: number;
  stage: PedagogicalStage;
  onStepChange?: (step: number) => void;
  onSelect: (nodeId: string) => void;
  mode: StageMode;
}

const StageStepContext = createContext<StageStepValue | null>(null);

export function StageStepProvider({ props, children }: { props: BoardProps; children?: React.ReactNode }) {
  const { map, activeStep, onStepChange, onSelect, mode } = props;
  const value = useMemo<StageStepValue | null>(() => {
    if (activeStep === undefined) return null;
    const step = Math.max(0, Math.min(activeStep, map.nodes.length - 1));
    return { map, activeStep: step, stage: map.nodes[step]?.stage ?? 'intuicao', onStepChange, onSelect, mode };
  }, [map, activeStep, onStepChange, onSelect, mode]);
  return <StageStepContext.Provider value={value}>{children}</StageStepContext.Provider>;
}

export function useStageStep(): StageStepValue | null {
  return useContext(StageStepContext);
}

/** Em Reconstruir a cena é o lugar do desafio, qualquer que seja a etapa. */
function effectiveStage(stage: StageStepValue | null): PedagogicalStage | null {
  if (!stage) return null;
  return stage.mode === 'reconstruir' ? 'exercicio' : stage.stage;
}

export interface StageLensData {
  /** Leituras que mudaram em relação ao estado inicial do instrumento. */
  changes?: { label: string; before: string; after: string }[];
  /** Ponto de virada ou caso-limite que a estratégia mostrou. */
  limit?: string;
  challenge?: { text: string; reached: boolean };
}

/**
 * Parâmetros de instrumento que respondem à etapa (ver `lib/stageParameters`).
 * Mexer no controle continua livre; trocar de etapa leva a cena ao estado
 * daquela etapa, calculado pelo próprio modelo do instrumento.
 */
export function useStageParameters(params: StageParam[], readouts: (values: number[]) => StageReadout[]) {
  const stage = useStageStep();
  const current = effectiveStage(stage);
  const readRef = useRef(readouts);
  readRef.current = readouts;
  const key = JSON.stringify(params.map(({ min, max, step, initial }) => [min, max, step, initial]));
  const plan = useMemo(() => planStageParameters(params, (values) => readRef.current(values)), [key]);
  const [values, setValues] = useState<number[]>(() => (current ? plan.presets[current] : plan.presets.intuicao));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (current) setValues(plan.presets[current]);
  }, [current, plan]);

  const setAt = (index: number, value: number) => setValues((old) => old.map((item, i) => (i === index ? value : item)));
  let lens: StageLensData | undefined;
  if (current) {
    const now = readouts(values);
    const initial = readouts(plan.presets.intuicao);
    const atPreset = JSON.stringify(values) === JSON.stringify(plan.presets[current]);
    lens = {};
    if (current === 'aplicacao' || current === 'estrategia') {
      lens.changes = changedReadouts(initial, now).slice(0, 3);
    }
    if (current === 'estrategia' && plan.limit && atPreset) {
      lens.limit = plan.limit.kind === 'virada'
        ? `Ponto de virada: «${plan.limit.label}» deixa de ser «${plan.limit.from}» e passa a «${plan.limit.to}».`
        : `Caso-limite: no extremo da faixa, «${plan.limit.label}» vai de «${plan.limit.from}» a «${plan.limit.to}».`;
    }
    if (current === 'exercicio' && plan.challenge) {
      lens.challenge = {
        text: `Mexa na cena até «${plan.challenge.label}» marcar «${plan.challenge.target}».`,
        reached: challengeReached(plan.challenge, now),
      };
    }
  }
  return { values, setAt, lens, plan };
}

/** Atalho para o caso de um controle só, que é o da maioria dos instrumentos. */
export function useStageParameter(param: StageParam, readouts: (value: number) => StageReadout[]) {
  const result = useStageParameters([param], (values) => readouts(values[0]));
  return { value: result.values[0], setValue: (value: number) => result.setAt(0, value), lens: result.lens };
}

const STAGE_CUE: Record<PedagogicalStage, string> = {
  intuicao: 'Observe a cena antes de qualquer conta.',
  conceito: 'A relação que governa a cena está no cartão destacado.',
  aplicacao: 'Mesmo modelo, outro dado: compare as leituras.',
  estrategia: 'Onde a leitura engana: o caso que a cena mostra agora.',
  exercicio: 'Faça na cena e explique no desafio.',
};

/** Prancha sem parâmetro: a ação possível na cena é alternar os dois lados do par. */
const CUE_SEM_META = 'Toque nos dois cartões para alternar a cena e explique a diferença no desafio.';

export interface StageLensProps {
  question: string;
  formula?: string;
  reduced?: string;
  closing: string;
  data?: StageLensData;
}

/**
 * A faixa da etapa dentro da cena: diz o que olhar nela agora, com o texto
 * do próprio capítulo (rótulo do nó, pergunta do instrumento, fórmula, ideia
 * central, pergunta de recuperação). Antes essas peças ficavam abaixo da cena
 * — tira de equação, fecho — e a estudante descia a página para lê-las.
 */
export function StageLens({ question, formula, reduced, closing, data }: StageLensProps) {
  const stage = useStageStep();
  if (!stage) return null;
  const { map, activeStep, onStepChange, onSelect, mode } = stage;
  const current = effectiveStage(stage) ?? 'intuicao';
  const node = map.nodes[activeStep];
  const total = map.nodes.length;
  const reconstruindo = mode === 'reconstruir';
  return (
    <section className="vs-stage-lens" data-stage={current} aria-label={`Etapa ${activeStep + 1} na cena`}>
      <header>
        <span className="vs-stage-lens-kicker">
          {reconstruindo ? 'Desafio na cena' : `${String(activeStep + 1).padStart(2, '0')} · ${STAGE_LABEL[current]}`}
        </span>
        {node && !reconstruindo && (
          <button type="button" className="vs-stage-lens-node" onClick={() => onSelect(node.id)} aria-label={`Abrir o conceito: ${node.label}`}>
            <Crosshair aria-hidden="true" /> {node.label}
          </button>
        )}
        {!reconstruindo && onStepChange && (
          <span className="vs-stage-lens-nav">
            <button type="button" onClick={() => onStepChange(activeStep - 1)} disabled={activeStep <= 0} aria-label="Etapa anterior"><ChevronLeft aria-hidden="true" /></button>
            <button type="button" onClick={() => onStepChange(activeStep + 1)} disabled={activeStep >= total - 1} aria-label="Próxima etapa"><ChevronRight aria-hidden="true" /></button>
          </span>
        )}
      </header>
      <div aria-live="polite">
        <p>
          <strong className="vs-stage-lens-cue">{current === 'exercicio' && !data?.challenge ? CUE_SEM_META : STAGE_CUE[current]}</strong>{' '}
          {current === 'intuicao' && question}
          {current === 'conceito' && formula && <code>{formula}</code>}
          {current === 'aplicacao' && reduced && <code>{reduced}</code>}
          {current === 'estrategia' && (data?.limit ?? closing)}
        </p>
        {data?.changes && data.changes.length > 0 && (
          <ul className="vs-stage-lens-changes" aria-label="Leituras que mudaram em relação ao início">
            {data.changes.map((item) => <li key={item.label}><span>{item.label}</span> <s>{item.before}</s> → <strong>{item.after}</strong></li>)}
          </ul>
        )}
        {current === 'exercicio' && (
          <>
            {data?.challenge && (
              <p className="vs-stage-lens-challenge" data-reached={data.challenge.reached || undefined}>
                <Target aria-hidden="true" /> {data.challenge.text}
                {data.challenge.reached && <strong> Chegou: agora diga por que a cena mudou assim.</strong>}
              </p>
            )}
            {map.recallPrompt && <p><strong>Desafio do capítulo:</strong> {map.recallPrompt}</p>}
            <small>A cena é para observar; o que conta como evidência é a sua resposta no desafio.</small>
          </>
        )}
      </div>
    </section>
  );
}
