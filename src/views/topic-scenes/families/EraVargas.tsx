import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './EraVargas.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 6 da régua de História: Era Vargas e Brasil depois de 1988. Os três
// capítulos de Vargas pedem três fôrmas diferentes de propósito — uma estrada
// (1930–34 é um percurso até a Constituição), um cabo de guerra com a cadeia
// de pretextos embaixo (1934–37) e um espelho dentro × fora (Estado Novo) —
// porque o mecanismo de cada um é outro. Datas, nomes e direitos saem do
// resumo de cada capítulo; o que não tem medida no resumo leva o rodapé
// "esquemático".

// Governo Provisório: Vargas anda pela estrada de 1930 a 1934. Só na última
// parada ele ganha mandato — é a tese do capítulo: o governo começou sem
// eleição e a pressão de 1932 é o que o empurra até a Constituição.
const ROAD = [
  { x: 100, y: 186, title: '1930 · revolução armada', sub: 'fim do café com leite' },
  { x: 240, y: 156, title: '1930–34 · por decretos', sub: 'sem mandato eletivo' },
  { x: 380, y: 186, title: '1932 · SP em armas', sub: 'exige Constituinte' },
  { x: 520, y: 156, title: '1934 · Constituição', sub: 'eleito pelo Congresso' },
];
const ROAD_D = 'M34 196C64 196 72 186 100 186S200 156 240 156S340 186 380 186S480 156 520 156S578 162 592 162';
const ROAD_AT = [0.118, 0.369, 0.62, 0.871];
const RIGHTS_1934 = [
  { label: 'jornada de 8 h', icon: <g><circle r="10" className="ev-icon" /><path d="M0 -6V0l5 3" className="ev-icon" /></g> },
  { label: 'salário mínimo', icon: <g><rect x="-13" y="-8" width="26" height="16" rx="2" className="ev-note" /><circle r="4" className="ev-icon" /></g> },
  { label: 'férias remuneradas', icon: <g><circle r="5" className="ev-sun" /><path d="M0 -12v3M0 9v3M-12 0h3M9 0h3M-8.5 -8.5l2 2M6.5 6.5l2 2M-8.5 8.5l2-2M6.5 -6.5l2-2" className="ev-ray" /></g> },
  { label: 'voto feminino', icon: <g><path d="M-10 -2h20v14h-20ZM-4 -2h8" className="ev-icon" /><path d="M-3 -14h6v9h-6Z" className="ev-slip" /></g> },
];

