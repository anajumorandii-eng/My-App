import React from 'react';
import {motion,useReducedMotion} from 'motion/react';
import type {GrammarInstrumentId} from '../../lib/grammarInstrumentLab';
const ink='var(--vs-ink)',red='var(--vs-burgundy)',blue='var(--vs-blue)',paper='var(--vs-paper)';
export const grammarApplicationIds=new Set<GrammarInstrumentId>(['language-system','text-type','adverb-circumstance','word-formation','verb-syntax','government','pronoun-reference','verbal-voice','adverbial-clause','clause-relations','lexical-context','comma-scope','noun-class','verbal-aspect','clause-punctuation','adjective-clause']);
function T({x=380,y,children,size=18,color=ink,anchor='middle'}:{x?:number;y:number;children:React.ReactNode;size?:number;color?:string;anchor?:'start'|'middle'|'end'}){return <text x={x} y={y} fontSize={size} fill={color} fontFamily="Kalam,cursive" textAnchor={anchor}>{children}</text>;}
function Line({d,color=ink,dash=false}:{d:string;color?:string;dash?:boolean}){return <path d={d} stroke={color} strokeWidth={2} fill="none" strokeDasharray={dash?'5 5':undefined}/>;}
function Arrow({d}:{d:string}){const reduced=useReducedMotion();return <g><path d={d} fill="none" stroke={blue} strokeWidth={3} markerEnd="url(#grammar-application-arrow)"/><motion.path d={d} fill="none" stroke={red} strokeWidth={1} initial={false} animate={{opacity:1}} transition={{duration:reduced?0:.25}}/></g>;}
function Person({x,y}:{x:number;y:number}){return <g fill="none" stroke={ink} strokeWidth={2}><circle cx={x} cy={y} r={10}/><path d={`M${x} ${y+10}v30m-15-16 15-10 15 10m-15 16-12 22m12-22 12 22`}/></g>;}
function Title({children}:{children:React.ReactNode}){return <T x={36} y={38} anchor="start" size={22} color={red}>{children}</T>;}
export function GrammarApplication({id}:{id:GrammarInstrumentId}){
 let scene:React.ReactNode=null;
 switch(id){
 case 'language-system':scene=<><Title>Língua, norma e adequação: três perguntas diferentes</Title>
 <Person x={78} y={109}/><Person x={135} y={109}/><Line d="M44 82H212V177H44Z"/><T x={128} y={204}>conversa próxima</T><T x={128} y={236}>“A gente chegou.”</T>
 <Arrow d="M237 147H308"/><T x={380} y={104}>mesma intenção</T><T x={380} y={141}>dizer quem chegou</T><T x={380} y={197} color={blue}>adequação</T><Arrow d="M453 147H522"/>
 <Line d="M551 78H708V178H551Z M573 104h111m-111 25h95m-95 25h111"/><T x={630} y={204}>relatório institucional</T><T x={630} y={236}>“Nós chegamos.”</T>
 <T y={287}>norma-padrão: referência codificada; norma culta: usos de falantes escolarizados</T><T y={322}>Língua contém variedades e regras; adequar não é substituir toda a língua.</T><T y={357} color={red}>Preferência institucional não mede inteligência nem valor do falante.</T></>;break;
 case 'text-type':scene=<><Title>Do exemplo concreto à tese: explicite a ponte</Title>
 <Line d="M45 113h134v84H45Z M61 131h25v25H61Z M112 131h45v43H112Z"/><T x={112} y={84}>escola de Ana</T><T x={112} y={228}>tem laboratório</T>
 <Line d="M244 113h134v84H244Z M260 131h25v25H260Z M305 140l40 28m0-28-40 28"/><T x={312} y={84}>escola de Bento</T><T x={312} y={228}>sem laboratório</T>
 <Arrow d="M402 157H489"/><T x={595} y={113}>conceito: acesso</T><T x={595} y={146}>a recursos escolares</T><T x={595} y={193} color={blue}>diferença concreta →</T><T x={595} y={226}>desigualdade de oportunidades</T>
 <T y={282}>Tese proporcional: distribuir recursos pode ampliar condições de aprendizagem.</T><T y={318}>Um atraso isolado não prova todos os atrasos por falta de transporte.</T><T y={354} color={red}>Exemplo ilustra; a generalização precisa de evidência e critério.</T></>;break;
 case 'adverb-circumstance':scene=<><Title>Posição escolhe o escopo; modalização avalia o dito</Title>
 <T x={38} y={104} anchor="start" size={22}>Só Ana revisou os relatórios.</T><Line d="M38 114H109V130H176V114" color={red}/><T x={480} y={104}>exclui outros revisores</T><Arrow d="M326 104H359"/>
 <T x={38} y={190} anchor="start" size={22}>Ana só revisou os relatórios.</T><Line d="M81 202H330" color={red}/><T x={504} y={189}>exclui outras ações</T><Arrow d="M350 190H380"/>
 <T x={38} y={274} anchor="start">Provavelmente, Ana chegará.</T><Line d="M38 288H174" color={blue}/><T x={493} y={274}>modalização: grau de certeza</T>
 <T y={338}>“Aqui” situa; “rapidamente” caracteriza o modo; “só” delimita o foco.</T><T y={370} color={red}>Interprete o alcance no contexto: classe gramatical não decide tudo.</T></>;break;
 case 'word-formation':scene=<><Title>Quatro operações: veja o que se conserva e o que muda</Title>
 <T x={202} y={88} color={blue}>justaposição</T><T x={564} y={88} color={blue}>aglutinação</T>
 <T x={202} y={125}>passa + tempo</T><Arrow d="M202 140V171"/><T x={202} y={203} size={22}>passatempo</T><Line d="M123 214H282"/><T x={202} y={243}>formas preservadas</T>
 <T x={564} y={125}>plano + alto</T><Arrow d="M564 140V171"/><T x={564} y={203} size={22}>planalto</T><Line d="M488 214H642" color={red}/><T x={564} y={243}>alteração na união</T>
 <T x={202} y={294}>fotografia → foto</T><Line d="M156 310H248"/><T x={202} y={339}>abreviação: encurtamento</T>
 <T x={564} y={294}>pescar → pesca</T><Line d="M514 310H614"/><T x={564} y={339}>regressiva: nome de ação</T>
 <T y={377}>Hífen não decide o processo. Infelizmente: in- + feliz + -mente, por etapas.</T></>;break;
 case 'verb-syntax':scene=<><Title>Uma ação pode trazer uma segunda predicação</Title>
 <T y={94} size={22}>Os técnicos chegaram cansados.</T><Line d="M127 110H270m87 0h128m40 0h119"/><T x={202} y={143}>sujeito</T><T x={421} y={143}>evento</T><T x={586} y={143}>estado do sujeito</T>
 <Arrow d="M585 169Q583 228 203 228V171"/><T y={263} color={blue}>chegaram + estavam cansados → predicado verbo-nominal</T>
 <T y={307} size={22}>O júri considerou a proposta viável.</T><Line d="M363 320H518m32 0h79"/><Arrow d="M593 330Q594 356 445 356V333"/>
 <T y={389}>viável: predicativo do objeto “a proposta”, conteúdo da avaliação</T></>;break;
 case 'government':scene=<><Title>A preposição acompanha o relativo e a acepção do verbo</Title>
 <T x={40} y={92} anchor="start">Conheci o pesquisador.</T><T x={40} y={128} anchor="start">A equipe depende de alguém.</T><Arrow d="M342 112H407"/>
 <T x={575} y={91}>o pesquisador</T><T x={575} y={128} color={red}>de quem a equipe depende</T><Line d="M441 143H710" color={blue}/>
 <T y={194}>Reconstrua: a equipe depende do pesquisador → depende de + quem.</T>
 <T x={192} y={251} size={22}>aspirar o aroma</T><T x={192} y={285}>inalar → objeto sem preposição</T>
 <T x={565} y={251} size={22}>aspirar ao cargo</T><T x={565} y={285}>desejar → a + o, na norma-padrão</T><Line d="M375 223V305"/>
 <T y={350}>A acepção orienta a regência; a preposição não pertence ao antecedente.</T></>;break;
 case 'pronoun-reference':scene=<><Title>O pronome também tem caso e posição na construção</Title>
 <T x={188} y={102} size={22}>Eu enviei o arquivo.</T><T x={188} y={151}>Eu: sujeito → caso reto</T>
 <T x={560} y={102} size={22}>Ela me chamou.</T><T x={560} y={151}>me: objeto → caso oblíquo</T><Line d="M376 79V165"/>
 <T y={216} size={22}>Não me enviaram o arquivo.</T><Line d="M218 230H290" color={red}/><Arrow d="M257 245Q314 284 351 245"/>
 <T y={308} color={blue}>negação atrai o pronome → próclise na norma-padrão</T><T y={349}>Não enviaram-no...: posição inadequada neste contexto formal.</T><T y={381}>Caso, colocação e referente são decisões distintas; o registro importa.</T></>;break;
 case 'verbal-voice':scene=<><Title>O mesmo “se” pode organizar estruturas diferentes</Title>
 <T x={202} y={98} size={22}>Apagam-se arquivos.</T><Arrow d="M202 115V160"/><T x={202} y={194}>Arquivos são apagados.</T><T x={202} y={233}>passiva sintética</T><T x={202} y={269}>arquivos: sujeito paciente</T><T x={202} y={309}>plural → apagam-se</T>
 <T x={565} y={98} size={22}>Trabalha-se com arquivos.</T><Arrow d="M565 115V160"/><T x={565} y={194}>quem trabalha não é identificado</T><T x={565} y={233}>se indetermina o sujeito</T><T x={565} y={269}>com arquivos: não é objeto direto</T><T x={565} y={309}>singular → trabalha-se</T><Line d="M380 83V326"/>
 <T y={370} color={red}>O teste de passiva depende da estrutura, não da quantidade de arquivos.</T></>;break;
 case 'adverbial-clause':scene=<><Title>Causa e consequência: a direção da relação importa</Title>
 <T y={94} size={22}>A chuva foi tão forte que alagou a rua.</T><Line d="M257 110H293m170 0h128" color={red}/>
 <T x={198} y={176}>intensidade da chuva</T><T x={582} y={176}>alagamento</T><Arrow d="M326 174H463"/>
 <T y={224} color={blue}>tão... que → consequência da intensidade; oração consecutiva</T>
 <T y={288}>Como a chuva foi forte, a rua alagou.</T><Line d="M172 301H397"/><T y={337}>“Como...” apresenta a causa; o alagamento permanece o resultado.</T><T y={377}>Concessão: apesar da chuva forte, a rua não alagou → expectativa contrariada.</T></>;break;
 case 'clause-relations':scene=<><Title>Justificar uma orientação ≠ explicar a causa de um fato</Title>
 <T x={36} y={99} anchor="start" size={22}>Feche a janela, pois está ventando.</T><Line d="M36 115H180" color={red}/><T x={36} y={155} anchor="start">“pois...” explica a orientação</T>
 <T x={36} y={218} anchor="start" size={22}>Vim cedo porque a reunião começava às oito.</T><Line d="M147 234H700" color={blue}/><T x={36} y={275} anchor="start">“porque...” apresenta causa do fato de vir cedo</T>
 <Arrow d="M662 126Q710 158 662 190"/><T y={339}>No primeiro caso, a razão justifica o ato de orientar; no segundo, o evento.</T><T y={375} color={red}>A leitura contextual orienta explicativa × causal; não basta memorizar conectivo.</T></>;break;
 case 'lexical-context':scene=<><Title>Palavras em rede: inclusão, aproximação e oposição</Title>
 <path d="M30 95H288V282H30Z" fill="none" stroke={blue} strokeWidth={2}/><T x={160} y={129} size={22}>flor · hiperônimo</T><path d="M77 177H243V243H77Z" fill="none" stroke={red} strokeWidth={2}/><T x={160} y={217}>rosa · hipônimo</T>
 <T x={522} y={119} color={blue}>sinônimos no contexto</T><T x={522} y={164}>casa ↔ residência</T><Line d="M375 178H671"/>
 <T x={522} y={219} color={red}>antônimos</T><T x={522} y={264}>claro ↔ escuro</T>
 <T y={331}>Aproximação não é equivalência universal: “casa de máquinas” ≠ “residência”.</T><T y={369}>Banco tem sentidos selecionados pelo contexto; a relação lexical é outra pergunta.</T></>;break;
 case 'comma-scope':scene=<><Title>Vírgula delimita estruturas; não é só pausa da voz</Title>
 <T y={100} size={22}>Ana, revise o relatório!</T><Line d="M262 116H306" color={red}/><Arrow d="M280 127V167"/><T y={205}>Ana: vocativo → chamamento isolado pela vírgula</T>
 <T y={263} size={22}>As alunas da turma revisaram o relatório.</T><Line d="M145 279H385m29 0h209" color={blue}/><T x={262} y={318}>sujeito</T><T x={542} y={318}>predicado</T>
 <T y={366} color={red}>não separar sujeito e verbo por vírgula, mesmo com sujeito extenso</T></>;break;
 case 'verbal-aspect':scene=<><Title>A mesma forma pode marcar fonte ou condição</Title>
 <T x={36} y={93} anchor="start">O conselho teria aprovado a medida,</T><T x={36} y={128} anchor="start">segundo uma funcionária.</T><Line d="M36 141H270" color={blue}/><Arrow d="M352 125H410"/><T x={576} y={100} color={blue}>fonte: informação atribuída</T><T x={576} y={136}>sem confirmação do narrador</T>
 <T x={36} y={213} anchor="start">O conselho teria aprovado a medida</T><T x={36} y={248} anchor="start">se houvesse quórum.</T><Line d="M36 261H226" color={red}/><Arrow d="M352 245H410"/><T x={576} y={225} color={red}>condição para a aprovação</T><T x={576} y={261}>evento não afirmado como ocorrido</T>
 <T y={329}>Futuro do pretérito composto: teria + particípio, nas duas construções.</T><T y={368}>A expressão de fonte e a oração condicional orientam efeitos diferentes.</T></>;break;
 case 'clause-punctuation':scene=<><Title>Delimite a oração, preservando os vínculos sintáticos</Title>
 <T y={96} size={20}>Se o pedido chegar hoje, a equipe responderá amanhã.</T><Line d="M138 114H356m26 0h240" color={blue}/><T x={249} y={151}>adverbial anteposta</T><T x={512} y={151}>oração principal</T><T y={194} color={red}>vírgula marca a fronteira entre circunstância e principal</T>
 <T y={253} size={20}>A equipe informou que os pedidos serão analisados.</T><Line d="M228 266H300m22 0h310"/><T x={263} y={303}>verbo</T><T x={478} y={303}>oração objetiva: complemento</T>
 <T y={351}>Não inserir dois-pontos entre informou e sua oração objetiva.</T><T y={384}>A pontuação organiza unidades; não rompe toda ligação para destacar palavras.</T></>;break;
 case 'adjective-clause':scene=<><Title>“Cujo” liga posse, concordância e regência</Title>
 <T x={142} y={104} size={22}>a artista</T><T x={377} y={104} size={22}>pinturas</T><T x={615} y={104} size={22}>gosto de</T><Arrow d="M205 108H299"/><T x={259} y={149}>posse</T><Arrow d="M609 127Q599 192 385 192"/><T x={591} y={220}>exigência do verbo</T>
 <T y={263} size={24}>a artista de cujas pinturas gosto</T><Line d="M270 278H419" color={red}/><T y={317}>cujas concorda com pinturas: feminino plural; sem artigo depois</T><T y={359}>Reconstrua: gosto de pinturas da artista → de cujas pinturas.</T><T y={388}>A preposição vem da oração relativa; o possuidor é retomado por cujo.</T></>;break;
 case 'noun-class':scene=<><Title>O nome escolhido também constrói uma perspectiva</Title>
 {[230,280,330,380,430,480,530].map((x,i)=><Person key={x} x={x} y={104+(i%2)*9}/>)}
 <Arrow d="M327 173L182 225"/><Arrow d="M436 173L577 225"/>
 <T x={182} y={266} size={22}>manifestantes</T><T x={182} y={305}>nomeia participação num protesto</T>
 <T x={577} y={266} size={22}>baderneiros</T><T x={577} y={305}>avaliação negativa do grupo</T>
 <T y={366}>Mesmo grupo representado: mudar o nome altera o recorte, não prova o rótulo.</T></>;break;
 }
 if(!scene)return null;
 return <g transform="translate(0 560)" data-grammar-application={id}><defs><marker id="grammar-application-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto"><path d="M0 0L10 5L0 10Z" fill={blue}/></marker></defs><path d="M20 7H740V395H20Z" fill={paper} stroke="var(--vs-ink-muted)"/>{scene}</g>;
}
