import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CalendarClock, CheckCircle2, ListChecks, PenLine, Target } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { ExamSimulator } from '../components/provas/ExamSimulator';
import { examBoardBySlug, type ExamBoardEntry } from '../data/examBoards';
import { daysUntil, examsForBoard } from '../data/examCalendar';
import { boardExamStructure, discursiveQuestions } from '../data/discursiveQuestions';
import { playbookFor, type ExamPlaybook, type PlaybookStep } from '../data/examPlaybooks';
import { studyBoardProfiles } from '../data/studyProtocols';
import { secondPhaseProtocols } from '../data/resolutionStrategies';
import { boardPriorities, countdownPlan, examEditions, type BoardPriorities } from '../lib/boardPrep';
import { theoryFor, theoryKey, type BoardTheory } from '../data/examTheory';
import { BoardTheoryView } from '../components/provas/BoardTheoryView';
import { CHIP, LINK, daysLabel, formatExamDate } from './Provas';

type TabId = 'visao' | 'estrategia' | 'materias' | 'teoria' | 'prioridades' | 'simulado' | 'segunda-fase';

const TAB_LABELS: Record<TabId, string> = {
  visao: 'Visão geral',
  estrategia: 'Estratégia de prova',
  materias: 'Como cada matéria cobra',
  teoria: 'Teoria do que mais cai',
  prioridades: 'O que mais cai',
  simulado: 'Simulado',
  'segunda-fase': 'Discursivas e redação',
};

function addDays(iso: string, delta: number): string {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + delta);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function ProvaBanca() {
  const { slug, tab } = useParams<{ slug: string; tab?: string }>();
  const navigate = useNavigate();
  const board = examBoardBySlug(slug);
  const { questions, loading } = useQuestions(true);

  const data = useMemo(() => {
    if (!board) return null;
    const playbook = playbookFor(board.name);
    const editions = board.questionBoard ? examEditions(questions, board.questionBoard) : [];
    const priorities = board.questionBoard ? boardPriorities(questions, board.questionBoard) : null;
    const discursive = board.discursiveBoard ? discursiveQuestions.filter((q) => q.board === board.discursiveBoard) : [];
    const protocols = board.protocolBoard ? secondPhaseProtocols.filter((p) => p.board === board.protocolBoard) : [];
    const profile = board.profileBoard ? studyBoardProfiles.find((p) => p.board === board.profileBoard) : undefined;
    const upcoming = board.calendarBoard ? examsForBoard(board.calendarBoard) : [];
    const theory = theoryFor(board.slug);
    return { theory, playbook, editions, priorities, discursive, protocols, profile, upcoming };
  }, [board, questions]);

  if (!board || !data) return <Navigate to="/provas" replace />;

  // Só aparece a aba que tem conteúdo: uma aba vazia é a "aba pobre" que a
  // área existe para não ter. Mas enquanto o banco carrega, as abas que
  // dependem dele ficam visíveis (abrem no aviso de carregamento): escondê-las
  // até o fim da carga fazia a fileira crescer de 5 para 7 abas segundos depois
  // da entrada, e parecia que a tela tinha travado.
  const pending = loading && questions.length === 0 && !!board.questionBoard;
  const tabs: TabId[] = [
    'visao',
    ...(data.playbook ? ['estrategia', 'materias'] as TabId[] : []),
    ...(data.theory && (data.theory.discursive.length > 0 || data.priorities?.chapters.some((c) => data.theory!.chapters[theoryKey(c.topicId, c.chapter)])) ? ['teoria'] as TabId[] : []),
    ...(pending || (data.priorities && data.priorities.chapters.length > 0) ? ['prioridades'] as TabId[] : []),
    ...(pending || data.editions.length > 0 ? ['simulado'] as TabId[] : []),
    ...(data.discursive.length > 0 || data.protocols.length > 0 || data.playbook ? ['segunda-fase'] as TabId[] : []),
  ];
  const active: TabId = tabs.includes(tab as TabId) ? tab as TabId : 'visao';
  const go = (id: TabId) => navigate(id === 'visao' ? `/provas/${board.slug}` : `/provas/${board.slug}/${id}`);

  return (
    <div className="ni-main space-y-5">
      <Link to="/provas" className={`${LINK} inline-flex items-center gap-1`}><ArrowLeft className="w-4 h-4" aria-hidden /> Provas e bancas</Link>
      <div className="ni-title">
        <h1 className="text-2xl font-semibold">{board.name}</h1>
        {data.upcoming.length > 0 && (
          <p className="text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
            <CalendarClock className="w-4 h-4" aria-hidden />
            {data.upcoming.map((exam) => (
              <span key={exam.id}>{exam.label.replace(/^[^—]*—\s*/, '')}: {formatExamDate(exam.date)} ({daysLabel(daysUntil(exam.date))}){exam.confidence === 'baixa' ? ', a confirmar' : ''}</span>
            ))}
          </p>
        )}
      </div>

      <div role="tablist" aria-label={`Preparação ${board.name}`} className="flex flex-wrap gap-2">
        {tabs.map((id) => (
          <Button key={id} role="tab" aria-selected={active === id} variant={active === id ? 'primary' : 'secondary'} size="sm" onClick={() => go(id)}>{TAB_LABELS[id]}</Button>
        ))}
      </div>

      {loading && questions.length === 0 && (active === 'prioridades' || active === 'simulado' || active === 'teoria')
        ? <Panel className="p-5"><p>Carregando as provas…</p></Panel>
        : active === 'visao' ? <VisaoGeral board={board} data={data} go={go} tabs={tabs} />
        : active === 'estrategia' ? <Estrategia playbook={data.playbook!} />
        : active === 'materias' ? <Materias board={board} playbook={data.playbook!} priorities={data.priorities} theory={data.theory?.chapters} hasDiscursiveTheory={Boolean(data.theory?.discursive.length)} />
        : active === 'teoria' ? <BoardTheoryView boardName={board.name} questionBoard={board.questionBoard} priorities={data.priorities} theory={data.theory!} />
        : active === 'prioridades' ? <Prioridades board={board} priorities={data.priorities!} theory={data.theory?.chapters} />
        : active === 'simulado' ? <ExamSimulator questions={questions} board={board.questionBoard!} boardName={board.name} defaultMinutes={240} />
        : <SegundaFase board={board} data={data} />}
    </div>
  );
}

