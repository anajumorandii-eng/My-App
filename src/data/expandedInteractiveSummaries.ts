import type { InteractiveSummary } from '../types/summary';

const commonBoards: InteractiveSummary['boards'] = [
  { board: 'Fuvest', phases: ['primeira', 'segunda'], guidance: '1ª fase: reconheça o mecanismo e elimine inconsistências. 2ª fase: nomeie o conceito, desenvolva sem saltos e conclua no contexto.' },
  { board: 'Unicamp/Comvest', phases: ['primeira', 'segunda'], guidance: 'C-F-C-R: Comando, Fonte, Conceito e Relação.' },
  { board: 'Unesp/Vunesp', phases: ['primeira', 'segunda'], guidance: 'D-C-E-A: Direto, Conceito ou cálculo, Explicação e Aplicação.' },
  { board: 'Famerp', phases: ['unica', 'segunda'] },
  { board: 'Unifesp', phases: ['unica', 'segunda'] },
  { board: 'ENEM/Inep', phases: ['unica'] },
];

export const expandedInteractiveSummaries: InteractiveSummary[] = [
  {
    id: 'qui-equilibrio-acidificacao', title: 'Equilíbrio químico, acidez e intemperismo', subject: 'Química', topic: 'Equilíbrios Químicos I', priority: 'muito-alta',
    prerequisites: ['Mol e concentração', 'Ácidos e bases', 'Princípio de Le Chatelier'],
    overview: 'Do balanço entre espécies à leitura de uma intervenção ambiental na Fuvest.', boards: commonBoards,
    sections: [
      { id: 'equilibrio-intuicao', title: 'Intuição: equilíbrio não significa repouso', stage: 'intuicao', depth: 'rapida', content: 'Em equilíbrio, processos direto e inverso continuam ocorrendo com velocidades iguais. Alterar concentração, pressão ou temperatura muda o estado do sistema e produz uma resposta até um novo equilíbrio.' },
      { id: 'equilibrio-conceito', title: 'Conceito e mecanismo', stage: 'conceito', depth: 'aprofundamento', content: 'A adição ou remoção de espécies altera o quociente da reação. O sistema evolui no sentido que restabelece a relação expressa pela constante na temperatura considerada. A constante não muda apenas porque uma concentração foi perturbada.' },
      { id: 'equilibrio-aplicacao', title: 'Aplicação: CO₂, H⁺ e minerais alcalinos', stage: 'aplicacao', depth: 'aprofundamento', content: 'CO₂ dissolvido participa de equilíbrios que podem elevar a concentração de H⁺. Minerais alcalinos consomem H⁺ durante o intemperismo; isso modifica o conjunto de equilíbrios carbonato–bicarbonato. É preciso explicitar essa cadeia, não apenas afirmar que o mineral “neutraliza”.' },
      { id: 'equilibrio-exercicio', title: 'Questão interna Fuvest 2024', stage: 'exercicio', depth: 'prova', content: 'A questão interna disc_fuvest_qui_2024 relaciona razão Si:O, intemperismo, neutralização e captura de CO₂. A tabela original não foi recuperada com confiança; use somente a versão conceitual registrada.', callout: 'Material reconstruído com incerteza explícita: disc_fuvest_qui_2024.' },
      { id: 'equilibrio-prova', title: 'Como cai e onde se perde ponto', stage: 'estrategia', depth: 'prova', content: 'Na Fuvest, separe perturbação, espécie consumida/produzida, deslocamento e efeito observado. Pegadinhas: dizer que equilíbrio “para”, afirmar que catalisador desloca equilíbrio ou mudar K sem mudar temperatura.' },
    ],
    retrieval: [{ id: 'equilibrio-r1', sectionId: 'equilibrio-exercicio', board: 'Fuvest', phase: 'segunda', prompt: 'Por que consumir H⁺ com um mineral alcalino pode favorecer a captura de CO₂ dissolvido?', expectedElements: [
      { label: 'consumo de H⁺', keywords: ['consome h+', 'consumo de h+', 'neutraliza', 'reduz a acidez'] },
      { label: 'deslocamento do equilíbrio', keywords: ['desloca', 'equilíbrio', 'equilibrio', 'le chatelier'] },
      { label: 'sistema carbonato-bicarbonato', keywords: ['carbonato', 'bicarbonato', 'co2 dissolvido', 'co₂ dissolvido'] },
    ], hint: 'Organize em perturbação → resposta do equilíbrio → consequência.', transferPrompt: 'Explique por que um catalisador acelera a chegada ao equilíbrio sem alterar sua composição final.' }],
    sources: [
      { label: 'Questão discursiva Fuvest 2024 — intemperismo e acidificação', kind: 'material-interno', materialId: 'disc_fuvest_qui_2024' },
      { label: 'Estratégias internas de Química e Fuvest', kind: 'material-interno', materialId: 'resolutionStrategies' },
    ],
  },
  {
    id: 'mat-probabilidade-contagem', title: 'Contagem sistemática e probabilidade', subject: 'Matemática', topic: 'Introdução às Probabilidades', priority: 'muito-alta',
    prerequisites: ['Conjuntos', 'Divisibilidade', 'Princípio multiplicativo'], overview: 'Como definir o espaço amostral, contar sem duplicar e justificar a razão final.', boards: commonBoards,
    sections: [
      { id: 'prob-intuicao', title: 'Intuição: probabilidade começa antes da divisão', stage: 'intuicao', depth: 'rapida', content: 'A fração favoráveis/possíveis só é válida quando o espaço amostral e a equiprobabilidade estão claros. O trabalho decisivo costuma ser organizar a contagem.' },
      { id: 'prob-conceito', title: 'Conceito: universo, evento e critério', stage: 'conceito', depth: 'aprofundamento', content: 'Defina o universo de resultados ordenados ou não ordenados, traduza o evento em uma propriedade verificável e conte cada resultado exatamente uma vez. Em pares ordenados, (m,n) e (n,m) são distintos quando m ≠ n.' },
      { id: 'prob-aplicacao', title: 'Aplicação: pares e divisores comuns', stage: 'aplicacao', depth: 'aprofundamento', content: 'Para testar se m/n é redutível, o critério é mdc(m,n) > 1. Uma tabela por valor de m ou agrupamento por múltiplos torna a contagem auditável; inclusão-exclusão evita contar pares que compartilham mais de um fator duas vezes.' },
      { id: 'prob-exercicio', title: 'Questão interna Fuvest 2022', stage: 'exercicio', depth: 'prova', content: 'Em disc_fuvest_mat_2022, C contém pares (m,n) com coordenadas entre 3 e 9. A resposta exige distinguir pares ordenados, listar casos sob uma desigualdade e contar frações redutíveis.', callout: 'Um terceiro item original foi omitido por conflito entre fontes; não é usado neste resumo.' },
      { id: 'prob-prova', title: 'Como cai e caminho eficiente', stage: 'estrategia', depth: 'prova', content: 'Na 1ª fase, cheque rapidamente o tamanho do universo. Na 2ª, declare universo, critério, contagem e razão. Pegadinhas: trocar par ordenado por combinação, duplicar interseções e apresentar só o número final.' },
    ],
    retrieval: [{ id: 'prob-r1', sectionId: 'prob-exercicio', board: 'Fuvest', phase: 'segunda', prompt: 'Como você organizaria a contagem dos pares (m,n) cuja fração m/n é redutível sem duplicar casos?', expectedElements: [
      { label: 'critério de divisor comum', keywords: ['mdc', 'divisor comum', 'fator comum'] },
      { label: 'pares ordenados', keywords: ['pares ordenados', 'ordem importa', '(m,n)'] },
      { label: 'controle de duplicatas', keywords: ['sem duplicar', 'inclusão-exclusão', 'inclusao-exclusao', 'tabela'] },
    ], hint: 'Defina primeiro o critério e depois uma tabela que atribua cada par a uma única célula.', transferPrompt: 'Se o intervalo das coordenadas mudar, quais partes do método permanecem iguais?' }],
    sources: [
      { label: 'Questão discursiva Fuvest 2022 — conjuntos e probabilidade', kind: 'material-interno', materialId: 'disc_fuvest_mat_2022' },
      { label: 'Estratégias internas de Matemática e Fuvest', kind: 'material-interno', materialId: 'resolutionStrategies' },
    ],
  },
  {
    id: 'geo-bonus-demografico', title: 'Transição e bônus demográfico', subject: 'Geografia', topic: 'Estrutura Ativa da População', priority: 'alta',
    prerequisites: ['Natalidade e mortalidade', 'Pirâmides etárias', 'População economicamente ativa'], overview: 'Da estrutura etária à janela de oportunidade — e por que ela não garante desenvolvimento.', boards: commonBoards,
    sections: [
      { id: 'bonus-intuicao', title: 'Intuição: uma janela, não um prêmio automático', stage: 'intuicao', depth: 'rapida', content: 'Quando cresce a proporção de pessoas em idade ativa em relação aos dependentes, a sociedade ganha uma possibilidade de produzir e poupar mais. O resultado depende de emprego, educação, saúde e políticas públicas.' },
      { id: 'bonus-conceito', title: 'Conceito e mecanismo', stage: 'conceito', depth: 'aprofundamento', content: 'O bônus demográfico é uma etapa da transição demográfica em que a razão de dependência diminui. A queda anterior da fecundidade reduz o peso relativo das crianças antes que o envelhecimento eleve o peso dos idosos.' },
      { id: 'bonus-aplicacao', title: 'Aplicação: oportunidade e desafio', stage: 'aplicacao', depth: 'aprofundamento', content: 'Uma população ativa numerosa pode ampliar renda e arrecadação se houver ocupação produtiva. Sem postos de trabalho e qualificação, a mesma estrutura pode ampliar desemprego e desigualdade; depois, o envelhecimento pressiona previdência e cuidado.' },
      { id: 'bonus-exercicio', title: 'Questão interna Unesp 2024', stage: 'exercicio', depth: 'prova', content: 'disc_unesp_geo_2024 parte da Índia ultrapassando a China e pede conceitos de crescimento populacional, definição de bônus demográfico e um desafio socioeconômico.', callout: 'Material interno: disc_unesp_geo_2024.' },
      { id: 'bonus-prova', title: 'Leitura de prova e D-C-E-A', stage: 'estrategia', depth: 'prova', content: 'Responda direto, defina razão de dependência, explique a janela e aplique ao emprego ou envelhecimento. Pegadinhas: confundir população absoluta com taxa de crescimento e tratar bônus como garantia de prosperidade.' },
    ],
    retrieval: [{ id: 'bonus-r1', sectionId: 'bonus-exercicio', board: 'Unesp/Vunesp', phase: 'segunda', prompt: 'Por que o bônus demográfico é uma oportunidade condicionada, e não garantia de crescimento econômico?', expectedElements: [
      { label: 'maior proporção em idade ativa', keywords: ['idade ativa', 'população ativa', 'populacao ativa', 'pea'] },
      { label: 'menor razão de dependência', keywords: ['razão de dependência', 'razao de dependencia', 'dependentes'] },
      { label: 'condições socioeconômicas', keywords: ['emprego', 'educação', 'educacao', 'qualificação', 'qualificacao', 'políticas públicas', 'politicas publicas'] },
    ], hint: 'Separe a estrutura etária das políticas que transformam potencial em resultado.', transferPrompt: 'Explique como o fim do bônus altera as prioridades de previdência e saúde.' }],
    sources: [
      { label: 'Questão discursiva Unesp 2024 — bônus demográfico', kind: 'material-interno', materialId: 'disc_unesp_geo_2024' },
      { label: 'Estratégias internas de Geografia e Vunesp', kind: 'material-interno', materialId: 'resolutionStrategies' },
    ],
  },
];
