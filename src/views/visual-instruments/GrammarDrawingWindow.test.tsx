import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import {it,expect} from 'vitest';
import {GrammarDrawingWindow} from './GrammarDrawingWindow';
it('move a janela por teclado e pelos botões equivalentes',()=>{
 render(<GrammarDrawingWindow><svg role="img" aria-label="Desenho amplo"/></GrammarDrawingWindow>);
 const window=screen.getByRole('region',{name:'Percorrer a prancha de Gramática'});
 fireEvent.keyDown(window,{key:'ArrowRight'});expect(window.scrollLeft).toBe(180);
 fireEvent.keyDown(window,{key:'ArrowLeft'});expect(window.scrollLeft).toBe(0);
 fireEvent.click(screen.getByRole('button',{name:'Percorrer prancha para a direita'}));expect(window.scrollLeft).toBe(180);
 fireEvent.keyDown(window,{key:'Home'});expect(window.scrollLeft).toBe(0);
});
