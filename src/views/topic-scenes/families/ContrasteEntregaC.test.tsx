import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {describe,it,expect} from 'vitest';
import {ContrasteDePosicoes} from './ContrasteDePosicoes';
import {sociologia} from '../data/sociologia';

const cases = [
 ['norma','propriedade','sentido'], ['hipótese','dados','comparação'],
 ['propriedade','prestígio','capitais'], ['cumprimento','contexto','padrão'],
 ['compreender','justificar','direitos'], ['currículo','barreira','resultado'],
 ['interdependência','controle','produto'], ['tarefa','requalificação','distribuição'],
];
describe('Entrega C — comparação concreta de Sociologia',()=>{
 const entries=sociologia.filter(e=>e.family==='contraste-de-posicoes');
 it.each(entries.map((entry,i)=>({entry,i})))('representa um caso específico em $entry.chapterId',({entry,i})=>{
  const {container}=render(<ContrasteDePosicoes entry={entry}/>);
  const figure=container.querySelector('[data-contrast-plate]');
  expect(figure).toHaveAttribute('data-contrast-plate',entry.chapterId);
  cases[i].forEach(word=>expect(figure?.textContent).toContain(word));
  expect(screen.getByLabelText('Desenho da comparação')).toHaveAttribute('tabindex','0');
  for(const item of entry.items){
   fireEvent.click(screen.getByRole('button',{name:item.label}));
   expect(screen.getByRole('status')).toHaveTextContent(item.label);
   expect(container.querySelectorAll('[data-contrast-mark][data-active="true"]').length).toBeGreaterThan(0);
   expect(container.querySelector('[opacity="0.32"]')).toBeNull();
   cases[i].forEach(word=>expect(figure?.textContent).toContain(word));
  }
 });
 it('conserva o componente anterior para capítulos fora de Humanas H1',()=>{
  const entry={chapterId:'outro-capitulo',family:'contraste-de-posicoes' as const,question:'Comparação',items:[{label:'A',claim:'Afirmação A',quote:'A',section:'Seção'}]};
  const {container}=render(<ContrasteDePosicoes entry={entry}/>);
  expect(container.querySelector('[data-contrast-plate]')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'A'}));
  expect(screen.getByRole('status')).toHaveTextContent('Afirmação A');
 });
});
