/** Build only complete, source-read cohorts. No inference from selected examples. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname} from 'node:path';
import {mockTopics} from '../src/data/mockData';
import {studyAreaForTopic} from '../src/data/studyProtocols';
import {boardIncidenceRows,isCompleteBoardCorpus,type BoardCorpus,type BoardPaper,type BoardQuestion,type ResearchBoard} from '../src/lib/boardIncidence';
// User-authorized release of the 16 completed editions; deferred years are explicit.
// Drafts never enter this input list or the published denominators.
const plans=[{board:'ENEM',slug:'enem',years:[2024,2025],plannedYears:[2021,2022,2023,2024,2025]},{board:'UNESP',slug:'unesp',years:[2022,2023,2024,2025],plannedYears:[2022,2023,2024,2025,2026]},{board:'FAMERP',slug:'famerp',years:[2022,2023,2024,2025,2026],plannedYears:[2022,2023,2024,2025,2026]},{board:'UNIFESP',slug:'unifesp',years:[2022,2023,2024,2025,2026],plannedYears:[2022,2023,2024,2025,2026]}] as const;
const known=new Map(mockTopics.map(topic=>[topic.id,{...topic,subject:studyAreaForTopic(topic)}]));
const harmonization=JSON.parse(await readFile('scripts/data/fuvest-incidence/subtopic-aliases.json','utf8'));
const aliases=new Map<string,string[]>(harmonization.aliases.map((entry:any)=>[`${entry.subject}:${entry.original}`,entry.canonical]));
const hash=(bytes:string)=>createHash('sha256').update(bytes).digest('hex');
const validHash=(value:unknown)=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const validUrl=(value:unknown)=>typeof value==='string'&&/^https:\/\//.test(value);
const quote=(value:unknown)=>`"${String(value??'').replaceAll('"','""')}"`;
const csv=(rows:unknown[][])=>'\ufeff'+rows.map(row=>row.map(quote).join(';')).join('\n')+'\n';
const cohorts:any[]=[],cases:any[]=[];
// Validate every cohort before replacing any published export. A late failure
// must not leave earlier boards looking like a successful full expansion.
const pendingWrites = new Map<string,string>();
const queueWrite = async (path:string,content:string) => { pendingWrites.set(path,content); };

for(const plan of plans){
 const board=plan.board as ResearchBoard,papers:BoardPaper[]=[],questions:BoardQuestion[]=[],sources:any[]=[],classificationFiles:any[]=[],coverageNotes:string[]=[];
 for(const year of plan.years){
  const path=`scripts/data/board-incidence/${plan.slug}/${year}.json`,raw=await readFile(path,'utf8'),data=JSON.parse(raw);
  if(data.board!==board||data.year!==year||!data.papers?.length||!data.coverageNote)throw Error(`Cobertura/identidade ausente: ${path}`);
  classificationFiles.push({path,sha256:hash(raw)});coverageNotes.push(`${year}: ${data.coverageNote}`);
  sources.push(...(data.sourceManifest??[]));
  for(const input of data.papers){
   if(!input.id.startsWith(`${plan.slug}-${year}-`)||!input.group||!input.phase||!input.format||!input.version||!['1a','2a'].includes(input.phaseGroup))throw Error(`Metadados incompletos: ${input.id}`);
   if(!validUrl(input.sourceUrl)||!validHash(input.sha256)||!Number.isInteger(input.pages)||input.pages<1)throw Error(`Fonte incompleta: ${input.id}`);
   if(input.answerKeyUrl&&(!validUrl(input.answerKeyUrl)||!validHash(input.answerKeySha256)))throw Error(`Gabarito inválido: ${input.id}`);
   if(!input.answerKeyUrl&&input.answerKeySha256)throw Error(`Hash sem gabarito: ${input.id}`);
   if(!input.answerKeyUrl&&!input.coverageNote)throw Error(`Ausência de espelho sem nota: ${input.id}`);
   if(!Number.isInteger(input.expectedQuestions)||input.expectedQuestions<1||input.questions?.length!==input.expectedQuestions)throw Error(`Caderno incompleto: ${input.id}`);
   const {questions:rawQuestions,...metadata}=input;
   papers.push({...metadata,board,year,classifiedQuestions:rawQuestions.length});
   sources.push({sourceUrl:input.sourceUrl,sha256:input.sha256,pages:input.pages,role:'exam'},...(input.answerKeyUrl?[{sourceUrl:input.answerKeyUrl,sha256:input.answerKeySha256,role:'answer-key'}]:[]));
   for(const original of rawQuestions){
    const row={...original,subject:original.subject==='Artes'?'Arte':original.subject,relatedSubjects:(original.relatedSubjects??[]).map((subject:string)=>subject==='Artes'?'Arte':subject)};
    const number=String(row.number).replace(/^(\D*)(\d+)$/,(_:string,prefix:string,n:string)=>prefix+String(Number(n)).padStart(2,'0'));
    if(!number||!Number.isInteger(row.page)||row.page<1||row.page>input.pages||!row.subject||!row.topic||!row.summary||!row.rationale||!row.trap||!Array.isArray(row.strategy)||row.strategy.length<2||!row.subtopics?.length||!row.skills?.length||typeof row.excluded!=='boolean'||!['high','medium','low'].includes(row.confidence))throw Error(`Ficha incompleta: ${input.id}:${number}`);
    const ownAnswerKey=row.answerKeyUrl!=null||row.answerKeySha256!=null;
    if(ownAnswerKey&&(!validUrl(row.answerKeyUrl)||!validHash(row.answerKeySha256)))throw Error(`Gabarito inválido da questão: ${input.id}:${number}`);
    const answerKeyUrl=ownAnswerKey?row.answerKeyUrl:number==='R'?null:input.answerKeyUrl??null;
    const answerKeySha256=ownAnswerKey?row.answerKeySha256:number==='R'?null:input.answerKeySha256??null;
    if(row.topicId&&(!known.has(row.topicId)||known.get(row.topicId)!.subject!==row.subject))throw Error(`Taxonomia incompatível: ${input.id}:${number}/${row.topicId}`);
    if((row.relatedTopicIds??[]).some((id:string)=>!known.has(id)))throw Error(`Associação desconhecida: ${input.id}:${number}`);
    if(row.excluded&&!row.excludedReason)throw Error(`Anulada sem motivo: ${input.id}:${number}`);
    if(row.confidence!=='high'&&!row.reviewNote)throw Error(`Ressalva sem nota: ${input.id}:${number}`);
    questions.push({...row,id:`${input.id}:${number}`,paperId:input.id,year,phase:input.phase,board,number,topic:row.topicId?known.get(row.topicId)!.name:row.topic,originalSubtopics:row.subtopics,subtopics:[...new Set<string>(row.subtopics.flatMap((label:string)=>aliases.get(`${row.subject}:${label}`)??[label]))],relatedSubjects:[...new Set<string>((row.relatedSubjects??[]).filter((subject:string)=>subject!==row.subject))],relatedTopicIds:[...new Set<string>((row.relatedTopicIds??[]).filter((id:string)=>id!==row.topicId))],subitems:row.subitems??[],reviewNote:row.reviewNote??'',excludedReason:row.excludedReason??'',answerKeyUrl,answerKeySha256});
   }
  }
 }
 if(new Set(papers.map(paper=>paper.id)).size!==papers.length||new Set(questions.map(question=>question.id)).size!==questions.length||new Set(papers.map(paper=>paper.sha256)).size!==papers.length)throw Error(`Cadernos/itens duplicados: ${board}`);
 // Every year must cover both candidate blocks; formats remain separate groups.
 for(const year of plan.years){
  const own=papers.filter(paper=>paper.year===year);
  if(own.length<2||!questions.some(question=>question.year===year&&question.subject==='Redação'))throw Error(`Dia/fase/redação ausente: ${board}/${year}`);
 }
 const corpus:BoardCorpus={board,reviewedOn:'2026-10-22',reviewType:'Classificação editorial por leitura das fontes. Revisão de integração; sem dupla codificação independente integral nem dificuldade medida.',coverageNote:coverageNotes.join('\n'),years:[...plan.years],plannedYears:[...plan.plannedYears],papers,questions};
 if(!isCompleteBoardCorpus(corpus,board))throw Error(`Corpus incompleto: ${board}`);
 const bySourceUrl=new Map<string,any>();
 for(const source of sources){
  const {url,localPath,answerKeyPath,...metadata}=source;
  const sourceUrl=source.sourceUrl??url;
  if(!validUrl(sourceUrl)||!validHash(source.sha256))throw Error(`Documento sem URL/hash: ${board}`);
  const previous=bySourceUrl.get(sourceUrl);
  if(previous&&previous.sha256!==source.sha256)throw Error(`Hashes divergentes para a mesma fonte: ${sourceUrl}`);
  // Keep provenance from the detailed manifest when the paper repeats its URL.
  bySourceUrl.set(sourceUrl,{...metadata,...previous,sourceUrl});
 }
 const documents=[...bySourceUrl.values()];
 const exported={...corpus,sourceDocuments:documents,classificationFiles,language:board==='ENEM'?'Inglês nas questões opcionais; aplicação regular impressa':'conforme caderno'};
 await queueWrite(`src/data/incidence/${plan.slug}.json`,JSON.stringify(exported,null,2)+'\n');
 const out=`public/analises/incidencia/${plan.slug}`;
 await queueWrite(`${out}/corpus.json`,JSON.stringify(exported,null,2)+'\n');
 await queueWrite(`${out}/questoes.csv`,csv([['id','ano','fase','grupo','questao','materia','assunto','subassuntos','confianca','excluida','motivo','sintese','justificativa','estrategia','erro','fonte','gabarito'],...questions.map(question=>{const paper=papers.find(paper=>paper.id===question.paperId)!;return [question.id,question.year,question.phase,paper.group,question.number,question.subject,question.topic,question.subtopics.join(' | '),question.confidence,question.excluded,question.excludedReason,question.summary,question.rationale,question.strategy.join(' → '),question.trap,`${paper.sourceUrl}#page=${question.page}`,question.answerKeyUrl];})]));
 const report=[`# ${board}: incidência ${plan.years[0]}–${plan.years.at(-1)}`,'',`${questions.length} questões/propostas, ${papers.length} cadernos. ${questions.filter(question=>question.excluded).length} itens excluídos. A proposta de redação é uma unidade; subitens e cores equivalentes não são questões extras.`,'',corpus.coverageNote,'',`Edições não classificadas nesta publicação: ${plan.plannedYears.filter(year=>!(plan.years as readonly number[]).includes(year)).join(', ')||'nenhuma'}. Ausência de classificação não representa zero de cobrança. Rascunhos não entram nos denominadores.`,'','Classificação editorial: uma matéria e assunto principal por item. Subassuntos são presenças múltiplas. n/N usa apenas a matéria, grupo e edições selecionados. Questões anuladas saem da frequência. Confiança editorial não é uma probabilidade. Não há dificuldade medida nem previsão de cobrança. Formatos diferentes têm grupos distintos. Não se somam percentuais entre bancas. No ENEM, contagem não equivale ao peso na TRI. Na UNIFESP, estes são cadernos do Sistema Misto; o ENEM não é contado novamente como UNIFESP.','', '|Ano|Fase|Grupo|Classificadas/previstas|Fonte|','|---|---|---|---|---|',...papers.map(paper=>`|${paper.year}|${paper.phase}|${paper.group}|${paper.classifiedQuestions}/${paper.expectedQuestions}|[PDF](${paper.sourceUrl})|`),''];
 for(const [mode,name] of [['topic','assuntos'],['subtopic','subassuntos']] as const){
  const aggregate:unknown[][]=[['grupo','materia','assunto','ocorrencias','total_materia','percentual','com_ressalva','edicoes_com_ocorrencia','edicoes_cobertas',...plan.plannedYears.map(year=>`${year}_n_N`),'questoes']];
  for(const group of [...new Set(papers.map(paper=>paper.group))]){
   const filter={startYear:plan.plannedYears[0],endYear:plan.plannedYears.at(-1)!,group};
   const rows=boardIncidenceRows(corpus,filter,mode);
   for(const row of rows)aggregate.push([group,row.subject,row.label,row.count,row.total,(100*row.rate).toFixed(4),row.uncertain,row.editions,row.observedEditions,...row.annual.map(annual=>annual.total?`${annual.count}/${annual.total}`:annual.covered?'sem categoria':'não classificado'),row.questionIds.join(' | ')]);
   if(mode==='topic'){
    report.push(`## ${group}`,'',`|Matéria|Assunto|n/N|%|Edições|${plan.plannedYears.join('|')}|`,`|${Array(5+plan.plannedYears.length).fill('---').join('|')}|`,...rows.map(row=>`|${row.subject}|${row.label}|${row.count}/${row.total}|${(100*row.rate).toFixed(1)}|${row.editions}/${row.observedEditions}|${row.annual.map(annual=>annual.total?`${annual.count}/${annual.total}`:annual.covered?'Sem categoria':'Não classificado').join('|')}|`),'');
   }
  }
  await queueWrite(`${out}/incidencia-${name}.csv`,csv(aggregate));
 }
 await queueWrite(`${out}/relatorio.md`,report.join('\n')+'\n');

 await queueWrite(`docs/estudos-2026/incidencia-multibancas/${plan.slug}-relatorio.md`,report.join('\n')+'\n');
 for(const paper of papers){
  const pool=questions.filter(question=>question.paperId===paper.id&&!question.excluded);
  const subjects=[...new Set(pool.map(question=>question.subject))].map(subject=>{
   const own=pool.filter(question=>question.subject===subject);
   return {subject,total:own.length,topics:[...new Set(own.map(question=>question.topicId??`fuvest-unmapped:${question.topic}`))].map(topicId=>{const matching=own.filter(question=>(question.topicId??`fuvest-unmapped:${question.topic}`)===topicId);return {topicId,count:matching.length,numbers:matching.map(question=>question.number)};})};
  });
  cohorts.push({id:paper.id,board,year:paper.year,group:paper.group,format:paper.format,phase:paper.phase,phaseGroup:paper.phaseGroup,version:paper.version,examUrl:paper.sourceUrl,answerKeyUrl:paper.answerKeyUrl,reviewedOn:corpus.reviewedOn,examSha256:paper.sha256,answerKeySha256:paper.answerKeySha256,completeSubjects:subjects.map(subject=>subject.subject),totalQuestions:paper.expectedQuestions,excludedNumbers:questions.filter(question=>question.paperId===paper.id&&question.excluded).map(question=>question.number),classification:'complete',subjects});
 }
 for(const question of questions.filter(question=>!question.excluded))cases.push({id:question.id,cohortId:question.paperId,number:question.number,topicId:question.topicId??`fuvest-unmapped:${question.topic}`,relatedTopicIds:question.relatedTopicIds,subject:question.subject,chapter:question.subtopics.join(' · '),title:question.summary,concept:question.rationale,trap:question.trap,steps:question.strategy,commandWords:[]});

 console.log(JSON.stringify({board,questions:questions.length,papers:papers.length,excluded:questions.filter(question=>question.excluded).length}));
}
await queueWrite('src/data/boardIncidenceCounts.json',JSON.stringify({reviewedOn:'2026-10-22',cohorts},null,2)+'\n');
await queueWrite('src/data/boardIncidenceCases.json',JSON.stringify(cases,null,2)+'\n');

for(const [path,content] of pendingWrites){
 await mkdir(dirname(path),{recursive:true});
 await writeFile(path,content);
}