export function ProvisionalRoad({ active }: Scene) {
  const p = usePaced();
  const at = ROAD[active];
  const icon = (k: number, on: boolean) => [
    <g key="cafe">
      <motion.g initial={false} animate={{ rotate: on ? -28 : 0 }} transition={p(0.6, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'left bottom' }}>
        <path d="M-22 -6h16v6a8 8 0 0 1-16 0ZM-6 -4h3a3 3 0 0 1 0 6h-3" className="bi-cup" />
      </motion.g>
      <motion.g initial={false} animate={{ rotate: on ? 28 : 0 }} transition={p(0.6, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'right bottom' }}>
        <path d="M5 12l2-18h4v-5h6v5h4l2 18Z" className="bi-jug" />
      </motion.g>
      <motion.path d="M-1 -16l-3 8 4 5-3 8 3 6" className="bi-crack" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={p(0.5, 0.6)} />
    </g>,
    <g key="decretos">
      <path d="M-18 -12h22v28h-22Z" className="ev-sheet" />
      <path d="M-14 -16h22v28h-22Z" className="ev-sheet" />
      <path d="M-10 -20h22v28h-22ZM-6 -13h14M-6 -7h14M-6 -1h9" className="ev-sheet" />
      <motion.circle cx="8" cy="4" r="5" className="bi-seal" initial={false} animate={{ scale: on ? [0, 1.3, 1] : 1 }} transition={p(0.5, 0.4)} />
    </g>,
    <g key="1932">
      <path d="M-20 20L-6 -20" className="bi-rifle" />
      <path d="M-2 -2h22v20h-22ZM4 -2h10" className="ev-icon" />
      <motion.path d="M5 -16h8v10h-8Z" className="ev-slip" initial={false} animate={{ y: on ? 9 : 0 }} transition={p(0.8, 0.5)} />
    </g>,
    <g key="1934">
      <path d="M-16 -20h28a4 4 0 0 1 4 4v34h-28a4 4 0 0 1-4-4Z" className="bi-scroll" />
      <path d="M-10 -12h18M-10 -5h18M-10 2h12" className="bi-scroll-line" />
      <motion.circle cx="8" cy="10" r="6" className="bi-seal" initial={false} animate={{ scale: on ? [0, 1.3, 1] : 1 }} transition={p(0.5, 0.5)} />
    </g>,
  ][k];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Governo Provisório de Vargas: da Revolução de 1930, pelo governo por decretos e pela revolta paulista de 1932, até a Constituição de 1934; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ERA VARGAS · GOVERNO PROVISÓRIO</text>
    <path d={ROAD_D} className="ev-road" />
    <path d={ROAD_D} className="ev-road-line" />
    <motion.path d={ROAD_D} className="ev-road-on" initial={false} animate={{ pathLength: ROAD_AT[active] }} transition={p(1, 0.1)} />
    {ROAD.map((s, k) => {
      const on = k === active;
      return <g key={s.title}>
        <motion.g initial={false} animate={{ scale: on ? 1.1 : 1 }} transition={p(0.45)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx={s.x} cy={s.y - 76} r="31" className={on ? 'ev-medal ev-medal-on' : k < active ? 'ev-medal ev-medal-past' : 'ev-medal'} />
          <g transform={`translate(${s.x} ${s.y - 76})`}>{icon(k, on)}</g>
        </motion.g>
        <circle cx={s.x} cy={s.y} r="5" className={k <= active ? 'ev-stop ev-stop-on' : 'ev-stop'} />
        <text x={s.x} y={s.y + 32} textAnchor="middle" className={on ? 'bi-small ev-on' : 'bi-small bi-strong'}>{s.title}</text>
        <text x={s.x} y={s.y + 46} textAnchor="middle" className="bi-tiny">{s.sub}</text>
      </g>;
    })}
    <motion.g initial={false} animate={{ x: at.x, y: at.y - 27 }} transition={p(1, 0.1)}>
      <Person x={0} y={0} s={0.8} coat="bi-coat-dark" hat="brim" />
      <motion.path d="M-7 11L8 25" className="ev-sash" initial={false} animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} transition={p(0.5, 1)} />
    </motion.g>

    <rect x="30" y="252" width="560" height="72" rx="12" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.35)}>
      {active === 0 && <g>
        <text x="48" y="274" className="bi-small bi-strong">o movimento armado depõe Washington Luís e impede a posse de Júlio Prestes</text>
        <text x="48" y="292" className="bi-small">acaba a política do café com leite: SP e MG já não alternam a presidência</text>
        <text x="48" y="312" className="bi-hand-sm">Vargas chega ao poder pelas armas, não pelo voto</text>
      </g>}
      {active === 1 && <g>
        <text x="48" y="274" className="bi-small bi-strong">Vargas concentra o Executivo e governa por decretos, sem eleição</text>
        <text x="48" y="292" className="bi-small">negocia com as forças regionais que o apoiaram e com os tenentes,</text>
        <text x="48" y="308" className="bi-small">que pediam mais intervenção do Estado na economia</text>
      </g>}
      {active === 2 && <g>
        <text x="48" y="274" className="bi-small bi-strong">o movimento constitucionalista paulista pega em armas</text>
        <text x="48" y="292" className="bi-small">pede eleições para uma Assembleia Constituinte e o fim do governo provisório</text>
        <text x="48" y="312" className="bi-small bi-warn">não pedia a separação de São Paulo</text>
      </g>}
      {active === 3 && <g>
        {RIGHTS_1934.map((r, k) => <motion.g key={r.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 0.5 + k * 0.15)}>
          <g transform={`translate(${86 + k * 104} 276)`}>{r.icon}</g>
          <text x={86 + k * 104} y="310" textAnchor="middle" className="bi-tiny bi-strong">{r.label}</text>
        </motion.g>)}
        <path d="M466 262v52" className="bi-tick" />
        <text x="480" y="280" className="bi-small bi-strong">mandato até 1938,</text>
        <text x="480" y="296" className="bi-small">com eleição direta</text>
        <text x="480" y="312" className="bi-small">prevista</text>
      </g>}
    </motion.g>
    <text x="30" y="342" className="bi-foot">Trajeto esquemático: as distâncias da estrada não medem tempo.</text>
  </svg>;
}

// Governo constitucional: AIB e ANL puxam a ordem de 1934 por lados opostos,
// e a cadeia embaixo mostra como cada episódio vira pretexto do seguinte. O
// Plano Cohen sai do lado integralista — é a falsificação que o resumo aponta.
const CHAIN = [
  { x: 100, title: 'polarização', sub: 'AIB × ANL' },
  { x: 240, title: 'Intentona', sub: 'nov. 1935' },
  { x: 380, title: 'Plano Cohen', sub: 'documento forjado' },
  { x: 520, title: 'golpe', sub: '10 nov. 1937' },
];
const toMini = (x: number, y: number) => [448 + 0.36 * x, 86 + 0.36 * y];
const UPRISINGS = [
  { name: 'Natal', at: toMini(338.7, 120.9), dy: -2 },
  { name: 'Recife', at: toMini(341.1, 138.2), dy: 12 },
  { name: 'Rio', at: toMini(275.5, 252.5), dy: 4 },
];

