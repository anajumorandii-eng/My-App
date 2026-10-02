import React,{useState}from'react';import BoardShell from'../visual-boards/BoardShell';import{boardPair}from'../visual-boards/pair';import{STAGE_LABEL}from'../../lib/visualStudy';import{REMAINING,type RemainingId}from'../../lib/remainingMath';import type{BoardProps}from'../visual-boards/types';
function short(t?:string){const s=t?.trim().split(/(?<=[.!?])\s/)[0]??'';return s.length>180?`${s.slice(0,176)}…`:s}const ink={stroke:'var(--vs-ink)',strokeWidth:2,fill:'none'} as const;const red={stroke:'var(--vs-burgundy)',strokeWidth:3,fill:'none'} as const;const tx={fontSize:14,fontWeight:800,fill:'var(--vs-ink)'} as const;
function Scene({id,v}:{id:RemainingId;v:number}){if(id==='fila'||id==='grupo')return <>{[0,1,2,3,4,5].map(i=><g key={i}><circle cx={55+i*42} cy={id==='fila'?145:145+(i%2)*42} r="14" fill={i<v?'var(--vs-burgundy)':'var(--vs-paper)'} stroke="var(--vs-ink)"/><text x={55+i*42} y={150+(id==='grupo'?(i%2)*42:0)} textAnchor="middle" style={tx}>{i+1}</text></g>)}<text x="160" y="255" textAnchor="middle" style={tx}>{id==='fila'?'ordem importa':'ordem não importa'}</text></>;
if(id==='prob'){
 const gap=[132,82,45,0][v], ax=160-gap/2,bx=160+gap/2;
 const onlyA: number[][][]=[[[74,110],[105,110],[74,150],[105,150]],[[95,105],[115,130],[95,155]],[[100,110],[100,150]],[[102,130]]];
 const onlyB: number[][][]=[[[210,110],[240,110],[226,155]],[[222,110],[222,150]],[[215,130]],[]];
 const both: number[][][]=[[],[[160,130]],[[160,110],[160,150]],[[145,110],[175,110],[160,150]]];
 const outside=Array.from({length:3+v},(_,i)=>[45+i*230/(2+v),223]);
 const outcomes=[...onlyA[v],...both[v],...onlyB[v],...outside];
 return <g data-geometry="event-sets" data-intersection={v}>
 <rect x="18" y="38" width="284" height="207" rx="12" {...ink}/>
 <circle cx={ax} cy="130" r="64" {...red}/><circle cx={bx} cy="130" r="52" {...ink}/>
 <text x="45" y="58" style={tx}>A: 4/10</text><text x="211" y="58" style={tx}>B: 3/10</text>
 {outcomes.map(([x,y],i)=><text key={i} data-outcome={i+1} x={x} y={y+5} textAnchor="middle" style={tx}>{i+1}</text>)}
 <text x="160" y="264" textAnchor="middle" style={tx}>A ∩ B: {v} · A ∪ B: {7-v}</text>
 <text x="160" y="288" textAnchor="middle" style={tx}>10 resultados equiprováveis</text></g>;
}
if(id==='eventos'){
 const gap=v===1?130:86;
 return <g data-geometry="event-sets" data-intersection={v===1?0:.25}>
 <circle cx={160-gap/2} cy="132" r="58" {...red}/><circle cx={160+gap/2} cy="132" r="58" {...ink}/>
 <text x="160" y="55" textAnchor="middle" style={tx}>P(A) = P(B) = 0,5</text>
 <text x={160-gap/2-20} y="137" style={tx}>A</text><text x={160+gap/2+15} y="137" style={tx}>B</text>
 <text x="160" y="222" textAnchor="middle" style={tx}>P(A ∩ B) = {v===1?'0':'0,25'}</text>
 <text x="160" y="255" textAnchor="middle" style={tx}>{v===1?'eventos disjuntos':'eventos independentes'}</text>
 <text x="160" y="281" textAnchor="middle" style={tx}>diagrama qualitativo</text></g>;
}
if(id==='estatistica')return <>{[2,4,4,5,v].map((n,i)=><rect key={i} x={48+i*45} y={230-n*8} width="28" height={n*8} fill="var(--vs-burgundy)" opacity={i===4 ? .9 : .45}/>)}<path d="M40 232H280" {...ink}/><text x="160" y="270" textAnchor="middle" style={tx}>amostra ordenada</text></>;
if(id==='trig-poligonos'){
 const radius=v*12, points=[-90,35,155].map(a=>{const t=a*Math.PI/180;return `${160+radius*Math.cos(t)},${137+radius*Math.sin(t)}`}).join(' ');
 return <g><circle data-geometry="circumcircle" cx="160" cy="137" r={radius} {...ink}/><polygon data-geometry="inscribed-triangle" points={points} {...red}/><path d={`M160 137H${160+radius}`} {...ink}/><text x="160" y="265" textAnchor="middle" style={tx}>R = {v} · razão comum = {2*v}</text></g>;
}
if(id==='trig-outras'){
 const t=v*Math.PI/180, dx=175*Math.cos(t),dy=175*Math.sin(t);
 return <g><polygon data-geometry="tangent-triangle" points={`55,225 ${55+dx},225 ${55+dx},${225-dy}`} {...red}/><path d={`M85 225 A30 30 0 0 0 ${55+30*Math.cos(t)} ${225-30*Math.sin(t)}`} {...ink}/><text x="88" y="206" style={tx}>θ</text><text x="160" y="265" textAnchor="middle" style={tx}>θ = {v}° · tan θ = {Math.round(Math.tan(t)*100)/100}</text></g>;
}
if(id==='espaco')return <g>
 <g data-geometry="space-lines">
 {v===3&&<g data-depth="different-planes"><path d="M35 115L155 65L285 130L165 180Z" fill="var(--vs-ink)" opacity=".08"/><path d="M35 180L155 130L285 195L165 245Z" fill="var(--vs-burgundy)" opacity=".12"/><path d="M160 124V187" stroke="var(--vs-ink-muted)" strokeDasharray="4 4"/></g>}
 <path d={v===3?'M70 112L245 135':'M60 115L260 185'} {...red}/>
 <path d={v===1?'M60 165L260 235':v===2?'M60 215L260 85':'M70 190L240 185'} {...ink}/>
 </g><text x="160" y="270" textAnchor="middle" style={tx}>{['','paralelas: mesmo plano','concorrentes: ponto comum','reversas: planos distintos'][v]}</text></g>;
if(id==='conicas'){
 const plane=v===1?{x1:180,y1:55,x2:180,y2:249}:v===2?{x1:109,y1:61,x2:204,y2:179}:{x1:87,y1:108,x2:233,y2:108};
 return <g data-detail="cone-section"><path d="M65 33L255 33L160 151L65 269L255 269L160 151Z" fill="none" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M160 33V269" stroke="var(--vs-ink-muted)" strokeDasharray="5 5" strokeWidth="2"/>
 <ellipse cx="160" cy="33" rx="95" ry="12" {...ink}/><ellipse cx="160" cy="269" rx="95" ry="12" {...ink}/>
 <line data-geometry="cut-plane" {...plane} stroke="var(--vs-burgundy)" strokeWidth="6" strokeLinecap="round"/>
 <rect x="24" y="277" width="272" height="22" fill="var(--vs-paper)"/><text x="160" y="290" textAnchor="middle" style={tx}>{['','hipérbole: duas folhas','parábola: paralela à geratriz','elipse: uma folha'][v]}</text></g>;
}
if(id==='composicao'){const g=v+1,fg=2*g;return <g data-detail="function-composition"><rect x="15" y="110" width="52" height="60" rx="10" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><rect x="105" y="80" width="92" height="120" rx="14" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3"/><rect x="253" y="110" width="52" height="60" rx="10" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M68 140H101m-10-9 10 9-10 9M199 140H249m-10-9 10 9-10 9" {...red}/><text x="41" y="146" textAnchor="middle" style={tx}>{v}</text><text x="151" y="120" textAnchor="middle" style={tx}>g(x)=x+1</text><text x="151" y="164" textAnchor="middle" fill="var(--vs-burgundy)" fontWeight="800" fontSize="14">{g}</text><text x="279" y="146" textAnchor="middle" style={tx}>{fg}</text><text x="151" y="234" textAnchor="middle" style={tx}>f(u)=2u, depois de g</text><text x="151" y="258" textAnchor="middle" fill="var(--vs-burgundy)" fontWeight="800" fontSize="14">(f∘g)({v}) = {fg}</text></g>}
return <g data-detail="bijection-map"><text x="64" y="33" textAnchor="middle" style={tx}>domínio</text><text x="257" y="33" textAnchor="middle" style={tx}>contradomínio</text>{[0,1,2,3].map(i=>{const target=i%v;return <g key={i}><circle cx="64" cy={72+i*48} r="16" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="2"/><circle cx="257" cy={72+i*48} r="16" fill={target===i&&v===4?'var(--vs-paper)':'var(--vs-paper)'} stroke="var(--vs-burgundy)" strokeWidth="2"/><path data-target={target+1} d={`M81 ${72+i*48} C132 ${72+i*48}, 189 ${72+target*48}, 240 ${72+target*48}`} fill="none" stroke="var(--vs-burgundy)" strokeWidth="3"/><text x="64" y={77+i*48} textAnchor="middle" style={tx}>{['a','b','c','d'][i]}</text><text x="257" y={77+i*48} textAnchor="middle" style={tx}>{[1,2,3,4][i]}</text></g>})}<text x="160" y="285" textAnchor="middle" style={tx}>{v===4?'4 imagens: bijetora':`${v} imagens: há repetição`}</text></g>}
export function remainingMathInstrument(id:RemainingId){const c=REMAINING[id];return function RBoard(props:BoardProps){const p=boardPair(props);const[v,setV]=useState(c.control.initial),r=c.readouts(v),pivot=r.find(x=>x.pivot)??r[0],a=props.map.nodes[1] ?? props.map.nodes[0],b=props.map.nodes[2]??props.map.nodes.at(-1);return <BoardShell kicker="Laboratório de matemática" title={c.name} subtitle={c.question} condition={{label:'→',value:pivot.value}} ariaLabel={`Instrumento de matemática: ${props.map.title}`} emphasis={p.emphasis} scene={<div className="vs-instrument"><svg data-remaining-id={id} className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${c.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} v={v}/></svg><p className="vs-instrument-dica">mexa no caso e compare a regra com sua consequência</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`rm-${id}`}><strong>{c.control.label}</strong><span>{c.control.description}</span><b>{v}</b></label><input id={`rm-${id}`} type="range" min={c.control.min} max={c.control.max} step={c.control.step} value={v} onChange={e=>setV(Number(e.target.value))}/></div></div><dl className="vs-plane-readouts">{r.map(x=><div key={x.label} data-pivot={x.pivot?'true':undefined}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl></div>} left={{label:STAGE_LABEL[a?.stage??'conceito'],headline:a?.label??props.map.title,detail:short(a?.excerpt),formula:c.formula}} right={{label:STAGE_LABEL[b?.stage??'aplicacao'],headline:b?.label??props.map.title,detail:short(b?.excerpt),formula:`${pivot.label} = ${pivot.value}`}} leftState={p.leftState} rightState={p.rightState} leftSelected={p.leftSelected} rightSelected={p.rightSelected} onSelectLeft={p.selectLeft} onSelectRight={p.selectRight} equation={{label:'Leitura matemática',general:c.formula,condition:'mostra',reduced:pivot.value}} closing={c.insight}/>}}
