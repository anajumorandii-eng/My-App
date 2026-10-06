import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import { useSceneMotion } from '../topic-scenes/useSceneMotion';
import { Arrow, Box, Drawing, Line, OperationWorkshop, type Foundation } from './LiteratureFoundations';

/** Sociologia aplica o conceito a um caso. A auditoria apontou, nestes
 *  dezenove capítulos (H3 e H2), cartões e grades que só trocavam rótulo ou veredito: aqui cada
 *  estado mostra o caso, e onde o conceito é conjunção de condições (fato
 *  social, camadas da exclusão digital) a cena deixa retirar uma condição e
 *  ver a situação mudar. As âncoras são frases autorais do próprio capítulo. */
export const SOCIOLOGY_OPERATIONS = {
  'social-fact': {
    topic: 'O que é o Fato Social', question: 'O caso reúne os três traços, ou falta algum?', relation: 'exterioridade + coerção + generalidade → fato social',
    states: [
      { label: 'Três traços', section: 'As três características', anchor: 'o uniforme da escola existia antes de Lia chegar e a advertência veio quando ela o deixou em casa', observation: 'Existia antes dela, gera sanção e vale para todos: os três traços aparecem juntos.', conclusion: 'Retire um traço e o caso deixa de ser fato social; teste no botão.' },
      { label: 'Tratar como coisa', section: 'Tratar como coisa', anchor: 'Pense na taxa de casamentos de uma cidade', observation: 'Em vez do humor de cada noivo, indicadores observáveis comparados entre grupos.', conclusion: 'Explicar o social pelo social, sem pré-noções.' },
      { label: 'Normal', section: 'Normal e patológico', anchor: 'toda sociedade registrada teve algum tipo de transgressão punida', observation: 'A regularidade torna o fenômeno normal no tipo social; a punição reafirma valores.', conclusion: 'Normal não é bom: é análise funcional, não moral.' },
    ],
  },
  'solidarity-types': {
    topic: 'Solidariedade Mecânica e Solidariedade Orgânica', question: 'O que une: semelhança ou dependência?', relation: 'semelhança → mecânica; interdependência → orgânica',
    states: [
      { label: 'Mecânica', section: 'Duas formas de coesão', anchor: 'na aldeia, todos plantam, rezam e festejam do mesmo jeito', observation: 'Cada um faz o que todos fazem; a consciência coletiva ocupa quase tudo.', conclusion: 'Coesão pela semelhança, típica de sociedades tradicionais.' },
      { label: 'Orgânica', section: 'Divisão do trabalho', anchor: 'o pão da padaria depende do moinho, do caminhoneiro e da eletricista', observation: 'Funções diferentes formam uma cadeia: ninguém produz sozinho.', conclusion: 'Coesão pela diferença complementar, típica das sociedades modernas.' },
      { label: 'Direito', section: 'Direito como indicador', anchor: 'quem quebra o tabu é expulso; quem quebra o contrato paga o conserto', observation: 'Castigo exemplar de um lado, reparação da relação do outro.', conclusion: 'Repressivo indica mecânica; restitutivo indica orgânica.' },
    ],
  },
  'anomie-grid': {
    topic: 'Anomia e Coesão Social', question: 'Falta integração, regulação, ou há excesso?', relation: 'integração × regulação → quatro extremos',
    states: [
      { label: 'Anomia', section: 'O conceito de anomia', anchor: 'a fábrica fechou, o bairro mudou e as regras antigas já não diziam o que esperar', observation: 'A norma perde eficácia e nenhuma nova ocupa o lugar.', conclusion: 'Anomia é falta de regulação eficaz, não caos qualquer.' },
      { label: 'Dois eixos', section: 'O estudo sobre o suicídio', anchor: 'duas variáveis: quanto o grupo integra e quanto o grupo regula', observation: 'Cada eixo tem dois extremos patológicos: pouco e excesso.', conclusion: 'Egoísta, altruísta, anômico e fatalista saem do cruzamento.' },
      { label: 'Instituição', section: 'Coesão e instituições', anchor: 'a associação de bairro voltou a reunir quem tinha perdido o emprego', observation: 'Um grupo intermediário recria vínculo e regra.', conclusion: 'Instituições reintegram e regulam; em excesso, também adoecem.' },
    ],
  },
  'identity-difference': {
    topic: 'Identidade e Diferença', question: 'Quando a diferença vira desigualdade?', relation: 'identidade relacional + reconhecimento + redistribuição → justiça',
    states: [
      { label: 'Relacional', section: 'Identidade como construção', anchor: 'ela só se disse paulista quando se mudou para Recife', observation: 'A identidade aparece no contato com o diferente.', conclusion: 'Identidade se marca pelo que não se é; não é essência.' },
      { label: 'Vira hierarquia', section: 'Diferença e desigualdade', anchor: 'o sotaque era só diferença até virar motivo para recusar a vaga', observation: 'A diferença passa a decidir o acesso a uma oportunidade.', conclusion: 'Diferença não é desigualdade até virar critério de exclusão.' },
      { label: 'Duas condições', section: 'Diferença e desigualdade', anchor: 'a escola celebrou a cultura do bairro e manteve a sala sem laboratório', observation: 'Reconhecimento simbólico sem mudança material.', conclusion: 'Reconhecer e redistribuir: faltando um, a justiça fica pela metade.' },
    ],
  },
  'mobility-grid': {
    topic: 'Classes Sociais e Mobilidade Social', question: 'Mudou de estrato? Uma vida ou duas gerações?', relation: 'vertical/horizontal × intra/intergeracional',
    states: [
      { label: 'Vertical inter', section: 'Tipos de mobilidade', anchor: 'a filha do porteiro tornou-se engenheira', observation: 'Compara gerações e há mudança de estrato.', conclusion: 'Mobilidade vertical ascendente e intergeracional.' },
      { label: 'Horizontal intra', section: 'Tipos de mobilidade', anchor: 'o vendedor de sapatos passou a vender celulares, com o mesmo salário', observation: 'A mesma pessoa troca de ocupação sem mudar de estrato.', conclusion: 'Mobilidade horizontal e intrageracional.' },
      { label: 'Exceção × padrão', section: 'Barreiras à mobilidade', anchor: 'um caso de ascensão em cem não mostra a regra dos noventa e nove', observation: 'Um ponto subindo entre cem que permanecem.', conclusion: 'Mobilidade se mede por padrão estatístico, não por exceção.' },
    ],
  },
  'citizenship-rights': {
    topic: 'Cidadania e Direitos', question: 'Que direito é, e ele é efetivo?', relation: 'civil + político + social → cidadania; formal ≠ efetivo',
    states: [
      { label: 'Três dimensões', section: 'As três gerações', anchor: 'falar sem censura, votar no prefeito, matricular o filho na escola pública', observation: 'Expressão é civil, voto é político, escola é social.', conclusion: 'Classifique pela finalidade; cidadania plena reúne as três.' },
      { label: 'Regulada', section: 'O caso brasileiro', anchor: 'com carteira assinada, tinha aposentadoria; sem ela, não tinha', observation: 'O direito social dependia do vínculo formal reconhecido.', conclusion: 'Cidadania regulada: rurais, domésticos e informais ficavam fora.' },
      { label: 'Formal × efetivo', section: 'Efetivação', anchor: 'a lei garante a vaga, mas a escola mais próxima fica a duas horas', observation: 'O direito existe no papel; a distância bloqueia o uso.', conclusion: 'Direito efetivo depende de instituições e acesso real.' },
    ],
  },
  'information-society': {
    topic: 'A Sociedade da Informação', question: 'Que camada falta, e que critério ordena o que se vê?', relation: 'conexão + qualidade + uso crítico → inclusão',
    states: [
      { label: 'Três camadas', section: 'Desigualdade digital', anchor: 'tinha internet, mas um único celular para três irmãos em aula remota', observation: 'Há conexão, mas falta dispositivo e qualidade para três aulas.', conclusion: 'Inclusão exige as três camadas; teste retirando uma.' },
      { label: 'Rede', section: 'Características', anchor: 'a notícia rodou o país antes de o jornal da noite começar', observation: 'A circulação em rede supera o ritmo dos meios tradicionais.', conclusion: 'Tempo instantâneo, espaço com menos peso.' },
      { label: 'Algoritmo', section: 'Dados, algoritmos e poder', anchor: 'o feed mostrou primeiro o que mais prendia, não o que era mais verdadeiro', observation: 'O critério de ordem é o engajamento, não a qualidade.', conclusion: 'Algoritmos não são neutros: embutem critérios e vieses.' },
    ],
  },
  'education-socialization': {
    topic: 'Educação e Socialização em Durkheim', question: 'Que norma foi transmitida, por qual instituição, com que efeito?', relation: 'gerações adultas → ser social; integração e reprodução',
    states: [
      { label: 'Ser social', section: 'A função da educação', anchor: 'a criança que chegou mordendo os colegas aprendeu, em meses, a esperar a vez na fila do lanche', observation: 'Repetição de regras comuns, com sanção e elogio, e não um sermão isolado.', conclusion: 'A educação forma o ser social no indivíduo.' },
      { label: 'Primária e secundária', section: 'Socialização primária e secundária', anchor: 'em casa aprendeu a pedir licença; no primeiro emprego aprendeu a responder ao chefe por e-mail', observation: 'A família dá a base; a instituição acrescenta as regras de um papel.', conclusion: 'A secundária é permanente e pode reforçar ou contrariar a primária.' },
      { label: 'Reprodução', section: 'Escola e sociedade', anchor: 'a prova valorizou o vocabulário que só alguns traziam de casa', observation: 'A regra parece neutra e premia quem já tinha o capital cultural cobrado.', conclusion: 'A escola integra e também pode reproduzir desigualdade.' },
    ],
  },
  'mode-of-production': {
    topic: 'Modo de Produção e Estrutura Social', question: 'O que é técnica e o que é relação social?', relation: 'forças produtivas + relações de produção → modo de produção',
    states: [
      { label: 'Forças × relações', section: 'O conceito', anchor: 'a mesma máquina de costura serve à costureira dona da oficina e à operária que só vende suas horas', observation: 'A máquina é a mesma; muda quem é dono dela e quem só vende o tempo.', conclusion: 'Técnica é força produtiva; propriedade é relação de produção.' },
      { label: 'Base e superestrutura', section: 'Base e superestrutura', anchor: 'a lei que garantiu a cerca da fazenda também passou a decidir quem podia plantar ali', observation: 'O direito nasce da propriedade e volta a agir sobre ela.', conclusion: 'A superestrutura legitima a base e age sobre ela.' },
      { label: 'Contradição', section: 'Sucessão histórica', anchor: 'a oficina cresceu tanto que as regras da corporação de ofício já não deixavam contratar mais aprendizes', observation: 'As forças crescem e as relações antigas viram freio.', conclusion: 'A transição nasce da contradição, com conflito social.' },
    ],
  },
  'ideology-alienation': {
    topic: 'Ideologia e Alienação', question: 'O que aparece como natural, e que relação isso esconde?', relation: 'relação social → aparência natural → ocultação',
    states: [
      { label: 'Naturalização', section: 'Ideologia', anchor: 'sempre houve ricos e pobres; é assim que o mundo funciona', observation: 'Uma relação histórica é dita eterna e natural.', conclusion: 'Ideologia naturaliza interesses particulares.' },
      { label: 'Alienação', section: 'Alienação', anchor: 'montava a mesma peça oito horas por dia e nunca viu o carro pronto', observation: 'Separado do produto, do processo, da criação e dos outros.', conclusion: 'Alienação é condição objetiva, não sentimento.' },
      { label: 'Fetiche', section: 'Fetichismo da mercadoria', anchor: 'o tênis custa caro porque é da marca', observation: 'O valor parece morar na coisa; o trabalho que o produziu some.', conclusion: 'Relações entre pessoas aparecem como propriedade das coisas.' },
    ],
  },
  'social-action-types': {
    topic: 'Tipos de Ação Social', question: 'Qual é o sentido visado por quem age?', relation: 'sentido visado → tipo de ação; tipo ideal como régua',
    states: [
      { label: 'Ação social?', section: 'A sociologia compreensiva', anchor: 'duas pessoas abrem o guarda-chuva ao mesmo tempo quando começa a chover', observation: 'Cada uma reage à chuva, não à outra: há ação, mas não social.', conclusion: 'Ação social se orienta pela conduta de outros.' },
      { label: 'Mesmo ato', section: 'Os quatro tipos', anchor: 'O ato é o mesmo; o sentido muda o tipo', observation: 'Doar sangue por folga, por dever, por comoção ou por costume.', conclusion: 'Escolha o motivo: o tipo muda, o gesto não.' },
      { label: 'Tipo ideal', section: 'Tipo ideal', anchor: 'a avó que faz bolo de fubá todo domingo', observation: 'Costume, afeto e cálculo misturados numa só ação.', conclusion: 'O tipo ideal mede a mistura; não se acha puro no mundo.' },
    ],
  },
  'weber-domination': {
    topic: 'Dominação e Poder em Weber', question: 'Em que se apoia a obediência?', relation: 'poder ≠ dominação; costume, carisma ou regra',
    states: [
      { label: 'Poder × dominação', section: 'Poder e dominação', anchor: 'o assaltante manda entregar o celular, e o fiscal da prova manda guardar o celular', observation: 'Os dois são obedecidos; só um é reconhecido como legítimo.', conclusion: 'Dominação supõe crença na legitimidade do comando.' },
      { label: 'Três tipos', section: 'Os três tipos de dominação legítima', anchor: 'pergunte em que a obediência se apoia', observation: 'Patriarca, pregador e secretária nomeada na mesma cidade.', conclusion: 'Escolha o fundamento: costume, pessoa extraordinária ou cargo.' },
      { label: 'Jaula de ferro', section: 'Burocracia e racionalização', anchor: 'o laudo só sai com o atendimento que exige o próprio laudo', observation: 'A regra impessoal gira sobre si mesma e ninguém a controla.', conclusion: 'Eficiência técnica pode virar aprisionamento.' },
    ],
  },
  'protestant-ethic': {
    topic: 'Ética Protestante e o Espírito do Capitalismo', question: 'Que elo liga a predestinação à acumulação?', relation: 'predestinação → angústia → vocação + ascese → acumulação',
    states: [
      { label: 'O espírito', section: 'A tese', anchor: 'continua aberto e reinveste o lucro', observation: 'O ganho deixa de servir ao prazer e vira dever metódico.', conclusion: 'Espírito do capitalismo não é ganância.' },
      { label: 'Cadeia', section: 'O mecanismo', anchor: 'o tecelão puritano que trabalha do amanhecer ao anoitecer, anota cada gasto e não compra roupa nova', observation: 'Angústia leva ao trabalho; a ascese impede o consumo do lucro.', conclusion: 'Retire um elo e a acumulação não se forma; teste no botão.' },
      { label: 'Jaula', section: 'O alcance do argumento', anchor: 'o bisneto do tecelão trabalha doze horas por dia sem acreditar em predestinação', observation: 'A disciplina fica; o sentido religioso sai.', conclusion: 'Afinidade eletiva na origem; mercado na manutenção.' },
    ],
  },
  'gender-inequality': {
    topic: 'Desigualdade de Gênero', question: 'O que é apresentado como natural, e o que mostra que foi construído?', relation: 'sexo ≠ gênero → papéis variam → transformáveis',
    states: [
      { label: 'Papéis variam', section: 'Sexo e gênero', anchor: 'a bisavó não podia abrir conta em banco sem o marido, e a bisneta é gerente do banco', observation: 'A biologia não mudou em quatro gerações; o papel mudou inteiro.', conclusion: 'Se varia, foi construído; se foi construído, transforma-se.' },
      { label: 'Dupla jornada', section: 'Divisão sexual do trabalho', anchor: 'ele senta para ver o jogo, ela começa o jantar e confere a lição dos filhos', observation: 'Mesma jornada paga; o cuidado não pago cai de um lado só.', conclusion: 'A divisão separa e hierarquiza.' },
      { label: 'Formal × de fato', section: 'Indicadores e conquistas', anchor: 'a promoção sai sempre em reunião depois do expediente', observation: 'A regra salarial é igual; o horário pressupõe alguém em casa.', conclusion: 'Igualdade formal convive com desigualdade de fato.' },
    ],
  },
  'platform-work': {
    topic: 'Precarização e Uberização do Trabalho', question: 'Quem assume o risco, e quem controla o trabalho?', relation: 'ritmo e preço definidos → controle algorítmico → subordinação',
    states: [
      { label: 'Risco muda de lado', section: 'O que é precarização', anchor: 'hoje costura a mesma peça em casa, para a mesma marca, por produção, com máquina própria e sem carteira', observation: 'O trabalho é o mesmo; máquina, encomenda e prejuízo passam a ser dela.', conclusion: 'Precarizar é transferir risco e retirar proteção.' },
      { label: 'Controle sem direitos', section: 'Uberização', anchor: 'o entregador não escolhe quanto cobra pela corrida', observation: 'Preço, distribuição, avaliação e bloqueio vêm da plataforma.', conclusion: 'Retire um controle e veja a subordinação enfraquecer.' },
      { label: 'Respostas', section: 'Debates e respostas', anchor: 'o motorista foi bloqueado depois de uma avaliação baixa e não soube qual regra descumpriu', observation: 'Sem renda e sem saber o critério: dois problemas juntos.', conclusion: 'Cada proposta atua num elo diferente da cadeia.' },
    ],
  },
  'social-movements': {
    topic: 'Movimentos Sociais Clássicos e Contemporâneos', question: 'Há identidade, organização e projeto? Em torno de quê?', relation: 'identidade + organização + projeto → movimento',
    states: [
      { label: 'Movimento?', section: 'Definição', anchor: 'moradores formam uma associação, se reúnem toda semana', observation: 'O protesto de uma tarde junta gente; a associação dura e tem projeto.', conclusion: 'Sem identidade, organização ou projeto, é mobilização pontual.' },
      { label: 'Clássico × novo', section: 'Movimentos clássicos e novos', anchor: 'Os metalúrgicos param a fábrica exigindo reajuste salarial', observation: 'Classe e salário de um lado; vários bairros e a praça do outro.', conclusion: 'Classifique pela demanda e pela forma, não pela data.' },
      { label: 'Rede', section: 'No Brasil', anchor: 'o protesto começou por vinte centavos na passagem', observation: 'Alcance rápido; muitas pautas e ninguém para negociar.', conclusion: 'Tamanho não é eficácia: falta organização para durar.' },
    ],
  },
  'democracy-forms': {
    topic: 'Democracia e Participação Política', question: 'Quem decide, por qual canal, e as condições estão presentes?', relation: 'forma de decisão + condições de efetividade → democracia',
    states: [
      { label: 'Três formas', section: 'Formas de democracia', anchor: 'Compare três situações autorais sobre a mesma praça', observation: 'Assembleia de vizinhos, Câmara eleita, plenária com prefeitura.', conclusion: 'Escolha a forma: muda quem decide e por qual canal.' },
      { label: 'Condições', section: 'Condições de efetividade', anchor: 'a única rádio pertence ao prefeito', observation: 'Há urna; faltam informação plural e crítica sem retaliação.', conclusion: 'Retire uma condição: a eleição sozinha não basta.' },
      { label: 'Desinformação', section: 'Desafios contemporâneos', anchor: 'um áudio falso sobre a urna circula em grupos de família', observation: 'A rede que organiza o abaixo-assinado espalha o boato.', conclusion: 'Efeitos ambivalentes: veja quem controla a circulação.' },
    ],
  },
  'globalization-flows': {
    topic: 'Globalização Econômica e Cultural', question: 'O que circula, quem controla o fluxo e o que acontece no local?', relation: 'cadeia global; homogeneização, hibridismo, identidade local; assimetria',
    states: [
      { label: 'Cadeia', section: 'Dimensão econômica', anchor: 'tem chip de Taiwan, tela da Coreia do Sul, montagem na China', observation: 'Nenhum país faz o produto inteiro; cada etapa vai para onde custa menos.', conclusion: 'Integração e concorrência entre territórios.' },
      { label: 'Três respostas', section: 'Dimensão cultural', anchor: 'cria a guitarrada', observation: 'Mesmo hambúrguer, guitarrada nova, festa que se reafirma.', conclusion: 'Escolha a resposta: o critério é o destino do elemento externo.' },
      { label: 'Assimetria', section: 'Assimetrias', anchor: 'a soja do Mato Grosso chega à China em semanas', observation: 'A mercadoria passa; a pessoa da mesma região espera visto.', conclusion: 'A globalização integra e exclui ao mesmo tempo.' },
    ],
  },
  'nation-state': {
    topic: 'O Estado-Nação na Era Global', question: 'O que o Estado ainda faz, e o que deixou de controlar sozinho?', relation: 'soberania relativizada + Estado persistente → tensão com interdependência',
    states: [
      { label: 'Relativizada', section: 'Soberania em questão', anchor: 'os investidores ameaçam retirar capital em horas', observation: 'A decisão segue nacional; o leque de escolhas encolheu.', conclusion: 'Relativizada não é extinta.' },
      { label: 'Persiste', section: 'Persistência do Estado', anchor: 'pede socorro ao governo quando o crédito some', observation: 'O mercado que pedia menos Estado recorre a ele na crise.', conclusion: 'O Estado é condição do próprio mercado global.' },
      { label: 'Escala', section: 'Nacionalismos e tensões', anchor: 'a vacina depende de insumos fabricados em outros três continentes', observation: 'Fechar a fronteira é necessário e insuficiente ao mesmo tempo.', conclusion: 'Cada problema pede uma escala de resposta.' },
    ],
  },
} satisfies Record<string, Foundation>;
export type SociologyOperationId = keyof typeof SOCIOLOGY_OPERATIONS;

