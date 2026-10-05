import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import { useSceneMotion } from '../topic-scenes/useSceneMotion';
import './LiteratureFoundations.css';

type ReadingState = { label: string; section: string; anchor: string; observation: string; conclusion: string };
type Foundation = { topic: string; question: string; relation: string; states: ReadingState[] };
export const LITERATURE_FOUNDATIONS = {
  'art-languages': {
    topic: 'A Arte e suas Linguagens', question: 'Como o material muda a experiência e o sentido?', relation: 'material + organização + contexto → experiência',
    states: [
      { label: 'Palavra', section: 'As linguagens artísticas', anchor: 'A sala esperou por quem não voltou', observation: 'O verbo atribui à sala uma ação humana: a ausência ganha duração.', conclusion: 'Personificação constrói a espera; não identifica uma pessoa real.' },
      { label: 'Imagem', section: 'As linguagens artísticas', anchor: 'uma cadeira vazia isolada entre cadeiras ocupadas', observation: 'A ausência passa a ser construída por posição e contraste espacial.', conclusion: 'A imagem reconstrói a relação; não é tradução literal do verbo.' },
      { label: 'Som', section: 'As linguagens artísticas', anchor: 'passos interrompidos antes da porta', observation: 'A sequência termina antes da chegada esperada: o silêncio altera a expectativa.', conclusion: 'Tempo e interrupção produzem um efeito que a cor não substitui por regra.' },
      { label: 'Critério e contexto', section: 'O que é arte', anchor: 'um sapato gasto, uma etiqueta de preço e o som de uma fábrica', observation: 'Desgaste e preço colocam trabalho e consumo em relação, mesmo sem beleza agradável.', conclusion: 'Beleza varia historicamente. Contextualizar e avaliar hoje são operações distintas.' },
    ],
  },
  'literary-text': {
    topic: 'Texto Literário x Texto não Literário', question: 'O que muda quando o portão engole um adeus?', relation: 'pacto e função predominante orientam a leitura',
    states: [
      { label: 'Informar', section: 'Função poética e plurissignificação', anchor: 'O portão foi fechado às dezoito horas', observation: 'A ação e o horário favorecem verificação e orientação prática.', conclusion: 'Num aviso, saber qual portão e qual horário faz parte da precisão.' },
      { label: 'Construir sentidos', section: 'Função poética e plurissignificação', anchor: 'Às dezoito, o portão engoliu o último adeus', observation: 'Engoliu liga o fechamento à perda: o portão vira agente.', conclusion: 'A forma amplia sentidos sustentados; não autoriza inventar um acidente.' },
      { label: 'Pacto ficcional', section: 'Ficcionalidade', anchor: 'Uma cidade amanheceu sem sombras', observation: 'Como conto, a frase pode estabelecer uma regra do mundo. Como notícia, exige apuração.', conclusion: 'Romance se avalia pela construção e coerência; memórias também podem ser literatura.' },
    ],
  },
  'narrative-elements': {
    topic: 'Elementos da Narrativa', question: 'Como a ordem e o acesso à informação mudam o relato?', relation: 'história ≠ ordem do discurso ≠ duração vivida',
    states: [
      { label: 'História e discurso', section: 'Enredo e conflito', anchor: 'Lia encontrou a chave; hesitou diante do portão; devolveu-a sem entrar', observation: 'A história segue encontro → hesitação → devolução. Começar pela devolução muda a pergunta do leitor.', conclusion: 'A ordem do discurso pode adiar a causa sem alterar os acontecimentos.' },
      { label: 'Direta e indireta', section: 'Personagens', anchor: 'Lia era cautelosa', observation: 'Compare o traço declarado com testar a chave e olhar a rua: ações exigem inferência.', conclusion: 'Cautela é uma hipótese sustentada pelos gestos; medo de ser vista também pode explicá-los.' },
      { label: 'Duração psicológica', section: 'Tempo, espaço e narrador', anchor: 'No minuto diante do portão, a espera da infância voltou inteira', observation: 'O minuto do relógio se expande na memória. Isso não é definido apenas por voltar ao passado.', conclusion: 'Flashback muda a ordem; tempo psicológico muda a experiência da duração.' },
      { label: 'Acesso do narrador', section: 'Tempo, espaço e narrador', anchor: 'Lia temia reconhecer a casa', observation: 'Devolveu-a mostra ação; temia acrescenta acesso à mente. Ambos podem usar terceira pessoa.', conclusion: 'Pronome não garante onisciência; narrador e autor são instâncias distintas.' },
    ],
  },
  'medieval-voices': {
    topic: 'Trovadorismo e Humanismo', question: 'Quem fala, a quem se dirige e como constrói o ataque?', relation: 'voz + situação + modo de dizer → leitura da cantiga',
    states: [
      { label: 'Cantiga de amor', section: 'Trovadorismo', anchor: 'Senhora, vosso olhar me nega o dia', observation: 'Uma voz masculina se dirige à dama elevada, construindo submissão amorosa.', conclusion: 'A convenção da vassalagem não comprova um episódio biográfico.' },
      { label: 'Cantiga de amigo', section: 'Trovadorismo', anchor: 'Ó rio, meu amigo tarda a voltar', observation: 'Uma voz feminina lamenta o amado ausente e fala à natureza.', conclusion: 'Amigo designa o amado; voz feminina não identifica o gênero de quem compôs.' },
      { label: 'Escárnio', section: 'Cantigas satíricas', anchor: 'Que fiel guardião: guardou para si o cofre inteiro', observation: 'O elogio aparente se choca com a apropriação; a avaliação se inverte.', conclusion: 'Ataque indireto e ironia sustentam a leitura; um nome isolado não decide o tipo.' },
      { label: 'Maldizer', section: 'Cantigas satíricas', anchor: 'Martim roubou o cofre e chama isso serviço', observation: 'A voz acusa explicitamente, sem depender do elogio invertido.', conclusion: 'O modo direto do ataque importa mais que uma regra rígida sobre nomes.' },
      { label: 'Sátira em cena', section: 'Humanismo', anchor: 'sirvo ao bem comum', observation: 'Um cobrador diz servir a todos, enquanto esconde moedas tomadas de quem passa.', conclusion: 'Fala e gesto se contradizem: a cena autoral demonstra crítica moral, sem ser de Gil Vicente.' },
    ],
  },
  'renaissance-camoes': {
    topic: 'Renascimento e Camões', question: 'Como oposição e contraponto abrem uma definição?', relation: 'forma regular pode abrigar conflito',
    states: [
      { label: 'Antítese', section: 'Lírica camoniana', anchor: 'Entre a alegria e a tristeza, espero', observation: 'Alegria e tristeza são polos contrários postos em relação.', conclusion: 'Oposição entre termos não é automaticamente uma afirmação paradoxal.' },
      { label: 'Paradoxo', section: 'Lírica camoniana', anchor: 'Minha alegria dói', observation: 'A própria alegria recebe uma propriedade que parece negá-la.', conclusion: 'A contradição aparente constrói experiência ambivalente, como na definição camoniana do amor.' },
      { label: 'Celebração épica', section: 'Os Lusíadas', anchor: 'o navio amplia a glória', observation: 'O esquema autoral concentra o olhar na glória associada à partida.', conclusion: 'A arquitetura épica celebra feitos, mas não apaga outras vozes do poema.' },
      { label: 'Contraponto do Restelo', section: 'Os Lusíadas', anchor: 'a partida deixa perdas em terra', observation: 'O foco retorna aos custos humanos e à crítica da ambição.', conclusion: 'O Velho do Restelo tensiona a celebração; não torna todo o poema rejeição das viagens.' },
    ],
  },
  'first-records': {
    topic: 'Brasil: Primeiros Registros', question: 'O relato observa, julga ou propõe uma ação?', relation: 'descrição situada → interesses coloniais',
    states: [
      { label: 'Observar', section: 'O olhar do colonizador', anchor: 'Não vimos ouro', observation: 'A voz delimita aquilo que conseguiu observar.', conclusion: 'Não ver ouro não comprova a inexistência de metal no território.' },
      { label: 'Julgar', section: 'O olhar do colonizador', anchor: 'a terra parece aproveitável', observation: 'O território é avaliado como recurso, a partir de interesses de quem relata.', conclusion: 'A descrição incorpora uma categoria econômica; não é espelho neutro.' },
      { label: 'Propor', section: 'O olhar do colonizador', anchor: 'convém ensinar-lhes nossa fé', observation: 'O registro propõe conversão religiosa e explicita uma finalidade.', conclusion: 'Documento à Coroa não é projeto literário autônomo moderno; isso não elimina estilo.' },
      { label: 'Auto catequético', section: 'Literatura jesuítica', anchor: 'a personagem “Cobiça” promete riqueza', observation: 'Cobiça oferece riqueza; Conselho mostra a perda: uma regra moral vira conflito de personagens.', conclusion: 'Alegoria encena a doutrina. Adaptação de linguagem não elimina assimetria colonial.' },
    ],
  },
  baroque: {
    topic: 'A Estética Barroca', question: 'O efeito nasce da imagem ou do encadeamento de ideias?', relation: 'palavra e raciocínio podem coexistir',
    states: [
      { label: 'Cultismo', section: 'Cultismo e conceptismo', anchor: 'Da noite, o ouro frio me acende', observation: 'Reordene a frase para localizar o sujeito; ouro frio e acende mantêm a tensão da imagem.', conclusion: 'Inversão e imagem paradoxal orientam o efeito; palavra rara não basta.' },
      { label: 'Conceptismo', section: 'Cultismo e conceptismo', anchor: 'Se o favor exige pagamento, não é favor, é venda', observation: 'A condição de pagamento confronta a definição de favor e conduz à conclusão.', conclusion: 'O raciocínio desmonta uma aparência; pode também usar figuras.' },
      { label: 'Desejo e temor', section: 'Contexto e tensão', anchor: 'Desejo o dia; receio a noite do meu desejo', observation: 'O mesmo desejo atrai e ameaça: corpo, culpa e salvação entram em tensão.', conclusion: 'Religiosidade não implica serenidade; explique o conflito, além de nomear antíteses.' },
    ],
  },
  neoclassic: {
    topic: 'A Estética Neoclássica', question: 'O que o campo ideal inclui e o que deixa fora?', relation: 'clareza construída + convenção pastoril → ideal de medida',
    states: [
      { label: 'Cortar o supérfluo', section: 'Arcadismo', anchor: 'No vale sereno, descansamos à sombra', observation: 'A revisão retira um acréscimo redundante e preserva sereno, que ajuda a construir amenidade.', conclusion: 'Inutilia truncat corta o supérfluo; não elimina todos os adjetivos.' },
      { label: 'Campo ideal', section: 'Convenções pastoris', anchor: 'O pastor repousa à sombra, perto do rio', observation: 'Repouso, sombra e rio compõem um espaço ameno de convenção.', conclusion: 'Modelos clássicos selecionam uma vida idealizada; não documentam todo o campo real.' },
      { label: 'Condição material', section: 'Convenções pastoris', anchor: 'o lavrador negocia a colheita para pagar a dívida', observation: 'Trabalho, troca e dívida explicitam relações ausentes do recorte pastoril.', conclusion: 'A comparação revela seleção, sem provar desconhecimento das dificuldades pelo poeta.' },
    ],
  },
  'romantic-poetry': {
    topic: 'A Estética Romântica: Poesia', question: 'Para quem a voz fala, e com que função?', relation: 'posição da voz + tema → função na geração',
    states: [
      { label: 'Fundar herói', section: 'As três gerações', anchor: 'o guerreiro jurou à mata uma lealdade sem mancha', observation: 'Juramento, honra e pureza transferem ao guerreiro o código do cavaleiro: a mata vira suserana.', conclusion: 'Idealização a serviço da nação; não é retrato etnográfico dos povos indígenas.' },
      { label: 'Fugir para a noite', section: 'Traços gerais', anchor: 'a noite me promete o sono que a vida recusa', observation: 'A noite personificada oferece o repouso que a vida nega: a morte vira promessa.', conclusion: 'Pessimismo e escapismo centrados no eu marcam o mal do século.' },
      { label: 'Interpelar a plateia', section: 'Da idealização à denúncia', anchor: 'vós que dormis, ouvi o porão que geme', observation: 'Apóstrofe e imperativo convocam um público que se omite; o porão ganha voz.', conclusion: 'A poesia condoreira denuncia; fala sobre os escravizados, sem anular a força abolicionista.' },
    ],
  },
  'romantic-prose': {
    topic: 'A Estética Romântica: Prosa', question: 'O enredo expõe uma convenção ou funda um símbolo?', relation: 'vertente + operação → projeto nacional',
    states: [
      { label: 'Expor o negócio', section: 'Romance urbano e indianista', anchor: 'O noivo aceitou o dote antes de aceitar a noiva', observation: 'A ordem dos objetos põe o dinheiro antes da pessoa.', conclusion: 'O romance urbano pode revelar a lógica mercantil do casamento, como em Senhora.' },
      { label: 'Fundar a nação', section: 'Romance urbano e indianista', anchor: 'Da união do estrangeiro com a filha da floresta nasceu o primeiro filho da terra', observation: 'Um casal vira origem: o encontro amoroso narra a formação do povo.', conclusion: 'Alegoria de fundação; o símbolo também silencia a violência da conquista.' },
      { label: 'Idealizar o interior', section: 'Regionalista e histórico', anchor: 'o vaqueiro conhece o rastro antes de conhecer a lei', observation: 'O saber da terra é oposto à norma urbana: o interior vira reserva de autenticidade.', conclusion: 'Regionalismo romântico é pitoresco e heroico, não estudo da miséria rural.' },
      { label: 'Restaurar a ordem', section: 'Convenções e crítica', anchor: 'o arrependimento devolveu ao casal a honra perdida', observation: 'A falha moral é corrigida por virtude, e o conflito social se dissolve no íntimo.', conclusion: 'O final conciliador não apaga a crítica que o percurso já tornou visível.' },
    ],
  },
  realism: {
    topic: 'A Estética Realista', question: 'O que a descrição revela por trás da fachada?', relation: 'aparência social × motivação → análise',
    states: [
      { label: 'Fachada', section: 'Contexto e princípios', anchor: 'o casamento conservava a fachada que a família exigia', observation: 'A instituição aparece como aparência mantida por pressão social.', conclusion: 'O Realismo examina a distância entre o que se mostra e o que se vive; não prega moral.' },
      { label: 'Ironia', section: 'Procedimentos', anchor: 'o comendador, sempre generoso em público, cobrava os juros com a mesma pontualidade da missa', observation: 'A pontualidade devota é transferida para a cobrança: elogio na superfície, acusação por dentro.', conclusion: 'Objetividade aparente não é neutralidade; a ironia é o comentário crítico.' },
      { label: 'Deliberar', section: 'Realismo e Naturalismo', anchor: 'hesitou, calculou o escândalo e preferiu calar', observation: 'A personagem pesa consequências e escolhe: o silêncio nasce de cálculo social.', conclusion: 'Deliberação aponta Realismo; forças que dominam a conduta apontariam Naturalismo.' },
    ],
  },
  naturalism: {
    topic: 'Naturalismo', question: 'O que o romance tenta provar sobre a conduta?', relation: 'meio + raça + momento → conduta (tese da obra)',
    states: [
      { label: 'Tripé', section: 'Determinismo', anchor: 'o calor, a origem e a época explicavam, segundo o narrador, cada gesto', observation: 'Meio, origem e época agem juntos na explicação; “segundo o narrador” marca a tese.', conclusion: 'O determinismo é hipótese encenada pela obra, não fato comprovado.' },
      { label: 'Meio que age', section: 'Procedimentos', anchor: 'o pátio acordava, fervia e engolia quem chegava', observation: 'Três verbos dão corpo ao espaço: o lugar age sobre as personagens.', conclusion: 'O ambiente vira personagem para demonstrar que o meio condiciona a conduta.' },
      { label: 'Ler a tese', section: 'Limites e crítica', anchor: 'a tese do narrador não é prova sobre pessoas reais', observation: 'Denúncia da exploração e estereótipos raciais e de gênero convivem no mesmo romance.', conclusion: 'Separe o que a obra observa do modo como o determinismo interpreta.' },
    ],
  },
  'eca-de-queiros': {
    topic: 'Realismo Português: Eça de Queirós', question: 'Que objeto ou gesto desmente a personagem?', relation: 'discurso × gesto ou objeto → crítica',
    states: [
      { label: 'Interior', section: 'Procedimentos', anchor: 'a sala tinha mais retratos de antepassados do que livros abertos', observation: 'A contagem dos objetos revela valores: linhagem acima de conhecimento.', conclusion: 'A descrição de interiores funciona como índice de caráter, não como pausa.' },
      { label: 'Gesto', section: 'Procedimentos', anchor: '— O país precisa de reformas — disse o conselheiro, ajeitando a gravata', observation: 'A fala solene é acompanhada por um gesto de vaidade que a esvazia.', conclusion: 'A ironia expõe a distância entre discurso e prática, sem sermão do narrador.' },
      { label: 'Decadência', section: 'Obras centrais', anchor: 'a família guardava o brasão e adiava todos os projetos', observation: 'O passado é conservado como emblema enquanto o futuro nunca começa.', conclusion: 'Em Os Maias, o fracasso individual vira diagnóstico de uma elite.' },
    ],
  },
  parnassianism: {
    topic: 'Parnasianismo', question: 'O verso confessa ou lapida?', relation: 'recuo do eu + escolha exata → acabamento',
    states: [
      { label: 'Recuo do eu', section: 'Arte pela arte', anchor: 'A ânfora guarda a curva do silêncio', observation: 'O eu que chora sai do verso; o objeto e sua forma ocupam o centro.', conclusion: 'Impessoalidade desloca a emoção para a contemplação; não a elimina.' },
      { label: 'Lapidar', section: 'Rigor formal', anchor: 'No mármore frio, a ânfora repousa', observation: 'Matéria, temperatura e postura substituem a avaliação genérica.', conclusion: 'A metáfora do ourives é trocar o vago pelo exato.' },
      { label: 'Paródia', section: 'Nomes e recepção', anchor: 'a ânfora, coitada, cansou de rimar com nada', observation: 'Coloquialismo rebaixa o objeto nobre e mostra a rima como exercício vazio.', conclusion: 'A paródia modernista depende do prestígio do modelo que ataca.' },
    ],
  },
  symbolism: {
    topic: 'Simbolismo', question: 'O verso nomeia o estado ou o sugere?', relation: 'som + sentido cruzado + vagueza → sugestão',
    states: [
      { label: 'Sugerir', section: 'Reação ao materialismo', anchor: 'Algo de névoa chora no corredor', observation: '“Algo” e a névoa que chora tornam a tristeza difusa, sem sujeito definido.', conclusion: 'A imprecisão é escolha: sugerir abre ressonância que nomear fecharia.' },
      { label: 'Sinestesia', section: 'Recursos', anchor: 'um perfume azul de sinos', observation: 'Olfato recebe cor e a cor parece soar: três sentidos se fundem.', conclusion: 'Sinestesia exige sentidos diferentes cruzados; não é qualquer metáfora.' },
      { label: 'Música', section: 'Recursos', anchor: 'vagas vozes vão velando o vale', observation: 'A repetição do som de v cria um sopro contínuo ao longo do verso.', conclusion: 'A aliteração faz o som significar tanto quanto a imagem.' },
    ],
  },
  'pre-modernism': {
    topic: 'Pré-Modernismo', question: 'Que Brasil a obra mostra, e com que linguagem?', relation: 'realidade excluída + herança ou ruptura → ponte',
    states: [
      { label: 'Três registros', section: 'Autores e obras', anchor: 'o mapa do clima, a data da batalha e a cena do cerco', observation: 'Ciência, história e literatura convivem num só relato.', conclusion: 'Os Sertões é híbrido; lê-lo só como romance apaga a reportagem e o ensaio.' },
      { label: 'Herança', section: 'Traços de linguagem', anchor: 'A caatinga impõe ao viajante um léxico de botânico', observation: 'Vocabulário técnico e sintaxe solene tratam o sertão como objeto de ciência.', conclusion: 'Linguagem ainda marcada pelo academicismo, como em Euclides.' },
      { label: 'Ruptura', section: 'Traços de linguagem', anchor: 'O doutor citou o latim e errou o caminho da estação', observation: 'Frase simples e ironia mostram a erudição inútil diante de um problema banal.', conclusion: 'Coloquialidade crítica contra o bacharelismo, como em Lima Barreto.' },
    ],
  },
  'machado-de-assis': {
    topic: 'Machado de Assis', question: 'O que a narrativa mostra, e o que o narrador conclui?', relation: 'fato narrado × interesse de quem narra → leitura crítica',
    states: [
      { label: 'Fato × dedução', section: 'O narrador machadiano', anchor: 'Ela sorriu; e eu, que conhecia aquele sorriso, soube tudo', observation: 'O único fato é o sorriso; “soube tudo” é conclusão de quem narra, apresentada como certeza.', conclusion: 'Narrador interessado não prova o que deduz; a traição de Capitu não é fato do enredo.' },
      { label: 'Defunto autor', section: 'O narrador machadiano', anchor: 'morto, já não devo favores a ninguém', observation: 'A morte vira licença para dizer o que a vida social obrigava a calar.', conclusion: 'A liberdade de Brás é real, mas a vaidade continua: desconfie também dele.' },
      { label: 'Ironia social', section: 'Temas e procedimentos', anchor: 'o senhor libertou o escravizado no testamento, depois de servido a vida inteira', observation: 'A generosidade chega quando já não custa nada: a ordem dos fatos desmonta o elogio.', conclusion: 'A ironia expõe a violência que o narrador naturaliza.' },
    ],
  },
  vanguards: {
    topic: 'Vanguardas Artísticas', question: 'Que procedimento organiza a obra?', relation: 'manifesto + procedimento → ruptura',
    states: [
      { label: 'Futurismo', section: 'Ruptura e manifestos', anchor: 'o motor ruge mais belo que a estátua', observation: 'A máquina moderna é posta acima do modelo clássico de beleza.', conclusion: 'Velocidade contra museu; o mesmo programa exaltou a guerra.' },
      { label: 'Cubismo', section: 'As principais correntes', anchor: 'O rosto visto de frente e de perfil ao mesmo tempo', observation: 'Dois pontos de vista ocupam o mesmo plano.', conclusion: 'Simultaneidade, não desenho com cubos.' },
      { label: 'Dadá × Surrealismo', section: 'As principais correntes', anchor: 'palavras sorteadas de um chapéu', observation: 'O acaso substitui a intenção do autor.', conclusion: 'No Dadá, o acaso nega a arte; no Surrealismo, procura o inconsciente.' },
      { label: 'Apropriação', section: 'Impacto no Brasil', anchor: 'a locomotiva cubista passa entre bananeiras', observation: 'A técnica europeia passa a organizar uma paisagem brasileira.', conclusion: 'O modernismo brasileiro reelabora a vanguarda; não apenas copia.' },
    ],
  },
  'modern-art-week': {
    topic: 'Semana de Arte Moderna', question: 'Onde a Semana fica na linha do tempo?', relation: 'antes + evento + depois → marco, não origem',
    states: [
      { label: 'Recepção', section: 'O evento', anchor: 'o soneto de rima rica recebeu aplausos; o verso livre, vaias', observation: 'O público reconhece o padrão consagrado e reage ao que o rompe.', conclusion: 'A vaia prova que a ruptura foi percebida; o exemplo não relata um episódio documentado.' },
      { label: 'Grupo heterogêneo', section: 'Participantes e obras', anchor: 'o mesmo palco reuniu quem queria ruptura total e quem queria só atualizar o gosto', observation: 'Acadêmicos e experimentadores dividem o evento.', conclusion: 'Ruptura estética, sem programa político ou artístico único.' },
      { label: 'Marco', section: 'Legado', anchor: '1917, a exposição; 1922, a Semana; 1928, a Antropofagia', observation: 'A Semana fica no meio da sequência de polêmicas e obras.', conclusion: 'Catalisador e símbolo; não origem nem conclusão do modernismo.' },
    ],
  },
  'modernism-first-generation': {
    topic: 'Modernismo no Brasil: Primeira Geração', question: 'O que o texto recusa, devora ou mistura?', relation: 'ruptura + apropriação → país múltiplo',
    states: [
      { label: 'Poema-piada', section: 'A fase heroica', anchor: 'Comprei um relógio / para perder a hora', observation: 'O objeto que mede o tempo serve para desperdiçá-lo: humor por inversão.', conclusion: 'Brevidade e cotidiano são escolhas contra o padrão acadêmico.' },
      { label: 'Antropofagia', section: 'Manifestos e grupos', anchor: 'comi o soneto inglês e devolvi uma modinha', observation: 'A forma estrangeira é devorada e volta como gênero popular brasileiro.', conclusion: 'Nem imitação nem recusa: digestão crítica.' },
      { label: 'Sem nenhum caráter', section: 'Obras centrais', anchor: 'valente na briga, preguiçoso no trabalho, esperto no negócio', observation: 'Traços que não se harmonizam convivem na mesma personagem.', conclusion: 'Sem identidade fixa, não desonesto: alegoria de um país em formação.' },
    ],
  },
  'modernism-second-generation': {
    topic: 'Segunda Geração Modernista: Poesia', question: 'A liberdade de 22 serve a quê agora?', relation: 'forma livre mantida + tom grave → reflexão',
    states: [
      { label: 'Mudança de tom', section: 'Amadurecimento', anchor: 'o verso livre agora pesa o tempo', observation: 'O mesmo instrumento formal de 22 serve à meditação, não à piada.', conclusion: 'Mantém a liberdade, muda o tom.' },
      { label: 'Musicalidade', section: 'Nomes centrais', anchor: 'passa a nuvem, passa o rio, passa o que eu fui', observation: 'A repetição de “passa” encadeia natureza e sujeito num ritmo de canção.', conclusion: 'A efemeridade é sentida pela forma, como na lírica de Cecília.' },
      { label: 'Metalinguagem', section: 'Poesia e mundo', anchor: 'de que serve um verso quando a cidade arde?', observation: 'A pergunta põe a própria poesia em dúvida diante da destruição.', conclusion: 'Duvidar da função da poesia pode ser resposta ao contexto histórico.' },
    ],
  },
  'modernism-second-prose': {
    topic: 'Segunda Geração Modernista: Prosa', question: 'O meio é cenário, destino ou estrutura social?', relation: 'forma econômica + meio social → denúncia',
    states: [
      { label: 'Secura', section: 'Romance de 30', anchor: 'Saíram de madrugada. Às dez, a menina já não chorava.', observation: 'Frases curtas, cronologia linear e nenhum comentário: o leitor infere a exaustão.', conclusion: 'Menos experimentação visível, mais construção a serviço da denúncia.' },
      { label: 'Decadência', section: 'Autores e obras', anchor: 'a usina engoliu o engenho do avô', observation: 'A modernização econômica absorve a ordem patriarcal antiga.', conclusion: 'Senhores perdem poder; trabalhadores continuam explorados.' },
      { label: 'Meio social', section: 'Regionalismo crítico', anchor: 'a cacimba secou antes do gado', observation: 'A seca é causa material: falta água, morre o gado, vem a retirada.', conclusion: 'Estrutura social e histórica, não cenário pitoresco nem destino biológico.' },
    ],
  },
  'fernando-pessoa': {
    topic: 'Fernando Pessoa', question: 'Que visão de mundo fala neste verso?', relation: 'voz + concepção de mundo → heterônimo',
    states: [
      { label: 'Caeiro', section: 'Os três principais', anchor: 'A pedra é pedra, e basta-me vê-la', observation: 'O verso recusa atribuir sentido oculto às coisas.', conclusion: 'Sensação sem metafísica: pensar atrapalha ver.' },
      { label: 'Reis', section: 'Os três principais', anchor: 'Colhe a hora calma, que o rio não volta', observation: 'Aconselha aproveitar o presente com serenidade diante do tempo.', conclusion: 'Ode clássica, epicurista e estoica, sem derramamento.' },
      { label: 'Campos', section: 'Os três principais', anchor: 'Rodas, motores, tudo grita! — e depois, o quarto vazio', observation: 'A exclamação vertiginosa termina no vazio.', conclusion: 'Da euforia futurista ao tédio e à desilusão.' },
      { label: 'Fingidor', section: 'A dor de pensar', anchor: 'a dor que eu escrevo já não é a que doeu', observation: 'Escrever transforma a dor vivida em dor construída pela linguagem.', conclusion: 'Fingir é elaborar, não mentir.' },
    ],
  },
  'carlos-drummond': {
    topic: 'Carlos Drummond de Andrade', question: 'Como o eu se relaciona com o mundo?', relation: 'banal + insistência + história → densidade',
    states: [
      { label: 'Gauche', section: 'Fases da obra', anchor: 'sentei na última fila da festa, de chapéu errado', observation: 'O sujeito se coloca à margem e fora do código social, com humor contido.', conclusion: 'A ironia protege e expõe um eu deslocado.' },
      { label: 'História', section: 'Fases da obra', anchor: 'o jornal da manhã entrou no poema e não saiu', observation: 'O acontecimento coletivo invade a lírica e permanece.', conclusion: 'Fase social: o eu continua, atravessado pela história.' },
      { label: 'Repetição', section: 'Temas centrais', anchor: 'tinha um muro, tinha um muro na volta da escola', observation: 'A insistência transforma um obstáculo banal em experiência de bloqueio.', conclusion: 'Repetição é construção, não falha; foi o que escandalizou a crítica.' },
    ],
  },
  'graciliano-ramos': {
    topic: 'Graciliano Ramos', question: 'O que a frase corta, e quem empresta a palavra?', relation: 'corte + narrador que empresta voz → privação visível',
    states: [
      { label: 'Cortar', section: 'A secura da linguagem', anchor: 'O sol queimava. A cachorra arquejava.', observation: 'Dois fatos, nenhum adjetivo: a dureza aparece pela relação entre calor e corpo.', conclusion: 'A secura é procedimento; a forma acompanha o mundo áspero.' },
      { label: 'Emprestar a voz', section: 'Vidas Secas', anchor: 'ele queria dizer que a terra era injusta, mas só lhe vinha um grunhido', observation: 'A ideia existe e a fala falta; quem formula “injusta” é o narrador.', conclusion: 'A privação material vem junto com a privação verbal.' },
      { label: 'Possuir', section: 'Outras obras', anchor: 'comprei a fazenda, comprei o silêncio da casa, e não soube comprar o resto', observation: 'A repetição de “comprei” mostra a lógica de posse aplicada a tudo.', conclusion: 'Em São Bernardo, a mentalidade de proprietário destrói os afetos.' },
    ],
  },
  'joao-cabral': {
    topic: 'João Cabral de Melo Neto', question: 'Como o poema é construído, e não inspirado?', relation: 'objeto concreto + medida → poema construído',
    states: [
      { label: 'Construir', section: 'O poeta engenheiro', anchor: 'a palavra posta como pedra sobre pedra', observation: 'Cada palavra é escolhida e assentada como material de obra.', conclusion: 'Rigor não é frieza: a emoção vira precisão.' },
      { label: 'Redondilha', section: 'Morte e Vida Severina', anchor: 'Eu venho do sertão seco / atrás de um chão pra morar', observation: 'Sete sílabas poéticas até a última tônica, o metro do cordel.', conclusion: 'A forma aproxima o auto da tradição oral nordestina.' },
      { label: 'Pedra', section: 'Outras obras', anchor: 'aprender da pedra a frase que não sobra', observation: 'A pedra ensina economia: dizer só o necessário.', conclusion: 'Lição ética e estética: não embelezar a miséria.' },
    ],
  },
  'clarice-lispector': {
    topic: 'Clarice Lispector', question: 'Que detalhe banal muda o olhar?', relation: 'detalhe banal → epifania → linguagem que falha',
    states: [
      { label: 'Epifania', section: 'Uma prosa introspectiva', anchor: 'Ao ver o ovo rachado na pia, ela entendeu que a casa inteira era frágil', observation: 'Um objeto doméstico desencadeia uma percepção maior que ele.', conclusion: 'O acontecimento é interno; a revelação pode inquietar.' },
      { label: 'Narrador que hesita', section: 'Obras', anchor: 'quem conta a vida da moça hesita antes de cada frase', observation: 'A dúvida de quem narra entra na história.', conclusion: 'Em A Hora da Estrela, narrar Macabéa vira problema.' },
      { label: 'Linguagem que falha', section: 'Linguagem', anchor: 'o que eu sinto não tem nome, e por isso escrevo', observation: 'A escrita nasce do que não se deixa nomear: paradoxo produtivo.', conclusion: 'A forma encena a insuficiência da linguagem.' },
    ],
  },
  'guimaraes-rosa': {
    topic: 'Guimarães Rosa', question: 'Que palavra foi inventada, e o que fica sem resposta?', relation: 'invenção + travessia + dúvida → sertão-mundo',
    states: [
      { label: 'Inventar', section: 'Invenção da linguagem', anchor: 'o rio desmanchava-se em vereda e saudadeava', observation: '“Saudadear” transforma sentimento em ação do rio.', conclusion: 'Soa oral, mas é língua literária inventada.' },
      { label: 'Ambiguidade', section: 'Grande Sertão: Veredas', anchor: 'se o trato foi feito, só a noite sabe', observation: 'O pacto é deslocado para um lugar sem testemunha.', conclusion: 'A dúvida sobre o pacto é tema, não falha de enredo.' },
      { label: 'Travessia', section: 'Contos e temas', anchor: 'o menino atravessou o rio e voltou outro', observation: 'Deslocamento físico e transformação interior na mesma frase.', conclusion: 'O sertão é lugar e também imagem do mundo.' },
    ],
  },
  'concrete-poetry': {
    topic: 'Poesia Concreta', question: 'Onde está o sentido: na palavra ou na página?', relation: 'espaço + decomposição + som → sintaxe espacial',
    states: [
      { label: 'Espaço', section: 'O projeto', anchor: 'o espaço em branco também fala', observation: 'O vazio separa, aproxima e cria ritmo visual.', conclusion: 'Fim do verso: a página inteira é unidade.' },
      { label: 'Decompor', section: 'Procedimentos', anchor: 'mar dentro de amar, amar dentro de amargo', observation: 'Cada palavra contém a anterior; letras somadas criam sentido.', conclusion: 'Sintaxe espacial: a posição substitui o conectivo.' },
      { label: 'Comunicar', section: 'Contexto e desdobramentos', anchor: 'a placa de trânsito e o poema usam o mesmo alfabeto', observation: 'O poema aposta na rapidez do cartaz e do sinal urbano.', conclusion: 'Diálogo com design e publicidade; crítica de formalismo à parte.' },
    ],
  },
  'poetry-1960-1980': {
    topic: 'Poesia Brasileira: 1960-1980', question: 'Como dizer sob vigilância?', relation: 'censura + metáfora + cotidiano → resistência plural',
    states: [
      { label: 'Metáfora', section: 'Contexto de censura', anchor: 'o jardim tem ordem de não florir', observation: 'A proibição é deslocada para a natureza, sem nomear o censor.', conclusion: 'Dizer sem dizer exige decifração do leitor.' },
      { label: 'Marginal', section: 'Poesia marginal', anchor: 'acordei / o ônibus não / passou de novo', observation: 'Brevidade, quebra no meio da frase e assunto banal.', conclusion: 'Simplicidade escolhida, contra a solenidade e o mercado.' },
      { label: 'Corpo e casa', section: 'Outras vertentes', anchor: 'a fruta madura no quintal também é corpo', observation: 'Cotidiano doméstico e experiência física juntos.', conclusion: 'O período não se resume à marginalidade.' },
    ],
  },
  'prose-1960-1980': {
    topic: 'Prosa Brasileira: 1960-1980', question: 'Que estratégia torna dizível o que se calava?', relation: 'censura → alegoria, voz brutal ou testemunho',
    states: [
      { label: 'Alegoria', section: 'Ficção e ditadura', anchor: 'os mortos da cidade levantaram para cobrar o que os vivos calaram', observation: 'O impossível diz o que o medo cala.', conclusion: 'O fantástico fala da realidade de forma indireta.' },
      { label: 'Voz do agressor', section: 'Conto urbano e violência', anchor: 'eu não odiava ninguém; só tinha a arma e a pressa', observation: 'Quem agride narra sem remorso: a violência vira dado banal.', conclusion: 'Diagnóstico da desumanização, não celebração.' },
      { label: 'Testemunho', section: 'Memória e testemunho', anchor: 'conto o que vi na cela para que não digam que não houve', observation: 'Narrar é registrar o que poderia ser negado.', conclusion: 'Pacto de prova, diferente da autobiografia.' },
    ],
  },
} satisfies Record<string, Foundation>;
export type LiteratureFoundationId = keyof typeof LITERATURE_FOUNDATIONS;

