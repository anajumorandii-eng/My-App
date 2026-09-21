import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { remainingMathInstrument } from './RemainingMathInstrument';
import type { RemainingId } from '../../lib/remainingMath';
const ids: Array<[RemainingId, string]> = [['fila','summary-matematica-o-problema-da-fila'],['grupo','summary-matematica-o-problema-do-grupo'],['prob','summary-matematica-operacoes-com-probabilidades'],['eventos','summary-matematica-eventos-disjuntos-e-eventos-independentes'],['estatistica','summary-matematica-estatistica-descritiva'],['trig-poligonos','summary-matematica-relacoes-trigonometricas-em-poligonos'],['trig-outras','summary-matematica-outras-razoes-trigonometricas'],['espaco','summary-matematica-o-universo-tridimensional'],['conicas','summary-matematica-introducao-ao-estudo-analitico-das-conicas'],['composicao','summary-matematica-composicao-de-funcoes'],['bijeção','summary-matematica-funcoes-bijetoras']];
describe('instrumentos finais de matemática',()=>it('renderiza as onze configurações',()=>{for(const[id,summaryId]of ids){const C=remainingMathInstrument(id);const summary=interactiveSummaries.find(x=>x.id===summaryId)!;const view=render(<C map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);expect(screen.getByRole('img')).toBeInTheDocument();view.unmount()}}));

describe('pranchas matemáticas estruturais',()=>it('desenha o objeto matemático de cada relação, sem substituí-lo por um cartão abstrato',()=>{
  for(const [id,summaryId,detail] of [['conicas','summary-matematica-introducao-ao-estudo-analitico-das-conicas','cone-section'],['composicao','summary-matematica-composicao-de-funcoes','function-composition'],['bijeção','summary-matematica-funcoes-bijetoras','bijection-map']] as const){
    const C=remainingMathInstrument(id);const summary=interactiveSummaries.find(x=>x.id===summaryId)!;
    const view=render(<C map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);
    expect(document.querySelector(`[data-detail="${detail}"]`)).toBeInTheDocument();view.unmount();
  }
}));
