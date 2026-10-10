import React, { Suspense, lazy, useState } from 'react';
import { SPATIAL_CHAPTER_LESSONS } from '../lib/spatialBatchCatalog';
import { PHYSICS_SPATIAL_LESSONS } from '../lib/physicsSpatialBatch';
import './visual-instruments/ScienceObjectView.css';
const MolecularLab=lazy(()=>import('./visual-instruments/ChapterMolecularLab'));
const PhysicsLab=lazy(()=>import('./visual-instruments/ChapterPhysicsSpatialLab'));

export function SpatialChapterSupplement({ chapterId }: { chapterId: string }) {
  const [open,setOpen]=useState(false);
  const physics=!!PHYSICS_SPATIAL_LESSONS[chapterId];
  if(!SPATIAL_CHAPTER_LESSONS[chapterId]&&!physics)return null;
  return <div className="vs-chapter-spatial-supplement">
    <div className="vs-science-choices"><button type="button" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>{open?'Recolher modelo 3D':'Explorar modelo 3D'}</button></div>
    {open&&<Suspense fallback={<p role="status">Preparando modelo espacial…</p>}>{physics?<PhysicsLab key={chapterId} chapterId={chapterId}/>:<MolecularLab key={chapterId} chapterId={chapterId}/>}</Suspense>}
  </div>;
}
