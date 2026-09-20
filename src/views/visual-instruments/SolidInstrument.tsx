import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import type { BoardProps } from '../visual-boards/types';
import { SOLID_CONFIGS, estadoInicial, type SolidConfigId } from '../../lib/solidInstruments';
import { ALTURA, LARGURA, desenhar, type Forma } from '../../lib/solidDrawing';
import { formatar } from '../../lib/solids';
import './SolidInstrument.css';

/**
 * Prancha manipulável de sólidos: o objeto do capítulo, com as medidas nas mãos
 * da estudante. Bloco, prisma, pirâmide, sólidos de revolução e a razão entre
 * volumes compartilham o mesmo esqueleto porque a manipulação é a mesma, um
 * controle deslizante por medida, com a leitura que importa recalculando.
 *
 * As contas e o desenho vivem em `src/lib` (solids, solidInstruments,
 * solidDrawing), onde os testes conferem os números contra os exemplos
 * resolvidos dos capítulos e que nada sai do viewBox. Aqui só se monta a tela.
 */

// A cápsula de condição do BoardShell é estreita: precisa de um símbolo, não de uma frase.
const CONDICAO: Record<SolidConfigId, string> = {
  bloco: 'D', prisma: 'V', piramide: 'V', revolucao: 'V', semelhanca: 'V₂/V₁',
};

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

function arco(f: Extract<Forma, { tipo: 'elipse' }>): string {
  // Na tela o Y cresce para baixo: a metade da frente é a de baixo.
  return `M${f.c[0] - f.rx} ${f.c[1]} A${f.rx} ${f.ry} 0 0 ${f.arco === 'frente' ? 0 : 1} ${f.c[0] + f.rx} ${f.c[1]}`;
}

function Peca({ forma }: { forma: Forma }) {
  if (forma.tipo === 'linha') {
    return <line className="vs-solid-line" data-estilo={forma.estilo} x1={forma.a[0]} y1={forma.a[1]} x2={forma.b[0]} y2={forma.b[1]} />;
  }
  if (forma.tipo === 'poligono') {
    return <polygon className="vs-solid-poly" data-estilo={forma.estilo} points={forma.pontos.map((p) => `${p[0]},${p[1]}`).join(' ')} />;
  }
  if (forma.tipo === 'elipse') {
    return forma.arco === 'inteira'
      ? <ellipse className="vs-solid-line vs-solid-poly" data-estilo={forma.estilo} cx={forma.c[0]} cy={forma.c[1]} rx={forma.rx} ry={forma.ry} />
      : <path className="vs-solid-line" data-estilo={forma.estilo} d={arco(forma)} />;
  }
  return <text className="vs-solid-label" x={forma.p[0]} y={forma.p[1]} textAnchor="middle">{forma.texto}</text>;
}

export function solidInstrument(id: SolidConfigId) {
  const config = SOLID_CONFIGS[id];

  return function SolidBoard(props: BoardProps) {
    const par = boardPair(props);
    const inicial = estadoInicial(config);
    const [valores, setValores] = useState(inicial.valores);
    const [forma, setForma] = useState(inicial.forma);

    const visiveis = config.controlesVisiveis && forma ? config.controlesVisiveis(forma) : config.controles.map((c) => c.id);
    const controles = config.controles.filter((c) => visiveis.includes(c.id));
    const leituras = config.leituras(valores, forma);
    const pivo = leituras.find((l) => l.pivot) ?? leituras[0];
    const nome = config.formas?.find((item) => item.id === forma)?.label ?? config.name;
    const medidas = controles.map((c) => `${c.rotulo} = ${formatar(valores[c.id])}`).join(', ');

    const noPrimeiro = props.map.nodes[1] ?? props.map.nodes[0] ?? null;
    const noSegundo = props.map.nodes[2] ?? props.map.nodes[props.map.nodes.length - 1] ?? null;

    return (
      <BoardShell
        kicker="Prancha manipulável"
        title={config.name}
        subtitle={config.question}
        condition={{ label: CONDICAO[id], value: pivo.value }}
        ariaLabel={`Prancha manipulável de sólidos: ${props.map.title}`}
        emphasis={par.emphasis}
        scene={
          <div className="vs-instrument vs-solid-instrument">
            <svg
              className="vs-plane vs-solid"
              viewBox={`0 0 ${LARGURA} ${ALTURA}`}
              role="img"
              data-destaque={par.emphasis !== 'nenhum' ? 'true' : undefined}
              aria-label={`${nome}: ${medidas}`}
            >
              {desenhar(id, valores, forma).map((peca, i) => <Peca key={i} forma={peca} />)}
            </svg>
            <p className="vs-instrument-dica">mexa nos controles: o desenho e as leituras acompanham</p>

            {config.formas && (
              <fieldset className="vs-solid-formas">
                <legend>Sólido</legend>
                {config.formas.map((opcao) => (
                  <label key={opcao.id}>
                    <input
                      type="radio"
                      name={`${config.id}-forma`}
                      value={opcao.id}
                      checked={forma === opcao.id}
                      onChange={() => setForma(opcao.id)}
                    />
                    {opcao.label}
                  </label>
                ))}
              </fieldset>
            )}

            <div className="vs-plane-controls">
              {controles.map((c) => (
                <div className="vs-plane-control" key={c.id}>
                  <label htmlFor={`${config.id}-${c.id}`}>
                    <strong>{c.rotulo}</strong>
                    <span>{c.descricao}</span>
                    <b>{formatar(valores[c.id])}</b>
                  </label>
                  <input
                    id={`${config.id}-${c.id}`}
                    type="range"
                    min={c.min}
                    max={c.max}
                    step={c.passo}
                    value={valores[c.id]}
                    onChange={(e) => setValores((atual) => ({ ...atual, [c.id]: Number(e.target.value) }))}
                  />
                </div>
              ))}
            </div>

            <dl className="vs-plane-readouts">
              {leituras.map((l) => (
                <div key={l.label} data-pivot={l.pivot ? 'true' : undefined}>
                  <dt>{l.label}</dt>
                  <dd>{l.value}</dd>
                </div>
              ))}
            </dl>
            <p className="vs-solid-unidade">medidas em unidades de comprimento; áreas em u², volumes em u³</p>
          </div>
        }
        left={{
          label: STAGE_LABEL[noPrimeiro?.stage ?? 'conceito'],
          headline: noPrimeiro?.label ?? props.map.title,
          detail: resumir(noPrimeiro?.excerpt),
          formula: config.formula(valores, forma),
        }}
        right={{
          label: STAGE_LABEL[noSegundo?.stage ?? 'aplicacao'],
          headline: noSegundo?.label ?? props.map.title,
          detail: resumir(noSegundo?.excerpt),
          formula: `${pivo.label} = ${pivo.value}`,
        }}
        leftState={par.leftState}
        rightState={par.rightState}
        leftSelected={par.leftSelected}
        rightSelected={par.rightSelected}
        onSelectLeft={par.selectLeft}
        onSelectRight={par.selectRight}
        equation={{ label: 'Leitura principal', general: pivo.label, condition: 'vale', reduced: pivo.value }}
        closing={config.insight}
      />
    );
  };
}
