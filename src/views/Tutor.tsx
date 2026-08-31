import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTopics } from '../data/mockData';
import { Topic } from '../types';
import { aiErrorMessage, requestAiText } from '../lib/aiClient';
import { parseContentExplanation, parseAnswerCorrection, ContentExplanation, AnswerCorrection } from '../lib/tutorContracts';
import { AiText } from '../components/AiText';
import { Brain, Send, Bot, User, Sparkles, BookOpenText, ClipboardCheck, CalendarClock, PencilLine, Lightbulb, Target, School, AlertTriangle, HelpCircle, RotateCcw } from 'lucide-react';
import { useUserMastery } from '../hooks/useUserMastery';
import { applyDiscursiveSelfRatingOutcome } from '../lib/spacedRepetition';

const DISCURSIVE_BOARDS = ['Fuvest', 'Unicamp', 'Unesp', 'Famerp', 'Unifesp'];

type Mode = 'duvida' | 'explicar' | 'corrigir' | 'revisao' | 'questao';

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
  // Changing the topic invalidates whatever chapter was picked for the previous one.
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
        className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {Object.entries(topicsBySubject).map(([subject, ids]) => (
          <optgroup key={subject} label={subject}>
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
          className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Capítulo específico (opcional)</option>
          {topic.chapters.map((chapter) => (
            <option key={chapter} value={chapter}>{chapter}</option>
          ))}
        </select>
      )}
    </div>
  );
}

