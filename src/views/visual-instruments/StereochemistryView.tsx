import React, { useId, useState } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { stereochemistryModel, type StereoCase } from '../../lib/stereochemistry';
import { ScienceObjectDrawing } from './ScienceObjectView';

export function StereochemistryView() {
  const [kind, setKind] = useState<StereoCase>('cis');
  const rotation = useSpatialRotation();
  const id = useId();
  const model = stereochemistryModel(kind);
  const optical = kind === 'original' || kind === 'mirror';
  return <section className="vs-science-card" aria-label="Estereoquímica tridimensional manipulável">
    <header><small>ISOMERIA · MODELOS ESPACIAIS</small><h4>Gire a vista, compare as configurações</h4></header>
    <div className="vs-science-choices" role="group" aria-label="Configuração espacial">
      {([['cis', 'cis-but-2-eno'], ['trans', 'trans-but-2-eno'], ['original', 'Carbono quiral'], ['mirror', 'Imagem especular']] as const).map(([value, label]) =>
        <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)}>{label}</button>)}
    </div>
    <ScienceObjectDrawing atoms={model.atoms} bonds={model.bonds} description={model.description} yaw={rotation.yaw} pitch={rotation.pitch} interaction={rotation.interaction} />
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar o modelo <output>{Math.round(rotation.yaw)}°</output></label>
    <input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label>
    <input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-reading" role="status" aria-label="Leitura estereoquímica">{optical
      ? 'Quatro substituintes diferentes: as duas imagens especulares não se sobrepõem por rotação. A troca de modelo representa reflexão, não uma reação nem rotação da molécula.'
      : `Os grupos CH₃ ficam ${kind === 'cis' ? 'do mesmo lado' : 'em lados opostos'} da dupla. Girar a vista conserva ${kind}; a dupla não tem rotação livre.`}</p>
    <p className="vs-science-caption">Arraste para girar e inclinar; com o desenho em foco, use as setas e Home. Esferas, distâncias e tamanhos são esquemáticos. {optical ? 'H, F, Cl e Br são substituintes do exemplo; não se atribui sinal de rotação óptica.' : 'Cada esfera CH₃ abrevia um grupo metila; os dois carbonos da dupla e seus substituintes estão no mesmo plano.'}</p>
  </section>;
}
