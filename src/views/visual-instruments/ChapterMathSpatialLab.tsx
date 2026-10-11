import React from 'react';
import { MATH_SPATIAL_LESSONS } from '../../lib/mathSpatialBatch';
import { mathSpatialDrawing, MATH_MOVING_KINDS } from '../../lib/mathSpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

export default function ChapterMathSpatialLab({chapterId}:{chapterId:string}) {
  const config=MATH_SPATIAL_LESSONS[chapterId];
  return <SpatialLessonLab config={config} draw={(v,t,c)=>mathSpatialDrawing(config.kind,v,t,c)} moving={()=>MATH_MOVING_KINDS.includes(config.kind)} dataAttributes={{'data-math-spatial':config.kind}}/>;
}
