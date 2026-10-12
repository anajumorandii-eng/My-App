import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { StageCaseLens, bridgeFromBoard, useStageCases, VEILED_CLAIM } from '../visual-stage/stageCases';
import { INTERACTION_CASES, MENDEL_CASES } from './stageCaseItems';

const CLASSE_NOME: Record<string, string> = { dom: 'A_B_', p1: 'A_bb', p2: 'aaB_', rec: 'aabb' };

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
function PunnettScene({ emphasis, interaction: interactionChapter = false, startDihybrid = false, stage }: { emphasis: 'esquerda' | 'direita' | 'nenhum'; interaction?: boolean; startDihybrid?: boolean; stage?: BoardProps }) {
  // No palco, a etapa escolhe o quadro: em Segunda Lei, "Segregação
  // independente" abre o 4×4; em Interação Gênica, "Epistasia" reclassifica as
  // mesmas dezesseis casas em 9 : 7. Fora do palco vale o par de cartões, como antes.
  const bridge = bridgeFromBoard(stage);
  const items = interactionChapter ? INTERACTION_CASES : MENDEL_CASES;
  const casos = useStageCases(items, interactionChapter ? 1 : startDihybrid ? 1 : 0, bridge);
  const [celula, setCelula] = React.useState<string | null>(null);
  const interaction = bridge ? interactionChapter && casos.active === 1 : interactionChapter;
  const diHibrido = bridge ? interactionChapter || casos.active === 1 : interactionChapter || startDihybrid || emphasis === 'direita';
  React.useEffect(() => setCelula(null), [diHibrido, interaction]);

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
    if (interaction) return dom1 && dom2 ? 'dom' : 'rec';
    return dom1 && dom2 ? 'dom' : dom1 ? 'p1' : dom2 ? 'p2' : 'rec';
  };

  const nomeClasse = (c: string) => interaction ? (c === 'dom' ? 'A_B_, pigmentada' : 'sem pigmento')
    : diHibrido ? CLASSE_NOME[c] : c === 'dom' ? 'A_, dominante' : 'aa, recessivo';
  // A leitura da casa tocada conta as casas da mesma classe no próprio quadro:
  // é daí que sai 9/16, 3/4 ou 7/16, sem número decorado.
  const contagem = (() => {
    if (!celula) return null;
    const [i, j] = celula.split('-').map(Number);
    const alvo = classe(gametas[i], gametas[j]);
    const iguais = gametas.flatMap((l) => gametas.map((c) => classe(l, c))).filter((c) => c === alvo).length;
    return `${nomeClasse(alvo)}: ${iguais} de ${gametas.length ** 2} casas`;
  })();
  const coberto = casos.veiled.has(casos.active);

  const quadro = (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role={bridge ? 'group' : 'img'} data-emphasis={emphasis}
      aria-label={diHibrido
        ? interaction ? 'Quadro de Punnett 4 por 4 para genes complementares, com nove células pigmentadas e sete sem pigmento' : 'Quadro de Punnett 4 por 4 para dois pares de alelos, com a proporção 9:3:3:1'
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
            <g key={`${i}-${j}`} className="vs-punnett-cell" data-classe={classe(linha, coluna)}
              data-selected={celula === `${i}-${j}` || undefined}
              {...(bridge ? {
                role: 'button', tabIndex: 0, 'aria-pressed': celula === `${i}-${j}`,
                'aria-label': `Casa ${par}: ${nomeClasse(classe(linha, coluna))}`,
                onClick: () => setCelula(`${i}-${j}`),
                onKeyDown: (event: React.KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setCelula(`${i}-${j}`); } },
              } : {})}>
              <rect x={x0 + j * cel} y={y0 + i * cel} width={cel} height={cel} />
              <text x={x0 + j * cel + cel / 2} y={y0 + i * cel + cel / 2 + 5} textAnchor="middle">{par}</text>
            </g>
          );
        }))}

      <text className="vs-scene-caption" x="160" y={diHibrido ? 306 : 300} textAnchor="middle">
        {interaction ? '9 A_B_ pigmentadas : 7 sem pigmento' : diHibrido ? '9 : 3 : 3 : 1 — contando as casas' : '3 dominantes : 1 recessivo'}
      </text>
    </svg>
  );
  if (!bridge) return quadro;
  return (
    <div className="vs-punnett-stage">
      <StageCaseLens cases={casos} items={items} />
      <div className="mechanism-options" role="group" aria-label="Quadro de Punnett">
        {items.map((item, n) => <button key={item.label} type="button" aria-pressed={casos.active === n} onClick={() => casos.choose(n)}>{item.label}</button>)}
      </div>
      {quadro}
      <p role="status">{contagem ? <><strong>{contagem}.</strong> </> : 'Toque numa casa para contar a classe dela. '}{coberto ? VEILED_CLAIM : items[casos.active].claim}</p>
    </div>
  );
}

