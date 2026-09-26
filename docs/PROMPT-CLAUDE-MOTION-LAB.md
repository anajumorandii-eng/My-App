# Briefing executável — Motion Lab

**Cole este documento inteiro na primeira mensagem de uma nova sessão do Claude Code, no repositório `My-App`.**

## O que NÃO é aceitável como entrega

Este documento pede uma mudança no aplicativo, não uma análise dela. Não são entrega aceitável:

- um wireframe, mockup ou protótipo em HTML solto fora do app;
- uma lista de ideias, opções ou "caminhos possíveis";
- um relatório dizendo o que poderia ser feito;
- um componente novo que não está ligado a nenhuma rota real e que a Ana Júlia não consegue abrir no app.

A entrega é código integrado ao `My-App`, alcançável a partir da aba `/visual` de um capítulo real, com `npm run lint` limpo e `npm test` verde, e capturas de tela do componente funcionando no navegador (Playwright, conforme `CLAUDE.md`). Se alguma parte do pedido abaixo não puder ser feita dentro do padrão do repositório, diga isso explicitamente e explique o que fez no lugar — não decida sozinho reduzir o escopo para "só a parte visual".

## Contexto do repositório

Leia antes de escrever qualquer código: `CLAUDE.md` inteiro (seção "Visual" é a mais relevante), `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`, `docs/visual/README.md`. O Motion Lab é uma peça nova dentro da arquitetura que já existe — `BoardShell`, `SceneViewport`, os três modos (Explorar/Testar/Reconstruir) e a evidência do Caderno de Erros continuam valendo. Não é uma reescrita da aba Visual.

## O problema que o Motion Lab resolve

Hoje, testar o entendimento na aba Visual é responder um formulário depois de ver a cena. O Motion Lab intercala manipulação e verificação: a estudante prevê o resultado de uma mudança, manipula a variável, observa o que aconteceu, explica por que aconteceu com as próprias palavras, e só então o sistema confirma se a explicação bate com o mecanismo. Isso é mais próximo de como ela de fato aprende um mecanismo, e gera evidência mais forte do que "acertou a alternativa" — porque erro de previsão e erro de explicação são coisas diferentes, e hoje o Caderno de Erros não distingue as duas.

## Fluxo pedagógico obrigatório

Todo capítulo com Motion Lab passa pelas cinco etapas, nesta ordem, sem pular nenhuma:

1. **Prever.** Antes de tocar em qualquer controle, a estudante registra o que espera que aconteça com a variável em foco (ex.: "se eu dobrar a temperatura, o volume vai... crescer / diminuir / não mudar", ou um valor aproximado). A previsão fica gravada antes da manipulação, não depois — se o componente deixar mudar o controle antes de a previsão existir, o requisito falhou.
2. **Manipular.** O instrumento cinético (ver abaixo) responde ao gesto dela em tempo real, sem debounce perceptível.
3. **Observar.** O resultado da manipulação fica visível na mesma tela, sem a estudante precisar rolar ou trocar de aba, com o valor final destacado.
4. **Explicar.** Ela escreve, em texto livre curto, por que o resultado saiu daquele jeito — não escolhe entre alternativas prontas. Esta etapa é a diferença central em relação ao Testar de hoje.
5. **Verificar.** O sistema compara a explicação com o mecanismo esperado (usando o mesmo parser tolerante de `errorDiagnosis.ts`/`summaryEngine.ts` — nunca lança, nunca inventa confiança que o texto da estudante não sustenta) e devolve o veredito com o feedback pedagógico específico (ver seção própria), não um "certo/errado" seco.

Cada etapa é um estado explícito do componente (`prever | manipular | observar | explicar | verificar`), nunca inferido implicitamente pela presença ou ausência de dados na tela.

## Direção visual: Canvas cinético — única direção

Não é uma opção entre várias famílias de cena. O Motion Lab usa sempre um `<canvas>` (ou SVG animado com `motion/react`, seguindo `useSceneMotion()` como todo o resto do app) onde o objeto do fenômeno se move em resposta direta ao gesto da estudante — arrastar, girar, deslizar — nunca um controle de formulário (`<input type=range>` solto) desacoplado de um desenho. A régua:

- O controle **é** o objeto do fenômeno, ou está fisicamente ligado a ele na cena (ex.: arrastar o êmbolo de um pistão, não arrastar uma barra genérica ao lado do desenho do pistão).
- Sob movimento reduzido, o canvas mostra o estado final da manipulação sem animação de transição — mesma regra de `useSceneMotion()` já documentada no `CLAUDE.md`.
- Nenhuma segunda linguagem visual (cartões de texto, diagramas de caixa e seta) substitui o canvas como conteúdo principal da etapa "manipular"/"observar". Cartões de texto podem aparecer só nas etapas prever/explicar/verificar, como já acontece no resto da aba Visual.

