export type PhysicsRemainingId =
  | 'echo' | 'diffraction' | 'tube-harmonics' | 'quantum-photon'
  | 'circular-motion' | 'electric-field-map' | 'electric-meters' | 'generator'
  | 'receiver' | 'magnet-field' | 'geometric-optics' | 'optical-instruments'
  | 'wave-basics' | 'rope-boundary' | 'string-standing-wave';

export interface PhysicsRemainingReadout { label: string; value: string; pivot?: boolean }
export interface PhysicsRemainingConfig {
  id: PhysicsRemainingId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number };
  formula: string;
  insight: string;
  readouts(value: number): PhysicsRemainingReadout[];
}

const decimal = (value: number) => String(Math.round(value * 100) / 100).replace('.', ',');

export const PHYSICS_REMAINING: Record<PhysicsRemainingId, PhysicsRemainingConfig> = {
  echo: {
    id: 'echo',
    name: 'O eco só se separa quando a onda volta tarde o bastante',
    question: 'Ajuste o intervalo entre emitir um pulso e ouvi-lo voltar; o som viaja a 340 m/s.',
    control: { label: 'Δt', description: 'intervalo de ida e volta, em segundos', min: 0.05, max: 1.2, step: 0.05, initial: 0.3 },
    formula: 'd = v·Δt/2',
    insight: 'o som percorre a distância até o obstáculo e a mesma distância na volta; por isso o tempo medido precisa ser dividido por dois.',
    readouts: time => [{ label: 'Tempo de ida e volta', value: `${decimal(time)} s` }, { label: 'Distância ao obstáculo', value: `${decimal(170 * time)} m`, pivot: true }],
  },
  diffraction: {
    id: 'diffraction',
    name: 'Uma abertura estreita espalha mais a onda',
    question: 'Mude a largura da fenda em comprimentos de onda e observe a abertura do feixe.',
    control: { label: 'a/λ', description: 'largura da fenda em comprimentos de onda', min: 0.5, max: 5, step: 0.5, initial: 1 },
    formula: 'sen θ ≈ λ/a',
    insight: 'quando a abertura tem dimensão comparável ao comprimento de onda, cada ponto da fenda passa a agir como fonte e o feixe se espalha.',
    readouts: ratio => [{ label: 'Largura da fenda', value: `${decimal(ratio)} λ` }, { label: 'Abertura aproximada', value: `${decimal(Math.asin(Math.min(1, 1 / ratio)) * 180 / Math.PI)}°`, pivot: true }],
  },
  'tube-harmonics': {
    id: 'tube-harmonics',
    name: 'Um tubo fechado só admite harmônicos ímpares',
    question: 'Escolha um modo numa coluna de ar de 0,85 m, fechada em uma extremidade.',
    control: { label: 'n', description: 'harmônico ímpar do tubo fechado', min: 1, max: 5, step: 2, initial: 1 },
    formula: 'fₙ = nv/(4L), n = 1, 3, 5…',
    insight: 'a extremidade fechada é nó de deslocamento e a aberta é ventre; essa condição exclui os harmônicos pares.',
    readouts: harmonic => [{ label: 'Modo permitido', value: `${harmonic}º harmônico` }, { label: 'Frequência', value: `${decimal(harmonic * 100)} Hz`, pivot: true }],
  },
  'quantum-photon': {
    id: 'quantum-photon',
    name: 'A frequência do fóton determina o salto de energia',
    question: 'Aumente a frequência da luz incidente e compare a energia de cada fóton.',
    control: { label: 'f', description: 'frequência da luz, em 10¹⁴ Hz', min: 3, max: 12, step: 1, initial: 6 },
    formula: 'E = hf',
    insight: 'luz não entrega energia de modo contínuo: cada fóton carrega h vezes sua frequência, por isso frequências maiores podem alcançar transições maiores.',
    readouts: frequency => [{ label: 'Frequência', value: `${frequency} × 10¹⁴ Hz` }, { label: 'Energia por fóton', value: `${decimal(0.4136 * frequency)} eV`, pivot: true }],
  },
  'circular-motion': {
    id: 'circular-motion', name: 'Na correia, a borda acompanha a mesma velocidade linear',
    question: 'Mude o raio da polia movida: as duas bordas têm a mesma velocidade linear, mas não a mesma velocidade angular.',
    control: { label: 'R₂', description: 'raio da polia movida, em cm', min: 10, max: 40, step: 5, initial: 25 },
    formula: 'v₁ = v₂  →  ω₁R₁ = ω₂R₂',
    insight: 'a correia impõe o mesmo deslocamento linear nas bordas. Por isso, quanto maior a polia movida, menor a sua velocidade angular.',
    readouts: radius => [{ label: 'Raio da polia movida', value: `${radius} cm` }, { label: 'ω₂ (com ω₁ = 30 rad/s e R₁ = 10 cm)', value: `${decimal(300 / radius)} rad/s`, pivot: true }],
  },
  'electric-field-map': {
    id: 'electric-field-map', name: 'Linhas de campo cruzam equipotenciais a 90°',
    question: 'Aproxime-se de uma carga positiva e compare a densidade radial do campo com os círculos de mesmo potencial.',
    control: { label: 'r', description: 'distância à carga, em unidades do mapa', min: 1, max: 5, step: 1, initial: 2 },
    formula: 'V = kQ/r  •  E ⟂ equipotencial',
    insight: 'o campo aponta para o potencial decrescente; uma trajetória sobre a mesma equipotencial é perpendicular a ele e não realiza trabalho elétrico.',
    readouts: radius => [{ label: 'Distância à carga', value: `${radius} u` }, { label: 'Potencial relativo', value: `${decimal(1 / radius)} kQ/u`, pivot: true }],
  },
  'electric-meters': {
    id: 'electric-meters', name: 'O medidor só mede sem distorcer quando entra no lugar certo',
    question: 'Alterne entre amperímetro e voltímetro e veja a ligação exigida pela resistência interna ideal de cada instrumento.',
    control: { label: 'Medidor', description: '0 = amperímetro; 1 = voltímetro', min: 0, max: 1, step: 1, initial: 0 },
    formula: 'A: série, Rₐ ≈ 0  •  V: paralelo, Rᵥ → ∞',
    insight: 'o amperímetro precisa receber toda a corrente sem acrescentar resistência; o voltímetro compara dois pontos sem desviar corrente do ramo.',
    readouts: meter => meter === 0
      ? [{ label: 'Ligação correta', value: 'em série' }, { label: 'Resistência ideal', value: 'próxima de 0 Ω', pivot: true }]
      : [{ label: 'Ligação correta', value: 'em paralelo' }, { label: 'Resistência ideal', value: 'muito alta', pivot: true }],
  },
  generator: {
    id: 'generator', name: 'A tensão útil do gerador cai com a corrente pedida',
    question: 'Aumente a corrente de uma fonte de ε = 24 V e r = 2 Ω; acompanhe a queda de tensão interna.',
    control: { label: 'i', description: 'corrente fornecida, em ampères', min: 0, max: 12, step: 1, initial: 3 },
    formula: 'U = ε − ri',
    insight: 'em curto-circuito, U chega a zero e toda a energia se perde na resistência interna; não é uma corrente infinita.',
    readouts: current => [{ label: 'Corrente', value: `${current} A` }, { label: 'Tensão nos terminais', value: `${24 - 2 * current} V`, pivot: true }, { label: 'Rendimento', value: `${decimal((24 - 2 * current) / 24 * 100)}%` }],
  },
  receiver: {
    id: 'receiver', name: 'No motor, a tensão alimenta trabalho útil e perda térmica',
    question: 'Mude a corrente num motor com ε’ = 100 V e r’ = 2 Ω e separe a conversão útil do efeito Joule.',
    control: { label: 'i', description: 'corrente no motor, em ampères', min: 1, max: 10, step: 1, initial: 5 },
    formula: 'U = ε’ + r’i',
    insight: 'o sinal é de soma porque o receptor consome energia elétrica: uma parcela gira o eixo e outra aquece os enrolamentos.',
    readouts: current => { const voltage = 100 + 2 * current; return [{ label: 'Tensão aplicada', value: `${voltage} V` }, { label: 'Potência útil', value: `${100 * current} W`, pivot: true }, { label: 'Perda interna', value: `${2 * current * current} W` }]; },
  },
  'magnet-field': {
    id: 'magnet-field', name: 'A bússola lê a tangente de uma linha fechada de indução',
    question: 'Gire o ímã sob a bússola: fora dele, as linhas saem do polo norte e entram no sul; por dentro, o circuito se fecha.',
    control: { label: 'θ', description: 'orientação do ímã, em graus', min: -30, max: 30, step: 10, initial: 0 },
    formula: 'linhas de B são curvas fechadas',
    insight: 'não existe polo magnético isolado: ao cortar um ímã, cada fragmento continua tendo norte e sul, e as linhas seguem fechadas.',
    readouts: angle => [{ label: 'Orientação do ímã', value: `${angle}°` }, { label: 'Bússola', value: 'alinha-se ao campo local', pivot: true }],
  },
  'geometric-optics': {
    id: 'geometric-optics', name: 'A sombra cresce porque os raios se propagam em linha reta',
    question: 'Afaste a tela de uma fonte puntiforme e observe a semelhança entre o obstáculo e a sombra projetada.',
    control: { label: 'D', description: 'distância fonte–tela, em metros', min: 3, max: 8, step: 1, initial: 5 },
    formula: 'R_sombra/D = R_objeto/d',
    insight: 'os limites da sombra são os raios tangentes ao obstáculo; com fonte extensa, essa geometria também cria a penumbra.',
    readouts: distance => [{ label: 'Distância fonte–tela', value: `${distance} m` }, { label: 'Raio da sombra (R = 0,3 m; d = 2 m)', value: `${decimal(.3 * distance / 2)} m`, pivot: true }],
  },
  'optical-instruments': {
    id: 'optical-instruments', name: 'Objetiva forma a imagem; ocular a amplia uma segunda vez',
    question: 'Compare o par de lentes: na luneta, a razão entre focais define o aumento angular.',
    control: { label: 'fₒ', description: 'focal da objetiva da luneta, em mm', min: 400, max: 1600, step: 200, initial: 1200 },
    formula: 'A_luneta = f_objetiva/f_ocular',
    insight: 'a objetiva recebe o objeto e forma a primeira imagem real; a ocular a usa como objeto de uma lupa. A imagem final costuma ficar invertida.',
    readouts: focal => [{ label: 'Focal da objetiva', value: `${focal} mm` }, { label: 'Aumento (ocular de 8 mm)', value: `${decimal(focal / 8)}×`, pivot: true }, { label: 'Tubo em foco no infinito', value: `${focal + 8} mm` }],
  },
  'wave-basics': {
    id: 'wave-basics', name: 'A fonte fixa f; o meio ajusta a velocidade e o comprimento de onda',
    question: 'Troque a velocidade de propagação mantendo a frequência de 20 Hz: a onda não leva matéria junto, mas leva energia.',
    control: { label: 'v', description: 'velocidade da onda, em m/s', min: 1, max: 5, step: 1, initial: 3 },
    formula: 'v = λf  •  T = 1/f',
    insight: 'na mudança de meio, a frequência continua sendo da fonte; é o comprimento de onda que acompanha a velocidade.',
    readouts: speed => [{ label: 'Frequência da fonte', value: '20 Hz' }, { label: 'Comprimento de onda', value: `${decimal(speed / 20)} m`, pivot: true }, { label: 'Período', value: '0,05 s' }],
  },
  'rope-boundary': {
    id: 'rope-boundary', name: 'A extremidade fixa devolve a crista invertida',
    question: 'Escolha a condição de contorno e compare o pulso refletido: a corda fixa impõe deslocamento nulo; a livre não.',
    control: { label: 'Extremidade', description: '0 = fixa; 1 = livre', min: 0, max: 1, step: 1, initial: 0 },
    formula: 'v = √(T/μ)',
    insight: 'na emenda de cordas, parte do pulso reflete e parte transmite; a inversão é da onda refletida ao entrar num meio mais denso.',
    readouts: boundary => boundary === 0
      ? [{ label: 'Condição', value: 'extremidade fixa' }, { label: 'Pulso refletido', value: 'invertido', pivot: true }]
      : [{ label: 'Condição', value: 'extremidade livre' }, { label: 'Pulso refletido', value: 'sem inversão', pivot: true }],
  },
  'string-standing-wave': {
    id: 'string-standing-wave', name: 'Nós não se movem; ventres oscilam entre eles',
    question: 'Escolha o harmônico de uma corda presa nas duas pontas e conte os ventres do padrão estacionário.',
    control: { label: 'n', description: 'harmônico da corda', min: 1, max: 5, step: 1, initial: 3 },
    formula: 'L = nλ/2',
    insight: 'somente modos que satisfazem os nós das duas extremidades persistem; nós consecutivos ficam separados por λ/2.',
    readouts: harmonic => [{ label: 'Harmônico', value: `${harmonic}º` }, { label: 'Ventres visíveis', value: String(harmonic), pivot: true }, { label: 'λ para L = 1,5 m', value: `${decimal(3 / harmonic)} m` }],
  },
};
