import React, { useState } from 'react';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import { Arrow, Box, Drawing, Line, OperationWorkshop, type Foundation } from './LiteratureFoundations';

/** A auditoria apontou que os dezesseis capítulos de repertório e análise de
 *  tema reutilizavam a mesma cena LENTE→TESE, trocando só o ícone do domínio.
 *  Aqui o desenho sai de dados do próprio capítulo — o caso autoral, a lei e
 *  sua prática, as palavras que restringem o tema, os cinco elementos da
 *  intervenção —, e cada estado cita literalmente o resumo. */
type Scene =
  | { kind: 'pick'; case: string; options: [string, string][] }
  | { kind: 'gap'; law: string; practice: string }
  | { kind: 'steps'; steps: string[] }
  | { kind: 'restrict'; words: string[]; off: string }
  | { kind: 'args'; args: [string, string] }
  | { kind: 'elements'; values: [string, string, string, string, string] };
type WritingConfig = Foundation & { scenes: [Scene, Scene, Scene] };

export const WRITING_OPERATIONS = {
  'rep-environment': {
    topic: 'Incrementando o Repertório: Meio Ambiente', question: 'Que conceito explica o mecanismo do recorte?', relation: 'conceito pelo mecanismo + marco com tensão + adaptação ao recorte',
    states: [
      { label: 'Conceito', section: 'Conceitos-chave', anchor: 'a fábrica despeja efluente no rio e a cidade de baixo paga o tratamento da água', observation: 'O mesmo rio pode ser lido por três conceitos; cada um explica outra coisa.', conclusion: 'Escolha o conceito pelo mecanismo, não pelo prestígio.' },
      { label: 'Marco', section: 'Marcos e dados', anchor: 'citar Brumadinho apenas como tragédia', observation: 'A tragédia citada decora; a escolha da barragem argumenta.', conclusion: 'Marco só vale quando vira argumento.' },
      { label: 'Adaptação', section: 'Recortes prováveis', anchor: 'o tema pede os desafios da transição energética no Brasil', observation: 'A mesma dupla é reescrita para o novo recorte.', conclusion: 'Repertório preparado é ponto de partida, não texto pronto.' },
    ],
    scenes: [
      { kind: 'pick', case: 'efluente no rio', options: [['Externalidade', 'a cidade de baixo paga'], ['Bens comuns', 'o rio de todos se esgota'], ['Justiça ambiental', 'o dano cai nos mais pobres']] },
      { kind: 'gap', law: 'Brumadinho: tragédia', practice: 'barragem a montante' },
      { kind: 'steps', steps: ['mesma dupla', 'emissão fóssil', 'eólicas sem consulta'] },
    ],
  },
  'theme-environment': {
    topic: 'Analisando Tema de Redação: Meio Ambiente', question: 'O texto responde ao recorte, e a intervenção ataca as causas?', relation: 'recorte → dois argumentos → intervenção coerente',
    states: [
      { label: 'Recorte', section: 'Lendo a proposta', anchor: 'o estudante escreveu sobre aquecimento global num tema sobre lixo eletrônico', observation: 'Palavras restritivas excluem o assunto vizinho.', conclusion: 'Bem escrito e fora do recorte ainda tangencia.' },
      { label: 'Argumentos', section: 'Montando os argumentos', anchor: 'dois parágrafos sobre conscientização do consumidor', observation: 'Causa estrutural e consequência desigual, não a mesma ideia duas vezes.', conclusion: 'Dois argumentos, duas dimensões.' },
      { label: 'Intervenção', section: 'Intervenção', anchor: '“a população deve se conscientizar” não tem agente, meio nem finalidade', observation: 'Cinco elementos, cada um ligado à causa argumentada.', conclusion: 'Retire um elemento e veja a proposta empobrecer.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['descarte', 'eletrônicos'], off: 'aquecimento global' },
      { kind: 'args', args: ['causa: obsolescência', 'efeito: catadores'] },
      { kind: 'elements', values: ['Ministério do Meio Ambiente', 'ampliar a coleta', 'pontos em lojas', 'reduzir contaminação', 'metas anuais'] },
    ],
  },
  'rep-work': {
    topic: 'Incrementando o Repertório: Educação e Trabalho', question: 'Que conceito explica a desigualdade do caso?', relation: 'conceito explicado + marco com tensão + recorte ajustado',
    states: [
      { label: 'Conceito', section: 'Conceitos-chave', anchor: 'dois alunos tiram notas diferentes na mesma redação', observation: 'A diferença parece mérito e tem origem social.', conclusion: 'Explique o conceito; o nome sozinho não argumenta.' },
      { label: 'Marco', section: 'Dados e marcos', anchor: 'a lei garante a vaga, mas o jovem precisa trabalhar à tarde para ajudar em casa', observation: 'O direito existe; a permanência falha.', conclusion: 'Acesso formal não é permanência.' },
      { label: 'Adaptação', section: 'Recortes prováveis', anchor: 'o impacto da automação sobre o emprego juvenil', observation: 'Requalificação e informalidade entram no lugar de Freire.', conclusion: 'O mecanismo é reescrito para cada proposta.' },
    ],
    scenes: [
      { kind: 'pick', case: 'mesma redação, notas diferentes', options: [['Capital cultural', 'debate em casa vira nota'], ['Educação bancária', 'conteúdo sem diálogo'], ['Meritocracia', 'nota lida como esforço']] },
      { kind: 'gap', law: 'vaga garantida', practice: 'trabalho à tarde' },
      { kind: 'steps', steps: ['vagas encolhem', 'sem requalificação', 'informalidade'] },
    ],
  },
  'theme-work': {
    topic: 'Analisando Tema de Redação: Educação e Trabalho', question: 'Por que o jovem sai, e o que o faria ficar?', relation: 'recorte → renda e instituição → ações por causa',
    states: [
      { label: 'Recorte', section: 'Delimitando o problema', anchor: 'Caminhos para combater a evasão no ensino médio brasileiro', observation: '“Ensino médio” e “brasileiro” fecham o foco.', conclusion: 'A tese responde à pergunta do tema.' },
      { label: 'Argumentos', section: 'Estrutura de argumentos', anchor: 'o jovem começa como ajudante de pedreiro para completar a renda', observation: 'A família precisa da renda; a escola não retém.', conclusion: 'Agentes diferentes preparam duas frentes.' },
      { label: 'Intervenção', section: 'Intervenção', anchor: 'a fim de evitar o abandono antes que ele se consolide', observation: 'Cinco faltas disparam a visita: a ação fica verificável.', conclusion: 'Retire um elemento e veja a proposta empobrecer.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['ensino médio', 'brasileiro'], off: 'evasão universitária' },
      { kind: 'args', args: ['renda: trabalho cedo', 'escola: currículo distante'] },
      { kind: 'elements', values: ['secretarias estaduais', 'busca ativa', 'visitas às famílias', 'evitar o abandono', 'após cinco faltas'] },
    ],
  },
  'rep-abstract': {
    topic: 'Incrementando o Repertório: Temas Abstratos', question: 'Que sentido do conceito a tese escolhe?', relation: 'sentido escolhido → autor com função → âncora concreta',
    states: [
      { label: 'Sentido', section: 'O que são temas abstratos', anchor: 'o tema pede os limites da liberdade na era digital', observation: 'Cada definição leva a outra tese.', conclusion: 'A definição decide o percurso do texto.' },
      { label: 'Autor', section: 'Repertório filosófico e literário', anchor: 'o tema pede a relação entre trabalho e felicidade', observation: 'Han explica por que quem se diz livre adoece.', conclusion: 'Um autor por função, explicado em duas frases.' },
      { label: 'Ancorar', section: 'Como concretizar', anchor: 'a estudante que estuda doze horas e se sente preguiçosa no domingo', observation: 'Afirmação, âncora, retorno ao conceito.', conclusion: 'Parágrafo que termina no exemplo perdeu o terceiro tempo.' },
    ],
    scenes: [
      { kind: 'pick', case: 'liberdade na era digital', options: [['Sem impedimento', 'moderação vira censura'], ['Condição de escolha', 'algoritmo reduz a escolha'], ['Autonomia', 'dar a si a própria lei']] },
      { kind: 'gap', law: 'ninguém obriga', practice: 'ele mesmo se cobra' },
      { kind: 'steps', steps: ['afirmação', 'âncora: domingo', 'autoexploração'] },
    ],
  },
  'theme-abstract': {
    topic: 'Analisando Tema Abstrato de Redação', question: 'O texto executa o verbo do enunciado?', relation: 'verbo → progressão conceito, manifestação, tensão → fecho conforme o comando',
    states: [
      { label: 'Verbo', section: 'Lendo a proposta', anchor: 'o estudante elogiou o erro do começo ao fim', observation: 'O conceito estava certo; a operação pedida era outra.', conclusion: 'O verbo diz o que fazer com o conceito.' },
      { label: 'Progressão', section: 'Estruturando', anchor: 'os limites da liberdade de expressão', observation: 'Manifestação social, depois limite com repertório.', conclusion: 'O segundo parágrafo traz a tensão.' },
      { label: 'Fecho', section: 'Conclusão', anchor: 'a conclusão propôs uma campanha de conscientização num tema que não pedia intervenção', observation: 'O comando decide entre síntese e intervenção.', conclusion: 'Leia o comando antes de escolher o fecho.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['analise os limites'], off: 'elogio ao erro' },
      { kind: 'args', args: ['manifestação: redes', 'limite: dano a outro'] },
      { kind: 'steps', steps: ['pede intervenção?', 'não: sintetizar', 'sim: alvo concreto'] },
    ],
  },
  'rep-body': {
    topic: 'Incrementando o Repertório: Corpo, Saúde e Sexualidade', question: 'Que conceito explica o desfecho diferente?', relation: 'determinantes sociais + direito × acesso + recorte sensível',
    states: [
      { label: 'Conceito', section: 'Conceitos-chave', anchor: 'duas crianças com a mesma asma', observation: 'A doença é igual; a casa muda o desfecho.', conclusion: 'Adoecer não é só biologia nem escolha.' },
      { label: 'Marco', section: 'Dados e marcos', anchor: 'o SUS garante atendimento universal, mas o Caps mais próximo fica a duas horas de ônibus', observation: 'O direito está escrito; a distância barra o acesso.', conclusion: 'Direito garantido não é acesso efetivo.' },
      { label: 'Adaptação', section: 'Recortes prováveis', anchor: 'o tema pede a invisibilidade da endometriose', observation: 'Silenciamento da dor e diagnóstico tardio.', conclusion: 'Repertório ajustado, linguagem respeitosa.' },
    ],
    scenes: [
      { kind: 'pick', case: 'mesma asma, casas diferentes', options: [['Determinantes sociais', 'cômodo úmido piora'], ['Biopoder', 'Estado gere a população']] },
      { kind: 'gap', law: 'SUS universal', practice: 'Caps a duas horas' },
      { kind: 'steps', steps: ['dor silenciada', 'diagnóstico tardio', 'recorte atendido'] },
    ],
  },
  'theme-body': {
    topic: 'Analisando Tema de Redação: Corpo, Saúde e Sexualidade', question: 'O texto trata de estruturas, com respeito, e amplia direitos?', relation: 'recorte sensível → cultura e instituição → ação que amplia direitos',
    states: [
      { label: 'Recorte', section: 'Delimitação sensível', anchor: 'a redação sobre saúde mental chamou a ansiedade de frescura de geração mimada', observation: 'Julgamento moral no lugar do problema social.', conclusion: 'Escolha o problema certo e fale dele com respeito.' },
      { label: 'Argumentos', section: 'Argumentos possíveis', anchor: 'a escola tem um orientador para mil e duzentos alunos e nenhum psicólogo', observation: 'Autocobrança explica a origem; a escola sem psicólogo, a demora.', conclusion: 'Origem e falta de tratamento, duas frentes.' },
      { label: 'Intervenção', section: 'Intervenção', anchor: 'por meio da Lei 13.935/2019', observation: 'A lei existe; falta a contratação.', conclusion: 'Retire um elemento e veja a proposta empobrecer.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['saúde mental', 'jovens'], off: '“frescura”' },
      { kind: 'args', args: ['cultura: autocobrança', 'escola: sem psicólogo'] },
      { kind: 'elements', values: ['Ministério da Saúde', 'ampliar psicólogos', 'Lei 13.935/2019', 'identificar cedo', 'proporção por aluno'] },
    ],
  },
  'rep-violence': {
    topic: 'Incrementando o Repertório: Violência, Leis e Punição', question: 'A lei é diferente, ou a aplicação é desigual?', relation: 'conceito pelo mecanismo + lei × prática + recorte certo',
    states: [
      { label: 'Conceito', section: 'Conceitos-chave', anchor: 'dois jovens são flagrados com a mesma quantidade de maconha', observation: 'Mesma lei, tratamento diferente por bairro, cor e renda.', conclusion: 'O conceito escolhido define o argumento.' },
      { label: 'Marco', section: 'Dados e marcos', anchor: 'a cela abriga o triplo da capacidade', observation: 'A lei aposta na ressocialização; a prática produz o contrário.', conclusion: 'A falha está na distância entre lei e condição.' },
      { label: 'Adaptação', section: 'Recortes prováveis', anchor: 'o estudante usou encarceramento em massa num tema sobre cyberbullying', observation: 'Conceito sério, mecanismo de outro problema.', conclusion: 'Repertório certo no recorte errado tangencia.' },
    ],
    scenes: [
      { kind: 'pick', case: 'mesma quantidade, dois destinos', options: [['Seletividade penal', 'aplicação desigual'], ['Violência estrutural', 'dano sem agressor visível'], ['Retribuição', 'punir pelo que fez']] },
      { kind: 'gap', law: 'LEP: estudo e trabalho', practice: 'cela com o triplo' },
      { kind: 'steps', steps: ['encarceramento', 'cyberbullying', 'tangencia'] },
    ],
  },
  'theme-violence': {
    topic: 'Analisando Tema de Redação: Violência, Leis e Punição', question: 'Por que a violência persiste, apesar da lei?', relation: 'enfrentamento → cultura e rede → ações sobre cada obstáculo',
    states: [
      { label: 'Recorte', section: 'Delimitação', anchor: 'o texto descreveu tipos de violência por três parágrafos', observation: '“Enfrentamento” pedia obstáculos às respostas.', conclusion: 'Descrever não é responder ao recorte.' },
      { label: 'Argumentos', section: 'Argumentos possíveis', anchor: 'em briga de marido e mulher não se mete a colher', observation: 'A cultura protege o agressor; a rede não alcança a vítima.', conclusion: 'Lei necessária, insuficiente sozinha.' },
      { label: 'Intervenção', section: 'Intervenção', anchor: 'garantir funcionamento 24 horas das delegacias da mulher', observation: 'Horário e porte da cidade tornam a ação verificável.', conclusion: 'Retire um elemento e veja a proposta empobrecer.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['enfrentamento'], off: 'descrever os tipos' },
      { kind: 'args', args: ['cultura: naturalização', 'rede: delegacia fechada'] },
      { kind: 'elements', values: ['secretarias de segurança', 'delegacia 24 horas', 'remanejar efetivo', 'atender na hora', 'cidades acima de 100 mil'] },
    ],
  },
  'rep-citizenship': {
    topic: 'Incrementando o Repertório: Cidadania e Poder', question: 'O direito existe no papel, ou também na prática?', relation: 'igualdade formal × material + canal concreto + recorte ajustado',
    states: [
      { label: 'Conceito', section: 'Conceitos-chave', anchor: 'a lei garante o voto, mas a seção eleitoral fica a três horas da aldeia', observation: 'O direito é igual; a condição de exercê-lo não.', conclusion: 'Cada conceito explica outra falha.' },
      { label: 'Canal', section: 'Marcos institucionais', anchor: 'recebe a resposta em vinte dias', observation: 'A Lei de Acesso à Informação vira fiscalização cidadã.', conclusion: 'Canal concreto torna a participação verificável.' },
      { label: 'Adaptação', section: 'Recortes prováveis', anchor: 'a lei exige ao menos 30% de candidatas por partido', observation: 'Regra de candidatura não garante resultado.', conclusion: 'Formal × material explica a sub-representação.' },
    ],
    scenes: [
      { kind: 'pick', case: 'voto a três horas da aldeia', options: [['Igualdade formal', 'direito escrito'], ['Igualdade material', 'condição de exercer'], ['Cidadania regulada', 'direito preso à carteira']] },
      { kind: 'gap', law: 'pedido pela LAI', practice: 'contratos em 20 dias' },
      { kind: 'steps', steps: ['30% de candidatas', 'menos recursos', 'poucas eleitas'] },
    ],
  },
  'theme-citizenship': {
    topic: 'Analisando Tema de Redação: Cidadania e Poder', question: 'Por que o jovem participa pouco?', relation: 'recorte → formação e canal → ações que removem barreiras',
    states: [
      { label: 'Recorte', section: 'Delimitação', anchor: 'a redação passou dois parágrafos criticando a corrupção dos políticos', observation: 'Assunto vizinho, sem explicar a pouca participação.', conclusion: 'Cada parágrafo responde à pergunta do tema.' },
      { label: 'Argumentos', section: 'Argumentos possíveis', anchor: 'a estudante de dezesseis anos tirou o título, mas não sabe o que faz um vereador', observation: 'Falta formação; o canal exclui quem trabalha.', conclusion: 'O cidadão e a instituição, duas frentes.' },
      { label: 'Intervenção', section: 'Intervenção', anchor: 'simulações de sessões legislativas', observation: 'Nenhuma ação depende de os jovens “se interessarem mais”.', conclusion: 'Retire um elemento e veja a proposta empobrecer.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['jovens', 'desafios'], off: 'corrupção em geral' },
      { kind: 'args', args: ['formação: o que faz?', 'canal: audiência às 14h'] },
      { kind: 'elements', values: ['MEC e TREs', 'oficinas no ensino médio', 'simulações legislativas', 'aproximar os jovens', 'visitas às câmaras'] },
    ],
  },
  'rep-culture': {
    topic: 'Incrementando o Repertório: Arte, Cultura e Relações Sociais', question: 'Quem lucra, e quem segue desvalorizado?', relation: 'conceito pela relação de poder + marco com tensão + recorte certo',
    states: [
      { label: 'Conceito', section: 'Conceitos-chave', anchor: 'a grife vende como tendência o turbante', observation: 'O objeto é o mesmo; a relação de poder define o conceito.', conclusion: 'Apropriação não é qualquer uso.' },
      { label: 'Marco', section: 'Marcos e políticas', anchor: 'o samba de roda é registrado como patrimônio imaterial, mas os mestres envelhecem sem aprendizes', observation: 'Reconhecimento sem transmissão.', conclusion: 'Use o marco com sua contradição.' },
      { label: 'Adaptação', section: 'Recortes prováveis', anchor: 'o estudante usou a Lei Rouanet num tema sobre o apagamento da memória indígena', observation: 'O marco não explica o mecanismo do apagamento.', conclusion: 'Marco certo no recorte errado tangencia.' },
    ],
    scenes: [
      { kind: 'pick', case: 'turbante na vitrine e na rua', options: [['Apropriação', 'o poder decide quem lucra'], ['Intercâmbio', 'troca sem assimetria'], ['Indústria cultural', 'fórmula vendida em série']] },
      { kind: 'gap', law: 'registro do Iphan', practice: 'mestres sem aprendizes' },
      { kind: 'steps', steps: ['Lei Rouanet', 'memória indígena', 'não explica'] },
    ],
  },
  'theme-culture': {
    topic: 'Analisando o Tema de Redação: Arte, Cultura e Relações Sociais', question: 'O que impede o acesso?', relation: 'democratizar → barreira material e simbólica → ação para cada uma',
    states: [
      { label: 'Recorte', section: 'Delimitação', anchor: 'a redação dedicou dois parágrafos à beleza da arte', observation: 'Concorda com o tema sem explicar a desigualdade.', conclusion: 'Elogiar a arte não é analisar o acesso.' },
      { label: 'Argumentos', section: 'Argumentos possíveis', anchor: 'não sabe se pode aplaudir entre os movimentos', observation: 'Distância de um lado; códigos desconhecidos do outro.', conclusion: 'Material e simbólica pedem soluções diferentes.' },
      { label: 'Intervenção', section: 'Intervenção', anchor: 'exposições itinerantes em escolas e centros comunitários', observation: 'Levar a obra e formar o público.', conclusion: 'Retire um elemento e veja a proposta empobrecer.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['democratizar', 'caminhos'], off: 'beleza da arte' },
      { kind: 'args', args: ['material: duas conduções', 'simbólico: aplaudir?'] },
      { kind: 'elements', values: ['secretarias de cultura', 'levar a programação', 'exposições itinerantes', 'reduzir a distância', 'visita por semestre'] },
    ],
  },
  'rep-media': {
    topic: 'Incrementando o Repertório: Mídia e Sociedade', question: 'Que mecanismo explica o que circula?', relation: 'conceito pelo mecanismo + marco com tensão + recorte certo',
    states: [
      { label: 'Conceito', section: 'Conceitos-chave', anchor: 'o vídeo indignado tem dez vezes mais visualizações que a correção', observation: 'Três conceitos, três explicações para a mesma diferença.', conclusion: 'Escolha o que descreve o mecanismo cobrado.' },
      { label: 'Marco', section: 'Marcos e dados', anchor: 'o aplicativo gratuito de lanterna pede acesso à agenda de contatos', observation: 'A LGPD exige finalidade; o pedido revela o produto.', conclusion: 'O dado do usuário é o pagamento.' },
      { label: 'Adaptação', section: 'Recortes prováveis', anchor: 'o estudante usou agenda-setting num tema sobre vazamento de dados pessoais', observation: 'Destaque de pautas não explica exploração de dados.', conclusion: 'Conceito pelo mecanismo do recorte.' },
    ],
    scenes: [
      { kind: 'pick', case: 'vídeo indignado × correção', options: [['Economia da atenção', 'indignação rende tempo'], ['Câmara de eco', 'circula entre quem concorda'], ['Agenda-setting', 'define sobre o que pensar']] },
      { kind: 'gap', law: 'LGPD: finalidade', practice: 'lanterna quer contatos' },
      { kind: 'steps', steps: ['agenda-setting', 'vazamento de dados', 'mecanismo errado'] },
    ],
  },
  'theme-media': {
    topic: 'Analisando Tema de Redação: Mídia e Sociedade', question: 'Que danos a desinformação causa, e como combater sem censura?', relation: 'impactos → circulação e leitor → transparência e formação',
    states: [
      { label: 'Recorte', section: 'Delimitação', anchor: 'a redação definiu fake news por três parágrafos', observation: 'Definição certa; a proposta pedia consequências.', conclusion: 'O tema vira pergunta antes do plano.' },
      { label: 'Argumentos', section: 'Argumentos possíveis', anchor: 'o áudio alarmista sobre a vacina chega a cem grupos antes do almoço', observation: 'A plataforma premia o medo; o leitor não checa a fonte.', conclusion: 'Nem só o usuário, nem só a plataforma.' },
      { label: 'Intervenção', section: 'Intervenção', anchor: 'relatórios periódicos sobre os critérios de recomendação', observation: 'Tornar visível o critério sem remover opinião.', conclusion: 'Retire um elemento e veja a proposta empobrecer.' },
    ],
    scenes: [
      { kind: 'restrict', words: ['impactos', 'saúde pública'], off: 'definir fake news' },
      { kind: 'args', args: ['circulação: engajamento', 'leitor: sem checagem'] },
      { kind: 'elements', values: ['Congresso Nacional', 'exigir relatórios', 'lei de transparência', 'controle público', 'semestrais'] },
    ],
  },
} satisfies Record<string, WritingConfig>;
export type WritingOperationId = keyof typeof WRITING_OPERATIONS;

const ink = 'var(--vs-ink)', wine = 'var(--vs-burgundy)', paper = 'var(--vs-paper)';
const ELEMENTS = ['Agente', 'Ação', 'Meio', 'Finalidade', 'Detalhamento'];

function Pick({ options, children }: { options: string[]; children: (pick: number) => React.ReactNode }) {
  const [pick, setPick] = useState(0);
  return <>
    <div className="lf-conditions" role="group" aria-label="Escolha o conceito">
      {options.map((name, i) => <button key={name} type="button" className="lf-inline-control" aria-pressed={pick === i} onClick={() => setPick(i)}>{name}</button>)}
    </div>
    {children(pick)}
  </>;
}
/** Os cinco elementos da competência 5 como condições. A nota sobe por
 *  elemento válido, e por isso o desenho mostra a vaga vazia de cada um. */
function Elements({ values }: { values: string[] }) {
  const [on, setOn] = useState(ELEMENTS.map(() => true));
  const count = on.filter(Boolean).length;
  const missing = ELEMENTS.filter((_, i) => !on[i]).map(name => name.toLowerCase());
  return <>
    <div className="lf-conditions" role="group" aria-label="Elementos da intervenção">
      {ELEMENTS.map((name, i) => <button key={name} type="button" className="lf-inline-control" aria-pressed={on[i]} onClick={() => setOn(on.map((v, j) => j === i ? !v : v))}>{name}</button>)}
      <p className="lf-verdict" role="status">{count === 5 ? 'Cinco elementos válidos: proposta completa.' : `${count} de 5: falta ${missing.join(', ')}. Cada elemento ausente deixa de pontuar.`}</p>
    </div>
    <Drawing label={`Intervenção com ${count} de 5 elementos`}>
      {ELEMENTS.map((name, i) => <g key={name} opacity={on[i] ? 1 : 0.45}>
        <text x="20" y={30 + i * 36} fill={ink} fontSize="15" fontWeight="700">{name}</text>
        <rect x="150" y={10 + i * 36} width="390" height="28" rx="6" fill={paper} stroke={on[i] ? ink : wine} strokeWidth={on[i] ? 1.5 : 2.5} strokeDasharray={on[i] ? undefined : '6 5'}/>
        <text x="162" y={30 + i * 36} fill={ink} fontSize="15">{on[i] ? values[i] : '—'}</text>
      </g>)}
      <Arrow d={`M20 196h${(count / 5) * 520}`} active={count > 0}/>
      <Line x={20} y={222}>{count === 5 ? 'proposta completa' : `${count} de 5 elementos`}</Line>
    </Drawing>
  </>;
}
function WritingScene({ scene, label }: { scene: Scene; label: string }) {
  switch (scene.kind) {
    case 'pick': return <Pick options={scene.options.map(([name]) => name)}>
      {pick => <Drawing label={`${label}: ${scene.options[pick][0]}`}><Box x={20} y={30} w={520}>{scene.case}</Box><Arrow key={pick} d={`M${110 + pick * 150} 80v40`}/><Box x={20} y={128} w={520} strong>{scene.options[pick][1]}</Box><Line x={20} y={222}>{scene.options[pick][0].toLowerCase()}</Line></Drawing>}
    </Pick>;
    case 'gap': return <Drawing label={label}><Box x={20} y={50} w={230}>{scene.law}</Box><Box x={310} y={50} w={230} strong>{scene.practice}</Box><path d="M255 72h50" stroke={wine} strokeWidth="3" strokeDasharray="6 6"/><Line x={20} y={140}>o escrito</Line><Line x={310} y={140}>o que acontece</Line><Arrow d="M135 160q140 40 270 0"/><Line x={20} y={222}>a distância é o argumento</Line></Drawing>;
    case 'steps': return <Drawing label={label}>{scene.steps.map((step, i) => <Box key={step} x={20} y={20 + i * 62} w={340 + i * 60} strong={i === scene.steps.length - 1}>{step}</Box>)}<Arrow d="M40 66v12m0 50v12"/><Line x={20} y={222}>um passo de cada vez</Line></Drawing>;
    case 'restrict': return <Drawing label={label}><rect x="20" y="20" width="520" height="70" rx="8" fill={paper} stroke={ink} strokeWidth="2"/>{scene.words.map((word, i) => <g key={word}><rect x={40 + i * 250} y="38" width="220" height="34" rx="6" fill="none" stroke={wine} strokeWidth="3"/><text x={52 + i * 250} y="61" fill={ink} fontSize="16" fontWeight="700">{word}</text></g>)}<Box x={20} y={120} w={300}>{scene.off}</Box><path d="M20 142h300" stroke={wine} strokeWidth="3"/><Arrow d="M330 142h60"/><Line x={400} y={148}>tangencia</Line><Line x={20} y={222}>as palavras restringem o tema</Line></Drawing>;
    case 'args': return <Drawing label={label}><Box x={20} y={30} w={250}>{scene.args[0]}</Box><Box x={290} y={30} w={250}>{scene.args[1]}</Box><Arrow d="M145 80q60 60 120 70M415 80q-60 60 -120 70"/><Box x={190} y={150} w={180} strong>tese</Box><Line x={20} y={222}>duas dimensões, não uma repetida</Line></Drawing>;
    case 'elements': return <Elements values={scene.values}/>;
  }
}

export function WritingOperation({ id }: { id: WritingOperationId }) {
  const config = WRITING_OPERATIONS[id];
  // Componente estável por capítulo: recriá-lo a cada render remontaria a cena
  // e apagaria a escolha feita nos botões de conceito e de elementos.
  const Scene = React.useMemo(() => function WritingStateScene({ state }: { state: number }) {
    return <WritingScene scene={config.scenes[state]} label={config.states[state].observation}/>;
  }, [config]);
  return <OperationWorkshop id={id} config={config} Scene={Scene}
    manuscript="Repertório e recorte se provam no texto, não no nome citado."
    caption="Casos e propostas autorais, escritos para o exercício. Não são redações reais nem gabaritos oficiais."/>;
}
export function writingOperationInstrument(id: WritingOperationId) {
  const config = WRITING_OPERATIONS[id];
  return function WritingOperationBoard(props: BoardProps) {
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell title={config.topic} kicker="Oficina de redação" subtitle={config.question}
      condition={{ label: 'Operação', value: 'Caso autoral' }} sceneFirst
      ariaLabel={`Oficina de redação: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<WritingOperation id={id}/>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? config.topic, detail: first?.excerpt ?? config.question, formula: config.relation }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? config.topic, detail: second?.excerpt ?? config.question, formula: 'recorte → argumento → proposta' }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      closing="Na redação, o repertório vale pelo que explica do recorte."/>;
  };
}
