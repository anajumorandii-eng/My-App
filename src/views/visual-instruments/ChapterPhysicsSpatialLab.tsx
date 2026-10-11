import React from 'react';
import { PHYSICS_SPATIAL_LESSONS } from '../../lib/physicsSpatialBatch';
import { physicsSpatialDrawing } from '../../lib/physicsSpatialDrawing';
import { SpatialLessonLab } from './SpatialLessonLab';

const GAS:[string,string][]=[['isotherm','Isotérmica'],['isobar','Isobárica'],['isochor','Isocórica'],['adiabat','Adiabática']];
const CHOICES:Record<string,[string,string][]>={'gas-state':GAS,'gas-work':GAS,'gas-law':GAS,gas:[['isotherm','Isotérmica'],['isobar','Isobárica'],['isochor','Isocórica'],['adiabat','Adiabática']],tube:[['open','Aberto'],['closed','Fechado à esquerda']],reflection:[['fixed','Extremidade fixa'],['free','Extremidade livre']]};
const STATIC=['weight','resultant','hydro','snell','lens','maker','wire'];
export default function ChapterPhysicsSpatialLab({chapterId}:{chapterId:string}) {
  const config=PHYSICS_SPATIAL_LESSONS[chapterId];
  return <SpatialLessonLab config={{...config,choices:CHOICES[config.kind]}} draw={(v,t,c)=>physicsSpatialDrawing(config.kind,v,t,c||'fixed')} moving={()=>!STATIC.includes(config.kind)} dataAttributes={{'data-physics-spatial':config.kind}}/>;
}
