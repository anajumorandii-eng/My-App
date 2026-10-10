import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PHYSICS_SPATIAL_LESSONS } from '../../lib/physicsSpatialBatch';
import ChapterPhysicsSpatialLab from './ChapterPhysicsSpatialLab';
afterEach(cleanup);
describe('lote espacial de Física',()=>{
  for(const [id,config] of Object.entries(PHYSICS_SPATIAL_LESSONS))it(`parâmetros e câmera independentes: ${id}`,()=>{
    render(<ChapterPhysicsSpatialLab chapterId={id}/>);
    expect(screen.getByRole('heading',{name:config.title,level:3})).toBeVisible();
    const reading=screen.getByRole('status',{name:'Leitura do modelo espacial'}),before=reading.textContent;
    const drawing=screen.getByRole('img');fireEvent.keyDown(drawing,{key:'ArrowRight'});
    expect(drawing).toHaveAttribute('data-view-yaw','30');expect(reading.textContent).toBe(before);
    const control=screen.getByRole('slider',{name:config.label+' '+String(config.initial).replace('.',',')});
    fireEvent.change(control,{target:{value:String(config.max)}});
    if(config.kind==='gas') fireEvent.change(screen.getByRole('slider',{name:'Percurso finito do modelo'}),{target:{value:'1'}});
    expect(reading.textContent).not.toBe(before);expect(drawing).toHaveAttribute('data-view-yaw','30');
    fireEvent.click(screen.getByRole('button',{name:'Restaurar vista'}));expect(drawing).toHaveAttribute('data-view-yaw','25');expect(control).toHaveValue(String(config.max));
  });
  it('mudança de transformação reinicia percurso e conserva estado inicial',()=>{
    render(<ChapterPhysicsSpatialLab chapterId="summary-fisica-primeira-lei-da-termodinamica"/>);
    fireEvent.change(screen.getByRole('slider',{name:'Percurso finito do modelo'}),{target:{value:'1'}});
    expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('V = 1,5 L');
    fireEvent.click(screen.getByRole('button',{name:'Isocórica'}));
    expect(screen.getByRole('slider',{name:'Percurso finito do modelo'})).toHaveValue('0');
    fireEvent.change(screen.getByRole('slider',{name:'Percurso finito do modelo'}),{target:{value:'1'}});
    expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('V = 1 L');
    expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('W = 0 J');
  });
});
