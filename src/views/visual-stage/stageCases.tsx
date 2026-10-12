import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STAGE_LABEL, type VisualMap } from '../../lib/visualStudy';
import {
  caseForStep, casesRevealing, hiddenRelations, planStageFocus,
  type FocusCandidate, type FocusSection, type StageFocusPlan,
} from '../../lib/stageFocus';
import type { StageMode } from './contract';
import './stageCases.css';

/**
 * Ponte entre o palco e uma cena que escolhe entre "casos" (as geometrias de
 * Geometria Molecular, as câmaras de um atlas, as etapas de um ciclo).
 *
 * As cenas de `topic-scenes` recebiam só o id do capítulo; o palco precisa
 * entregar a etapa ativa e devolver o toque. Em vez de mudar a assinatura de
 * cada família, o `TopicScene` publica este contexto e a família lê com
 * `useStageCases`. Cena fora do palco (testes antigos, outras telas) não acha o
 * contexto e se comporta exatamente como antes.
 *
 * Não há estado próprio de evidência aqui: em Reconstruir a cena só cobre o que
 * entregaria a relação oculta e manda escrever no formulário do palco, que
 * avalia por `evaluateRetrievalAnswer` + `applySummaryAttempt` como sempre.
 */
export interface SceneStageBridge {
  map: VisualMap;
  sections: FocusSection[];
  activeStep: number;
  onStepChange: (step: number) => void;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  mode: StageMode;
  hiddenEdgeIds: string[];
}

export const SceneStageContext = createContext<SceneStageBridge | null>(null);

export function useSceneStage() {
  return useContext(SceneStageContext);
}

export interface StageCaseItem extends FocusCandidate { claim?: string }

export interface StageCases {
  active: number;
  /** Toque da estudante num caso: abre o caso e leva o palco à etapa que o discute. */
  choose: (index: number) => void;
  /** Troca local (reprodução automática, teclado), sem mover o palco. */
  show: (index: number) => void;
  stage: SceneStageBridge | null;
  plan: StageFocusPlan | null;
  step: number;
  /** Casos que a etapa ativa discute. */
  focus: number[];
  /** Casos cuja afirmação entregaria a relação oculta em Reconstruir. */
  veiled: Set<number>;
}

export function useStageCases(items: StageCaseItem[], initial = 0): StageCases {
  const stage = useSceneStage();
  const sections = stage?.sections;
  const plan = useMemo(() => (sections ? planStageFocus(items, sections) : null), [items, sections]);
  const [active, setActive] = useState(initial);
  const step = stage?.activeStep ?? 0;
  const activeRef = useRef(active);
  activeRef.current = active;

  // A etapa manda na cena: trocar de etapa abre o caso que aquela seção mais
  // discute — o mesmo que o ponto de investigação da barra anuncia. A exceção
  // é o toque: tocar num caso leva o palco à etapa dele, e essa etapa não pode
  // trocar o caso tocado pelo mais citado.
  const tocado = useRef<number | null>(null);
  useEffect(() => {
    if (!plan) return;
    const escolhido = tocado.current;
    tocado.current = null;
    const next = escolhido !== null && plan.byStep[step]?.includes(escolhido) ? escolhido : caseForStep(plan, step, null);
    if (next !== null && next !== activeRef.current) setActive(next);
  }, [plan, step]);

  const hiddenKey = stage?.mode === 'reconstruir' ? stage.hiddenEdgeIds.join('|') : '';
  const veiled = useMemo(() => {
    if (!stage || stage.mode !== 'reconstruir' || !hiddenKey) return new Set<number>();
    return new Set(casesRevealing(items, hiddenRelations(stage.map.relations, stage.map.edges, stage.hiddenEdgeIds)));
    // hiddenKey resume hiddenEdgeIds e o modo; o mapa muda junto com o capítulo.
  }, [items, hiddenKey, stage?.map]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ao entrar em Reconstruir, a cena abre o primeiro caso velado: é ali que a
  // observação pedida pelo desafio acontece.
  const firstVeiled = veiled.size ? Math.min(...veiled) : null;
  useEffect(() => { if (firstVeiled !== null) setActive(firstVeiled); }, [firstVeiled]);

  const choose = (index: number) => {
    setActive(index);
    tocado.current = index;
    if (!stage || !plan) return;
    const node = stage.map.nodes[plan.homeStep[index]];
    if (node && stage.mode === 'explorar') stage.onSelect(node.id);
    else if (node) stage.onStepChange(plan.homeStep[index]);
  };

  return { active, choose, show: setActive, stage, plan, step, focus: plan?.byStep[step] ?? [], veiled };
}

/**
 * Faixa no topo da cena: a etapa em que a estudante está e os casos que essa
 * etapa discute, tocáveis. Em Reconstruir vira o desafio: observar na cena o
 * caso coberto e escrever o vínculo no formulário ao lado.
 */
export function StageCaseLens({ cases, items }: { cases: StageCases; items: StageCaseItem[] }) {
  const { stage, step, focus, veiled, active, choose } = cases;
  if (!stage) return null;
  const node = stage.map.nodes[step];
  const total = stage.map.nodes.length;
  const reconstruindo = stage.mode === 'reconstruir';
  const cobertos = [...veiled];
  return (
    <div className="stage-lens" role="group" aria-label="Etapa no palco" data-stage-step={step} data-stage-mode={stage.mode}>
      <div className="stage-lens-step">
        <button type="button" onClick={() => stage.onStepChange(step - 1)} disabled={step <= 0} aria-label="Etapa anterior"><ChevronLeft aria-hidden="true" /></button>
        <p>
          <small>ETAPA {String(step + 1).padStart(2, '0')} DE {String(total).padStart(2, '0')} · {node ? STAGE_LABEL[node.stage] : ''}</small>
          <strong>{node?.label}</strong>
        </p>
        <button type="button" onClick={() => stage.onStepChange(step + 1)} disabled={step >= total - 1} aria-label="Próxima etapa"><ChevronRight aria-hidden="true" /></button>
      </div>
      {reconstruindo && cobertos.length > 0 ? (
        <p className="stage-lens-mission" role="note">
          <b>Desafio na cena.</b> A afirmação de {cobertos.map((index) => items[index]?.label).join(', ')} está coberta: observe a figura,
          compare com os outros casos e escreva o vínculo na reconstrução do painel.
        </p>
      ) : (
        <div className="stage-lens-focus">
          <span>{focus.length > 0 ? 'Nesta etapa o texto discute:' : 'O texto desta etapa não cita um caso da cena: explore livremente.'}</span>
          {focus.length > 0 && (
            <ul>
              {focus.slice(0, 4).map((index) => (
                <li key={items[index]?.label ?? index}>
                  <button type="button" aria-pressed={active === index} onClick={() => choose(index)}>{items[index]?.label}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export const VEILED_CLAIM = 'Afirmação coberta: observe a figura e reconstrua o vínculo no painel.';
