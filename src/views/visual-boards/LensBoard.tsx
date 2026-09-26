import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import LensMechanism from './LensMechanism';
import LensPowerMechanism from './LensPowerMechanism';

export default function LensBoard(props: BoardProps) {
  const par = boardPair(props);
  const maker = props.map.summaryId === 'summary-fisica-equacao-do-fabricante-de-lentes-e-associacao-de-lentes';
  return (
    <BoardShell
      title={maker ? 'Fabricante e associação de lentes' : 'Lentes: onde a imagem se forma'}
      subtitle={maker ? 'Mude o meio, a curvatura e a segunda lente para comparar a vergência.' : 'Dois raios bastam para achar a imagem — o resto é consequência.'}
      condition={maker ? {label:'lentes delgadas',value:'em contato'} : { label: 'delgadas', value: 'Gauss' }}
      ariaLabel="Prancha ilustrada de lentes e formação de imagem"
      scene={maker ? <LensPowerMechanism /> : <LensMechanism />}
      sceneFirst
      emphasis={par.emphasis}
      left={maker ? {label:'Fabricante',headline:'O meio também importa.',detail:'A curvatura e a razão entre os índices determinam 1/f. Se os índices se igualam, a lente perde a capacidade de desviar os raios.',formula:'1/f = (n lente/n meio − 1)(1/R₁ − 1/R₂)'} : {
        label: 'Convergente: além do foco',
        headline: 'Imagem real e invertida.',
        detail: 'Os raios se cruzam de fato do outro lado da lente. É a configuração de projetor e de olho humano.',
        formula: 'p > f · p′ > 0 · imagem invertida',
      }}
      right={maker ? {label:'Associação',headline:'Some as vergências.',detail:'Para lentes delgadas em contato no mesmo meio, somam-se os inversos das distâncias focais. Para lentes separadas, é preciso considerar a distância entre elas.',formula:'V total = V₁ + V₂'} : {
        label: 'Convergente: entre F e a lente',
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
      equation={maker ? {label:'Associação',general:'1/f = 1/f₁ + 1/f₂',condition:'em contato',reduced:'V = V₁ + V₂'} : { label: 'Equação de Gauss', general: '1/f = 1/p + 1/p′', condition: 'com aumento', reduced: 'A = −p′/p' }}
      supports={!maker &&
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Os raios notáveis</span>
            <strong>Paralelo → raio ou prolongamento passa por F′</strong>
            <strong>Pelo centro → não desvia</strong>
            <p>Na convergente, o raio passa pelo foco imagem; na divergente, seu prolongamento passa pelo foco virtual. O raio pelo centro óptico não desvia na aproximação de lente delgada.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Convenção de sinal</span>
            <strong>p′ &gt; 0 · real</strong>
            <strong>p′ &lt; 0 · virtual</strong>
            <p>O sinal de p′ sai da equação e já diz de que lado a imagem está — não é preciso decorar os casos.</p>
          </section>
        </>
      }
      closing={maker ? 'a soma é de vergências, e o foco depende também do meio que envolve as lentes.' : 'para um objeto real, a convergente depende da posição; a divergente forma imagem virtual, direita e menor. A equação de Gauss confirma o traçado.'}
    />
  );
}
