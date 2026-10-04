import React from 'react';
import './PhysicsDrawingWindow.css';

/** Os desenhos físicos mantêm a escala de leitura dentro da prancha. */
export function PhysicsDrawingWindow({children,enabled=true}:{children:React.ReactNode;enabled?:boolean}){
 if(!enabled)return <>{children}</>;
 return <div className="physics-drawing"><div className="physics-drawing-window" tabIndex={0} role="region" aria-label="Percorrer o desenho físico" onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();event.currentTarget.scrollLeft+=event.key==='ArrowRight'?120:-120;}}}>{children}</div><p className="physics-drawing-hint">Deslize o desenho; com teclado, use as setas.</p></div>;
}
