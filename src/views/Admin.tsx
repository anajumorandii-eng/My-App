import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import { getFirebaseIdToken } from '../lib/auth';

interface DayMetric { date: string; requests: number; failures: number; cached: number; fallbacks: number; totalTokens: number; estimatedCostUsd: number }

export default function Admin() {
  const [days, setDays] = useState<DayMetric[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    getFirebaseIdToken().then(async (token) => {
      if (!token) throw new Error('Entre na conta administrativa.');
      const response = await fetch('/api/admin/metrics', { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Falha ao carregar métricas.');
      setDays(body.days);
    }).catch((cause) => setError(cause.message));
  }, []);
  const totals = useMemo(() => days.reduce((sum, day) => ({
    requests: sum.requests + day.requests, failures: sum.failures + day.failures,
    tokens: sum.tokens + day.totalTokens, cost: sum.cost + day.estimatedCostUsd,
  }), { requests: 0, failures: 0, tokens: 0, cost: 0 }), [days]);

  return <div className="space-y-8">
    <header><h1 className="text-3xl font-bold flex items-center"><ShieldCheck className="w-7 h-7 mr-3 text-indigo-500" />Administração</h1><p className="text-zinc-500 mt-2">Uso agregado da IA nos últimos sete dias.</p></header>
    {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}
    <div className="grid sm:grid-cols-4 gap-4">
      {[['Requisições', totals.requests], ['Falhas', totals.failures], ['Tokens', totals.tokens.toLocaleString('pt-BR')], ['Custo estimado', `$ ${totals.cost.toFixed(4)}`]].map(([label, value]) => <div key={label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"><p className="text-sm text-zinc-500">{label}</p><p className="text-2xl font-bold mt-2">{value}</p></div>)}
    </div>
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"><div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center"><BarChart3 className="w-5 h-5 mr-2"/><h2 className="font-semibold">Detalhamento diário</h2></div>{days.map(day => <div key={day.date} className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-4 border-b border-zinc-100 dark:border-zinc-800 text-sm"><strong>{day.date}</strong><span>{day.requests} chamadas</span><span>{day.failures} falhas</span><span>{day.cached} cache</span><span>{day.fallbacks} fallback</span><span>{day.totalTokens.toLocaleString('pt-BR')} tokens</span></div>)}</section>
  </div>;
}
