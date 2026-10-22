export type FuvestPhase = '1a' | '2a-dia1' | '2a-dia2';
export type FuvestScope = FuvestPhase | 'medicina' | 'medicina-sp' | 'medicina-bauru';
export type ClassificationConfidence = 'high' | 'medium' | 'low';
export interface FuvestQuestion {
  id: string; paperId: string; year: number; phase: FuvestPhase; number: string; page: number;
  subject: string; topicId: string | null; topic: string; subtopics: string[]; skills: string[];
  relatedSubjects: string[]; relatedTopicIds: string[]; summary: string; rationale: string;
  strategy: string[]; trap: string; confidence: ClassificationConfidence; reviewNote: string;
  excluded: boolean; excludedReason: string; subitems: string[];
  originalSubtopics?: string[]; answerKeyUrl?: string | null; answerKeySha256?: string | null;
}
export interface FuvestPaper {
  id: string; year: number; phase: FuvestPhase; version: string; sourceUrl: string;
  answerKeyUrl: string | null; sha256: string; answerKeySha256: string | null;
  pages: number; expectedQuestions: number; classifiedQuestions: number;
}
export interface FuvestCorpus {
  reviewedOn: string; reviewType: string; years: number[]; papers: FuvestPaper[]; questions: FuvestQuestion[];
}
export interface FuvestFilter {
  startYear: number; endYear: number; scope: FuvestScope; subject?: string;
  highConfidenceOnly?: boolean;
}
export interface AnnualIncidence { year: number; count: number; total: number; rate: number | null; covered?: boolean; }
export interface IncidenceRow {
  id: string; subject: string; topicId: string | null; label: string; count: number; total: number;
  rate: number; editions: number; observedEditions: number; annual: AnnualIncidence[];
  questionIds: string[]; uncertain: number;
}