const ink = 'var(--vs-ink)', wine = 'var(--vs-burgundy)', paper = 'var(--vs-paper)';

/** Condições ligáveis. A auditoria recusou o checklist que só trocava o texto
 *  do veredito: `children` recebe o estado e o desenho tem de mudar junto. */
function Conditions({ names, verdict, children }: { names: string[]; verdict: (on: boolean[]) => string; children: (on: boolean[]) => React.ReactNode }) {
  const [on, setOn] = useState(names.map(() => true));
  return <>
    <div className="lf-conditions" role="group" aria-label="Condições do caso">
      {names.map((name, i) => <button key={name} type="button" className="lf-inline-control" aria-pressed={on[i]} onClick={() => setOn(on.map((v, j) => j === i ? !v : v))}>{name}</button>)}
      <p className="lf-verdict" role="status">{verdict(on)}</p>
    </div>
    {children(on)}
  </>;
}
/** Caixa que some para tracejado quando a condição é retirada. */
function Toggle({ x, y, w, on, children }: { x: number; y: number; w: number; on: boolean; children: React.ReactNode }) {
  return <g opacity={on ? 1 : 0.35}><rect x={x} y={y} width={w} height="44" rx="7" fill={paper} stroke={on ? ink : wine} strokeWidth={on ? 1.5 : 2.5} strokeDasharray={on ? undefined : '6 5'}/><text x={x + 12} y={y + 28} fill={ink} fontSize="16" textDecoration={on ? undefined : 'line-through'}>{children}</text></g>;
}

