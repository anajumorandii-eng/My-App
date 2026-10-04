import { LunetaScene } from './LunetaScene';
import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { PHYSICS_REMAINING, type PhysicsRemainingId } from '../../lib/physicsRemainingLab';
import type { BoardProps } from '../visual-boards/types';
import { Brilho, Nota, Painel, Papel, Pilula, Rotulo, Sombra, cor, useKit } from './illustrationKit';
import { motion, useReducedMotion } from 'motion/react';

const short = (text?: string) => { const first = text?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return first.length > 180 ? `${first.slice(0, 176)}…` : first; };
const decimal = (value: number) => String(Math.round(value * 100) / 100).replace('.', ',');
const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
// Texto nunca herda `ink`: ele é traço de linha (stroke 3, fill none) e, como
// estilo inline, vence o reset global de `Visual.css`. No iPad escuro cada rótulo
// virava um borrão de contorno sem preenchimento.
const txt = { fill: 'var(--vs-ink)', fontWeight: 700 } as const;
const wine = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };

/**
 * Pulso na corda, ida e volta em duas faixas. A cena antiga desenhava a ida e
 * a volta no mesmo eixo, com a extremidade como um traço e um círculo, e o
 * rótulo que decidia tudo ("crista retorna como vale") ficava no rodapé. Aqui
 * a extremidade é o objeto: parede com a corda amarrada, ou anel que desliza
 * na haste — é ele que explica por que o pulso volta invertido ou não.
 */
function RopeBoundaryScene({ fixed }: { fixed: boolean }) {
  const kit = useKit();
  const parede = 272;
  const pulso = (centro: number, y: number, sobe: boolean) => {
    const pts = Array.from({ length: 61 }, (_, i) => { const x = 22 + ((parede - 22) * i) / 60; const g = Math.exp(-(((x - centro) / 17) ** 2)); return `${x.toFixed(1)} ${(y - (sobe ? 1 : -1) * 34 * g).toFixed(1)}`; });
    return `M${pts.join('L')}`;
  };
  // Corda torcida: contorno de tinta, cor por dentro e um tracejado claro que
  // imita as fibras. Uma linha lisa lia como gráfico, não como corda.
  const corda = (d: string, tom: 'laranja' | 'ciano') => <g>
    <path d={d} fill="none" stroke="var(--vs-kit-contorno)" strokeWidth="8" strokeLinecap="round" />
    <path d={d} fill="none" stroke={cor(tom)} strokeWidth="5" strokeLinecap="round" />
    <path d={d} fill="none" stroke="#fff" strokeWidth="1.4" strokeDasharray="2 5" opacity=".55" />
  </g>;
  const yIda = 84, yVolta = 196;
  const seta = (x: number, y: number, esquerda: boolean) => <g stroke="var(--vs-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round">
    <path d={`M${x} ${y}h${esquerda ? -36 : 36}`} /><path d={esquerda ? `M${x - 30} ${y - 5}l-6 5 6 5` : `M${x + 30} ${y - 5}l6 5-6 5`} />
  </g>;
  const extremidade = (y: number) => fixed
    ? <circle cx={parede} cy={y} r="4.5" fill={cor('sol')} stroke="var(--vs-kit-contorno)" strokeWidth="1.3" />
    : <g><rect x={parede - 8} y={y - 10} width="16" height="20" rx="6" fill={kit.ouro} stroke="var(--vs-kit-contorno)" strokeWidth="1.5" /><rect x={parede - 8} y={y - 10} width="16" height="20" rx="6" fill={kit.reflexo} /></g>;
  return <g data-physics-system="rope-boundary">
    <kit.Defs />
    <Papel kit={kit} />
    <Painel x={8} y={22} w={252} h={92} titulo="IDA" tom="laranja" />
    <Painel x={8} y={134} w={252} h={102} titulo="VOLTA" tom="ciano" />
    {fixed
      ? <g filter={kit.neon}>
          {Array.from({ length: 11 }, (_, linha) => Array.from({ length: 2 }, (_, col) => {
            const x = parede + (linha % 2 ? -6 : 0) + col * 17, y = 18 + linha * 20;
            return <rect key={`${linha}-${col}`} x={Math.max(parede, x)} y={y} width={Math.min(17, x + 17 - Math.max(parede, x), 306 - Math.max(parede, x))} height="20" fill={cor('vermelho')} stroke="var(--vs-kit-contorno)" strokeWidth="1.2" />;
          }))}
          <rect x={parede} y="18" width="34" height="220" fill={kit.reflexo} />
        </g>
      : <g><Sombra cx={parede} cy={242} rx={16} /><rect x={parede - 3} y="18" width="6" height="222" rx="3" fill={kit.metal} stroke="var(--vs-kit-contorno)" strokeWidth="1.5" /></g>}
    {corda(pulso(112, yIda, true), 'laranja')}
    {extremidade(yIda)}
    {seta(170, 40, false)}
    {corda(pulso(140, yVolta, !fixed), 'ciano')}
    {extremidade(yVolta)}
    {seta(236, 152, true)}
    <Brilho x={112} y={yIda - 44} r={6} />
    <Nota de={[104, yIda - 36]} em={[40, 50]} texto="crista" ancora="middle" curva={-1} tom="laranja" />
    <Nota de={[fixed ? 152 : 150, fixed ? yVolta + 30 : yVolta - 30]} em={[190, fixed ? 166 : 218]} ancora="start" tom="ciano" texto={fixed ? ['volta', 'como vale'] : ['volta', 'como crista']} curva={fixed ? 1 : -1} />
    <Nota de={[parede - (fixed ? 4 : 10), yIda + 2]} em={[252, 104]} ancora="end" tom="roxo" tam={12} texto={fixed ? 'presa: não se desloca' : 'o anel sobe e desce'} curva={1} />
    <Pilula x={14} y={258} w={292} tom={fixed ? 'vermelho' : 'verde'}>{fixed ? 'ponta fixa: o pulso volta invertido' : 'ponta livre: o pulso volta igual'}</Pilula>
  </g>;
}