## Estrutura da interface

Cada tela de Motion Lab tem estes seis elementos, sempre nesta função:

1. **Prioridade explicada.** Uma frase, no topo, dizendo por que este capítulo entrou no Motion Lab agora (ex.: "este é o mecanismo que mais aparece errado no seu Caderno de Erros" ou "capítulo com evidência insuficiente"). Vem de dado real — `matchedElements`/`firstMissingElement` das tentativas já registradas, nunca um texto fixo genérico.
2. **Previsão.** Campo de resposta curta ou escolha entre 2-3 hipóteses (nunca mais que isso — ver "Regras de personalização"), registrada antes do instrumento ficar manipulável.
3. **Instrumento.** O canvas cinético descrito acima.
4. **Cadeia causal.** Depois da etapa "observar", uma sequência de 2 a 4 elos mostra o mecanismo passo a passo (variável manipulada → efeito intermediário → resultado), no mesmo padrão de cadeia causal já usado nas cenas de História/Geografia (`HistoriaGeografia.tsx`) e não uma lista de bullets.
5. **Microquestão.** Uma pergunta curta e específica sobre o elo da cadeia que a explicação da estudante deixou mais fraco — não uma pergunta genérica de fechamento.
6. **Próxima ação desbloqueável.** Um botão que só ativa depois que "explicar" + "verificar" completarem, levando ao próximo capítulo relacionado (achado por proximidade no mapa de estágios, `visualStudy.ts`) ou de volta ao mesmo capítulo se a verificação apontou lacuna.

## Comportamento por matéria — três mecanismos diferentes, não três skins

Matemática, Biologia e Química não podem compartilhar o mesmo componente de instrumento com paleta trocada. Cada uma manipula uma coisa de natureza diferente:

- **Matemática.** A estudante manipula um **parâmetro algébrico** (coeficiente, base, expoente) e observa a **transformação geométrica correspondente** no plano cartesiano (deslocamento, inclinação, achatamento da curva) — reaproveitando `src/lib/curveFamilies.ts` como fonte de verdade das famílias de curva, nunca reimplementando a matemática. A previsão é sobre a forma final da curva ou um valor específico dela (raiz, vértice, assíntota).
- **Biologia.** A estudante manipula uma **condição do sistema vivo** (concentração, temperatura, presença/ausência de um agente) e observa uma **resposta do organismo ou da célula** que se desenrola no tempo (não é instantânea como em Matemática) — por exemplo, arrastar a concentração de soluto e ver a célula murchar ou intumescer ao longo de alguns segundos, reaproveitando o padrão de animação já usado em `MembraneMechanism`/`OsmosisMechanism`. A previsão é sobre a direção da resposta (incha/murcha, acelera/desacelera), nunca um número exato — biologia raramente tem esse tipo de precisão no nível do capítulo.
- **Química.** A estudante manipula uma **quantidade de reagente ou uma condição de equilíbrio** (temperatura, pressão, concentração) e observa o **deslocamento do sistema** (posição do equilíbrio, cor, quantidade de produto), com a cadeia causal explicitando o princípio (Le Chatelier, por exemplo) que liga manipulação a resultado. A previsão é sobre o sentido do deslocamento, não um valor numérico salvo quando o capítulo realmente trabalha com constantes de equilíbrio calculáveis.

Um teste automatizado deve comprovar que os três instrumentos usam bases de estado e de desenho diferentes (não o mesmo componente parametrizado só por cor/ícone) — isso é o critério objetivo que substitui a inspeção visual "parece diferente o suficiente?".

## Personalização baseada em evidência

- A hipótese de previsão oferecida (quando for escolha, não texto livre) é construída a partir do erro mais comum já registrado para aquele capítulo no Caderno de Erros da própria estudante — nunca uma lista fixa de distratores genéricos.
- Se a estudante não tem tentativa registrada para o capítulo, a previsão é sempre texto livre curto, nunca escolha — não há distrator para construir sem evidência, e inventar um seria o mesmo erro que `ap_mat_fuvest_110` documenta como proibido.
- A "prioridade explicada" (elemento 1 da interface) e a "microquestão" (elemento 5) leem sempre a evidência mais recente, nunca um snapshot congelado no momento em que o capítulo foi programado.

## Feedback pedagógico específico

Nunca "certo" ou "errado" sozinho. O feedback da etapa "verificar" sempre nomeia:

