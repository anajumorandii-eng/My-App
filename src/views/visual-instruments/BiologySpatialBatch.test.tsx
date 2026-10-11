import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BIOLOGY_SPATIAL_LESSONS } from '../../lib/biologySpatialBatch';
import ChapterBiologySpatialLab from './ChapterBiologySpatialLab';
afterEach(cleanup);
describe('lote espacial de Biologia',()=>{
  for(const [id,c] of Object.entries(BIOLOGY_SPATIAL_LESSONS))it(`parâmetros, percurso e câmera: ${id}`,()=>{
    render(<ChapterBiologySpatialLab chapterId={id}/>);
    expect(screen.getByRole('heading',{name:c.title,level:3})).toBeVisible();
    const reading=screen.getByRole('status',{name:'Leitura do modelo espacial'}),before=reading.textContent;
    const drawing=screen.getByRole('img');fireEvent.keyDown(drawing,{key:'ArrowRight'});
    expect(drawing).toHaveAttribute('data-view-yaw','30');expect(reading.textContent).toBe(before);
    const parameter=screen.getByRole('slider',{name:c.label+' '+c.initial.toLocaleString('pt-BR')});
    fireEvent.change(parameter,{target:{value:String(c.max)}});
    const time=screen.queryByRole('slider',{name:'Percurso finito do modelo'});
    if(time)fireEvent.change(time,{target:{value:'1'}});
    expect(reading.textContent).not.toBe(before);expect(drawing).toHaveAttribute('data-view-yaw','30');
    fireEvent.click(screen.getByRole('button',{name:'Restaurar vista'}));expect(drawing).toHaveAttribute('data-view-yaw','25');expect(parameter).toHaveValue(String(c.max));
    for(const [,label] of c.choices||[]){fireEvent.click(screen.getByRole('button',{name:label}));expect(screen.getByRole('button',{name:label})).toHaveAttribute('aria-pressed','true');if(time)expect(time).toHaveValue('0');}
  });
  it('troca de parâmetro reinicia percurso e preserva câmera',()=>{
    render(<ChapterBiologySpatialLab chapterId="summary-biologia-divisao-celular"/>);
    fireEvent.change(screen.getByRole('slider',{name:'Percurso finito do modelo'}),{target:{value:'1'}});
    fireEvent.keyDown(screen.getByRole('img'),{key:'ArrowRight'});
    fireEvent.change(screen.getByRole('slider',{name:'Pares de cromossomos da célula 2'}),{target:{value:'3'}});
    expect(screen.getByRole('slider',{name:'Percurso finito do modelo'})).toHaveValue('0');
    expect(screen.getByRole('img')).toHaveAttribute('data-view-yaw','30');
    expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('6 cromossomos duplicados, 12 cromátides');
  });
});
