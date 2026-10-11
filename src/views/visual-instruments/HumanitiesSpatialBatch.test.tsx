import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HUMANITIES_SPATIAL_LESSONS } from '../../lib/humanitiesSpatialBatch';
import ChapterHumanitiesSpatialLab from './ChapterHumanitiesSpatialLab';
afterEach(cleanup);
describe('lote espacial de História, Filosofia e Sociologia',()=>{
  for(const [id,l] of Object.entries(HUMANITIES_SPATIAL_LESSONS))it(`item, câmera e leitura: ${id}`,()=>{
    render(<ChapterHumanitiesSpatialLab chapterId={id}/>);
    expect(screen.getByRole('heading',{name:l.title,level:3})).toBeVisible();
    const reading=screen.getByRole('status',{name:'Leitura do modelo espacial'});expect(reading).toHaveTextContent(l.items[0][0]);
    const drawing=screen.getByRole('img');fireEvent.keyDown(drawing,{key:'ArrowRight'});expect(drawing).toHaveAttribute('data-view-yaw','30');
    fireEvent.change(screen.getByRole('slider',{name:'Item em destaque 1'}),{target:{value:String(l.items.length)}});
    expect(reading).toHaveTextContent(l.items[l.items.length-1][0]);expect(drawing).toHaveAttribute('data-view-yaw','30');
    expect(screen.getByRole('button',{name:'Reproduzir movimento'})).toBeVisible();
  });
});
