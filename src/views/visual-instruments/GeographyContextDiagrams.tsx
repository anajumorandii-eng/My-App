import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { GeographyContext } from '../../lib/geographyContextLab';
import './GeographyContextDiagrams.css';

export const GEOGRAPHY_CONTEXT_DIAGRAM_IDS: ReadonlySet<string> = new Set([
  'summary-geografia-energia-eletrica-no-brasil',
  'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
  'summary-geografia-os-fluxos-do-comercio-externo',
  'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil',
]);

const labels: Record<string, [string, string, string]> = {
  'summary-geografia-energia-eletrica-no-brasil': ['geração', 'rede', 'consumo'],
  'summary-geografia-estrutura-etnica-e-fluxos-migratorios': ['origem', 'trajeto', 'destino'],
  'summary-geografia-os-fluxos-do-comercio-externo': ['produção', 'porto', 'mercado'],
  'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil': ['carbono fóssil', 'carbono recente', 'ciclo de vida'],
};

function Electricity() {
  return <g>
    <path d="M35 185h57v-55l-28-18-29 18Z" className="gcd-object" /><path d="M53 112V92h18v27M49 150h28M49 164h28" className="gcd-line" />
    <path d="M115 186l22-81 22 81m-33-49h22m-29 24h37M137 105v-19" className="gcd-line" />
    <path d="M158 115h31m-31 27h31m-31 27h31" className="gcd-wire" />
    <path d="M219 185v-72l29-18 29 18v72Z" className="gcd-object" /><path d="M235 130h10v14h-10Zm17 0h10v14h-10Zm-17 28h10v14h-10Zm17 0h10v14h-10Z" className="gcd-window" />
    <text x="160" y="54" textAnchor="middle" className="gcd-note">oferta ↔ demanda</text>
    <path d="M92 147h21M190 147h27" className="gcd-flow" />
  </g>;
}

function Migration() {
  return <g>
    <path d="M28 186v-54l27-20 28 20v54Zm13-39h13v16H41Z" className="gcd-object" />
    <path d="M93 149C130 98 191 99 226 149" className="gcd-route" />
    <path d="M208 186v-87h57v87m-45-70h12m12 0h12m-36 19h12m12 0h12m-36 19h12m12 0h12" className="gcd-line" />
    <circle cx="157" cy="119" r="9" className="gcd-waypoint" />
    <text x="160" y="67" textAnchor="middle" className="gcd-note">transporte + redes de apoio</text>
    <path d="M217 198C172 223 123 221 83 198" className="gcd-return" />
    <text x="160" y="235" textAnchor="middle" className="gcd-small">vínculos com a origem podem continuar</text>
  </g>;
}

function Trade() {
  return <g>
    <path d="M29 185v-47h17v-21h18v21h23v47Z" className="gcd-object" /><path d="M37 151h42m-42 13h42" className="gcd-line" />
    <path d="M114 181h83l-17 23h-52Z" className="gcd-ship" /><path d="M145 177v-49h39v49m-39-31h39" className="gcd-line" />
    <path d="M223 185v-71h55v71m-43-54h10m15 0h10m-35 21h10m15 0h10" className="gcd-line" />
    <path d="M88 156h24m88 0h21" className="gcd-flow" />
    <text x="160" y="65" textAnchor="middle" className="gcd-note">o custo do corredor altera o preço final</text>
    <path d="M124 209q24-10 48 0t48 0" className="gcd-wave" />
  </g>;
}

function Fuels() {
  return <g>
    <path d="M27 174H288" className="gcd-ground" />
    <path d="M42 201h60v22H42Z" className="gcd-fossil" /><path d="M71 201v-52h27" className="gcd-line" />
    <path d="M162 173v-56m0 23q-38-4-31-29 24-11 31 14m0 13q38-4 31-29-24-11-31 14" className="gcd-plant" />
    <path d="M217 187h54v32h-54zM227 187v-26h34v26" className="gcd-object" />
    <path d="M102 196h28m63 0h24" className="gcd-flow" />
    <path d="M117 94C138 70 182 69 206 94" className="gcd-return" />
    <text x="160" y="65" textAnchor="middle" className="gcd-note">carbono recente não zera impactos</text>
    <text x="160" y="238" textAnchor="middle" className="gcd-small">solo, cultivo e transporte mudam o balanço</text>
  </g>;
}

const drawings: Record<string, React.ComponentType> = {
  'summary-geografia-energia-eletrica-no-brasil': Electricity,
  'summary-geografia-estrutura-etnica-e-fluxos-migratorios': Migration,
  'summary-geografia-os-fluxos-do-comercio-externo': Trade,
  'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil': Fuels,
};

export function GeographyContextDiagram({ config, index }: { config: GeographyContext; index: number }) {
  const reduced = useReducedMotion();
  const Drawing = drawings[config.chapterId];
  const names = labels[config.chapterId];
  return <svg className="vs-plane gcd-diagram" viewBox="0 0 320 270" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-geography-context={config.chapterId}>
    <defs><marker id="gcd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4 0 8Z" className="gcd-arrowhead" /></marker></defs>
    <rect x="6" y="7" width="308" height="255" rx="12" className="gcd-paper" />
    <motion.rect y="78" width="96" height="151" rx="16" className="gcd-spotlight" initial={false} animate={{ x: 10 + index * 101 }} transition={{ duration: reduced ? 0 : .25 }} />
    <Drawing />
    {names.map((name, i) => <motion.g key={name} initial={false} animate={{ opacity: index === i ? 1 : .62 }} transition={{ duration: reduced ? 0 : .2 }}>
      <rect x={14 + i * 101} y="15" width="94" height="25" rx="10" className={index === i ? 'gcd-tab gcd-tab-active' : 'gcd-tab'} />
      <text x={61 + i * 101} y="32" textAnchor="middle" className="gcd-tab-label">{name}</text>
    </motion.g>)}
  </svg>;
}
