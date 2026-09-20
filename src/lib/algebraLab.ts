export type AlgebraConfigId = 'fatoracao' | 'igualdades' | 'desigualdades' | 'modelagem-linear' | 'modelagem-quadratica' | 'inequacoes-plano';
export interface AlgebraReadout { label: string; value: string; pivot?: boolean }
export interface AlgebraConfig {
  id: AlgebraConfigId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number };
  formula: string;
  insight: string;
  readouts(value: number): AlgebraReadout[];
}
const fmt = (value: number) => String(Math.round(value * 100) / 100).replace('.', ',');
export const ALGEBRA_CONFIGS: Record<AlgebraConfigId, AlgebraConfig> = {
  fatoracao: {
    id: 'fatoracao', name: 'Fatorar muda a forma, não o valor',
    question: 'Compare x² − 4 e (x + 2)(x − 2) para o mesmo valor de x.',
    control: { label: 'x', description: 'valor substituído na expressão', min: -6, max: 6, step: 1, initial: 3 },
    formula: 'x² − 4 = (x + 2)(x − 2)',
    insight: 'só fatores completos se cancelam: um termo dentro de uma soma nunca é fator comum.',
    readouts: (x) => [{ label: 'Forma expandida', value: fmt(x * x - 4) }, { label: 'Forma fatorada', value: fmt((x + 2) * (x - 2)), pivot: true }, { label: 'Zeros', value: '−2 e 2' }],
  },
  igualdades: {
    id: 'igualdades', name: 'Quadrar produz candidatos. Verificar decide.',
    question: 'Teste as raízes candidatas de √(x + 3) = x − 3 na equação original.',
    control: { label: 'x', description: 'candidato depois de elevar ao quadrado', min: 1, max: 6, step: 5, initial: 1 },
    formula: '√(x + 3) = x − 3',
    insight: 'elevar ao quadrado não é reversível: a solução só entra depois de sobreviver à equação inicial.',
    readouts: (x) => {
      const left = Math.sqrt(x + 3); const right = x - 3; const ok = Math.abs(left - right) < 1e-9;
      return [{ label: 'Lado esquerdo', value: fmt(left) }, { label: 'Lado direito', value: fmt(right) }, { label: 'Candidato é solução?', value: ok ? 'sim' : 'não — espúria', pivot: true }];
    },
  },
  desigualdades: {
    id: 'desigualdades', name: 'O sinal muda entre as raízes',
    question: 'Percorra a reta e leia o sinal de (x − 3)(x + 2).',
    control: { label: 'x', description: 'ponto de teste na reta real', min: -6, max: 6, step: 1, initial: 4 },
    formula: '(x − 3)(x + 2) > 0',
    insight: 'raízes separam intervalos; para produto positivo, os fatores precisam ter o mesmo sinal.',
    readouts: (x) => { const product = (x - 3) * (x + 2); return [{ label: 'x − 3', value: fmt(x - 3) }, { label: 'x + 2', value: fmt(x + 2) }, { label: 'Produto', value: `${fmt(product)} ${product > 0 ? '> 0' : product < 0 ? '< 0' : '= 0'}`, pivot: true }]; },
  },
  'modelagem-linear': {
    id: 'modelagem-linear', name: 'Uma frase vira uma relação',
    question: 'Escolha o primeiro dos dois inteiros consecutivos que somam 47.',
    control: { label: 'x', description: 'primeiro inteiro consecutivo', min: 18, max: 28, step: 1, initial: 23 },
    formula: 'x + (x + 1) = 47',
    insight: 'a variável não é um palpite: ela nomeia uma grandeza, e a frase informa como as outras dependem dela.',
    readouts: (x) => [{ label: 'Segundo inteiro', value: String(x + 1) }, { label: 'Soma modelada', value: String(2 * x + 1), pivot: true }, { label: 'Contexto aceito?', value: 2 * x + 1 === 47 ? 'sim' : 'não' }],
  },
  'modelagem-quadratica': {
    id: 'modelagem-quadratica', name: 'Preço e quantidade formam uma parábola',
    question: 'Varie o número de reduções de R$4 e observe a receita.',
    control: { label: 'x', description: 'reduções de R$4 no preço', min: 0, max: 6, step: 1, initial: 3 },
    formula: 'R(x) = (50 − 4x)(200 + 30x)',
    insight: 'o vértice localiza a melhor receita contínua; se x precisa ser inteiro, compare os inteiros vizinhos.',
    readouts: (x) => { const price = 50 - 4 * x; const quantity = 200 + 30 * x; return [{ label: 'Preço', value: `R$${price}` }, { label: 'Quantidade', value: String(quantity) }, { label: 'Receita', value: `R$${price * quantity}`, pivot: true }]; },
  },
  'inequacoes-plano': {
    id: 'inequacoes-plano', name: 'A inequação pinta uma região, não uma reta',
    question: 'Mude o limite e veja a região que satisfaz x + y ≤ c.',
    control: { label: 'c', description: 'limite da inequação x + y ≤ c', min: 2, max: 8, step: 1, initial: 5 },
    formula: 'x + y ≤ c',
    insight: 'a reta é fronteira; o sinal ≤ inclui a fronteira e escolhe um dos dois semiplanos.',
    readouts: (c) => [{ label: 'Intercepto em x', value: `(${c}, 0)` }, { label: 'Intercepto em y', value: `(0, ${c})` }, { label: 'Ponto (2, 2)', value: 4 <= c ? 'pertence' : 'não pertence', pivot: true }],
  },
};
