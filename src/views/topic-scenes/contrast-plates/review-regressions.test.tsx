import React from 'react';
import {render} from '@testing-library/react';
import {describe,it,expect} from 'vitest';
import {filosofiaPlates1} from './filosofia1';
import chapters from '../../../data/deepSummaryContent.json';
describe('Revisão C — evitar dois equívocos conceituais',()=>{
 it('distingue a sensibilidade do entendimento no estado estático de Kant',()=>{
  const {container}=render(<svg>{filosofiaPlates1[0].illustration(null)}</svg>);
  const forms=container.querySelector('[data-kant-stage="sensibilidade"]'),categories=container.querySelector('[data-kant-stage="entendimento"]');
  expect(forms).not.toBeNull();expect(categories).not.toBeNull();
  expect(forms).toHaveTextContent('espaço + tempo');
  expect(categories).toHaveTextContent('categorias');
  expect(categories).not.toHaveTextContent('espaço + tempo');
 });
 it('pergunta por desigualdade persistente após a abolição sem negar toda mudança histórica',()=>{
  const chapter=chapters.find(c=>c.subject==='Sociologia'&&c.topic==='Desigualdade Racial no Brasil')!;
  expect(chapter.recall.prompt).toContain('não eliminou');
  expect(chapter.recall.prompt).not.toContain('não reduziu');
  expect(chapter.recall.elements[2][0]).toContain('política nacional ampla');
  expect(chapter.recall.elements[2][0]).not.toContain('nao houve');
 });
});
