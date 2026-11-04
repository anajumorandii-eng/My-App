# Decisões e prioridades após a auditoria

> Registro histórico da etapa inicial (PR #410). Os números e as três correções descritos abaixo são daquela etapa. Para os resultados atuais da revisão da fila, consulte [Revisão editorial](REVISAO-EDITORIAL.md) e [cobertura atual](README.md).

## O que foi conferido

A auditoria automática abrange todas as 1.440 posições da aplicação regular impressa de 2018–2025, com opção Inglês, no banco versionado. Ela verifica identidade, posição canônica, estrutura, gabarito, tópico, capítulo, duplicação textual exata, procedência das classificações e alinhamento com o lote de importação. Não representa uma nova leitura editorial individual de 1.440 questões nem uma auditoria do Firestore remoto.

Para as correções desta entrega foram lidas visualmente três páginas de prova e os três gabaritos correspondentes. Os seis PDFs baixados conferem com os SHA-256 dos documentos do manifesto. Não foram acrescentadas questões nem alterados IDs, alternativas, imagens, gabaritos ou históricos dos estudantes.

## Correções confirmadas

|Posição no amarelo|Antes|Depois|Fundamento|
|---|---|---|---|
|2018, dia 2, questão 106, página 6|Química → Eletroquímica|Física → Circuitos Elétricos → Resistores|Resistência equivalente de uma tela resistiva, com associação de resistores; não envolve reação eletroquímica. Chave C.|
|2021, dia 2, questão 117, página 11|Física → Dinâmica Impulsiva → Conservação da Quantidade de Movimento|Física → Circuitos Elétricos → Resistores|Comparação de resistências pela razão comprimento/área, com resistividade constante. Chave C.|
|2024, dia 1, questão 49, página 21|Filosofia contemporânea → Escola de Frankfurt e Indústria Cultural|Mesmo tópico amplo, sem capítulo forçado; ressalva taxonômica na fila|Os textos de Quine e Carnap tratam do estatuto epistemológico da linguagem, não da indústria cultural. Chave A; falta capítulo específico no catálogo.|

Fontes, páginas, hashes, classificações anteriores e evidências estão em [`scripts/data/enem-auditoria-cobertura-2026-11-04.json`](../../scripts/data/enem-auditoria-cobertura-2026-11-04.json).

As contagens curriculares passam de Física 119 para **120** e de Química 110 para **109**. Circuitos Elétricos passa de 22 para **24**. O total de 1.440 posições permanece igual.

## As 361 questões classificadas em Matemática

A suspeita inicial de que 361 necessariamente indicariam um erro não se confirmou. A questão 2024/D2/108 é de **Natureza na organização oficial da prova**, mas foi classificada editorialmente em **Aritmética e Proporcionalidade** porque o enunciado fornece a razão industrial e cobra porcentagem/proporção. A justificativa já estava em `scripts/data/board-incidence/enem/2024.json`.

Também há 2025/D1/90, oficialmente de Humanas, classificada em Ecologia pela perda de polinizadores associada a inseticidas. Esses dois casos foram sinalizados e mantidos; não são contados duas vezes. Os relatórios agora distinguem área oficial de matéria/tópico curricular. São exatamente 360 posições em cada uma das quatro áreas oficiais.

## Risco de desfazer uma revisão

O lote de importação estava com **71 classificações antigas** em relação ao banco publicado antes desta entrega. Além disso, **seis entradas** de uma lista ampla de reclassificação contradiziam a revisão visual versionada de 2022–2023.

O lote foi alinhado e os dois comandos de manutenção passaram a compartilhar a mesma precedência: listas editoriais gerais → conferência por página de 2022–2023 → conferência desta auditoria. Uma ressalva explícita sem capítulo prevalece sobre um capítulo sugerido anteriormente. Aplicar novamente as classificações é idempotente; importar o lote completo propõe **zero inclusões e zero atualizações** depois do alinhamento.

As estatísticas derivadas do banco foram regeneradas pelo fluxo existente: relatório de incidência, JSON, planilha e cópia de prioridades pessoais usada no app. Não foi alterado o método de estimativa estatística.

## Como interpretar as lacunas

- **8 tópicos** não têm questão válida classificada neste corpus. Cinco são módulos de **redação**, com **58 capítulos**: precisam de propostas, produção textual, critérios e feedback, e não de preenchimento artificial com questões objetivas.
- Os outros três tópicos sem registro são **Óptica Instrumental e da Visão**, **Análise Sintática** e **Émile Durkheim e o Fato Social**. Isso pede conferência de escopo e de conteúdos relacionados: não prova que essas habilidades estejam totalmente ausentes dos enunciados classificados em outro tópico.
- **225 de 612 capítulos** não têm questão válida com essa classificação principal. Descontando os módulos de redação, são **167 capítulos**. A contagem não inclui todos os pré-requisitos/habilidades secundárias de um item.
- **784 registros** permanecem com classificação de origem lexical automática, sem revisão posterior localizada nas fontes consultadas. Eles entram na fila de conferência; não foram declarados incorretos nem revisados individualmente nesta entrega.
- **4 itens** ficam sem capítulo por lacunas reais da taxonomia, em vez de serem vinculados artificialmente a Platão, Sartre ou Frankfurt.
- Não foram encontradas repetições textuais exatas com os critérios reproduzidos pelo script. Não houve análise semântica integral de paráfrases ou de todas as combinações de habilidades.

## Ordem de trabalho para ampliar com qualidade

1. **Conferir os quatro casos taxonômicos** e decidir, com o currículo completo em vista, onde cabem estoicismo, fenomenologia/estética, prosa intimista pós-45 e epistemologia contemporânea. Não mudar capítulos apenas para eliminar células vazias.
2. **Revisar as classificações automáticas**, começando pelos tópicos pouco representados e pelos tópicos com alta concentração de classificações sem conferência. A fila contém IDs, edição e posição canônica para localizar a página correta. Citações de autores e palavras isoladas não bastam para decidir o conteúdo cobrado.
3. **Recalcular a cobertura** após cada lote de revisão. Um capítulo só conta como coberto quando houver item válido efetivamente pertinente; retirar uma classificação errada pode revelar uma lacuna que já existia.
4. **Ampliar os recortes ainda insuficientes**, priorizando PPL e reaplicações oficiais e, quando pertinente, edições regulares anteriores. Registrar prova e chave da mesma edição/aplicação, conferir figuras e gabarito e declarar a aplicação. Não reutilizar apenas `(ano, número)` como chave para PPL: aplicações distintas podem ter a mesma numeração. Cores equivalentes e opções de idioma não podem inflar o total.
5. **Complementar com autorais revisadas** quando faltar variedade de raciocínio, marcadas como autorais e vinculadas ao recorte. Não usar autorais para demonstrar incidência histórica de banca.
6. **Medir variedade**, não apenas quantidade: reconhecimento, interpretação de texto/dados/figura, escolha de estratégia, aplicação e transferência. A faixa de uma a quatro questões no relatório é um alerta de pouca disponibilidade, não um critério universal de suficiência.

Antes de importar novas aplicações é preciso atualizar o manifesto e os validadores de escopo, que nesta entrega auditam exclusivamente as oito aplicações regulares impressas. A mudança de escopo deve preservar os IDs já utilizados por tentativas e pelo caderno de erros.

## Reproduzir e manter

```bash
npm run audit:enem
npx tsx scripts/aplicar-reclassificacao-enem.mts
npx tsx scripts/import-enem-complete.ts
```

Os dois últimos comandos, sem `--write`, são simulações. A gravação no banco só ocorre com `--write`, após validar o conjunto de revisões. Para regenerar as estatísticas, use `scripts/analisar-enem-probabilidades.mts` e `scripts/gerar-planilha-incidencia-enem.py`.

Os CSVs e o JSON têm o detalhamento de todos os tópicos/capítulos e a fila por questão. Nenhuma leitura ou gravação do banco remoto de estudantes foi realizada. A publicação e eventual sincronização de cadastros remotos continuam seguindo o fluxo do projeto.

## Verificações executadas

- `npm run audit:enem`: 1.440 posições, 1.430 válidas, dez anuladas, zero violações estruturais e lote sem divergência de classificação.
- Reaplicação e importação completas em simulação: zero alterações propostas.
- Comparação com a base da branch: somente matéria/tópico/capítulo de três registros foram alterados no banco; ordem, IDs, conteúdo, alternativas, imagens e respostas permaneceram iguais.
- Hashes das entradas do relatório conferidos; CSVs lidos integralmente, com 612 linhas de capítulos e 789 linhas na fila; planilha regenerada legível e totais por tópico conciliados com as estatísticas.
- `npm run lint`: concluído sem erros.
- `npm test -- -- --maxWorkers=2`: 1.336 testes Node aprovados (um ignorado) e 3.402 testes de interface aprovados em 264 arquivos.
- `npm run build`: concluído; permanece o aviso de bundles grandes do projeto. O ambiente simulado de testes emite seus avisos de `scrollTo`, sem falhas.
