import React from 'react';
import { SCIENCE_SPATIAL_LESSONS } from '../../lib/scienceSpatialBatch';
import { scienceSpatialDrawing, SCIENCE_MOVING_KINDS } from '../../lib/scienceSpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

export default function ChapterScienceSpatialLab({chapterId}:{chapterId:string}) {
  const config=SCIENCE_SPATIAL_LESSONS[chapterId];
  return <SpatialLessonLab config={config} draw={(v,t,c)=>scienceSpatialDrawing(config.kind,v,t,c)} moving={()=>SCIENCE_MOVING_KINDS.includes(config.kind)} dataAttributes={{'data-science-spatial':config.kind}}/>;
}
