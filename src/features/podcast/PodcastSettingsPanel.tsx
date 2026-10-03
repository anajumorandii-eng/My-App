import React from 'react';
import { Clock, Mic, Users } from 'lucide-react';
import { PODCAST_FORMATS, PODCAST_LEVELS, PODCAST_PACES, PODCAST_TONES, PODCAST_HOST_STYLES, type PodcastVoiceOption, type PodcastSettings } from '../../lib/podcastConfig';
export const podcastInputClass = 'w-full min-w-0 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]';
export function PodcastSelect({ label, value, choices, onChange }: { label: string; value: string; choices: Record<string, string>; onChange: (value: string) => void }) {
  return <label className="block min-w-0 space-y-1.5"><span className="text-xs font-medium text-[var(--dim)]">{label}</span><select aria-label={label} className={podcastInputClass} value={value} onChange={e => onChange(e.target.value)}>{Object.entries(choices).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label>;
}
export function PodcastSettingsPanel({ settings, change, voiceOptions, onPreview, previewLoading }: { settings: PodcastSettings; voiceOptions: PodcastVoiceOption[]; onPreview: (voice: string) => void; previewLoading: boolean; change: <K extends keyof PodcastSettings>(key: K, value: PodcastSettings[K]) => void }) {
  const voices = Object.fromEntries(voiceOptions.map(v => [v.value, v.label]));
  const voiceChoices = (value: string) => voices[value] ? voices : { ...voices, [value]: voiceOptions.length ? 'Voz indisponível · escolha outra' : 'Aguardando catálogo de vozes' };
  return <div className="space-y-5">
    <div><h3 className="flex items-center gap-2 text-sm font-semibold mb-3"><Users size={16} /> Quem conversa com você?</h3><div className="grid grid-cols-2 gap-2">{([1, 2] as const).map(n => <button type="button" key={n} aria-pressed={settings.speakers === n} onClick={() => change('speakers', n)} className={`rounded-xl border px-3 py-3 text-sm transition-colors ${settings.speakers === n ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--line)] bg-[var(--surface)]'}`}>{n === 1 ? 'Uma pessoa' : 'Duas pessoas'}</button>)}</div></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PodcastSelect label="Voz da pessoa 1" value={settings.voiceName} choices={voiceChoices(settings.voiceName)} onChange={v => change('voiceName', v)} />
      <PodcastSelect label="Papel da pessoa 1" value={settings.hostStyle} choices={PODCAST_HOST_STYLES} onChange={v => change('hostStyle', v as PodcastSettings['hostStyle'])} />
      {settings.speakers === 2 && <><PodcastSelect label="Voz da pessoa 2" value={settings.secondVoice} choices={voiceChoices(settings.secondVoice)} onChange={v => change('secondVoice', v)} /><PodcastSelect label="Papel da pessoa 2" value={settings.cohostStyle} choices={PODCAST_HOST_STYLES} onChange={v => change('cohostStyle', v as PodcastSettings['cohostStyle'])} /></>}
    </div>
    <div className="flex flex-wrap gap-2">{([1, 2] as const).filter(n => n <= settings.speakers).map(n => { const voice = n === 1 ? settings.voiceName : settings.secondVoice; return <button type="button" key={n} disabled={previewLoading || !voices[voice]} onClick={() => onPreview(voice)} className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs disabled:opacity-50">Ouvir voz da pessoa {n}</button>; })}</div>
    <p className="text-xs text-[var(--dim)]">O tom orienta o roteiro. Ouça uma amostra para escolher a entonação que prefere.</p>
    <div className="rounded-xl bg-[var(--surface2)] p-4"><label className="block"><span className="flex items-center justify-between text-sm mb-3"><span className="flex items-center gap-2"><Clock size={16} /> Duração aproximada</span><strong>{settings.durationMinutes} min</strong></span><input aria-label="Duração aproximada em minutos" type="range" min={2} max={15} step={1} value={settings.durationMinutes} onChange={e => change('durationMinutes', Number(e.target.value))} className="w-full accent-[var(--primary)]" /></label><div className="flex justify-between text-[11px] text-[var(--dim)] mt-1"><span>2 min · essencial</span><span>15 min · aprofundado</span></div><p className="text-xs text-[var(--dim)] mt-3">A duração ajusta a extensão do roteiro. O tempo final varia com as vozes e as pausas.</p></div>
    <h3 className="flex items-center gap-2 text-sm font-semibold"><Mic size={16} /> Como você aprende melhor?</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PodcastSelect label="Formato do episódio" value={settings.format} choices={PODCAST_FORMATS} onChange={v => change('format', v as PodcastSettings['format'])} />
      <PodcastSelect label="Seu conhecimento no tema" value={settings.level} choices={PODCAST_LEVELS} onChange={v => change('level', v as PodcastSettings['level'])} />
      <PodcastSelect label="Ritmo da explicação" value={settings.pace} choices={PODCAST_PACES} onChange={v => change('pace', v as PodcastSettings['pace'])} />
      <PodcastSelect label="Tom da conversa" value={settings.tone} choices={PODCAST_TONES} onChange={v => change('tone', v as PodcastSettings['tone'])} />
      <PodcastSelect label="Foco de vestibular" value={settings.exam} choices={Object.fromEntries(['Geral', 'Fuvest', 'Unicamp', 'Unesp', 'Famerp', 'Unifesp', 'ENEM'].map(v => [v, v]))} onChange={v => change('exam', v)} />
    </div>
  </div>;
}
