import React from 'react';
import { MolecularObjectView } from '../../visual-instruments/ScienceObjectView';
import { motion } from 'motion/react';
import type { SceneEntry } from '../types';
import { useSceneMotion } from '../useSceneMotion';
import { FenomenoFrame, FOCO, type Cena, type CenaFenomeno } from './FenomenoFrame';

// Seis capítulos de Química caíam na família genérica `tipologia`, que não
// desenha nada: só cartões com rótulo e citação (auditoria geral, doc 38). Aqui
// cada capítulo ganha o fenômeno que o resumo descreve. Os itens da entrada
// continuam sendo o conteúdo — rótulo, afirmação e trecho literal —; a cena é
// escolhida pelo rótulo, e um rótulo sem desenho falha no teste em vez de cair
// num quadro vazio. Formas e proporções são esquema, e a prancha diz isso.



// ---------------------------------------------------------------------------
// Tabela periódica: o contorno das 18 colunas, a família acesa, e ao lado o
// átomo com os elétrons de valência que a citação dá (1, 2, 7 ou 8). O
// hidrogênio fica fora da coluna dos alcalinos: a citação fala de metais que
// reagem com água, e ele não é um deles.
const COLUNA: Record<string, number> = { Alcalinos: 1, 'Alcalino-terrosos': 2, Halogênios: 17, 'Gases nobres': 18 };
const VALENCIA: Record<string, number> = { Alcalinos: 1, 'Alcalino-terrosos': 2, Halogênios: 7, 'Gases nobres': 8 };
const TENDENCIA: Record<string, [string, string]> = {
  Alcalinos: ['perde 1 e⁻', 'cátion monovalente'],
  'Alcalino-terrosos': ['2 e⁻ de valência', 'reatividade menor que a dos alcalinos'],
  Halogênios: ['ganha 1 e⁻', 'ânion monovalente (haleto)'],
  'Gases nobres': ['camada completa', 'praticamente inertes'],
};

function existe(periodo: number, coluna: number) {
  if (periodo === 1) return coluna === 1 || coluna === 18;
  if (periodo <= 3) return coluna <= 2 || coluna >= 13;
  return true;
}

export const QUIMICA_FENOMENO_TESTE = { COLUNA, VALENCIA };

function TabelaPeriodica({ ativo, t }: Cena) {
  const col = COLUNA[ativo];
  const n = VALENCIA[ativo];
  const [acao, efeito] = TENDENCIA[ativo];
  const cx = 110;
  const cy = 244;
  const perde = ativo === 'Alcalinos';
  const ganha = ativo === 'Halogênios';
  return <g>
    {Array.from({ length: 7 }, (_, p) => Array.from({ length: 18 }, (_, c) => {
      if (!existe(p + 1, c + 1)) return null;
      const aceso = c + 1 === col && !(col === 1 && p === 0);
      return <motion.rect key={`${p}-${c}`} x={42 + c * 22} y={24 + p * 20} width="20" height="18" rx="2"
        className={aceso ? 'qf-celula qf-celula--acesa' : 'qf-celula'} initial={false} animate={{ opacity: aceso ? 1 : 0.55 }} transition={t} />;
    }))}
    {[1, 2, 17, 18].map((c) => <text key={c} x={53 + (c - 1) * 22} y={18} textAnchor="middle" className={c === col ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{c}</text>)}
    <text x={35} y={37} textAnchor="end" className="qf-mini">H</text>
    <circle cx={cx} cy={cy} r="9" className="qf-nucleo" />
    <circle cx={cx} cy={cy} r="36" className="qf-camada" />
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return <motion.circle key={`${ativo}-${i}`} r="5" className="qf-eletron" initial={{ cx: cx + 36 * Math.cos(a), cy: cy + 36 * Math.sin(a), opacity: 0 }}
        animate={{ cx: perde && i === 0 ? cx + 64 : cx + 36 * Math.cos(a), cy: perde && i === 0 ? cy - 60 : cy + 36 * Math.sin(a), opacity: 1 }}
        transition={{ ...t, delay: t.duration ? 0.05 * i : 0 }} />;
    })}
    {ganha && <motion.circle r="5" className="qf-eletron qf-eletron--novo" initial={{ cx: cx + 64, cy: cy - 60 }} animate={{ cx, cy: cy - 36 }} transition={{ ...t, delay: t.duration ? 0.4 : 0 }} />}
    {(perde || ganha) && <path d={perde ? `M${cx + 8} ${cy - 40}Q${cx + 30} ${cy - 64} ${cx + 56} ${cy - 60}` : `M${cx + 56} ${cy - 60}Q${cx + 30} ${cy - 64} ${cx + 8} ${cy - 42}`} className="qf-trilha" />}
    <text x={200} y={232} className="qf-texto qf-texto--forte">{acao}</text>
    <text x={200} y={254} className="qf-texto">{efeito}</text>
    <text x={200} y={276} className="qf-mini">{n} elétron{n > 1 ? 's' : ''} na camada de valência{ativo === 'Gases nobres' ? ' (hélio: 2)' : ''}</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Radioatividade: três feixes saem da mesma fonte e cada um para numa barreira
