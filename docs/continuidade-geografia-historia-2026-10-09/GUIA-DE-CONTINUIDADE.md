# Continuidade do Crivo — Geografia e História

**Registro histórico da interrupção em 09/10/2026.** A usuária autorizou a retomada nesta mesma conta depois do checkpoint. Consulte o [relatório atualizado](../redesign-geografia-historia-2026-10-09/README.md) e `ESTADO.json` para o resultado da retomada. O ZIP preserva o rascunho original; não o use para sobrescrever a versão atual da branch.

## Repositório e ponto de retomada

- Repositório público: https://github.com/anajumorandii-eng/My-App
- Aplicativo: https://mycrivo.com
- Branch desta tarefa: `redesign/geografia-historia`.
- Base da branch: `e296f10c1a79f694ed6085dec65398ae2d144cbe`.
- PR desta tarefa: consultar `ESTADO.json` nesta pasta ou a lista de PRs do repositório.
- A revisão funcional anterior está **integrada**: PR #287, https://github.com/anajumorandii-eng/My-App/pull/287, merge em 09/10/2026. Ela percorreu 613 capítulos, corrigiu oito casos em Matemática/Química/Biologia e passou 2.345 testes. Evidências: `docs/revisao-individual-capitulos-2026-10-09/README.md`.
- Redesenho geral e personalização de fundo anteriores: PRs #285 e #286, integradas. Preservar o trabalho já existente.

## O que a usuária quer

Refazer Geografia e História depois da revisão individual dos capítulos. São **63 capítulos de Geografia e 49 de História (112)**. O inventário com os IDs exatos está em `inventario-112-capitulos.json` nesta pasta.

A estética aprovada usa papel editorial quente no tema claro, lousa no escuro, tipografia expressiva, vinho, verde e azul, objetos/ícones com profundidade 3D e anotações desenhadas. O aplicativo deve ser moderno, bonito, interativo e funcional. Cada interação precisa ajudar a estudar. A referência enviada pela usuária é uma prancha de expansão adiabática com pistão em relevo, gráfico, setas e painel de diagnóstico. Há também referências de mapas mentais com ícones e vídeos; os originais do visual aprovado estão em `docs/visual-personalizado/referencias-aprovadas/`.

A usuária pediu Design & Motion Kit. Foi aplicada a skill `design-motion-kit:awesome-design-md`, com consulta à referência Notion para hierarquia editorial, cartões, espaçamento e alvos de toque. **Adaptar à identidade Crivo**, sem copiar identidade de outra marca. A referência serve para composição, não para substituir as cenas autorais por cartões genéricos. Se o plugin não estiver disponível na outra conta, continuar pela documentação e pelo código existentes.

A usuária autoriza salvar em branches e abrir PR sem pedir novamente, mas o repositório proíbe merge automático. Nunca deixar a entrega somente local. O pedido de **parar e salvar** originou este checkpoint; uma instrução posterior autorizou continuar na mesma conta.

## Implementação já escrita, ainda em rascunho

Cinco arquivos foram criados/alterados:

1. `src/views/visual-boards/StudyObjectIcon.tsx`: 13 novos objetos em relevo com gradientes — terreno, mapa, chuva, rio, cidade, rede, cultivo, energia, navio, fábrica, documento, fortificação e urna. A seleção do objeto é orientada pelo título/assunto. Geografia e História deixam de usar sempre o mesmo globo/coluna. São **ícones de navegação**, não novas simulações nem garantia de representação científica completa.
2. `src/views/HumanitiesWorkspace.css`: nova apresentação restrita a Geografia/História via `data-humanities-workspace`. Cabeçalho, objetos maiores, hierarquia editorial, recortes, comparação, fontes e percurso conceitual. Usa tokens existentes. Há adaptações para celular, mas **não foram conferidas em navegador**.
3. `src/views/HumanitiesConcepts.tsx`: percurso dos conceitos de cada capítulo, usando `VisualMap.nodes`, `states`, `selectedId` e `onSelect`. Mostra o estado real de aprendizagem e abre o diagnóstico existente, sem gravar evidência própria.
4. `src/views/VisualArtifact.tsx`: marca a área de Geografia/História e insere o percurso conceitual **somente em Explorar**, evitando expor respostas em Testar. A resolução do artefato original permanece.
5. `src/views/topic-scenes/families/HistoriaGeografia.tsx`: controles de recorte antes da figura; comparação entre recorte A e B; seleção de B sem repetir A; alternância de uma mesma prancha entre A/B; afirmações e fontes lado a lado; trechos de apoio em `<details>`. Há uma única figura renderizada, evitando duplicar IDs de SVG. `useSceneMotion` mantém respeito ao movimento reduzido. Cenas autorais existentes continuam explicando os fenômenos.

