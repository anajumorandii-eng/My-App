import React, { useState } from 'react';
import { SPATIAL_CHAPTER_LESSONS } from '../../lib/spatialBatchCatalog';
import { organicSpatial, waterPair, chromatinSpatial, type OrganicCase } from '../../lib/organicSpatial';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import { ScienceObjectDrawing } from './ScienceObjectView';
import { SpatialLabFrame } from './SpatialLabFrame';

export default function ChapterMolecularLab({ chapterId }: { chapterId: string }) {
  const lesson=SPATIAL_CHAPTER_LESSONS[chapterId];
  const [choice,setChoice]=useState<OrganicCase>(lesson?.cases?.[0]??'propane'),[separation,setSeparation]=useState(70),clock=useMechanismTime();
  if(!lesson)return null;
  const reaction=lesson.kind==='reaction',units=2+Math.round(clock.time*2);
  const model=lesson.kind==='water'?waterPair(separation):lesson.kind==='chromatin'?chromatinSpatial(clock.time):organicSpatial(lesson.kind==='polymer'?'polymer':reaction?lesson.cases![clock.time>=.5?1:0]:choice,units);
  const molecule='name' in model?model:null;
  const reading=molecule?`${molecule.name} · ${molecule.formula}. ${molecule.group}.${reaction?` ${clock.time>=.5?'Produto':'Reagente'}.`:lesson.kind==='polymer'?` ${units} unidades no fragmento.`:''}`:lesson.kind==='water'?`Dois H₂O; ângulo H−O−H = 104,5°. Separação entre O: ${separation} unidades ilustrativas.`:`Oito nucleossomos; organização ${clock.time<.5?'menos compacta':'mais compacta'}. Quantidade de DNA preservada.`;
  const controls=<>
    {lesson.kind==='organic'&&<div className="vs-science-choices" role="group" aria-label="Exemplo molecular">{lesson.cases!.map(c=><button key={c} type="button" aria-pressed={choice===c} onClick={()=>setChoice(c)}>{organicSpatial(c).name}</button>)}</div>}
    {lesson.kind==='water'&&<label className="vs-spatial-parameter">Separação entre moléculas <input type="range" min="60" max="110" value={separation} onChange={e=>setSeparation(Number(e.target.value))}/></label>}
    {(reaction||lesson.kind==='polymer'||lesson.kind==='chromatin')&&<TimeControl clock={clock} label={reaction?'Comparação reagente → produto':lesson.kind==='polymer'?'Crescimento ilustrativo do fragmento':'Grau ilustrativo de condensação'}/>}
  </>;
  return <SpatialLabFrame title={lesson.title} reading={reading} controls={controls} note={lesson.note+(molecule?' Modelos de conectividade em três dimensões; comprimentos, raios e ângulos esquemáticos. H ligados a C estão omitidos; hidroxilas e aminas mostram seus H. Não são estruturas cristalográficas.':'')}>
    {camera=><ScienceObjectDrawing atoms={model.atoms} bonds={model.bonds} yaw={camera.yaw} pitch={camera.pitch} interaction={camera.interaction} description={lesson.title+'. '+reading} />}
  </SpatialLabFrame>;
}
