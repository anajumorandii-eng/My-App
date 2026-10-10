import React, { Suspense, lazy, useState } from 'react';
import { SPATIAL_CHAPTER_LESSONS } from '../lib/spatialBatchCatalog';
import './visual-instruments/ScienceObjectView.css';
const MolecularLab=lazy(()=>import('./visual-instruments/ChapterMolecularLab'));

export function SpatialChapterSupplement({ chapterId }: { chapterId: string }) {
  const [open,setOpen]=useState(false);
  if(!SPATIAL_CHAPTER_LESSONS[chapterId])return null;
  return <div className="vs-chapter-spatial-supplement">
    <div className="vs-science-choices"><button type="button" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>{open?'Recolher modelo 3D':'Explorar modelo 3D'}</button></div>
    {open&&<Suspense fallback={<p role="status">Preparando modelo espacial…</p>}><MolecularLab key={chapterId} chapterId={chapterId}/></Suspense>}
  </div>;
}
