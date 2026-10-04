import React from 'react';
import type { ContrastPlate } from './types';
import { SketchArrow as A, SketchGroup as G, SketchText as T } from './Sketch';

// Desenhos conceituais: posições permanecem simultaneamente visíveis.
export const filosofiaPlates1: ContrastPlate[] = [
  {
    chapterId: 'summary-filosofia-a-critica-da-razao-pura',
    context: 'Uma xícara quente fornece cor, forma e temperatura. O esquema compara registrar passivamente esses dados com constituir uma experiência pelas formas e categorias; não mostra a coisa em si.',
    annotation: 'Conhecer não é copiar nem inventar: material sensível + condições a priori.',
    positions: [
      { reading: 'Na hipótese criticada por Kant, a mente seria um espelho do objeto. A seta única evidencia a passividade dessa hipótese, sem atribuí-la indistintamente a toda filosofia anterior.', focus: ['espelho'] },
      { reading: 'Espaço e tempo ordenam intuições; categorias, como substância e causalidade, permitem pensar o objeto da experiência. A grade representa regras universais, não opiniões individuais.', focus: ['categorias'] },
      { reading: 'A síntese exige intuições e conceitos juntos: um fluxo sem organização não produz conhecimento de objetos, e uma grade sem material sensível fica vazia.', focus: ['sintese'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>uma xícara, três perguntas sobre conhecer</T>
      <G id="espelho" active={focus === 0}>
        <path d="M54 100 H136 V157 Q96 180 54 157 Z M136 113 Q175 107 169 137 Q165 153 138 149 M78 85 Q65 67 80 55 M110 85 Q99 67 113 55" fill="none" />
        <T x={40} y={208}>dados sensíveis</T>
        <A d="M158 137 H262" />
        <rect x={278} y={83} width={164} height={105} rx={12} fill="none" />
        <path d="M297 165 L411 107 M312 171 L420 115" fill="none" />
        <T x={296} y={212}>mente-espelho?</T>
        <T x={482} y={131}>objeto dita</T><T x={482} y={158}>a representação</T>
      </G>
      <G id="categorias" active={focus === 1}>
        <T x={30} y={275} size={18}>material sensível</T>
        <circle cx={58} cy={315} r={13} fill="none" /><circle cx={108} cy={332} r={8} fill="none" /><circle cx={143} cy={300} r={11} fill="none" />
        <A d="M164 317 H192" />
        <g data-kant-stage="sensibilidade">
          <T x={204} y={262}>espaço + tempo</T>
          <path d="M204 286 H366 V360 H204 Z M258 286 V360 M312 286 V360 M204 323 H366" fill="none" />
          <T x={204} y={390} size={18}>intuições ordenadas</T><T x={218} y={414} size={18}>sensibilidade</T>
        </g>
        <A d="M375 317 H406" />
        <g data-kant-stage="entendimento">
          <T x={422} y={262}>categorias</T>
          <rect x={422} y={286} width={148} height={74} rx={5} fill="none" />
          <T x={435} y={310} size={18}>substância</T><T x={435} y={342} size={18}>causalidade</T>
          <T x={424} y={390} size={18}>entendimento</T>
        </g>
        <A d="M580 317 H610" />
      </G>
      <G id="sintese" active={focus === 2}>
        <path d="M623 283 H687 V341 Q655 359 623 341 Z M687 299 Q724 292 719 317 Q716 338 689 334" fill="none" />
        <T x={662} y={390} size={18} anchor="middle">objeto conhecido</T>
        <path d="M42 418 H703" strokeDasharray="7 6" fill="none" />
        <T x={48} y={451}>fenômeno: o que aparece sob essas condições</T>
      </G>
    </>,
  },
  {
    chapterId: 'summary-filosofia-a-relacao-entre-fe-e-razao',
    context: 'Diante de uma afirmação religiosa, alguém recebe um testemunho e pede uma demonstração. As trilhas mostram critérios distintos de aceitação; não são prova nem refutação da existência de Deus.',
    annotation: 'Compare o critério de aceitar uma crença, não a inteligência de quem crê.',
    positions: [
      { reading: 'O fideísmo aceita a fé independentemente de demonstração racional. A trilha não precisa atravessar o exame da prova; isso não equivale à tese de harmonia.', focus: ['testemunho'] },
      { reading: 'O racionalismo estrito submete a aceitação à demonstração. Sem prova suficiente, suspende ou recusa a proposição; o desenho apresenta esse critério exigente.', focus: ['prova'] },
      { reading: 'A harmonia admite vias distintas: a razão pode demonstrar certas verdades, enquanto a revelação excede sua capacidade sem contradizê-la. Não significa domínios totalmente incomunicáveis.', focus: ['harmonia'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>uma afirmação → que caminho a sustenta?</T>
      <path d="M47 60 H225 V103 H47 Z" fill="none" /><T x={61} y={88}>“Deus existe”</T>
      <G id="testemunho" active={focus === 0}>
        <path d="M85 124 Q70 173 124 198 Q169 217 220 190" fill="none" />
        <T x={233} y={144}>testemunho</T><A d="M225 189 H370" />
        <path d="M390 166 L415 196 L464 140" fill="none" />
        <T x={486} y={182}>fé aceita</T><T x={485} y={208}>sem exigir prova</T>
      </G>
      <G id="prova" active={focus === 1}>
        <path d="M72 241 H205 V309 H72 Z M88 264 H184 M88 286 H167" fill="none" />
        <T x={36} y={340}>demonstração</T><A d="M224 277 H306" />
        <path d="M332 261 H407 V290 H332 Z M368 290 V320" fill="none" />
        <T x={439} y={272}>passa no exame?</T><T x={439} y={300}>aceitar / suspender</T>
      </G>
      <G id="harmonia" active={focus === 2}>
        <path d="M68 382 Q181 360 280 388 Q385 420 494 389 M68 423 Q179 443 280 416 Q384 381 494 419" fill="none" />
        <T x={42} y={373}>razão</T><T x={42} y={457}>revelação</T>
        <T x={523} y={398}>vias distintas</T><T x={523} y={426}>sem contradição</T>
      </G>
    </>,
  },
  {
    chapterId: 'summary-filosofia-a-teoria-das-ideias-de-platao',
    context: 'Três círculos desenhados no papel se deformam ou se apagam. A Forma de Círculo serve para pensar sua identidade; o plano inteligível do desenho não é um lugar físico nem uma imagem mental individual.',
    annotation: 'O traço muda; a Forma que torna o círculo inteligível permanece.',
    positions: [
      { reading: 'Heráclito ajuda a nomear o problema do sensível: os desenhos mudam e não oferecem por si só um objeto absolutamente estável de conhecimento.', focus: ['copias'] },
      { reading: 'A exigência parmenídica de permanência encontra, na solução de Platão, um domínio inteligível. A Forma não nasce nem se apaga junto com seus exemplares.', focus: ['forma'] },
      { reading: 'Platão articula os domínios pela participação: exemplares imperfeitos são círculos por participarem da Forma. A seta não representa fabricação material nem viagem para outro lugar.', focus: ['participacao'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>o que permite reconhecer estes círculos?</T>
      <G id="copias" active={focus === 0}>
        <T x={40} y={83}>círculos desenhados</T>
        <path d="M140 123 C75 108 49 185 98 213 C149 239 206 193 176 148 C166 128 156 119 140 123 Z" fill="none" />
        <path d="M277 123 C224 130 214 202 266 218 C308 233 354 183 330 151 C315 127 296 116 277 123" fill="none" />
        <path d="M432 129 C397 136 380 187 413 215 M436 220 Q486 225 501 178 M485 143 L467 129" strokeDasharray="10 8" fill="none" />
        <T x={59} y={263}>irregular</T><T x={232} y={263}>deformado</T><T x={392} y={263}>apagando</T>
      </G>
      <G id="forma" active={focus === 1}>
        <circle cx={626} cy={188} r={66} fill="none" /><path d="M626 188 H692" fill="none" />
        <T x={548} y={86}>forma inteligível</T><T x={559} y={289}>identidade estável</T>
      </G>
      <G id="participacao" active={focus === 2}>
        <A d="M160 325 Q362 379 586 318" />
        <T x={271} y={367}>participação</T>
        <path d="M44 405 H711" strokeDasharray="7 6" fill="none" />
        <T x={43} y={439}>sensível: cópias mutáveis</T><T x={432} y={439}>inteligível: Forma</T>
      </G>
    </>,
  },
  {
    chapterId: 'summary-filosofia-empirismo-britanico-locke-berkeley-e-hume',
    context: 'Ao experimentar uma maçã, percebemos cor, sabor e textura. Cada autor pergunta algo diferente: a origem das ideias, a existência da matéria e a identidade do eu que vive a experiência.',
    annotation: 'Experiência é ponto de partida comum; as consequências não são iguais.',
    positions: [
      { reading: 'Locke distingue sensação e reflexão. A ideia complexa de maçã combina ideias simples recebidas da experiência; ele não nega a existência de matéria.', focus: ['locke'] },
      { reading: 'Berkeley rejeita matéria independente de percepção: ser é ser percebido. A percepção divina garante continuidade mesmo sem observador humano, sem fazer a maçã desaparecer.', focus: ['berkeley'] },
      { reading: 'Hume encontra uma sucessão de percepções, não uma impressão constante de um eu substancial separado. O feixe desenhado não é uma alma escondida por trás delas.', focus: ['hume'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>uma maçã → ideias, existência, identidade</T>
      <G id="locke" active={focus === 0}>
        <path d="M89 104 Q76 67 102 67 Q123 67 128 104 M108 89 Q139 60 151 85 M110 110 C35 72 26 191 92 193 C110 181 120 183 133 194 C191 178 178 81 110 110 Z" fill="none" />
        <T x={45} y={224}>sensação</T><A d="M191 145 H274" />
        <T x={283} y={118}>cor + sabor + textura</T><T x={283} y={150}>ideia complexa</T>
        <path d="M285 169 Q327 196 367 169" fill="none" /><T x={444} y={181}>reflexão: operações</T>
      </G>
      <G id="berkeley" active={focus === 1}>
        <path d="M45 284 Q94 229 150 284 Q94 339 45 284 Z" fill="none" /><circle cx={97} cy={284} r={17} fill="none" />
        <A d="M166 284 H265" /><T x={277} y={275}>ser percebido</T><T x={277} y={307}>ideias, não matéria oculta</T>
        <T x={45} y={347}>continuidade: percepção divina</T>
      </G>
      <G id="hume" active={focus === 2}>
        <path d="M52 413 H697" strokeDasharray="6 5" fill="none" />
        <circle cx={108} cy={412} r={22} fill="none" /><circle cx={308} cy={412} r={22} fill="none" /><circle cx={508} cy={412} r={22} fill="none" />
        <T x={73} y={460}>calor</T><T x={272} y={460}>sabor</T><T x={467} y={460}>alegria</T>
        <T x={409} y={376}>feixe de percepções</T>
      </G>
    </>,
  },
  {
    chapterId: 'summary-filosofia-filosofia-politica-contemporanea',
    context: 'Uma cidade decide as regras de acesso a uma biblioteca. O caso fictício contrasta imparcialidade, pertencimento e debate público; nenhum desenho representa uma reunião histórica desses autores.',
    annotation: 'A mesma regra pode ser examinada pela escolha, pelos vínculos e pela voz pública.',
    positions: [
      { reading: 'Rawls pergunta quais princípios escolheríamos sem conhecer nossa própria posição social. O véu oculta vantagens pessoais, não razões para proteger liberdades e os menos favorecidos.', focus: ['veu'] },
      { reading: 'Sandel questiona o sujeito inteiramente abstrato: vínculos, tradições e papéis constituem a pessoa que escolhe. A crítica não implica rejeição automática de toda instituição liberal.', focus: ['vinculos'] },
      { reading: 'Habermas exige deliberação pública livre e informada, aberta aos afetados. Contar votos é insuficiente se pessoas não puderam discutir razões e contestar a proposta.', focus: ['debate'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>quem pode usar a biblioteca da cidade?</T>
      <path d="M291 91 L384 56 L477 91 M306 98 H462 V156 H306 Z M330 109 V141 M356 109 V141 M410 109 V141 M436 109 V141" fill="none" />
      <G id="veu" active={focus === 0}>
        <path d="M57 98 H207 V184 H57 Z M69 115 H194 M69 142 H194 M69 169 H194" strokeDasharray="7 5" fill="none" />
        <T x={33} y={216}>véu da ignorância</T><A d="M218 141 H281" />
        <T x={43} y={249}>não sei quem serei</T>
      </G>
      <G id="vinculos" active={focus === 1}>
        <circle cx={632} cy={126} r={19} fill="none" /><circle cx={571} cy={194} r={17} fill="none" /><circle cx={692} cy={194} r={17} fill="none" />
        <path d="M620 143 L582 179 M645 144 L681 179 M591 194 H672" fill="none" />
        <T x={545} y={242}>vínculos</T><T x={522} y={269}>língua / memória / papéis</T>
      </G>
      <G id="debate" active={focus === 2}>
        <ellipse cx={377} cy={365} rx={147} ry={56} fill="none" />
        <circle cx={224} cy={317} r={19} fill="none" /><circle cx={377} cy={284} r={19} fill="none" /><circle cx={529} cy={317} r={19} fill="none" />
        <path d="M272 297 Q302 260 333 287 M423 287 Q453 260 482 297 M274 394 Q377 439 480 394" fill="none" />
        <T x={308} y={360}>razões públicas</T><T x={319} y={386}>contestação</T>
        <T x={239} y={462}>deliberação antes da decisão</T>
      </G>
    </>,
  },
  {
    chapterId: 'summary-filosofia-heraclito-e-parmenides-o-ser-e-o-devir',
    context: 'Um rio corre e uma semente germina. São imagens para comparar o problema da mudança: fluxo ordenado, exigência lógica de permanência e atualização de uma capacidade em um sujeito identificável.',
    annotation: 'Não confunda fluxo com caos nem potência com qualquer possibilidade imaginada.',
    positions: [
      { reading: 'Heráclito entende o devir como fluxo regido pelo logos: as águas mudam, enquanto a unidade do rio se mantém na tensão entre transformações. O movimento não é ausência de ordem.', focus: ['rio'] },
      { reading: 'Parmênides exige pensar o ser sem geração a partir do não-ser nem desaparecimento nele. O contorno contínuo simboliza essa exigência lógica, não uma descrição física de uma pedra.', focus: ['ser'] },
      { reading: 'Aristóteles distingue potência e ato: a semente tem capacidade de se desenvolver sob condições adequadas. A mudança atualiza uma capacidade, sem exigir criação a partir do nada.', focus: ['semente'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>como algo muda e ainda pode ser reconhecido?</T>
      <G id="rio" active={focus === 0}>
        <path d="M46 115 Q144 72 248 115 Q344 152 445 110 M46 159 Q151 116 252 160 Q344 191 445 155 M51 203 Q152 160 252 204 Q345 236 444 199" fill="none" />
        <A d="M127 142 Q192 134 239 155" /><T x={70} y={86}>fluxo regido pelo logos</T>
        <T x={62} y={247}>águas novas / unidade do rio</T>
      </G>
      <G id="ser" active={focus === 1}>
        <circle cx={606} cy={158} r={79} fill="none" /><T x={587} y={166} size={24}>ser</T>
        <T x={510} y={273}>uno, não gerado</T><T x={510} y={300}>não vem do não-ser</T>
      </G>
      <G id="semente" active={focus === 2}>
        <ellipse cx={139} cy={385} rx={28} ry={17} transform="rotate(-25 139 385)" fill="none" />
        <T x={78} y={437}>potência</T><T x={64} y={464}>capacidade real</T>
        <A d="M207 384 H432" label="condições adequadas" x={204} y={354} />
        <path d="M537 411 V350 Q495 345 490 320 Q534 317 537 350 Q571 309 593 331 Q571 357 537 356 M489 418 H588" fill="none" />
        <T x={533} y={443}>ato</T><T x={497} y={470}>desenvolvimento</T>
      </G>
    </>,
  },
  {
    chapterId: 'summary-filosofia-justica-e-direitos-humanos',
    context: 'Três famílias recebem recursos em um caso fictício. Examinar a escolha de regras, reconstruir a história das aquisições ou comparar o padrão final são perguntas diferentes; Rawls também impõe princípios substantivos.',
    annotation: 'A mesma distribuição final não revela, sozinha, a justiça de toda sua história.',
    positions: [
      { reading: 'Em Rawls, a imparcialidade da escolha seleciona princípios: liberdades básicas iguais e desigualdades favoráveis aos menos favorecidos. Um processo imparcial não autoriza qualquer resultado.', focus: ['regras'] },
      { reading: 'Nozick examina aquisição legítima, transferência voluntária e retificação de injustiças. Desigualdade final não basta para condenar; voluntariedade isolada também não legitima uma origem injusta.', focus: ['historia'] },
      { reading: 'Teorias de resultado comparam a distribuição a um critério como igualdade, necessidade ou mérito. O desenho ilustra perguntas alternativas, sem tratá-las como um único critério equivalente.', focus: ['resultado'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>três famílias: o que torna a distribuição justa?</T>
      <G id="regras" active={focus === 0}>
        <path d="M52 65 H340 V166 H52 Z M67 86 H322 M67 146 H322" strokeDasharray="7 5" fill="none" />
        <T x={68} y={114}>imparcialidade na escolha</T><T x={386} y={92}>liberdades iguais</T><T x={386} y={123}>benefício dos menos</T><T x={386} y={152}>favorecidos</T>
      </G>
      <G id="historia" active={focus === 1}>
        <path d="M49 210 H202 V254 H49 Z M296 210 H437 V254 H296 Z M536 210 H709 V254 H536 Z" fill="none" />
        <T x={62} y={240}>aquisição</T><A d="M217 232 H280" /><T x={310} y={240}>transferir</T><A d="M454 232 H516" /><T x={550} y={240}>titularidade</T>
        <T x={48} y={291}>origem legítima?</T><T x={287} y={291}>troca voluntária?</T><T x={524} y={291}>retificar injustiças</T>
      </G>
      <G id="resultado" active={focus === 2}>
        <path d="M76 344 L122 318 L169 344 V411 H76 Z M253 344 L299 318 L346 344 V411 H253 Z M431 344 L477 318 L524 344 V411 H431 Z" fill="none" />
        <circle cx={98} cy={375} r={8} fill="none" /><circle cx={123} cy={375} r={8} fill="none" /><circle cx={148} cy={375} r={8} fill="none" />
        <circle cx={287} cy={375} r={8} fill="none" /><circle cx={312} cy={375} r={8} fill="none" /><circle cx={477} cy={375} r={8} fill="none" />
        <T x={570} y={350}>distribuição</T><T x={570} y={381}>qual critério?</T>
        <T x={47} y={455}>igualdade?       necessidade?       mérito?</T>
      </G>
    </>,
  },
  {
    chapterId: 'summary-filosofia-o-ideal-iluminista-de-razao-e-progresso',
    context: 'Uma administração escolhe como organizar um serviço público. Perguntar pelos fins pode ampliar autonomia; apenas otimizar meios ou impor um padrão cultural como universal pode reproduzir dominação.',
    annotation: 'Progresso técnico não prova emancipação moral: quem define os fins?',
    positions: [
      { reading: 'Kant liga esclarecimento à coragem de julgar por si e ao uso público da razão. A mão riscando a tutela representa autonomia crítica, não mera acumulação de informação.', focus: ['autonomia'] },
      { reading: 'Adorno e Horkheimer criticam a razão reduzida a cálculo instrumental: meios eficientes podem servir a fins opressivos não examinados. A crítica não pede abandono de toda racionalidade.', focus: ['calculo'] },
      { reading: 'A crítica pós-colonial mostra como um padrão europeu se apresentou como universal e classificou povos como atrasados. A hierarquia desenhada é objeto de crítica, não classificação válida.', focus: ['colonial'] },
    ],
    illustration: focus => <>
      <T x={32} y={35} size={23}>usar a razão: examinar fins ou só otimizar?</T>
      <G id="autonomia" active={focus === 0}>
        <path d="M53 88 H226 V165 H53 Z M53 88 L138 142 L226 88 M81 73 L198 178" fill="none" />
        <T x={58} y={205}>ordem sem exame</T><A d="M252 125 H341" />
        <T x={374} y={110}>“por que esta regra?”</T><T x={374} y={143}>autonomia + razão pública</T>
      </G>
      <G id="calculo" active={focus === 1}>
        <path d="M51 246 H210 V327 H51 Z M68 264 H190 M68 283 H126 M146 283 H190 M68 309 H126 M146 309 H190" fill="none" />
        <A d="M234 285 H328" /><T x={345} y={270}>cálculo instrumental</T><T x={345} y={300}>mais eficiente → para quê?</T>
      </G>
      <G id="colonial" active={focus === 2}>
        <path d="M74 441 H195 V413 H317 V384 H439 V355 H561" fill="none" />
        <T x={46} y={393}>povos classificados</T><T x={46} y={468}>hierarquia colonial</T>
        <T x={465} y={401}>um padrão se diz</T><T x={465} y={430}>“universal”</T>
        <path d="M294 357 L441 458 M441 357 L294 458" strokeDasharray="8 5" fill="none" />
      </G>
    </>,
  },
];
