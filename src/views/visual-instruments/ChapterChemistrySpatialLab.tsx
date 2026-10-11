import React from 'react';
import { CHEMISTRY_SPATIAL_LESSONS } from '../../lib/chemistrySpatialBatch';
import { chemistrySpatialDrawing } from '../../lib/chemistrySpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

const MOVING=['decay','phase','gas','mixture','filter','stoichiometry','ionic','redox','kinetics','cell','electrolysis','faraday','equilibrium'];
export default function ChapterChemistrySpatialLab({chapterId}:{chapterId:string}) {
  const config=CHEMISTRY_SPATIAL_LESSONS[chapterId];
  return <SpatialLessonLab config={config} draw={(v,t,c)=>chemistrySpatialDrawing(config.kind,v,t,c)} moving={()=>MOVING.includes(config.kind)} dataAttributes={{'data-chemistry-spatial':config.kind}}/>;
}
