import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, BookOpen, CheckCircle2, Compass, FileSignature, ListChecks, MapPin, Sigma, Target } from 'lucide-react';
import { AiText } from '../AiText';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { theoryKey, type BoardTheory, type ChapterTheory } from '../../data/examTheory';
import { EssayModelsView } from './EssayModelsView';
import type { BoardPriorities } from '../../lib/boardPrep';

const LINK = 'text-sm underline underline-offset-2 hover:text-[var(--action-primary)]';

type Part = 'objetiva' | 'discursivas' | 'redacao';

/**
 * Teoria da banca em duas partes: os capítulos que mais caem na objetiva e os
 * temas que se repetem nas discursivas. Todo texto passa pelo AiText, que
 * renderiza Markdown e LaTeX: fórmula escrita em texto corrido já exibiu uma
 * divisão errada sem ninguém notar.
 */
export function BoardTheoryView({ boardName, questionBoard, priorities, theory }: {
  boardName: string;
  questionBoard?: string;
  priorities: BoardPriorities | null;
  theory: BoardTheory;
}) {
  const [params] = useSearchParams();
  const requestedChapter = params.get('capitulo');
  const requestedTheme = params.get('tema');
  const chapters = (priorities?.chapters ?? []).filter((c) => theory.chapters[theoryKey(c.topicId, c.chapter)]);
  const hasDiscursive = theory.discursive.length > 0;
  const essays = theory.essays ?? [];

  const initialPart: Part = params.get('parte') === 'redacao' && essays.length > 0 ? 'redacao'
    : requestedTheme || (params.get('parte') === 'discursivas' && hasDiscursive) || chapters.length === 0 ? 'discursivas' : 'objetiva';
  const [part, setPart] = useState<Part>(initialPart);

  const objectiveSubjects = [...new Set(chapters.map((c) => c.subject))];
  const discursiveSubjects = [...new Set(theory.discursive.map((t) => t.subject))];
  const subjects = part === 'objetiva' ? objectiveSubjects : part === 'discursivas' ? discursiveSubjects : [];

  const initialSubject = part === 'objetiva'
    ? chapters.find((c) => theoryKey(c.topicId, c.chapter) === requestedChapter)?.subject
    : theory.discursive.find((t) => t.id === requestedTheme)?.subject ?? params.get('materia') ?? undefined;
  const [subjectByPart, setSubjectByPart] = useState<Record<Part, string | undefined>>({ objetiva: part === 'objetiva' ? initialSubject : undefined, discursivas: part === 'discursivas' ? initialSubject : undefined, redacao: undefined });
  const subject = subjects.includes(subjectByPart[part] ?? '') ? subjectByPart[part]! : subjects[0];

  const target = useRef<HTMLDetailsElement>(null);
  // Vindo de um link "Teoria", o item pedido abre aberto e na tela; sem isso o
  // link caía no topo da matéria errada.
  useEffect(() => { target.current?.scrollIntoView?.({ block: 'start' }); }, [requestedChapter, requestedTheme]);

  return (
    <div className="space-y-4">
      <Panel className="p-5 space-y-2">
        <h2 className="text-lg font-semibold">Teoria no recorte da {boardName}</h2>
        <p className="text-sm">Cada item traz como o assunto caiu nas provas reais, o mecanismo explicado, as fórmulas, onde se aplica, como atacar a questão, exemplos resolvidos e as armadilhas. Em Biologia, Química e Física há também uma discursiva com resposta-modelo e o que a correção confere. Os exemplos têm números próprios, para não entregar as questões do simulado.</p>
      </Panel>

      {[chapters.length > 0, hasDiscursive, essays.length > 0].filter(Boolean).length > 1 && (
        <div role="tablist" aria-label="Parte da prova" className="flex flex-wrap gap-2">
          {chapters.length > 0 && <Button role="tab" aria-selected={part === 'objetiva'} size="sm" variant={part === 'objetiva' ? 'primary' : 'secondary'} onClick={() => setPart('objetiva')}>Objetiva: o que mais cai ({chapters.length})</Button>}
          {hasDiscursive && <Button role="tab" aria-selected={part === 'discursivas'} size="sm" variant={part === 'discursivas' ? 'primary' : 'secondary'} onClick={() => setPart('discursivas')}>Discursivas do 2º dia ({theory.discursive.length})</Button>}
          {essays.length > 0 && <Button role="tab" aria-selected={part === 'redacao'} size="sm" variant={part === 'redacao' ? 'primary' : 'secondary'} onClick={() => setPart('redacao')}>Redação ({essays.length} temas reais)</Button>}
        </div>
      )}

      {subjects.length > 0 && <div role="group" aria-label="Matéria" className="flex flex-wrap gap-2">
        {subjects.map((s) => (
          <Button key={s} size="sm" variant={s === subject ? 'primary' : 'secondary'} aria-pressed={s === subject} onClick={() => setSubjectByPart({ ...subjectByPart, [part]: s })}>{s}</Button>
        ))}
      </div>}

      {part === 'redacao' ? <EssayModelsView boardName={boardName} essays={essays} />
        : part === 'objetiva'
        ? chapters.filter((c) => c.subject === subject).map((c) => {
          const key = theoryKey(c.topicId, c.chapter);
          const isTarget = key === requestedChapter;
          return (
            <TheoryCard key={key} ref={isTarget ? target : undefined} open={isTarget} boardName={boardName}
              heading={<><span aria-label={c.stars === 2 ? 'muito frequente' : 'frequente'}>{c.stars === 2 ? '★★' : '★'}</span><span className="font-semibold">{c.chapter}</span><span className="text-xs">{c.years.join(', ')}</span></>}
              theory={theory.chapters[key]}
              trainLink={questionBoard ? <Link className={LINK} to={`/questoes?board=${questionBoard}&topic=${encodeURIComponent(c.topicId)}&chapter=${encodeURIComponent(c.chapter)}`}>Treinar com as questões da {boardName}</Link> : null} />
          );
        })
        : theory.discursive.filter((t) => t.subject === subject).map((t) => (
          <TheoryCard key={t.id} ref={t.id === requestedTheme ? target : undefined} open={t.id === requestedTheme} boardName={boardName}
            heading={<><span className="font-semibold">{t.title}</span><span className="text-xs">{t.years.join(', ')}</span></>}
            theory={t}
            trainLink={<Link className={LINK} to={`/treino-2a-fase?banca=${encodeURIComponent(boardName)}`}>Treinar com as discursivas reais da {boardName}</Link>} />
        ))}
    </div>
  );
}