function SocialFact({ state }: { state: number }) {
  const label = ['Uniforme anterior, advertência e uso comum', 'Indicadores observáveis no lugar de motivos individuais', 'Transgressão punida em toda sociedade'][state];
  if (state === 0) return <Conditions names={['Exterioridade', 'Coerção', 'Generalidade']} verdict={on => on.every(Boolean) ? 'Os três traços presentes: fato social.' : `Falta ${['exterioridade', 'coerção', 'generalidade'].filter((_, i) => !on[i]).join(' e ')}: não é fato social, é outra coisa (hábito, gosto, escolha).`}>
    {on => <Drawing label={label}><Toggle x={20} y={30} w={160} on={on[0]}>antes de Lia</Toggle><Toggle x={200} y={30} w={160} on={on[1]}>advertência</Toggle><Toggle x={380} y={30} w={160} on={on[2]}>todos usam</Toggle><Arrow d="M100 80q180 70 360 0" active={on.every(Boolean)}/><Line y={170}>{on.every(Boolean) ? 'exterior · coercitivo · geral' : 'traço retirado: o caso muda de natureza'}</Line><Line x={20} y={222}>os três juntos, não um só</Line></Drawing>}
  </Conditions>;
  return <Drawing label={label}>
    {state === 1 && <><Box x={20} y={40} w={200}>humor de cada noivo</Box><path d="M20 62h200" stroke={wine} strokeWidth="3"/><Arrow d="M225 62h60m-12-8 12 8-12 8"/><Box x={295} y={40} w={230} strong>idade, renda, leis</Box><Line y={150}>comparar grupos e períodos</Line><Line x={20} y={222}>o social pelo social</Line></>}
    {state === 2 && <>{[40, 140, 240, 340, 440].map(x => <g key={x}><rect x={x} y="60" width="70" height="50" fill={paper} stroke={ink}/><circle cx={x + 35} cy="85" r="8" fill={wine}/></g>)}<Arrow d="M40 140h470"/><Line y={180}>regular em todas: normal no tipo social</Line><Line x={20} y={222}>normal ≠ desejável</Line></>}
  </Drawing>;
}
function SolidarityTypes({ state }: { state: number }) {
  return <Drawing label={['Membros iguais em práticas e crenças', 'Cadeia de funções diferentes até o pão', 'Expulsão pelo tabu e conserto pelo contrato'][state]}>
    {state === 0 && <>{[60, 160, 260, 360, 460].map(x => <circle key={x} cx={x} cy="90" r="26" fill={paper} stroke={ink} strokeWidth="3"/>)}<path d="M60 90h400" stroke={wine} strokeDasharray="5 5"/><Arrow d="M60 140h400"/><Line y={180}>plantam, rezam, festejam igual</Line><Line x={20} y={222}>semelhança sustenta o grupo</Line></>}
    {state === 1 && <>{['moinho', 'caminhão', 'eletricista', 'pão'].map((w, i) => <Box key={w} x={20 + i * 135} y={70} w={115} strong={i === 3}>{w}</Box>)}<Arrow d="M137 92h16m118 0h16m118 0h16"/><Line y={170}>cada função depende das outras</Line><Line x={20} y={222}>diferença complementar</Line></>}
    {state === 2 && <><Box x={20} y={40} w={220}>tabu → expulsão</Box><Box x={300} y={40} w={240} strong>contrato → conserto</Box><Line x={30} y={130}>repressivo</Line><Line x={310} y={130}>restitutivo</Line><Arrow d="M130 145q140 50 280 0"/><Line x={20} y={222}>o direito indica a coesão</Line></>}
  </Drawing>;
}
function AnomieGrid({ state }: { state: number }) {
  const cells = [['egoísta', 'pouca integração'], ['altruísta', 'integração demais'], ['anômico', 'pouca regulação'], ['fatalista', 'regulação demais']];
  return <Drawing label={['Regras antigas sem eficácia depois da fábrica fechar', 'Quatro tipos no cruzamento de integração e regulação', 'Associação de bairro reintegra desempregados'][state]}>
    {state === 0 && <><rect x="30" y="50" width="120" height="90" fill={paper} stroke={ink} strokeWidth="3"/><path d="M30 50l120 90M150 50L30 140" stroke={wine} strokeWidth="3"/><Line x={45} y={170}>fábrica</Line><Arrow d="M160 95h100m-12-8 12 8-12 8"/><Box x={270} y={73} w={250}>regras sem eficácia</Box><Line x={20} y={222}>falta de regulação, não caos</Line></>}
    {state === 1 && <>{cells.map(([t, d], i) => <g key={t}><rect x={20 + (i % 2) * 265} y={20 + Math.floor(i / 2) * 85} width="250" height="75" rx="7" fill={paper} stroke={i === 2 ? wine : ink} strokeWidth={i === 2 ? 3 : 1.5}/><text x={35 + (i % 2) * 265} y={50 + Math.floor(i / 2) * 85} fill={ink} fontSize="17" fontWeight="700">{t}</text><text x={35 + (i % 2) * 265} y={78 + Math.floor(i / 2) * 85} fill={ink} fontSize="15">{d}</text></g>)}<Arrow d="M20 195h510"/><Line x={20} y={222}>dois eixos, dois extremos cada</Line></>}
    {state === 2 && <>{[60, 120, 180].map(x => <circle key={x} cx={x} cy="100" r="18" fill={paper} stroke={ink} strokeWidth="2"/>)}<Arrow d="M210 100h90m-12-8 12 8-12 8"/><rect x="320" y="60" width="200" height="80" rx="10" fill={paper} stroke={wine} strokeWidth="3"/><Line x={335} y={107}>associação</Line><Line x={20} y={222}>vínculo e regra recriados</Line></>}
  </Drawing>;
}
function IdentityDifference({ state }: { state: number }) {
  const label = ['Paulista em Recife', 'Sotaque vira motivo de recusa', 'Cultura celebrada e sala sem laboratório'][state];
  if (state === 2) return <Conditions names={['Reconhecimento', 'Redistribuição']} verdict={on => on.every(Boolean) ? 'As duas dimensões presentes: a injustiça é enfrentada por inteiro.' : on[0] ? 'Só reconhecimento: a cultura é celebrada e a sala segue sem laboratório.' : on[1] ? 'Só redistribuição: o laboratório chega, mas o desrespeito à cultura do bairro permanece.' : 'Nenhuma dimensão: diferença e desigualdade seguem intactas.'}>
    {on => <Drawing label={label}><Toggle x={20} y={50} w={230} on={on[0]}>festa da cultura</Toggle><Toggle x={290} y={50} w={230} on={on[1]}>{on[1] ? 'laboratório montado' : 'sala sem laboratório'}</Toggle><Arrow d="M135 110q140 50 270 0" active={on.every(Boolean)}/><Line y={180}>{on.every(Boolean) ? 'reconhecer + redistribuir' : 'uma dimensão faltando'}</Line><Line x={20} y={222}>faltando um, fica pela metade</Line></Drawing>}
  </Conditions>;
  return <Drawing label={label}>
    {state === 0 && <><Box x={20} y={60} w={140}>São Paulo</Box><Box x={380} y={60} w={140}>Recife</Box><Arrow d="M165 82h210m-12-8 12 8-12 8"/><Line x={200} y={140}>“sou paulista”</Line><Line x={20} y={222}>a identidade aparece no contraste</Line></>}
    {state === 1 && <><Box x={20} y={50} w={150}>sotaque</Box><Arrow d="M175 72h80m-12-8 12 8-12 8"/><Box x={265} y={50} w={250} strong>vaga recusada</Box><Line y={150}>diferença usada como critério</Line><Line x={20} y={222}>diferença → desigualdade</Line></>}
  </Drawing>;
}
function MobilityGrid({ state }: { state: number }) {
  const transition = useSceneMotion();
  return <Drawing label={['Pai porteiro e filha engenheira em estratos diferentes', 'Mesma pessoa troca de ocupação no mesmo estrato', 'Um ponto sobe entre cem'][state]}>
    {state < 2 ? <><path d="M60 40v150M60 190h460" stroke={ink} strokeWidth="2"/><Line x={10} y={50}>↑</Line>{[70, 115, 160].map(y => <path key={y} d={`M60 ${y}h460`} stroke={ink} strokeDasharray="4 6"/>)}
      <circle cx="150" cy="160" r="12" fill={ink}/>
      <motion.circle initial={false} animate={{ cx: state === 0 ? 400 : 400, cy: state === 0 ? 70 : 160 }} transition={transition} r="12" fill={wine}/>
      <Arrow d={state === 0 ? 'M165 155Q300 60 385 72' : 'M165 160h220'}/>
      <Line x={110} y={185}>{state === 0 ? 'pai' : 'antes'}</Line><Line x={370} y={state === 0 ? 55 : 145}>{state === 0 ? 'filha' : 'depois'}</Line>
      <Line x={20} y={222}>{state === 0 ? 'sobe de estrato, entre gerações' : 'mesmo estrato, mesma vida'}</Line></>
    : <>{Array.from({ length: 50 }, (_, i) => <circle key={i} cx={30 + (i % 25) * 20} cy={140 + Math.floor(i / 25) * 22} r="6" fill={ink} opacity="0.55"/>)}<circle cx="290" cy="50" r="8" fill={wine}/><Arrow d="M290 128V64"/><Line x={310} y={60}>exceção</Line><Line x={20} y={222}>padrão estatístico, não caso isolado</Line></>}
  </Drawing>;
}
function CitizenshipRights({ state }: { state: number }) {
  return <Drawing label={['Expressão, voto e escola como três dimensões', 'Carteira assinada decide a aposentadoria', 'Vaga garantida e escola a duas horas'][state]}>
    {state === 0 && <>{[['falar', 'civil'], ['votar', 'político'], ['escola', 'social']].map(([a, b], i) => <g key={a}><Box x={20 + i * 180} y={50} w={160} strong={i === 2}>{a}</Box><Line x={30 + i * 180} y={135}>{b}</Line></g>)}<Arrow d="M100 150q180 50 360 0"/><Line x={20} y={222}>cidadania plena reúne as três</Line></>}
    {state === 1 && <><Box x={20} y={40} w={200} strong>com carteira</Box><Box x={20} y={120} w={200}>sem carteira</Box><Arrow d="M225 62h80m-12-8 12 8-12 8"/><Line x={320} y={68}>aposentadoria</Line><Line x={320} y={148}>nada</Line><path d="M225 142h80" stroke={ink} strokeDasharray="5 5"/><Line x={20} y={222}>direito preso ao vínculo formal</Line></>}
    {state === 2 && <><Box x={20} y={60} w={130} strong>lei: vaga</Box><path d="M160 82h300" stroke={ink} strokeWidth="3" strokeDasharray="8 6"/><Line x={250} y={70}>2 horas</Line><rect x="470" y="55" width="60" height="55" fill={paper} stroke={ink} strokeWidth="2"/><Arrow d="M160 120h300"/><Line x={20} y={222}>formal ≠ efetivo</Line></>}
  </Drawing>;
}
function InformationSociety({ state }: { state: number }) {
  const label = ['Um celular para três irmãos com internet', 'Notícia circula antes do jornal da noite', 'Feed ordenado por engajamento'][state];
  if (state === 0) return <Conditions names={['Conexão', 'Dispositivo e qualidade', 'Uso crítico']} verdict={on => on.every(Boolean) ? 'As três camadas presentes: inclusão digital efetiva.' : !on[0] ? 'Sem conexão: exclusão total, as outras camadas nem chegam a contar.' : `Há conexão, mas falta ${['', 'dispositivo e qualidade', 'uso crítico'].filter((_, i) => i > 0 && !on[i]).join(' e ')}: a inclusão fica incompleta.`}>
    {on => <Drawing label={label}><Toggle x={20} y={40} w={150} on={on[0]}>conexão</Toggle><Toggle x={195} y={40} w={150} on={on[1]}>aparelho</Toggle><Toggle x={370} y={40} w={160} on={on[2]}>uso crítico</Toggle>{[120, 270, 420].map((x, i) => <circle key={x} cx={x} cy="140" r="20" fill={on.every(Boolean) || (on[0] && i === 0) ? wine : paper} stroke={ink} strokeWidth="2"/>)}<Arrow d="M95 95q180 40 360 0" active={on.every(Boolean)}/><Line x={20} y={222}>{on.every(Boolean) ? 'três camadas: inclusão' : 'camada faltando: exclusão'}</Line></Drawing>}
  </Conditions>;
  return <Drawing label={label}>
    {state === 1 && <>{[[60, 60], [200, 140], [320, 50], [460, 130]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r="14" fill={wine}/>)}<Arrow d="M74 62L186 136M214 138L306 54M334 52L446 126"/><Line y={190}>antes do jornal da noite</Line><Line x={20} y={222}>circulação em rede</Line></>}
    {state === 2 && <><Box x={20} y={30} w={260} strong>mais engajamento ↑</Box><Box x={20} y={90} w={260}>mais verdadeiro ↓</Box><Arrow d="M300 60q60 40 0 80"/><Line x={330} y={110}>critério oculto</Line><Line x={20} y={222}>algoritmo não é neutro</Line></>}
  </Drawing>;
}

