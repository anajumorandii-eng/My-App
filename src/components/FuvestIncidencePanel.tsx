import { useEffect, useMemo, useState } from 'react';
import { incidenceRows, interdisciplinaryPairs, loadFuvestCorpus, normalizeIncidenceSubject, scopeQuestions, type FuvestCorpus, type FuvestFilter, type FuvestQuestion, type FuvestScope } from '../lib/fuvestIncidence';
import { mockTopics } from '../data/mockData';
import { FuvestResolutionGuide } from './FuvestResolutionGuide';
import { FuvestCurrentRules } from './FuvestCurrentRules';

const phaseLabels = { '1a': '1ª fase', '2a-dia1': '2ª fase · dia 1', '2a-dia2': '2ª fase · banco completo do dia 2', medicina: 'Medicina · Ribeirão Preto', 'medicina-sp': 'Medicina · São Paulo', 'medicina-bauru': 'Medicina · Bauru' };
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const skillName = (skill: string) => skill.replaceAll('_',' ');
const percentage = (rate: number) => `${(rate * 100).toLocaleString('pt-BR',{maximumFractionDigits:1})}%`;
export function FuvestIncidencePanel({ subject }: { subject: string }) {
  const [corpus, setCorpus] = useState<FuvestCorpus | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [startYear, setStartYear] = useState(2022);
  const [endYear, setEndYear] = useState(2026);
  const [scope, setScope] = useState<FuvestScope>(subject === 'Redação' ? '2a-dia1' : '1a');
  const [allAreas, setAllAreas] = useState(false);
  const [group, setGroup] = useState<'topic'|'subtopic'>('topic');
  const [highOnly, setHighOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);
  const [selectionLabel, setSelectionLabel] = useState('');
  const [visibleRows, setVisibleRows] = useState(12);
  const [visibleQuestions, setVisibleQuestions] = useState(8);
  const [sort, setSort] = useState('recurrence');
  useEffect(() => {
    let cancelled = false; setError(false);
    loadFuvestCorpus().then(data => { if(!cancelled) setCorpus(data); }).catch(()=>{if(!cancelled)setError(true);});
    return ()=>{cancelled=true;};
  },[attempt]);
  const filter: FuvestFilter = { startYear, endYear, scope, subject: allAreas ? undefined : normalizeIncidenceSubject(subject), highConfidenceOnly: highOnly };
  const resetSelection = () => { setSelectedIds(null); setSelectionLabel(''); setVisibleRows(12); setVisibleQuestions(8); };
  const view = useMemo(() => {
    if(!corpus)return null;
    const pool = scopeQuestions(corpus,filter);
    const scheduled = scopeQuestions(corpus,filter,true);
    const textMatches = (question: FuvestQuestion) => normalize([question.summary,question.topic,...question.subtopics,question.number,String(question.year),question.rationale].join(' ')).includes(normalize(search));
    const byId = new Map(pool.map(question=>[question.id,question]));
    const rows = incidenceRows(corpus,filter,group).filter(row=>!search || normalize(row.label).includes(normalize(search)) || row.questionIds.some(id=>textMatches(byId.get(id)!)));
    rows.sort((a,b)=>sort==='rate' ? b.rate-a.rate || b.count-a.count : sort==='count' ? b.count-a.count : b.editions-a.editions || b.count-a.count);
    const selectedSet = selectedIds ? new Set(selectedIds) : null;
    const matching = pool.filter(question=>(!highOnly || question.confidence==='high') && (!selectedSet || selectedSet.has(question.id)) && (!search || textMatches(question))).sort((a,b)=>b.year-a.year || a.number.localeCompare(b.number));
    const fullScope=scopeQuestions(corpus,{...filter,subject:undefined});
    return { pool, scheduled, rows, matching, fullScope, pairs:interdisciplinaryPairs(corpus,filter), medium:pool.filter(question=>question.confidence!=='high').length };
  },[corpus,startYear,endYear,scope,subject,allAreas,highOnly,group,search,sort,selectedIds]);
  const select = (ids: string[],label: string) => {setSelectedIds(ids);setSelectionLabel(label);setVisibleQuestions(8);};
  return <div className="space-y-4">
    <section className="ni-panel p-5 space-y-4" aria-labelledby="fuvest-incidence-title">
      <div><p className="text-xs font-mono text-[var(--dim)]">LEITURA DAS PROVAS OFICIAIS · 2022–2026</p>
        <h2 id="fuvest-incidence-title" className="font-display text-xl mt-1">Incidência por questão, assunto e fase</h2>
        <p className="text-sm text-[var(--dim)] mt-2">Contagens observadas e estratégias de resolução ligadas às questões originais. Cada percentual mostra seu denominador; não representa a chance de cair na próxima prova.</p>
      </div>
      {!corpus && !error && <p role="status">Carregando a classificação das provas…</p>}
      {error && <div role="alert"><p>Não foi possível carregar a análise. Nenhum percentual foi estimado.</p><button className="ni-button" onClick={()=>setAttempt(value=>value+1)}>Tentar carregar novamente</button></div>}
      {corpus && view && <>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <p><b>{corpus.questions.length}</b> registros no corpus completo<br/><span className="text-xs text-[var(--dim)]">Questões e uma proposta de redação por edição</span></p>
          <p><b>{view.pool.length}/{view.scheduled.length}</b> questões válidas neste filtro<br/><span className="text-xs text-[var(--dim)]">Anuladas preservadas na auditoria e excluídas da frequência</span></p>
          <p><b>{view.medium}</b> classificações com ressalva neste filtro<br/><span className="text-xs text-[var(--dim)]">Confiança editorial média ou baixa</span></p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <label>Do vestibular<select className="field block w-full" value={startYear} onChange={event=>{const year=Number(event.target.value);setStartYear(year);if(year>endYear)setEndYear(year);resetSelection();}}>{corpus.years.map(year=><option key={year}>{year}</option>)}</select></label>
          <label>Até o vestibular<select className="field block w-full" value={endYear} onChange={event=>{const year=Number(event.target.value);setEndYear(year);if(year<startYear)setStartYear(year);resetSelection();}}>{corpus.years.map(year=><option key={year}>{year}</option>)}</select></label>
          <label>Recorte da prova<select className="field block w-full" value={scope} onChange={event=>{setScope(event.target.value as FuvestScope);resetSelection();}}>{Object.entries(phaseLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
          <label>Detalhamento<select className="field block w-full" value={group} onChange={event=>{setGroup(event.target.value as 'topic'|'subtopic');resetSelection();}}><option value="topic">Assunto principal</option><option value="subtopic">Presença de subassuntos</option></select></label>
          <label>Ordenar por<select className="field block w-full" value={sort} onChange={event=>setSort(event.target.value)}><option value="recurrence">Edições com ocorrência</option><option value="count">Quantidade de questões</option><option value="rate">Percentual dentro da matéria</option></select></label>
          <label>Buscar questão ou conceito<input type="search" className="field block w-full" placeholder="Ex.: osmose, 2024, logaritmos" value={search} onChange={event=>{setSearch(event.target.value);resetSelection();}} /></label>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={allAreas} onChange={event=>{setAllAreas(event.target.checked);resetSelection();}} />Panorama de todas as matérias</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={highOnly} onChange={event=>{setHighOnly(event.target.checked);resetSelection();}} />Somente classificações de alta confiança</label>
        </div>
        <p className="text-xs text-[var(--dim)]">{allAreas?'Cada linha usa o total da sua própria matéria.':'Categoria editorial principal selecionada: '+normalizeIncidenceSubject(subject)+'.'} {group==='subtopic'?'Subassuntos podem coexistir: as porcentagens não somam 100%. Sinônimos são harmonizados; o CSV preserva os rótulos originais.':'Cada questão recebe apenas um assunto principal; conceitos associados aparecem nos cartões.'} Alta confiança filtra as ocorrências atribuídas e conserva o denominador, evitando inflar percentuais.</p>
        {scope.startsWith('medicina') && <p className="text-sm">Histórico separado por campus: em 2022–2024, São Paulo respondeu B/F/Q (primeiras quatro de cada); Bauru, B/G/Q (primeiras quatro); Ribeirão Preto, B/F/G/Q (primeiras três). Em 2025–2026, os três campi responderam B/F/G/Q, primeiras três. São 12 questões por edição e campus. Para 2027, as quatro disciplinas estão confirmadas; a numeração do futuro caderno ainda não foi publicada.</p>}
        {normalizeIncidenceSubject(subject)==='Redação' && !allAreas && <p className="text-sm">São cinco propostas históricas. Frequência temática nessa amostra não é previsão do tema de redação; a estratégia deve partir do gênero e comando da proposta vigente.</p>}
        <div className="overflow-x-auto max-w-full" tabIndex={0} role="region" aria-label="Tabela de incidência com série anual">
          <table className="w-full text-xs text-left border-collapse">
            <caption className="text-left pb-2 text-sm">{phaseLabels[scope]} · {startYear}–{endYear} · {view.rows.length} categorias observadas</caption>
            <thead><tr className="border-b border-[var(--line)]"><th className="p-2">Assunto / matéria</th><th className="p-2 whitespace-nowrap">n/N da matéria</th><th className="p-2">% da categoria</th><th className="p-2 whitespace-nowrap">n/N do bloco</th><th className="p-2">Edições</th>{corpus.years.filter(year=>year>=startYear&&year<=endYear).map(year=><th className="p-2" key={year}>{year}</th>)}</tr></thead>
            <tbody>{view.rows.slice(0,visibleRows).map(row=><tr key={row.id} className="border-b border-[var(--line)] align-top">
              <th scope="row" className="p-2 font-normal min-w-40"><button className="underline text-left" onClick={()=>select(row.questionIds,row.label)}>{row.label}</button><span className="block text-[var(--dim)]">{row.subject}{row.uncertain ? ` · ${row.uncertain} com ressalva` : ''}</span></th>
              <td className="p-2 font-mono">{row.count}/{row.total}</td><td className="p-2 font-mono">{percentage(row.rate)}</td><td className="p-2 font-mono">{row.count}/{view.fullScope.filter(question=>row.subject==='Redação'?question.subject==='Redação':question.subject!=='Redação').length}</td><td className="p-2 font-mono">{row.editions}/{row.observedEditions}</td>
              {row.annual.map(year=><td key={year.year} className="p-2 font-mono whitespace-nowrap" title={year.total ? percentage(year.rate!) : 'Sem questões dessa categoria principal no recorte'}>{year.total ? `${year.count}/${year.total}` : '—'}</td>)}
            </tr>)}</tbody>
          </table>
        </div>
        {!view.rows.length && <p>Sem ocorrências classificadas para este filtro. Isso não exclui o assunto do programa atual; consulte a cobertura e os conceitos associados.</p>}
        {view.rows.length>visibleRows && <button className="ni-button" onClick={()=>setVisibleRows(value=>value+20)}>Mostrar mais categorias</button>}
        <p className="text-xs text-[var(--dim)]">“Edições” = edições com ocorrência / edições integralmente classificadas no recorte. “—” significa que não há denominador dessa matéria no recorte anual. “Bloco” = todas as questões do recorte, com redação isolada das dez questões de Português. São contagens de itens, não pesos em pontos. A tabela mostra categorias observadas; não certifica ausência de conceitos não marcados na classificação.</p>
        {!!view.pairs.length && <details><summary className="cursor-pointer font-semibold text-sm">Pares de áreas exigidos na mesma questão</summary><p className="text-xs mt-2">Coocorrência editorial de conhecimentos necessários, não simples tema do texto. Uma questão pode integrar mais de duas áreas; os pares não devem ser somados.</p><div className="flex flex-wrap gap-2 mt-3">{view.pairs.slice(0,16).map(pair=><button key={pair.label} className="ni-button text-xs" onClick={()=>select(pair.questionIds,pair.label)}>{pair.label} · {pair.count}</button>)}</div></details>}
        <div className="border-t border-[var(--line)] pt-4 space-y-3">
          <h3 className="font-semibold">Questões, caminho de resolução e erro a evitar</h3>
          <p role="status" className="text-xs text-[var(--dim)]">{view.matching.length} questões encontradas{selectionLabel ? ` · ${selectionLabel}` : ''}. {selectedIds && <button className="underline" onClick={resetSelection}>Limpar seleção de assunto</button>}</p>
          {view.matching.slice(0,visibleQuestions).map(question=>{
            const paper=corpus.papers.find(paper=>paper.id===question.paperId)!;
            return <details key={question.id} className="border border-[var(--line)] rounded-lg p-3 text-sm">
              <summary className="cursor-pointer font-semibold">{question.year} · {phaseLabels[question.phase]} · questão {question.number}<span className="block font-normal text-xs mt-1">{question.summary}</span></summary>
              <div className="mt-3 space-y-3">
                <p><b>Assunto principal:</b> {question.subject} · {question.topic}</p><p><b>Subassuntos:</b> {question.subtopics.join(' · ')}</p>
                <p><b>Por que foi classificada assim:</b> {question.rationale}</p>
                <p><b>Habilidades:</b> {question.skills.map(skillName).join(' · ')}</p>
                {!!question.relatedSubjects.length && <p><b>Integração exigida:</b> {[question.subject,...question.relatedSubjects].join(' ↔ ')}</p>}
                {!!question.relatedTopicIds.length && <p><b>Outros conceitos necessários:</b> {question.relatedTopicIds.map(id=>mockTopics.find(topic=>topic.id===id)?.name ?? id).join(' · ')}</p>}
                <div><b>Caminho de resolução:</b><ol className="list-decimal pl-5 mt-2 space-y-1">{question.strategy.map((step,index)=><li key={index}>{step}</li>)}</ol></div>
                <p><b>Erro a evitar:</b> {question.trap}</p>
                <p className="text-xs text-[var(--dim)]">Classificação de confiança {question.confidence==='high'?'alta':question.confidence==='medium'?'média':'baixa'}. {question.reviewNote} A estratégia é uma análise autoral do item, não uma transcrição da resposta oficial.</p>
                <div className="flex flex-wrap gap-3"><a className="underline" href={`${paper.sourceUrl}#page=${question.page}`} target="_blank" rel="noreferrer">Enunciado oficial · página {question.page}</a>{(question.answerKeyUrl ?? paper.answerKeyUrl) && <a className="underline" href={question.answerKeyUrl ?? paper.answerKeyUrl} target="_blank" rel="noreferrer">Gabarito / respostas esperadas</a>}</div>
              </div>
            </details>;
          })}
          {view.matching.length>visibleQuestions && <button className="ni-button" onClick={()=>setVisibleQuestions(value=>value+12)}>Mostrar mais questões analisadas</button>}
        </div>
        <details><summary className="cursor-pointer font-semibold text-sm">Método, cobertura, fontes e arquivos de auditoria</summary><div className="mt-3 text-sm space-y-3">
          <p>{corpus.reviewType} O rótulo principal depende da operação decisiva pedida no item. A categorização por matéria é do Crivo, inclusive em questões interdisciplinares; Português e Literatura usam denominadores separados (o bloco oficial de Português inclui ambos); não é uma grade oficial de distribuição por disciplina.</p>
          <p>Há um denominador por matéria e recorte. Não se somam fases ou bancos diferentes, nem se aplica a frequência do banco completo a Medicina. Não há dados de taxa de acerto dos candidatos: as estratégias não são uma medida empírica de dificuldade.</p>
          <p>O programa e as propostas de redação mudam no período. O ano de 2026 deve ser consultado separadamente, sem extrapolar uma única edição como tendência. O formato de 80 questões pertence a 2027; não convertemos cortes antigos em previsão de nota.</p>
          <ul className="space-y-2">{corpus.papers.map(paper=><li key={paper.id}>{paper.year} · {phaseLabels[paper.phase]} · {paper.classifiedQuestions}/{paper.expectedQuestions} registros · <a className="underline" href={paper.sourceUrl} target="_blank" rel="noreferrer">PDF oficial</a></li>)}</ul>
          {!!corpus.questions.filter(question=>question.excluded).length && <p><b>Excluídas da frequência:</b> {corpus.questions.filter(question=>question.excluded).map(question=>`${question.year} ${question.number}: ${question.excludedReason}`).join(' · ')}</p>}
          <div className="flex flex-wrap gap-3"><a className="underline" href="/analises/fuvest/questoes-2022-2026.csv" download>Baixar classificação completa em CSV</a><a className="underline" href="/analises/fuvest/incidencia-assuntos-2022-2026.csv" download>Baixar incidência por assunto</a><a className="underline" href="/analises/fuvest/incidencia-subassuntos-2022-2026.csv" download>Baixar incidência por subassunto</a><a className="underline" href="/analises/fuvest/relatorio-2022-2026.md" download>Baixar relatório técnico</a><a className="underline" href="/analises/fuvest/corpus-2022-2026.json" download>Baixar corpus e fontes em JSON</a></div>
        </div></details>
      </>}
    </section>
    <FuvestCurrentRules />
    {corpus && <FuvestResolutionGuide corpus={corpus} />}
  </div>;
}
