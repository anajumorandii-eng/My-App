import React from 'react';
import './GrammarDrawingWindow.css';
export function GrammarDrawingWindow({children}:{children:React.ReactNode}){
 const window=React.useRef<HTMLDivElement>(null);
 const move=(amount:number)=>{if(window.current)window.current.scrollLeft+=amount;};
 return <div className="grammar-drawing-wrap"><p className="grammar-pan-hint">Deslize para percorrer a prancha. Com teclado, use as setas.</p><div ref={window} className="grammar-drawing-window" role="region" aria-label="Percorrer a prancha de Gramática" tabIndex={0} onKeyDown={event=>{
 if(event.target!==event.currentTarget)return;
 if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?180:-180);}
 if(event.key==='Home'||event.key==='End'){event.preventDefault();event.currentTarget.scrollLeft=event.key==='Home'?0:event.currentTarget.scrollWidth;}
 }}>{children}</div><div className="grammar-pan-buttons"><button type="button" aria-label="Percorrer prancha para a esquerda" onClick={()=>move(-180)}>← Esquerda</button><button type="button" aria-label="Percorrer prancha para a direita" onClick={()=>move(180)}>Direita →</button></div></div>;
}
