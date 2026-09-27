import React from 'react';
import type { LiteraryTraitId } from '../../lib/literaryTraitLab';

// Auditoria 35: os 22 capítulos de `LiteraryTraitBoard` eram três retângulos
// iguais com nome e nota — nada distinguia um cultismo barroco de uma
// vanguarda. Cada faceta ganha aqui um desenho do próprio conteúdo, tirado do
// rótulo e da nota do lab: a coluna clássica e a caravela de Camões, o
// triângulo meio-raça-momento do Naturalismo, a palavra em grade da poesia
// concreta, o cálice da canção censurada. Nada vem de fora do que o capítulo
// já diz; o desenho é emblema, não ilustração de cena.
//
// Cada ícone ocupa uma caixa de ±44 em torno da origem e herda `stroke` do
// grupo, para que o foco da faceta ativa pinte o desenho inteiro.

type Icone = React.ReactNode;
const f = { fill: 'none' } as const;
const cheio = (o = 0.22) => ({ fill: 'currentColor', fillOpacity: o });

const coluna = <><path d="M-18-30h36M-14-24h28M-18 30h36M-14 24h28" {...f} />{[-9, -3, 3, 9].map((x) => <path key={x} d={`M${x}-24V24`} {...f} />)}</>;
const livro = (x = 0, y = 0, s = 1) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-14C-6-17-14-16-18-14V14C-14 12-6 11 0 14C6 11 14 12 18 14V-14C14-16 6-17 0-14ZM0-14V14" {...f} />;
const pena = <><path d="M16-30C-6-20-16 4-18 28M16-30C8-8-2 10-18 28" {...f} /><path d="M-18 28l-4 8" {...f} /></>;
const cruz = <path d="M0-30V30M-16-12H16" {...f} />;
const pessoa = (x = 0, y = 0, s = 1) => <g transform={`translate(${x} ${y}) scale(${s})`}><circle cy="-18" r="8" {...f} /><path d="M0-10V12M-14-2H14M0 12l-10 18M0 12l10 18" {...f} /></g>;
const balao = (x = 0, y = 0) => <path transform={`translate(${x} ${y})`} d="M-20-14h40a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H-6l-10 10V12h-4a6 6 0 0 1-6-6V-8a6 6 0 0 1 6-6Z" {...f} />;
const folha = (x = 0, y = 0) => <g transform={`translate(${x} ${y})`}><rect x="-18" y="-24" width="36" height="48" rx="3" {...f} /><path d="M-10-12h20M-10-4h20M-10 4h14M-10 12h18" {...f} /></g>;
const nota = (x = 0, y = 0) => <g transform={`translate(${x} ${y})`}><ellipse cx="-6" cy="10" rx="6" ry="4.5" {...cheio(0.9)} /><path d="M0 10V-14l12 4" {...f} /></g>;