**Isto é uma primeira camada de redesenho e interação, não o redesenho completo individual dos 112 capítulos.** Nenhum conteúdo pedagógico foi aprovado automaticamente. Ainda é preciso revisar o encaixe das interações e a estética de cada capítulo, além de melhorar cenas específicas quando necessário.

## Arquitetura que deve ser preservada

- `src/views/VisualArtifact.tsx` escolhe o artefato primário.
- `src/views/visualRepresentation.ts` define a prioridade. `HG_AUTHORED_IDS` dá prioridade às cenas autorais de Humanas; não mudar a precedência inadvertidamente.
- Inventário atual: 103 capítulos abrem cena, sete instrumento, um experimento e uma prancha. A comparação nova está no componente `HistoriaGeografia`, **não necessariamente em todas as 103 cenas**. Conferir a cobertura real pelo navegador; não afirmar cobertura de comparação para 112.
- `src/views/topic-scenes/families/HistoriaGeografia.tsx` centraliza muitas cenas de Humanas, importando os lotes e cenários específicos.
- `src/views/topic-scenes/data/geografia.ts`, `historia.ts`, `hgLotes.ts` e `lote11.ts` a `lote19.ts` guardam recortes e fontes.
- As cenas específicas estão em `src/views/topic-scenes/families/`, incluindo GeografiaFisica, GeografiaMundial, Cartografia, AguasBiomas, AmbienteEnergia, Globalizacao, EconomiaBrasil, Geopolitica, OrienteMedio, Antiguidade, IdadeModerna, SeculoXX, HistoriaMundial, BrasilImperio, BrasilRepublica e EraVargas.
- As exceções usam `src/views/visual-instruments/` e `src/views/topic-experiments/`. Não esconder seus controles nem substituir mapas/perfis por uma ilustração genérica.
- `src/lib/visualStudy.ts` define IDs, estados e relações. O percurso sequencial das seções é **percurso pedagógico**, não cronologia histórica nem uma cadeia de causalidade científica. Não apresentar a ordem das seções como se fosse ordem real de eventos.
- `ChapterSceneFrame` já mantém a cena montada ao ampliar, captura o foco, permite Escape e torna o restante da interface inerte. Preservar esse comportamento.

## Estado das verificações no momento da interrupção

O teste direcionado `src/views/topic-scenes/families/HistoriaGeografia.test.tsx` passou: 20 testes, um arquivo. Ele verifica comportamento já existente; **a nova comparação e o percurso ainda não receberam testes próprios**.

`npm run lint` e `npm test` passaram: 943 testes de modelos/servidor e 1.402 de interface, total de 2.345. O registro está em `ESTADO.json`. Foram executados apenas para permitir o checkpoint no GitHub, como exige o repositório. **Não há build nem revisão visual em navegador desta implementação nova. Não há capturas novas.** Não usar as capturas da revisão anterior como aprovação deste redesenho.

## Como abrir em outra conta

A outra conta precisa ter acesso de escrita ao GitHub para continuar salvando. Autorização do GitHub e variáveis de ambiente não são transferidas pelo guia. Não compartilhar tokens, senhas ou arquivos `.env`.

```bash
git clone https://github.com/anajumorandii-eng/My-App.git
cd My-App
git fetch origin
git switch --track origin/redesign/geografia-historia
npm ci
```

Se o repositório já estiver clonado, preservar alterações locais e usar `git fetch origin` / `git switch redesign/geografia-historia`; não usar reset destrutivo. Conferir se a branch/PR já avançou e ler o guia da versão mais recente.

Leia `CLAUDE.md`, eventuais `AGENTS.md`, `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`, `docs/PLANO-GERAL-CRIVO-2026-10-03.md` e esta pasta antes de editar. Audite `origin/main` e PRs abertas para não duplicar ou sobrescrever trabalho. Não presumir que o último checkout corresponde ao último estado remoto.

```bash
git status --short
git log -5 --oneline
gh pr list --repo anajumorandii-eng/My-App --state open
npm run dev
```

A aplicação usa React 19 + TypeScript + Vite, Express e Firestore. Os dados reais da estudante não devem ser usados para testar. No ambiente desta conta o navegador era Chromium em `/usr/bin/chromium`; na outra conta localizar o executável disponível. **Não rodar `playwright install` automaticamente.**

## Próximas tarefas, em ordem

