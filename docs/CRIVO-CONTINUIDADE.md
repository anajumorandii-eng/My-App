# CRIVO — continuidade operacional

Este arquivo é a fonte curta de contexto do projeto. Ele existe para que sessões futuras trabalhem por **delta**, consultando o GitHub, sem baixar nem reanalisar o aplicativo inteiro.

## Regra de trabalho

1. Leia este arquivo e `docs/CONTINUIDADE-ESTADO.json`.
2. Consulte a ponta de `main` e os commits posteriores ao `source_commit` do estado.
3. Baixe apenas os arquivos envolvidos na tarefa ou no delta; não faça clone completo por padrão.
4. Faça uma auditoria nova somente quando solicitada e grave seu resultado nesta fonte, com SHA completo e data.
5. Atualize este documento ao encerrar alterações relevantes de produto, arquitetura, testes, CI ou cobertura visual.

## Registro automático

O workflow `.github/workflows/continuity-state.yml` cria/atualiza `docs/CONTINUIDADE-ESTADO.json` depois de cada push de uma pessoa para `main`. O instantâneo contém:

- SHA de origem e horário UTC;
- lista de arquivos alterados naquele envio;
- instrução operacional para recuperar somente o necessário.

O commit automático do bot não se reprocessa, evitando loops de CI.

## Estado inicial confirmado

