import React from 'react';
import type { BoardProps } from './types';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import { SceneNote } from './SceneNote';

/**
 * Cilindro isolado com pistão móvel, desenhado aqui em vez de vir de um arquivo.
 *
 * Antes era <img src="/visual/adiabatic-piston.webp">. O arquivo existia e
 * respondia 200, mas todos os seus pixels eram rgba(0,0,0,0): a prancha
 * reservava 360x360 e não desenhava nada. Um raster também não serviria ao que
 * a tela precisa — não acompanha o tema, não reage ao nó selecionado e não
 * anima. Em SVG o pistão sobe na expansão e desce na compressão, e as cores
 * saem das mesmas variáveis do resto da folha.
 *
 * As hachuras na parede são o isolamento térmico: é o que justifica Q = 0, e
 * sem elas o desenho seria um cilindro qualquer.
 */
function AdiabaticPiston({ emphasis }: { emphasis: 'expansao' | 'compressao' | 'nenhum' }) {
  // Curso do pistão dentro do cilindro (interno: y 70..290). Expansão sobe
  // porque o gás ganha volume; compressão desce. O repouso fica no meio para
  // que os dois sentidos tenham a mesma amplitude visível.
  const topoGas = emphasis === 'expansao' ? 110 : emphasis === 'compressao' ? 200 : 150;
  const alturaGas = 290 - topoGas;

  return (
    <svg
      className="vs-piston"
      viewBox="0 0 320 330"
      role="img"
      data-emphasis={emphasis}
      aria-label="Cilindro termicamente isolado: o gás ocupa a parte de baixo e o pistão desliza no topo, sem troca de calor com o meio"
    >
      <g className="vs-piston-wall">
        {/* Parede dupla: a faixa entre as duas linhas recebe as hachuras. */}
        <path d="M70 70 L70 290 L250 290 L250 70" />
        <path d="M52 70 L52 308 L268 308 L268 70" />
      </g>

      <g className="vs-piston-hatch" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`e${i}`} d={`M52 ${78 + i * 18} L70 ${88 + i * 18}`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`d${i}`} d={`M268 ${78 + i * 18} L250 ${88 + i * 18}`} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <path key={`b${i}`} d={`M${58 + i * 18} 290 L${72 + i * 18} 308`} />
        ))}
      </g>

      {/* O gás começa logo abaixo do pistão e vai até o fundo do cilindro. */}
      <rect className="vs-piston-gas" x="70" y={topoGas} width="180" height={alturaGas} />

      <g className="vs-piston-molecules" aria-hidden="true">
        {[
          [104, 0.62], [148, 0.28], [196, 0.7], [226, 0.42],
          [118, 0.86], [172, 0.52], [212, 0.9], [88, 0.34],
        ].map(([x, f], i) => (
          <circle key={i} cx={x} cy={topoGas + alturaGas * f} r="4.5" />
        ))}
      </g>

      {/* Um só translate move placa, haste e punho: eles são peça única, e
          animar cada um daria descolamento no meio da transição. */}
      <g className="vs-piston-head" style={{ transform: `translateY(${topoGas - 150}px)` }}>
        <rect className="vs-piston-plate" x="66" y="134" width="188" height="16" rx="3" />
        <rect className="vs-piston-rod" x="150" y="76" width="20" height="60" rx="4" />
        <rect className="vs-piston-cap" x="128" y="62" width="64" height="14" rx="5" />
      </g>

      {/* Q = 0 não é legenda solta: é a fronteira que as hachuras representam.
          Fica acima da parede, onde nenhum cartão vizinho o alcança. */}
      <g className="vs-piston-seal">
        <circle cx="288" cy="40" r="18" />
        <text x="288" y="45" textAnchor="middle">Q</text>
        <path className="vs-piston-slash" d="M276 28 L300 52" />
      </g>

      {/* A anotação comenta o que acabou de acontecer com o pistão, e some no
          repouso: sem ênfase não há transformação a narrar. */}
      {/* Canto superior esquerdo nos dois sentidos: à direita fica o selo do Q
          riscado e no meio passa a haste do pistão — a primeira versão punha o
          texto da expansão em cima do selo. */}
      {emphasis === 'expansao' && (
        <SceneNote text="ΔV > 0 → T cai" at={[112, 122]} to={[108, 34]} align="end" />
      )}
      {emphasis === 'compressao' && (
        <SceneNote text="ΔV < 0 → T sobe" at={[112, 212]} to={[108, 34]} align="end" />
      )}
      <SceneNote text="parede isolante" at={[61, 258]} to={[16, 326]} align="start" />
    </svg>
  );
}

export default function AdiabaticBoard(props: BoardProps) {
  const par = boardPair(props);

  return (
    <BoardShell
      title="Transformação adiabática"
      subtitle="Quando não há troca de calor entre o sistema e o meio."
      condition={{ label: 'condição', value: 'Q = 0' }}
      ariaLabel="Prancha ilustrada de transformação adiabática"
      scene={<AdiabaticPiston emphasis={par.emphasis === 'esquerda' ? 'expansao' : par.emphasis === 'direita' ? 'compressao' : 'nenhum'} />}
      sceneNotes={{ up: 'expansão ↑', down: '↓ compressão' }}
      emphasis={par.emphasis}
      left={{
        label: 'Expansão adiabática',
        headline: 'O gás realiza trabalho.',
        detail: 'Sem receber calor, a energia interna diminui e a temperatura tende a cair.',
        formula: 'W > 0 · ΔU < 0 · ΔT < 0',
      }}
      right={{
        label: 'Compressão adiabática',
        headline: 'O meio realiza trabalho sobre o gás.',
        detail: 'Sem perder calor, a energia interna aumenta e a temperatura tende a subir.',
        formula: 'W < 0 · ΔU > 0 · ΔT > 0',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Primeira lei aplicada à transformação adiabática', general: 'ΔU = Q − W', condition: 'com Q = 0', reduced: 'ΔU = −W' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Relações úteis</span>
            <strong>PV<sup>γ</sup> = constante</strong>
            <p>Também TV<sup>γ−1</sup> = constante, para gás ideal em processo adiabático reversível.</p>
          </section>

          <figure className="vs-pv-card">
            <figcaption>Diagrama P × V</figcaption>
            <svg viewBox="0 0 250 150" role="img" aria-label="Curva adiabática em gráfico de pressão por volume">
              <line x1="34" y1="12" x2="34" y2="126" />
              <line x1="34" y1="126" x2="230" y2="126" />
              <path d="M48 26 C75 44, 91 64, 111 79 C137 98, 166 109, 216 116" />
              <circle cx="58" cy="34" r="4" />
              <circle cx="206" cy="114" r="4" />
              <text x="10" y="20">P</text>
              <text x="226" y="145">V</text>
              <text x="66" y="31">compressão</text>
              <text x="145" y="104">expansão</text>
            </svg>
          </figure>

          <section className="vs-formula-note">
            <span className="vs-note-title">O que permanece decisivo?</span>
            <strong>Sem calor não é sem mudança</strong>
            <p>Não confunda "sem troca de calor" com "temperatura constante". Na adiabática a temperatura muda justamente porque há trabalho.</p>
          </section>

          <section className="vs-formula-note">
            <span className="vs-note-title">Pista de prova</span>
            <strong>Comece por quem trabalha</strong>
            <p>Identifique primeiro quem realiza trabalho. Depois aplique a convenção de sinais e só então conclua sobre ΔU e ΔT.</p>
          </section>
        </>
      }
      closing="sem calor atravessando a fronteira, trabalho e energia interna explicam a mudança do estado do gás."
    />
  );
}