- o que a previsão acertou ou errou, separado do que a explicação acertou ou errou (são duas evidências diferentes, ver seção seguinte);
- qual elo da cadeia causal a explicação da estudante pulou ou trocou, se houver lacuna — no mesmo padrão de "elo escondido vira `?`" do `ConceptChain.tsx`, não uma nota solta;
- quando a explicação corresponde a um mecanismo real mas de outro capítulo do mesmo mapa, o feedback diz isso como parcial, não como erro — mesma régua já usada em `matchedElements` para respostas de Reconstruir.

## Separação entre estado da simulação e histórico real

O estado do canvas (posição do controle, frame da animação, texto ainda sendo digitado) é **efêmero e local ao componente** — nunca gravado como tentativa. Só dois momentos geram evidência real, gravada via `applySummaryAttempt`/`evaluateRetrievalAnswer` como qualquer outra tentativa do app:

1. o registro da previsão (evidência de "sabia prever o efeito", separada da compreensão do mecanismo);
2. a explicação avaliada na etapa "verificar" (evidência do mecanismo em si, com `matchedElements`/`firstMissingElement`).

Reabrir o mesmo capítulo, arrastar o controle de novo, ou trocar de aba e voltar nunca duplica tentativa nem apaga a evidência anterior. Isto precisa de teste automatizado explícito (não apenas inspeção manual): simular reabertura e conferir que o histórico de tentativas não cresce sem uma nova previsão+explicação completas.

## Requisitos técnicos verificáveis

- **Acessibilidade.** O instrumento cinético é operável por teclado (equivalente arrastável dos controles, como já existe em `SceneViewport`/`vs-plane-controls`), tem `aria-label` descrevendo o estado atual do canvas (não só "gráfico"), e o texto de previsão/explicação nunca é a única forma de interação com fonte menor que 11px efetivos em nenhuma largura testada.
- **Responsividade.** Testado e capturado em 360, 375, 390, 768 e 1440px, claro e escuro, sem rolagem lateral da página — mesma checklist já usada nas cenas de História/Geografia.
- **Autocontido.** O componente não depende de nenhum serviço externo nem de rede além do que o app já usa; funciona offline como o resto da aba Visual.
- **Português do Brasil.** Todo texto que a estudante lê — inclusive mensagens de erro do parser de explicação e o texto da "prioridade explicada" — em português do Brasil, sem termo técnico de implementação vazando para a tela (ex.: nunca mostrar "matchedElements" ou nome de estado interno como texto visível).

## Checklist de aceite

Marque cada item como feito ou explique por que não deu, um a um — não uma frase geral de "tudo funcionando":

- [ ] As cinco etapas existem como estados explícitos e nesta ordem; não dá para manipular antes de prever, nem ver o veredito antes de explicar.
- [ ] O instrumento é `motion/react`/canvas, respeita `useSceneMotion()`, sem `repeat: Infinity`.
- [ ] Os seis elementos da interface estão presentes e cada um cumpre a função descrita (não são só rótulos vazios).
- [ ] Matemática, Biologia e Química usam bases de estado e desenho distintas, comprovado por teste automatizado.
- [ ] A previsão em escolha só aparece quando há evidência prévia da estudante; sem evidência, é sempre texto livre.
- [ ] O feedback da etapa "verificar" nomeia o elo específico, nunca "certo/errado" sozinho.
- [ ] Estado do canvas é efêmero; só previsão e explicação avaliada geram tentativa gravada — com teste que prova que reabrir não duplica.
- [ ] Operável por teclado, com `aria-label` descrevendo o estado do canvas.
- [ ] Capturas em 360/375/390/768/1440px, claro e escuro, sem rolagem lateral.
- [ ] `npm run lint` limpo e `npm test` verde antes do push.
- [ ] Todo texto visível à estudante em português do Brasil.

## Formato exato da entrega

1. Componente(s) novos em `src/views/` (ou subpasta própria, ex. `src/views/motion-lab/`), ligados à aba Visual por um capítulo real escolhido para o primeiro piloto (diga qual e por quê).
2. Pelo menos um teste automatizado por item verificável do checklist acima que puder ser testado (não é aceitável "testei manualmente" para os itens que dão para automatizar).
3. Capturas de tela do componente funcionando no navegador, nas larguras e temas listados, salvas em `docs/visual-personalizado/screenshots/`.
4. Um resumo, no fim da sessão, dizendo: o que foi implementado, o que ficou fora do escopo e por quê, e o resultado de `npm run lint` e `npm test`.
5. Commit e PR — sem esperar aprovação prévia para o trabalho de rotina, seguindo a mesma prática já em uso neste repositório.
