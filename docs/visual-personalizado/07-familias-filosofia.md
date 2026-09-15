# 07 — Inventário de famílias de cena de Filosofia

Este documento registra, para os 35 capítulos de Filosofia em
`src/data/deepSummaryContent.json`, a qual família de cena-âncora
(`SceneFamily`, definida em `src/views/topic-scenes/types.ts`) cada um foi
atribuído, ou por que ficou sem cena. A leitura foi feita seção por seção de
cada capítulo; cada família responde a uma estrutura que aparece
repetidamente no material — não é uma categorização temática, é uma
categorização de forma.

O inventário tornou-se executável em `src/views/topic-scenes/data/filosofia.ts`:
cada entrada é validada contra seção e trecho literais do capítulo antes de
ser disponibilizada pelo seletor.

## Tabela de atribuição

| Família | Estrutura | Capítulos |
|---|---|---|
| `contraste-de-posicoes` | Respostas rivais à mesma pergunta, comparadas por critério explícito | Crítica da Razão Pura; Fé e Razão; Teoria das Ideias; Empirismo Britânico; Filosofia Política Contemporânea; Heráclito e Parmênides; Justiça e Direitos Humanos; Ideal Iluminista; Filósofos da Physis; Sofistas; Patrística e Agostinho; Política Aristotélica; Racionalismo Continental; Ética Aplicada e Bioética; Foucault (15) |
| `escala-de-graus` | Degraus ordenados entre dois extremos, com o que muda a cada degrau | Linha Dividida; Ética a Nicômaco; Descartes e a Dúvida; Mito da Caverna (4) |
| `cadeia-de-derivacao` | Passos encadeados; remover um quebra a conclusão | Crítica de Hume; Ética Kantiana; Escolástica; Hobbes; Locke; Lógica e Metafísica Aristotélicas; Existencialismo de Sartre; Rousseau (8) |
| `camadas-de-determinacao` | Uma camada condiciona a outra | Escola de Frankfurt; Luta de Classes; Alienação e Mais-Valia; Materialismo Histórico (4) |
| `movimento-dialetico` | Ciclo que transforma os dois termos ao se completar | Hegel; Nietzsche; Método Socrático (3) |
| *sem cena* | — | Do Mito ao Logos (1) |

Total: 15 + 4 + 8 + 4 + 3 + 1 = 35 capítulos.

## As cinco famílias

### `contraste-de-posicoes`
**Estrutura:** respostas rivais à mesma pergunta, comparadas por um critério
explícito — a cena não expõe "duas opiniões diferentes", expõe o eixo em que
elas divergem.
**Capítulo que a originou:** Crítica da Razão Pura, onde racionalismo e
empirismo respondem à mesma pergunta ("de onde vem o conhecimento?") e Kant
articula uma terceira posição que se define pelo próprio critério de
comparação entre as duas primeiras. É a maior família (14 de 35 capítulos)
porque o "debate entre posições rivais" é o padrão retórico dominante do
material de Filosofia — típico de capítulos organizados em torno de uma
questão clássica disputada por mais de uma escola ou autor.

### `escala-de-graus`
**Estrutura:** degraus ordenados entre dois extremos, em que o conteúdo
relevante é o que muda de um degrau para o seguinte, não apenas os dois
polos.
**Capítulo que a originou:** o Mito da Caverna / Linha Dividida de Platão,
cuja estrutura já é literalmente uma escala (dóxa a episteme, sombra a
forma) — o texto-fonte fornece os degraus prontos, o que tornou o padrão
óbvio antes de aparecer em outros capítulos com progressão semelhante
(dúvida hiperbólica de Descartes, meio-termo na Ética a Nicômaco).

### `cadeia-de-derivacao`
**Estrutura:** passos encadeados em que cada um depende do anterior; remover
um elo quebra a conclusão final. Difere de `escala-de-graus` porque aqui não
há "mais ou menos" entre extremos — há uma sequência lógica ou causal com
uma única direção válida.
**Capítulo que a originou:** Hobbes e o Estado de Natureza, cujo argumento
só funciona como corrente: estado de natureza a guerra de todos contra
todos a necessidade de um poder soberano a contrato social. Quebrar
qualquer elo (por exemplo, negar a guerra de todos contra todos) invalida a
conclusão sobre o soberano — o mesmo padrão de dependência estrita aparece
em Locke, na Crítica de Hume à causalidade e nos demais capítulos desta
família.

### `camadas-de-determinacao`
**Estrutura:** uma camada condiciona a outra — não é uma cadeia de passos
temporais, é uma relação de base e superestrutura (ou de poder subjacente e
efeito visível) em que a camada inferior explica a superior sem que a
superior seja um "próximo passo" da inferior.
**Capítulo que a originou:** o Materialismo Histórico, onde a base
material/econômica determina as formas de consciência e organização
social — o padrão se repete em Alienação e Mais-Valia, Luta de Classes,
Escola de Frankfurt (economia cultural). Foucault foi deliberadamente
retirado desta família: seu capítulo recusa um centro único do poder e o
descreve como rede capilar; representá-lo como base determinante inverteria
a tese da fonte. Sua cena contrapõe o modelo jurídico centralizado ao poder
relacional e produtivo.

