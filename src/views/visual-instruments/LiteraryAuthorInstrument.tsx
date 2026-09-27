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
// Auditoria 35: a ficha de Clarice e a de Machado eram visualmente idênticas
// — seta, engrenagem e livro para qualquer autor. Cada fileira ganha agora o
// emblema da própria nota do lab: a virada de 1881 de Machado, a pedra no
// meio do caminho de Drummond, as sete sílabas da redondilha de João Cabral,
// a estrela de Macabéa. O desenho não diz nada que a nota não diga.
const f = { fill: 'none' } as const;
const cheio = { fill: 'currentColor', fillOpacity: 0.25 } as const;
const txt = (x: number, y: number, t: string, size = 9) => <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="800" fill="currentColor" stroke="none">{t}</text>;
const AUTHOR_ICONS: Record<LiteraryAuthorId, [React.ReactNode, React.ReactNode, React.ReactNode]> = {
  'machado-de-assis': [
    <><rect x="-20" y="-10" width="18" height="20" rx="2" {...f} /><rect x="2" y="-10" width="18" height="20" rx="2" {...cheio} />{txt(0, 22, '1881')}</>,
    <><path d="M-18-14h36v22H-4l-8 8v-8h-6Z" {...f} />{txt(0, 2, '?', 14)}</>,
    <><circle r="16" {...f} /><circle cx="-6" cy="-4" r="2" {...cheio} /><circle cx="6" cy="-4" r="2" {...cheio} /><path d="M-7 6c5 3 10 1 13-4" {...f} /></>,
  ],
  'graciliano-ramos': [
    <path d="M-18-8h14M-18 0h10M-18 8h16M4-8h14M4 0h8" {...f} />,
    <><circle cx="10" cy="-6" r="5" {...f} /><path d="M10-1v12M4 4h12" {...f} /><path d="M-20-16h14v10h-6l-4 4v-4h-4Z" {...f} /><path d="M-6-6L4-4" {...f} strokeDasharray="2 3" /></>,
    <><path d="M-18 6l10-10 10 10v12h-20Z" {...f} /><path d="M6 18V6M12 18V6M18 18V6M4 10h16" {...f} /></>,
  ],
  'carlos-drummond': [
    <path d="M-20 14h12v-10h12v-10h12v-10" {...f} />,
    <><path d="M-18-10h36M-18-2h36M-18 6h36M-18 14h36" {...f} /><path d="M-18-10h10M-18 6h10" strokeWidth="4" {...f} /></>,
    // "No meio do caminho tinha uma pedra".
    <><path d="M-22 14C-8 6 8 6 22 14" {...f} /><path d="M-6 8c0-8 4-12 8-12s6 6 6 12Z" {...cheio} /></>,
  ],
  'joao-cabral': [
    <><path d="M-18 16L-18-16 14 16Z" {...f} /><path d="M-12 10L-12-2 0 10Z" {...f} /></>,
    <>{Array.from({ length: 7 }, (_, k) => <circle key={k} cx={-18 + k * 6} cy="0" r="2.4" {...cheio} />)}{txt(0, 16, '7 sílabas')}</>,
    <><path d="M-22 6c6-6 12 6 18 0s12-6 18 0 8 4 8 4" {...f} /><path d="M-4-6c0-8 4-10 8-10s6 4 6 10Z" {...cheio} /></>,
  ],
  'clarice-lispector': [
    <><path d="M-16 0c8-10 24-10 32 0" {...f} /><path d="M-16 0c8 6 24 6 32 0" {...f} />{[-40, -90, -140].map((a) => <path key={a} d={`M${(14 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(-6 + 14 * Math.sin((a * Math.PI) / 180)).toFixed(1)}l${(5 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(5 * Math.sin((a * Math.PI) / 180)).toFixed(1)}`} {...f} />)}</>,
    <><path d="M-20-6h10M-6-6h6M6-2h14M-20 6h8M-6 8h4" {...f} />{txt(12, 12, '?', 13)}</>,
    // A Hora da Estrela.
    <path d="M0-16l4 10h11l-9 7 3 11-9-7-9 7 3-11-9-7h11Z" {...cheio} />,
  ],
  'guimaraes-rosa': [
    <><rect x="-20" y="-8" width="16" height="16" rx="2" {...f} /><rect x="4" y="-8" width="16" height="16" rx="2" {...cheio} /><path d="M-4 0h8" {...f} />{txt(0, 20, 'neologismo', 8)}</>,
    <><circle cx="-10" cy="-6" r="5" {...f} /><path d="M-10-1v14M-16 4h12" {...f} /><circle cx="12" cy="-6" r="5" {...f} strokeDasharray="2 2" /><path d="M12-1v14M6 4h12" {...f} strokeDasharray="2 2" /></>,
    <><path d="M-20 16C-10 10-14 0-4-2s10-10 22-16" {...f} /><path d="M-22 4c10 2 20 8 26 16" {...f} strokeDasharray="3 3" /></>,
  ],
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
        <g transform={`translate(54, ${y + 35})`} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-dim)'} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: active ? 'var(--vs-burgundy)' : 'var(--vs-dim)' }}>
          {AUTHOR_ICONS[id][itemIndex]}
        </g>
        {/* A nota tinha 10 de fonte, ~10,6 px efetivos no celular (auditoria 35). */}
        <text x="90" y={y + 30} fill="var(--vs-ink)" fontSize="15" fontWeight="800">{item.label}</text>
        <text x="90" y={y + 50} fill="var(--vs-dim)" fontSize="13">{item.note}</text>
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
