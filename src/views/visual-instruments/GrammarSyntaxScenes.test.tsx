import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import type { GrammarInstrumentId } from '../../lib/grammarInstrumentLab';
import { grammarInstrument } from './GrammarInstrument';

const cases: Array<[GrammarInstrumentId, string, string[]]> = [
  ['verb-syntax', 'verbo-e-sintaxe-da-oracao', ['sentido completo', 'objeto direto', 'predicativo do sujeito']],
  ['agreement', 'concordancia', ['núcleo plural', 'sem sujeito', 'sujeito paciente']],
  ['comma-scope', 'pontuacao-i-principios-para-o-uso-da-virgula', ['3 de 6 alunos', '6 de 6 alunos']],
  ['clause-punctuation', 'pontuacao-ii-virgula-entre-oracoes-e-outros-sinais-de-pontuacao', ['três orações', 'verbo elíptico', 'explicação anunciada']],
  ['government', 'mecanismo-de-regencia', ['a + o = ao', 'a + as = às', 'de + ajuda']],
  ['crasis', 'crase', ['duas origens', 'falta preposição', 'falta artigo', 'a + aquele']],
  ['nominal-function', 'funcoes-sintaticas-nominais-e-vocativo', ['adjunto adnominal', 'complemento nominal', 'vocativo']],
  ['subject-type', 'tipos-de-sujeito', ['núcleo expresso', 'referente não recuperável', 'oração sem sujeito']],
  ['verbal-voice', 'vozes-verbais', ['sujeito agente', 'sujeito paciente', 'agente não expresso']],
  ['noun-clause', 'oracoes-substantivas', ['Isso é importante.', 'Ela espera isso.', 'Ela tem certeza disso.']],
  ['adjective-clause', 'oracoes-adjetivas', ['recorta o antecedente', 'explica todo o grupo', 'onde = em que']],
  ['adverbial-clause', 'oracoes-adverbiais', ['causa do adiamento', 'condição não é certeza', 'expectativa contrariada']],
  ['clause-relations', 'oracoes-coordenadas', ['ações somadas', 'expectativa quebrada', 'conclusão inferida']],
];
function mount(id: GrammarInstrumentId, chapter: string) {
  const summary = interactiveSummaries.find(s => s.id === `summary-gramatica-${chapter}`);
  if (!summary) throw new Error(chapter);
  const Component = grammarInstrument(id);
  return render(<Component map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
}
describe('operações sintáticas autorais, integradas aos capítulos reais', () => {
  it.each(cases)('%s mostra operação específica em todos os estados', (id, chapter, readings) => {
    const view = mount(id, chapter);
    readings.forEach((reading, value) => {
      fireEvent.change(screen.getByRole('slider'), { target: { value: String(value) } });
      const operation = view.container.querySelector(`[data-syntax-scene="${id}"]`);
      expect(operation).not.toBeNull();
      expect(operation).toHaveTextContent(reading);
      expect(operation).toHaveAttribute('data-state', String(value));
    });
    view.unmount();
  });
  it('mantém agente → paciente ao trocar a ordem textual da passiva', () => {
    const view = mount('verbal-voice', 'vozes-verbais');
    const arrow = () => view.container.querySelector('[data-causal-direction="agent-to-patient"]');
    expect(arrow()).toHaveAttribute('d', 'M250 240H510');
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(arrow()).toHaveAttribute('d', 'M250 240H510');
    expect(view.container.querySelector('[data-textual-order]')).toHaveAttribute('data-textual-order', 'patient-first');
  });
  it('compara quatro funções nominais completas no estado inicial', () => {
    const view = mount('nominal-function', 'funcoes-sintaticas-nominais-e-vocativo');
    const scene = view.container.querySelector('[data-syntax-scene="nominal-function"]');
    for (const term of ['adjunto adnominal', 'complemento nominal', 'aposto', 'vocativo', 'O livro de Ana chegou.', 'O respeito às regras cresce.', 'Ana, nossa monitora, chegou.', 'Ana, revise o texto!']) expect(scene).toHaveTextContent(term);
  });
  it('não reduz substantivas às três posições do controle', () => {
    const view = mount('noun-clause', 'oracoes-substantivas');
    const scene = view.container.querySelector('[data-syntax-scene="noun-clause"]');
    for (const term of ['objetiva indireta', 'predicativa', 'apositiva']) expect(scene).toHaveTextContent(term);
  });
});
it('declara o grupo ilustrativo antes de apresentar a quantidade no filtro',()=>{
 const view=mount('comma-scope','pontuacao-i-principios-para-o-uso-da-virgula');
 expect(view.container.querySelector('[data-syntax-scene="comma-scope"]')).toHaveTextContent('Exemplo: grupo de seis alunos.');
});
