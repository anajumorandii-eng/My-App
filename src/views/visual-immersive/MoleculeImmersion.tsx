import React, { useEffect, useRef, useState } from 'react';
import { MOLECULAS, ehPolar, type IdMolecula } from '../../lib/geometriaMolecular';
import { ImmersiveShell, useImmersiveCanvas, useImmersiveState, type ImmersivePhase, type TemaDaCena } from './immersiveStage';
import { makeVseprPainter, measureMoleculeStage } from './vseprCanvas';
import { SEQUENCIA } from './vseprStages';

/** A química e as transições vêm dos dados VSEPR; o palco projeta o volume em Canvas 2D. */
const graus = (id: IdMolecula) => `${MOLECULAS[id].anguloGraus.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}°`;

export const VSEPR_PHASES: readonly ImmersivePhase[] = [
  {
    title: ['Duas,', 'opostas.'], kicker: '01 / Linear', rail: 'Linear',
    text: 'Duas nuvens se repelem e ficam em lados opostos no CO₂: 180°.',
    number: graus('CO2'), unit: 'Linear', action: 'Pôr a terceira nuvem', label: 'Ângulo de ligação',
    detail: 'A ligação dupla conta como uma nuvem só: para a geometria importa quantas regiões de elétrons cercam o átomo central, não quantos elétrons há em cada uma.',
    predict: { question: 'Três nuvens fazem qual ângulo?', options: ['90°', '120°'], right: 1, why: 'Três nuvens dividem a volta inteira: 360° ÷ 3 = 120°.' },
  },
  {
    title: ['Três,', 'no plano.'], kicker: '02 / Trigonal plana', rail: 'Trigonal',
    text: 'No BF₃, três nuvens dividem o plano: 360° ÷ 3 = 120°.',
    number: graus('BF3'), unit: 'Trigonal plana', action: 'Pôr a quarta nuvem', label: 'Ângulo de ligação',
    detail: 'O boro fica com seis elétrons na camada de valência, uma exceção à regra do octeto. Sem par livre no átomo central, nada tira as três ligações do plano.',
    predict: { question: 'Quatro nuvens continuam no plano?', options: ['Não, sai do plano', 'Sim, a 90°'], right: 0, why: 'No plano, quatro nuvens ficariam a 90°. Em três dimensões elas chegam a 109,5°, mais longe umas das outras.' },
  },
  {
    title: ['Quatro,', 'no espaço.'], kicker: '03 / Tetraédrica', rail: 'Tetraedro',
    text: 'No CH₄, quatro nuvens formam um tetraedro. Gire para ver o volume.',
    number: graus('CH4'), unit: 'Tetraédrica', action: 'Trocar uma ligação por par livre', label: 'Ângulo de ligação',
    detail: 'No papel o metano costuma ser desenhado em cruz, com 90°. É só a projeção: no espaço as ligações ficam a 109,5°, e é por isso que a geometria precisa ser vista em três dimensões.',
    predict: { question: 'Um par livre faz o ângulo...', options: ['Abre', 'Fecha'], right: 1, why: 'O par livre fica preso a um núcleo só, se espalha mais e empurra as ligações umas contra as outras.' },
  },
  {
    title: ['Um par', 'empurra.'], kicker: '04 / Piramidal', rail: 'Pirâmide',
    text: 'No NH₃, o par livre ocupa mais espaço: comprime as ligações a 107°.',
    number: graus('NH3'), unit: 'Piramidal', action: 'Pôr o segundo par livre', label: 'Par livre',
    detail: 'O arranjo das quatro nuvens ainda é quase tetraédrico. A geometria molecular descreve onde estão os átomos; o par livre não aparece no nome, mas é ele que define a forma.',
    predict: { question: 'Com dois pares livres, a água fica...', options: ['Angular', 'Linear'], right: 0, why: 'Os dois pares livres empurram as duas ligações para o mesmo lado. Linear seria se não houvesse par livre no oxigênio.' },
  },
  {
    title: ['Polar', 'ou apolar?'], kicker: '05 / Compare a polaridade', rail: 'Polar',
    text: 'Na água, os dipolos se somam: a molécula é polar.',
    number: graus('H2O'), unit: 'Angular · polar', action: 'Rever a experiência', label: 'Dipolo resultante',
    detail: 'Na água, dois pares livres fecham o ângulo a 104,5°; cada dipolo aponta para o oxigênio. Ligação polar não basta: a soma dos vetores depende da geometria e decide a polaridade da molécula.',
  },
];

