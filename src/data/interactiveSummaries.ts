import type { InteractiveSummary } from '../types/summary';

export const interactiveSummaries: InteractiveSummary[] = [
  {
    id: 'fis-termologia-calor', title: 'Calor, temperatura e mudanças de estado', subject: 'Física', topic: 'Termologia', priority: 'muito-alta',
    prerequisites: ['Proporcionalidade', 'Conversão de unidades', 'Energia'],
    overview: 'Do significado físico de calor às etapas de uma resolução discursiva com aquecimento e fusão.',
    boards: [
      { board: 'Fuvest', phases: ['primeira', 'segunda'], guidance: '1ª fase: reconheça regime e unidades. 2ª fase: declare cada parcela de energia, substitua dados e conclua com unidade.' },
      { board: 'Unicamp/Comvest', phases: ['primeira', 'segunda'], guidance: 'Na discursiva, use C-F-C-R: leia os dados como fonte, nomeie o princípio e relacione ao fenômeno.' },
      { board: 'Unesp/Vunesp', phases: ['primeira', 'segunda'], guidance: 'Na discursiva, use D-C-E-A: resposta direta, equação, explicação e unidade final.' },
      { board: 'Famerp', phases: ['unica', 'segunda'] }, { board: 'Unifesp', phases: ['unica', 'segunda'] }, { board: 'ENEM/Inep', phases: ['unica'] },
    ],
    sections: [
      { id: 'calor-intuicao', title: 'Intuição: a energia atravessa a fronteira', stage: 'intuicao', depth: 'rapida', content: 'Temperatura descreve o estado térmico; calor é energia transferida por diferença de temperatura. Um corpo não “tem calor”: ele tem energia interna e pode receber ou ceder energia.' },
      { id: 'calor-conceito', title: 'Conceito e mecanismo', stage: 'conceito', depth: 'aprofundamento', content: 'Sem mudança de fase, Q = m·c·ΔT: massa maior, calor específico maior ou maior variação térmica exigem mais energia. Durante uma mudança de estado ideal, a temperatura permanece constante e Q = m·L; a energia reorganiza as interações entre partículas.' },
      { id: 'calor-aplicacao', title: 'Aplicação: aquecer e depois fundir', stage: 'aplicacao', depth: 'aprofundamento', content: 'Quando o material começa abaixo da temperatura de fusão, separe o processo: Qtotal = m·c·ΔT + m·Lf. Somar as parcelas evita usar calor latente enquanto a temperatura ainda varia — a pegadinha central.' },
      { id: 'calor-exercicio', title: 'Questão real de referência', stage: 'exercicio', depth: 'prova', content: 'Na Fuvest 2024 reconstruída no acervo, o gelo parte de −20 °C e deve derreter. O raciocínio completo exige aquecer até 0 °C e só depois fundir. Faça a conta no Treino de 2ª Fase antes de consultar a resposta-modelo.', callout: 'Material: disc_fuvest_fis_2024. A questão do acervo informa quando houve reconstrução ou incerteza.' },
      { id: 'calor-prova', title: 'Como cai: Fuvest em duas fases', stage: 'estrategia', depth: 'prova', content: '1ª fase: identifique se há variação de temperatura ou fase e elimine alternativas dimensionalmente impossíveis. 2ª fase: escreva “aquecimento” e “fusão” em linhas separadas; mostre conversões, princípio, substituição e unidade. Erros comuns: tratar °C como energia, esquecer a massa ou aplicar ΔT durante a fusão.' },
    ],
    retrieval: [{ id: 'calor-r1', sectionId: 'calor-exercicio', prompt: 'Sem consultar: por que a temperatura não aumenta durante uma fusão ideal, embora o corpo receba energia?', expectedElements: [
      { label: 'temperatura constante', keywords: ['temperatura constante', 'não aumenta', 'nao aumenta'] },
      { label: 'mudança de fase', keywords: ['mudança de fase', 'mudanca de fase', 'fusão', 'fusao'] },
      { label: 'reorganização das interações', keywords: ['ligações', 'ligacoes', 'interações', 'interacoes', 'organização', 'organizacao'] },
    ], hint: 'Localize para onde vai a energia se ela não aparece como ΔT.', transferPrompt: 'Um bloco de gelo a −10 °C recebe energia até virar água a 20 °C. Divida o processo em três parcelas e diga a fórmula de cada uma.' }],
    sources: [
      { label: 'Roteiro interno “Termologia: calor, temperatura e mudanças de estado”', kind: 'material-interno', materialId: 'pod_fis_04' },
      { label: 'Questão discursiva Fuvest 2024 — degelo do Ártico', kind: 'material-interno', materialId: 'disc_fuvest_fis_2024' },
      { label: 'Estratégias de resolução por matéria e banca', kind: 'material-interno', materialId: 'resolutionStrategies' },
    ],
  },
  {
    id: 'bio-ecologia-eutrofizacao', title: 'Eutrofização e fluxo de energia', subject: 'Biologia', topic: 'Ecologia', priority: 'muito-alta',
    prerequisites: ['Cadeias alimentares', 'Produtores e consumidores', 'Ciclos do nitrogênio e fósforo'], overview: 'Uma cadeia causal para interpretar fertilizantes, florações e desequilíbrios aquáticos.',
    boards: [
      { board: 'Fuvest', phases: ['primeira', 'segunda'], guidance: 'Explique a cadeia causal inteira; nomear eutrofização sem mecanismo é resposta incompleta.' },
      { board: 'Unicamp/Comvest', phases: ['primeira', 'segunda'], guidance: 'C-F-C-R: use gráfico/texto como evidência, nomeie eutrofização e relacione nutrientes, biomassa e oxigênio.' },
      { board: 'Unesp/Vunesp', phases: ['primeira', 'segunda'], guidance: 'D-C-E-A: responda diretamente, apresente o processo e aplique ao ambiente descrito.' },
      { board: 'Famerp', phases: ['unica', 'segunda'] }, { board: 'Unifesp', phases: ['unica', 'segunda'] }, { board: 'ENEM/Inep', phases: ['unica'] },
    ],
    sections: [
      { id: 'eutro-intuicao', title: 'Intuição: excesso de nutriente não é “saúde”', stage: 'intuicao', depth: 'rapida', content: 'Nutrientes podem limitar produtores. Quando chegam em excesso, favorecem crescimento rápido; depois, a decomposição da biomassa amplia o consumo de oxigênio e pode produzir hipóxia.' },
      { id: 'eutro-mecanismo', title: 'Mecanismo em cadeia causal', stage: 'conceito', depth: 'aprofundamento', content: 'Aporte de nitratos/fosfatos → proliferação de produtores → aumento de biomassa e turbidez → morte/decomposição → maior demanda bioquímica de oxigênio → queda do O₂ dissolvido → mortalidade de organismos aeróbios. Pegadinha: o produtor libera O₂ na fotossíntese, mas o saldo do sistema pode cair pela respiração e decomposição.' },
      { id: 'eutro-aplicacao', title: 'Conexões com saúde e clima', stage: 'aplicacao', depth: 'aprofundamento', content: 'O mecanismo conecta saneamento, agricultura, qualidade da água, pesca e saúde pública. Em prova, diferencie eutrofização por enriquecimento de nutrientes de contaminação por patógenos; podem coexistir, mas não são sinônimos.' },
      { id: 'eutro-exercicio', title: 'Aplicação discursiva do acervo', stage: 'exercicio', depth: 'prova', content: 'A questão Unifesp 2020 reconstruída relaciona fertilizantes transportados até o Atlântico, sargaço e cadeia trófica. Antes do modelo, escreva: fenômeno → nutriente → produtor → consumidores → possível desequilíbrio.', callout: 'Material: disc_unifesp_bio_2020.' },
      { id: 'eutro-prova', title: 'Como reconhecer e responder', stage: 'estrategia', depth: 'prova', content: 'Sinais: fertilizante/esgoto, água esverdeada, floração algal, turbidez e oxigênio dissolvido baixo. Fuvest 2ª fase: não salte do fertilizante para a morte dos peixes; explicite decompositores e consumo de O₂. Em alternativas, desconfie de “falta de nutrientes” e de causalidade invertida.' },
    ],
    retrieval: [{ id: 'eutro-r1', sectionId: 'eutro-exercicio', prompt: 'Reconstrua a cadeia causal entre fertilizantes e morte de peixes.', expectedElements: [
      { label: 'excesso de nutrientes', keywords: ['nutrientes', 'nitrato', 'fosfato', 'fertilizante'] }, { label: 'proliferação de produtores', keywords: ['algas', 'produtores', 'proliferação', 'bloom'] }, { label: 'decomposição', keywords: ['decomposição', 'decompositores'] }, { label: 'queda do oxigênio', keywords: ['oxigênio', 'hipóxia', 'hipoxia'] },
    ], hint: 'O elo frequentemente esquecido é quem consome oxigênio depois do aumento de biomassa.', transferPrompt: 'Se um gráfico mostrar clorofila subindo antes do O₂ cair, explique a defasagem temporal.' }],
    sources: [{ label: 'Roteiro interno “Ecologia: cadeias, teias e relações”', kind: 'material-interno', materialId: 'pod_bio_04' }, { label: 'Questão discursiva Unifesp 2020 — sargaço', kind: 'material-interno', materialId: 'disc_unifesp_bio_2020' }, { label: 'Estratégias de Biologia', kind: 'material-interno', materialId: 'resolutionStrategies' }],
  },
  {
    id: 'atu-cop30-belem', title: 'COP30 em Belém: avanços, limites e leitura de prova', subject: 'Atualidades', topic: 'Clima, energia e meio ambiente', priority: 'muito-alta', prerequisites: ['Acordo de Paris', 'NDCs', 'Justiça climática'],
    overview: 'Dossiê A.T.U.A.L. sobre a conferência realizada em Belém em novembro de 2025, distinguindo decisão formal de avaliação crítica.',
    currentAffairs: { axis: 'clima-energia-meio-ambiente', verifiedAt: '2026-08-24' },
    boards: [
      { board: 'Fuvest', phases: ['primeira', 'segunda'], guidance: 'Cruze escala global, território amazônico, financiamento e conflito de interesses; na 2ª fase, separe decisão formal de avaliação.' },
      { board: 'Unicamp/Comvest', phases: ['primeira', 'segunda'], guidance: 'C-F-C-R: extraia o dado da fonte, mobilize justiça climática/governança e explicite a relação.' },
      { board: 'Unesp/Vunesp', phases: ['primeira', 'segunda'], guidance: 'D-C-E-A: tese direta, conceito, mecanismo político-econômico e aplicação ao caso.' },
      { board: 'Famerp', phases: ['unica'] }, { board: 'Unifesp', phases: ['unica', 'segunda'] }, { board: 'ENEM/Inep', phases: ['unica'] },
    ],
    sections: [
      { id: 'cop-a', title: 'A — Acontecimento', stage: 'intuicao', depth: 'rapida', evidenceKind: 'fato', content: 'A COP30 ocorreu em Belém (PA), de 10 a 22 de novembro de 2025. As Partes adotaram o Pacote Político de Belém; a UNFCCC registra 13 decisões de financiamento no pacote. O texto final não estabeleceu uma rota formal explícita para abandonar combustíveis fósseis.' },
      { id: 'cop-t', title: 'T — Tempo e território', stage: 'conceito', depth: 'aprofundamento', evidenceKind: 'contexto', content: 'A conferência ocorreu dez anos após o Acordo de Paris e no território amazônico. Isso conectou a escala multilateral do clima à floresta tropical, povos indígenas, urbanização de Belém, adaptação e desigualdade entre países com responsabilidades e capacidades distintas.' },
      { id: 'cop-u', title: 'U — Unidades políticas, atores e interesses', stage: 'conceito', depth: 'aprofundamento', evidenceKind: 'contexto', content: 'Estados negociam por consenso, com coalizões e interesses distintos: países vulneráveis pressionam por adaptação e financiamento; produtores e consumidores de fósseis divergem sobre transição; sociedade civil e povos indígenas disputam participação e justiça climática.' },
      { id: 'cop-a2', title: 'A — Antecedentes, articulações e impactos', stage: 'aplicacao', depth: 'aprofundamento', evidenceKind: 'interpretacao', content: 'Leitura sustentada pelas fontes: o pacote preservou a cooperação multilateral e avançou em adaptação/financiamento, mas ficou aquém da ambição defendida por cientistas e organizações porque não incorporou uma rota formal para a transição para longe dos fósseis. “Fracasso total” e “sucesso pleno” são simplificações.' },
      { id: 'cop-l', title: 'L — Leitura de prova', stage: 'estrategia', depth: 'prova', content: 'Conceitos acionáveis: governança global, justiça climática, responsabilidades comuns porém diferenciadas, mitigação × adaptação, NDC e transição energética. Pegadinha: confundir promessa política, decisão formal e implementação. Em charge ou editorial, identifique posição do autor antes de tratar a afirmação como fato.' },
      { id: 'cop-h', title: 'Hipóteses e cenários', stage: 'exercicio', depth: 'prova', evidenceKind: 'hipotese', content: 'O efeito futuro do pacote dependerá de financiamento, políticas nacionais e prestação de contas. Isso é cenário condicionado, não resultado confirmado. Questão de transferência: quais indicadores permitiriam avaliar, daqui a alguns anos, se adaptação e transição saíram do papel?' },
    ],
    retrieval: [{ id: 'cop-r1', sectionId: 'cop-h', prompt: 'Em 4–6 linhas, diferencie um resultado formal da COP30 de uma avaliação sustentada sobre seus limites.', expectedElements: [
      { label: 'decisão formal', keywords: ['pacote', 'decisão', 'decisoes', 'financiamento', 'adaptação', 'adaptacao'] }, { label: 'ausência de rota fóssil', keywords: ['fóssil', 'fossil', 'combustíveis', 'combustiveis'] }, { label: 'avaliação identificada', keywords: ['avaliação', 'avaliacao', 'interpretação', 'interpretacao', 'limite', 'insuficiente'] },
    ], hint: 'Escreva uma frase de fato documental e outra explicitamente apresentada como avaliação.', transferPrompt: 'Uma charge afirma que “toda COP é inútil”. Use um fato, um conceito de governança e uma limitação para construir uma resposta não binária.' }],
    sources: [
      { label: 'UNFCCC — Conferência de Belém e documentos oficiais', kind: 'fonte-oficial', url: 'https://unfccc.int/cop30', verifiedAt: '2026-08-24' },
      { label: 'UNFCCC — Belém Political Package', kind: 'fonte-oficial', url: 'https://unfccc.int/cop30/belem-political-package', verifiedAt: '2026-08-24' },
      { label: 'Nature — análise científica dos resultados', kind: 'fonte-independente', url: 'https://www.nature.com/articles/d41586-025-03802-1', verifiedAt: '2026-08-24' },
      { label: 'Associated Press — síntese independente', kind: 'fonte-independente', url: 'https://apnews.com/article/f41d0dac0553825bdbe1fba5ac31ed90', verifiedAt: '2026-08-24' },
    ],
  },
];
