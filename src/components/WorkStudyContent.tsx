import { CoverIllustrationButton } from './CoverIllustrationButton';
import { StudyReflectionPanel } from './StudyReflectionPanel';
import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { WorkDossier } from '../types/literaryWorks';
import { getWorkStudyGuide } from '../lib/workStudyGuides';
import { literaryBoardTraining } from '../data/literaryStudyWorkshop';
import { printStrategyGuide } from '../lib/printStrategyGuide';
import { WorkDeepening } from './WorkDeepening';
import { AiText } from './AiText';

type StudyUnit = NonNullable<ReturnType<typeof getWorkStudyGuide>>['units'][number];

function UnitStudy({ unit }: { unit: StudyUnit }) {
  return <section className="space-y-3">
    <h3 className="font-semibold">Aprofundamento por unidade · {unit.title}</h3>
    <p className="text-xs text-[var(--dim)]">Páginas {unit.pdfStartPage}–{unit.pdfEndPage} do arquivo de referência. A paginação pode diferir do seu exemplar.</p>
    <h4 className="text-sm font-semibold">O que acontece ou é enunciado</h4><p className="text-sm leading-relaxed">{unit.guide.summary}</p>
    <h4 className="text-sm font-semibold">Como ler a construção do sentido</h4><ul className="list-disc pl-5 space-y-2 text-sm">{unit.guide.observe.map(item => <li key={item}>{item}</li>)}</ul>
    {unit.passages.length === 0 && <p className="text-sm text-[var(--dim)]">Esta unidade ainda não tem passagem-chave publicada. Use as observações e a análise integral para orientar a releitura, sem atribuir uma citação a ela.</p>}
    {unit.passages.map(card => <article key={card.id} className="border-l-2 border-[var(--primary)] pl-4 space-y-2 text-sm">
      <h4 className="font-semibold">Passagem comentada · {card.location}</h4>
      <blockquote className="italic">“{card.quote}”</blockquote>
      <dl className="space-y-2">
        <div><dt className="font-semibold">Contexto da passagem</dt><dd>{card.context}</dd></div>
        <div><dt className="font-semibold">Escolha formal</dt><dd>{card.formalDevice}</dd></div>
        <div><dt className="font-semibold">Por que isso importa</dt><dd>{card.effect}</dd></div>
        <div><dt className="font-semibold">Relação com o conjunto</dt><dd>{card.wholeRelation}</dd></div>
      </dl>
    </article>)}
  </section>;
}

