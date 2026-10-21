import type { AnnualIncidence, FuvestQuestion, IncidenceRow } from './fuvestIncidence';
export type ResearchBoard = 'ENEM' | 'UNESP' | 'FAMERP' | 'UNIFESP';
export interface BoardQuestion extends Omit<FuvestQuestion,'phase'> { phase: string; board: ResearchBoard; }
export interface BoardPaper {
  id: string; board: ResearchBoard; year: number; group: string; phase: string; phaseGroup: '1a'|'2a'; format: string; version: string;
  sourceUrl: string; answerKeyUrl: string | null; sha256: string; answerKeySha256: string | null;
  pages: number; expectedQuestions: number; classifiedQuestions: number; coverageNote?: string;
}
export interface BoardCorpus {
  board: ResearchBoard; reviewedOn: string; reviewType: string; coverageNote: string; years: number[];
  papers: BoardPaper[]; questions: BoardQuestion[];
}
export interface BoardIncidenceRow extends Omit<IncidenceRow,'annual'> { annual: (AnnualIncidence & {covered: boolean})[]; }
export interface BoardIncidenceFilter { startYear: number; endYear: number; group: string; subject?: string; highConfidenceOnly?: boolean; }
export function boardPool(corpus: BoardCorpus, filter: BoardIncidenceFilter, includeExcluded=false) {
  const papers=new Set(corpus.papers.filter(paper=>paper.group===filter.group&&paper.year>=filter.startYear&&paper.year<=filter.endYear).map(paper=>paper.id));
  return corpus.questions.filter(question=>papers.has(question.paperId)&&(!filter.subject||question.subject===filter.subject)&&(includeExcluded||!question.excluded));
}
export function boardIncidenceRows(corpus: BoardCorpus, filter: BoardIncidenceFilter, group: 'topic'|'subtopic'='topic'): BoardIncidenceRow[] {
  const pool=boardPool(corpus,filter);
  const years=corpus.years.filter(year=>year>=filter.startYear&&year<=filter.endYear);
  const completeYears=new Set(years.filter(year=>{
    const papers=corpus.papers.filter(paper=>paper.group===filter.group&&paper.year===year);
    return papers.length>0&&papers.every(paper=>paper.classifiedQuestions===paper.expectedQuestions);
  }));
  const groups=new Map<string,{subject:string;topicId:string|null;label:string;questions:BoardQuestion[]}>();
  for(const question of pool){
    if(filter.highConfidenceOnly&&question.confidence!=='high')continue;
    for(const label of group==='topic'?[question.topic]:[...new Set(question.subtopics)]){
      const id=`${question.subject}:${group==='topic'?question.topicId??label:label}`;
      const entry=groups.get(id)??{subject:question.subject,topicId:group==='topic'?question.topicId:null,label,questions:[]};
      entry.questions.push(question);groups.set(id,entry);
    }
  }
  return [...groups].map(([id,entry])=>{
    const own=pool.filter(question=>question.subject===entry.subject);
    const annual=years.map(year=>{
      const total=own.filter(question=>question.year===year).length,count=entry.questions.filter(question=>question.year===year).length;
      return {year,count,total,rate:total?count/total:null,covered:completeYears.has(year)};
    });
    return {id,subject:entry.subject,topicId:entry.topicId,label:entry.label,count:entry.questions.length,total:own.length,rate:entry.questions.length/own.length,editions:annual.filter(row=>row.count>0).length,observedEditions:completeYears.size,annual,questionIds:entry.questions.map(question=>question.id),uncertain:entry.questions.filter(question=>question.confidence!=='high').length};
  }).sort((a,b)=>b.editions-a.editions||b.count-a.count||a.label.localeCompare(b.label,'pt-BR'));
}
export function boardInterdisciplinaryPairs(corpus: BoardCorpus,filter: BoardIncidenceFilter){
 const pairs=new Map<string,string[]>();
 for(const question of boardPool(corpus,filter)){
  if(filter.highConfidenceOnly&&question.confidence!=='high')continue;
  const subjects=[...new Set([question.subject,...question.relatedSubjects])].sort();
  for(let i=0;i<subjects.length;i++)for(let j=i+1;j<subjects.length;j++){
   const label=`${subjects[i]} ↔ ${subjects[j]}`;pairs.set(label,[...(pairs.get(label)??[]),question.id]);
  }
 }
 return [...pairs].map(([label,questionIds])=>({label,questionIds,count:questionIds.length})).sort((a,b)=>b.count-a.count);
}
export async function loadBoardCorpus(board: ResearchBoard):Promise<BoardCorpus>{
 const response=await fetch(`/analises/incidencia/${board.toLowerCase()}/corpus.json`);
 if(!response.ok)throw new Error(`Corpus indisponível: ${board}`);
 const data=await response.json() as BoardCorpus;
 if(!isCompleteBoardCorpus(data,board))throw new Error(`Corpus incompleto: ${board}`);
 return data;
}

