import {useState} from 'react';import {render,screen,fireEvent} from '@testing-library/react';import {expect,it} from 'vitest';import {SubtopicSelector} from './SubtopicSelector';
it('seleciona múltiplos recortes, evita duplicidade e volta ao tópico completo',()=>{
 function Fixture(){const [cuts,setCuts]=useState<string[]>([]);return <SubtopicSelector topic={{id:'mat_geometria_plana',name:'Geometria Plana'}} value={cuts} onChange={setCuts}/>;}
 render(<Fixture/>);fireEvent.click(screen.getByText('Selecionar subtópicos de Geometria Plana'));
 fireEvent.click(screen.getByLabelText('Ângulos na circunferência'));fireEvent.click(screen.getByLabelText('Área do círculo'));
 expect(screen.getByText('Selecionar subtópicos de Geometria Plana (2)')).toBeInTheDocument();
 fireEvent.change(screen.getByLabelText('Recorte personalizado de Geometria Plana'),{target:{value:' área do círculo '}});fireEvent.click(screen.getByRole('button',{name:'Adicionar recorte'}));
 expect(screen.getByText('Selecionar subtópicos de Geometria Plana (2)')).toBeInTheDocument();
 fireEvent.change(screen.getByLabelText('Recorte personalizado de Geometria Plana'),{target:{value:'Minha dificuldade'}});fireEvent.click(screen.getByRole('button',{name:'Adicionar recorte'}));expect(screen.getByLabelText('Minha dificuldade')).toBeChecked();
 fireEvent.click(screen.getByRole('button',{name:'Usar tópico completo'}));expect(screen.getByText('Sem recortes selecionados: tópico completo.')).toBeInTheDocument();
});
