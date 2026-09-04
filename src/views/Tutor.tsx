import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTopics } from '../data/mockData';
import { Topic } from '../types';
import { aiErrorMessage, requestAiText, requestAiTextStream } from '../lib/aiClient';
import { parseContentExplanation, parseAnswerCorrection, ContentExplanation, AnswerCorrection } from '../lib/tutorContracts';
import { AiText } from '../components/AiText';
import { Brain, Send, Bot, User, Sparkles, BookOpenText, ClipboardCheck, CalendarClock, PencilLine, Lightbulb, Target, School, AlertTriangle, HelpCircle, RotateCcw } from 'lucide-react';
import { useUserMastery } from '../hooks/useUserMastery';
import { applyDiscursiveSelfRatingOutcome } from '../lib/spacedRepetition';
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

const DISCURSIVE_BOARDS = ['Fuvest', 'Unicamp', 'Unesp', 'Famerp', 'Unifesp'];

type Mode = 'duvida' | 'explicar' | 'corrigir' | 'questao' | 'revisao';

const MODES: { value: Mode; label: string; hint: string; icon: React.ElementType }[] = [
  { value: 'duvida', label: 'Tirar dúvida', hint: 'A IA não entrega a resposta pronta — te guia até você chegar nela.', icon: Sparkles },
  { value: 'explicar', label: 'Explicar conteúdo', hint: 'Explicação direta e completa de um tópico.', icon: BookOpenText },
  { value: 'corrigir', label: 'Corrigir resposta', hint: 'Cole uma questão e sua resposta para correção detalhada.', icon: ClipboardCheck },
  { value: 'questao', label: 'Criar questão', hint: 'Gera uma questão nova sem mostrar o gabarito de cara.', icon: PencilLine },
  { value: 'revisao', label: 'Revisão ativa', hint: 'Vai para a fila de revisões pendentes.', icon: CalendarClock },
];

function useTopicPicker() {
  const topicsBySubject = useMemo(() => {
    const groups: Record<string, string[]> = {};
    mockTopics.forEach((t) => {
      groups[t.subject] = groups[t.subject] ?? [];
      groups[t.subject].push(t.id);
    });
    return groups;
  }, []);
  const [topicId, setTopicIdRaw] = useState(mockTopics[0].id);
  const [subtopic, setSubtopic] = useState('');
  const topic = mockTopics.find((t) => t.id === topicId) ?? mockTopics[0];
  const setTopicId = (id: string) => {
    setTopicIdRaw(id);
    setSubtopic('');
  };
  const effectiveTopic = subtopic ? `${topic.name} — ${subtopic}` : topic.name;
  return { topicsBySubject, topicId, setTopicId, topic, subtopic, setSubtopic, effectiveTopic };
}

