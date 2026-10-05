import React,{useState} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import BoardShell from './BoardShell';
import {boardPair} from './pair';
import type {BoardProps} from './types';

export default function KinematicsConceptBoard(props:BoardProps){
 const pair=boardPair(props),[shift,setShift]=useState(false),reduced=useReducedMotion();
 const origin=shift?-2:0;
 return <BoardShell title="Posição, percurso e referencial" subtitle="Um móvel parte de A, vai a B e retorna até C sobre a mesma rua." condition={{label:'saldo',value:'Δs = +2 m'}} ariaLabel="Prancha de conceitos fundamentais de cinemática" emphasis={pair.emphasis}
  scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 350" role="img" aria-label="Percurso A B C: distância 8 metros e deslocamento positivo2 metros" data-kinematics="reference-path" style={{fontFamily:'Kalam, cursive',fontSize:14,fill:'var(--vs-ink)'}}>
   <defs><marker id="kin-path-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="var(--vs-burgundy)"/></marker></defs>
   <text x="160" y="24" textAnchor="middle">A → B → C · rua retilínea</text>
   <path d="M25 90H295" stroke="var(--vs-blue)" strokeWidth="3"/>
   {[[80,'A',-1],[230,'B',4],[140,'C',1]].map(([x,label,s])=><g key={label}><circle cx={Number(x)} cy="90" r="5" fill="var(--vs-burgundy)"/><text x={x} y="63" textAnchor="middle">{label}: {Number(s)-origin} m</text></g>)}
   <motion.g initial={false} animate={{x:shift?-60:0}} transition={{duration:reduced?0:.25}}><path d="M110 81v18" stroke="var(--vs-ink)"/><text x="110" y="120" textAnchor="middle">origem O</text></motion.g>
   <path d="M80 155H230M230 202H140" fill="none" stroke="var(--vs-burgundy)" strokeWidth="2" markerEnd="url(#kin-path-head)"/>
   <text x="155" y="145" textAnchor="middle">ida: 5 m →</text><text x="185" y="190" textAnchor="middle">volta: 3 m ←</text>
   <path d="M80 244H140" fill="none" stroke="var(--vs-blue)" strokeWidth="3" markerEnd="url(#kin-path-head)"/>
   <text x="195" y="245" textAnchor="middle">Δs = +2 m</text>
   <text x="160" y="286" textAnchor="middle">distância = 8 m · soma dos percursos</text>
   <text x="160" y="311" textAnchor="middle">Δs = sC − sA · posição final − inicial</text>
   <text x="160" y="337" textAnchor="middle">Escala da rua: 30 unidades por metro.</text>
  </svg><button type="button" className="vs-plane-play" aria-pressed={shift} onClick={()=>setShift(v=>!v)}>{shift?'Restaurar origem em 0 m':'Mover origem para −2 m'}</button><p className="vs-instrument-dica">Mudar a origem altera posições; conserva distância e deslocamento neste referencial em repouso.</p></div>}
  left={{label:'Percurso',headline:'Ida e volta somam.',detail:'As distâncias de cada trecho são positivas: 5 m + 3 m = 8 m.',formula:'d = 8 m'}} right={{label:'Deslocamento',headline:'Só início e fim.',detail:'O retorno desconta parte da ida; C está2 metros à direita de A.',formula:'Δs = +2 m'}}
  leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
  equation={{label:'Distinção central',general:'distância ≥ |Δs|',condition:'neste percurso',reduced:'8 m > 2 m'}} closing="Posição depende do referencial. Ida e volta não apagam a distância percorrida."/>;
}
