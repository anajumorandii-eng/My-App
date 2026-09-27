import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { imagemDeLenteConvergente } from '../../lib/opticalImage';
import { MechanismFrame } from './MechanismFrame';

// "Estudo Analítico das Lentes Esféricas" abria o mesmo traçado de raios do
// estudo gráfico, com o mesmo título e o mesmo texto (auditoria 37). O
// capítulo é sobre as duas equações e a convenção de sinais, então a cena é o
// gráfico de p′ contra p: o sinal de p′ separa real de virtual sem desenhar
// raio nenhum, e a assíntota em p = f é o "sem imagem" do foco.
// f = ±20 cm e o objeto a 30 cm vêm do exercício resolvido do resumo.

const W = 520, H = 330;
const x0 = 60, y0 = 190, sx = 7, sy = 1.6;
const px = (p: number) => x0 + p * sx;
const py = (q: number) => y0 - q * sy;
const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 }).replace('-', '−');

function curva(f: number) {
  const trechos: string[][] = [[]];
  for (let p = 1; p <= 60; p += 0.25) {
    if (Math.abs(p - f) < 0.3) { trechos.push([]); continue; }
    const q = (p * f) / (p - f);
    if (q > 70 || q < -70) { if (trechos.at(-1)!.length) trechos.push([]); continue; }
    trechos.at(-1)!.push(`${px(p).toFixed(1)} ${py(q).toFixed(1)}`);
  }
  return trechos.filter((t) => t.length > 1).map((t) => `M${t.join('L')}`).join('');
}

export default function LensAnalyticMechanism() {
  const [f, setF] = useState(20);
  const [p, setP] = useState(30);
  const reduzir = useReducedMotion();
  const noFoco = p === f;
  const img = noFoco ? null : imagemDeLenteConvergente(p, 1, f);
  const q = img?.distancia ?? 0;
  const visivel = img && Math.abs(q) <= 70;
  const posicoes = [10, 15, 20, 25, 30, 40, 50, 60];
  return <MechanismFrame
    note="Lente delgada, aproximação paraxial. p em cm, sempre positivo para objeto real; o sinal de p′ sai da equação."
    controls={<>
      <div className="mechanism-options" role="group" aria-label="Tipo de lente">
        {[20, -20].map((v) => <button type="button" key={v} aria-pressed={f === v} onClick={() => setF(v)}>{v > 0 ? 'Convergente, f = +20 cm' : 'Divergente, f = −20 cm'}</button>)}
      </div>
      <div className="mechanism-options" role="group" aria-label="Distância do objeto">
        {posicoes.map((v) => <button type="button" key={v} aria-pressed={p === v} onClick={() => setP(v)}>p = {v}</button>)}
      </div>
      <p role="status">{noFoco
        ? 'Objeto no foco: 1/p′ = 0, sem imagem a distância finita.'
        : <>1/p′ = 1/f − 1/p = 1/{fmt(f)} − 1/{p} → p′ = {fmt(q)} cm, imagem {img!.real ? 'real' : 'virtual'}. A = −p′/p = {fmt(-q / p)}: {img!.invertida ? 'invertida' : 'direita'}, {fmt(Math.abs(q / p))}×.</>}
      </p>
    </>}>
    <svg viewBox={`0 0 ${W} ${H}`} className="lens-analytic" style={{ fontFamily: 'system-ui, sans-serif' }} role="img" aria-label={noFoco ? 'Objeto no foco, sem imagem' : `p = ${p} cm, p′ = ${fmt(q)} cm`}>
      <defs><marker id="la-ponta" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--vs-ink)" /></marker></defs>
      <rect x={x0} y={py(70)} width={60 * sx} height={70 * sy} fill="color-mix(in srgb, var(--vs-burgundy) 8%, transparent)" />
      <rect x={x0} y={y0} width={60 * sx} height={70 * sy} fill="color-mix(in srgb, var(--vs-blue) 10%, transparent)" />
      <text x={px(60) - 6} y={py(70) + 16} textAnchor="end" fill="var(--vs-burgundy)" fontSize="13" fontWeight="700">p′ &gt; 0: imagem real</text>
      <text x={px(60) - 6} y={py(-70) - 8} textAnchor="end" fill="var(--vs-blue)" fontSize="13" fontWeight="700">p′ &lt; 0: imagem virtual</text>
      <path d={`M${x0} ${y0}H${px(60) + 14}`} stroke="var(--vs-ink)" strokeWidth="1.8" markerEnd="url(#la-ponta)" />
      <path d={`M${x0} ${py(-70)}V${py(70) - 14}`} stroke="var(--vs-ink)" strokeWidth="1.8" markerEnd="url(#la-ponta)" />
      <text x={px(60) + 14} y={y0 - 8} textAnchor="end" fill="var(--vs-ink)" fontSize="13">p (cm)</text>
      <text x={x0 + 8} y={py(70) - 4} fill="var(--vs-ink)" fontSize="13">p′ (cm)</text>
      {[20, 40, 60].map((v) => <text key={v} x={px(v)} y={y0 + 18} textAnchor="middle" fill="var(--vs-dim)" fontSize="12">{v}</text>)}
      {[60, -60].map((v) => <text key={v} x={x0 - 6} y={py(v) + 4} textAnchor="end" fill="var(--vs-dim)" fontSize="12">{v}</text>)}
      {f > 0 && <><path d={`M${px(f)} ${py(70)}V${py(-70)}`} stroke="var(--vs-dim)" strokeWidth="1.2" strokeDasharray="5 4" /><text x={px(f) + 6} y={py(70) + 14} fill="var(--vs-dim)" fontSize="12">p = f</text></>}
      <path d={curva(f)} fill="none" stroke="var(--vs-ink)" strokeWidth="2.5" />
      {visivel && <motion.circle r="7" fill={img!.real ? 'var(--vs-burgundy)' : 'var(--vs-blue)'} stroke="var(--vs-paper-strong)" strokeWidth="2"
        initial={false} animate={{ cx: px(p), cy: py(q) }} transition={reduzir ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 20 }} />}
      {img && !visivel && <text x={px(p)} y={q > 0 ? py(70) + 34 : py(-70) - 26} textAnchor="middle" fill="var(--vs-dim)" fontSize="12">p′ = {fmt(q)}, fora do gráfico</text>}
      <text x={W / 2} y={H - 8} textAnchor="middle" fill="var(--vs-ink)" fontSize="14" fontWeight="700">1/f = 1/p + 1/p′ · A = −p′/p</text>
    </svg>
  </MechanismFrame>;
}
