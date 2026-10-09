import React from 'react';
import { BiologicalVolume } from './BiologicalVolume';
import { motion } from 'motion/react';
import type { SceneEntry } from '../types';
import { useSceneMotion } from '../useSceneMotion';
import { FenomenoFrame, FOCO, type Cena, type CenaFenomeno } from './FenomenoFrame';
import './BiologiaFenomenos.css';

// Capítulos de Biologia que caíam nas famílias genéricas — `tipologia`
// (cartões de texto), `cadeia-de-derivacao` (caixas empilhadas), `escala-de-graus`
// (degraus) e `contraste-de-posicoes` (colunas vazias). Nenhuma delas desenhava
// célula, vírus, embrião ou planta (auditoria 39). Os itens e as citações
// literais continuam os mesmos; a cena é escolhida pelo rótulo e só desenha o
// que a citação sustenta.

type Quadro = { nome: string; x: number; y: number; w: number; h: number; desenho: React.ReactNode; legenda?: string };

/** Quebra por palavra em linhas de até `max` caracteres. O SVG não quebra
 * texto sozinho, e a varredura achou rótulo de etapa e legenda de quadro
 * invadindo o vizinho ou saindo do quadro em todos os casos. */
function linhas(texto: string, max: number) {
  return texto.split(' ').reduce<string[]>((acc, palavra) => {
    const ultima = acc[acc.length - 1];
    if (ultima !== undefined && `${ultima} ${palavra}`.length <= max) acc[acc.length - 1] = `${ultima} ${palavra}`;
    else acc.push(palavra);
    return acc;
  }, []);
}

/** Quadros lado a lado; o do caso escolhido acende, os outros apagam. */
function Quadros({ ativo, t, quadros }: { ativo: string; t: Cena['t']; quadros: Quadro[] }) {
  return <g>
    {quadros.map((q) => {
      const ligado = q.nome === ativo;
      return <motion.g key={q.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        <rect x={q.x} y={q.y} width={q.w} height={q.h} rx="10" className={ligado ? 'qf-quadro qf-quadro--ativo' : 'qf-quadro'} />
        <text x={q.x + 10} y={q.y + 18} className="qf-rotulo qf-rotulo--forte">{q.nome}</text>
        {q.desenho}
        {q.legenda && linhas(q.legenda, Math.floor(q.w / 6)).reverse().map((l, k) => <text key={k} x={q.x + q.w / 2} y={q.y + q.h - 10 - k * 13} textAnchor="middle" className="qf-mini">{l}</text>).reverse()}
      </motion.g>;
    })}
  </g>;
}

const hexagono = (cx: number, cy: number, r = 11) => Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i + Math.PI / 6;
  return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
}).join(' ');
const Anel = ({ x, y }: { x: number; y: number }) => <polygon points={hexagono(x, y)} className="bf-anel" />;

// ---------------------------------------------------------------------------
// Carboidratos e lipídios: os três primeiros quadros distinguem tamanho e
// função dos glicídios; o último contrapõe a reserva apolar à cabeça anfipática
// que permite ao fosfolipídio organizar a membrana.
function Carboidratos({ ativo, t }: Cena) {
  return <Quadros ativo={ativo} t={t} quadros={[
    { nome: 'Monossacarídeos', x: 12, y: 10, w: 222, h: 136, legenda: 'glicose, frutose, galactose', desenho: <>
      <Anel x={123} y={76} /><text x={123} y={108} textAnchor="middle" className="qf-mini">não sofre hidrólise</text>
    </> },
    { nome: 'Dissacarídeos', x: 246, y: 10, w: 222, h: 136, legenda: 'sacarose, lactose, maltose', desenho: <>
      <Anel x={322} y={76} /><line x1={333} y1={76} x2={355} y2={76} className="bf-ligacao" /><Anel x={366} y={76} />
      <text x={344} y={104} textAnchor="middle" className="qf-mini">ligação glicosídica</text>
      <text x={412} y={80} className="qf-rotulo">+ H₂O</text>
    </> },
    { nome: 'Polissacarídeos de reserva', x: 12, y: 154, w: 222, h: 136, legenda: 'amido (plantas) · glicogênio (animais)', desenho: <>
      {[0, 1, 2, 3, 4, 5].map((i) => <Anel key={i} x={40 + i * 26} y={214} />)}
      {[0, 1, 2, 3, 4].map((i) => <line key={`l${i}`} x1={51 + i * 26} y1={214} x2={55 + i * 26} y2={214} className="bf-ligacao" />)}
      {[0, 1].map((i) => <Anel key={`r${i}`} x={92 + i * 26} y={246} />)}<line x1={92} y1={225} x2={92} y2={235} className="bf-ligacao" />
      <text x={140} y={250} className="qf-mini">ligação α</text>
    </> },
    { nome: 'Lipídios: reserva e membrana', x: 246, y: 154, w: 222, h: 136, desenho: <>
      <circle cx="302" cy="202" r="12" className="bf-anel" />
      {[0, 1].map((i) => <path key={i} d={`M${296 + i * 12} 214v28`} className="bf-ligacao" />)}
      <text x="302" y="256" textAnchor="middle" className="qf-mini">fosfolipídio</text>
      <text x="302" y="269" textAnchor="middle" className="qf-mini">cabeça polar</text>
      <text x="302" y="282" textAnchor="middle" className="qf-mini">2 caudas apolares</text>
      <path d="M382 196v46m0-36 42-18m-42 28 42-4m-42 19 42 11" fill="none" className="bf-ligacao" />
      <text x="408" y="256" textAnchor="middle" className="qf-mini">triglicerídeo</text>
      <text x="408" y="269" textAnchor="middle" className="qf-mini">glicerol + 3</text>
      <text x="408" y="282" textAnchor="middle" className="qf-mini">ácidos graxos</text>
    </> },
  ]} />;
}

// ---------------------------------------------------------------------------
// Herança e sexo: o par XY, o par XX e um par de autossomos em cada sexo. A
// faixa marca onde está o gene de cada tipo de herança.
function Cromossomo({ x, y, h, rotulo, marca }: { x: number; y: number; h: number; rotulo: string; marca?: number }) {
  return <g>
    <rect x={x - 8} y={y} width="16" height={h} rx="8" className="bf-cromossomo" />
    {marca !== undefined && <rect x={x - 8} y={y + marca} width="16" height="10" className="bf-gene" />}
    <text x={x} y={y + h + 16} textAnchor="middle" className="qf-rotulo">{rotulo}</text>
  </g>;
}

const HERANCA: Record<string, { onde: 'x' | 'y' | 'auto'; texto: [string, string] }> = {
  'Ligada ao sexo (ao X)': { onde: 'x', texto: ['gene no X: o homem tem um só X,', 'então o recessivo aparece mais nele'] },
  'Restrita ao sexo (holândrica)': { onde: 'y', texto: ['gene na parte exclusiva do Y:', 'passa do pai a todos os filhos homens'] },
  'Influenciada pelo sexo': { onde: 'auto', texto: ['gene autossômico nos dois sexos:', 'a dominância se inverte (calvície)'] },
  'Limitada pelo sexo': { onde: 'auto', texto: ['gene autossômico nos dois sexos:', 'só se expressa num deles (leite)'] },
};