function TopicSelect({
  topicsBySubject,
  topicId,
  onChange,
  topic,
  subtopic,
  setSubtopic,
}: {
  topicsBySubject: Record<string, string[]>;
  topicId: string;
  onChange: (id: string) => void;
  topic: Topic;
  subtopic: string;
  setSubtopic: (s: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={topicId}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
      >
        {Object.entries(topicsBySubject).map(([subject, ids]) => (
          <optgroup key={subject} label={subject} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            {ids.map((id) => {
              const t = mockTopics.find((topic) => topic.id === id);
              return t ? <option key={id} value={id}>{t.name}</option> : null;
            })}
          </optgroup>
        ))}
      </select>
      {!!topic.chapters?.length && (
        <select
          value={subtopic}
          onChange={(e) => setSubtopic(e.target.value)}
          className="bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
        >
          <option value="" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Capítulo específico (opcional)</option>
          {topic.chapters.map((chapter) => (
            <option key={chapter} value={chapter} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{chapter}</option>
          ))}
        </select>
      )}
    </div>
  );
}

function CorrectionCard({ correction }: { correction: AnswerCorrection }) {
  return (
    <div className="space-y-3">
      <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-[var(--text)]">
        <p className="font-semibold mb-1 flex items-center text-emerald-400"><ClipboardCheck className="w-3.5 h-3.5 mr-1.5" />O que você acertou</p>
        <AiText text={correction.acertos} />
      </div>
      <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-[var(--text)]">
        <p className="font-semibold mb-1 flex items-center text-[#e08391]"><AlertTriangle className="w-3.5 h-3.5 mr-1.5" />Primeiro ponto de ruptura</p>
        <AiText text={correction.rupturaPoint} />
      </div>
      <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--text)]">
        <p className="font-semibold mb-1 text-[var(--dim)]">Por que isso compromete a resposta</p>
        <AiText text={correction.porque} />
      </div>
      <div className="p-3.5 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)]">
        <p className="font-semibold mb-1 text-[var(--primary)]">Correção mínima</p>
        <AiText text={correction.correcaoMinima} />
      </div>
      <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--text)]">
        <p className="font-semibold mb-1 text-[var(--dim)]">Resposta-modelo</p>
        <AiText text={correction.respostaModelo} />
      </div>
      {correction.padraoRecorrente && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300">
          <p className="font-semibold mb-1 text-amber-400">Padrão recorrente notado</p>
          <AiText text={correction.padraoRecorrente} />
        </div>
      )}
    </div>
  );
}

