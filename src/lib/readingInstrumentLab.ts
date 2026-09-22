export type ReadingInstrumentId = 'levels' | 'intertext' | 'genres' | 'narrative' | 'nonverbal' | 'functions' | 'poetic' | 'figures' | 'distortions' | 'comic' | 'tdic';

export interface ReadingState { label: string; clue: string; diagnosis: string; action: string; }
export interface ReadingInstrumentConfig { id: ReadingInstrumentId; name: string; question: string; controlLabel: string; relation: string; insight: string; states: ReadingState[]; }

function reading(id: ReadingInstrumentId, name: string, question: string, controlLabel: string, relation: string, insight: string, states: ReadingState[]): ReadingInstrumentConfig {
  return { id, name, question, controlLabel, relation, insight, states };
}

export const READING_INSTRUMENTS: Record<ReadingInstrumentId, ReadingInstrumentConfig> = {
  levels: reading('levels', 'Do dito ao inferido', 'A resposta está escrita no texto ou precisa ser construída a partir de pistas?', 'Nível de leitura', 'pista textual → relação → inferência', 'Inferir não é inventar: a hipótese precisa permanecer apoiada nas marcas do texto.', [
    { label: 'explícito', clue: 'uma informação declarada no enunciado', diagnosis: 'localização literal', action: 'retomar a formulação e conferir quem, o quê e quando' },
    { label: 'inferencial', clue: 'duas ou mais pistas apontam para uma conclusão', diagnosis: 'sentido construído', action: 'explicar quais marcas sustentam a inferência' },
  ]),
  intertext: reading('intertext', 'Rastro entre textos', 'O novo texto repete, transforma ou contesta a referência anterior?', 'Tipo de diálogo', 'referência → transformação → efeito de sentido', 'Intertextualidade é relação de sentido; reconhecer a fonte é só o primeiro passo.', [
    { label: 'citação', clue: 'a fonte ou formulação é reconhecível', diagnosis: 'diálogo declarado', action: 'perguntar o que a presença da referência acrescenta' },
    { label: 'paródia', clue: 'uma forma conhecida é deslocada com humor ou crítica', diagnosis: 'diálogo transformador', action: 'comparar o efeito novo com a expectativa criada pela referência' },
  ]),
  genres: reading('genres', 'Gênero como pista de leitura', 'Quem fala, para quem e com que finalidade?', 'Pista do gênero', 'suporte + interlocutor + finalidade = leitura situada', 'Gênero não é etiqueta: ele organiza expectativas sobre forma, voz e objetivo.', [
    { label: 'notícia', clue: 'informar um acontecimento para leitores públicos', diagnosis: 'foco em fato, fonte e contexto', action: 'separar informação, fonte e eventual comentário' },
    { label: 'artigo de opinião', clue: 'uma voz pública defende uma posição', diagnosis: 'foco em tese e razões', action: 'mapear o ponto de vista e as evidências escolhidas' },
  ]),
  narrative: reading('narrative', 'Percurso narrativo', 'Como narrador, tempo e conflito orientam a interpretação?', 'Foco narrativo', 'voz + situação + conflito = perspectiva', 'Ler narrativa exige observar quem conta e o que essa posição permite ou esconde.', [
    { label: 'narrador-personagem', clue: 'a experiência é contada por quem a vive', diagnosis: 'acesso parcial e situado', action: 'distinguir experiência do personagem de verdade geral' },
    { label: 'narrador-observador', clue: 'a narração descreve sem ocupar o centro da ação', diagnosis: 'foco deslocado', action: 'notar o que a seleção de cenas valoriza' },
  ]),
  nonverbal: reading('nonverbal', 'Imagem também argumenta', 'Que escolha visual organiza o sentido antes das palavras?', 'Pista visual', 'enquadramento + contraste + posição = sentido', 'Em textos não verbais, cor, escala, corte e posição funcionam como escolhas de linguagem.', [
    { label: 'destaque', clue: 'cor, tamanho ou centro atraem o olhar', diagnosis: 'hierarquia visual', action: 'perguntar por que esse elemento recebe prioridade' },
    { label: 'ausência', clue: 'o corte deixa alguém ou algo fora de cena', diagnosis: 'seleção significativa', action: 'considerar o efeito do que não foi mostrado' },
  ]),
  functions: reading('functions', 'Função dominante', 'Qual intenção organiza a mensagem neste contexto?', 'Função em foco', 'intenção + escolha linguística + contexto', 'As funções podem coexistir; a leitura busca a que organiza o efeito principal.', [
    { label: 'referencial', clue: 'informação e contexto ocupam o centro', diagnosis: 'ênfase no referente', action: 'verificar como dados e explicações são apresentados' },
    { label: 'apelativa', clue: 'o destinatário é convocado a agir', diagnosis: 'ênfase no interlocutor', action: 'identificar imperativos, vocativos e efeito de persuasão' },
  ]),
  poetic: reading('poetic', 'A forma produz sentido', 'O modo de dizer importa tanto quanto o que é dito?', 'Recurso formal', 'som + ritmo + arranjo = efeito', 'Na função poética, a linguagem chama atenção para sua própria construção.', [
    { label: 'repetição sonora', clue: 'sons e ritmos reaparecem de modo marcado', diagnosis: 'efeito de musicalidade ou insistência', action: 'ligar a repetição ao clima ou à ideia construída' },
    { label: 'arranjo inesperado', clue: 'palavras são combinadas fora do uso previsível', diagnosis: 'efeito de estranhamento', action: 'comparar a forma incomum com o sentido sugerido' },
  ]),
  figures: reading('figures', 'Figura não é enfeite', 'Que deslocamento de sentido a expressão produz?', 'Operação figurada', 'forma literal → deslocamento → efeito', 'A figura de linguagem pede leitura do efeito: metáfora, ironia ou hipérbole não devem ser tomadas ao pé da letra.', [
    { label: 'metáfora', clue: 'uma qualidade passa de um campo a outro', diagnosis: 'aproximação por semelhança', action: 'nomear a característica transferida' },
    { label: 'ironia', clue: 'o contexto contraria a aparência elogiosa ou neutra', diagnosis: 'sentido indireto', action: 'usar o contraste entre dito e situação para interpretar' },
  ]),
  distortions: reading('distortions', 'Hipótese ou projeção?', 'A interpretação vem das pistas do texto ou de uma expectativa do leitor?', 'Teste de leitura', 'pista → hipótese → conferência', 'Boa interpretação pode ser revisada: ela mostra de onde veio e aceita ser testada no texto.', [
    { label: 'projeção', clue: 'a resposta depende só de opinião prévia', diagnosis: 'distorção interpretativa', action: 'voltar ao trecho e localizar a evidência ausente' },
    { label: 'hipótese testável', clue: 'a conclusão explica marcas concretas do texto', diagnosis: 'leitura fundamentada', action: 'procurar uma pista que confirme ou limite a hipótese' },
  ]),
  comic: reading('comic', 'Mecanismo do cômico', 'Onde a expectativa é quebrada para produzir humor ou crítica?', 'Virada', 'expectativa → quebra → efeito crítico', 'O humor pode revelar uma contradição social; a graça não encerra a leitura.', [
    { label: 'expectativa', clue: 'o começo ativa uma interpretação previsível', diagnosis: 'preparo da leitura', action: 'identificar qual regra ou hábito parece estar em jogo' },
    { label: 'quebra', clue: 'o desfecho desloca o sentido esperado', diagnosis: 'efeito cômico ou satírico', action: 'explicar que contradição a virada expõe' },
  ]),
  tdic: reading('tdic', 'Tecnologia, circulação e impacto', 'A leitura distingue ferramenta, uso social e consequência?', 'Camada de análise', 'tecnologia → prática → impacto social', 'Nem toda consequência vem da ferramenta em si: usos, acesso e interesses moldam seus efeitos.', [
    { label: 'ferramenta', clue: 'a análise para no recurso técnico', diagnosis: 'descrição insuficiente', action: 'perguntar quem usa, em que condição e com que finalidade' },
    { label: 'impacto situado', clue: 'a prática é ligada a acesso, trabalho, informação ou poder', diagnosis: 'análise social da tecnologia', action: 'mostrar mecanismo e grupo afetado' },
  ]),
};

export function readingState(id: ReadingInstrumentId, index: number) {
  const states = READING_INSTRUMENTS[id].states;
  return states[Math.max(0, Math.min(states.length - 1, Math.round(index)))];
}
