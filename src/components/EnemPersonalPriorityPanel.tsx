import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/enemProbabilities2026.json';
import { mockTopics } from '../data/mockData';
import { useUserMastery } from '../hooks/useUserMastery';
import { buildEnemPersonalPriorities, type EnemDay } from '../lib/enemPersonalPriority';

const names = new Map(mockTopics.map(topic => [topic.id, topic.name]));
const DAYS: Record<EnemDay, string> = { 1: 'Dia 1 (8/11) · Linguagens e Humanas', 2: 'Dia 2 (15/11) · Natureza e Matemática' };

export function EnemPersonalPriorityPanel() {
  const { mastery, isPersisted, loading, syncError } = useUserMastery();
  const [day, setDay] = useState<EnemDay>(1);
  const [visible, setVisible] = useState(12);
  const ranked = useMemo(() => buildEnemPersonalPriorities(data.topics, mastery, isPersisted, day), [mastery, isPersisted, day]);
  const withEvidence = ranked.filter(entry => entry.level !== null).length;
  return <section aria-labelledby="enem-personal-title" className="ni-panel p-5 space-y-4">
    <h2 id="enem-personal-title" className="font-display text-xl">ENEM 2026: o que mais rende estudar agora</h2>
    <p className="text-sm text-[var(--dim)]">Cruza a chance histórica de cada assunto cair (oito provas, 2018–2025) com o seu domínio registrado. A ordem é pelas questões em jogo: quantas costumam cair vezes a parte que você ainda erra.</p>
    <label className="block max-w-sm">Dia de prova<select className="block w-full field" value={day} onChange={event => { setDay(Number(event.target.value) as EnemDay); setVisible(12); }}>{([1, 2] as EnemDay[]).map(value => <option key={value} value={value}>{DAYS[value]}</option>)}</select></label>
    {loading && <p role="status">Carregando seu progresso…</p>}
    {syncError && <p role="alert">{syncError}</p>}
    {!loading && <p className="text-xs">{isPersisted ? `${withEvidence} de ${ranked.length} assuntos deste dia têm domínio registrado.` : 'Sem progresso salvo carregado.'} Assunto sem registro conta como 50% e aparece como "diagnosticar": resolver questões dele é o que tira essa dúvida.</p>}
    <ol className="space-y-2">
      {ranked.slice(0, visible).map((entry, index) => <li key={entry.topicId} className="border border-[var(--line)] rounded-lg p-3">
        <b>{index + 1}. {names.get(entry.topicId) ?? entry.topicId}</b> <span className="text-xs text-[var(--dim)]">{entry.subject}</span>
        <span className="block text-sm">{entry.atStake.toFixed(1)} questões em jogo · cai em {Math.round(entry.pAtLeastOne * 100)}% (esteve em {entry.presence} de 8 provas) · ~{entry.expected.toFixed(1)} por prova · domínio {entry.level === null ? 'diagnosticar' : `${Math.round(entry.level)}%`}</span>
        <Link className="underline text-sm" to={`/questoes?topic=${encodeURIComponent(entry.topicId)}&board=ENEM`}>Resolver questões do ENEM deste assunto</Link>
      </li>)}
    </ol>
    {ranked.length > visible && <button className="ni-button" onClick={() => setVisible(value => value + 12)}>Mostrar mais assuntos</button>}
    <p className="text-xs text-[var(--dim)]">Contagem não é peso na TRI e a chance é histórica, não promessa. Redação fica fora: o tema não se prevê por frequência.</p>
  </section>;
}
