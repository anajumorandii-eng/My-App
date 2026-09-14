import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Quadro de Punnett com os gametas nas bordas e as combinações dentro.
 *
 * A 1ª lei separa um par de alelos; a 2ª diz que dois pares se separam
 * independentemente. O que confunde é achar que a 2ª lei é sobre "dois
 * caracteres" quando ela é sobre independência — e ela só vale se os genes
 * estiverem em cromossomos diferentes. Por isso a cena troca entre o quadro de
 * 2×2 (um par) e o de 4×4 (dois pares), onde o 9:3:3:1 aparece como contagem
 * das casas, e não como número a decorar.
 */
function PunnettScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const diHibrido = emphasis === 'direita';

  const cel = diHibrido ? 52 : 92;
  const gametas = diHibrido ? ['AB', 'Ab', 'aB', 'ab'] : ['A', 'a'];
  const x0 = diHibrido ? 62 : 84;
  const y0 = diHibrido ? 78 : 96;

  // Classe fenotípica de cada casa: domina se houver ao menos um alelo
  // maiúsculo de cada gene. É o que produz 3:1 e 9:3:3:1 sem contar de cabeça.
  const classe = (linha: string, coluna: string) => {
    const par = linha + coluna;
    const dom1 = par.includes('A');
    if (!diHibrido) return dom1 ? 'dom' : 'rec';
    const dom2 = par.includes('B');
    return dom1 && dom2 ? 'dom' : dom1 ? 'p1' : dom2 ? 'p2' : 'rec';
  };

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={diHibrido
        ? 'Quadro de Punnett 4 por 4 para dois pares de alelos, com a proporção 9:3:3:1'
        : 'Quadro de Punnett 2 por 2 para um par de alelos, com a proporção 3:1'}>
      {gametas.map((g, i) => (
        <text key={`c${i}`} className="vs-gamete" x={x0 + i * cel + cel / 2} y={y0 - 10} textAnchor="middle">{g}</text>
      ))}
      {gametas.map((g, i) => (
        <text key={`l${i}`} className="vs-gamete" x={x0 - 12} y={y0 + i * cel + cel / 2 + 4} textAnchor="end">{g}</text>
      ))}

      {gametas.map((linha, i) =>
        gametas.map((coluna, j) => {
          const par = [linha, coluna].join('').split('').sort((a, b) =>
            a.toLowerCase() === b.toLowerCase() ? (a < b ? -1 : 1) : a.toLowerCase() < b.toLowerCase() ? -1 : 1).join('');
          return (
            <g key={`${i}-${j}`} className="vs-punnett-cell" data-classe={classe(linha, coluna)}>
              <rect x={x0 + j * cel} y={y0 + i * cel} width={cel} height={cel} />
              <text x={x0 + j * cel + cel / 2} y={y0 + i * cel + cel / 2 + 5} textAnchor="middle">{par}</text>
            </g>
          );
        }))}

      <text className="vs-scene-caption" x="160" y={diHibrido ? 306 : 300} textAnchor="middle">
        {diHibrido ? '9 : 3 : 3 : 1 — contando as casas' : '3 dominantes : 1 recessivo'}
      </text>
    </svg>
  );
}

export default function MendelBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="As leis de Mendel"
      subtitle="A segunda lei não é sobre dois caracteres — é sobre independência."
      condition={{ label: 'cruzamento', value: 'Aa × Aa' }}
      ariaLabel="Prancha ilustrada das leis de Mendel com quadro de Punnett"
      scene={<PunnettScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'um par ↑', down: '↓ dois pares' }}
      emphasis={par.emphasis}
      left={{
        label: 'Primeira lei',
        headline: 'Cada par de alelos se separa.',
        detail: 'Na formação dos gametas, os dois alelos de um gene vão para células diferentes. Aa × Aa dá 3 dominantes para 1 recessivo.',
        formula: '3 : 1 (fenótipo) · 1 : 2 : 1 (genótipo)',
      }}
      right={{
        label: 'Segunda lei',
        headline: 'Pares diferentes se separam independentemente.',
        detail: 'Só vale se os genes estiverem em cromossomos diferentes. Genes ligados no mesmo cromossomo tendem a ir juntos e quebram a proporção.',
        formula: '9 : 3 : 3 : 1',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Proporção', general: '(3:1)', condition: 'ao quadrado', reduced: '9:3:3:1' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Quando a 2ª lei falha</span>
            <strong>Genes ligados</strong>
            <p>No mesmo cromossomo, os alelos migram juntos e a proporção se afasta de 9:3:3:1. A permuta reembaralha em parte — e a distância entre os genes mede quanto.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Atalho de cálculo</span>
            <strong>Multiplique as probabilidades</strong>
            <p>3/4 × 3/4 = 9/16 para o duplo dominante. Para três ou mais pares, o quadro fica impraticável e só a multiplicação resolve.</p>
          </section>
        </>
      }
      closing="o quadro de Punnett não é um método de cálculo: é a prova visual de que as combinações são equiprováveis, e é daí que toda proporção sai."
    />
  );
}