/** Escolha exclusiva para tipologias. A auditoria do H2 recusou cartões que
 *  só listavam os tipos: aqui o mesmo caso é redesenhado conforme o tipo
 *  escolhido, e o critério de classificação aparece no desenho. */
function Pick({ names, children }: { names: string[]; children: (pick: number) => React.ReactNode }) {
  const [pick, setPick] = useState(0);
  return <>
    <div className="lf-conditions" role="group" aria-label="Escolha o tipo">
      {names.map((name, i) => <button key={name} type="button" className="lf-inline-control" aria-pressed={pick === i} onClick={() => setPick(i)}>{name}</button>)}
    </div>
    {children(pick)}
  </>;
}

function EducationSocialization({ state }: { state: number }) {
  return <Drawing label={['Criança que mordia aprende a esperar a vez', 'Família e emprego ensinam regras em sequência', 'Prova premia vocabulário trazido de casa'][state]}>
    {state === 0 && <><Box x={20} y={40} w={150}>mordia</Box><Arrow d="M175 62h70m-12-8 12 8-12 8"/>{[260, 300, 340, 380].map(x => <circle key={x} cx={x} cy="62" r="12" fill={paper} stroke={ink} strokeWidth="2"/>)}<circle cx="430" cy="62" r="12" fill={wine}/><Line x={260} y={110}>espera a vez na fila</Line><Line y={160}>regra comum, sanção e elogio repetidos</Line><Line x={20} y={222}>ser individual → ser social</Line></>}
    {state === 1 && <><Box x={20} y={40} w={160} strong>casa</Box><Line x={30} y={115}>pedir licença</Line><Arrow d="M185 62h90m-12-8 12 8-12 8"/><Box x={285} y={40} w={230}>primeiro emprego</Box><Line x={295} y={115}>e-mail ao chefe</Line><Line y={165}>primária na base, secundária por toda a vida</Line><Line x={20} y={222}>reforça ou entra em choque</Line></>}
    {state === 2 && <><rect x="40" y="40" width="180" height="90" rx="6" fill={paper} stroke={ink} strokeWidth="2"/><Line x={60} y={92}>mesma prova</Line>{[300, 380, 460].map((x, i) => <g key={x}><rect x={x - 25} y={130 - (i === 0 ? 90 : 30)} width="50" height={i === 0 ? 90 : 30} fill={i === 0 ? wine : paper} stroke={ink}/></g>)}<Arrow d="M225 85h50"/><Line x={270} y={160}>capital de casa</Line><Line x={20} y={222}>regra neutra, resultado desigual</Line></>}
  </Drawing>;
}
function ModeOfProduction({ state }: { state: number }) {
  const transition = useSceneMotion();
  return <Drawing label={['Uma máquina e duas relações de propriedade', 'Lei da cerca age sobre quem planta', 'Oficina cresce e a corporação vira freio'][state]}>
    {state === 0 && <><rect x="230" y="40" width="100" height="60" rx="6" fill={paper} stroke={ink} strokeWidth="3"/><Line x={243} y={77}>máquina</Line><Box x={20} y={130} w={200} strong>dona da oficina</Box><Box x={340} y={130} w={200}>vende as horas</Box><Arrow d="M240 102L150 128M320 102l90 26"/><Line x={20} y={222}>técnica igual, relação oposta</Line></>}
    {state === 1 && <><rect x="20" y="130" width="520" height="50" fill={paper} stroke={ink} strokeWidth="2"/><Line x={35} y={162}>base: propriedade da terra</Line><rect x="140" y="30" width="280" height="50" fill={paper} stroke={wine} strokeWidth="3"/><Line x={160} y={62}>superestrutura: a lei</Line><Arrow d="M220 128V84m-8 12 8-12 8 12"/><Arrow d="M340 84v42m-8-12 8 12 8-12"/><Line x={20} y={222}>legitima a base e age sobre ela</Line></>}
    {state === 2 && <><rect x="20" y="40" width="200" height="120" rx="6" fill="none" stroke={wine} strokeWidth="3" strokeDasharray="8 6"/><Line x={30} y={180}>regras da corporação</Line><motion.rect initial={false} animate={{ width: 230 }} transition={transition} x="40" y="70" height="60" fill={paper} stroke={ink} strokeWidth="2"/><Line x={55} y={107}>oficina que cresceu</Line><Arrow d="M280 100h120"/><Line x={410} y={106}>ruptura</Line><Line x={20} y={222}>forças crescem, relação vira freio</Line></>}
  </Drawing>;
}
function IdeologyAlienation({ state }: { state: number }) {
  return <Drawing label={['Relação histórica dita natural', 'Operário separado do carro pronto', 'Valor parece morar no tênis'][state]}>
    {state === 0 && <><Box x={20} y={40} w={220}>relação histórica</Box><Arrow d="M245 62h60m-12-8 12 8-12 8"/><Box x={315} y={40} w={220} strong>“sempre foi assim”</Box><path d="M20 120h220" stroke={ink} strokeWidth="2"/><Line x={30} y={145}>quem ganha com ela</Line><path d="M20 150h220" stroke={wine} strokeWidth="3"/><Line x={20} y={222}>interesse vira natureza</Line></>}
    {state === 1 && <>{['produto', 'processo', 'criação', 'os outros'].map((w, i) => <g key={w}><Box x={20 + i * 135} y={40} w={120}>{w}</Box><path d={`M${80 + i * 135} 90v40`} stroke={wine} strokeWidth="3" strokeDasharray="6 5"/></g>)}<circle cx="280" cy="160" r="16" fill={wine}/><Arrow d="M40 190h480"/><Line x={20} y={222}>quatro separações, não um humor</Line></>}
    {state === 2 && <><rect x="40" y="60" width="160" height="70" rx="30" fill={paper} stroke={wine} strokeWidth="3"/><Line x={80} y={102}>tênis</Line><Line x={220} y={70}>“o valor é da marca”</Line><path d="M300 150h220" stroke={ink} strokeDasharray="5 5"/><Line x={300} y={175}>trabalho escondido</Line><Arrow d="M300 140q-60 -20 -100 -20"/><Line x={20} y={222}>relação vira coisa</Line></>}
  </Drawing>;
}
function SocialActionTypes({ state }: { state: number }) {
  const label = ['Guarda-chuvas abertos pela chuva', 'Quatro motivos para doar sangue', 'Bolo de fubá com mistura de tipos'][state];
  if (state === 1) return <Pick names={['Fins', 'Valores', 'Afetiva', 'Tradicional']}>
    {pick => <Drawing label={label}><rect x="230" y="30" width="100" height="60" rx="8" fill={paper} stroke={ink} strokeWidth="3"/><Line x={248} y={67}>doação</Line>
      <Box x={20} y={120} w={300} strong>{['folga calculada', 'dever com desconhecidos', 'comoção pelo irmão', '“sempre se fez assim”'][pick]}</Box>
      <Arrow key={pick} d="M170 118q60 -50 90 -26"/><Line x={340} y={148}>{['racional a fins', 'racional a valores', 'afetiva', 'tradicional'][pick]}</Line>
      <Line x={20} y={222}>mesmo gesto, sentido diferente</Line></Drawing>}
  </Pick>;
  return <Drawing label={label}>
    {state === 0 && <>{[140, 400].map(x => <g key={x}><path d={`M${x - 50} 90q50 -60 100 0z`} fill={paper} stroke={ink} strokeWidth="2"/><path d={`M${x} 90v60`} stroke={ink} strokeWidth="2"/></g>)}{[100, 200, 300, 420, 500].map(x => <path key={x} d={`M${x} 20v14`} stroke={ink}/>)}<Arrow d="M190 150h160"/><Line x={190} y={180}>sem orientação mútua</Line><Line x={20} y={222}>ação, mas não social</Line></>}
    {state === 2 && <><rect x="40" y="60" width="160" height="80" rx="40" fill={paper} stroke={ink} strokeWidth="3"/><Line x={70} y={107}>bolo</Line>{[['tradicional', 70], ['afetiva', 45], ['fins', 15]].map(([t, w], i) => <g key={t}><rect x="260" y={40 + i * 50} width={Number(w) * 3} height="30" fill={i === 0 ? wine : paper} stroke={ink}/><text x={270 + Number(w) * 3} y={61 + i * 50} fill={ink} fontSize="15">{t}</text></g>)}<Arrow d="M205 100h45"/><Line x={20} y={222}>régua que mede a mistura</Line></>}
  </Drawing>;
}
function WeberDomination({ state }: { state: number }) {
  const label = ['Assaltante e fiscal obtêm obediência', 'Patriarca, pregador e secretária', 'Laudo que exige o próprio laudo'][state];
  if (state === 1) return <Pick names={['Tradicional', 'Carismática', 'Racional-legal']}>
    {pick => <Drawing label={label}>{['patriarca', 'pregador', 'cargo'].map((w, i) => <g key={w} opacity={pick === i ? 1 : 0.35}><Box x={20 + i * 180} y={40} w={160} strong={pick === i}>{w}</Box></g>)}
      <Arrow key={pick} d={`M${100 + pick * 180} 90v40`}/><Line y={160}>{['obedece porque “sempre foi assim”', 'obedece enquanto crê no dom', 'obedece à regra, não à pessoa'][pick]}</Line>
      <Line x={20} y={222}>{['costume', 'qualidade extraordinária', 'norma impessoal'][pick]}</Line></Drawing>}
  </Pick>;
  return <Drawing label={label}>
    {state === 0 && <><Box x={20} y={40} w={200}>assaltante</Box><Box x={320} y={40} w={200} strong>fiscal da prova</Box><Line x={30} y={125}>medo: poder</Line><Line x={330} y={125}>regra: dominação</Line><Arrow d="M420 135v30"/><Line x={330} y={190}>legitimidade</Line><Line x={20} y={222}>mesmo resultado, outra razão</Line></>}
    {state === 2 && <><circle cx="280" cy="110" r="70" fill="none" stroke={ink} strokeWidth="2"/><Box x={190} y={20} w={180}>laudo</Box><Box x={190} y={160} w={180}>atendimento</Box><Arrow d="M380 50q60 60 0 130"/><Arrow d="M180 180q-60 -60 0 -130"/><Line x={20} y={222}>regra girando sobre si</Line></>}
  </Drawing>;
}
function ProtestantEthic({ state }: { state: number }) {
  const label = ['Loja aberta e lucro reinvestido', 'Cadeia da predestinação à acumulação', 'Bisneto trabalha sem fé'][state];
  if (state === 1) return <Conditions names={['Angústia da salvação', 'Vocação', 'Ascese']} verdict={on => on.every(Boolean) ? 'Elos completos: trabalho metódico, lucro não consumido, acumulação.' : !on[2] ? 'Sem ascese, o lucro é gasto em luxo: não há acumulação sistemática.' : !on[1] ? 'Sem a leitura do trabalho como vocação, o êxito não vira sinal de graça.' : 'Sem angústia, falta o impulso que leva ao trabalho metódico.'}>
    {on => <Drawing label={label}><Toggle x={20} y={30} w={160} on={on[0]}>angústia</Toggle><Toggle x={200} y={30} w={160} on={on[1]}>vocação</Toggle><Toggle x={380} y={30} w={160} on={on[2]}>ascese</Toggle><Arrow d="M100 80q180 60 360 0" active={on.every(Boolean)}/><Box x={170} y={130} w={220} strong={on.every(Boolean)}>{on.every(Boolean) ? 'acumulação' : on[2] ? 'elo rompido' : 'lucro gasto'}</Box><Line x={20} y={222}>efeito não intencional</Line></Drawing>}
  </Conditions>;
  return <Drawing label={label}>
    {state === 0 && <><Box x={20} y={40} w={200}>meio-dia: basta</Box><path d="M20 62h200" stroke={wine} strokeWidth="3"/><Arrow d="M225 62h60m-12-8 12 8-12 8"/><Box x={295} y={40} w={240} strong>aberto, reinveste</Box><Line y={150}>ganho como dever, não prazer</Line><Line x={20} y={222}>espírito ≠ ganância</Line></>}
    {state === 2 && <><Box x={20} y={40} w={200}>tecelão: fé</Box><Box x={320} y={40} w={200} strong>bisneto: mercado</Box><Arrow d="M225 62h90"/>{[40, 80, 120, 160].map(y => <path key={y} d={`M330 ${80 + y / 2}h180`} stroke={ink} strokeWidth="3"/>)}<Line x={20} y={140}>disciplina fica</Line><Line x={20} y={222}>o sentido religioso sai</Line></>}
  </Drawing>;
}
function GenderInequality({ state }: { state: number }) {
  return <Drawing label={['Bisavó sem conta e bisneta gerente', 'Mesma jornada paga e cuidado de um lado só', 'Promoção decidida depois do expediente'][state]}>
    {state === 0 && <><Box x={20} y={40} w={200}>bisavó: sem conta</Box><Box x={320} y={40} w={210} strong>bisneta: gerente</Box><Arrow d="M225 62h90"/><Line x={30} y={130}>biologia igual</Line><Line x={330} y={130}>papel outro</Line><Line x={20} y={222}>variou: foi construído</Line></>}
    {state === 1 && <>{[['ele', 1], ['ela', 2]].map(([who, blocks], r) => <g key={String(who)}><Line x={20} y={70 + r * 70}>{who}</Line>{Array.from({ length: Number(blocks) + 1 }, (_, i) => <rect key={i} x={80 + i * 150} y={45 + r * 70} width="140" height="40" fill={i === 0 ? paper : wine} stroke={ink}/>)}</g>)}<Line x={95} y={72}>emprego</Line><Line x={95} y={142}>emprego</Line><Arrow d="M230 200h300"/><Line x={20} y={222}>cuidado não pago</Line></>}
    {state === 2 && <><Box x={20} y={40} w={200}>salário igual</Box><Line x={30} y={125}>regra formal</Line><rect x="320" y="40" width="200" height="90" rx="6" fill={paper} stroke={wine} strokeWidth="3"/><Line x={335} y={75}>reunião às 19h</Line><Line x={335} y={110}>ela na escola</Line><Arrow d="M225 62h90"/><Line x={20} y={222}>formal ≠ de fato</Line></>}
  </Drawing>;
}
function PlatformWork({ state }: { state: number }) {
  const label = ['Costureira passa de registrada a peça por produção', 'Controles da plataforma sobre o entregador', 'Motorista bloqueado sem saber a regra'][state];
  if (state === 1) return <Conditions names={['Preço definido', 'Controle algorítmico', 'Bloqueio']} verdict={on => on.every(Boolean) ? 'Preço, distribuição e punição vêm da plataforma: subordinação sem vínculo.' : on.some(Boolean) ? 'Com menos controles, a autonomia anunciada fica mais próxima do real.' : 'Sem esses controles, seria trabalho autônomo de fato.'}>
    {on => <Drawing label={label}><Toggle x={20} y={30} w={160} on={on[0]}>preço</Toggle><Toggle x={200} y={30} w={160} on={on[1]}>algoritmo</Toggle><Toggle x={380} y={30} w={160} on={on[2]}>bloqueio</Toggle><Arrow d="M100 80q180 60 360 0" active={on.every(Boolean)}/><Box x={150} y={130} w={260} strong={on.every(Boolean)}>{on.every(Boolean) ? 'subordinação' : on.some(Boolean) ? 'controle parcial' : 'autônomo de fato'}</Box><Line x={20} y={222}>controle sem direitos</Line></Drawing>}
  </Conditions>;
  return <Drawing label={label}>
    {state === 0 && <><Box x={20} y={40} w={200}>fábrica, carteira</Box><Arrow d="M225 62h80m-12-8 12 8-12 8"/><Box x={315} y={40} w={220} strong>casa, por peça</Box>{['máquina', 'encomenda', 'prejuízo'].map((w, i) => <Line key={w} x={330} y={120 + i * 28}>{w}: dela</Line>)}<Line x={20} y={222}>o risco mudou de lado</Line></>}
    {state === 2 && <>{[['vínculo', 'subordinação'], ['transparência', 'controle'], ['piso por hora', 'preço']].map(([a, b], i) => <g key={a}><Box x={20} y={20 + i * 60} w={200}>{a}</Box><Arrow d={`M225 ${42 + i * 60}h80`}/><Line x={320} y={48 + i * 60}>{b}</Line></g>)}<Line x={20} y={222}>cada proposta, um elo</Line></>}
  </Drawing>;
}
function SocialMovements({ state }: { state: number }) {
  const label = ['Protesto de uma tarde e associação de anos', 'Metalúrgicos em greve e moradores pela praça', 'Protesto em rede sem liderança'][state];
  if (state === 0) return <Conditions names={['Identidade', 'Organização', 'Projeto']} verdict={on => on.every(Boolean) ? 'Identidade, organização e projeto duradouro: movimento social.' : `Falta ${['identidade', 'organização', 'projeto'].filter((_, i) => !on[i]).join(' e ')}: mobilização pontual, não movimento.`}>
    {on => <Drawing label={label}><Toggle x={20} y={30} w={160} on={on[0]}>“nós”</Toggle><Toggle x={200} y={30} w={160} on={on[1]}>reunião semanal</Toggle><Toggle x={380} y={30} w={160} on={on[2]}>orçamento</Toggle><Arrow d="M100 80q180 60 360 0" active={on.every(Boolean)}/><Box x={150} y={130} w={260} strong={on.every(Boolean)}>{on.every(Boolean) ? 'movimento social' : 'protesto de uma tarde'}</Box><Line x={20} y={222}>duração e projeto</Line></Drawing>}
  </Conditions>;
  return <Drawing label={label}>
    {state === 1 && <><Box x={20} y={30} w={230} strong>metalúrgicos</Box><Line x={30} y={110}>classe · salário</Line><Line x={30} y={140}>sindicato · greve</Line><Box x={300} y={30} w={230}>bairros e rendas</Box><Line x={310} y={110}>praça · vida urbana</Line><Line x={310} y={140}>rede de moradores</Line><Arrow d="M255 52h40"/><Line x={20} y={222}>pela demanda, não pela data</Line></>}
    {state === 2 && <>{[[80, 60], [170, 120], [260, 50], [350, 130], [440, 70]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="14" fill={wine}/>)}<Arrow d="M94 64L156 116M184 118L246 56M274 54L336 126M364 126L426 74"/><Line y={180}>muitas pautas, sem quem negocie</Line><Line x={20} y={222}>tamanho ≠ eficácia</Line></>}
  </Drawing>;
}
function DemocracyForms({ state }: { state: number }) {
  const label = ['Três maneiras de decidir sobre a praça', 'Cidade com eleição e rádio do prefeito', 'Áudio falso nos grupos de família'][state];
  if (state === 0) return <Pick names={['Direta', 'Representativa', 'Participativa']}>
    {pick => <Drawing label={label}><rect x="230" y="20" width="100" height="50" rx="6" fill={paper} stroke={ink} strokeWidth="3"/><Line x={255} y={52}>praça</Line>
      {pick === 0 && <>{[120, 180, 240, 300, 360, 420].map(x => <circle key={x} cx={x} cy="140" r="12" fill={wine}/>)}<Arrow d="M280 125V76"/></>}
      {pick === 1 && <><Box x={190} y={120} w={180} strong>Câmara</Box>{[80, 120, 440, 480].map(x => <circle key={x} cx={x} cy="140" r="10" fill={paper} stroke={ink}/>)}<Arrow d="M280 118V76"/></>}
      {pick === 2 && <><Box x={40} y={120} w={200}>plenária</Box><Box x={320} y={120} w={200} strong>prefeitura</Box><Arrow d="M245 142h70M420 118L330 72"/></>}
      <Line x={20} y={222}>{['todos votam em assembleia', 'eleitos decidem', 'cidadãos priorizam, governo executa'][pick]}</Line></Drawing>}
  </Pick>;
  if (state === 1) return <Conditions names={['Eleição regular', 'Informação plural', 'Crítica sem retaliação']} verdict={on => on.every(Boolean) ? 'Condições presentes: o voto expressa escolha informada e livre.' : !on[0] ? 'Sem eleição regular, não há sequer democracia eleitoral.' : 'Há urna, mas falta condição de efetividade: democracia apenas eleitoral.'}>
    {on => <Drawing label={label}><Toggle x={20} y={30} w={160} on={on[0]}>urna</Toggle><Toggle x={200} y={30} w={160} on={on[1]}>várias rádios</Toggle><Toggle x={380} y={30} w={160} on={on[2]}>crítica livre</Toggle><Arrow d="M100 80q180 60 360 0" active={on.every(Boolean)}/><Box x={150} y={130} w={260} strong={on.every(Boolean)}>{on.every(Boolean) ? 'escolha efetiva' : on[0] ? 'só eleitoral' : 'sem eleição'}</Box><Line x={20} y={222}>urna é necessária, não basta</Line></Drawing>}
  </Conditions>;
  return <Drawing label={label}>
    <Box x={20} y={40} w={200}>abaixo-assinado</Box><Box x={320} y={40} w={200} strong>áudio falso</Box><circle cx="270" cy="150" r="30" fill={paper} stroke={ink} strokeWidth="2"/><Line x={250} y={156}>rede</Line><Arrow d="M120 90q60 40 120 50M420 90q-60 40 -120 50"/><Line x={20} y={222}>quem controla a circulação?</Line>
  </Drawing>;
}
function GlobalizationFlows({ state }: { state: number }) {
  const label = ['Celular com etapas em vários países', 'Três respostas locais ao elemento externo', 'Soja passa, estudante espera'][state];
  if (state === 1) return <Pick names={['Homogeneização', 'Hibridismo', 'Identidade local']}>
    {pick => <Drawing label={label}><Box x={20} y={40} w={160}>de fora</Box><Arrow key={pick} d="M185 62h70"/>
      <Box x={265} y={40} w={270} strong>{['mesmo hambúrguer', 'guitarrada', 'festa tradicional'][pick]}</Box>
      <Line y={150}>{['o consumo se padroniza', 'o elemento vira outra coisa', 'o local se reafirma como reação'][pick]}</Line>
      <Line x={20} y={222}>o destino do elemento externo</Line></Drawing>}
  </Pick>;
  return <Drawing label={label}>
    {state === 0 && <>{['projeto', 'chip', 'tela', 'montagem', 'venda'].map((w, i) => <g key={w}><circle cx={60 + i * 110} cy="90" r="30" fill={i === 4 ? wine : paper} stroke={ink} strokeWidth="2"/><text x={30 + i * 110} y="150" fill={ink} fontSize="15">{w}</text></g>)}<Arrow d="M92 90h46m64 0h46m64 0h46m64 0h46"/><Line x={20} y={222}>nenhum país faz tudo</Line></>}
    {state === 2 && <><Box x={20} y={40} w={160} strong>soja</Box><Arrow d="M185 62h300"/><Line x={300} y={50}>semanas</Line><Box x={20} y={120} w={160}>estudante</Box><path d="M185 142h120" stroke={ink} strokeWidth="2"/><path d="M315 120v44" stroke={wine} strokeWidth="5"/><Line x={330} y={150}>visto</Line><Line x={20} y={222}>integra e exclui</Line></>}
  </Drawing>;
}
function NationState({ state }: { state: number }) {
  const transition = useSceneMotion();
  return <Drawing label={['Escolhas do governo estreitadas por capital e FMI', 'Empresa pede socorro ao Estado', 'Fronteira fechada e vacina global'][state]}>
    {state === 0 && <><rect x="20" y="40" width="520" height="40" fill="none" stroke={ink} strokeDasharray="5 5"/><motion.rect initial={false} animate={{ width: 220 }} transition={transition} x="170" y="40" height="40" fill={paper} stroke={wine} strokeWidth="3"/><Line x={185} y={67}>escolhas</Line><Line x={20} y={125}>capital em horas</Line><Line x={340} y={125}>FMI</Line><Arrow d="M100 110l70 -25M380 110l-20 -25"/><Line x={20} y={222}>relativizada, não extinta</Line></>}
    {state === 1 && <><Box x={20} y={40} w={220}>“menos Estado”</Box><Box x={320} y={40} w={200} strong>socorro</Box><Arrow d="M245 62h70"/><Line x={330} y={120}>contratos, moeda</Line><Line x={330} y={150}>auxílio, crédito</Line><Line x={20} y={222}>o mercado depende dele</Line></>}
    {state === 2 && <><path d="M280 30v150" stroke={wine} strokeWidth="5"/><Line x={290} y={50}>fronteira</Line>{[60, 140, 420, 500].map((x, i) => <circle key={x} cx={x} cy={90 + (i % 2) * 40} r="14" fill={paper} stroke={ink} strokeWidth="2"/>)}<Arrow d="M74 92q200 -60 332 0"/><Line x={20} y={180}>insumos de três continentes</Line><Line x={20} y={222}>escala de cada problema</Line></>}
  </Drawing>;
}

