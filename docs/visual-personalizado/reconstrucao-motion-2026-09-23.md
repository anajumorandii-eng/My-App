# Reconstrução da aba Visual — 23/09/2026

Pedido: refazer os visuais dos capítulos após rejeição da qualidade das imagens e da ausência de movimento explicativo.

Base: `origin/main` em `aa9bf2c`. Implementação isolada em `C:\wt-crivo-motion-rebuild`, branch `codex/visual-motion-rebuild`. O checkout antigo `C:\wt-visual-personalizado` continha alterações próprias e não foi modificado. Este lote não foi publicado.

## Mudanças

- Seis capítulos de Ecologia: nitrogênio, eutrofização, dinâmica populacional, invasoras, sucessão e poluição da água. Solo, organismos e paisagens substituem os diagramas de caixas. A seleção altera o mecanismo; reprodução explícita avança por etapas e termina. Pausa e seleção manual interrompem a sequência.
- Revoluções Francesa e Industrial: cenas específicas de documentos, instituições, campo e fábrica. As transições mudam o recorte histórico sem representar uma causalidade inevitável.
- Projeções e dinâmica climática: deformação esquemática controlável e ascensão do ar nos três tipos de chuva. A projeção não é apresentada como mapa geográfico mensurável.
- Energia elétrica, migração, comércio e combustíveis: usina/rede/cidade, percurso migratório, porto/carga e fluxos de carbono. Cena antes dos cartões, repetição de movimento e controles originais preservados.
- Fotossíntese e quimiossíntese: substituída a imagem com zoom de entrada por cloroplasto com fluxos e procarionte. Reações fotoquímicas, Calvin e oxidação inorgânica possuem seleção própria. Corrigido o escopo da prancha, que antes comparava principalmente respiração.
- Corrigida a sombra da barra lateral fechada que cobria a borda esquerda no celular.

## Evidências e limites

- Ecologia: `screenshots/ecologia-motion-2026-09-23/`, 60 medições de largura/estado e 24 capturas.
- História/Geografia: `screenshots/humanas-motion-2026-09-23/`, 80 medições de largura/estado e 32 capturas de viewport.
- Bioenergética: `screenshots/bioenergetica-motion-2026-09-23/`, dez medições de largura e quatro capturas de viewport.
- Larguras: 360, 375, 390, 768 e 1440 px; temas claro/escuro. Sem overflow horizontal nas medições. As 150 medições não equivalem a 150 revisões estéticas completas.
- Reprodução e pausa de Ecologia verificadas no navegador; transformação intermediária e final do peixe em eutrofização observadas. Seleção por teclado verificada nos capítulos. Testar/Reconstruir mantidos, sem enviar respostas nem alterar o progresso do aluno.
- Movimento reduzido tratado pelos hooks e por teste de bioenergética. A ferramenta de navegador disponível não expõe emulação dessa preferência; não houve QA visual ao vivo desse modo.
- O teste de navegação `Visual.test.tsx` excedeu 15 s em execução concorrente; passou isoladamente com 18 testes. Execução consolidada limitada a dois workers para reduzir disputa de recursos.
- Validação final: `npm run lint` passou; `npm run test:vitest -- --maxWorkers=2` passou com 102 arquivos e 539 testes; `npm run build` passou com o aviso já existente de chunks grandes. `git diff --check` sem erros.
- `npm test` encontra um bloqueio de conteúdo anterior: 14 PDFs licenciados ausentes em `materiais brutos/`; não foram criados substitutos nem enfraquecido o teste.
- Aprovação estética pendente. Os seis registros de Ecologia antes marcados como aprovados foram reabertos após a rejeição explícita. Cobertura de catálogo não comprova qualidade.

## Continuidade

Este lote alcança 15 capítulos, não todo o catálogo de 613. A próxima revisão deve conferir os mecanismos ativos de Física e Química antes de editar pranchas: `visualRepresentation.ts` dá precedência aos experimentos, depois pranchas, instrumentos e cenas. Não confundir um componente existente com a representação realmente exibida.

Referências vinculantes: `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md` e `docs/visual-personalizado/referencias-aprovadas/`. Os esquemas novos ainda precisam de avaliação estética em relação a essas referências; os testes técnicos não conferem aprovação editorial.
