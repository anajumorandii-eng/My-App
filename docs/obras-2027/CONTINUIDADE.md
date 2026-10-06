# Obras 2027 — continuidade (06/10/2026)

Branch: `claude/focused-volta-bnzw7d`, criada a partir da PR #272
(`fix/obras-obrigatorias`, `1bd7d4a3`). **Não** fazer merge da main nesta
branch: traria os PDFs de `obras-brutos/` para o diff. A PR desta branch deve
ter como base `fix/obras-obrigatorias`. Ainda não há PR aberta para esta branch. Nesta retomada, `gh pr list`
funcionou; o erro 403 pertencia à sessão anterior.

O checkpoint `feat/obras-estudo-e-treino` / `eb2836d9` e
`/workspace/artifacts/obras-checkpoint` nunca chegaram ao remoto; o trabalho
foi refeito aqui a partir da #272. As correções técnicas citadas naquele
checkpoint (autenticação, gabarito após tentativa, histórico, revisão ativa,
navegação, catálogo 2027) **não existem** neste repositório e não foram
reimplementadas.

## Como preparar o ambiente (texto extraído nunca vai para o git)

```bash
mkdir -p materiais-extraidos/obras-pdf
git ls-tree -r --name-only -z origin/main obras-brutos | while IFS= read -r -d '' f; do
  git show "origin/main:$f" > "materiais-extraidos/obras-pdf/$(basename "$f")"; done
# nomes em NFD: paginar com o slug certo, p.ex.
python3 scripts/conferir-dossie.py paginar <slug> "materiais-extraidos/obras-pdf/<arquivo>.pdf"
python3 scripts/conferir-dossie.py conferir          # cartões + aspas das análises
```

## Feito