1. Confirmar a integridade do checkpoint e ler o inventário de 112 capítulos. Trabalhar primeiro Geografia, depois História, preservando os demais assuntos.
2. Criar testes relevantes para comparar A/B: B nunca igual a A; trocar B atualiza a figura; trocar A retorna à sua figura; fechar/reabrir comparação conserva estado válido; teclado funciona; fonte corresponde ao recorte mostrado; modo reduzido mantém o resultado estático completo.
3. Testar o percurso conceitual: `onSelect` recebe o ID correto; seleção e diagnóstico existentes acompanham o clique; estado vem da evidência; nenhum estado é promovido pelo clique; percurso não aparece em Testar/Reconstruir.
4. Conferir os 13 novos ícones: a combinação `topic + title` pode casar termos amplos demais. Ajustar classificações ambíguas por capítulo quando necessário. Ícones devem ter volume, legibilidade e coerência; não ser o substituto da cena.
5. Abrir os 112 capítulos, identificar os que usam este componente e os que têm instrumento/experimento/prancha/outra família. Registrar a cobertura real por ID. Nos demais, estudar como adaptar a apresentação preservando sua interação própria.
6. Revisar individualmente a representação de cada assunto. Geografia: mapas esquemáticos honestos, projeções, chuva, bacias, relevo, biomas, fluxos e redes. História: separar cronologia, condição e causalidade; não introduzir causa determinista ou datas novas sem lastro. Não encerrar a tarefa apenas com a mesma estrutura e um ícone diferente.
7. Conferir em navegador real 360/390, 834 e 1440 px; claro/escuro; teclado; pan dentro da figura, sem rolagem horizontal da página; modo foco e Escape; zoom onde existente; movimento normal/reduzido; console e recursos de rede. Usar axe onde disponível.
8. Verificar Explore/Test/Rebuild, perguntas, tentativas, persistência e Caderno de Erros. A seleção e o diagnóstico precisam continuar rastreáveis.
9. Salvar capturas, relatório por capítulo, limitações e resultados em documentação no repositório. Não dizer que 112 foram aprovados se só uma amostra foi vista.
10. Executar `npm run lint`, `npm test` e `npm run build`. Antes de **todo push**, lint limpo e suíte completa verde. Não executar testes completos simultaneamente com varreduras pesadas de navegador/build: um teste de Resumos excedeu 15 s na rodada anterior sob concorrência, mas passou isoladamente e na suíte final sem essa carga.
11. Enviar checkpoints para esta branch e atualizar o PR em rascunho quando ainda faltar trabalho. Ao concluir a revisão, atualizar descrição, evidências e estado do PR. **Não fazer merge automático nem publicar no site sem o fluxo correspondente.**

## Regras importantes

- Repositório público: não commitar PDFs de apostilas, textos extraídos, resoluções licenciadas ou marcas d'água com nome/e-mail/CPF. Não incluir segredos ou dados pessoais da estudante em capturas e logs.
- Não incluir identificadores de modelo em commits, PRs ou artefatos do repositório.
- Não renomear chaves históricas `juju_*` de armazenamento: isso apagaria progresso.
- Não promover aprovação pedagógica formal por testes/contagens. A fila editorial histórica não foi encerrada por esta implementação.
- Não instalar o conjunto inteiro de dependências de exemplos do kit. A implementação atual não adicionou dependências.
- Dar prioridade à funcionalidade. Movimento deve explicar seleção/causalidade e respeitar `prefers-reduced-motion`; evitar decoração contínua.

## Cópia dos arquivos alterados

O arquivo [Crivo-checkpoint-geografia-historia.zip](Crivo-checkpoint-geografia-historia.zip) inclui os cinco arquivos de implementação e esta pasta de instruções/inventário/estado. É um backup incremental, não o repositório completo. Para executar, obtenha o repositório pela branch indicada acima. O arquivo não contém credenciais nem variáveis de ambiente.

## Mensagem pronta para colar na outra conta

> Continue o Crivo a partir da branch `redesign/geografia-historia` do repositório https://github.com/anajumorandii-eng/My-App. Leia primeiro `docs/continuidade-geografia-historia-2026-10-09/GUIA-DE-CONTINUIDADE.md` e `ESTADO.json`, além das instruções do repositório. O trabalho anterior foi interrompido a meu pedido e salvo em PR em rascunho. Quero refazer os 63 capítulos de Geografia e os 49 de História com o Design & Motion Kit, mantendo a estética editorial moderna, os objetos 3D e interações úteis. Já existe uma primeira implementação de ícones por assunto, composição, comparação A/B e percurso conceitual, mas faltam validação visual e revisão individual. Não tratar o rascunho como entrega pronta. Preserve o que já foi integrado nas PRs #285, #286 e #287. Pode continuar, salvar checkpoints no GitHub e atualizar o PR sem me pedir confirmação novamente. Não deixe nada somente local e não faça merge automático.