## Verificação

- Lastro e completude: 34 entradas válidas e 1 lacuna declarada para os 35 capítulos.
- Automação: 454 testes Node e 287 testes Vitest aprovados; TypeScript e build de produção aprovados.
- Navegador desktop escuro: Hegel exibiu a cena no modo Explorar, completou o movimento por botão, preservou o estado ao avançar de etapa e removeu a cena ao entrar em Testar.
- A verificação no navegador é uma amostra funcional, não validação visual individual dos 35 capítulos; capturas móveis e de movimento reduzido continuam como evidência pendente.

### `movimento-dialetico`
**Estrutura:** um ciclo que transforma os dois termos ao se completar — não
é contraste estático (as posições não ficam paradas sendo comparadas) nem
cadeia linear (o processo volta e reconfigura o ponto de partida).
**Capítulo que a originou:** Hegel e a Dialética, de onde o nome da família
vem diretamente — tese, antítese e síntese, em que a síntese não é só "a
soma dos dois lados" mas uma transformação de ambos. O mesmo padrão de
ciclo transformador aparece no método socrático (a maiêutica reconfigura a
posição inicial do interlocutor) e em Nietzsche (a crítica aos valores
morais não apenas nega, reconfigura o valor).

## Lacuna declarada

**Do Mito ao Logos** (`summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos`)
fica sem cena-âncora porque já tem experiência interativa própria (`myth` em
`src/views/topic-experiments/catalog.ts`, exibida no mesmo slot do fluxo de
Explorar). Duas peças interativas no mesmo capítulo competiriam pelo mesmo
slot da interface — por isso este capítulo entra em `filosofiaSemCena` com o
motivo registrado, em vez de em `filosofia[]`.

## Nota sobre famílias novas

Este inventário cobre as cinco famílias definidas em `SceneFamily`
(`src/views/topic-scenes/types.ts`) a partir da leitura de Filosofia. Uma
família nova só nasce quando uma matéria pede uma estrutura que nenhuma das
cinco acima representa. Quando isso acontecer em fases seguintes do plano,
a família nova precisa ser registrada neste documento (ou em um documento
irmão específico da matéria que a originou) antes de virar código —
mantendo aqui uma explicação de qual capítulo a motivou e qual estrutura
conceitual ela representa, no mesmo formato usado acima.

## Verificação em navegador — 15/09/2026

Servidor de desenvolvimento em `http://localhost:3000`, modal de onboarding
contornado por `localStorage.setItem('juju_onboarding','true')`.

**Medido em `movimento-dialetico` (Hegel e a Dialética), desktop 1440×960:**

- A cena monta no fluxo de Explorar com o kicker "CRIVO · movimento dialético".
- Estado inicial não revela o terceiro momento: nenhum `role="status"` presente
  antes da ação do usuário.
- Acionamento por teclado funciona: o botão recebe foco e responde a Enter.
- Após completar o movimento, a superação aparece ("cancela, preserva e eleva o
  verdadeiro de cada lado") com a citação e a seção de origem.
- **Persistência entre etapas confirmada por identidade de nó**: a referência ao
  elemento `.tc-scene` antes e depois de "Continuar" é o mesmo objeto, e o
  estado revelado sobrevive à troca. É o comportamento que a `key` amarrada ao
  capítulo, fora do `AnimatePresence`, deveria garantir.
- A cena desaparece ao entrar em Testar.
- Sem overflow horizontal.

**Medido em `cadeia-de-derivacao` (Hobbes e o Estado de Natureza), celular 390×844:**

- Sem overflow horizontal.
- Rótulos sem corte: começam em x=76 num trilho que termina em x=420; o mais
  largo mede 119px. Esta família desenha rótulos dentro de faixas horizontais,
  então não sofre a restrição de ~62px que atingiu `escala-de-graus`.
- Avanço da cadeia por teclado funciona; o contador mostra "elo 2 de 4" e a
  afirmação acompanha o elo.
- `document.getAnimations()` retorna 0 animações ativas em repouso e nenhuma
  com `iterations: Infinity`.
- Console sem erros.

Captura: `screenshots/cenas-filosofia/hobbes-cadeia-mobile-escuro.jpg`.

**Limite desta verificação.** São duas famílias de cinco, em dois capítulos de
34, em duas larguras. É evidência de amostra, não validação dos 35 capítulos.
Movimento reduzido está implementado pelo token de duração zero em
`useSceneMotion` e coberto por teste unitário, mas não foi exercitado aqui com
`prefers-reduced-motion` emulado no navegador.
