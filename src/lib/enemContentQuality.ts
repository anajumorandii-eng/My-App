import type { Question } from '../types';

export const isVisualAlternativeReference = (text: string) => /^Alternativa (?:visual )?[A-E]\b.*(?:figura|expressão)/i.test(text.trim());
export function auditEnemContentQuality(questions: Question[], reviewedVisualIds: Set<string> = new Set()) {
  const errors: {id:string;field:string;code:string}[]=[];
  const visual: {id:string;options:string[];mixed:boolean;reviewed:boolean}[]=[];
  for(const q of questions){
    for(const [field,text] of [['prompt',q.prompt],...q.options.map(o=>[`options.${o.id}.text`,o.text])]){
      if(/[\ue000-\uf8ff\ufffd\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text))errors.push({id:q.id,field,code:'unreadable-character'});
      if(/(?:^|\n)(?:LC|CH|CN|MT)\s*[12][ºo°]?\s*dia\s*\|\s*Caderno\s*\d+\s*[-–]\s*AMARELO\s*[-–]\s*Página\s*\d+\s*$/im.test(text))errors.push({id:q.id,field,code:'institutional-footer'});
    }
    const texts=q.options.map(option=>option.text.trim());
    if(new Set(texts).size!==texts.length)errors.push({id:q.id,field:'options',code:'duplicate-alternative-text'});
    const options=q.options.filter(o=>isVisualAlternativeReference(o.text)).map(o=>o.id);
    if(options.length){
      if(!q.figures?.length)errors.push({id:q.id,field:'figures',code:'visual-alternative-without-figure'});
      visual.push({id:q.id,options,mixed:options.length!==q.options.length,reviewed:reviewedVisualIds.has(q.id)});
    }
  }
  return {summary:{questions:questions.length,errors:errors.length,visualReferences:visual.length,visualReviewed:visual.filter(row=>row.reviewed).length,visualPending:visual.filter(row=>!row.reviewed).length},errors,visual,queue:visual.filter(row=>!row.reviewed)};
}
