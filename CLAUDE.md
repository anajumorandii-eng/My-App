# Crivo

App de estudo para vestibulares de Medicina (Fuvest, Unicamp, Unesp, Famerp,
Unifesp, ENEM). React 19 + TypeScript + Vite no cliente, Express no servidor,
Firestore para os dados da estudante.

A estudante é a Ana Júlia. **O assistente de IA do app se chama CRIVO** — nunca
JUJU, nome antigo que já foi removido de todos os prompts e telas. As únicas
sobras de `juju_` são chaves de `localStorage` — `juju_summary_progress_v1`,
`juju_summary_mode`, `juju_onboarding`, `juju-essay-theme`, `juju-essay-draft` e
`juju-essay-rewrite`; renomeá-las apagaria progresso real da estudante sem mudar
nada visível, então **deixe como estão**. A lista antes citava três das seis, o
que era pior que não citar nenhuma: dava a entender que as outras podiam ser
renomeadas.

## Regras que não se negociam

**O repositório é público.** As apostilas em PDF trazem, no rodapé de cada
página, uma marca d'água com o nome, o e-mail e o CPF da licenciada. Nada disso
pode chegar a um commit, nem como texto nem como pixel.

- Não commite o texto extraído nem os PDFs das apostilas. `materiais-extraidos/`
  e `provas-extraidas/` estão no `.gitignore` por isso.
- Toda imagem de página que vai para `public/question-media/` passa por
  `scripts/conferir-marca-dagua.py`, que roda OCR só na faixa inferior e em modo
  de linha única. Rodar OCR na página inteira não acha a marca e daria uma
  checagem que passa sempre — por isso existe a flag `--provar`, que roda contra
  uma página inteira e falha se a checagem *não* acusar.
- As resoluções escritas das apostilas são conteúdo de terceiros. Comentários de
  questão são escritos do zero, nunca copiados.

**Nunca inclua identificador de modelo** (Opus, Sonnet, Claude, nomes de versão)
em mensagem de commit, título ou corpo de PR, comentário de código ou qualquer
outro artefato que vá para o repositório. Isso vale só para a conversa.

**Desenvolva sempre na branch `claude/app-updates-mgyedd`.** Nunca faça push em
outra branch sem permissão explícita.

**PR mergeada é PR encerrada.** Quando houver trabalho novo e a última PR já
tiver sido mergeada, recomece a branch a partir da `main` atualizada, rebaseie
os commits que ficaram de fora e **abra uma PR nova** — nunca empilhe commits
sobre histórico já mergeado.

```bash
git fetch origin main
git rebase origin/main          # preserva os commits ainda não mergeados
git push --force-with-lease origin claude/app-updates-mgyedd
```

**Antes de todo push:** `npm run lint` limpo e `npm test` verde.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o app em http://localhost:3000 (cliente e servidor juntos) |
| `npm run lint` | `tsc --noEmit` — é este o lint do projeto, não há ESLint |
| `npm test` | `test:node` (node:test, servidor e libs) e depois `test:vitest` (React) |
| `npm run build` | Build de produção do cliente e bundle do servidor |

Para conferir mudança visual, use Playwright com o Chromium já instalado no
ambiente — **não rode `playwright install`**:

```js
chromium.launch({ executablePath: '/opt/pw-browsers/chromium-<build>/chrome-linux/chrome',
                  args: ['--no-sandbox'] })
```

O número do build muda conforme o ambiente e pode não bater com o que o
`@playwright/test` do projeto espera — confira com `ls /opt/pw-browsers/` e passe
o caminho explicitamente, em vez de deixar o Playwright procurar sozinho.

O modal de onboarding bloqueia a tela; contorne com
`localStorage.setItem('juju_onboarding', 'true')` num `addInitScript`. iPad em
retrato é 834×1112, em paisagem 1366×900.

### O que há em `.claude/`

- `hooks/session-start.sh` roda `npm install` antes de a sessão começar, só no
  ambiente remoto. Sem ele, uma sessão na web abre sem `node_modules` e os dois
  comandos obrigatórios **falham se passando por sucesso**: `npm run lint` morre
  com `MODULE_NOT_FOUND` em vez de erro de tipo, e `npm test` para em
  `tsx: not found` sem rodar um teste sequer.