export default function MendelBoard(props: BoardProps) {
  const par = boardPair(props);
  const interaction = props.map.summaryId === 'summary-biologia-segunda-lei-de-mendel-e-interacao-genica';
  const secondLaw = props.map.summaryId === 'summary-biologia-segunda-lei-de-mendel';
  const defaultDihybrid = secondLaw && par.emphasis === 'nenhum';
  const diHibrido = interaction || defaultDihybrid || par.emphasis === 'direita';
  // No palco quem escolhe o quadro é a etapa (PunnettScene); o selo não pode
  // afirmar um cruzamento que a cena ao lado talvez não esteja mostrando.
  const noPalco = props.activeStep !== undefined && Boolean(props.onStepChange);
  return (
    <BoardShell
      title={interaction ? 'Interação gênica: uma via, dois genes' : 'As leis de Mendel'}
      subtitle={interaction ? 'A segregação continua mendeliana; o produto final depende dos dois loci.' : 'A segunda lei não é sobre dois caracteres — é sobre independência.'}
      condition={{ label: 'cruzamento', value: noPalco && !interaction ? 'Aa ou AaBb' : diHibrido ? 'AaBb × AaBb' : 'Aa × Aa' }}
      ariaLabel={interaction ? 'Prancha de interação gênica complementar com proporção nove para sete' : 'Prancha ilustrada das leis de Mendel com quadro de Punnett'}
      scene={<PunnettScene emphasis={par.emphasis} interaction={interaction} startDihybrid={defaultDihybrid} stage={props} />}
      sceneNotes={{ up: 'um par ↑', down: '↓ dois pares' }}
      emphasis={par.emphasis}
      left={interaction ? { label: 'Gene A · primeira etapa', headline: 'A_ produz o intermediário.', detail: 'Sem ao menos um alelo A funcional, a via é interrompida antes do intermediário e o organismo fica sem pigmento.', formula: 'precursor —A→ intermediário' } : { label: 'Primeira lei', headline: 'Cada par de alelos se separa.', detail: 'Na formação dos gametas, os dois alelos de um gene vão para células diferentes. Aa × Aa dá 3 dominantes para 1 recessivo.', formula: '3 : 1 (fenótipo) · 1 : 2 : 1 (genótipo)' }}
      right={interaction ? { label: 'Gene B · segunda etapa', headline: 'B_ converte o intermediário.', detail: 'Só A_B_ completa as duas etapas e produz pigmento. A_bb, aaB_ e aabb convergem no mesmo fenótipo sem pigmento.', formula: 'intermediário —B→ pigmento' } : { label: 'Segunda lei', headline: 'Pares diferentes se separam independentemente.', detail: 'Só vale se os genes estiverem em cromossomos diferentes. Genes ligados no mesmo cromossomo tendem a ir juntos e quebram a proporção.', formula: '9 : 3 : 3 : 1' }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={interaction ? { label: 'Epistasia recessiva dupla', general: '9 A_B_', condition: '+ 7 bloqueadas', reduced: '9 : 7' } : { label: 'Proporção', general: '(3:1)', condition: 'ao quadrado', reduced: '9:3:3:1' }}
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
