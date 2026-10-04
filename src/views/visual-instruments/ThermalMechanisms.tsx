import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** Direction belongs to the line endpoint, including negative work. */
export function FirstLawMechanism({ work }: { work: number }) {
  const marker = `thermal-${useId().replace(/:/g, '')}`;
  const reduced = useReducedMotion();
  const piston = work < 0 ? 186 : work === 0 ? 200 : 218;
  return <g style={{ fontSize: 13, fill: 'var(--vs-ink)' }}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--vs-burgundy)" /></marker></defs>
    <text x="160" y="24" textAnchor="middle" fontWeight="800">gás em cilindro com pistão</text>
    <path d="M95 84V200H244V84" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <rect x="98" y="90" width={piston - 98} height="105" fill="var(--vs-burgundy)" opacity=".13" />
    {[112, 135, 158, 181].map((x, i) => <circle key={x} cx={x} cy={112 + (i % 2) * 65} r="3" fill="var(--vs-ink)" />)}
    <motion.g animate={{ x: piston - 200 }} transition={{ duration: reduced ? 0 : .25 }}>
      <path d="M200 87V196M200 142H238" stroke="var(--vs-ink)" strokeWidth="7" />
    </motion.g>
    <line data-energy-flow="heat" x1="20" y1="142" x2="94" y2="142" stroke="var(--vs-burgundy)" strokeWidth="4" markerEnd={`url(#${marker})`} />
    <text x="52" y="118" textAnchor="middle">Q = +12 J</text>
    {work !== 0 && <line data-energy-flow="work" x1={work > 0 ? 241 : 307} y1="142" x2={work > 0 ? 307 : 241} y2="142" stroke="var(--vs-burgundy)" strokeWidth="4" markerEnd={`url(#${marker})`} />}
    <text x="270" y="118" textAnchor="middle">W = {work} J</text>
    <text x="160" y="225" textAnchor="middle" fontWeight="800">ΔU = {12 - work} J</text>
    <text x="160" y="246" textAnchor="middle">{work < 0 ? 'compressão: trabalho entra no gás' : work > 0 ? 'expansão: trabalho sai do gás' : 'pistão fixo: não há trabalho'}</text>
    <text x="160" y="268" textAnchor="middle">Q &gt; 0: calor recebido pelo gás</text>
    <text x="160" y="289" textAnchor="middle">W &gt; 0: gás realiza · W &lt; 0: gás recebe</text>
  </g>;
}

/** For a reversible cycle, area on T×S is net work. Entropy origin is arbitrary. */
export function CarnotMechanism({ rejected }: { rejected: number }) {
  const marker = `carnot-${useId().replace(/:/g, '')}`;
  const coldY = 416 - 126 * rejected / 20;
  return <g style={{ fontSize: 13, fill: 'var(--vs-ink)' }}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--vs-burgundy)" /></marker></defs>
    <rect x="65" y="15" width="190" height="40" rx="5" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="2" />
    <text x="160" y="40" textAnchor="middle" fontWeight="800">Th = 600 K</text>
    <line data-carnot-flow="hot" x1="145" y1="55" x2="145" y2="110" stroke="var(--vs-burgundy)" strokeWidth="4" markerEnd={`url(#${marker})`} />
    <text x="158" y="83">Qh = 20 J</text>
    <rect x="90" y="114" width="110" height="57" rx="7" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <text x="145" y="138" textAnchor="middle" fontWeight="800">máquina</text><text x="145" y="158" textAnchor="middle">ΔU ciclo = 0</text>
    <line data-carnot-flow="work" x1="203" y1="140" x2="295" y2="140" stroke="var(--vs-burgundy)" strokeWidth="4" markerEnd={`url(#${marker})`} />
    <text x="255" y="124" textAnchor="middle">W = {20 - rejected} J</text>
    <line data-carnot-flow="cold" x1="145" y1="174" x2="145" y2="225" stroke="var(--vs-burgundy)" strokeWidth="4" markerEnd={`url(#${marker})`} />
    <text x="158" y="203">Qc = {rejected} J</text>
    <rect x="65" y="229" width="190" height="37" rx="5" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="2" />
    <text x="160" y="253" textAnchor="middle" fontWeight="800">Tc = {30 * rejected} K</text>
    <path d="M53 281V416H290" fill="none" stroke="var(--vs-ink)" strokeWidth="2" />
    <text x="16" y="270">T(K)</text><text x="270" y="437">S(J/K)</text>
    <text x="44" y="419" textAnchor="end">0</text><text x="44" y="297" textAnchor="end">600</text>
    <rect x="90" y="290" width="160" height={coldY - 290} fill="var(--vs-burgundy)" opacity=".17" />
    <line data-ts-hot="true" x1="90" y1="290" x2="250" y2="290" stroke="var(--vs-burgundy)" strokeWidth="2.5" markerEnd={`url(#${marker})`} />
    <line x1="250" y1="290" x2="250" y2={coldY} stroke="var(--vs-burgundy)" strokeWidth="2.5" markerEnd={`url(#${marker})`} />
    <line data-ts-cold="true" x1="250" y1={coldY} x2="90" y2={coldY} stroke="var(--vs-burgundy)" strokeWidth="2.5" markerEnd={`url(#${marker})`} />
    <line x1="90" y1={coldY} x2="90" y2="290" stroke="var(--vs-burgundy)" strokeWidth="2.5" markerEnd={`url(#${marker})`} />
    <text x="77" y="285">A</text><text x="255" y="285">B</text><text x="255" y={coldY + 15}>C</text><text x="75" y={coldY + 15}>D</text>
    <text x="170" y="455" textAnchor="middle">ΔS = Qh/Th = 1/30 J/K</text>
    <text x="160" y="477" textAnchor="middle">área = (Th − Tc)ΔS = W</text>
    <g data-carnot-stage="AB"><text x="16" y="504">A→B: expansão isotérmica · recebe Qh</text></g>
    <g data-carnot-stage="BC"><text x="16" y="526">B→C: expansão adiabática · Q = 0</text></g>
    <g data-carnot-stage="CD"><text x="16" y="548">C→D: compressão isotérmica · cede Qc</text></g>
    <g data-carnot-stage="DA"><text x="16" y="570">D→A: compressão adiabática · Q = 0</text></g>
    <text x="160" y="596" textAnchor="middle" fontWeight="800">Carnot ideal reversível · sem atrito</text>
    <text x="160" y="617" textAnchor="middle">adiabáticas reversíveis: S constante</text>
    <text x="160" y="638" textAnchor="middle">Qc/Qh = Tc/Th · temperaturas em K</text>
    <text x="160" y="659" textAnchor="middle">Th fixo; o controle Qc determina Tc</text>
  </g>;
}