/**
 * Duas polias ligadas por correia. Antes eram dois círculos com contorno e
 * duas retas; a correia não abraçava as polias e nada mostrava a diferença
 * de giro. Aqui a correia é tangente de verdade às duas bordas, e os raios
 * giram cada um no seu ω — a mesma v na correia, a polia maior mais devagar.
 * Com movimento reduzido os raios ficam parados e o arco de ω diz o mesmo.
 */
function PulleysScene({ raio }: { raio: number }) {
  const kit = useKit();
  const reduzir = useReducedMotion();
  const esc = 2;
  const c1 = { x: 58, y: 122 }, c2 = { x: 220, y: 122 };
  const R1 = 10 * esc, R2 = raio * esc;
  const w1 = 30, w2 = 300 / raio;
  const d = c2.x - c1.x;
  const a = Math.asin((R2 - R1) / d);
  const topo = (c: { x: number; y: number }, R: number) => [c.x - R * Math.sin(a), c.y - R * Math.cos(a)];
  const base = (c: { x: number; y: number }, R: number) => [c.x - R * Math.sin(a), c.y + R * Math.cos(a)];
  const [t1, t2, b2, b1] = [topo(c1, R1), topo(c2, R2), base(c2, R2), base(c1, R1)].map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`);
  const correia = `M${t1}L${t2}A${R2} ${R2} 0 1 1 ${b2}L${b1}A${R1} ${R1} 0 0 1 ${t1}Z`;
  const polia = (c: { x: number; y: number }, R: number, w: number, tom: 'vermelho' | 'ciano') => {
    const raios = Array.from({ length: 4 }, (_, k) => { const g = (k * Math.PI) / 4; return `M${c.x - (R - 5) * Math.cos(g)} ${c.y - (R - 5) * Math.sin(g)}L${c.x + (R - 5) * Math.cos(g)} ${c.y + (R - 5) * Math.sin(g)}`; }).join('');
    return <g>
      <circle cx={c.x} cy={c.y} r={R} fill={kit.esfera(tom)} />
      <circle cx={c.x} cy={c.y} r={R} fill={kit.reflexo} />
      <circle cx={c.x} cy={c.y} r={Math.max(R - 5, 4)} fill="none" stroke="#fff" strokeWidth="1.2" opacity=".45" />
      <motion.g style={{ originX: `${c.x}px`, originY: `${c.y}px` }} animate={reduzir ? undefined : { rotate: 360 }} transition={{ duration: 36 / w, repeat: Infinity, ease: 'linear' }}>
        <path d={raios} stroke="#fff" strokeWidth="2.2" opacity=".75" strokeLinecap="round" />
      </motion.g>
      <circle cx={c.x} cy={c.y} r="5.5" fill={kit.ouro} stroke="var(--vs-kit-contorno)" strokeWidth="1.2" />
    </g>;
  };
  // Arco de ω: 5° por rad/s, com ponta. O arco curto da polia grande é a
  // leitura estática do que a animação mostra.
  const arco = (c: { x: number; y: number }, R: number, w: number) => {
    const r = R + 15, g0 = -150 * Math.PI / 180, g1 = g0 + (w * 5 * Math.PI) / 180;
    const p = (g: number) => `${(c.x + r * Math.cos(g)).toFixed(1)} ${(c.y + r * Math.sin(g)).toFixed(1)}`;
    const ang = g1 + Math.PI / 2, px = c.x + r * Math.cos(g1), py = c.y + r * Math.sin(g1);
    const ponta = (s: number) => `${(px - 9 * Math.cos(ang + s)).toFixed(1)} ${(py - 9 * Math.sin(ang + s)).toFixed(1)}`;
    return <g stroke={cor('sol')} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${p(g0)}A${r} ${r} 0 ${w * 5 > 180 ? 1 : 0} 1 ${p(g1)}`} />
      <path d={`M${ponta(0.5)}L${px.toFixed(1)} ${py.toFixed(1)}L${ponta(-0.5)}`} />
    </g>;
  };
  const meio = [(topo(c1, R1)[0] + topo(c2, R2)[0]) / 2, (topo(c1, R1)[1] + topo(c2, R2)[1]) / 2] as const;
  const w2txt = String(Math.round(w2 * 100) / 100).replace('.', ',');
  return <g data-physics-system="circular-motion">
    <kit.Defs />
    <Papel kit={kit} />
    <Painel x={6} y={14} w={308} h={222} titulo="CORREIA" tom="laranja" />
    <Sombra cx={(c1.x + c2.x) / 2} cy={c2.y + R2 + 14} rx={116} ry={7} />
    {polia(c1, R1, w1, 'vermelho')}{polia(c2, R2, w2, 'ciano')}
    <g filter={kit.neon}>
      <path d={correia} fill="none" stroke="var(--vs-kit-contorno)" strokeWidth="7" strokeLinejoin="round" />
      <path d={correia} fill="none" stroke="#8a5a2b" strokeWidth="4" strokeLinejoin="round" />
    </g>
    <path d={correia} fill="none" stroke="#f3d7a8" strokeWidth="1.3" strokeDasharray="3 5" />
    {arco(c1, R1, w1)}{arco(c2, R2, w2)}
    <path d={`M${c1.x} ${c1.y}h${R1}`} stroke={cor('sol')} strokeWidth="2.5" />
    <path d={`M${c2.x} ${c2.y}h${R2}`} stroke={cor('sol')} strokeWidth="2.5" />
    <Rotulo x={c1.x} y={224} tam={13}>R₁ = 10 cm</Rotulo>
    <Rotulo x={c2.x} y={224} tam={13}>R₂ = {raio} cm</Rotulo>
    <Brilho x={meio[0]} y={meio[1] - 10} r={5} />
    <Nota de={[meio[0], meio[1] - 4]} em={[158, 36]} ancora="middle" texto="mesma v na correia" curva={-1} tom="roxo" />
    <Pilula x={6} y={256} w={144} tom="vermelho">ω₁ = 30 rad/s</Pilula>
    <Pilula x={158} y={256} w={156} tom="ciano">ω₂ = {w2txt} rad/s</Pilula>
  </g>;
}

