import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';
import { imagemDeLenteConvergente } from '../../lib/opticalImage';

/**
 * Lente convergente com os dois raios notáveis e a imagem que eles formam.
 *
 * A prancha existe para separar duas coisas que a fórmula esconde: o raio que
 * chega paralelo sai pelo foco, e o que passa pelo centro óptico não desvia. O
 * cruzamento dos dois é a imagem — e é vendo o cruzamento mudar de lado que se
 * entende por que ela vira real ou virtual conforme o objeto passa do foco.
 */
function LensScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const eixo = 170;
  const lente = 170;   // x da lente
  const foco = 62;     // distância focal em unidades do desenho

  // Objeto além do foco (imagem real, invertida) ou entre foco e lente
  // (virtual, direita): é a única variável que muda tudo no traçado.
  const alem = emphasis !== 'direita';
  const objX = alem ? 44 : 128;
  const objH = alem ? 46 : 34;

  // A conta sai de um módulo puro coberto em node:test. Estava aqui dentro do
  // JSX, e por isso o erro de sinal atravessou lint e testes: nada avaliava a
  // física, só a renderização.
  const { distancia: pl, altura: imgH } = imagemDeLenteConvergente(lente - objX, objH, foco);
  const imgX = lente + pl;
  // O objeto é desenhado em `eixo - objH`, para cima. A imagem tem de usar a
  // mesma referência, senão o sinal se inverte na tela: com `eixo + imgH` o
  // objeto além do foco saía com imagem DIREITA e o objeto entre foco e lente
  // saía INVERTIDA — os dois casos trocados, contra o que a própria legenda da
  // cena diz. Aqui `imgY` acima do eixo significa direita, abaixo significa
  // invertida, igual ao objeto.
  const imgY = eixo - imgH;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Lente convergente com dois raios notáveis formando a imagem de um objeto">
      <line className="vs-axis" x1="16" y1={eixo} x2="306" y2={eixo} />

      {/* Lente: duas curvas espelhadas, não um retângulo. */}
      <path className="vs-lens" d={`M${lente} ${eixo - 74} C ${lente + 22} ${eixo - 30}, ${lente + 22} ${eixo + 30}, ${lente} ${eixo + 74} C ${lente - 22} ${eixo + 30}, ${lente - 22} ${eixo - 30}, ${lente} ${eixo - 74} Z`} />

      {/* Focos dos dois lados. */}
      <g className="vs-focus">
        <circle cx={lente - foco} cy={eixo} r="3.5" />
        <circle cx={lente + foco} cy={eixo} r="3.5" />
        <text x={lente - foco} y={eixo + 20} textAnchor="middle">F</text>
        <text x={lente + foco} y={eixo + 20} textAnchor="middle">F′</text>
      </g>

      {/* Objeto: seta para cima sobre o eixo. */}
      <g className="vs-object">
        <line x1={objX} y1={eixo} x2={objX} y2={eixo - objH} />
        <path d={`M${objX} ${eixo - objH - 9} l-5 10 h10 z`} />
      </g>

      {/* Raio 1: paralelo ao eixo, refrata pelo foco. */}
      <path className="vs-ray" d={`M${objX} ${eixo - objH} L${lente} ${eixo - objH} L${imgX} ${imgY}`} />
      {/* Raio 2: pelo centro óptico, sem desvio. */}
      <path className="vs-ray vs-ray--alt" d={`M${objX} ${eixo - objH} L${imgX} ${imgY}`} />

      {/* Imagem no cruzamento dos raios. */}
      <g className="vs-image">
        <line x1={imgX} y1={eixo} x2={imgX} y2={imgY} />
        <path d={imgY > eixo
          ? `M${imgX} ${imgY + 9} l-5 -10 h10 z`
          : `M${imgX} ${imgY - 9} l-5 10 h10 z`} />
      </g>

      {/* Onde os raios se cruzam é onde a imagem existe — é o passo que some
          quando o traçado é decorado em vez de entendido. */}
      <SceneNote text="os raios se cruzam aqui" at={[imgX, imgY]} to={[160, 276]} align="middle" />

      <text className="vs-scene-caption" x="160" y="312" textAnchor="middle">
        {alem ? 'imagem real e invertida' : 'imagem virtual e direita'}
      </text>
    </svg>
  );
}

export default function LensBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Lentes: onde a imagem se forma"
      subtitle="Dois raios bastam para achar a imagem — o resto é consequência."
      condition={{ label: 'convergente', value: 'f > 0' }}
      ariaLabel="Prancha ilustrada de lentes e formação de imagem"
      scene={<LensScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'além de F ↑', down: '↓ dentro de F' }}
      emphasis={par.emphasis}
      left={{
        label: 'Objeto além do foco',
        headline: 'Imagem real e invertida.',
        detail: 'Os raios se cruzam de fato do outro lado da lente. É a configuração de projetor e de olho humano.',
        formula: 'p > f · p′ > 0 · imagem invertida',
      }}
      right={{
        label: 'Objeto entre F e a lente',
        headline: 'Imagem virtual e direita.',
        detail: 'Os raios divergem; quem se cruza é o prolongamento deles. É a lupa.',
        formula: 'p < f · p′ < 0 · imagem ampliada',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Equação de Gauss', general: '1/f = 1/p + 1/p′', condition: 'com aumento', reduced: 'A = −p′/p' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Os raios notáveis</span>
            <strong>Paralelo → sai por F′</strong>
            <strong>Pelo centro → não desvia</strong>
            <p>Qualquer par serve para achar a imagem; estes dois são os de traçado mais simples.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Convenção de sinal</span>
            <strong>p′ &gt; 0 · real</strong>
            <strong>p′ &lt; 0 · virtual</strong>
            <p>O sinal de p′ sai da equação e já diz de que lado a imagem está — não é preciso decorar os casos.</p>
          </section>
        </>
      }
      closing="a posição do objeto em relação ao foco decide se a imagem é real ou virtual, e a equação de Gauss só confirma o que o traçado já mostrou."
    />
  );
}