function CorrectionCard({ correction }: { correction: AnswerCorrection }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm">
        <p className="font-semibold mb-1 flex items-center"><ClipboardCheck className="w-4 h-4 mr-2" />O que você acertou</p>
        <AiText text={correction.acertos} />
      </div>
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300 text-sm">
        <p className="font-semibold mb-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" />Primeiro ponto de ruptura</p>
        <AiText text={correction.rupturaPoint} />
      </div>
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm">
        <p className="font-semibold mb-1">Por que isso compromete a resposta</p>
        <AiText text={correction.porque} />
      </div>
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm">
        <p className="font-semibold mb-1">Correção mínima</p>
        <AiText text={correction.correcaoMinima} />
      </div>
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm">
        <p className="font-semibold mb-1">Resposta-modelo</p>
        <AiText text={correction.respostaModelo} />
      </div>
      {correction.padraoRecorrente && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
          <p className="font-semibold mb-1">Padrão recorrente notado</p>
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
    <div className="p-6 space-y-4 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tópico</span>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={2}
        placeholder="Alguma dúvida específica dentro desse tópico? (opcional)"
        className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
      <button
        onClick={explain}
        disabled={loading}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
      >
        {loading ? 'Explicando...' : 'Explicar'}
      </button>
      {error && <p className="text-sm text-rose-500">{error}</p>}

      {explanation && (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm">
            <p className="font-semibold mb-1 flex items-center"><Lightbulb className="w-4 h-4 mr-2" />Intuição</p>
            <AiText text={explanation.intuicao} />
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm">
            <p className="font-semibold mb-1">Conceito</p>
            <AiText text={explanation.conceito} />
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm">
            <p className="font-semibold mb-1 flex items-center"><Target className="w-4 h-4 mr-2" />Aplicação</p>
            <AiText text={explanation.aplicacao} />
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm">
            <p className="font-semibold mb-1 flex items-center"><School className="w-4 h-4 mr-2" />Como cai na prova</p>
            <AiText text={explanation.comoCai} />
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
            <p className="font-semibold mb-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" />Pegadinha comum</p>
            <AiText text={explanation.pegadinha} />
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm">
            <p className="font-semibold mb-1 flex items-center"><HelpCircle className="w-4 h-4 mr-2" />Pergunta de checagem</p>
            <AiText text={explanation.checagem} />
            <textarea
              value={checkAnswer}
              onChange={(e) => { setCheckAnswer(e.target.value); setCheckCorrection(null); setCheckRecorded(false); }}
              rows={3}
              placeholder="Responda sem consultar a explicação..."
              className="mt-3 w-full bg-white dark:bg-zinc-950 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={correctCheck} disabled={checkLoading || !checkAnswer.trim()} className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 text-white rounded-lg font-medium">
              {checkLoading ? 'Avaliando...' : 'Avaliar minha resposta'}
            </button>
          </div>
          {checkCorrection && (
            <div className="space-y-3">
              <CorrectionCard correction={checkCorrection} />
              {!checkRecorded ? (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm font-semibold mb-2">Comparando com a correção, como foi sua recuperação?</p>
                  <div className="flex flex-wrap gap-2">
                    <button disabled={syncing} onClick={() => recordCheck('fraco')} className="px-3 py-2 border rounded-lg text-sm">Não consegui</button>
                    <button disabled={syncing} onClick={() => recordCheck('mediano')} className="px-3 py-2 border rounded-lg text-sm">Parcial / com ajuda</button>
                    <button disabled={syncing} onClick={() => recordCheck('forte')} className="px-3 py-2 border rounded-lg text-sm">Consegui sem apoio</button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">A explicação sozinha não altera seu domínio; esta checagem tem peso limitado.</p>
                </div>
              ) : <p className="text-sm text-emerald-600">Checagem registrada no domínio e nas próximas revisões.</p>}
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
    <div className="p-6 space-y-4 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tópico</span>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Questão (cole o enunciado)</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Sua resposta</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 mb-1 block">Se for discursiva de 2ª fase, banca (opcional)</label>
        <select
          value={board}
          onChange={(e) => setBoard(e.target.value)}
          className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Objetiva / sem banca específica</option>
          {DISCURSIVE_BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <button
        onClick={correct}
        disabled={loading || !question.trim() || !answer.trim()}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
      >
        {loading ? 'Corrigindo...' : 'Corrigir resposta'}
      </button>
      {error && <p className="text-sm text-rose-500">{error}</p>}
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
    <div className="p-6 space-y-4 overflow-y-auto flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tópico</span>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center text-sm gap-2">
          <input type="checkbox" checked={isDiscursive} onChange={(e) => setIsDiscursive(e.target.checked)} />
          Questão discursiva (2ª fase)
        </label>
        {isDiscursive && (
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DISCURSIVE_BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        )}
      </div>
      <button
        onClick={() => generate(false)}
        disabled={generating}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
      >
        {generating ? 'Gerando...' : 'Gerar questão'}
      </button>
      {error && <p className="text-sm text-rose-500">{error}</p>}

      {exercise && (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm">
            <AiText text={exercise} />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Sua resposta</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={correct}
            disabled={correcting || !answer.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
          >
            {correcting ? 'Corrigindo...' : 'Corrigir resposta'}
          </button>
        </div>
      )}

      {correction && (
        <div className="space-y-4 pt-2">
          <CorrectionCard correction={correction} />
          <button
            onClick={() => generate(true)}
            disabled={generating}
            className="flex items-center px-5 py-2.5 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Questão de transferência (mesmo tópico, contexto diferente)
          </button>
        </div>
      )}
    </div>
  );
}

function RevisaoPanel() {
  const navigate = useNavigate();
  return (
    <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
      <CalendarClock className="w-10 h-10 text-indigo-500 mb-4" />
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm">
        Revisão ativa já tem uma tela própria, com os tópicos realmente pendentes calculados a partir do seu domínio real — não faz sentido duplicar isso aqui.
      </p>
      <button
        onClick={() => navigate('/revisoes')}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
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
    { id: '1', sender: 'ai', text: `Olá. Qual dúvida sobre ${topic.name} você quer resolver pensando junto comigo?` },
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
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const data = await requestAiText('socratic', { question: userMessage.text, topic: effectiveTopic });
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'ai', text: data.text || 'Ocorreu um erro ao processar a resposta.' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiErrorMessage(error) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium">Sessão ativa</span>
        </div>
        <TopicSelect topicsBySubject={topicsBySubject} topicId={topicId} onChange={setTopicId} topic={topic} subtopic={subtopic} setSubtopic={setSubtopic} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-zinc-800 text-white ml-3' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-3'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-5 py-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
              }`}>
                {msg.sender === 'user' ? <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p> : <AiText text={msg.text} />}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-3 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva seu raciocínio atual..."
            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-5 pr-14 py-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}

export default function Tutor() {
  const [mode, setMode] = useState<Mode>('duvida');
  const picker = useTopicPicker();
  const activeMode = MODES.find((m) => m.value === mode)!;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <header className="mb-4 shrink-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Diálogo Socrático & Investigação · Crivo</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
          <Brain className="w-7 h-7 text-action-primary" />
          Tutor Socrático
        </h1>
        <p className="text-text-secondary flex items-center mt-1 text-sm">
          <activeMode.icon className="w-4 h-4 mr-2 text-ember-500 shrink-0" />
          {activeMode.hint}
        </p>
      </header>

      <div className="flex gap-2 flex-wrap mb-4 shrink-0">
        {MODES.map((m) => {
          const active = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                active
                  ? 'bg-action-primary text-warm-50 font-bold shadow-sm ring-1 ring-white/20'
                  : 'border border-border-subtle hover:border-text-primary text-text-muted hover:text-text-primary bg-surface-default/70'
              }`}
            >
              <m.icon className="w-3.5 h-3.5 mr-1.5" />
              {m.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col bg-surface-default border border-border-subtle rounded-2xl overflow-hidden shadow-soft-sm">
        {mode === 'duvida' && <DuvidaPanel {...picker} />}
        {mode === 'explicar' && <ExplicarPanel {...picker} />}
        {mode === 'corrigir' && <CorrigirPanel {...picker} />}
        {mode === 'questao' && <QuestaoPanel {...picker} />}
        {mode === 'revisao' && <RevisaoPanel />}
      </div>
    </div>
  );
}