function Scene({ id, value }: { id: PhysicsRemainingId; value: number }) {
  if (id === 'echo') {
    const wall = 110 + value * 135;
    return <g data-physics-system="echo">
      <path d="M24 228H294" {...ink}/><path d={`M${wall} 57V229`} stroke="var(--vs-ink)" strokeWidth="8"/><path d={`M${wall+10} 65V221`} stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="4 5"/>
      <circle cx="58" cy="188" r="18" fill="var(--vs-burgundy)"/><path d="M48 180q10-9 20 0M48 191q10 9 20 0" {...ink}/>
      <path d={`M79 175H${wall-10}`} {...wine}/><path d={`M${wall-10} 201H79`} stroke="var(--vs-blue)" strokeWidth="4" fill="none" strokeDasharray="8 5"/>
      {[0,1,2].map(n => <path key={n} d={`M${85+n*9} ${175-n*6}q11 6 0 12`} stroke="var(--vs-burgundy)" strokeWidth="2" fill="none" opacity={.9-n*.22}/>) }
      <text x="58" y="151" textAnchor="middle" style={txt}>emissor</text><text x={wall} y="43" textAnchor="middle" style={txt}>obstáculo</text>
      <text x={(wall+75)/2} y="166" textAnchor="middle" style={{...txt,fontSize:12}}>ida</text><text x={(wall+75)/2} y="218" textAnchor="middle" style={{...txt,fontSize:12}}>volta</text>
      <path d={`M78 253H${wall-12}`} stroke="var(--vs-ink)" strokeWidth="2"/><path d={`M78 247v12M${wall-12} 247v12`} stroke="var(--vs-ink)" strokeWidth="2"/>
      <text x="160" y="283" textAnchor="middle" style={{...txt,fontSize:13}}>d = 340 · Δt / 2</text>
    </g>;
  }
  if (id === 'diffraction') {
    const spread = 18 + 78 / value;
    return <g data-physics-system="diffraction">
      <path d="M21 150H130" stroke="var(--vs-blue)" strokeWidth="12" opacity=".6"/><path d="M21 150H130" {...wine}/>
      <path d="M146 34V126M146 174V266M174 34V126M174 174V266" stroke="var(--vs-ink)" strokeWidth="7"/>
      <path d="M160 44v72M160 184v72" stroke="var(--vs-burgundy)" strokeWidth="3"/><text x="160" y="22" textAnchor="middle" style={txt}>fenda a</text>
      {[1,.65,.35].map((f,n)=><path key={n} d={`M168 150Q230 ${150-spread*f} 298 ${150-spread*f}M168 150Q230 ${150+spread*f} 298 ${150+spread*f}`} stroke={n?'var(--vs-ink-muted)':'var(--vs-burgundy)'} strokeWidth={n?2:4} fill="none" opacity={n?.75:1}/>) }
      <path d="M282 61V239" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="5 5"/><text x="289" y="279" textAnchor="end" style={{...txt,fontSize:12}}>anteparo</text>
      <text x="80" y="133" textAnchor="middle" style={{...txt,fontSize:12}}>frente de onda</text><text x="232" y="150" textAnchor="middle" style={{...txt,fontSize:12}}>θ</text>
      <text x="160" y="294" textAnchor="middle" style={{...txt,fontSize:13}}>sen θ ≈ λ/a</text>
    </g>;
  }
  if (id === 'tube-harmonics') {
    // Cada semiperfil é calculado a partir da mesma função. Não espelhe a
    // string pronta: ela já contém coordenadas numéricas, portanto um
    // replace textual não altera o sinal de y e desenha a mesma curva duas
    // vezes (a falha que escondia o ventre da onda estacionária).
    const profile = (sign: 1 | -1) => Array.from({ length: 81 }, (_, index) => {
      const x = 43 + index * 2.9;
      const y = 150 + sign * 52 * Math.sin((index / 80) * Math.PI * value / 2);
      return `${index ? 'L' : 'M'} ${x} ${y}`;
    }).join(' ');
    const upperProfile = profile(-1);
    const lowerProfile = profile(1);
    const nodeXs = Array.from({length:(value+1)/2},(_,n)=>43+n*(235*2/value));
    return <g data-physics-system="tube-harmonics">
      <path d="M34 78V223H286V78" fill="color-mix(in srgb,var(--vs-blue) 14%,transparent)" stroke="var(--vs-ink)" strokeWidth="4"/><path d="M34 223H286" stroke="var(--vs-ink)" strokeWidth="9"/>
      <path data-harmonic-profile="upper" d={upperProfile} {...wine}/><path data-harmonic-profile="lower" d={lowerProfile} stroke="var(--vs-blue)" strokeWidth="3" fill="none" opacity=".8"/>
      {nodeXs.map((x,n)=><g key={x}><path d={`M${x} 103v94`} stroke="var(--vs-ink-muted)" strokeWidth="1" strokeDasharray="3 4"/><circle cx={x} cy="150" r="5" fill="var(--vs-ink)"/><text x={x} y="245" textAnchor="middle" style={{...txt,fontSize:10}}>nó</text></g>)}
      <path d="M286 98v104" stroke="var(--vs-burgundy)" strokeWidth="4"/><text x="34" y="56" style={txt}>fechado</text><text x="286" y="56" textAnchor="end" style={txt}>aberto</text>
      <text x="160" y="283" textAnchor="middle" style={{...txt,fontSize:13}}>L = {value}λ/4 · apenas n ímpar</text>
    </g>;
  }
  if (id === 'circular-motion') return <PulleysScene raio={value} />;
  if (id === 'electric-field-map') {
    const rings = [34, 62, 92, 122]; const marker = 160 + value * 16;
    return <g data-physics-system="electric-field-map">
      {rings.map((r, index) => <circle key={r} cx="105" cy="150" r={r} fill="none" stroke="var(--vs-blue)" strokeWidth="2" strokeDasharray="5 4" opacity={1-index*.16}/>) }
      {[-62,-31,0,31,62].map(angle => { const radians = angle * Math.PI / 180; const x2=105+136*Math.cos(radians); const y2=150+136*Math.sin(radians); return <g key={angle}><path d={`M105 150L${x2} ${y2}`} {...wine}/><path d={`M${x2} ${y2}l-11 -4 5 11`} fill="var(--vs-burgundy)" transform={`rotate(${angle}, ${x2}, ${y2})`}/></g>; })}
      <circle cx="105" cy="150" r="18" fill="var(--vs-burgundy)"/><text x="105" y="157" textAnchor="middle" fill="white" fontWeight="800">+</text>
      <circle cx={marker} cy="150" r="7" fill="var(--vs-blue)"/><path d={`M${marker} 150v-31`} stroke="var(--vs-ink)" strokeWidth="2"/><text x={marker} y="108" textAnchor="middle" style={{...txt,fontSize:11}}>teste</text>
      <path d={`M${marker} 150h31`} stroke="var(--vs-ink)" strokeWidth="2"/><path d={`M${marker+24} 144l8 6-8 6`} fill="var(--vs-ink)"/>
      <text x="250" y="138" style={{...txt,fontSize:11}}>E</text><text x="160" y="286" textAnchor="middle" style={{...txt,fontSize:13}}>campo radial ⟂ equipotenciais circulares</text>
    </g>;
  }
  if (id === 'electric-meters') {
    const ammeter = value === 0;
    const label = { fill: 'var(--vs-ink)', stroke: 'none', fontFamily: 'system-ui, sans-serif', fontSize: 12 };
    return <g data-physics-system="electric-meters">
      {/* A única interrupção no ramo superior é o resistor (e o amperímetro, quando selecionado). */}
      <path d={ammeter
        ? 'M52 76V130M52 170V224H268V76H236M190 76H152M112 76H52'
        : 'M52 76V130M52 170V224H268V76H236M190 76H52'} {...ink}/>
      <circle cx="52" cy="150" r="20" {...ink} fill="var(--vs-burgundy)"/>
      <path d="M52 139v12M46 145h12M46 160h12" stroke="white" strokeWidth="2"/>
      <rect x="190" y="56" width="46" height="40" rx="5" fill="color-mix(in srgb,var(--vs-burgundy) 16%,transparent)" {...ink}/>
      <path d="M197 64h32M197 76h32M197 88h32" {...wine}/>
      <text x="213" y="115" textAnchor="middle" style={label}>R</text>
      {ammeter ? <g data-meter-connection="series">
        <circle cx="132" cy="76" r="20" {...ink} fill="var(--vs-blue)"/>
        <text x="132" y="82" textAnchor="middle" fill="white" stroke="none" fontSize="17" fontWeight="800">A</text>
        <text x="132" y="156" textAnchor="middle" style={label}>em série</text>
      </g> : <g data-meter-connection="parallel">
        <path d="M174 76V158H193M233 158H252V76" {...ink}/>
        <circle cx="174" cy="76" r="4" fill="var(--vs-ink)"/><circle cx="252" cy="76" r="4" fill="var(--vs-ink)"/>
        <circle cx="213" cy="158" r="20" {...ink} fill="var(--vs-blue)"/>
        <text x="213" y="164" textAnchor="middle" fill="white" stroke="none" fontSize="17" fontWeight="800">V</text>
        <text x="213" y="199" textAnchor="middle" style={label}>em paralelo a R</text>
      </g>}
      <text x="160" y="282" textAnchor="middle" style={label}>{ammeter ? 'Rₐ ≈ 0 Ω: toda a corrente passa por A' : 'Rᵥ muito alta: V não desvia corrente'}</text>
    </g>;
  }
  if (id === 'generator' || id === 'receiver') {
    const generator = id === 'generator'; const voltage = generator ? 24 - 2 * value : 100 + 2 * value;
    const x = 45 + value * (generator ? 20 : 24);
    const y = generator ? 58 + value * 13 : 214 - value * 15.6;
    return <g data-physics-system={id}>
      <path data-current-axis="true" d="M45 214H286" {...ink}/><path d="M45 38V214" {...ink}/><path d={generator ? "M45 58L285 214" : "M45 214L285 58"} {...wine}/>
      <path d={`M45 ${y}H${x}V214`} stroke="var(--vs-blue)" strokeWidth="1.5" strokeDasharray="4 4" fill="none"/>
      <circle data-operating-point="true" cx={x} cy={y} r="6" fill="var(--vs-blue)"/>
      <text x="28" y="55" textAnchor="end" style={txt}>U</text><text x="286" y="237" textAnchor="end" style={txt}>i</text><text x="160" y="252" textAnchor="middle" style={{...txt,fontSize:11}}>{generator ? 'escala U: 0–24 V · i: 0–12 A' : 'escala U: 100–120 V · i: 0–10 A'}</text>
      <text x="65" y="25" style={{...txt,fontSize:12}}>{generator ? 'fonte entrega energia' : 'motor recebe energia'}</text>
      <text x="52" y="277" style={{...txt,fontSize:12}}>i = {value} A · U = {voltage} V</text>
      <text x="164" y="298" textAnchor="middle" style={{...txt,fontSize:12}}>{generator ? 'U = 24 − 2i · curto: i = 12 A' : 'U = 100 + 2i · ε’ = 100 V'}</text>
    </g>;
  }
  if (id === 'magnet-field') {
    const transform = `rotate(${value} 160 158)`;
    return <g data-physics-system="magnet-field" style={{fontSize:11}}>
      <g transform={transform}>
      <rect x="76" y="135" width="168" height="46" rx="7" {...ink} fill="var(--vs-burgundy)"/><path d="M160 135v46" stroke="#111111" strokeWidth="3"/>
      <text x="95" y="164" fill="#111111" fontWeight="800">N</text><text x="222" y="164" fill="#111111" fontWeight="800">S</text>
      <path d="M78 134C80 55 240 55 242 134M78 182C80 236 240 236 242 182" stroke="var(--vs-blue)" strokeWidth="2" fill="none"/>
      <path data-magnet-field="external" d="M144 78H176m-8-6 8 6-8 6M144 222H176m-8-6 8 6-8 6" {...wine}/>
      <path data-magnet-field="internal" d="M204 158H116m8-6-8 6 8 6" stroke="#111111" strokeWidth="2" fill="none"/>
      </g>
      <g data-compass="true" transform={transform}><circle cx="160" cy="78" r="13" fill="var(--vs-surface, white)" {...ink}/><path d="M151 78H170m-6-4 6 4-6 4" {...wine}/></g>
      <text x="219" y="63" style={{...txt,fontSize:9}}>bússola: N segue B</text>
      <text x="160" y="24" textAnchor="middle" style={txt}>Fora: N → S · dentro: S → N</text>
      <text x="160" y="46" textAnchor="middle" style={{...txt,fontSize:11}}>Linhas fechadas · setas indicam B</text>
      <g data-earth-field="true"><circle cx="54" cy="270" r="18" {...ink}/><path d="M54 283V257m-5 7 5-7 5 7" {...wine}/></g>
      <text x="83" y="260" style={{...txt,fontSize:10}}>Terra: N geográfico ≈ S magnético</text>
      <text x="83" y="278" style={{...txt,fontSize:10}}>B entra perto do norte geográfico</text>
      <text x="83" y="294" style={{...txt,fontSize:10}}>B sai perto do sul geográfico</text>
    </g>;
  }
  if (id === 'geometric-optics') {
    const screen = 110 + value * 20; const shadow = 17 + value * 7;
    return <g data-physics-system="geometric-optics">
      <circle cx="39" cy="150" r="14" fill="var(--vs-burgundy)"/><path d={`M53 150L${screen} ${150-shadow}M53 150L${screen} ${150+shadow}`} {...wine}/><path d="M106 105V195" stroke="var(--vs-ink)" strokeWidth="8"/><circle cx="106" cy="150" r="28" fill="var(--vs-ink)"/>
      <path d={`M${screen} 54V246`} stroke="var(--vs-blue)" strokeWidth="7"/><path d={`M${screen} ${150-shadow}V${150+shadow}`} stroke="color-mix(in srgb,var(--vs-burgundy) 38%,transparent)" strokeWidth="7"/><text x="39" y="184" textAnchor="middle" style={{...txt,fontSize:11}}>fonte</text><text x="106" y="229" textAnchor="middle" style={{...txt,fontSize:11}}>objeto</text><text x={screen} y="270" textAnchor="middle" style={{...txt,fontSize:11}}>tela</text>
      <path d={`M120 91H${screen-8}`} stroke="var(--vs-ink-muted)" strokeWidth="2"/><text x="170" y="82" textAnchor="middle" style={{...txt,fontSize:12}}>sombra</text>
      <text x="160" y="292" textAnchor="middle" style={{...txt,fontSize:13}}>raios tangentes delimitam a umbra</text>
    </g>;
  }
  if (id === 'optical-instruments') return <LunetaScene focal={value} />;
  if (id === 'wave-basics') {
    const wavelength = 52 + value * 17;
    const wave = Array.from({ length: 160 }, (_, n) => { const x = 25 + n * 1.7; return `${n ? 'L' : 'M'} ${x} ${150 - 37 * Math.sin((x - 25) * 2 * Math.PI / wavelength)}`; }).join(' ');
    return <g data-physics-system="wave-basics"><path d="M22 150H298" stroke="var(--vs-ink-muted)" strokeWidth="2"/><path d={wave} {...wine}/><path d={`M72 225H${72+wavelength}`} {...ink}/><path d={`M72 219v12M${72+wavelength} 219v12`} {...ink}/><text x={72+wavelength/2} y="246" textAnchor="middle" style={txt}>λ</text><path d="M38 150V113" stroke="var(--vs-blue)" strokeWidth="3"/><text x="49" y="118" style={txt}>A</text><text x="160" y="282" textAnchor="middle" style={{...txt,fontSize:13}}>v = λf • f permanece com a fonte</text></g>;
  }
  if (id === 'rope-boundary') {
    const fixed = value === 0; const reflected = fixed ? 174 : 126;
    return <RopeBoundaryScene fixed={fixed} />;
  }
  if (id === 'string-standing-wave') {
    const profile = (sign: 1 | -1) => Array.from({ length: 121 }, (_, index) => { const x = 35 + index * 2.1; const y = 150 + sign * 48 * Math.sin(Math.PI * value * index / 120); return `${index ? 'L' : 'M'} ${x} ${y}`; }).join(' ');
    const nodes = Array.from({length:value+1},(_,n)=>35+n*(252/value));
    return <g data-physics-system="string-standing-wave"><path d="M26 71V229M294 71V229" stroke="var(--vs-ink)" strokeWidth="8"/><path d={profile(-1)} {...wine}/><path d={profile(1)} stroke="var(--vs-blue)" strokeWidth="3" fill="none"/>{nodes.map(x=><g key={x}><circle cx={x} cy="150" r="4" fill="var(--vs-ink)"/><path d={`M${x} 214v15`} stroke="var(--vs-ink-muted)" strokeWidth="1"/></g>)}<text x="35" y="254" style={txt}>nó</text><text x="160" y="110" textAnchor="middle" style={{...txt,fontSize:12}}>ventre</text><text x="160" y="284" textAnchor="middle" style={{...txt,fontSize:13}}>L = {value}λ/2 • {value} ventres</text></g>;
  }
  const top = 191 - value * 9;
  return <g data-physics-system="quantum-photon">
    <rect x="44" y="38" width="104" height="198" rx="13" fill="color-mix(in srgb,var(--vs-blue) 12%,transparent)" stroke="var(--vs-ink)" strokeWidth="3"/>
    <path d="M60 207H134M60 164H134M60 108H134" {...ink}/><text x="142" y="211" style={txt}>E₀</text><text x="142" y="168" style={txt}>E₁</text><text x="142" y="112" style={txt}>E₂</text>
    <circle cx="97" cy="207" r="10" fill="var(--vs-blue)"/><path d={`M97 193V${top+15}`} {...wine}/><path d={`M88 ${top+28}l9-15 9 15`} fill="var(--vs-burgundy)"/>
    <circle cx="97" cy={top+38} r="10" fill="var(--vs-burgundy)"/><path d="M190 91q30-34 58 0t58 0" stroke="var(--vs-burgundy)" strokeWidth="5" fill="none"/>
    <path d="M190 121q30-34 58 0t58 0" stroke="var(--vs-blue)" strokeWidth="5" fill="none" opacity=".65"/><text x="248" y="63" textAnchor="middle" style={txt}>fótons incidentes</text>
    <path d="M194 195h94" stroke="var(--vs-ink-muted)" strokeWidth="2"/><text x="241" y="215" textAnchor="middle" style={{...txt,fontSize:12}}>E = hf</text><text x="160" y="283" textAnchor="middle" style={{...txt,fontSize:13}}>frequência maior → salto possível maior</text>
  </g>;
}

export function physicsRemainingInstrument(id: PhysicsRemainingId) {
  const config = PHYSICS_REMAINING[id];
  return function PhysicsRemainingBoard(props: BoardProps) {
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find(item => item.pivot) ?? readouts[0];
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de Física" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de física: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><p className="vs-instrument-dica">mexa na grandeza e acompanhe a condição física desenhada</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`physics-remaining-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`physics-remaining-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map(item => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação física', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight}/>;
  };
}
