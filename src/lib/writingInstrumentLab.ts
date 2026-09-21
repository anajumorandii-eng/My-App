export type WritingInstrumentId = 'essay-myths' | 'evaluation' | 'idea-map' | 'repertoire' | 'theme-axes';

export interface WritingInstrumentState {
  label: string;
  example: string;
  diagnosis: string;
  action: string;
}

export interface WritingInstrumentConfig {
  id: WritingInstrumentId;
  name: string;
  question: string;
  controlLabel: string;
  controlDescription: string;
  relation: string;
  insight: string;
  states: WritingInstrumentState[];
}

export const WRITING_INSTRUMENTS: Record<WritingInstrumentId, WritingInstrumentConfig> = {
  'essay-myths': {
    id: 'essay-myths', name: 'Mitos sob o crivo da banca', question: 'A regra é universal ou depende do edital e da proposta?',
    controlLabel: 'Afirmação', controlDescription: 'teste fórmulas comuns contra o pedido real da banca', relation: 'afirmação + edital + proposta = decisão segura',
    insight: 'Não existe fórmula universal de vestibular: gênero, interlocutor, critérios e exigências mudam, e o edital é a fonte que decide.',
    states: [
      { label: '“há fórmula universal”', example: 'Todo parágrafo deve ter o mesmo número de linhas.', diagnosis: 'mito: não existe número mágico válido para toda proposta', action: 'consultar edital, gênero pedido e espaço disponível' },
      { label: '“citação garante nota”', example: 'Basta citar um autor conhecido para valorizar o texto.', diagnosis: 'mito: referência sem vínculo é decoração', action: 'explicar como a ideia citada sustenta o argumento' },
      { label: '“as bancas pedem igual”', example: 'ENEM, Fuvest e Unicamp aceitam o mesmo modelo.', diagnosis: 'mito: cada banca define gênero e critérios próprios', action: 'comparar intervenção no ENEM, coletânea na Fuvest e gênero/interlocutor na Unicamp' },
    ],
  },
  evaluation: {
    id: 'evaluation', name: 'Painel das cinco competências', question: 'Qual dimensão do texto cada competência do ENEM mede?',
    controlLabel: 'Competência', controlDescription: 'percorra C1 a C5 e seus critérios de 0 a 200', relation: 'C1 + C2 + C3 + C4 + C5 = até 1000 pontos',
    insight: 'A nota resulta do equilíbrio entre as cinco competências: cada uma vale até 200 pontos e nenhuma é substituída pelo brilho isolado de outra.',
    states: [
      { label: 'C1 · norma-padrão', example: 'Construções e convenções da escrita formal.', diagnosis: 'mede domínio da modalidade escrita formal', action: 'revisar desvios recorrentes sem apagar a clareza' },
      { label: 'C2 · proposta e repertório', example: 'Tema compreendido no gênero dissertativo-argumentativo.', diagnosis: 'mede compreensão da proposta e aplicação produtiva de repertório', action: 'ligar conhecimento de outras áreas ao argumento' },
      { label: 'C3 · argumentação', example: 'Informações selecionadas e organizadas em defesa da tese.', diagnosis: 'mede o projeto e a consistência dos argumentos', action: 'articular evidência, análise e ponto de vista' },
      { label: 'C4 · coesão', example: 'Relações entre frases e parágrafos ficam explícitas.', diagnosis: 'mede mecanismos linguísticos de encadeamento', action: 'variar conectivos conforme a relação lógica' },
      { label: 'C5 · intervenção', example: 'Agente, ação, meio, finalidade e detalhamento.', diagnosis: 'mede proposta de intervenção completa e ligada ao problema', action: 'detalhar ao menos um elemento e respeitar direitos humanos' },
    ],
  },
  'idea-map': {
    id: 'idea-map', name: 'Mapa de ideias com hierarquia', question: 'Como sair do brainstorm sem transformar o texto numa lista?',
    controlLabel: 'Etapa', controlDescription: 'organize associação, seleção e encadeamento', relation: 'gerar → selecionar → ordenar',
    insight: 'Brainstorm abre possibilidades; o mapa só ajuda quando hierarquiza ideias pelo vínculo com a tese e pela função de cada parágrafo.',
    states: [
      { label: 'gerar', example: 'acesso · custo · formação · infraestrutura', diagnosis: 'ideias numerosas ainda sem prioridade', action: 'registrar associações sem censura inicial' },
      { label: 'selecionar', example: 'barreira: infraestrutura · resposta: formação', diagnosis: 'ideias filtradas pela pergunta central', action: 'eliminar o que não ajuda a defender a tese' },
      { label: 'ordenar', example: 'problema → causa → consequência → resposta', diagnosis: 'trajeto argumentativo pronto para virar parágrafos', action: 'atribuir uma função a cada bloco do texto' },
    ],
  },
  repertoire: {
    id: 'repertoire', name: 'Repertório em funcionamento', question: 'A referência enfeita o texto ou produz uma razão?',
    controlLabel: 'Integração', controlDescription: 'avance da menção isolada à análise', relation: 'referência + vínculo + análise = evidência',
    insight: 'Repertório produtivo não é uma coleção de nomes: é uma referência pertinente cujo vínculo com a tese fica demonstrado no texto.',
    states: [
      { label: 'nome solto', example: 'Como dizia Paulo Freire...', diagnosis: 'citação decorativa sem função argumentativa', action: 'identificar a ideia concreta que será mobilizada' },
      { label: 'referência pertinente', example: 'A educação exige participação ativa do estudante.', diagnosis: 'a ideia combina com o tema, mas o vínculo está implícito', action: 'relacionar a referência ao problema discutido' },
      { label: 'repertório produtivo', example: 'A participação ativa defendida por Freire mostra por que acesso técnico sem autonomia não democratiza a aprendizagem.', diagnosis: 'referência transformada em evidência analisada', action: 'explicar como a referência sustenta a tese' },
    ],
  },
  'theme-axes': {
    id: 'theme-axes', name: 'Do eixo amplo ao problema', question: 'Como antecipar repertório sem tentar adivinhar o tema?',
    controlLabel: 'Escala', controlDescription: 'aproxime o eixo até formular uma tensão discutível', relation: 'eixo → recorte → problema',
    insight: 'Eixos temáticos servem para organizar repertório transferível; a proposta real exige um recorte e uma tensão, não uma redação decorada.',
    states: [
      { label: 'eixo', example: 'Educação', diagnosis: 'campo amplo demais para orientar uma tese', action: 'listar agentes, processos e conflitos recorrentes' },
      { label: 'recorte', example: 'Tecnologia na educação pública', diagnosis: 'objeto delimitado, ainda sem questão central', action: 'localizar uma tensão verificável no recorte' },
      { label: 'problema', example: 'Digitalização amplia acesso ou reproduz desigualdades?', diagnosis: 'tensão que admite posições e argumentos', action: 'formular tese e critérios para selecionar repertório' },
    ],
  },
};

export function writingInstrumentState(id: WritingInstrumentId, index: number) {
  const states = WRITING_INSTRUMENTS[id].states;
  return states[Math.max(0, Math.min(states.length - 1, Math.round(index)))];
}
