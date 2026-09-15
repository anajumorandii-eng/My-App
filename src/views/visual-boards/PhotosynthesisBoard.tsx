import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';

/**
 * Cloroplasto e mitocôndria lado a lado, com as setas de entrada e saída.
 *
 * A confusão que esta prancha ataca é tratar fotossíntese e respiração como
 * opostos exatos — "uma desfaz a outra". Os reagentes e produtos realmente se
 * invertem, mas as organelas, o saldo energético e o momento em que ocorrem não:
 * a planta respira o tempo todo e fotossintetiza só com luz. Por isso as duas
 * cenas aparecem juntas, com a seta de luz entrando em uma só.
 */
function LeafScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const foco = emphasis === 'esquerda' ? 'foto' : emphasis === 'direita' ? 'resp' : 'ambos';

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Cloroplasto e mitocôndria com as entradas e saídas de gás e a energia de cada processo">
      <defs>
        <radialGradient id="chloroplast-body" cx="35%" cy="28%"><stop stopColor="#e6f5c9" /><stop offset=".68" stopColor="#72aa62" /><stop offset="1" stopColor="#315f42" /></radialGradient>
        <linearGradient id="mito-body" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd8c9" /><stop offset=".55" stopColor="#d78478" /><stop offset="1" stopColor="#843546" /></linearGradient>
        <filter id="organelle-shadow" x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity=".2" /></filter>
      </defs>
      <path className="vs-leaf-silhouette" d="M30 165C5 90 43 42 132 48c-3 81-42 124-102 117Z" />
      <path className="vs-leaf-vein" d="M26 160C62 120 91 88 125 56M66 119l-8-38M84 101l34-8" />
      {/* Cloroplasto: elipse com tilacoides empilhados. */}
      <g className="vs-organelle" data-dim={foco === 'resp' ? 'true' : undefined}>
        <ellipse className="vs-chloroplast" cx="92" cy="122" rx="62" ry="44" />
        <ellipse className="vs-organelle-highlight" cx="76" cy="106" rx="39" ry="22" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line className="vs-thylakoid" x1={64 + i * 28} y1="104" x2={64 + i * 28} y2="140" />
            <circle className="vs-grana" cx={64 + i * 28} cy="104" r="5" />
            <circle className="vs-grana" cx={64 + i * 28} cy="140" r="5" />
          </g>
        ))}
        <text className="vs-organelle-name" x="92" y="182" textAnchor="middle">cloroplasto</text>
      </g>

      {/* Luz: só entra na fotossíntese — é a assimetria que a prancha quer mostrar. */}
      <g className="vs-sun" data-dim={foco === 'resp' ? 'true' : undefined}>
        <circle cx="34" cy="38" r="14" />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (-40 + i * 26) * (Math.PI / 180);
          return <line key={i} x1={34 + Math.cos(a) * 19} y1={38 + Math.sin(a) * 19} x2={34 + Math.cos(a) * 27} y2={38 + Math.sin(a) * 27} />;
        })}
        <path className="vs-light-ray" d="M50 52 L74 92" />
      </g>

      {/* Mitocôndria: cápsula com cristas. */}
      <g className="vs-organelle" data-dim={foco === 'foto' ? 'true' : undefined}>
        <rect className="vs-mitochondria" x="172" y="86" width="118" height="72" rx="36" />
        <path className="vs-mito-glow" d="M184 108c19-18 74-23 94 7" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} className="vs-crista" d={`M${196 + i * 24} 92 q 14 30, 0 60`} />
        ))}
        <text className="vs-organelle-name" x="231" y="182" textAnchor="middle">mitocôndria</text>
      </g>

      {/* Trocas gasosas: o que entra em um sai do outro. */}
      <g className="vs-exchange">
        <text className="vs-gas vs-gas--in" x="92" y="228" textAnchor="middle">CO₂ + H₂O entram</text>
        <text className="vs-gas vs-gas--out" x="92" y="250" textAnchor="middle">O₂ sai</text>
        <text className="vs-gas vs-gas--in" x="231" y="228" textAnchor="middle">O₂ entra</text>
        <text className="vs-gas vs-gas--out" x="231" y="250" textAnchor="middle">CO₂ + H₂O saem</text>
      </g>

      {/* A assimetria da prancha: luz só entra de um lado. */}
      <SceneNote text="luz só entra aqui" at={[74, 92]} to={[152, 44]} align="start" />
      <SceneNote text="respira o tempo todo" at={[231, 122]} to={[300, 208]} align="end" />

      <text className="vs-scene-caption" x="160" y="292" textAnchor="middle">respira sempre · fotossintetiza com luz</text>
    </svg>
  );
}

function PhotosynthesisAtlas({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const reduced = useReducedMotion();
  return (
    <div className="vs-atlas-scene vs-atlas-scene--photo" data-emphasis={emphasis}>
      <motion.img
        src="/visual-assets/photosynthesis-atlas.webp"
        alt="Ilustração científica de uma folha e um cloroplasto em corte, com grana, luz e moléculas entrando e saindo"
        initial={reduced ? false : { opacity: 0, scale: .94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 105, damping: 20 }}
      />
      <span className="vs-atlas-label vs-atlas-label--sun">luz vira energia química</span>
    </div>
  );
}

export default function PhotosynthesisBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Fotossíntese e respiração"
      subtitle="Os reagentes se invertem; as organelas e o horário, não."
      condition={{ label: 'saldo', value: 'ATP' }}
      ariaLabel="Prancha ilustrada de bioenergética: fotossíntese e respiração celular"
      scene={<PhotosynthesisAtlas emphasis={par.emphasis} />}
      sceneNotes={{ up: 'com luz ↑', down: '↓ sempre' }}
      emphasis={par.emphasis}
      left={{
        label: 'Fotossíntese',
        headline: 'Monta glicose com energia da luz.',
        detail: 'No cloroplasto, e só enquanto há luz. Armazena energia em ligações químicas em vez de gastá-la.',
        formula: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂',
      }}
      right={{
        label: 'Respiração celular',
        headline: 'Desmonta glicose para gerar ATP.',
        detail: 'Na mitocôndria, dia e noite, em planta e animal. É o que converte a energia guardada em energia utilizável.',
        formula: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Ponto de compensação', general: 'fotossíntese = respiração', condition: 'saldo', reduced: 'crescimento zero' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Pegadinha clássica</span>
            <strong>Planta respira 24 h</strong>
            <p>Não é "de dia fotossintetiza, de noite respira". Respira sempre; à luz, a fotossíntese supera a respiração e o saldo de O₂ fica positivo.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Ponto de compensação</span>
            <strong>Saldo aparente zero</strong>
            <p>Intensidade luminosa em que os dois processos se igualam. Abaixo dela a planta consome mais do que produz e não cresce.</p>
          </section>
        </>
      }
      closing="as equações são inversas, mas os processos convivem — o que muda é a proporção entre eles conforme a luz."
    />
  );
}
