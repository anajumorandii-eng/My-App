import React from 'react';
import { EARTH_SPATIAL_LESSONS } from '../../lib/earthSpatialBatch';
import { earthSpatialDrawing, EARTH_MOVING_KINDS } from '../../lib/earthSpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

export default function ChapterEarthSpatialLab({chapterId}:{chapterId:string}) {
  const config=EARTH_SPATIAL_LESSONS[chapterId];
  return <SpatialLessonLab config={config} draw={(v,t,c)=>earthSpatialDrawing(config.kind,v,t,c)}
    moving={c=>EARTH_MOVING_KINDS.includes(config.kind)&&!(config.kind==='inorganic'&&c==='oxide')}
    parameterLabel={c=>config.kind==='wetlands'&&c==='pampa'?'Altura visual da vegetação':config.label}
    dataAttributes={{'data-earth-spatial':config.kind}}/>;
}