const drawings: Record<SociologyOperationId, React.ComponentType<{ state: number }>> = {
  'social-fact': SocialFact, 'solidarity-types': SolidarityTypes, 'anomie-grid': AnomieGrid, 'identity-difference': IdentityDifference,
  'mobility-grid': MobilityGrid, 'citizenship-rights': CitizenshipRights, 'information-society': InformationSociety,
  'education-socialization': EducationSocialization, 'mode-of-production': ModeOfProduction, 'ideology-alienation': IdeologyAlienation,
  'social-action-types': SocialActionTypes, 'weber-domination': WeberDomination, 'protestant-ethic': ProtestantEthic,
  'gender-inequality': GenderInequality, 'platform-work': PlatformWork, 'social-movements': SocialMovements,
  'democracy-forms': DemocracyForms, 'globalization-flows': GlobalizationFlows, 'nation-state': NationState,
};
export function SociologyOperation({ id }: { id: SociologyOperationId }) {
  return <OperationWorkshop id={id} config={SOCIOLOGY_OPERATIONS[id]} Scene={drawings[id]}
    manuscript="Aplique o conceito ao caso, não apenas o nome."
    caption="Casos didáticos autorais. Não são dados de pesquisa nem citações dos autores estudados."/>;
}
export function sociologyInstrument(id: SociologyOperationId) {
  const config = SOCIOLOGY_OPERATIONS[id];
  return function SociologyBoard(props: BoardProps) {
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell title={config.topic} kicker="Oficina de análise · sociologia" subtitle={config.question}
      condition={{ label: 'Operação', value: 'Casos autorais' }} sceneFirst
      ariaLabel={`Oficina de sociologia: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<SociologyOperation id={id}/>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? config.topic, detail: first?.excerpt ?? config.question, formula: config.relation }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? config.topic, detail: second?.excerpt ?? config.question, formula: 'caso → conceito → explicação sustentada' }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      closing="Um conceito sociológico se prova no caso, não na definição decorada."/>;
  };
}
