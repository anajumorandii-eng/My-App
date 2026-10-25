import type { Topic } from '../types';

export interface AdditionalStudyTopic { topicId: string; chapter: string }

export function AdditionalStudyTopics({ subject, topics, primaryId, value, onChange, kind, disabled = false }: {
  subject: string; topics: Topic[]; primaryId: string; value: AdditionalStudyTopic[];
  onChange: (value: AdditionalStudyTopic[]) => void; kind: 'review' | 'deepening'; disabled?: boolean;
}) {
  return <details className="space-y-3">
    <summary className="cursor-pointer text-sm font-semibold">Combinar mais tópicos de {subject} {kind === 'review' ? 'na mesma revisão' : 'no mesmo aprofundamento'}</summary>
    <p className="text-xs text-[var(--dim)]">Escolha até quatro tópicos no total. Cada tópico pode usar a visão geral ou um capítulo; o material deve explicar as conexões e os limites das fontes.</p>
    <fieldset disabled={disabled} className="space-y-3"><legend className="text-sm">Outros tópicos da mesma matéria</legend>{topics.filter(item => item.id !== primaryId).map(item => {
      const selected = value.find(selection => selection.topicId === item.id);
      return <div key={item.id} className="space-y-2">
        <label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={!!selected} disabled={!selected && value.length >= 3} onChange={event => onChange(event.target.checked ? [...value, { topicId: item.id, chapter: '' }].slice(0, 3) : value.filter(selection => selection.topicId !== item.id))} />{item.name}</label>
        {selected && <label className="block text-sm">Capítulo de {item.name}<select className="field block w-full mt-1" value={selected.chapter} onChange={event => onChange(value.map(selection => selection.topicId === item.id ? { ...selection, chapter: event.target.value } : selection))}><option value="">Visão geral do tópico</option>{item.chapters?.map(name => <option key={name}>{name}</option>)}</select></label>}
      </div>;
    })}</fieldset>
  </details>;
}
