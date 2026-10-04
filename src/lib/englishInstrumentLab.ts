export type EnglishInstrumentId =
  | 'poetry-reading' | 'quantity-language' | 'modal-certainty' | 'cause-connectors'
  | 'research-claims' | 'narrative-inference' | 'lexical-inference' | 'comparison-signals' | 'stance-language'
  | 'hurricane-forecast' | 'pollution-connectors' | 'warming-evidence' | 'bacteria-context'
  | 'empowerment-language' | 'digital-conditions' | 'probiotic-evidence' | 'stem-cell-trials' | 'taxonomy-hierarchy';

export interface EnglishInstrumentState {
  label: string;
  example: string;
  reading: string;
  trap: string;
  evidence: string[];
  annotation: string;
  diagnosis: string;
}

export interface EnglishInstrumentConfig {
  id: EnglishInstrumentId;
  name: string;
  question: string;
  controlLabel: string;
  controlDescription: string;
  formula: string;
  insight: string;
  context: string;
  states: EnglishInstrumentState[];
}

function state(label: string, example: string, reading: string, trap: string, evidence: string[], annotation: string, diagnosis = 'Adequada: a leitura preserva as pistas e os limites destacados.'): EnglishInstrumentState {
  return { label, example, reading, trap, evidence, annotation, diagnosis };
}
function config(id: EnglishInstrumentId, name: string, controlLabel: string, formula: string, context: string, insight: string, states: EnglishInstrumentState[]): EnglishInstrumentConfig {
  return { id, name, controlLabel, formula, context, insight, states,
    question: `Compare os trechos: ${formula}. Qual leitura preserva a evidência?`,
    controlDescription: 'selecione um trecho e acompanhe as pistas destacadas' };
}

