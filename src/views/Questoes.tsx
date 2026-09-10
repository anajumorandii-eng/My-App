import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserMastery } from '../hooks/useUserMastery';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionStatement } from '../components/QuestionStatement';
import { addUserAttempt, addUserErrorLog } from '../lib/userData';
import { requestAiText, requestAiTextStream } from '../lib/aiClient';
import { parseErrorDiagnosis, ErrorDiagnosis } from '../lib/errorDiagnosis';
import { ERROR_TYPE_LABELS, INTERVENTION_LABELS } from '../lib/errorLabels';

// 'unknown' vem primeiro porque e o estado real de quem acabou de errar: a
// categoria certa costuma aparecer depois do diagnostico, nao antes dele.
const ERROR_TYPE_ORDER: ErrorLog['type'][] = [
  'unknown', 'conceptual', 'concept_confusion', 'interpretation', 'data_selection',
  'strategy', 'calculation', 'prerequisite', 'insufficient_justification', 'time', 'attention',
];
import { Skeleton } from '../components/ui/Skeleton';
import { AiText } from '../components/AiText';
import { TopicMastery, ErrorLog } from '../types';
import { applyReviewOutcome, qualityFromAnswerCorrectness, intervalDaysOf, nextReviewDate } from '../lib/spacedRepetition';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BadgeCheck,
  Stethoscope,
  ArrowRight,
  BookOpen,
  CloudOff,
} from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';
import { mockTopics } from '../data/mockData';
import { ALL, buildTopicHierarchy, filterByHierarchy } from '../lib/topicHierarchy';

function Metric({
  label,
  value,
  bar = false,
  fill,
  warn = false,
}: {
  label: string;
  value: string;
  bar?: boolean;
  // Quanto da barra preencher, de 0 a 1. Sem isto a barra vinha com 62% fixos
  // no CSS: ela aparecia cheia pela metade num treino 0/0 e nunca se mexia,
  // o que fazia o painel mostrar um número e desenhar outro.
  fill?: number;
  warn?: boolean;
}) {
  return (
    <div className="ni-metric">
      <small>{label}</small>
      <b className={warn ? 'warn' : ''}>{value}</b>
      {bar && (
        <i>
          <span
            style={{ '--bar-fill': `${Math.round(Math.min(1, Math.max(0, fill ?? 0)) * 100)}%` } as React.CSSProperties}
          />
        </i>
      )}
    </div>
  );
}

function examSourceLabel(source: { board: string; year?: number; sourceUrl?: string } | string | undefined) {
  if (!source) return 'Banco de Questões';
  return typeof source === 'string' ? source : `${source.board}${source.year ? ` ${source.year}` : ' · reprodução em apostila'}`;
}

