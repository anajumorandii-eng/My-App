export type ReadingInstrumentId = 'textuality' | 'levels' | 'intertext' | 'genres' | 'narrative' | 'nonverbal' | 'functions' | 'poetic' | 'figures' | 'distortions' | 'comic' | 'tdic';

export interface ReadingDocument { label: string; lines: string[]; }
export interface ReadingState {
  label: string;
  clue: string;
  diagnosis: string;
  action: string;
  /** Marcas literais no objeto da leitura, nunca uma conclusão inventada. */
  evidence: string[];
  annotation: string;
  reading: string;
}
export interface ReadingInstrumentConfig {
  id: ReadingInstrumentId; name: string; question: string; controlLabel: string;
  relation: string; insight: string; documents: ReadingDocument[]; states: ReadingState[];
}

export const READING_INSTRUMENTS: Record<ReadingInstrumentId, ReadingInstrumentConfig> = {
  textuality: {
    id: 'textuality', name: 'Articular não basta', question: 'O conectivo une as frases e preserva o sentido do aviso?', controlLabel: 'Versão do aviso',
    relation: 'ligação explícita + unidade de sentido = texto pertinente', insight: 'Coesão liga partes; coerência exige que a relação faça sentido. O aviso precisa orientar o leitor no contexto da porta.',
    documents: [
      { label: 'Aviso na porta · primeira versão', lines: ['O aviso proíbe entrar na sala.', 'Portanto, autoriza a entrada.'] },
      { label: 'Aviso na porta · versão reparada', lines: ['O aviso proíbe entrar na sala.', 'Por isso, aguarde do lado de fora.'] },
    ], states: [
      { label: 'ligação incoerente', clue: 'proíbe × autoriza, ligados por portanto', diagnosis: 'há coesão; falta coerência', action: 'conferir se a conclusão preserva a proibição do aviso', evidence: ['proíbe', 'Portanto', 'autoriza'], annotation: '“Portanto” articula as partes, mas a conclusão contradiz a proibição. Conectivo não garante sentido.', reading: 'Aviso coeso, mas incoerente: proibir não autoriza entrar.' },
      { label: 'reparo de sentido', clue: 'proíbe → aguarde do lado de fora', diagnosis: 'coesão e coerência compatíveis', action: 'ligar a orientação prática à proibição, mantendo a finalidade', evidence: ['proíbe', 'Por isso', 'aguarde do lado de fora'], annotation: 'A segunda frase acrescenta uma ação compatível com a primeira. O tema continua e a orientação avança.', reading: 'Aviso coerente: a proibição justifica esperar fora.' },
    ],
  },
  levels: {
    id: 'levels', name: 'Do dito ao inferido', question: 'O que está escrito e o que as pistas permitem concluir?', controlLabel: 'Nível de leitura',
    relation: 'pistas convergentes → inferência limitada', insight: 'O texto declara o guarda-chuva molhado. A chuva é uma hipótese plausível; o lugar de onde Lia veio não foi informado.',
    documents: [{ label: 'Microconto original · chegada', lines: ['Lia entrou com o casaco molhado.', 'O guarda-chuva pingava.', 'Ela o deixou junto à porta.'] }], states: [
      { label: 'explícito', clue: 'o guarda-chuva pingava', diagnosis: 'localização literal', action: 'retomar a formulação e conferir quem, o quê e quando', evidence: ['O guarda-chuva pingava.'], annotation: 'A água no guarda-chuva é declarada. Não é preciso acrescentar uma causa para localizar essa informação.', reading: 'Informação declarada: o guarda-chuva estava molhado.' },
      { label: 'inferencial', clue: 'casaco molhado + guarda-chuva pingando', diagnosis: 'sentido construído com cautela', action: 'explicar quais marcas sustentam a inferência', evidence: ['casaco molhado', 'guarda-chuva pingava'], annotation: 'As duas marcas convergem para uma hipótese de chuva. Elas não provam de onde Lia veio nem por quanto tempo choveu.', reading: 'É plausível que Lia tenha passado pela chuva.' },
    ],
  },
  intertext: {
    id: 'intertext', name: 'A fonte volta transformada', question: 'A retomada conserva ou desloca o sentido do lema?', controlLabel: 'Operação da retomada',
    relation: 'texto reconhecível → manutenção ou subversão', insight: 'A citação atribui o lema à fonte. A paródia mantém sua estrutura e troca o caminho pela aba digital, produzindo crítica.',
    documents: [
      { label: 'Fonte · lema original da turma', lines: ['Quem abre um livro abre caminho.'] },
      { label: 'Texto B · cartaz da biblioteca', lines: ['“Quem abre um livro abre caminho.”', '— Caderno da turma'] },
      { label: 'Texto C · cartaz satírico', lines: ['Quem abre um livro abre uma aba.', 'E fecha a atenção.'] },
    ], states: [
      { label: 'citação', clue: 'formulação integral + atribuição', diagnosis: 'diálogo declarado', action: 'conferir a atribuição e o sentido preservado do lema', evidence: ['Quem abre um livro abre caminho.', 'Caderno da turma'], annotation: 'As aspas e a atribuição apresentam uma fonte identificável. O novo cartaz conserva a ideia de leitura como abertura.', reading: 'É citação: o lema reconhecível vem atribuído à turma.' },
      { label: 'paródia', clue: 'abre caminho → abre uma aba', diagnosis: 'diálogo transformador', action: 'comparar a promessa de abertura com a crítica à dispersão', evidence: ['abre caminho', 'abre uma aba', 'fecha a atenção'], annotation: 'A estrutura retorna, mas o final muda: abertura de conhecimento vira abertura de janela digital e perda de atenção.', reading: 'É paródia: a troca do final subverte a promessa do lema.' },
    ],
  },
  genres: {
    id: 'genres', name: 'Um fato, dois gêneros', question: 'Informar a reabertura ou defender um horário: o que muda?', controlLabel: 'Contrato com o leitor',
    relation: 'propósito + suporte + voz → expectativa de leitura', insight: 'Notícia e artigo tratam do mesmo evento, mas a fonte informativa e a posição argumentada pedem leituras diferentes.',
    documents: [
      { label: 'Jornal local · notícia original', lines: ['Biblioteca reabre às 9h.', 'A direção confirmou o horário', 'nesta terça-feira.'] },
      { label: 'Coluna assinada · opinião original', lines: ['Abrir cedo amplia o acesso.', 'Defendo a abertura às 7h,', 'pois estudantes chegam cedo.'] },
    ], states: [
      { label: 'notícia', clue: 'horário + direção + data', diagnosis: 'fato situado e fonte atribuída', action: 'localizar o acontecimento, a fonte e o momento informado', evidence: ['reabre às 9h', 'direção', 'terça-feira'], annotation: 'O horário é atribuído à direção e situado no tempo. Essa organização permite conferir um acontecimento.', reading: 'A notícia comunica um fato atribuído a uma fonte.' },
      { label: 'artigo de opinião', clue: 'defendo + pois', diagnosis: 'tese apoiada em uma razão', action: 'distinguir a proposta de horário do horário confirmado', evidence: ['Defendo', 'às 7h', 'pois estudantes chegam cedo'], annotation: '“Defendo” assume uma posição; “pois” introduz a justificativa. As 7h são proposta, não horário confirmado.', reading: 'O artigo defende uma posição sobre o acesso.' },
    ],
  },
  narrative: {
    id: 'narrative', name: 'Quem conta, o que sabe', question: 'A mesma ação permite conhecer pensamentos em ambos os focos?', controlLabel: 'Foco narrativo',
    relation: 'voz narrativa → acesso ao que se sabe', insight: 'Primeira pessoa situa a experiência. Terceira pessoa, sozinha, não comprova onisciência: observar uma ação não revela pensamentos.',
    documents: [
      { label: 'Versão A · narrador-personagem', lines: ['Eu escondi a chave.', 'Achei que ninguém me vira.', 'Atrás de mim, a porta rangeu.'] },
      { label: 'Versão B · narrador-observador', lines: ['Lia escondeu a chave.', 'Olhou para trás.', 'A porta rangeu.'] },
    ], states: [
      { label: 'narrador-personagem', clue: 'eu + achei', diagnosis: 'experiência parcial', action: 'não transformar a impressão de Lia em fato confirmado', evidence: ['Eu', 'Achei'], annotation: '“Achei” relata a crença da personagem. O ruído da porta deixa a dúvida: ela pode ter sido vista.', reading: 'Lia acredita estar sozinha; o texto não dá certeza.' },
      { label: 'narrador-observador', clue: 'olhou para trás, sem acesso interior', diagnosis: 'ações observáveis', action: 'distinguir gesto descrito de sentimento não declarado', evidence: ['Lia escondeu', 'Olhou para trás'], annotation: 'A voz externa mostra ações. Não informa o pensamento de Lia; chamar esse narrador de onisciente excederia o trecho.', reading: 'Vemos gestos de Lia, sem conhecer seu pensamento.' },
    ],
  },
  nonverbal: {
    id: 'nonverbal', name: 'O enquadramento escolhe', question: 'Como escala e corte mudam a mensagem do mesmo cartaz?', controlLabel: 'Escolha visual',
    relation: 'escala + posição + corte → hierarquia e seleção', insight: 'O desenho é um cartaz original: a árvore ganha destaque; cortar o cuidador restringe a informação, sem provar intenção de apagá-lo.',
    documents: [{ label: 'cartaz original · descrição acessível', lines: ['Uma árvore grande no centro.', 'Um cuidador junto à borda.', 'O cartaz mostra os dois.'] }], states: [
      { label: 'destaque', clue: 'árvore grande no centro', diagnosis: 'hierarquia visual', action: 'explicar como a escala conduz o olhar à árvore', evidence: ['árvore grande', 'no centro'], annotation: 'A árvore ocupa mais área e o centro do cartaz. A escala dá prioridade visual ao tema ambiental.', reading: 'A árvore recebe prioridade pelo tamanho e pela posição.' },
      { label: 'ausência', clue: 'cuidador cortado pela borda', diagnosis: 'seleção do enquadramento', action: 'comparar o enquadramento amplo com a informação excluída', evidence: ['cuidador junto à borda'], annotation: 'A moldura estreita deixa o cuidador fora. A imagem já não mostra o trabalho humano; a intenção desse corte não está comprovada.', reading: 'O corte oculta o cuidador e restringe o que vemos.' },
    ],
  },
  functions: {
    id: 'functions', name: 'Informação ou convite?', question: 'Qual intenção domina cada mensagem da biblioteca?', controlLabel: 'Função dominante',
    relation: 'escolha verbal → foco comunicativo', insight: 'Um convite também informa um horário. O imperativo desloca a ênfase para a ação de quem lê; funções podem coexistir.',
    documents: [
      { label: 'Mensagem A · informação', lines: ['A biblioteca abre às 9h.', 'O acervo tem livros e revistas.'] },
      { label: 'Mensagem B · convite', lines: ['Venha à biblioteca às 9h.', 'Escolha sua próxima leitura!'] },
    ], states: [
      { label: 'referencial', clue: 'abre + horário + acervo', diagnosis: 'ênfase no referente', action: 'localizar os dados sobre funcionamento e acervo', evidence: ['abre às 9h', 'livros e revistas'], annotation: 'Os verbos descrevem funcionamento e acervo. Não convocam diretamente o destinatário a uma ação.', reading: 'A função referencial domina: a mensagem informa.' },
      { label: 'apelativa', clue: 'venha + escolha', diagnosis: 'ênfase no interlocutor', action: 'ligar os imperativos à ação esperada do leitor', evidence: ['Venha', 'Escolha'], annotation: 'Os imperativos dirigem ações a quem lê. O horário continua presente, mas organiza um convite.', reading: 'A função apelativa domina: a mensagem convoca o leitor.' },
    ],
  },
  poetic: {
    id: 'poetic', name: 'O som e a rua que bebe', question: 'Que efeito nasce da forma, além da informação de que chove?', controlLabel: 'Recurso em foco',
    relation: 'repetição sonora + arranjo figurado → efeito', insight: 'O verso sugere um ambiente pela sonoridade e atribui uma ação humana à rua. A leitura liga cada recurso ao efeito produzido.',
    documents: [{ label: 'Poema original · depois da chuva', lines: ['A chuva sussurra na sarjeta.', 'A rua bebe a chuva.', 'Sob o silêncio, segue o som.'] }], states: [
      { label: 'repetição sonora', clue: 'sussurra, sarjeta, silêncio, segue, som', diagnosis: 'aliteração e continuidade sonora', action: 'relacionar a repetição de /s/ ao murmúrio sugerido', evidence: ['sussurra', 'sarjeta', 'silêncio', 'segue', 'som'], annotation: 'A volta do som /s/ prolonga o murmúrio. Não basta contar letras: a repetição participa da atmosfera do poema.', reading: 'O som /s/ recorrente sugere murmúrio e continuidade.' },
      { label: 'arranjo inesperado', clue: 'rua bebe', diagnosis: 'ação humana atribuída à rua', action: 'comparar o verso com a formulação literal de água escoando', evidence: ['rua bebe'], annotation: 'A rua não bebe literalmente. O verbo atribui ação de um ser vivo ao espaço, tornando expressiva a água que escoa.', reading: 'A personificação faz a rua parecer viva sob a chuva.' },
    ],
  },
  figures: {
    id: 'figures', name: 'Qualidade transferida, elogio invertido', question: 'Que pista impede a leitura ao pé da letra?', controlLabel: 'Operação figurada',
    relation: 'expressão + situação → sentido figurado', insight: 'A fila herda a lentidão do caracol. O elogio pode ser irônico porque a espera o contraria; sem esse contexto, a frase não bastaria.',
    documents: [
      { label: 'Imagem verbal · trecho original', lines: ['A fila era um caracol.', 'Quase não saía do lugar.'] },
      { label: 'Situação · trecho original', lines: ['Depois de duas horas na fila,', 'Lia disse: “Que rapidez!”'] },
    ], states: [
      { label: 'metáfora', clue: 'fila = caracol + quase não saía', diagnosis: 'aproximação por semelhança', action: 'nomear a lentidão transferida do caracol à fila', evidence: ['caracol', 'Quase não saía do lugar'], annotation: 'A fila não vira animal. A segunda frase orienta a semelhança: o avanço lento é a qualidade transferida.', reading: 'A metáfora atribui à fila a lentidão do caracol.' },
      { label: 'ironia', clue: 'duas horas × que rapidez', diagnosis: 'avaliação invertida pelo contexto', action: 'mostrar como a duração contraria o elogio aparente', evidence: ['duas horas', 'Que rapidez!'], annotation: 'A espera prolongada contraria “rapidez”. O elogio aparente passa a funcionar como crítica ao atendimento.', reading: '“Que rapidez!” produz crítica irônica à demora.' },
    ],
  },
  distortions: {
    id: 'distortions', name: 'A hipótese encontra seu limite', question: 'A alternativa preserva o alcance e a condição do relato?', controlLabel: 'Conferência da hipótese',
    relation: 'alcance + condição → interpretação autorizada', insight: '“Nesta turma” e “alguns” limitam o relato; “quando” traz a condição. A opinião prévia deve ser confrontada com essas marcas.',
    documents: [{ label: 'Relato didático original · sem dados reais', lines: ['Nesta turma, alguns alunos', 'leram melhor em silêncio', 'quando puderam escolher o lugar.'] }], states: [
      { label: 'projeção', clue: 'alguns não significa todos', diagnosis: 'generalização indevida', action: 'voltar aos limites de grupo e à condição mencionada', evidence: ['Nesta turma', 'alguns'], annotation: 'A alternativa amplia um relato local para todos os leitores e apaga a condição de escolha do lugar.', reading: 'A conclusão universal é uma generalização indevida.' },
      { label: 'hipótese testável', clue: 'nesta turma + alguns + quando', diagnosis: 'leitura com alcance preservado', action: 'conservar o grupo, a quantidade e a condição na resposta', evidence: ['Nesta turma', 'alguns', 'quando puderam escolher'], annotation: 'A interpretação mantém o recorte e a condição. O relato não compara todos os ambientes nem prova uma regra geral.', reading: 'A hipótese respeita o limite: alguns alunos, nessa condição.' },
    ],
  },
  comic: {
    id: 'comic', name: 'Economia em cem páginas', question: 'Que contradição a fala final revela?', controlLabel: 'Momento da tira',
    relation: 'promessa de economia → excesso → crítica', insight: 'A virada enfrenta a promessa com a prática oposta: o relatório de economia desperdiça o próprio recurso que pretende poupar.',
    documents: [
      { label: 'Quadro 1 · fala original', lines: ['Aqui economizamos papel.'] },
      { label: 'Quadro 2 · fala original', lines: ['O relatório tem cem páginas.'] },
      { label: 'Quadro 3 · resposta original', lines: ['Uma cópia impressa para cada um!'] },
    ], states: [
      { label: 'expectativa', clue: 'economizamos papel', diagnosis: 'promessa de uma prática sustentável', action: 'explicitar a expectativa de reduzir impressões', evidence: ['economizamos papel'], annotation: 'O começo promete economia. Essa promessa prepara a leitura: esperamos menos uso de papel.', reading: 'Esperamos que a equipe pratique economia de papel.' },
      { label: 'quebra', clue: 'cem páginas + uma cópia para cada um', diagnosis: 'incongruência entre fala e ação', action: 'explicar como a multiplicação de cópias contraria a promessa', evidence: ['cem páginas', 'cópia impressa para cada um'], annotation: 'O relatório extenso se multiplica em cópias. A prática contradiz a promessa; o alvo é o discurso sem mudança de hábito.', reading: 'A contradição expõe uma economia só no discurso.' },
    ],
  },
  tdic: {
    id: 'tdic', name: 'Da mensagem à circulação', question: 'O botão de compartilhar comprova o conteúdo?', controlLabel: 'Camada de análise',
    relation: 'recurso → prática de circulação → verificação', insight: 'Encaminhar multiplica o alcance, mas repetição não comprova veracidade. Fonte, data e contexto permitem conferir o conteúdo.',
    documents: [
      { label: 'Post fictício · sem fonte indicada', lines: ['Compartilhe agora!', 'A biblioteca vai fechar para sempre.', 'Recebi no grupo; não há data.'] },
      { label: 'Aviso fictício · fonte identificada', lines: ['Direção da biblioteca · 04/10', 'Fechamento apenas nesta segunda,', 'para manutenção do telhado.'] },
    ], states: [
      { label: 'ferramenta', clue: 'compartilhe agora', diagnosis: 'circulação rápida sem conferência', action: 'distinguir a facilidade do encaminhamento da confiabilidade', evidence: ['Compartilhe agora!', 'Recebi no grupo'], annotation: 'O botão facilita a circulação e o imperativo pede urgência. Receber no grupo não identifica quem apurou o fato.', reading: 'O recurso de encaminhar aumenta alcance, não comprova o post.' },
      { label: 'impacto situado', clue: 'sem data × direção e data', diagnosis: 'checagem de autoria e contexto', action: 'comparar o post com o aviso da direção antes de compartilhar', evidence: ['não há data', 'Direção da biblioteca', 'apenas nesta segunda'], annotation: 'No exemplo fictício, o aviso identificado limita o fechamento a um dia. O post transforma manutenção temporária em fim permanente.', reading: 'A fonte e o contexto corrigem o alarme de fechamento permanente.' },
    ],
  },
};

export function readingState(id: ReadingInstrumentId, index: number): ReadingState {
  const states = READING_INSTRUMENTS[id].states;
  const validIndex = Number.isFinite(index) ? index : 0;
  return states[Math.max(0, Math.min(states.length - 1, Math.round(validIndex)))];
}
