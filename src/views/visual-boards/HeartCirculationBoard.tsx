import { useState } from 'react';
import BoardShell from './BoardShell';
import HeartMechanism from './HeartMechanism';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import './HeartCirculationBoard.css';

/** O azul/vermelho indica oxigenação; artéria/veia indica direção do fluxo. */
const route = [
  { label: 'Corpo', color: 'blue' },
  { label: 'Veias cavas', color: 'blue' },
  { label: 'Átrio direito', color: 'blue' },
  { label: 'Ventrículo direito', color: 'blue' },
  { label: 'Artérias pulmonares', color: 'blue' },
  { label: 'Pulmões', color: 'exchange' },
  { label: 'Veias pulmonares', color: 'red' },
  { label: 'Átrio esquerdo', color: 'red' },
  { label: 'Ventrículo esquerdo', color: 'red' },
  { label: 'Aorta', color: 'red' },
];

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

function VascularArea() {
  const [area, setArea] = useState(8);
  const velocity = 8 / area;
  return (
    <section className="vs-heart-area" aria-label="Modelo interativo de área vascular e velocidade">
      <div className="vs-heart-area-head"><span>Experimente · capilares em paralelo</span><strong>{area}× área → {Number.isInteger(velocity) ? velocity : velocity.toFixed(1).replace('.', ',')}× velocidade</strong></div>
      <div className="vs-heart-capillaries" aria-hidden="true">
        {Array.from({ length: area }, (_, index) => <span key={index} />)}
      </div>
      <label htmlFor="heart-vascular-area">Área transversal total relativa: {area}×</label>
      <input id="heart-vascular-area" type="range" min="1" max="8" value={area} onChange={(event) => setArea(Number(event.target.value))} />
      <p>Com vazão constante, v = Q ÷ A. Mais capilares em paralelo aumentam a área total e reduzem a velocidade média; o tempo de contato favorece as trocas.</p>
      <small>Valores relativos de um modelo, não medidas do corpo humano.</small>
    </section>
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
        scene={<HeartMechanism />}
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
        supports={<>
          <HeartScene />
          <section className="vs-heart-route" aria-label="Percurso completo de uma hemácia">
            <h3>Siga uma hemácia</h3>
            <div>{route.map((stop, index) => <span key={stop.label} className={`vs-heart-stop vs-heart-stop--${stop.color}`}><b>{index + 1}</b>{stop.label}</span>)}</div>
            <p>Depois da aorta, o sangue retorna ao corpo e o percurso recomeça. Nos pulmões, o sangue ganha O₂; nos tecidos, entrega O₂.</p>
          </section>
          <VascularArea />
        </>}
        closing="artérias saem do coração e veias retornam; o sangue passa pelo lado direito rumo aos pulmões e pelo esquerdo rumo ao corpo."
      />
    </div>
  );
}