- `settings.json` registra esse hook e pré-aprova comandos de leitura (lint,
  teste, build, `git status`, `diff`, `log`). Nada que escreva entra na lista.
- `skills/` tem as 36 skills do projeto no formato que o Claude Code lê. Elas
  vivem também em `.agents/skills/`, que é o formato do Codex, e
  `skills-lock.json` continua sendo a fonte da verdade — o README de
  `.claude/skills/` explica como manter as duas cópias iguais.

## Banco de questões

`public/questions.json` guarda 2.887 questões e é mesclado por id com o
Firestore em `src/hooks/useQuestions.ts`. Questões vindas de apostila carregam
`originalPages: {url, page}[]`, apontando para recortes WebP em
`public/question-media/apostilas/<colecao>/<id>-p<N>.webp`.

Os scripts que editam o banco recusam entrada inválida em vez de gravar pela
metade — respeite isso, não contorne:

- `scripts/aplicar-comentarios.py` — aplica `{id: comentario}`; avisa e pula id
  desconhecido.
- `scripts/recuperar-enunciado.py` — aplica `{id: {prompt, options, explanation,
  correct?}}`; recusa id inexistente e letra de alternativa inexistente, e
  registra toda troca de gabarito. O campo `correct` só deve ser usado quando a
  resolução for inequívoca e a chave impressa divergir dela.
- `scripts/conferir-marca-dagua.py` — descrito acima.

**Quando a imagem não permite reconstruir o enunciado, diga isso no enunciado.**
`ap_mat_fuvest_110` é o precedente: a primeira equação do sistema ficou fora do
recorte, então o enunciado declara o fato e o comentário ensina o método sem
inventar a equação que falta. Inventar conteúdo para tapar buraco é pior que o
buraco.

