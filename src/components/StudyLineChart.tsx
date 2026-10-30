import { useId } from 'react';
import type { StudyVisual } from '../lib/studyVisual';
import { figureInk, seriesDash, seriesDashName, seriesInk } from '../lib/figureInk';
import { niceScale } from '../lib/niceScale';
import { useFigureText } from './useFigureText';
type Line = Extract<StudyVisual,{type:'line'}>;
// Sinal de menos tipográfico: o hífen de toLocaleString parece traço de separação no eixo.
const format = (v:number) => (v!==0 && (Math.abs(v)>=10000 || Math.abs(v)<.01) ? v.toExponential(1).replace('.',',') : Number(v.toPrecision(3)).toLocaleString('pt-BR')).replace(/^-/,'−');

/**
 * Curvas no traço das pranchas: eixos em tinta, grade pontilhada na cor da
 * linha das tabelas, séries distintas por cor e por padrão de traço (a cor
 * some no PDF em preto e branco; o traço não).
 */
export function StudyLineChart({visual}:{visual:Line}) {
 const id=useId();
 const {ref,fs}=useFigureText<SVGSVGElement>(400);
 const points=visual.series.flatMap(s=>s.points);
 const xs=niceScale(Math.min(...points.map(p=>p.x)),Math.max(...points.map(p=>p.x)),6);
 const ys=niceScale(Math.min(...points.map(p=>p.y)),Math.max(...points.map(p=>p.y)),8);
 const x=(v:number)=>66+(v-xs.min)/(xs.max-xs.min)*306;
 const y=(v:number)=>214-(v-ys.min)/(ys.max-ys.min)*170;
 return <div>
  <svg ref={ref} viewBox="0 0 400 280" role="img" aria-labelledby={`${id}-title ${id}-description`} className="crivo-chart">
   <title id={`${id}-title`}>{visual.title}</title><desc id={`${id}-description`}>{visual.xLabel}; {visual.yLabel}. {visual.caption}</desc>
   {ys.ticks.map(v=><g key={`y${v}`} fontSize={fs(13)} fill={figureInk.muted}>
    {v!==ys.min && <line x1="66" x2="372" y1={y(v)} y2={y(v)} stroke={figureInk.line} strokeDasharray="2 4"/>}
    <text x="58" y={y(v)+4} textAnchor="end">{format(v)}</text>
   </g>)}
   {/* Com dados dos dois lados do zero, o zero é referência de leitura (−20 °C, saldo negativo). */}
   {ys.min<0 && ys.max>0 && <line x1="66" x2="372" y1={y(0)} y2={y(0)} stroke={figureInk.muted} strokeWidth="1"/>}
   {xs.ticks.map(v=><text key={`x${v}`} x={x(v)} y="234" textAnchor="middle" fontSize={fs(13)} fill={figureInk.muted}>{format(v)}</text>)}
   <path d="M66 38V214H376" fill="none" stroke={figureInk.ink} strokeWidth="1.2"/>
   <path d="M62 44l4-7 4 7M370 210l7 4-7 4" fill="none" stroke={figureInk.ink} strokeWidth="1.2" strokeLinejoin="round"/>
   <text x="219" y="264" textAnchor="middle" fontSize={fs(14)} fill={figureInk.ink} fontStyle="italic">{visual.xLabel}</text>
   <text transform="translate(16 126) rotate(-90)" textAnchor="middle" fontSize={fs(14)} fill={figureInk.ink} fontStyle="italic">{visual.yLabel}</text>
   {visual.series.map((series,index)=><g key={series.label} fill="none" stroke={seriesInk[index]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline strokeDasharray={seriesDash[index]} points={series.points.map(p=>`${x(p.x)},${y(p.y)}`).join(' ')}/>
    {series.points.map((p,i)=><circle key={i} cx={x(p.x)} cy={y(p.y)} r="2.8" fill="var(--fig-paper-dot, #fffdf8)" strokeWidth="1.6"/>)}
   </g>)}
  </svg>
  <ul className="crivo-chart__legend">
   {visual.series.map((s,i)=><li key={s.label}>
    <svg width="28" height="10" aria-hidden="true"><line x1="1" x2="27" y1="5" y2="5" stroke={seriesInk[i]} strokeWidth="2.2" strokeDasharray={seriesDash[i]}/></svg>
    <span>{i+1}. {s.label} ({seriesDashName[i]})</span>
   </li>)}
  </ul>
  <details data-visual-data data-print-exclude className="crivo-chart__data"><summary>Ver valores do gráfico</summary>
   {visual.series.map((series,index)=><div key={series.label}>
    <p style={{fontWeight:600,margin:'8px 0 0'}}>{index+1}. {series.label}</p>
    <table><thead><tr><th>{visual.xLabel}</th><th>{visual.yLabel}</th></tr></thead><tbody>{series.points.map((p,i)=><tr key={i}><td>{format(p.x)}</td><td>{format(p.y)}</td></tr>)}</tbody></table>
   </div>)}
  </details>
 </div>;
}