/** Counts in a manifest alone cannot establish that the underlying items survived. */
export function isCompleteBoardCorpus(data: BoardCorpus, board: ResearchBoard): boolean {
 if(!data || data.board!==board || !Array.isArray(data.years) || !data.years.length ||
    !Array.isArray(data.papers) || !data.papers.length || !Array.isArray(data.questions) || !data.questions.length)return false;
 const strings=(value:unknown):value is string[]=>Array.isArray(value)&&value.every(item=>typeof item==='string'&&item.trim().length>0);
 const text=(value:unknown)=>typeof value==='string'&&value.trim().length>0;
 if(!data.years.every(Number.isInteger)||new Set(data.years).size!==data.years.length)return false;
 if(new Set(data.papers.map(p=>p.id)).size!==data.papers.length ||
    new Set(data.questions.map(q=>q.id)).size!==data.questions.length)return false;
 const groupSignatures=new Map<string,string>();
 for(const paper of data.papers){
  const signature=JSON.stringify([paper.phase,paper.phaseGroup,paper.format]);
  if(groupSignatures.has(paper.group)&&groupSignatures.get(paper.group)!==signature)return false;
  groupSignatures.set(paper.group,signature);
  if(!text(paper.id)||paper.board!==board||!data.years.includes(paper.year)||!text(paper.group)||!text(paper.phase)||
     !['1a','2a'].includes(paper.phaseGroup)||!text(paper.format)||!Number.isInteger(paper.pages)||paper.pages<1||
     !Number.isInteger(paper.expectedQuestions)||paper.expectedQuestions<1||paper.classifiedQuestions!==paper.expectedQuestions)return false;
  const own=data.questions.filter(q=>q.paperId===paper.id);
  if(own.length!==paper.expectedQuestions||new Set(own.map(q=>q.number)).size!==own.length)return false;
 }
 if(data.years.some(year=>!data.papers.some(p=>p.year===year)))return false;
 return data.questions.every(q=>{
  const paper=data.papers.find(p=>p.id===q.paperId);
  return !!paper && q.board===board && q.year===paper.year && q.phase===paper.phase &&
   text(q.id)&&text(q.number)&&text(q.subject)&&text(q.topic)&&Number.isInteger(q.page)&&q.page>=1&&q.page<=paper.pages&&
   (q.topicId===null||text(q.topicId))&&strings(q.subtopics)&&q.subtopics.length>0&&strings(q.skills)&&q.skills.length>0&&
   strings(q.relatedSubjects)&&strings(q.relatedTopicIds)&&strings(q.subitems)&&strings(q.strategy)&&q.strategy.length>=2&&
   text(q.summary)&&text(q.rationale)&&text(q.trap)&&['high','medium','low'].includes(q.confidence)&&
   (q.confidence==='high'||text(q.reviewNote))&&typeof q.excluded==='boolean'&&(!q.excluded||text(q.excludedReason));
 });
}
