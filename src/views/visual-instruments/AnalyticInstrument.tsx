import React, { useRef, useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import type { BoardProps } from '../visual-boards/types';
import {
  CONFIGS, afastarDosEixos, baricentro, escreverReta, num, pontoMedio, projecaoNaReta,
  type AnalyticConfig, type ConfigId, type Ponto, type Reta,
} from '../../lib/analyticPlane';

/**
 * Plano analítico com um ponto que a estudante arrasta.
 *
 * A diferença para o instrumento cartesiano é a forma da manipulação, e ela sai
 * do conteúdo: função é uma curva com parâmetros, e parâmetro se move em
 * controle deslizante; geometria analítica é um ponto num plano, e ponto se
 * arrasta. A distância de um ponto a uma reta só vira intuição quando se vê o
 * número mudar enquanto o ponto anda — e crescer em qualquer direção que não
 * seja a perpendicular.
 *
 * Também traz um controle deslizante para cada coordenada: arrastar não é
 * alcançável por teclado, e sem eles a prancha ficaria fora do alcance de quem
 * não usa mouse ou toque.
 */
const LARGURA = 320;
const ALTURA = 300;
const MARGEM = 26;

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

function PlanoAnalitico({
  config, ponto, onMover, destaque,
}: {
  config: AnalyticConfig;
  ponto: Ponto;
  onMover: (p: Ponto) => void;
  destaque: boolean;
}) {
  const svg = useRef<SVGSVGElement | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const { alcance } = config;

  const util = Math.min(LARGURA, ALTURA) - MARGEM * 2;
  const escala = util / (alcance * 2);
  const ox = LARGURA / 2;
  const oy = ALTURA / 2;
  const tx = (x: number) => ox + x * escala;
  const ty = (y: number) => oy - y * escala;

  /** Converte a posição do ponteiro para coordenadas do plano. */
  const doPonteiro = (e: React.PointerEvent): Ponto | null => {
    const el = svg.current;
    if (!el) return null;
    const caixa = el.getBoundingClientRect();
    const px = ((e.clientX - caixa.left) / caixa.width) * LARGURA;
    const py = ((e.clientY - caixa.top) / caixa.height) * ALTURA;
    const limite = (v: number) => Math.max(-alcance, Math.min(alcance, v));
    // Arredonda em décimos: sem isso a leitura tremula em dígitos que não
    // significam nada e fica difícil parar num valor redondo.
    return {
      x: limite(Math.round(((px - ox) / escala) * 10) / 10),
      y: limite(Math.round(((oy - py) / escala) * 10) / 10),
    };
  };

  /** A reta atravessando a moldura inteira, para não parecer um segmento. */
  const traçarReta = (r: Reta) => {
    const pontos: Array<[number, number]> = [];
    if (Math.abs(r.b) > 1e-9) {
      for (const x of [-alcance, alcance]) pontos.push([x, (-r.a * x - r.c) / r.b]);
    } else {
      const x = -r.c / r.a;
      pontos.push([x, -alcance], [x, alcance]);
    }
    return `M${tx(pontos[0][0])} ${ty(pontos[0][1])} L${tx(pontos[1][0])} ${ty(pontos[1][1])}`;
  };

  const marcas = Array.from({ length: alcance * 2 + 1 }, (_, i) => i - alcance).filter((v) => v !== 0);
  // A reta do ponto, quando existe, é a que o desenho e a medida usam.
  const retaViva = config.retaDe ? config.retaDe(ponto) : null;
  // Na configuração de reta e circunferência o que se mede é a distância do
  // CENTRO à reta, não a do ponto: é ela que a leitura compara com o raio.
  const origemDaMedida = config.circulo && retaViva ? { x: config.circulo.cx, y: config.circulo.cy } : ponto;
  const retaMedida = retaViva ?? config.reta ?? null;
  const pe = retaMedida ? projecaoNaReta(origemDaMedida, retaMedida) : null;

  return (
    <svg
      ref={svg}
      className="vs-plane vs-analytic"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      role="img"
      data-destaque={destaque ? 'true' : undefined}
      aria-label={`Plano cartesiano com o ponto ${config.rotulo} em ${num(ponto.x)}, ${num(ponto.y)}`}
      onPointerMove={(e) => { if (arrastando) { const p = doPonteiro(e); if (p) onMover(p); } }}
      onPointerUp={() => setArrastando(false)}
      onPointerCancel={() => setArrastando(false)}
    >
      <g className="vs-plane-grid">
        {marcas.map((v) => <line key={`gx${v}`} x1={tx(v)} y1={ty(alcance)} x2={tx(v)} y2={ty(-alcance)} />)}
        {marcas.map((v) => <line key={`gy${v}`} x1={tx(-alcance)} y1={ty(v)} x2={tx(alcance)} y2={ty(v)} />)}
      </g>
      <g className="vs-plane-axis">
        <line x1={tx(-alcance)} y1={oy} x2={tx(alcance)} y2={oy} />
        <line x1={ox} y1={ty(alcance)} x2={ox} y2={ty(-alcance)} />
        {marcas.filter((v) => v % 2 === 0).map((v) => (
          <text key={`tx${v}`} x={tx(v)} y={oy + 12} textAnchor="middle">{v}</text>
        ))}
        {/* O eixo vertical também precisa de número: sem eles, ler a ordenada do
            ponto arrastado vira contagem de quadradinhos. */}
        {marcas.filter((v) => v % 2 === 0).map((v) => (
          <text key={`ty${v}`} x={ox - 6} y={ty(v) + 3.5} textAnchor="end">{v}</text>
        ))}
      </g>

      {config.circulo && (
        <circle className="vs-analytic-circle" cx={tx(config.circulo.cx)} cy={ty(config.circulo.cy)} r={config.circulo.r * escala} />
      )}
      {config.reta && <path className="vs-analytic-line" d={traçarReta(config.reta)} />}
      {retaViva && <path className="vs-analytic-line vs-analytic-line--alt" d={traçarReta(retaViva)} />}
      {config.reta2 && <path className="vs-analytic-line vs-analytic-line--alt" d={traçarReta(config.reta2)} />}

      {/* A perpendicular medida: é o segmento que a leitura de distância nomeia. */}
      {pe && (
        <path className="vs-analytic-drop" d={`M${tx(origemDaMedida.x)} ${ty(origemDaMedida.y)} L${tx(pe.x)} ${ty(pe.y)}`} />
      )}
      {config.circulo && !retaMedida && (
        <path className="vs-analytic-drop" d={`M${tx(config.circulo.cx)} ${ty(config.circulo.cy)} L${tx(ponto.x)} ${ty(ponto.y)}`} />
      )}
      {config.id === 'complexo' && (
        <path className="vs-analytic-drop" d={`M${ox} ${oy} L${tx(ponto.x)} ${ty(ponto.y)}`} />
      )}

      {config.triangulo && config.fixo && (
        <polygon
          className="vs-analytic-triangle"
          points={[config.fixo, ...(config.outros ?? []).map((o) => o.p), ponto].map((q) => `${tx(q.x)},${ty(q.y)}`).join(' ')}
        />
      )}

      {config.medianas && config.fixo && config.outros?.[0] && (() => {
        const vs = [config.fixo, config.outros[0].p, ponto];
        const g = baricentro(vs[0], vs[1], vs[2]);
        return (
          <g className="vs-analytic-medians">
            {vs.map((v, i) => {
              const m = pontoMedio(vs[(i + 1) % 3], vs[(i + 2) % 3]);
              return (
                <g key={i}>
                  <path d={`M${tx(v.x)} ${ty(v.y)} L${tx(m.x)} ${ty(m.y)}`} />
                  <circle className="vs-analytic-midpoint" cx={tx(m.x)} cy={ty(m.y)} r="3" />
                </g>
              );
            })}
            <circle className="vs-analytic-centroid" cx={tx(g.x)} cy={ty(g.y)} r="4.5" />
          </g>
        );
      })()}

      {config.outros?.map((o) => (
        <g className="vs-analytic-fixed" key={o.rotulo}>
          <circle cx={tx(o.p.x)} cy={ty(o.p.y)} r="5" />
          <text x={tx(o.p.x) + (o.p.x >= 0 ? 10 : -10)} y={ty(o.p.y) + 4} textAnchor={o.p.x >= 0 ? 'start' : 'end'}>{o.rotulo}</text>
        </g>
      ))}

      {config.fixo && (
        <g className="vs-analytic-fixed">
          <circle cx={tx(config.fixo.x)} cy={ty(config.fixo.y)} r="5" />
          <text x={tx(config.fixo.x) - 10} y={ty(config.fixo.y) + 4} textAnchor="end">A</text>
          {/* No triângulo com medianas nenhum lado é especial; destacar AC em
              vinho sugeria que era. */}
          {!config.medianas && (
            <path className="vs-analytic-segment" d={`M${tx(config.fixo.x)} ${ty(config.fixo.y)} L${tx(ponto.x)} ${ty(ponto.y)}`} />
          )}
        </g>
      )}

      {config.annotations(ponto).map((m) => {
        const ax = tx(m.x);
        const ay = ty(m.y);
        const reposicionar = ['circunferencia', 'ponto-reta', 'complexo'].includes(config.id);
        const largura = m.text.length * (reposicionar ? 5.8 : 4.6);
        const deslocamento = reposicionar ? afastarDosEixos(m.text, m.x, m.y, alcance, [[m.dx, m.dy]], [ponto, ...(config.fixo ? [config.fixo] : []), ...(config.outros ?? []).map(o => o.p)]) : m;
        let lx = Math.min(LARGURA - 8 - largura / 2, Math.max(8 + largura / 2, tx(m.x + deslocamento.dx)));
        let ly = Math.min(ALTURA - 8, Math.max(16, ty(m.y + deslocamento.dy)));
        // O clamp da moldura pode devolver uma nota à faixa das graduações.
        if (reposicionar && lx + largura / 2 > ox - 26 && lx - largura / 2 < ox + 8) {
          lx = lx >= ox ? ox + 12 + largura / 2 : ox - 30 - largura / 2;
        }
        if (reposicionar && ly > oy - 3 && ly < oy + 29) ly = oy - 8;
        if (reposicionar) {
          // Avaliar depois do clamp e da proteção dos eixos: mover só x pode
          // devolver a frase ao ponto e ao nome que o helper já tinha evitado.
          const px = tx(ponto.x), py = ty(ponto.y);
          const ocupaPonto = (baseline: number) => lx + largura / 2 > px - 17 && lx - largura / 2 < px + 28 && baseline + 4 > py - 23 && baseline - 14 < py + 17;
          if (ocupaPonto(ly)) {
            const candidatos = [py - 30, py + 36, 24, ALTURA - 20]
              .filter(y => y >= 16 && y <= ALTURA - 8 && !(y > oy - 3 && y < oy + 29) && !ocupaPonto(y));
            candidatos.sort((a, b) => Math.abs(a - ly) - Math.abs(b - ly));
            ly = candidatos[0] ?? ly;
          }
        }
        const cx = (ax + lx) / 2 + (ay - ly) * 0.22;
        const cy = (ay + ly) / 2 + (lx - ax) * 0.22;
        return (
          <g className="vs-plane-note" key={m.text} data-analytic-note={m.text}>
            <path className="vs-plane-arrow" d={`M${lx.toFixed(1)} ${(ly < ay ? ly + 4 : ly - 9).toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)}`} />
            <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor="middle">{m.text}</text>
          </g>
        );
      })}

      {/* O ponto arrastável. `data-arrastavel` é o que impede o SceneViewport de
          interpretar o gesto como arraste da prancha inteira. */}
      <g
        className="vs-analytic-point"
        data-arrastavel="true"
        data-ativo={arrastando ? 'true' : undefined}
        onPointerDown={(e) => {
          setArrastando(true);
          // A captura vai no SVG, e não no grupo do ponto, porque quem escuta o
          // movimento é o SVG: capturando ali, o arraste segue funcionando
          // mesmo quando o cursor corre à frente do ponto. Por isso também não
          // há `onPointerLeave` — sair da área não deve cancelar um arraste que
          // está capturado.
          svg.current?.setPointerCapture?.(e.pointerId);
          const p = doPonteiro(e);
          if (p) onMover(p);
        }}
      >
        <circle className="vs-analytic-halo" cx={tx(ponto.x)} cy={ty(ponto.y)} r="15" />
        <circle cx={tx(ponto.x)} cy={ty(ponto.y)} r="6.5" />
        <text x={tx(ponto.x) + 11} y={ty(ponto.y) - 9}>{config.rotulo}</text>
      </g>
    </svg>
  );
}

export function analyticInstrument(configId: ConfigId) {
  const config = CONFIGS[configId];

  return function AnalyticBoard(props: BoardProps) {
    const par = boardPair(props);
    const [ponto, setPonto] = useState<Ponto>(config.inicial);

    const leituras = config.readouts(ponto);
    const noPrimeiro = props.map.nodes[1] ?? props.map.nodes[0] ?? null;
    const noSegundo = props.map.nodes[2] ?? props.map.nodes[props.map.nodes.length - 1] ?? null;

    const eixo = (chave: 'x' | 'y') => (
      <div className="vs-plane-control" key={chave}>
        <label htmlFor={`${config.id}-${chave}`}>
          <strong>{chave}</strong>
          <span>coordenada {chave} de {config.rotulo}</span>
          <b>{num(ponto[chave])}</b>
        </label>
        <input
          id={`${config.id}-${chave}`}
          data-analytic-control={chave}
          type="range"
          min={-config.alcance}
          max={config.alcance}
          step={0.1}
          value={ponto[chave]}
          onChange={(e) => setPonto((p) => ({ ...p, [chave]: Number(e.target.value) }))}
        />
      </div>
    );

    return (
      <BoardShell
        kicker="Prancha manipulável"
        title={config.name}
        subtitle={config.question}
        condition={{ label: config.rotulo, value: `(${ponto.x.toFixed(1).replace('.', ',').replace('-', '−')}; ${ponto.y.toFixed(1).replace('.', ',').replace('-', '−')})` }}
        ariaLabel={`Prancha manipulável de geometria analítica: ${props.map.title}`}
        emphasis={par.emphasis}
        scene={
          <div className="vs-instrument">
            <PlanoAnalitico config={config} ponto={ponto} onMover={setPonto} destaque={par.emphasis !== 'nenhum'} />
            <p className="vs-instrument-dica">arraste o ponto {config.rotulo}, ou use os controles</p>
            <div className="vs-plane-controls">{eixo('x')}{eixo('y')}</div>
            <dl className="vs-plane-readouts">
              {leituras.map((l) => (
                <div key={l.label} data-pivot={l.pivot ? 'true' : undefined}>
                  <dt>{l.label}</dt>
                  <dd>{l.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
        left={{
          label: STAGE_LABEL[noPrimeiro?.stage ?? 'conceito'],
          headline: noPrimeiro?.label ?? props.map.title,
          detail: resumir(noPrimeiro?.excerpt),
          formula: config.reta ? escreverReta(config.reta) : `${config.rotulo} = (${num(ponto.x)}; ${num(ponto.y)})`,
        }}
        right={{
          label: STAGE_LABEL[noSegundo?.stage ?? 'aplicacao'],
          headline: noSegundo?.label ?? props.map.title,
          detail: resumir(noSegundo?.excerpt),
          formula: leituras.find((l) => l.pivot)?.value ?? '',
        }}
        leftState={par.leftState}
        rightState={par.rightState}
        leftSelected={par.leftSelected}
        rightSelected={par.rightSelected}
        onSelectLeft={par.selectLeft}
        onSelectRight={par.selectRight}
        equation={{
          label: 'Leitura principal',
          general: leituras.find((l) => l.pivot)?.label ?? '',
          condition: 'vale',
          reduced: leituras.find((l) => l.pivot)?.value ?? '',
        }}
        closing={config.insight}
      />
    );
  };
}
