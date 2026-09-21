import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { LITERARY_AUTHORS, type LiteraryAuthorId } from '../../lib/literaryAuthorLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import './LiteraryAuthorInstrument.css';

/**
 * Ficha de autor: três fileiras empilhadas — Trajetória, Técnica, Obras —
 * em vez do eixo horizontal de `LiteraryTraitInstrument.tsx`. A escolha não é
 * estética: um perfil de autor tem ordem de leitura fixa (de onde ele vem →
 * como ele escreve → o que ele escreveu), enquanto uma estética não tem uma
 * faceta que preceda a outra. Empilhar em vez de espalhar ao longo de um eixo
 * marca essa diferença de leitura, e cada fileira cabe um rótulo mais longo
 * do que um cartão de eixo horizontal permitiria.
 */
const ROW_ICON: Record<'Trajetória' | 'Técnica' | 'Obras', string> = {
  // Uma seta de trajetória, uma engrenagem simplificada (técnica) e um livro
  // aberto (obras) — motivos neutros, não uma cena que pertença a um autor
  // específico, para não repetir texto já dado pelo rótulo ao lado.
  Trajetória: 'M6 18L16 8M16 8H8M16 8V16',
  Técnica: 'M12 4V7M12 17V20M4 12H7M17 12H20M6.5 6.5L8.6 8.6M15.4 15.4L17.5 17.5M6.5 17.5L8.6 15.4M15.4 8.6L17.5 6.5M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z',
  Obras: 'M4 6C4 5 5 4.5 8 4.5C10.5 4.5 12 5.5 12 5.5C12 5.5 13.5 4.5 16 4.5C19 4.5 20 5 20 6V17C20 16 19 15.5 16 15.5C13.5 15.5 12 16.5 12 16.5C12 16.5 10.5 15.5 8 15.5C5 15.5 4 16 4 17V6Z M12 5.5V16.5',
};

function AuthorScene({ id, index }: { id: LiteraryAuthorId; index: number }) {
  const config = LITERARY_AUTHORS[id];
  const reduced = useReducedMotion();
  const rowY = [16, 96, 176] as const;
  return <svg className="vs-plane" viewBox="0 0 340 270" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-literary-author={id}>
    <rect x="12" y="4" width="316" height="262" rx="12" fill="none" stroke="var(--vs-line)" strokeWidth="2" />
    {config.cases.map((item, itemIndex) => {
      const y = rowY[itemIndex];
      const active = itemIndex === index;
      return <motion.g key={item.label} initial={false} animate={{ opacity: active ? 1 : .6, scale: active ? 1.02 : 1 }} transition={{ duration: reduced ? 0 : .25 }} style={{ transformOrigin: `170px ${y + 37}px` }}>
        <rect x="22" y={y} width="296" height="70" rx="10" fill={active ? 'color-mix(in srgb,var(--vs-burgundy) 20%,var(--vs-paper))' : 'var(--vs-paper)'} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-dim)'} strokeWidth="3" />
        <g transform={`translate(38, ${y + 25})`} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-dim)'} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={ROW_ICON[item.label]} />
        </g>
        <text x="70" y={y + 26} fill="var(--vs-ink)" fontSize="13" fontWeight="800">{item.label}</text>
        <text x="70" y={y + 44} fill="var(--vs-dim)" fontSize="10">{item.note}</text>
      </motion.g>;
    })}
  </svg>;
}

export function literaryAuthorInstrument(id: LiteraryAuthorId) {
  const config = LITERARY_AUTHORS[id];
  return function LiteraryAuthorBoard(props: BoardProps) {
    const [index, setIndex] = useState(0);
    const selected = config.cases[index];
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Perfil de autor" title={config.title} subtitle={config.question}
      condition={{ label: 'Eixo', value: selected.label }} ariaLabel={`Instrumento literário: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><AuthorScene id={id} index={index} /><div className="vs-plane-controls"><div className="vs-plane-control"><p>Percorra o perfil:</p><div className="vs-literary-author-options" role="group" aria-label={`Eixos de ${config.title}`}>{config.cases.map((item, itemIndex) => <button key={item.label} type="button" aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}>{item.label}</button>)}</div></div></div><dl className="vs-plane-readouts" aria-live="polite"><div><dt>Em síntese</dt><dd>{selected.note}</dd></div><div><dt>Observe</dt><dd>{selected.observation}</dd></div><div data-pivot="true"><dt>Conclua</dt><dd>{selected.conclusion}</dd></div></dl><p className="vs-instrument-dica">{config.caution}</p></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? config.question, formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? selected.observation, formula: selected.conclusion }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação de autor', general: config.relation, condition: selected.label, reduced: selected.conclusion }} closing={config.caution} />;
  };
}