/** Historical campus rules: manuals 2022–24, unified career from 2025. */
export function medicineQuestion(question: Pick<FuvestQuestion, 'phase' | 'number'> & {year?: number}, scope: string = 'medicina'): boolean {
  if(question.phase !== '2a-dia2') return false;
  const old = (question.year ?? 2026) <= 2024;
  const letters = old && scope === 'medicina-sp' ? 'BFQ' : old && scope === 'medicina-bauru' ? 'BGQ' : 'BFGQ';
  const limit = old && scope !== 'medicina' ? 4 : 3;
  const match = /^([BFGHMQ])0?([1-6])$/i.exec(question.number);
  return !!match && letters.includes(match[1].toUpperCase()) && Number(match[2]) <= limit;
}
export function normalizeIncidenceSubject(subject: string) {
  return subject === 'Língua Portuguesa' ? 'Português' : subject === 'Língua Inglesa' ? 'Inglês' : subject;
}
export function scopeQuestions(corpus: FuvestCorpus, filter: FuvestFilter, includeExcluded = false): FuvestQuestion[] {
  return corpus.questions.filter(question => question.year >= filter.startYear && question.year <= filter.endYear &&
    (filter.scope.startsWith('medicina') ? medicineQuestion(question, filter.scope) : question.phase === filter.scope) &&
    (!filter.subject || question.subject === normalizeIncidenceSubject(filter.subject)) && (includeExcluded || !question.excluded));
}
export function incidenceRows(corpus: FuvestCorpus, filter: FuvestFilter, group: 'topic' | 'subtopic' = 'topic'): IncidenceRow[] {
  const pool = scopeQuestions(corpus, filter);
  const years = corpus.years.filter(year => year >= filter.startYear && year <= filter.endYear);
  // Recurrence uses fully covered editions, including editions where this category
  // has zero primary items. Conditional percentage still has no denominator there.
  const paperPhase = filter.scope.startsWith('medicina') ? '2a-dia2' : filter.scope;
  const coveredYears = new Set(corpus.papers.filter(paper=>paper.phase===paperPhase && paper.classifiedQuestions===paper.expectedQuestions && years.includes(paper.year)).map(paper=>paper.year));
  if(!corpus.papers.length)for(const question of scopeQuestions(corpus,{...filter,subject:undefined},true))coveredYears.add(question.year);
  const groups = new Map<string, { subject: string; topicId: string | null; label: string; questions: FuvestQuestion[] }>();
  for (const question of pool) {
    // Confidence restriction changes attributed hits, never silently shrinks the exam denominator.
    if (filter.highConfidenceOnly && question.confidence !== 'high') continue;
    const labels = group === 'topic' ? [question.topic] : [...new Set(question.subtopics)];
    for (const label of labels) {
      const key = `${question.subject}:${group === 'topic' ? question.topicId ?? label : label}`;
      const entry = groups.get(key) ?? { subject: question.subject, topicId: group === 'topic' ? question.topicId : null, label, questions: [] };
      entry.questions.push(question); groups.set(key, entry);
    }
  }
  return [...groups.entries()].map(([id, entry]) => {
    const denominator = pool.filter(question => question.subject === entry.subject);
    const annual = years.map(year => {
      const total = denominator.filter(question => question.year === year).length;
      const count = entry.questions.filter(question => question.year === year).length;
      return { year, count, total, rate: total ? count / total : null, covered: coveredYears.has(year) };
    });
    return { id, subject: entry.subject, topicId: entry.topicId, label: entry.label,
      count: entry.questions.length, total: denominator.length, rate: entry.questions.length / denominator.length,
      editions: annual.filter(year => year.count > 0).length, observedEditions: coveredYears.size,
      annual, questionIds: entry.questions.map(question => question.id), uncertain: entry.questions.filter(question => question.confidence !== 'high').length };
  }).sort((a, b) => b.count - a.count || b.editions - a.editions || a.label.localeCompare(b.label, 'pt-BR'));
}
export function interdisciplinaryPairs(corpus: FuvestCorpus, filter: FuvestFilter) {
  const pool = scopeQuestions(corpus, filter).filter(question => !filter.highConfidenceOnly || question.confidence === 'high');
  const pairs = new Map<string, { subjects: string[]; questionIds: string[] }>();
  for (const question of pool) {
    const subjects = [...new Set([question.subject, ...question.relatedSubjects])].sort();
    for (let i = 0; i < subjects.length; i++) for (let j = i + 1; j < subjects.length; j++) {
      const key = `${subjects[i]} ↔ ${subjects[j]}`;
      const entry = pairs.get(key) ?? { subjects: [subjects[i], subjects[j]], questionIds: [] };
      entry.questionIds.push(question.id); pairs.set(key, entry);
    }
  }
  return [...pairs.entries()].map(([label, entry]) => ({ label, ...entry, count: entry.questionIds.length })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'));
}
export async function loadFuvestCorpus(): Promise<FuvestCorpus> {
  return (await import('../data/fuvestIncidence.json')).default as FuvestCorpus;
}

export interface PeriodIncidence {
 count: number; total: number; rate: number | null; coveredEditions: number;
}
export interface IncidenceComparison {
 id: string; subject: string; topicId: string | null; label: string;
 earlier: PeriodIncidence; recent: PeriodIncidence; deltaPercentagePoints: number | null;
}
/** Compare conditional rates, never subtract percentages built on different subjects. */
export function compareIncidencePeriods(corpus:FuvestCorpus,scope:FuvestScope='1a',subject?:string):IncidenceComparison[]{
 const periods=[{startYear:2017,endYear:2021,scope,subject},{startYear:2022,endYear:2026,scope,subject}];
 const rows=periods.map(filter=>incidenceRows(corpus,filter));
 const pools=periods.map(filter=>scopeQuestions(corpus,filter));
 const labels=new Map(rows.flat().map(row=>[row.id,row]));
 return [...labels.values()].map(label=>{
  const values=rows.map((period,index)=>{
   const row=period.find(row=>row.id===label.id);
   const total=pools[index].filter(q=>q.subject===label.subject).length;
   const phase=scope.startsWith('medicina')?'2a-dia2':scope;
   const coveredEditions=new Set(corpus.papers.filter(p=>p.phase===phase&&p.year>=periods[index].startYear&&p.year<=periods[index].endYear&&p.classifiedQuestions===p.expectedQuestions).map(p=>p.year)).size;
   const count=row?.count??0;
   return {count,total,rate:total?count/total:null,coveredEditions};
  });
  const [earlier,recent]=values;
  return {id:label.id,subject:label.subject,topicId:label.topicId,label:label.label,earlier,recent,
   deltaPercentagePoints:earlier.rate===null||recent.rate===null?null:100*(recent.rate-earlier.rate)};
 }).sort((a,b)=>a.subject.localeCompare(b.subject,'pt-BR')||(b.recent.count+b.earlier.count)-(a.recent.count+a.earlier.count));
}
