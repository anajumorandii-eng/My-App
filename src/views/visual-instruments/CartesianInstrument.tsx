import React, { useId, useMemo, useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import type { BoardProps } from '../visual-boards/types';
import { FAMILIES, num, samplePoints, type Family, type FamilyId } from '../../lib/curveFamilies';

/**
 * Plano cartesiano com dois parâmetros que a estudante move.
 *
 * A cena das pranchas autorais é fixa: o pistão anda, mas por conta da ênfase,
 * não da mão de quem estuda. Aqui a curva só existe em função de dois números
 * que ela controla, e as leituras ao lado recalculam junto. É a diferença entre
 * ver uma parábola e descobrir, mexendo, que o número de raízes vira zero
 * quando o vértice cruza o eixo.
 *
 * Usa o BoardShell de propósito: o enquadramento, o par de cartões dos nós 1 e 2
 * e a leitura de cor por estado continuam idênticos aos das pranchas desenhadas.
 * Só a cena muda — que é exatamente o contrato que o BoardShell existe para
 * garantir.
 */
const LARGURA = 320;
const ALTURA = 300;
const MARGEM = { esquerda: 34, direita: 14, topo: 16, base: 30 };

function PlanoCartesiano({
  family, a, b, destaque,
}: {
  family: Family;
  a: number;
  b: number;
  destaque: boolean;
}) {
  const { domain, range } = family;
  const larguraUtil = LARGURA - MARGEM.esquerda - MARGEM.direita;
  const alturaUtil = ALTURA - MARGEM.topo - MARGEM.base;

  const paraTelaX = (x: number) =>
    MARGEM.esquerda + ((x - domain.min) / (domain.max - domain.min)) * larguraUtil;
  const paraTelaY = (y: number) =>
    MARGEM.topo + alturaUtil - ((y - range.min) / (range.max - range.min)) * alturaUtil;

  // A curva vira vários traços: cada buraco de domínio quebra o path, em vez de
  // ligar os dois lados com uma reta que a função não tem.
  const trechos = useMemo(() => {
    const pontos = samplePoints(family, a, b);
    const saida: string[] = [];
    let atual: string[] = [];
    for (const p of pontos) {
      if (p === null) {
        if (atual.length > 1) saida.push(atual.join(' '));
        atual = [];
        continue;
      }
      const tx = paraTelaX(p.x);
      const ty = paraTelaY(p.y);
      // Recorta na vertical: ponto muito fora do quadro não entra no path.
      if (ty < MARGEM.topo - alturaUtil || ty > ALTURA + alturaUtil) {
        if (atual.length > 1) saida.push(atual.join(' '));
        atual = [];
        continue;
      }
      atual.push(`${atual.length === 0 ? 'M' : 'L'}${tx.toFixed(1)} ${ty.toFixed(1)}`);
    }
    if (atual.length > 1) saida.push(atual.join(' '));
    return saida;
  }, [family, a, b]);

  // Marcas inteiras dos dois eixos, sem repetir a origem.
  const ticksX = [];
  for (let x = Math.ceil(domain.min); x <= Math.floor(domain.max); x += 1) ticksX.push(x);
  const ticksY = [];
  const passoY = range.max - range.min > 12 ? 4 : 2;
  for (let y = Math.ceil(range.min / passoY) * passoY; y <= range.max; y += passoY) ticksY.push(y);

  const eixoY = paraTelaY(0);
  const eixoX = paraTelaX(0);
  const temEixoX = range.min <= 0 && range.max >= 0;
  const temEixoY = domain.min <= 0 && domain.max >= 0;

  return (
    <svg
      className="vs-plane"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      role="img"
      data-destaque={destaque ? 'true' : undefined}
      aria-label={`Plano cartesiano de ${family.name.toLowerCase()}, com a curva de ${family.expression(a, b)}`}
    >
      <g className="vs-plane-grid">
        {ticksX.map((x) => (
          <line key={`gx${x}`} x1={paraTelaX(x)} y1={MARGEM.topo} x2={paraTelaX(x)} y2={ALTURA - MARGEM.base} />
        ))}
        {ticksY.map((y) => (
          <line key={`gy${y}`} x1={MARGEM.esquerda} y1={paraTelaY(y)} x2={LARGURA - MARGEM.direita} y2={paraTelaY(y)} />
        ))}
      </g>

      {temEixoX && (
        <g className="vs-plane-axis">
          <line x1={MARGEM.esquerda} y1={eixoY} x2={LARGURA - MARGEM.direita} y2={eixoY} />
          {ticksX.filter((x) => x !== 0 && x % 2 === 0).map((x) => (
            <text key={`tx${x}`} x={paraTelaX(x)} y={eixoY + 13} textAnchor="middle">{x}</text>
          ))}
        </g>
      )}
      {temEixoY && (
        <g className="vs-plane-axis">
          <line x1={eixoX} y1={MARGEM.topo} x2={eixoX} y2={ALTURA - MARGEM.base} />
          {ticksY.filter((y) => y !== 0).map((y) => (
            <text key={`ty${y}`} x={eixoX - 6} y={paraTelaY(y) + 3.5} textAnchor="end">{y}</text>
          ))}
        </g>
      )}

      {trechos.map((d, i) => (
        <path key={i} className="vs-plane-curve" d={d} />
      ))}

      {/* Anotações manuscritas: o rótulo fica afastado do ponto e uma seta curva
          faz a ligação, como na prancha de referência. O rótulo é preso dentro
          da moldura porque o texto cresce para os dois lados do âncora e, sem
          limite, "nunca desce de zero" saía pela borda em parâmetro extremo. */}
      {family.annotations(a, b).map((nota) => {
        const ax = paraTelaX(nota.x);
        const ay = paraTelaY(nota.y);
        if (!Number.isFinite(ax) || !Number.isFinite(ay)) return null;
        const larguraTexto = nota.text.length * 4.6;
        const bruto = paraTelaX(nota.x + nota.dx);
        const lx = Math.min(
          LARGURA - MARGEM.direita - larguraTexto / 2,
          Math.max(MARGEM.esquerda + larguraTexto / 2, bruto),
        );
        const ly = Math.min(ALTURA - MARGEM.base - 6, Math.max(MARGEM.topo + 10, paraTelaY(nota.y + nota.dy)));
        // Controle da curva deslocado na perpendicular, senão a "seta" sai reta.
        const cx = (ax + lx) / 2 + (ay - ly) * 0.22;
        const cy = (ay + ly) / 2 + (lx - ax) * 0.22;
        const alvoY = ly < ay ? ly + 4 : ly - 9;
        return (
          <g className="vs-plane-note" key={nota.text}>
            <path className="vs-plane-arrow" d={`M${lx.toFixed(1)} ${alvoY.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)}`} />
            <circle className="vs-plane-anchor" cx={ax} cy={ay} r="3" />
            <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor="middle">{nota.text}</text>
          </g>
        );
      })}

      <text className="vs-plane-expression" x={LARGURA - MARGEM.direita} y={ALTURA - 8} textAnchor="end">
        {family.expression(a, b)}
      </text>
    </svg>
  );
}

/**
 * Primeira frase do trecho da seção, e no máximo uma.
 *
 * As pranchas autorais escrevem `detail` à mão, em duas linhas. Aqui o texto vem
 * do excerpt da seção, que é um parágrafo inteiro de resumo: sem cortar, o
 * cartão da direita passava de oitocentos pixels de altura e empurrava a cena
 * para fora do enquadramento. Corta na primeira sentença, e só apara no limite
 * de caracteres quando a sentença também é longa.
 */
function resumir(texto: string | undefined, limite = 190): string {
  if (!texto) return '';
  const limpo = texto.trim();
  const fim = limpo.search(/[.!?](\s|$)/);
  const primeira = fim > 40 ? limpo.slice(0, fim + 1) : limpo;
  if (primeira.length <= limite) return primeira;
  const cortado = primeira.slice(0, limite);
  const espaco = cortado.lastIndexOf(' ');
  return `${(espaco > 60 ? cortado.slice(0, espaco) : cortado).trimEnd()}…`;
}

export function cartesianInstrument(familyId: FamilyId) {
  const family = FAMILIES[familyId];

  return function CartesianBoard(props: BoardProps) {
    const par = boardPair(props);
    const [a, setA] = useState(family.params[0].initial);
    const [b, setB] = useState(family.params[1].initial);
    const idA = useId();
    const idB = useId();

    const leituras = family.readouts(a, b);
    const noPrimeiro = props.map.nodes[1] ?? props.map.nodes[0] ?? null;
    const noSegundo = props.map.nodes[2] ?? props.map.nodes[props.map.nodes.length - 1] ?? null;

    const controle = (
      i: 0 | 1,
      valor: number,
      set: (v: number) => void,
      inputId: string,
    ) => {
      const p = family.params[i];
      return (
        <div className="vs-plane-control">
          <label htmlFor={inputId}>
            <strong>{p.symbol}</strong>
            <span>{p.role}</span>
            <b>{num(valor)}</b>
          </label>
          <input
            id={inputId}
            type="range"
            min={p.min}
            max={p.max}
            step={p.step}
            value={valor}
            onChange={(event) => set(Number(event.target.value))}
          />
        </div>
      );
    };

    return (
      <BoardShell
        kicker="Prancha manipulável"
        title={family.name}
        subtitle={family.question}
        condition={{ label: family.params[0].symbol, value: num(a) }}
        ariaLabel={`Prancha manipulável de ${family.name.toLowerCase()}: ${props.map.title}`}
        emphasis={par.emphasis}
        scene={
          <div className="vs-instrument">
            <PlanoCartesiano family={family} a={a} b={b} destaque={par.emphasis !== 'nenhum'} />
            <div className="vs-plane-controls">
              {controle(0, a, setA, idA)}
              {controle(1, b, setB, idB)}
            </div>
            <dl className="vs-plane-readouts">
              {leituras.map((leitura) => (
                <div key={leitura.label} data-pivot={leitura.pivot ? 'true' : undefined}>
                  <dt>{leitura.label}</dt>
                  <dd>{leitura.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
        left={{
          label: STAGE_LABEL[noPrimeiro?.stage ?? 'conceito'],
          headline: noPrimeiro?.label ?? props.map.title,
          detail: resumir(noPrimeiro?.excerpt),
          formula: family.expression(a, b),
        }}
        right={{
          label: STAGE_LABEL[noSegundo?.stage ?? 'aplicacao'],
          headline: noSegundo?.label ?? props.map.title,
          detail: resumir(noSegundo?.excerpt),
          formula: `${family.params[1].symbol} = ${num(b)}`,
        }}
        leftState={par.leftState}
        rightState={par.rightState}
        leftSelected={par.leftSelected}
        rightSelected={par.rightSelected}
        onSelectLeft={par.selectLeft}
        onSelectRight={par.selectRight}
        equation={{
          label: `Expressão de ${family.name.toLowerCase()}`,
          general: family.expression(a, b),
          condition: 'com',
          reduced: `${family.params[0].symbol} = ${num(a)} · ${family.params[1].symbol} = ${num(b)}`,
        }}
        closing={family.insight}
      />
    );
  };
}
