import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SPATIAL_CHAPTER_LESSONS } from '../../lib/spatialBatchCatalog';
import ChapterMolecularLab from './ChapterMolecularLab';
import { ElectrostaticSpatialView } from './ElectrostaticSpatialView';
import { VectorSpatialView } from './VectorSpatialView';

describe('lote espacial',()=>{
  for(const [id,lesson] of Object.entries(SPATIAL_CHAPTER_LESSONS))it(`câmera preserva a leitura: ${id}`,()=>{
    render(<ChapterMolecularLab chapterId={id}/>);const svg=screen.getByRole('img'),reading=screen.getByRole('status',{name:'Leitura do modelo espacial'}),initial=reading.textContent;
    expect(screen.getByRole('heading',{name:lesson.title})).toBeInTheDocument();
    fireEvent.keyDown(svg,{key:'ArrowRight'});expect(svg).toHaveAttribute('data-view-yaw','30');expect(reading.textContent).toBe(initial);
    fireEvent.keyDown(svg,{key:'Home'});expect(svg).toHaveAttribute('data-view-yaw','25');
  });
  it('trocar grupo funcional conserva a câmera e mostra a conectividade escolhida',()=>{
    render(<ChapterMolecularLab chapterId="summary-quimica-reconhecimento-de-funcoes-organicas-e-algumas-de-suas-propriedades"/>);
    fireEvent.keyDown(screen.getByRole('img'),{key:'ArrowUp'});fireEvent.click(screen.getByRole('button',{name:'etanol'}));
    expect(screen.getByRole('img')).toHaveAttribute('data-view-pitch','25');expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('álcool');
  });
  it('reação compara estados sem inventar ligações intermediárias',()=>{
    render(<ChapterMolecularLab chapterId="summary-quimica-interpretando-reacoes-organicas"/>);
    expect(screen.getByRole('img')).toHaveAccessibleName(/eteno.*Reagente/);
    fireEvent.change(screen.getByRole('slider',{name:'Comparação reagente → produto'}),{target:{value:'1'}});
    expect(screen.getByRole('img')).toHaveAccessibleName(/etano.*Produto/);
  });
  it('campo novo reinicia percurso e conserva câmera',()=>{
    const {rerender}=render(<ElectrostaticSpatialView id="charge-dynamics" value={4}/>);
    fireEvent.change(screen.getByRole('slider',{name:'Tempo de aceleração (0 a 1 s)'}),{target:{value:'1'}});
    expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('x − x₀ = 2.00 m');
    fireEvent.keyDown(screen.getByRole('img'),{key:'ArrowRight'});rerender(<ElectrostaticSpatialView id="charge-dynamics" value={0}/>);
    expect(screen.getByRole('img')).toHaveAttribute('data-view-yaw','30');expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('t = 0.00 s');
  });
  it('rio muda percurso sem criar componente fora do plano',()=>{
    const {rerender}=render(<VectorSpatialView id="composicao" value={3}/>);
    fireEvent.change(screen.getByRole('slider',{name:'Tempo do percurso (0 a 1 s)'}),{target:{value:'1'}});
    expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('(3.00, 4.00, 0) m');
    rerender(<VectorSpatialView id="composicao" value={0}/>);expect(screen.getByRole('status',{name:'Leitura do modelo espacial'})).toHaveTextContent('(0, 4, 0)');
  });
});
