import strategies from '../data/fuvestResolutionStrategies.json';
import type { FuvestCorpus } from '../lib/fuvestIncidence';
export function FuvestResolutionGuide({corpus}:{corpus:FuvestCorpus}) {
  const questions=new Map(corpus.questions.map(question=>[question.id,question]));
  const papers=new Map(corpus.papers.map(paper=>[paper.id,paper]));
  return <details className="ni-panel p-5">
    <summary className="cursor-pointer font-semibold">Estratégias de resolução e pontes entre conceitos · 18 padrões reais</summary>
    <div className="mt-4 space-y-4 text-sm">
      <p>{strategies.method}</p>
      {strategies.sections.map(section=><details key={section.id} className="border-t border-[var(--line)] pt-3">
        <summary className="cursor-pointer font-semibold">{section.title}</summary>
        <div className="mt-3 space-y-3"><p className="text-xs text-[var(--dim)]">{section.scope}</p><p>{section.pattern}</p>
          <ol className="list-decimal pl-5 space-y-2">{section.steps.map((step,index)=><li key={index}>{step}</li>)}</ol>
          <p><b>Erro a evitar:</b> {section.trap}</p><p><b>Transferência:</b> {section.transfer}</p>
          <ul className="space-y-2">{section.examples.map(example=>{
            const question=questions.get(example.questionId);const paper=question&&papers.get(question.paperId);
            if(!question||!paper)return null;
            return <li key={example.questionId}><a className="underline" href={`${paper.sourceUrl}#page=${question.page}`} target="_blank" rel="noreferrer">{question.year} · {question.number} · página {question.page}</a><p className="text-xs mt-1">{example.whyItFits}</p></li>;
          })}</ul>
        </div>
      </details>)}
      <a className="underline" href="/analises/fuvest/guia-estrategias-2027.md" download>Baixar o guia completo de estratégias</a>
    </div>
  </details>;
}
