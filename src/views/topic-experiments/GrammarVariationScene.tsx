import React from 'react';
import {motion,useReducedMotion} from 'motion/react';
import {GrammarDrawingWindow} from '../visual-instruments/GrammarDrawingWindow';
export function GrammarVariationScene({formal}:{formal:boolean}){
 const reduced=useReducedMotion();
 const text={fill:'var(--vs-ink)',fontSize:17,fontFamily:'Kalam,cursive'};
 const line={stroke:'var(--vs-ink)',strokeWidth:2,fill:'none'};
 return <GrammarDrawingWindow><svg viewBox="0 0 760 560" role="img" aria-label="Variação linguística: situação, região, grupo e tempo">
 <path d="M18 14L742 18L739 548L21 546Z" fill="var(--vs-paper)" stroke="var(--vs-ink-muted)"/>
 <g style={text}><text x="32" y="48" style={{fontSize:23}}>Um pedido, dois contextos de interação</text><text x="32" y="78">diafásica → adequação à situação; não superioridade de quem fala</text>
 <motion.g data-variation-register="informal" data-selected={String(!formal)} initial={false} animate={{x:!formal?3:0}} transition={{duration:reduced?0:.25}}>
 <path d="M65 104h225q12 0 12 12v166q0 12-12 12H65q-12 0-12-12V116q0-12 12-12Z" {...line} stroke={!formal?'var(--vs-burgundy)':'var(--vs-ink)'}/>
 <path d="M145 112h46M160 286h17" {...line}/><path d="M71 147h213v91H110l-20 14v-14H71Z" fill="var(--vs-paper)" stroke="var(--vs-blue)" strokeWidth="2"/>
 <text x="79" y="139">Conversa entre amigas</text><text x="82" y="176">Me manda o documento,</text><text x="82" y="203">por favor?</text><text x="79" y="265">proximidade → informal</text>
 </motion.g>
 <path d="M317 178h103m-12-8 12 8-12 8" {...line}/><text x="323" y="218">mesma</text><text x="323" y="245">intenção</text>
 <motion.g data-variation-register="formal" data-selected={String(formal)} initial={false} animate={{x:formal?3:0}} transition={{duration:reduced?0:.25}}>
 <path d="M445 104h255v190H445Z" {...line} stroke={formal?'var(--vs-burgundy)':'var(--vs-ink)'}/><path d="M465 119h215m-215 14h175" {...line}/>
 <text x="465" y="162">À secretaria</text><text x="465" y="196">Poderia encaminhar o documento,</text><text x="465" y="223">por gentileza?</text><path d="M465 243h213" {...line}/><text x="465" y="275">instituição → formal</text>
 </motion.g>
 <path d="M32 319H727" {...line}/>
 <g><text x="32" y="353" style={{fontSize:20}}>diatópica · região</text><path d="M37 392l38-19 48 15 39-16 48 14M75 373v57m48-42v44m39-60v58" {...line}/><text x="32" y="449">mandioca · aipim</text><text x="32" y="481">macaxeira: nomes variam</text><text x="32" y="513">conforme usos regionais</text></g>
 <g><text x="283" y="353" style={{fontSize:20}}>diastrática · grupo</text><path d="M326 388h72v51h-72Z M347 392v21h-16m16 0h18m-9-9v18" {...line}/><text x="283" y="449">cefaleia ↔ dor de cabeça</text><text x="283" y="481">jargão profissional</text><text x="283" y="513">não mede inteligência</text></g>
 <g><text x="538" y="353" style={{fontSize:20}}>diacrônica · tempo</text><path d="M547 407H716m-12-7 12 7-12 7M562 396v22m132-22v22" {...line}/><text x="538" y="449">vossa mercê → você</text><text x="538" y="481">mudança histórica</text><text x="538" y="513">não “progresso” da língua</text></g>
 </g></svg></GrammarDrawingWindow>;
}
