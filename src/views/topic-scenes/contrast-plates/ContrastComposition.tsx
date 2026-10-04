import React,{useId,useState} from 'react';
import {motion} from 'motion/react';
import {useSceneMotion} from '../useSceneMotion';
import type {SceneEntry} from '../types';
import type {ContrastPlate} from './types';
import './ContrastComposition.css';
/** A seleção segue uma relação do desenho; não mede o mérito de uma teoria. */
export function ContrastComposition({entry,plate}:{entry:SceneEntry;plate:ContrastPlate}){
 const [focus,setFocus]=useState<number|null>(null),[quote,setQuote]=useState(false);
 const transition=useSceneMotion(),id=useId();
 const item=focus===null?null:entry.items[focus],position=focus===null?null:plate.positions[focus];
 return <section className="tc-scene cp-composition" aria-label={entry.question}>
  <header><small>CRIVO · leituras do mesmo problema</small><h4>{entry.question}</h4></header>
  <p className="cp-context">{plate.context}</p>
  <figure data-contrast-plate={entry.chapterId}>
   <div className="cp-drawing-window" tabIndex={0} role="region" aria-label="Desenho da comparação" aria-describedby={id}>
    <svg viewBox="0 0 760 480" role="img" aria-label={`${entry.question} — ${focus===null?'Todas as relações visíveis':`Relação em foco: ${item?.label}`}`}>
     {plate.illustration(focus)}
    </svg>
   </div>
   <figcaption className="cp-annotation">{plate.annotation}</figcaption>
   <p id={id} className="cp-pan-hint">No desenho largo, use a rolagem horizontal ou as setas do teclado para percorrê-lo.</p>
  </figure>
  <div className="tc-choices" aria-label="Posições a comparar">{entry.items.map((it,i)=><button key={it.label} type="button" aria-pressed={focus===i} onClick={()=>{setFocus(focus===i?null:i);setQuote(false);}}>{it.label}</button>)}</div>
  {item&&position&&<><motion.p initial={false} animate={{opacity:1}} transition={transition} className="cp-reading" role="status"><strong>{item.label}:</strong> {position.reading}<span className="cp-claim">No capítulo: {item.claim}</span></motion.p>
   <button type="button" className="tc-quote-toggle" aria-expanded={quote} onClick={()=>setQuote(v=>!v)}>Ver o trecho do capítulo</button>
   {quote&&<blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>}
  </>}
 </section>;
}
