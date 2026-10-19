/** Reproducible aggregation from explicit question-by-question editorial classifications. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { mockTopics } from '../src/data/mockData';
import { studyAreaForTopic } from '../src/data/studyProtocols';
import { incidenceRows, interdisciplinaryPairs, scopeQuestions, type FuvestCorpus, type FuvestQuestion, type FuvestPaper } from '../src/lib/fuvestIncidence';
const years = [2022,2023,2024,2025,2026];
const harmonization = JSON.parse(await readFile('scripts/data/fuvest-incidence/subtopic-aliases.json', 'utf8'));
const aliases = new Map<string, string[]>(harmonization.aliases.map((entry: any) => [`${entry.subject}:${entry.original}`, entry.canonical]));
const questionPatches = new Map<string, string[]>(harmonization.questionPatches.map((entry: any) => [entry.id, entry.subtopics]));
const sourceDocuments = new Map<string, any>();
const known = new Map(mockTopics.map(topic => [topic.id, { ...topic, subject: studyAreaForTopic(topic) }]));
const papers: FuvestPaper[] = [], questions: FuvestQuestion[] = [];
const sources: { year: number; file: string; sha256: string }[] = [];
for (const year of years) {
  const file = `scripts/data/fuvest-incidence/${year}.json`;
  const raw = await readFile(file, 'utf8');
  const data = JSON.parse(raw);
  for (const document of data.sourceManifest ?? []) sourceDocuments.set(document.sourceUrl, document);
  sources.push({ year, file, sha256: createHash('sha256').update(raw).digest('hex') });
  if (data.year !== year || data.papers.length !== 3 || new Set(data.papers.map((paper: any) => paper.phase)).size !== 3 || !['1a','2a-dia1','2a-dia2'].every(phase => data.papers.some((paper: any) => paper.phase === phase))) throw new Error(`É preciso classificar os três cadernos: ${year}`);
  for (const input of data.papers) {
    const expected = input.phase === '1a' ? 90 : input.phase === '2a-dia1' ? 11 : 36;
    if (input.expectedQuestions !== expected || input.questions.length !== expected || new Set(input.questions.map((q: any) => q.number)).size !== expected) throw new Error(`Cobertura incompleta: ${input.id}`);
    if (!/^https:\/\/(www\.)?fuvest\.br\//.test(input.sourceUrl) || !/^[a-f0-9]{64}$/.test(input.sha256)) throw new Error(`Fonte oficial/hash ausente: ${input.id}`);
    const { questions: records, ...paper } = input;
    papers.push({ ...paper, year, classifiedQuestions: records.length });
    sourceDocuments.set(input.sourceUrl, { sourceUrl: input.sourceUrl, sha256: input.sha256, pages: input.pages });
    if(input.answerKeyUrl)sourceDocuments.set(input.answerKeyUrl, {sourceUrl:input.answerKeyUrl,sha256:input.answerKeySha256});
    for (const row of records) {
      if (!Number.isInteger(row.page) || row.page < 1 || row.page > input.pages || typeof row.excluded !== 'boolean' || !row.subject || !row.subtopics?.length || row.strategy?.length < 2 || !row.summary || !row.rationale || !row.trap || !['high','medium','low'].includes(row.confidence)) throw new Error(`Registro incompleto: ${year} ${input.id} ${row.number}`);
      if (row.topicId && !known.has(row.topicId)) throw new Error(`Tópico desconhecido: ${row.topicId}`);
      if (row.topicId && known.get(row.topicId)!.subject !== row.subject) throw new Error(`Matéria/tópico incompatíveis: ${input.id}:${row.number} ${row.subject}/${known.get(row.topicId)!.subject}`);
      if ((row.relatedTopicIds ?? []).some((id: string) => !known.has(id))) throw new Error(`Tópico associado desconhecido: ${input.id}:${row.number}`);
      if (row.excluded && !row.excludedReason) throw new Error(`Exclusão sem justificativa: ${input.id}:${row.number}`);
      const normalizeNumber = (number: string) => number === 'R' ? number : number.replace(/^(\D*)(\d+)$/, (_, prefix, n) => prefix + String(Number(n)).padStart(2,'0'));
      const number = normalizeNumber(String(row.number));
      if (input.phase === '1a' && !/^(0[1-9]|[1-8][0-9]|90)$/.test(number)) throw new Error(`Número objetivo inválido: ${number}`);
      if (input.phase === '2a-dia1' && !/^(P0[1-9]|P10|R)$/.test(number)) throw new Error(`Número dia1 inválido: ${number}`);
      if (input.phase === '2a-dia2' && !/^[BFGHMQ]0[1-6]$/.test(number)) throw new Error(`Número dia2 inválido: ${number}`);
      const id = `${input.id}:${number}`;
      const rawSubtopics: string[] = row.subtopics;
      const harmonized = (questionPatches.get(id) ?? rawSubtopics).flatMap(label => aliases.get(`${row.subject}:${label}`) ?? [label]);
      const answerSlug: Record<string,string> = {Biologia:'biologia',Física:'fisica',Química:'quimica',Geografia:'geografia',História:'historia',Matemática:'matematica'};
      const answerUrl = year === 2026 && input.phase === '2a-dia2' ? `https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-${answerSlug[row.subject]}.pdf` : input.answerKeyUrl;
      const answerSource = sourceDocuments.get(answerUrl);
      if(answerUrl && year === 2026 && input.phase === '2a-dia2' && !answerSource)throw new Error(`Resposta esperada não verificada: ${answerUrl}`);
      questions.push({ ...row, number, id, paperId: input.id, year, phase: input.phase,
        topic: row.topicId ? known.get(row.topicId)!.name : row.topic,
        originalSubtopics: rawSubtopics,
        subtopics: [...new Set<string>(harmonized.map((value: string) => value.trim()).filter(Boolean))],
        answerKeyUrl: answerUrl, answerKeySha256: answerSource?.sha256 ?? input.answerKeySha256 ?? null,
        relatedSubjects: [...new Set<string>((row.relatedSubjects ?? []).filter((subject: string) => subject !== row.subject))],
        relatedTopicIds: [...new Set<string>((row.relatedTopicIds ?? []).filter((id: string) => id !== row.topicId))],
        reviewNote: row.reviewNote ?? '', excludedReason: row.excludedReason ?? '', subitems: row.subitems ?? [] });
    }
  }
}
if (papers.length !== 15 || new Set(papers.map(paper => paper.id)).size !== 15 || questions.length !== 685 || new Set(questions.map(q => q.id)).size !== 685) throw new Error('O corpus deve conter 685 registros únicos, antes das exclusões.');
for(const id of questionPatches.keys())if(!questions.some(question=>question.id===id))throw new Error(`Harmonização aponta questão inexistente: ${id}`);
const corpus: FuvestCorpus = { reviewedOn: '2026-10-18', reviewType: 'Classificação editorial a partir da leitura das fontes; revisão amostral de integração. Não é classificação oficial nem dupla codificação independente.', years, papers, questions };
await writeFile('src/data/fuvestIncidence.json', JSON.stringify({...corpus,sourceDocuments:[...sourceDocuments.values()],harmonizationPolicy:harmonization.policy,classificationFiles:sources}, null, 2) + '\n');
const counts = papers.map(paper => {
  const pool = questions.filter(question => question.paperId === paper.id && !question.excluded);
  const subjects = [...new Set(pool.map(question => question.subject))].map(subject => {
    const own = pool.filter(question => question.subject === subject);
    const topics = [...new Set(own.map(question => question.topicId ?? `fuvest-unmapped:${question.topic}`))].map(topicId => {
      const matching = own.filter(question => (question.topicId ?? `fuvest-unmapped:${question.topic}`) === topicId);
      return { topicId, count: matching.length, numbers: matching.map(question => question.number) };
    });
    return { subject, total: own.length, topics };
  });
  return { id: paper.id, board: 'FUVEST', year: paper.year, phase: paper.phase === '1a' ? '1ª fase' : paper.phase === '2a-dia1' ? '2ª fase · dia 1' : '2ª fase · dia 2 · banco completo', phaseGroup: paper.phase === '1a' ? '1a' : '2a', version: paper.version,
    examUrl: paper.sourceUrl, answerKeyUrl: paper.answerKeyUrl, reviewedOn: corpus.reviewedOn, examSha256: paper.sha256, answerKeySha256: paper.answerKeySha256,
    completeSubjects: subjects.map(subject => subject.subject), totalQuestions: paper.expectedQuestions, excludedNumbers: questions.filter(question => question.paperId === paper.id && question.excluded).map(question => question.number), classification: 'complete', subjects };
});
await writeFile('src/data/fuvestIncidenceCounts.json', JSON.stringify({ reviewedOn: corpus.reviewedOn, cohorts: counts }, null, 2) + '\n');
await mkdir('public/analises/fuvest', { recursive: true });
const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"','""')}"`;
const header = ['id','ano','fase','questao','pagina','materia','topicId','assunto','subassuntos','subassuntos_originais','habilidades','areas_associadas','confianca','excluida','motivo_exclusao','sintese','justificativa_classificacao','estrategia','erro_a_evitar','nota_revisao','fonte','gabarito','sha256_prova'];
const csv = [header.map(quote).join(';'), ...questions.map(question => {
  const paper = papers.find(paper => paper.id === question.paperId)!;
  return [question.id,question.year,question.phase,question.number,question.page,question.subject,question.topicId,question.topic,question.subtopics.join(' | '),question.originalSubtopics?.join(' | '),question.skills.join(' | '),question.relatedSubjects.join(' | '),question.confidence,question.excluded,question.excludedReason,question.summary,question.rationale,question.strategy.join(' → '),question.trap,question.reviewNote,`${paper.sourceUrl}#page=${question.page}`,question.answerKeyUrl ?? paper.answerKeyUrl,paper.sha256].map(quote).join(';');
})].join('\n');
await writeFile('public/analises/fuvest/questoes-2022-2026.csv','\ufeff' + csv + '\n');
await writeFile('public/analises/fuvest/corpus-2022-2026.json', JSON.stringify({ ...corpus, sourceDocuments:[...sourceDocuments.values()], harmonizationPolicy:harmonization.policy, classificationFiles: sources }, null, 2) + '\n');
const lines = ['# FUVEST 2022–2026: incidência e estratégias', '', `Corpus: ${questions.length} questões/propostas, ${papers.length} cadernos oficiais, cinco edições. ${questions.filter(question => question.excluded).length} itens excluídos das frequências.`, '', '## Método', '', 'Um assunto principal e uma matéria principal por questão; assuntos associados não duplicam a contagem principal. Cada subassunto mede presença e pode coexistir com outros: suas porcentagens não devem ser somadas. Percentual é n/N da matéria, edição/fase e recorte selecionados. Redação é analisada separadamente, sem pretensão de prever tema. Classificação editorial, não classificação oficial nem probabilidade futura. As frequências dependem da taxonomia e da resolução dos casos ambíguos.', '', 'No dia 2, o banco de 36 questões é separado por campus de Medicina, sem somar candidatos de campi diferentes. Em 2022–2024: São Paulo B/F/Q primeiras quatro; Bauru B/G/Q primeiras quatro; Ribeirão Preto B/F/G/Q primeiras três. Em 2025–2026: todos B/F/G/Q primeiras três. Cada campus tem 12 itens por edição. Manuais e capas documentam os recortes; veja as regras verificadas. Para 2027 as disciplinas estão confirmadas, mas não se antecipa a numeração do caderno futuro.', '', '2026 introduz mudanças de programa e redação; a primeira fase de 2027 terá 80 questões. Resultados por edição permanecem visíveis: não se reescala nota de corte antiga nem se converte frequência em chance de aprovação.', '', '## Cobertura e exclusões', '', '|Ano|Fase|Classificadas/previstas|Excluídas|Fonte oficial|','|---|---|---|---|---|', ...papers.map(paper => `|${paper.year}|${paper.phase}|${paper.classifiedQuestions}/${paper.expectedQuestions}|${questions.filter(question => question.paperId === paper.id && question.excluded).map(question => question.number).join(', ') || 'Nenhuma'}|[PDF](${paper.sourceUrl})|`), '', '## Classificações com ressalvas', '', `Alta: ${questions.filter(q=>q.confidence==='high').length}; média: ${questions.filter(q=>q.confidence==='medium').length}; baixa: ${questions.filter(q=>q.confidence==='low').length}. Esses rótulos são de revisão editorial, não probabilidades estatísticas. O filtro de alta confiança conserva o denominador, para não inflar a frequência.`, ''];
for (const scope of ['1a','2a-dia1','2a-dia2','medicina','medicina-sp','medicina-bauru'] as const) {
  lines.push(`## ${scope === '1a' ? '1ª fase' : scope.startsWith('medicina') ? `Medicina — ${scope==='medicina-sp'?'São Paulo':scope==='medicina-bauru'?'Bauru':'Ribeirão Preto'}` : scope === '2a-dia1' ? '2ª fase: dia 1' : '2ª fase: banco completo do dia 2'}`, '');
  const rows = incidenceRows(corpus, {startYear:2022,endYear:2026,scope});
  for (const subject of [...new Set(rows.map(row=>row.subject))].sort()) {
    lines.push(`### ${subject}`, '', '|Assunto|n/N da matéria|%|Edições com ocorrência / cobertas|2022|2023|2024|2025|2026|', '|---|---|---|---|---|---|---|---|---|', ...rows.filter(row=>row.subject===subject).map(row=>`|${row.label}|${row.count}/${row.total}|${(100*row.rate).toFixed(1)}|${row.editions}/${row.observedEditions}|${row.annual.map(year=>year.total ? `${year.count}/${year.total}` : 'Sem recorte').join('|')}|`), '');
  }
  const pairs = interdisciplinaryPairs(corpus,{startYear:2022,endYear:2026,scope});
  if(pairs.length)lines.push('### Conexões interdisciplinares observadas', '', ...pairs.slice(0,12).map(pair=>`- ${pair.label}: ${pair.count} questões. Referências: ${pair.questionIds.join(', ')}.`),'');
}
lines.push('## Como usar a análise', '', 'Comece pelos assuntos recorrentes em várias edições, mas confira as questões e a dificuldade real antes de definir tempo de estudo. Para cada erro, registre conceito ausente, representação inadequada, cálculo ou justificativa. Nas conexões, identifique qual operação exige cada disciplina, resolva a ponte entre os modelos e confira a resposta no nível solicitado. O arquivo CSV contém estratégia e erro específico por questão, com fonte e página.', '', '## Limites', '', 'Cinco edições são um histórico descritivo curto; não estabelecem uma distribuição estacionária nem previsão. Não há taxas de acerto de candidatos nem estimativa empírica de dificuldade neste corpus. Não foi medido acordo entre dois classificadores independentes. A revisão amostral e os casos de confiança média/baixa devem permanecer visíveis. Assunto sem contagem principal pode aparecer como associado; ausência histórica não exclui cobrança no programa atual.', '');
await mkdir('docs/estudos-2026/fuvest-incidencia', {recursive:true});
await writeFile('docs/estudos-2026/fuvest-incidencia/relatorio-2022-2026.md', lines.join('\n'));
console.log(JSON.stringify({ questions: questions.length, papers: papers.length, excluded: questions.filter(question=>question.excluded).map(question=>question.id), confidence: ['high','medium','low'].map(confidence=>({confidence,count:questions.filter(question=>question.confidence===confidence).length})) }));

// Aggregate downloads retain both conditional-category and whole-block denominators.
for (const [group,filename] of [['topic','assuntos'],['subtopic','subassuntos']] as const) {
  const rows: unknown[][] = [['recorte','categoria_editorial','assunto','ocorrencias','total_categoria','percentual_categoria','total_bloco','percentual_bloco','edicoes_com_ocorrencia','edicoes_integralmente_cobertas','2022_n_N','2023_n_N','2024_n_N','2025_n_N','2026_n_N','questoes']];
  for (const scope of ['1a','2a-dia1','2a-dia2','medicina','medicina-sp','medicina-bauru'] as const) {
    const filter={startYear:2022,endYear:2026,scope};
    const pool=scopeQuestions(corpus,filter);
    for(const row of incidenceRows(corpus,filter,group)){
      const totalBlock=pool.filter(question=>row.subject==='Redação'?question.subject==='Redação':question.subject!=='Redação').length;
      rows.push([scope,row.subject,row.label,row.count,row.total,(100*row.rate).toFixed(4),totalBlock,(100*row.count/totalBlock).toFixed(4),row.editions,row.observedEditions,...row.annual.map(year=>year.total?`${year.count}/${year.total}`:'sem denominador'),row.questionIds.join(' | ')]);
    }
  }
  await writeFile(`public/analises/fuvest/incidencia-${filename}-2022-2026.csv`,'\ufeff'+rows.map(row=>row.map(quote).join(';')).join('\n')+'\n');
}
const details: string[] = ['## Distribuição da primeira fase por categoria editorial', '', 'As edições indicam o ano de ingresso: a FUVEST 2026 foi aplicada em 2025. A FUVEST 2027, aplicada em 2026, ainda não integra a série de provas realizadas. Simulados não foram misturados ao histórico.', '', 'Português e Literatura são separados aqui para análise de habilidades, mas pertencem ao mesmo bloco oficial no primeiro dia da segunda fase. Cada n/N deve ser lido com seu recorte. Frequência de itens não é peso em pontos, especialmente na redação.', '', '|Categoria principal|Itens/448 válidos|% dos itens|2022|2023|2024|2025|2026|','|---|---|---|---|---|---|---|---|'];
const first=corpus.questions.filter(question=>question.phase==='1a'&&!question.excluded);
for(const subject of [...new Set(first.map(question=>question.subject))].sort()){
 const own=first.filter(question=>question.subject===subject);
 details.push(`|${subject}|${own.length}/448|${(100*own.length/448).toFixed(1)}|${years.map(year=>own.filter(question=>question.year===year).length).join('|')}|`);
}
details.push('', '## Do resultado observado ao treino', '', 'Os exemplos abaixo ilustram operações reais das categorias mais recorrentes, não uma seleção de questões de dificuldade medida. Consulte a série anual antes de transformar frequência agregada em prioridade. Uma categoria ampla tende a acumular mais itens que outra estreita; isso não mede retorno pedagógico por minuto.', '');
for(const scope of ['1a','medicina','medicina-sp','medicina-bauru'] as const){
 const rows=incidenceRows(corpus,{startYear:2022,endYear:2026,scope});
 for(const subject of [...new Set(rows.map(row=>row.subject))].sort()){
  details.push(`### ${scope.startsWith('medicina')?`Medicina D2 (${scope})`:'1ª fase'} — ${subject}`, '');
  const leaders=rows.filter(row=>row.subject===subject).sort((a,b)=>b.editions-a.editions||b.count-a.count).slice(0,3);
  for(const row of leaders){
   details.push(`**${row.label}: ${row.count}/${row.total} (${(100*row.rate).toFixed(1)}% da categoria), em ${row.editions}/${row.observedEditions} edições observadas.**`,'');
   const examples=row.questionIds.map(id=>questions.find(question=>question.id===id)!).sort((a,b)=>b.year-a.year);
   const selected=[examples[0],examples.find(question=>question.year!==examples[0]?.year)].filter(Boolean);
   for(const example of selected){const paper=papers.find(paper=>paper.id===example.paperId)!;details.push(`- [${example.year}, ${example.number}, p. ${example.page}](${paper.sourceUrl}#page=${example.page}): ${example.summary} Caminho: ${example.strategy.join(' → ')}. Erro a evitar: ${example.trap}`);}
   details.push('');
  }
 }
}
details.push('## Categorias do currículo sem ocorrência principal', '', 'Zero nesta tabela significa apenas que nenhum item recebeu esse rótulo como principal no recorte. Não demonstra que o conceito esteja ausente dos enunciados, de pré-requisitos ou do programa. A coluna de associação registra outro tópico explicitamente necessário segundo a codificação; não é uma lista exaustiva de todo conhecimento de base.', '', '|Recorte|Matéria|Assunto do currículo|Principal|Associado explicitamente|','|---|---|---|---|---|');
for(const scope of ['1a','medicina','medicina-sp','medicina-bauru'] as const){
 const pool=scopeQuestions(corpus,{startYear:2022,endYear:2026,scope});
 for(const topic of mockTopics){
  const subject=studyAreaForTopic(topic);const denominator=pool.filter(question=>question.subject===subject).length;
  if(!denominator||pool.some(question=>question.topicId===topic.id))continue;
  details.push(`|${scope}|${subject}|${topic.name}|0/${denominator}|${pool.filter(question=>question.relatedTopicIds.includes(topic.id)).length}|`);
 }
}
const fullReport=lines.join('\n')+'\n\n'+details.join('\n')+'\n';
await writeFile('docs/estudos-2026/fuvest-incidencia/relatorio-2022-2026.md',fullReport);
await writeFile('public/analises/fuvest/relatorio-2022-2026.md',fullReport);
await writeFile('public/analises/fuvest/guia-estrategias-2027.md',await readFile('docs/estudos-2026/fuvest-incidencia/estrategias-2027.md','utf8'));
