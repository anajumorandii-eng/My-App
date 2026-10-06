import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import { useSceneMotion } from '../topic-scenes/useSceneMotion';
import { Arrow, Box, Drawing, Line, OperationWorkshop, type Foundation } from './LiteratureFoundations';

/** Filosofia: o argumento desenhado. A auditoria recusou, nestes capítulos,
 *  degraus que só davam ordem (caverna, linha, dúvida), círculos que trocavam de
 *  lugar (Sócrates, Hegel, Nietzsche) e uma escada que levava ao excesso (meio-
 *  termo). Aqui cada estado desenha a relação que o texto descreve — a projeção
 *  das sombras, a definição derrubada pelo contraexemplo, a régua bilateral —
 *  e a âncora é frase literal do próprio resumo, que já está em revisão 2. */
export const PHILOSOPHY_OPERATIONS = {
  'myth-logos': {
    topic: 'O Nascimento da Filosofia: do Mito ao Logos', question: 'A explicação aceita objeção, ou só autoridade?', relation: 'mito: autoridade → aceitação; logos: causa → exame → correção',
    states: [
      { label: 'Mito', section: 'Duas formas de explicar', anchor: 'o raio é ira de Zeus', observation: 'A causa é uma vontade divina, e a explicação vale pela tradição de quem conta.', conclusion: 'Não há porta para objeção: aceitar é respeitar o costume.' },
      { label: 'Logos', section: 'Duas formas de explicar', anchor: 'causas naturais impessoais, sujeitas a exame, argumentação e correção', observation: 'O mesmo raio passa a ter causa natural, e a explicação pode ser contestada.', conclusion: 'O que muda não é o fenômeno, é a exigência de justificar.' },
      { label: 'Contestação', section: 'O que caracteriza o discurso filosófico', anchor: 'Anaximandro pôde criticar e superar a resposta de seu mestre Tales', observation: 'Cada resposta vira hipótese que o próximo pensador examina e corrige.', conclusion: 'O logos é debate cumulativo, não uma nova verdade intocável.' },
      { label: 'Condições', section: 'Condições históricas', anchor: 'mitos incompatíveis entre si', observation: 'O comércio expõe versões rivais do mesmo fenômeno.', conclusion: 'Comparar mitos enfraquece a autoridade de cada um.' },
    ],
  },
  'socratic-method': {
    topic: 'O Método Socrático e a Maiêutica', question: 'Que definição cai, e o que nasce no lugar?', relation: 'certeza → pergunta → contradição → aporia → parto',
    states: [
      { label: 'Ironia', section: 'Ironia e maiêutica', anchor: 'fingir ignorância diante do interlocutor', observation: 'O especialista afirma com segurança; Sócrates só pergunta.', conclusion: 'A ironia é estratégia pedagógica, não zombaria.' },
      { label: 'Contradição', section: 'Ironia e maiêutica', anchor: 'revelam progressivamente contradições internas', observation: 'A definição “nunca recuar” não cobre o recuo que salva a tropa.', conclusion: 'O contraexemplo derruba a definição por dentro.' },
      { label: 'Aporia', section: 'Só sei que nada sei', anchor: 'consciência clara dos limites de seu próprio conhecimento', observation: 'A falsa certeza vira ignorância reconhecida.', conclusion: 'Não é ceticismo total: é condição para investigar.' },
      { label: 'Parto', section: 'Ironia e maiêutica', anchor: 'arte da parteira', observation: 'Novas perguntas ajudam o interlocutor a formular outra definição.', conclusion: 'A ideia nasce do interlocutor; Sócrates não a entrega pronta.' },
    ],
  },
  cave: {
    topic: 'O Mito da Caverna', question: 'O que o prisioneiro vê em cada etapa?', relation: 'sombras → objetos → coisas à luz → sol → retorno',
    states: [
      { label: 'Sombras', section: 'A alegoria', anchor: 'tomam essas sombras projetadas como a totalidade da realidade', observation: 'O fogo atrás projeta na parede as estatuetas carregadas na passarela.', conclusion: 'Eikasia: imagem de imagem tomada como tudo.' },
      { label: 'Objetos e fogo', section: 'A alegoria', anchor: 'primeiro vê os próprios objetos que geravam as sombras', observation: 'Virado para trás, o liberto vê as estatuetas e o fogo que as projetava.', conclusion: 'Pistis: os objetos sensíveis dos quais as sombras eram reflexo.' },
      { label: 'Sol', section: 'A alegoria', anchor: 'o próprio sol, fonte de toda luz e visibilidade', observation: 'Fora, as coisas reais e por fim a fonte que torna tudo visível.', conclusion: 'Noesis: a Ideia de Bem ilumina todas as Ideias.' },
      { label: 'Retorno', section: 'Educação e política', anchor: 'tem o dever de retornar à caverna', observation: 'O liberto desce de novo, tropeça no escuro e é hostilizado.', conclusion: 'A alegoria é política e pedagógica, não convite ao isolamento.' },
    ],
  },
  'divided-line': {
    topic: 'A Alegoria da Linha Dividida e o Conhecimento', question: 'Que objeto, e que tipo de saber?', relation: 'eikasia < pistis < dianoia < noesis; doxa | episteme',
    states: [
      { label: 'Eikasia', section: 'A linha e seus segmentos', anchor: 'sombras, reflexos na água e imagens', observation: 'O segmento mais curto: cópias de cópias.', conclusion: 'O grau mais baixo de realidade e de clareza.' },
      { label: 'Pistis', section: 'A linha e seus segmentos', anchor: 'os animais, as plantas e os artefatos', observation: 'Os próprios objetos sensíveis, de que as imagens eram reflexo.', conclusion: 'Ainda opinião: o objeto muda.' },
      { label: 'Dianoia', section: 'A matemática como passagem', anchor: 'o teorema vale para todo triângulo, não para este desenho específico', observation: 'O objeto já é inteligível, mas o raciocínio parte de hipóteses e usa figura.', conclusion: 'A matemática é passagem: desabitua do sensível.' },
      { label: 'Doxa × episteme', section: 'Doxa e episteme', anchor: 'acerta, mas não sabe', observation: 'A linha se divide em duas metades: opinião sobre o que muda, ciência sobre o que permanece.', conclusion: 'A diferença é de objeto e fundamento, não de confiança.' },
    ],
  },
  'golden-mean': {
    topic: 'A Ética a Nicômaco e a Doutrina do Meio-Termo', question: 'Onde fica o meio, e quem o encontra?', relation: 'falta ← virtude → excesso; meio relativo à situação',
    states: [
      { label: 'Régua bilateral', section: 'O meio-termo', anchor: 'A coragem é o meio entre a temeridade', observation: 'Covardia e temeridade são dois vícios, um de cada lado.', conclusion: 'A virtude não é degrau rumo ao excesso: os dois lados erram.' },
      { label: 'Meio contextual', section: 'O meio-termo', anchor: 'o ponto certo, no momento certo, com a pessoa certa', observation: 'O mesmo gesto é coragem para o bombeiro e temeridade para o pedestre.', conclusion: 'O meio é achado pela prudência, não pela média.' },
      { label: 'Hábito', section: 'Virtude como hábito', anchor: 'torna-se corajoso praticando atos de coragem', observation: 'A repetição de atos aproxima o ponteiro do meio.', conclusion: 'Virtude é hexis formada pela prática, não teoria.' },
    ],
  },
  'cartesian-doubt': {
    topic: 'Descartes e o Método: a Dúvida Hiperbólica', question: 'O que cai em cada grau, e o que resta?', relation: 'sentidos → sonho → gênio maligno → cogito',
    states: [
      { label: 'Sentidos', section: 'Os graus da dúvida', anchor: 'um bastão parece torto na água', observation: 'Quem já foi enganado tem razão para suspender toda informação sensorial.', conclusion: 'Cai a confiança nos sentidos.' },
      { label: 'Sonho', section: 'Os graus da dúvida', anchor: 'dois mais três são cinco esteja-se dormindo ou acordado', observation: 'O mundo exterior cai; a matemática ainda resiste.', conclusion: 'O sonho não alcança verdades simples.' },
      { label: 'Gênio maligno', section: 'Os graus da dúvida', anchor: 'a hipótese do gênio maligno', observation: 'Até o que parece evidente à razão pode ser engano.', conclusion: 'Hipótese de método, não afirmação de que ele existe.' },
      { label: 'Cogito', section: 'O cogito e o método', anchor: 'penso, logo existo', observation: 'Duvidar pressupõe quem duvida: isso não cai.', conclusion: 'Primeiro princípio certo, base da reconstrução.' },
    ],
  },
  'hegel-dialectic': {
    topic: 'Hegel e a Dialética', question: 'Que contradição nasce de dentro, e o que é superado?', relation: 'posição → contradição interna → Aufhebung',
    states: [
      { label: 'Contradição interna', section: 'O movimento dialético', anchor: 'contradições internas que geram seu oposto', observation: 'O oposto não chega de fora: sai do exame da própria posição.', conclusion: 'Dialética é estrutura do real, não oposição arbitrária.' },
      { label: 'Aufhebung', section: 'O movimento dialético', anchor: 'cancelar, preservar e elevar', observation: 'Um gesto só, com três sentidos: algo some, algo fica, tudo sobe de nível.', conclusion: 'Superar não é eliminar um dos lados.' },
      { label: 'Senhor e escravo', section: 'Dialética do senhor e do escravo', anchor: 'aquele que recua por medo da morte torna-se escravo', observation: 'A luta por reconhecimento produz uma relação assimétrica.', conclusion: 'O senhor depende de um reconhecimento que não reconhece.' },
      { label: 'Inversão', section: 'Dialética do senhor e do escravo', anchor: 'transformando a natureza pelo trabalho', observation: 'O escravo forma consciência no trabalho; o senhor só consome.', conclusion: 'A vitória do senhor se esvazia; o trabalho liberta.' },
    ],
  },
  'nietzsche-genealogy': {
    topic: 'Nietzsche e a Crítica aos Valores Morais', question: 'De onde vem o valor, e quem o inverteu?', relation: 'origem → inversão → colapso → criação',
    states: [
      { label: 'Genealogia', section: 'Genealogia da moral', anchor: 'de onde vêm e a que interesses serviram', observation: 'A pergunta deixa de ser “é verdadeiro?” e vira “quem precisou disso?”.', conclusion: 'Valor tem história e interesse, não origem neutra.' },
      { label: 'Inversão', section: 'Genealogia da moral', anchor: 'rebatiza fraqueza como virtude', observation: 'Força passa de “bom” a “mau”; humildade, de “ruim” a “bem”.', conclusion: 'Ressentimento: vingança por reavaliação simbólica.' },
      { label: 'Niilismo', section: 'Crítica à metafísica e à religião', anchor: 'Deus está morto', observation: 'O fundamento dos valores absolutos desaba, e nada o substitui.', conclusion: 'Diagnóstico cultural, não ateísmo casual.' },
      { label: 'Criação', section: 'Vontade de potência e além-do-homem', anchor: 'capaz de criar seus próprios valores', observation: 'No vazio, a tarefa é criar, não lamentar.', conclusion: 'Além-do-homem é figura ética, não superioridade biológica.' },
    ],
  },
  'aristotle-logic': {
    topic: 'Lógica e Metafísica Aristotélicas', question: 'A conclusão decorre da forma, ou do conteúdo?', relation: 'termo médio liga maior e menor; validade ≠ verdade',
    states: [
      { label: 'Silogismo', section: 'Lógica e silogismo', anchor: 'todo homem é mortal; Sócrates é homem; logo, Sócrates é mortal', observation: '“Homem” aparece nas duas premissas e liga “mortal” a “Sócrates”.', conclusion: 'O termo médio carrega a ligação e some na conclusão.' },
      { label: 'Validade ≠ verdade', section: 'Lógica e silogismo', anchor: 'validade (propriedade da forma do argumento)', observation: 'Com premissa falsa, a mesma forma ainda produz conclusão necessária.', conclusion: 'Forma válida não garante verdade do conteúdo.' },
      { label: 'Matéria e forma', section: 'Substância, matéria e forma', anchor: 'o bronze, antes de ser esculpido', observation: 'O bronze é potência; o formato de cavalo o determina.', conclusion: 'A forma está na coisa, não num mundo separado.' },
      { label: 'Quatro causas', section: 'Potência, ato e as quatro causas', anchor: 'as quatro causas', observation: 'Bronze, formato, escultor e propósito explicam a mesma estátua.', conclusion: 'Explicação completa responde às quatro perguntas.' },
    ],
  },
  'aquinas-synthesis': {
    topic: 'Escolástica e Santo Tomás de Aquino', question: 'Como conciliar razão pagã e fé revelada?', relation: 'questão → objeções → resposta; razão e fé sem contradição',
    states: [
      { label: 'O problema', section: 'O contexto escolástico', anchor: 'como incorporar um sistema filosófico pagão', observation: 'Aristóteles volta via traduções árabes e desafia a teologia.', conclusion: 'A síntese nasce de uma tensão real, não de um acordo pronto.' },
      { label: 'Método', section: 'O contexto escolástico', anchor: 'expor argumentos contrários (sed contra)', observation: 'Questão, objeções, refutação e resposta, nessa ordem.', conclusion: 'Disputa disciplinada, não dogmatismo simples.' },
      { label: 'Duas verdades', section: 'Tomás e a síntese', anchor: 'fé e razão, corretamente compreendidas, não podem se contradizer', observation: 'Há verdades demonstráveis e reveladas; as segundas excedem a razão sem contrariá-la.', conclusion: 'Filosofia serva da teologia, com valor próprio.' },
      { label: 'Cinco vias', section: 'As cinco vias', anchor: 'essa cadeia não pode regredir infinitamente', observation: 'Do movimento observado até um primeiro motor imóvel.', conclusion: 'Demonstração racional que parte do sensível.' },
    ],
  },
  'hume-causation': {
    topic: 'A Crítica de Hume à Causalidade', question: 'O que se vê, e o que a mente acrescenta?', relation: 'contiguidade + sucessão + conjunção ≠ conexão necessária',
    states: [
      { label: 'O que se vê', section: 'O problema', anchor: 'uma bola de bilhar que atinge outra', observation: 'Contato, antes e depois, repetição: a força que obriga não aparece.', conclusion: 'Não há impressão sensorial de necessidade.' },
      { label: 'Hábito', section: 'Hábito e expectativa', anchor: 'a necessidade que atribuímos à conexão causal não está nos objetos', observation: 'A repetição cria expectativa, e a mente a projeta no mundo.', conclusion: 'Necessidade é sentimento da mente, não força observável.' },
      { label: 'Indução', section: 'O problema da indução', anchor: 'todos os cisnes vistos até hoje eram brancos', observation: 'Justificar que o futuro imita o passado usando o passado é circular.', conclusion: 'Ceticismo sobre o fundamento, não abandono da ciência.' },
    ],
  },
  'hobbes-state': {
    topic: 'Hobbes e o Estado de Natureza', question: 'Do medo comum ao soberano: quem firma o pacto?', relation: 'igualdade → guerra → pacto entre súditos → soberano',
    states: [
      { label: 'Igualdade', section: 'O estado de natureza', anchor: 'mesmo o mais fraco pode matar o mais forte por astúcia ou aliança', observation: 'Ninguém tem vantagem decisiva: todos são ameaça.', conclusion: 'A igualdade, não a maldade, gera o perigo.' },
      { label: 'Guerra', section: 'O estado de natureza', anchor: 'solitária, pobre, sórdida, brutal e curta', observation: 'Disposição constante ao conflito impede plantar, construir, navegar.', conclusion: 'Guerra é desconfiança permanente, não batalha contínua.' },
      { label: 'Pacto', section: 'O contrato', anchor: 'o contrato ocorre entre os próprios súditos entre si', observation: 'Os súditos se ligam entre si; o soberano fica fora do pacto.', conclusion: 'Quem não prometeu não pode ser acusado de romper.' },
      { label: 'Limite', section: 'Consequências políticas', anchor: 'o súdito não é obrigado a obedecer ordens que ameacem diretamente sua própria vida', observation: 'A autopreservação que motivou o pacto não se renuncia.', conclusion: 'Obediência ampla, mas não ao próprio extermínio.' },
    ],
  },
  'locke-rights': {
    topic: 'Locke e os Direitos Naturais', question: 'O governo cria direitos ou só os guarda?', relation: 'direitos anteriores → governo fiduciário → resistência',
    states: [
      { label: 'Lei natural', section: 'Estado de natureza segundo Locke', anchor: 'ninguém deve prejudicar a vida, a liberdade, a saúde ou os bens de outrem', observation: 'Já há regra moral antes do governo; falta juiz imparcial.', conclusion: 'O problema é a insegurança, não a guerra de todos.' },
      { label: 'Trabalho', section: 'Estado de natureza segundo Locke', anchor: 'ao misturar seu trabalho com algo previamente comum', observation: 'Colher o fruto torna-o seu, se restar o bastante aos outros.', conclusion: 'A propriedade nasce do trabalho, antes do Estado.' },
      { label: 'Depositário', section: 'O contrato e o governo limitado', anchor: 'um depositário de confiança', observation: 'O governo recebe poder com finalidade: proteger o que já existia.', conclusion: 'Poder condicional e dividido, não absoluto.' },
      { label: 'Resistência', section: 'Direito de resistência', anchor: 'o povo recupera o direito de resistir', observation: 'O governo que viola a finalidade perde a legitimidade.', conclusion: 'A confiança quebrada devolve o poder ao povo.' },
    ],
  },
  'rousseau-general-will': {
    topic: 'Rousseau e a Vontade Geral', question: 'Soma de interesses ou bem comum?', relation: 'bondade natural → propriedade corrompe → vontade geral → liberdade civil',
    states: [
      { label: 'Homem natural', section: 'O homem natural', anchor: 'repulsa natural ao sofrimento alheio', observation: 'Amor de si e piedade moderam o egoísmo antes de qualquer lei.', conclusion: 'A maldade não é natural; é produzida.' },
      { label: 'A cerca', section: 'O homem natural', anchor: 'cerca um pedaço de terra', observation: 'A propriedade inaugura comparação, vaidade e dependência.', conclusion: 'A desigualdade é histórica, não natural.' },
      { label: 'Vontade geral', section: 'O contrato e a vontade geral', anchor: 'não é simples soma das vontades particulares', observation: 'Somar desejos privados dá a vontade de todos; deliberar sobre o comum dá a geral.', conclusion: 'Não é simples maioria aritmética.' },
      { label: 'Liberdade civil', section: 'Liberdade e educação', anchor: 'obedecer a leis que o próprio cidadão', observation: 'Obedecer à lei que se ajudou a fazer é liberdade, não submissão.', conclusion: 'Daí o polêmico “forçado a ser livre”.' },
    ],
  },
  'kant-duty': {
    topic: 'A Ética Kantiana e o Imperativo Categórico', question: 'A ação mudaria se o interesse mudasse?', relation: 'por dever ≠ conforme o dever; máxima universalizável',
    states: [
      { label: 'Por dever?', section: 'Dever e boa vontade', anchor: 'O comerciante que não engana os clientes', observation: 'Um não engana por reputação; outro, por reconhecer que enganar é errado.', conclusion: 'Só a ação por dever tem valor moral; teste mudando o lucro.' },
      { label: 'Universalizar', section: 'O imperativo categórico', anchor: 'prometer falsamente quando conveniente', observation: 'Se todos prometessem falsamente, ninguém acreditaria em promessa.', conclusion: 'A máxima se destrói ao virar lei: é imoral.' },
      { label: 'Hipotético', section: 'O imperativo categórico', anchor: 'se queres aprovação no vestibular, deves estudar', observation: 'A ordem vale só para quem tem o fim; largar o fim livra da ordem.', conclusion: 'O categórico vale para todo ser racional.' },
      { label: 'Autonomia', section: 'Autonomia', anchor: 'dar a si mesmo a própria lei', observation: 'Medo do castigo ou desejo de aprovação são determinações externas.', conclusion: 'Heteronomia tira o valor moral; daí dignidade, não preço.' },
    ],
  },
  'historical-materialism': {
    topic: 'O Materialismo Histórico', question: 'O que determina, e o que retorna?', relation: 'base material → superestrutura → efeito de retorno',
    states: [
      { label: 'Inversão', section: 'Inversão da dialética', anchor: 'de cabeça para baixo', observation: 'Não são as ideias que movem a história, mas as condições materiais.', conclusion: 'Marx inverte a direção causal principal de Hegel.' },
      { label: 'Base e legitimação', section: 'Infraestrutura e superestrutura', anchor: 'ajuda a legitimar e reproduzir a infraestrutura', observation: 'A lei de propriedade se ergue sobre a base e a protege.', conclusion: 'Superestrutura reflete e sustenta a base.' },
      { label: 'Retorno', section: 'Infraestrutura e superestrutura', anchor: 'efeitos de retorno sobre a própria base econômica', observation: 'A seta volta: o direito também age sobre a economia.', conclusion: 'Determinação em última instância, não mecânica.' },
      { label: 'Transição', section: 'Modos de produção', anchor: 'de impulso ao desenvolvimento passam a entrave', observation: 'As forças produtivas crescem até as relações virarem obstáculo.', conclusion: 'A contradição interna move a passagem de um modo a outro.' },
    ],
  },
  'class-struggle': {
    topic: 'A Luta de Classes na Filosofia Marxista', question: 'O antagonismo existe; a consciência dele, nem sempre.', relation: 'posição na produção → classe em si → consciência → classe para si',
    states: [
      { label: 'Antagonismo', section: 'A tese central', anchor: 'a história de toda sociedade até hoje é a história da luta de classes', observation: 'Quem controla os meios extrai trabalho de quem não os controla.', conclusion: 'O motor é a posição na produção, não ideias ou heróis.' },
      { label: 'Em si → para si', section: 'Classe em si e para si', anchor: 'reconhece seus interesses comuns, organiza-se politicamente', observation: 'Os mesmos trabalhadores, dispersos ou organizados.', conclusion: 'A existência objetiva não basta: falta a consciência.' },
      { label: 'Ideologia', section: 'Ideologia e Estado', anchor: 'apresenta como natural, eterno e universal aquilo que é histórico', observation: 'A propriedade privada aparece como fato da natureza humana.', conclusion: 'A ideologia obstrui a passagem à classe para si.' },
      { label: 'Estado', section: 'Ideologia e Estado', anchor: 'comitê que administra os negócios comuns da burguesia', observation: 'Direito, polícia e administração garantem a reprodução da ordem.', conclusion: 'Não árbitro neutro, mas instrumento de classe.' },
    ],
  },
  'sartre-freedom': {
    topic: 'O Existencialismo de Sartre', question: 'O que vem antes: o projeto ou a existência?', relation: 'existência → escolhas → essência; liberdade → responsabilidade',
    states: [
      { label: 'Cortador × humano', section: 'A existência precede a essência', anchor: 'Um cortador de papel é concebido por um artesão', observation: 'No objeto, o projeto vem antes; no humano, a existência vem antes.', conclusion: 'Sem natureza fixa, cada um se define pelo que escolhe.' },
      { label: 'Condenado', section: 'Liberdade e responsabilidade', anchor: 'o homem está condenado a ser livre', observation: 'Até não escolher é escolher: não há saída da liberdade.', conclusion: 'Liberdade total traz responsabilidade total e angústia.' },
      { label: 'Má-fé', section: 'Engajamento', anchor: 'sou assim, não posso mudar', observation: 'A desculpa trata a própria identidade como coisa fixa.', conclusion: 'Má-fé é fugir da liberdade fingindo não tê-la.' },
    ],
  },
  'frankfurt-culture': {
    topic: 'A Escola de Frankfurt e a Indústria Cultural', question: 'O que muda de verdade entre dois produtos?', relation: 'lucro → padronização → pseudoindividualização → passividade',
    states: [
      { label: 'Pergunta', section: 'Teoria crítica', anchor: 'por que o progresso da razão e da técnica', observation: 'A sociedade mais avançada produziu barbárie organizada.', conclusion: 'A teoria crítica recusa a neutralidade.' },
      { label: 'Razão instrumental', section: 'Razão instrumental', anchor: 'Essa razão pergunta como fazer, nunca se deve ser feito', observation: 'Eficiência máxima de meios, nenhum exame dos fins.', conclusion: 'O esclarecimento vira novo mito.' },
      { label: 'Mesma fórmula', section: 'Indústria cultural', anchor: 'obras diferentes obedecem à mesma fórmula', observation: 'Troca-se a capa e o refrão, mantém-se o esquema.', conclusion: 'Padronização planejada de cima, para o lucro.' },
      { label: 'Ilusão de escolha', section: 'Indústria cultural', anchor: 'a variação mínima cria ilusão de escolha', observation: 'Escolher entre variações do mesmo esquema parece liberdade.', conclusion: 'Pseudoindividualização produz passividade.' },
    ],
  },
} satisfies Record<string, Foundation>;
export type PhilosophyOperationId = keyof typeof PHILOSOPHY_OPERATIONS;

