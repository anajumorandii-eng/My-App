import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fuvestAreaDepth, fuvestDepthSources, priorityCurriculum, topicDepthDrill, type DepthPhase } from '../data/fuvestStudyDepth';
import { completeTopicEvidence } from '../lib/examEvidence';
import { prioritySummarySubject } from '../lib/actionablePriorities';

export function FuvestDepthPanel({ subject }: { subject: string }) {
  const [phase, setPhase] = useState<DepthPhase>(subject === 'Redação' ? 'second' : 'first');
  const [query, setQuery] = useState('');
  const topics = useMemo(() => priorityCurriculum(subject), [subject]);
  const areaName = subject === 'Língua Portuguesa' ? 'Português' : subject === 'Língua Inglesa' ? 'Inglês' : subject;
  const area = fuvestAreaDepth[areaName];
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const filtered = topics.filter(topic => normalize([topic.name, ...(topic.chapters ?? [])].join(' ')).includes(normalize(query.trim())));
  const chapters = topics.reduce((sum, topic) => sum + (topic.chapters?.length ?? 0), 0);
  const evidencePhase = phase === 'first' ? '1a-fase' : '2a-fase';
  const mapped = topics.filter(topic => completeTopicEvidence(topic, 'FUVEST', evidencePhase).length > 0).length;
  return <section className="ni-panel p-5 space-y-4" aria-labelledby="fuvest-depth-title">
    <div>
      <p className="text-xs font-mono text-[var(--dim)]">FUVEST 2027 · PREPARAÇÃO PARA MEDICINA</p>
      <h2 id="fuvest-depth-title" className="font-display text-xl mt-1">Do assunto à habilidade de prova</h2>
      <p className="text-sm text-[var(--dim)] mt-2">Explore o currículo e o que precisa conseguir fazer em cada conteúdo. Os roteiros são orientações autorais de treino; não são previsão de cobrança nem espelho oficial de correção.</p>
    </div>
    <div className="grid sm:grid-cols-3 gap-3 text-sm">
      <p><b>{topics.length}</b> assuntos no roteiro</p>
      <p><b>{chapters}</b> capítulos para localizar lacunas</p>
      <p><b>{mapped} de {topics.length}</b> assuntos cobertos por recortes completos da matéria nesta fase</p>
    </div>
    <p className="text-xs text-[var(--dim)]">Cobertura do roteiro não certifica cobertura integral do programa oficial. Os recortes completos identificam edição, fase e denominador por matéria. A frequência por capítulo ainda não foi levantada; recortes selecionados não sustentam percentuais. Sem dado não significa que não cai.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      <label className="text-sm">Recorte de preparação<select className="field block w-full" value={phase} onChange={event => setPhase(event.target.value as DepthPhase)}><option value="first" disabled={subject === 'Redação'}>1ª fase · cobertura e resolução objetiva</option><option value="second">2ª fase · desenvolvimento discursivo</option></select></label>
      <label className="text-sm">Buscar assunto ou capítulo<input className="field block w-full" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: ligação gênica, circuitos, sintaxe" /></label>
    </div>
    <div className="border-l-2 border-[var(--line)] pl-3 text-sm space-y-2" aria-live="polite">
      {phase === 'first'
        ? <p><b>1ª fase:</b> pratique interpretação de enunciado, escolha de modelo, resolução e análise de distratores. Preserve cobertura de todas as áreas; não abandone conteúdos porque faltam no histórico.</p>
        : <p><b>2ª fase:</b> confira os componentes da sua carreira e unidade no guia de 2027. Treine cada subitem com desenvolvimento explícito, justificativa e conclusão; use as respostas esperadas da prova correspondente para conferir. Este seletor muda o roteiro e consulta somente os recortes cadastrados da fase escolhida; não estima a próxima prova.</p>}
      <p>Separe no registro de erros: conceito, interpretação, modelo, cálculo, justificativa e tempo. Acertar uma alternativa não comprova que você consegue desenvolver uma resposta aberta.</p>
    </div>
    {area && <details><summary className="cursor-pointer font-semibold">Habilidades e integração de {areaName}</summary><ul className="list-disc pl-5 mt-3 space-y-2 text-sm">{area.skills.map(skill => <li key={skill}>{skill}</li>)}</ul><p className="text-sm mt-3"><b>Integração:</b> {area.transfer}</p><p className="text-sm mt-2"><b>Conferência:</b> {area.check}</p></details>}
    <p role="status" className="text-xs text-[var(--dim)]">{filtered.length} de {topics.length} assuntos encontrados. A ordem abaixo é curricular e não expressa incidência nem domínio.</p>
    <div className="space-y-3">
      {filtered.map(topic => {
        const historical = completeTopicEvidence(topic, 'FUVEST', evidencePhase);
        const drill = topicDepthDrill(topic);
        const supplemental = topic.id.startsWith('priority_');
        return <details key={topic.id} className="border border-[var(--line)] rounded-lg p-3">
          <summary className="cursor-pointer"><b>{topic.name}</b><span className="block text-xs text-[var(--dim)] mt-1">{topic.chapters?.length ?? 0} capítulos · {historical.length ? 'Há recorte completo da matéria nesta fase' : 'Sem recorte completo da matéria nesta fase'}</span></summary>
          <div className="space-y-3 text-sm mt-3">
            <p><b>Referência histórica:</b> {historical.length ? historical.map(row => <span className="block" key={row.cohort.id}>{row.cohort.year} · {row.cohort.phase}: {row.count}/{row.total} questões da matéria ({(100 * row.count / row.total).toFixed(1)}%). <a className="underline" href={row.cohort.examUrl} target="_blank" rel="noreferrer">Prova oficial</a></span>) : 'Sem percentual atribuível. Mantenha no diagnóstico e na cobertura do programa.'}</p>
            <p><b>Pré-requisitos curriculares:</b> {topic.prerequisites.map(id => priorityCurriculumForName(id)).join(' · ') || 'Sem vínculo cadastrado. Verifique a base necessária no problema.'}</p>
            <div><b>Capítulos e subassuntos do currículo</b><ul className="list-disc pl-5 mt-2 space-y-1">{topic.chapters?.map(chapter => <li key={chapter}>{chapter}</li>)}</ul></div>
            {drill ? <div className="space-y-2"><p><b>Desafio autoral do assunto:</b> {drill.task}</p><p><b>O que conferir:</b> {drill.criteria}</p></div> : <p><b>Roteiro da área aplicado a este assunto:</b> selecione um capítulo acima e uma questão correspondente. {area?.check} Ainda não há desafio específico revisado para este assunto.</p>}
            <p><b>{phase === 'first' ? 'Treino objetivo' : 'Treino discursivo'}:</b> {phase === 'first' ? 'Resolva sem consultar e justifique a alternativa escolhida; explique o erro de pelo menos um distrator e refaça com uma condição alterada.' : 'Separe os verbos de comando e responda a cada subitem. Escreva conceito ou lei, evidência ou cálculo e conclusão; compare com a resposta esperada e reescreva o trecho insuficiente.'}</p>
            <p><b>Critério de avanço sugerido:</b> resolva uma nova aplicação sem ajuda e recupere a explicação em outra sessão. Registre se a dificuldade foi conceitual, de leitura, de procedimento ou de expressão. Esse critério é editorial, não uma nota de aprovação.</p>
            {!supplemental ? <div className="flex flex-wrap gap-3"><Link className="underline" to={`/questoes?topic=${encodeURIComponent(topic.id)}&board=FUVEST`}>Buscar questões FUVEST do assunto</Link><Link className="underline" to={`/resumos?subject=${encodeURIComponent(prioritySummarySubject(topic))}`}>Consultar resumos da área</Link></div> : <p className="text-xs">Roteiro complementar: ainda não integrado ao diagnóstico e ao banco de questões. Consulte o programa oficial e as provas do acervo abaixo.</p>}
            {phase === 'second' && <Link className="underline" to="/treino-2a-fase">Abrir treino de 2ª fase</Link>}
            <p className="text-xs text-[var(--dim)]">O link de questões pesquisa o acervo disponível; não garante questão cadastrada para cada capítulo nem seleciona a 2ª fase.</p>
          </div>
        </details>;
      })}
    </div>
    {!filtered.length && <p>Nenhum assunto corresponde à busca. Tente outro termo ou limpe o campo.</p>}
    <details><summary className="cursor-pointer font-semibold">Fontes, método e limites da análise</summary>
      <div className="space-y-3 mt-3 text-sm">
        <p>Roteiro revisto em 18/10/2026. Os capítulos partem do currículo de apostilas cadastrado no Crivo; Arte e Educação Física têm um roteiro complementar baseado nos eixos do programa. As habilidades e desafios são sínteses editoriais de preparação.</p>
        <p>Um índice verificável precisa registrar ano, fase, versão, número da questão, fonte oficial, assunto principal e assuntos associados. A frequência principal é questões do assunto ÷ total de questões do recorte. A presença por edição é outra métrica. Não some percentuais de bases diferentes nem trate capítulos sem classificação como incidência zero.</p>
        <p>Somente os recortes completos cadastrados entram nos percentuais acima, separados por edição e fase. A classificação por assunto é do Crivo, não da FUVEST. Não há levantamento completo de uma série longa nem índice por capítulo. O painel de evidências abaixo inclui os demais recortes e exemplos; percentuais antigos sem denominador permanecem fora do cálculo. Mudanças de programa e formato limitam comparações.</p>
        <ul className="space-y-2">{fuvestDepthSources.map(source => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noreferrer">{source.label}</a><p className="text-xs text-[var(--dim)]">{source.scope}</p></li>)}</ul>
      </div>
    </details>
  </section>;
}

const curriculumAreas = Object.keys(fuvestAreaDepth);
const curriculumNames = new Map(curriculumAreas.flatMap(priorityCurriculum).map(topic => [topic.id, topic.name]));
function priorityCurriculumForName(id: string) { return curriculumNames.get(id) ?? id; }
