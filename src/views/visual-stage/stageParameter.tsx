import React, { useEffect, useMemo, useState } from 'react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { parameterFromText, planStageFocus, type StageParameter } from '../../lib/stageFocus';
import type { BoardProps } from '../visual-boards/types';
import { StageStepBar } from './stageCases';

/**
 * Etapa → posição do controle de um instrumento (laboratórios de Química e
 * Biologia, que são um cursor e uma leitura).
 *
 * Dois caminhos, ambos do texto da etapa e nunca de valor escolhido aqui:
 * - controle discreto (até 12 posições, como RER → Golgi → vesícula): a etapa
 *   abre a posição cuja leitura o texto nomeia;
 * - controle contínuo: a etapa leva o cursor ao número que o texto cita com a
 *   unidade do controle (15%, 300 K), se ele cabe na faixa e na grade.
 * Sem citação, o cursor fica onde a estudante deixou, e a faixa diz isso.
 */
export interface StageControl extends StageParameter {
  initial: number;
  /** Leitura do instrumento naquela posição; é o texto que a etapa precisa nomear. */
  readout: (value: number) => string;
}

const sectionsBySummary = new Map(interactiveSummaries.map((summary) => [summary.id, summary.sections]));

function valores(c: StageControl): number[] {
  const n = Math.round((c.max - c.min) / c.step) + 1;
  return Array.from({ length: n }, (_, i) => Number((c.min + i * c.step).toFixed(6)));
}

/** O valor que cada etapa pede, ou `null` quando o texto da etapa não o nomeia. */
export function stageValues(sections: { title: string; content: string }[], c: StageControl): (number | null)[] {
  const posicoes = valores(c);
  if (posicoes.length <= 12) {
    // A leitura costuma ser "RER: síntese e entrada": o nome antes dos dois
    // pontos é o que o texto cita; o resto é explicação do próprio instrumento.
    const candidatos = posicoes.map((v) => ({ label: c.readout(v).split(':')[0] }));
    const plan = planStageFocus(candidatos, sections);
    return sections.map((section, step) => {
      // Só vale posição que o texto distingue das outras: "2 mol" e "3 mol"
      // casam igualmente com "mol", e empate não é citação de posição nenhuma.
      const ordem = [...plan.scores[step].keys()].sort((a, b) => plan.scores[step][b] - plan.scores[step][a]);
      const [primeiro, segundo] = ordem;
      const distingue = primeiro !== undefined && plan.scores[step][primeiro] > 0
        && (segundo === undefined || plan.scores[step][primeiro] > plan.scores[step][segundo]);
      return distingue ? posicoes[primeiro] : parameterFromText(section.content, c);
    });
  }
  return sections.map((section) => parameterFromText(section.content, c));
}

export function useStageControl(props: BoardProps, control: StageControl) {
  const [value, setValue] = useState(control.initial);
  const sections = sectionsBySummary.get(props.map.summaryId);
  const porEtapa = useMemo(() => (sections ? stageValues(sections, control) : []), [sections, control]);
  const step = props.activeStep ?? 0;
  const pedido = props.activeStep === undefined ? null : porEtapa[step] ?? null;
  useEffect(() => { if (pedido !== null) setValue(pedido); }, [pedido, step]);
  return { value, setValue, pedido, step, porEtapa };
}

/** Faixa da etapa no laboratório: o que o texto desta etapa pede ao controle. */
export function StageControlLens({ props, control, label, state }: {
  props: BoardProps; control: StageControl; label: string; state: ReturnType<typeof useStageControl>;
}) {
  if (props.activeStep === undefined || !props.onStepChange) return null;
  const reconstruindo = props.mode === 'reconstruir';
  return (
    <StageStepBar map={props.map} step={state.step} mode={props.mode} onStepChange={props.onStepChange}>
      {reconstruindo ? (
        <p className="stage-lens-mission" role="note">
          <b>Desafio na cena.</b> Mova “{label}” e observe a leitura mudar; depois escreva, na reconstrução do painel, o vínculo que o laboratório mostrou.
        </p>
      ) : (
        <div className="stage-lens-focus">
          {state.pedido !== null
            ? <><span>O texto desta etapa cita</span><button type="button" aria-pressed={state.value === state.pedido} onClick={() => state.setValue(state.pedido as number)} className="stage-lens-chip">{control.readout(state.pedido)}</button></>
            : <span>O texto desta etapa não cita um valor de “{label}”: ajuste e observe.</span>}
        </div>
      )}
    </StageStepBar>
  );
}
