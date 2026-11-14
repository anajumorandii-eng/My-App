import React, { useEffect, useRef, useState } from 'react';
import { MOLECULAS, ehPolar, type IdMolecula } from '../../lib/geometriaMolecular';
import { ImmersiveShell, TINTA_BASE, useImmersiveState, type ImmersivePhase, type TemaDaCena } from './immersiveStage';
import type { CenaVsepr, IdRotuloVsepr } from './motorVsepr';
import { ESTAGIOS, SEQUENCIA } from './vseprStages';

/**
 * Cena imersiva de geometria molecular: uma molécula que vira a seguinte.
 *
 * Terceira cena imersiva e a primeira em WebGL. A PCR e a de Lenz desenham em
 * Canvas 2D, e isso basta para elas; aqui o assunto é o volume (o tetraedro
 * que sai do plano, a pirâmide que de frente parece triângulo), e a Ana Júlia
 * pediu para ver a mesma linguagem com 3D de verdade antes de decidir o padrão.
 *
 * As etapas seguem a ordem dos livros — 2, 3 e 4 nuvens, depois um e dois
 * pares livres — e a última desfaz a pegadinha de prova: CO₂ e H₂O têm, as
 * duas, ligações polares, e só uma é polar. Ângulos, contagem de nuvens e
 * polaridade saem de `lib/geometriaMolecular.ts`; a cena não grava nada.
 */
const graus = (id: IdMolecula) => `${MOLECULAS[id].anguloGraus.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}°`;

export const VSEPR_PHASES: readonly ImmersivePhase[] = [
  {
    title: ['Duas,', 'opostas.'], kicker: '01 / Linear', rail: 'Linear',
    text: 'Em volta do carbono do CO₂ há duas nuvens de elétrons, uma para cada oxigênio. Nuvens se repelem, e o mais longe que duas conseguem ficar é em lados opostos.',
    number: graus('CO2'), unit: 'Linear', action: 'Pôr a terceira nuvem', label: 'Ângulo de ligação',
    detail: 'A ligação dupla conta como uma nuvem só: para a geometria importa quantas regiões de elétrons cercam o átomo central, não quantos elétrons há em cada uma.',
    predict: { question: 'Com três nuvens em volta do átomo central, o ângulo entre elas fica em...', options: ['90°', '120°'], right: 1, why: 'Três nuvens dividem a volta inteira: 360° ÷ 3 = 120°.' },
  },
  {
    title: ['Três,', 'no plano.'], kicker: '02 / Trigonal plana', rail: 'Trigonal',
    text: 'No BF₃ o boro tem três nuvens. Elas dividem a volta em partes iguais e ficam no mesmo plano, apontando para os vértices de um triângulo.',
    number: graus('BF3'), unit: 'Trigonal plana', action: 'Pôr a quarta nuvem', label: 'Ângulo de ligação',
    detail: 'O boro fica com seis elétrons na camada de valência, uma exceção à regra do octeto. Sem par livre no átomo central, nada tira as três ligações do plano.',
    predict: { question: 'Com quatro nuvens, a molécula continua plana?', options: ['Não, sai do plano', 'Sim, com 90° entre elas'], right: 0, why: 'No plano, quatro nuvens ficariam a 90°. Em três dimensões elas chegam a 109,5°, mais longe umas das outras.' },
  },
  {
    title: ['Quatro,', 'no espaço.'], kicker: '03 / Tetraédrica', rail: 'Tetraedro',
    text: 'No CH₄, a quarta nuvem empurra as outras três para baixo. As quatro apontam para os vértices de um tetraedro. Gire a molécula: de qualquer lado, o ângulo é o mesmo.',
    number: graus('CH4'), unit: 'Tetraédrica', action: 'Trocar uma ligação por par livre', label: 'Ângulo de ligação',
    detail: 'No papel o metano costuma ser desenhado em cruz, com 90°. É só a projeção: no espaço as ligações ficam a 109,5°, e é por isso que a geometria precisa ser vista em três dimensões.',
    predict: { question: 'Se uma das quatro nuvens for um par livre, o ângulo entre as ligações...', options: ['Abre', 'Fecha'], right: 1, why: 'O par livre fica preso a um núcleo só, se espalha mais e empurra as ligações umas contra as outras.' },
  },
  {
    title: ['Um par', 'empurra.'], kicker: '04 / Piramidal', rail: 'Pirâmide',
    text: 'No NH₃ continuam quatro nuvens, mas uma é um par livre. Ele ocupa mais espaço que uma ligação e fecha o ângulo para 107°. O nome da geometria olha só para os átomos: pirâmide.',
    number: graus('NH3'), unit: 'Piramidal', action: 'Pôr o segundo par livre', label: 'Par livre',
    detail: 'O arranjo das quatro nuvens ainda é quase tetraédrico. A geometria molecular descreve onde estão os átomos; o par livre não aparece no nome, mas é ele que define a forma.',
    predict: { question: 'Com dois pares livres, a água fica...', options: ['Angular', 'Linear'], right: 0, why: 'Os dois pares livres empurram as duas ligações para o mesmo lado. Linear seria se não houvesse par livre no oxigênio.' },
  },
  {
    title: ['Polar', 'ou apolar?'], kicker: '05 / Compare a polaridade', rail: 'Polar',
    text: 'Na água, dois pares livres fecham o ângulo para 104,5°. Os dipolos das duas ligações apontam para o oxigênio e se somam: a molécula é polar.',
    number: graus('H2O'), unit: 'Angular · polar', action: 'Rever a experiência', label: 'Dipolo resultante',
    detail: 'Ligação polar não basta para a molécula ser polar. O que decide é a soma dos vetores, e a soma depende da geometria.',
  },
];

