import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link, useSearchParams, useParams } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
function Draft() {
  const [text,setText]=useState('');
  const [params,setParams]=useSearchParams();
  return <><label>Resposta<textarea value={text} onChange={e=>setText(e.target.value)} /></label><label>Banca<select value={params.get('board')??''} onChange={e=>setParams({board:e.target.value})}><option value="">Todas</option><option value="UNICAMP">Unicamp</option></select></label><Link to="/resumos?summary=chapter-1">Revisar capítulo</Link></>;
}
vi.mock('../lib/reviewResources',()=>({ reviewResources:[
  {id:'fila',label:'Fila de revisões',path:'/fila',description:'Fila',Component:Draft},
  {id:'questoes',label:'Questões',path:'/questoes',description:'Prática',Component:Draft},
  {id:'obras',label:'Obras',path:'/obras',description:'Leitura',Component:()=> <Link to="/obras/obra-teste">Abrir obra</Link>},
  {id:'resumos',label:'Resumos',path:'/resumos',description:'Recuperação',Component:()=>{const [p]=useSearchParams();return <p>Capítulo {p.get('summary')}</p>;}},
] }));
vi.mock('../views/ObraDetalhe',()=>({default:()=>{const {workSlug}=useParams();return <p>Ficha literária {workSlug}</p>;}}));
import { ReviewWorkspace } from './ReviewWorkspace';
it('mantém resposta e banca ao alternar e abre links de capítulos dentro da central', async()=>{
  render(<MemoryRouter><ReviewWorkspace /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Resposta'),{target:{value:'Resposta iniciada'}});
  fireEvent.change(screen.getByLabelText('Banca'),{target:{value:'UNICAMP'}});
  fireEvent.change(screen.getByLabelText('Recurso de revisão'),{target:{value:'questoes'}});
  expect(screen.getAllByLabelText('Resposta').at(-1)).toHaveValue('');
  fireEvent.change(screen.getByLabelText('Recurso de revisão'),{target:{value:'fila'}});
  expect(screen.getAllByLabelText('Resposta')[0]).toHaveValue('Resposta iniciada');
  expect(screen.getAllByLabelText('Banca')[0]).toHaveValue('UNICAMP');
  fireEvent.click(screen.getAllByRole('link',{name:'Revisar capítulo'})[0]);
  expect(await screen.findByText('Capítulo chapter-1')).toBeVisible();
  expect(screen.getByLabelText('Recurso de revisão')).toHaveValue('resumos');
  fireEvent.change(screen.getByLabelText('Recurso de revisão'),{target:{value:'fila'}});
  expect(screen.getAllByLabelText('Resposta')[0]).toHaveValue('Resposta iniciada');
});
it('recria sessões quando a identidade da conta muda',()=>{
 const {rerender}=render(<MemoryRouter><ReviewWorkspace key="A" /></MemoryRouter>);
 fireEvent.change(screen.getByLabelText('Resposta'),{target:{value:'Resposta de A'}});
 rerender(<MemoryRouter><ReviewWorkspace key="B" /></MemoryRouter>);
 expect(screen.getByLabelText('Resposta')).toHaveValue('');
});

it('abre o dossiê de uma obra sem sair da central',async()=>{
 render(<MemoryRouter initialEntries={['/revisoes']}><Routes><Route path="/revisoes" element={<ReviewWorkspace/>}/></Routes></MemoryRouter>);
 fireEvent.change(screen.getByLabelText('Recurso de revisão'),{target:{value:'obras'}});
 fireEvent.click(screen.getByRole('link',{name:'Abrir obra'}));
 expect(await screen.findByText('Ficha literária obra-teste')).toBeVisible();
 expect(screen.getByLabelText('Recurso de revisão')).toHaveValue('obras');
});