const ink = 'var(--vs-ink)', wine = 'var(--vs-burgundy)', paper = 'var(--vs-paper)';
function Arrow({ d, active = true }: { d: string; active?: boolean }) {
  const transition = useSceneMotion();
  return <motion.path key={d} d={d} fill="none" stroke={wine} strokeWidth="3" initial={transition.duration === 0 ? false : { pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={transition} />;
}
function Drawing({ label, children }: { label: string; children: React.ReactNode }) {
  return <svg viewBox="0 0 560 240" role="img" aria-label={label} className="lf-drawing">{children}</svg>;
}
function Line({ x = 20, y, children }: { x?: number; y: number; children: React.ReactNode }) {
  return <text x={x} y={y} fill={ink} fontSize="17">{children}</text>;
}
function Art({ state }: { state: number }) {
  return <Drawing label={['Palavras dão à sala a ação de esperar', 'Uma cadeira vazia contrasta com as ocupadas', 'Passos se interrompem antes da porta', 'Desgaste e preço relacionam trabalho e consumo'][state]}>
    {state === 0 && <><Line y={65}>A sala <tspan fill={wine} fontWeight="800">esperou</tspan></Line><Line y={110}>por quem não voltou.</Line><Arrow d="M115 75Q170 165 330 125l-12-5m12 5-9 9"/><Line x={330} y={170}>ausência → duração</Line></>}
    {state === 1 && <>{[90, 240, 390].map((x, i) => <g key={x}><path d={`M${x} 80h60v70h-60zM${x} 150v25m60-25v25`} fill={paper} stroke={ink} strokeWidth="3"/>{i !== 1 && <><circle cx={x + 30} cy="52" r="16" fill={ink}/><path d={`M${x + 30} 70v60`} stroke={ink} strokeWidth="10"/></>}</g>)}<Arrow d="M270 35v35m-7-9 7 9 7-9"/><Line x={170} y={210}>posição + contraste = ausência</Line></>}
    {state === 2 && <><path d="M20 130h500" stroke={ink}/>{[40, 90, 140, 190, 240].map((x, i) => <rect key={x} x={x} y={70 + i * 5} width="12" height={60 - i * 5} fill={wine}/>)}<path d="M420 130V35h55v95" fill="none" stroke={ink} strokeWidth="3"/><Arrow d="M280 100h90m-10-8 10 8-10 8"/><Line x={270} y={175}>silêncio antes da chegada</Line></>}
    {state === 3 && <><path d="M45 125l20-65h42l18 50 80 15v35H40z" fill={paper} stroke={ink} strokeWidth="3"/><path d="M56 151l18-6 9 9 14-9 10 8" stroke={wine} strokeWidth="3" fill="none"/><rect x="330" y="70" width="175" height="70" rx="8" fill={paper} stroke={ink} strokeWidth="2"/><Line x={350} y={113}>preço do produto</Line><Arrow d="M215 130h100m-12-8 12 8-12 8"/><Line x={45} y={202}>desgaste + preço → pensar o trabalho</Line></>}
  </Drawing>;
}
function LiteraryText({ state }: { state: number }) {
  return <Drawing label={['Horário e ação verificável no aviso', 'Engoliu conecta portão e perda', 'A mesma frase assume pactos diferentes no conto e na notícia'][state]}>
    {state < 2 ? <><path d="M30 165V40h100v125M65 40v125M95 40v125" stroke={ink} strokeWidth="3" fill="none"/><Line x={160} y={75}>{state ? 'O portão engoliu' : 'O portão foi fechado'}</Line><Line x={160} y={120}>{state ? 'o último adeus.' : 'às dezoito horas.'}</Line><Arrow d={state ? 'M390 130Q120 220 75 100l-3 13m3-13 12 5' : 'M170 130h215m-10-7 10 7-10 7'}/><Line x={160} y={205}>{state ? 'imagem → separação e perda' : 'ação + horário → orientação'}</Line></> : <><Line y={40}>Uma cidade amanheceu sem sombras.</Line><path d="M280 65v30M80 95h400M80 95v25m400-25v25" fill="none" stroke={wine} strokeWidth="3"/><Line x={25} y={150}>CONTO</Line><Line x={25} y={185}>construir regras e efeitos</Line><Line x={330} y={150}>NOTÍCIA</Line><Line x={330} y={185}>apurar e esclarecer</Line></>}
  </Drawing>;
}
function Narrative({ state }: { state: number }) {
  const transition = useSceneMotion();
  const [inverted, setInverted] = useState(false);
  return <div>{state === 0 && <button type="button" className="lf-inline-control" aria-pressed={inverted} onClick={() => setInverted(!inverted)}>Começar {inverted ? 'pelo encontro' : 'pela devolução'}</button>}<Drawing label={['A ordem dos eventos no relato pode diferir da história', 'Declarar cautela difere de inferir cautela por ações', 'Um minuto pode ocupar muitas páginas de memória', 'A voz pode mostrar apenas ações ou acrescentar pensamento'][state]}>
    {state === 0 && <><Line y={35}>História: encontro → hesitação → devolução</Line>{['encontro', 'hesitação', 'devolução'].map((label, index) => <motion.g key={label} initial={false} animate={{ x: (inverted ? [1, 2, 0][index] : index) * 175 }} transition={transition}><rect x="15" y="80" width="160" height="60" rx="7" fill={paper} stroke={wine} strokeWidth="2"/><Line x={25} y={115}>{label}</Line></motion.g>)}<Line y={193}>{inverted ? 'Discurso: por que Lia recusou entrar?' : 'Discurso: o que Lia vai fazer?'}</Line></>}
    {state === 1 && <><Line y={50}>Lia era cautelosa. → traço declarado</Line><Line y={105}>testou a chave + olhou a rua</Line><Arrow d="M240 120v40m-8-10 8 10 8-10"/><Line y={195}>inferência: cautela? medo de ser vista?</Line></>}
    {state === 2 && <><Line y={40}>relógio: um minuto</Line><path d="M25 75h90" stroke={ink} strokeWidth="5"/><Arrow d="M110 90Q260 70 510 120l-15-4m15 4-10 10"/><Line y={160}>percepção: a espera da infância volta inteira</Line><Line y={205}>duração vivida ≠ ordem cronológica</Line></>}
    {state === 3 && <><Line y={60}>devolveu-a → ação observável</Line><Arrow d="M125 82v42m-8-10 8 10 8-10"/><Line y={158}>temia reconhecer a casa → pensamento</Line><Line y={205}>mesma terceira pessoa; acesso diferente</Line></>}
  </Drawing></div>;
}
function Medieval({ state }: { state: number }) {
  return <Drawing label={['Voz masculina dirigida à dama elevada', 'Voz feminina dirigida ao rio sobre o amado ausente', 'Elogio aparente entra em contradição com apropriação', 'Acusação explícita nomeia o roubo', 'Fala do cobrador contradiz seu gesto'][state]}>
    {state < 2 ? <><Line y={55}>{state ? 'Ó rio, meu amigo tarda a voltar' : 'Senhora, vosso olhar me nega o dia'}</Line><Line y={115}>{state ? 'voz feminina → natureza → amado ausente' : 'voz masculina → dama elevada'}</Line><Arrow d="M40 132h455m-12-8 12 8-12 8"/><Line y={195}>{state ? 'voz construída ≠ gênero do autor' : 'vassalagem amorosa'}</Line></> : state < 4 ? <><Line y={55}>{state === 2 ? 'Que fiel guardião!' : 'Martim roubou o cofre'}</Line><Arrow d="M90 75Q65 125 125 135l-12-8m12 8-15 4"/><Line y={155}>{state === 2 ? 'guardou para si o cofre inteiro' : 'e chama isso serviço'}</Line><Line y={205}>{state === 2 ? 'elogio aparente → avaliação invertida' : 'acusação explícita → ataque direto'}</Line></> : <><Line y={45}>FALA: “sirvo ao bem comum”</Line><path d="M275 60v80m-30-65 60 55m0-55-60 55" stroke={wine} strokeWidth="3"/><Line y={168}>GESTO: esconder moedas tomadas</Line><Line y={210}>a ação desmente a justificativa</Line></>}
  </Drawing>;
}
function Camoes({ state }: { state: number }) {
  const transition = useSceneMotion();
  return <Drawing label={['Polos opostos: alegria e tristeza', 'Uma alegria que dói: contradição aparente', 'Partida vista como glória', 'Partida vista por seu custo humano'][state]}>
    {state < 2 ? <><Line y={65}>{state ? 'Minha alegria dói' : 'Entre a alegria e a tristeza, espero'}</Line><motion.path initial={false} animate={{ d: state ? 'M60 100Q270 175 400 100M60 100Q270 65 400 100' : 'M60 100Q270 100 400 100M60 100Q270 100 400 100' }} transition={transition} stroke={wine} strokeWidth="3" fill="none"/><Line y={190}>{state ? 'uma experiência reúne prazer e sofrimento' : 'dois polos contrários em relação'}</Line></> : <><path d="M225 120h230l-35 40H265zM330 120V32l70 75h-70" fill={paper} stroke={ink} strokeWidth="3"/><path d="M25 175h505" stroke={ink}/><Arrow d={state === 2 ? 'M360 175h155m-12-8 12 8-12 8' : 'M220 125H65m12-8-12 8 12 8'}/><Line y={205}>{state === 2 ? 'olhar para o feito → glória da viagem' : 'olhar para a terra → perdas e ambição'}</Line></>}
  </Drawing>;
}
function Records({ state }: { state: number }) {
  const transition = useSceneMotion();
  const phrases = ['Não vimos ouro', 'a terra parece aproveitável', 'convém ensinar-lhes nossa fé'];
  return <Drawing label={state < 3 ? `${phrases[state]}: ${['observação', 'julgamento econômico', 'proposta de conversão'][state]}` : 'Cobiça e Conselho encenam um preceito moral'}>
    {state < 3 ? <>{phrases.map((phrase, index) => <g key={phrase}><rect x="15" y={15 + index * 64} width="530" height="54" rx="7" fill={paper} stroke={ink} strokeWidth="1"/><Line x={30} y={50 + index * 64}>{phrase}</Line></g>)}<motion.rect x="15" width="530" height="54" rx="7" fill="none" stroke={wine} strokeWidth="3" initial={false} animate={{ y: 15 + state * 64 }} transition={transition}/><Line y={226}>{['observação limitada', 'julgamento econômico', 'proposta de conversão'][state]}</Line></> : <><Line y={55}>COBIÇA: promete riqueza</Line><Arrow d="M200 78v47m-8-10 8 10 8-10"/><Line y={155}>CONSELHO: mostra a perda</Line><Line y={205}>ideia personificada → conflito → preceito</Line></>}
  </Drawing>;
}
function Baroque({ state }: { state: number }) {
  const [direct, setDirect] = useState(false);
  const transition = useSceneMotion();
  const words = ['Da noite,', 'o ouro frio', 'me acende'];
  return <div>{state === 0 && <button type="button" className="lf-inline-control" aria-pressed={direct} onClick={() => setDirect(!direct)}>Ler em {direct ? 'ordem invertida' : 'ordem direta'}</button>}<Drawing label={['A ordem muda mas a imagem ouro frio que acende permanece', 'Pagamento confronta favor e conduz a venda', 'O mesmo desejo atrai e provoca temor'][state]}>
    {state === 0 && <>{words.map((word, index) => <motion.g key={word} initial={false} animate={{ x: (direct ? [1, 0, 2][index] : index) * 170 }} transition={transition}><Line x={15} y={75}>{direct && index === 0 ? 'da noite' : word}</Line></motion.g>)}<path d="M195 100h290" stroke={wine} strokeWidth="3"/><Line y={175}>ouro frio + acende → imagem em tensão</Line></>}
    {state === 1 && <><Line y={45}>Se o favor exige pagamento</Line><Arrow d="M140 64v48m-8-10 8 10 8-10"/><Line y={145}>não é favor → é venda</Line><Line y={205}>definição + condição → conclusão</Line></>}
    {state === 2 && <><Line y={65}>Desejo o dia</Line><Line x={250} y={145}>receio a noite do meu desejo</Line><Arrow d="M170 75Q250 20 345 112l-2-13m2 13-13-3"/><Arrow d="M280 158Q180 215 100 90l1 13m-1-13 12 4"/><Line y={210}>atração e ameaça no mesmo impulso</Line></>}
  </Drawing></div>;
}
function Neoclassic({ state }: { state: number }) {
  const [trimmed, setTrimmed] = useState(false);
  const transition = useSceneMotion();
  return <div>{state === 0 && <button type="button" className="lf-inline-control" aria-pressed={trimmed} onClick={() => setTrimmed(!trimmed)}>{trimmed ? 'Repor' : 'Cortar'} acréscimo redundante</button>}<Drawing label={['Cortar redundância preservando sereno', 'Repouso e amenidade compõem o campo ideal', 'Colheita e dívida explicitam relações econômicas'][state]}>
    {state === 0 && <><Line y={60}>No vale <tspan fill={wine} fontWeight="800">sereno</tspan>, descansamos à sombra.</Line><motion.g initial={false} animate={{ opacity: trimmed ? 0 : 1 }} transition={transition}><Line y={105}>à sombra, em lugar sombreado.</Line></motion.g><Arrow d="M135 74v75m-8-10 8 10 8-10"/><Line y={190}>sereno fica: constrói amenidade</Line></>}
    {state === 1 && <><path d="M40 145Q180 60 300 145Q400 95 520 145M50 168Q160 195 300 165t220 0" stroke={ink} strokeWidth="3" fill="none"/><path d="M120 145V68m0 0c-50 30-40-25 0-25s50 55 0 25" stroke={ink} strokeWidth="3" fill="none"/><circle cx="160" cy="125" r="9" fill={wine}/><Line y={210}>repouso + sombra + rio → ideal ameno</Line></>}
    {state === 2 && <><Line y={55}>COLHEITA</Line><Line x={235} y={115}>TROCA</Line><Line x={440} y={175}>DÍVIDA</Line><Arrow d="M135 55l90 45m-13-3 13 3-6-13M315 115l110 45m-13-3 13 3-7-12"/><Line y={215}>condição econômica fora do recorte ideal</Line></>}
  </Drawing></div>;
}

function Box({ x, y, w, children, strong = false }: { x: number; y: number; w: number; children: React.ReactNode; strong?: boolean }) {
  return <g><rect x={x} y={y} width={w} height="44" rx="7" fill={paper} stroke={strong ? wine : ink} strokeWidth={strong ? 3 : 1.5}/><text x={x + 12} y={y + 28} fill={ink} fontSize="16">{children}</text></g>;
}
function RomanticPoetry({ state }: { state: number }) {
  return <Drawing label={['A mata recebe o juramento como suserana do guerreiro', 'A noite oferece ao eu a saída que a vida recusa', 'A voz convoca uma plateia e dá voz ao porão'][state]}>
    {state === 0 && <><Box x={20} y={30} w={170}>mata = suserana</Box><Box x={20} y={120} w={170}>guerreiro = vassalo</Box><Arrow d="M195 142h120m-12-8 12 8-12 8"/><Box x={330} y={120} w={200} strong>herói da nação</Box><Line x={330} y={60}>honra + juramento</Line><Line x={20} y={220}>código do cavaleiro, não etnografia</Line></>}
    {state === 1 && <><circle cx="80" cy="110" r="34" fill={paper} stroke={ink} strokeWidth="3"/><Line x={68} y={116}>eu</Line><Line x={330} y={60}>vida → recusa</Line><Arrow d="M118 110h200m-12-8 12 8-12 8"/><Box x={330} y={88} w={200} strong>noite → sono</Box><Line x={20} y={220}>a morte vira promessa de repouso</Line></>}
    {state === 2 && <><Box x={20} y={90} w={100} strong>voz</Box><Arrow d="M125 112h110m-12-8 12 8-12 8"/><Box x={245} y={40} w={150}>vós: plateia</Box><Box x={245} y={140} w={150}>porão que geme</Box><Arrow d="M400 62h90v100h-85m12-8-12 8 12 8"/><Line x={20} y={220}>apóstrofe + imperativo = comício</Line></>}
  </Drawing>;
}
function RomanticProse({ state }: { state: number }) {
  const transition = useSceneMotion();
  const [order, setOrder] = useState(true);
  return <div>{state === 0 && <button type="button" className="lf-inline-control" aria-pressed={!order} onClick={() => setOrder(!order)}>{order ? 'Pôr a noiva antes do dote' : 'Voltar o dote para a frente'}</button>}<Drawing label={['O dote aparece antes da noiva', 'Um casal vira origem do povo', 'O saber da terra se opõe à lei urbana', 'O arrependimento restaura a ordem moral'][state]}>
    {state === 0 && <><Line y={40}>O noivo aceitou</Line>{['o dote', 'a noiva'].map((label, index) => <motion.g key={label} initial={false} animate={{ x: (order ? index : 1 - index) * 200 }} transition={transition}><Box x={40} y={70} w={150} strong={label === 'o dote'}>{label}</Box></motion.g>)}<Line y={170}>{order ? 'dinheiro antes da pessoa' : 'afeto antes do negócio'}</Line><Line x={20} y={220}>{order ? 'a ordem expõe o casamento-transação' : 'a ordem romântica esperada'}</Line></>}
    {state === 1 && <><Box x={20} y={40} w={150}>estrangeiro</Box><Box x={20} y={130} w={180}>filha da floresta</Box><Arrow d="M205 85q60 0 90 40m-14-3 14 3 1-14"/><Arrow d="M205 152q60 0 90-20m-12 10 12-10-14-2"/><Box x={300} y={90} w={225} strong>primeiro filho da terra</Box><Line x={20} y={220}>alegoria de fundação, não crônica</Line></>}
    {state === 2 && <><Box x={20} y={50} w={190} strong>rastro (terra)</Box><Box x={330} y={50} w={190}>lei (cidade)</Box><Arrow d="M215 72h105m-12-8 12 8-12 8"/><Line y={150}>antes de… : o saber do interior vem primeiro</Line><Line x={20} y={215}>autenticidade idealizada, pitoresca</Line></>}
    {state === 3 && <><Box x={20} y={40} w={140}>honra perdida</Box><Arrow d="M165 62h70m-12-8 12 8-12 8"/><Box x={240} y={40} w={150}>arrependimento</Box><Arrow d="M395 62h40m-12-8 12 8-12 8"/><Box x={440} y={40} w={100} strong>ordem</Box><Line y={150}>o conflito social se resolve no íntimo</Line><Line x={20} y={215}>desfecho concilia; a crítica já apareceu</Line></>}
  </Drawing></div>;
}
function Realism({ state }: { state: number }) {
  return <Drawing label={['A fachada do casamento esconde a pressão da família', 'O elogio público esconde a cobrança dos juros', 'A personagem calcula antes de calar'][state]}>
    {state === 0 && <><rect x="40" y="30" width="200" height="140" fill={paper} stroke={ink} strokeWidth="3"/><path d="M40 30l100-25 100 25" fill="none" stroke={ink} strokeWidth="3"/><Line x={70} y={105}>fachada</Line><Arrow d="M245 100h90m-12-8 12 8-12 8"/><Box x={345} y={78} w={190} strong>exigência da família</Box><Line x={20} y={220}>o que se mostra ≠ o que se vive</Line></>}
    {state === 1 && <><Box x={20} y={30} w={230}>generoso em público</Box><Box x={20} y={120} w={230} strong>cobrava os juros</Box><Line x={300} y={58}>pontualidade da missa</Line><Arrow d="M300 75Q280 120 258 140m4-13-4 13 13-3"/><Line x={20} y={220}>elogio por fora, acusação por dentro</Line></>}
    {state === 2 && <>{['hesitou', 'calculou', 'calou'].map((label, index) => <Box key={label} x={20 + index * 180} y={70} w={150} strong={index === 1}>{label}</Box>)}<Arrow d="M172 92h26m-10-7 10 7-10 7M352 92h26m-10-7 10 7-10 7"/><Line y={170}>Naturalismo diria: calor, instinto, meio</Line><Line x={20} y={220}>consciência que delibera</Line></>}
  </Drawing>;
}
function Naturalism({ state }: { state: number }) {
  return <Drawing label={['Calor, origem e época convergem no gesto segundo o narrador', 'O pátio age sobre quem chega', 'A tese do narrador fica separada das pessoas reais'][state]}>
    {state === 0 && <><Box x={20} y={20} w={130}>calor (meio)</Box><Box x={20} y={80} w={130}>origem</Box><Box x={20} y={140} w={130}>época</Box><Arrow d="M155 42l170 60m-14 1 14-1-9-11M155 102h165m-12-8 12 8-12 8M155 162l170-55m-13-4 13 4-9 10"/><Box x={335} y={80} w={110} strong>gesto</Box><Line x={20} y={225}>“segundo o narrador”: tese, não fato</Line></>}
    {state === 1 && <><path d="M30 60h260v120H30z" fill={paper} stroke={ink} strokeWidth="3"/>{['acordava', 'fervia', 'engolia'].map((verb, index) => <Line key={verb} x={50} y={95 + index * 30}>{verb}</Line>)}<Arrow d="M295 120h120m-12-8 12 8-12 8"/><circle cx="450" cy="120" r="22" fill={wine}/><Line x={420} y={180}>quem chega</Line><Line x={20} y={225}>o espaço age: vira personagem</Line></>}
    {state === 2 && <><Box x={20} y={40} w={240}>denúncia: exploração</Box><Box x={290} y={40} w={250}>estereótipo: raça, gênero</Box><path d="M280 30v120" stroke={wine} strokeWidth="3" strokeDasharray="6 6"/><Line y={150}>o mesmo romance faz as duas coisas</Line><Line x={20} y={220}>tese do narrador ≠ prova sobre pessoas</Line></>}
  </Drawing>;
}
function Eca({ state }: { state: number }) {
  return <Drawing label={['Mais retratos de antepassados do que livros abertos', 'A fala sobre reformas é esvaziada pelo gesto com a gravata', 'O brasão é guardado enquanto os projetos são adiados'][state]}>
    {state === 0 && <>{[30, 100, 170, 240, 310].map(x => <rect key={x} x={x} y="40" width="50" height="64" fill={paper} stroke={ink} strokeWidth="2"/>)}<path d="M400 90h50l-25-14z" fill={wine}/><Line x={30} y={140}>5 retratos</Line><Line x={395} y={140}>1 livro</Line><Line x={20} y={220}>objetos medem valores: linhagem</Line></>}
    {state === 1 && <><Box x={20} y={40} w={290}>“O país precisa de reformas”</Box><Box x={330} y={40} w={200} strong>ajeitando a gravata</Box><Arrow d="M430 90Q330 160 170 92m3 13-3-13 13 2"/><Line y={175}>o gesto desmente a fala</Line><Line x={20} y={220}>vaidade esvazia o discurso</Line></>}
    {state === 2 && <><path d="M60 40h90v70q-45 40-90 0z" fill={paper} stroke={wine} strokeWidth="3"/><Line x={70} y={140}>brasão</Line>{[260, 350, 440].map(x => <rect key={x} x={x} y="60" width="70" height="44" rx="6" fill="none" stroke={ink} strokeDasharray="5 5"/>)}<Line x={265} y={140}>projetos adiados</Line><Line x={20} y={220}>passado guardado, futuro parado</Line></>}
  </Drawing>;
}
function Parnassian({ state }: { state: number }) {
  return <Drawing label={['O eu sai do verso e a ânfora ocupa o centro', 'A versão genérica é lapidada em imagem exata', 'A paródia rebaixa a ânfora com coloquialismo'][state]}>
    {state === 0 && <><Line y={45}>Eu choro ao ver a ânfora partida</Line><path d="M20 40h50" stroke={wine} strokeWidth="3"/><Arrow d="M150 60v35m-8-10 8 10 8-10"/><Line y={130}>A ânfora guarda a curva do silêncio</Line><path d="M470 100q-30 40 0 80q30-40 0-80" fill="none" stroke={ink} strokeWidth="3"/><Line x={20} y={220}>o eu recua; o objeto ocupa o verso</Line></>}
    {state === 1 && <><Line y={45}>A ânfora está ali, muito bonita</Line><Arrow d="M150 60v35m-8-10 8 10 8-10"/><Line y={130}>No <tspan fill={wine} fontWeight="800">mármore frio</tspan>, a ânfora <tspan fill={wine} fontWeight="800">repousa</tspan></Line><Line y={175}>matéria + temperatura + postura</Line><Line x={20} y={220}>ourives: trocar o vago pelo exato</Line></>}
    {state === 2 && <><Line y={55}>a ânfora, <tspan fill={wine} fontWeight="800">coitada</tspan>, cansou de rimar com nada</Line><Arrow d="M140 70v40m-8-10 8 10 8-10"/><Line y={145}>objeto nobre + fala coloquial</Line><Line x={20} y={220}>a paródia precisa do modelo famoso</Line></>}
  </Drawing>;
}
function Symbolism({ state }: { state: number }) {
  const transition = useSceneMotion();
  return <Drawing label={['A névoa chora sem sujeito definido', 'Perfume, cor e som se cruzam', 'O som de v se repete ao longo do verso'][state]}>
    {state === 0 && <><Line y={45}>Estou triste no corredor escuro</Line><Line x={400} y={45}>→ nomeia</Line><motion.ellipse cx="200" cy="125" rx="170" ry="30" fill={wine} initial={false} animate={{ opacity: 0.18 }} transition={transition}/><Line y={130}>Algo de névoa chora no corredor</Line><Line x={400} y={170}>→ sugere</Line><Line x={20} y={220}>vagueza escolhida, não defeito</Line></>}
    {state === 1 && <><Box x={20} y={40} w={140}>perfume</Box><Box x={200} y={40} w={140} strong>azul</Box><Box x={380} y={40} w={140}>sinos</Box><Line x={30} y={125}>olfato</Line><Line x={215} y={125}>visão</Line><Line x={390} y={125}>audição</Line><Arrow d="M90 140q180 60 360 0"/><Line x={20} y={220}>três sentidos fundidos</Line></>}
    {state === 2 && <><Line y={70}>{['vagas', 'vozes', 'vão', 'velando', 'o', 'vale'].map(word => <tspan key={word} fill={word.startsWith('v') ? wine : ink} fontWeight={word.startsWith('v') ? 800 : 400}>{word} </tspan>)}</Line><path d="M20 110q40-25 80 0t80 0 80 0 80 0 80 0" fill="none" stroke={wine} strokeWidth="3"/><Line y={170}>som contínuo: o verso sopra</Line><Line x={20} y={220}>o som significa tanto quanto a imagem</Line></>}
  </Drawing>;
}
function PreModernism({ state }: { state: number }) {
  return <Drawing label={['Mapa, data e cena unem ciência, história e literatura', 'Léxico técnico e solene descreve a caatinga', 'O doutor erudito erra um caminho banal'][state]}>
    {state === 0 && <><Box x={20} y={40} w={160}>mapa do clima</Box><Box x={200} y={40} w={160}>data da batalha</Box><Box x={380} y={40} w={160}>cena do cerco</Box><Line x={40} y={125}>ciência</Line><Line x={225} y={125}>história</Line><Line x={395} y={125}>literatura</Line><Arrow d="M100 140q180 50 360 0"/><Line x={20} y={220}>um relato híbrido</Line></>}
    {state === 1 && <><Line y={60}>A caatinga impõe ao viajante</Line><Line y={100}>um <tspan fill={wine} fontWeight="800">léxico de botânico</tspan></Line><Arrow d="M120 110v28m-8-10 8 10 8-10"/><Line y={160}>sintaxe solene + termo técnico</Line><Line x={20} y={220}>herança acadêmica</Line></>}
    {state === 2 && <><Line y={60}>O doutor citou o latim</Line><Line y={100}>e <tspan fill={wine} fontWeight="800">errou o caminho da estação</tspan></Line><Arrow d="M60 110v28m-8-10 8 10 8-10"/><Line y={160}>frase simples + ironia</Line><Line x={20} y={220}>ruptura: erudição inútil</Line></>}
  </Drawing>;
}

function Machado({ state }: { state: number }) {
  const [split, setSplit] = useState(false);
  const transition = useSceneMotion();
  return <div>{state === 0 && <button type="button" className="lf-inline-control" aria-pressed={split} onClick={() => setSplit(!split)}>{split ? 'Juntar' : 'Separar'} fato e dedução</button>}<Drawing label={['O sorriso é fato; saber tudo é dedução do narrador', 'O defunto diz o que a vida obrigava a calar', 'A alforria chega depois de uma vida de serviço'][state]}>
    {state === 0 && <><Box x={20} y={40} w={150} strong>Ela sorriu</Box><motion.g initial={false} animate={{ x: split ? 220 : 0 }} transition={transition}><Box x={180} y={40} w={150}>soube tudo</Box></motion.g><Line y={130}>{split ? 'fato observável | conclusão de quem narra' : 'a frase cola o fato à certeza'}</Line><Arrow d="M95 90v55m-8-10 8 10 8-10"/><Line x={20} y={220}>narrador interessado não é prova</Line></>}
    {state === 1 && <><path d="M40 160V80q50-50 100 0v80z" fill={paper} stroke={ink} strokeWidth="3"/><Line x={60} y={130}>morto</Line><Arrow d="M150 120h120m-12-8 12 8-12 8"/><Box x={280} y={98} w={250} strong>sem dever favores</Box><Line x={20} y={220}>licença para ironizar, vaidade intacta</Line></>}
    {state === 2 && <><Box x={20} y={40} w={230}>servido a vida inteira</Box><Arrow d="M255 62h60m-12-8 12 8-12 8"/><Box x={325} y={40} w={210} strong>libertou no testamento</Box><Line y={150}>a ordem dos fatos desmonta o elogio</Line><Line x={20} y={220}>ironia contra o privilégio</Line></>}
  </Drawing></div>;
}
function Vanguards({ state }: { state: number }) {
  return <Drawing label={['O motor vence a estátua', 'Um rosto de frente e de perfil no mesmo plano', 'Palavras saem de um chapéu por sorteio', 'Locomotiva geométrica entre bananeiras'][state]}>
    {state === 0 && <><path d="M60 170V70q20-30 40 0v100z" fill={paper} stroke={ink} strokeWidth="2"/><Line x={45} y={190}>estátua</Line><circle cx="420" cy="120" r="45" fill="none" stroke={wine} strokeWidth="4"/><Line x={385} y={190}>motor</Line><Arrow d="M130 120h230m-12-8 12 8-12 8"/><Line x={20} y={222}>velocidade acima do modelo clássico</Line></>}
    {state === 1 && <><circle cx="150" cy="110" r="60" fill={paper} stroke={ink} strokeWidth="3"/><path d="M150 50v120" stroke={ink} strokeWidth="2"/><path d="M150 80l40 25-40 10" fill="none" stroke={wine} strokeWidth="3"/><circle cx="125" cy="100" r="6" fill={ink}/><circle cx="170" cy="95" r="6" fill={ink}/><Arrow d="M220 110h90m-12-8 12 8-12 8"/><Line x={320} y={115}>frente + perfil</Line><Line x={20} y={220}>pontos de vista simultâneos</Line></>}
    {state === 2 && <><path d="M60 140h120l-15-60h-90z" fill={paper} stroke={ink} strokeWidth="3"/>{['lua', 'garfo', 'azul'].map((w, i) => <Line key={w} x={220 + i * 100} y={60 + i * 30}>{w}</Line>)}<Arrow d="M180 100q60-60 140-40"/><Line y={178}>Dadá: nega a obra | Surreal: busca o inconsciente</Line><Line x={20} y={222}>mesmo acaso, funções diferentes</Line></>}
    {state === 3 && <><rect x="40" y="100" width="120" height="50" fill={paper} stroke={wine} strokeWidth="3"/><path d="M160 115l40-15v50h-40" fill={paper} stroke={wine} strokeWidth="3"/>{[300, 380, 460].map(x => <path key={x} d={`M${x} 160V90m0 0q-35 10-40 40m40-40q35 10 40 40`} fill="none" stroke={ink} strokeWidth="3"/>)}<Arrow d="M210 125h70m-12-8 12 8-12 8"/><Line x={20} y={220}>técnica europeia, paisagem brasileira</Line></>}
  </Drawing>;
}
function ArtWeek({ state }: { state: number }) {
  return <Drawing label={['Aplausos para o soneto, vaias para o verso livre', 'Ruptura total e atualização do gosto no mesmo palco', 'A Semana entre 1917 e 1928'][state]}>
    {state === 0 && <><Box x={20} y={40} w={200}>soneto de rima rica</Box><Line x={240} y={68}>→ aplausos</Line><Box x={20} y={120} w={200} strong>verso livre</Box><Line x={240} y={148}>→ vaias</Line><Arrow d="M380 145q60-40 0-80"/><Line x={20} y={220}>a vaia prova que a ruptura foi percebida</Line></>}
    {state === 1 && <><path d="M20 160h520" stroke={ink} strokeWidth="4"/><Box x={40} y={80} w={200} strong>ruptura total</Box><Box x={320} y={80} w={200}>atualizar o gosto</Box><Arrow d="M245 102h70m-12-8 12 8-12 8m-58-8-12 8 12 8"/><Line x={20} y={220}>sem programa único</Line></>}
    {state === 2 && <><path d="M40 110h480" stroke={ink} strokeWidth="3"/>{[[60, '1917', 'exposição'], [250, '1922', 'Semana'], [440, '1928', 'Antropofagia']].map(([x, y, l]) => <g key={y as string}><circle cx={x as number} cy="110" r={y === '1922' ? 12 : 8} fill={y === '1922' ? wine : ink}/><Line x={(x as number) - 22} y={85}>{y}</Line><Line x={(x as number) - 40} y={145}>{l}</Line></g>)}<Arrow d="M70 180h360m-12-8 12 8-12 8"/><Line x={20} y={225}>marco no meio, não origem</Line></>}
  </Drawing>;
}
function FirstGeneration({ state }: { state: number }) {
  return <Drawing label={['Relógio comprado para perder a hora', 'Soneto inglês devorado vira modinha', 'Traços contraditórios convivem no herói'][state]}>
    {state === 0 && <><circle cx="90" cy="105" r="50" fill={paper} stroke={ink} strokeWidth="3"/><path d="M90 105V70m0 35l25 15" stroke={wine} strokeWidth="4"/><Line x={180} y={85}>Comprei um relógio</Line><Line x={180} y={125}>para perder a hora</Line><Arrow d="M350 135q40 30 0 55"/><Line x={20} y={220}>humor por inversão do objeto</Line></>}
    {state === 1 && <><Box x={20} y={60} w={160}>soneto inglês</Box><circle cx="280" cy="82" r="40" fill={paper} stroke={wine} strokeWidth="3"/><Line x={250} y={88}>comer</Line><Box x={380} y={60} w={150} strong>modinha</Box><Arrow d="M185 82h50m-12-8 12 8-12 8M325 82h50m-12-8 12 8-12 8"/><Line x={20} y={220}>digestão crítica, não cópia</Line></>}
    {state === 2 && <>{['valente', 'preguiçoso', 'esperto'].map((w, i) => <Box key={w} x={20 + i * 180} y={40} w={150}>{w}</Box>)}<Arrow d="M95 90l160 60m-14 0 14 0-6-13M275 90v55m-8-10 8 10 8-10M455 90l-160 60m14 0-14 0 6-13"/><Line x={190} y={180}>um só herói</Line><Line x={20} y={225}>sem identidade fixa</Line></>}
  </Drawing>;
}
function SecondPoetry({ state }: { state: number }) {
  return <Drawing label={['Verso livre usado para meditar sobre o tempo', 'Passa a nuvem, passa o rio, passa o sujeito', 'A poesia pergunta por si diante da cidade em chamas'][state]}>
    {state === 0 && <><Line y={50}>1922: relógio → piada</Line><Line y={110}>1930-40: verso livre → tempo</Line><Arrow d="M120 60v30m-8-10 8 10 8-10"/><Line y={170}>mesma forma livre, outro tom</Line><Line x={20} y={220}>da irreverência à reflexão</Line></>}
    {state === 1 && <>{['nuvem', 'rio', 'o que eu fui'].map((w, i) => <Line key={w} x={20 + i * 170} y={80 + i * 30}>passa {w}</Line>)}<Arrow d="M60 95q170 40 380 50"/><Line y={190}>a repetição leva a natureza até o sujeito</Line><Line x={20} y={228}>efemeridade feita de música</Line></>}
    {state === 2 && <><path d="M380 170l20-60 15 30 15-45 20 75z" fill={wine}/><Line y={70}>de que serve um verso</Line><Line y={110}>quando a cidade arde?</Line><Arrow d="M250 100q60 0 120 40"/><Line y={180}>o poema duvida de si</Line><Line x={20} y={225}>metalinguagem como engajamento</Line></>}
  </Drawing>;
}
function SecondProse({ state }: { state: number }) {
  return <Drawing label={['Duas frases curtas sem comentário', 'A usina absorve o engenho', 'A cacimba seca antes do gado morrer'][state]}>
    {state === 0 && <><Line y={60}>Saíram de madrugada.</Line><Line y={100}>Às dez, a menina já não chorava.</Line><Arrow d="M300 110q40 40 0 70"/><Line y={170}>o leitor infere a exaustão</Line><Line x={20} y={222}>secura: o silêncio do narrador pesa</Line></>}
    {state === 1 && <><rect x="300" y="50" width="200" height="100" fill={paper} stroke={wine} strokeWidth="3"/><path d="M460 50V15h25v35" fill={paper} stroke={wine} strokeWidth="3"/><Line x={360} y={108}>usina</Line><Box x={20} y={80} w={150}>engenho do avô</Box><Arrow d="M290 100h-110m12-8-12 8 12 8"/><Line x={20} y={220}>modernização que absorve o patriarcado</Line></>}
    {state === 2 && <><path d="M40 150q60-40 120 0" fill="none" stroke={ink} strokeWidth="3"/><Line x={50} y={185}>cacimba seca</Line><Arrow d="M175 140h100m-12-8 12 8-12 8"/><Line x={290} y={145}>gado → fome → retirada</Line><Line x={20} y={225}>estrutura social, não paisagem pitoresca</Line></>}
  </Drawing>;
}
function Pessoa({ state }: { state: number }) {
  const voices = ['Caeiro', 'Reis', 'Campos', 'ortônimo'];
  const transition = useSceneMotion();
  return <Drawing label={['Ver a pedra sem interpretar', 'Colher a hora calma diante do rio', 'Euforia das máquinas termina no quarto vazio', 'A dor escrita difere da dor vivida'][state]}>
    {voices.map((voice, i) => <g key={voice}><circle cx={70 + i * 140} cy="40" r="22" fill={i === state ? wine : paper} stroke={ink} strokeWidth="2"/><text x={70 + i * 140} y="85" textAnchor="middle" fill={ink} fontSize="15">{voice}</text></g>)}
    <motion.path initial={false} animate={{ d: `M${70 + state * 140} 95v30` }} transition={transition} stroke={wine} strokeWidth="3"/>
    {state === 0 && <><Line y={150}>A pedra é pedra, e basta-me vê-la</Line><Arrow d="M20 165h300"/><Line x={20} y={225}>ver sem metafísica</Line></>}
    {state === 1 && <><Line y={150}>Colhe a hora calma, que o rio não volta</Line><Arrow d="M20 165h330"/><Line x={20} y={225}>aceitação estoica do tempo</Line></>}
    {state === 2 && <><Line y={150}>Rodas, motores, tudo grita! —</Line><Line y={185}>e depois, o quarto vazio</Line><Line x={20} y={225}>da euforia ao tédio</Line></>}
    {state === 3 && <><Line y={150}>dor vivida → <tspan fill={wine} fontWeight="800">dor escrita</tspan></Line><Arrow d="M130 160h60"/><Line x={20} y={225}>fingir é elaborar, não mentir</Line></>}
  </Drawing>;
}
function Drummond({ state }: { state: number }) {
  return <Drawing label={['O sujeito sentado à margem da festa', 'O jornal entra no poema', 'O muro repetido vira bloqueio'][state]}>
    {state === 0 && <>{[60, 140, 220, 300].map(x => <circle key={x} cx={x} cy="70" r="16" fill={ink}/>)}<circle cx="470" cy="150" r="16" fill={wine}/><path d="M450 132h40l-6-14h-28z" fill={wine}/><Arrow d="M330 80q100 10 125 50"/><Line x={20} y={225}>gauche: à margem, com ironia</Line></>}
    {state === 1 && <><rect x="30" y="40" width="190" height="120" fill={paper} stroke={ink} strokeWidth="2"/><path d="M45 70h160M45 95h160M45 120h120" stroke={ink}/><Line x={60} y={185}>jornal</Line><Arrow d="M225 100h90m-12-8 12 8-12 8"/><Box x={325} y={78} w={190} strong>poema</Box><Line x={20} y={225}>a história atravessa o eu</Line></>}
    {state === 2 && <>{[0, 1].map(i => <Line key={i} x={20 + i * 250} y={60}>tinha um muro,</Line>)}<path d="M40 100h480" stroke={wine} strokeWidth="10"/><Arrow d="M60 140h360m-12-8 12 8-12 8"/><Line y={180}>insistência dá peso ao banal</Line><Line x={20} y={225}>repetição como construção</Line></>}
  </Drawing>;
}

function Graciliano({ state }: { state: number }) {
  const [cut, setCut] = useState(false);
  const transition = useSceneMotion();
  return <div>{state === 0 && <button type="button" className="lf-inline-control" aria-pressed={cut} onClick={() => setCut(!cut)}>{cut ? 'Repor' : 'Cortar'} os adjetivos</button>}<Drawing label={['Adjetivos cortados deixam dois fatos', 'A ideia de injustiça não chega à fala', 'Comprar repetido até o que não se compra'][state]}>
    {state === 0 && <><Line y={50}>O sol <motion.tspan initial={false} animate={{ opacity: cut ? 0.15 : 1 }} transition={transition} fill={wine}>terrível e implacável </motion.tspan>queimava.</Line><Line y={95}>A cachorra arquejava.</Line><Arrow d="M60 110v40m-8-10 8 10 8-10"/><Line y={180}>calor + corpo: a relação fala sozinha</Line><Line x={20} y={222}>secura como procedimento</Line></>}
    {state === 1 && <><Box x={20} y={40} w={200} strong>terra injusta (ideia)</Box><Arrow d="M225 62h80m-12-8 12 8-12 8"/><Box x={315} y={40} w={150}>grunhido</Box><Line y={140}>quem nomeia “injusta” é o narrador</Line><Line x={20} y={222}>privação material e verbal</Line></>}
    {state === 2 && <>{['fazenda', 'silêncio', 'o resto?'].map((w, i) => <Box key={w} x={20 + i * 180} y={50} w={150} strong={i === 2}>{i < 2 ? `comprei ${w}` : w}</Box>)}<Arrow d="M95 100q180 60 360 0"/><Line x={20} y={222}>a posse não alcança o afeto</Line></>}
  </Drawing></div>;
}
function Cabral({ state }: { state: number }) {
  return <Drawing label={['Palavras assentadas como pedras', 'Sete sílabas poéticas por verso', 'A pedra ensina a frase sem sobra'][state]}>
    {state === 0 && <>{[0, 1, 2].map(r => [0, 1, 2].map(c => <rect key={`${r}${c}`} x={40 + c * 90 + (r % 2) * 45} y={150 - r * 40} width="85" height="36" fill={paper} stroke={r === 2 && c === 1 ? wine : ink} strokeWidth="2"/>))}<Arrow d="M380 100h80"/><Line x={390} y={80}>palavra</Line><Line x={20} y={222}>construção, não inspiração</Line></>}
    {state === 1 && <><Line y={50}>Eu venho do sertão seco</Line>{[1, 2, 3, 4, 5, 6, 7].map(n => <g key={n}><circle cx={20 + n * 50} cy="100" r="16" fill={n === 7 ? wine : paper} stroke={ink}/><text x={20 + n * 50} y="106" textAnchor="middle" fill={n === 7 ? paper : ink} fontSize="15">{n}</text></g>)}<Arrow d="M70 130h300"/><Line y={175}>até a última tônica: redondilha maior</Line><Line x={20} y={222}>o metro do cordel</Line></>}
    {state === 2 && <><path d="M60 160l30-70h80l30 70z" fill={paper} stroke={ink} strokeWidth="3"/><Line x={90} y={190}>pedra</Line><Arrow d="M210 130h90m-12-8 12 8-12 8"/><Box x={310} y={108} w={210} strong>frase que não sobra</Box><Line x={20} y={222}>economia ética e estética</Line></>}
  </Drawing>;
}
function Clarice({ state }: { state: number }) {
  return <Drawing label={['O ovo rachado revela a fragilidade da casa', 'O narrador hesita antes de cada frase', 'Escrever a partir do que não tem nome'][state]}>
    {state === 0 && <><ellipse cx="90" cy="110" rx="40" ry="52" fill={paper} stroke={ink} strokeWidth="3"/><path d="M60 100l18 12 12-14 14 16" fill="none" stroke={wine} strokeWidth="3"/><Arrow d="M140 110h110m-12-8 12 8-12 8"/><path d="M300 150V80l70-40 70 40v70z" fill="none" stroke={ink} strokeWidth="3" strokeDasharray="6 5"/><Line x={20} y={222}>detalhe banal → percepção inteira</Line></>}
    {state === 1 && <><Line y={60}>quem conta …</Line><Line x={160} y={60}>hesita …</Line><Line x={290} y={60}>adia …</Line><Arrow d="M40 80q200 80 400 0"/><Line y={170}>a dúvida de narrar entra na história</Line><Line x={20} y={222}>narrar o outro é problema</Line></>}
    {state === 2 && <><Box x={20} y={50} w={200}>sinto: sem nome</Box><Arrow d="M225 72h80m-12-8 12 8-12 8"/><Box x={315} y={50} w={150} strong>escrevo</Box><Line y={150}>a falha da palavra move o texto</Line><Line x={20} y={222}>paradoxo produtivo</Line></>}
  </Drawing>;
}
function Rosa({ state }: { state: number }) {
  return <Drawing label={['Saudade vira verbo do rio', 'O pacto fica sem testemunha', 'Atravessar o rio e voltar outro'][state]}>
    {state === 0 && <><Box x={20} y={50} w={130}>saudade</Box><Arrow d="M155 72h80m-12-8 12 8-12 8"/><Box x={245} y={50} w={160} strong>saudadear</Box><path d="M20 160q60-30 120 0t120 0 120 0" fill="none" stroke={ink} strokeWidth="3"/><Line x={20} y={222}>parece oral, é invenção</Line></>}
    {state === 1 && <><circle cx="280" cy="110" r="70" fill={ink} opacity="0.85"/><Line x={235} y={116}>?</Line><Line y={60}>trato feito?</Line><Arrow d="M130 70q80 0 100 30"/><Line x={20} y={222}>a dúvida é o tema</Line></>}
    {state === 2 && <><path d="M240 30v170M300 30v170" stroke={ink} strokeWidth="3"/><circle cx="120" cy="110" r="18" fill={ink}/><circle cx="430" cy="110" r="18" fill={wine}/><Arrow d="M145 110h260m-12-8 12 8-12 8"/><Line x={90} y={160}>menino</Line><Line x={410} y={160}>outro</Line><Line x={20} y={222}>travessia física e interior</Line></>}
  </Drawing>;
}
function Concrete({ state }: { state: number }) {
  return <Drawing label={['O espaço em branco organiza as palavras', 'Mar dentro de amar dentro de amargo', 'Placa e poema com o mesmo alfabeto'][state]}>
    {state === 0 && <><text x={60} y={60} fill={ink} fontSize="22">luz</text><text x={300} y={60} fill={ink} fontSize="22">luz</text><text x={180} y={130} fill={wine} fontSize="22">sombra</text><rect x="100" y="70" width="190" height="40" fill="none" stroke={wine} strokeDasharray="5 5"/><Arrow d="M300 140h120"/><Line x={20} y={222}>o vazio também significa</Line></>}
    {state === 1 && <>{['  mar', ' amar', ' amargo'].map((w, i) => <text key={w} x={150} y={60 + i * 45} fill={ink} fontSize="24" fontFamily="monospace" xmlSpace="preserve">{w}</text>)}<Arrow d="M330 50v95m-8-10 8 10 8-10"/><Line x={350} y={105}>raiz comum</Line><Line x={20} y={222}>posição no lugar do conectivo</Line></>}
    {state === 2 && <><rect x="40" y="50" width="140" height="80" rx="6" fill={wine}/><text x={60} y="100" fill={paper} fontSize="22">PARE</text><Arrow d="M190 90h110m-12-8 12 8-12 8"/><Box x={310} y={68} w={200}>poema-cartaz</Box><Line x={20} y={222}>comunicação rápida como modelo</Line></>}
  </Drawing>;
}
function Poetry6080({ state }: { state: number }) {
  return <Drawing label={['O jardim proibido de florir', 'Três versos curtos sobre o ônibus', 'Fruta, quintal e corpo'][state]}>
    {state === 0 && <>{[80, 160, 240].map(x => <path key={x} d={`M${x} 170v-60m0 0q-15-20 0-35q15 15 0 35`} fill="none" stroke={ink} strokeWidth="3"/>)}<Box x={320} y={60} w={200} strong>ordem: não florir</Box><Arrow d="M315 100q-40 20-60 30"/><Line x={20} y={222}>a censura sem nome próprio</Line></>}
    {state === 1 && <><Line y={50}>acordei</Line><Line y={90}>o ônibus não</Line><Line y={130}>passou de novo</Line><Arrow d="M150 82q40 0 60 10"/><Line x={230} y={95}>quebra: suspense mínimo</Line><Line x={20} y={222}>cotidiano como poema</Line></>}
    {state === 2 && <><circle cx="100" cy="100" r="40" fill={wine}/><path d="M100 60v-20" stroke={ink} strokeWidth="3"/><Arrow d="M150 100h90m-12-8 12 8-12 8"/><Box x={250} y={78} w={160}>corpo</Box><Line y={170}>casa + desejo + fé</Line><Line x={20} y={222}>outras vozes do período</Line></>}
  </Drawing>;
}
function Prose6080({ state }: { state: number }) {
  return <Drawing label={['Mortos se levantam e falam', 'O agressor narra sem remorso', 'O relato registra o que poderia ser negado'][state]}>
    {state === 0 && <>{[60, 130, 200].map(x => <path key={x} d={`M${x} 170v-70q25-30 50 0v70`} fill={paper} stroke={ink} strokeWidth="2"/>)}<Arrow d="M270 120h80m-12-8 12 8-12 8"/><Box x={360} y={98} w={160} strong>dizem o calado</Box><Line x={20} y={222}>o impossível torna dizível</Line></>}
    {state === 1 && <><Box x={20} y={50} w={250}>eu não odiava ninguém</Box><Box x={290} y={50} w={240} strong>só a arma e a pressa</Box><Arrow d="M150 100v40m-8-10 8 10 8-10"/><Line y={175}>a voz fria expõe a banalização</Line><Line x={20} y={222}>diagnóstico, não elogio</Line></>}
    {state === 2 && <><rect x="40" y="40" width="120" height="130" fill="none" stroke={ink} strokeWidth="3"/>{[60, 90, 120].map(x => <path key={x} d={`M${x} 40v130`} stroke={ink} strokeWidth="3"/>)}<Arrow d="M170 105h100m-12-8 12 8-12 8"/><Box x={280} y={83} w={220} strong>relato como prova</Box><Line x={20} y={222}>pacto de testemunho</Line></>}
  </Drawing>;
}

const drawings: Record<LiteratureFoundationId, React.ComponentType<{ state: number }>> = {
  'art-languages': Art, 'literary-text': LiteraryText, 'narrative-elements': Narrative, 'medieval-voices': Medieval,
  'renaissance-camoes': Camoes, 'first-records': Records, baroque: Baroque, neoclassic: Neoclassic,
  'romantic-poetry': RomanticPoetry, 'romantic-prose': RomanticProse, realism: Realism, naturalism: Naturalism,
  'eca-de-queiros': Eca, parnassianism: Parnassian, symbolism: Symbolism, 'pre-modernism': PreModernism,
  'machado-de-assis': Machado, vanguards: Vanguards, 'modern-art-week': ArtWeek, 'modernism-first-generation': FirstGeneration,
  'modernism-second-generation': SecondPoetry, 'modernism-second-prose': SecondProse, 'fernando-pessoa': Pessoa, 'carlos-drummond': Drummond,
  'graciliano-ramos': Graciliano, 'joao-cabral': Cabral, 'clarice-lispector': Clarice, 'guimaraes-rosa': Rosa,
  'concrete-poetry': Concrete, 'poetry-1960-1980': Poetry6080, 'prose-1960-1980': Prose6080,
};
export function LiteratureOperation({ id }: { id: LiteratureFoundationId }) {
  const config = LITERATURE_FOUNDATIONS[id];
  const [index, setIndex] = useState(0);
  const selected = config.states[index];
  const Scene = drawings[id];
  const drawing = React.useRef<HTMLDivElement>(null);
  const pan = (amount: number) => { if (drawing.current) drawing.current.scrollLeft += amount; };
  return <section className="lf-operation" data-literature-operation={id} aria-label={config.question}>
    <p className="lf-manuscript">Leia a operação, não apenas o nome da escola.</p>
    <div className="lf-controls" role="group" aria-label={`Operações de ${config.topic}`}>{config.states.map((state, i) => <button type="button" key={state.label} aria-pressed={index === i} onClick={() => setIndex(i)}>{state.label}</button>)}</div>
    <p className="lf-caption">Exemplos didáticos autorais. Não são versos ou cenas dos autores estudados.</p>
    <div className="lf-drawing-window" ref={drawing} tabIndex={0} role="region" aria-label={`Percorrer demonstração de ${config.topic}`} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); pan(event.key === 'ArrowRight' ? 160 : -160); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); event.currentTarget.scrollLeft = event.key === 'Home' ? 0 : event.currentTarget.scrollWidth; }
    }}><Scene state={index}/></div>
    <div className="lf-pan"><span>Deslize a prancha; com teclado, use as setas.</span><button type="button" aria-label="Percorrer demonstração para a esquerda" onClick={() => pan(-160)}>←</button><button type="button" aria-label="Percorrer demonstração para a direita" onClick={() => pan(160)}>→</button></div>
    <div className="lf-reading" role="status" aria-live="polite"><blockquote>“{selected.anchor}”<cite>{selected.section}</cite></blockquote><div><strong>{selected.label}</strong><p>{selected.observation}</p><p className="lf-conclusion">{selected.conclusion}</p></div></div>
    {id === 'art-languages' && <p className="lf-context">Contexto: critérios de beleza mudam. No retrato oficial, tamanho e luz podem legitimar poder. Avaliar a obra só pela proporção naturalista atual pode ser anacrônico; explicar seu contexto não obriga a aceitar a hierarquia.</p>}
  </section>;
}
export function literatureFoundationInstrument(id: LiteratureFoundationId) {
  const config = LITERATURE_FOUNDATIONS[id];
  return function LiteratureFoundationBoard(props: BoardProps) {
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell title={config.topic} kicker="Oficina de leitura · fundamentos" subtitle={config.question}
      condition={{ label: 'Operação', value: 'Exemplos autorais' }} sceneFirst
      ariaLabel={`Oficina literária: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<LiteratureOperation id={id}/>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? config.topic, detail: first?.excerpt ?? config.question, formula: config.relation }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? config.topic, detail: second?.excerpt ?? config.question, formula: 'marca textual → efeito → interpretação sustentada' }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      closing="Uma leitura pode ser plural, mas precisa explicar as marcas que a sustentam."/>;
  };
}
