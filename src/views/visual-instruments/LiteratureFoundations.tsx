import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import { useSceneMotion } from '../topic-scenes/useSceneMotion';
import './LiteratureFoundations.css';

type ReadingState = { label: string; section: string; anchor: string; observation: string; conclusion: string };
type Foundation = { topic: string; question: string; relation: string; states: ReadingState[] };
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
} satisfies Record<string, Foundation>;
export type LiteratureFoundationId = keyof typeof LITERATURE_FOUNDATIONS;

const ink = 'var(--vs-ink)', wine = 'var(--vs-burgundy)', paper = 'var(--vs-paper)';
function Arrow({ d, active = true }: { d: string; active?: boolean }) {
  const transition = useSceneMotion();
  return <motion.path key={d} d={d} fill="none" stroke={wine} strokeWidth="3" initial={transition.duration === 0 ? false : { pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={transition} />;
}
function Drawing({ label, children }: { label: string; children: React.ReactNode }) {
  return <svg viewBox="0 0 560 240" role="img" aria-label={label} className="lf-drawing">{children}</svg>;
}
function Line({ x = 20, y, children }: { x?: number; y: number; children: React.ReactNode }) {
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

function Box({ x, y, w, children, strong = false }: { x: number; y: number; w: number; children: React.ReactNode; strong?: boolean }) {
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

const drawings: Record<LiteratureFoundationId, React.ComponentType<{ state: number }>> = {
  'art-languages': Art, 'literary-text': LiteraryText, 'narrative-elements': Narrative, 'medieval-voices': Medieval,
  'renaissance-camoes': Camoes, 'first-records': Records, baroque: Baroque, neoclassic: Neoclassic,
  'romantic-poetry': RomanticPoetry, 'romantic-prose': RomanticProse, realism: Realism, naturalism: Naturalism,
  'eca-de-queiros': Eca, parnassianism: Parnassian, symbolism: Symbolism, 'pre-modernism': PreModernism,
};
export function LiteratureOperation({ id }: { id: LiteratureFoundationId }) {
  const config = LITERATURE_FOUNDATIONS[id];
  const [index, setIndex] = useState(0);
  const selected = config.states[index];
  const Scene = drawings[id];
  const drawing = React.useRef<HTMLDivElement>(null);
  const pan = (amount: number) => { if (drawing.current) drawing.current.scrollLeft += amount; };
  return <section className="lf-operation" data-literature-operation={id} aria-label={config.question}>
    <p className="lf-manuscript">Leia a operação, não apenas o nome da escola.</p>
    <div className="lf-controls" role="group" aria-label={`Operações de ${config.topic}`}>{config.states.map((state, i) => <button type="button" key={state.label} aria-pressed={index === i} onClick={() => setIndex(i)}>{state.label}</button>)}</div>
    <p className="lf-caption">Exemplos didáticos autorais. Não são versos ou cenas dos autores estudados.</p>
    <div className="lf-drawing-window" ref={drawing} tabIndex={0} role="region" aria-label={`Percorrer demonstração de ${config.topic}`} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); pan(event.key === 'ArrowRight' ? 160 : -160); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); event.currentTarget.scrollLeft = event.key === 'Home' ? 0 : event.currentTarget.scrollWidth; }
    }}><Scene state={index}/></div>
    <div className="lf-pan"><span>Deslize a prancha; com teclado, use as setas.</span><button type="button" aria-label="Percorrer demonstração para a esquerda" onClick={() => pan(-160)}>←</button><button type="button" aria-label="Percorrer demonstração para a direita" onClick={() => pan(160)}>→</button></div>
    <div className="lf-reading" role="status" aria-live="polite"><blockquote>“{selected.anchor}”<cite>{selected.section}</cite></blockquote><div><strong>{selected.label}</strong><p>{selected.observation}</p><p className="lf-conclusion">{selected.conclusion}</p></div></div>
    {id === 'art-languages' && <p className="lf-context">Contexto: critérios de beleza mudam. No retrato oficial, tamanho e luz podem legitimar poder. Avaliar a obra só pela proporção naturalista atual pode ser anacrônico; explicar seu contexto não obriga a aceitar a hierarquia.</p>}
  </section>;
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
