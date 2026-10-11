import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MATH_SPATIAL_LESSONS } from '../../lib/mathSpatialBatch';
import ChapterMathSpatialLab from './ChapterMathSpatialLab';
afterEach(cleanup);
describe('lote espacial de Matemática',()=>{
  for(const [id,c] of Object.entries(MATH_SPATIAL_LESSONS))it(`parâmetros, percurso e câmera: ${id}`,()=>{
    render(<ChapterMathSpatialLab chapterId={id}/>);
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
    for(const [,label] of c.choices||[]){fireEvent.click(screen.getByRole('button',{name:label}));expect(screen.getByRole('button',{name:label})).toHaveAttribute('aria-pressed','true');const activeTime=screen.queryByRole('slider',{name:'Percurso finito do modelo'});if(activeTime)expect(activeTime).toHaveValue('0');}
  });
});
