import React,{useId} from 'react';
import {motion} from 'motion/react';
import {useSceneMotion} from '../useSceneMotion';
import type {ReactNode} from 'react';
export function SketchText({x,y,children,accent=false,size=20,anchor='start'}:{x:number;y:number;children:string;accent?:boolean;size?:number;anchor?:'start'|'middle'|'end'}){
 return <text x={x} y={y} textAnchor={anchor} fontSize={size} className={accent?'cp-text cp-text--accent':'cp-text'}>{children.split('\n').map((line,i)=><tspan key={i} x={x} dy={i===0?0:25}>{line}</tspan>)}</text>;
}
export function SketchArrow({d,label,x,y}:{d:string;label?:string;x?:number;y?:number}){
 const id=useId();
 return <><defs><marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" className="cp-arrow-head"/></marker></defs><path d={d} className="cp-arrow" markerEnd={`url(#${id})`}/>{label&&<SketchText x={x??0} y={y??0} size={18} accent>{label}</SketchText>}</>;
}
export function SketchGroup({id,active,children}:{id:string;active:boolean;children:ReactNode}){
 const transition=useSceneMotion();
 return <motion.g initial={false} animate={{color:active?'var(--vs-burgundy)':'var(--vs-blue)'}} transition={transition} data-contrast-mark={id} data-active={active?'true':'false'} className="cp-mark">{children}</motion.g>;
}
