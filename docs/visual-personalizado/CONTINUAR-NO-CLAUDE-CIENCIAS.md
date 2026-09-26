# Continuidade para Claude — Química, Física e Biologia

## Pedido e escopo
A responsável pediu concluir Química (48 capítulos), Física (85) e Biologia (72): 205 no total. Pediu encerrar esta sessão por limite e passar instruções ao Claude. **As matérias NÃO estão concluídas.** O registro anterior tem 14 capítulos dessas três matérias em validação; este lote ainda não altera o status editorial.

## Ambiente e Git
- Trabalhar em `C:\Users\Ana Julia\Documents\CRIVO\My-App`. Salvar novos arquivos no perfil Ana Julia.
- Branch desta entrega: `codex/ciencias-motion`, baseada em `origin/main` `ad30134`.
- A PR #215 já foi incorporada como `d034226`; CI aprovado e 569/569 testes de componentes passaram. Não reaplicar seus commits.
- Origin: `https://github.com/anajumorandii-eng/My-App.git`.
- As PRs #212 e #213 de História/Geografia devem ser preservadas.
- Dependências existentes via junction. Não reinstalar nem apagar outros checkouts.
- Vite em `http://127.0.0.1:3117`; mudanças locais não são produção.
- Antes de editar: `git status`, `git fetch origin`, conferir alterações concorrentes e AGENTS.md. Não sobrescrever trabalho de outra sessão.

## O que este lote implementou
1. `AcidTheoryMechanism.tsx` e `AcidBaseBoard.tsx`: transferência de H+ (Brønsted–Lowry), doação de par eletrônico (Lewis), neutralização e espectadores. pH continua como complemento; corrigida a descrição de força versus concentração.
2. `LensPowerMechanism.tsx` e `LensBoard.tsx`: roteamento específico do capítulo de fabricante/associação; índices, curvatura e soma de vergências, inclusive zero e divergência. Modelo de lentes delgadas em contato, mesmo meio, R1=+R/R2=-R. Raios com escala fixa; foco pode ficar fora da janela.
3. `LensMechanism.tsx`: convergente/divergente e objeto no foco; não desenha imagem infinita nem coordenadas NaN. Afeta os dois capítulos de estudo gráfico/analítico.
4. `MembraneMechanism.tsx` e `MembraneBoard.tsx`: difusão facilitada e ciclo 3 Na+ para fora/2 K+ para dentro, um ATP. Corrigida generalização de que todo transporte ativo usa ATP diretamente.
5. `OsmosisMechanism.tsx`: comparação qualitativa animal/vegetal em meios hipo/iso/hipertônicos, explicita solutos não permeantes e pressão inicial. Novo complemento ainda precisa de QA no navegador.

## Validação já executada
- Testes iniciais: 16 passaram (ScienceMechanisms e registry).
- Após osmose e lentes divergentes: 11 passaram (ScienceMechanisms e LensMechanism).
- TypeScript passou antes da última pequena revisão de rótulos/testes; checagem final e build executados ao fechar a sessão, consultar resultado abaixo.
- Navegador: 18 verificações em 390/768/1440, claro/escuro, sem overflow horizontal; evidências em `docs/visual-personalizado/screenshots/ciencias-2026-09-25/` e `audit.json`.
- Teclado: troca de Lewis e bomba; slider para estado final; segunda lente em -5 resultou sistema afocal.
- Capturas mostram ácido/Lewis, fabricante e bomba. **Não validam as adições posteriores de osmose e lente divergente/foco.**
- Movimento reduzido testado em componente; não emulado no navegador nesta rodada.
- Não declarar os 205 capítulos aprovados com base em rotas, inventário ou testes.

## Próximos passos, em ordem
1. Ler `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`, `docs/FUNCTIONALITY_MAP.md` e referências aprovadas. Usar cenas próprias do fenômeno; evitar trocar diagramas genéricos por outros diagramas genéricos.
2. Revisar conceitualmente as novas cenas, em particular o par de Lewis compartilhado (não elétrons livres viajando), a contabilidade dos reagentes/produtos e a estequiometria da bomba. As animações são esquemas didáticos, não trajetórias moleculares reais.
3. Completar QA da osmose, convergente/divergente e foco em mobile/tablet/desktop, dois temas, teclado e movimento reduzido. Testar Explorar/Testar/Reconstruir preservando o progresso. Conferir também abas Essencial/Relações no mobile.
4. Rodar `npm run lint`, testes direcionados, `npm run build`; suíte completa quando viável. O teste Node `summaryCatalog.test.ts` pode falhar pelos 14 PDFs licenciados ausentes no checkout esparso; não fabricar placeholders.
5. Registrar revisões somente com evidências reais em `src/views/visualQualityReviews.ts`, rodar `npm run visual:quality`. Aprovação editorial é distinta de validação técnica.
6. Auditar os demais capítulos de Química, Física e Biologia individualmente usando `27-qualidade-visual.json`, `visual-boards/registry.ts`, `visual-instruments/registry.ts` e cenas ativas. Ler `deepSummaryContent.json` para lastro; ele também pode conter simplificações que exigem correção cuidadosa.
7. Continuar por lotes validados e publicar por PR. O usuário já autorizou commits/PR; não aguardar nova permissão para o trabalho rotineiro.

## Limites e preservação
- Não confundir os 205 capítulos com 205 pendências inéditas: há cenas existentes boas e outras genéricas. O próximo agente deve verificar o estado real.
- Não mexer em autenticação, trocar perfis, copiar segredos ou migrar SQLite para continuar este trabalho.
- Não alterar a marca CRIVO nem as chaves legadas `juju_`.
- Histórico de recursos/quinto não entregue permanece em `backup/local-motion-before-cloud`; não reaplicar sobre as cenas publicadas de humanas.

## Resultado final desta sessão

Checagem final de tipos e build passaram. Build em 39,63 s, com aviso de tamanho de bundle. Os 11 testes direcionados mais recentes passaram. QA adicional e suíte completa permanecem para a continuação; manter PR em rascunho até essa revisão.


## Revisão posterior da PR #216

Revisados osmose e lentes divergentes/foco em 390, 768 e 1440 px, claro/escuro: 18 verificações sem overflow de página, com capturas em `screenshots/revisao-216/`. Osmose acessível pela aba Relações no mobile. Seleção e ajuste final por teclado; modo isotônico conferido. Abertura de Testar e Reconstruir conferida em lentes, sem enviar respostas nem modificar evidência de aprendizagem.

Correções: percurso da água agora chega dentro da célula retraída; meio isotônico mostra trocas opostas; célula vegetal túrgida aproxima-se da parede. Texto dos raios distingue prolongamento virtual da divergente; controles divergentes usam distância numérica para não chamar o foco virtual de foco objeto.

Movimento reduzido continua coberto por componente; emulação visual e aprovação editorial permanecem pendentes. A revisão não certifica todas as cenas das três matérias.

### Ordem do Claude atualizada pelo estado real

Lote 1: oito capítulos em validação; lote 2: seis, publicados nas PRs #212/#213. Lote 3: seis, **já publicado na PR #214**, também em validação. Não refazer esses lotes. Conferir pendências editoriais das evidências existentes e prosseguir ao lote 4 (Brasil Império e Primeira República), depois lote 5 (População e cidade), preservando Ciências na PR #216. Estado verificado contra origin/main ad30134. Esta rodada auditou registros de humanas, não repetiu o QA visual dos 20 capítulos.

Validação das correções de revisão: TypeScript passou; 24 testes direcionados passaram. PR permanece em rascunho para aprovação editorial.