type BoardData = {
  theory?: BoardTheory;
  playbook?: ExamPlaybook;
  editions: ReturnType<typeof examEditions>;
  priorities: BoardPriorities | null;
  discursive: typeof discursiveQuestions;
  protocols: typeof secondPhaseProtocols;
  profile?: (typeof studyBoardProfiles)[number];
  upcoming: ReturnType<typeof examsForBoard>;
};

function Steps({ steps }: { steps: PlaybookStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-3">
          <span className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'var(--action-primary)', color: 'var(--text-inverse)' }}>{i + 1}</span>
          <div><p className="font-medium text-sm">{step.title}</p><p className="text-sm">{step.text}</p></div>
        </li>
      ))}
    </ol>
  );
}

function VisaoGeral({ board, data, go, tabs }: { board: ExamBoardEntry; data: BoardData; go: (id: TabId) => void; tabs: TabId[] }) {
  const first = data.upcoming[0];
  const days = first ? daysUntil(first.date) : null;
  const plan = days !== null ? countdownPlan(days) : [];
  const secondPhase = board.discursiveBoard ? boardExamStructure[board.discursiveBoard] : undefined;
  const structure = data.playbook?.structure ?? [data.profile?.format, secondPhase].filter((x): x is string => Boolean(x));

  return (
    <div className="space-y-4">
      {data.playbook && (
        <Panel className="p-5 flex gap-3" style={{ borderColor: 'var(--action-primary)' }}>
          <Target className="w-5 h-5 shrink-0" aria-hidden />
          <p className="text-sm font-medium">{data.playbook.thesis}</p>
        </Panel>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">Como é a prova</h2>
          {structure.length > 0
            ? <ul className="text-sm space-y-2 list-disc pl-5">{structure.map((item) => <li key={item}>{item}</li>)}</ul>
            : <p className="text-sm">O formato desta banca ainda não foi conferido no edital vigente.</p>}
          {data.profile && (
            <p className="text-xs">
              {data.profile.confirmed ? 'Conferido no edital' : 'Ainda não confirmado no edital vigente'}: <a className={LINK} href={data.profile.source} target="_blank" rel="noreferrer">fonte oficial</a>.
            </p>
          )}
        </Panel>

        {plan.length > 0 && first && (
          <Panel className="p-5 space-y-3">
            <h2 className="text-lg font-semibold">Plano até {formatExamDate(first.date).slice(0, 5)}</h2>
            <ol className="space-y-3">
              {plan.map((phase) => (
                <li key={phase.title} className="text-sm">
                  <p className="font-medium">{phase.title} <span className="font-normal">· {addDays(first.date, -phase.fromDay)} a {addDays(first.date, -phase.toDay)}</span></p>
                  <p>{phase.focus}</p>
                </li>
              ))}
            </ol>
          </Panel>
        )}
      </div>

      {data.profile && !data.playbook && (
        <Panel className="p-5 space-y-2">
          <h2 className="text-lg font-semibold">Como treinar para esta banca</h2>
          <p className="text-sm">{data.profile.training}</p>
        </Panel>
      )}

      <Panel className="p-5 space-y-3">
        <h2 className="text-lg font-semibold">O que você tem no Crivo</h2>
        <ul className="text-sm space-y-2">
          {tabs.includes('estrategia') && <li><button type="button" className={LINK} onClick={() => go('estrategia')}>Estratégia para cada dia de prova</button></li>}
          {tabs.includes('teoria') && <li><button type="button" className={LINK} onClick={() => go('teoria')}>Teoria de cada capítulo que mais cai, no recorte da banca</button></li>}
          {tabs.includes('materias') && <li><button type="button" className={LINK} onClick={() => go('materias')}>Como cada matéria é cobrada, com método e armadilhas</button></li>}
          {data.priorities && data.priorities.chapters.length > 0 && <li><button type="button" className={LINK} onClick={() => go('prioridades')}>{data.priorities.chapters.length} capítulos que se repetem em {data.priorities.years.length} provas</button></li>}
          {data.editions.length > 0 && <li><button type="button" className={LINK} onClick={() => go('simulado')}>{data.editions.length} {data.editions.length === 1 ? 'prova real' : 'provas reais'} para simulado com cronômetro</button></li>}
          {data.discursive.length > 0 && <li><button type="button" className={LINK} onClick={() => go('segunda-fase')}>{data.discursive.length} discursivas reais com correção</button></li>}
          {board.questionBoard && <li><Link className={LINK} to={`/questoes?board=${board.questionBoard}`}>Todas as questões da banca no banco</Link></li>}
        </ul>
      </Panel>
    </div>
  );
}

function Estrategia({ playbook }: { playbook: ExamPlaybook }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {playbook.examDays.map((day) => (
        <Panel key={day.label} className="p-5 space-y-4">
          <h2 className="text-lg font-semibold">{day.label}</h2>
          <Steps steps={day.plan} />
        </Panel>
      ))}
    </div>
  );
}

function Materias({ board, playbook, priorities, theory, hasDiscursiveTheory }: { board: ExamBoardEntry; playbook: ExamPlaybook; priorities: BoardPriorities | null; theory?: BoardTheory['chapters']; hasDiscursiveTheory: boolean }) {
  const [subject, setSubject] = useState(playbook.subjects[0].subject);
  const current = playbook.subjects.find((s) => s.subject === subject) ?? playbook.subjects[0];
  const chapters = priorities?.chapters.filter((c) => c.subject === current.subject) ?? [];

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Matéria" className="flex flex-wrap gap-2">
        {playbook.subjects.map((s) => (
          <Button key={s.subject} size="sm" variant={s.subject === current.subject ? 'primary' : 'secondary'} aria-pressed={s.subject === current.subject} onClick={() => setSubject(s.subject)}>{s.subject}</Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">Como a {board.name} cobra {current.subject}</h2>
          <ul className="text-sm space-y-2 list-disc pl-5">{current.howItCharges.map((t) => <li key={t}>{t}</li>)}</ul>
          {chapters.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Capítulos que mais se repetem</h3>
              <ul className="space-y-1">
                {chapters.map((c) => (
                  <li key={`${c.topicId}-${c.chapter}`} className="flex flex-wrap items-center gap-2 text-sm">
                    <span aria-label={c.stars === 2 ? 'muito frequente' : 'frequente'}>{c.stars === 2 ? '★★' : '★'}</span>
                    <span>{c.chapter}</span>
                    <TheoryLink board={board} theory={theory} topicId={c.topicId} chapter={c.chapter} />
                    <Link className={LINK} to={`/questoes?board=${board.questionBoard}&topic=${encodeURIComponent(c.topicId)}&chapter=${encodeURIComponent(c.chapter)}`}>Treinar</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>

        <Panel className="p-5 space-y-4">
          <h2 className="text-lg font-semibold">Como resolver</h2>
          <Steps steps={current.method} />
        </Panel>
      </div>

      <Panel className="p-5 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2"><AlertTriangle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} aria-hidden /> Armadilhas</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {current.traps.map((t) => (
            <li key={t.trap} className="text-sm rounded-lg border border-[var(--line)] p-3 space-y-1">
              <p className="font-medium">{t.trap}</p>
              <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--status-success)' }} aria-hidden />{t.fix}</p>
            </li>
          ))}
        </ul>
      </Panel>

      {current.discursive && (
        <Panel className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">Na discursiva de {current.subject}</h2>
          <div className="flex flex-wrap gap-2 text-xs">{current.discursive.recurring.map((r) => <span key={r} className={CHIP}>{r}</span>)}</div>
          <h3 className="font-medium text-sm">Antes de passar a limpo</h3>
          <ul className="text-sm space-y-1">{current.discursive.checklist.map((c) => <li key={c} className="flex gap-2"><ListChecks className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />{c}</li>)}</ul>
          <div className="flex flex-wrap gap-4">
            {hasDiscursiveTheory && <Link className={LINK} to={`/provas/${board.slug}/teoria?parte=discursivas&materia=${encodeURIComponent(current.subject)}`}>Teoria das discursivas de {current.subject}</Link>}
            <Link className={LINK} to={`/treino-2a-fase?banca=${encodeURIComponent(board.discursiveBoard ?? board.name)}`}>Treinar discursivas</Link>
          </div>
        </Panel>
      )}
    </div>
  );
}

function Prioridades({ board, priorities, theory }: { board: ExamBoardEntry; priorities: BoardPriorities; theory?: BoardTheory['chapters'] }) {
  const subjects = [...new Set(priorities.chapters.map((p) => p.subject))];
  const oldest = priorities.years[priorities.years.length - 1];
  return (
    <div className="space-y-4">
      <Panel className="p-5 space-y-2">
        <h2 className="text-lg font-semibold">O que mais se repete</h2>
        <p className="text-sm">Capítulos que caíram em {priorities.oneStar} ou mais das {priorities.years.length} provas do banco ({oldest}–{priorities.years[0]}). ★★ = {priorities.twoStars} provas ou mais; ★ = {priorities.oneStar}. A lista sai das próprias provas e se ajusta quando um ano novo é importado.</p>
        <p className="text-sm">Treine com as provas mais antigas e guarde as duas mais recentes para o simulado.</p>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        {subjects.map((subject) => (
          <Panel key={subject} className="p-5 space-y-2">
            <h3 className="font-semibold">{subject}</h3>
            <ul className="space-y-2">
              {priorities.chapters.filter((p) => p.subject === subject).map((p) => (
                <li key={`${p.topicId}-${p.chapter}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span aria-label={p.stars === 2 ? 'muito frequente' : 'frequente'}>{p.stars === 2 ? '★★' : '★'}</span>
                  <span className="font-medium">{p.chapter}</span>
                  <span className="text-xs">{p.years.join(', ')} · {p.count} questões</span>
                  <TheoryLink board={board} theory={theory} topicId={p.topicId} chapter={p.chapter} />
                  <Link className={LINK} to={`/questoes?board=${board.questionBoard}&topic=${encodeURIComponent(p.topicId)}&chapter=${encodeURIComponent(p.chapter)}`}>Treinar</Link>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function SegundaFase({ board, data }: { board: ExamBoardEntry; data: BoardData }) {
  const bySubject = data.discursive.reduce<Record<string, number>>((acc, q) => ({ ...acc, [q.subject]: (acc[q.subject] ?? 0) + 1 }), {});
  const structure = board.discursiveBoard ? boardExamStructure[board.discursiveBoard] : undefined;
  const playbook = data.playbook;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">Como a discursiva é corrigida</h2>
          {playbook && <p className="text-sm">{playbook.discursive.scoring}</p>}
          {!playbook && structure && <p className="text-sm">{structure}</p>}
          {data.discursive.length > 0 && (
            <>
              <p className="text-sm">{data.discursive.length} questões reais no Crivo: {Object.entries(bySubject).map(([s, n]) => `${s} ${n}`).join(', ')}. Escreva a resposta e peça a correção do CRIVO, que compara com a resposta-modelo pelo critério da banca.</p>
              <div className="flex flex-wrap gap-4">
                {data.theory && data.theory.discursive.length > 0 && <Link className={LINK} to={`/provas/${board.slug}/teoria?parte=discursivas`}>Teoria dos temas que mais caem</Link>}
                <Link className={LINK} to={`/treino-2a-fase?banca=${encodeURIComponent(board.discursiveBoard!)}`}>Treinar discursivas da {board.name}</Link>
              </div>
            </>
          )}
        </Panel>
        {playbook && (
          <Panel className="p-5 space-y-3">
            <h2 className="text-lg font-semibold">Onde se perde ponto</h2>
            <ul className="text-sm space-y-2">{playbook.discursive.lostPoints.map((p) => <li key={p} className="flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--status-warning)' }} aria-hidden />{p}</li>)}</ul>
          </Panel>
        )}
      </div>

      {playbook && (
        <Panel className="p-5 space-y-4">
          <h2 className="text-lg font-semibold">Protocolo de resposta</h2>
          <Steps steps={playbook.discursive.protocol} />
        </Panel>
      )}

      {data.protocols.map((protocol) => (
        <Panel key={protocol.name} className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">{protocol.name}</h2>
          <p className="text-xs">{protocol.scope}</p>
          <Steps steps={protocol.steps.map((s) => ({ title: s.title, text: s.description }))} />
          {protocol.responseStructure && <ul className="text-sm list-disc pl-5 space-y-1">{protocol.responseStructure.map((r) => <li key={r}>{r}</li>)}</ul>}
        </Panel>
      ))}

      {playbook && (
        <Panel className="p-5 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2"><PenLine className="w-5 h-5" aria-hidden /> Redação</h2>
          <ul className="text-sm list-disc pl-5 space-y-1">{playbook.essay.map((e) => <li key={e}>{e}</li>)}</ul>
          <Link className={LINK} to="/redacao">Abrir o ateliê de redação</Link>
        </Panel>
      )}
    </div>
  );
}


function TheoryLink({ board, theory, topicId, chapter }: { board: ExamBoardEntry; theory?: BoardTheory['chapters']; topicId: string; chapter: string }) {
  if (!theory?.[theoryKey(topicId, chapter)]) return <span className="ml-auto" />;
  return <Link className={`${LINK} ml-auto`} to={`/provas/${board.slug}/teoria?capitulo=${encodeURIComponent(theoryKey(topicId, chapter))}`}>Teoria</Link>;
}
