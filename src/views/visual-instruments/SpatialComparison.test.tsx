import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpatialLessonLab } from './SpatialLessonLab';
import { physicsSpatialDrawing } from '../../lib/physicsSpatialDrawing';

describe('comparação do modelo espacial', () => {
  it('guarda a geometria e a leitura, conserva a referência ao manipular e permite substituí-la', () => {
    render(<SpatialLessonLab config={{kind:'weight',title:'Peso',label:'Massa',min:1,max:10,step:1,initial:2,note:'Modelo esquemático'}} draw={v => physicsSpatialDrawing('weight',v,0,'')} moving={() => false} dataAttributes={{}} />);
    const reading = screen.getByRole('status', {name:'Leitura do modelo espacial'}).textContent;
    fireEvent.click(screen.getByRole('button', {name:'Guardar para comparar'}));
    const comparison = screen.getByRole('region', {name:'Comparação de estados'});
    const frozen = comparison.querySelector('svg')!.outerHTML;
    fireEvent.change(screen.getByRole('slider', {name:'Massa 2'}), {target:{value:'8'}});
    expect(within(comparison).getByText(reading!, {exact:true})).toBeInTheDocument();
    expect(comparison.querySelector('svg')!.outerHTML).toBe(frozen);
    expect(screen.getByRole('status', {name:'Leitura do modelo espacial'}).textContent).not.toBe(reading);
    fireEvent.keyDown(screen.getByRole('img'), {key:'ArrowRight'});
    expect(comparison.querySelector('svg')!.outerHTML).toBe(frozen);
    expect(comparison.querySelector('[inert]')).toHaveAttribute('aria-hidden','true');
    fireEvent.click(screen.getByRole('button', {name:'Atualizar referência'}));
    expect(comparison.querySelector('svg')!.outerHTML).not.toBe(frozen);
    fireEvent.click(screen.getByRole('button', {name:'Limpar comparação'}));
    expect(screen.queryByRole('region', {name:'Comparação de estados'})).not.toBeInTheDocument();
    expect(screen.getByRole('slider', {name:'Massa 8'})).toHaveValue('8');
    expect(screen.getByRole('button', {name:'Guardar para comparar'})).toHaveFocus();
  });
});