const ink = 'var(--vs-ink)', wine = 'var(--vs-burgundy)', paper = 'var(--vs-paper)';

function MythLogos({ state }: { state: number }) {
  return <Drawing label={['Raio explicado pela ira de Zeus, aceito por tradição', 'Raio explicado por causa natural, aberto a objeção', 'Tales, Anaximandro e Anaxímenes corrigindo-se', 'Navios trazem mitos que não combinam'][state]}>
    {state < 2 && <><path d="M60 30l-20 60h25l-20 70 60-90H80l20-40z" fill={wine}/><Box x={160} y={50} w={200} strong={state === 0}>{state === 0 ? 'Zeus irado' : 'causa natural'}</Box><Arrow d="M130 72h25"/>{state === 0
      ? <><Box x={160} y={120} w={200}>“é tradição”</Box><path d="M380 140h120" stroke={ink} strokeDasharray="5 5"/><Line x={390} y={130}>objeção ✕</Line></>
      : <><Box x={160} y={120} w={200}>argumento</Box><Arrow d="M370 142h70m-12-8 12 8-12 8"/><Line x={450} y={148}>objeção</Line><Arrow d="M470 160q-100 50-230 0"/></>}
      <Line x={20} y={222}>{state === 0 ? 'aceito por autoridade' : 'aceito se resiste ao exame'}</Line></>}
    {state === 2 && <>{['Tales: água', 'Anaximandro', 'Anaxímenes: ar'].map((w, i) => <Box key={w} x={20 + i * 180} y={70} w={160} strong={i === 1}>{w}</Box>)}<Arrow d="M182 92h16m162 0h16"/><Line y={170}>cada resposta é contestada pela seguinte</Line><Line x={20} y={222}>debate cumulativo e público</Line></>}
    {state === 3 && <><path d="M40 160q240 40 480 0" fill="none" stroke={ink} strokeWidth="2"/>{[['Egito', 60], ['Babilônia', 230], ['Jônia', 410]].map(([w, x]) => <Box key={w as string} x={x as number} y={60} w={130} strong={w === 'Jônia'}>{w}</Box>)}<Arrow d="M195 82h30m145 0h35"/><Line y={180}>mesmo fenômeno, versões rivais</Line><Line x={20} y={222}>comparar enfraquece a autoridade</Line></>}
  </Drawing>;
}
function Socratic({ state }: { state: number }) {
  return <Drawing label={['Especialista seguro e Sócrates perguntando', 'Contraexemplo derruba a definição', 'Falsa certeza vira ignorância reconhecida', 'Nova definição formulada pelo interlocutor'][state]}>
    {state === 0 && <><Box x={20} y={50} w={300} strong>“Coragem é nunca recuar.”</Box><Line x={360} y={80}>Sócrates: ?</Line><Arrow d="M355 75q-20-30-30 0"/><Line y={170}>pergunta ingênua, alvo preciso</Line><Line x={20} y={222}>ironia como método</Line></>}
    {state === 1 && <><Box x={20} y={30} w={300}>“Coragem é nunca recuar.”</Box><path d="M20 52h300" stroke={wine} strokeWidth="4"/><Box x={20} y={110} w={420} strong>recuar para salvar a tropa não é coragem?</Box><Arrow d="M170 105V80"/><Line x={20} y={222}>o contraexemplo vem de dentro</Line></>}
    {state === 2 && <><Box x={20} y={60} w={200}>“eu sei”</Box><Arrow d="M225 82h80m-12-8 12 8-12 8"/><Box x={315} y={60} w={210} strong>“não sei ainda”</Box><Line y={160}>aporia: impasse que abre a busca</Line><Line x={20} y={222}>consciência do limite</Line></>}
    {state === 3 && <><Line y={50}>perguntas → perguntas →</Line><Arrow d="M240 70q60 40 0 70"/><Box x={20} y={120} w={420} strong>“coragem é saber o que se deve temer”</Box><Line x={20} y={222}>a ideia nasce do interlocutor</Line></>}
  </Drawing>;
}
function Cave({ state }: { state: number }) {
  const transition = useSceneMotion();
  const pos = [[150, 150], [300, 150], [500, 60], [190, 150]][state];
  return <Drawing label={['Prisioneiros olham sombras na parede', 'O liberto vê estatuetas e fogo', 'Fora, o sol', 'O liberto volta à caverna'][state]}>
    <path d="M20 200V40h360v40h160" fill="none" stroke={ink} strokeWidth="3"/>
    <rect x="30" y="80" width="20" height="100" fill={state === 0 ? wine : paper} stroke={ink}/>
    {[110, 140].map(x => <circle key={x} cx={x} cy="165" r="10" fill={ink}/>)}
    <path d="M200 140h120" stroke={ink} strokeWidth="2"/><rect x="235" y="118" width="14" height="22" fill={state === 1 ? wine : ink}/><rect x="270" y="118" width="14" height="22" fill={state === 1 ? wine : ink}/>
    <path d="M340 190q10-30 0-40q-10 10 0 40" fill={wine}/>
    <circle cx="505" cy="40" r="16" fill={state === 2 ? wine : paper} stroke={ink} strokeWidth="2"/>
    <motion.circle initial={false} animate={{ cx: pos[0], cy: pos[1] }} transition={transition} r="9" fill={wine}/>
    {state === 0 && <Arrow d="M330 160Q200 100 55 120"/>}
    {state === 3 && <Arrow d="M480 70Q360 70 200 140"/>}
    <Line x={20} y={225}>{['eikasia: sombra tomada como tudo', 'pistis: o objeto e o fogo', 'noesis: a fonte de toda luz', 'dever de voltar e educar'][state]}</Line>
  </Drawing>;
}
function DividedLine({ state }: { state: number }) {
  const segs = [[30, 70, 'eikasia', 'reflexo'], [100, 160, 'pistis', 'árvore'], [260, 120, 'dianoia', 'triângulo'], [380, 160, 'noesis', 'Ideia']] as const;
  return <Drawing label={['Segmento das sombras e reflexos', 'Segmento dos objetos sensíveis', 'Segmento da matemática', 'Doxa e episteme dividindo a linha'][state]}>
    {segs.map(([x, w, n, ex], i) => <g key={n}><rect x={x} y="70" width={w - 6} height="30" fill={(state === i || (state === 3 && i < 2)) ? wine : paper} stroke={ink} strokeWidth="2" opacity={state === 3 && i >= 2 ? 0.6 : 1}/><text x={x + 4} y="60" fill={ink} fontSize="15">{n}</text><text x={x + 4} y="125" fill={ink} fontSize="14">{ex}</text></g>)}
    {state === 3 ? <><path d="M30 145h224M260 145h274" stroke={ink} strokeWidth="2"/><Line x={90} y={170}>doxa</Line><Line x={360} y={170}>episteme</Line><Arrow d="M256 140v-50"/></> : <Arrow d={`M${segs[state][0] + 20} 150v-40`}/>}
    <Line x={20} y={222}>{['cópia de cópia', 'o objeto que muda', 'inteligível com hipótese e figura', 'objeto e fundamento, não confiança'][state]}</Line>
  </Drawing>;
}
function GoldenMean({ state }: { state: number }) {
  const transition = useSceneMotion();
  const [firefighter, setFirefighter] = useState(true);
  const mark = state === 0 ? 270 : state === 1 ? (firefighter ? 340 : 200) : 270;
  return <div>{state === 1 && <button type="button" className="lf-inline-control" aria-pressed={!firefighter} onClick={() => setFirefighter(!firefighter)}>Ver como {firefighter ? 'pedestre' : 'bombeiro'}</button>}<Drawing label={['Covardia e temeridade em lados opostos da coragem', 'O meio se desloca com a situação', 'Atos repetidos aproximam do meio'][state]}>
    <path d="M40 110h460" stroke={ink} strokeWidth="4"/>
    <Line x={30} y={150}>covardia</Line><Line x={400} y={150}>temeridade</Line><Line x={230} y={80}>coragem</Line>
    <motion.path initial={false} animate={{ d: `M${mark} 95v30` }} transition={transition} stroke={wine} strokeWidth="6"/>
    {state === 0 && <><Arrow d="M240 180H60"/><Arrow d="M300 180h180"/></>}
    {state === 1 && <Line x={150} y={190}>{firefighter ? 'bombeiro entra no prédio: meio' : 'pedestre sem preparo: seria temeridade'}</Line>}
    {state === 2 && <>{[120, 170, 220, 255].map((x, i) => <circle key={x} cx={x} cy="110" r={5 + i} fill={wine} opacity={0.3 + i * 0.2}/>)}<Arrow d="M120 180h140"/></>}
    <Line x={20} y={225}>{['dois vícios, uma virtude', 'prudência acha o meio', 'hábito forma o caráter'][state]}</Line>
  </Drawing></div>;
}
function CartesianDoubt({ state }: { state: number }) {
  const beliefs = ['sentidos', 'mundo exterior', 'matemática'];
  return <Drawing label={['A dúvida dos sentidos derruba o primeiro bloco', 'O sonho derruba o mundo, a matemática fica', 'O gênio maligno derruba a matemática', 'Resta o cogito'][state]}>
    {beliefs.map((b, i) => {
      // Cada grau derruba um bloco a mais: sentidos; depois o mundo; por fim a matemática.
      const fallen = state === 0 ? i === 0 : state === 1 ? i <= 1 : true;
      return <g key={b} opacity={fallen ? 0.35 : 1}><rect x={40 + i * 160} y="50" width="140" height="44" rx="7" fill={paper} stroke={fallen ? wine : ink} strokeWidth="2" strokeDasharray={fallen ? '6 5' : undefined}/><text x={52 + i * 160} y="78" fill={ink} fontSize="16" textDecoration={fallen ? 'line-through' : undefined}>{b}</text></g>;
    })}
    {state === 0 && <><path d="M60 170l60-40" stroke={ink} strokeWidth="4"/><path d="M90 150l40-10" stroke={wine} strokeWidth="4"/><Arrow d="M150 140q-40-30-50-40"/><Line x={170} y={160}>bastão torto na água</Line></>}
    {state === 1 && <><Line x={360} y={140}>2 + 3 = 5 resiste</Line><Arrow d="M420 125v-25"/></>}
    {state === 2 && <><Line x={150} y={150}>gênio maligno: até o evidente?</Line><Arrow d="M300 130v-30"/></>}
    {state === 3 && <><rect x="170" y="120" width="220" height="50" rx="8" fill={paper} stroke={wine} strokeWidth="3"/><Line x={190} y={152}>penso, logo existo</Line><Arrow d="M280 115V100"/></>}
    <Line x={20} y={225}>{['cai a confiança nos sentidos', 'cai o mundo, não a aritmética', 'método levado ao extremo', 'o que resiste a toda dúvida'][state]}</Line>
  </Drawing>;
}
function Hegel({ state }: { state: number }) {
  const transition = useSceneMotion();
  return <Drawing label={['Posição gera seu oposto por dentro', 'Cancelar, preservar e elevar', 'Luta por reconhecimento', 'O trabalho inverte a relação'][state]}>
    {state === 0 && <><circle cx="120" cy="100" r="50" fill={paper} stroke={ink} strokeWidth="3"/><path d="M120 50v100" stroke={wine} strokeWidth="3" strokeDasharray="6 5"/><Line x={90} y={180}>posição</Line><Arrow d="M175 100h120m-12-8 12 8-12 8"/><Box x={310} y={78} w={200} strong>seu oposto</Box><Line x={20} y={225}>a contradição nasce de dentro</Line></>}
    {state === 1 && <><Box x={20} y={140} w={150}>tese</Box><Box x={370} y={140} w={150}>antítese</Box><Box x={180} y={40} w={180} strong>novo estágio</Box><Arrow d="M100 135L230 90M440 135L310 90"/><Line x={190} y={125}>cancela · preserva · eleva</Line><Line x={20} y={225}>superar não é eliminar</Line></>}
    {state >= 2 && <><motion.g initial={false} animate={{ y: state === 2 ? 0 : 60 }} transition={transition}><Box x={60} y={40} w={150} strong={state === 2}>senhor</Box></motion.g><motion.g initial={false} animate={{ y: state === 2 ? 0 : -60 }} transition={transition}><Box x={60} y={110} w={150} strong={state === 3}>escravo</Box></motion.g>
      <Arrow d={state === 2 ? 'M220 132h150' : 'M220 72h150'}/><Line x={380} y={state === 2 ? 138 : 78}>{state === 2 ? 'trabalha' : 'trabalho forma'}</Line>
      <Line x={20} y={225}>{state === 2 ? 'reconhecimento assimétrico' : 'o senhor só consome; o escravo se forma'}</Line></>}
  </Drawing>;
}
function Nietzsche({ state }: { state: number }) {
  const transition = useSceneMotion();
  return <Drawing label={['Pergunta pela origem do valor', 'Força e humildade trocam de lugar', 'O fundamento dos valores desaba', 'Novos valores criados'][state]}>
    {state === 0 && <><Box x={20} y={50} w={200}>“é verdadeiro?”</Box><path d="M20 72h200" stroke={wine} strokeWidth="3"/><Arrow d="M225 72h60m-12-8 12 8-12 8"/><Box x={295} y={50} w={230} strong>“quem precisou disso?”</Box><Line x={20} y={225}>valor tem história e interesse</Line></>}
    {state === 1 && <><motion.g initial={false} animate={{ y: 70 }} transition={transition}><Box x={20} y={40} w={150}>força</Box></motion.g><motion.g initial={false} animate={{ y: -70 }} transition={transition}><Box x={20} y={110} w={150} strong>humildade</Box></motion.g><Line x={200} y={70}>bom → mau</Line><Line x={200} y={140}>ruim → bem</Line><Arrow d="M330 65q60 40 0 75"/><Line x={360} y={110}>ressentimento</Line><Line x={20} y={225}>inversão dos valores</Line></>}
    {state === 2 && <><path d="M200 60h160v40H200z" fill={paper} stroke={ink} strokeWidth="2" strokeDasharray="6 5"/><Line x={215} y={88}>fundamento</Line>{[220, 270, 320].map(x => <path key={x} d={`M${x} 100l-10 60`} stroke={ink} strokeWidth="3"/>)}<Arrow d="M280 105v60"/><Line x={20} y={225}>niilismo: vazio de sentido</Line></>}
    {state === 3 && <><circle cx="120" cy="110" r="40" fill="none" stroke={ink} strokeDasharray="6 5"/><Arrow d="M170 110h100m-12-8 12 8-12 8"/><Box x={280} y={88} w={240} strong>valores criados</Box><Line x={20} y={225}>criar, não lamentar</Line></>}
  </Drawing>;
}

