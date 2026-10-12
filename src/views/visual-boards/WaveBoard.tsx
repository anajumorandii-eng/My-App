import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import WaveMechanism, { type WaveKind } from './WaveMechanism';

type Leitura = {
  subtitle: string;
  condition: { label: string; value: string };
  ariaLabel: string;
  equation: { label: string; general: string; condition: string; reduced: string };
  closing: string;
};

// A prancha atende três capítulos e o mecanismo já mudava com o capítulo, mas
// condição, equação e ideia central eram as da equação fundamental nos três:
// Ondas Eletromagnéticas lia "v fixa no mesmo meio" sem citar c nem o vácuo, e
// Som não dizia os 340 m/s que o próprio resumo usa. Os números vêm dos resumos.
const LEITURA: Record<WaveKind, Leitura> = {
  transverse: {
    subtitle: 'Uma perturbação que transporta energia sem transportar matéria.',
    condition: { label: 'no mesmo meio', value: 'v fixa' },
    ariaLabel: 'Prancha ilustrada da equação fundamental da ondulatória',
    equation: { label: 'Equação fundamental', general: 'v = λ · f', condition: 'com v constante', reduced: 'λ ∝ 1/f' },
    closing: 'a velocidade da onda é do meio, a frequência é da fonte, e o comprimento é o que sobra da razão entre as duas.',
  },
  sound: {
    subtitle: 'Onda mecânica longitudinal: precisa de meio e não atravessa o vácuo.',
    condition: { label: 'no ar', value: '≈ 340 m/s' },
    ariaLabel: 'Prancha ilustrada do som e suas propriedades',
    equation: { label: 'Som no ar', general: 'v = λ · f', condition: 'v ≈ 340 m/s', reduced: 'agudo: f maior, λ menor' },
    closing: 'a frequência decide grave ou agudo, a amplitude decide forte ou fraco, e o meio decide a velocidade — no vácuo não há som.',
  },
  electromagnetic: {
    subtitle: 'Campos elétrico e magnético que se sustentam, mesmo sem meio material.',
    condition: { label: 'no vácuo', value: 'c fixa' },
    ariaLabel: 'Prancha ilustrada de ondas eletromagnéticas',
    equation: { label: 'No vácuo', general: 'c = λ · f', condition: 'c ≈ 3×10⁸ m/s', reduced: 'λ ∝ 1/f' },
    closing: 'no vácuo todas as faixas do espectro andam a c; o que distingue rádio, luz e raios X é a frequência, e λ acompanha.',
  },
};

export default function WaveBoard(props: BoardProps) {
  const par = boardPair(props, { porEtapa: true });
  const kind: WaveKind = props.map.summaryId.endsWith('som-e-suas-propriedades') ? 'sound' : props.map.summaryId.endsWith('ondas-eletromagneticas') ? 'electromagnetic' : 'transverse';
  const leitura = LEITURA[kind];
  return (
    <BoardShell palco
      title={kind === 'sound' ? 'Som: compressões que se propagam' : kind === 'electromagnetic' ? 'Ondas eletromagnéticas' : 'Onda: comprimento e frequência'}
      subtitle={leitura.subtitle}
      condition={leitura.condition}
      ariaLabel={leitura.ariaLabel}
      scene={<WaveMechanism kind={kind} />}
      sceneFirst
      emphasis={par.emphasis}
      left={{
        label: 'Comprimento de onda',
        headline: 'A distância que se repete.',
        detail: kind === 'sound' ? 'Distância entre duas compressões consecutivas. Quanto maior λ, menor f para a mesma velocidade.' : 'Medida de uma crista à crista seguinte. Quanto maior λ, menor a frequência para a mesma velocidade.',
        formula: 'λ = v / f',
      }}
      right={{
        label: 'Frequência',
        headline: 'Quantas vezes por segundo.',
        detail: 'Depende da fonte, não do meio: ao mudar de meio a frequência se conserva e o comprimento é que se ajusta.',
        formula: 'f = 1 / T · [Hz]',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={leitura.equation}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Não confundir</span>
            <strong>{kind === 'sound' ? 'Amplitude não é altura musical' : kind === 'electromagnetic' ? 'A amplitude é dos campos' : 'λ é horizontal; A é vertical'}</strong>
            <p>{kind === 'sound' ? 'A frequência distingue grave e agudo. A amplitude da oscilação se relaciona à intensidade, não à frequência.' : kind === 'electromagnetic' ? 'E e B oscilam perpendicularmente à propagação. As amplitudes dos dois campos têm unidades diferentes.' : 'A amplitude vai do eixo até a crista — não de crista a vale. Metade da altura total.'}</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Ao mudar de meio</span>
            <strong>f se conserva</strong>
            <strong>v e λ mudam</strong>
            <p>Quem impõe a frequência é a fonte. O meio só altera a velocidade, e λ acompanha.</p>
          </section>
        </>
      }
      closing={leitura.closing}
    />
  );
}