function HerancaSexual({ ativo }: Cena) {
  const { onde, texto } = HERANCA[ativo];
  const limitada = ativo === 'Limitada pelo sexo';
  return <g>
    <text x={130} y={30} textAnchor="middle" className="qf-texto qf-texto--forte">♂</text>
    <text x={350} y={30} textAnchor="middle" className="qf-texto qf-texto--forte">♀</text>
    <Cromossomo x={90} y={50} h={110} rotulo="X" marca={onde === 'x' ? 40 : undefined} />
    <Cromossomo x={130} y={50} h={60} rotulo="Y" marca={onde === 'y' ? 26 : undefined} />
    <Cromossomo x={175} y={60} h={90} rotulo="A" marca={onde === 'auto' ? 30 : undefined} />
    <Cromossomo x={197} y={60} h={90} rotulo="A" marca={onde === 'auto' ? 30 : undefined} />
    <Cromossomo x={300} y={50} h={110} rotulo="X" marca={onde === 'x' ? 40 : undefined} />
    <Cromossomo x={340} y={50} h={110} rotulo="X" marca={onde === 'x' ? 40 : undefined} />
    <Cromossomo x={385} y={60} h={90} rotulo="A" marca={onde === 'auto' ? 30 : undefined} />
    <Cromossomo x={407} y={60} h={90} rotulo="A" marca={onde === 'auto' ? 30 : undefined} />
    {onde === 'y' && <text x={130} y={210} textAnchor="middle" className="qf-mini">pai → filhos ♂</text>}
    {limitada && <><text x={186} y={188} textAnchor="middle" className="qf-mini">não se expressa</text><text x={396} y={188} textAnchor="middle" className="qf-rotulo qf-rotulo--forte">expressa</text></>}
    <text x={240} y={252} textAnchor="middle" className="qf-texto">{texto[0]}</text>
    <text x={240} y={272} textAnchor="middle" className="qf-texto">{texto[1]}</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Fatores evolutivos: uma população de pontos em cada quadro, e o que cada
// fator faz com ela.
const Pop = ({ cx, cy, cores, r = 36 }: { cx: number; cy: number; cores: string[]; r?: number }) => <g>
  <circle cx={cx} cy={cy} r={r} className="bf-populacao" />
  {cores.map((c, i) => { const a = (i / cores.length) * Math.PI * 2; return <circle key={i} cx={cx + (r - 13) * Math.cos(a)} cy={cy + (r - 13) * Math.sin(a)} r="5" className={`bf-alelo bf-alelo--${c}`} />; })}
</g>;

function Evolucao({ ativo, t }: Cena) {
  const w = 150;
  const q = (i: number) => ({ x: 12 + (i % 3) * (w + 6), y: 10 + Math.floor(i / 3) * 144 });
  const centro = (i: number) => ({ cx: q(i).x + w / 2, cy: q(i).y + 72 });
  const c = (i: number) => centro(i);
  return <Quadros ativo={ativo} t={t} quadros={[
    { nome: 'Mutação', ...q(0), w, h: 136, legenda: 'alelo novo, ao acaso', desenho: <Pop {...c(0)} cores={['a', 'a', 'b', 'a', 'b', 'a', 'n', 'b']} /> },
    { nome: 'Recombinação', ...q(1), w, h: 136, legenda: 'rearranja o existente', desenho: <>
      <rect x={c(1).cx - 34} y={c(1).cy - 20} width="68" height="12" rx="6" className="bf-segmento bf-segmento--a" />
      <rect x={c(1).cx - 34} y={c(1).cy + 8} width="68" height="12" rx="6" className="bf-segmento bf-segmento--b" />
      <rect x={c(1).cx} y={c(1).cy - 20} width="34" height="12" rx="6" className="bf-segmento bf-segmento--b" />
      <rect x={c(1).cx} y={c(1).cy + 8} width="34" height="12" rx="6" className="bf-segmento bf-segmento--a" />
      <path d={`M${c(1).cx - 4} ${c(1).cy - 6}l8 12M${c(1).cx + 4} ${c(1).cy - 6}l-8 12`} className="qf-trilha" />
    </> },
    { nome: 'Seleção natural', ...q(2), w, h: 136, legenda: 'gera adaptação', desenho: <>
      <Pop {...c(2)} cores={['a', 'x', 'a', 'x', 'a', 'x', 'a', 'x']} />
    </> },
    { nome: 'Deriva genética', ...q(3), w, h: 136, legenda: 'acaso, pop. pequena', desenho: <>
      <Pop cx={c(3).cx - 26} cy={c(3).cy} r={30} cores={['a', 'b', 'a', 'b', 'a', 'b']} />
      <path d={`M${c(3).cx + 6} ${c(3).cy}h14`} className="qf-trilha" />
      <Pop cx={c(3).cx + 40} cy={c(3).cy} r={20} cores={['b', 'b', 'a']} />
    </> },
    { nome: 'Migração', ...q(4), w, h: 136, legenda: 'fluxo gênico', desenho: <>
      <Pop cx={c(4).cx - 34} cy={c(4).cy} r={26} cores={['a', 'a', 'a', 'a', 'b']} />
      <Pop cx={c(4).cx + 34} cy={c(4).cy} r={26} cores={['b', 'b', 'b', 'b', 'a']} />
      <path d={`M${c(4).cx - 8} ${c(4).cy - 16}h16M${c(4).cx + 8} ${c(4).cy + 16}h-16`} className="bf-seta" />
    </> },
    { nome: 'Isolamento reprodutivo', ...q(5), w, h: 136, legenda: 'acumulam diferenças', desenho: <>
      <Pop cx={c(5).cx - 30} cy={c(5).cy} r={26} cores={['a', 'a', 'a', 'a', 'a']} />
      <line x1={c(5).cx} y1={c(5).cy - 36} x2={c(5).cx} y2={c(5).cy + 36} className="bf-barreira" />
      <Pop cx={c(5).cx + 30} cy={c(5).cy} r={26} cores={['b', 'b', 'b', 'b', 'b']} />
    </> },
  ]} />;
}

// ---------------------------------------------------------------------------
// Biomas: a paisagem de cada um, com os números que a citação dá.
const Arvore = ({ x, y, r = 12, cls = 'bf-copa' }: { x: number; y: number; r?: number; cls?: string }) => <g><line x1={x} y1={y} x2={x} y2={y + r + 10} className="bf-tronco" /><circle cx={x} cy={y} r={r} className={cls} /></g>;

function Biomas({ ativo, t }: Cena) {
  const w = 150;
  const q = (i: number) => ({ x: 12 + (i % 3) * (w + 6), y: 10 + Math.floor(i / 3) * 144 });
  const b = (i: number) => q(i).y + 100;
  return <Quadros ativo={ativo} t={t} quadros={[
    { nome: 'Amazônia', ...q(0), w, h: 136, legenda: 'floresta densa · ~49%', desenho: <>
      {[0, 1, 2, 3, 4].map((i) => <Arvore key={i} x={q(0).x + 24 + i * 25} y={b(0) - 44 + (i % 2) * 6} r={15} />)}
    </> },
    { nome: 'Cerrado', ...q(1), w, h: 136, legenda: 'árvores tortuosas · ~24%', desenho: <>
      {[0, 1].map((i) => <g key={i}><path d={`M${q(1).x + 45 + i * 60} ${b(1)}q-6-18 4-30`} className="bf-tronco" /><circle cx={q(1).x + 49 + i * 60} cy={b(1) - 36} r={11} className="bf-copa bf-copa--seca" /></g>)}
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={`g${i}`} d={`M${q(1).x + 20 + i * 22} ${b(1)}l3-9 3 9`} className="bf-capim" />)}
    </> },
    { nome: 'Mata Atlântica', ...q(2), w, h: 136, legenda: 'resta ~12% do original', desenho: <>
      {[0, 1, 2, 3].map((i) => <Arvore key={i} x={q(2).x + 30 + i * 28} y={b(2) - 48 + i * 4} r={14} />)}
      <rect x={q(2).x + 20} y={b(2) - 4} width="110" height="8" rx="4" className="bf-barra" />
      <rect x={q(2).x + 20} y={b(2) - 4} width={110 * 0.12} height="8" rx="4" className="bf-barra bf-barra--resta" />
    </> },
    { nome: 'Caatinga', ...q(3), w, h: 136, legenda: 'só existe no Brasil', desenho: <>
      <path d={`M${q(3).x + 50} ${b(3)}v-40m0 12h-10v-12m10 20h10v-14`} className="bf-cacto" />
      <path d={`M${q(3).x + 100} ${b(3)}v-20m0 0l-12-14m12 14l10-16m-10 6l14-4`} className="bf-tronco" />
      <circle cx={q(3).x + 124} cy={q(3).y + 36} r={9} className="qf-sol" />
    </> },
    { nome: 'Pampa', ...q(4), w, h: 136, legenda: 'gramíneas rasteiras', desenho: <>
      <line x1={q(4).x + 14} y1={b(4)} x2={q(4).x + w - 14} y2={b(4)} className="bf-solo" />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${q(4).x + 18 + i * 11} ${b(4)}l3-8 3 8`} className="bf-capim" />)}
    </> },
    { nome: 'Pantanal', ...q(5), w, h: 136, legenda: 'planície alagável', desenho: <>
      <path d={`M${q(5).x + 14} ${b(5) - 14}q12-6 24 0t24 0t24 0t24 0t24 0`} className="bf-agua" />
      <path d={`M${q(5).x + 14} ${b(5) - 4}q12-6 24 0t24 0t24 0t24 0t24 0`} className="bf-agua" />
      <Arvore x={q(5).x + 110} y={b(5) - 44} r={11} />
    </> },
  ]} />;
}

// ---------------------------------------------------------------------------
// Protozoários: a mesma célula com a estrutura locomotora de cada grupo.
const PROTOZOARIOS: Record<string, { x: number; exemplo: string }> = {
  Rizópodes: { x: 66, exemplo: 'Entamoeba' },
  Flagelados: { x: 184, exemplo: 'Trypanosoma, Giardia' },
  Ciliados: { x: 300, exemplo: 'Paramecium' },
  Esporozoários: { x: 416, exemplo: 'Plasmodium' },
};

function Protozoarios({ ativo, t }: Cena) {
  const y = 130;
  return <g>
    {Object.entries(PROTOZOARIOS).map(([nome, p]) => {
      const ligado = nome === ativo;
      const { x } = p;
      return <motion.g key={nome} initial={false} animate={FOCO(ligado)} transition={t}>
        {nome === 'Rizópodes' && <path d={`M${x - 30} ${y}q-6-24 16-22q10-22 26-4q24-2 18 20q14 18-6 26q-6 18-26 8q-24 10-24-12q-18-2-4-16Z`} className="bf-celula" />}
        {nome === 'Flagelados' && <><ellipse cx={x} cy={y} rx="34" ry="16" className="bf-celula" /><path d={`M${x + 34} ${y}q7-8 14 0t14 0t10 0`} className="bf-flagelo" /></>}
        {nome === 'Ciliados' && <><ellipse cx={x} cy={y} rx="36" ry="22" className="bf-celula" />
          {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return <line key={i} x1={x + 36 * Math.cos(a)} y1={y + 22 * Math.sin(a)} x2={x + 43 * Math.cos(a)} y2={y + 28 * Math.sin(a)} className="bf-cilio" />; })}</>}
        {nome === 'Esporozoários' && <ellipse cx={x} cy={y} rx="24" ry="14" className="bf-celula" />}
        <circle cx={x - 4} cy={y} r="6" className="bf-nucleo" />
        <text x={x} y={200} textAnchor="middle" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{nome}</text>
        <text x={x} y={218} textAnchor="middle" className="qf-mini">{p.exemplo}</text>
      </motion.g>;
    })}
    <text x={240} y={268} textAnchor="middle" className="qf-texto">{ativo === 'Esporozoários' ? 'sem estrutura locomotora na forma adulta' : `move-se por ${ativo === 'Rizópodes' ? 'pseudópodes' : ativo === 'Flagelados' ? 'flagelos' : 'cílios'}`}</text>
  </g>;
}

// ---------------------------------------------------------------------------
// Moluscos, anelídeos e equinodermos: a silhueta de cada grupo com o traço que
// a citação usa para distingui-lo.
function Moluscos({ ativo, t }: Cena) {
  const grupos: Array<{ nome: string; x: number; traco: [string, string]; desenho: React.ReactNode }> = [
    { nome: 'Gastrópodes', x: 86, traco: ['rádula e torção', 'único no ambiente terrestre'], desenho: <>
      <path d="M44 150h84q8 0 8-8" className="bf-pe" />
      <path d="M96 142a28 28 0 1 1-2-40a18 18 0 1 1 0 24a8 8 0 1 1 0-10" className="bf-concha" />
      <path d="M130 140l10-18m-6 20l14-12" className="bf-tentaculo" />
    </> },
    { nome: 'Bivalves', x: 240, traco: ['duas valvas articuladas', 'sem cabeça nem rádula'], desenho: <>
      <path d="M200 140q40-60 80 0Z" className="bf-concha" /><path d="M200 140q40 26 80 0" className="bf-concha" />
      <circle cx="202" cy="140" r="4" className="bf-nucleo" />
    </> },
    // Manto alongado com olhos e tentáculos que se enrolam: com o manto em cúpula
    // e tentáculos retos, a primeira versão lia como água-viva.
    { nome: 'Cefalópodes', x: 394, traco: ['pé em tentáculos', 'circulação fechada'], desenho: <>
      <path d="M394 40q18 20 14 64h-28q-4-44 14-64Z" className="bf-manto" />
      <circle cx="387" cy="112" r="4" className="bf-nucleo" /><circle cx="401" cy="112" r="4" className="bf-nucleo" />
      {Array.from({ length: 8 }, (_, i) => { const dx = (i - 3.5) * 6; return <path key={i} d={`M${394 + dx * 0.6} 118q${dx} 20 ${dx * 1.6} 34q${dx > 0 ? -8 : 8} 8 ${dx > 0 ? -4 : 4} 14`} className="bf-tentaculo" />; })}
    </> },
  ];
  return <g>
    {grupos.map((g) => {
      const ligado = g.nome === ativo;
      return <motion.g key={g.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        {g.desenho}
        <text x={g.x} y={212} textAnchor="middle" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{g.nome}</text>
        <text x={g.x} y={232} textAnchor="middle" className="qf-mini">{g.traco[0]}</text>
        <text x={g.x} y={248} textAnchor="middle" className="qf-mini">{g.traco[1]}</text>
      </motion.g>;
    })}
  </g>;
}

function Verme({ y, segmentos = 11 }: { y: number; segmentos?: number }) {
  return <g>{Array.from({ length: segmentos }, (_, i) => <ellipse key={i} cx={130 + i * 20} cy={y} rx="12" ry="12" className="bf-segmento-verme" />)}</g>;
}

function Anelideos({ ativo, t }: Cena) {
  const grupos = [
    { nome: 'Oligoquetos', y: 60, traco: 'poucas cerdas · clitelo', extra: <>
      <rect x={196} y={46} width="26" height="28" rx="8" className="bf-clitelo" />
      {[0, 2, 4, 6, 8, 10].map((i) => <line key={i} x1={130 + i * 20} y1={73} x2={128 + i * 20} y2={79} className="bf-cerda" />)}
    </> },
    { nome: 'Poliquetos', y: 150, traco: 'parapódios com muitas cerdas', extra: <>
      {Array.from({ length: 11 }, (_, i) => <g key={i}><path d={`M${126 + i * 20} ${162}q4 10 8 0`} className="bf-parapodio" />
        {[-4, 0, 4].map((d) => <line key={d} x1={130 + i * 20} y1={170} x2={130 + i * 20 + d} y2={180} className="bf-cerda" />)}</g>)}
    </> },
    { nome: 'Hirudíneos', y: 240, traco: 'ventosas nas pontas · sem cerdas', extra: <>
      <circle cx={112} cy={240} r="10" className="bf-ventosa" /><circle cx={348} cy={240} r="10" className="bf-ventosa" />
    </> },
  ];
  return <g>
    {grupos.map((g) => {
      const ligado = g.nome === ativo;
      return <motion.g key={g.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        <Verme y={g.y} />
        {g.extra}
        <text x={20} y={g.y - 18} className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{g.nome}</text>
        <text x={118} y={g.y + 40} className="qf-mini">{g.traco}</text>
      </motion.g>;
    })}
  </g>;
}

function Equinodermos({ ativo, t }: Cena) {
  const estrela = (cx: number, cy: number, R: number, r: number) => Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2; const d = i % 2 ? r : R;
    return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  const grupos: Array<{ nome: string; x: number; comum: string; desenho: (x: number) => React.ReactNode }> = [
    { nome: 'Asteroides', x: 52, comum: 'estrela-do-mar', desenho: (x) => <polygon points={estrela(x, 120, 34, 13)} className="bf-equino" /> },
    { nome: 'Equinoides', x: 146, comum: 'ouriço', desenho: (x) => <><circle cx={x} cy={120} r="20" className="bf-equino" />{Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <line key={i} x1={x + 20 * Math.cos(a)} y1={120 + 20 * Math.sin(a)} x2={x + 34 * Math.cos(a)} y2={120 + 34 * Math.sin(a)} className="bf-espinho" />; })}</> },
    { nome: 'Holoturoides', x: 240, comum: 'pepino-do-mar', desenho: (x) => <rect x={x - 38} y={106} width="76" height="28" rx="14" className="bf-equino" /> },
    { nome: 'Ofiuroides', x: 334, comum: 'serpente-do-mar', desenho: (x) => <><circle cx={x} cy={120} r="9" className="bf-equino" />{Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return <path key={i} d={`M${x + 9 * Math.cos(a)} ${120 + 9 * Math.sin(a)}q${22 * Math.cos(a + 0.6)} ${22 * Math.sin(a + 0.6)} ${34 * Math.cos(a)} ${34 * Math.sin(a)}`} className="bf-braco" />; })}</> },
    { nome: 'Crinoides', x: 428, comum: 'lírio-do-mar (fixo)', desenho: (x) => <><line x1={x} y1={158} x2={x} y2={116} className="bf-braco" /><line x1={x - 14} y1={158} x2={x + 14} y2={158} className="bf-solo" />{[-3, -1.5, 0, 1.5, 3].map((k) => <path key={k} d={`M${x} 116q${k * 6} -16 ${k * 9} -30`} className="bf-braco" />)}</> },
  ];
  return <g>
    {grupos.map((g) => {
      const ligado = g.nome === ativo;
      return <motion.g key={g.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        {g.desenho(g.x)}
        <text x={g.x} y={196} textAnchor="middle" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{g.nome}</text>
        <text x={g.x} y={214} textAnchor="middle" className="qf-mini">{g.comum}</text>
      </motion.g>;
    })}
  </g>;
}

// ---------------------------------------------------------------------------
// Processos em etapas (lote C da auditoria): o que já aconteceu fica aceso, a
// etapa escolhida em destaque e as seguintes apagadas — a sequência se lê como
// construção, não como lista.
function progresso(i: number, atual: number) { return { opacity: i < atual ? 0.75 : i === atual ? 1 : 0.82 }; }

type Etapa = { rotulo: string; x: number; desenho: React.ReactNode };
function Etapas({ ativo, t, etapas, largura = 110, legenda }: { ativo: string; t: Cena['t']; etapas: Etapa[]; largura?: number; legenda?: string }) {
  const atual = etapas.findIndex((e) => e.rotulo === ativo);
  return <g>
    {etapas.map((e, i) => <motion.g key={e.rotulo} initial={false} animate={progresso(i, atual)} transition={t}>
      <rect x={e.x - largura / 2} y={40} width={largura} height={170} rx="10" className={i === atual ? 'qf-quadro qf-quadro--ativo' : 'qf-quadro'} />
      {e.desenho}
      {linhas(e.rotulo.replace(/^\d\. /, ''), Math.floor(largura / 7)).map((l, k) => <text key={k} x={e.x} y={228 + k * 13} textAnchor="middle" className={i === atual ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{l}</text>)}
      {i < etapas.length - 1 && <path d={`M${e.x + largura / 2 + 2} 125h${(etapas[i + 1].x - e.x) - largura - 4}`} className="bf-seta" markerEnd="url(#bf-ponta)" />}
    </motion.g>)}
    <defs><marker id="bf-ponta" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta" /></marker></defs>
    {legenda && <text x={240} y={272} textAnchor="middle" className="qf-texto">{legenda}</text>}
  </g>;
}

function OrigemDaVida({ ativo, t }: Cena) {
  return <Etapas ativo={ativo} t={t} etapas={[
    { rotulo: 'Síntese abiótica', x: 64, desenho: <>
      <path d="M44 100v60q0 14 20 14t20-14v-60" className="qf-vidro" />
      <path d="M52 80l6 10-6 6 8 10M76 80l-6 10 6 6-8 10" className="bf-faisca" />
      {[56, 64, 72].map((x, k) => <circle key={x} cx={x} cy={150 + (k % 2) * 8} r="4" className="bf-monomero" />)}
      <text x={64} y={196} textAnchor="middle" className="qf-mini">aminoácidos</text>
    </> },
    { rotulo: 'Polimerização', x: 184, desenho: <>
      <path d="M140 170h88" className="bf-solo" /><text x={184} y={190} textAnchor="middle" className="qf-mini">argila</text>
      {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={152 + k * 13} cy={150 - (k % 2) * 8} r="5" className="bf-monomero" />)}
      <path d="M152 150l13-8 13 8 13-8 13 8 13-8" className="bf-cadeia" />
    </> },
    { rotulo: 'Coacervados', x: 304, desenho: <>
      <circle cx={304} cy={130} r="36" className="bf-coacervado" />
      <path d="M284 130q10-14 20 0t20 0" className="bf-cadeia" /><path d="M290 146q8-10 16 0t16 0" className="bf-cadeia" />
      <text x={304} y={190} textAnchor="middle" className="qf-mini">gotícula separada</text>
    </> },
    { rotulo: 'Sistema de replicação', x: 424, desenho: <>
      <path d="M386 112h76" className="bf-rna" />{[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={392 + k * 13} y1={112} x2={392 + k * 13} y2={122} className="bf-rna" />)}
      <path d="M386 142h46" className="bf-rna bf-rna--copia" />{[0, 1, 2].map((k) => <line key={k} x1={392 + k * 13} y1={132} x2={392 + k * 13} y2={142} className="bf-rna bf-rna--copia" />)}
      <text x={424} y={176} textAnchor="middle" className="qf-mini">RNA guarda e catalisa</text>
    </> },
  ]} largura={108} legenda="hipótese heterotrófica: do monômero ao sistema que se copia" />;
}

function Proteinas({ ativo, t }: Cena) {
  return <Etapas ativo={ativo} t={t} etapas={[
    { rotulo: '1. Estrutura primária', x: 64, desenho: <>
      {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={40 + (k % 3) * 24} cy={100 + Math.floor(k / 3) * 40} r="9" className="bf-aminoacido" />)}
      <path d="M49 100h6m18 0h6M88 109q6 12-15 22M49 140h6m18 0h6" className="bf-cadeia" />
      <text x={64} y={190} textAnchor="middle" className="qf-mini">sequência do gene</text>
    </> },
    { rotulo: '2. Estrutura secundária', x: 184, desenho: <>
      <path d={Array.from({ length: 40 }, (_, k) => `${k ? 'L' : 'M'}${150 + k * 1.7} ${100 + 12 * Math.sin(k / 2.2)}`).join('')} className="bf-helice" />
      <path d="M150 150l12 12 12-12 12 12 12-12 12 12" className="bf-folha" />
      <text x={184} y={190} textAnchor="middle" className="qf-mini">hélice α · folha β</text>
    </> },
    { rotulo: '3. Estrutura terciária', x: 304, desenho: <>
      <path d="M274 110q10-34 40-20q30 10 14 40q16 26-16 30q-20 12-34-8q-22-4-10-24q-12-10 6-18Z" className="bf-dobra" />
      <path d="M318 118q-10 4-6 14" className="bf-sitio" /><text x={304} y={190} textAnchor="middle" className="qf-mini">sítio ativo</text>
    </> },
    { rotulo: '4. Estrutura quaternária', x: 424, desenho: <>
      {[[-16, -16], [16, -16], [-16, 16], [16, 16]].map(([dx, dy], k) => <circle key={k} cx={424 + dx} cy={128 + dy} r="17" className={k % 2 ? 'bf-subunidade bf-subunidade--b' : 'bf-subunidade'} />)}
      <text x={424} y={190} textAnchor="middle" className="qf-mini">hemoglobina</text>
    </> },
  ]} largura={108} legenda="cada nível se constrói sobre o anterior" />;
}

function Embriao({ ativo, t }: Cena) {
  return <Etapas ativo={ativo} t={t} etapas={[
    { rotulo: '1. Segmentação (clivagem)', x: 64, desenho: <>
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j], k) => <circle key={k} cx={52 + i * 24} cy={116 + j * 24} r="12" className="bf-blastomero" />)}
      <text x={64} y={186} textAnchor="middle" className="qf-mini">mitoses sem crescer</text>
    </> },
    { rotulo: '2. Mórula', x: 184, desenho: <>
      {Array.from({ length: 16 }, (_, k) => <circle key={k} cx={184 + 22 * Math.cos(k * 2.4) * Math.sqrt(k / 16)} cy={128 + 22 * Math.sin(k * 2.4) * Math.sqrt(k / 16)} r="8" className="bf-blastomero" />)}
      <text x={184} y={186} textAnchor="middle" className="qf-mini">maciça, ~16 células</text>
    </> },
    { rotulo: '3. Blástula', x: 304, desenho: <>
      {Array.from({ length: 18 }, (_, k) => <circle key={k} cx={304 + 34 * Math.cos((k / 18) * Math.PI * 2)} cy={128 + 34 * Math.sin((k / 18) * Math.PI * 2)} r="6" className="bf-blastomero" />)}
      <text x={304} y={132} textAnchor="middle" className="qf-mini">blastocele</text>
      <text x={304} y={186} textAnchor="middle" className="qf-mini">esférica e oca</text>
    </> },
    { rotulo: '4. Gastrulação', x: 424, desenho: <>
      {/* A parede de baixo dobra para dentro: a camada externa segue em arco
          e a interna forra a cavidade nova, aberta no blastóporo. Com as
          células em bolinha, a dobra virava um monte no fundo da esfera. */}
      <path d="M440 152A32 32 0 1 0 408 152" className="bf-camada" />
      <path d="M412 154V122A12 12 0 0 1 436 122V154" className="bf-camada bf-camada--interna" />
      <text x={424} y={182} textAnchor="middle" className="qf-mini">arquêntero dentro</text>
      <text x={424} y={196} textAnchor="middle" className="qf-mini">blastóporo embaixo</text>
    </> },
  ]} largura={108} legenda="da fecundação à gástrula" />;
}

// Vírus: o mesmo desenho de célula, e a etapa escolhida acende o que ela faz.
function Virus({ ativo, t }: Cena) {
  const ordem = ['Adsorção', 'Penetração', 'Replicação e síntese', 'Montagem', 'Liberação'];
  const atual = ordem.indexOf(ativo);
  const capsidio = (x: number, y: number, k: string | number) => <g key={k}><polygon points={hexagono(x, y, 10)} className="bf-capsidio" />{[0, 1, 2].map((j) => <line key={j} x1={x - 6 + j * 6} y1={y - 10} x2={x - 6 + j * 6} y2={y - 16} className="bf-espicula" />)}</g>;
  const fase = (i: number, filho: React.ReactNode) => <motion.g initial={false} animate={progresso(i, atual)} transition={t}>{filho}</motion.g>;
  return <g>
    <rect x={60} y={70} width={320} height={170} rx="40" className="bf-celula" />
    <circle cx={322} cy={112} r="26" className="bf-nucleo-celula" />
    {fase(0, <>{capsidio(110, 52, 'a')}<path d="M104 70v-6m12 6v-6" className="bf-receptor" /><text x={140} y={48} className="qf-mini">1 · liga ao receptor</text></>)}
    {fase(1, <><path d="M112 76q10 20 30 22" className="bf-genoma" /><text x={150} y={102} className="qf-mini">2 · genoma entra</text></>)}
    {fase(2, <>{[0, 1, 2].map((k) => <path key={k} d={`M${160 + k * 30} ${150}q8-10 16 0t16 0`} className="bf-genoma" />)}<text x={160} y={176} className="qf-mini">3 · cópias com a maquinaria da célula</text></>)}
    {fase(3, <>{[0, 1].map((k) => capsidio(180 + k * 40, 208, `m${k}`))}<text x={250} y={216} className="qf-mini">4 · montagem</text></>)}
    {fase(4, <>{capsidio(410, 150, 'l1')}{capsidio(430, 196, 'l2')}<path d="M380 160h14M380 196h24" className="bf-seta" /><text x={470} y={52} textAnchor="end" className="qf-mini">5 · saem por</text><text x={470} y={64} textAnchor="end" className="qf-mini">lise ou brotamento</text></>)}
    <text x={240} y={272} textAnchor="middle" className="qf-texto">sem célula hospedeira, nada disso acontece</text>
  </g>;
}

// Tensão-coesão: planta com a coluna de água no xilema; a etapa escolhida
// acende sua parte, da folha até a raiz.
function Transpiracao({ ativo, t }: Cena) {
  const ordem = ['Transpiração', 'Tensão', 'Coesão', 'Tração'];
  const atual = ordem.indexOf(ativo);
  const parte = (i: number, filho: React.ReactNode) => <motion.g initial={false} animate={{ opacity: i === atual ? 1 : 0.82 }} transition={t}>{filho}</motion.g>;
  return <g>
    <rect x={226} y={60} width={28} height={180} rx="6" className="bf-xilema" />
    <path d="M240 60q60-40 120-10q-60 30-120 10Z" className="bf-folha-planta" />
    <path d="M240 240q-40 20-70 40M240 240q10 24 0 40M240 240q40 20 70 36" className="bf-raiz" />
    {parte(0, <><circle cx={330} cy={46} r="5" className="bf-estomato" />{[0, 1, 2].map((k) => <circle key={k} cx={346 + k * 14} cy={30 - k * 6} r="4" className="qf-vapor" />)}<text x={384} y={40} className="qf-mini">evapora</text><text x={384} y={52} className="qf-mini">no estômato</text></>)}
    {parte(1, <><path d="M254 80h34" className="bf-seta" /><text x={292} y={84} className="qf-mini">pressão negativa</text><text x={292} y={98} className="qf-mini">no topo da coluna</text></>)}
    {parte(2, <>{Array.from({ length: 8 }, (_, k) => <circle key={k} cx={240} cy={82 + k * 20} r="7" className="bf-agua-molecula" />)}{Array.from({ length: 7 }, (_, k) => <line key={`p${k}`} x1={240} y1={89 + k * 20} x2={240} y2={95 + k * 20} className="bf-ponte-h" />)}<text x={150} y={160} textAnchor="end" className="qf-mini">pontes de hidrogênio</text><text x={150} y={174} textAnchor="end" className="qf-mini">mantêm a coluna</text></>)}
    {parte(3, <><path d="M200 272q20-6 32-24" className="bf-seta" markerEnd="url(#bf-ponta2)" /><text x={120} y={266} textAnchor="end" className="qf-mini">a raiz é sugada,</text><text x={120} y={280} textAnchor="end" className="qf-mini">sem gasto de ATP</text></>)}
    <defs><marker id="bf-ponta2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta" /></marker></defs>
    <text x={60} y={40} className="qf-rotulo qf-rotulo--forte">xilema: a água sobe</text>
  </g>;
}

// Fluxo por pressão: xilema e floema lado a lado, da fonte ao dreno.
function Floema({ ativo, t }: Cena) {
  const ordem = ['1. Carregamento na fonte', '2. Queda do potencial hídrico', '3. Entrada de água por osmose', '4. Gradiente de pressão', '5. Descarregamento no dreno'];
  const atual = ordem.indexOf(ativo);
  const fase = (i: number, filho: React.ReactNode) => <motion.g initial={false} animate={progresso(i, atual)} transition={t}>{filho}</motion.g>;
  return <g>
    <text x={60} y={40} className="qf-rotulo qf-rotulo--forte">fonte (folha)</text>
    <text x={60} y={272} className="qf-rotulo qf-rotulo--forte">dreno (raiz, fruto)</text>
    <rect x={180} y={50} width={30} height={200} rx="6" className="bf-xilema" /><text x={195} y={44} textAnchor="middle" className="qf-mini">xilema</text>
    <rect x={250} y={50} width={30} height={200} rx="6" className="bf-floema" /><text x={265} y={44} textAnchor="middle" className="qf-mini">floema</text>
    {fase(0, <>{[0, 1, 2].map((k) => <circle key={k} cx={318 - k * 12} cy={76} r="5" className="bf-sacarose" />)}<path d="M300 76h-14" className="bf-seta" /><text x={330} y={72} className="qf-mini">sacarose entra</text><text x={330} y={86} className="qf-mini">com gasto de ATP</text></>)}
    {fase(1, <text x={330} y={112} className="qf-mini">Ψ interno cai</text>)}
    {fase(2, <><path d="M212 96h34" className="bf-seta bf-seta--agua" /><text x={172} y={100} textAnchor="end" className="qf-mini">água entra</text><text x={172} y={114} textAnchor="end" className="qf-mini">por osmose</text></>)}
    {fase(3, <><path d="M265 110v110" className="bf-fluxo" /><text x={300} y={170} className="qf-mini">alta pressão → baixa</text><text x={300} y={184} className="qf-mini">a seiva flui em massa</text></>)}
    {fase(4, <>{[0, 1].map((k) => <circle key={k} cx={300 + k * 12} cy={236} r="5" className="bf-sacarose" />)}<path d="M284 236h10" className="bf-seta" /><text x={330} y={240} className="qf-mini">sacarose sai; pressão cai</text></>)}
  </g>;
}

// ---------------------------------------------------------------------------
// Lote D: graus e contrastes.
function Classificacao({ ativo, t }: Cena) {
  const niveis = ['domínio', 'reino', 'filo', 'classe', 'ordem', 'família', 'gênero', 'espécie'];
  return <Quadros ativo={ativo} t={t} quadros={[
    { nome: 'Domínio', x: 12, y: 10, w: 150, h: 270, legenda: 'arqueias mais perto de eucariontes', desenho: <>
      <path d="M80 230V190M80 190H40V110M80 190H120V150M120 150H100V110M120 150H140V110" className="bf-arvore" />
      <text x={40} y={100} textAnchor="middle" className="qf-mini">Bacteria</text><text x={100} y={86} textAnchor="middle" className="qf-mini">Archaea</text><text x={140} y={100} textAnchor="middle" className="qf-mini">Eukarya</text>
    </> },
    { nome: 'Hierarquia completa', x: 168, y: 10, w: 150, h: 270, legenda: 'da mais abrangente à mais restrita', desenho: <>
      {niveis.map((n, i) => <g key={n}><rect x={178 + i * 6} y={34 + i * 26} width={130 - i * 12} height={206 - i * 26} rx="6" className="bf-nivel" /><text x={184 + i * 6} y={48 + i * 26} className="qf-mini">{n}</text></g>)}
    </> },
    { nome: 'Gênero e espécie', x: 324, y: 10, w: 144, h: 270, legenda: 'mesmo gênero: mais parentes', desenho: <>
      <path d="M396 230V190M396 190H356V110M396 190H436V150M436 150H416V110M436 150H456V110" className="bf-arvore" />
      <circle cx={416} cy={100} r="6" className="bf-alelo--b" /><circle cx={456} cy={100} r="6" className="bf-alelo--b" /><circle cx={356} cy={100} r="6" className="bf-alelo--a" />
      <text x={436} y={170} textAnchor="middle" className="qf-mini">gênero</text><text x={396} y={210} textAnchor="end" className="qf-mini">família</text>
    </> },
  ]} />;
}

// Tetrápodes: a primeira versão era uma elipse com duas bolinhas (anfíbio), um
// ovo liso e um semicírculo com pernas — a Ana Júlia viu no iPad e estava
// péssimo. Cada grupo agora tem figura reconhecível e mostra o traço que a
// citação dá: os ovos sem casca na água, o ovo com casca e anexos, o coração de
// quatro cavidades dentro do mamífero.
const tinta = { stroke: 'var(--vs-ink)', strokeWidth: 2.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
function Tetrapodes({ ativo, t }: Cena) {
  const grupos = [
    { nome: 'Anfíbios', x: 90, desenho: <>
      {/* Sapo de perfil, mais achatado, com a perna traseira dobrada, e os ovos
          sem casca na água (a legenda "ovo na água" já diz isso embaixo). */}
      <path d="M56 152c-2-18 14-30 36-30 18 0 30 8 32 20 1 7-4 10-10 10H62Z" style={{ fill: 'color-mix(in srgb, var(--vs-green) 35%, var(--vs-paper-strong))', ...tinta }} />
      <path d="M64 150c-8-14 10-24 20-12 5 6 2 12-6 14M66 152H48M106 150l6 10h10" style={{ fill: 'none', ...tinta }} />
      <circle cx="108" cy="120" r="6" style={{ fill: 'var(--vs-paper-strong)', ...tinta }} /><circle cx="110" cy="120" r="2.4" style={{ fill: 'var(--vs-ink)' }} />
      <path d="M114 138c5 1 8 0 10-2" style={{ fill: 'none', ...tinta, strokeWidth: 1.6 }} />
      {[[40, 176], [52, 180], [46, 170], [60, 174], [34, 182]].map(([x, y]) => <g key={x}><circle cx={x} cy={y} r="5" style={{ fill: 'color-mix(in srgb, var(--vs-blue) 18%, transparent)', stroke: 'var(--vs-blue)', strokeWidth: 1.2 }} /><circle cx={x} cy={y} r="1.6" style={{ fill: 'var(--vs-ink)' }} /></g>)}
    </>, traco: ['pele úmida, ovo na água', 'ainda preso à água'] },
    { nome: 'Répteis e aves', x: 240, desenho: <>
      {/* Ovo amniótico em corte, nas palavras da citação: casca e anexos
          embrionários em volta do embrião. */}
      <ellipse cx="240" cy="128" rx="34" ry="44" style={{ fill: 'var(--vs-paper-strong)', ...tinta, strokeWidth: 3 }} />
      <circle cx="240" cy="150" r="14" style={{ fill: 'color-mix(in srgb, var(--vs-amber) 55%, var(--vs-paper-strong))', stroke: 'var(--vs-amber)', strokeWidth: 1.5 }} />
      <ellipse cx="238" cy="112" rx="15" ry="13" style={{ fill: 'color-mix(in srgb, var(--vs-blue) 10%, transparent)', stroke: 'var(--vs-blue)', strokeWidth: 1.6, strokeDasharray: '3 2' }} />
      <path d="M244 106c-8-6-16 0-12 8 3 6 10 4 9-1" style={{ fill: 'none', stroke: 'var(--vs-burgundy)', strokeWidth: 2.4, strokeLinecap: 'round' }} />
      <text x="286" y="100" className="qf-mini">anexos</text><path d="M284 97l-30 10" style={{ stroke: 'var(--vs-ink-muted)', strokeWidth: 1 }} />
      <text x="286" y="160" className="qf-mini">casca</text><path d="M284 156l-12-4" style={{ stroke: 'var(--vs-ink-muted)', strokeWidth: 1 }} />
    </>, traco: ['pele seca, ovo amniótico', 'fecundação interna'] },
    { nome: 'Mamíferos', x: 390, desenho: <>
      {/* Silhueta de quadrúpede e, dentro, o coração em quatro cavidades. */}
      <path d="M350 140c-2-20 14-30 36-30h26c10 0 16-8 24-8 8 0 12 6 12 12 0 6-4 10-10 12-2 16-12 22-26 22h-46c-10 0-16-2-16-8Z" style={{ fill: 'color-mix(in srgb, var(--vs-amber) 22%, var(--vs-paper-strong))', ...tinta }} />
      <path d="M432 104l4-10 6 10" style={{ fill: 'color-mix(in srgb, var(--vs-amber) 22%, var(--vs-paper-strong))', ...tinta }} /><circle cx="440" cy="112" r="1.8" style={{ fill: 'var(--vs-ink)' }} />
      <path d="M362 146v26M376 148v24M408 148v24M420 146v26M350 132c-10-2-16 4-18 12" style={{ fill: 'none', ...tinta }} />
      <path d="M390 138c-10-7-12-15-6-18 3-2 6 0 6 2 0-2 3-4 6-2 6 3 4 11-6 18Z" style={{ fill: 'color-mix(in srgb, var(--vs-burgundy) 45%, var(--vs-paper-strong))', stroke: 'var(--vs-burgundy)', strokeWidth: 1.4 }} />
      <path d="M390 122v15M383 128h14" style={{ stroke: 'var(--vs-burgundy)', strokeWidth: 1.2 }} />
    </>, traco: ['endotermia, diafragma', 'coração de 4 cavidades'] },
  ];
  return <g>
    <path d="M14 188q24-6 48 0t48 0" className="bf-agua" /><path d="M14 196q24-6 48 0t48 0" className="bf-agua" />
    <line x1={130} y1={186} x2={466} y2={186} className="bf-solo" />
    {grupos.map((g) => {
      const ligado = g.nome === ativo;
      return <motion.g key={g.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        {g.desenho}
        <text x={g.x} y={222} textAnchor="middle" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{g.nome}</text>
        <text x={g.x} y={240} textAnchor="middle" className="qf-mini">{g.traco[0]}</text>
        <text x={g.x} y={254} textAnchor="middle" className="qf-mini">{g.traco[1]}</text>
      </motion.g>;
    })}
    <path d="M60 278h260" className="bf-seta" markerEnd="url(#bf-ponta3)" />
    <defs><marker id="bf-ponta3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta" /></marker></defs>
    <text x={334} y={282} className="qf-mini">independência da água</text>
  </g>;
}

function PlantasTerrestres({ ativo, t }: Cena) {
  const grupos = [
    { nome: 'Briófitas', x: 90, desenho: <>
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${70 + k * 10} 190q-3-16 2-24`} className="bf-musgo" />)}
      <path d="M78 130v14m10-10v10" className="bf-gota" />
    </>, traco: ['sem xilema nem floema', 'gameta depende da água'] },
    { nome: 'Pteridófitas', x: 240, desenho: <>
      <path d="M240 190V110" className="bf-vaso" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M240 ${120 + k * 18}q-26-4-34 6M240 ${120 + k * 18}q26-4 34 6`} className="bf-fronde" />)}
      <path d="M270 100v12" className="bf-gota" />
    </>, traco: ['xilema e floema verdadeiros', 'gameta ainda nada na água'] },
    { nome: 'Rumo às sementes', x: 390, desenho: <>
      <circle cx={390} cy={140} r="12" className="bf-polen" /><circle cx={378} cy={140} r="6" className="bf-polen" /><circle cx={402} cy={140} r="6" className="bf-polen" />
      <path d="M340 120q20-8 36 0M340 160q20-8 36 0" className="bf-vento" />
    </>, traco: ['o pólen leva o gameta', 'pelo vento, sem água líquida'] },
  ];
  return <g>
    {grupos.map((g) => {
      const ligado = g.nome === ativo;
      return <motion.g key={g.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        {g.desenho}
        <text x={g.x} y={222} textAnchor="middle" className={ligado ? 'qf-rotulo qf-rotulo--forte' : 'qf-rotulo'}>{g.nome}</text>
        <text x={g.x} y={240} textAnchor="middle" className="qf-mini">{g.traco[0]}</text>
        <text x={g.x} y={254} textAnchor="middle" className="qf-mini">{g.traco[1]}</text>
      </motion.g>;
    })}
    <path d="M60 278h260" className="bf-seta" markerEnd="url(#bf-ponta4)" />
    <defs><marker id="bf-ponta4" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta" /></marker></defs>
    <text x={334} y={282} className="qf-mini">independência da água</text>
  </g>;
}

// Lamarck × Darwin, e a réplica em placas de Lederberg como juiz.
function EvolucaoHistorica({ ativo, t }: Cena) {
  const bacteria = (x: number, y: number, k: string | number, cls = 'bf-bacteria') => <rect key={k} x={x - 8} y={y - 4} width="16" height="8" rx="4" className={cls} />;
  return <Quadros ativo={ativo} t={t} quadros={[
    { nome: 'Lamarckismo', x: 12, y: 10, w: 150, h: 270, legenda: 'adquire em vida e transmite', desenho: <>
      {bacteria(87, 90, 'a')}<text x={87} y={120} textAnchor="middle" className="qf-mini">antibiótico</text>
      <path d="M87 130v30" className="bf-seta" markerEnd="url(#bf-ponta5)" />
      {bacteria(87, 190, 'b', 'bf-bacteria bf-bacteria--r')}<text x={87} y={220} textAnchor="middle" className="qf-mini">"torna-se" resistente</text>
    </> },
    { nome: 'Darwinismo', x: 168, y: 10, w: 150, h: 270, legenda: 'a variação já existe; o ambiente seleciona', desenho: <>
      {[0, 1, 2, 3, 4, 5].map((k) => bacteria(196 + (k % 3) * 34, 80 + Math.floor(k / 3) * 24, k, k === 4 ? 'bf-bacteria bf-bacteria--r' : 'bf-bacteria'))}
      <path d="M243 130v30" className="bf-seta" markerEnd="url(#bf-ponta5)" />
      <defs><marker id="bf-ponta5" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" className="qf-ponta" /></marker></defs>
      {[0, 1, 2].map((k) => bacteria(210 + k * 34, 190, `r${k}`, 'bf-bacteria bf-bacteria--r'))}
    </> },
    { nome: 'Veredito da evidência', x: 324, y: 10, w: 144, h: 270, legenda: 'resistência antes do contato', desenho: <>
      <circle cx={396} cy={84} r="30" className="bf-placa" />{[[-12, -8], [10, -12], [-2, 10], [14, 8]].map(([dx, dy], k) => <circle key={k} cx={396 + dx} cy={84 + dy} r="4" className={k === 1 ? 'bf-colonia bf-colonia--r' : 'bf-colonia'} />)}
      <text x={396} y={130} textAnchor="middle" className="qf-mini">réplica em veludo ↓</text>
      <circle cx={396} cy={180} r="30" className="bf-placa bf-placa--antibiotico" /><circle cx={406} cy={168} r="4" className="bf-colonia bf-colonia--r" />
      <text x={396} y={226} textAnchor="middle" className="qf-mini">mesma posição</text>
    </> },
  ]} />;
}

export const BIOLOGIA_FENOMENO_CENAS: Record<string, CenaFenomeno> = {
  'summary-biologia-composicao-quimica-celular-carboidratos-e-lipidios': { cena: Carboidratos, rotulos: ['Monossacarídeos', 'Dissacarídeos', 'Polissacarídeos de reserva', 'Lipídios: reserva e membrana'], titulo: 'carboidratos e lipídios' },
  'summary-biologia-heranca-sexual': { cena: HerancaSexual, rotulos: Object.keys(HERANCA), titulo: 'herança e cromossomos sexuais' },
  'summary-biologia-mecanismos-da-evolucao-biologica': { cena: Evolucao, rotulos: ['Mutação', 'Recombinação', 'Seleção natural', 'Deriva genética', 'Migração', 'Isolamento reprodutivo'], titulo: 'fatores evolutivos' },
  'summary-biologia-biomas-brasileiros': { cena: Biomas, rotulos: ['Amazônia', 'Cerrado', 'Mata Atlântica', 'Caatinga', 'Pampa', 'Pantanal'], titulo: 'biomas' },
  'summary-biologia-protozoarios-e-protozooses': { cena: Protozoarios, rotulos: Object.keys(PROTOZOARIOS), titulo: 'locomoção dos protozoários' },
  'summary-biologia-moluscos': { cena: Moluscos, rotulos: ['Gastrópodes', 'Bivalves', 'Cefalópodes'], titulo: 'classes de moluscos' },
  'summary-biologia-anelideos': { cena: Anelideos, rotulos: ['Oligoquetos', 'Poliquetos', 'Hirudíneos'], titulo: 'grupos de anelídeos' },
  'summary-biologia-equinodermos': { cena: Equinodermos, rotulos: ['Asteroides', 'Equinoides', 'Holoturoides', 'Ofiuroides', 'Crinoides'], titulo: 'classes de equinodermos' },
  'summary-biologia-origem-da-vida-e-as-primeiras-celulas': { cena: OrigemDaVida, rotulos: ['Síntese abiótica', 'Polimerização', 'Coacervados', 'Sistema de replicação'], titulo: 'origem da vida' },
  'summary-biologia-composicao-quimica-celular-proteinas-e-sua-funcao-estrutural': { cena: Proteinas, rotulos: ['1. Estrutura primária', '2. Estrutura secundária', '3. Estrutura terciária', '4. Estrutura quaternária'], titulo: 'níveis da proteína' },
  'summary-biologia-virus': { cena: Virus, rotulos: ['Adsorção', 'Penetração', 'Replicação e síntese', 'Montagem', 'Liberação'], titulo: 'ciclo viral' },
  'summary-biologia-embriologia-animal': { cena: Embriao, rotulos: ['1. Segmentação (clivagem)', '2. Mórula', '3. Blástula', '4. Gastrulação'], titulo: 'desenvolvimento embrionário' },
  'summary-biologia-traqueofitas-transpiracao-e-reposicao-rapida-de-agua': { cena: Transpiracao, rotulos: ['Transpiração', 'Tensão', 'Coesão', 'Tração'], titulo: 'tensão-coesão' },
  'summary-biologia-fisiologia-vegetal-transporte-no-floema': { cena: Floema, rotulos: ['1. Carregamento na fonte', '2. Queda do potencial hídrico', '3. Entrada de água por osmose', '4. Gradiente de pressão', '5. Descarregamento no dreno'], titulo: 'fluxo por pressão' },
  'summary-biologia-classificacao-biologica-nomenclatura-cientifica-e-nocoes-de-sistematica-filogenetica': { cena: Classificacao, rotulos: ['Domínio', 'Hierarquia completa', 'Gênero e espécie'], titulo: 'classificação e parentesco' },
  'summary-biologia-cordados-tetrapodes': { cena: Tetrapodes, rotulos: ['Anfíbios', 'Répteis e aves', 'Mamíferos'], titulo: 'saída da água' },
  'summary-biologia-plantas-terrestres-i-briofitas-e-pteridofitas': { cena: PlantasTerrestres, rotulos: ['Briófitas', 'Pteridófitas', 'Rumo às sementes'], titulo: 'plantas e água' },
  'summary-biologia-evolucao-biologica-construcao-historica': { cena: EvolucaoHistorica, rotulos: ['Lamarckismo', 'Darwinismo', 'Veredito da evidência'], titulo: 'Lamarck × Darwin' },
};

export const BIOLOGIA_FENOMENO_IDS = new Set(Object.keys(BIOLOGIA_FENOMENO_CENAS));

const BIOLOGIA_VOLUMETRICA: Record<string, CenaFenomeno> = Object.fromEntries(
  Object.entries(BIOLOGIA_FENOMENO_CENAS).map(([id, config]) => {
    const Drawing = config.cena;
    return [id, { ...config, cena: function BiologicalDrawing(props: Cena) { return <BiologicalVolume><Drawing {...props}/></BiologicalVolume>; } }];
  }),
);

export function BiologiaFenomenos({ entry }: { entry: SceneEntry }) {
  const t = useSceneMotion();
  return <FenomenoFrame entry={entry} cenas={BIOLOGIA_VOLUMETRICA} t={t} />;
}
