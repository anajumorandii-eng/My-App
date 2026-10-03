import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { preparePodcastPlayback } from '../lib/podcastPlayback';
import { Headphones, Sparkles, Play, Square, Loader2, BookOpen, X } from 'lucide-react';
import { requestAiTextStream } from '../lib/aiClient';
import { synthesizePodcastAudio, podcastAudioErrorMessage } from '../lib/podcastAudio';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePodcastEpisodes } from '../hooks/usePodcastEpisodes';
import { usePersonalPodcasts } from '../hooks/usePersonalPodcasts';
import { usePodcastVoices } from '../hooks/usePodcastVoices';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_PODCAST_SETTINGS, PODCAST_FORMATS, resolvePodcastVoices, type PodcastSettings } from '../lib/podcastConfig';
import { splitPodcastScript } from '../lib/podcastChunks';
import { summaryCurriculum } from '../data/summaryCurriculum';
import type { PodcastEpisode } from '../types';
import type { PersonalPodcast } from '../features/podcast/types';
import { PodcastSettingsPanel, PodcastSelect, podcastInputClass } from '../features/podcast/PodcastSettingsPanel';
import { PodcastPlayer, downloadPodcastText } from '../features/podcast/PodcastPlayer';

const topics = summaryCurriculum.flatMap(subject => subject.topics);
const subjects = [...new Set(topics.map(t => t.subject))];

