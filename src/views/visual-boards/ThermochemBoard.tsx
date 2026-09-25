import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import ThermochemMechanism from './ThermochemMechanism';

export default function ThermochemBoard(props: BoardProps) {
  const par = boardPair(props);
  const hess = props.map.summaryId === 'summary-quimica-termoquimica-ii';
  return <BoardShell
    title={hess ? 'Lei de Hess: caminhos e saldo' : 'Entalpia e o sinal de ΔH'}
    subtitle={hess ? 'A entalpia depende dos estados inicial e final.' : 'O sinal é do sistema, não de quem sente o calor.'}
    condition={{ label: hess ? 'função' : 'referência', value: hess ? 'de estado' : 'o sistema' }}
    ariaLabel={hess ? 'Prancha de termoquímica: Lei de Hess' : 'Prancha de termoquímica: entalpia e energia de ativação'}
    scene={<ThermochemMechanism hess={hess} />} sceneFirst emphasis={par.emphasis}
    left={hess ? { label: 'Somar etapas', headline: 'Intermediários se cancelam.', detail: 'Para obter a reação global, some as equações e elimine as espécies que aparecem dos dois lados na mesma quantidade.', formula: 'ΔHglobal = Σ ΔHetapas' } : { label: 'Exotérmica', headline: 'Os produtos ficam abaixo.', detail: 'O sistema libera calor para a vizinhança. O sinal de ΔH se refere à variação de entalpia do sistema.', formula: 'ΔH < 0 · Hprodutos < Hreagentes' }}
    right={hess ? { label: 'Transformar a equação', headline: 'A entalpia acompanha a operação.', detail: 'Inverter a reação inverte o sinal de ΔH. Multiplicar os coeficientes multiplica também a variação de entalpia.', formula: 'inversão: −ΔH · fator k: kΔH' } : { label: 'Endotérmica', headline: 'Os produtos ficam acima.', detail: 'O sistema absorve calor. A decomposição térmica do carbonato de cálcio é um exemplo; dissoluções podem ser endo ou exotérmicas.', formula: 'ΔH > 0 · Hprodutos > Hreagentes' }}
    leftState={par.leftState} rightState={par.rightState} leftSelected={par.leftSelected} rightSelected={par.rightSelected} onSelectLeft={par.selectLeft} onSelectRight={par.selectRight}
    equation={{ label: hess ? 'Lei de Hess' : 'Definição', general: hess ? 'ΔHglobal = ΔH₁ + ΔH₂' : 'ΔH = Hprod − Hreag', condition: hess ? 'mesmos estados' : 'exotérmica', reduced: hess ? 'mesmo saldo' : 'ΔH < 0' }}
    supports={<><section className="vs-formula-note"><span className="vs-note-title">Condições importam</span><strong>Estado físico e quantidade</strong><p>Ao combinar dados, mantenha estados físicos, temperatura e quantidades compatíveis com a reação pretendida.</p></section><section className="vs-formula-note"><span className="vs-note-title">Não confunda</span><strong>ΔH não é energia de ativação</strong><p>A barreira influencia a velocidade; ΔH é o saldo entre produtos e reagentes. A análise de espontaneidade exige outras informações.</p></section></>}
    closing={hess ? 'chegar aos mesmos produtos a partir dos mesmos reagentes dá o mesmo ΔH, mesmo que o caminho tenha outras etapas.' : 'produto abaixo significa ΔH negativo; produto acima significa ΔH positivo, sempre do ponto de vista do sistema.'}
  />;
}
