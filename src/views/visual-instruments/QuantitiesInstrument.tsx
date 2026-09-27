import React,{useState}from'react';import BoardShell from'../visual-boards/BoardShell';import{boardPair}from'../visual-boards/pair';import{STAGE_LABEL}from'../../lib/visualStudy';import{QUANTITIES,type QuantitiesConfigId}from'../../lib/quantitiesLab';import type{BoardProps}from'../visual-boards/types';import'./QuantitiesInstrument.css';
const ink = 'var(--vs-ink)', blue = 'var(--vs-blue)', accent = 'var(--vs-burgundy)';
const fmt = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',').replace('-', '−');
function Scene({id,v}:{id:QuantitiesConfigId;v:number}) {
  if (id === 'razao') return <>
    <text className="vs-q-text" x="160" y="30" textAnchor="middle">mesma razão · outra escala</text>
    {[10,20].map((total,row)=><g key={total}>
      {Array.from({length:total},(_,i)=><circle key={i} cx={29+(i%10)*29} cy={75+row*90+Math.floor(i/10)*27} r="9" fill={i<v*(row+1)?accent:'var(--vs-paper-strong)'} stroke={ink}/>) }
      <text x="160" y={row===0?112:230} textAnchor="middle" fill={ink} fontSize="14">{v*(row+1)} de {total} partes</text>
    </g>)}
    <text className="vs-q-text" x="160" y="278" textAnchor="middle">{v}/10 = {v*2}/20</text>
  </>;
  if (id === 'porcentagem') return <>
    {Array.from({length:100},(_,i)=><rect key={i} x={52+(i%10)*22} y={22+Math.floor(i/10)*22} width="18" height="18" rx="2" fill={i<v?accent:'var(--vs-paper-strong)'} stroke={i<v?accent:ink} strokeWidth="1"/>)}
    <text className="vs-q-text" x="160" y="273" textAnchor="middle">{v}% = {v}/100 = {fmt(v/100)}</text>
  </>;
  if (id === 'decimal') return <>
    <text x="160" y="29" textAnchor="middle" fill={ink} fontSize="14">o mesmo algarismo em quatro posições</text>
    {[1000,100,10,1].map((power,i)=><g key={power}>
      <rect x={10+i*77} y="60" width="69" height="156" rx="6" fill="var(--vs-paper-strong)" stroke={i===0?accent:blue} strokeWidth="2"/>
      <text x={44+i*77} y="90" textAnchor="middle" fill={ink} fontSize="13">{power}</text>
      <text x={44+i*77} y="143" textAnchor="middle" fill={accent} fontSize="32">{v}</text>
      <text x={44+i*77} y="188" textAnchor="middle" fill={ink} fontSize="14">{v*power}</text>
    </g>)}
    <text className="vs-q-text" x="160" y="268" textAnchor="middle">{v} × 1000 = {v*1000}</text>
  </>;
  if (id === 'inteiros') {
    const r=((v%7)+7)%7, q=(v-r)/7, x=(n:number)=>30+(n+14)*260/42;
    return <>
      <text x="160" y="30" textAnchor="middle" fill={ink} fontSize="14">múltiplo de 7 + resto não negativo</text>
      <path d="M22 142H299" fill="none" stroke={ink} strokeWidth="2"/>
      {[-14,-7,0,7,14,21,28].map(n=><g key={n}><path d={`M${x(n)} 135v14`} stroke={ink}/><text x={x(n)} y="170" textAnchor="middle" fill={ink} fontSize="12">{fmt(n)}</text></g>)}
      <path d={`M${x(0)} 113H${x(7*q)}`} stroke={accent} strokeWidth="7"/>
      <path d={`M${x(7*q)} 94H${x(v)}`} stroke={blue} strokeWidth="7"/>
      <circle cx={x(v)} cy="142" r="6" fill={blue}/>
      <text x="160" y="210" textAnchor="middle" fill={accent} fontSize="15">q = {fmt(q)} · r = {r} · 0 ≤ r &lt; 7</text>
      <text className="vs-q-text" x="160" y="264" textAnchor="middle">{fmt(7*q)} + {r} = {fmt(v)}</text>
    </>;
  }
  const mean=(6+8*v)/(1+v), terms=[6,...Array.from({length:v},()=>8)];
  return <>
    <text x="160" y="27" textAnchor="middle" fill={ink} fontSize="14">cada bloco representa uma unidade de peso</text>
    {terms.map((note,i)=><g key={i}>
      <rect x={20+i*47} y={155-note*11} width="36" height={note*11} rx="4" fill={i===0?blue:accent}/>
      <text x={38+i*47} y="178" textAnchor="middle" fill={ink} fontSize="14">{note}</text>
    </g>)}
    <text x="160" y="204" textAnchor="middle" fill={ink} fontSize="14">{terms.join(' + ')}</text>
    <path d="M30 247H290" stroke={ink} strokeWidth="2"/>
    {[6,7,8].map(n=><g key={n}><path d={`M${30+(n-6)*130} 241v12`} stroke={ink}/><text x={30+(n-6)*130} y="280" textAnchor="middle" fill={ink} fontSize="13">{n}</text></g>)}
    <path d={`M${30+(mean-6)*130} 232l-7-10h14Z`} fill={accent}/>
    <text x="160" y="298" textAnchor="middle" fill={ink} fontSize="13">média = {fmt(mean)} · peso total = {1+v}</text>
  </>;
}
function short(t?:string){const s=t?.trim().split(/(?<=[.!?])\s/)[0]??'';return s.length>180?`${s.slice(0,176)}…`:s}
export function quantitiesInstrument(id:QuantitiesConfigId){const c=QUANTITIES[id];return function QuantitiesBoard(props:BoardProps){const p=boardPair(props);const[v,setV]=useState(c.control.initial),r=c.readouts(v),pivot=r.find(x=>x.pivot)??r[0],a=props.map.nodes[1] ?? props.map.nodes[0],b=props.map.nodes[2]??props.map.nodes.at(-1);return <BoardShell kicker="Laboratório de quantidades" title={c.name} subtitle={c.question} condition={{label:'=',value:pivot.value}} ariaLabel={`Instrumento de quantidades: ${props.map.title}`} emphasis={p.emphasis} scene={<div className="vs-instrument vs-q"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${c.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} v={v}/></svg><p className="vs-instrument-dica">mexa no valor e leia a equivalência</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`q-${id}`}><strong>{c.control.label}</strong><span>{c.control.description}</span><b>{v}</b></label><input id={`q-${id}`} type="range" min={c.control.min} max={c.control.max} step={c.control.step} value={v} onChange={e=>setV(Number(e.target.value))}/></div></div><dl className="vs-plane-readouts">{r.map(x=><div key={x.label} data-pivot={x.pivot?'true':undefined}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl></div>} left={{label:STAGE_LABEL[a?.stage??'conceito'],headline:a?.label??props.map.title,detail:short(a?.excerpt),formula:c.formula}} right={{label:STAGE_LABEL[b?.stage??'aplicacao'],headline:b?.label??props.map.title,detail:short(b?.excerpt),formula:`${pivot.label} = ${pivot.value}`}} leftState={p.leftState} rightState={p.rightState} leftSelected={p.leftSelected} rightSelected={p.rightSelected} onSelectLeft={p.selectLeft} onSelectRight={p.selectRight} equation={{label:'Leitura quantitativa',general:c.formula,condition:'mostra',reduced:pivot.value}} closing={c.insight}/>}}
