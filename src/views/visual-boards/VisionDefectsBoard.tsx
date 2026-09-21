import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';

/**
 * Dois olhos no mesmo corte. A comparação troca o velho macete "lente de
 * sinal tal" por uma pergunta espacial: em que lado da retina os raios se
 * encontrariam se não houvesse correção?
 */
function Eye({ kind, active, reduced }: { kind: 'miopia' | 'hipermetropia'; active: boolean; reduced: boolean | null }) {
  const myopia = kind === 'miopia';
  const retina = 250;
  const focus = myopia ? 205 : 282;
  const ray = myopia
    ? `M30 100 L116 122 L${focus} 150 L250 178 M30 200 L116 178 L${focus} 150 L250 122`
    : `M30 100 L116 122 L${focus} 150 M30 200 L116 178 L${focus} 150`;
  const correction = myopia
    ? 'M87 103 C68 124 68 176 87 197 C77 176 77 124 87 103Z'
    : 'M87 103 C104 124 104 176 87 197 C98 176 98 124 87 103Z';
  return <g data-vision-defect={kind} opacity={active ? 1 : .55}>
    <path d="M116 71 C206 63 267 95 279 150 C267 205 206 237 116 229 C95 210 81 181 81 150 C81 119 95 90 116 71Z" fill="color-mix(in srgb, var(--vs-blue) 13%, var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M116 71 C96 97 96 203 116 229" fill="none" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M250 85 Q271 150 250 215" fill="none" stroke="var(--vs-burgundy)" strokeWidth="6" />
    <path d={correction} fill="color-mix(in srgb, var(--vs-burgundy) 22%, transparent)" stroke="var(--vs-burgundy)" strokeWidth="2" />
    <motion.path d={ray} fill="none" stroke="var(--vs-blue)" strokeWidth="3" initial={false}
      animate={reduced ? { pathLength: 1, opacity: 1 } : { pathLength: active ? 1 : .55, opacity: active ? 1 : .52 }} transition={{ duration: .45 }} />
    <motion.path d={`M${focus} 128V172 M${focus - 10} 150H${focus + 10}`} stroke="var(--vs-burgundy)" strokeWidth="3" initial={false}
      animate={reduced ? { scale: 1 } : { scale: active ? [1, 1.18, 1] : 1 }} transition={{ duration: .55 }} style={{ transformOrigin: `${focus}px 150px` }} />
    {myopia && <path d={`M${focus} 150L250 178 M${focus} 150L250 122`} fill="none" stroke="var(--vs-blue)" strokeWidth="2" strokeDasharray="5 4" />}
    <text x="168" y="266" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)', fontSize: 14 }}>{myopia ? 'foco antes da retina' : 'foco depois da retina'}</text>
    <text x="87" y="91" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-burgundy)', fontSize: 12 }}>{myopia ? 'lente divergente' : 'lente convergente'}</text>
  </g>;
}

function VisionScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const reduced = useReducedMotion();
  const showMyopia = emphasis !== 'direita';
  return <svg className="vs-piston vs-scene" viewBox="0 0 650 330" role="img" data-emphasis={emphasis}
    aria-label="Comparação entre miopia e hipermetropia: o foco cai antes ou depois da retina e a lente corretiva o desloca para a retina">
    <text x="163" y="38" textAnchor="middle" style={{ fontWeight: 900, fill: 'var(--vs-ink)', fontSize: 18 }}>miopia</text>
    <text x="490" y="38" textAnchor="middle" style={{ fontWeight: 900, fill: 'var(--vs-ink)', fontSize: 18 }}>hipermetropia</text>
    <Eye kind="miopia" active={showMyopia} reduced={reduced} />
    <g transform="translate(326 0)"><Eye kind="hipermetropia" active={!showMyopia} reduced={reduced} /></g>
    <SceneNote text="a retina é o alvo nos dois casos" at={[325, 104]} to={[325, 292]} align="middle" />
  </svg>;
}

export default function VisionDefectsBoard(props: BoardProps) {
  const pair = boardPair(props);
  return <BoardShell
    title="Defeitos da visão: onde o foco erra"
    subtitle="A correção não escolhe uma lente por nome: ela recoloca o foco na retina."
    condition={{ label: 'imagem nítida', value: 'foco na retina' }}
    ariaLabel="Prancha ilustrada de miopia e hipermetropia"
    scene={<VisionScene emphasis={pair.emphasis} />}
    sceneNotes={{ up: 'miopia', down: 'hipermetropia' }} emphasis={pair.emphasis}
    left={{ label: 'Miopia', headline: 'O olho converge antes da retina.', detail: 'Objetos distantes já chegam desfocados porque o foco se forma cedo. A lente divergente espalha os raios antes do olho e adia a convergência.', formula: 'lente divergente · grau negativo' }}
    right={{ label: 'Hipermetropia', headline: 'O olho ainda não convergiu na retina.', detail: 'O foco ficaria atrás da retina. A lente convergente antecipa a convergência para que os raios se encontrem exatamente no tecido sensível.', formula: 'lente convergente · grau positivo' }}
    leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
    equation={{ label: 'Regra espacial', general: 'foco antes da retina', condition: 'corrige com', reduced: 'lente divergente' }}
    supports={<><section className="vs-formula-note"><span className="vs-note-title">Leitura que resolve</span><strong>Antes → diverge</strong><strong>Depois → converge</strong><p>Não decore sinais isolados: localize primeiro o foco em relação à retina e escolha a lente que o desloca até ela.</p></section><section className="vs-formula-note"><span className="vs-note-title">Não é a mesma coisa</span><strong>Presbiopia: acomodação</strong><p>A presbiopia vem da perda de flexibilidade do cristalino com a idade; pode coexistir com miopia ou hipermetropia.</p></section></>}
    closing="a retina é sempre o destino: se o foco chega cedo, a lente diverge; se chega tarde, a lente converge."
  />;
}