export default function Podcast() {
  const { profile, updateProfile, syncError: profileError, loading: profileLoading, isPersisted: profilePersisted } = useUserProfile();
  const { episodes: catalog, syncError: catalogError } = usePodcastEpisodes();
  const { episodes: personal, saveEpisode, syncError: personalError, pendingCount, hasMore, loading: personalLoading, loadMore, retrySaves } = usePersonalPodcasts();
  const { user } = useAuth();
  const accountRef = useRef(user?.uid); accountRef.current = user?.uid;
  const { voices, loading: voicesLoading, error: voicesError, retry: retryVoices } = usePodcastVoices();
  const savedSettings: PodcastSettings = { ...DEFAULT_PODCAST_SETTINGS, ...(profile.podcastVoiceName ? { voiceName: profile.podcastVoiceName } : {}), ...profile.podcastSettings };
  const settings: PodcastSettings = { ...savedSettings, ...resolvePodcastVoices(savedSettings.voiceName, savedSettings.secondVoice, voices) };
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Biologia');
  const [focus, setFocus] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [libraryQuery, setLibraryQuery] = useState('');
  const [visible, setVisible] = useState(8);
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<PodcastEpisode | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playbackNotice, setPlaybackNotice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cache = useRef(new Map<string, string>());
  const audioTask = useRef(0);
  const generationTask = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const change = <K extends keyof PodcastSettings>(key: K, value: PodcastSettings[K]) => {
    updateProfile(prev => ({ ...prev, podcastSettings: { ...DEFAULT_PODCAST_SETTINGS, ...(prev.podcastVoiceName ? { voiceName: prev.podcastVoiceName } : {}), ...prev.podcastSettings, [key]: value } }), ['podcastSettings']);
  };
  useEffect(() => {
    const urls = cache.current;
    return () => { audioTask.current++; generationTask.current++; controller.current?.abort(); audioRef.current?.pause(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, []);
  useEffect(() => {
    audioTask.current++; generationTask.current++; controller.current?.abort(); audioRef.current?.pause();
    setActive(null); setAudioUrl(null); setPlayingId(null); setLoadingId(null); setGenerating(false); setDraft(''); setError(null);
    setPlaybackNotice(null); setTitle(''); setFocus(''); setSourceText(''); setSelected([]);
    cache.current.forEach(url => URL.revokeObjectURL(url)); cache.current.clear();
  }, [user?.uid]);
  const sourceChoices = useMemo(() => topics.filter(t => t.subject === subject && t.title.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))), [subject, query]);
  const filteredCatalog = catalog.filter(ep => `${ep.title} ${ep.subject}`.toLocaleLowerCase('pt-BR').includes(libraryQuery.toLocaleLowerCase('pt-BR')));
  const preferencesBlocked = Boolean(profileLoading || (user && !profilePersisted));
  const voicesBlocked = voicesLoading || !voices.length || !voices.some(v => v.value === settings.voiceName) || (settings.speakers === 2 && !voices.some(v => v.value === settings.secondVoice));
  const sameVoice = settings.speakers === 2 && settings.voiceName === settings.secondVoice;

  const generate = async () => {
    setPlaybackNotice(null);
    const task = ++generationTask.current;
    const owner = accountRef.current;
    const snapshot = { ...settings };
    const sourceIds = [...selected];
    const inputTitle = title.trim(); const inputFocus = focus.trim(); const inputSubject = subject;
    audioTask.current++; controller.current?.abort(); audioRef.current?.pause(); setLoadingId(null); setProgress(''); setPlayingId(null);
    setGenerating(true); setError(null); setDraft('');
    try {
      const sources: string[] = []; const labels: string[] = [];
      if (sourceIds.length) {
        const { default: chapters } = await import('../data/deepSummaryContent.json');
        for (const id of sourceIds) {
          const topic = topics.find(t => t.id === id)!;
          const chapter = chapters.find(c => c.subject === topic.subject && c.topic === topic.title);
          if (!chapter) throw new Error(`O resumo de ${topic.title} não está disponível como fonte. Você pode remover essa fonte e gerar só com o tema, escolher outro resumo ou, se quiser, colar seu material.`);
          sources.push(`Resumo CRIVO — ${topic.title}\n${chapter.sections.map(s => `${s.title}\n${s.content}`).join('\n\n')}`);
          labels.push(`Resumo CRIVO: ${topic.title}`);
        }
      }
      if (sourceText.trim()) { sources.push(`Material da estudante\n${sourceText.trim()}`); labels.push('Material da estudante'); }
      const material = sources.join('\n\n');
      if (material.length > 12000) throw new Error('Os materiais somam mais de 12.000 caracteres. Selecione menos resumos ou reduza o texto para este episódio.');
      const result = await requestAiTextStream('podcast-script', {
        title: inputTitle, subject: inputSubject, topic: sourceIds.map(id => topics.find(t => t.id === id)?.title).join(', ') || inputTitle,
        ...snapshot, focus: inputFocus, sourceText: material,
      }, delta => { if (task === generationTask.current) setDraft(old => old + delta); });
      if (task !== generationTask.current || owner !== accountRef.current) return;
      splitPodcastScript(result.text, snapshot.speakers === 2);
      const episode: PersonalPodcast = { id: crypto.randomUUID(), topicId: sourceIds[0] ?? 'personalizado', title: inputTitle, subject: inputSubject, durationMinutes: snapshot.durationMinutes, script: result.text, settings: snapshot, createdAt: new Date().toISOString(), sourceLabels: labels, focus: inputFocus };
      saveEpisode(episode);
      if (task === generationTask.current) { setActive(episode); setAudioUrl(null); audioRef.current?.pause(); setPlayingId(null); }
    } catch (e) {
      if (task === generationTask.current) setError(e instanceof Error ? e.message : 'Não foi possível criar o episódio. Tente novamente.');
    } finally { if (task === generationTask.current) { setGenerating(false); setDraft(''); } }
  };

  const play = async (episode: PodcastEpisode | PersonalPodcast) => {
    if (generating) return;
    if (playingId === episode.id) { audioRef.current?.pause(); setPlayingId(null); return; }
    preparePodcastPlayback(audioRef.current);
    setPlaybackNotice(null);
    const task = ++audioTask.current;
    controller.current?.abort(); controller.current = new AbortController();
    audioRef.current?.pause(); setPlayingId(null); setActive(episode); setError(null); setAudioUrl(null); setLoadingId(episode.id); setProgress('Preparando as vozes…');
    const savedConfiguration = 'settings' in episode ? (episode as PersonalPodcast).settings : { ...settings, speakers: 1 as const };
    const configuration = { ...savedConfiguration, ...resolvePodcastVoices(savedConfiguration.voiceName, savedConfiguration.secondVoice, voices) };
    const key = JSON.stringify([episode.id, configuration, episode.script]);
    try {
      let url = cache.current.get(key);
      if (!url) {
        const blob = await synthesizePodcastAudio(episode.script, configuration.voiceName, configuration, { signal: controller.current.signal, onProgress: (done, total) => { if (task === audioTask.current) setProgress(`Gerando áudio: ${done} de ${total} trechos`); } });
        if (task !== audioTask.current) return;
        url = URL.createObjectURL(blob); cache.current.set(key, url);
        if (cache.current.size > 6) { const first = cache.current.entries().next().value!; URL.revokeObjectURL(first[1]); cache.current.delete(first[0]); }
      }
      if (task !== audioTask.current) return;
      // O src precisa estar no DOM antes do play; duas atualizações independentes
      // (React e audio.src) podiam interromper o carregamento da mesma faixa.
      flushSync(() => setAudioUrl(url));
      const audio = audioRef.current;
      if (audio) { preparePodcastPlayback(audio); await audio.play(); if (task === audioTask.current) setPlayingId(episode.id); }
    } catch (e) {
      if (task === audioTask.current) {
        if (e instanceof DOMException && e.name === 'NotAllowedError' && cache.current.has(key)) setPlaybackNotice('Áudio pronto. Toque no play para ouvir.');
        else setError(podcastAudioErrorMessage(e));
      }
    }
    finally { if (task === audioTask.current) { setLoadingId(null); setProgress(''); } }
  };

  const previewVoice = (voice: string) => {
    const preview: PersonalPodcast = { id: `voice-preview-${voice}`, title: `Amostra · ${voices.find(v => v.value === voice)?.label ?? voice}`, subject, topicId: 'amostra', script: 'Se a água atravessa a membrana, por que a célula nem sempre aumenta de tamanho? Vamos entender a osmose com um exemplo, passo a passo.', durationMinutes: 1, settings: { ...settings, speakers: 1, voiceName: voice }, createdAt: new Date().toISOString(), sourceLabels: ['Amostra de voz do CRIVO'], focus: '' };
    void play(preview);
  };

  const rows = (episodes: PodcastEpisode[], legacy = false) => episodes.map(episode => {
    const isLoading = loadingId === episode.id; const isPlaying = playingId === episode.id;
    const saved = 'settings' in episode ? episode as PersonalPodcast : null;
    return <article key={episode.id} className="ni-panel p-4 flex flex-wrap items-center gap-3">
      <button type="button" aria-label={`${isLoading ? 'Carregando áudio do' : isPlaying ? 'Parar' : 'Reproduzir'} episódio ${episode.title}`} disabled={isLoading || generating} onClick={() => play(episode)} className="w-11 h-11 shrink-0 rounded-full bg-[var(--surface2)] flex items-center justify-center border border-[var(--line)]">{isLoading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <Square size={16} /> : <Play size={18} />}</button>
      <div className="flex-1 min-w-[140px]"><h3 className="text-sm font-semibold break-words">{episode.title}</h3><p className="text-xs text-[var(--dim)] mt-1">{episode.subject}{saved ? ` · ${saved.settings.speakers} pessoas · ~${saved.durationMinutes} min · ${PODCAST_FORMATS[saved.settings.format]}` : ' · roteiro de referência'}</p></div>
      {saved && <button type="button" disabled={generating || voicesBlocked || sameVoice} onClick={() => play({ ...saved, settings: { ...saved.settings, voiceName: settings.voiceName, secondVoice: settings.secondVoice } })} className="text-xs border border-[var(--line)] rounded-xl px-3 py-2">Usar vozes do painel</button>}
      {legacy ? <button type="button" disabled={generating} onClick={() => { setTitle(episode.title); setSubject(episode.subject); setSourceText(episode.script.slice(0, 12000)); setSelected([]); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs border border-[var(--line)] rounded-xl px-3 py-2">Personalizar</button> : <button type="button" onClick={() => downloadPodcastText(episode)} className="text-xs border border-[var(--line)] rounded-xl px-3 py-2">Baixar roteiro</button>}
    </article>;
  });

  return <div className="ni-main">
    <div className="ni-route"><span>Biblioteca</span><i /><b>PODCAST CRIVO</b></div>
    <div className="ni-title"><div><h1>Um podcast do seu jeito.</h1><p>Escolha o que estudar, quem explica e como a conversa acontece.</p></div><Headphones size={30} className="text-[var(--primary)] shrink-0" /></div>
    {(error || profileError || personalError || catalogError) && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 mb-4 text-sm text-[var(--text)]">{error || profileError || personalError || catalogError}</div>}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
      <section className="ni-panel p-5 sm:p-6"><fieldset disabled={generating} className="space-y-5 min-w-0"><legend className="flex items-center gap-2 text-base font-semibold mb-4"><BookOpen size={18} /> 1. O que vamos estudar?</legend>
        <label className="block space-y-1.5"><span className="text-xs font-medium text-[var(--dim)]">Título do episódio</span><input className={podcastInputClass} value={title} maxLength={300} onChange={e => setTitle(e.target.value)} placeholder="Ex.: Osmose sem decorar fórmulas" /></label>
        <PodcastSelect label="Matéria do episódio" value={subject} choices={Object.fromEntries(subjects.map(v => [v, v]))} onChange={setSubject} />
        <div className="space-y-2"><label className="block space-y-1.5"><span className="text-xs font-medium text-[var(--dim)]">Buscar nos resumos do CRIVO (opcional)</span><input className={podcastInputClass} value={query} onChange={e => setQuery(e.target.value)} placeholder="Busque um capítulo…" /></label><select aria-label="Adicionar resumo como fonte (opcional)" className={podcastInputClass} value="" disabled={selected.length >= 3} onChange={e => { const id = e.target.value; if (!id || selected.includes(id)) return; setSelected(old => [...old, id]); if (!title.trim()) setTitle(topics.find(t => t.id === id)?.title ?? ''); }}><option value="">Se quiser, adicione até 3 resumos</option>{sourceChoices.filter(t => !selected.includes(t.id)).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>{selected.map(id => <div key={id} className="flex justify-between items-center gap-2 rounded-xl bg-[var(--surface2)] p-2.5 text-xs"><span>{topics.find(t => t.id === id)?.title}</span><button type="button" aria-label={`Remover fonte ${topics.find(t => t.id === id)?.title}`} onClick={() => setSelected(old => old.filter(v => v !== id))}><X size={16} /></button></div>)}</div>
        <label className="block space-y-1.5"><span className="text-xs font-medium text-[var(--dim)]">Seu material de estudo (opcional)</span><textarea aria-label="Seu material de estudo (opcional)" rows={5} className={podcastInputClass} value={sourceText} maxLength={12000} onChange={e => setSourceText(e.target.value)} placeholder="Se quiser, cole suas anotações ou um trecho do material para orientar o episódio." /><span className="block text-[11px] text-[var(--dim)]">{sourceText.length.toLocaleString('pt-BR')} / 12.000 caracteres · limite total com os resumos selecionados</span></label>
        <label className="block space-y-1.5"><span className="text-xs font-medium text-[var(--dim)]">O que você quer aprender? (opcional)</span><textarea rows={3} className={podcastInputClass} value={focus} maxLength={2000} onChange={e => setFocus(e.target.value)} placeholder="Ex.: Compare osmose e difusão, explique com exemplos e me faça perguntas no final." /></label>
        {!selected.length && !sourceText.trim() && <p className="text-xs text-[var(--dim)]">Você pode gerar o episódio só com o tema. Resumos e materiais são opcionais; se quiser, use-os para direcionar a explicação.</p>}
      </fieldset></section>
      <section className="ni-panel p-5 sm:p-6"><fieldset disabled={generating || preferencesBlocked} className="min-w-0"><legend className="text-base font-semibold mb-5">2. Monte sua experiência</legend><PodcastSettingsPanel settings={settings} change={change} voiceOptions={voices} onPreview={previewVoice} previewLoading={Boolean(loadingId)} /></fieldset>
        {preferencesBlocked && <p className="text-xs text-[var(--dim)] mt-4">{profileLoading ? 'Carregando suas preferências…' : 'As preferências precisam ser carregadas antes de criar o episódio. Reabra a aba para tentar novamente.'}</p>}
        {voicesLoading && <p role="status" className="text-xs text-[var(--dim)] mt-4">Consultando vozes em português…</p>}
        {voicesError && <p role="alert" className="text-xs mt-4">{voicesError} <button type="button" onClick={retryVoices} className="underline">Tentar consultar novamente</button></p>}
        {!user && !voices.length && <p className="text-xs text-[var(--dim)] mt-4">Conecte sua conta para consultar e experimentar as vozes disponíveis.</p>}
        {sameVoice && <p className="text-sm text-rose-500 mt-4">Escolha vozes diferentes para as duas pessoas.</p>}
        <button type="button" disabled={generating || preferencesBlocked || voicesBlocked || !title.trim() || sameVoice} onClick={generate} className="w-full flex justify-center items-center gap-2 mt-6 rounded-xl bg-[var(--primary)] text-[var(--ink-on-primary)] px-4 py-3.5 font-semibold text-sm disabled:opacity-50">{generating ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}{generating ? 'Criando seu roteiro…' : 'Gerar meu podcast'}</button>
        <p className="text-xs text-[var(--dim)] mt-3">Primeiro criamos o roteiro; ao reproduzir, geramos o áudio com as vozes escolhidas. Suas preferências ficam no perfil quando você está conectada.</p>
      </section>
    </div>
    {generating && <section role="status" className="ni-panel p-5 mb-5"><h2 className="text-sm font-semibold mb-3">Construindo sua explicação…</h2><p className="text-xs text-[var(--dim)] mb-3">Este é um rascunho. A reprodução fica disponível quando o roteiro estiver completo.</p><p className="text-sm whitespace-pre-wrap leading-6 max-h-52 overflow-y-auto">{draft || 'Organizando os conceitos e as fontes.'}</p></section>}
    {loadingId && <div role="status" className="ni-panel p-4 mb-4 flex items-center gap-3 text-sm"><Loader2 size={18} className="animate-spin shrink-0" /><span className="flex-1">{progress}</span><button type="button" onClick={() => { audioTask.current++; controller.current?.abort(); setLoadingId(null); setProgress(''); }} className="underline">Cancelar</button></div>}
    {playbackNotice && <p role="status" className="ni-panel p-4 mb-4 text-sm">{playbackNotice}</p>}
    <PodcastPlayer episode={active} audioUrl={audioUrl} audioRef={audioRef} audioLoading={Boolean(loadingId && loadingId === active?.id)} requestDisabled={generating} onRequestAudio={() => { if (active) void play(active); }} onEnded={() => setPlayingId(null)} onPlay={() => { setPlaybackNotice(null); setPlayingId(active?.id ?? null); }} onPause={() => setPlayingId(null)} onError={() => { setPlayingId(null); setError('O navegador não conseguiu reproduzir o áudio. Tente novamente.'); }} />
    <section className="mb-7">{pendingCount > 0 && <p role="status" className="text-xs text-[var(--dim)] mb-3">{pendingCount} episódio(s) aguardando sincronização. Você já pode ouvir ou baixar o roteiro.</p>}{personalError && <button type="button" onClick={retrySaves} className="text-sm underline mb-3">Tentar salvar novamente</button>}<h2 className="text-lg font-semibold mb-2">Seus podcasts</h2><p className="text-xs text-[var(--dim)] mb-4">{user ? 'Roteiros e configurações salvos na sua conta.' : 'Conecte sua conta para gerar e guardar seus episódios.'} O áudio pode ser baixado após gerar.</p>{personal.length ? <div className="space-y-3">{rows(personal)}</div> : <div className="rounded-xl border border-dashed border-[var(--line)] p-6 text-sm text-[var(--dim)]">Escolha um tema e crie seu primeiro episódio acima para ouvir aqui.</div>}{hasMore && <button type="button" disabled={personalLoading} onClick={loadMore} className="w-full mt-3 border border-[var(--line)] rounded-xl p-3 text-sm disabled:opacity-50">{personalLoading ? 'Carregando…' : 'Carregar podcasts anteriores'}</button>}</section>
    <section><h2 className="text-lg font-semibold mb-2">Ideias da biblioteca</h2><p className="text-xs text-[var(--dim)] mb-4">Use um roteiro de referência como ponto de partida e personalize a explicação.</p><label className="block mb-4"><span className="sr-only">Buscar na biblioteca de podcasts</span><input className={podcastInputClass} value={libraryQuery} onChange={e => { setLibraryQuery(e.target.value); setVisible(8); }} placeholder="Busque tema ou matéria…" /></label><div className="space-y-3">{rows(filteredCatalog.slice(0, visible), true)}</div>{!filteredCatalog.length && <p className="text-sm text-[var(--dim)]">Nenhum roteiro encontrado.</p>}{filteredCatalog.length > visible && <button type="button" onClick={() => setVisible(n => n + 8)} className="w-full mt-3 border border-[var(--line)] rounded-xl p-3 text-sm">Mostrar mais roteiros</button>}</section>
  </div>;
}
