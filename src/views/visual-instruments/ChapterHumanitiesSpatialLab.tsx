import React from 'react';
import { HUMANITIES_SPATIAL_LESSONS } from '../../lib/humanitiesSpatialBatch';
import { LANGUAGES_SPATIAL_LESSONS } from '../../lib/languagesSpatialBatch';
import { humanitiesSpatialDrawing, HUMANITIES_MOVING } from '../../lib/humanitiesSpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

/** O controle escolhe o item em destaque; a leitura traz o texto completo dele. */
export default function ChapterHumanitiesSpatialLab({chapterId}:{chapterId:string}) {
  const lesson=HUMANITIES_SPATIAL_LESSONS[chapterId]??LANGUAGES_SPATIAL_LESSONS[chapterId];
  const config={kind:lesson.template,title:lesson.title,label:'Item em destaque',min:1,max:lesson.items.length,step:1,initial:1,note:lesson.note};
  return <SpatialLessonLab config={config} draw={(v,t)=>humanitiesSpatialDrawing(lesson,v,t)} moving={()=>HUMANITIES_MOVING.includes(lesson.template)} dataAttributes={{'data-humanities-spatial':lesson.template}}/>;
}
