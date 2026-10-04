# Entrega A — eletricidade, matrizes e leitura histórica

Base: `af401453397d773ddf8ff5ae65df1e3f1559afc6`, conferida com `origin/main` em 03/10/2026. Escopo: 25 IDs dos lotes F1 (17), M1 (4) e HG1 (4). PRs anteriores incorporadas foram preservadas; #246, #234 e #222 são frentes separadas.

## Comportamento corrigido

- Corrente elétrica: condutor metálico, seção S, intervalo de 2 s e sentidos opostos de corrente convencional e deriva eletrônica. O deslocamento é declarado esquemático; símbolos não representam contagem individual das cargas em coulombs. Corrente zero remove as setas de fluxo.
- Potência/resistores: circuito de aquecedor ideal sob 12 V, conversão térmica por segundo, resistor em série sem fio de desvio e barra de corrente com escala de 0–12 A. Não há gráfico de resistência confundido com corrente.
- Kirchhoff: setas discriminam entradas e saídas, ramo de corrente zero não conserva vetor; uma malha independente mostra +12−4−8=0 V. As duas situações não são apresentadas como um único circuito.
- Capacitor ideal de 2 μF: sinais opostos, dielétrico isolante e campo entre placas; tensão zero remove campo e carga. Energia cresce com U².
- Coulomb/campo: distância entre centros proporcional a r, forças iguais/opostas de atração, linhas orientadas para fora de +Q e ponto de medida que se afasta da fonte. Comprimentos quantitativos variam com 1/r² e as pontas cabem nos vetores curtos. As escalas de posição e vetor são distintas.
- Potencial: anéis contidos e rotulados, carga de prova +2q₀; U=qV e trabalho do campo desde r=4 distinguidos de V. V₀ e U₀=q₀V₀ são unidades relativas.
- Campo uniforme/dinâmica: placas orientadas, q=+2 C, E=4 V/m, F=8 N e queda ΔV=−Ed. A dinâmica é um instantâneo de vetores em escalas próprias: q=+2 C, m=2 kg e a=qE/m; E=0 retira E/F/a. Não é simulação de trajetória.
- Eletrização: atrito com materiais distintos em contato e movimento; contato entre condutores idênticos tocando; indução com polarização de sinais opostos, sem aterramento nem transferência entre corpos. O achado está no renderer `FisicaMecanismos.tsx`; `data/fisica.ts` já descrevia corretamente os mecanismos.
- Gerador/receptor: ponto e projeções sobre U(i), sem cartão atravessando a reta. Curto do gerador coincide com U=0; receptor declara escala truncada 100–120 V.
- Magnetismo: N/S, sentidos externo/interno e aproximação dos polos terrestres; bússola acompanha B. Fio e espira têm vista frontal explícita e regra da mão direita. Corrente zero remove os símbolos de corrente e campo. Fios paralelos mostram forças em cada corpo.
- Gerador por indução: fase controlável, B e normal identificados, Φ=BAcosθ, ε=NBAωsenθ e corrente assinada no circuito externo. Hipóteses N=1, BA=0,4 Wb e R=1 Ω; representação é uma projeção esquemática. A corrente inverte a cada meia volta.
- Matrizes: operador + na soma e coluna vertical no produto. Nos dois capítulos de funções afins, nota da raiz se afasta das graduações mantendo o ponto no eixo x.
- História: Independência limita contribuição intrínseca da cena larga e mantém pan/teclado internos. Engenho recomposto em maior altura, fontes de 18–20 unidades SVG e notas em duas linhas; placa Casa de Fundição em duas linhas com fonte de 12,5 unidades SVG. Eletrização usa uma composição mais alta exclusiva, fontes de 24–28 unidades e textos quebrados. Rótulos essenciais são medidos em pixels efetivamente renderizados no navegador.
- Geografia: título passa a Estrutura Ativa da População, coerente com resumo aprofundado e prancha de setores. ID `geo-bonus-demografico`, seções, histórico e persistência preservados.

## Verificação

Chromium: **12 cenários, 300 combinações capítulo/configuração e 1.032 estados** passaram em build de produção, em 390/834/1366 px, claro/escuro e movimento normal/reduzido. A suíte confere todos os 25 IDs, controles por teclado e extremos, mecanismos selecionáveis, inversão da corrente, pan, overflow, recorte/colisão de textos e exceções de página. Nenhum erro de console foi registrado. [Resultados por ID e estado](verification.json). Capturas de cada artefato e dos mecanismos alternativos: [390 px claro](390-light/) e [1366 px escuro](1366-dark/), 68 imagens revisadas. Testes de mecanismo foram escritos antes dos reparos e observados falhando. A revisão independente encontrou e corrigiu três regressões adicionais: fio desviando do resistor, posição de P não proporcional a r e símbolo de corrente preservado em zero.

A primeira execução geral foi interrompida porque ocorreu enquanto novas regressões RED eram adicionadas. Outra execução concorrente com compilação apresentou falhas de tempo em `Resumos.ui.test.tsx` e `pairContract.test.tsx`, além de capturar uma revisão anterior do teste de seta. A execução serial seguinte identificou duas referências desatualizadas ao título de Geografia em `Resumos.ui.test.tsx` e no inventário versionado `27-qualidade-visual.json`; ambas foram sincronizadas. Os outros 938 casos Vitest e os 823 casos Node passaram. A verificação final passou: **823 testes Node e 940 Vitest (1.763)**, sem compilação/navegador concorrentes e com os limites de tempo originais. TypeScript, build de produção, matriz visual (13 testes) e integridade da fila passaram.

## Limites

Validação técnica dos achados não é aprovação editorial integral. Nenhum dado de conta real, Firestore, autenticação ou chave de progresso foi alterado. Os demais capítulos, os 177 aprofundamentos editoriais pendentes e Safari/iPad físico continuam fora desta entrega. Sem merge automático.

## Reprodução

```sh
npm run lint
npm test -- -- --maxWorkers=1
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.visual-production.config.ts
node scripts/validar-fila-visual.mjs
```

A variável de executável é opcional em ambientes com Chromium do Playwright instalado. A matriz integral foi executada com configuração temporária equivalente à configuração versionada, usando o Chromium do ambiente. A execução dirigida usa `CRIVO_ENTREGA_A_IDS`; essa variável estava ausente na matriz integral. Depois da revisão das capturas, o contraste dos corpos/sinais de eletrização e dos polos/vetor interno do ímã foi corrigido e revalidado separadamente nas mesmas 12 configurações: 84 estados passaram e o contraste medido dos sinais/polos foi ≥4,5:1. [Rechecagem dirigida](contrast-verification.json).
