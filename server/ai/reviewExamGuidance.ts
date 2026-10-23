import type { ReviewScope } from '../../src/lib/strategicReview';
const guidance: Record<string, { objective: string; discursive: string }> = {
  FUVEST: {
    objective: 'Interpretação precisa, integração de conceitos e alternativas parcialmente verdadeiras. Modele um distrator que viole condição ou recorte e ensine a eliminá-lo com fundamento.',
    discursive: 'Desenvolva dados/hipóteses → princípio → etapas justificadas → unidade e conclusão, conforme o comando. Em Literatura, F.O.R.M.A.: foco, observação textual, recurso formal, mecanismo e articulação com o conjunto.',
  },
  UNICAMP: {
    objective: 'Integre uma fonte funcional (texto, gráfico, imagem ou experimento) ao conceito; teste extrapolações e mostre qual evidência discrimina as alternativas.',
    discursive: 'Comando → Fonte → Conceito → Relação: use a fonte como evidência, sem mera paráfrase; separe subitens e cumpra cada verbo. Em Literatura, fonte → operação → núcleo formal → tensão interpretativa → explicação articulada.',
  },
  UNESP: {
    objective: 'Resposta direta, precisão no conceito ou cálculo e aplicação ao caso. Discrimine conceitos próximos e confira unidade, sinal, escala e condições.',
    discursive: 'Resposta direta → Conceito/cálculo → Explicação → Aplicação. Cada comando é uma tarefa distinta, com desenvolvimento visível e sem introdução decorativa. Só use discursiva se compatível com a edição da prova identificada; não deduza o formato vigente de provas antigas.',
  },
  FAMERP: {
    objective: 'Nas objetivas, aplique o conceito ao problema e confira detalhes de unidades e relações, preservando o conteúdo da matéria escolhida: não reduza toda disciplina a saúde.',
    discursive: 'Nas específicas de Natureza, conecte dado experimental, mecanismo biológico/químico/físico, cálculo e justificativa. Delimite a componente efetivamente cobrada nas fontes de Famerp; não transplante regras de outra prova organizada pela Vunesp.',
  },
  UNIFESP: {
    objective: 'Para o componente ENEM do sistema misto, situação-problema, fonte e decisão contextualizada; não o chame de primeira fase própria da instituição.',
    discursive: 'Nas provas complementares do sistema misto, adapte ao componente: línguas/redação ou conhecimentos específicos. Em específicas, precisão conceitual, interpretação científica, condições experimentais e relação entre dado e mecanismo; desenvolvimento justificado nos itens abertos. Consulte a prova identificada e não atribua o mesmo formato a todos os cursos/modalidades.',
  },
  ENEM: {
    objective: 'Situação-problema, interpretação de fontes e aplicação contextualizada. Localize comando e evidência, diferencie alternativa plausível da sustentada pelo problema. Explique a habilidade em linguagem natural, sem inventar códigos. Treino objetivo; redação somente se for o conteúdo selecionado. ENEM não tem primeira e segunda fases: dias não são fases.',
    discursive: '',
  },
};
export function reviewExamGuidance(board: string, scope: ReviewScope = 'all') {
  const profile = guidance[board];
  if (!profile) return `${board}: pouca informação disponível. Use somente fontes e provas próprias identificadas; sinalize limites e não atribua padrões sem evidência.`;
  const objective = ['all','first','objective','enem'].includes(scope);
  const discursive = board !== 'ENEM' && ['all','second','discursive','complementary'].includes(scope);
  return `${board} — orientações DIDÁTICAS, não padrões comprovados nem rubrica oficial universal:\n${objective ? profile.objective : ''}\n${discursive ? profile.discursive : ''}\nNão informe quantidades, pesos, estrutura vigente ou obrigatoriedade de obra sem documento oficial do ciclo efetivamente disponível. Provas anteriores sustentam apenas observações do recorte identificado.`;
}