export default function Questoes() {
  const { user } = useAuth();
  const { mastery, updateMastery, isPersisted, syncError } = useUserMastery();
  const { questions: mockQuestions, loading: questionsLoading, syncError: questionsSyncError } = useQuestions();
  const subjects = useMemo(() => ['Todas', ...new Set(mockQuestions.map((q) => q.subject))], [mockQuestions]);
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [topicFilter, setTopicFilter] = useState<string>(ALL);
  const [subtopicFilter, setSubtopicFilter] = useState<string>(ALL);
  const [onlyRealExams, setOnlyRealExams] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [deepExplanation, setDeepExplanation] = useState<string | null>(null);
  const [loadingDeepExplanation, setLoadingDeepExplanation] = useState(false);
  const [diagnosis, setDiagnosis] = useState<ErrorDiagnosis | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisFailed, setDiagnosisFailed] = useState(false);
  const [diagnosisSaved, setDiagnosisSaved] = useState(false);
  const [diagnosisDismissed, setDiagnosisDismissed] = useState(false);
  // Tipo com que o erro vai para o caderno. A IA preenche quando acerta o
  // diagnóstico, mas a escolha final é da estudante: ela sabe por que errou
  // melhor que uma hipótese gerada a partir do enunciado.
  // Comeca em 'unknown' de proposito. Antes comecava em 'conceptual', e quem
  // clicasse direto em "Adicionar" gravava um erro de conceito que talvez
  // fosse de conta ou de leitura — a estatistica do caderno herdava o padrao,
  // nao a realidade.
  const [errorType, setErrorType] = useState<ErrorLog['type']>('unknown');
  // O que ela lembra ter pensado ao resolver. E a unica evidencia que separa
  // um erro de conta de um conceito trocado quando a alternativa marcada e a
  // mesma, entao vale pedir antes de diagnosticar.
  const [studentAccount, setStudentAccount] = useState('');

  // O "só questões reais" entra antes de montar a árvore para que as contagens
  // de tópico e subtópico reflitam o que o filtro vai realmente entregar. Se
  // fosse depois, um tópico apareceria com 40 questões e abriria com zero.
  const scoped = useMemo(() => {
    const base = onlyRealExams ? mockQuestions.filter((q) => q.examSource) : mockQuestions;
    return subjectFilter === 'Todas' ? base : base.filter((q) => q.subject === subjectFilter);
  }, [mockQuestions, subjectFilter, onlyRealExams]);

  // Quantas questões reais existem na matéria selecionada. Vai no rótulo do
  // botão porque, sem o número, um banco desatualizado e um filtro quebrado
  // são indistinguíveis: nos dois casos "não acontece nada" ao clicar.
  const realExamCount = useMemo(() => {
    const base = subjectFilter === 'Todas'
      ? mockQuestions
      : mockQuestions.filter((q) => q.subject === subjectFilter);
    return base.filter((q) => q.examSource).length;
  }, [mockQuestions, subjectFilter]);

  const topicTree = useMemo(() => buildTopicHierarchy(scoped, mockTopics), [scoped]);

  // Em "Todas" os tópicos de todas as matérias vinham numa lista só. Agrupar
  // pela matéria devolve o nível que a hierarquia já tinha nos dados e que a
  // tela estava jogando fora. Com uma matéria filtrada não há o que agrupar,
  // então vira um grupo único e sem cabeçalho.
  const topicGroups = useMemo(() => {
    if (subjectFilter !== 'Todas') return [{ subject: null as string | null, nodes: topicTree }];
    const porMateria = new Map<string, typeof topicTree>();
    for (const node of topicTree) {
      const chave = node.subject ?? 'Fora do currículo';
      const atual = porMateria.get(chave);
      if (atual) atual.push(node);
      else porMateria.set(chave, [node]);
    }
    return [...porMateria].map(([subject, nodes]) => ({ subject, nodes }));
  }, [topicTree, subjectFilter]);

  const subtopicOptions = useMemo(
    () => (topicFilter === ALL ? [] : topicTree.find((node) => node.id === topicFilter)?.subtopics ?? []),
    [topicFilter, topicTree],
  );

  const pool = useMemo(
    () => filterByHierarchy(scoped, { topicId: topicFilter, subtopicId: subtopicFilter }, mockTopics),
    [scoped, topicFilter, subtopicFilter],
  );

  const question = pool.length > 0 ? pool[index % pool.length] : null;
  const answered = selectedOptionId !== null;
  const isCorrect = answered && question !== null && selectedOptionId === question.correctOptionId;
  const correctCount = history.filter((h) => h.correct).length;

  const resetDiagnosisState = () => {
    setDiagnosis(null);
    setDiagnosing(false);
    setDiagnosisFailed(false);
    setDiagnosisSaved(false);
    setDiagnosisDismissed(false);
    setErrorType('unknown');
  };

  const resetQuestionState = () => {
    setIndex(0);
    setSelectedOptionId(null);
    setDeepExplanation(null);
    resetDiagnosisState();
  };

  const changeSubject = (subject: string) => {
    setSubjectFilter(subject);
    // Trocar de matéria invalida o tópico escolhido: ele pertencia à anterior.
    setTopicFilter(ALL);
    setSubtopicFilter(ALL);
    resetQuestionState();
  };

  const changeTopic = (topicId: string) => {
    setTopicFilter(topicId);
    setSubtopicFilter(ALL);
    resetQuestionState();
  };

  const changeSubtopic = (subtopicId: string) => {
    setSubtopicFilter(subtopicId);
    resetQuestionState();
  };

  const toggleRealExams = () => {
    setOnlyRealExams((v) => !v);
    // O recorte de provas reais é bem menor que o banco inteiro, então o tópico
    // que estava selecionado pode nem existir nele. Voltar ao topo evita a tela
    // vazia sem explicação.
    setTopicFilter(ALL);
    setSubtopicFilter(ALL);
    resetQuestionState();
  };

  const selectOption = (optionId: string) => {
    if (answered || !question) return;
    const correct = optionId === question.correctOptionId;
    setSelectedOptionId(optionId);
    setHistory((h) => [...h, { questionId: question.id, correct }]);

    updateMastery((previous) => {
      const current = previous.find((item) => item.topicId === question.topicId);
      const existing: TopicMastery = current ?? {
        topicId: question.topicId,
        level: 50,
        uncertainty: 0.8,
        lastReviewed: new Date(0).toISOString(),
        errorSignals: 0,
      };

      const outcome = applyReviewOutcome(existing, qualityFromAnswerCorrectness(correct));
      const updated: TopicMastery = {
        ...existing,
        ...outcome,
        origin: 'observed',
      };
      return current
        ? previous.map((item) => (item.topicId === question.topicId ? updated : item))
        : [...previous, updated];
    });

    if (user) {
      addUserAttempt(user.uid, {
        id: `attempt_${Date.now()}`,
        questionId: question.id,
        topicId: question.topicId,
        correct,
        date: new Date().toISOString(),
      }).catch((error) => console.error('Failed to save attempt:', error));
    }

    if (!correct) {
      fetchDiagnosis(optionId);
    }
  };

  const nextQuestion = () => {
    setIndex((i) => (i + 1) % pool.length);
    setSelectedOptionId(null);
    setDeepExplanation(null);
    setErrorType('unknown');
    setStudentAccount('');
    resetDiagnosisState();
  };

  const resetSession = () => {
    setIndex(0);
    setSelectedOptionId(null);
    setHistory([]);
    setDeepExplanation(null);
    setErrorType('unknown');
    setStudentAccount('');
    resetDiagnosisState();
  };

  const fetchDiagnosis = async (optionId: string, account?: string) => {
    if (!question) return;
    if (question.originalPages?.length) return; // Text-only endpoint cannot inspect the original page.
    setDiagnosing(true);
    resetDiagnosisState();
    try {
      const selectedOption = question.options.find((o) => o.id === optionId);
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      const data = await requestAiText('error-diagnosis', {
        prompt: question.prompt,
        subject: question.subject,
        selectedAnswer: selectedOption?.text ?? '',
        correctAnswer: correctOption?.text ?? '',
        baseExplanation: question.explanation,
        ...(account?.trim() ? { studentAccount: account.trim() } : {}),
      });
      const parsed = parseErrorDiagnosis(data.text);
      if (parsed) {
        setDiagnosis(parsed);
        setErrorType(parsed.type);
      } else {
        // Resposta veio, mas não no formato esperado. Vale avisar: sem isso a
        // tela fica igual a "nada aconteceu" e a estudante não sabe se deve
        // esperar mais.
        setDiagnosisFailed(true);
      }
    } catch (error) {
      console.error('Failed to diagnose error:', error);
      setDiagnosisFailed(true);
    } finally {
      setDiagnosing(false);
    }
  };

  // Registrar o erro NÃO depende da IA. Antes dependia — o guard exigia um
  // diagnóstico, então uma falha de rede tornava o erro impossível de
  // registrar, que é justamente quando registrar importa.
  const saveErrorToLog = () => {
    if (!question || !selectedOptionId) return;
    const selectedOption = question.options.find((o) => o.id === selectedOptionId);
    const correctOption = question.options.find((o) => o.id === question.correctOptionId);
    // A hipótese só entra no registro se a IA de fato produziu uma E a
    // estudante manteve o tipo sugerido. Se ela trocou, o diagnóstico dela
    // substitui o da IA e guardar a hipótese descartada só confundiria a
    // leitura do caderno depois.
    const usouHipotese = diagnosis !== null && !diagnosisDismissed && errorType === diagnosis.type;
    const origem = usouHipotese
      ? 'CRIVO sugeriu o diagnóstico e você confirmou'
      : errorType === 'unknown'
        ? 'motivo ainda não identificado'
        : 'classificado por você';
    const log: ErrorLog = {
      id: `err_${question.id}_${Date.now()}`,
      questionId: question.id,
      topicId: question.topicId,
      date: new Date().toISOString(),
      type: errorType,
      notes: [
        `Erro registrado a partir de uma questão de prática (${origem}).`,
        errorType === 'unknown' ? 'Ela não soube identificar o motivo — o caderno guardou assim em vez de chutar uma categoria.' : '',
        studentAccount.trim() ? `O que ela lembra ter pensado: ${studentAccount.trim()}` : '',
        `Resposta marcada: ${selectedOption?.text ?? ''}. Gabarito: ${correctOption?.text ?? ''}.`,
      ].filter(Boolean).join(' '),
      ...(usouHipotese
        ? {
          aiHypothesis: diagnosis.breakPoint,
          breakPoint: diagnosis.breakPoint,
          evidence: diagnosis.evidence,
          proposedIntervention: diagnosis.intervention,
          interventionStatus: 'pendente' as const,
        }
        : {}),
      // Salvar no caderno é o gesto de validação da estudante — só aqui o
      // registro passa a ser tratado como fato ('confirmado'), venha o tipo
      // da IA ou dela.
      // 'confirmado' significa que ela validou uma explicacao. Guardar um
      // 'nao sei' como confirmado seria dizer que ela confirmou nao saber, e
      // o caderno deixaria de mostrar que esse erro ainda pede diagnostico.
      confidence: errorType === 'unknown' ? 'baixa' : 'confirmado',
    };
    if (user) {
      addUserErrorLog(user.uid, log).catch((error) => console.error('Failed to save error log:', error));
    }
    setDiagnosisSaved(true);
  };

  const dismissDiagnosis = () => {
    setDiagnosis(null);
    setDiagnosisDismissed(true);
    // Recusar a hipotese devolve o tipo para 'unknown'. Deixar o palpite
    // recusado selecionado gravaria no caderno exatamente a categoria que ela
    // acabou de dizer estar errada, e reabre o campo de relato para uma
    // segunda tentativa com mais evidencia.
    setErrorType('unknown');
  };

  const fetchDeepExplanation = async () => {
    if (!selectedOptionId || !question) return;
    if (question.originalPages?.length) return;
    setLoadingDeepExplanation(true);
    try {
      const selectedOption = question.options.find((o) => o.id === selectedOptionId);
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      let acumulado = '';
      const data = await requestAiTextStream('question-explanation', {
        prompt: question.prompt,
        subject: question.subject,
        selectedAnswer: selectedOption?.text ?? '',
        correctAnswer: correctOption?.text ?? '',
        isCorrect,
        baseExplanation: question.explanation,
      }, (delta) => {
        acumulado += delta;
        setDeepExplanation(acumulado);
      });
      setDeepExplanation(data.text);
    } catch (error) {
      console.error('Failed to fetch deep explanation:', error);
    } finally {
      setLoadingDeepExplanation(false);
    }
  };

  const palette = PALETTES[question?.subject ?? 'Matemática'] ?? PALETTES.Matemática;
  const precisionPercent = history.length > 0 ? `${Math.round((correctCount / history.length) * 100)}%` : '—';

  // O painel afirma que cada acerto estende o ciclo de revisão do tópico. Isso
  // é verdade — applyReviewOutcome roda a cada resposta —, mas nada disso
  // aparecia na tela, então a frase era indistinguível de enfeite. Estes dois
  // números são lidos do mesmo registro que o motor grava.
  const topicMastery = question ? mastery.find((item) => item.topicId === question.topicId) : undefined;
  const masteryPercent = topicMastery ? `${Math.round(topicMastery.level)}%` : '—';
  const nextReviewLabel = (() => {
    if (!topicMastery) return 'após a 1ª resposta';
    const dias = Math.round((nextReviewDate(topicMastery).getTime() - Date.now()) / 86400000);
    if (dias <= 0) return 'hoje';
    if (dias === 1) return 'amanhã';
    return `em ${dias} dias`;
  })();

  return (
    <div
      className="ni-main"
      style={
        {
          '--primary': palette.primary, '--primary-ink': palette.readable,
          '--secondary': palette.secondary,
          '--wash': palette.wash,
        } as React.CSSProperties
      }
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>PRACTICE</span>
        <i />
        <span>QUESTÕES</span>
        {question && (
          <>
            <i />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
                {React.createElement(SUBJECT_ICONS[question.subject] ?? BookOpen, { className: 'w-3 h-3' })}
              </span>
              {(question?.subject ?? 'GERAL').toUpperCase()}
            </span>
          </>
        )}
        <i /> <b>{examSourceLabel(question?.examSource)}</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Transforme tentativa em evidência.</h1>
          <p>Cada resposta atualiza a leitura do seu domínio e calibra a repetição espaçada.</p>
        </div>
        <div className="ni-state">
          <i /> perfil {palette.family} · treino ativo
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
        </p>
      )}
      {syncError && <p className="text-xs text-rose-500 mb-2">{syncError}</p>}
      {questionsSyncError && <p className="text-xs text-rose-500 mb-2">{questionsSyncError}</p>}

      {/* Subject Filter & Real Exams Toggle */}
      <div className="ni-subjects">
        {subjects.map((subject) => {
          const active = subjectFilter === subject;
          const Icon = SUBJECT_ICONS[subject] ?? BookOpen;
          const subPalette = PALETTES[subject] ?? PALETTES.Matemática;
          return (
            <button
              key={subject}
              onClick={() => changeSubject(subject)}
              // O estado ativo vem do design system (.ni-subjects button.active),
              // igual ao botão de questões reais logo abaixo. O estilo inline que
              // ficava aqui pintava o chip com a paleta da matéria e escrevia o
              // rótulo na cor "wash" dela — em "Todas", que não é matéria nenhuma,
              // isso caía no fallback de Matemática e dava azul sobre azul, com
              // contraste de 2,19:1 (o mínimo legível é 4,5:1).
              className={active ? 'active' : ''}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {subject !== 'Todas' && <Icon className="w-3 h-3" style={{ color: subPalette.primary }} />}
              <span>{subject}</span>
            </button>
          );
        })}
        <button
          onClick={toggleRealExams}
          className={onlyRealExams ? 'active' : ''}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <BadgeCheck className="w-3 h-3" />
          <span>Só Questões Reais ({realExamCount})</span>
        </button>
      </div>

      {/* Tópico e subtópico. Antes eram duas fileiras de chips: em "Todas" isso
          desenhava mais de sessenta tópicos de todas as matérias de uma vez,
          uma parede de texto que estourava a largura da tela no retrato. Agora
          são dois campos, e em "Todas" os tópicos vêm agrupados pela matéria a
          que pertencem, então a hierarquia fica visível em vez de achatada. */}
      <div className="crivo-topic-filters">
        <label className="crivo-topic-filter">
          <span>Tópico</span>
          <select value={topicFilter} onChange={(e) => changeTopic(e.target.value)}>
            <option value={ALL}>Todos os tópicos ({pool.length === 0 && topicFilter === ALL ? 0 : scoped.length})</option>
            {topicGroups.map((grupo) => (
              grupo.subject === null ? (
                grupo.nodes.map((node) => (
                  <option key={node.id} value={node.id}>{node.label} ({node.count})</option>
                ))
              ) : (
                <optgroup key={grupo.subject} label={grupo.subject}>
                  {grupo.nodes.map((node) => (
                    <option key={node.id} value={node.id}>{node.label} ({node.count})</option>
                  ))}
                </optgroup>
              )
            ))}
          </select>
        </label>

        <label className="crivo-topic-filter" data-disabled={subtopicOptions.length === 0 ? 'true' : undefined}>
          <span>Subtópico</span>
          <select
            value={subtopicFilter}
            onChange={(e) => changeSubtopic(e.target.value)}
            disabled={subtopicOptions.length === 0}
          >
            <option value={ALL}>
              {subtopicOptions.length === 0 ? 'Escolha um tópico primeiro' : 'Todos os subtópicos'}
            </option>
            {subtopicOptions.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.label} ({sub.count})</option>
            ))}
          </select>
        </label>
      </div>

      {question ? (
        <section className="ni-grid ni-grid--practice">
          {/* Left Workspace Panel */}
          <Panel subject={question.subject} interactive className="ni-panel ni-workspace">
            <div className="flex items-center justify-between gap-4">
              <span className="ni-kicker">
                Questão {index + 1} de {pool.length} {question.examSource ? `· ${examSourceLabel(question.examSource)}` : ''}
              </span>
              <span className="text-[10px] font-mono text-[var(--dim)]">
                Acertos: <b className="text-[var(--text)]">{correctCount}</b> / {history.length}
              </span>
            </div>

            <h2>Qual é o próximo passo do raciocínio?</h2>
            <p>O feedback e a justificativa só aparecem após a sua tentativa.</p>

            <div className="ni-question"><QuestionStatement question={question} /></div>

            <div className="ni-options" style={{ gridTemplateColumns: '1fr' }}>
              {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrectOption = option.id === question.correctOptionId;
                let styleExtra: React.CSSProperties = { textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' };
                if (answered) {
                  if (isCorrectOption) {
                    styleExtra = { ...styleExtra, borderColor: '#86dca5', color: '#86dca5', background: 'rgba(134,220,165,0.1)' };
                  } else if (isSelected && !isCorrectOption) {
                    styleExtra = { ...styleExtra, borderColor: '#e08391', color: '#e08391', background: 'rgba(224,131,145,0.1)' };
                  }
                }
                return (
                  <button
                    key={option.id}
                    disabled={answered}
                    onClick={() => selectOption(option.id)}
                    style={styleExtra}
                    className="transition-colors hover:border-[var(--primary)] text-xs"
                  >
                    <b className="subject-text" style={{ font: 'inherit' }}>{option.id.toUpperCase()}</b>
                    <span>{option.text}</span>
                    {answered && isCorrectOption && <CheckCircle2 className="w-4 h-4 ml-auto text-status-success shrink-0" />}
                    {answered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 ml-auto text-status-error shrink-0" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 flex flex-col gap-4">
                <Button
                  subject={question.subject}
                  onClick={nextQuestion}
                  className="ni-primary w-full"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Próxima Questão
                </Button>

                {/* Explanation & Diagnosis */}
                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ni-kicker" style={{ margin: 0 }}>Gabarito & Justificativa</span>
                    {!isCorrect && !question.originalPages?.length && (
                      <button onClick={fetchDeepExplanation} className="ni-link text-xs">
                        <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                        {loadingDeepExplanation ? 'Analisando...' : 'Explicar com IA'}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--dim)] leading-relaxed">{question.explanation}</p>
                  {question.examSource?.sourceUrl && <a href={question.examSource.sourceUrl} target="_blank" rel="noreferrer" className="ni-link text-xs">Conferir fonte e gabarito</a>}

                  {deepExplanation && (
                    <div className="mt-3 p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs">
                      <AiText text={deepExplanation} />
                    </div>
                  )}

                  {/* Bloco de erro. Aparece sempre que a resposta está errada —
                      o registro no caderno não depende de a IA ter respondido. */}
                  {answered && !isCorrect && (
                    <div className="mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 space-y-2">
                      {diagnosing && (
                        <div className="flex items-center gap-2 text-amber-300">
                          <Stethoscope className="w-3.5 h-3.5 animate-pulse" />
                          <span>Diagnosticando esse erro...</span>
                        </div>
                      )}

                      {diagnosis && !diagnosisDismissed && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Stethoscope className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <b className="text-amber-300">{ERROR_TYPE_LABELS[diagnosis.type]}</b>
                            <span className="text-[10px] text-amber-200/60">
                              hipótese do CRIVO — confirme ou troque abaixo
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-200/90">{diagnosis.breakPoint}</p>
                          {diagnosis.evidence && (
                            <p className="text-[11px] text-amber-200/60">Evidência: {diagnosis.evidence}</p>
                          )}
                          <p className="text-[11px] text-amber-200/80">
                            Próximo passo ({INTERVENTION_LABELS[diagnosis.intervention.type]}):{' '}
                            {diagnosis.intervention.description}
                          </p>
                          {!diagnosisSaved && (
                            <button
                              onClick={dismissDiagnosis}
                              className="text-[11px] underline text-amber-200/70 hover:text-amber-200"
                            >
                              Não foi isso
                            </button>
                          )}
                        </div>
                      )}

                      {diagnosisFailed && !diagnosis && (
                        <div className="flex items-center gap-2 flex-wrap text-amber-200/80">
                          <span>Não consegui diagnosticar agora.</span>
                          <button
                            onClick={() => selectedOptionId && fetchDiagnosis(selectedOptionId)}
                            className="underline text-amber-200"
                          >
                            Tentar de novo
                          </button>
                          <span className="text-amber-200/60">
                            Você ainda pode registrar o erro abaixo.
                          </span>
                        </div>
                      )}

                      {diagnosisSaved ? (
                        <div className="flex items-center gap-1.5 text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registrado no Caderno de Erros.</span>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <label className="text-[11px] text-amber-200/70" htmlFor="tipo-erro">
                              Tipo do erro
                            </label>
                            <select
                              id="tipo-erro"
                              value={errorType}
                              onChange={(e) => setErrorType(e.target.value as ErrorLog['type'])}
                              className="bg-transparent border border-amber-500/40 rounded px-1.5 py-1 text-[11px] text-amber-100"
                            >
                              {ERROR_TYPE_ORDER.map((t) => (
                                <option key={t} value={t} className="bg-[var(--bg)] text-[var(--text)]">
                                  {ERROR_TYPE_LABELS[t]}
                                </option>
                              ))}
                            </select>
                            <Button onClick={saveErrorToLog} className="text-[11px] px-2 py-1">
                              Adicionar ao Caderno de Erros
                            </Button>
                          </div>

                          {/* Nao saber o motivo e o caso mais comum e o mais
                              util de diagnosticar. Em vez de obrigar a escolher
                              uma categoria no chute, abre o caminho de descobrir
                              — e o relato dela e o que torna o diagnostico
                              especifico em vez de generico. */}
                          {errorType === 'unknown' && !diagnosing && (
                            <div className="space-y-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2">
                              <label className="block text-[11px] text-amber-200/80" htmlFor="relato-erro">
                                Se lembrar, escreva o que passou pela sua cabeça ao resolver. É opcional, mas é o que
                                separa um erro de conta de um conceito trocado.
                              </label>
                              <textarea
                                id="relato-erro"
                                rows={2}
                                value={studentAccount}
                                onChange={(e) => setStudentAccount(e.target.value)}
                                placeholder="Ex.: achei que dava pra usar a fórmula direto, sem checar qual reagente acabava primeiro"
                                className="w-full rounded border border-amber-500/40 bg-transparent px-2 py-1.5 text-[11px] text-amber-100 placeholder:text-amber-200/35"
                              />
                              <button
                                onClick={() => selectedOptionId && fetchDiagnosis(selectedOptionId, studentAccount)}
                                className="inline-flex items-center gap-1.5 rounded border border-amber-500/50 px-2 py-1 text-[11px] font-semibold text-amber-100 hover:bg-amber-500/15"
                              >
                                <Stethoscope className="w-3.5 h-3.5" />
                                {diagnosisFailed || diagnosisDismissed
                                  ? 'Diagnosticar de novo'
                                  : 'Descobrir o motivo com o CRIVO'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Panel>

          {/* Right Session Side Panel */}
          <Panel subject={question.subject} interactive className="ni-panel ni-session-side">
            <span className="ni-kicker">Telemetria de Treino</span>
            <div className="ni-timer" style={{ fontSize: '36px' }}>
              {correctCount} / {history.length}
            </div>

            <Metric
              label="Taxa de Precisão"
              value={precisionPercent}
              bar
              fill={history.length > 0 ? correctCount / history.length : 0}
            />
            <Metric label="Filtro Ativo" value={subjectFilter} />
            <Metric
              label="Domínio deste tópico"
              value={masteryPercent}
              bar
              fill={topicMastery ? topicMastery.level / 100 : 0}
            />
            <Metric label="Próxima revisão" value={nextReviewLabel} />

            <div className="ni-stack">
              <span />
              <span />
              <span />
            </div>

            <p>
              Cada resposta recalcula o domínio e o intervalo acima: acerto empurra a próxima revisão para mais
              longe, erro traz de volta para perto.
            </p>

            <div className="mt-6 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--dim)]">
              <button onClick={resetSession} className="flex items-center gap-1.5 hover:text-[var(--text)]">
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar Treino
              </button>
              <span>{pool.length} questões disponíveis</span>
            </div>
          </Panel>
        </section>
      ) : questionsLoading ? (
        // O banco de questões agora é buscado, não vem no bundle: sem este
        // estado a tela piscava "nenhuma questão encontrada" antes de carregar.
        <div className="space-y-4 py-8" aria-busy="true">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <div className="text-center py-16 space-y-2">
          <p className="text-[var(--dim)]">Nenhuma questão encontrada para este filtro.</p>
          {onlyRealExams && realExamCount === 0 && (
            // Distingue "o filtro não achou nada aqui" de "o banco carregado
            // não tem questão de prova nenhuma" — o segundo caso costuma ser
            // Firestore desatualizado, e o caminho é semear em /admin/conteudo.
            <p className="text-[11px] text-[var(--dim)]">
              O banco carregado não tem nenhuma questão de prova real
              {subjectFilter !== 'Todas' ? ` em ${subjectFilter}` : ''}. Se você acabou de
              adicionar questões ao repositório, semeie o banco em /admin/conteudo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
