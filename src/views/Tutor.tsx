import React, { useMemo, useState, useRef, useEffect } from 'react';
import { mockTopics } from '../data/mockData';
import { Brain, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function Tutor() {
  const topicsBySubject = useMemo(() => {
    const groups: Record<string, string[]> = {};
    mockTopics.forEach((t) => {
      groups[t.subject] = groups[t.subject] ?? [];
      groups[t.subject].push(t.name);
    });
    return groups;
  }, []);

  const [topic, setTopic] = useState(mockTopics[0].name);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Olá. Qual conceito de ${mockTopics[0].name} está bloqueando seu progresso hoje?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/socratic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.text,
          topic,
          history: messages
        })
      });

      const data = await res.json();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: data.text || 'Ocorreu um erro ao processar a resposta.'
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Erro de conexão com o oráculo Socrático.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tutor Socrático</h1>
        <p className="text-zinc-500 dark:text-zinc-400 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
          A IA não te dá a resposta pronta. Ela te faz pensar.
        </p>
      </header>

      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Chat Header Settings */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium">Sessão Ativa</span>
          </div>
          <div>
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(topicsBySubject).map(([subject, names]) => (
                <optgroup key={subject} label={subject}>
                  {names.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-zinc-800 text-white ml-3' 
                    : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-3'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`px-5 py-3.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
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

        {/* Input */}
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
      </div>
    </div>
  );
}
