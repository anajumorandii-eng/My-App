# Validação da integração multibancas

Publicação autorizada pela instrução posterior da usuária: “ignora por agora essa etapa. usa o que tem”. Foram integradas somente as 16 edições completas disponíveis. UNESP2026 e ENEM2021–2023 foram adiadas e permanecem fora dos denominadores; não se apresenta cobertura total das 20 edições originalmente planejadas.

## Corpus publicados

|Banca|Edições efetivamente classificadas|Cadernos|Registros|Excluídos|
|---|---|---:|---:|---:|
|ENEM|2024–2025|4|362|4|
|UNESP|2022–2025|10|556|0|
|FAMERP|2022–2026|10|505|0|
|UNIFESP|2022–2026|10|230|0|
|Total|16 edições|34|1.653|4|

Há 1.649 fichas válidas nessas quatro bancas. O gerador exige todos os arquivos da lista explícita de edições completas e valida todas as bancas antes de substituir qualquer export. `plannedYears` registra a janela originalmente pretendida sem inventar questões ou denominadores para os anos adiados. Cada caderno publicado tem suas próprias fichas completas.

Foram concluídas nesta retomada ENEM2024, UNESP2025 e UNIFESP2022, com auditorias individuais. Rascunhos históricos dos dois primeiros estão identificados como superados; o rascunho adicional UNESP2026 contém 45 fichas objetivas e está fora das entradas do gerador. Não houve classificação dos três ENEM adiados.

## Integração e preservação

- `ExamIncidenceExplorer` passou a ocupar o painel principal de Prioridades, com seletor FUVEST/ENEM/UNESP/FAMERP/UNIFESP.
- Cada banca oferece filtros de edição, matéria, formato, assunto/subassunto, confiança e busca; fichas expõem estratégia, erro, fonte e página.
- Os grupos UNESP de segunda fase objetiva2022/2023 e discursivos posteriores continuam separados na incidência **e** no cálculo do sinal de prioridade. Não se somam seus denominadores.
- Os quatro exports agregados substituem integralmente as amostras antigas dessas bancas em `examEvidence.ts`. Não se mantêm em paralelo exemplos antigos com outro ID para a mesma questão.
- FUVEST: classificação de1.135 registros preservada; o ranking pessoal continua usando15 coortes de2022–2026 e683 fichas válidas recentes. Os450 registros anteriores continuam no explorador histórico, sem entrar nessa janela pessoal.
- Unicamp: três recortes e150 fichas existentes preservados, sem expansão. O carregador de evidências retorna2.482 IDs únicos (150 Unicamp +683 FUVEST recente +1.649 das quatro bancas).
- Grafia “Artes” é harmonizada para “Arte” na exportação. IDs nulos de conteúdos não mapeados são preservados; ausência de tópico curricular não se torna ausência de cobrança.
- Não há merge automático; a entrega permanece na branch e PR351.

## Verificações executadas

- `node --import tsx scripts/buildBoardIncidence.ts`: aprovado para16 edições/34 cadernos/1.653 unidades. Fontes, estratégias, páginas, IDs, ressalvas e integridade dos cadernos validados antes das gravações.
- Manifestos publicados normalizam `url`/`sourceUrl`, preservam proveniência e rejeitam hashes divergentes para a mesma URL; caminhos locais de scratch não são publicados.
- JSON publicado e cópia em `src/data/incidence` comparados byte a byte; quantidade de linhas CSV confere com cada corpus; hashes de todos os16 arquivos de classificação recalculados e comparados a `classificationFiles`.
- `npm run lint`: aprovado.
- `npm run build`: aprovado. Avisos existentes de tamanho de chunks/importações mistas não impedem o build.
- `npm run test:node`: 1.195 aprovados, um ignorado, zero falhas (1.196 testes).
- `npm run test:vitest -- --maxWorkers=4`: 3.274 aprovados e três falhas de espera em dois arquivos de palcos visuais, em248 arquivos/3.277 testes. O DOM das falhas de História/Geografia ainda mostrava “Carregando representação…”. Os dois arquivos passaram sem alterações com um worker: `hgStage.test.tsx`,120/120; `stageStep.test.tsx`,7/7. Uma tentativa de ampliar as esperas para5s não eliminou a instabilidade: nova execução concorrente com a verificação de tipos teve125 aprovados e duas falhas (carregamento e timeout de15s em outra cena). Essa tentativa foi desfeita; os testes dos palcos permanecem intactos. Há uma pendência de estabilidade da suíte geral sob carga, fora da integração de incidência. A execução geral não deve ser apresentada como integralmente verde; a confirmação isolada127/127 não substitui uma execução geral verde.
- Testes focais de interface (`StrategyExplorer`, `BoardIncidencePanel`, `Prioridades`):14 aprovados; `PriorityStudyPanel` e `ExamEvidencePanel`:7 aprovados. Dois waits de `StrategyExplorer` foram ajustados de1s implícito para5s explícitos após reproduzir espera de fontes/PDF superior a1s; sem alterar o comportamento do produto.
- Playwright/Chromium: dois projetos aprovados tanto no servidor de desenvolvimento quanto no preview do build de produção (porta4173), desktop1440×900 e celular390×844, por `tests/e2e/incidencia-multibancas.spec.ts`. Sem vazamento horizontal. Verificadas troca de bancas, contagens, fichas/estratégias, fonte com `#page=`, cinco downloads por banca com HTTP200, seleção de anos adiados, tabela sem ocorrências para recortes não classificados e retorno ao painel FUVEST. O estado ausente mostra “Sem cobertura”, sem contador0/0 ou percentual inventado.

Reprodução do navegador com Chromium do ambiente:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/e2e/incidencia-multibancas.spec.ts
```

Fontes e figuras desta retomada foram efetivamente abertas conforme as auditorias de cada edição; a validação de navegador verifica apresentação e rastreabilidade, não substitui auditoria editorial. Não houve dupla codificação independente integral. Estratégias abertas são autorais e os espelhos não localizados continuam nulos, sem respostas oficiais inventadas.

## O que ficou adiado

UNESP2026: primeira fase lida,45 fichas preservadas; faltam redigir46–90 e ler/classificar37 unidades abertas, revisar e auditar. ENEM2021–2023: fontes inventariadas, sem novas fichas. Uma expansão futura deve alterar a lista explícita do gerador e os testes de cobertura somente após concluir cada edição. A proposta original de teste20/43/2323 segue preservada em `pendencias/`.
