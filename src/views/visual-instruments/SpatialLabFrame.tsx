import React, { useEffect, useId, useRef, useState } from 'react';
import { animate, motion } from 'motion/react';
import { Palette, RotateCcw, RotateCw } from 'lucide-react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { readReducedMotionPreference, useLiveReducedMotion } from '../../hooks/useLiveReducedMotion';
import { CORES_DA_CENA, PreferenciasCenaContext, usePreferenciasCena } from '../../hooks/usePreferenciasCena';
import './ScienceObjectView.css';
import './Palco3D.css';

export interface SpatialObservationField { id: string; label: string; value: string; }

function ObservationFields({ fields, label, reference = [] }: {
  fields: readonly SpatialObservationField[]; label: string; reference?: readonly SpatialObservationField[];
}) {
  if (!fields.length) return null;
  return <dl className="vs-spatial-state-fields" aria-label={label}>
    {fields.map(field => {
      const saved = reference.find(item => item.id === field.id);
      const changed = reference.length > 0 && (!saved || saved.label !== field.label || saved.value !== field.value);
      return <div key={field.id} data-changed={changed || undefined}>
        <dt>{field.label}</dt><dd><span>{field.value}</span>{changed && <small>Alterado</small>}</dd>
      </div>;
    })}
  </dl>;
}

export type SpatialCamera = ReturnType<typeof useSpatialRotation>;

const YAW_INICIAL = 25, PITCH_INICIAL = 20;

/**
 * O palco: a cena 3D é a experiência do capítulo, não um anexo dela.
 *
 * Esta moldura era um cartão "Exploração espacial" pendurado abaixo de um
 * esquema plano, com o modelo num terço da largura e, ao lado, uma coluna de
 * controles de câmera sempre aberta. Somado ao esquema, aos cartões e ao mapa,
 * o capítulo tinha de cinco a nove telas e várias leituras concorrentes do
 * mesmo assunto — a Ana Júlia resumiu como "uma divisão com tantas
 * interpretações que atrapalham mais do que ajudam". Agora o modelo ocupa a
 * largura inteira, entra em movimento, e o que não é a cena (paleta, etiquetas,
 * piso, giro, ângulo) fica recolhido em "Personalizar cena".
 *
 * A câmera continua independente dos parâmetros físicos e da evidência
 * pedagógica: girar, recolorir ou esconder etiquetas não altera leitura alguma.
 */