export function CohenEscalation({ active }: Scene) {
  const p = usePaced();
  const faded = (k: number) => (active === 3 ? 0.3 : k === 1 && active >= 1 ? 0.45 : 1);
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Governo constitucional de 1934 a 1937: AIB e ANL em disputa, Intentona de 1935, Plano Cohen forjado e golpe de 10 de novembro de 1937; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">GOVERNO CONSTITUCIONAL · 1934–1937</text>

    <motion.g initial={false} animate={active === 0 ? { rotate: [0, -2, 2, -1.5, 1, 0] } : { rotate: 0 }} transition={p(1.4, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
      <path d="M196 134a34 28 0 0 1 68 0Z" className="ev-dome" />
      <path d="M230 106v-10M230 96h10l-3 3 3 3h-10" className="ev-flagpole" />
      <rect x="166" y="134" width="128" height="12" rx="2" className="ev-stone" />
      {[172, 190, 260, 278].map(x => <rect key={x} x={x} y="146" width="10" height="46" className="ev-column" />)}
      <rect x="208" y="152" width="44" height="40" rx="3" className="ev-door" />
      <path d="M216 160h24a4 4 0 0 1 4 4v22h-24a4 4 0 0 1-4-4Z" className="bi-scroll" />
      <path d="M221 167h16M221 173h16M221 179h10" className="bi-scroll-line" />
      <motion.g initial={false} animate={{ opacity: active === 1 || active === 2 ? 1 : 0, scale: active === 1 ? [0.4, 1.2, 1] : 1 }} transition={p(0.5, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d="M225 176v-5a5 5 0 0 1 10 0v5" className="ev-lock-shackle" />
        <rect x="222" y="175" width="16" height="12" rx="2" className="ev-lock" />
      </motion.g>
      {[['M206 154L254 190', 0.3], ['M254 154L206 190', 0.6]].map(([d, delay]) => <motion.path key={d as string} d={d as string} className="ev-plank" initial={false}
        animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} transition={p(0.5, delay as number)} />)}
      <rect x="160" y="192" width="140" height="7" className="ev-stone" />
      <rect x="152" y="199" width="156" height="7" className="ev-stone" />
    </motion.g>
    <text x="230" y="224" textAnchor="middle" className="bi-small bi-strong">Congresso Nacional</text>
    <motion.text key={`c-${active === 3}`} x="230" y="240" textAnchor="middle" className={active === 3 ? 'bi-tiny bi-warn' : 'bi-tiny'}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, active === 3 ? 0.8 : 0)}>
      {active === 3 ? 'fechado em 1937' : 'sob a Constituição de 1934'}
    </motion.text>

    {[{ x: 84, hand: 'M98 172Q130 188 160 176', lean: -8, flag: 'M64 186V110M64 112h-26l6 8-6 8h26', flagClass: 'ev-flag-aib', coat: 'bi-coat-green', name: 'AIB', l1: 'Plínio Salgado, 1932', l2: 'inspiração fascista' },
      { x: 380, hand: 'M366 172Q332 188 300 176', lean: 8, flag: 'M404 186V110M404 112h26l-6 8 6 8h-26', flagClass: 'ev-flag-anl', coat: 'ev-coat-anl', name: 'ANL', l1: 'com Prestes', l2: 'frente de esquerda' }].map((f, k) => <g key={f.name}>
      <motion.path d={f.hand} className="ev-rope" initial={false} animate={{ opacity: active === 0 || (k === 0 && active === 2) ? 1 : active === 3 ? 0 : 0.18 }} transition={p(0.4)} />
      <motion.g initial={false} animate={{ opacity: faded(k), rotate: active === 0 ? f.lean : 0 }} transition={p(0.6, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
        <path d={f.flag} className={f.flagClass} />
        <Person x={f.x} y={146} s={1.25} coat={f.coat} />
      </motion.g>
      <text x={f.x} y="208" textAnchor="middle" className={(k === 0 && active === 2) || (k === 1 && active === 1) || active === 0 ? 'bi-label bi-on' : 'bi-label'}>{f.name}</text>
      <text x={f.x} y="224" textAnchor="middle" className="bi-small">{f.l1}</text>
      <text x={f.x} y="238" textAnchor="middle" className="bi-tiny">{f.l2}</text>
    </g>)}
    <motion.path d="M362 128v60M373 128v60M384 128v60M395 128v60M358 128h42M358 188h42" className="ev-bars" initial={false}
      animate={{ opacity: active >= 1 ? 1 : 0, y: active >= 1 ? 0 : -14 }} transition={p(0.5, 0.4)} />
    {active === 2 && <motion.g initial={{ x: 0, y: 0, opacity: 0 }} animate={p(1).duration === 0 ? { x: 44, y: -62, opacity: 1 } : { x: [0, 20, 44], y: [0, -48, -62], opacity: [0, 1, 1] }} transition={p(1.2, 0.3)}>
      <path d="M100 140h20l6 6v24h-26Z" className="ev-sheet" />
      <path d="M104 150h14M104 156h16M104 162h10" className="bi-scroll-line" />
    </motion.g>}
    {active === 3 && [{ x: 140, coat: 'bi-coat-dark', hat: 'brim' as const, d: 0.4 }, { x: 324, coat: 'bi-coat-army', hat: 'kepi' as const, d: 0.6 }].map(f =>
      <motion.g key={f.x} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, f.d)}>
        <Person x={f.x} y={156} s={0.9} coat={f.coat} hat={f.hat} />
      </motion.g>)}

    <rect x="434" y="56" width="166" height="206" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.3)}>
      {active === 0 && <g>
        <text x="518" y="80" textAnchor="middle" className="bi-panel-title">POLARIZAÇÃO</text>
        <text x="518" y="104" textAnchor="middle" className="bi-small bi-strong">fascismo × comunismo</text>
        <text x="518" y="120" textAnchor="middle" className="bi-small">após a Grande Depressão</text>
        <g transform="translate(518 158)">
          <path d="M-30 6l10-14 8 6 6-12M30 6l-10-14-8 6-6-12" className="ev-clash" />
          <path d="M-6 -20l6 8 6-8" className="ev-spark" />
        </g>
        <text x="518" y="194" textAnchor="middle" className="bi-small">confrontos de rua</text>
        <text x="518" y="226" textAnchor="middle" className="bi-hand-sm">a instabilidade</text>
        <text x="518" y="244" textAnchor="middle" className="bi-hand-sm">vira justificativa</text>
      </g>}
      {active === 1 && <g>
        <text x="518" y="78" textAnchor="middle" className="bi-panel-title">INTENTONA · 1935</text>
        <path d={BRAZIL} transform="translate(448 86) scale(.36)" className="bi-land" />
        {UPRISINGS.map((u, k) => <g key={u.name}>
          <motion.path transform={`translate(${u.at[0]} ${u.at[1]})`} d="M0 -7l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" className="ev-burst" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={p(0.5, 0.5 + k * 0.2)} />
          <text x={u.at[0] - 9} y={u.at[1] + u.dy} textAnchor="end" className="bi-tiny bi-strong">{u.name}</text>
        </g>)}
        <text x="518" y="220" textAnchor="middle" className="bi-small">fracassa em poucos dias;</text>
        <text x="518" y="236" textAnchor="middle" className="bi-small bi-warn">estado de sítio</text>
        <text x="518" y="252" textAnchor="middle" className="bi-tiny">Olga Benário deportada</text>
      </g>}
      {active === 2 && <g>
        <text x="518" y="80" textAnchor="middle" className="bi-panel-title">PLANO COHEN</text>
        <g transform="translate(518 124)">
          <path d="M-22 -28h34l10 10v46h-44Z" className="ev-sheet" />
          <path d="M-14 -16h22M-14 -8h28M-14 0h28M-14 8h18" className="bi-scroll-line" />
          <motion.g initial={{ scale: 2, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={p(0.4, 0.9)}>
            <rect x="-30" y="-2" width="60" height="22" rx="3" className="bi-stamp" />
            <text x="0" y="14" textAnchor="middle" className="bi-stamp-text">FALSO</text>
          </motion.g>
        </g>
        <text x="518" y="184" textAnchor="middle" className="bi-small">dito plano comunista,</text>
        <text x="518" y="200" textAnchor="middle" className="bi-small bi-strong">forjado por militares</text>
        <text x="518" y="216" textAnchor="middle" className="bi-small bi-strong">integralistas</text>
        <text x="518" y="244" textAnchor="middle" className="bi-hand-sm">pretexto de emergência</text>
      </g>}
      {active === 3 && <g>
        <text x="518" y="84" textAnchor="middle" className="bi-date">10 nov. 1937</text>
        <g transform="translate(518 124)">
          <rect x="-24" y="-20" width="48" height="42" rx="4" className="ev-calendar" />
          <path d="M-24 -8h48M-12 -26v10M12 -26v10" className="ev-icon" />
          <text x="0" y="12" textAnchor="middle" className="bi-small bi-strong">1938</text>
          <motion.path d="M-28 -24L28 26M28 -24L-28 26" className="bi-cross" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 0.6)} />
        </g>
        <text x="518" y="172" textAnchor="middle" className="bi-small">eleição de 1938 evitada</text>
        <text x="518" y="194" textAnchor="middle" className="bi-small bi-strong">Constituição outorgada,</text>
        <text x="518" y="210" textAnchor="middle" className="bi-small bi-strong">sem constituinte</text>
        <text x="518" y="236" textAnchor="middle" className="bi-small">apoio das Forças Armadas</text>
      </g>}
    </motion.g>

    {CHAIN.map((c, k) => {
      const on = k === active;
      return <g key={c.title}>
        <motion.ellipse cx={c.x} cy="294" rx="74" ry="17" initial={false} className={on ? 'ev-link ev-link-on' : k < active ? 'ev-link ev-link-past' : 'ev-link'}
          animate={{ scale: on ? 1.05 : 1 }} transition={p(0.4, on ? 0.2 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <text x={c.x} y="298" textAnchor="middle" className={on ? 'bi-small ev-link-text-on' : 'bi-small bi-strong'}>{c.title}</text>
        <text x={c.x} y="325" textAnchor="middle" className={on ? 'bi-tiny bi-strong' : 'bi-tiny'}>{c.sub}</text>
      </g>;
    })}
    <text x="30" y="344" className="bi-foot">Cadeia esquemática: cada elo serve de pretexto ao seguinte.</text>
  </svg>;
}

// Estado Novo: a contradição tem dois lugares, e a cena os põe lado a lado —
// o Brasil da ditadura à esquerda, a Itália onde as tropas brasileiras
// combatem o fascismo à direita. Na queda, o soldado que sustentava Vargas
// desde 1937 se afasta, e o ditador cai sem que ninguém o derrube à força.
const toState = (x: number, y: number) => [20 + 0.56 * x, 60 + 0.56 * y];
const ROUTE = 'M222 124C300 40 440 40 506 98';

export function WarMirror({ active }: Scene) {
  const p = usePaced();
  const [basesX, basesY] = toState(339.5, 128);
  const [rioX, rioY] = toState(275.5, 252.5);
  const fall = active === 2;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Estado Novo: ditadura dentro do país e tropas brasileiras contra o fascismo na Itália; a contradição leva as Forças Armadas a depor Vargas em outubro de 1945; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ESTADO NOVO · 1937–1945</text>
    <path d={BRAZIL} transform="translate(20 60) scale(.56)" className="bi-land" />
    <path d="M512 84l14 2 8 14-2 10 12 18 18 14 10 2-2 8-12-2-10 16-4 12-8-2 4-16-6-12-16-12-8-20Z" className="bi-land" />
    <path d="M532 180l16-2 4 8-14 4Z" className="bi-land" />
    <text x="562" y="118" className="bi-small bi-strong">Itália</text>

    <path d="M60 128h32v-8l16-10 16 10v8h-2v24h-60v-24Z" className="ev-mini-house" transform="translate(-10 6)" />
    <g transform="translate(72 142)">
      <path d="M-5 0v-5a5 5 0 0 1 10 0v5" className="ev-lock-shackle" />
      <rect x="-8" y="-1" width="16" height="12" rx="2" className="ev-lock" />
    </g>
    <g transform="translate(88 206)">
      <rect x="-16" y="-10" width="32" height="22" rx="4" className="ev-radio" />
      <circle cx="-6" cy="1" r="6" className="ev-icon" />
      <path d="M4 -4h8M4 1h8M4 6h8M-10 -10l14-10" className="ev-icon" />
    </g>
    <path transform={`translate(${basesX} ${basesY})`} d="M0 -7l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" className="ev-burst" />
    <text x={basesX - 8} y={basesY - 10} textAnchor="end" className="bi-tiny bi-strong">bases</text>
    <rect x={rioX - 5} y={rioY - 5} width="10" height="10" rx="2" className="ev-steel" />
    <text x={rioX - 9} y={rioY + 18} textAnchor="middle" className="bi-tiny bi-strong">CSN</text>

    <motion.g initial={false} animate={fall ? { rotate: -80, opacity: 0.35, x: 0, y: 8 } : { rotate: 0, opacity: 1, x: 0, y: 0 }} transition={p(0.9, fall ? 1.1 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
      <Person x={140} y={148} s={0.85} coat="bi-coat-dark" hat="brim" />
    </motion.g>
    <motion.g initial={false} animate={fall ? { x: 40, opacity: 0.3 } : { x: 0, opacity: 1 }} transition={p(1, fall ? 0.3 : 0)}>
      <Person x={166} y={152} s={0.85} coat="bi-coat-army" hat="kepi" />
    </motion.g>

    <path d={ROUTE} className="ev-route" />
    <motion.g initial={false} animate={active === 0 && p(1).duration !== 0 ? { x: [222, 290, 369, 446, 506], y: [124, 78, 58, 66, 98] } : { x: 506, y: 98 }} transition={p(2, 0.3)}>
      <path d="M-14 0h28l-5 7h-18ZM-2 0v-12l10 10h-10" className="bi-ship" />
    </motion.g>
    <text x="369" y="82" textAnchor="middle" className="bi-tiny bi-strong">tropas brasileiras à Itália</text>
    {[0, 1].map(k => <motion.g key={k} initial={false} animate={{ opacity: fall ? 0.4 : 1 }} transition={p(0.4)}>
      <Person x={528 + k * 16} y={138 + k * 10} s={0.5} coat="bi-coat-army" hat="kepi" />
    </motion.g>)}

    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.35)}>
      {active === 0 && <g>
        <text x="362" y="116" textAnchor="middle" className="bi-label bi-on">ao lado dos Aliados</text>
        <text x="362" y="134" textAnchor="middle" className="bi-small">contra o Eixo: Alemanha,</text>
        <text x="362" y="150" textAnchor="middle" className="bi-small">Itália e Japão</text>
        <text x="362" y="180" textAnchor="middle" className="bi-small bi-strong">acordo com os EUA:</text>
        <text x="362" y="196" textAnchor="middle" className="bi-small">tropas e bases no Nordeste ↔</text>
        <text x="362" y="212" textAnchor="middle" className="bi-small">financiamento da CSN,</text>
        <text x="362" y="228" textAnchor="middle" className="bi-small">Volta Redonda (1941)</text>
      </g>}
      {active === 1 && <g>
        {[{ x: 234, title: 'aqui dentro', lines: ['regime autoritário', 'de inspiração', 'parcialmente fascista'] }, { x: 370, title: 'lá fora', lines: ['soldados enviados', 'para combater', 'o fascismo europeu'] }].map(b => <g key={b.title}>
          <rect x={b.x} y="100" width="124" height="84" rx="10" className="ev-frame" />
          <text x={b.x + 62} y="120" textAnchor="middle" className="bi-panel-title">{b.title.toUpperCase()}</text>
          {b.lines.map((l, i) => <text key={l} x={b.x + 62} y={142 + i * 14} textAnchor="middle" className="bi-tiny">{l}</text>)}
        </g>)}
        <motion.path d="M364 96l-5 14 6 10-6 14 6 12-6 14 5 22" className="bi-crack" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.8, 0.6)} />
        {[300, 330, 360, 390, 420].map((x, k) => <motion.g key={x} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 0.8 + k * 0.1)}>
          <Person x={x} y={204} s={0.5} coat={k % 2 ? 'bi-coat-plain' : 'bi-coat-green'} />
        </motion.g>)}
        <text x="362" y="244" textAnchor="middle" className="bi-hand-sm">pressão por redemocratização</text>
      </g>}
      {active === 2 && <g>
        <text x="362" y="120" textAnchor="middle" className="bi-date">outubro de 1945</text>
        <text x="362" y="146" textAnchor="middle" className="bi-small bi-strong">as Forças Armadas, que</text>
        <text x="362" y="162" textAnchor="middle" className="bi-small bi-strong">sustentaram o golpe de 1937,</text>
        <text x="362" y="178" textAnchor="middle" className="bi-small bi-strong">retiram o apoio e o depõem</text>
        <text x="362" y="200" textAnchor="middle" className="bi-small">movimento relativamente pacífico</text>
        <text x="362" y="232" textAnchor="middle" className="bi-hand-sm">Vargas volta eleito em 1950</text>
      </g>}
    </motion.g>

    <rect x="30" y="264" width="560" height="62" rx="12" className="bi-panel" />
    <text x="48" y="284" className="bi-panel-title">AQUI DENTRO · DITADURA</text>
    <text x="48" y="301" className="bi-small">Congresso fechado · interventores</text>
    <text x="48" y="317" className="bi-small">DIP (1939): censura e propaganda</text>
    <text x="332" y="284" className="bi-panel-title">LÁ FORA · SEGUNDA GUERRA</text>
    <text x="332" y="301" className="bi-small">tropas na Itália · bases no Nordeste</text>
    <text x="332" y="317" className="bi-small">ao lado dos Aliados</text>
    <path d="M312 270v50" className="bi-tick" />
    <motion.path d="M312 268l-5 12 6 8-6 12 5 10-4 10" className="bi-crack" initial={false} animate={{ pathLength: active >= 1 ? 1 : 0, opacity: active >= 1 ? 1 : 0 }} transition={p(0.7, 0.5)} />
    <text x="30" y="344" className="bi-foot">Mapas esquemáticos, sem escala; posições aproximadas.</text>
  </svg>;
}

