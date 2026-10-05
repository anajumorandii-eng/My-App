import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect} from 'vitest';
import {TopicExperiment} from './topic-experiments/TopicExperiment';
it('distingue dimensões de variação mantendo o pedido em dois contextos sem hierarquizar falantes',()=>{
 const {container}=render(<TopicExperiment summaryId="summary-gramatica-variacao-linguistica"/>);
 const drawing=screen.getByRole('img',{name:/Variação linguística/});
 expect(drawing).toHaveTextContent('diatópica');
 expect(drawing).toHaveTextContent('diacrônica');
 expect(drawing).toHaveTextContent('diastrática');
 expect(drawing).toHaveTextContent('diafásica');
 expect(container.querySelector('[data-variation-register="informal"]')).toHaveAttribute('data-selected','true');
 fireEvent.click(screen.getByRole('button',{name:'Solicitação institucional'}));
 expect(container.querySelector('[data-variation-register="formal"]')).toHaveAttribute('data-selected','true');
 expect(screen.getByRole('status')).toHaveTextContent('não mede a inteligência');
 expect(drawing).toHaveTextContent('Me manda o documento');
 expect(drawing).toHaveTextContent('Poderia encaminhar o documento');
});
