import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { gasPressure, limitingProduct, weakAcidPH } from '../../lib/chemistryInstrumentLab';
import { findInstrument } from './registry';

const ids = [
  'summary-quimica-o-estado-gasoso', 'summary-quimica-massa-atomica-mol-e-massa-molar',
  'summary-quimica-determinacao-de-formulas-quimicas', 'summary-quimica-calculos-estequiometricos',
  'summary-quimica-transesterificacao-alcoolise', 'summary-quimica-acidez-e-basicidade-pka',
  'summary-quimica-estudo-dos-gases-ii', 'summary-quimica-separacao-de-misturas',
  'summary-quimica-transformacoes-fisicas-e-quimicas-e-balanceamento-de-equacoes',
  'summary-quimica-introducao-a-quimica-organica', 'summary-quimica-nomenclatura-de-compostos-organicos',
  'summary-quimica-reacoes-de-adicao', 'summary-quimica-reacoes-de-oxidacao-em-hidrocarbonetos',
  'summary-quimica-acidos-graxos-e-esterificacao', 'summary-quimica-polimeros',
  'summary-quimica-deslocamento-de-equilibrio', 'summary-quimica-equilibrios-ionicos', 'qui-equilibrio-acidificacao',
];

describe('instrumentos de Química', () => {
  it('atribui instrumento apenas aos capítulos cujo mecanismo central é representado', () => {
    for (const id of ids) {
      const chapter = interactiveSummaries.find(s => s.id === id);
      expect(chapter, id).toBeDefined();
      expect(findInstrument(chapter!)?.id, id).toBeTruthy();
      expect(findInstrument({ ...chapter!, subject: 'Biologia' }), id).toBeNull();
    }
  });

  it('respeita proporções químicas e a escala logarítmica de pH', () => {
    expect(gasPressure(1, 300, 10)).toBeCloseTo(2.46171, 4);
    expect(limitingProduct(8, 2)).toBe(4);
    expect(limitingProduct(2, 2)).toBe(2);
    expect(weakAcidPH(.1, 1.8e-5)).toBeCloseTo(2.88, 1);
  });

  it('a manipulação do gás muda a pressão visível e mantém o diagnóstico ligado ao capítulo', () => {
    const chapter = interactiveSummaries.find(s => s.id === ids[0])!;
    const Component = findInstrument(chapter)!.Component;
    const map = buildVisualMap(chapter);
    const selected: string[] = [];
    render(<Component map={map} states={{}} selectedId={null} onSelect={id => selected.push(id)} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByLabelText('Pressão ideal 2,46 atm')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '500' } });
    expect(screen.getByLabelText('Pressão ideal 4,1 atm')).toBeInTheDocument();
    const card = document.querySelector('.vs-concept-card');
    if (card) fireEvent.click(card);
    expect(selected.length).toBeGreaterThan(0);
  });

  it('mostra funil, filtro, resíduo e filtrado no capítulo de separação', () => {
    const chapter = interactiveSummaries.find(s => s.id === 'summary-quimica-separacao-de-misturas')!;
    const Component = findInstrument(chapter)!.Component;
    render(<Component map={buildVisualMap(chapter)} states={{}} selectedId={null} onSelect={() => {}} hiddenEdgeIds={[]} mode="explorar" />);
    expect(document.querySelector('[data-detail="filtration-apparatus"]')).toBeInTheDocument();
  });
});