- Repositório canônico: `anajumorandii-eng/My-App`
- Branch: `main`
- Ponta confirmada antes desta infraestrutura: `99ff9a2d649c52394936ea3af0adfc0a5d06a5f5` (2026-09-21 23:26 UTC)
- Última integração conhecida: cobertura de 28 capítulos de Literatura com instrumentos de traço e de autor (PR #195).
- Integrações imediatamente anteriores: Gramática, Geografia/Atualidades e Língua Inglesa, com regeneração da matriz visual.
- A cobertura visual precisa ser tratada como dado verificável no código: números de auditorias antigas não são estado atual.

## Auditoria independente — 22 de setembro de 2026

- Ponta da `main` auditada: `6bbe30da32c1095fe87b9d22599d05bf594e9860`; é o commit automático de continuidade. A última mudança funcional/visual é `99ff9a2d649c52394936ea3af0adfc0a5d06a5f5` (Literatura).
- Houve 25 commits entre `f866a889afdcf10f27432277fcd549af8a0d3b9d` e `99ff9a2d649c52394936ea3af0adfc0a5d06a5f5`, cobrindo Biologia/Fisiologia, Física, Geografia/Atualidades, História, Gramática, Inglês e Literatura.
- Status atual do deploy Vercel: sucesso. A falha observada durante a criação da continuidade foi de um commit intermediário e não persiste na ponta.
- A matriz rastreada e os testes isolados de visual são coerentes: 613 capítulos; 11 experimentos, 43 pranchas, 299 instrumentos, 186 cenas e 74 lacunas honestas. Os 59 testes isolados de representação, cobertura e registros passaram.
- Lacunas reais: Redação 52, Entendimento de Texto 11 e Física 11; todas as outras matérias estão sem fallback.
- `npm run lint` e `npm run build` passam. O build avisa chunks grandes: Visual ~1,04 MB minificado e useSummaryProgress ~3,74 MB.
- O bloqueio de validação foi corrigido no commit `2b478efdbc88edade002ca900cf86c51621da7c8`: Vitest usa jsdom e o setup de testes; `visualCoverage.test.ts` voltou ao include. Revalidação: `npm run test:vitest` 94/94 e `npm run visual:matrix` 13/13. `npm run test:node` teve 701/702 sucessos na cópia parcial; o único restante exige PDFs LFS não baixados.
- `npm audit --omit=dev` aponta 6 vulnerabilidades moderadas na cadeia de `firebase-admin` / storage / uuid, todas com atualização disponível.
- PRs #183 e #90 continuam abertos, não mescláveis e muito atrás de `main`; não devem ser mesclados diretamente.

## Ordem de retomada

1. Concluído: reparar o pipeline de testes (Vitest/jsdom e `visual:matrix`).
2. Próximo: reduzir os 52 fallbacks de Redação usando instrumentos por família de decisão, não uma ilustração genérica por capítulo.
3. Cobrir Entendimento de Texto e os 11 capítulos restantes de Física.
4. Revisar peso dos chunks e atualizar a cadeia do Firebase depois que a suíte estiver confiável.

## Limites claros

Este mecanismo preserva o contexto e o estado técnico no repositório e no arquivo de continuidade da conversa. Ele não substitui a conferência do GitHub quando houver mudanças novas, nem permite que uma memória de chat seja automaticamente reescrita a cada push. A fonte canônica é este documento + o instantâneo automático; ambos podem ser consultados diretamente pelo GitHub sem clone.

## Reconstrução visual em andamento — 23/09/2026

A responsável rejeitou a qualidade das imagens e a ausência de movimento na aba Visual dos capítulos. Lote local em `C:\wt-crivo-motion-rebuild`, branch `codex/visual-motion-rebuild`, base `aa9bf2c`: 15 capítulos de Biologia, História e Geografia reconstruídos com cenas e fluxos em `motion/react`. Sem publicação e sem aprovação estética presumida. Os seis registros antigos de Ecologia foram reabertos como `em-validacao`.

Detalhes, evidências e próximos pontos: [reconstrucao-motion-2026-09-23.md](visual-personalizado/reconstrucao-motion-2026-09-23.md). Há 150 verificações de largura em cinco tamanhos e dois temas; isso não representa revisão estética completa do catálogo. O bloqueio de `npm test` por 14 PDFs licenciados ausentes permanece separado dos testes de interface.
## Retomada Motion — 24 de setembro de 2026

- Base: `aa9bf2c`; branch `codex/motion-recovery`.
- Recuperada a correção da rodada anterior, cujo worktree/commit temporário não persistiu entre mensagens.
- Button, Panel e MenuBase consultam movimento reduzido. Presets estáticos removem blur, deslocamentos e stagger; indicador de carregamento respeita a preferência. Identidades normais por matéria preservadas.
- Testes UI/unitários recebem referência inerte em `src/testSetup.ts` no lugar do banco Firestore real. Testes de repositório continuam fornecendo seus próprios mocks.
- Validação: 537 testes Vitest e 706 testes Node aprovados; build aprovado. Três testes de regressão cobrem conteúdo legível, ação do menu e bloqueio de envio duplicado.
- QA em navegador pendente: Chromium ausente e download retornou arquivo inválido. Esta rodada não certifica a revisão visual dos 613 capítulos nem altera sua cobertura.

## Continuidade de Motion — ícones e inspeção publicada

- PR #208 integrada em `3e995da2c1f7ca53945ef2bd540da73bb69655d6`; CI #412, verificação da PR e Vercel aprovados.
- Base desta rodada: `2f7a6d5006d068c767d0ff1b609f482dd4bcdcdd`; branch `codex/motion-followup`.
- Ícones de disciplinas e tópicos da tela Visual passam a consultar movimento reduzido. Alvos estáticos preservam letras, traços completos, areia da ampulheta e os três planos orbitais de Física. Transições reduzidas não repetem nem aguardam atrasos.
- Quatro testes novos: órbitas distintas, legibilidade de traços/letras, geometria de tópicos e preservação do modo normal.
- Validação: 541 testes Vitest e 706 testes Node aprovados; TypeScript aprovado.
- Inspeção de produção: catálogo, filtro de Física e abertura do capítulo de calorimetria; desktop 1363×936, temas claro/escuro, sem overflow horizontal. Capturas em `docs/visual-personalizado/screenshots/motion-followup/`.
- As capturas registram a versão publicada anterior à correção de ícones. Não são aprovação visual da nova implementação. A API do navegador disponível não expõe redimensionamento/emulação; mobile/tablet e reduced motion em navegador permanecem pendentes.

## Continuidade de Motion — visibilidade dos ícones, 25 de setembro de 2026

- Base: `0fdae42` após a integração da PR #209; branch `codex/motion-qa-20260925`.
- Os ícones de disciplinas e os ícones generativos de tópicos animam somente quando seu SVG está visível na viewport e a aba está ativa. Fora dessas condições, usam o mesmo quadro estático legível já definido para movimento reduzido; ao retornar, retomam o movimento. A preferência de movimento reduzido continua prioritária.
- O setup de testes fornece `IntersectionObserver` para o jsdom. Dois casos novos exercitam a ida e volta da viewport e da aba.
- Validação local: 543 testes Vitest, 706 testes Node, TypeScript e build aprovados.
- Revisão visual desta nova versão em produção, mobile/tablet e preferência de movimento reduzido em navegador continuam pendentes até a publicação e uma sessão de navegador com emulação.

## Física — medidores elétricos, 25 de setembro de 2026

- Após a integração da PR #210, a matriz de cobertura marca 0 lacunas honestas entre 613 capítulos (Física: 85 capítulos, 14 pranchas, 63 instrumentos e 8 cenas). Isso mede presença de artefato, não aprovação visual; o inventário de qualidade ainda registra a maioria como não revisada.
- No capítulo de medidores elétricos, o desenho anterior não ligava claramente o voltímetro aos dois lados do resistor. O circuito agora tem um único caminho principal com fonte e resistor: o amperímetro entra em série nesse caminho, e o voltímetro mede o resistor por um ramo paralelo com contatos visíveis. O título comum dos instrumentos passa a dizer apenas “Laboratório de Física”.
- A primeira inspeção na prévia Vercel revelou símbolos vazios e legendas sobrepostas no SVG. O preenchimento dos medidores e a tipografia das legendas foram corrigidos. A prévia corrigida foi conferida em 1363 × 936 px: amperímetro e voltímetro no tema claro, voltímetro no tema escuro, sem transbordamento horizontal. Capturas em `docs/visual-personalizado/screenshots/physics-meter-2026-09-25/`.
- O teste de topologia e alternância passou; 544 testes Vitest, TypeScript e build passaram no primeiro commit. Larguras móveis/tablet, tema escuro para o amperímetro e movimento reduzido ainda requerem conferência; o capítulo não foi marcado como aprovado no inventário de qualidade.

## Continuação das 613 cenas no perfil Ana Júlia — 25/09/2026

Trabalho retomado em `C:\Users\Ana Julia\Documents\CRIVO\My-App`, com Git independente e origem preservada. A main `d641b5b`, incluindo as correções da outra frente Motion, foi incorporada. Sete cenas pendentes recuperadas e revisadas: três de ondas/som, duas de termoquímica, modelos atômicos e circulação. O inventário registra 22 em validação, 591 sem revisão e zero aprovados.

Plano, critérios e fila completa de IDs: [plano-finalizacao-613.md](visual-personalizado/plano-finalizacao-613.md). Evidências e limites: [expansao-motion-2026-09-25.md](visual-personalizado/expansao-motion-2026-09-25.md). Esta retomada permanece local, sem publicação.

## Auditoria geral de retomada — 01/10/2026

- Estado auditado: `6cbc94cdb46048d00947db136ae529e1c6ef41af`, confirmado com `origin/main`. Última mudança funcional: `f9f0883cc4bf6efe4b6dcdc28301f216534411a1` (#241).
- Relatório: [ANALISE-GERAL-2026-10-01.md](ANALISE-GERAL-2026-10-01.md). Nenhuma funcionalidade alterada; sem commit, push ou publicação nesta rodada.
- TypeScript, build e 1.534 testes aprovados (776 Node + 758 Vitest). CI e status Vercel da última alteração funcional aprovados.
- 28 telas abertas em Chromium desktop; seis em 390 px; nenhuma exceção de página ou rolagem horizontal nessas aberturas. Amostra visual não equivale à aprovação dos 613 capítulos ou à validação das integrações autenticadas.
- Matriz atual: 613 representações, zero lacunas; inventário de qualidade: 534 não revisados, 79 em validação e zero aprovações formalmente registradas. Resumos: 435 de 612 na revisão editorial 2; 177 restantes. Questões: 2.887, das quais 90 de Fuvest 2025 com texto de marcador.
- Prioridades: revisar inicialização de usuário novo com `mockMastery` persistido; triar 12 ocorrências de dependências (6 altas, 6 moderadas); reduzir chunks inicial/Visual; concluir revisão visual e conteúdo. Nietzsche ainda usa a família genérica criticada em setembro.
- As filas antigas deste documento são históricas. Retomar pela análise atual e por deltas do GitHub. Conversas da conta anterior não foram recuperadas; exigências que só existam nelas permanecem desconhecidas.

## Primeira etapa da retomada — 01/10/2026

- Mudanças locais em `main`, sobre `6cbc94cdb46048d00947db136ae529e1c6ef41af`. Relatório: [RETOMADA-PROGRESSO-CARREGAMENTO-2026-10-01.md](RETOMADA-PROGRESSO-CARREGAMENTO-2026-10-01.md).
- Contas novas começam com domínio sem evidência e backlog vazio, inclusive nos caminhos de atualização e recuperação. Registros existentes são preservados; nenhuma limpeza ou migração de dados reais foi executada.
- O domínio carregado é isolado por UID; leituras e ações antigas não contaminam a conta atual. Falha de leitura deixa o estado vazio e bloqueia atualização; demonstração permanece disponível sem login.
- Busca global carrega o corpus de 613 capítulos somente ao abrir. Bundle principal: 3.801,04 kB → 66,48 kB (gzip 1.122,26 → 23,01 kB); isso não mede todo o tráfego inicial nem desempenho no iPad.
- TypeScript, build, 779 testes Node e 760 testes Vitest aprovados. Chromium confirmou download sob demanda, busca por mitose, teclado, fechamento durante download lento, navegação para Caderno e celular claro/escuro com movimento reduzido.
- Próximo: conferir a sessão real Google/Firebase e a origem de eventuais exemplos antigos; atualizar dependências com revisão do gRPC fixado pelo cliente Firestore; medir desempenho no aparelho real. Sem publicação nesta etapa.

## Dependências e histórico — 01/10/2026

- A consulta autorizada ao histórico do Crivo foi concluída somente em leitura. A estudante confirmou que o domínio baixo corresponde ao início do uso; isso não justifica recalcular ou limpar seu progresso. Dados e credenciais dessa consulta ficam fora do repositório público.
- Dependências atualizadas dentro das versões principais existentes. Firebase 12.19.0, Firebase Admin 14.5.0, Undici 7.30.0 e jsdom 30.1.1; overrides restritos de gRPC para Firestore e uuid para gaxios 6. Relatório e limites: [ATUALIZACAO-DEPENDENCIAS-2026-10-01.md](ATUALIZACAO-DEPENDENCIAS-2026-10-01.md).
- Auditoria npm passou de 12 dependências afetadas para zero vulnerabilidades conhecidas na data. Instalação limpa, TypeScript, build, integração Auth/Firestore em emuladores no Node 22 e HTTP/multipart locais aprovados. Busca e dez aberturas de telas em desktop/celular sem exceções ou transbordamento.
- Suíte completa após as atualizações: 779 testes Node e 760 testes Vitest aprovados (1.539 no total), com zero falhas.
- Próximas prioridades de produto: revisão visual/pedagógica do inventário, enunciados de Fuvest 2025 e revisão editorial dos resumos. As alterações seguem locais, sem publicação.

## Conteúdo e conferência de Ciências — 01/10/2026

- Recuperados os 90 enunciados da prova V1 da Fuvest 2025. Alternativas textuais de 88 questões restauradas; 60 e 69 mantêm alternativas gráficas na página original. Os textos-base de 13 questões e as notas de apoio foram preservados. As 2.797 outras questões, imagens, IDs e comentários não mudaram; os 90 gabaritos foram conferidos sem alterações.
- Receita em `scripts/recuperar-fuvest-2025.py`, com hash obrigatório do PDF. PDF e intermediários fora do Git. Se reutilizar o importador antigo de páginas, rodar a recuperação depois; a suíte agora recusa os antigos marcadores.
- Revisados osmose e estudo gráfico de lentes: 36 estados em 390/768/1440, claro/escuro e movimento reduzido. Corrigida a colisão entre “objeto” e “imagem” na lente divergente. Teclado, animação finita e alternância dos modos conferidos em desktop.
- Inventário: 532 sem revisão, 81 em validação, zero aprovados. Os dois novos registros são validação técnica; aprovação editorial continua pendente. Não declarar concluídas Ciências ou as 613 representações.
- Suíte: 782 testes Node e 760 Vitest aprovados, além dos testes específicos de mecanismos/inventário. Evidências e limites: [REVISAO-CONTEUDO-CIENCIAS-2026-10-01.md](REVISAO-CONTEUDO-CIENCIAS-2026-10-01.md). Alterações locais, sem publicação ou escrita no histórico real.

### Revisão visual integral — 02/10/2026 (UTC)

Relatório canônico: `docs/REVISAO-VISUAL-INTEGRAL-2026-10-02.md`; inventário em `docs/visual-integral-2026-10-02/capitulos.json` e `.csv`. Revisão da build local, sem login ou alteração de progresso: 613 capítulos/3.678 configurações, 28 telas/224 configurações, capturas e fonte confrontadas. Recomendações do mecanismo central: 315 preservar, 170 ajustar, 128 redesenhar; nenhuma aprovação editorial foi promovida.

Priorizar fidelidade de diagramas de Física/Matemática e associações de conteúdo; depois painel Personalizar fora da borda móvel, overflows em Independência/Competências/Admin Conteúdo, nomes acessíveis, foco da busca e contraste. Os 128 redesenhos incluem mecanismos genéricos sem explicação do assunto: não equivalem a 128 bugs de execução. Diagnóstico/persistência, todas as animações/combinações e telas dependentes de conteúdo autenticado não receberam certificação integral. Evidências completas e galeria local: `/workspace/crivo-visual-review-2026-10-02/`; imagens selecionadas sem material privado no diretório do relatório. Nenhum código do app foi alterado neste pedido de revisão.

## Publicação e primeiro lote visual — 02/10/2026

O trabalho anterior, as dependências, a recuperação de Fuvest 2025 e os relatórios de revisão integral foram publicados em `main` no commit `b22f4439`. A execução começou por quatro achados confirmados: reflexão plana, refração, limites do painel Personalizar no celular e gerenciamento de foco da busca, incluindo o carregamento sob demanda.

O [registro do primeiro lote](visual-integral-2026-10-02/primeiro-lote/README.md) reúne comportamento corrigido, capturas, regressões e limites. Validação final: 1.551 testes gerais, lint, build, 48 verificações de geometria no navegador e nove testes de navegação na build de produção aprovados. Os demais achados da revisão integral continuam pendentes; não tratar a presença de uma prancha ou este lote como aprovação editorial geral.

O primeiro CI remoto detectou uma incompatibilidade de `npm ci` (npm 10) com o seletor de override de gaxios. A regra foi corrigida sem trocar as versões do lockfile e verificada em instalações limpas completas e de produção. Ver [compatibilidade de dependências](ATUALIZACAO-DEPENDENCIAS-2026-10-01.md).

## Segundo lote visual por PR — 02/10/2026

A estudante autorizou nesta etapa publicar em outra branch e abrir PR automaticamente, em vez de enviar diretamente à `main`. A branch `fix/optica-espelhos-visao`, baseada em `05412f4b`, corrige o espelho côncavo (equação de Gauss, ampliação, foco e raios paralelos) e a prancha de miopia/hipermetropia efetivamente usada pelo capítulo (comparação sem/com correção, lentes externas e raios completos). O [registro do segundo lote](visual-integral-2026-10-02/segundo-lote/README.md) inclui capturas, regressões, modelos e limites. Estas mudanças são uma proposta para integração por PR; não estão incorporadas à `main` por este registro. Os demais achados do inventário permanecem pendentes.

## Terceiro lote visual por PR — 02/10/2026

A PR #242 foi incorporada em 02/10/2026; a nova base é `cfd4e13e`. O fluxo autorizado de branch e PR continua em `fix/matematica-sistemas-determinantes`: Sistemas agora representa as duas equações que se encontram em `(6,4)`; Determinantes mostra o paralelogramo das colunas da matriz, área e orientação, inclusive o caso singular `c = 10/3`. O [registro do terceiro lote](visual-integral-2026-10-02/terceiro-lote/README.md) reúne regressões, capturas e limites. Estas alterações serão propostas por PR; não representam merge automático nem aprovação editorial dos outros capítulos.

## Quarto lote visual ampliado por PR — 02/10/2026

A PR #243 foi incorporada em 02/10/2026. A estudante pediu mais correções por passo, para reduzir o tempo total; agrupar achados independentes e validar o lote em conjunto, mantendo branch e PR automáticas. A branch `fix/diagramas-geometria-fisica`, baseada em `1d22bc89`, reúne 11 capítulos: quatro de ângulos/semelhança, cinco de áreas/medidas e dois de Física (carga em B e trabalho do gás). O [registro do quarto lote](visual-integral-2026-10-02/quarto-lote/README.md) documenta relações, capturas, regressões e limites. É uma proposta por PR, sem merge automático. Não executar TypeScript junto ao navegador nesta infraestrutura: a combinação pode atingir o limite de memória e interromper verificações. Os demais achados e a aprovação editorial integral continuam pendentes.

## Quinto lote visual ampliado por PR — 02/10/2026

A PR #244 foi incorporada em 02/10/2026; base atual `b61b0518`. Mantido o pedido de lotes maiores e PR automática na branch `fix/matematica-probabilidades-sequencias`: 13 capítulos de probabilidades, trigonometria, geometria espacial, funções, sequências e anotações analíticas, mais acesso aos controles de Podcast, Treino da 2ª Fase, Tutor, Redação e Administração de Conteúdo. O [registro do quinto lote](visual-integral-2026-10-02/quinto-lote/README.md) reúne modelos, capturas, regressões e limites. Nenhum histórico real ou conteúdo autenticado foi alterado. Esta etapa é uma proposta por PR; não realizar merge automático nem considerar concluídos os outros achados do inventário.

## Retomada após a integração da PR #247

- Base de trabalho: `25cafa0dc60895e29cbe4727c118f9179f0d13aa`, após a integração das PRs #247 (pranchas científicas) e #248 (reprodução de podcasts). O CI e o deploy da PR #247 foram confirmados verdes.
- Três apontamentos da revisão de #247 foram reproduzidos e corrigidos: seleção da Primeira Lei no capítulo da Segunda Lei; origem de temperatura de Gibbs à esquerda do equilíbrio, com intercepto positivo; apoio de Termoquímica I separado do conteúdo de Gibbs.
- Quatro regressões de componente e oito cenários de interação no Chromium ampliam a cobertura existente. Capturas e reprodução: [complemento do sexto lote](visual-integral-2026-10-02/sexto-lote/README.md#ajustes-após-a-revisão-da-pr-247).
- A correção de podcasts já incorporada em #248 foi preservada. Esta rodada não altera autenticação, histórico real, Firestore ou aprovação editorial de outros capítulos.

- Validação da retomada: 806 testes Node e 895 testes Vitest passaram; 32 cenários Chromium e oito rechecagens de Gibbs passaram. Um timeout de `pairContract.test.tsx` observado durante execução concorrente não se repetiu isoladamente nem na suíte completa sem Chromium em paralelo. O limite original de 15 segundos foi preservado.

## Conferência de atualizações e navegação do iPad — 03/10/2026

A estudante enviou capturas de sobreposição da lateral e autorizou corrigir e prosseguir após conferir as atualizações. Base atual conferida: `f89ab5af`, incluindo o merge da PR #249 (`ee1a6e6f`) e a atualização automática de continuidade. As PRs #247, #248 e #249 já foram incorporadas. A branch da PR #250 foi atualizada sobre essa main, preservando as correções de Mendel/Gibbs e os dois registros de continuidade. Não repetir o sexto lote científico nem as correções já integradas. O próximo lote de mecanismos recomendado segue em Física (Lenz, Doppler e telescópio), após consultar o estado efetivo.

Na branch `fix/ipad-navigation-layout`, a coluna da grade acompanha o trilho expandido, a marca tem alternativa SVG em falha de carregamento e a gaveta ganhou entrada/contenção/restauração de foco, Escape e limpeza ao mudar para paisagem desktop. Evidências, limites e regressões: [navegação do iPad](visual-integral-2026-10-03/navegacao-ipad/README.md). Publicação por PR autorizada, sem merge automático. Histórico e chaves de persistência preservados.

## Lenz, Doppler e luneta após as integrações #250/#251 — 03/10/2026

- Main conferida novamente: `9dbdd3210fb32c7f92ba0713fc0bcf904bb2c8e0`. #250 (navegação do iPad) e #251 (geração de podcasts/seis vozes) estão incorporadas; checks e deploy da main passaram. As PRs #246, #234 e #222 continuam separadas deste trabalho.
- A branch `fix/fisica-lenz-doppler-luneta` resolve os três achados ainda presentes: Lenz compara aproximação/afastamento/fluxo constante com observador explícito; Doppler usa círculos das posições anteriores de emissão; luneta de Kepler usa foco comum, saída paralela invertida e escalas separadas declaradas. A cena não pretende modelar o microscópio.
- Revisão independente corrigiu a afirmação de proporcionalidade da seta de Lenz: ela tem comprimento esquemático declarado, enquanto as leituras de FEM permanecem quantitativas. Diagramas e demais modos foram preservados.
- Chromium: 36 cenários/336 estados em 390/834/1366 px, dois temas e movimento normal/reduzido; contenção e colisão de textos, geometria, controles Home/End, overflow e exceções de página passaram. TypeScript, build e matriz visual (13 testes, catálogo inalterado) passaram. Suíte geral: 819 testes Node + 898 Vitest (1.717) passaram, sem falhas.
- Modelos, regressões, capturas e limites: [lote de Física](visual-integral-2026-10-03/fisica-lenz-doppler-luneta/README.md). Histórico real, persistência e aprovação editorial permanecem preservados. Branch/PR automática autorizadas; nenhum merge automático.
- Próxima retomada: conferir esta PR e o delta efetivo de main; depois revalidar no código atual os achados de Corrente Elétrica, Potência Elétrica, Dilatação Térmica e Aceleração Vetorial da auditoria de 02/10 antes de compor o próximo lote. Não repetir os mecanismos já integrados e não tratar a auditoria histórica como estado atual.