/** Fragmentos originais para leitura. Cenários com números ou estudos são didáticos, não resultados publicados. */
export const ENGLISH_INSTRUMENTS: Record<EnglishInstrumentId, EnglishInstrumentConfig> = {
  'poetry-reading': config('poetry-reading', 'A forma faz o sentido', 'Lente', 'forma + contexto → efeito de sentido', 'Versos originais: a voz lírica espera, contrasta e imagina.', 'Repetição, contraste e metáfora precisam de evidências no verso; o clima geral não substitui a leitura.', [
    state('Repetition', 'Still I wait. Still I listen.', 'a repetição de “Still” concentra persistência', 'tratar a repetição como redundância', ['Still'], 'A mesma abertura aproxima esperar e escutar: a espera continua.'),
    state('Contrast', 'The room is loud, my thoughts are quiet.', 'loud × quiet organiza a tensão', 'ler as duas imagens isoladamente', ['loud', 'quiet'], 'O contraste separa ambiente exterior e experiência interior.'),
    state('Metaphor', 'Hope is a door left open.', 'door representa possibilidade', 'procurar uma porta literal', ['Hope', 'door left open'], 'A abertura dá forma à possibilidade; a esperança é o referente da imagem.'),
  ]),
  'quantity-language': config('quantity-language', 'Energia: número e limite', 'Expressão', 'quantificador + base → intervalo', 'Rótulos de refeições fictícias. kcal mede energia; intake é consumo, expenditure é gasto.', 'Mesmo número não significa mesma relação: teto, piso e dobro exigem leituras diferentes.', [
    state('up to 300 kcal', 'This snack provides up to 300 kcal.', 'teto: no máximo 300 kcal de consumo', 'interpretar como exatamente 300 kcal', ['up to', '300 kcal'], 'A seta parte do limite de 300 e aponta para valores menores.'),
    state('at least 300 kcal', 'This meal provides at least 300 kcal.', 'piso: 300 kcal ou mais de consumo', 'interpretar como no máximo 300 kcal', ['at least', '300 kcal'], 'A seta parte de 300: o limite agora é inferior.'),
    state('twice as much', 'Meal A provides twice as much energy as meal B: 600 versus 300 kcal.', 'A tem o dobro da energia de B', 'somar apenas duas unidades ou confundir consumo com gasto', ['twice as much', '600 versus 300 kcal'], 'B é a referência; duas porções de 300 equivalem às 600 de A.'),
  ]),
  'modal-certainty': config('modal-certainty', 'Terremotos: previsão não é ocorrência', 'Modal', 'modal → força da afirmação', 'Fragmentos didáticos de um boletim após um tremor. Não indicam previsão exata de terremotos.', 'might preserva possibilidade; expected to projeta expectativa; will formula uma previsão mais forte.', [
    state('might', 'Aftershocks might occur.', 'possibilidade cautelosa', 'afirmar que ocorrerão', ['Aftershocks', 'might'], 'O tremor principal é contexto; os tremores secundários continuam possíveis.'),
    state('is expected to', 'Aftershocks are expected to occur.', 'expectativa fundamentada', 'dizer que já ocorreram', ['are expected to'], 'A expectativa continua no futuro; não é registro de tremor ocorrido.'),
    state('will', 'Aftershocks will occur.', 'previsão categórica', 'trocar previsão por fato passado', ['will'], 'O boletim usa uma formulação mais forte; a leitura não deve retroceder o tempo verbal.'),
  ]),
  'hurricane-forecast': config('hurricane-forecast', 'Furacões: alerta, risco e tempo', 'Trecho do boletim', 'previsão de risco → resposta preventiva', 'Boletim fictício de furacão. Storm surge é elevação anormal da água junto à costa.', 'Alerta atual e risco futuro podem aparecer juntos. A evacuação preventiva não prova que a inundação já ocorreu.', [
    state('may', 'The hurricane may cause a storm surge along the coast tomorrow.', 'previsão possível de elevação da água amanhã', 'afirmar que a costa já foi inundada', ['may', 'storm surge', 'tomorrow'], 'O horizonte é amanhã; a faixa de risco não é uma área de dano já observado.'),
    state('expected', 'Residents are advised to evacuate because a storm surge is expected tonight.', 'recomendação atual motivada por risco esperado', 'tratar a recomendação como registro de desastre', ['are advised', 'because', 'is expected'], 'A seta liga o risco projetado à decisão preventiva de agora.'),
    state('observed', 'The hurricane reached the coast yesterday; flooding was reported this morning.', 'ocorrência relatada: chegada e inundação têm tempos explícitos', 'converter uma ocorrência relatada em previsão', ['yesterday', 'was reported', 'this morning'], 'Aqui o boletim relata fatos passados, em vez de antecipar um risco.'),
  ]),
  'cause-connectors': config('cause-connectors', 'Gases: siga a direção causal', 'Conector', 'causa → consequência', 'Simplificação didática: gases de efeito estufa absorvem e emitem radiação infravermelha, contribuindo para reter calor.', 'A ordem das palavras pode mudar sem inverter a relação física entre aumento da retenção de calor e aquecimento.', [
    state('because', 'Temperatures rise because greenhouse gases retain more heat.', 'efeito because causa', 'atribuir a elevação aos termômetros', ['because', 'retain more heat'], 'A explicação vem depois de because; a temperatura é o efeito.'),
    state('therefore', 'Greenhouse gases retain more heat; therefore, temperatures rise.', 'causa; therefore, efeito', 'inverter a seta causal', ['therefore', 'temperatures rise'], 'O conector anuncia a consequência, mantendo a direção da seta.'),
    state('as a result of', 'Temperatures rise as a result of greater heat retention.', 'efeito as a result of causa', 'ler como simples sequência temporal', ['as a result of', 'heat retention'], 'O complemento introduz a causa, não outro acontecimento sem ligação.'),
  ]),
  'pollution-connectors': config('pollution-connectors', 'Poluição: alcance e resposta', 'Recorte', 'fonte → impacto; quantificador → alcance', 'Situação didática de resíduos plásticos em um município fictício; nenhuma taxa real é atribuída.', 'Most não significa all. Uma medida proposta não é uma solução já adotada nem eficácia garantida.', [
    state('most', 'Most plastic waste in this town is not recycled.', 'maioria dos resíduos nesta cidade, sem universalizar', 'trocar most por never ou all', ['Most', 'in this town'], 'O recorte inclui lugar e proporção: alguma reciclagem continua possível.'),
    state('because', 'The river carries plastic because untreated waste enters upstream.', 'entrada de resíduos a montante → transporte no rio', 'confundir transporte do resíduo com sua origem', ['because', 'upstream'], 'A seta começa na fonte; o rio transporta o plástico recebido.'),
    state('proposed', 'The council has proposed filters that may reduce plastic reaching the river.', 'proposta com benefício possível, ainda sem adoção afirmada', 'dizer que os filtros já eliminaram a poluição', ['has proposed', 'may reduce'], 'A barreira é uma intervenção proposta: may mantém o resultado em aberto.'),
  ]),
  'research-claims': config('research-claims', 'Cérebro: o limite do estudo', 'Afirmação', 'desenho do estudo → limite da conclusão', 'Estudo observacional fictício sobre sono e memória; os trechos comparam a força de formulações possíveis.', 'Associação não estabelece direção causal nem garante resultado para toda população.', [
    state('is associated with', 'Poor sleep is associated with memory problems.', 'há associação observada', 'inferir direção causal', ['is associated with'], 'Duas medidas variam juntas; outras variáveis podem explicar a associação.', 'Adequada: o desenho observacional sustenta associação, sem atribuir causa.'),
    state('may contribute to', 'Poor sleep may contribute to memory problems.', 'causalidade possível e parcial', 'apagar o modal e outros fatores', ['may contribute to'], 'A formulação acrescenta hipótese causal; ela exige apoio além da associação.', 'Requer mais evidência: may atenua a hipótese causal, mas não a demonstra.'),
    state('causes', 'Poor sleep causes memory problems.', 'causalidade direta', 'afirmar causalidade sem evidência de um desenho causal', ['causes'], 'O verbo ultrapassa o desenho observacional apresentado no contexto.', 'Inadequada: o desenho observacional não demonstra causalidade.'),
  ]),
  'warming-evidence': config('warming-evidence', 'Aquecimento: evidência e resposta', 'Função do trecho', 'tendência ≠ episódio; adaptação ≠ mitigação', 'Passagens originais sobre clima; o desenho de tendência é esquemático, sem série medida ou valores reais.', 'Uma tendência climática usa períodos longos. Adaptação reduz danos; mitigação enfrenta causas.', [
    state('climate trend', 'Long-term records show a warming climate, although individual years vary.', 'tendência de longo prazo com variação entre anos', 'usar um dia frio para negar a tendência', ['Long-term', 'although', 'individual years vary'], 'A linha de tendência não exige que cada ano seja mais quente que o anterior.'),
    state('projection', 'Future warming is projected to increase if emissions remain high.', 'projeção condicionada à manutenção de emissões altas', 'tratar a projeção como fato passado ou ignorar if', ['is projected', 'if'], 'A trajetória futura depende do cenário declarado; não é uma observação já concluída.'),
    state('adaptation', 'Adaptation can reduce harm, but it does not replace emissions cuts.', 'adaptação reduz danos sem substituir mitigação', 'tratar redução de danos como eliminação da causa', ['can reduce harm', 'but', 'does not replace'], 'As duas respostas têm alvos diferentes: impactos e emissões.'),
  ]),
  'narrative-inference': config('narrative-inference', 'Conto: gesto, fala e sentimento', 'Modo de indicação', 'ação/fala + contexto → sentimento implícito', 'Cena ficcional original. Não confunda personagem, narrador e autor.', 'Combine pistas; um gesto pode sugerir tensão sem explicar sua causa exata.', [
    state('Told directly', 'She was angry.', 'o sentimento está escrito na frase', 'procurar inferência onde o texto já afirma', ['angry'], 'O narrador nomeia o estado; a evidência é explícita.'),
    state('Shown by action', 'She smiled, but kept her hands clenched under the table.', 'sorriso e mãos tensas sugerem desconforto', 'inventar a causa exata da tensão', ['smiled', 'but', 'hands clenched'], 'As mãos corrigem a leitura imediata do sorriso; o contraste sustenta a inferência.'),
    state('Undercut by dialogue', '"Fine," she said, not looking up.', 'fala e comportamento sugerem tensão', 'tomar a palavra fine pelo valor literal', ['Fine', 'not looking up'], 'A fala pertence à personagem; o gesto impede uma leitura automática de tranquilidade.'),
  ]),
  'lexical-inference': config('lexical-inference', 'Sentido por pistas locais', 'Pista', 'definição + exemplo → sentido aproximado', 'Instrumento lexical preservado por compatibilidade; o capítulo Bacteria tem configuração própria.', 'Exemplos não esgotam categorias, e alguns não significa todos.', [
    state('Definition clue', 'A pathogen is an agent that causes disease.', 'a oração após is define o termo', 'procurar a definição fora da frase', ['is', 'causes disease'], 'A definição delimita o termo pelo efeito que produz.'),
    state('Contrast clue', 'Some microbes are harmless, whereas pathogens cause disease.', 'contraste entre ausência de dano e potencial de doença', 'tratar todos os microrganismos como nocivos', ['Some', 'whereas'], 'Some mantém o alcance parcial; a oposição não torna as categorias idênticas.'),
    state('Example clue', 'Pathogens include some bacteria and viruses.', 'os exemplos restringem a categoria do termo', 'tratar os exemplos como lista completa', ['include', 'some'], 'Include exemplifica; não declara que toda bactéria é patogênica.'),
  ]),
  'bacteria-context': config('bacteria-context', 'Bactérias: definição e diversidade', 'Pista científica', 'categoria → papéis → condição', 'Fragmentos originais sobre bactérias e resistência. A seleção atua em populações bacterianas.', 'Nem toda bactéria causa doença. Resistência é propriedade da bactéria, não do corpo da pessoa.', [
    state('definition', 'Bacteria are single-celled organisms without a membrane-bound nucleus.', 'categoria de organismos unicelulares procariontes', 'confundir ausência de núcleo delimitado com ausência de material genético', ['single-celled', 'without a membrane-bound nucleus'], 'A definição combina organização celular e tipo de núcleo; não diz que falta DNA.'),
    state('scope', 'Some bacteria cause disease, whereas others help decompose organic matter.', 'papéis diferentes dentro da mesma categoria', 'afirmar que todas as bactérias são patogênicas', ['Some', 'whereas', 'others'], 'O contraste divide papéis, preservando a diversidade do grupo.'),
    state('selection', 'When susceptible bacteria die, resistant bacteria may survive and reproduce.', 'condição de seleção que favorece bactérias resistentes', 'dizer que o corpo da pessoa ficou resistente', ['When', 'resistant bacteria', 'may'], 'Quem sobrevive e se reproduz são bactérias; may não promete sobrevivência universal.'),
  ]),
  'comparison-signals': config('comparison-signals', 'Vírus: compare propriedades', 'Conector comparativo', 'A + conector + B → diferença ou semelhança', 'Comparação biológica original. Antibióticos têm alvos bacterianos; não tratam infecções virais.', 'Uma semelhança pontual não apaga diferenças de organização e replicação.', [
    state('unlike', 'Unlike bacteria, a virus needs a host cell to replicate.', 'diferença de dependência para replicação', 'ler os dois agentes como equivalentes', ['Unlike', 'host cell'], 'A célula hospedeira fornece maquinaria para replicação viral.'),
    state('similarly', 'Some bacteria can cause disease; similarly, some viruses can cause disease.', 'semelhança pontual no potencial de causar doença', 'concluir que todos causam doença ou que têm os mesmos alvos', ['Some', 'similarly', 'some viruses'], 'A comparação cobre uma propriedade e conserva os dois quantificadores.'),
    state('whereas', 'Antibiotics target bacterial structures, whereas viruses lack those structures.', 'contraste entre presença e ausência dos alvos bacterianos', 'concluir que todo antibiótico funciona contra toda bactéria', ['whereas', 'lack those structures'], 'A diferença de alvos explica por que antibióticos não tratam infecções virais.'),
  ]),
  'stance-language': config('stance-language', 'Discriminação: dado e posição', 'Registro', 'dado → avaliação → convocação', 'Empresa fictícia: percentuais ilustrativos não descrevem população real.', 'Identifique quem relata, quem avalia e quem propõe mudança; sua opinião não substitui o trecho.', [
    state('Neutral data', 'Women make up 40% of this workforce.', 'número relatado sem avaliação', 'ler neutralidade como concordância do autor', ['40%', 'this workforce'], 'A porcentagem descreve esta empresa; não toda experiência feminina.'),
    state('Evaluative', 'Women were less likely to be promoted, despite similar qualifications; this is unfair.', 'contraste de qualificações com avaliação de injustiça', 'atribuir a diferença a menor qualificação', ['despite', 'similar qualifications', 'unfair'], 'Despite impede justificar a disparidade pela qualificação; unfair marca a posição.'),
    state('Call to action', 'Companies must remove barriers to promotion.', 'must pede mudança nas oportunidades', 'ler must como constatação de mudança já feita', ['must', 'remove barriers'], 'A obrigação expressa uma proposta, não um resultado alcançado.'),
  ]),
  'empowerment-language': config('empowerment-language', 'Autonomia: condição não basta', 'Etapa do argumento', 'acesso + recursos + decisão → autonomia', 'Situação argumentativa original sobre educação, representação e capacidade de decisão.', 'Um avanço pode coexistir com barreiras. Condição necessária não é garantia suficiente.', [
    state('necessary', 'Access to education is necessary but not sufficient for gender equality.', 'educação é necessária; outras barreiras permanecem', 'afirmar que educação sozinha resolve toda desigualdade', ['necessary', 'but not sufficient'], 'O acesso é uma base; o segundo segmento recusa a garantia automática de igualdade.'),
    state('participation', 'More women joined the council, while decision-making barriers remained.', 'avanço de participação com barreiras remanescentes', 'tratar aumento de presença como igualdade plena de poder', ['More', 'while', 'remained'], 'Presença e poder de decisão são dimensões distintas no mesmo período.'),
    state('condition', 'Women can influence policy if they have resources and a voice in decisions.', 'potencial de influência condicionado a recursos e voz', 'apagar if e prometer influência para todas', ['can', 'if', 'resources', 'voice'], 'A condição liga recursos e participação efetiva; o modal preserva potencial.'),
  ]),
  'digital-conditions': config('digital-conditions', 'Tecnologia: benefício sob condição', 'Relação argumentativa', 'benefício + contraste + condição → tese', 'Passagens originais sobre trabalho remoto, conectividade e privacidade.', 'Resuma benefício e limite juntos; um pronome pode retomar toda uma ideia.', [
    state('although', 'Remote work can broaden access to jobs, although it may exclude people without reliable internet.', 'benefício possível limitado pela conectividade', 'dizer que todo trabalho remoto inclui ou exclui todos', ['can broaden', 'although', 'may exclude', 'without reliable internet'], 'A tese tem duas pontas: oportunidade e barreira de infraestrutura.'),
    state('provided that', 'Digital platforms can expand learning provided that students have affordable access.', 'potencial de aprendizagem condicionado a acesso acessível', 'eliminar a condição e afirmar benefício universal', ['can', 'provided that', 'affordable access'], 'A condição faz parte da promessa; não é detalhe periférico.'),
    state('this', 'Platforms collect personal data. This may threaten privacy if safeguards are absent.', 'This retoma a coleta de dados, com risco condicionado', 'retomar apenas a palavra data ou tratar risco como certeza', ['This', 'may', 'if'], 'O antecedente é uma ação inteira: coletar dados pessoais.'),
  ]),
  'probiotic-evidence': config('probiotic-evidence', 'Probióticos: cepa, dose e evidência', 'Recorte do estudo', 'cepa + dose + população → alcance', 'Ensaio fictício para interpretação; não informa eficácia de produto nem recomendação clínica.', 'Promising but inconclusive indica potencial em investigação. Não generalize cepa, dose ou população.', [
    state('specific strain', 'In this trial, one probiotic strain may benefit some adult participants at the tested dose.', 'possível benefício desta cepa, dose e amostra adulta', 'prometer benefício para todas as cepas e pessoas', ['one probiotic strain', 'may', 'some adult participants', 'tested dose'], 'O funil mantém quatro limites: produto, possibilidade, população e dose.'),
    state('inconclusive', 'The probiotic findings are promising but inconclusive; further research is needed.', 'sinal promissor sem conclusão definitiva', 'traduzir promising como cura comprovada', ['promising', 'but inconclusive', 'further research'], 'A ressalva governa a conclusão; o benefício ainda não foi estabelecido pelo fragmento.'),
    state('definition', 'Probiotics are live microorganisms that confer a health benefit when administered in adequate amounts.', 'definição inclui benefício e quantidade adequada', 'chamar todo alimento fermentado de probiótico sem evidência', ['live microorganisms', 'health benefit', 'adequate amounts'], 'A definição pede critérios; não se reduz à presença de microrganismos.'),
  ]),
  'stem-cell-trials': config('stem-cell-trials', 'Células-tronco: potencial e ensaio', 'Etapa científica', 'capacidade celular ≠ terapia comprovada', 'Fragmentos originais. Um ensaio inicial hipotético não representa tratamento aprovado.', 'Autorrenovação e diferenciação são capacidades; resultado promissor não equivale a cura disponível.', [
    state('potential', 'Stem cells can self-renew and may differentiate into specialized cells under suitable conditions.', 'potencial de autorrenovação e diferenciação sob condições', 'afirmar que qualquer célula-tronco forma qualquer tecido', ['self-renew', 'may differentiate', 'under suitable conditions'], 'A bifurcação distingue manter células-tronco e produzir tipos especializados.'),
    state('early trial', 'A stem cell therapy showed promising results in an early trial; its safety needs further study.', 'resultado inicial promissor com segurança ainda em estudo', 'converter um ensaio inicial em cura aprovada', ['promising', 'early trial', 'safety needs further study'], 'O percurso para terapia não salta a etapa de segurança e evidência adicional.'),
    state('ethical debate', 'Some researchers discuss ethical concerns about embryonic stem cells, whereas others study induced pluripotent cells.', 'duas linhas de discussão, sem posição do autor declarada', 'atribuir ao autor toda opinião citada de pesquisadores', ['Some researchers', 'whereas', 'others'], 'O contraste atribui posições a grupos; discutir não é necessariamente endossar.'),
  ]),
  'taxonomy-hierarchy': config('taxonomy-hierarchy', 'Taxonomia: pertencer não é equivaler', 'Operação classificatória', 'exemplo ⊂ categoria ⊂ grupo amplo', 'Fragmentos originais de classificação. A hierarquia usa grupos, não uma lista de sinônimos.', 'A propriedade do grupo pode valer para seu membro; a inclusão não autoriza inverter todos os grupos.', [
    state('inclusion', 'Reptiles are ectothermic vertebrates; snakes are reptiles.', 'cobras são subconjunto de répteis e pertencem aos vertebrados', 'inverter a inclusão e chamar todos os vertebrados de cobras', ['ectothermic vertebrates', 'snakes are reptiles'], 'A leitura percorre cobras → répteis → vertebrados, preservando a direção da inclusão.'),
    state('definition', 'Mammals are vertebrates that nurse their young.', 'vertebrados é grupo amplo; nurse their young delimita mamíferos', 'concluir que todos os vertebrados são mamíferos', ['vertebrates', 'nurse their young'], 'A oração relativa acrescenta uma característica ao grupo, sem igualar as categorias.'),
    state('example', 'Mammals include bats, which nurse their young.', 'morcegos são exemplo; which retoma bats', 'transformar um exemplo na lista completa dos mamíferos', ['include', 'bats', 'which'], 'Include exemplifica e which retoma o antecedente; o voo dos morcegos não define todo mamífero.'),
  ]),
};

export function englishInstrumentState(id: EnglishInstrumentId, index: number) {
  const states = ENGLISH_INSTRUMENTS[id].states;
  const bounded = Number.isFinite(index) ? Math.round(index) : 0;
  return states[Math.max(0, Math.min(states.length - 1, bounded))];
}
