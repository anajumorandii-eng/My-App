import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import { useSceneMotion } from '../topic-scenes/useSceneMotion';
import { Arrow, Box, Drawing, Line, OperationWorkshop, type Foundation } from './LiteratureFoundations';

/** Sociologia aplica o conceito a um caso. A auditoria apontou, nestes sete
 *  capítulos, cartões e grades que só trocavam rótulo ou veredito: aqui cada
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
} satisfies Record<string, Foundation>;
export type SociologyOperationId = keyof typeof SOCIOLOGY_OPERATIONS;

const ink = 'var(--vs-ink)', wine = 'var(--vs-burgundy)', paper = 'var(--vs-paper)';

function Conditions({ names, verdict }: { names: string[]; verdict: (on: boolean[]) => string }) {
  const [on, setOn] = useState(names.map(() => true));
  return <div className="lf-conditions" role="group" aria-label="Condições do caso">
    {names.map((name, i) => <button key={name} type="button" className="lf-inline-control" aria-pressed={on[i]} onClick={() => setOn(on.map((v, j) => j === i ? !v : v))}>{name}</button>)}
    <p className="lf-verdict" role="status">{verdict(on)}</p>
  </div>;
}

function SocialFact({ state }: { state: number }) {
  return <div>{state === 0 && <Conditions names={['Exterioridade', 'Coerção', 'Generalidade']} verdict={on => on.every(Boolean) ? 'Os três traços presentes: fato social.' : `Falta ${['exterioridade', 'coerção', 'generalidade'].filter((_, i) => !on[i]).join(' e ')}: não é fato social, é outra coisa (hábito, gosto, escolha).`}/>}
    <Drawing label={['Uniforme anterior, advertência e uso comum', 'Indicadores observáveis no lugar de motivos individuais', 'Transgressão punida em toda sociedade'][state]}>
      {state === 0 && <><Box x={20} y={30} w={160}>antes de Lia</Box><Box x={200} y={30} w={160}>advertência</Box><Box x={380} y={30} w={160}>todos usam</Box><Arrow d="M100 80q180 70 360 0"/><Line y={170}>exterior · coercitivo · geral</Line><Line x={20} y={222}>os três juntos, não um só</Line></>}
      {state === 1 && <><Box x={20} y={40} w={200}>humor de cada noivo</Box><path d="M20 62h200" stroke={wine} strokeWidth="3"/><Arrow d="M225 62h60m-12-8 12 8-12 8"/><Box x={295} y={40} w={230} strong>idade, renda, leis</Box><Line y={150}>comparar grupos e períodos</Line><Line x={20} y={222}>o social pelo social</Line></>}
      {state === 2 && <>{[40, 140, 240, 340, 440].map(x => <g key={x}><rect x={x} y="60" width="70" height="50" fill={paper} stroke={ink}/><circle cx={x + 35} cy="85" r="8" fill={wine}/></g>)}<Arrow d="M40 140h470"/><Line y={180}>regular em todas: normal no tipo social</Line><Line x={20} y={222}>normal ≠ desejável</Line></>}
    </Drawing></div>;
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
  return <div>{state === 2 && <Conditions names={['Reconhecimento', 'Redistribuição']} verdict={on => on.every(Boolean) ? 'As duas dimensões presentes: a injustiça é enfrentada por inteiro.' : on[0] ? 'Só reconhecimento: a cultura é celebrada e a sala segue sem laboratório.' : on[1] ? 'Só redistribuição: o laboratório chega, mas o desrespeito à cultura do bairro permanece.' : 'Nenhuma dimensão: diferença e desigualdade seguem intactas.'}/>}
    <Drawing label={['Paulista em Recife', 'Sotaque vira motivo de recusa', 'Cultura celebrada e sala sem laboratório'][state]}>
      {state === 0 && <><Box x={20} y={60} w={140}>São Paulo</Box><Box x={380} y={60} w={140}>Recife</Box><Arrow d="M165 82h210m-12-8 12 8-12 8"/><Line x={200} y={140}>“sou paulista”</Line><Line x={20} y={222}>a identidade aparece no contraste</Line></>}
      {state === 1 && <><Box x={20} y={50} w={150}>sotaque</Box><Arrow d="M175 72h80m-12-8 12 8-12 8"/><Box x={265} y={50} w={250} strong>vaga recusada</Box><Line y={150}>diferença usada como critério</Line><Line x={20} y={222}>diferença → desigualdade</Line></>}
      {state === 2 && <><Box x={20} y={50} w={230}>festa da cultura</Box><Box x={290} y={50} w={230} strong>sala sem laboratório</Box><Arrow d="M135 110q140 50 270 0"/><Line y={180}>reconhecer + redistribuir</Line><Line x={20} y={222}>faltando um, fica pela metade</Line></>}
    </Drawing></div>;
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
  return <div>{state === 0 && <Conditions names={['Conexão', 'Dispositivo e qualidade', 'Uso crítico']} verdict={on => on.every(Boolean) ? 'As três camadas presentes: inclusão digital efetiva.' : !on[0] ? 'Sem conexão: exclusão total, as outras camadas nem chegam a contar.' : `Há conexão, mas falta ${['', 'dispositivo e qualidade', 'uso crítico'].filter((_, i) => i > 0 && !on[i]).join(' e ')}: a inclusão fica incompleta.`}/>}
    <Drawing label={['Um celular para três irmãos com internet', 'Notícia circula antes do jornal da noite', 'Feed ordenado por engajamento'][state]}>
      {state === 0 && <><rect x="40" y="50" width="60" height="100" rx="10" fill={paper} stroke={wine} strokeWidth="3"/>{[180, 270, 360].map(x => <circle key={x} cx={x} cy="100" r="22" fill={paper} stroke={ink} strokeWidth="2"/>)}<Arrow d="M105 100h50"/><Line x={150} y={170}>três aulas, um aparelho</Line><Line x={20} y={222}>conexão não basta</Line></>}
      {state === 1 && <>{[[60, 60], [200, 140], [320, 50], [460, 130]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r="14" fill={wine}/>)}<Arrow d="M74 62L186 136M214 138L306 54M334 52L446 126"/><Line y={190}>antes do jornal da noite</Line><Line x={20} y={222}>circulação em rede</Line></>}
      {state === 2 && <><Box x={20} y={30} w={260} strong>mais engajamento ↑</Box><Box x={20} y={90} w={260}>mais verdadeiro ↓</Box><Arrow d="M300 60q60 40 0 80"/><Line x={330} y={110}>critério oculto</Line><Line x={20} y={222}>algoritmo não é neutro</Line></>}
    </Drawing></div>;
}

const drawings: Record<SociologyOperationId, React.ComponentType<{ state: number }>> = {
  'social-fact': SocialFact, 'solidarity-types': SolidarityTypes, 'anomie-grid': AnomieGrid, 'identity-difference': IdentityDifference,
  'mobility-grid': MobilityGrid, 'citizenship-rights': CitizenshipRights, 'information-society': InformationSociety,
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