function ExplicarPanel({ topicsBySubject, topicId, setTopicId, topic, subtopic, setSubtopic, effectiveTopic }: ReturnType<typeof useTopicPicker>) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ContentExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkAnswer, setCheckAnswer] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkCorrection, setCheckCorrection] = useState<AnswerCorrection | null>(null);
  const [checkRecorded, setCheckRecorded] = useState(false);
  const { updateMastery, syncing } = useUserMastery();

  const explain = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestAiText('content-explanation', {
        topic: effectiveTopic,
        subject: topic.subject,
        question: question.trim() || undefined,
      });
      setExplanation(parseContentExplanation(data.text));
      setCheckAnswer('');
      setCheckCorrection(null);
      setCheckRecorded(false);
    } catch (err) {
      setError(aiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const correctCheck = async () => {
    if (!explanation || !checkAnswer.trim()) return;
    setCheckLoading(true);
    setError(null);
    try {
      const data = await requestAiText('answer-correction', {
        topic: effectiveTopic,
        subject: topic.subject,
        question: explanation.checagem,
        studentAnswer: checkAnswer.trim(),
      });
      setCheckCorrection(parseAnswerCorrection(data.text));
    } catch (err) {
      setError(aiErrorMessage(err));
    } finally {
      setCheckLoading(false);
    }
  };

  const recordCheck = async (rating: 'fraco' | 'mediano' | 'forte') => {
    if (checkRecorded) return;
    const saved = await updateMastery((items) => items.map((item) => item.topicId === topicId
      ? { ...item, ...applyDiscursiveSelfRatingOutcome(item, rating) }
      : item));
    if (!saved) {
      setError('Não foi possível salvar a checagem. Tente novamente.');
      return;
    }
    setCheckRecorded(true);
  };

  return (
    <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-semibold text-[var(--dim)]">Tópico</span>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={2}
        placeholder="Alguma dúvida específica dentro desse tópico? (opcional)"
        className="w-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
      />
      <button
        onClick={explain}
        disabled={loading}
        className="px-4 py-2 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
      >
        {loading ? 'Explicando...' : 'Explicar'}
      </button>
      {error && <p className="text-xs text-rose-500">{error}</p>}

      {explanation && (
        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)]">
            <p className="font-semibold mb-1 flex items-center text-[var(--primary)]"><Lightbulb className="w-3.5 h-3.5 mr-1.5" />Intuição</p>
            <AiText text={explanation.intuicao} />
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--text)]">
            <p className="font-semibold mb-1 text-[var(--dim)]">Conceito</p>
            <AiText text={explanation.conceito} />
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--text)]">
            <p className="font-semibold mb-1 flex items-center text-[var(--dim)]"><Target className="w-3.5 h-3.5 mr-1.5" />Aplicação</p>
            <AiText text={explanation.aplicacao} />
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--text)]">
            <p className="font-semibold mb-1 flex items-center text-[var(--dim)]"><School className="w-3.5 h-3.5 mr-1.5" />Como cai na prova</p>
            <AiText text={explanation.comoCai} />
          </div>
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300">
            <p className="font-semibold mb-1 flex items-center text-amber-400"><AlertTriangle className="w-3.5 h-3.5 mr-1.5" />Pegadinha comum</p>
            <AiText text={explanation.pegadinha} />
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-[var(--text)]">
            <p className="font-semibold mb-1 flex items-center text-emerald-400"><HelpCircle className="w-3.5 h-3.5 mr-1.5" />Pergunta de checagem</p>
            <AiText text={explanation.checagem} />
            <textarea
              value={checkAnswer}
              onChange={(e) => { setCheckAnswer(e.target.value); setCheckCorrection(null); setCheckRecorded(false); }}
              rows={3}
              placeholder="Responda sem consultar a explicação..."
              className="mt-3 w-full bg-[var(--surface2)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
            />
            <button
              onClick={correctCheck}
              disabled={checkLoading || !checkAnswer.trim()}
              className="mt-2 px-3.5 py-1.5 bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
            >
              {checkLoading ? 'Avaliando...' : 'Avaliar minha resposta'}
            </button>
          </div>
          {checkCorrection && (
            <div className="space-y-3">
              <CorrectionCard correction={checkCorrection} />
              {!checkRecorded ? (
                <div className="p-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--surface2)]">
                  <p className="text-xs font-semibold mb-2 text-[var(--text)]">Comparando com a correção, como foi sua recuperação?</p>
                  <div className="flex flex-wrap gap-2">
                    <button disabled={syncing} onClick={() => recordCheck('fraco')} className="px-3 py-1.5 border border-[var(--line)] rounded-lg text-xs hover:border-[var(--primary)]">Não consegui</button>
                    <button disabled={syncing} onClick={() => recordCheck('mediano')} className="px-3 py-1.5 border border-[var(--line)] rounded-lg text-xs hover:border-[var(--primary)]">Parcial / com ajuda</button>
                    <button disabled={syncing} onClick={() => recordCheck('forte')} className="px-3 py-1.5 border border-[var(--line)] rounded-lg text-xs hover:border-[var(--primary)]">Consegui sem apoio</button>
                  </div>
                  <p className="text-[11px] text-[var(--dim)] mt-2">A explicação sozinha não altera seu domínio; esta checagem tem peso calibrado.</p>
                </div>
              ) : <p className="text-xs text-emerald-400 font-mono">Checagem registrada no domínio e nas próximas revisões.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CorrigirPanel({ topicsBySubject, topicId, setTopicId, topic, subtopic, setSubtopic, effectiveTopic }: ReturnType<typeof useTopicPicker>) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [board, setBoard] = useState('');
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState<AnswerCorrection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const correct = async () => {
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await requestAiText('answer-correction', {
        topic: effectiveTopic,
        subject: topic.subject,
        question: question.trim(),
        studentAnswer: answer.trim(),
        board: board || undefined,
      });
      setCorrection(parseAnswerCorrection(data.text));
    } catch (err) {
      setError(aiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-semibold text-[var(--dim)]">Tópico</span>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>
      <div>
        <label className="text-xs text-[var(--dim)] mb-1 block">Questão (cole o enunciado)</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          className="w-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--dim)] mb-1 block">Sua resposta</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          className="w-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--dim)] mb-1 block">Banca para critério analítico (opcional)</label>
        <select
          value={board}
          onChange={(e) => setBoard(e.target.value)}
          className="bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
        >
          <option value="" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Objetiva / sem banca específica</option>
          {DISCURSIVE_BOARDS.map((b) => <option key={b} value={b} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{b}</option>)}
        </select>
      </div>
      <button
        onClick={correct}
        disabled={loading || !question.trim() || !answer.trim()}
        className="px-4 py-2 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
      >
        {loading ? 'Corrigindo...' : 'Corrigir resposta'}
      </button>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      {correction && <div className="pt-2"><CorrectionCard correction={correction} /></div>}
    </div>
  );
}

function QuestaoPanel({ topicsBySubject, topicId, setTopicId, topic, subtopic, setSubtopic, effectiveTopic }: ReturnType<typeof useTopicPicker>) {
  const [isDiscursive, setIsDiscursive] = useState(false);
  const [board, setBoard] = useState(DISCURSIVE_BOARDS[0]);
  const [generating, setGenerating] = useState(false);
  const [exercise, setExercise] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [correcting, setCorrecting] = useState(false);
  const [correction, setCorrection] = useState<AnswerCorrection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (transfer: boolean) => {
    setGenerating(true);
    setError(null);
    setCorrection(null);
    setAnswer('');
    try {
      const data = await requestAiText('backlog-exercise', {
        topic: effectiveTopic,
        subject: topic.subject,
        mode: isDiscursive ? 'discursive' : 'solve',
        board: isDiscursive ? board : undefined,
        transfer,
      });
      setExercise(data.text);
    } catch (err) {
      setError(aiErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  const correct = async () => {
    if (!exercise || !answer.trim()) return;
    setCorrecting(true);
    setError(null);
    try {
      const data = await requestAiText('answer-correction', {
        topic: effectiveTopic,
        subject: topic.subject,
        question: exercise,
        studentAnswer: answer.trim(),
        board: isDiscursive ? board : undefined,
      });
      setCorrection(parseAnswerCorrection(data.text));
    } catch (err) {
      setError(aiErrorMessage(err));
    } finally {
      setCorrecting(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-semibold text-[var(--dim)]">Tópico</span>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center text-xs text-[var(--text)] gap-2">
          <input type="checkbox" checked={isDiscursive} onChange={(e) => setIsDiscursive(e.target.checked)} />
          Questão discursiva (2ª fase)
        </label>
        {isDiscursive && (
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
          >
            {DISCURSIVE_BOARDS.map((b) => <option key={b} value={b} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{b}</option>)}
          </select>
        )}
      </div>
      <button
        onClick={() => generate(false)}
        disabled={generating}
        className="px-4 py-2 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
      >
        {generating ? 'Gerando...' : 'Gerar questão'}
      </button>
      {error && <p className="text-xs text-rose-500">{error}</p>}

      {exercise && (
        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--text)] leading-relaxed">
            <AiText text={exercise} />
          </div>
          <div>
            <label className="text-xs text-[var(--dim)] mb-1 block">Sua resposta</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
            />
          </div>
          <button
            onClick={correct}
            disabled={correcting || !answer.trim()}
            className="px-4 py-2 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
          >
            {correcting ? 'Corrigindo...' : 'Corrigir resposta'}
          </button>
        </div>
      )}

      {correction && (
        <div className="space-y-3 pt-2">
          <CorrectionCard correction={correction} />
          <button
            onClick={() => generate(true)}
            disabled={generating}
            className="flex items-center px-4 py-2 border border-[var(--primary)] text-[var(--primary)] rounded-lg text-xs font-semibold hover:bg-[var(--surface2)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Questão de transferência (mesmo conceito, novo contexto)
          </button>
        </div>
      )}
    </div>
  );
}

function RevisaoPanel() {
  const navigate = useNavigate();
  return (
    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
      <CalendarClock className="w-8 h-8 text-[var(--primary)] mb-3" />
      <p className="text-xs text-[var(--dim)] mb-4 max-w-sm">
        A fila de repetição espaçada adaptativa gerencia seus prazos reais com base no algoritmo SM-2.
      </p>
      <button
        onClick={() => navigate('/revisoes')}
        className="px-4 py-2 bg-[var(--primary)] text-[var(--wash)] rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        Ir para Revisões
      </button>
    </div>
  );
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

function DuvidaPanel({ topicsBySubject, topicId, setTopicId, topic, subtopic, setSubtopic, effectiveTopic }: ReturnType<typeof useTopicPicker>) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: `Olá! Qual dúvida sobre ${topic.name} você quer destravar pensando junto comigo?` },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    // A bolha da resposta nasce vazia e vai sendo preenchida conforme o texto
    // chega — antes eram até dois minutos e meio de espera antes de a aluna
    // ver qualquer coisa.
    const respostaId = `${Date.now()}-ai`;
    setMessages((prev) => [...prev, userMessage, { id: respostaId, sender: 'ai', text: '' }]);
    setInput('');
    setIsLoading(true);

    const escreverNaBolha = (texto: string) =>
      setMessages((prev) => prev.map((m) => (m.id === respostaId ? { ...m, text: texto } : m)));

    try {
      let acumulado = '';
      const data = await requestAiTextStream('socratic', { question: userMessage.text, topic: effectiveTopic }, (delta) => {
        acumulado += delta;
        escreverNaBolha(acumulado);
      });
      escreverNaBolha(data.text || acumulado || 'Ocorreu um erro ao processar a resposta.');
    } catch (error) {
      escreverNaBolha(aiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="px-5 py-3 border-b border-[var(--line)] bg-[var(--surface2)]/50 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center text-xs font-medium text-[var(--text)]">
          <Brain className="w-4 h-4 mr-2 text-[var(--primary)]" />
          <span>Sessão ativa</span>
        </div>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-[var(--primary)] text-[var(--wash)] ml-2.5'
                  : 'bg-[var(--surface2)] border border-[var(--line)] text-[var(--primary)] mr-2.5'
              }`}>
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[var(--primary)] text-[var(--wash)]'
                  : 'bg-[var(--surface2)] text-[var(--text)] border border-[var(--line)]'
              }`}>
                {msg.sender === 'user' ? <p className="whitespace-pre-wrap">{msg.text}</p> : <AiText text={msg.text} />}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--primary)] mr-2.5 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[var(--line)] bg-[var(--surface2)]/50">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva seu raciocínio ou responda à pergunta do tutor..."
            className="w-full bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] rounded-xl pl-4 pr-12 py-3 text-xs outline-none focus:border-[var(--primary)]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 flex items-center justify-center transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </>
  );
}

export default function Tutor() {
  const [mode, setMode] = useState<Mode>('duvida');
  const picker = useTopicPicker();
  const currentPalette = PALETTES[picker.topic.subject] ?? PALETTES.Filosofia;
  const SubIcon = SUBJECT_ICONS[picker.topic.subject] ?? Brain;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>LIBRARY</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <SubIcon className="w-3 h-3" />
          </span>
          SOCRÁTICO
        </span>
        <i />
        <b>TUTOR SOCRÁTICO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Destrave o raciocínio com perguntas certas.</h1>
          <p>IA socrática que guia sem dar a resposta — o entendimento vem do seu próprio percurso.</p>
        </div>
        <div className="ni-state">
          <i /> Crivo Socrático · {picker.topic.subject}
        </div>
      </div>

      {/* Mode selectors */}
      <div className="ni-subjects">
        {MODES.map((m) => {
          const active = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              style={
                active
                  ? { backgroundColor: currentPalette.primary, color: currentPalette.wash, borderRadius: '4px', padding: '2px 8px' }
                  : undefined
              }
            >
              <m.icon className="w-3 h-3 inline mr-1" />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Panel container */}
      <Panel subject={picker.topic.subject} className="ni-panel flex flex-col h-[560px] overflow-hidden">
        {mode === 'duvida' && <DuvidaPanel {...picker} />}
        {mode === 'explicar' && <ExplicarPanel {...picker} />}
        {mode === 'corrigir' && <CorrigirPanel {...picker} />}
        {mode === 'questao' && <QuestaoPanel {...picker} />}
        {mode === 'revisao' && <RevisaoPanel />}
      </Panel>
    </div>
  );
}
