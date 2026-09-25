import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import LensMechanism from './LensMechanism';

export default function LensBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Lentes: onde a imagem se forma"
      subtitle="Dois raios bastam para achar a imagem — o resto é consequência."
      condition={{ label: 'convergente', value: 'f > 0' }}
      ariaLabel="Prancha ilustrada de lentes e formação de imagem"
      scene={<LensMechanism />}
      sceneFirst
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