function AristotleLogic({ state }: { state: number }) {
  return <Drawing label={['Homem liga mortal a Sócrates', 'Forma válida com premissa falsa', 'Bronze recebe a forma de cavalo', 'Quatro causas da estátua'][state]}>
    {state < 2 && <>{(state === 0 ? [['todo homem', 'é mortal'], ['Sócrates', 'é homem'], ['logo, Sócrates', 'é mortal']] : [['todo peixe', 'voa'], ['Nemo', 'é peixe'], ['logo, Nemo', 'voa']]).map(([a, b], i) => <g key={a}><Box x={20} y={20 + i * 55} w={200}>{a}</Box><Box x={240} y={20 + i * 55} w={160} strong={state === 0 && i === 1}>{b}</Box></g>)}
      <Arrow d={state === 0 ? 'M405 42q60 30 0 55' : 'M420 150h80'}/>
      <Line x={420} y={state === 0 ? 75 : 140}>{state === 0 ? 'termo médio' : 'válido'}</Line>
      <Line x={20} y={225}>{state === 0 ? '“homem” liga e some na conclusão' : 'forma válida, conclusão falsa'}</Line></>}
    {state === 2 && <><ellipse cx="110" cy="120" rx="70" ry="40" fill={paper} stroke={ink} strokeWidth="3"/><Line x={70} y={126}>bronze</Line><Arrow d="M190 120h100m-12-8 12 8-12 8"/><path d="M330 160l20-60 40-20 40 10-10 40 40 30z" fill={wine}/><Line x={20} y={225}>matéria em potência, forma em ato</Line></>}
    {state === 3 && <>{[['material', 'bronze'], ['formal', 'cavalo'], ['eficiente', 'escultor'], ['final', 'homenagem']].map(([a, b], i) => <Box key={a} x={20 + (i % 2) * 270} y={30 + Math.floor(i / 2) * 70} w={240} strong={i === 3}>{`${a}: ${b}`}</Box>)}<Arrow d="M20 180h510"/><Line x={20} y={225}>quatro perguntas, uma explicação</Line></>}
  </Drawing>;
}
function Aquinas({ state }: { state: number }) {
  return <Drawing label={['Aristóteles chega por traduções árabes', 'Questão, objeções, resposta', 'Verdades demonstráveis e reveladas', 'Cadeia de motores até o primeiro'][state]}>
    {state === 0 && <><Box x={20} y={60} w={160}>Aristóteles</Box><Box x={200} y={60} w={160}>Averróis</Box><Box x={380} y={60} w={150} strong>Paris, 1200s</Box><Arrow d="M182 82h16m162 0h16"/><Line y={170}>razão pagã × verdade revelada</Line><Line x={20} y={225}>uma tensão a resolver</Line></>}
    {state === 1 && <>{['questão', 'objeções', 'sed contra', 'respondeo'].map((w, i) => <Box key={w} x={20 + i * 130} y={70} w={115} strong={i === 3}>{w}</Box>)}<Arrow d="M137 92h13m117 0h13m117 0h13"/><Line x={20} y={225}>disputa antes de afirmar</Line></>}
    {state === 2 && <><circle cx="200" cy="110" r="70" fill={paper} stroke={ink} strokeWidth="3"/><circle cx="320" cy="110" r="70" fill="none" stroke={wine} strokeWidth="3"/><Line x={140} y={115}>razão</Line><Line x={330} y={115}>fé</Line><Arrow d="M200 195h120"/><Line x={20} y={225}>excede, não contradiz</Line></>}
    {state === 3 && <>{[60, 160, 260, 360].map(x => <circle key={x} cx={x} cy="110" r="22" fill={paper} stroke={ink} strokeWidth="2"/>)}<circle cx="470" cy="110" r="26" fill={wine}/><Arrow d="M450 150H60"/><Line x={430} y={60}>primeiro motor</Line><Line x={20} y={225}>sem regresso ao infinito</Line></>}
  </Drawing>;
}
function Hume({ state }: { state: number }) {
  return <Drawing label={['Bola atinge bola; a força não aparece', 'A expectativa vem da repetição', 'Cisnes brancos e o próximo'][state]}>
    {state === 0 && <><circle cx="80" cy="110" r="26" fill={ink}/><circle cx="160" cy="110" r="26" fill={wine}/><Arrow d="M190 110h80"/><Line x={290} y={70}>contato ✓</Line><Line x={290} y={110}>antes/depois ✓</Line><Line x={290} y={150}>repetição ✓</Line><path d="M100 160q40 30 80 0" fill="none" stroke={ink} strokeDasharray="5 5"/><Line x={60} y={195}>força necessária?</Line><Line x={20} y={225}>a conexão não se vê</Line></>}
    {state === 1 && <>{[40, 110, 180].map(x => <g key={x}><circle cx={x} cy="80" r="12" fill={ink}/><circle cx={x + 30} cy="80" r="12" fill={wine}/></g>)}<Arrow d="M250 80h80m-12-8 12 8-12 8"/><Box x={340} y={58} w={180} strong>expectativa</Box><Line y={160}>a mente projeta no mundo</Line><Line x={20} y={225}>necessidade é hábito</Line></>}
    {state === 2 && <>{[50, 110, 170, 230, 290].map(x => <circle key={x} cx={x} cy="90" r="18" fill={paper} stroke={ink} strokeWidth="2"/>)}<circle cx="410" cy="90" r="18" fill="none" stroke={wine} strokeWidth="3" strokeDasharray="5 5"/><Line x={402} y={96}>?</Line><Arrow d="M300 140q60 30 110-30"/><Line y={180}>futuro = passado? só pelo passado</Line><Line x={20} y={225}>circularidade da indução</Line></>}
  </Drawing>;
}
function HobbesState({ state }: { state: number }) {
  return <Drawing label={['O fraco pode matar o forte', 'Vida sem plantio nem navegação', 'Súditos pactuam entre si', 'Limite: a própria vida'][state]}>
    {state === 0 && <><circle cx="120" cy="110" r="34" fill={paper} stroke={ink} strokeWidth="3"/><circle cx="380" cy="110" r="22" fill={wine}/><Line x={90} y={170}>forte</Line><Line x={350} y={170}>fraco + astúcia</Line><Arrow d="M355 110H160"/><Line x={20} y={225}>igualdade de ameaça</Line></>}
    {state === 1 && <>{['plantio', 'indústria', 'navegação'].map((w, i) => <g key={w} opacity="0.4"><Box x={20 + i * 180} y={60} w={160}>{w}</Box><path d={`M${30 + i * 180} 82h140`} stroke={wine} strokeWidth="3"/></g>)}<Arrow d="M20 150h510"/><Line x={20} y={225}>guerra = desconfiança permanente</Line></>}
    {state === 2 && <>{[80, 200, 320, 440].map(x => <circle key={x} cx={x} cy="150" r="18" fill={paper} stroke={ink} strokeWidth="2"/>)}<path d="M98 150h84m36 0h84m36 0h84" stroke={ink} strokeWidth="3"/><Box x={190} y={30} w={160} strong>soberano</Box><Arrow d="M270 120V80"/><Line x={360} y={60}>fora do pacto</Line><Line x={20} y={225}>contrato só entre súditos</Line></>}
    {state === 3 && <><Box x={20} y={60} w={200}>ordem do soberano</Box><Arrow d="M225 82h80m-12-8 12 8-12 8"/><Box x={315} y={60} w={210} strong>ameaça à vida?</Box><Line y={160}>aí a obrigação se dissolve</Line><Line x={20} y={225}>autopreservação é irrenunciável</Line></>}
  </Drawing>;
}
function LockeRights({ state }: { state: number }) {
  return <Drawing label={['Regra moral sem juiz', 'Trabalho torna o fruto próprio', 'Governo como depositário', 'Confiança quebrada, resistência'][state]}>
    {state === 0 && <><Box x={20} y={50} w={240}>lei natural ✓</Box><Box x={290} y={50} w={240} strong>juiz imparcial ✕</Box><Arrow d="M140 110q140 60 280 0"/><Line y={190}>inconvenientes, não guerra</Line><Line x={20} y={225}>falta quem aplique a regra</Line></>}
    {state === 1 && <><circle cx="100" cy="100" r="30" fill={wine}/><Line x={60} y={160}>fruto comum</Line><Arrow d="M140 100h100m-12-8 12 8-12 8"/><Box x={250} y={78} w={160} strong>“meu”</Box><Line x={20} y={225}>trabalho + o bastante aos outros</Line></>}
    {state === 2 && <><Box x={20} y={60} w={160}>direitos</Box><Arrow d="M185 82h90m-12-8 12 8-12 8"/><Box x={285} y={60} w={240} strong>governo: guarda</Box><Line x={285} y={150}>legislativo | executivo</Line><Line x={20} y={225}>poder condicional e dividido</Line></>}
    {state === 3 && <><Box x={20} y={60} w={240}>governo viola</Box><path d="M265 82h60" stroke={wine} strokeWidth="4" strokeDasharray="6 5"/><Box x={340} y={60} w={180} strong>povo</Box><Arrow d="M430 110q-100 70-250 20"/><Line x={20} y={225}>o poder volta a quem confiou</Line></>}
  </Drawing>;
}
function Rousseau({ state }: { state: number }) {
  return <Drawing label={['Homem natural com piedade', 'A cerca inaugura a desigualdade', 'Soma de vontades e vontade geral', 'Obedecer à lei que se fez'][state]}>
    {state === 0 && <><circle cx="120" cy="110" r="28" fill={paper} stroke={ink} strokeWidth="3"/><circle cx="260" cy="110" r="20" fill={wine}/><Arrow d="M150 110h85"/><Line x={120} y={170}>piedade: não quer o sofrimento alheio</Line><Line x={20} y={225}>bom antes da sociedade</Line></>}
    {state === 1 && <><path d="M60 160V80h200v80" fill="none" stroke={ink} strokeWidth="4"/>{[80, 120, 160, 200, 240].map(x => <path key={x} d={`M${x} 160V80`} stroke={ink}/>)}<Line x={110} y={60}>“isto é meu”</Line><Arrow d="M270 120h100m-12-8 12 8-12 8"/><Box x={380} y={98} w={150} strong>desigualdade</Box><Line x={20} y={225}>histórica, não natural</Line></>}
    {state === 2 && <><Box x={20} y={40} w={240}>a + b + c = vontade de todos</Box><Box x={20} y={120} w={240} strong>o bem comum = vontade geral</Box><Arrow d="M265 140h60"/><Line x={340} y={146}>deliberar</Line><Line x={20} y={225}>não é contagem de preferências</Line></>}
    {state === 3 && <><Box x={20} y={60} w={160}>cidadão</Box><Arrow d="M185 82h80m-12-8 12 8-12 8"/><Box x={275} y={60} w={140} strong>lei</Box><Arrow d="M345 110q-80 70-250 0"/><Line x={20} y={225}>autor e súdito da mesma lei</Line></>}
  </Drawing>;
}
function KantDuty({ state }: { state: number }) {
  const [profit, setProfit] = useState(false);
  return <div>{state === 0 && <button type="button" className="lf-inline-control" aria-pressed={profit} onClick={() => setProfit(!profit)}>{profit ? 'Voltar o lucro da honestidade' : 'Tornar o engano mais lucrativo'}</button>}<Drawing label={['Dois comerciantes honestos por motivos diferentes', 'Promessa falsa universalizada se destrói', 'Ordem condicional ao fim', 'A lei dada a si mesmo'][state]}>
    {state === 0 && <><Box x={20} y={40} w={250}>pela reputação</Box><Box x={20} y={120} w={250} strong>por dever</Box><Line x={300} y={70}>{profit ? 'passa a enganar' : 'não engana'}</Line><Line x={300} y={150}>não engana</Line><Arrow d="M275 62h20" active={!profit}/><Line x={20} y={225}>{profit ? 'conforme o dever: muda com o lucro' : 'mude o lucro e veja quem muda'}</Line></>}
    {state === 1 && <><Box x={20} y={60} w={260}>prometer falsamente</Box><Arrow d="M285 82h80m-12-8 12 8-12 8"/><Box x={375} y={60} w={150} strong>todos fazem</Box><Line y={160}>ninguém mais crê em promessa</Line><Line x={20} y={225}>a máxima se autodestrói</Line></>}
    {state === 2 && <><Box x={20} y={60} w={200}>se queres aprovar</Box><Arrow d="M225 82h70m-12-8 12 8-12 8"/><Box x={305} y={60} w={200}>deves estudar</Box><Line y={160}>larga o fim, larga a ordem</Line><Line x={20} y={225}>hipotético ≠ categórico</Line></>}
    {state === 3 && <><circle cx="140" cy="110" r="44" fill={paper} stroke={wine} strokeWidth="3"/><Line x={110} y={116}>razão</Line><Arrow d="M190 110h90m-12-8 12 8-12 8"/><Box x={290} y={88} w={170} strong>a própria lei</Box><Line x={20} y={225}>autonomia, dignidade, não preço</Line></>}
  </Drawing></div>;
}
function HistoricalMaterialism({ state }: { state: number }) {
  return <Drawing label={['Ideias e matéria trocam de posição', 'Base sustenta e é legitimada', 'Efeito de retorno sobre a base', 'Forças produtivas extrapolam as relações'][state]}>
    {state === 0 && <><Box x={20} y={40} w={180}>ideias</Box><Box x={20} y={140} w={180} strong>condições materiais</Box><Arrow d="M110 135V90"/><Line x={240} y={100}>Hegel: ideias → matéria</Line><Line x={240} y={140}>Marx: matéria → ideias</Line><Line x={20} y={225}>de cabeça para baixo</Line></>}
    {state >= 1 && state <= 2 && <><rect x="40" y="140" width="460" height="50" fill={paper} stroke={ink} strokeWidth="3"/><Line x={60} y={172}>forças produtivas + relações de produção</Line><rect x="100" y="40" width="340" height="50" fill={paper} stroke={state === 1 ? wine : ink} strokeWidth="2"/><Line x={120} y={72}>direito, política, religião</Line><Arrow d="M200 135V95"/>{state === 2 && <Arrow d="M340 95V135"/>}<Line x={20} y={225}>{state === 1 ? 'base condiciona; lei legitima' : 'a seta volta, sem ser mecânica'}</Line></>}
    {state === 3 && <><rect x="60" y="60" width="200" height="90" fill="none" stroke={ink} strokeWidth="3"/><Line x={80} y={170}>relações</Line><circle cx="160" cy="105" r="70" fill="none" stroke={wine} strokeWidth="3"/><Line x={300} y={110}>forças crescem</Line><Arrow d="M290 120h-50"/><Line x={20} y={225}>impulso vira entrave</Line></>}
  </Drawing>;
}
function ClassStruggle({ state }: { state: number }) {
  const [conscious, setConscious] = useState(false);
  const transition = useSceneMotion();
  return <div>{state === 1 && <button type="button" className="lf-inline-control" aria-pressed={conscious} onClick={() => setConscious(!conscious)}>{conscious ? 'Desfazer a organização' : 'Formar consciência de classe'}</button>}<Drawing label={['Quem controla e quem trabalha', 'Trabalhadores dispersos ou organizados', 'Propriedade apresentada como natural', 'Estado como comitê'][state]}>
    {state === 0 && <><Box x={20} y={40} w={220} strong>meios de produção</Box><Box x={20} y={130} w={220}>força de trabalho</Box><Arrow d="M245 150q80-20 0-90"/><Line x={300} y={110}>excedente</Line><Line x={20} y={225}>antagonismo pela posição</Line></>}
    {state === 1 && <>{[0, 1, 2, 3, 4].map(i => <motion.circle key={i} initial={false} animate={{ cx: conscious ? 180 + i * 45 : 60 + i * 100 + (i % 2) * 20, cy: conscious ? 110 : 70 + (i % 3) * 50 }} transition={transition} r="16" fill={conscious ? wine : paper} stroke={ink} strokeWidth="2"/>)}{conscious && <Arrow d="M160 150h220"/>}<Line x={20} y={225}>{conscious ? 'classe para si: organizada' : 'classe em si: dispersa'}</Line></>}
    {state === 2 && <><Box x={20} y={60} w={200}>arranjo histórico</Box><Arrow d="M225 82h80m-12-8 12 8-12 8"/><Box x={315} y={60} w={210} strong>“natureza humana”</Box><Line x={20} y={225}>a ideologia naturaliza</Line></>}
    {state === 3 && <><Box x={180} y={30} w={180} strong>Estado</Box>{['direito', 'polícia', 'administração'].map((w, i) => <Box key={w} x={20 + i * 180} y={130} w={160}>{w}</Box>)}<Arrow d="M270 80v40"/><Line x={20} y={225}>reprodução da ordem</Line></>}
  </Drawing></div>;
}
function Sartre({ state }: { state: number }) {
  return <Drawing label={['Projeto antes do cortador, existência antes do humano', 'Não escolher também é escolher', 'A desculpa da natureza fixa'][state]}>
    {state === 0 && <><Box x={20} y={40} w={150}>projeto</Box><Arrow d="M175 62h50"/><Box x={235} y={40} w={150}>cortador</Box><Box x={20} y={130} w={150} strong>existir</Box><Arrow d="M175 152h50"/><Box x={235} y={130} w={150}>escolhas</Box><Arrow d="M390 152h50"/><Line x={450} y={158}>essência</Line><Line x={20} y={225}>sem natureza dada</Line></>}
    {state === 1 && <><Box x={20} y={60} w={160}>escolher A</Box><Box x={200} y={60} w={160}>escolher B</Box><Box x={380} y={60} w={150} strong>não escolher</Box><Arrow d="M455 110v40"/><Line x={360} y={175}>também é escolha</Line><Line x={20} y={225}>condenado a ser livre</Line></>}
    {state === 2 && <><Box x={20} y={60} w={290}>“sou assim, não posso mudar”</Box><path d="M20 82h290" stroke={wine} strokeWidth="3"/><Arrow d="M320 82h70m-12-8 12 8-12 8"/><Box x={400} y={60} w={130} strong>escolha</Box><Line x={20} y={225}>má-fé: fingir não ser livre</Line></>}
  </Drawing>;
}
function Frankfurt({ state }: { state: number }) {
  return <Drawing label={['Progresso técnico e barbárie', 'Meios eficientes sem exame dos fins', 'A mesma fórmula com capas diferentes', 'Escolha entre variações do mesmo'][state]}>
    {state === 0 && <><Box x={20} y={60} w={200}>técnica avançada</Box><Arrow d="M225 82h80m-12-8 12 8-12 8"/><Box x={315} y={60} w={200} strong>barbárie</Box><Line y={160}>por quê?</Line><Line x={20} y={225}>teoria crítica, não neutra</Line></>}
    {state === 1 && <><Box x={20} y={60} w={200} strong>como fazer ✓</Box><Box x={300} y={60} w={220}>deve ser feito? ✕</Box><Arrow d="M120 110h300"/><Line x={20} y={225}>razão estreitada ao cálculo</Line></>}
    {state === 2 && <>{['A', 'B', 'C'].map((w, i) => <g key={w}><rect x={40 + i * 170} y="40" width="130" height="110" rx="8" fill={paper} stroke={ink} strokeWidth="2"/><Line x={90 + i * 170} y={80}>{w}</Line><path d={`M${60 + i * 170} 110h90`} stroke={wine} strokeWidth="6"/></g>)}<Arrow d="M40 175h470"/><Line x={20} y={225}>mesma faixa, capa trocada</Line></>}
    {state === 3 && <><Box x={20} y={60} w={160}>A’</Box><Box x={200} y={60} w={160}>A”</Box><Box x={380} y={60} w={150} strong>A’’’</Box><Arrow d="M100 120q180 50 360 0"/><Line x={20} y={225}>ilusão de escolha, passividade</Line></>}
  </Drawing>;
}