export const LITERARY_FACET_ICONS: Record<LiteraryTraitId, [Icone, Icone, Icone]> = {
  'art-languages': [
    <><rect x="-26" y="-22" width="52" height="44" {...f} /><rect x="-20" y="-16" width="40" height="32" {...f} /><text y="8" textAnchor="middle" fontSize="20" fontWeight="800" fill="currentColor" stroke="none">?</text></>,
    <>{livro(-16, -10, 0.8)}{nota(18, -12)}<path d="M-20 22c10-8 22-8 34 0" {...f} /><circle cx="18" cy="22" r="5" {...cheio()} /></>,
    <><path d="M-22-8h10l24-14v44L-12 8h-10Z" {...f} /><path d="M18-10c6 4 6 16 0 20M24-16c10 8 10 24 0 32" {...f} /></>,
  ],
  'renaissance-camoes': [
    coluna,
    // "Amor é fogo que arde sem se ver": a antítese como fogo e gelo lado a lado.
    <><path d="M-14 24c-12-8-10-24 0-40 2 12 12 14 12 26 0 8-6 14-12 14Z" {...cheio()} /><path d="M18-16v32M4-8l28 16M4 8l28-16" {...f} /></>,
    <><path d="M-30 12h60l-10 14h-40Z" {...f} /><path d="M0 12V-30M0-26l22 16H0M0-18l-18 12H0" {...f} /><path d="M-36 30c8 4 16-4 24 0s16 4 24 0 16-4 24 0" {...f} /></>,
  ],
  'first-records': [
    <><path d="M-24-24h40l8 8v40h-48Z" {...f} /><path d="M-16-10h28M-16-2h28M-16 6h20" {...f} /><text x="-4" y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" stroke="none">1500</text></>,
    <><path d="M-30 0c12-14 48-14 60 0-12 14-48 14-60 0Z" {...f} /><circle r="8" {...cheio()} /><path d="M-20-26h40M-20-26v8M20-26v8" {...f} /></>,
    <>{cruz}{livro(0, 18, 0.7)}</>,
  ],
  baroque: [
    // Contrarreforma: a cruz sobre o claro e o escuro divididos.
    <><path d="M0-30A30 30 0 0 1 0 30Z" {...cheio(0.55)} /><circle r="30" {...f} />{cruz}</>,
    <><path d="M-30-8c6-12 16-12 16 0s10 12 16 0 10-12 16 0" {...f} /><path d="M-30 4c6-12 16-12 16 0s10 12 16 0" {...f} /><text x="-18" y="28" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none">palavra</text><circle cx="22" cy="-6" r="10" {...f} /><path d="M18 6h8M19 10h6" {...f} /><text x="25" y="28" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none">ideia</text></>,
    <><path d="M-26 20h52M-18 20v-26h36v26M-22-6h44" {...f} /><path d="M-6-6v-12h12v12" {...f} /><path d="M-26-24l6 6M26-24l-6 6" {...f} /></>,
  ],
  neoclassic: [
    <>{coluna}<path d="M-26-30c-8 10-8 24 0 34M26-30c8 10 8 24 0 34" {...f} /></>,
    <><path d="M-28 26c10-6 46-6 56 0" {...f} /><path d="M14 26V-4" {...f} /><circle cx="14" cy="-14" r="14" {...cheio()} /><ellipse cx="-12" cy="12" rx="10" ry="7" {...cheio(0.4)} /><circle cx="-24" cy="8" r="4" {...f} /></>,
    // O triângulo da bandeira da Inconfidência.
    <><path d="M0-26L26 20H-26Z" {...f} /><path d="M-36-30v60" {...f} /></>,
  ],
  'romantic-poetry': [
    // "Três gerações: indianismo a denúncia": da pena à corrente partida.
    <><path d="M-32 18c0-16 4-30 8-36 4 6 8 20 8 36" {...cheio()} /><path d="M-8 0h10" {...f} /><path d="M2-4l6 4-6 4" {...f} /><ellipse cx="18" cy="-8" rx="6" ry="4" {...f} /><ellipse cx="26" cy="8" rx="6" ry="4" {...f} /><path d="M22-2l2 4" {...f} /></>,
    <><path d="M-14 24c-24-18-20-40-4-40 8 0 14 10 14 10s6-10 14-10c16 0 20 22-4 40l-10 8Z" {...cheio()} /></>,
    // "Navio Negreiro": o navio e a corrente.
    <><path d="M-32 6h64l-10 14h-44Z" {...f} /><path d="M-8 6V-28M-8-24l20 16H-8" {...f} />{[-24, -12, 0, 12, 24].map((x) => <ellipse key={x} cx={x} cy="30" rx="5" ry="3" {...f} />)}</>,
  ],
  'narrative-elements': [
    <><path d="M-34 24C-16 20-8 -22 6-26S26 16 34 24" {...f} /><circle cx="6" cy="-26" r="4" {...cheio(0.9)} /><text x="6" y="-32" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">clímax</text></>,
    <><circle cx="-22" cy="-4" r="13" {...f} /><circle cx="22" cy="-4" r="13" {...cheio()} /><path d="M9-4c4-9 22-9 26 0" {...f} /><text x="-22" y="26" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">plana</text><text x="22" y="26" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">redonda</text></>,
    <><circle cx="-16" cy="-4" r="16" {...f} /><path d="M-16-14v10l8 6" {...f} /><path d="M6 6c8-10 24-10 30 0-8 10-22 10-30 0Z" {...f} /><circle cx="21" cy="6" r="4" {...cheio(0.9)} /></>,
  ],
  realism: [
    <><circle cx="-6" cy="-6" r="18" {...f} /><path d="M7 7l20 20" {...f} /><path d="M-16-6h20M-6-16v20" {...f} /></>,
    <><circle r="26" {...f} /><circle cx="-9" cy="-6" r="3" {...cheio(0.9)} /><circle cx="9" cy="-6" r="3" {...cheio(0.9)} /><path d="M-10 10c6 4 14 2 18-4" {...f} /><path d="M4-16l10-4" {...f} /></>,
    <><circle cx="-18" r="14" {...f} /><path d="M-24-4c4-6 8 4 12-2M-26 4c4 4 10 0 14 4" {...f} /><path d="M6-16h28v32H6ZM12-16v32M20-16v32M28-16v32" {...f} /></>,
  ],
  naturalism: [
    <><path d="M0-30L30 22H-30Z" {...f} /><text x="0" y="-34" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">meio</text><text x="-30" y="36" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">raça</text><text x="30" y="36" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">momento</text></>,
    // O cortiço como personagem coletivo: fileira de casas coladas.
    <>{[-30, -10, 10].map((x) => <path key={x} d={`M${x} 24V-6l10-10 10 10v30`} {...f} />)}{[-25, -5, 15].map((x) => <rect key={x} x={x} y={6} width="10" height="18" {...cheio()} />)}<path d="M-36 24h72" {...f} /></>,
    <>{livro(0, 0, 1.3)}<path d="M-6-24l6 10-6 8 6 10-4 8" {...f} /></>,
  ],
  'eca-de-queiros': [
    <><path d="M-18 28h36M-12 28V2h24v26M-22 2h44l-6-10h-32Z" {...f} />{pessoa(0, -20, 0.6)}</>,
    <>{[-20, 0, 20].map((x, k) => <rect key={x} x={x - 8} y={-24 + k * 4} width="16" height={48 - k * 4} rx="2" {...f} />)}</>,
    <>{pena}<path d="M-30 8c10 4 20 4 30 0" {...f} /></>,
  ],
  parnassianism: [
    <path d="M-12-30h24M-8-30c0 8-16 10-16 28 0 16 10 26 24 30 14-4 24-14 24-30 0-18-16-20-16-28" {...f} />,
    // O ourives de Bilac: a gema lapidada e o martelo fino.
    <><path d="M-24-4l10-12h20l10 12-20 22Z" {...cheio()} /><path d="M-24-4h40M-14-16l6 12 6-12M-4 18l-4-22" {...f} /><path d="M16-26l16-6M22-28l6 14" {...f} /></>,
    <><circle r="28" {...f} /><circle r="18" {...f} /><circle r="8" {...cheio(0.9)} /><path d="M34-30L4-2" {...f} /></>,
  ],
  symbolism: [
    <><path d="M-34 10c10-8 20 8 30 0s20-8 30 0M-30 22c10-8 20 8 30 0s20-8 30 0" {...f} />{[[-18, -20], [4, -26], [22, -14]].map(([x, y]) => <path key={x} d={`M${x} ${y - 5}v10M${x - 5} ${y}h10`} {...f} />)}</>,
    <>{nota(-14, -6)}{nota(8, 2)}<path d="M-30 22c8-6 16 6 24 0s16-6 24 0 16 6 24 0" {...f} /></>,
    <><path d="M-30 28h12v-12h12v-12h12v-12h12v-12h12" {...f} /><circle cx="26" cy="-30" r="8" {...cheio()} /></>,
  ],
  'pre-modernism': [
    <><path d="M-34 0H34" {...f} /><path d="M-24-8v16M24-8v16" {...f} /><text x="-24" y="-14" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" stroke="none">1902</text><text x="24" y="-14" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" stroke="none">1922</text></>,
    // Os Sertões: o mandacaru no chão seco.
    <><path d="M0 28V-24M0 0h-12v-14M0-6h12v-12" {...f} /><path d="M-30 28h60" {...f} /><path d="M-24 28l6-6 6 6 6-6" {...f} /></>,
    <>{pena}{balao(14, -16)}</>,
  ],
  'modern-art-week': [
    <><path d="M-30 24h60M-26 24V-4h52v28M-30-4l30-20 30 20" {...f} />{[-16, 0, 16].map((x) => <path key={x} d={`M${x} 24V4`} {...f} />)}<text x="0" y="-8" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor" stroke="none">1922</text></>,
    <><path d="M-26 12c-6-24 18-40 38-30s14 30-4 30c-8 0-6 10-14 10s-14-2-20-10Z" {...f} />{[[-12, -10], [4, -16], [14, -2]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" {...cheio(0.7)} />)}</>,
    <>{folha(0, 0)}<path d="M-18-30l10 6" {...f} /></>,
  ],
  'modernism-first-generation': [
    <><path d="M4-32L-14 2h14L-6 32 16-6H2Z" {...cheio()} /></>,
    // Manifesto Antropófago: a boca que devora e transforma.
    <><path d="M-30 0c10-20 50-20 60 0-10 20-50 20-60 0Z" {...f} />{[-18, -6, 6, 18].map((x) => <path key={x} d={`M${x}-10l4 8 4-8M${x} 10l4-8 4 8`} {...f} />)}</>,
    <>{pessoa(0, 4, 1.1)}<path d="M-26-30h52" {...f} /></>,
  ],
  'modernism-second-generation': [
    <>{pessoa(-10, 6, 0.9)}<circle cx="16" cy="-20" r="10" {...f} /><circle cx="6" cy="-8" r="3" {...f} /></>,
    <>{[-20, 0, 20].map((x) => <g key={x} transform={`translate(${x} 0) scale(0.6)`}>{pena}</g>)}</>,
    <><circle r="26" {...f} /><path d="M-26 0h52M0-26c-12 12-12 40 0 52M0-26c12 12 12 40 0 52" {...f} /><path d="M20-30l12-8-4 14Z" {...cheio(0.8)} /></>,
  ],
  'concrete-poetry': [
    <><path d="M-30-16h60M-30-4h60M-30 8h40" {...f} /><path d="M-34 24L34-28" {...f} /></>,
    // A palavra como objeto: as letras dispostas no espaço, sem verso.
    <>{['V', 'E', 'R', 'B', 'O'].map((l, k) => <text key={l} x={-24 + k * 12} y={-18 + k * 10} textAnchor="middle" fontSize="15" fontWeight="900" fill="currentColor" stroke="none">{l}</text>)}</>,
    <><path d="M-30 28h60" {...f} /><path d="M-10 28V-26h6v54M4 28V-26h6v54" {...f} /><path d="M-30 12c8-6 16-6 20 0M10 12c6-6 14-6 20 0" {...f} /></>,
  ],
  'prose-1960-1980': [
    <><circle r="24" {...f} /><rect x="-28" y="-8" width="56" height="12" {...cheio(0.9)} /></>,
    <>{[-26, -10, 6, 20].map((x, k) => <rect key={x} x={x} y={-20 + (k % 2) * 10} width="12" height={46 - (k % 2) * 10} {...f} />)}<path d="M-34 26h68M-4-30l8 10-8 6 8 10" {...f} /></>,
    <><rect x="-26" y="-6" width="52" height="30" rx="4" {...f} /><path d="M-8-6v-8h16v8" {...f} />{folha(0, -2)}</>,
  ],
  'lusophone-contemporary': [
    <>{balao(-12, -8)}{balao(14, 14)}</>,
    // "África lusófona: Mia Couto, Agualusa" — dois autores, dois livros.
    <>{livro(-14, -4, 0.9)}{livro(14, -4, 0.9)}<text y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" stroke="none">África</text></>,
    <>{livro(0, 0, 1.2)}{pena}</>,
  ],
  'brazilian-visual-arts': [
    <><path d="M-16 30l12-44M16 30L4-14M-20 10h40" {...f} /><rect x="-18" y="-30" width="36" height="24" {...f} /></>,
    // Abaporu: o pé enorme e o sol.
    <><path d="M-24 28c0-10 6-12 16-12s18 2 18 8-6 6-14 6h-20Z" {...cheio()} /><path d="M-10 16c0-20 4-34 8-38" {...f} /><circle cx="22" cy="-22" r="9" {...cheio(0.6)} /></>,
    <><path d="M-24 0l24-24 24 24-24 24Z" {...f} /><path d="M0-24v48M-24 0h48" {...f} /><path d="M-24 0l-10 10M24 0l10-10" {...f} /></>,
  ],
  'brazilian-theater': [
    <><path d="M-34-28h68M-34-28v56M34-28v56M-34-28c8 20 18 30 22 56M34-28c-8 20-18 30-22 56" {...f} /></>,
    // Vestido de Noiva: três planos simultâneos no mesmo palco.
    <>{[0, 1, 2].map((k) => <path key={k} d={`M${-30 + k * 6} ${18 - k * 16}h${48}l12-10h-48Z`} {...(k === 1 ? cheio() : f)} />)}</>,
    <><circle r="26" {...f} />{pessoa(-8, 4, 0.6)}{pessoa(10, 4, 0.6)}</>,
  ],
  'popular-songbook': [
    <><path d="M-32-12h64M-32-4h64M-32 4h64M-32 12h64" {...f} />{nota(-12, -4)}{nota(12, -10)}</>,
    <><circle cx="-12" r="16" {...f} /><circle cx="-12" r="10" {...f} /><path d="M10 20l20-44M24-24l10 4" {...f} /><path d="M4 10c6-6 14-6 16 4" {...f} /></>,
    // "Canção e censura: Cálice".
    <><path d="M-18-26h36c0 20-8 30-18 30S-18-6-18-26ZM0 4v18M-12 26h24" {...f} /></>,
  ],
};
