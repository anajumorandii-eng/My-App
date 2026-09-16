import type { SceneEntry } from '../types';

/** Capítulos de Química sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Estado ao fim da Task 1: atribuição definitiva de família (ou lacuna) para
 *  os 48 capítulos, derivada de leitura integral de deepSummaryContent.json.
 *  O raciocínio completo, com citações literais, está em
 *  docs/visual-personalizado/14-familias-quimica.md — as Tasks 2-4 preenchem
 *  `quimica` a partir dali; esta lista de lacunas já está completa. */
export const quimicaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-quimica-o-estado-gasoso',
    motivo:
      'Postulados do gás ideal, variáveis de estado e limites do modelo real são exposição conceitual/procedural (define o modelo e suas variáveis), sem rivalidade, camadas, tipos coexistentes com guarda-chuva, critérios conjuntivos declarados, escala nomeada ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-estudo-dos-gases-ii',
    motivo:
      'Lei geral dos gases, equação de Clapeyron e lei de Dalton das pressões parciais são fórmulas e roteiros de cálculo aplicados a um único fenômeno (comportamento de um gás), não uma estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-separacao-de-misturas',
    motivo:
      'É um guia de referência de técnicas de laboratório organizado por tipo de mistura (heterogênea, homogênea, casos especiais); não há guarda-chuva de tipos coexistentes de um mesmo objeto — as técnicas resolvem problemas diferentes, não são variantes de uma mesma categoria — nem escala nem cadeia.',
  },
  {
    chapterId: 'summary-quimica-transformacoes-fisicas-e-quimicas-e-balanceamento-de-equacoes',
    motivo:
      'A distinção física/química é binária (mais fraca que as tipologias aceitas, com três ou mais variantes) e o balanceamento é procedimento de ajuste de coeficientes, não estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-massa-atomica-mol-e-massa-molar',
    motivo:
      'Define massa atômica, mol e massa molar e as conversões entre elas; é vocabulário e conversão de unidades, sem rivalidade, camadas, tipos, escala ou cadeia.',
  },
  {
    chapterId: 'summary-quimica-determinacao-de-formulas-quimicas',
    motivo:
      'Roteiro de cálculo (percentual → mínima → molecular, incluindo o caso de combustão) sem rivalidade, tipos coexistentes, critérios conjuntivos ou cadeia causal.',
  },
  {
    chapterId: 'summary-quimica-estequiometria-leis-ponderais',
    motivo:
      'As três leis ponderais (Lavoisier, Proust, Dalton) são apresentadas como conceitos complementares que se sucedem historicamente ("a lei de Dalton... complementa a lei de Proust"), não como variantes coexistentes com guarda-chuva nem como elos causais entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-calculos-estequiometricos',
    motivo:
      'Roteiro de resolução (conversão para mol, regra de três, reagente limitante) é procedimento de cálculo, não estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-processos-de-oxirreducao',
    motivo:
      'Define oxidação/redução, número de oxidação e balanceamento por transferência de elétrons; é conceitual/procedural, sem guarda-chuva de tipos, escala nomeada, critérios conjuntivos declarados ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-introducao-a-quimica-organica',
    motivo:
      'Introduz vocabulário de forma preliminar; os critérios de classificação de cadeia (aberta/fechada, normal/ramificada, saturada/insaturada, homogênea/heterogênea) são quatro critérios binários independentes, não uma tipologia única com guarda-chuva — a enumeração mais completa das funções orgânicas está nos capítulos dedicados (Nomenclatura Oxigenados/Nitrogenados; Reconhecimento de Funções), que já cobrem essa família.',
  },
  {
    chapterId: 'summary-quimica-nomenclatura-de-compostos-organicos',
    motivo:
      'Regras de nomenclatura IUPAC (prefixo/infixo/sufixo, escolha de cadeia principal, numeração por menores localizantes) são procedimento de codificação de nome, sem estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-reacoes-de-adicao',
    motivo:
      'Descreve mecanismos de adição a alcenos/alcinos e a carbonílicos, mais a regra de Markovnikov; é narrativa de mecanismo e regra preditiva, não guarda-chuva de tipos coexistentes, escala, critérios conjuntivos ou cadeia causal — a tipologia adição/eliminação/substituição já está coberta em "Interpretando Reações Orgânicas", e este capítulo específico não tem guarda-chuva próprio de subtipos de adição.',
  },
  {
    chapterId: 'summary-quimica-reacoes-de-oxidacao-em-hidrocarbonetos',
    motivo:
      'Combustão completa/incompleta é distinção binária, e oxidação branda/enérgica é contraste de condições reacionais (suave vs. drástica) sobre o mesmo mecanismo, não rivalidade teórica nem tipos coexistentes com guarda-chuva.',
  },
  {
    chapterId: 'summary-quimica-acidos-graxos-e-esterificacao',
    motivo:
      'Saturado/insaturado é distinção binária; esterificação e saponificação são duas reações distintas contrastadas para evitar confusão, não posições rivais nem tipos coexistentes de uma mesma categoria.',
  },
  {
    chapterId: 'summary-quimica-transesterificacao-alcoolise',
    motivo:
      'Descreve a reação, sua aplicação (biodiesel) e vantagens/limites como trade-off ("vantagens... mas também limitações técnicas e econômicas reais"), padrão já rejeitado em fases anteriores para contraste-de-posicoes por não ser rejeição mútua de posições teóricas.',
  },
  {
    chapterId: 'summary-quimica-acidez-e-basicidade-pka',
    motivo:
      'A força de ácidos/bases é medida por Ka/pKa, métrica contínua comparada caso a caso (mesmo padrão de rejeição do Gini em Geografia), não escala de estágios nomeados discretos; os três fatores que estabilizam a base conjugada atuam de forma independente e cumulativa, sem a frase de necessidade conjunta exigida por criterios-conjuntivos.',
  },
  {
    chapterId: 'summary-quimica-polimeros',
    motivo:
      'Apresenta três critérios de classificação binários e independentes (natural/sintético; termoplástico/termorrígido; adição/condensação); nenhum chega à enumeração de três ou mais variantes coexistentes exigida pelas tipologias aceitas — mesmo padrão de rejeição aplicado à Matriz Energética (renovável/não renovável) em Geografia.',
  },
  {
    chapterId: 'summary-quimica-termoquimica-i',
    motivo:
      'Exotérmica/endotérmica é distinção binária, e a lei de Hess é procedimento de manipulação algébrica de equações; nenhuma estrutura de família sustentada por guarda-chuva próprio.',
  },
  {
    chapterId: 'summary-quimica-introducao-ao-estudo-das-pilhas-e-baterias',
    motivo:
      'Descreve o princípio da pilha, organização da célula, potencial/espontaneidade e a distinção binária pilha comum/recarregável; conceitual e procedural, sem guarda-chuva de tipos coexistentes, escala, critérios conjuntivos ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-eletroquimica-de-processos-espontaneos',
    motivo:
      'Descreve a pilha de Daniell, potenciais de redução e os mecanismos de proteção catódica e galvanização; proteção catódica e galvanização são o mesmo princípio aplicado de duas formas, não posições rivais nem tipos coexistentes com guarda-chuva próprio.',
  },
  {
    chapterId: 'summary-quimica-eletroquimica-de-processos-nao-espontaneos',
    motivo:
      'A inversão de polaridade entre pilha e eletrólise (cátodo positivo vs. negativo) é convenção de nomenclatura definicional, não rivalidade teórica; eletrólise ígnea/aquosa é distinção binária.',
  },
  {
    chapterId: 'summary-quimica-aspectos-quantitativos-da-eletroquimica-e-metalurgia',
    motivo:
      'As leis de Faraday e o roteiro de cálculo são procedimento numérico; a distinção metal pouco reativo/muito reativo, que decide o método de obtenção, é binária.',
  },
  {
    chapterId: 'summary-quimica-deslocamento-de-equilibrio',
    motivo:
      'O princípio de Le Chatelier é um único mecanismo unificador ("o sistema sempre reage contra a perturbação"), e concentração/pressão/temperatura/catalisador são fatores causais heterogêneos aplicados a esse princípio, não variantes coexistentes de uma categoria — mesmo padrão de rejeição de "fatores" aplicado a Cinética Química.',
  },
  {
    chapterId: 'summary-quimica-equilibrios-ionicos',
    motivo:
      'Ionização e constante (Ka/Kb), grau de ionização e lei de Ostwald, efeito do íon comum e solução-tampão; conceitual/procedural, com grau de ionização como métrica contínua (mesmo padrão de rejeição do pKa), sem guarda-chuva de tipos coexistentes, escala nomeada discreta ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'qui-equilibrio-acidificacao',
    motivo:
      'Conteúdo editorial de "Equilíbrios Químicos I": equilíbrio dinâmico, interpretação de Keq (métrica contínua, mesmo padrão de rejeição do pKa e do grau de ionização) e a convenção de omitir sólidos/líquidos puros da expressão de Keq; conceitual/procedural, sem estrutura de família sustentada por guarda-chuva próprio.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4
 *  preenchem a partir da atribuição fixada em
 *  docs/visual-personalizado/14-familias-quimica.md. */
export const quimica: SceneEntry[] = [];
