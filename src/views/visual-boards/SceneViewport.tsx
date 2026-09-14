import React, { useCallback, useRef, useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

/**
 * Janela de zoom e arraste em volta da cena.
 *
 * A referência aprovada traz um controle de ampliação e as dicas de gesto
 * ("pinça para ampliar", "arraste para navegar"). O motivo é prático, não
 * estético: no celular a cena cabe em pouco mais de trezentos pixels de largura,
 * e detalhes como as hachuras do isolamento ou os degraus da pirâmide trófica
 * ficam pequenos demais para ler.
 *
 * Fica no `BoardShell`, e não em cada cena, para valer nas 26 pranchas e no
 * instrumento de uma vez.
 *
 * Duas decisões que vale explicar:
 *
 * - **Os botões existem mesmo havendo pinça.** Pinça não é alcançável por
 *   teclado nem por quem usa mouse, e o gesto sozinho deixaria a ampliação fora
 *   do alcance de parte das pessoas.
 * - **O arraste ignora o que vem de um controle.** A cena do instrumento tem
 *   `input[type=range]` dentro: sem essa guarda, mover o cursor do parâmetro
 *   arrastava a prancha junto e o valor nunca chegava onde a estudante queria.
 */
const MIN = 1;
const MAX = 3;
const PASSO = 0.25;

export function SceneViewport({
  children, notas,
}: {
  children: React.ReactNode;
  /** Legendas sobrepostas à cena. Ficam dentro da janela, e não fora dela: o
   *  wrap agora termina numa barra de controles, e a legenda de baixo caía
   *  exatamente em cima da dica de gesto. */
  notas?: { up: string; down: string };
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const caixa = useRef<HTMLDivElement | null>(null);
  const ponteiros = useRef(new Map<number, { x: number; y: number }>());
  const distanciaInicial = useRef<number | null>(null);
  const zoomInicial = useRef(1);

  // Sem limite, um arraste longo joga a cena para fora da janela e ela some.
  // O curso disponível é o que a ampliação criou de excedente, e nada além.
  const limitar = useCallback((proposto: { x: number; y: number }, z: number) => {
    const r = caixa.current?.getBoundingClientRect();
    const folgaX = r ? (r.width * (z - 1)) / 2 : 0;
    const folgaY = r ? (r.height * (z - 1)) / 2 : 0;
    return {
      x: Math.max(-folgaX, Math.min(folgaX, proposto.x)),
      y: Math.max(-folgaY, Math.min(folgaY, proposto.y)),
    };
  }, []);

  const aplicarZoom = useCallback((valor: number) => {
    const z = Math.max(MIN, Math.min(MAX, Number(valor.toFixed(2))));
    setZoom(z);
    // Voltar ao tamanho natural recentraliza: pan guardado em zoom 1 não tem
    // como ser desfeito pela estudante, porque não há excedente para arrastar.
    setPan((atual) => (z === MIN ? { x: 0, y: 0 } : limitar(atual, z)));
  }, [limitar]);

  const daParaArrastar = (alvo: EventTarget | null) =>
    !(alvo instanceof Element) || !alvo.closest('input, button, select, textarea, a');

  const aoPressionar = (e: React.PointerEvent) => {
    if (!daParaArrastar(e.target)) return;
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ponteiros.current.size === 2) {
      const [a, b] = [...ponteiros.current.values()];
      distanciaInicial.current = Math.hypot(a.x - b.x, a.y - b.y);
      zoomInicial.current = zoom;
    }
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const aoMover = (e: React.PointerEvent) => {
    const anterior = ponteiros.current.get(e.pointerId);
    if (!anterior) return;
    const atual = { x: e.clientX, y: e.clientY };
    ponteiros.current.set(e.pointerId, atual);

    if (ponteiros.current.size === 2 && distanciaInicial.current) {
      const [a, b] = [...ponteiros.current.values()];
      const agora = Math.hypot(a.x - b.x, a.y - b.y);
      aplicarZoom(zoomInicial.current * (agora / distanciaInicial.current));
      return;
    }
    if (zoom === MIN) return;
    setPan((p) => limitar({ x: p.x + (atual.x - anterior.x), y: p.y + (atual.y - anterior.y) }, zoom));
  };

  const aoSoltar = (e: React.PointerEvent) => {
    ponteiros.current.delete(e.pointerId);
    if (ponteiros.current.size < 2) distanciaInicial.current = null;
  };

  const ampliada = zoom > MIN;

  return (
    <div className="vs-viewport">
      <div
        ref={caixa}
        className="vs-viewport-janela"
        data-ampliada={ampliada ? 'true' : undefined}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
      >
        <div
          className="vs-viewport-conteudo"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {children}
        </div>
        {notas && (
          <>
            <div className="vs-force-note vs-force-note--up">{notas.up}</div>
            <div className="vs-force-note vs-force-note--down">{notas.down}</div>
          </>
        )}
      </div>

      <div className="vs-viewport-controles">
        <button type="button" onClick={() => aplicarZoom(zoom - PASSO)} disabled={zoom <= MIN} aria-label="Reduzir a cena">
          <Minus aria-hidden="true" />
        </button>
        <output aria-label="Ampliação da cena">{Math.round(zoom * 100)}%</output>
        <button type="button" onClick={() => aplicarZoom(zoom + PASSO)} disabled={zoom >= MAX} aria-label="Ampliar a cena">
          <Plus aria-hidden="true" />
        </button>
        <button type="button" onClick={() => aplicarZoom(MIN)} disabled={!ampliada} aria-label="Voltar ao tamanho natural">
          <RotateCcw aria-hidden="true" />
        </button>
        <span className="vs-viewport-dica">
          {ampliada ? 'arraste para navegar' : 'pinça ou + para ampliar'}
        </span>
      </div>
    </div>
  );
}

export default SceneViewport;