// Brasil atual: três condições entram por um portão "E". A curva da
// desigualdade só desce quando as três passam juntas — é o "nenhum fator
// isolado" do resumo. A linha do tempo embaixo situa a década entre a
// Constituição de 1988 e a crise de 2014–2016.
const FACTORS = [
  { y: 64, title: 'Bolsa Família', sub: '2003: unifica programas' },
  { y: 130, title: 'salário mínimo', sub: 'ganho acima da inflação' },
  { y: 196, title: 'commodities em alta', sub: 'exportações puxam o PIB' },
];
const yr = (y: number) => 44 + (y - 1985) * (530 / 35);

export function InequalityGate({ active }: Scene) {
  const p = usePaced();
  const lit = (k: number) => active === 3 || active === k;
  const all = active === 3;
  const icons = [
    <g key="bf"><rect x="-15" y="-10" width="30" height="20" rx="3" className="ev-card" /><circle cx="-6" cy="-2" r="3" className="ev-card-ink" /><circle cx="3" cy="-2" r="3" className="ev-card-ink" /><circle cx="10" cy="0" r="2.4" className="ev-card-ink" /><path d="M-11 7c0-5 10-5 10 0M-2 7c0-5 10-5 10 0" className="ev-card-line" /></g>,
    <g key="sm"><rect x="-15" y="-7" width="26" height="15" rx="2" className="ev-note" /><circle cx="-2" cy="0.5" r="3.5" className="ev-icon" /><path d="M14 8V-12M9 -7l5-5 5 5" className="ev-up" /></g>,
    <g key="cm"><path d="M-16 4h30l-6 8h-20ZM-10 4v-9h8v9M0 4v-6h8v6" className="bi-ship" /><path d="M14 -2V-14M10 -10l4-4 4 4" className="ev-up" /></g>,
  ];
  const notes = [
    ['renda condicionada; reuniu', 'programas anteriores'],
    ['reajuste acima da inflação:', 'ganho real de renda'],
    ['preços internacionais altos', 'das commodities exportadas'],
    ['menos pobreza extrema e', 'Gini menor na década'],
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Brasil atual: Bolsa Família, valorização do salário mínimo e alta das commodities, combinados, reduzem a desigualdade nos anos 2000; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="ev-head-gate" />
    <text x="30" y="40" className="bi-kicker">BRASIL ATUAL · A DÉCADA DE 2000</text>
    {FACTORS.map((f, k) => <g key={f.title}>
      <motion.path d={`M226 ${f.y + 26}C262 ${f.y + 26} 256 156 290 156`} className="ev-stream" initial={false}
        animate={{ pathLength: lit(k) ? 1 : 0.02, opacity: lit(k) ? 1 : 0.35 }} transition={p(0.8, all ? 0.2 + k * 0.2 : 0.2)} />
      <motion.g initial={false} animate={{ x: lit(k) ? 4 : 0 }} transition={p(0.4)}>
        <rect x="30" y={f.y} width="196" height="52" rx="12" className={lit(k) ? 'ev-factor ev-factor-on' : 'ev-factor'} />
        <g transform={`translate(58 ${f.y + 26})`}>{icons[k]}</g>
        <text x="86" y={f.y + 23} className={lit(k) ? 'bi-small ev-on' : 'bi-small bi-strong'}>{f.title}</text>
        <text x="86" y={f.y + 39} className="bi-tiny">{f.sub}</text>
      </motion.g>
    </g>)}
    <motion.circle cx="304" cy="156" r="22" initial={false} className={all ? 'ev-gate ev-gate-open' : 'ev-gate'} animate={{ scale: all ? [1, 1.18, 1] : 1 }} transition={p(0.6, 0.8)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    <text x="304" y="162" textAnchor="middle" className="ev-gate-text">E</text>
    <text x="304" y="196" textAnchor="middle" className={all ? 'bi-small ev-on' : 'bi-small bi-strong'}>{all ? '3 de 3' : '1 de 3'}</text>
    <Arrow d="M328 156H350" on p={p} head="ev-head-gate" delay={0.2} />

    <rect x="358" y="56" width="238" height="198" rx="14" className="bi-panel" />
    <text x="376" y="80" className="bi-panel-title">DESIGUALDADE (GINI)</text>
    <path d="M378 92V196H580" className="bi-axis" />
    <text x="479" y="212" textAnchor="middle" className="bi-tiny">anos 2000</text>
    <path d="M384 108H574" className="ev-ghost" />
    <motion.path d="M384 108C430 112 470 140 574 176" className="ev-gini" initial={false}
      animate={{ pathLength: all ? 1 : 0, opacity: all ? 1 : 0 }} transition={p(1.4, 0.9)} />
    <motion.g key={`h-${all}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, all ? 1.8 : 0.6)}>
      <text x={all ? 390 : 566} y={all ? 180 : 136} textAnchor={all ? 'start' : 'end'} className="bi-hand-sm">{all ? 'a curva desce' : 'um fator só não explica'}</text>
    </motion.g>
    <motion.g key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 0.3)}>
      <text x="376" y="232" className="bi-small bi-strong">{notes[0]}</text>
      <text x="376" y="246" className="bi-small">{notes[1]}</text>
    </motion.g>

    <path d="M44 290H574" className="bi-axis" />
    <rect x={yr(2000)} y="284" width={yr(2010) - yr(2000)} height="12" rx="6" className="ev-decade" />
    <text x={(yr(2000) + yr(2010)) / 2} y="279" textAnchor="middle" className="bi-tiny bi-strong">anos 2000</text>
    <rect x={yr(2014)} y="284" width={yr(2016) - yr(2014)} height="12" rx="4" className="ev-crisis" />
    {[[1988, 'Constituição Cidadã'], [1994, 'Plano Real'], [2003, 'Bolsa Família'], [2015, 'recessão · impeachment']].map(([y, ev]) => <g key={ev}>
      {y !== 2015 && <circle cx={yr(y as number)} cy="290" r="4" className="bi-dot" />}
      <text x={yr(y as number)} y="310" textAnchor="middle" className="bi-small bi-strong">{y === 2015 ? '2014–16' : y}</text>
      <text x={yr(y as number)} y="323" textAnchor="middle" className="bi-tiny">{ev}</text>
    </g>)}
    <text x="30" y="344" className="bi-foot">Curva ilustrativa, sem escala: o resumo não dá valores do Gini.</text>
  </svg>;
}

// A História e o Brasil: o mesmo encontro de 1500, iluminado por narradores
// diferentes. O feixe sai do navio na historiografia antiga e da aldeia na
// recente; no deslocamento, a pena atravessa a praia. Embaixo, as três
// fontes do resumo acendem conforme quem narra.
const SOURCES = [
  { x: 30, title: 'cartas e crônicas', sub: 'olhar do colonizador' },
  { x: 222, title: 'arqueologia', sub: 'cerâmica, terra preta' },
  { x: 414, title: 'história oral', sub: 'perspectiva interna' },
];
const VILLAGERS = [372, 404, 436];

export function NarratorBeam({ active }: Scene) {
  const p = usePaced();
  const srcOn = (k: number) => active === 2 || (active === 0 ? k === 0 : k > 0);
  const beam = [
    'M156 112L600 64V240L300 240Z',
    'M404 164L600 56V56L236 56Z',
    'M404 164L600 56V56L236 56Z',
  ][active];
  const agents = active >= 1;
  const icons = [
    <path key="l" d="M-11 -7h22v14h-22ZM-11 -7l11 8 11-8" className="ev-icon" />,
    <path key="a" d="M-9 -8h18M-7 -8c-4 6-4 12 0 16h14c4-4 4-10 0-16M-6 0h12" className="ev-icon" />,
    <path key="o" d="M-12 -8h24v13h-12l-6 6v-6h-6Z" className="ev-icon" />,
  ];
  const sky = [
    [{ t: '“descobrimento”', c: 'bi-hand' }, { t: '“civilização”', c: 'bi-hand' }, { t: 'violência da conquista minimizada', c: 'bi-small bi-warn' }],
    [{ t: 'resistência', c: 'bi-hand' }, { t: 'negociação', c: 'bi-hand' }, { t: 'contribuição formadora da sociedade', c: 'bi-small bi-strong' }],
    [{ t: 'quem tem autoridade', c: 'bi-hand' }, { t: 'para narrar?', c: 'bi-hand' }, { t: '“descobrimento”, “invasão” ou “conquista”?', c: 'bi-small bi-strong' }],
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`A História e o Brasil: o encontro de 1500 narrado do navio pela historiografia antiga e da aldeia pela recente, com as fontes escritas, arqueológicas e orais; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <defs><clipPath id="ev-coast-clip"><rect x="20" y="56" width="580" height="184" rx="14" /></clipPath></defs>
    <g clipPath="url(#ev-coast-clip)">
      <path d="M20 56H236C220 96 252 130 232 170C218 200 246 222 236 240H20Z" className="ev-sea" />
      <path d="M40 206q10-6 20 0t20 0M110 224q10-6 20 0t20 0M44 234q10-6 20 0t20 0" className="ev-wave" />
      <path d="M236 56H600V240H236C246 222 218 200 232 170C252 130 220 96 236 56Z" className="ev-shore" />
      <motion.path d={beam} className="ev-beam" initial={false} animate={{ d: beam }} transition={p(0.9, 0.2)} />
    </g>
    <text x="30" y="40" className="bi-kicker">HISTORIOGRAFIA · QUEM NARRA 1500</text>

    <g>
      <path d="M72 176h96l-14 20h-68Z" className="ev-hull" />
      <path d="M118 176V96" className="bi-pole" />
      <path d="M120 102h34q8 18 0 36h-34Z" className="ev-sail" />
      <path d="M120 142h26q6 14 0 28h-26Z" className="ev-sail" />
      <path d="M118 96l14 5-14 5" className="bi-flag" />
      <Person x={88} y={148} s={0.6} coat="bi-coat-royal" hat="top" />
    </g>

    {[{ x: 520, y: 118 }, { x: 552, y: 138 }, { x: 574, y: 108 }, { x: 540, y: 96 }].map((t, k) => <g key={k}>
      <path d={`M${t.x} ${t.y + 44}v-26`} className="ev-trunk" />
      <circle cx={t.x} cy={t.y + 8} r="16" className="ev-canopy" />
    </g>)}
    <ellipse cx="546" cy="212" rx="40" ry="8" className="ev-terra" />
    {[[526, 210], [540, 214], [556, 209], [568, 213]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" className="ev-pebble" />)}
    <motion.text x="546" y="232" textAnchor="middle" className="bi-tiny bi-strong" initial={false} animate={{ opacity: agents ? 1 : 0 }} transition={p(0.4, 0.8)}>terra preta</motion.text>
    {[342, 468].map(x => <path key={x} d={`M${x - 22} 204a22 26 0 0 1 44 0ZM${x - 5} 204v-10h10v10`} className="ev-hut" />)}
    {VILLAGERS.map((x, k) => <motion.g key={x} initial={false}
      animate={{ opacity: agents ? 1 : 0.5, y: agents ? -4 : 0 }} transition={p(0.5, agents ? 0.3 + k * 0.15 : 0)}>
      <Person x={x} y={172} s={0.72} coat={agents ? ['ev-coat-urucum', 'bi-coat-green', 'bi-coat-plain'][k] : 'ev-coat-grey'} />
    </motion.g>)}
    <motion.g initial={false} animate={{ opacity: agents ? 1 : 0, y: agents ? 0 : 6 }} transition={p(0.4, 0.9)}>
      <path d="M362 150q12-16 0-32M362 150V118M354 134h18l-4-3M372 134l-4 3" className="ev-bow" />
      <path d="M394 128h18l-4-4M414 138h-18l4 4" className="ev-shake" />
      <path d="M428 124h16l-2 4 3 6-5 8h-8l-5-8 3-6Z" className="ev-pot" />
    </motion.g>
    {active === 2 && <motion.g initial={{ x: 0, y: 0 }} animate={p(1).duration === 0 ? { x: 270, y: 32 } : { x: [0, 130, 270], y: [0, -42, 32] }} transition={p(1.6, 0.4)}>
      <path d="M100 126l14-22c4-6 12-2 8 4l-18 20Z" className="ev-quill" />
      <path d="M100 126l-3 5" className="ev-icon" />
    </motion.g>}

    <motion.g key={active} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.5)}>
      {active < 2 ? <>
        <text x="268" y="78" className={sky[0].c}>{sky[0].t}</text>
        <text x={active === 0 ? 418 : 402} y="78" className={sky[1].c}>{sky[1].t}</text>
      </> : <text x="268" y="78" className="bi-hand">{`${sky[0].t} ${sky[1].t}`}</text>}
      <text x="268" y="98" className={sky[2].c}>{sky[2].t}</text>
    </motion.g>

    {SOURCES.map((s, k) => <motion.g key={s.title} initial={false} animate={{ opacity: srcOn(k) ? 1 : 0.45 }} transition={p(0.4, 0.3 + k * 0.1)}>
      <rect x={s.x} y="254" width="176" height="62" rx="12" className={srcOn(k) ? 'ev-factor ev-factor-on' : 'ev-factor'} />
      <g transform={`translate(${s.x + 28} 285)`}>{icons[k]}</g>
      <text x={s.x + 54} y="281" className={srcOn(k) ? 'bi-small ev-on' : 'bi-small bi-strong'}>{s.title}</text>
      <text x={s.x + 54} y="297" className="bi-tiny">{s.sub}</text>
    </motion.g>)}
    <text x="30" y="342" className="bi-foot">Cena esquemática: praia, navio e aldeia não reproduzem um lugar real.</text>
  </svg>;
}

export const SCENES_LOTE6: Record<string, React.ComponentType<Scene>> = {
  'summary-historia-a-era-vargas': ProvisionalRoad,
  'summary-historia-a-era-vargas-o-governo-constitucional-1934-1937': CohenEscalation,
  'summary-historia-a-era-vargas-o-estado-novo': WarMirror,
  'summary-historia-o-brasil-atual': InequalityGate,
  'summary-historia-a-historia-e-o-brasil': NarratorBeam,
};
export const HEADERS_LOTE6: Record<string, string> = {
  'summary-historia-a-era-vargas': 'da revolução à Constituição',
  'summary-historia-a-era-vargas-o-governo-constitucional-1934-1937': 'escalada de pretextos',
  'summary-historia-a-era-vargas-o-estado-novo': 'contradição dentro e fora',
  'summary-historia-o-brasil-atual': 'condições combinadas',
  'summary-historia-a-historia-e-o-brasil': 'quem narra a história',
};
