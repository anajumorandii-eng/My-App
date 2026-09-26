import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './BrasilRepublica.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 14: do Segundo Reinado à redemocratização de 1985. Estes capítulos
// abriam com três caixas num eixo, iguais para todos. Cada cena agora desenha
// a estrutura do próprio capítulo, e só com o que o resumo diz: o Segundo
// Reinado sem as Questões Religiosa e Militar (são do Declínio, que já tem
// cena), e o Regime Militar com política e economia em trilhas paralelas,
// porque o resumo não faz uma causar a outra.

// Mapa do Brasil em coordenadas reais (x = 616,8 + 7,9·lon; y = 76,2 − 7,7·lat),
// reduzido para caber à esquerda do painel.
const S = 0.8, TX = 6, TY = 36;
const geo = (lon: number, lat: number): [number, number] => [TX + S * (616.8 + 7.9 * lon), TY + S * (76.2 - 7.7 * lat)];
const MAP = `translate(${TX} ${TY}) scale(${S})`;

type Paced = ReturnType<typeof usePaced>;

function Panel({ active, p, children }: { active: number; p: Paced; children: React.ReactNode }) {
  return <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.2)}>{children}</motion.g>;
}

function Lines({ x, y, lines, gap = 16, anchor = 'start', cls = 'bi-small' }: { x: number; y: number; lines: string[]; gap?: number; anchor?: 'start' | 'middle' | 'end'; cls?: string }) {
  return <>{lines.map((l, k) => <text key={l} x={x} y={y + k * gap} textAnchor={anchor} className={cls}>{l}</text>)}</>;
}

