import React from 'react';
import { BIO_GEO_SPATIAL_LESSONS } from '../../lib/bioGeoSpatialBatch';
import { bioGeoSpatialDrawing, BIO_GEO_MOVING_KINDS } from '../../lib/bioGeoSpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

export default function ChapterBioGeoSpatialLab({chapterId}:{chapterId:string}) {
  const config=BIO_GEO_SPATIAL_LESSONS[chapterId];
  return <SpatialLessonLab config={config} draw={(v,t,c)=>bioGeoSpatialDrawing(config.kind,v,t,c)} moving={()=>BIO_GEO_MOVING_KINDS.includes(config.kind)} dataAttributes={{'data-biogeo-spatial':config.kind}}/>;
}
