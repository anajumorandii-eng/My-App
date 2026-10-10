import React, { useId, useState } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { diamondFragment, graphiteFragment } from '../../lib/carbonAllotropy';
import { ScienceObjectDrawing } from './ScienceObjectView';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';

export function CarbonAllotropyView() {
  const [graphite, setGraphite] = useState(false), rotation = useSpatialRotation(25, 25), clock = useMechanismTime(), id = useId();
  const model = graphite ? graphiteFragment(clock.time * 30) : diamondFragment();
  return <section className="vs-science-card" aria-label="Alotropia do carbono tridimensional">
    <header><small>QUÍMICA · MODELO ESPACIAL</small><h4>Mesmo elemento, redes diferentes</h4></header>
    <div className="vs-science-choices" role="group" aria-label="Alótropo do carbono"><button type="button" aria-pressed={!graphite} onClick={() => { clock.seek(0); setGraphite(false); }}>Diamante</button><button type="button" aria-pressed={graphite} onClick={() => { clock.seek(0); setGraphite(true); }}>Grafite</button></div>
    <ScienceObjectDrawing atoms={model.atoms} bonds={model.bonds} yaw={rotation.yaw} pitch={rotation.pitch} interaction={rotation.interaction} description={graphite ? 'Grafite: fragmento de três folhas hexagonais; três vizinhos por carbono no interior de cada folha. Ligações covalentes dentro da folha; interações mais fracas entre folhas.' : 'Diamante: fragmento de rede covalente tridimensional; quatro vizinhos tetraédricos ao redor do carbono central.'} />
    {graphite && <TimeControl clock={clock} label="Deslizamento ilustrativo da camada superior" />}
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar a rede <output>{Math.round(rotation.yaw)}°</output></label><input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label><input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-reading" role="status" aria-label="Leitura da alotropia">{graphite ? 'Carbonos ligados em folhas planas; elétrons deslocalizados permitem condução. O deslizamento mantém as ligações de cada folha.' : 'Cada carbono central tem quatro vizinhos tetraédricos: uma rede rígida se estende nas três dimensões. Diamante não é um conjunto de moléculas isoladas.'}</p>
    <p className="vs-science-caption">Todas as esferas representam carbono; C destaca referências. Fragmentos finitos: a rede continua além das bordas. Arraste ou use setas e Home. Tamanhos e espaçamento entre folhas fora de escala. No grafite, os segmentos indicam conectividade; não representam ligações simples isoladas nem desenham os elétrons deslocalizados. O deslizamento é qualitativo, sem escala de força, energia ou tempo.</p>
  </section>;
}
