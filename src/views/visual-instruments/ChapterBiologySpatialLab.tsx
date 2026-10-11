import React from 'react';
import { BIOLOGY_SPATIAL_LESSONS } from '../../lib/biologySpatialBatch';
import { biologySpatialDrawing, BIOLOGY_MOVING_KINDS } from '../../lib/biologySpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

export default function ChapterBiologySpatialLab({chapterId}:{chapterId:string}) {
  const config=BIOLOGY_SPATIAL_LESSONS[chapterId];
  return <SpatialLessonLab config={config} draw={(v,t,c)=>biologySpatialDrawing(config.kind,v,t,c)} moving={()=>BIOLOGY_MOVING_KINDS.includes(config.kind)} dataAttributes={{'data-biology-spatial':config.kind}}/>;
}
