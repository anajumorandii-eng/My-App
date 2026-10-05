import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GRAMMAR_INSTRUMENTS, type GrammarInstrumentId } from '../../lib/grammarInstrumentLab';
import { grammarInstrument } from './GrammarInstrument';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
const ids: GrammarInstrumentId[] = ['language-system','noun-class','text-type','noun-phrase','pronoun-reference','verbal-aspect','adverb-circumstance','implicit-meaning','discourse-type','lexical-context','ambiguity','word-formation'];
const topics: Record<string,string> = {'noun-phrase':'artigo, numeral e adjetivo no sintagma nominal','pronoun-reference':'pronomes','verbal-aspect':'verbo','ambiguity':'ambiguidade: duplicidade no léxico e na sintaxe','language-system':'língua: um sistema complexo','noun-class':'substantivo: os nomes e a visão do enunciador','text-type':'tipos de texto: explorando elementos concretos e conceitos abstratos','adverb-circumstance':'advérbio e locuções adverbiais: circunstanciadores','implicit-meaning':'significados implícitos','discourse-type':'tipos de discurso','lexical-context':'o léxico em contexto: variadas possibilidades semânticas','word-formation':'processos de formação de palavras'};
function scene(id: GrammarInstrumentId, _value: number) {
  const summary = interactiveSummaries.find(s => s.subject === 'Gramática' && [s.title,s.topic].some(t => t.toLocaleLowerCase('pt-BR') === topics[id]));
  if (!summary) throw new Error(`Capítulo real ausente: ${topics[id]}`);
  const Board = grammarInstrument(id);
  return <Board map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>;
}
function select(view: ReturnType<typeof render>, value: number) { fireEvent.change(view.getByRole('slider'), { target: { value: String(value) } }); }
describe('mecanismos linguísticos autorais', () => {
  it.each(ids)('%s apresenta estado completo e muda a operação em cada controle', id => {
    const config = GRAMMAR_INSTRUMENTS[id];
    const view = render(scene(id, config.control.initial));
    const snapshots: string[] = [];
    for (let value = config.control.min; value <= config.control.max; value++) {
      select(view, value);
      const svg = view.container.querySelector('svg')!;
      expect(svg.querySelectorAll('path, circle, ellipse, rect, line').length).toBeGreaterThan(4);
      expect(svg.textContent).toContain(config.readouts(value).find(r => r.pivot)!.value);
      for (const text of svg.querySelectorAll('text')) {
        expect(Number(text.getAttribute('font-size'))).toBeGreaterThanOrEqual(16);
        expect(Number(text.getAttribute('y'))).toBeLessThanOrEqual(536);
      }
      snapshots.push(svg.innerHTML);
    }
    expect(new Set(snapshots).size).toBe(config.control.max + 1);
    view.unmount();
  });
  it('constrói camadas ligadas ao núcleo, sem trocar o núcleo por um satélite', () => {
    const view = render(scene('noun-phrase', 0));
    select(view, 0);
    expect(view.container.querySelectorAll('[data-branch]')).toHaveLength(1);
    select(view, 3);
    expect(view.container.querySelectorAll('[data-branch]')).toHaveLength(4);
    expect(view.container.querySelector('[data-nucleus]')?.textContent).toBe('propostas');
  });
  it('retomada nominal aponta a Marina; ambiguidade abre dois vínculos reais', () => {
    const view = render(scene('pronoun-reference', 0));
    expect(view.container.querySelectorAll('[data-reference-link]')).toHaveLength(1);
    expect(view.container.querySelector('[data-reference-link]')).toHaveAttribute('data-target', 'Marina');
    select(view, 2);
    expect(Array.from(view.container.querySelectorAll('[data-reference-link]')).map(n => n.getAttribute('data-target'))).toEqual(['Ana','Bia']);
  });
  it('aspecto fecha somente o evento terminado e separa o agora do passado', () => {
    const view = render(scene('verbal-aspect', 0));
    expect(view.container.querySelector('[data-event]')).toHaveAttribute('data-closed','false');
    select(view, 1);
    expect(view.container.querySelector('[data-event]')).toHaveAttribute('data-time','presente');
    select(view, 2);
    expect(view.container.querySelector('[data-event]')).toHaveAttribute('data-closed','true');
  });
  it('telescópio ocupa os dois vínculos em disputa e só o vínculo escolhido na reescrita', () => {
    const view = render(scene('ambiguity', 0));
    expect(view.container.querySelectorAll('[data-telescope-owner]')).toHaveLength(2);
    select(view, 1);
    expect(view.container.querySelector('[data-telescope-owner]')).toHaveAttribute('data-telescope-owner','observador');
    select(view, 2);
    expect(view.container.querySelector('[data-telescope-owner]')).toHaveAttribute('data-telescope-owner','aluna');
  });
  it('composição une duas bases; derivação mantém base e afixo em posições diferentes', () => {
    const view = render(scene('word-formation', 0));
    expect(view.container.querySelectorAll('[data-base]')).toHaveLength(1);
    expect(view.container.querySelector('[data-affix]')).toHaveAttribute('data-affix','suffix');
    select(view, 1);
    expect(view.container.querySelector('[data-affix]')).toHaveAttribute('data-affix','prefix');
    select(view, 2);
    expect(view.container.querySelectorAll('[data-base]')).toHaveLength(2);
    expect(view.container.querySelector('[data-affix]')).toBeNull();
  });
  it.each([
    ['language-system', 'data-unit', ['fonema','morfema','sintaxe']],
    ['noun-class', 'data-named-object', ['cadeira','coragem','cardume']],
    ['text-type', 'data-organizing-axis', ['ações','propriedades','conceitos']],
    ['adverb-circumstance', 'data-question', ['quando?','onde?','como?']],
    ['implicit-meaning', 'data-inference-source', ['parou','até','contexto']],
    ['discourse-type', 'data-voice-mode', ['direto','indireto','livre']],
    ['lexical-context', 'data-activated-sense', ['instituição','assento','dados']],
  ] as const)('%s muda o mecanismo desenhado junto ao contexto', (id, attr, cases) => {
    const view = render(scene(id, 0));
    cases.forEach((expected, value) => {
      select(view, value);
      const operation = view.container.querySelector(`[${attr}]`)!;
      expect(operation).toHaveAttribute(attr, expected);
      expect(operation.querySelectorAll('path, circle, ellipse, rect, line').length).toBeGreaterThan(2);
    });
  });
});
