import {render,screen,waitFor,cleanup} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
vi.mock('../lib/drawStudyMolecule',()=>({drawStudyMolecule:async(target:SVGSVGElement,smiles:string)=>{if(smiles==='invalid')throw new Error('invalid structure');target.innerHTML='<path d="M30 50 L100 70"/><text x="100" y="70">OH</text>';target.setAttribute('viewBox','0 0 400 220');}}));
import AiTextRenderer from './AiTextRenderer';
import {createStrategyPrintRoot} from '../lib/printStrategyGuide';
afterEach(cleanup);
const base={title:'Oxidação',caption:'Esquema global, depende das condições.',question:'O que muda no grupo funcional?'};
it('desenha estruturas, mantém condições e aguarda a figura antes da cópia para PDF',async()=>{
 const visual={...base,type:'reaction',molecules:[{label:'Etanol',smiles:'CCO'},{label:'Etanal',smiles:'CC=O'}],conditions:['Oxidação controlada [O]']};
 const {container}=render(<AiTextRenderer text={'```study-visual\n'+JSON.stringify(visual)+'\n```'}/>);
 expect(container.querySelector('[data-ai-text-pending]')).toBeTruthy();
 await waitFor(()=>expect(container.querySelector('[data-ai-text-pending]')).toBeNull());
 expect(screen.getByRole('img',{name:'Estrutura de Etanol'}).querySelector('path')).toBeTruthy();
 expect(container.textContent).toContain('Oxidação controlada [O]');
 const root=createStrategyPrintRoot(container,'Revisão');
 expect(root.querySelectorAll('[data-study-molecule] svg path')).toHaveLength(2);
 expect(root.textContent).toContain(base.caption);
});
it('estrutura inválida informa falha sem deixar exportação esperando',async()=>{
 const {container}=render(<AiTextRenderer text={'```study-visual\n'+JSON.stringify({...base,type:'molecule',molecule:{label:'Exemplo',smiles:'invalid'}})+'\n```'}/>);
 expect(await screen.findByText(/Não foi possível desenhar/)).toBeVisible();
 expect(container.querySelector('[data-ai-text-pending]')).toBeNull();
});