- FUVEST (9 dossiês da #272): todas as citações e aberturas conferem com os
  PDFs que chegaram na main. Corrigido o Opúsculo (cap. LXI pertence à parte
  indígena, p. 146-159; conclusão = LXII, p. 159-162; IDs preservados). Teste
  novo recusa parte que termina depois do início da seguinte.
- `conferir-dossie.py` agora confere também as aspas das análises/guias.
- Unicamp, em `needs_review`, cada um com commit próprio:
  Canções escolhidas (007cea4b), Prosas seguidas de Odes mínimas (84b3cd88),
  A vida não é útil (eafb40d5), Olhos d'água (7e1bd121),
  Morangos mofados — 6 contos (7b478fba).
- Varredura de dados pessoais na camada de texto dos PDFs: só e-mails de
  editora. Marca d'água em imagem não foi verificada.

## Falta — lista anterior, substituída pelo checkpoint abaixo

1. **Os funerais da Mamãe Grande** (slug `funerais-da-mamae-grande`) — lido
   inteiro; falta escrever o JSON. Record, e-book 2019, trad. Édson Braga
   (p. 5-6). Contos e páginas do PDF (título em página própria):
   A sesta da terça-feira 8-12; Um dia desses 13-15; Nesta terra não há
   ladrões 16-32; A prodigiosa tarde de Baltazar 33-38; A viúva Montiel 39-43;
   Um dia depois do sábado 44-57; As rosas artificiais 58-62;
   Os funerais da Mamãe Grande 63-72. Usar `opening` = título do conto.
   Trechos já localizados (conferir com o script): "Era um homem muito bom."
   (p. 12); "O senhor vai nos pagar agora vinte mortos, tenente." (p. 15);
   "Nesta terra não há ladrões. Todo mundo conhece todo mundo." (p. 19);
   "porque você é ainda mais burro do que ladrão" (p. 32); "Afinal de contas,
   eu a fiz para isso." (p. 37); "O mundo está malfeito" (p. 41);
   "Quando seu braço ficar dormente." (p. 43); "A vida de um animal — disse o
   padre — é tão importante para o Senhor quanto a de um homem." (p. 49);
   "Hotel Macondo" (p. 51); "Se você quer ser feliz, não se confesse com
   estranhos." (p. 61); patrimônio invisível (p. 68); "lição e escarmento das
   gerações futuras" (p. 72). Ligações com Macondo/Aureliano Buendía nas
   p. 11, 48-49, 65-66, 71. PDF de site de download (p. 3).
2. **No seu pescoço** (12 contos; tradutor/edição não identificados — ver
   AUDITORIA_FASE0), **Vida e morte de M. J. Gonzaga de Sá** (Wikisource),
   **Memórias póstumas de Brás Cubas** — ler inteiros antes de escrever.
3. Registrar cada slug em `src/lib/workDossiers.ts`.
4. Registro de cobertura e limitações neste diretório (por obra: leitura
   integral feita, edição, procedência, pendências).
5. `npm run lint`, `npm test` completo, `npm run build`; push; abrir PR com
   base `fix/obras-obrigatorias`, sem merge.

## Regras que valem em todo dossiê

Tudo `needs_review`; `sourceRefs: []` (nenhuma crítica lida); citações ≤ 30
palavras, literais, com página; prefácios/introduções das edições não usados;
inferências e fatos externos marcados como tais em Fontes; não inventar
página, fonte ou leitura; não commitar PDF nem texto extraído.

## Checkpoint da retomada — 06/10/2026

O usuário interrompeu a execução para salvar tudo e obter um prompt de continuidade. Este checkpoint tem prioridade sobre a lista anterior de pendências.

### Salvo e conferido

- `c96b68b5`: Funerais, oito contos, nove evidências e oito módulos. Análise 0–31, quinze componentes por guia e cinco questões abertas. Leitura integral textual realizada novamente. Loader registrado. Relatório: `leitura-funerais-da-mamae-grande.md`.
- `e26bc47c`: No seu pescoço, doze contos, treze evidências e oito módulos. Análise 0–31, quinze componentes por guia e seis questões abertas. Leitura efetiva das 136 páginas, incluindo reparação dos lotes truncados. Loader registrado. Relatório: `leitura-no-seu-pescoco.md`.
- `conferir funerais-da-mamae-grande` e `conferir no-seu-pescoco`: passaram antes de cada commit.
- `npm run lint`: passou nesta retomada, antes dos últimos registros de loader; repetir na verificação final.
- Os dois dossiês continuam inteiramente `needs_review`, com `sourceRefs: []`. Pesquisa acadêmica e cotejo de provas oficiais ainda não concluídos. Não promover a publicado só porque a conferência literal passou.

### Habilidade utilizada e ambiente

A habilidade entregue no ZIP chama-se `obras-obrigatorias-fuvest-unicamp-avancada`, embora o pedido a denomine `analise-literaria-fuvest-unicamp`. Foi lida, com seus quinze arquivos de referências. Nesta máquina está extraída em `/tmp/obras-retomada-habilidade/obras-obrigatorias-fuvest-unicamp-avancada/`. O ZIP anexado está em `/tmp/codex-remote-attachments/01a111e2-f068-7153-a2fd-6aa1452b4017/895AB86D-1F32-434A-9BBB-DB1B67D95DA2/1-obras-obrigatorias-fuvest-unicamp-avancada-3.zip`. Esses caminhos locais podem não sobreviver a uma máquina nova: nesse caso usar o anexo disponível, sem fingir que a habilidade foi lida.

Requisitos recuperáveis da habilidade: leitura primária integral; mapa real de unidades; análise numerada 0–31; quinze componentes por unidade, proporcionais ao texto; separar evidência textual, interpretação própria e crítica documentada; no mínimo cinco questões autorais, sem respostas expostas imediatamente; estratégias FORMA/FUVEST e FONTE/Unicamp; revisão em 24 h, 7 d, 30 d e pré-prova; pesquisa acadêmica rastreável obrigatória para conclusão editorial. Lacunas devem permanecer explícitas.

PDFs extraídos de `origin/main` (5b891a6d) para `materiais-extraidos/obras-pdf/`, ignorado pelo Git, sem merge da main. Textos paginados dos quatro livros novos estão em `materiais-extraidos/obras/<slug>.paginas.txt`. Contagens: Funerais 85, No seu pescoço 136, Gonzaga 92, Brás Cubas 134. O PDF de Brás Cubas desta retomada é Câmara 2018, não a edição antiga de 140 páginas.

Fonte oficial efetivamente consultada: notícia Unicamp/Comvest de 25/03/2025, https://www.unicamp.br/noticias/2025/03/25/comvest-divulga-listas-de-livros-para-os-vestibulares-2027-2028-e-2029/ . Confirma as nove obras de 2027. Crossref forneceu metadados de possíveis estudos; metadados não equivalem à leitura de artigo. Nenhuma interpretação acadêmica desses resultados foi atribuída aos dossiês. Fontes temporárias em `/tmp/unicamp-obras-fonte` e `/tmp/crossref-obras-fonte` não substituem fontes documentadas.

### Continuação necessária

1. Conferir o estado dos arquivos de Gonzaga e Brás Cubas e respectivos relatórios de leitura, registrados abaixo. Se o JSON estiver incompleto, continuar a redação usando o mapa salvo; se pronto, revisar os guias e a análise, conferir citações e registrar o loader.
2. Um commit por obra; antes de cada um: `python3 scripts/conferir-dossie.py conferir <slug>`. Não alterar o conferidor para contornar discrepâncias.
3. Produzir registro de cobertura e limitações por obra, distinguindo leituras realizadas nesta retomada das verificações anteriores registradas acima. Não inventar leitura acadêmica.
4. Repetir lint, executar `npm test` completo e `npm run build`. Teste focado de dossiês não substitui a suíte completa.
5. Fazer push e abrir PR com base **`fix/obras-obrigatorias`**, sem merge. Não incorporar PDFs ao diff.
6. As correções técnicas do antigo checkpoint continuam fora desta execução: gabarito após tentativa, histórico, revisão ativa funcional, navegação e catálogo 2027 não foram implementados. As questões dos novos dossiês são conteúdo em Markdown, não um sistema novo de tentativas.


### Gonzaga de Sá e Brás Cubas: estado persistido

- `1b45e551`: Gonzaga de Sá concluído como rascunho `needs_review`, com loader: 14 unidades (duas molduras ficcionais e doze capítulos), vinte cartões, oito módulos, quinze componentes por guia, análise 0–31 e cinco questões sem gabarito. `conferir gonzaga-de-sa`: passou antes do commit. Leitura efetiva das 92 páginas registrada em `leitura-gonzaga-de-sa.md`. Pesquisa externa limitada à página primária Wikisource, sem crítica acadêmica atribuída.
- **Brás Cubas: leitura integral concluída, JSON ainda não escrito e loader ainda não registrado.** `leitura-bras-cubas.md` preserva o mapa dos 160 capítulos, paginação, achados e limites. `rascunhos/bras-cubas-notas-1-160.txt` preserva análises próprias dos capítulos 1–160, não o texto integral do livro. As 160 notas estão salvas; continuar com a montagem do JSON. A leitura visual confirmou dedicatória em p. 7, rabiscos em p. 42 e epitáfio de Eulália (19 anos) em p. 114; esses elementos faltam na camada de texto extraída. Não criar cartões verificáveis pelo texto que dependam dessas imagens. Todas as páginas foram lidas; inspeção visual integral e crítica acadêmica ainda pendentes.
- Teste focado `npx vitest run src/views/ObraDetalhe.dossier.test.tsx`: 19 testes passaram após Funerais e No seu pescoço, antes do registro de Gonzaga. A validação final precisa contemplar as 17 obras carregadas (18 quando Brás Cubas for adicionado).

## Prompt de continuidade atualizado

```text
Retome as obras literárias no repositório My-App, branch claude/focused-volta-bnzw7d. Leia CLAUDE.md e docs/obras-2027/CONTINUIDADE.md, especialmente o último checkpoint, e confira git status e os commits antes de agir.

Funerais da Mamãe Grande, No seu pescoço e Gonzaga de Sá já foram escritos, integrados ao loader e conferidos, cada um em um commit. Não refaça esses dossiês. Tudo continua needs_review; a conferência literal não é aprovação editorial.

Comece por Memórias póstumas de Brás Cubas. A leitura integral das 134 páginas da edição Câmara 2018 já foi feita. Leia docs/obras-2027/leitura-bras-cubas.md e docs/obras-2027/rascunhos/bras-cubas-notas-1-160.txt: há mapa dos 160 capítulos, análises dos 160 capítulos, limites da extração e inspeção visual de passagens ausentes. Use as notas e escreva o JSON, sem inventar leitura ou crítica. Prepare os PDFs e textos paginados conforme CONTINUIDADE.md; não versione esses materiais nem faça merge de main.

Use a habilidade fornecida no ZIP: obras-obrigatorias-fuvest-unicamp-avancada (referida antes como analise-literaria-fuvest-unicamp). O caminho local e seus requisitos estão no documento de continuidade. Registre Brás Cubas em src/lib/workDossiers.ts depois da validação. Um commit por obra; antes dele execute python3 scripts/conferir-dossie.py conferir bras-cubas. Preserve IDs e progresso existentes.

Depois registre cobertura e limitações por obra, finalize pesquisa acadêmica rastreável necessária à revisão editorial sem atribuir fontes não lidas, e execute lint, npm test completo e npm run build. Confira as verificações já feitas no checkpoint; repita quando as mudanças novas justificarem. Faça push e abra PR com base fix/obras-obrigatorias, sem merge. As funcionalidades técnicas do antigo checkpoint não fazem parte desta retomada. Pode seguir automaticamente.
```

### Backups locais adicionais

O ZIP e a habilidade extraída também foram copiados para `/workspace/artifacts/obras-retomada/habilidade-obras.zip` e `/workspace/artifacts/obras-retomada/habilidade/`. O gerador de Funerais está no mesmo diretório. Estes backups ficam fora do repositório público; em outra máquina, obter novamente o anexo. Os dossiês, relatórios e notas autorais de Brás Cubas são o material versionado suficiente para retomar a redação.

### Verificações do checkpoint

Após registrar os três novos loaders: `npm run lint` passou; `npm run build` passou (aviso de tamanho de chunks). A etapa `test:node` da execução completa passou, 922 testes, zero falhas. A etapa Vitest também passou: 175 arquivos, 1.358 testes, zero falhas. `npm test` completo terminou com saída 0: 2.280 testes ao todo. Logs locais: `/tmp/obras-checkpoint-{lint,build,npm-test}.log`. Resultado final conferido. Lint, testes completos e build passaram antes do push do checkpoint. PR ainda não aberta; Brás Cubas e o registro de cobertura ainda pendentes.
