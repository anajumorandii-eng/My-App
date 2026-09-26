import React, { useState } from 'react';
import { imagemDeLenteConvergente } from '../../lib/opticalImage';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export function lensRays(distance: number, focal = 70) {
  const lens = 260, axis = 205, height = 38, end = 490;
  const image = imagemDeLenteConvergente(distance, height, focal);
  return {
    lens, axis, focal, height, objectX: lens - distance,
    imageX: lens + image.distancia, imageY: axis - image.altura, image,
    parallel: `M${lens - distance} ${axis - height}H${lens}L${end} ${axis - height + (end - lens) * height / focal}`,
    central: `M${lens - distance} ${axis - height}L${end} ${axis + (end - lens) * height / distance}`,
  };
}

export default function LensMechanism() {
  const [distance, setDistance] = useState(175);
  const [focal, setFocal] = useState(70);
  const clock = useMechanismTime();
  const atFocus = distance === focal;
  const r = lensRays(distance, focal);
  const choices = [[175, 'Além de 2F'], [140, 'Em 2F'], [105, 'Entre F e 2F'], [70, 'Em F'], [42, 'Entre F e a lente']] as const;
  const reveal = clock.time;
  const fmt = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  return <MechanismFrame note="Lente delgada em aproximação paraxial. Distâncias relativas; o traçado é geométrico, sem escala de tempo. No foco de uma convergente, os raios emergem paralelos e não há imagem a distância finita." controls={<>
    <div className="mechanism-options" role="group" aria-label="Tipo de lente">{[70,-70].map(f=><button type="button" key={f} aria-pressed={focal===f} onClick={()=>{clock.seek(0);setFocal(f);}}>{f>0?'Convergente':'Divergente'}</button>)}</div>
    <h3>{atFocus ? 'Os raios emergem paralelos.' : r.image.real ? 'Os raios encontram a imagem.' : 'Os prolongamentos encontram a imagem.'}</h3>
    <div className="mechanism-options" role="group" aria-label="Posição do objeto">{choices.map(([value, label]) => <button type="button" key={value} aria-pressed={distance === value} onClick={() => { clock.seek(0); setDistance(value); }}>{focal>0 ? label : `p = ${value}`}</button>)}</div>
    <p role="status">p = {distance}; f = {focal}. {atFocus ? 'Sem imagem a distância finita.' : <>p′ = {fmt(r.image.distancia)}. Imagem {r.image.real ? 'real e invertida' : 'virtual e direita'}, {fmt(r.image.ampliacao)}× o tamanho do objeto.</>}</p>
    <p>{atFocus ? 'O objeto está no plano focal. Os raios emergentes não se encontram a uma distância finita.' : r.image.real ? 'A luz segue para a direita. Os raios emergentes se cruzam e a imagem pode ser projetada em uma tela.' : 'A luz continua para a direita. As linhas tracejadas voltam apenas na construção geométrica: não são luz retornando pela lente.'}</p>
    <TimeControl clock={clock} label="Construção do traçado" />
  </>}>
    <svg viewBox="0 0 520 440" role="img" aria-label={atFocus ? 'Lente convergente: objeto no foco, raios emergentes paralelos' : `Lente ${focal>0?'convergente':'divergente'}: imagem ${r.image.real ? 'real e invertida' : 'virtual e direita'}, objeto a ${distance} unidades`}>
      <text x="25" y="30" className="mf-heading">LENTES / SIGA OS RAIOS</text>
      <path d="M25 205H500" className="mf-axis" />
      <path d={focal>0?'M260 80Q290 205 260 330Q230 205 260 80Z':'M240 80Q265 205 240 330H280Q255 205 280 80Z'} fill="color-mix(in srgb,var(--mf-blue) 12%,var(--vs-paper))" stroke="var(--mf-blue)" strokeWidth="2" />
      {[-2,-1,1,2].map(n => <g key={n}><circle cx={260 + n * 70} cy="205" r="3" fill="var(--vs-ink)" /><text x={260 + n * 70} y="231" textAnchor="middle">{Math.abs(n) === 2 ? '2F' : 'F'}{(focal>0 ? n>0 : n<0) ? '′' : ''}</text></g>)}
      <path d={`M${r.objectX} 205V167m-5 7 5-7 5 7`} stroke="var(--mf-green)" strokeWidth="3" fill="none" /><text x={r.objectX} y="150" textAnchor="middle">objeto</text>
      <g aria-label="Raios reais seguem para a direita" fill="none" strokeWidth="2">
        <path d={r.parallel} stroke="var(--mf-gold)" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - Math.min(1, .15 + reveal * 1.7)} />
        <path d={r.central} stroke="var(--mf-blue)" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - Math.max(.15, (reveal - .35) / .65)} />
      </g>
      {!atFocus && !r.image.real && <g aria-label="Prolongamentos virtuais, sem propagação de luz" fill="none" strokeDasharray="5 5" opacity={.3 + .7 * reveal}>
        <path d={`M260 167L${r.imageX} ${r.imageY}`} stroke="var(--mf-gold)" />
        <path d={`M260 205L${r.imageX} ${r.imageY}`} stroke="var(--mf-blue)" />
      </g>}
      {!atFocus && <g opacity={.25 + .75 * reveal}>
        <path d={`M${r.imageX} 205V${r.imageY}m-5 ${r.image.real ? -7 : 7} 5 ${r.image.real ? 7 : -7} 5 ${r.image.real ? -7 : 7}`} stroke="var(--mf-red)" strokeWidth="3" fill="none" />
        <text x={r.imageX} y={r.imageY + (r.image.real ? 24 : -15)} textAnchor="middle">imagem</text>
      </g>}
      <path d="M345 70H440l-9-5m9 5-9 5" stroke="var(--vs-ink)" fill="none" /><text x="390" y="56" textAnchor="middle">luz →</text>
      <text x="260" y="388" textAnchor="middle">{atFocus ? 'Raios emergentes paralelos' : r.image.real ? 'Encontro dos raios reais' : 'Encontro dos prolongamentos'}</text>
      <text x="260" y="418" textAnchor="middle">1/f = 1/p + 1/p′</text>
    </svg>
  </MechanismFrame>;
}
