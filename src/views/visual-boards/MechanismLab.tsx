import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '../../design-system/motion/tokens';

export function NewtonLab() {
  const reduced = useReducedMotion();
  const [force, setForce] = useState(4);
  const [mass, setMass] = useState(2);
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<{ acceleration: number; distance: number } | null>(null);
  const reset = () => setResult(null);
  return <section className="vs-mechanism" aria-label="Experimento de força e massa">
    <span className="vs-board-kicker">Você controla o experimento</span>
    <h3>Quanto o carrinho avança em 1 segundo?</h3>
    <p>Partida do repouso, trilho horizontal sem atrito. Peso e normal se equilibram; a força horizontal determina a aceleração.</p>
    <div className="vs-lab-inputs">
      <label>Força: {force} N<input type="range" min="0" max="8" step="1" value={force} onChange={e => { setForce(Number(e.target.value)); reset(); }} /></label>
      <label>Massa: {mass} kg<input type="range" min="1" max="4" step="1" value={mass} onChange={e => { setMass(Number(e.target.value)); reset(); }} /></label>
    </div>
    <svg viewBox="0 0 480 125" role="img" aria-label={result ? `Deslocamento ${result.distance} metros após um segundo` : 'Carrinho parado no início do trilho'}>
      <path d="M28 96H450" stroke="currentColor" fill="none" />
      {[0, 1, 2, 3, 4].map(n => <g key={n}><path d={`M${48 + n * 88} 96v6`} stroke="currentColor" /><text x={48 + n * 88} y="119" textAnchor="middle">{n} m</text></g>)}
      <motion.g key={run} initial={reduced ? false : { x: 0 }} animate={{ x: (result?.distance ?? 0) * 88 }}
        transition={{ duration: reduced || !result ? 0 : 1, ease: t => t * t }}>
        <rect x="29" y="58" width="48" height="26" rx="3" fill="#b68149" stroke="currentColor" />
        <circle cx="39" cy="88" r="7" fill="#35463e" /><circle cx="67" cy="88" r="7" fill="#35463e" />
        {force > 0 && <path d={`M53 49h${force * 5}l-6-4m6 4-6 4`} stroke="#852636" strokeWidth="2" fill="none" />}
      </motion.g>
    </svg>
    <button type="button" onClick={() => { setRun(n => n + 1); setResult({ acceleration: force / mass, distance: force / mass / 2 }); }}>Aplicar força por 1 segundo</button>
    <p role="status">{result ? `a = F/m = ${result.acceleration.toLocaleString('pt-BR')} m/s². Δs = ½at² = ${result.distance.toLocaleString('pt-BR')} m. ${force === 0 ? 'Sem resultante, o carrinho permanece em repouso.' : 'Aumente a massa ou mude a força e compare.'}` : 'Escolha força e massa. Depois, execute para observar a consequência.'}</p>
  </section>;
}

export function AtomLab() {
  const reduced = useReducedMotion();
  const [level, setLevel] = useState(1);
  const [previous, setPrevious] = useState(1);
  const energy = (n: number) => -13.6 / (n * n);
  const delta = energy(level) - energy(previous);
  return <section className="vs-mechanism" aria-label="Experimento de níveis de energia">
    <span className="vs-board-kicker">Modelo de Bohr · hidrogênio</span><h3>Um salto tem uma energia exata</h3>
    <p>Escolha o nível final. Subir exige absorver energia; descer emite um fóton. O diagrama é esquemático.</p>
    <svg viewBox="0 0 480 140" role="img" aria-label={`Elétron no nível ${level}; energia ${energy(level).toFixed(2)} elétron-volts`}>
      {[1, 2, 3].map(n => <g key={n}><path d={`M40 ${135 - n * 35}H330`} fill="none" stroke="currentColor" opacity=".4" /><text x="342" y={139 - n * 35}>n = {n} · {energy(n).toFixed(2)} eV</text></g>)}
      <motion.circle cx="180" r="7" fill="#345e78" initial={false} animate={{ cy: 135 - level * 35 }} transition={{ duration: reduced ? 0 : MOTION_DURATION.core, ease: MOTION_EASE }} />
    </svg>
    <div className="vs-lab-inputs">{[1, 2, 3].map(n => <button type="button" key={n} aria-pressed={level === n} onClick={() => { setPrevious(level); setLevel(n); }}>Nível n = {n}</button>)}</div>
    <p role="status">{delta === 0 ? 'Selecione outro nível para comparar a energia.' : `${delta > 0 ? 'Absorção' : 'Emissão'} de ${Math.abs(delta).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} eV. ΔE = Efinal − Einicial; a energia do fóton é |ΔE| = hν.`}</p>
  </section>;
}
