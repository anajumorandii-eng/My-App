import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { WorkDossier } from '../types/literaryWorks';
import { getWorkStudyGuide } from '../lib/workStudyGuides';
import { literaryBoardTraining } from '../data/literaryStudyWorkshop';
import { printStrategyGuide } from '../lib/printStrategyGuide';
import { AiText } from './AiText';

export function WorkStudyContent({ dossier, mode }: { dossier: WorkDossier; mode: 'summary' | 'strategy' }) {
  const [searchParams] = useSearchParams();
  const workLink = (tab: string) => { const params = new URLSearchParams(searchParams); params.set('aba', tab); return `/obras/${dossier.slug}?${params}`; };
  const guide = useMemo(() => getWorkStudyGuide(dossier), [dossier]);
  const [unitId, setUnitId] = useState('');
  const [board, setBoard] = useState<'FUVEST' | 'UNICAMP'>('FUVEST');
  const [printError, setPrintError] = useState('');
  const content = useRef<HTMLDivElement>(null);
  if (!guide) return <p className="ni-panel p-5 text-sm">Este conteúdo ainda não está disponível para esta obra.</p>;
  const unit = guide.units.find(item => item.id === unitId) ?? guide.units[0];
  const heading = `${mode === 'summary' ? 'Resumo aprofundado' : 'Estratégias de leitura e resolução'} de ${guide.profile.title}`;
  return <section className="ni-panel p-5 space-y-5">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm" onClick={() => {
        if (!content.current) return;
        try { printStrategyGuide(content.current, heading); setPrintError(''); }
        catch { setPrintError('Não foi possível abrir a impressão. Tente novamente.'); }
      }}>Imprimir / Salvar em PDF</button>
      <Link className="text-sm underline" to={workLink(mode === 'summary' ? 'estrategias' : 'resumo')}>{mode === 'summary' ? 'Ver estratégias desta obra' : 'Abrir resumo aprofundado'}</Link>
    </div>
    {printError && <p role="alert">{printError}</p>}
    <div ref={content} className="space-y-5">
      <h2 className="font-display text-xl">{heading}</h2>
      <p className="text-xs text-[var(--dim)]">Síntese de estudo baseada no dossiê publicado. O resumo inclui desfechos. Edição de referência: {guide.edition.label}</p>
      {mode === 'summary' ? <>
        {guide.profile.sections.map(section => <section key={section.title} className="space-y-2"><h3 className="font-semibold">{section.title}</h3><p className="text-sm leading-relaxed">{section.text}</p></section>)}
        <details className="space-y-3">
          <summary className="cursor-pointer font-semibold">Aprofundar a análise: forma, contexto e interpretações</summary>
          <AiText text={guide.analysis.markdown} className="text-sm leading-relaxed" />
        </details>
        {unit && <section className="border-t border-[var(--line)] pt-4 space-y-3">
          <h3 className="font-semibold">Da unidade ao sentido da obra</h3>
          <label className="block text-sm" data-print-exclude>Unidade do resumo<select className="field block w-full" value={unit.id} onChange={event => setUnitId(event.target.value)}>{guide.units.map(item => <option key={item.id} value={item.id}>{item.order}. {item.title}</option>)}</select></label>
          <h4 className="font-semibold">{unit.title}</h4>
          <p className="text-xs text-[var(--dim)]">Páginas {unit.pdfStartPage}–{unit.pdfEndPage} do arquivo de referência. A paginação pode diferir do seu exemplar.</p>
          <h5 className="text-sm font-semibold">O que acontece ou é enunciado</h5><p className="text-sm leading-relaxed">{unit.guide.summary}</p>
          <h5 className="text-sm font-semibold">Como ler a construção do sentido</h5><ul className="list-disc pl-5 space-y-2 text-sm">{unit.guide.observe.map(item => <li key={item}>{item}</li>)}</ul>
          {unit.passages.length === 0 && <p className="text-sm text-[var(--dim)]">Esta unidade ainda não tem passagem-chave publicada. Use as observações e a análise integral para orientar a releitura, sem atribuir uma citação a ela.</p>}
          {unit.passages.map(card => <article key={card.id} className="border-l-2 border-[var(--primary)] pl-4 space-y-2 text-sm">
            <h5 className="font-semibold">Passagem comentada · {card.location}</h5>
            <blockquote className="italic">“{card.quote}”</blockquote>
            <dl className="space-y-2">
              <div><dt className="font-semibold">Contexto da passagem</dt><dd>{card.context}</dd></div>
              <div><dt className="font-semibold">Escolha formal</dt><dd>{card.formalDevice}</dd></div>
              <div><dt className="font-semibold">Por que isso importa</dt><dd>{card.effect}</dd></div>
              <div><dt className="font-semibold">Relação com o conjunto</dt><dd>{card.wholeRelation}</dd></div>
            </dl>
          </article>)}
        </section>}
      </> : <>
        <section className="space-y-3"><h3 className="font-semibold">Roteiro específico desta obra</h3><ol className="list-decimal pl-5 space-y-3 text-sm">{guide.profile.strategy.map(step => <li key={step}>{step}</li>)}</ol></section>
        <section className="space-y-3"><h3 className="font-semibold">Evite estas leituras</h3><ul className="list-disc pl-5 space-y-2 text-sm">{guide.profile.pitfalls.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section className="space-y-3">
          <label className="block text-sm" data-print-exclude>Banca da estratégia de obra<select className="field block w-full" value={board} onChange={event => setBoard(event.target.value as typeof board)}><option>FUVEST</option><option>UNICAMP</option></select></label>
          <h3 className="font-semibold">Transformar a leitura em resposta · {board}</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">{literaryBoardTraining[board].map(step => <li key={step}>{step}</li>)}</ol>
          <p className="text-xs text-[var(--dim)]">Roteiro de treino, sem previsão de cobrança ou pontuação oficial. A presença de uma banca aqui não indica inclusão na lista: confira ciclo e recorte nas fontes da obra.</p>
        </section>
        <section className="space-y-2"><h3 className="font-semibold">Antes de reler: teste sua explicação</h3><p className="text-sm leading-relaxed">Escolha uma unidade e escreva, sem consultar: situação → voz → indício → recurso → efeito → relação com a obra. Depois confronte sua resposta com a passagem comentada no resumo. Corrija o ponto em que você só nomeou um tema, sem mostrar como o texto o constrói.</p></section>
      </>}
    </div>
    <Link to={workLink('fontes')} className="text-sm underline">Consultar fontes e recorte da obra</Link>
  </section>;
}
