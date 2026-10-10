import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GeneratorSpatialView } from './GeneratorSpatialView';
it('fase e velocidade mudam a leitura sem alterar a câmera; câmera não muda a leitura',()=>{
 const {rerender}=render(<GeneratorSpatialView phase={90} omega={10} />);
 const svg=screen.getByRole('img'),reading=screen.getByRole('status',{name:'Leitura espacial do gerador'});
 expect(reading).toHaveTextContent('ε = 4 V');
 const text=reading.textContent;
 fireEvent.keyDown(svg,{key:'ArrowRight'});
 expect(svg).toHaveAttribute('data-view-yaw','30');expect(reading.textContent).toBe(text);
 rerender(<GeneratorSpatialView phase={270} omega={10} />);expect(reading).toHaveTextContent('ε = -4 V');expect(svg).toHaveAttribute('data-view-yaw','30');
 rerender(<GeneratorSpatialView phase={270} omega={0} />);expect(reading).toHaveTextContent('ε = 0 V');
 fireEvent.keyDown(svg,{key:'Home'});expect(svg).toHaveAttribute('data-view-yaw','25');
});
