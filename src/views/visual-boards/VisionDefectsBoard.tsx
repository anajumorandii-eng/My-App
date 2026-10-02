import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { visionDiagram } from '../../lib/visionDiagram';
import './VisionDefectsBoard.css';

/**
 * Dois olhos no mesmo corte. A comparação troca o velho macete "lente de
 * sinal tal" por uma pergunta espacial: em que lado da retina os raios se
 * encontrariam se não houvesse correção?
 */
function Eye({ kind, active, reduced, corrected }: { kind: 'miopia' | 'hipermetropia'; active: boolean; reduced: boolean | null; corrected: boolean }) {
  const myopia = kind === 'miopia';
  const { focusX: focus, rays } = visionDiagram(kind, corrected);
  const path = (points: [number, number][]) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const correction = myopia
    ? 'M50 96 Q60 150 50 204 L66 204 Q56 150 66 96Z'
    : 'M58 96 Q42 150 58 204 Q74 150 58 96Z';
  return <g data-vision-defect={kind} data-corrected={corrected} data-active={active}>
    <path d="M116 71 C206 63 267 95 279 150 C267 205 206 237 116 229 C95 210 81 181 81 150 C81 119 95 90 116 71Z" fill="color-mix(in srgb, var(--vs-blue) 13%, var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M116 71 C96 97 96 203 116 229" fill="none" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M250 85 Q270 150 250 215" fill="none" stroke="var(--vs-burgundy)" strokeWidth="6" />
    {corrected && <path d={correction} fill="color-mix(in srgb, var(--vs-burgundy) 22%, transparent)" stroke="var(--vs-burgundy)" strokeWidth="2" />}
    {rays.map((ray, i) => <React.Fragment key={i}>
      <path data-vision-ray d={path(ray.points)} fill="none" stroke="var(--vs-blue)" strokeWidth="3" />
      {ray.extension.length > 0 && <path data-vision-extension d={path(ray.extension)} fill="none" stroke="var(--vs-blue)" strokeWidth="2" strokeDasharray="5 4" />}
    </React.Fragment>)}
    <motion.path d={`M${focus} 128V172 M${focus - 10} 150H${focus + 10}`} stroke="var(--vs-burgundy)" strokeWidth="3" initial={false}
      animate={reduced ? { scale: 1 } : { scale: active ? [1, 1.18, 1] : 1 }} transition={{ duration: .55 }} style={{ transformOrigin: `${focus}px 150px` }} />
    <text x="168" y="266" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)', fontSize: 24 }}>{corrected ? 'foco na retina' : myopia ? 'foco antes da retina' : 'foco depois da retina'}</text>
    <text x="24" y="58" textAnchor="start" style={{ fontWeight: 800, fill: 'var(--vs-burgundy)', fontSize: 24 }}>{corrected ? myopia ? 'lente divergente' : 'lente convergente' : 'sem lente corretiva'}</text>
  </g>;
}

function VisionScene({ emphasis, corrected }: { emphasis: 'esquerda' | 'direita' | 'nenhum'; corrected: boolean }) {
  const reduced = useReducedMotion();
  return <svg className="vs-piston vs-scene" viewBox="0 0 650 330" role="img" data-emphasis={emphasis}
    aria-label="Comparação entre miopia e hipermetropia: o foco cai antes ou depois da retina e a lente corretiva o desloca para a retina">
    <text x="163" y="28" textAnchor="middle" style={{ fontWeight: 900, fill: 'var(--vs-ink)', fontSize: 24 }}>miopia</text>
    <text x="490" y="28" textAnchor="middle" style={{ fontWeight: 900, fill: 'var(--vs-ink)', fontSize: 24 }}>hipermetropia</text>
    <Eye kind="miopia" active={emphasis === 'esquerda'} reduced={reduced} corrected={corrected} />
    <g transform="translate(326 0)"><Eye kind="hipermetropia" active={emphasis === 'direita'} reduced={reduced} corrected={corrected} /></g>
    <text x="325" y="313" textAnchor="middle" fill="var(--vs-ink)" fontSize="22">esquema paraxial · sem acomodação</text>
  </svg>;
}

export default function VisionDefectsBoard(props: BoardProps) {
  const pair = boardPair(props);
  const [corrected, setCorrected] = useState(false);
  return <BoardShell
    title="Defeitos da visão: onde o foco erra"
    subtitle="A correção não escolhe uma lente por nome: ela recoloca o foco na retina."
    condition={corrected ? { label: 'imagem nítida', value: 'foco na retina' } : { label: 'situação', value: 'sem correção' }}
    ariaLabel="Prancha ilustrada de miopia e hipermetropia"
    scene={<div className="vs-vision-diagram">
      <div className="vs-vision-controls" role="group" aria-label="Correção dos defeitos da visão">
        <button type="button" aria-pressed={!corrected} onClick={() => setCorrected(false)}>Sem correção</button>
        <button type="button" aria-pressed={corrected} onClick={() => setCorrected(true)}>Com correção</button>
      </div>
      <VisionScene emphasis={pair.emphasis} corrected={corrected} />
      <p className="vs-vision-key">A linha tracejada prolonga o raio: o foco atrás da retina não é recebido por ela.</p>
    </div>}
    emphasis={pair.emphasis}
    left={{ label: 'Miopia', headline: 'Sem correção, o olho converge antes da retina.', detail: 'Objetos distantes já chegam desfocados porque o foco se forma cedo. A lente divergente espalha os raios antes do olho e adia a convergência.', formula: 'lente divergente · grau negativo' }}
    right={{ label: 'Hipermetropia', headline: 'Sem correção, o olho ainda não convergiu na retina.', detail: 'O foco ficaria atrás da retina. A lente convergente antecipa a convergência para que os raios se encontrem exatamente no tecido sensível.', formula: 'lente convergente · grau positivo' }}
    leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
    equation={{ label: 'Regra espacial', general: 'antes / depois da retina', condition: 'corrige com', reduced: 'divergente / convergente' }}
    supports={<><section className="vs-formula-note"><span className="vs-note-title">Leitura que resolve</span><strong>Antes → diverge</strong><strong>Depois → converge</strong><p>Não decore sinais isolados: localize primeiro o foco em relação à retina e escolha a lente que o desloca até ela.</p></section><section className="vs-formula-note"><span className="vs-note-title">Não é a mesma coisa</span><strong>Presbiopia: acomodação</strong><p>A presbiopia vem da perda de flexibilidade do cristalino com a idade; pode coexistir com miopia ou hipermetropia.</p></section></>}
    closing="a retina é sempre o destino: se o foco chega cedo, a lente diverge; se chega tarde, a lente converge."
  />;
}
