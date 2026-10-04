import {describe,it,expect} from 'vitest';
import {interactiveSummaries} from '../../../data/interactiveSummaries';
import {filosofia} from '../data/filosofia';
import {validarLastro} from '../lastro';
describe('Justiça em Rawls: escolha imparcial e limites substantivos',()=>{
 it('não legitima qualquer resultado por uma escolha imparcial',()=>{
  const summary=interactiveSummaries.find(s=>s.id==='summary-filosofia-justica-e-direitos-humanos')!;
  const content=summary.sections.find(s=>s.title==='Concepções de justiça')!.content;
  expect(content).not.toContain('independentemente de qual seja seu conteúdo específico');
  expect(content).toContain('liberdades básicas');
  expect(content).toContain('princípio da diferença');
  const scene=filosofia.find(e=>e.chapterId===summary.id)!;
  expect(scene.items[0].claim).not.toContain('seja ele qual for');
  expect(validarLastro(scene,summary)).toEqual([]);
 });
});
it('distingue ordem causal objetiva de mera sucessão das percepções em Kant',()=>{
 const summary=interactiveSummaries.find(s=>s.id==='summary-filosofia-a-critica-da-razao-pura')!;
 const content=summary.sections.find(s=>s.title==='Síntese entre racionalismo e empirismo')!.content;
 expect(content).not.toContain('sequer sucessão ordenada de eventos');
 expect(content).toContain('ordem objetiva');
 expect(content).toContain('mera sequência');
 expect(summary.sections[0].id).toContain('editorial-v3');
});
