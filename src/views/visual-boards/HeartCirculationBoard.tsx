import BoardShell from './BoardShell';
import HeartMechanism from './HeartMechanism';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import './HeartCirculationBoard.css';

function HeartScene() {
  return (
    <figure className="vs-heart-scene">
      <div className="vs-heart-art">
        <img src="/visual-assets/heart-circulation-atlas.webp" alt="Coração humano em corte: cavidades direitas em azul e esquerdas em vermelho, com aorta, veias cavas e vasos pulmonares" />
      </div>
      <figcaption>
        <span><i className="vs-heart-dot vs-heart-dot--blue" /> pouco O₂ · lado direito</span>
        <span><i className="vs-heart-dot vs-heart-dot--red" /> muito O₂ · lado esquerdo</span>
      </figcaption>
      <p className="vs-heart-orientation">O lado direito do coração aparece à esquerda da imagem.</p>
    </figure>
  );
}

export default function HeartCirculationBoard(props: BoardProps) {
  const pair = boardPair(props);
  return (
    <div className="vs-heart-board">
      <BoardShell
        title="O caminho do sangue"
        subtitle="Duas passagens pelo coração, com trajetos separados para pulmões e corpo."
        condition={{ label: 'circuitos', value: '2' }}
        ariaLabel="Prancha ilustrada do coração e da circulação humana"
        scene={<HeartMechanism stage={props.activeStep === undefined ? undefined : props} />}
        sceneFirst
        left={{ label: 'Pequena circulação · pulmonar', headline: 'Do coração aos pulmões e de volta.', detail: 'Ventrículo direito → artérias pulmonares → capilares dos pulmões → veias pulmonares → átrio esquerdo.', formula: 'VD → pulmões → AE' }}
        right={{ label: 'Grande circulação · sistêmica', headline: 'Do coração ao corpo e de volta.', detail: 'Ventrículo esquerdo → aorta → capilares dos tecidos → veias cavas → átrio direito.', formula: 'VE → corpo → AD' }}
        leftState={pair.leftState}
        rightState={pair.rightState}
        leftSelected={pair.leftSelected}
        rightSelected={pair.rightSelected}
        onSelectLeft={pair.selectLeft}
        onSelectRight={pair.selectRight}
        equation={{ label: 'Regra dos vasos', general: 'artéria sai do coração', condition: 'direção, não cor', reduced: 'veia chega ao coração' }}
        // O percurso da hemácia e o modelo de área e velocidade, que ficavam
        // aqui embaixo, moram agora na cena (HeartMechanism) e respondem à etapa.
        supports={<HeartScene />}
        closing="artérias saem do coração e veias retornam; o sangue passa pelo lado direito rumo aos pulmões e pelo esquerdo rumo ao corpo."
      />
    </div>
  );
}
