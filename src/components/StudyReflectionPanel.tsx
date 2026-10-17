import { metacognitivePrompts } from '../data/metacognitiveStudy';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { readReflection, readReflectionVoice, reflectionKey, saveReflection, saveReflectionVoice, type LearningReflection } from '../lib/learningReflection';

export function StudyReflectionPanel({ topicId, topicName, subject }: { topicId: string; topicName: string; subject?: string }) {
  const { user } = useAuth();
  return <Reflection key={`${user?.uid ?? 'guest'}:${topicId}`} uid={user?.uid ?? null} topicId={topicId} topicName={topicName} subject={subject} />;
}
function Reflection({ uid, topicId, topicName, subject }: { uid: string | null; topicId: string; topicName: string; subject?: string }) {
  const [note, setNote] = useState(() => readReflection(uid, topicId));
  const [message, setMessage] = useState('');
  const [audioMessage, setAudioMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [openingMic, setOpeningMic] = useState(false);
  const [audioPhase, setAudioPhase] = useState('before');
  const [audioType, setAudioType] = useState('audio/webm');
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const alive = useRef(true);
  const audioRevision = useRef(0);
  const url = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = `${reflectionKey(uid, topicId)}:voice:${audioPhase}`;
  const showBlob = (blob: Blob) => {
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = URL.createObjectURL(blob); setAudioUrl(url.current); setAudioType(blob.type);
  };
  useEffect(() => {
    alive.current = true;
    setAudioUrl(null); setAudioMessage('');
    audioRevision.current++;
    const revision = audioRevision.current;
    void readReflectionVoice(key).then(blob => { if (alive.current && audioRevision.current === revision && blob) { showBlob(blob); setAudioMessage('Áudio recuperado deste navegador.'); } }).catch(() => { if (alive.current) setAudioMessage('Não foi possível recuperar uma gravação anterior neste navegador.'); });
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
      if (recorder.current?.state === 'recording') recorder.current.stop();
      stream.current?.getTracks().forEach(track => track.stop());
      if (url.current) URL.revokeObjectURL(url.current);
    };
  }, [key]);
  const change = (field: keyof LearningReflection, value: string) => {
    const next = { ...note, [field]: value }; setNote(next);
    try { saveReflection(uid, topicId, next); setMessage('Registro salvo neste navegador.'); }
    catch { setMessage('Não foi possível guardar o texto. Copie sua reflexão antes de sair.'); }
  };
  const start = async () => {
    if (openingMic || recording) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setAudioMessage('Este navegador não oferece gravação. Você pode registrar sua lembrança em texto.'); return; }
    const revision = ++audioRevision.current;
    setOpeningMic(true); setAudioMessage('');
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media;
      const capture = new MediaRecorder(media); recorder.current = capture;
      const chunks: Blob[] = [];
      capture.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      capture.onstop = () => {
        media.getTracks().forEach(track => track.stop());
        if (timer.current) clearTimeout(timer.current);
        if (!alive.current) return;
        setRecording(false);
        const blob = new Blob(chunks, { type: capture.mimeType || 'audio/webm' });
        if (!blob.size) { setAudioMessage('A gravação ficou vazia. Tente novamente.'); return; }
        showBlob(blob); setAudioMessage('Gravação pronta. Guardando neste navegador…');
        void saveReflectionVoice(key, blob).then(() => { if (alive.current && audioRevision.current === revision) setAudioMessage('Gravação salva neste navegador.'); }).catch(() => { if (alive.current && audioRevision.current === revision) setAudioMessage('Não foi possível guardar a gravação. Você pode ouvir e baixar o áudio antes de sair.'); });
      };
      capture.onerror = () => { media.getTracks().forEach(track => track.stop()); if (alive.current) { setRecording(false); setAudioMessage('A gravação foi interrompida. Tente novamente.'); } };
      capture.start(); setRecording(true);
      timer.current = setTimeout(() => { if (capture.state === 'recording') capture.stop(); }, 180000);
    } catch { stream.current?.getTracks().forEach(track => track.stop()); if (alive.current) setAudioMessage('Não foi possível acessar o microfone. Verifique a permissão ou use o registro em texto.'); }
    finally { if (alive.current) setOpeningMic(false); }
  };
  const fields: [keyof LearningReflection, string, string][] = [
    ['before', 'Antes de consultar: o que consigo explicar?', 'Fale ou escreva o que lembra, como chegou a essas ideias e onde tem dúvida. Não procure a resposta ainda.'],
    ['reasoning', 'Como construí meu raciocínio?', 'Qual foi o primeiro passo? Por que ele fazia sentido? Que alternativa considerei? Em que condição eu mudaria de estratégia?'],
    ['after', 'Depois do estudo: o que mudou na minha explicação?', 'Compare com seu registro inicial. Qual relação faltava? Que fonte ou exemplo mudou sua hipótese? O que ainda não consegue justificar?'],
    ['next', 'Como vou verificar se compreendi?', 'Explique a alguém, crie um contraexemplo, reconstrua um mecanismo ou resolva outra situação justificando as decisões. Diga o que observará para conferir.'],
  ];
  return <section className="ni-panel p-4 space-y-4" aria-label={`Como estou aprendendo ${topicName}`}>
    <h3 className="font-display text-xl">Entender como você está entendendo</h3>
    <p className="text-sm leading-relaxed">Antes de estudar {topicName}, recupere o que sabe sem consultar. O objetivo é tornar visíveis suas relações, dúvidas e decisões. Depois, confronte sua explicação com as fontes e volte para reescrevê-la.</p>
    {subject && metacognitivePrompts[subject] && <ul className="list-disc pl-5 space-y-2 text-sm" aria-label={`Perguntas para pensar em ${subject}`}>{metacognitivePrompts[subject].map(prompt => <li key={prompt}>{prompt}</li>)}</ul>}
    <div className="space-y-2"><label className="block text-sm">Momento da gravação<select className="field block w-full" value={audioPhase} disabled={recording || openingMic} onChange={event => setAudioPhase(event.target.value)}><option value="before">Antes: o que lembro sem consultar</option><option value="reasoning">Durante: como estou raciocinando</option><option value="after">Depois: o que mudou na explicação</option></select></label><button type="button" className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm" disabled={openingMic} aria-pressed={recording} onClick={() => recording ? recorder.current?.stop() : void start()}>{openingMic ? 'Abrindo microfone…' : recording ? 'Encerrar gravação' : audioUrl ? 'Regravar (substitui o áudio deste momento)' : audioPhase === 'before' ? 'Gravar o que lembro antes de estudar' : 'Gravar minha explicação deste momento'}</button><p className="text-xs text-[var(--dim)]">Até 3 minutos. O microfone só é acessado ao gravar. O áudio fica neste navegador, separado por conta e tópico. Ele não é enviado automaticamente nem transcrito pela IA; registre em texto os pontos que quiser usar na explicação gerada.</p>{audioMessage && <p role="status" className="text-xs">{audioMessage}</p>}{audioUrl && <><audio controls src={audioUrl} aria-label={`Minha lembrança em áudio de ${topicName}`} className="w-full" /><a href={audioUrl} download={`lembranca-${topicId}-${audioPhase}.${audioType.includes('mp4') ? 'm4a' : 'webm'}`} className="text-sm underline">Baixar minha gravação</a></>}</div>
    {fields.map(([field, label, prompt]) => <label key={field} className="block space-y-2 text-sm"><span className="font-semibold">{label}</span><span className="block text-xs text-[var(--dim)]">{prompt}</span><textarea aria-label={`${label} — ${topicName}`} value={note[field]} onChange={event => change(field, event.target.value)} maxLength={5000} rows={3} className="field w-full" /></label>)}
    {message && <p role="status" className="text-xs">{message}</p>}
    <p className="text-xs text-[var(--dim)]">O registro é uma reflexão, não uma nota de domínio. Ao gerar um guia ou podcast deste tópico, os pontos escritos ajudam a orientar perguntas e explicações. Gravar ou escrever, por si só, não conclui uma revisão.</p>
  </section>;
}
