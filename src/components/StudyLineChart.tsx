import { useId } from 'react';
import type { StudyVisual } from '../lib/studyVisual';
type Line = Extract<StudyVisual,{type:'line'}>;
const format = (v:number) => v!==0 && (Math.abs(v)>=10000 || Math.abs(v)<.01) ? v.toExponential(1).replace('.',',') : Number(v.toPrecision(3)).toLocaleString('pt-BR');
export function StudyLineChart({visual}:{visual:Line}) {
 const id=useId();
 const points=visual.series.flatMap(s=>s.points);
 const minX=Math.min(...points.map(p=>p.x)), maxX=Math.max(...points.map(p=>p.x));
 let minY=Math.min(...points.map(p=>p.y)), maxY=Math.max(...points.map(p=>p.y));
 if(minY===maxY){const pad=Math.max(1,Math.abs(minY)*.1);minY-=pad;maxY+=pad;}
 const x=(v:number)=>62+(v-minX)/(maxX-minX)*300;
 const y=(v:number)=>220-(v-minY)/(maxY-minY)*175;
 const colors=['#234d40','#963c43','#285c80','#755222'];
 return <div>
  <svg viewBox="0 0 400 290" role="img" aria-labelledby={`${id}-title ${id}-description`} style={{display:'block',width:460,maxWidth:'100%',margin:'0 auto',height:'auto',background:'#fff',color:'#172b24',fontFamily:'inherit'}}>
   <title id={`${id}-title`}>{visual.title}</title><desc id={`${id}-description`}>{visual.xLabel}; {visual.yLabel}. {visual.caption}</desc>
   {[0,1,2,3,4].map(i=>{const t=i/4;return <g key={i} fontSize="16" fill="currentColor">
    <line x1="62" x2="362" y1={220-t*175} y2={220-t*175} stroke="#d9e1dc"/>
    <text x="54" y={224-t*175} textAnchor="end">{format(minY+t*(maxY-minY))}</text>
    <text x={62+t*300} y="239" textAnchor="middle">{format(minX+t*(maxX-minX))}</text>
   </g>;})}
   <path d="M62 45V220H362" fill="none" stroke="#172b24"/>
   <text x="212" y="271" textAnchor="middle" fontSize="17">{visual.xLabel}</text>
   <text transform="translate(16 133) rotate(-90)" textAnchor="middle" fontSize="17">{visual.yLabel}</text>
   {visual.series.map((series,index)=><g key={series.label} fill="none" stroke={colors[index]} strokeWidth="2.5">
    <polyline strokeDasharray={['none','7 4','2 4','9 3 2 3'][index]} points={series.points.map(p=>`${x(p.x)},${y(p.y)}`).join(' ')}/>
    {series.points.map((p,i)=><circle key={i} cx={x(p.x)} cy={y(p.y)} r="3" fill={colors[index]}/>)}
   </g>)}
  </svg>
  <details data-visual-data data-print-exclude><summary style={{cursor:'pointer',padding:'8px 0'}}>Ver valores do gráfico</summary>
   {visual.series.map((series,index)=><div key={series.label}>
    <p style={{fontWeight:600}}>{index+1}. {series.label}</p>
    <table style={{width:'100%',tableLayout:'fixed'}}><thead><tr><th>{visual.xLabel}</th><th>{visual.yLabel}</th></tr></thead><tbody>{series.points.map((p,i)=><tr key={i}><td>{format(p.x)}</td><td>{format(p.y)}</td></tr>)}</tbody></table>
   </div>)}
  </details>
  <p>{visual.series.map((s,i)=>`${i+1}. ${s.label} (${['linha contínua','traços longos','pontilhada','traço e ponto'][i]})`).join(' · ')}</p>
 </div>;
}