Lacuna conhecida: as 90 questões `fuvest_2025_q*` ainda têm enunciado e
alternativas de marcador ("Leia a questão e suas alternativas na página
original"), com imagens em `public/question-media/fuvest-2025/`.

## Resumos profundos

`src/data/deepSummaryContent.json` guarda 612 capítulos, cada um com 5 seções
(`title` + `content`) e uma pergunta de `recall`. `src/data/applyDeepSummaries.ts`
mescla esse conteúdo com o currículo de `src/data/summaryCurriculum.ts` e atribui
estágio pedagógico e profundidade a cada seção, na ordem
`intuicao, conceito, aplicacao, estrategia, exercicio`.

**Os arrays `stages` e `depths` têm 5 posições.** Um capítulo com mais de 5
seções sairia com estágio `undefined`; mexer no número de seções exige mexer
nesse mapeamento também.

### Aprofundamento em curso

O padrão aprovado pela Ana Júlia, aplicado por `scripts/aprofundar-resumo.py`:

- **900 a 1.100 caracteres por seção**, contra os ~350 originais. O script recusa
  seção abaixo de 800 caracteres ou mais curta que a versão atual — aprofundar
  nunca encurta.
- Explicar o **mecanismo por inteiro**, não apresentá-lo. De onde vem cada
  número, por que a adaptação funciona.
- Números e nomes concretos (a transferência de 10% entre níveis tróficos, os
  420 ppm da curva de Keeling, o padrão 9+2 do axonema).
- Seção de pegadinhas com **5 ou 6 itens**, cada um com a correção junto, não só
  o apontamento.
- Seção de prática com **dois problemas**, o segundo mais analítico, no nível da
  2ª fase.

Cada capítulo reescrito recebe `rev: 2`, e `applyDeepSummaries.ts` põe essa
revisão no id das seções (`-editorial-v${rev}-`). **É isso que impede o
progresso de leitura dos 612 capítulos de zerar** a cada mudança de texto: só o
capítulo que mudou volta a pedir leitura. Ao reescrever, sempre suba o `rev`.

Estado: 435 de 612 aprofundados — Biologia, Química, Física, Matemática,
Geografia, História e Filosofia inteiras concluídas. Os demais seguem em
rodadas, matéria por matéria (próxima: Sociologia).

## Visual

A aba `/visual` (`src/views/Visual.tsx`) transforma um capítulo de resumo em
prancha de relações, com três modos: Explorar, Testar e Reconstruir. As regras
ficam em `src/lib/visualStudy.ts`, módulo puro, sem React, para rodar em
`node:test`. A especificação completa está em `docs/visual/README.md`.

O mapa não é um dado novo: os nós saem das cinco seções do capítulo, as arestas
saem da sequência fixa de estágios, e as relações avaliáveis saem de
`retrieval[0].expectedElements`. Nada disso é gravado — é derivado a cada
render.

### Pranchas ilustradas

A tela só abre a prancha de um capítulo que tenha **cena autoral própria**. Quem
não tem recebe o aviso de "prancha necessária" — e isso é escolha, não lacuna:
reutilizar a ilustração de outro assunto para preencher a tela é o mesmo erro de
inventar enunciado para tapar buraco (`ap_mat_fuvest_110`).

Quais capítulos têm prancha, e qual, sai de `src/views/visual-boards/registry.ts`.
Antes era uma condição solta dentro de `Visual.tsx`, que exigiria um `if` novo a
cada conteúdo desenhado. O registro é também o inventário do que já foi
ilustrado, e `registry.test.ts` cobre o que o tipo não pega: prancha que nenhum
capítulo alcança (escrita e nunca exibida), prancha de uma matéria casando com
capítulo de outra, e a recusa de emprestar ilustração alheia.

**A cena é desenhada em SVG no componente, nunca um arquivo de imagem.** Não é
preferência de estilo: `adiabatic-piston.webp` e `knowledge-landscape.webp`
existiam, respondiam 200 e decodificavam sem erro — e tinham 100% dos pixels em
`rgba(0,0,0,0)`. A prancha reservava 360×360 e não desenhava nada, e nenhum
teste pegou, porque a imagem carregava. Um raster também não acompanha o tema,
não reage ao nó selecionado e não anima, que é o que a tela precisa.

`BoardShell` e `boardPair` existem para que a cena seja a única coisa que muda de
uma prancha para outra. **O par de cartões sai sempre dos nós 1 e 2 do mapa**: se
uma prancha pegasse o nó 3 e outra o último, o mesmo estado apareceria em
posições diferentes e a leitura de cor deixaria de significar o mesmo entre
capítulos.

Alvo: **Biologia, Física, Química e Matemática** — 288 dos 612 capítulos. As
demais matérias ficam de fora por decisão da Ana Júlia, e a razão é boa: "Uso da
Crase" não tem fenômeno a desenhar. Elas continuam abrindo o Visual com o aviso.

Estado: 26 pranchas cobrindo 36 dos 288 capítulos.

Ao desenhar uma prancha nova, três armadilhas já custaram retrabalho:

- **Confira no navegador, não só no teste.** Cinco defeitos desta série passaram
  por lint e testes verdes e só apareceram na captura: legenda sobre a haste do
  pistão, punho saindo do viewBox, texto de duas palavras transbordando a cena,
  rótulos de gráfico disputando o mesmo pedaço do quadro, e o balão da condição
  vazando com valor de mais de dez caracteres.
- **Legenda curta.** `sceneNotes` e `condition.value` são espaços apertados; o
  CSS hoje quebra e reduz em vez de estourar, mas texto curto continua melhor.
- **Anime peça única com um só `translate`.** Placa, haste e punho do pistão
  animados em separado descolavam no meio da transição.

**A evidência é a mesma do Caderno de Erros.** Testar e Reconstruir passam por
`evaluateRetrievalAnswer` + `applySummaryAttempt`, exatamente como a recuperação
ativa dos Resumos, e o estado de cada relação é lido de
`matchedElements`/`firstMissingElement` das tentativas já registradas. Criar um
histórico próprio do Visual faria o mapa e o Caderno discordarem sobre a mesma
aluna.

Decorrências que devem ser preservadas:

- Os sete estados vêm da evidência, não de um campo salvo. `possivel-regressao`
  fica fora da escada (`NODE_STATE_RANK`) de propósito: é alerta sobre um degrau
  perdido, não um degrau.
- A confiança reusa `confidenceFromUncertainty`. Sem tentativa nenhuma o
  diagnóstico lê "dados insuficientes", e o inspetor diz que aquilo é hipótese.
- Resposta que corresponde a **outra** relação do mesmo mapa é `parcial`, não
  erro: o conteúdo estava certo e o vínculo saiu trocado.
- A ocultação em Reconstruir vai da evidência mais frágil para a mais firme, e
  "Por que estas?" mostra o motivo de cada uma.
- Os rótulos de `expectedElements` estão em caixa baixa e sem acento. **Não
  corrija o dado**: o mesmo texto é gravado em `matchedElements` a cada
  tentativa, e renomeá-lo orfanaria a evidência já registrada. A tela corrige só
  a inicial, na exibição.

## IA

O cliente chama `/api/ai/<task>` por `src/lib/aiClient.ts`. Cada tarefa precisa
existir em **quatro lugares** no servidor, e faltar um deles quebra silenciosamente:

1. `server/ai/types.ts` — a união `AiTask`
2. `server/ai/routes.ts` — a entrada em `ROUTES`
3. `server/ai/validation.ts` — o `case` em `validateAiPayload`
4. `server/ai/prompts.ts` — o `case` em `buildAiPrompt`

Foi exatamente esse buraco que deixou `error-diagnosis` sem rota: a tela pedia
diagnóstico, recebia 404 e mostrava "não consegui diagnosticar agora", o que
parecia instabilidade da IA. Um teste em `server/ai/prompts.test.ts` agora
compara as chamadas do cliente com as rotas do servidor — mantenha-o passando.

Prompts que produzem JSON estruturado são analisados por parsers tolerantes
(`src/lib/errorDiagnosis.ts`), que nunca lançam e rebaixam confiança que o
modelo tenha inflado. Saída de modelo é dado suspeito, não fato.

## Caderno de erros

O tipo do erro começa em `'unknown'` — "Não sei o motivo do meu erro". Antes
começava em `'conceptual'`, e quem salvasse sem escolher gravava um erro de
conceito que podia ser de conta ou de leitura, com confiança `confirmado`. A
estatística herdava o padrão do formulário, não a realidade.

Regras que decorrem disso e devem ser preservadas:

- Registrar sem saber grava `unknown` com confiança `baixa` — dado honesto, que
  segue sinalizando que aquele erro ainda pede diagnóstico.
- `'confirmado'` só quando a estudante validou uma explicação de fato.
- O relato dela ("o que passou pela sua cabeça") é a evidência mais forte do
  diagnóstico: a mesma alternativa errada pode vir de erro de conta ou de
  conceito trocado, e só o relato separa os dois. O prompt manda priorizá-lo.
- Recusar a hipótese ("Não foi isso") devolve o tipo para `unknown` e reabre o
  campo, em vez de deixar selecionado o palpite recém-negado.
- A IA nunca pode produzir `unknown`: `ERROR_TYPES`, em `src/lib/errorDiagnosis.ts`,
  não inclui esse valor de propósito.

## Interface

O design system vive em `src/design-system/css/`. `nucleo-instrumental-prototype.css`
veio de um protótipo estático e ainda guarda enfeite herdado — **valores fixos ali
não são necessariamente dados**. A barra de precisão tinha `width: 62%` no CSS e
aparecia meio cheia num treino 0/0; hoje lê `var(--bar-fill)`. Ao encontrar uma
métrica na tela, confirme que ela vem do estado, e não do CSS.

Breakpoints: 900px (layout móvel, com barra inferior fixa e menu lateral em
gaveta) e 560px. A folga inferior de `.ni-production-main` precisa acompanhar a
altura real da barra fixa mais `env(safe-area-inset-bottom)`, senão o último
cartão fica por baixo dela no retrato.

Listas longas de filtro viram campos agrupados, não fileiras de chips: em
"Todas", os tópicos são mais de sessenta e transbordam a tela.

## Como escrever aqui

Comentário de código explica **por que**, com a evidência: qual bug apareceu,
que caminho foi descartado e por quê. Comentário que repete o que a linha já diz
é ruído. Mensagem de commit segue a mesma régua — o que mudou, e o que estava
errado antes.

Tudo que a estudante lê é em português do Brasil.