export function WorkStudyContent({ dossier, mode, boards = [] }: { dossier: WorkDossier; boards?: string[]; mode: 'summary' | 'strategy' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const workLink = (tab: string) => { const params = new URLSearchParams(searchParams); params.set('aba', tab); return `/obras/${dossier.slug}?${params}`; };
  const guide = useMemo(() => getWorkStudyGuide(dossier), [dossier]);
  const [board, setBoard] = useState<'FUVEST' | 'UNICAMP'>('FUVEST');
  const [printError, setPrintError] = useState('');
  const content = useRef<HTMLDivElement>(null);
  if (!guide) return <p className="ni-panel p-5 text-sm">Este conteúdo ainda não está disponível para esta obra.</p>;
  const requestedUnit = searchParams.get('unidade');
  const unit = guide.units.find(item => item.id === requestedUnit);
  const chooseUnit = (id: string) => setSearchParams(previous => { const params = new URLSearchParams(previous); if (id) params.set('unidade', id); else params.delete('unidade'); return params; });
  const heading = `${mode === 'summary' ? 'Resumo aprofundado' : 'Estratégias de leitura e resolução'} de ${guide.profile.title}`;
  return <section className="ni-panel p-5 space-y-5">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm" onClick={() => {
        if (!content.current) return;
        try { printStrategyGuide(content.current, `${heading}${unit ? ` — ${unit.title}` : ' — obra completa'}`); setPrintError(''); }
        catch { setPrintError('Não foi possível abrir a impressão. Tente novamente.'); }
      }}>Imprimir / Salvar em PDF</button>
        <CoverIllustrationButton getContent={() => content.current} />
      <Link className="text-sm underline" to={`/podcast?work=${encodeURIComponent(dossier.slug)}`}>Estudar esta obra em áudio com fontes</Link>
      <Link className="text-sm underline" to={workLink(mode === 'summary' ? 'estrategias' : 'resumo')}>{mode === 'summary' ? 'Ver estratégias desta obra' : 'Abrir resumo aprofundado'}</Link>
    </div>
    {printError && <p role="alert">{printError}</p>}
    <div className="space-y-2">
      <label className="block text-sm">Escopo do estudo da obra<select className="field block w-full mt-1" value={unit?.id ?? ''} onChange={event => chooseUnit(event.target.value)}><option value="">Visão geral da obra completa</option>{guide.units.map(item => <option key={item.id} value={item.id}>Por unidade · {item.order}. {item.title}</option>)}</select></label>
      <p className="text-xs text-[var(--dim)]">Comece pelo conjunto da obra. Escolha um capítulo, conto ou outra unidade quando quiser aprofundar uma parte.</p>
      {requestedUnit && !unit && <p role="status" className="text-sm">A unidade indicada não está disponível. Mostrando a visão geral da obra completa.</p>}
    </div>
    <details><summary className="cursor-pointer text-sm font-semibold">Registrar o que lembro e como interpreto esta obra</summary><StudyReflectionPanel topicId={`obra:${dossier.slug}`} topicName={guide.profile.title} subject="Literatura" /></details>
    <div ref={content} className="space-y-5" data-print-subject="Literatura" data-print-work={guide.profile.title} data-print-subtopic={unit?.title || 'Obra completa'} data-print-board={mode === 'strategy' ? board : boards.join(' · ') || 'Banca não informada'} data-print-purpose={mode === 'summary' ? 'Resumo aprofundado e compreensão da obra' : 'Estratégias de leitura e resolução de questões'}>
      <h2 className="font-display text-xl">{heading}</h2>
      <p className="text-xs text-[var(--dim)]">Síntese de estudo baseada no dossiê publicado. O resumo inclui desfechos. Edição de referência: {guide.edition.label}</p>
      <p className="text-sm font-semibold">{unit ? `Recorte: ${unit.title}` : 'Visão geral da obra completa'}</p>
      {unit ? <>
        <button type="button" data-print-exclude className="text-sm underline" onClick={() => chooseUnit('')}>Voltar à visão geral da obra completa</button>
        <UnitStudy unit={unit} />
      </> : mode === 'summary' ? <>
        {guide.profile.sections.map(section => <section key={section.title} className="space-y-2"><h3 className="font-semibold">{section.title}</h3><p className="text-sm leading-relaxed">{section.text}</p></section>)}
        <details className="space-y-3"><summary className="cursor-pointer font-semibold">Aprofundar a análise: forma, contexto e interpretações</summary><AiText text={guide.analysis.markdown} className="text-sm leading-relaxed" /></details>
      </> : <>
        <section className="space-y-3"><h3 className="font-semibold">Roteiro específico desta obra</h3><ol className="list-decimal pl-5 space-y-3 text-sm">{guide.profile.strategy.map(step => <li key={step}>{step}</li>)}</ol></section>
        <section className="space-y-3"><h3 className="font-semibold">Evite estas leituras</h3><ul className="list-disc pl-5 space-y-2 text-sm">{guide.profile.pitfalls.map(item => <li key={item}>{item}</li>)}</ul></section>
      </>}
      {mode === 'strategy' && <>
        <section className="space-y-3">
          <label className="block text-sm" data-print-exclude>Banca da estratégia de obra<select className="field block w-full" value={board} onChange={event => setBoard(event.target.value as typeof board)}><option>FUVEST</option><option>UNICAMP</option></select></label>
          <h3 className="font-semibold">Transformar a leitura em resposta · {board}</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">{literaryBoardTraining[board].map(step => <li key={step}>{step}</li>)}</ol>
          <p className="text-xs text-[var(--dim)]">Roteiro de treino, sem previsão de cobrança ou pontuação oficial. A presença de uma banca aqui não indica inclusão na lista: confira ciclo e recorte nas fontes da obra.</p>
        </section>
        <section className="space-y-2"><h3 className="font-semibold">Antes de reler: teste sua explicação</h3><p className="text-sm leading-relaxed">{unit ? 'Reconstrua esta unidade sem consultar: situação → voz → indício → recurso → efeito → relação com a obra. Depois confronte sua resposta com a passagem comentada acima.' : 'Explique a obra como um conjunto: qual é o eixo central, como as partes se organizam e que escolhas de voz, forma e linguagem sustentam sua leitura? Relacione abertura, desenvolvimento e encerramento, usando evidências de diferentes partes. Depois escolha uma unidade para conferir sua interpretação.'} Corrija o ponto em que você só nomeou um tema, sem mostrar como o texto o constrói.</p></section>
      </>}
      {!unit && guide.units.length > 0 && <details className="border-t border-[var(--line)] pt-4 space-y-3">
        <summary className="font-semibold cursor-pointer">Aprofundar uma parte da obra</summary>
        <p className="text-sm text-[var(--dim)]">Abra uma unidade para estudar seu resumo, suas escolhas formais e as passagens publicadas.</p>
        <ol className="list-decimal pl-5 space-y-2 text-sm">{guide.units.map(item => <li key={item.id}><button type="button" className="underline text-left" onClick={() => chooseUnit(item.id)}>{item.title}</button></li>)}</ol>
      </details>}
    </div>
    <WorkDeepening dossier={dossier} title={guide.profile.title} unitId={unit?.id} unitTitle={unit?.title} />
    <Link to={workLink('fontes')} className="text-sm underline">Consultar fontes e recorte da obra</Link>
  </section>;
}
