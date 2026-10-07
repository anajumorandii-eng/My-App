import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import { useSceneMotion } from '../topic-scenes/useSceneMotion';
import './LiteratureFoundations.css';

import { LITERATURE_FOUNDATIONS, type LiteratureFoundationId, type Foundation } from './literatureFoundationsCatalog';
export { LITERATURE_FOUNDATIONS, type LiteratureFoundationId, type Foundation, type ReadingState } from './literatureFoundationsCatalog';

const ink = 'var(--vs-ink)', wine = 'var(--vs-burgundy)', paper = 'var(--vs-paper)';
export function Arrow({ d, active = true }: { d: string; active?: boolean }) {
  const transition = useSceneMotion();
  return <motion.path key={d} d={d} fill="none" stroke={wine} strokeWidth="3" initial={transition.duration === 0 ? false : { pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={transition} />;
}
export function Drawing({ label, children }: { label: string; children: React.ReactNode }) {
  return <svg viewBox="0 0 560 240" role="img" aria-label={label} className="lf-drawing">{children}</svg>;
}
export function Line({ x = 20, y, children }: { x?: number; y: number; children: React.ReactNode }) {
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

export function Box({ x, y, w, children, strong = false }: { x: number; y: number; w: number; children: React.ReactNode; strong?: boolean }) {
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

function PoetryNow({ state }: { state: number }) {
  return <Drawing label={['Soneto, poema visual e rap no mesmo sarau', 'A voz como papel que não se rasga', 'Poema postado alcança mil leitores'][state]}>
    {state === 0 && <>{['soneto', 'visual', 'rap'].map((w, i) => <Box key={w} x={20 + i * 180} y={60} w={150} strong={i === 1}>{w}</Box>)}<Arrow d="M95 115q180 50 360 0"/><Line y={190}>sem escola dominante</Line><Line x={20} y={222}>leia o procedimento de cada poema</Line></>}
    {state === 1 && <><circle cx="90" cy="100" r="40" fill={paper} stroke={ink} strokeWidth="3"/><path d="M135 80q30 20 0 40M150 65q45 35 0 70" fill="none" stroke={wine} strokeWidth="3"/><Arrow d="M190 100h100m-12-8 12 8-12 8"/><Box x={300} y={78} w={200}>papel que não rasga</Box><Line x={20} y={222}>o corpo de quem diz é o suporte</Line></>}
    {state === 2 && <><Line y={60}>02:00 postado</Line><Arrow d="M150 70q100 40 200 30"/><Box x={300} y={78} w={210} strong>12:00 · mil leitores</Box><Line y={170}>sem editor no meio do caminho</Line><Line x={20} y={222}>alcance ≠ valor estético</Line></>}
  </Drawing>;
}
function ProseNow({ state }: { state: number }) {
  return <Drawing label={['A viela contada por quem mora nela', 'Memória da avó e da narradora', 'Nome real, lembrança inventada'][state]}>
    {state === 0 && <><path d="M120 40v150M220 40v150" stroke={ink} strokeWidth="3"/><circle cx="170" cy="120" r="16" fill={wine}/><Line x={250} y={80}>narrador de fora →</Line><Line x={250} y={130}>quem mora dentro ✓</Line><Arrow d="M240 125h-50m12-8-12 8 12 8"/><Line x={20} y={222}>muda o ponto de vista</Line></>}
    {state === 1 && <><Box x={20} y={50} w={160}>memória da avó</Box><Box x={20} y={120} w={160}>memória própria</Box><Arrow d="M185 72q60 0 80 35M185 142q60 0 80-30"/><Box x={280} y={85} w={190} strong>escrevivência</Box><Line x={20} y={222}>vivência coletiva + invenção</Line></>}
    {state === 2 && <><Box x={20} y={60} w={180}>nome real</Box><Line x={220} y={90}>+</Line><Box x={260} y={60} w={230} strong>lembrança inventada</Box><Arrow d="M255 115q-50 50-120 30"/><Line y={180}>pacto ficcional declarado</Line><Line x={20} y={222}>autoficção ≠ autobiografia</Line></>}
  </Drawing>;
}
function Lusophone({ state }: { state: number }) {
  return <Drawing label={['A mesma palavra em Luanda e em Lisboa', 'Estrelinhada como palavra inventada', 'Falas sem travessão e a busca de um guia'][state]}>
    {state === 0 && <><Box x={20} y={60} w={140}>Luanda</Box><Box x={380} y={60} w={140}>Lisboa</Box><circle cx="270" cy="82" r="30" fill={wine}/><Line x={238} y={140}>palavra</Line><Arrow d="M165 82h70M305 82h70"/><Line x={20} y={222}>língua comum, histórias distintas</Line></>}
    {state === 1 && <><Box x={20} y={60} w={110}>estrela</Box><Line x={145} y={90}>+</Line><Box x={170} y={60} w={110}>-inha</Box><Arrow d="M285 82h70m-12-8 12 8-12 8"/><Box x={365} y={60} w={160} strong>estrelinhada</Box><Line x={20} y={222}>invenção a partir da oralidade</Line></>}
    {state === 2 && <><Line y={60}>a cidade cegou, disse o homem,</Line><Line y={100}>perguntaram só quem os guiaria</Line><Arrow d="M40 115q120 50 280 10"/><Line y={180}>vírgula no lugar do travessão</Line><Line x={20} y={222}>alegoria sobre poder</Line></>}
  </Drawing>;
}
function VisualArts({ state }: { state: number }) {
  return <Drawing label={['Retrato solene ao lado de figura colorida deformada', 'Figura de pé enorme e cabeça mínima', 'Placas articuladas que mudam com a mão'][state]}>
    {state === 0 && <><rect x="40" y="30" width="130" height="160" fill={paper} stroke={ink} strokeWidth="3"/><circle cx="105" cy="80" r="22" fill="none" stroke={ink} strokeWidth="2"/><path d="M75 180v-60h60v60" fill="none" stroke={ink} strokeWidth="2"/><rect x="330" y="30" width="130" height="160" fill={wine}/><path d="M360 170q30-120 70-60" fill="none" stroke={paper} strokeWidth="6"/><Arrow d="M180 110h140m-12-8 12 8-12 8"/><Line x={20} y={222}>pose → cor e deformação</Line></>}
    {state === 1 && <><ellipse cx="140" cy="180" rx="90" ry="22" fill={wine}/><path d="M140 160V70" stroke={ink} strokeWidth="14"/><circle cx="140" cy="60" r="8" fill={ink}/><circle cx="400" cy="60" r="28" fill="none" stroke={ink} strokeWidth="3"/><path d="M420 180v-80m0 30h-20m20-15h20" stroke={ink} strokeWidth="5"/><Arrow d="M240 120q60-30 110-10"/><Line x={20} y={222}>a desproporção é o argumento</Line></>}
    {state === 2 && <><path d="M80 150l60-80 60 80z" fill={paper} stroke={ink} strokeWidth="3"/><path d="M140 70l60 30" stroke={wine} strokeWidth="4"/><circle cx="140" cy="70" r="6" fill={wine}/><Arrow d="M220 110h100m-12-8 12 8-12 8"/><Box x={330} y={88} w={190} strong>forma nova</Box><Line x={20} y={222}>a obra precisa do gesto</Line></>}
  </Drawing>;
}
function Theater({ state }: { state: number }) {
  return <Drawing label={['O caipira confunde a modista com a dona da casa', 'Memória, alucinação e realidade simultâneas', 'O espectador sobe ao palco'][state]}>
    {state === 0 && <><Box x={20} y={60} w={160}>noivo da roça</Box><Arrow d="M185 82h80m-12-8 12 8-12 8"/><Box x={275} y={40} w={120}>modista</Box><Box x={275} y={100} w={160} strong>dona da casa?</Box><Line x={20} y={222}>tipo social + equívoco = sátira</Line></>}
    {state === 1 && <>{['memória: casa', 'alucinação: foge', 'realidade: agoniza'].map((w, i) => <Box key={w} x={20 + i * 20} y={30 + i * 55} w={230} strong={i === 2}>{w}</Box>)}<Arrow d="M300 60v110"/><Line x={320} y={120}>ao mesmo tempo</Line><Line x={20} y={222}>consciência fragmentada no palco</Line></>}
    {state === 2 && <><path d="M40 120h480" stroke={ink} strokeWidth="4"/><Line x={60} y={100}>palco</Line><Line x={60} y={160}>plateia</Line><circle cx="300" cy="160" r="14" fill={wine}/><Arrow d="M300 140v-50m-8 10 8-10 8 10"/><Line x={20} y={222}>espect-ator muda o fim</Line></>}
  </Drawing>;
}
function Songbook({ state }: { state: number }) {
  return <Drawing label={['A palavra triste no ponto mais alto da melodia', 'Morro, praia, guitarra elétrica e periferia', 'Cálice e cale-se soam quase iguais'][state]}>
    {state === 0 && <><path d="M20 160q100-10 160-60t160-40 160 80" fill="none" stroke={ink} strokeWidth="3"/><circle cx="330" cy="60" r="10" fill={wine}/><Line x={300} y={40}>triste</Line><Arrow d="M300 70q-40 60-120 70"/><Line x={20} y={222}>letra + melodia = sentido</Line></>}
    {state === 1 && <>{['morro', 'praia', 'guitarra', 'periferia'].map((w, i) => <Box key={w} x={20 + i * 130} y={60} w={115} strong={i === 3}>{w}</Box>)}<Arrow d="M75 115h390m-12-8 12 8-12 8"/><Line y={170}>samba · Bossa · Tropicália · rap/funk</Line><Line x={20} y={222}>gênero + espaço + época</Line></>}
    {state === 2 && <><Box x={20} y={60} w={150}>cálice</Box><Box x={350} y={60} w={150} strong>cale-se</Box><path d="M180 82q85-40 165 0" fill="none" stroke={ink} strokeDasharray="5 5"/><Arrow d="M180 100q85 40 165 0"/><Line y={170}>sagrado na superfície, ordem por baixo</Line><Line x={20} y={222}>homofonia contra a censura</Line></>}
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
  'poetry-contemporary': PoetryNow, 'prose-contemporary': ProseNow, 'lusophone-contemporary': Lusophone, 'brazilian-visual-arts': VisualArts,
  'brazilian-theater': Theater, 'popular-songbook': Songbook,
};
type WorkshopProps = { id: string; config: Foundation; Scene: React.ComponentType<{ state: number }>; manuscript: string; caption: string; literature?: boolean; extra?: React.ReactNode };
/** A mesma oficina serve Literatura e Sociologia: só mudam a frase de abertura
 *  e o aviso sobre os exemplos. `data-literature-operation` fica só na
 *  Literatura porque os testes e o roteiro da Entrega F o usam como contrato. */
export function OperationWorkshop({ id, config, Scene, manuscript, caption, literature = false, extra }: WorkshopProps) {
  const [index, setIndex] = useState(0);
  const selected = config.states[index];
  const drawing = React.useRef<HTMLDivElement>(null);
  const pan = (amount: number) => { if (drawing.current) drawing.current.scrollLeft += amount; };
  return <section className="lf-operation" data-operation={id} data-literature-operation={literature ? id : undefined} aria-label={config.question}>
    <p className="lf-manuscript">{manuscript}</p>
    <div className="lf-controls" role="group" aria-label={`Operações de ${config.topic}`}>{config.states.map((state, i) => <button type="button" key={state.label} aria-pressed={index === i} onClick={() => setIndex(i)}>{state.label}</button>)}</div>
    <p className="lf-caption">{caption}</p>
    <div className="lf-drawing-window" ref={drawing} tabIndex={0} role="region" aria-label={`Percorrer demonstração de ${config.topic}`} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); pan(event.key === 'ArrowRight' ? 160 : -160); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); event.currentTarget.scrollLeft = event.key === 'Home' ? 0 : event.currentTarget.scrollWidth; }
    }}><Scene state={index}/></div>
    <div className="lf-pan"><span>Deslize a prancha; com teclado, use as setas.</span><button type="button" aria-label="Percorrer demonstração para a esquerda" onClick={() => pan(-160)}>←</button><button type="button" aria-label="Percorrer demonstração para a direita" onClick={() => pan(160)}>→</button></div>
    <div className="lf-reading" role="status" aria-live="polite"><blockquote>“{selected.anchor}”<cite>{selected.section}</cite></blockquote><div><strong>{selected.label}</strong><p>{selected.observation}</p><p className="lf-conclusion">{selected.conclusion}</p></div></div>
    {extra}
  </section>;
}
export function LiteratureOperation({ id }: { id: LiteratureFoundationId }) {
  return <OperationWorkshop id={id} config={LITERATURE_FOUNDATIONS[id]} Scene={drawings[id]} literature
    manuscript="Leia a operação, não apenas o nome da escola."
    caption="Exemplos didáticos autorais. Não são versos ou cenas dos autores estudados."
    extra={id === 'art-languages' && <p className="lf-context">Contexto: critérios de beleza mudam. No retrato oficial, tamanho e luz podem legitimar poder. Avaliar a obra só pela proporção naturalista atual pode ser anacrônico; explicar seu contexto não obriga a aceitar a hierarquia.</p>}/>;
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