/** O cenário de comparação da última etapa: o CO₂ da primeira, agora com os dipolos à mostra. */
const CO2_COMPARADO = {
  text: 'No CO₂, os dipolos apontam para os oxigênios, em sentidos opostos: a soma é zero e a molécula é apolar.',
  detail: 'É a pegadinha clássica: CO₂ tem ligações polares e é apolar; H₂O tem ligações polares e é polar. A diferença está só na geometria.',
  reading: { number: 'μ = 0', unit: 'Linear · apolar' },
  label: 'Dipolos opostos',
};

export default function MoleculeImmersion({ temaInicial, onPractice }: { temaInicial?: TemaDaCena; onPractice?: () => void }) {
  const state = useImmersiveState(VSEPR_PHASES, temaInicial);
  const [comparado, setComparado] = useState<'H2O' | 'CO2'>('H2O');
  const hotspot = useRef<HTMLButtonElement>(null);
  const painter = useRef<ReturnType<typeof makeVseprPainter> | null>(null);
  if (!painter.current) painter.current = makeVseprPainter();
  const ultima = state.phase === VSEPR_PHASES.length - 1;
  const id: IdMolecula = ultima ? comparado : SEQUENCIA[state.phase];
  const co2 = ultima && comparado === 'CO2';
  const refs = useImmersiveCanvas({
    state, variant: `${id}:${ultima}`, autoSpin: 0,
    camera: { rotation: .82, tilt: .55, tiltLimit: 1.1 },
    draw: frame => painter.current!(frame, id, ultima, measureMoleculeStage(refs.shell.current, frame), hotspot.current),
  });

  // Voltar a qualquer etapa recomeça a comparação pela água.
  const fase = state.phase;
  useEffect(() => { if (fase !== VSEPR_PHASES.length - 1) setComparado('H2O'); }, [fase]);

  const m = MOLECULAS[id];
  const livres = m.paresNaoLigantes === 0 ? 'nenhum par livre' : m.paresNaoLigantes === 1 ? '1 par livre' : `${m.paresNaoLigantes} pares livres`;
  const descricao = `Molécula de ${m.formula} em três dimensões: ${m.paresLigantes + m.paresNaoLigantes} nuvens de elétrons no ${m.central}, ${livres}; geometria ${m.geometria}, ângulo de ${graus(id)}; molécula ${ehPolar(m) ? 'polar' : 'apolar'}.`;

  return <ImmersiveShell state={state} phases={VSEPR_PHASES} refs={{ ...refs, hotspot }}
      sectionLabel="Cena imersiva de geometria molecular" canvasLabel={descricao}
      eyebrow="Geometria molecular · Repulsão das nuvens" indicator="Exploração da molécula" watermark="∢" objeto="molécula"
      footNote="Ângulos dos livros; tamanhos fora de escala"
      reading={co2 ? CO2_COMPARADO.reading : undefined} label={co2 ? CO2_COMPARADO.label : undefined}
      text={co2 ? CO2_COMPARADO.text : undefined} detailText={co2 ? CO2_COMPARADO.detail : undefined}
      hotspotHint={ultima ? 'Compare os dipolos' : 'Toque para explorar'}>
      {ultima && <div className="cr-compare" role="group" aria-label="Molécula comparada">
        <button type="button" className="cr-choice" aria-pressed={comparado === 'H2O'} onClick={() => setComparado('H2O')}>H₂O, angular</button>
        <button type="button" className="cr-choice" aria-pressed={comparado === 'CO2'} onClick={() => setComparado('CO2')}>CO₂, linear</button>
      </div>}
      {ultima && onPractice && <div className="cr-compare">
        <button type="button" className="cr-practice" onClick={onPractice}>Testar o que entendi</button>
      </div>}
  </ImmersiveShell>;
}