/** O cenário de comparação da última etapa: o CO₂ da primeira, agora com os dipolos à mostra. */
const CO2_COMPARADO = {
  text: 'No CO₂ cada ligação também é polar, com o dipolo apontando para o oxigênio. Mas os dois são iguais e opostos: a soma é zero e a molécula é apolar.',
  detail: 'É a pegadinha clássica: CO₂ tem ligações polares e é apolar; H₂O tem ligações polares e é polar. A diferença está só na geometria.',
  reading: { number: 'μ = 0', unit: 'Linear · apolar' },
  label: 'Ângulo de ligação',
};

/** Na tinta de caderno o estúdio escurece o acento; parte-se de um vinho mais claro para chegar ao da cena. */
const ACENTO: Record<TemaDaCena, string> = { noite: TINTA_BASE.noite.acento, caderno: '#c9405f' };

export default function MoleculeImmersion({ temaInicial }: { temaInicial?: TemaDaCena; onPractice?: () => void }) {
  const state = useImmersiveState(VSEPR_PHASES, temaInicial);
  const [comparado, setComparado] = useState<'H2O' | 'CO2'>('H2O');
  const [semWebgl, setSemWebgl] = useState(false);
  const shell = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), hotspot = useRef<HTMLButtonElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const cena = useRef<CenaVsepr | null>(null);
  const rotulos = useRef<Partial<Record<IdRotuloVsepr, HTMLElement | null>>>({});
  const guardar = (id: IdRotuloVsepr) => (el: HTMLElement | null) => { rotulos.current[id] = el; };

  /**
   * O espaço que sobra para a molécula, medido na casca a cada desenho, e o
   * lugar da etiqueta de exploração, que fica fora dele. Nas cenas 2D a
   * etiqueta segue um ponto da cena com um fio; aqui a molécula gira nas mãos
   * da estudante e a etiqueta ficava passando por cima dos átomos.
   */
  const espacoLivre = (w: number) => {
    const casca = shell.current, botao = hotspot.current;
    const topoDe = (seletor: string) => {
      const alvo = casca?.querySelector(seletor);
      return alvo && casca ? alvo.getBoundingClientRect().top - casca.getBoundingClientRect().top : 400;
    };
    const texto = topoDe('.cr-copy');
    const celular = w < 641, etiqueta = 58;
    // No iPad há uma faixa vazia à direita do texto, e a etiqueta vai para lá;
    // no computador e no celular o texto ocupa a largura, e ela fica logo acima.
    const aoLado = !celular && w >= 760;
    const topo = celular ? 150 : 118, base = aoLado ? texto - 8 : texto - etiqueta - 10;
    if (botao) {
      botao.style.left = `${celular ? 18 : w - 252}px`;
      // `top` é o centro da etiqueta: a folha de estilo a sobe meia altura.
      botao.style.top = `${aoLado ? texto + 40 : texto - etiqueta / 2 - 6}px`;
    }
    const tamanho = Math.max(60, Math.min(base - topo, w * (celular ? 0.46 : 0.4)));
    return { cx: w * (celular ? 0.6 : 0.69), cy: (topo + base) / 2, tamanho };
  };

  const ultima = state.phase === VSEPR_PHASES.length - 1;
  const id: IdMolecula = ultima ? comparado : SEQUENCIA[state.phase];
  const co2 = ultima && comparado === 'CO2';
  const parado = state.paused || state.reduced;
  const cores = { acento: ACENTO[state.tema], escuro: state.tema === 'noite' };

  // O que o motor precisa na montagem entra por referência: recriá-lo a cada
  // clique trocaria a transição por um corte.
  // A montagem é assíncrona (o motor é baixado sob demanda): quando ele chega,
  // recebe o estado deste momento, não o de quando a cena abriu.
  const atual = useRef({ id, cores, dipolo: ultima, zoom: state.zoomed });
  atual.current = { id, cores, dipolo: ultima, zoom: state.zoomed };
  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    let vivo = true;
    // O three.js só é baixado quando esta cena abre.
    import('./motorVsepr').then(({ montarVsepr }) => {
      if (!vivo) return;
      try {
        const montada = montarVsepr(el, rotulos.current, atual.current.cores, atual.current, espacoLivre);
        if (atual.current.zoom) montada.aproximar(true, true);
        cena.current = montada;
      } catch {
        // Sem WebGL a cena fica com o texto das etapas, que se sustenta sozinho;
        // o esquema plano do capítulo continua a um toque.
        setSemWebgl(true);
      }
    }).catch(() => { if (vivo) setSemWebgl(true); });
    return () => { vivo = false; cena.current?.destruir(); cena.current = null; };
  }, []);

  useEffect(() => { cena.current?.definir(id, { dipolo: ultima, instantaneo: parado }); }, [id, ultima, parado]);
  useEffect(() => { cena.current?.aproximar(state.zoomed, parado); }, [state.zoomed, parado]);
  useEffect(() => { cena.current?.configurar({ acento: ACENTO[state.tema], escuro: state.tema === 'noite' }); }, [state.tema]);

  // Texto, previsão e detalhe mudam a altura do bloco de baixo, e com ela o
  // espaço da molécula.
  useEffect(() => { cena.current?.reenquadrar(); }, [state.phase, state.detail, state.previsao, comparado]);

  // Voltar a qualquer etapa recomeça a comparação pela água.
  const fase = state.phase;
  useEffect(() => { if (fase !== VSEPR_PHASES.length - 1) setComparado('H2O'); }, [fase]);

  const m = MOLECULAS[id];
  const { nuvens } = ESTAGIOS[id];
  const livres = m.paresNaoLigantes === 0 ? 'nenhum par livre' : m.paresNaoLigantes === 1 ? '1 par livre' : `${m.paresNaoLigantes} pares livres`;
  const descricao = `Molécula de ${m.formula} em três dimensões: ${m.paresLigantes + m.paresNaoLigantes} nuvens de elétrons no ${m.central}, ${livres}; geometria ${m.geometria}, ângulo de ${graus(id)}; molécula ${ehPolar(m) ? 'polar' : 'apolar'}.`;

  return <ImmersiveShell state={state} phases={VSEPR_PHASES} refs={{ shell, canvas, hotspot }}
      sectionLabel="Cena imersiva de geometria molecular" canvasLabel={descricao}
      eyebrow="Geometria molecular · Repulsão das nuvens" indicator="Exploração da molécula" watermark="∢" objeto="molécula"
      onTurn={() => cena.current?.girar(1, parado)}
      footNote={semWebgl ? 'Este aparelho não desenhou a cena 3D' : 'Ângulos dos livros; tamanhos fora de escala'}
      reading={co2 ? CO2_COMPARADO.reading : undefined} label={co2 ? CO2_COMPARADO.label : undefined}
      text={co2 ? CO2_COMPARADO.text : undefined} detailText={co2 ? CO2_COMPARADO.detail : undefined}
      stage={<div ref={palco} className="cr-stage3d" role="img" aria-label={descricao}>
        <span ref={guardar('central')} className="crivo-cena__rotulo crivo-cena__rotulo--forte" aria-hidden="true">{m.central}</span>
        {nuvens.map((n, i) => <span key={i} ref={guardar(`n${i}` as IdRotuloVsepr)} className="crivo-cena__rotulo" aria-hidden="true">{n.tipo === 'ligacao' ? m.ligante : ''}</span>)}
        <span ref={guardar('angulo')} className="crivo-cena__rotulo crivo-cena__rotulo--cota" aria-hidden="true">{graus(id)}</span>
      </div>}>
      {ultima && <div className="cr-compare" role="group" aria-label="Molécula comparada">
        <button type="button" className="cr-choice" aria-pressed={comparado === 'H2O'} onClick={() => setComparado('H2O')}>H₂O, angular</button>
        <button type="button" className="cr-choice" aria-pressed={comparado === 'CO2'} onClick={() => setComparado('CO2')}>CO₂, linear</button>
      </div>}
  </ImmersiveShell>;
}