const drawings: Record<PhilosophyOperationId, React.ComponentType<{ state: number }>> = {
  'myth-logos': MythLogos, 'socratic-method': Socratic, cave: Cave, 'divided-line': DividedLine,
  'golden-mean': GoldenMean, 'cartesian-doubt': CartesianDoubt, 'hegel-dialectic': Hegel, 'nietzsche-genealogy': Nietzsche,
  'aristotle-logic': AristotleLogic, 'aquinas-synthesis': Aquinas, 'hume-causation': Hume, 'hobbes-state': HobbesState, 'locke-rights': LockeRights,
  'rousseau-general-will': Rousseau, 'kant-duty': KantDuty, 'historical-materialism': HistoricalMaterialism, 'class-struggle': ClassStruggle,
  'sartre-freedom': Sartre, 'frankfurt-culture': Frankfurt,
};
export function PhilosophyOperation({ id }: { id: PhilosophyOperationId }) {
  return <OperationWorkshop id={id} config={PHILOSOPHY_OPERATIONS[id]} Scene={drawings[id]}
    manuscript="Siga o argumento, não apenas o nome da tese."
    caption="As frases citadas vêm do resumo do capítulo; os exemplos do desenho são didáticos e autorais."/>;
}
export function philosophyInstrument(id: PhilosophyOperationId) {
  const config = PHILOSOPHY_OPERATIONS[id];
  return function PhilosophyBoard(props: BoardProps) {
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell title={config.topic} kicker="Oficina de argumento · filosofia" subtitle={config.question}
      condition={{ label: 'Operação', value: 'Argumento desenhado' }} sceneFirst
      ariaLabel={`Oficina de filosofia: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<PhilosophyOperation id={id}/>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? config.topic, detail: first?.excerpt ?? config.question, formula: config.relation }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? config.topic, detail: second?.excerpt ?? config.question, formula: 'tese → objeção → posição sustentada' }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      closing="Uma tese filosófica se entende pelo argumento que a sustenta."/>;
  };
}
