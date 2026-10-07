export type ReadingState = { label: string; section: string; anchor: string; observation: string; conclusion: string };
export type Foundation = { topic: string; question: string; relation: string; states: ReadingState[] };
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
  'poetry-contemporary': {
    topic: 'Poesia Brasileira Contemporânea', question: 'Sem escola dominante, o que organiza o poema?', relation: 'procedimento + voz + meio → leitura',
    states: [
      { label: 'Pluralidade', section: 'Pluralidade', anchor: 'um mesmo sarau tem soneto, poema visual e rap', observation: 'Formas de matrizes diferentes convivem sem hierarquia de escola.', conclusion: 'Leia o procedimento de cada poema, não um programa coletivo.' },
      { label: 'Voz', section: 'Slam e oralidade', anchor: 'minha voz é o papel que ninguém rasga', observation: 'A fala assume a permanência que se atribuía à escrita.', conclusion: 'No slam, o corpo de quem diz é suporte do poema.' },
      { label: 'Circulação', section: 'Circulação', anchor: 'o poema postado às duas da manhã tinha mil leitores ao meio-dia', observation: 'O poema chega ao público antes de editor ou crítico.', conclusion: 'Alcance e valor estético são critérios diferentes.' },
    ],
  },
  'prose-contemporary': {
    topic: 'Prosa Brasileira Contemporânea', question: 'De onde a voz narra, e que pacto propõe?', relation: 'ponto de vista interno + pacto → sentido',
    states: [
      { label: 'Narrar de dentro', section: 'Novas vozes e temas', anchor: 'quem morava na viela contou a viela', observation: 'O espaço é narrado por quem o habita, não por quem o observa de fora.', conclusion: 'Muda o ponto de vista, não só o tema.' },
      { label: 'Escrevivência', section: 'Autores e obras', anchor: 'escrevo com a memória da minha avó e com a minha própria', observation: 'Experiência individual e memória coletiva se reúnem na escrita.', conclusion: 'Não é autobiografia: a ficção recria a partir da vivência.' },
      { label: 'Autoficção', section: 'Formas', anchor: 'o narrador tem meu nome, mas inventei o que ele lembra', observation: 'Dados reais e invenção declarada no mesmo pacto.', conclusion: 'Pacto ficcional, diferente do pacto de veracidade.' },
    ],
  },
  'lusophone-contemporary': {
    topic: 'Literatura Lusófona Contemporânea', question: 'A mesma língua carrega que história?', relation: 'língua comum + contexto próprio → projetos distintos',
    states: [
      { label: 'Uma língua, histórias', section: 'Um campo plural', anchor: 'a mesma palavra muda de sotaque e de história em Luanda e em Lisboa', observation: 'Para um país foi língua do colonizador; para outro, de origem.', conclusion: 'Lusofonia é campo de relações, não bloco único.' },
      { label: 'Inventar', section: 'África de língua portuguesa', anchor: 'a noite estava toda estrelinhada', observation: 'A palavra criada dá à noite uma afetividade que nenhuma existente daria.', conclusion: 'Procedimento próximo de Rosa, contexto moçambicano próprio.' },
      { label: 'Alegoria', section: 'Portugal contemporâneo', anchor: 'a cidade cegou, disse o homem, e ninguém perguntou porquê, perguntaram só quem os guiaria', observation: 'Falas sem travessão e a busca de um guia no lugar da causa.', conclusion: 'Pontuação e alegoria produzem a reflexão sobre poder.' },
    ],
  },
  'brazilian-visual-arts': {
    topic: 'Artes Plásticas Brasileiras', question: 'O que a forma recusa, e o que pede do público?', relation: 'recursos visuais + projeto → sentido',
    states: [
      { label: 'Pose × cor', section: 'Do século XIX ao modernismo', anchor: 'o retrato oficial pede pose; o modernista pede cor e deformação', observation: 'Postura solene e proporção contra cor forte e forma simplificada.', conclusion: 'A deformação modernista recusa a imitação fiel.' },
      { label: 'Desproporção', section: 'Tarsila e Portinari', anchor: 'pé enorme e cabeça mínima', observation: 'O corpo ligado à terra se agiganta; o intelecto encolhe.', conclusion: 'Em Abaporu, a forma é o argumento antropofágico.' },
      { label: 'Participação', section: 'Neoconcretismo e contemporâneo', anchor: 'a obra só se completa quando alguém a dobra', observation: 'O objeto depende do gesto de quem interage.', conclusion: 'Neoconcretismo: obra como experiência do corpo.' },
    ],
  },
  'brazilian-theater': {
    topic: 'Teatro Brasileiro', question: 'Que relação a cena cria com quem assiste?', relation: 'tipo, plano ou participação → função da cena',
    states: [
      { label: 'Costumes', section: 'Formação', anchor: 'o noivo da roça confunde a modista com a dona da casa', observation: 'O humor nasce do choque entre o tipo caipira e os códigos da cidade.', conclusion: 'A comédia de costumes ri de tipos para criticar hábitos.' },
      { label: 'Três planos', section: 'Nelson Rodrigues', anchor: 'no plano da memória ela casa; no da alucinação, foge; no da realidade, agoniza', observation: 'A mesma personagem existe em três camadas simultâneas.', conclusion: 'A estrutura em planos expressa a consciência fragmentada.' },
      { label: 'Espect-ator', section: 'Teatro e política', anchor: 'o espectador sobe ao palco e muda o fim da cena', observation: 'A plateia deixa de assistir e passa a agir.', conclusion: 'Teatro do Oprimido: ensaio de transformação social.' },
    ],
  },
  'popular-songbook': {
    topic: 'Cancioneiro Popular Brasileiro', question: 'O que a música faz com a palavra?', relation: 'letra + melodia + contexto → sentido',
    states: [
      { label: 'Letra e melodia', section: 'Canção como texto', anchor: 'a palavra triste cai na nota mais alta', observation: 'O significado e a tensão melódica se somam.', conclusion: 'A letra sozinha perde camadas da canção.' },
      { label: 'Momentos', section: 'Momentos e nomes', anchor: 'o morro, a praia, a guitarra elétrica e a periferia', observation: 'Quatro signos resumem samba, Bossa, Tropicália e rap/funk.', conclusion: 'Associe gênero, espaço social e momento histórico.' },
      { label: 'Duplo sentido', section: 'Canção e censura', anchor: 'cálice / cale-se', observation: 'Sons quase iguais: imagem religiosa e ordem de silêncio.', conclusion: 'A homofonia diz a denúncia sob aparência sagrada.' },
    ],
  },
} satisfies Record<string, Foundation>;
export type LiteratureFoundationId = keyof typeof LITERATURE_FOUNDATIONS;