export function SpatialLabFrame({ title, reading, note, children, controls, observation = [] }: {
  title: string; reading: string; note: string;
  children: (camera: SpatialCamera) => React.ReactNode; controls?: React.ReactNode;
  observation?: readonly SpatialObservationField[];
}) {
  const camera = useSpatialRotation(YAW_INICIAL, PITCH_INICIAL), id = useId();
  const [preferencias, mudar] = usePreferenciasCena();
  const [personalizando, setPersonalizando] = useState(false);
  const reduced = useLiveReducedMotion();
  const compareButton = useRef<HTMLButtonElement>(null);
  const [reference, setReference] = useState<{
    reading: string; figure: React.ReactNode; fields: SpatialObservationField[]; yaw: number; pitch: number;
  } | null>(null);

  // Movimento da câmera que o palco inicia sozinho: a chegada e a órbita. Os
  // dois param no primeiro toque — quem pega a cena manda nela — e não
  // recomeçam por conta própria. `setYaw` fica numa ref porque o objeto da
  // câmera é recriado a cada quadro e reiniciaria o efeito.
  const setYaw = useRef(camera.setYaw); setYaw.current = camera.setYaw;
  const automatico = useRef<{ stop: () => void } | null>(null);
  const [tocada, setTocada] = useState(false);
  const pararAutomatico = () => { automatico.current?.stop(); automatico.current = null; };
  useEffect(() => {
    if (reduced || tocada || readReducedMotionPreference()) return;
    // Chegada: a cena assenta vindo de um quarto de volta, e é esse giro que
    // mostra, sem instrução, que o objeto tem volume e pode ser girado.
    const chegada = animate(YAW_INICIAL - 70, YAW_INICIAL, {
      duration: 1.5, ease: [0.22, 1, 0.36, 1],
      onUpdate: value => setYaw.current((value % 360 + 360) % 360),
      onComplete: () => {
        if (!preferencias.giro) { automatico.current = null; return; }
        automatico.current = animate(YAW_INICIAL, YAW_INICIAL + 360, {
          duration: 48, ease: 'linear', repeat: Infinity,
          onUpdate: value => setYaw.current(value % 360),
        });
      },
    });
    automatico.current = chegada;
    const oculta = () => { if (document.visibilityState === 'hidden') pararAutomatico(); };
    document.addEventListener('visibilitychange', oculta);
    return () => { document.removeEventListener('visibilitychange', oculta); pararAutomatico(); };
  }, [reduced, tocada, preferencias.giro]);
  const tocar = () => { pararAutomatico(); setTocada(true); };

  const changedFields = reference ? observation.filter(field => {
    const saved = reference.fields.find(item => item.id === field.id);
    return !saved || saved.value !== field.value || saved.label !== field.label;
  }) : [];
  const sameReading = reference?.reading === reading;
  const changedView = reference && ((reference.yaw % 360) !== (camera.yaw % 360) || reference.pitch !== camera.pitch);
  return <PreferenciasCenaContext.Provider value={preferencias}>
  <section className="vs-science-card vs-field-spatial vs-spatial-lab vs-palco" data-palco-cor={preferencias.cor} data-spatial-batch="2026-10-10" aria-label={title}>
    <header className="vs-palco-topo">
      <h3>{title}</h3>
      <div className="vs-palco-acoes">
        <button type="button" aria-pressed={camera.spinning} onClick={() => { tocar(); camera.toggleSpin(); }}>
          <RotateCw aria-hidden="true" /><span>{camera.spinning ? 'Pausar giro' : 'Girar o modelo'}</span>
        </button>
        <button type="button" onClick={() => { tocar(); camera.reset(); }}><RotateCcw aria-hidden="true" /><span>Restaurar vista</span></button>
        <button type="button" aria-expanded={personalizando} aria-controls={id + '-personalizar'} onClick={() => setPersonalizando(aberto => !aberto)}>
          <Palette aria-hidden="true" /><span>Personalizar cena</span>
        </button>
      </div>
    </header>
    {personalizando && <section id={id + '-personalizar'} className="vs-palco-personalizar" aria-label="Personalizar cena">
      <fieldset>
        <legend>Cores do modelo</legend>
        <div className="vs-palco-cores">
          {CORES_DA_CENA.map(cor => <label key={cor.id} data-cor={cor.id}>
            <input type="radio" name={id + '-cor'} checked={preferencias.cor === cor.id} onChange={() => mudar({ cor: cor.id })} />
            <span aria-hidden="true"><i /><i /></span>{cor.nome}
          </label>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>O que aparece</legend>
        <label className="vs-palco-chave"><input type="checkbox" checked={preferencias.rotulos} onChange={event => mudar({ rotulos: event.target.checked })} />Etiquetas</label>
        <label className="vs-palco-chave"><input type="checkbox" checked={preferencias.piso} onChange={event => mudar({ piso: event.target.checked })} />Piso em grade</label>
        <label className="vs-palco-chave"><input type="checkbox" checked={preferencias.giro} onChange={event => { setTocada(false); mudar({ giro: event.target.checked }); }} />Giro contínuo</label>
      </fieldset>
      <fieldset>
        <legend>Ponto de vista</legend>
        <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar a vista <output>{Math.round(camera.yaw)}°</output></label>
        <input id={id + '-yaw'} type="range" min="0" max="360" value={camera.yaw} onChange={e => { tocar(); camera.setYaw(Number(e.target.value)); }} />
        <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(camera.pitch)}°</output></label>
        <input id={id + '-pitch'} type="range" min="-50" max="65" value={camera.pitch} onChange={e => { tocar(); camera.setPitch(Number(e.target.value)); }} />
      </fieldset>
      <p className="vs-science-caption">As escolhas valem para todas as cenas neste aparelho. Mudar cor, etiquetas ou ângulo não altera os valores do conteúdo.</p>
    </section>}
    <motion.div className="vs-palco-cena" onPointerDownCapture={tocar} onKeyDownCapture={tocar}
      initial={reduced ? false : { opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {children(camera)}
    </motion.div>
    <p className="vs-science-reading" role="status" aria-label="Leitura do modelo espacial">{reading}</p>
    <section className="vs-spatial-observation vs-palco-controles" aria-label="Manipular e observar">
      {controls}
      <div className="vs-science-choices vs-palco-comparar">
        <button ref={compareButton} type="button" onClick={() => setReference({ reading, figure: children(camera), fields: observation.map(field => ({ ...field })), yaw: camera.yaw, pitch: camera.pitch })}>{reference ? 'Atualizar referência' : 'Guardar para comparar'}</button>
        {reference && <button type="button" onClick={() => { setReference(null); compareButton.current?.focus(); }}>Limpar comparação</button>}
      </div>
      <span className="sr-only" role="status" aria-label="Estado da comparação">{reference ? 'Referência guardada. Altere uma condição e compare os estados.' : 'Nenhuma referência guardada.'}</span>
    </section>
    {reference && <section className="vs-spatial-comparison" aria-label="Comparação de estados">
      <header><h4>Compare com a referência</h4><p>Altere uma condição no modelo acima. O que mudou? O que permaneceu?</p></header>
      <div className="vs-spatial-reference-figure" inert aria-hidden="true">{reference.figure}</div>
      <div className="vs-spatial-comparison-readings">
        <div><strong>Estado guardado</strong><ObservationFields fields={reference.fields} label="Condições guardadas" /><p>{reference.reading}</p></div>
        <div><strong>Estado atual</strong><ObservationFields fields={observation} reference={reference.fields} label="Condições atuais" /><p>{reading}</p></div>
        <p className="vs-spatial-comparison-guide">
          {changedFields.length > 0 ? <>
            <strong>Controles alterados: {changedFields.map(field => field.label).join(' · ')}.</strong>{' '}
            {sameReading ? 'A leitura permanece igual neste recorte. Compare a figura para explicar o que se conserva.' : 'Compare as duas leituras e a figura para explicar o efeito da alteração.'}
          </> : observation.length > 0 && sameReading && changedView ?
            'Somente o ponto de vista foi ajustado. As condições registradas e a leitura permanecem iguais.' :
            sameReading ? 'Guarde um estado e altere uma condição do conteúdo. Use os dois estados para explicar mudanças e permanências.' :
              'A leitura mudou. Compare os estados para explicar a diferença.'}
        </p>
      </div>
    </section>}
    <p className="vs-science-caption vs-spatial-note">Arraste a cena para girar; com ela em foco, use as setas e Home. {note}</p>
  </section>
  </PreferenciasCenaContext.Provider>;
}