// diferente — papel, alumínio, chumbo ou concreto. O feixe escolhido corre até
// onde é barrado; é isso que "poder de penetração" quer dizer.
const FEIXES: Record<string, { y: number; ate: number; carga: string; barreira: string }> = {
  Alfa: { y: 110, ate: 186, carga: 'α · +2', barreira: 'papel' },
  Beta: { y: 160, ate: 290, carga: 'β · −1', barreira: 'alumínio' },
  Gama: { y: 210, ate: 404, carga: 'γ · sem carga', barreira: 'chumbo ou concreto' },
};

function onda(x0: number, x1: number, y: number) {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 4) pts.push(`${x} ${(y + 7 * Math.sin((x - x0) / 6)).toFixed(1)}`);
  return `M${pts.join('L')}`;
}

function Radioatividade({ ativo, t }: Cena) {
  return <g>
    <rect x="22" y="92" width="52" height="136" rx="6" className="qf-fonte" />
    <text x="48" y="248" textAnchor="middle" className="qf-rotulo">fonte</text>
    {[{ x: 186, w: 4, nome: 'papel' }, { x: 290, w: 10, nome: 'alumínio' }, { x: 404, w: 30, nome: 'chumbo ou concreto' }].map((b) => <g key={b.nome}>
      <rect x={b.x} y="78" width={b.w} height="164" className={`qf-barreira qf-barreira--${b.w}`} />
      <text x={b.x + b.w / 2} y={b.nome.includes(' ') ? 60 : 68} textAnchor="middle" className="qf-rotulo">{b.nome.includes(' ') ? 'chumbo ou' : b.nome}</text>
      {b.nome.includes(' ') && <text x={b.x + b.w / 2} y={74} textAnchor="middle" className="qf-rotulo">concreto</text>}
    </g>)}
    {Object.entries(FEIXES).map(([nome, f]) => {
      const ligado = nome === ativo;
      const d = nome === 'Gama' ? onda(76, f.ate, f.y) : `M76 ${f.y}H${f.ate}`;
      return <g key={nome}>
        <path d={d} className={`qf-feixe qf-feixe--${nome.toLowerCase()} qf-feixe--fundo`} />
        {ligado && <motion.path key={ativo} d={d} className={`qf-feixe qf-feixe--${nome.toLowerCase()}`} initial={{ pathLength: t.duration ? 0 : 1 }}
          animate={{ pathLength: 1 }} transition={t.duration ? { ...t, duration: 0.9 } : t} />}
        {ligado && <motion.circle key={`p${ativo}`} r={nome === 'Alfa' ? 8 : nome === 'Beta' ? 4 : 3} className="qf-particula" initial={{ cx: t.duration ? 80 : f.ate - 6, cy: f.y }} animate={{ cx: f.ate - 6, cy: f.y }}
          transition={t.duration ? { ...t, duration: 0.9 } : t} />}
        <text x="84" y={f.y - 12} className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{f.carga}</text>
      </g>;
    })}
    <text x="240" y="284" textAnchor="middle" className="qf-texto">{ativo} é barrada por {FEIXES[ativo].barreira}</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Estados físicos: o mesmo número de partículas em três recipientes. No sólido
// elas ficam em rede com as forças desenhadas; no líquido, juntas no fundo e
// tomando a forma do recipiente; no gás, espalhadas por todo o espaço.
const SOLIDO = Array.from({ length: 12 }, (_, i) => ({ x: 57 + (i % 4) * 22, y: 150 + Math.floor(i / 4) * 22 }));
const LIQUIDO = [[196, 214], [218, 216], [240, 213], [262, 216], [284, 214], [206, 194], [229, 196], [252, 193], [275, 197], [217, 175], [241, 177], [264, 176]].map(([x, y]) => ({ x, y }));
const GAS = [[352, 92], [410, 104], [372, 140], [428, 150], [346, 190], [398, 184], [430, 212], [360, 226], [420, 82], [388, 118], [432, 118], [376, 204]].map(([x, y]) => ({ x, y }));
const ESTADO_TEXTO: Record<string, [string, string]> = {
  Sólido: ['forma e volume', 'definidos'],
  Líquido: ['volume definido,', 'forma do recipiente'],
  Gasoso: ['sem forma nem', 'volume definidos'],
};

function EstadosFisicos({ ativo, t }: Cena) {
  const caixas = [{ nome: 'Sólido', x: 30, pts: SOLIDO }, { nome: 'Líquido', x: 180, pts: LIQUIDO }, { nome: 'Gasoso', x: 330, pts: GAS }];
  return <g>
    {caixas.map((c) => {
      const ligado = c.nome === ativo;
      return <motion.g key={c.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        <rect x={c.x} y="64" width="120" height="170" rx="8" className={ligado ? 'qf-recipiente qf-recipiente--ativo' : 'qf-recipiente'} />
        {c.nome === 'Sólido' && SOLIDO.map((p, i) => <g key={`l${i}`}>
          {i % 4 !== 3 && <line x1={p.x} y1={p.y} x2={p.x + 22} y2={p.y} className="qf-forca" />}
          {i < 8 && <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 22} className="qf-forca" />}
        </g>)}
        {c.pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="8" className="qf-molecula" />)}
        <text x={c.x + 60} y="256" textAnchor="middle" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{c.nome}</text>
        <text x={c.x + 60} y="274" textAnchor="middle" className="qf-mini">{ESTADO_TEXTO[c.nome][0]}</text>
        <text x={c.x + 60} y="288" textAnchor="middle" className="qf-mini">{ESTADO_TEXTO[c.nome][1]}</text>
      </motion.g>;
    })}
    <text x="240" y="40" textAnchor="middle" className="qf-mini">o mesmo número de partículas nos três recipientes</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Funções inorgânicas: quatro quadros, cada um com o que define a função pela
// citação — o único cátion (H⁺) do ácido, o único ânion (OH⁻) da base, a
// neutralização que forma o sal, o oxigênio mais eletronegativo do óxido. A⁻,
// M⁺ e E são símbolos genéricos, não compostos específicos.
function Ion({ x, y, texto, tipo }: { x: number; y: number; texto: string; tipo: 'cation' | 'anion' | 'neutro' }) {
  return <g><circle cx={x} cy={y} r="13" className={`qf-ion qf-ion--${tipo}`} /><text x={x} y={y + 4} textAnchor="middle" className="qf-ion-texto">{texto}</text></g>;
}

function FuncoesInorganicas({ ativo, t }: Cena) {
  const quadros: Array<{ nome: string; x: number; y: number; desenho: React.ReactNode; legenda: string }> = [
    { nome: 'Ácidos', x: 12, y: 10, legenda: 'em água, H⁺ é o único cátion', desenho: <>
      <path d="M40 40v62q0 10 10 10h110q10 0 10-10V40" className="qf-vidro" /><path d="M40 62h130" className="qf-agua" />
      <Ion x={70} y={84} texto="H⁺" tipo="cation" /><Ion x={105} y={96} texto="A⁻" tipo="anion" /><Ion x={140} y={80} texto="H⁺" tipo="cation" />
    </> },
    { nome: 'Bases', x: 246, y: 10, legenda: 'em água, OH⁻ é o único ânion', desenho: <>
      <path d="M274 40v62q0 10 10 10h110q10 0 10-10V40" className="qf-vidro" /><path d="M274 62h130" className="qf-agua" />
      <Ion x={302} y={96} texto="M⁺" tipo="cation" /><Ion x={340} y={82} texto="OH⁻" tipo="anion" /><Ion x={378} y={96} texto="OH⁻" tipo="anion" />
    </> },
    { nome: 'Sais', x: 12, y: 152, legenda: 'cátion ≠ H⁺ · ânion ≠ OH⁻', desenho: <>
      <text x="123" y="194" textAnchor="middle" className="qf-mini">ácido + base → sal + água</text>
      {[0, 1, 2, 3, 4, 5].map((i) => { const cat = ((i % 3) + Math.floor(i / 3)) % 2 === 0; return <Ion key={i} x={92 + (i % 3) * 30} y={216 + Math.floor(i / 3) * 28} texto={cat ? 'M⁺' : 'A⁻'} tipo={cat ? 'cation' : 'anion'} />; })}
    </> },
    { nome: 'Óxidos', x: 246, y: 152, legenda: 'binário; O é o mais eletronegativo', desenho: <>
      <line x1="318" y1="190" x2="358" y2="190" className="qf-ligacao" />
      <Ion x={306} y={190} texto="E" tipo="neutro" />
      <circle cx="372" cy="190" r="18" className="qf-ion qf-ion--o" /><text x="372" y="195" textAnchor="middle" className="qf-ion-texto">O</text>
      <path d="M346 176q12-10 20-4" className="qf-trilha" /><text x="392" y="170" className="qf-mini">δ−</text>
    </> },
  ];
  return <g>
    {quadros.map((q) => {
      const ligado = q.nome === ativo;
      return <motion.g key={q.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        <rect x={q.x} y={q.y} width="222" height="136" rx="10" className={ligado ? 'qf-quadro qf-quadro--ativo' : 'qf-quadro'} />
        <text x={q.x + 12} y={q.y + 20} className="qf-rotulo qf-rotulo--forte">{q.nome}</text>
        {q.desenho}
        <text x={q.x + 111} y={q.y + 126} textAnchor="middle" className="qf-mini">{q.legenda}</text>
      </motion.g>;
    })}
  </g>;
}

// ---------------------------------------------------------------------------
// Combustíveis fósseis: a mesma chaminé solta quatro produtos, e cada trilha
// termina no dano que a citação atribui a ele. A trilha do produto escolhido
// se desenha até o destino — o dano é consequência do que sai da queima.
const DESTINOS: Record<string, { y: number; dano: string }> = {
  CO2: { y: 48, dano: 'efeito estufa' },
  CO: { y: 116, dano: 'hemoglobina' },
  Fuligem: { y: 184, dano: 'carbono particulado' },
  'SO2/NOx': { y: 252, dano: 'chuva ácida' },
};
const FORMULA: Record<string, string> = { CO2: 'CO₂', CO: 'CO', Fuligem: 'fuligem', 'SO2/NOx': 'SO₂ / NOₓ' };

function Destino({ nome, y }: { nome: string; y: number }) {
  if (nome === 'CO2') return <g><circle cx="410" cy={y} r="22" className="qf-terra" /><path d={`M380 ${y - 26}q30-18 60 0`} className="qf-calor" /><path d={`M382 ${y + 26}q28 14 56 0`} className="qf-calor" /></g>;
  if (nome === 'CO') return <g><ellipse cx="410" cy={y} rx="24" ry="15" className="qf-hemacia" /><ellipse cx="410" cy={y} rx="11" ry="6" className="qf-hemacia-centro" /></g>;
  if (nome === 'Fuligem') return <g>{[[396, -8], [410, 4], [424, -6], [402, 10], [420, 12], [412, -14]].map(([x, dy], i) => <circle key={i} cx={x} cy={y + dy} r={4 + (i % 3)} className="qf-fuligem" />)}</g>;
  return <g><path d={`M386 ${y - 6}a12 12 0 0 1 16-14a16 16 0 0 1 28 6a10 10 0 0 1 0 18h-40a10 10 0 0 1-4-10Z`} className="qf-nuvem" />{[392, 406, 420].map((x) => <path key={x} d={`M${x} ${y + 12}l-3 9`} className="qf-gota" />)}</g>;
}

function CombustiveisFosseis({ ativo, t }: Cena) {
  return <g>
    <path d="M40 286V190h34v96" className="qf-chamine" /><path d="M32 190h50" className="qf-chamine" />
    <text x="84" y="244" className="qf-rotulo">queima</text>
    {Object.entries(DESTINOS).map(([nome, d]) => {
      const ligado = nome === ativo;
      const caminho = `M60 172C120 ${150 - (152 - d.y) * 0.2} 250 ${d.y} 376 ${d.y}`;
      return <g key={nome}>
        <path d={caminho} className="qf-rastro" />
        {/* Classe própria, sem opacidade nem tracejado no CSS: o motion anima
            esses dois como atributo SVG, e a regra de classe vencia — as
            quatro trilhas apareciam acesas ao mesmo tempo. */}
        <motion.path d={caminho} className="qf-rastro-ativo" initial={false} animate={{ pathLength: ligado ? 1 : 0, opacity: ligado ? 1 : 0 }} transition={t.duration ? { ...t, duration: 0.8 } : t} />
        <motion.g initial={false} animate={FOCO(ligado)} transition={t}>
          <Destino nome={nome} y={d.y} />
          <text x="440" y={d.y + (nome === 'CO2' ? 44 : 34)} textAnchor="end" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{d.dano}</text>
        </motion.g>
        <text x="332" y={d.y - 15} textAnchor="middle" className={ligado ? 'qf-formula qf-formula--ativa' : 'qf-formula'}>{FORMULA[nome]}</text>
      </g>;
    })}
  </g>;
}

// ---------------------------------------------------------------------------
// Efeitos coligativos: solvente puro contra solução em cada quadro. Sem
// números — a citação dá o sentido de cada efeito, não o valor.
function Termometro({ x, y0, marca, rotulo, solucao }: { x: number; y0: number; marca: number; rotulo: string; solucao: boolean }) {
  return <g>
    <rect x={x - 6} y={y0} width="12" height="62" rx="6" className="qf-termometro" />
    <circle cx={x} cy={y0 + 68} r="8" className={solucao ? 'qf-bulbo qf-bulbo--solucao' : 'qf-bulbo'} />
    <line x1={x - 12} y1={y0 + marca} x2={x + 12} y2={y0 + marca} className="qf-marca" />
    <text x={x + 13} y={y0 + 72} className="qf-mini">{rotulo}</text>
  </g>;
}

function EfeitosColigativos({ ativo, t }: Cena) {
  const quadros: Array<{ nome: string; x: number; y: number; desenho: React.ReactNode; legenda: string }> = [
    { nome: 'Tonoscopia', x: 12, y: 10, legenda: 'pressão de vapor menor na solução', desenho: <>
      {[{ x: 70, puro: true }, { x: 160, puro: false }].map((f) => <g key={f.x}>
        <path d={`M${f.x - 26} 60v38q0 8 8 8h36q8 0 8-8V60`} className="qf-vidro" /><path d={`M${f.x - 26} 80h52`} className="qf-agua" />
        {Array.from({ length: f.puro ? 5 : 2 }, (_, i) => <circle key={i} cx={f.x - 16 + i * 8} cy={52 - (i % 2) * 7} r="3" className="qf-vapor" />)}
        {!f.puro && [0, 1].map((i) => <circle key={`s${i}`} cx={f.x - 10 + i * 18} cy={94} r="4" className="qf-soluto" />)}
        <text x={f.x} y="122" textAnchor="middle" className="qf-mini">{f.puro ? 'puro' : 'solução'}</text>
      </g>)}
    </> },
    { nome: 'Ebulioscopia', x: 246, y: 10, legenda: 'ponto de ebulição mais alto', desenho: <>
      <Termometro x={300} y0={38} marca={30} rotulo="puro" solucao={false} /><Termometro x={384} y0={38} marca={18} rotulo="solução" solucao />
      <text x="342" y="66" textAnchor="middle" className="qf-rotulo qf-rotulo--forte">↑</text>
    </> },
    { nome: 'Crioscopia', x: 12, y: 152, legenda: 'ponto de congelamento mais baixo', desenho: <>
      <Termometro x={66} y0={180} marca={30} rotulo="puro" solucao={false} /><Termometro x={150} y0={180} marca={42} rotulo="solução" solucao />
      <text x="108" y="226" textAnchor="middle" className="qf-rotulo qf-rotulo--forte">↓</text>
    </> },
    { nome: 'Osmometria', x: 246, y: 152, legenda: 'pressão aplicada barra o solvente', desenho: <>
      <path d="M290 186v56q0 14 14 14h72q14 0 14-14v-56" className="qf-vidro" /><line x1="340" y1="212" x2="340" y2="270" className="qf-membrana" />
      <path d="M290 216h50M340 216h50" className="qf-agua" />
      {[0, 1, 2].map((i) => <circle key={i} cx={356 + i * 12} cy={236} r="4" className="qf-soluto" />)}
      <rect x="342" y="196" width="46" height="8" className="qf-embolo" /><path d="M365 172v20" className="qf-seta-forca" markerEnd="url(#qf-ponta)" />
      <path d="M304 236h26" className="qf-seta-bloqueada" markerEnd="url(#qf-ponta-azul)" /><path d="M335 230l10 12M345 230l-10 12" className="qf-bloqueio" /><text x="334" y="208" textAnchor="end" className="qf-mini">solvente</text>
    </> },
  ];
  return <g>
    <defs><marker id="qf-ponta" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta" /></marker><marker id="qf-ponta-azul" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta-azul" /></marker></defs>
    {quadros.map((q) => {
      const ligado = q.nome === ativo;
      return <motion.g key={q.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        <rect x={q.x} y={q.y} width="222" height="136" rx="10" className={ligado ? 'qf-quadro qf-quadro--ativo' : 'qf-quadro'} />
        <text x={q.x + 12} y={q.y + 20} className="qf-rotulo qf-rotulo--forte">{q.nome}</text>
        {q.desenho}
        <text x={q.x + 111} y={q.y + 128} textAnchor="middle" className="qf-mini">{q.legenda}</text>
      </motion.g>;
    })}
  </g>;
}

// ---------------------------------------------------------------------------
// Interações intermoleculares: três pares de moléculas com a interação
// desenhada, na ordem que a citação dá. Nenhum valor de ponto de ebulição —
// a citação dá a ordem, não o número —, então as colunas são só posição.
const INTERACOES: Record<string, { x: number; nivel: number; forca: string }> = {
  'Forças de London': { x: 80, nivel: 1, forca: 'mais fracas' },
  'Dipolo-dipolo': { x: 240, nivel: 2, forca: 'intermediárias' },
  'Ligações de hidrogênio': { x: 400, nivel: 3, forca: 'mais fortes' },
};

function Interacoes({ ativo, t }: Cena) {
  return <g>
    {Object.entries(INTERACOES).map(([nome, it]) => {
      const ligado = nome === ativo;
      const { x } = it;
      return <motion.g key={nome} initial={false} animate={FOCO(ligado)} transition={t}>
        {nome === 'Forças de London' && <>
          <ellipse cx={x - 30} cy="96" rx="24" ry="15" className="qf-molecula-apolar" /><ellipse cx={x + 30} cy="96" rx="24" ry="15" className="qf-molecula-apolar" />
          <text x={x - 44} y="100" className="qf-mini">δ−</text><text x={x - 20} y="100" className="qf-mini">δ+</text>
          <text x={x + 16} y="100" className="qf-mini">δ−</text><text x={x + 40} y="100" className="qf-mini">δ+</text>
          <line x1={x - 4} y1="96" x2={x + 4} y2="96" className="qf-interacao qf-interacao--1" />
          <text x={x} y="130" textAnchor="middle" className="qf-mini">dipolos momentâneos</text>
        </>}
        {nome === 'Dipolo-dipolo' && <>
          {[-32, 32].map((d) => <g key={d}><rect x={x + d - 22} y="84" width="44" height="24" rx="12" className="qf-molecula-polar" />
            <text x={x + d - 12} y="100" textAnchor="middle" className="qf-rotulo">δ+</text><text x={x + d + 12} y="100" textAnchor="middle" className="qf-rotulo">δ−</text></g>)}
          <line x1={x - 8} y1="96" x2={x + 8} y2="96" className="qf-interacao qf-interacao--2" />
          <text x={x} y="130" textAnchor="middle" className="qf-mini">dipolos permanentes</text>
        </>}
        {nome === 'Ligações de hidrogênio' && <>
          <circle cx={x - 38} cy="96" r="13" className="qf-ion qf-ion--o" /><text x={x - 38} y="100" textAnchor="middle" className="qf-ion-texto">X</text>
          <line x1={x - 25} y1="96" x2={x - 13} y2="96" className="qf-ligacao" />
          <circle cx={x - 7} cy="96" r="7" className="qf-ion qf-ion--neutro" /><text x={x - 7} y="99" textAnchor="middle" className="qf-ion-texto">H</text>
          <line x1={x + 1} y1="96" x2={x + 22} y2="96" className="qf-interacao qf-interacao--3" />
          <circle cx={x + 36} cy="96" r="13" className="qf-ion qf-ion--o" /><text x={x + 36} y="100" textAnchor="middle" className="qf-ion-texto">X</text>
          <text x={x} y="130" textAnchor="middle" className="qf-mini">H entre dois átomos δ−</text>
        </>}
        <rect x={x - 14} y={250 - it.nivel * 20} width="28" height={it.nivel * 20} rx="3" className={ligado ? 'qf-coluna qf-coluna--ativa' : 'qf-coluna'} />
        <text x={x} y="170" textAnchor="middle" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{nome}</text>
        <text x={x} y="270" textAnchor="middle" className="qf-mini">{it.forca}</text>
      </motion.g>;
    })}
    <line x1="30" y1="250" x2="450" y2="250" className="qf-eixo" />
    <text x="240" y="292" textAnchor="middle" className="qf-mini">ponto de ebulição, em ordem (sem escala)</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Cinética: a velocidade em função da concentração para as três ordens, com
// as marcas do que a citação diz — dobrar a concentração mantém, dobra ou
// quadruplica a velocidade.
const ORDENS: Record<string, { n: number; fator: string }> = { 'Ordem zero': { n: 0, fator: '× 1' }, 'Ordem um': { n: 1, fator: '× 2' }, 'Ordem dois': { n: 2, fator: '× 4' } };

function Cinetica({ ativo, t }: Cena) {
  const px = (c: number) => 70 + c * 160;
  const py = (v: number) => 250 - v * 50;
  const curva = (n: number) => Array.from({ length: 41 }, (_, i) => { const c = (i / 40) * 2; return `${i ? 'L' : 'M'}${px(c).toFixed(1)} ${py(c ** n).toFixed(1)}`; }).join('');
  const { n, fator } = ORDENS[ativo];
  return <g>
    <line x1="70" y1="250" x2="400" y2="250" className="qf-eixo" /><line x1="70" y1="250" x2="70" y2="36" className="qf-eixo" />
    <text x="406" y="254" className="qf-rotulo">[reagente]</text>
    <text x="62" y="44" textAnchor="end" className="qf-rotulo">v</text>
    {[1, 2].map((c) => <g key={c}><line x1={px(c)} y1="246" x2={px(c)} y2="254" className="qf-eixo" /><text x={px(c)} y="270" textAnchor="middle" className="qf-mini">{c === 1 ? 'c' : '2c'}</text></g>)}
    {Object.entries(ORDENS).map(([nome, o]) => <motion.path key={nome} d={curva(o.n)} className={nome === ativo ? 'qf-curva qf-curva--ativa' : 'qf-curva'} initial={false} animate={{ opacity: nome === ativo ? 1 : 0.25 }} transition={t} />)}
    <motion.circle r="6" className="qf-ponto" initial={false} animate={{ cx: px(1), cy: py(1) }} transition={t} />
    <motion.circle r="6" className="qf-ponto" initial={false} animate={{ cx: px(2), cy: py(2 ** n) }} transition={t} />
    <motion.path className="qf-trilha" initial={false} animate={{ d: `M${px(1)} ${py(1)}L${px(2)} ${py(1)}L${px(2)} ${py(2 ** n)}` }} transition={t} />
    <text x={px(2) + 12} y={py((1 + 2 ** n) / 2) + 4} className="qf-texto qf-texto--forte">{fator}</text>
    <text x="240" y="292" textAnchor="middle" className="qf-mini">dobrar a concentração: a velocidade fica {n === 0 ? 'igual' : n === 1 ? 'o dobro' : 'quatro vezes maior'}</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Polaridade: as duas condições juntas. Sem ligação polar não há dipolo; com
// ligações polares, a geometria decide se os dipolos se somam ou se cancelam.
// Átomos genéricos (A, X, Y): a citação trata do critério, não de uma molécula.
function Dipolo({ x1, y1, x2, y2, forte }: { x1: number; y1: number; x2: number; y2: number; forte: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={forte ? 'qf-dipolo qf-dipolo--forte' : 'qf-dipolo'} markerEnd="url(#qf-ponta-dipolo)" />;
}

function Polaridade({ ativo }: Cena) {
  const ligacoes = ativo === 'Ligações polares';
  const geometria = ativo === 'Geometria molecular';
  return <g>
    <defs><marker id="qf-ponta-dipolo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta-azul" /></marker></defs>
    {/* 1 — sem ligação polar */}
    <g>
      <line x1="58" y1="110" x2="102" y2="110" className="qf-ligacao" />
      <circle cx="50" cy="110" r="14" className="qf-ion qf-ion--neutro" /><text x="50" y="114" textAnchor="middle" className="qf-ion-texto">A</text>
      <circle cx="110" cy="110" r="14" className="qf-ion qf-ion--neutro" /><text x="110" y="114" textAnchor="middle" className="qf-ion-texto">A</text>
      <text x="80" y="160" textAnchor="middle" className={ligacoes ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>ligação apolar</text>
      <text x="80" y="176" textAnchor="middle" className="qf-mini">sem dipolo</text>
    </g>
    {/* 2 — polares, geometria linear: cancelam */}
    <g>
      <line x1="186" y1="110" x2="294" y2="110" className="qf-ligacao" />
      <circle cx="180" cy="110" r="13" className="qf-ion qf-ion--o" /><text x="180" y="114" textAnchor="middle" className="qf-ion-texto">X</text>
      <circle cx="240" cy="110" r="13" className="qf-ion qf-ion--neutro" /><text x="240" y="114" textAnchor="middle" className="qf-ion-texto">Y</text>
      <circle cx="300" cy="110" r="13" className="qf-ion qf-ion--o" /><text x="300" y="114" textAnchor="middle" className="qf-ion-texto">X</text>
      <Dipolo x1={228} y1={88} x2={196} y2={88} forte={ligacoes} /><Dipolo x1={252} y1={88} x2={284} y2={88} forte={ligacoes} />
      <text x="240" y="150" textAnchor="middle" className={geometria ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>linear: os dipolos se cancelam</text>
      <text x="240" y="166" textAnchor="middle" className="qf-mini">apolar, com ligações polares</text>
    </g>
    {/* 3 — polares, geometria angular: somam */}
    <g>
      <line x1="388" y1="100" x2="358" y2="136" className="qf-ligacao" /><line x1="388" y1="100" x2="418" y2="136" className="qf-ligacao" />
      <circle cx="388" cy="96" r="13" className="qf-ion qf-ion--o" /><text x="388" y="100" textAnchor="middle" className="qf-ion-texto">X</text>
      <circle cx="354" cy="140" r="10" className="qf-ion qf-ion--neutro" /><text x="354" y="143" textAnchor="middle" className="qf-ion-texto">Y</text>
      <circle cx="422" cy="140" r="10" className="qf-ion qf-ion--neutro" /><text x="422" y="143" textAnchor="middle" className="qf-ion-texto">Y</text>
      <Dipolo x1={344} y1={124} x2={364} y2={100} forte={ligacoes} /><Dipolo x1={432} y1={124} x2={412} y2={100} forte={ligacoes} />
      {geometria && <line x1="388" y1="176" x2="388" y2="118" className="qf-dipolo qf-dipolo--resultante" markerEnd="url(#qf-ponta-dipolo)" />}
      <text x="388" y="200" textAnchor="middle" className={geometria ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>angular: os dipolos se somam</text>
      <text x="388" y="216" textAnchor="middle" className="qf-mini">polar</text>
    </g>
    <text x="240" y="264" textAnchor="middle" className="qf-texto">polar = ligação polar E dipolos que não se cancelam</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Química ambiental: o mesmo lago em três etapas. A luz é barrada pelas algas,
// o oxigênio dissolvido some com a decomposição, e os peixes morrem sem que
// nada tóxico tenha sido desenhado.
const ETAPA: Record<string, number> = { 'Excesso de nutrientes': 0, 'Decomposição bacteriana': 1, 'Mortandade por asfixia': 2 };

function Peixe({ x, y, morto }: { x: number; y: number; morto: boolean }) {
  return <g transform={`translate(${x} ${y}) ${morto ? 'rotate(180)' : ''}`}><path d="M-14 0q14-12 28 0q-14 12-28 0ZM14 0l10-7v14Z" className={morto ? 'qf-peixe qf-peixe--morto' : 'qf-peixe'} /><circle cx="-7" cy="-2" r="1.6" className="qf-olho" /></g>;
}

function QuimicaAmbiental({ ativo, t }: Cena) {
  const e = ETAPA[ativo];
  const oxigenio = e === 0 ? 8 : e === 1 ? 3 : 0;
  return <g>
    <path d="M20 90H460V270H20Z" className="qf-lago" />
    <circle cx="410" cy="34" r="16" className="qf-sol" />
    {[360, 395, 430].map((x) => <line key={x} x1={x + 10} y1="52" x2={x - 10} y2="84" className="qf-raio" />)}
    <path d="M20 90q30-10 60 0t60 0t60 0t60 0t60 0t60 0t60 0" className="qf-algas" />
    <text x="30" y="80" className="qf-rotulo qf-rotulo--forte">algas e cianobactérias: a luz não entra</text>
    {Array.from({ length: 8 }, (_, i) => <motion.circle key={i} cx={60 + i * 48} cy={130 + (i % 3) * 22} r="5" className="qf-bolha" initial={false} animate={{ opacity: i < oxigenio ? 1 : 0.08 }} transition={t} />)}
    <text x="440" y="120" textAnchor="end" className="qf-mini">O₂ dissolvido: {oxigenio === 8 ? 'suficiente' : oxigenio ? 'caindo' : 'insuficiente'}</text>
    <motion.g initial={false} animate={{ opacity: e >= 1 ? 1 : 0.2 }} transition={t}>
      {[80, 150, 230, 310, 380].map((x) => <g key={x}><path d={`M${x - 16} 262q16-14 32 0`} className="qf-materia" /><circle cx={x} cy="252" r="3" className="qf-bacteria" /><circle cx={x + 8} cy="256" r="3" className="qf-bacteria" /></g>)}
      <text x="240" y="244" textAnchor="middle" className="qf-mini">bactérias decompõem a matéria morta e consomem o O₂</text>
    </motion.g>
    <Peixe x={150} y={e === 2 ? 104 : 186} morto={e === 2} />
    <Peixe x={260} y={e === 2 ? 106 : 206} morto={e === 2} />
    {e === 2 && <text x="240" y="160" textAnchor="middle" className="qf-texto qf-texto--forte">asfixia, sem substância tóxica</text>}
  </g>;
}

export const QUIMICA_FENOMENO_CENAS: Record<string, CenaFenomeno> = {
  'summary-quimica-organizacao-da-tabela-periodica-dos-elementos': { cena: TabelaPeriodica, rotulos: Object.keys(COLUNA), titulo: 'famílias da tabela' },
  'summary-quimica-radioatividade-o-estudo-das-radiacoes': { cena: Radioatividade, rotulos: Object.keys(FEIXES), titulo: 'poder de penetração' },
  'summary-quimica-composicao-da-materia-estados-fisicos': { cena: EstadosFisicos, rotulos: Object.keys(ESTADO_TEXTO), titulo: 'partículas e forças' },
  'summary-quimica-quimica-inorganica': { cena: FuncoesInorganicas, rotulos: ['Ácidos', 'Bases', 'Sais', 'Óxidos'], titulo: 'o que define cada função' },
  'summary-quimica-combustiveis-fosseis': { cena: CombustiveisFosseis, rotulos: Object.keys(DESTINOS), titulo: 'produtos da queima' },
  'summary-quimica-efeitos-coligativos': { cena: EfeitosColigativos, rotulos: ['Tonoscopia', 'Ebulioscopia', 'Crioscopia', 'Osmometria'], titulo: 'solvente puro × solução' },
  'summary-quimica-interacoes-intermoleculares': { cena: Interacoes, rotulos: Object.keys(INTERACOES), titulo: 'forças entre moléculas' },
  'summary-quimica-cinetica-quimica': { cena: Cinetica, rotulos: Object.keys(ORDENS), titulo: 'ordem de reação' },
  'summary-quimica-polaridade-das-ligacoes-e-das-moleculas': { cena: Polaridade, rotulos: ['Ligações polares', 'Geometria molecular'], titulo: 'dipolos e geometria' },
  'summary-quimica-quimica-ambiental': { cena: QuimicaAmbiental, rotulos: Object.keys(ETAPA), titulo: 'eutrofização' },
};

export const QUIMICA_FENOMENO_IDS = new Set(Object.keys(QUIMICA_FENOMENO_CENAS));

export function QuimicaFenomenos({ entry }: { entry: SceneEntry }) {
  const t = useSceneMotion();
  return <>{entry.chapterId === 'summary-quimica-polaridade-das-ligacoes-e-das-moleculas' && <MolecularObjectView />}<FenomenoFrame entry={entry} cenas={QUIMICA_FENOMENO_CENAS} t={t} /></>;
}
