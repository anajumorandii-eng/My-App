import type { Question, Topic } from '../types';

export interface EnemAuditPosition { questionId: string; year: number; day: number; number: number; answer: string; status: string; classificationMethod: string; }
export interface EnemAuditReview { topicId: string; subject: string; chapter?: string; source: string; confidence: string; }
const normalize = (text: string) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export const enemOfficialArea = (number: number) => number <= 45 ? 'Linguagens' : number <= 90 ? 'Humanas' : number <= 135 ? 'Natureza' : 'Matemática';
const areaSubjects: Record<string, string[]> = { Linguagens: ['Português','Inglês'], Humanas: ['História','Geografia','Filosofia','Sociologia'], Natureza: ['Biologia','Física','Química'], Matemática: ['Matemática'] };
const classificationKeys = ['subject','topicId','chapter'] as const;

export function auditEnemCoverage(questions: Question[], topics: Topic[], positions: EnemAuditPosition[], reviews: Map<string, EnemAuditReview> = new Map(), imported: Question[] = [], deferred: Map<string, { source: string; reason: string }> = new Map()) {
  const errors: { code: string; id: string; detail: string }[] = [];
  const bank = new Map<string, Question>();
  for (const q of questions) { if (bank.has(q.id)) errors.push({code:'duplicate-id',id:q.id,detail:'ID duplicado no banco.'}); bank.set(q.id,q); }
  const catalog = new Map(topics.map(topic => [topic.id,topic]));
  const canonical = new Set<string>(), usedIds = new Set<string>();
  const areas = new Map<string,{total:number;valid:number;annulled:number}>();
  const methods: Record<string,number> = {};
  const outsideArea: { id:string; year:number; number:number; area:string; subject:string; topicId:string }[] = [];
  const missingChapters: {id:string;topicId:string;reviewSource:string|null}[] = [];
  const rows: {question:Question;position:EnemAuditPosition;automaticPending:boolean;reviewSource:string|null;confidence:string|null}[] = [];
  for (const p of positions) {
    const key=`${p.year}:${p.number}`;
    if(canonical.has(key))errors.push({code:'duplicate-position',id:p.questionId,detail:key});
    if(usedIds.has(p.questionId))errors.push({code:'duplicate-position-id',id:p.questionId,detail:key});
    canonical.add(key);usedIds.add(p.questionId);
    if(!Number.isInteger(p.number)||p.number<1||p.number>180||p.day!==(p.number<=90?1:2))errors.push({code:'invalid-position',id:p.questionId,detail:key});
    const q=bank.get(p.questionId);
    if(!q){errors.push({code:'missing-question',id:p.questionId,detail:key});continue;}
    if(q.examSource?.year!==p.year)errors.push({code:'source-year-mismatch',id:q.id,detail:key});
    if(q.examSource?.board!=='ENEM')errors.push({code:'invalid-board',id:q.id,detail:'A posição não aponta para uma questão ENEM.'});
    const topic=catalog.get(q.topicId), review=reviews.get(q.id);
    if(!topic||topic.subject!==q.subject)errors.push({code:'invalid-topic',id:q.id,detail:q.topicId});
    if(q.chapter&&!topic?.chapters.includes(q.chapter))errors.push({code:'invalid-chapter',id:q.id,detail:q.chapter});
    if(!q.chapter)missingChapters.push({id:q.id,topicId:q.topicId,reviewSource:review?.source??null});
    if(!q.prompt.trim()||q.options.length!==5||new Set(q.options.map(o=>o.id)).size!==5||q.options.some(o=>!o.text.trim()))errors.push({code:'invalid-content',id:q.id,detail:'Enunciado ou alternativas incompletos.'});
    const annulled=q.status==='annulled';
    if(annulled!==(p.status==='annulled')||q.correctOptionId!==(annulled?'':p.answer)||(!annulled&&!q.options.some(o=>o.id===q.correctOptionId)))errors.push({code:'answer-mismatch',id:q.id,detail:key});
    const area=enemOfficialArea(p.number), aggregate=areas.get(area)??{total:0,valid:0,annulled:0};aggregate.total++;aggregate[annulled?'annulled':'valid']++;areas.set(area,aggregate);
    if(!areaSubjects[area].includes(q.subject))outsideArea.push({id:q.id,year:p.year,number:p.number,area,subject:q.subject,topicId:q.topicId});
    const automaticPending=p.classificationMethod==='automatic-lexical-similarity'&&!review;
    const method=review?'versioned-editorial-review':p.classificationMethod;
    methods[method]=(methods[method]??0)+1;
    if(review&&classificationKeys.some(k=>q[k]!==review[k]))errors.push({code:'editorial-drift',id:q.id,detail:review.source});
    rows.push({question:q,position:p,automaticPending,reviewSource:review?.source??null,confidence:review?.confidence??null});
  }
  for(const year of [...new Set(positions.map(p=>p.year))])for(let number=1;number<=180;number++)if(!canonical.has(`${year}:${number}`))errors.push({code:'missing-position',id:`${year}:${number}`,detail:'Posição sem registro no manifesto.'});
  for(const q of questions)if(q.examSource?.board==='ENEM'&&!usedIds.has(q.id))errors.push({code:'unmapped-enem',id:q.id,detail:'Questão ENEM sem posição canônica auditada.'});
  const coverage=topics.map(topic=>{
    const own=rows.filter(row=>row.question.topicId===topic.id), valid=own.filter(row=>row.question.status!=='annulled');
    return {topicId:topic.id,subject:topic.subject,topic:topic.name,total:own.length,valid:valid.length,annulled:own.length-valid.length,years:[...new Set(valid.map(row=>row.position.year))].sort(),automaticPending:own.filter(row=>row.automaticPending).length,missingChapter:own.filter(row=>!row.question.chapter).length,
      chapters:topic.chapters.map(chapter=>{const selected=own.filter(row=>row.question.chapter===chapter),active=selected.filter(row=>row.question.status!=='annulled');return {chapter,total:selected.length,valid:active.length,annulled:selected.length-active.length,automaticPending:selected.filter(row=>row.automaticPending).length,years:[...new Set(active.map(row=>row.position.year))].sort()};})};
  });
  const fingerprints=new Map<string,string[]>(), stems=new Map<string,string[]>();
  for(const q of questions){
    const key=normalize(q.prompt+' '+q.options.map(o=>o.text).join(' '));const group=fingerprints.get(key)??[];group.push(q.id);fingerprints.set(key,group);
    const stem=normalize(q.prompt);if(stem.length>=80){const group=stems.get(stem)??[];group.push(q.id);stems.set(stem,group);}
  }
  const hasEnem=(ids:string[])=>ids.length>1&&ids.some(id=>usedIds.has(id));
  const duplicateContent=[...fingerprints.values()].filter(hasEnem), sharedStems=[...stems.values()].filter(hasEnem);
  const sourceDrift=imported.flatMap(q=>{const published=bank.get(q.id);return !published||classificationKeys.some(k=>q[k]!==published[k])?[{id:q.id,imported:{subject:q.subject,topicId:q.topicId,chapter:q.chapter??null},published:published?{subject:published.subject,topicId:published.topicId,chapter:published.chapter??null}:null}]:[];});
  const subjects=[...new Set(topics.map(t=>t.subject))].map(subject=>{const own=coverage.filter(row=>row.subject===subject);return {subject,total:own.reduce((n,t)=>n+t.total,0),valid:own.reduce((n,t)=>n+t.valid,0),annulled:own.reduce((n,t)=>n+t.annulled,0)};});
  const queue=rows.filter(row=>row.automaticPending||!row.question.chapter||row.confidence==='medium'||deferred.has(row.question.id)).map(row=>({id:row.question.id,year:row.position.year,number:row.position.number,subject:row.question.subject,topicId:row.question.topicId,chapter:row.question.chapter??null,deferredReason:deferred.get(row.question.id)?.reason??null,reasons:[...(deferred.has(row.question.id)?['deferred-review']:[]),...(!row.question.chapter?['taxonomy-gap']:[]),...(row.confidence==='medium'?['editorial-reservation']:[]),...(row.automaticPending?['automatic-classification']:[])],source:row.reviewSource})).sort((a,b)=>Number(!a.reasons.includes('taxonomy-gap'))-Number(!b.reasons.includes('taxonomy-gap'))||a.subject.localeCompare(b.subject,'pt-BR')||a.year-b.year||a.number-b.number);
  return {summary:{bank:questions.length,positions:positions.length,uniqueQuestions:usedIds.size,valid:rows.filter(row=>row.question.status!=='annulled').length,annulled:rows.filter(row=>row.question.status==='annulled').length,topics:coverage.length,representedTopics:coverage.filter(t=>t.total>0).length,uncoveredTopics:coverage.filter(t=>!t.valid).length,chapters:coverage.reduce((n,t)=>n+t.chapters.length,0),uncoveredChapters:coverage.reduce((n,t)=>n+t.chapters.filter(c=>!c.valid).length,0),automaticPending:rows.filter(row=>row.automaticPending).length,editoriallyReviewed:rows.filter(row=>row.reviewSource).length,editorialReservations:rows.filter(row=>row.confidence==='medium').length,deferred:deferred.size,errors:errors.length},subjects,areas:[...areas].map(([area,counts])=>({area,...counts})),methods,errors,outsideArea,missingChapters,duplicateContent,sharedStems,sourceDrift,coverage,queue};
}
