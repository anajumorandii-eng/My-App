import React from 'react';
import { motion } from 'motion/react';
import type { SceneEntry } from '../types';
import { useSceneMotion } from '../useSceneMotion';
import { FenomenoFrame, FOCO, type Cena, type CenaFenomeno } from './FenomenoFrame';
import './FisicaFenomenos.css';

// "Estática" caía em `criterios-conjuntivos`, que só mostra cartões de texto:
// era o único capítulo de Física sem nenhum elemento desenhado (auditoria 37).
// O fenômeno é visual — corpo extenso, forças em pontos diferentes, braço de
// alavanca —, então a cena desenha as três situações da citação. F e d são
// símbolos genéricos: a citação trata do critério, não de um caso numérico.

const Ponta = ({ id, cls = 'qf-ponta' }: { id: string; cls?: string }) => <marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" className={cls} /></marker>;

function Estatica({ ativo, t }: Cena) {
  const quadros = [
    {
      nome: 'Translação', x: 12, legenda: ['forças somam zero:', 'o centro não sai do lugar'], desenho: <>
        <rect x={32} y={118} width={110} height={16} rx="4" className="ff-barra" />
        {/* Um path por seta: o marker só pousa no fim do último subcaminho. */}
        <path d="M40 176V138" className="ff-forca" markerEnd="url(#ff-ponta)" /><path d="M134 176V138" className="ff-forca" markerEnd="url(#ff-ponta)" />
        <path d="M87 134V178" className="ff-peso" markerEnd="url(#ff-ponta-peso)" />
        <text x={40} y={192} textAnchor="middle" className="qf-mini">F</text><text x={134} y={192} textAnchor="middle" className="qf-mini">F</text>
        <text x={98} y={170} className="qf-mini">P = 2F</text>
      </>,
    },
    {
      nome: 'Rotação', x: 166, legenda: ['F₁·d₁ = F₂·d₂:', 'os torques se anulam'], desenho: <>
        <path d="M243 150l-12 22h24Z" className="ff-apoio" />
        <rect x={183} y={134} width={120} height={14} rx="4" className="ff-barra" />
        {/* d₂ = 2·d₁ e o bloco da esquerda é o dobro: F₁·d₁ = F₂·d₂ de fato. */}
        <path d="M215 112v20" className="ff-peso" markerEnd="url(#ff-ponta-peso)" /><rect x={204} y={94} width={22} height={18} rx="3" className="ff-massa" />
        <path d="M299 120v12" className="ff-peso" markerEnd="url(#ff-ponta-peso)" /><rect x={293} y={108} width={12} height={12} rx="3" className="ff-massa" />
        <path d="M215 186H243M215 180v12M243 180v12" className="ff-braco" /><path d="M243 186H299M299 180v12" className="ff-braco" />
        <text x={229} y={204} textAnchor="middle" className="qf-mini">d₁</text><text x={271} y={204} textAnchor="middle" className="qf-mini">d₂ = 2d₁</text>
        <text x={215} y={88} textAnchor="middle" className="qf-mini">F₁ = 2F₂</text><text x={299} y={102} textAnchor="middle" className="qf-mini">F₂</text>
      </>,
    },
    {
      nome: 'Um critério só não basta', x: 320, legenda: ['ΣF = 0, mas o torque', 'não se anula: gira'], desenho: <>
        <rect x={340} y={128} width={110} height={16} rx="4" className="ff-barra" />
        <path d="M350 176V148" className="ff-forca" markerEnd="url(#ff-ponta)" />
        <path d="M440 96V124" className="ff-forca" markerEnd="url(#ff-ponta)" />
        <text x={350} y={190} textAnchor="middle" className="qf-mini">F</text><text x={440} y={90} textAnchor="middle" className="qf-mini">F</text>
        <path d="M372 108a36 36 0 0 1 50 -4" className="ff-giro" markerEnd="url(#ff-ponta-giro)" />
      </>,
    },
  ];
  return <g>
    <defs><Ponta id="ff-ponta" /><Ponta id="ff-ponta-peso" cls="ff-ponta-azul" /><Ponta id="ff-ponta-giro" /></defs>
    {quadros.map((q) => {
      const ligado = q.nome === ativo;
      return <motion.g key={q.nome} initial={false} animate={FOCO(ligado)} transition={t}>
        <rect x={q.x} y={40} width={148} height={230} rx="10" className={ligado ? 'qf-quadro qf-quadro--ativo' : 'qf-quadro'} />
        {q.nome.split(' ').length > 2
          ? <><text x={q.x + 10} y={60} className="qf-rotulo qf-rotulo--forte">Um critério só</text><text x={q.x + 10} y={74} className="qf-rotulo qf-rotulo--forte">não basta</text></>
          : <text x={q.x + 10} y={60} className="qf-rotulo qf-rotulo--forte">{q.nome}</text>}
        {q.desenho}
        {q.legenda.map((l, k) => <text key={k} x={q.x + 74} y={232 + k * 14} textAnchor="middle" className="qf-mini">{l}</text>)}
      </motion.g>;
    })}
    <text x={240} y={292} textAnchor="middle" className="qf-texto">equilíbrio estático pede as duas condições juntas</text>
  </g>;
}

export const FISICA_FENOMENO_CENAS: Record<string, CenaFenomeno> = {
  'summary-fisica-estatica': { cena: Estatica, rotulos: ['Translação', 'Rotação', 'Um critério só não basta'], titulo: 'equilíbrio de corpo extenso' },
};
export const FISICA_FENOMENO_IDS = new Set(Object.keys(FISICA_FENOMENO_CENAS));

export function FisicaFenomenos({ entry }: { entry: SceneEntry }) {
  const t = useSceneMotion();
  return <FenomenoFrame entry={entry} cenas={FISICA_FENOMENO_CENAS} t={t} />;
}