const TheoryCard = React.forwardRef<HTMLDetailsElement, {
  heading: React.ReactNode; theory: ChapterTheory; open: boolean; boardName: string; trainLink: React.ReactNode;
}>(function TheoryCard({ heading, theory: t, open, boardName, trainLink }, ref) {
  return (
    <details ref={ref} open={open || undefined} className="ni-panel p-5 scroll-mt-24">
      <summary className="cursor-pointer flex flex-wrap items-center gap-x-3 gap-y-1">{heading}</summary>
      <div className="mt-4 space-y-6">
        <div className="text-sm rounded-lg border border-[var(--line)] p-3"><b>Como cai na {boardName}: </b><AiText text={t.howItFalls} className="inline" /></div>

        {t.patterns && t.patterns.length > 0 && (
          <Section icon={<Target className="w-4 h-4" aria-hidden />} title={`Como a ${boardName} cobra, tipo por tipo`}>
            <p className="text-xs">Tirado das questões reais. Se você guarda as provas de 2025 e 2026 para o simulado, faça-as antes de abrir os tipos que as citam.</p>
            <div className="space-y-3">
              {t.patterns.map((p) => (
                <details key={p.title} className="rounded-lg border border-[var(--line)] p-3 text-sm">
                  <summary className="cursor-pointer flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium">{p.title}</span>
                    <span className="text-xs">{p.questions.join(' · ')}</span>
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div><p className="font-medium">O que a questão pede</p><AiText text={p.asks} /></div>
                    <div>
                      <p className="font-medium">Como resolver</p>
                      <ol className="list-decimal pl-5 space-y-1">{p.solve.map((x) => <li key={x}><AiText text={x} /></li>)}</ol>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: 'color-mix(in srgb, var(--status-warning) 10%, transparent)' }}>
                      <p className="font-medium">Como as alternativas erradas são montadas</p>
                      <AiText text={p.distractors} />
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </Section>
        )}

        <Section icon={<BookOpen className="w-4 h-4" aria-hidden />} title="O mecanismo">
          <AiText text={t.explanation} className="text-sm" />
        </Section>

        {t.formulas && t.formulas.length > 0 && (
          <Section icon={<Sigma className="w-4 h-4" aria-hidden />} title="Fórmulas">
            <ul className="grid gap-3 md:grid-cols-2">
              {t.formulas.map((f) => (
                <li key={f.tex} className="rounded-lg border border-[var(--line)] p-3 space-y-1 min-w-0 overflow-x-auto">
                  <AiText text={`$$${f.tex}$$`} />
                  <AiText text={f.meaning} className="text-sm" />
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section icon={<MapPin className="w-4 h-4" aria-hidden />} title="Onde se aplica">
          <ul className="text-sm space-y-2 list-disc pl-5">{t.applications.map((a) => <li key={a}><AiText text={a} /></li>)}</ul>
        </Section>

        <Section icon={<Compass className="w-4 h-4" aria-hidden />} title="Como atacar a questão">
          <ol className="text-sm space-y-2 list-decimal pl-5">{t.strategy.map((s) => <li key={s}><AiText text={s} /></li>)}</ol>
        </Section>

        <Section icon={<ListChecks className="w-4 h-4" aria-hidden />} title="Exemplos resolvidos">
          <div className="grid gap-3 lg:grid-cols-2">
            {t.examples.map((e) => (
              <div key={e.title} className="rounded-lg border border-[var(--line)] p-3 space-y-2 text-sm">
                <p className="font-medium">{e.title}</p>
                <AiText text={e.prompt} />
                <details>
                  <summary className="cursor-pointer underline underline-offset-2">Tente antes; depois veja a resolução</summary>
                  <ol className="mt-2 list-decimal pl-5 space-y-1">{e.steps.map((s) => <li key={s}><AiText text={s} /></li>)}</ol>
                </details>
              </div>
            ))}
          </div>
        </Section>

        {t.discursive && (
          <Section icon={<FileSignature className="w-4 h-4" aria-hidden />} title="Treino discursivo">
            <div className="rounded-lg border p-3 space-y-3 text-sm" style={{ borderColor: 'var(--action-primary)' }}>
              <AiText text={t.discursive.prompt} />
              <details>
                <summary className="cursor-pointer underline underline-offset-2">Escreva sua resposta; depois compare com a resposta-modelo</summary>
                <div className="mt-3 space-y-3">
                  <div className="space-y-1">{t.discursive.modelAnswer.map((a) => <AiText key={a} text={a} />)}</div>
                  <div>
                    <p className="font-medium">O que a correção confere</p>
                    <ul className="space-y-1 mt-1">{t.discursive.scoring.map((s) => (
                      <li key={s} className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--status-success)' }} aria-hidden /><AiText text={s} /></li>
                    ))}</ul>
                  </div>
                </div>
              </details>
            </div>
          </Section>
        )}

        <Section icon={<AlertTriangle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} aria-hidden />} title="Armadilhas">
          <ul className="grid gap-3 md:grid-cols-2">
            {t.traps.map((x) => (
              <li key={x.trap} className="text-sm rounded-lg border border-[var(--line)] p-3 space-y-1">
                <div className="font-medium"><AiText text={x.trap} /></div>
                <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--status-success)' }} aria-hidden /><AiText text={x.fix} /></div>
              </li>
            ))}
          </ul>
        </Section>

        {trainLink}
      </div>
    </details>
  );
});

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-medium flex items-center gap-2">{icon}{title}</h3>
      {children}
    </section>
  );
}