function CoffeeSprig({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 11V-9" className="br-stem" />
    <path d="M0 -1c-9-1-12-8-11-13 7 0 11 5 11 13Z" className="br-leaf" />
    <path d="M0 3c9-1 12-8 11-13-7 0-11 5-11 13Z" className="br-leaf" />
    <circle cx="-3.4" cy="8" r="3.2" className="br-cherry" /><circle cx="3.4" cy="9" r="3.2" className="br-cherry" /><circle cx="0" cy="2.6" r="2.8" className="br-cherry" />
  </g>;
}

function Cane({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-4 11V-11M4 11V-7M-4 -3h0M-7 -3h6M1 1h6M-7 5h6" className="br-cane" />
    <path d="M-4 -11c-6-2-9 0-10 3M4 -7c6-3 9-1 10 2" className="br-cane-leaf" />
  </g>;
}

function Sack({ x, y, label, s = 1 }: { x: number; y: number; label: string; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 26q-3-26 7-30h30q10 4 7 30Z" className="bi-sack-big" />
    <path d="M-8 -3h16" className="bi-sack-tie" />
    <text x="0" y="16" textAnchor="middle" className="bi-sack-text">{label}</text>
  </g>;
}

function Ship({ x, y, s = 1, flag = false }: { x: number; y: number; s?: number; flag?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 0h32l-6 8h-20Z" className="bi-ship" />
    <path d="M-2 0v-20M-2 -18l12 14h-12M-4 -16l-9 12h9" className="br-sail" />
    {flag && <path d="M-2 -20h9v5h-9" className="bi-flag" />}
  </g>;
}

function Swords({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-11 -11L9 9M11 -11L-9 9" className="br-blade" />
    <path d="M5 11l6-6M-5 11l-6-6" className="br-hilt" />
  </g>;
}

function Timeline({ from, to, x0 = 40, x1 = 580, y, marks, hot, p }: {
  from: number; to: number; x0?: number; x1?: number; y: number; p: Paced;
  marks: { at: number; end?: number; label: string; anchor?: 'start' | 'middle' | 'end'; lx?: number }[]; hot: number[];
}) {
  const at = (v: number) => x0 + (v - from) * ((x1 - x0) / (to - from));
  return <g>
    <path d={`M${x0} ${y}H${x1}`} className="bi-axis" />
    {marks.map((m, k) => {
      const on = hot.includes(k);
      const cx = m.end ? (at(m.at) + at(m.end)) / 2 : at(m.at);
      return <g key={m.label}>
        {m.end
          ? <motion.rect x={at(m.at)} y={y - 4} width={at(m.end) - at(m.at)} height="8" rx="4" className={on ? 'bi-dot bi-dot-warn' : 'bi-dot'} initial={false} animate={{ opacity: on ? 1 : 0.45 }} transition={p(0.4, 0.3)} />
          : <motion.circle cx={at(m.at)} cy={y} r="4" className={on ? 'bi-dot bi-dot-warn' : 'bi-dot'} initial={false} animate={{ scale: on ? 1.5 : 1 }} transition={p(0.4, 0.3)} />}
        <text x={m.lx ?? cx} y={y + 17} textAnchor={m.anchor ?? 'middle'} className={on ? 'bi-tiny bi-strong' : 'bi-tiny'}>{m.label}</text>
      </g>;
    })}
  </g>;
}

// Segundo Reinado: o mapa fica fixo e cada recorte acende o seu pedaço — o
// café descendo para o Sudeste, a corte que alterna os partidos, o tráfico
// cortado no Atlântico que vira comércio interno, e a guerra no Prata.
const VALE = geo(-44.8, -22.6), OESTE = geo(-50.5, -21.5), RIO = geo(-43.2, -22.9), SP = geo(-46.6, -23.5);
const NORDESTE = geo(-37.5, -10.5), PARAGUAI = geo(-58, -23.5);
// Paraguai e o eixo Paraguai–Paraná até o Prata, esquemáticos, nas mesmas coordenadas do contorno.
const PARAGUAY_RAW = 'M122 226L150 222L159 240L161 246L184 261L187 273L178 284L160 289L150 272L128 250Z';
const PRATA_RAW = 'M152 226C156 244 162 258 168 280C170 296 164 318 160 342';
const bezier = (a: number[], b: number[], c: number[], d: number[], t: number) =>
  [0, 1].map(i => (1 - t) ** 3 * a[i] + 3 * (1 - t) ** 2 * t * b[i] + 3 * (1 - t) * t ** 2 * c[i] + t ** 3 * d[i]);
const INTERNAL = [[NORDESTE[0] - 12, NORDESTE[1] + 16], [NORDESTE[0] - 34, NORDESTE[1] + 36], [SP[0] + 4, SP[1] - 40], [SP[0] - 8, SP[1] - 12]];

function Waves({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y}q4-4 8 0t8 0M${x + 6} ${y + 9}q4-4 8 0t8 0`} className="br-wave" />;
}

const TILT = [0, -7, 7, -7, 5];

export function SegundoReinado({ active }: Scene) {
  const p = usePaced();
  const traffic = active === 2;
  const [a, b, c, d] = INTERNAL;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Segundo Reinado: café do Vale do Paraíba ao oeste paulista, alternância de liberais e conservadores, fim do tráfico em 1850 e Guerra do Paraguai; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="br-head-sr" />
    <text x="30" y="40" className="bi-kicker">SEGUNDO REINADO · 1840–1889</text>

    <motion.path d={PARAGUAY_RAW} transform={MAP} className="br-foreign" initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.5)} />
    <path d={BRAZIL} transform={MAP} className="bi-land" />
    <motion.path d={PRATA_RAW} transform={MAP} className="br-river" initial={false} animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} transition={p(0.9, 0.3)} />
    <Waves x={268} y={194} /><Waves x={214} y={296} />
    <motion.text x="298" y="278" textAnchor="end" className="br-sea-label" initial={false} animate={{ opacity: traffic ? 0 : 1 }} transition={p(0.3)}>Atlântico</motion.text>

    {/* Recorte 1: o café nasce no Vale e segue para o oeste paulista; o açúcar do Nordeste perde o primeiro lugar. */}
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0.35 }} transition={p(0.4)}>
      <Cane x={NORDESTE[0]} y={NORDESTE[1]} />
      <text x={NORDESTE[0] - 12} y={NORDESTE[1] + 4} textAnchor="end" className="bi-tiny">açúcar</text>
    </motion.g>
    <motion.g initial={false} animate={{ scale: active === 0 || active === 2 ? 1 : 0.75, opacity: active === 0 || active === 2 ? 1 : 0.4 }} transition={p(0.5, active === 0 ? 0.2 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
      <CoffeeSprig x={VALE[0] - 2} y={VALE[1] - 14} s={0.9} />
    </motion.g>
    <motion.g initial={false} animate={{ scale: active === 0 || active === 2 ? 1 : 0.75, opacity: active === 0 || active === 2 ? 1 : 0.4 }} transition={p(0.5, active === 0 ? 1.2 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
      <CoffeeSprig x={OESTE[0]} y={OESTE[1] - 14} s={1.15} />
    </motion.g>
    <Arrow d={`M${VALE[0] - 8} ${VALE[1] - 34}C${VALE[0] - 14} ${VALE[1] - 48} ${OESTE[0] + 12} ${OESTE[1] - 50} ${OESTE[0] + 4} ${OESTE[1] - 38}`} on={active === 0} p={p} head="br-head-sr" delay={0.6} />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4, 0.3)}>
      <text x={VALE[0] - 2} y={VALE[1] + 24} className="bi-tiny bi-strong">Vale do Paraíba</text>
      <text x={OESTE[0] + 6} y={OESTE[1] + 24} textAnchor="end" className="bi-tiny bi-strong">oeste paulista</text>
      <text x={VALE[0] - 20} y={VALE[1] - 60} textAnchor="middle" className="bi-hand-sm">depois</text>
    </motion.g>

    {/* A corte no Rio: acesa no recorte da alternância, discreta no do tráfico. */}
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <circle cx={RIO[0]} cy={RIO[1]} r="4" className="bi-dot" />
      <path d={`M${RIO[0] + 6} ${RIO[1] - 4}l1-8 3 3 3-5 3 5 3-3 1 8Z`} className="bi-crown" />
      <text x={RIO[0] + 4} y={RIO[1] + 16} className="bi-tiny">Rio · corte</text>
    </motion.g>

    {/* Recorte 3: o navio vindo da África é barrado; o fluxo passa a correr por dentro, do Nordeste para São Paulo. */}
    <motion.path d={`M296 256C280 262 262 262 ${RIO[0] + 8} ${RIO[1] + 6}`} className="br-route" initial={false} animate={{ opacity: traffic ? 1 : 0 }} transition={p(0.4)} />
    <motion.g initial={false} animate={{ opacity: traffic ? 1 : 0, x: traffic ? 0 : 20 }} transition={p(0.6, 0.1)}>
      <Ship x={264} y={270} s={0.8} />
      <motion.path d="M252 254l24 24M276 254l-24 24" className="bi-cross" initial={false} animate={{ pathLength: traffic ? 1 : 0 }} transition={p(0.5, 0.7)} />
      <Ship x={284} y={300} s={0.7} flag />
    </motion.g>
    <Arrow d={`M${a[0]} ${a[1]}C${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`} on={traffic} p={p} head="br-head-sr" delay={1} />
    {[0.3, 0.5, 0.7].map((f, k) => {
      const [x, y] = bezier(a, b, c, d, f);
      return <motion.circle key={f} cx={x} cy={y} r="3.2" className="br-people" initial={false} animate={{ opacity: traffic ? 1 : 0, scale: traffic ? 1 : 0 }} transition={p(0.3, traffic ? 1.5 + k * 0.25 : 0)} />;
    })}
    <motion.text x={b[0] - 6} y={b[1] - 4} textAnchor="end" className="bi-hand-sm" initial={false} animate={{ opacity: traffic ? 1 : 0 }} transition={p(0.4, 1.8)}>interprovincial</motion.text>

    {/* Recorte 4: o Paraguai e o eixo fluvial do Prata. */}
    <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.5, 0.2)}>
      <text x={PARAGUAI[0] - 28} y={PARAGUAI[1] + 2} textAnchor="end" className="bi-small bi-strong">Paraguai</text>
      <text x="126" y="290" textAnchor="end" className="bi-tiny">Bacia do Prata</text>
      <motion.g initial={false} animate={{ rotate: active === 3 ? [0, -12, 8, 0] : 0 }} transition={p(0.9, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <Swords x={PARAGUAI[0] + 6} y={PARAGUAI[1] - 2} />
      </motion.g>
    </motion.g>

    <rect x="304" y="56" width="292" height="238" rx="14" className="bi-panel" />
    <Panel active={active} p={p}>
      {active === 0 && <g>
        <text x="320" y="80" className="bi-panel-title">O CAFÉ SUBSTITUI O AÇÚCAR</text>
        <motion.g initial={false} animate={{ scale: [1, 0.72] }} transition={p(1, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
          <Sack x={382} y={120} label="açúcar" />
        </motion.g>
        <motion.g initial={false} animate={{ scale: [0.72, 1.12] }} transition={p(1, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
          <Sack x={514} y={120} label="café" />
        </motion.g>
        <path d="M416 134h56" className="bi-arrow-static" /><path d="M468 129l7 5-7 5" className="bi-arrow-static" />
        <text x="446" y="126" textAnchor="middle" className="bi-tiny">século XIX</text>
        <Lines x={320} y={186} lines={['aos poucos, não de uma vez: primeiro o', 'Vale do Paraíba, depois o oeste paulista,', 'polo a partir de meados do século']} />
        <text x="320" y="240" className="bi-small">sustenta as finanças do Império</text>
        <text x="320" y="256" className="bi-small bi-strong">fazendeiros de café: influência decisiva</text>
        <text x="450" y="284" textAnchor="middle" className="bi-hand-sm">o eixo econômico muda de lugar</text>
      </g>}
      {active === 1 && <g>
        <text x="320" y="80" className="bi-panel-title">O PODER MODERADOR ALTERNA</text>
        <Person x={346} y={112} s={0.8} coat="bi-coat-royal" hat="crown" />
        <text x="346" y="154" textAnchor="middle" className="bi-tiny">D. Pedro II</text>
        <Arrow d="M366 118C404 108 440 118 470 150" on={active === 1} p={p} head="br-head-sr" delay={0.3} />
        {/* A trave gira no próprio centro; cada figura sobe ou desce o que a ponta dela anda (64·sen θ). */}
        <motion.rect x="392" y="186" width="160" height="7" rx="3" className="bi-beam" initial={false} animate={{ rotate: TILT }} transition={p(2.6, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <motion.g initial={false} animate={{ y: TILT.map(t => -64 * Math.sin(t * Math.PI / 180)) }} transition={p(2.6, 0.6)}>
          <Person x={408} y={158} s={0.8} coat="bi-coat-green" hat="top" />
        </motion.g>
        <motion.g initial={false} animate={{ y: TILT.map(t => 64 * Math.sin(t * Math.PI / 180)) }} transition={p(2.6, 0.6)}>
          <Person x={536} y={158} s={0.8} coat="bi-coat" hat="top" />
        </motion.g>
        <path d="M472 193l-12 20h24Z" className="br-pivot" />
        <text x="408" y="230" textAnchor="middle" className="bi-small bi-strong">Liberal</text>
        <text x="536" y="230" textAnchor="middle" className="bi-small bi-strong">Conservador</text>
        <Lines x={450} y={248} anchor="middle" lines={['mesma elite proprietária rural', 'e urbana; diferenças moderadas']} />
        <text x="450" y="288" textAnchor="middle" className="bi-hand-sm">revezam o governo</text>
      </g>}
      {active === 2 && <g>
        <text x="320" y="80" className="bi-panel-title">LEI EUSÉBIO DE QUEIRÓS · 1850</text>
        <Ship x={338} y={112} s={0.8} flag />
        <Lines x={360} y={104} lines={['pressão britânica: a marinha', 'reprime navios negreiros']} />
        <CoffeeSprig x={338} y={148} s={0.8} />
        <Lines x={360} y={146} lines={['capital da compra de escravizados', 'vai para a lavoura de café']} />
        <path d="M320 178h260" className="bi-tick" />
        <text x="320" y="200" className="bi-small bi-warn">o tráfico acaba; a escravidão, não</text>
        <Lines x={320} y={220} lines={['o comércio interprovincial leva', 'escravizados do Nordeste para São Paulo']} />
        <text x="320" y="258" className="bi-small bi-strong">abolição só em 1888</text>
      </g>}
      {active === 3 && <g>
        <text x="320" y="80" className="bi-panel-title">GUERRA DO PARAGUAI · 1864–1870</text>
        <text x="364" y="106" textAnchor="middle" className="bi-small bi-strong">Paraguai</text>
        <text x="364" y="121" textAnchor="middle" className="bi-tiny">Solano López</text>
        <Swords x={426} y={110} />
        <text x="512" y="106" textAnchor="middle" className="bi-small bi-strong">Tríplice Aliança</text>
        <text x="512" y="121" textAnchor="middle" className="bi-tiny">Brasil, Argentina</text>
        <text x="512" y="133" textAnchor="middle" className="bi-tiny">e Uruguai</text>
        <text x="320" y="150" className="bi-small">causas: fronteiras, navegação no Prata</text>
        <text x="320" y="176" className="bi-small bi-warn">Paraguai: população masculina adulta</text>
        <text x="320" y="192" className="bi-small bi-warn">drasticamente reduzida</text>
        <Person x={340} y={222} s={0.8} coat="bi-coat-army" hat="kepi" />
        <Lines x={362} y={232} lines={['Brasil: Exército mais coeso,', 'consciente do próprio poder']} />
        <text x="450" y="284" textAnchor="middle" className="bi-hand-sm">peso político até 1889</text>
      </g>}
    </Panel>

    <Timeline from={1840} to={1889} y={312} p={p} hot={[[0], [0], [1, 3], [2, 3]][active]} marks={[
      { at: 1840, label: '1840', anchor: 'start', lx: 36 },
      { at: 1850, label: '1850 Lei Eusébio' },
      { at: 1864, end: 1870, label: '1864–70 Paraguai' },
      { at: 1888, end: 1889, label: '1888 abolição · 1889 República', anchor: 'end', lx: 584 },
    ]} />
    <text x="30" y="346" className="bi-foot">Contorno simplificado; posições aproximadas.</text>
  </svg>;
}

function Congress({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 0a30 18 0 0 1 60 0Z" className="br-dome" />
    <path d="M-38 0h76v5h-76Z" className="bi-capital" />
    <path d="M-32 5v30M-16 5v30M0 5v30M16 5v30M32 5v30" className="br-colonnade" />
    <path d="M-40 35h80v6h-80Z" className="bi-capital" />
  </g>;
}

function Sash({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 9} ${y + 14}L${x + 8} ${y + 33}`} className="br-sash" />;
}

// República da Espada: a faixa passa de um marechal a outro e, em 1894, a um
// civil; embaixo, o mapa põe a Armada no Rio e a Federalista no Rio Grande do
// Sul. As duas revoltas correm em paralelo — o resumo frisa que tiveram atores
// distintos —, e a eleição de Prudente não aparece como efeito delas.
const PRESIDENTS = [
  { x: 110, name: 'Deodoro da Fonseca', years: '1889–1891', hat: 'kepi' as const, coat: 'bi-coat-army', role: 'marechal' },
  { x: 310, name: 'Floriano Peixoto', years: '1891–1894', hat: 'kepi' as const, coat: 'bi-coat-army', role: 'marechal' },
  { x: 510, name: 'Prudente de Morais', years: 'eleito em 1894', hat: 'top' as const, coat: 'bi-coat-dark', role: 'civil' },
];
const ZS = 1.1, ZX = -108, ZY = -47.6;
const zoom = (lon: number, lat: number): [number, number] => [ZX + ZS * (616.8 + 7.9 * lon), ZY + ZS * (76.2 - 7.7 * lat)];
const ZRIO = zoom(-43.2, -22.9), ZRS = zoom(-53, -29.8);

export function RepublicaEspada({ active }: Scene) {
  const p = usePaced();
  const holder = [1, 1, 1, 2][active];
  const sashX = PRESIDENTS[holder].x;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`República da Espada: Deodoro e Floriano no poder, Revolta da Armada no Rio e Revolução Federalista no Rio Grande do Sul, e Prudente de Morais eleito em 1894; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="br-head-esp" />
    <defs><clipPath id="br-clip-esp"><rect x="24" y="170" width="276" height="152" rx="12" /></clipPath></defs>
    <text x="30" y="40" className="bi-kicker">REPÚBLICA DA ESPADA · 1889–1894</text>

    {PRESIDENTS.map((pr, k) => {
      const on = holder === k || (active === 0 && k === 0);
      return <motion.g key={pr.name} initial={false} animate={{ opacity: on ? 1 : 0.5 }} transition={p(0.4)}>
        <Person x={pr.x} y={76} coat={pr.coat} hat={pr.hat} />
        {pr.role === 'marechal' && <g><path d={`M${pr.x + 20} 108c3-12 8-22 15-30`} className="br-sword" /><path d={`M${pr.x + 15} 104l10 5M${pr.x + 19} 108l-2 5`} className="br-hilt" /></g>}
        <text x={pr.x} y="128" textAnchor="middle" className={on ? 'bi-small bi-strong' : 'bi-small'}>{pr.name}</text>
        <text x={pr.x} y="143" textAnchor="middle" className="bi-tiny">{pr.role} · {pr.years}</text>
      </motion.g>;
    })}
    {/* A faixa: no recorte 1 começa em Deodoro e passa a Floriano (renúncia). */}
    <motion.g initial={false} animate={active === 0 && p(1).duration !== 0 ? { x: [PRESIDENTS[0].x, PRESIDENTS[0].x, PRESIDENTS[1].x] } : { x: sashX }} transition={p(active === 0 ? 2.4 : 0.9, 0.3)}>
      <Sash x={0} y={76} />
    </motion.g>
    <path d="M150 92H262" className="bi-arrow-static" markerEnd="url(#br-head-esp)" />
    <text x="206" y="84" textAnchor="middle" className={active === 0 ? 'bi-tiny bi-strong' : 'bi-tiny'}>renúncia · 1891</text>
    <path d="M350 92H462" className="bi-arrow-static" markerEnd="url(#br-head-esp)" />
    <text x="406" y="84" textAnchor="middle" className={active === 3 ? 'bi-tiny bi-strong' : 'bi-tiny'}>eleição · 1894</text>

    <rect x="24" y="170" width="276" height="152" rx="12" className="bi-panel" />
    <g clipPath="url(#br-clip-esp)">
      <path d={BRAZIL} transform={`translate(${ZX} ${ZY}) scale(${ZS})`} className="bi-land" />
    </g>
    <Waves x={264} y={206} /><Waves x={210} y={292} /><Waves x={262} y={286} />
    <text x="292" y="314" textAnchor="end" className="br-sea-label">Atlântico</text>
    <rect x="24" y="170" width="276" height="152" rx="12" className="br-frame" />
    <g transform={`translate(${ZRIO[0]} ${ZRIO[1]})`}><circle r="4.5" className="bi-dot" /></g>
    <text x={ZRIO[0] - 8} y={ZRIO[1] - 10} textAnchor="end" className={active === 1 || active === 0 ? 'bi-small bi-strong' : 'bi-tiny'}>Rio · capital</text>
    <text x={ZRS[0]} y={ZRS[1] - 30} textAnchor="middle" className={active === 2 ? 'bi-small bi-strong' : 'bi-tiny'}>Rio Grande do Sul</text>

    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0, scale: active === 0 ? 1 : 0.6 }} transition={p(0.5, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <Congress x={ZRIO[0] + 52} y={ZRIO[1] + 12} s={0.55} />
      <motion.path d={`M${ZRIO[0] + 32} ${ZRIO[1] + 6}l40 30M${ZRIO[0] + 72} ${ZRIO[1] + 6}l-40 30`} className="bi-cross" initial={false} animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(0.5, 0.8)} />
    </motion.g>

    {/* Armada: navios na baía apontam para a capital. */}
    {[[34, 18], [52, 4], [60, 28]].map(([dx, dy], k) => <motion.g key={dx} initial={false}
      animate={{ opacity: active === 1 ? 1 : active === 3 ? 0.35 : 0, x: active === 1 || active === 3 ? 0 : 24 }} transition={p(0.6, active === 1 ? 0.2 + k * 0.15 : 0)}>
      <Ship x={ZRIO[0] + dx} y={ZRIO[1] + dy} s={0.7} />
    </motion.g>)}
    <Arrow d={`M${ZRIO[0] + 36} ${ZRIO[1] + 8}C${ZRIO[0] + 26} ${ZRIO[1] - 2} ${ZRIO[0] + 18} ${ZRIO[1] - 4} ${ZRIO[0] + 9} ${ZRIO[1] - 2}`} on={active === 1} p={p} head="br-head-esp" delay={0.9} />

    {/* Federalista: duas bandeiras frente a frente no Rio Grande do Sul. No recorte 4 as duas revoltas
        ficam esmaecidas no mapa: seguiam em curso quando Prudente foi eleito. */}
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : active === 3 ? 0.35 : 0 }} transition={p(0.5, 0.2)}>
      <g transform={`translate(${ZRS[0] - 22} ${ZRS[1] - 8})`}>
        <path d="M0 22V-12" className="bi-pole" />
        <motion.path d="M0 -12h20l-5 6 5 6H0Z" className="br-flag-a" initial={false} animate={{ skewY: active === 2 ? [0, -8, 4, 0] : 0 }} transition={p(1.2, 0.4)} />
      </g>
      <g transform={`translate(${ZRS[0] + 22} ${ZRS[1] - 8})`}>
        <path d="M0 22V-12" className="bi-pole" />
        <motion.path d="M0 -12h-20l5 6-5 6H0Z" className="br-flag-b" initial={false} animate={{ skewY: active === 2 ? [0, 8, -4, 0] : 0 }} transition={p(1.2, 0.6)} />
      </g>
      <Swords x={ZRS[0]} y={ZRS[1]} />
    </motion.g>

    <rect x="318" y="170" width="278" height="152" rx="12" className="bi-panel" />
    <Panel active={active} p={p}>
      {active === 0 && <g>
        <text x="334" y="192" className="bi-panel-title">1891 · CONGRESSO DISSOLVIDO</text>
        <Lines x={334} y={214} lines={['Deodoro governa de forma autoritária', 'e centralizadora; em conflito com o', 'Legislativo, dissolve o Congresso']} />
        <text x="334" y="270" className="bi-small bi-warn">crise institucional</text>
        <text x="334" y="286" className="bi-small">contribui para a renúncia, meses depois</text>
        <text x="334" y="308" className="bi-small bi-strong">o vice Floriano assume</text>
      </g>}
      {active === 1 && <g>
        <text x="334" y="192" className="bi-panel-title">REVOLTA DA ARMADA · 1893–1894</text>
        <Lines x={334} y={214} lines={['oficiais da Marinha contra a', 'centralização de Floriano; resquícios', 'monarquistas em parte da oficialidade']} />
        <text x="334" y="270" className="bi-small bi-warn">ameaça bombardear o Rio, a capital</text>
        <Lines x={334} y={290} lines={['contida pelo governo, com apoio', 'popular e de setores do Exército']} gap={15} />
      </g>}
      {active === 2 && <g>
        <text x="334" y="192" className="bi-panel-title">FEDERALISTA · RS, 1893–1895</text>
        <rect x="334" y="203" width="10" height="10" rx="2" className="br-flag-a" />
        <Lines x={350} y={212} lines={['federalistas: maior autonomia', 'estadual; simpatias monarquistas', 'em alguns setores']} gap={14} />
        <rect x="334" y="250" width="10" height="10" rx="2" className="br-flag-b" />
        <Lines x={350} y={259} lines={['republicanos históricos locais,', 'aliados de Floriano']} gap={14} />
        <text x="334" y="298" className="bi-small bi-warn">um dos conflitos mais sangrentos;</text>
        <text x="334" y="312" className="bi-small bi-warn">execuções sumárias pelos dois lados</text>
      </g>}
      {active === 3 && <g>
        <text x="334" y="192" className="bi-panel-title">1894 · PRESIDENTE CIVIL</text>
        {[['Armada', 1893, 1894], ['Federalista', 1893, 1895]].map(([name, a, b], k) => {
          const ano = (v: number) => 410 + (v - 1893) * 80;
          return <g key={name as string}>
            <text x="402" y={216 + k * 20} textAnchor="end" className="bi-tiny">{name as string}</text>
            <rect x={ano(a as number)} y={206 + k * 20} width={ano(b as number) - ano(a as number)} height="11" rx="4" className="bi-bar-on" />
          </g>;
        })}
        <path d="M490 200v46" className="bi-marker" />
        <text x="410" y="258" textAnchor="middle" className="bi-tiny">1893</text>
        <text x="490" y="258" textAnchor="middle" className="bi-tiny bi-strong">1894: Prudente</text>
        <text x="570" y="258" textAnchor="middle" className="bi-tiny">1895</text>
        <text x="334" y="280" className="bi-small">fim do governo militar direto; começa o</text>
        <text x="334" y="295" className="bi-small">café com leite (SP e MG). Militares: de</text>
        <text x="334" y="310" className="bi-small">ocupantes a sustentação e contestação</text>
      </g>}
    </Panel>
    <text x="30" y="344" className="bi-foot">Mapa recortado e simplificado; posições aproximadas.</text>
  </svg>;
}

function BallotBox({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-14 -6h28v22h-28Z" className="bi-block" />
    <path d="M-6 -6h12" className="br-slot" />
    <rect x="-5" y="-16" width="10" height="13" rx="1" className="bi-ballot" />
  </g>;
}

function Newspaper({ x, y, censored = false }: { x: number; y: number; censored?: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-14 -14h28v28h-28Z" className="bi-scroll" />
    <path d="M-10 -8h20M-10 -2h20M-10 4h14M-10 10h18" className={censored ? 'br-censor' : 'bi-scroll-line'} />
  </g>;
}

// República Liberal (democracia): a casa de 1946 abriga vários partidos, mas
// fica dentro do anel da Guerra Fria. Em 1947 uma das flâmulas — o PCB — é
// posta para fora; em 1954 e 1955 a casa racha. Só o PCB tem nome porque só
// ele é nomeado no resumo; as outras flâmulas marcam o pluralismo, não siglas.
const PENNANTS = [58, 96, 134, 172, 210];

export function DemocraciaGuerraFria({ active }: Scene) {
  const p = usePaced();
  const out = active >= 1;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Democracia de 1946 sob a Guerra Fria: Constituição com eleições diretas e pluralismo, PCB cassado em 1947, crise de 1954 e posse de JK garantida em 1955; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="br-head-dem" />
    <text x="30" y="40" className="bi-kicker">REPÚBLICA LIBERAL · 1945–1964</text>

    <motion.ellipse cx="140" cy="178" rx="124" ry="112" className="br-ring" initial={false}
      animate={{ scale: active === 1 ? 0.95 : 1 }} transition={p(0.8, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    <text x="140" y="60" textAnchor="middle" className="bi-hand-sm">Guerra Fria · anticomunismo</text>

    <path d="M38 112L140 76L242 112Z" className="br-pediment" />
    <circle cx="140" cy="98" r="7" className="br-emblem" />
    <path d="M32 112h216v20H32Z" className="bi-capital" />
    <text x="140" y="126" textAnchor="middle" className="br-frieze">CONSTITUIÇÃO DE 1946</text>
    {[46, 234].map(x => <rect key={x} x={x - 6} y="132" width="12" height="104" className="bi-column" />)}
    <path d="M30 236h220v10H30Z" className="bi-capital" />
    <text x="140" y="264" textAnchor="middle" className="bi-small">eleições diretas · imprensa livre</text>

    {PENNANTS.map((x, k) => {
      const pcb = k === 4;
      return <motion.g key={x} initial={false}
        animate={pcb ? { x: out ? 76 : 0, y: out ? 24 : 0, rotate: out ? 16 : 0, opacity: out ? 0.75 : 1 } : { y: [0, -3, 0][k % 3] }}
        transition={p(pcb ? 1 : 0.4, pcb && active === 1 ? 0.5 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path d={`M${x} 232V150`} className="bi-pole" />
        <motion.path d={`M${x} 152h30l-8 10 8 10h-30Z`} className={`br-pennant br-pennant-${k}`} initial={false}
          animate={{ skewY: active === 0 ? [0, -6, 3, 0] : 0 }} transition={p(1.2, 0.2 + k * 0.1)} />
        {pcb && <text x={x + 14} y="192" textAnchor="middle" className="bi-tiny bi-strong">PCB</text>}
      </motion.g>;
    })}
    <motion.g initial={false} animate={{ opacity: out ? 1 : 0 }} transition={p(0.4, active === 1 ? 1.3 : 0)}>
      <g transform="translate(290 280) rotate(-8)">
        <rect x="-38" y="-12" width="76" height="22" rx="4" className="bi-stamp" />
        <text x="0" y="4" textAnchor="middle" className="bi-stamp-text">CASSADO</text>
      </g>
    </motion.g>
    <motion.path d="M118 134l-6 20 10 16-8 22 6 18" className="bi-crack" initial={false} animate={{ pathLength: active >= 2 ? 1 : 0, opacity: active >= 2 ? 1 : 0 }} transition={p(0.7, 0.4)} />
    <motion.path d="M158 134l8 16-10 14 6 20" className="bi-crack" initial={false} animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} transition={p(0.7, 0.6)} />

    <rect x="332" y="56" width="264" height="236" rx="14" className="bi-panel" />
    <Panel active={active} p={p}>
      {active === 0 && <g>
        <text x="348" y="80" className="bi-panel-title">REDEMOCRATIZAÇÃO</text>
        <BallotBox x={386} y={116} />
        <Newspaper x={470} y={112} />
        <g transform="translate(548 112)">
          {[-10, 0, 10].map((dx, k) => <g key={dx}><path d={`M${dx} 14V-12`} className="bi-pole" /><path d={`M${dx} -12h9l-3 4 3 4h-9Z`} className={`br-pennant br-pennant-${k}`} /></g>)}
        </g>
        <text x="386" y="146" textAnchor="middle" className="bi-tiny">voto direto</text>
        <text x="470" y="146" textAnchor="middle" className="bi-tiny">imprensa</text>
        <text x="548" y="146" textAnchor="middle" className="bi-tiny">partidos</text>
        <Lines x={348} y={176} lines={['Vargas cai em outubro de 1945,', 'após quinze anos no poder', '(Estado Novo de 1937 a 1945)']} />
        <text x="348" y="238" className="bi-small bi-strong">1950: Vargas volta, agora eleito</text>
        <text x="470" y="276" textAnchor="middle" className="bi-hand-sm">o voto decide quem governa</text>
      </g>}
      {active === 1 && <g>
        <text x="348" y="80" className="bi-panel-title">1947 · LIMITE DO PLURALISMO</text>
        <Lines x={348} y={104} lines={['PCB: votação expressiva em 1945', 'registro cassado já em 1947']} />
        <text x="348" y="146" className="bi-tiny bi-strong">justificativa oficial:</text>
        <Lines x={348} y={162} lines={['subordinação a diretrizes da política', 'internacional soviética']} />
        <text x="348" y="204" className="bi-small bi-warn">de volta à clandestinidade</text>
        <text x="348" y="220" className="bi-small">por décadas</text>
        <text x="470" y="262" textAnchor="middle" className="bi-hand-sm">plural na lei,</text>
        <text x="470" y="280" textAnchor="middle" className="bi-hand-sm">com exclusão na prática</text>
      </g>}
      {active === 2 && <g>
        <text x="348" y="80" className="bi-panel-title">AGOSTO DE 1954</text>
        {['militares', 'civis conservadores', 'imprensa oposicionista'].map((who, k) => <g key={who}>
          <text x="348" y={104 + k * 18} className="bi-tiny bi-strong">{who}</text>
          <Arrow d={`M${[400, 452, 470][k]} ${100 + k * 18}C${[460, 490, 500][k]} ${100 + k * 18} 510 ${112 + k * 4} 524 ${116 + k * 3}`} on={active === 2} p={p} head="br-head-dem" delay={0.3 + k * 0.2} />
        </g>)}
        <path d="M530 138v-16l24-10 24 10v16ZM536 138v-14M546 138v-14M562 138v-14M572 138v-14" className="bi-icon" />
        <text x="554" y="154" textAnchor="middle" className="bi-tiny">governo</text>
        <Lines x={348} y={184} lines={['atentado contra Carlos Lacerda', 'envolve a guarda do presidente']} />
        <g transform="translate(362 244)">
          <path d="M-14 -16h24a4 4 0 0 1 4 4v28h-24a4 4 0 0 1-4-4Z" className="bi-scroll" />
          <path d="M-9 -9h18M-9 -3h18M-9 3h12M-9 9h16" className="bi-scroll-line" />
        </g>
        <Lines x={386} y={236} lines={['Vargas morre e deixa a', 'carta-testamento, que reforça', 'sua imagem entre os populares']} gap={15} />
      </g>}
      {active === 3 && <g>
        <text x="348" y="80" className="bi-panel-title">1955 · A POSSE DE JK</text>
        <BallotBox x={384} y={116} />
        <text x="410" y="118" className="bi-small bi-strong">JK eleito</text>
        <Person x={400} y={170} s={0.85} coat="bi-coat-army" hat="kepi" />
        <Person x={540} y={170} s={0.85} coat="bi-coat-army" hat="kepi" />
        <Arrow d="M418 186H452" on={active === 3} p={p} head="br-head-dem" delay={0.4} />
        <Arrow d="M522 186H478" on={active === 3} p={p} head="br-head-dem" delay={0.9} />
        <motion.path d="M456 176l14 20M470 176l-14 20" className="bi-cross" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.4, 1.4)} />
        <text x="400" y="222" textAnchor="middle" className="bi-tiny">golpe: barrar a posse</text>
        <text x="540" y="222" textAnchor="middle" className="bi-tiny">Lott: contragolpe</text>
        <text x="348" y="248" className="bi-small">Forças Armadas divididas</text>
        <text x="470" y="280" textAnchor="middle" className="bi-hand-sm">o eleito toma posse</text>
      </g>}
    </Panel>

    <Timeline from={1945} to={1956} x0={40} x1={560} y={312} p={p} hot={[[0, 1, 3], [2], [4], [5]][active]} marks={[
      { at: 1945, label: '1945' }, { at: 1946, label: '1946' }, { at: 1947, label: '1947' },
      { at: 1950, label: '1950' }, { at: 1954, label: '1954' }, { at: 1955, label: '1955' },
    ]} />
    <text x="592" y="316" textAnchor="end" className="bi-tiny">→ 1964</text>
    <text x="30" y="344" className="bi-foot">Flâmulas ilustrativas: marcam o pluralismo, não bancadas reais.</text>
  </svg>;
}

// Ícones das cinco áreas do Plano de Metas, desenhados no mesmo traço.
const AREAS = [
  { label: 'energia', d: 'M2 -12l-8 13h6l-2 11 9-15h-6Z' },
  { label: 'transporte', d: 'M-10 12L-3 -12M10 12L3 -12M0 8v-4M0 -2v-4M0 -9v-2' },
  { label: 'alimentação', d: 'M0 12V-12M0 -6c-6-2-7-7-6-9 4 1 6 4 6 9M0 0c6-2 7-7 6-9-4 1-6 4-6 9M0 6c-6-2-7-7-6-9 4 1 6 4 6 9' },
  { label: 'indústria de base', d: 'M-12 12V-2l8-5v5l8-5v5l8-5v19ZM6 -4v-9h5v8' },
  { label: 'educação', d: 'M0 -8c-5-4-10-4-13-3v19c3-1 8-1 13 3 5-4 10-4 13-3v-19c-3-1-8-1-13 3ZM0 -8v19' },
];
// Trecho atlântico do próprio contorno, do Nordeste ao Sul.
const COAST_RAW = 'M346.4 120.9L348.8 138.6L319.3 176.3L313.6 213.3L304.5 232.5L290.6 253.3L280.8 252.5L255.3 261L237.3 288.7L224.2 306.4L197.1 335.7';
const BSB = geo(-47.9, -15.8), BELEM = geo(-48.5, -1.4), CUIABA = geo(-56, -15.6), SALVADOR = geo(-38.5, -13);

// República Liberal (desenvolvimentismo): o mapa guarda a ideia que o resumo
// põe no centro — tirar o desenvolvimento do litoral. O painel mostra, por
// recorte, as metas, a capital, o cabo de guerra entre estatal e estrangeiro e
// a sequência 1961–1964.
export function Desenvolvimentismo({ active }: Scene) {
  const p = usePaced();
  const moved = active >= 1;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Desenvolvimentismo: Plano de Metas com 31 metas, Brasília inaugurada em 1960 no interior, Petrobras e montadoras estrangeiras, e a crise de 1961 a 1964; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="br-head-dev" />
    <text x="30" y="40" className="bi-kicker">DESENVOLVIMENTISMO · 1956–1964</text>
    <path d={BRAZIL} transform={MAP} className="bi-land" />
    {/* Recorte 1: Brasília ainda como meta — o símbolo mais visível do plano, não o plano inteiro. */}
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4, active === 0 ? 0.8 : 0)}>
      <circle cx={BSB[0]} cy={BSB[1]} r="11" className="br-goal-ring" />
      <text x={BSB[0]} y={BSB[1] + 30} textAnchor="middle" className="bi-hand-sm">o símbolo do plano</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0.35 }} transition={p(0.4)}>
      <path d={COAST_RAW} transform={MAP} className="br-coast" />
      <text x="262" y="284" textAnchor="middle" className="bi-tiny bi-strong">litoral</text>
      <text x="118" y="132" textAnchor="middle" className="bi-tiny bi-strong">interior</text>
    </motion.g>
    {[BELEM, CUIABA, SALVADOR, RIO].map(([x, y], k) => <motion.path key={x} d={`M${BSB[0]} ${BSB[1]}L${x} ${y}`} className="br-road" initial={false}
      animate={{ pathLength: active === 1 ? 1 : 0, opacity: active === 1 ? 1 : 0 }} transition={p(0.7, active === 1 ? 1.4 + k * 0.15 : 0)} />)}
    <g transform={`translate(${RIO[0]} ${RIO[1]})`}><circle r="3.5" className="bi-dot" /></g>
    <text x={RIO[0] + 8} y={RIO[1] + 14} className="bi-tiny">Rio</text>
    {/* A capital viaja do litoral para o planalto: a estrela sai do Rio e pousa em Brasília. */}
    <motion.path d="M0 -9l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7Z" className="br-capital-star" initial={false}
      animate={active === 1 && p(1).duration !== 0
        ? { x: [RIO[0], RIO[0] - 30, BSB[0]], y: [RIO[1], RIO[1] - 60, BSB[1]], scale: [1, 1.3, 1.2] }
        : { x: moved ? BSB[0] : RIO[0], y: moved ? BSB[1] : RIO[1], scale: moved ? 1.2 : 1 }}
      transition={p(1.4, 0.3)} />
    <motion.text x={BSB[0] - 12} y={BSB[1] + 4} textAnchor="end" className={active === 1 ? 'bi-small bi-strong' : 'bi-tiny'} initial={false}
      animate={{ opacity: moved ? 1 : 0 }} transition={p(0.4, active === 1 ? 1.4 : 0)}>Brasília</motion.text>

    <rect x="300" y="56" width="296" height="236" rx="14" className="bi-panel" />
    <Panel active={active} p={p}>
      {active === 0 && <g>
        <text x="316" y="80" className="bi-panel-title">PLANO DE METAS · JK, 1956–1961</text>
        {AREAS.map((a, k) => <g key={a.label}>
          <g transform={`translate(${334 + k * 57} 110)`}><path d={a.d} className="bi-icon" /></g>
          <text x={334 + k * 57} y={k % 2 ? 148 : 136} textAnchor="middle" className="bi-tiny">{a.label}</text>
        </g>)}
        {Array.from({ length: 31 }, (_, k) => <motion.circle key={k} cx={328 + (k % 16) * 16} cy={174 + Math.floor(k / 16) * 16} r="5" className="br-goal"
          initial={false} animate={{ scale: [0, 1] }} transition={p(0.25, 0.3 + k * 0.04)} />)}
        <text x="316" y="222" className="bi-small bi-strong">31 metas em cinco áreas</text>
        <text x="316" y="238" className="bi-small">planejamento estatal + capital estrangeiro</text>
        <text x="448" y="276" textAnchor="middle" className="bi-hand">“cinquenta anos em cinco”</text>
      </g>}
      {active === 1 && <g>
        <text x="316" y="80" className="bi-panel-title">BRASÍLIA · 1960</text>
        <path d="M356 150h184M372 150v-26h8v26M380 124h8M388 124v26M506 150a22 10 0 0 1 22 -10 22 10 0 0 1-22 10ZM466 150a20 12 0 0 0 40 0" className="bi-icon" />
        <path d="M428 150v-40h6v40M438 150v-40h6v40" className="bi-icon" />
        <Lines x={316} y={180} lines={['capital federal no interior do território,', 'então praticamente desabitado', 'símbolo do otimismo desenvolvimentista']} />
        <text x="316" y="236" className="bi-small bi-strong">interiorizar um desenvolvimento</text>
        <text x="316" y="252" className="bi-small bi-strong">concentrado no litoral desde a Colônia</text>
        <text x="448" y="280" textAnchor="middle" className="bi-hand-sm">do litoral para o planalto</text>
      </g>}
      {active === 2 && <g>
        <text x="316" y="80" className="bi-panel-title">PETROBRAS × MONTADORAS</text>
        <path d="M346 150l10-44 10 44M350 132h12M352 118h8M356 106v-6" className="bi-icon" />
        <text x="356" y="168" textAnchor="middle" className="bi-small bi-strong">Petrobras</text>
        <text x="356" y="182" textAnchor="middle" className="bi-tiny">estatal, 1953</text>
        <text x="356" y="194" textAnchor="middle" className="bi-tiny">governo Vargas</text>
        <path d="M498 146h52v-10l-8-10h-26l-10 10h-8ZM512 150a5 5 0 1 0 0.1 0M538 150a5 5 0 1 0 0.1 0" className="bi-icon" />
        <text x="526" y="168" textAnchor="middle" className="bi-small bi-strong">montadoras</text>
        <text x="526" y="182" textAnchor="middle" className="bi-tiny">estrangeiras, a partir</text>
        <text x="526" y="194" textAnchor="middle" className="bi-tiny">do fim dos anos 1950</text>
        <path d="M378 132H490" className="bi-rope" />
        <motion.path d="M440 124v16" className="br-knot" initial={false} animate={{ x: [0, 18, 10, 26] }} transition={p(1.8, 0.4)} />
        <Lines x={316} y={218} lines={['nacionalistas (parte das Forças Armadas', 'e da esquerda): controle estatal. JK:', 'prioriza, na prática, o capital externo']} gap={15} />
        <text x="448" y="282" textAnchor="middle" className="bi-hand-sm">tensão que dura décadas</text>
      </g>}
      {active === 3 && <g>
        <text x="316" y="80" className="bi-panel-title">A CRISE DE 1961–1964</text>
        {[
          { when: '1961', what: 'Jânio renuncia após sete meses' },
          { when: '1961', what: 'parlamentarismo: Goulart toma posse' },
          { when: '1963', what: 'plebiscito: volta o presidencialismo' },
          { when: 'abril de 1964', what: 'golpe militar' },
        ].map((st, k) => <motion.g key={st.what} initial={false} animate={{ opacity: [0, 1], x: [-8, 0] }} transition={p(0.4, 0.3 + k * 0.3)}>
          <circle cx="322" cy={100 + k * 34} r="4" className={k === 3 ? 'bi-dot bi-dot-warn' : 'bi-dot'} />
          {k < 3 && <path d={`M322 ${106 + k * 34}v22`} className="bi-tick" />}
          <text x="334" y={104 + k * 34} className="bi-small bi-strong">{st.when}</text>
          <text x="334" y={118 + k * 34} className="bi-small">{st.what}</text>
        </motion.g>)}
        <Lines x={316} y={240} lines={['polarização: Guerra Fria e Revolução', 'Cubana (1959) intensificam temores', 'anticomunistas']} gap={14} />
        <text x="448" y="286" textAnchor="middle" className="bi-hand-sm">compromissos cada vez mais frágeis</text>
      </g>}
    </Panel>

    <Timeline from={1952} to={1965} y={312} p={p} hot={[[1], [2], [0, 1], [3, 4, 5]][active]} marks={[
      { at: 1953, label: '1953' }, { at: 1956, label: '1956' }, { at: 1960, label: '1960' },
      { at: 1961, label: '1961' }, { at: 1963, label: '1963' }, { at: 1964, label: '1964' },
    ]} />
    <text x="30" y="344" className="bi-foot">Contorno simplificado; rodovias esquemáticas.</text>
  </svg>;
}

// Regime Militar I: duas trilhas no mesmo eixo de anos, política em cima e
// economia embaixo. Nenhuma seta cruza de uma para a outra — o resumo trata o
// AI-5 e o milagre como fases paralelas. O único fio que sai do capítulo é a
// dívida, e ele sai pela direita, rumo ao capítulo II.
const yr = (y: number) => 70 + (y - 1964) * (320 / 12);

function Infra({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-50 12L-40 -10M-24 12L-32 -10M-37 10v-4M-36 1v-3M-35 -6v-2" className="bi-icon" />
    <path d="M-12 12l5-22h12l5 22ZM-22 -4q3-3 6 0M-24 4q3-3 6 0M-7 -2h12" className="bi-icon" />
    <path d="M32 10L28 -10h8l-4 20M26 -2h12M24 -14q8-6 16 0M20 -18q12-9 24 0" className="bi-icon" />
  </g>;
}

export function RegimeMilitarI({ active }: Scene) {
  const p = usePaced();
  const pol = active <= 1, eco = active >= 2;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Regime Militar I: na política, golpe de 1964, Atos Institucionais e AI-5 em 1968; na economia, milagre de 1968 a 1973 financiado por dívida externa; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="br-head-rm1" />
    <text x="30" y="40" className="bi-kicker">REGIME MILITAR · 1964–1985 · I</text>

    <motion.g initial={false} animate={{ opacity: pol ? 1 : 0.4 }} transition={p(0.4)}>
      <text x="30" y="68" className="bi-panel-title">POLÍTICA</text>
      <motion.rect x={yr(1968)} y="80" height="84" rx="8" className="br-lead" initial={false}
        animate={{ width: active === 1 ? yr(1975) - yr(1968) : 0 }} transition={p(1, 0.6)} />
      <motion.text x={yr(1968) + 26} y="158" className="bi-tiny bi-strong" initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4, 1.2)}>anos de chumbo → meados dos 1970</motion.text>
      <motion.g initial={false} animate={{ opacity: active === 0 ? [1, 1, 0.35] : 0.35, x: active === 0 ? [0, 0, -6] : -6 }} transition={p(1.4, 0.3)}>
        <Person x={46} y={96} s={0.75} coat="bi-coat" />
        <path d="M40 106L52 121" className="br-sash-sm" />
      </motion.g>
      <text x="46" y="140" textAnchor="middle" className="bi-tiny">Goulart</text>
      {/* Os atos caem um a um quando o recorte 1 abre: a chave muda e a entrada se repete. */}
      {[0, 1, 2, 3].map(k => <motion.g key={active === 0 ? `ai-${k}-on` : `ai-${k}`} initial={active === 0 ? { opacity: 0, y: -10 } : false} animate={{ opacity: 1, y: 0 }} transition={p(0.35, active === 0 ? 0.7 + k * 0.2 : 0)}>
        <rect x={82 + k * 14} y={100 - k * 3} width="20" height="26" rx="2" className="bi-scroll" />
        <text x={92 + k * 14} y={117 - k * 3} textAnchor="middle" className="br-ai">{k + 1}</text>
      </motion.g>)}
      <text x="116" y="154" textAnchor="middle" className={active === 0 ? 'bi-tiny bi-strong' : 'bi-tiny'}>Atos Institucionais</text>
      <motion.g initial={false} animate={{ scale: active === 1 ? 1.15 : 1 }} transition={p(0.5, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={yr(1968) - 14} y="92" width="30" height="36" rx="2" className="bi-scroll" />
        <text x={yr(1968) + 1} y="113" textAnchor="middle" className="br-ai">AI-5</text>
        <circle cx={yr(1968) + 9} cy="122" r="4.5" className="bi-seal" />
      </motion.g>
      <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0, y: active === 1 ? 0 : 6 }} transition={p(0.4, 0.9)}>
        <g transform={`translate(${yr(1970) + 8} 108)`}><Congress x={0} y={-6} s={0.42} /><path d="M-6 8h12v9h-12ZM-4 8v-4a4 4 0 0 1 8 0v4" className="br-lock" /></g>
        <Newspaper x={yr(1973) + 4} y={112} censored />
      </motion.g>
    </motion.g>
    <path d="M30 178H396" className="br-divider" />
    <text x="396" y="194" textAnchor="end" className="bi-hand-sm">lado a lado, no mesmo regime</text>

    <motion.g initial={false} animate={{ opacity: eco ? 1 : 0.4 }} transition={p(0.4)}>
      <text x="30" y="212" className="bi-panel-title">ECONOMIA</text>
      <path d={`M${yr(1964)} 290H${yr(1976)}`} className="bi-axis" />
      <path d={`M${yr(1964)} 290V222`} className="bi-axis" />
      <text x={yr(1964) + 6} y="230" className="bi-tiny">PIB</text>
      <motion.path d={`M${yr(1968)} 272C${yr(1970)} 258 ${yr(1972)} 236 ${yr(1973)} 222V278H${yr(1968)}Z`} className="br-gap" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.5, 1.7)} />
      <motion.path d={`M${yr(1964)} 280C${yr(1966)} 278 ${yr(1967)} 276 ${yr(1968)} 272C${yr(1970)} 258 ${yr(1972)} 236 ${yr(1973)} 222`} className="br-gdp" initial={false}
        animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(1.4, 0.3)} />
      <motion.path d={`M${yr(1968)} 278H${yr(1973)}`} className="br-wage" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4, 1.4)} />
      <motion.text x={yr(1973) + 6} y="282" className="bi-tiny" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4, 1.4)}>salários</motion.text>
      {/* A dívida cresce com o milagre e, no recorte 4, o fio segue para fora do capítulo. */}
      <motion.g initial={false} animate={{ scale: active === 3 ? 1.35 : 1 }} transition={p(0.8, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <Sack x={yr(1969) + 4} y={226} label="dívida" s={0.62} />
      </motion.g>
      <Arrow d={`M${yr(1969) + 22} 238C${yr(1972)} 250 ${yr(1975)} 252 ${yr(1976) + 8} 244`} on={active === 3} p={p} head="br-head-rm1" delay={0.8} />
      <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.4, 0.5)}>
        <path d={`M${yr(1973) + 8} 266h14v20h-14ZM${yr(1973) + 8} 273h14M${yr(1973) + 8} 280h14`} className="br-barrel" />
      </motion.g>
    </motion.g>
    {[1964, 1968, 1973].map(y => <text key={y} x={yr(y)} y="306" textAnchor="middle" className={(y === 1964 && active === 0) || (y === 1968 && active <= 2) || (y === 1973 && active >= 2) ? 'bi-tiny bi-strong' : 'bi-tiny'}>{y}</text>)}

    <rect x="410" y="56" width="186" height="266" rx="14" className="bi-panel" />
    <Panel active={active} p={p}>
      {active === 0 && <g>
        <text x="424" y="80" className="bi-panel-title">ABRIL DE 1964</text>
        <Lines x={424} y={102} gap={15} lines={['golpe depõe João Goulart;', 'militares e civis', 'conservadores, com apoio', 'dos EUA na Guerra Fria']} />
        <text x="424" y="178" className="bi-small bi-strong">Atos Institucionais:</text>
        <Lines x={424} y={196} gap={15} lines={['decretos com força', 'constitucional, sem', 'processo legislativo;', 'cassações e eleição', 'indireta para presidente']} />
      </g>}
      {active === 1 && <g>
        <text x="424" y="80" className="bi-panel-title">AI-5 · DEZ. 1968</text>
        <Lines x={424} y={102} gap={15} lines={['suspende garantias', 'constitucionais; permite', 'fechar o Congresso e', 'cassar sem controle', 'judicial; censura prévia']} />
        <Lines x={424} y={192} gap={15} cls="bi-small bi-warn" lines={['tortura institucionalizada', '(DOI-CODI),', 'desaparecimentos, exílio']} />
        <Lines x={424} y={252} gap={14} cls="bi-tiny" lines={['a luta armada, pequena, foi', 'usada para justificar', 'reprimir toda a oposição']} />
      </g>}
      {active === 2 && <g>
        <text x="424" y="80" className="bi-panel-title">MILAGRE · 1968–1973</text>
        <Infra x={502} y={104} />
        <text x="502" y="130" textAnchor="middle" className="bi-tiny">rodovias · hidrelétricas · telecom</text>
        <Lines x={424} y={156} gap={15} lines={['PIB acelerado com obras', 'estatais e crédito', 'externo barato']} />
        <Lines x={424} y={212} gap={15} cls="bi-small bi-warn" lines={['salários abaixo da', 'produtividade: renda', 'concentrada em favor', 'das camadas mais altas']} />
      </g>}
      {active === 3 && <g>
        <text x="424" y="80" className="bi-panel-title">DÍVIDA EXTERNA</text>
        <Lines x={424} y={102} gap={15} lines={['o milagre foi financiado', 'com dívida externa, a', 'juros então baixos']} />
        <Lines x={424} y={160} gap={15} cls="bi-small bi-warn" lines={['choque do petróleo (1973)', 'e juros altos no fim da', 'década: fica impagável']} />
        <text x="503" y="248" textAnchor="middle" className="bi-hand-sm">→ crise da fase final</text>
        <text x="503" y="266" textAnchor="middle" className="bi-tiny">(Regime Militar II)</text>
      </g>}
    </Panel>
    <text x="30" y="344" className="bi-foot">Curva ilustrativa, sem escala. Política e economia: fases paralelas do regime.</text>
  </svg>;
}

// Regime Militar II: a abertura como escada descida degrau a degrau — "lenta,
// gradual e segura". As Diretas Já ficam ao pé da escada tentando o atalho
// do voto direto, que a emenda rejeitada fecha; a crise econômica fica no
// painel, sem seta para as Diretas, porque o resumo não liga as duas.
const STEPS = [
  { year: '1974', label: ['distensão'] },
  { year: '1978', label: ['AI-5', 'revogado'] },
  { year: '1979', label: ['anistia'] },
  { year: '1985', label: ['colégio', 'eleitoral'] },
];
const stepX = (k: number) => 40 + k * 70, stepY = (k: number) => 112 + k * 46;

export function RegimeMilitarII({ active }: Scene) {
  const p = usePaced();
  const at = [2, 2, 2, 3][active];
  const stairs = `M${stepX(0)} ${stepY(0)}` + STEPS.map((_, k) => `H${stepX(k) + 70}V${stepY(k) + 46}`).join('') + 'H364';
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Regime Militar II: abertura lenta, gradual e segura de 1974 a 1985, crise econômica, Diretas Já com a emenda rejeitada em 1984 e colégio eleitoral em 1985; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="br-head-rm2" />
    <text x="30" y="40" className="bi-kicker">REGIME MILITAR · 1974–1985 · II</text>
    <text x="30" y="72" className="bi-hand">“lenta, gradual e segura”</text>
    <text x="238" y="71" className="bi-tiny">nas palavras dos militares</text>

    <path d={stairs} className="br-stairs" />
    {STEPS.map((s, k) => {
      const on = (active === 0 && k <= 2) || (active === 3 && k === 3);
      return <g key={s.year}>
        <text x={stepX(k) + 4} y={stepY(k) - 8} className={on ? 'bi-date' : 'br-year'}>{s.year}</text>
        {s.label.map((l, i) => <text key={l} x={stepX(k) + 35} y={stepY(k) + 18 + i * 13} textAnchor="middle" className={on ? 'bi-tiny bi-strong' : 'bi-tiny'}>{l}</text>)}
      </g>;
    })}
    <text x="344" y="288" textAnchor="middle" className={active === 3 ? 'bi-date' : 'br-year'}>1988</text>
    <text x="344" y="312" textAnchor="middle" className={active === 3 ? 'bi-tiny bi-strong' : 'bi-tiny'}>Constituição</text>
    <motion.g initial={false} animate={active === 0 && p(1).duration !== 0
      ? { x: [stepX(0) + 56, stepX(1) + 56, stepX(2) + 56], y: [stepY(0) - 25, stepY(1) - 25, stepY(2) - 25] }
      : { x: stepX(at) + 56, y: stepY(at) - 25 }} transition={p(active === 0 ? 2.2 : 1.2, 0.3)}>
      <Person x={0} y={0} s={0.7} coat="bi-coat-plain" />
    </motion.g>

    {/* Diretas Já: a multidão ao pé da escada tenta o atalho do voto direto. */}
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0.3 }} transition={p(0.4)}>
      {[44, 62, 80, 98, 116, 134, 53, 71, 89, 107, 125].map((x, k) => <Person key={`${x}-${k}`} x={x} y={k < 6 ? 272 : 258} s={0.5} coat={['bi-coat-green', 'bi-coat-plain', 'bi-coat', 'bi-coat-royal'][k % 4]} />)}
      <rect x="52" y="226" width="76" height="20" rx="3" className="br-banner" />
      <text x="90" y="240" textAnchor="middle" className="br-banner-text">DIRETAS JÁ</text>
      <path d="M58 246v10M122 246v10" className="bi-pole" />
      <text x="90" y="310" textAnchor="middle" className="bi-tiny">praças, 1983–1984</text>
    </motion.g>
    <Arrow d="M146 262C160 256 170 258 182 266" on={active === 2} p={p} head="br-head-rm2" delay={0.5} />
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4, 0.3)}>
      <BallotBox x={206} y={284} />
      <motion.path d="M190 262l32 32M222 262l-32 32" className="bi-cross" initial={false} animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.5, 1.3)} />
      <text x="206" y="318" textAnchor="middle" className="bi-tiny bi-strong">eleição direta</text>
    </motion.g>

    <rect x="384" y="56" width="212" height="264" rx="14" className="bi-panel" />
    <Panel active={active} p={p}>
      {active === 0 && <g>
        <text x="398" y="80" className="bi-panel-title">DISTENSÃO E ABERTURA</text>
        <Lines x={398} y={100} gap={15} lines={['Geisel (1974), depois', 'Figueiredo: o ritmo fica', 'sob controle militar']} />
        <Lines x={398} y={160} gap={15} lines={['1978: AI-5 revogado', 'fim da censura prévia', '1979: Lei da Anistia']} cls="bi-small bi-strong" />
        <Lines x={398} y={218} gap={15} lines={['recíproca: perdoa opositores', 'e agentes do Estado']} />
        <text x="398" y="262" className="bi-small bi-warn">controvérsia duradoura</text>
        <text x="398" y="277" className="bi-small bi-warn">sobre responsabilização</text>
      </g>}
      {active === 1 && <g>
        <text x="398" y="80" className="bi-panel-title">CRISE ECONÔMICA</text>
        <path d="M408 96h18v26h-18ZM408 104h18M408 114h18" className="br-barrel" />
        <text x="434" y="106" className="bi-tiny bi-strong">2º choque do</text>
        <text x="434" y="118" className="bi-tiny bi-strong">petróleo, 1979</text>
        <text x="520" y="106" className="bi-tiny bi-strong">juros dos EUA</text>
        <text x="520" y="118" className="bi-tiny bi-strong">em alta</text>
        <Arrow d="M430 128C444 140 460 146 476 150" on={active === 1} p={p} head="br-head-rm2" delay={0.3} />
        <Arrow d="M550 124C540 140 524 146 512 150" on={active === 1} p={p} head="br-head-rm2" delay={0.5} />
        <motion.g initial={false} animate={{ scale: [0.8, 1.25] }} transition={p(1, 0.8)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
          <Sack x={494} y={156} label="dívida" s={0.7} />
        </motion.g>
        <text x="398" y="210" className="bi-small">esgota-se o modelo do milagre</text>
        <Lines x={398} y={228} gap={15} lines={['recessão severa', 'inflação de dois e três dígitos', 'desemprego crescente']} cls="bi-small bi-warn" />
        <text x="490" y="298" textAnchor="middle" className="bi-hand-sm">desgasta o apoio ao regime</text>
      </g>}
      {active === 2 && <g>
        <text x="398" y="80" className="bi-panel-title">DIRETAS JÁ · 1983–1984</text>
        <Lines x={398} y={100} gap={15} lines={['multidões nas praças de', 'várias capitais pedem', 'eleição direta para presidente']} />
        {/* Medidor de votos que para pouco antes da marca de aprovação: "margem estreita". */}
        <text x="398" y="158" className="bi-tiny bi-strong">votos pela emenda</text>
        <rect x="398" y="166" width="184" height="14" rx="7" className="bi-gauge" />
        <motion.rect x="398" y="166" height="14" rx="7" className="bi-gauge-fill" initial={false} animate={{ width: [0, 166] }} transition={p(1.4, 0.6)} />
        <path d="M572 160v26" className="bi-marker" />
        <text x="572" y="198" textAnchor="end" className="bi-tiny">aprovação</text>
        <text x="398" y="228" className="bi-small bi-warn">Emenda Dante de Oliveira</text>
        <text x="398" y="244" className="bi-small bi-warn">rejeitada por margem estreita</text>
        <text x="398" y="260" className="bi-small">no Congresso, abril de 1984</text>
        <text x="490" y="300" textAnchor="middle" className="bi-hand-sm">a transição segue indireta</text>
      </g>}
      {active === 3 && <g>
        <text x="398" y="80" className="bi-panel-title">COLÉGIO ELEITORAL · 1985</text>
        <Lines x={398} y={100} gap={15} lines={['congressistas e delegados', 'estaduais elegem, em janeiro,', 'Tancredo Neves (oposição)']} />
        <text x="398" y="162" className="bi-small bi-warn">morre antes da posse</text>
        <Lines x={398} y={186} gap={15} lines={['José Sarney, o vice, assume:', 'primeiro presidente civil', 'após 21 anos de regime']} cls="bi-small bi-strong" />
        <text x="398" y="250" className="bi-small">abre o processo constituinte:</text>
        <text x="398" y="266" className="bi-small">Constituição de 1988</text>
      </g>}
    </Panel>
    <text x="30" y="344" className="bi-foot">Degraus esquemáticos: marcam a ordem, não a duração.</text>
  </svg>;
}

export const SCENES_LOTE14: Record<string, React.ComponentType<Scene>> = {
  'summary-historia-brasil-imperio-segundo-reinado-1840-1889': SegundoReinado,
  'summary-historia-a-republica-da-espada': RepublicaEspada,
  'summary-historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria': DemocraciaGuerraFria,
  'summary-historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo': Desenvolvimentismo,
  'summary-historia-regime-militar-1964-1985-i': RegimeMilitarI,
  'summary-historia-regime-militar-1964-1985-ii': RegimeMilitarII,
};
export const HEADERS_LOTE14: Record<string, string> = {
  'summary-historia-brasil-imperio-segundo-reinado-1840-1889': 'economia, trabalho e guerra',
  'summary-historia-a-republica-da-espada': 'poder e crises do regime',
  'summary-historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria': 'pluralismo e seus limites',
  'summary-historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo': 'projeto e tensões',
  'summary-historia-regime-militar-1964-1985-i': 'trilhas paralelas',
  'summary-historia-regime-militar-1964-1985-ii': 'transição controlada',
};
