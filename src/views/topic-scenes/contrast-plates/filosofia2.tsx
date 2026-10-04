import React from 'react';
import type { ContrastPlate } from './types';
import { SketchArrow, SketchGroup, SketchText } from './Sketch';

const stroke = { stroke: 'currentColor', strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const wash = { fill: 'currentColor', fillOpacity: 0.06, stroke: 'currentColor', strokeWidth: 2 };
const prefix = 'summary-filosofia-';
function Person({ x, y, label }: { x: number; y: number; label?: string }) {
  return <g><circle cx={x} cy={y} r={12} {...wash} /><path d={`M${x} ${y + 12}v30m-18-17 18-7 18 7m-18 17-15 23m15-23 15 23`} {...stroke} />{label && <SketchText x={x} y={y + 88} anchor="middle">{label}</SketchText>}</g>;
}
function Clock({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r={48} {...wash} /><circle cx={x} cy={y} r={4} fill="currentColor" /><path d={`M${x} ${y - 34}v34l24 13`} {...stroke} />{[0, 90, 180, 270].map(a => <path key={a} transform={`rotate(${a} ${x} ${y})`} d={`M${x} ${y - 42}v7`} {...stroke} />)}</g>;
}

export const filosofiaPlates2: ContrastPlate[] = [
  {
    chapterId: prefix + 'os-filosofos-da-physis-tales-anaximandro-e-anaximenes',
    context: 'Uma semente cresce, o rio corre e o fogo aquece. Que princípio natural poderia explicar essa diversidade sem recorrer a genealogias de deuses?',
    annotation: 'Estas são hipóteses filosóficas antigas sobre a arché; o desenho não pretende oferecer uma explicação física atual.',
    positions: [
      { reading: 'Tales procura uma unidade material: a água seria o princípio de todas as coisas, e não apenas o ingrediente de uma planta.', focus: ['physis-water'] },
      { reading: 'Anaximandro recusa escolher um elemento determinado. O ápeiron permite pensar a origem dos contrários sem identificá-la com água, ar ou fogo.', focus: ['physis-apeiron'] },
      { reading: 'Anaxímenes escolhe o ar e acrescenta operações: rarefação e condensação explicariam diferentes formas da mesma natureza.', focus: ['physis-air'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={32} size={24}>Mileto: uma natureza, três hipóteses</SketchText>
      <SketchGroup id="physis-water" active={focus === 0}>
        <SketchText x={34} y={76} accent>Tales · água como princípio</SketchText>
        <path d="M98 98c-22 28-38 45-38 63a38 38 0 0 0 76 0c0-18-16-35-38-63Z" {...wash} />
        <path d="M78 171q20 15 38-3" {...stroke} />
        <SketchArrow d="M157 153H249" />
        <path d="M287 191v-52q-38-30-49-8 16 32 49 22m0-3q35-40 53-18-16 33-53 37M257 193h62" {...stroke} />
        <SketchText x={382} y={139}>vida e transformações</SketchText>
        <SketchText x={382} y={168}>sob uma mesma arché</SketchText>
      </SketchGroup>
      <SketchGroup id="physis-apeiron" active={focus === 1}>
        <SketchText x={34} y={235} accent>Anaximandro · ápeiron</SketchText>
        <path d="M159 257q-28-28-50 0t-43 0m0 26q25-27 47 0t48 0" {...stroke} />
        <SketchText x={37} y={323}>indeterminado</SketchText>
        <SketchArrow d="M180 269Q248 258 298 250" />
        <SketchArrow d="M180 284Q248 303 298 316" />
        <SketchText x={318} y={257}>quente / frio</SketchText>
        <SketchText x={318} y={326}>seco / úmido</SketchText>
        <SketchText x={520} y={278}>origem dos contrários</SketchText>
        <SketchText x={520} y={307}>sem ser um deles</SketchText>
      </SketchGroup>
      <SketchGroup id="physis-air" active={focus === 2}>
        <SketchText x={34} y={375} accent>Anaxímenes · mudanças do ar</SketchText>
        <SketchText x={58} y={434}>fogo</SketchText>
        <SketchText x={317} y={434}>ar</SketchText>
        <SketchText x={567} y={434}>água → terra</SketchText>
        <SketchArrow d="M298 421H132" label="rarefação" x={150} y={397} />
        <SketchArrow d="M360 421H540" label="condensação" x={388} y={397} />
      </SketchGroup>
    </>,
  },
  {
    chapterId: prefix + 'os-sofistas-e-a-crise-da-verdade',
    context: 'Na praça, Lia e Rui sentem de modo diferente o mesmo vento. Depois, precisam defender uma proposta diante da assembleia: sentir, convencer e formar cidadãos são a mesma coisa?',
    annotation: 'O vento ilustra o perspectivismo; não comprova que toda afirmação seja verdadeira. Educação paga não equivale a acesso universal.',
    positions: [
      { reading: 'Protágoras relaciona a medida à pessoa: o mesmo vento aparece frio para Lia e agradável para Rui. A experiência depende de quem percebe.', focus: ['sophists-perception'] },
      { reading: 'A crítica de Platão distingue convencer de conhecer. Aplausos para uma proposta não bastam para demonstrar que ela é justa ou verdadeira.', focus: ['sophists-argument'] },
      { reading: 'A reabilitação historiográfica examina o ensino da argumentação: ampliou a formação política antes restrita, embora o pagamento continuasse a limitar o acesso.', focus: ['sophists-education'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={33} size={24}>Na praça: percepção, persuasão e formação</SketchText>
      <SketchGroup id="sophists-perception" active={focus === 0}>
        <path d="M60 93q45-28 80 0t90 0m-175 22q55-25 105 0t110 0" {...stroke} />
        <Person x={98} y={153} /><Person x={275} y={153} />
        <SketchText x={30} y={258}>fria para Lia</SketchText>
        <SketchText x={192} y={287}>agradável para Rui</SketchText>
        <SketchText x={34} y={334}>mesmo vento</SketchText>
        <SketchText x={34} y={363}>medidas situadas</SketchText>
      </SketchGroup>
      <SketchGroup id="sophists-argument" active={focus === 1}>
        <path d="M395 169h95v107h-95zM384 279h117m-98-123 40-24 36 24" {...stroke} />
        <Person x={444} y={97} />
        <SketchText x={382} y={324}>aplausos ≠ prova</SketchText>
        <SketchText x={378} y={354}>persuadir não basta</SketchText>
        <SketchText x={390} y={389}>examinar o justo</SketchText>
      </SketchGroup>
      <SketchGroup id="sophists-education" active={focus === 2}>
        <path d="M563 83q36-11 73 0v72q-35-15-73 0Zm73 0q36-11 73 0v72q-35-15-73 0Z" {...wash} />
        <SketchText x={555} y={198}>ensinar a argumentar</SketchText>
        <SketchArrow d="M636 214V247" />
        <Person x={603} y={273} /><Person x={676} y={273} />
        <SketchText x={560} y={389}>acesso ampliado</SketchText>
        <SketchText x={560} y={422}>com barreira de preço</SketchText>
      </SketchGroup>
    </>,
  },
  {
    chapterId: prefix + 'patristica-e-santo-agostinho',
    context: 'Uma roda perdeu uma parte necessária e deixou de cumprir sua função. O defeito exige imaginar uma substância do mal, ou pode ser entendido como falta de um bem devido?',
    annotation: 'A roda é uma analogia da privação, não uma redução de todo sofrimento a falha mecânica. Fé e razão pertencem ao percurso de investigação.',
    positions: [
      { reading: 'Para Agostinho, a fé orienta a busca e a razão trabalha para compreender. A relação não elimina o exercício de perguntar e argumentar.', focus: ['augustine-faith'] },
      { reading: 'O maniqueísmo atribui o mal a um princípio real próprio em oposição ao bem. O desenho separa os dois polos dessa hipótese, que Agostinho rejeita.', focus: ['augustine-dualism'] },
      { reading: 'Na privatio boni, o mal não acrescenta uma substância: falta um bem que deveria estar presente. A parte ausente da roda torna a distinção visível.', focus: ['augustine-privation'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={32} size={24}>O mal é uma coisa ou uma privação?</SketchText>
      <SketchGroup id="augustine-faith" active={focus === 0}>
        <path d="M35 80h250v74H35z" {...wash} />
        <SketchText x={52} y={109}>fé → investigar → razão</SketchText>
        <SketchText x={52} y={137}>crer para compreender</SketchText>
        <SketchArrow d="M305 117H383" />
        <SketchText x={402} y={108}>a pergunta pelo mal</SketchText>
        <SketchText x={402} y={137}>continua sendo pensada</SketchText>
      </SketchGroup>
      <SketchGroup id="augustine-dualism" active={focus === 1}>
        <circle cx={97} cy={255} r={46} {...wash} /><circle cx={294} cy={255} r={46} {...wash} />
        <SketchText x={97} y={262} anchor="middle">bem</SketchText><SketchText x={294} y={262} anchor="middle">mal</SketchText>
        <path d="M155 246l25 20 22-20 21 20 21-20" {...stroke} />
        <SketchText x={35} y={336}>princípios em conflito</SketchText>
        <SketchText x={35} y={367}>duas realidades próprias</SketchText>
      </SketchGroup>
      <SketchGroup id="augustine-privation" active={focus === 2}>
        <path d="M565 180a82 82 0 1 1-74 47" {...stroke} /><path d="M547 210a52 52 0 1 1-29 33" {...stroke} />
        <path d="M491 227a82 82 0 0 1 74-47L547 210a52 52 0 0 0-29 33Z" stroke="currentColor" strokeWidth={2} strokeDasharray="5 7" fill="none" />
        <circle cx={570} cy={262} r={10} {...wash} />
        <path d="M570 251v-29m10 40h29m-39 10v28m-10-38h-29" {...stroke} />
        <SketchArrow d="M678 203L615 221" />
        <SketchText x={429} y={367}>bem devido ausente</SketchText>
        <SketchText x={429} y={399}>não uma substância extra</SketchText>
      </SketchGroup>
      <SketchText x={34} y={450}>Hipótese dualista ← distinção filosófica → privação do bem</SketchText>
    </>,
  },
  {
    chapterId: prefix + 'politica-aristotelica-o-homem-como-animal-politico',
    context: 'A praça precisa de água. Cidadãos deliberam sobre um reservatório: governar é organizar a vida comum ou desviar os recursos para quem manda?',
    annotation: 'A praça é um caso inventado. A classificação aristotélica cruza número de governantes e finalidade; não é um ranking de democracias atuais.',
    positions: [
      { reading: 'Zoon politikon designa a realização humana na pólis: pessoas usam o logos para deliberar sobre necessidades comuns, justiça e vida boa.', focus: ['aristotle-community'] },
      { reading: 'A politeia combina participação e regras orientadas ao bem comum. A destinação do reservatório importa mais que apenas contar quem governa.', focus: ['aristotle-common'] },
      { reading: 'A degeneração ocorre quando o governo serve ao interesse do governante. O recurso público desviado explicita a mudança de finalidade.', focus: ['aristotle-private'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={32} size={24}>Pólis: a finalidade muda a forma de governar</SketchText>
      <SketchGroup id="aristotle-community" active={focus === 0}>
        <path d="M41 171q110-150 221 0" {...stroke} />
        <Person x={73} y={112} /><Person x={147} y={82} /><Person x={220} y={112} />
        <SketchText x={34} y={247}>logos: deliberar juntos</SketchText>
        <SketchText x={34} y={281}>sobre justo e injusto</SketchText>
        <SketchText x={34} y={343}>a vida política integra</SketchText>
        <SketchText x={34} y={374}>a realização humana</SketchText>
      </SketchGroup>
      <path d="M330 87h90v92h-90zM340 121q35 18 70 0m-70 19q35 18 70 0" {...wash} />
      <SketchText x={316} y={210}>recurso da pólis</SketchText>
      <SketchGroup id="aristotle-common" active={focus === 1}>
        <SketchArrow d="M370 232V269L323 305" />
        <path d="M284 350h140m-130-18v-35h120v35m-105-35v35m45-35v35m45-35v35" {...stroke} />
        <SketchText x={277} y={386}>bem comum</SketchText>
        <SketchText x={277} y={417}>água à comunidade</SketchText>
      </SketchGroup>
      <SketchGroup id="aristotle-private" active={focus === 2}>
        <SketchArrow d="M430 137H578" />
        <path d="M571 260V169l58-42 58 42v91ZM584 181h21v29h-21zm68 0h21v29h-21zm-38 38h32v41" {...wash} />
        <SketchText x={479} y={313}>interesse do governante</SketchText>
        <SketchText x={512} y={345}>recurso desviado</SketchText>
        <SketchText x={512} y={406}>mudou a finalidade</SketchText>
      </SketchGroup>
    </>,
  },
  {
    chapterId: prefix + 'racionalismo-continental-espinosa-e-leibniz',
    context: 'Dois relógios marcam a mesma hora. A concordância exige troca de sinais? A analogia ajuda a distinguir unidade de substância e pluralidade coordenada.',
    annotation: 'Os relógios representam a harmonia por analogia; mônadas não são máquinas materiais. Nenhuma seta conecta causalmente uma mônada à outra.',
    positions: [
      { reading: 'Espinosa concebe uma única substância, Deus ou Natureza. Corpos e pensamentos são expressões dessa realidade, e não substâncias externas ligadas por fios.', focus: ['rationalism-substance'] },
      { reading: 'Leibniz concebe múltiplas mônadas sem interação causal direta. O desenho preserva o intervalo entre unidades para evitar uma falsa transmissão de sinais.', focus: ['rationalism-monads'] },
      { reading: 'Na harmonia preestabelecida, a concordância depende da coordenação divina originária. Relógios ajustados previamente ilustram concordar sem trocar mensagens.', focus: ['rationalism-harmony'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={32} size={24}>Unidade da Natureza ou pluralidade coordenada?</SketchText>
      <SketchGroup id="rationalism-substance" active={focus === 0}>
        <path d="M43 134q-15-63 108-59t131 104q8 85-94 110T43 134Z" {...wash} />
        <SketchText x={70} y={115}>uma substância</SketchText>
        <circle cx={107} cy={174} r={23} {...stroke} /><path d="M171 154h41v42h-41zM83 225q65-23 139 0" {...stroke} />
        <SketchText x={55} y={336}>corpos / pensamentos</SketchText>
        <SketchText x={55} y={369}>modos da mesma realidade</SketchText>
        <SketchText x={55} y={420}>Deus ou Natureza</SketchText>
      </SketchGroup>
      <SketchGroup id="rationalism-monads" active={focus === 1}>
        <SketchText x={358} y={91}>mônadas distintas</SketchText>
        <Clock x={426} y={179} /><Clock x={644} y={179} />
        <SketchText x={426} y={253} anchor="middle">unidade A</SketchText>
        <SketchText x={644} y={253} anchor="middle">unidade B</SketchText>
        <SketchText x={358} y={304}>sem transmissão causal</SketchText>
      </SketchGroup>
      <SketchGroup id="rationalism-harmony" active={focus === 2}>
        <path d="M386 349v20h298v-20" {...stroke} />
        <SketchText x={404} y={410}>coordenação prévia</SketchText>
        <SketchText x={359} y={444}>mesma hora sem enviar sinais</SketchText>
      </SketchGroup>
    </>,
  },
  {
    chapterId: prefix + 'etica-aplicada-e-bioetica',
    context: 'Um paciente capaz e informado recusa um procedimento com benefício esperado. A equipe precisa considerar sua decisão e o cuidado, sem transformar um princípio em resposta automática.',
    annotation: 'Caso esquemático, sem prescrição clínica. Capacidade, informação, riscos, alternativas e contexto alteram a deliberação concreta.',
    positions: [
      { reading: 'Autonomia requer capacidade e informação: compreender riscos e alternativas torna a decisão diferente de uma recusa desinformada ou coagida.', focus: ['bioethics-consent'] },
      { reading: 'Beneficência obriga a buscar o bem-estar do paciente. O benefício esperado precisa ser avaliado junto aos riscos, e não presumido só porque há tratamento.', focus: ['bioethics-benefit'] },
      { reading: 'O conflito aparece quando promover o benefício sugeriria tratar, mas a decisão informada pede não realizar o procedimento. Deliberar exige ouvir, avaliar e justificar.', focus: ['bioethics-conflict'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={32} size={24}>Decidir sobre o cuidado: princípios em tensão</SketchText>
      <SketchGroup id="bioethics-consent" active={focus === 0}>
        <Person x={102} y={102} />
        <path d="M42 227h130v124H42zM62 251h91m-91 25h74m-74 25h81" {...wash} />
        <SketchText x={35} y={389}>recusa informada</SketchText>
        <SketchText x={35} y={423}>capacidade + compreensão</SketchText>
      </SketchGroup>
      <SketchGroup id="bioethics-benefit" active={focus === 1}>
        <path d="M591 91h104v82H591zM626 101h33v24h24v22h-24v18h-33v-18h-23v-22h23z" {...wash} />
        <SketchText x={536} y={230}>benefício esperado</SketchText>
        <SketchText x={536} y={263}>riscos e alternativas</SketchText>
        <SketchText x={535} y={298}>dever de cuidar</SketchText>
      </SketchGroup>
      <SketchGroup id="bioethics-conflict" active={focus === 2}>
        <SketchArrow d="M199 285L315 247" /><SketchArrow d="M529 246H442" />
        <path d="M319 203h113v81H319z" {...wash} />
        <SketchText x={375} y={236} anchor="middle">tratar?</SketchText>
        <SketchText x={375} y={267} anchor="middle">não tratar?</SketchText>
        <SketchArrow d="M375 302V348" />
        <SketchText x={294} y={384}>ouvir e justificar</SketchText>
        <SketchText x={294} y={418}>sem resposta automática</SketchText>
      </SketchGroup>
    </>,
  },
  {
    chapterId: prefix + 'alienacao-e-mais-valia',
    context: 'Modelo de uma jornada: quatro horas repõem o valor da força de trabalho, e quatro produzem excedente. Compare prolongar a jornada e reduzir o tempo necessário.',
    annotation: 'Esquema com a mesma escala horária; base de 8 h. Não é contabilidade de uma empresa. Mais-valia não equivale diretamente ao lucro líquido.',
    positions: [
      { reading: 'Mais-valia absoluta: mantendo quatro horas necessárias, alongar a jornada de oito para dez horas eleva o excedente de quatro para seis horas.', focus: ['surplus-absolute'] },
      { reading: 'Mais-valia relativa: na mesma jornada de oito horas, reduzir de quatro para duas horas o tempo necessário aumenta o excedente para seis. O modelo supõe barateamento dos bens que repõem a força de trabalho.', focus: ['surplus-relative'] },
      { reading: 'Nos dois casos, o trabalho excedente gera valor apropriado pelo capitalista. A divisão é analítica: ninguém passa a produzir objetos pessoais ao terminar as horas necessárias.', focus: ['surplus-structure'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={32} size={24}>Mesma escala de horas, duas operações</SketchText>
      <SketchText x={30} y={83}>base: 8 h</SketchText>
      <rect x={235} y={60} width={176} height={34} {...wash} /><rect x={411} y={60} width={176} height={34} {...stroke} />
      <SketchText x={242} y={122}>4 h necessárias</SketchText><SketchText x={423} y={122}>4 h excedentes</SketchText>
      <SketchGroup id="surplus-absolute" active={focus === 0}>
        <SketchText x={30} y={185} accent>absoluta: 10 h</SketchText>
        <rect x={235} y={162} width={176} height={36} {...wash} /><rect x={411} y={162} width={264} height={36} {...stroke} />
        <path d="M587 154v52" stroke="currentColor" strokeWidth={2} strokeDasharray="4 5" />
        <SketchText x={238} y={231}>necessário: 4 h</SketchText><SketchText x={438} y={231}>excedente: 6 h</SketchText>
        <SketchText x={590} y={267}>+2 h de jornada</SketchText>
      </SketchGroup>
      <SketchGroup id="surplus-relative" active={focus === 1}>
        <SketchText x={30} y={315} accent>relativa: 8 h</SketchText>
        <rect x={235} y={292} width={88} height={36} {...wash} /><rect x={323} y={292} width={264} height={36} {...stroke} />
        <path d="M411 284v52" stroke="currentColor" strokeWidth={2} strokeDasharray="4 5" />
        <SketchText x={236} y={366}>necessário: 2 h</SketchText><SketchText x={435} y={366}>excedente = 6 h</SketchText>
      </SketchGroup>
      <SketchGroup id="surplus-structure" active={focus === 2}>
        <SketchArrow d="M541 377V403" />
        <SketchText x={35} y={433}>valor excedente apropriado pelo capitalista</SketchText>
        <SketchText x={35} y={461}>Tempo necessário: reproduz o valor da força de trabalho</SketchText>
      </SketchGroup>
    </>,
  },
  {
    chapterId: prefix + 'foucault-e-as-relacoes-de-poder',
    context: 'Uma escola combina regras, exames, registros e expectativas. O poder aparece só na ordem do diretor ou também nas práticas que classificam e formam estudantes?',
    annotation: 'A rede é um recorte ilustrativo. Foucault não nega leis e proibições: mostra que elas não esgotam as relações e os efeitos produtivos do poder.',
    positions: [
      { reading: 'O modelo jurídico privilegia um centro que manda e proíbe. A ordem sai do diretor para o aluno, oferecendo uma imagem de poder como posse e comando.', focus: ['foucault-prohibition'] },
      { reading: 'O poder relacional atravessa professor, avaliação, colega e estudante. Relações se articulam e podem ser contestadas; não dependem de um único emissor.', focus: ['foucault-network'] },
      { reading: 'O poder produtivo fabrica classificações e comportamentos reconhecidos como normais. O boletim e as rotinas produzem sujeitos, além de impedir atos.', focus: ['foucault-production'] },
    ],
    illustration: focus => <>
      <SketchText x={28} y={32} size={24}>Na escola: comando, rede e produção de normas</SketchText>
      <SketchGroup id="foucault-prohibition" active={focus === 0}>
        <path d="M39 75h177v56H39z" {...wash} /><SketchText x={68} y={111}>direção / lei</SketchText>
        <SketchArrow d="M127 144V203" label="proibir" x={144} y={178} />
        <Person x={125} y={235} />
        <SketchText x={37} y={365}>ordem de um centro</SketchText>
        <SketchText x={37} y={399}>ênfase na repressão</SketchText>
      </SketchGroup>
      <SketchGroup id="foucault-network" active={focus === 1}>
        <path d="M405 100 329 214l155 27-79-141m-76 114 50 99 105-72m-105 72 26-213" {...stroke} />
        {[{x:405,y:100},{x:329,y:214},{x:484,y:241},{x:379,y:313}].map(p => <circle key={p.y} cx={p.x} cy={p.y} r={13} {...wash} />)}
        <SketchText x={356} y={74}>professor</SketchText>
        <SketchText x={270} y={184}>exame</SketchText>
        <SketchText x={470} y={213}>colega</SketchText>
        <SketchText x={337} y={355}>estudante</SketchText>
        <SketchText x={273} y={403}>relações capilares</SketchText>
      </SketchGroup>
      <SketchGroup id="foucault-production" active={focus === 2}>
        <path d="M575 75h131v176H575zM593 105h93m-93 27h71m-71 27h86m-86 27h57m-57 27h81" {...wash} />
        <SketchText x={582} y={285}>classificar</SketchText>
        <SketchArrow d="M642 300V340" />
        <SketchText x={568} y={375}>normalizar</SketchText>
        <SketchText x={559} y={412}>formar condutas</SketchText>
      </SketchGroup>
      <SketchText x={32} y={461}>Proibir não esgota o poder: saberes e sujeitos também são produzidos.</SketchText>
    </>,
  },
];
