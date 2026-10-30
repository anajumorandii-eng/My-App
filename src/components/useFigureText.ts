import { useLayoutEffect, useRef, useState } from 'react';

/** Menor corpo de texto, em pixels de tela, que uma figura pode exibir. */
export const MIN_FIGURE_TEXT_PX = 11;

/**
 * Piso de tamanho de texto para figuras em SVG.
 *
 * O SVG escala por inteiro para caber na largura: no celular a linha do tempo
 * (560 de largura) cabia em ~300 px, e o corpo 13 virava 7 px, ilegível. Aqui
 * o corpo cresce na mesma proporção em que a figura encolheu, até o piso; na
 * tela larga e no PDF a figura não encolhe e nada muda.
 *
 * `width` vem da medição real; antes dela (primeira pintura, testes sem
 * layout) vale o corpo original.
 */
export function useFigureText<T extends Element>(viewBoxWidth: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const measure = () => setWidth(element.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const fs = (base: number) => width > 0 ? Math.max(base, MIN_FIGURE_TEXT_PX * viewBoxWidth / width) : base;
  return { ref, width, fs };
}
