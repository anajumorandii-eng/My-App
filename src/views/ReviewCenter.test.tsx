import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
vi.mock('../context/AuthContext',()=>({useAuth:()=>({user:null})}));
vi.mock('../lib/reviewResources',()=>({reviewResources:[
 {id:'fila',label:'Fila',path:'/fila',description:'Revisões pendentes',Component:()=> <p>Minha fila</p>},
 {id:'resumos-banca',label:'Resumos de revisão',path:'/resumos-revisao',description:'Gerar e ler',Component:()=> <p>Meu resumo</p>},
]}));
vi.mock('../components/ReviewSessionGuide',()=>({ReviewSessionGuide:()=>{
 const [minutes,setMinutes]=useState('30');
 return <label>Tempo do roteiro<input value={minutes} onChange={event=>setMinutes(event.target.value)}/></label>;
}}));
import Revisoes from './Revisoes';
it('recolhe o roteiro ao estudar o resumo, preservando o tempo escolhido',async()=>{
 render(<MemoryRouter><Revisoes/></MemoryRouter>);
 fireEvent.change(screen.getByLabelText('Tempo do roteiro'),{target:{value:'45'}});
 fireEvent.click(screen.getByRole('button',{name:'Criar resumo por banca'}));
 expect(await screen.findByText('Meu resumo')).toBeVisible();
 expect(screen.getByLabelText('Tempo do roteiro')).not.toBeVisible();
 expect(screen.queryByRole('button',{name:'Criar resumo por banca'})).toBeNull();
 fireEvent.click(screen.getByText('Consultar meu roteiro de revisão'));
 expect(screen.getByLabelText('Tempo do roteiro')).toHaveValue('45');
 fireEvent.change(screen.getByLabelText('Recurso de revisão'),{target:{value:'fila'}});
 expect(screen.getByLabelText('Tempo do roteiro')).toBeVisible();
 expect(screen.getByLabelText('Tempo do roteiro')).toHaveValue('45');
});
