import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { matrixInstrument } from './MatrixInstrument';
const props=(id:string)=>({map:buildVisualMap(interactiveSummaries.find(x=>x.id===id)!),states:{},selectedId:null,onSelect:vi.fn(),hiddenEdgeIds:[],mode:'explorar' as const});
describe('instrumento de matrizes e sistemas',()=>{
 it('confirma a solução simultânea do sistema',()=>{const C=matrixInstrument('sistemas');render(<C {...props('summary-matematica-sistemas-de-equacoes')}/>);expect(screen.getAllByText('sim — (6, 4)').length).toBeGreaterThan(0)});
 it('usa controle nativo para classificar sistemas',()=>{const C=matrixInstrument('discussao');render(<C {...props('summary-matematica-discussao-de-sistemas-lineares')}/>);const input=screen.getByLabelText(/secantes; 2: coincidentes/i);expect(input).toHaveAttribute('type','range');fireEvent.change(input,{target:{value:'3'}});expect(screen.getAllByText('nenhuma solução').length).toBeGreaterThan(0)});
});
