# Conferência dos anexos — FUVEST, primeira fase 2022–2026

## Resultado

Os dez PDFs anexados pela usuária (cinco provas e cinco gabaritos) têm os mesmos SHA-256 das fontes oficiais já registradas no corpus. Não são novas questões e não foram importados como cópias adicionais.

| Vestibular | Versão | Páginas da prova | Registros | Válidos | Anulada |
|---|---|---:|---:|---:|---|
| 2022 | V | 26 | 90 | 89 | 54 |
| 2023 | V | 28 | 90 | 90 | — |
| 2024 | V | 36 | 90 | 90 | — |
| 2025 | V1 | 34 | 90 | 90 | — |
| 2026 | V1 | 38 | 90 | 89 | 03 |
| Total | | | 450 | 448 | 2 |

Conferidos os números 01–90 de cada caderno, sem lacunas ou duplicatas. A página de início de cada uma das 450 questões coincide com a página indicada na base. A identificação foi feita pelos cabeçalhos dos itens no PDF; o cabeçalho 45/2022 tem fonte de 12 pontos, diferente dos demais, e foi adicionalmente conferido na imagem da página 13.

Os cinco gabaritos foram abertos visualmente. As colunas V (2022–2024) e V1 (2025–2026) foram extraídas separadamente, sem misturar permutações de outros cadernos. Os dois asteriscos dessas colunas coincidem com as exclusões existentes. O gabarito retificado de 2022 é de 15/12/2021; o de 2026, de 25/11/2025.

## Erro encontrado e corrigido: V48/2024

A nota editorial anterior dizia que o gabarito retificado de 24/11/2023 aceitava **D e E**. Isso estava errado: na página 1 do PDF, o **D está riscado**, e **E o substitui**. O texto extraído por ferramentas de PDF ainda contém ambos os caracteres; portanto, a extração textual isolada não determina a resposta válida.

O enunciado está na página 18 da Prova V. As embalagens têm 2×3×11 cm e a caixa 12×13×26 cm; D corresponde a 60 e E a 61 embalagens. A nota passa a registrar somente E como alternativa retificada. Esta conferência não apresenta uma nova demonstração matemática do empacotamento: a confirmação da alternativa é documental, pelo gabarito oficial.

A fonte está no [acervo oficial de 2024](https://www.fuvest.br/acervo-vestibular-2024/), que aponta para o mesmo [gabarito retificado anexado](https://www.fuvest.br/wp-content/uploads/fuvest2024_gabarito_primeira_fase_retificado_2023-11-24.pdf). A comparação de hashes confirmou identidade exata.

Corrigidos o arquivo editorial de 2024, a auditoria anterior e os JSON/CSV gerados. A questão continua válida, classificada em Geometria Espacial, com confiança média. Não houve mudança de matéria, assunto, subassunto, estratégia, exclusão ou denominador; tampouco de janela pessoal FUVEST 2022–2026.

## Rastreabilidade e limites

- `conferencia-anexos-2022-2026.json`: nomes dos anexos, hashes completos, URLs oficiais e resumo das verificações por edição.
- `conferencia-anexos-2022-2026.csv`: uma linha para cada uma das 450 questões, com versão, página, alternativa oficial e exclusão. A alternativaE da V48/2024 foi estabelecida pela conferência visual do D riscado, não por leitura ingênua dos dois caracteres.
- A base de incidência não contém uma coluna estruturada de alternativa correta para confrontar 450 respostas armazenadas; ela contém referência ao gabarito, classificação, estratégia e notas. O CSV desta auditoria é evidência documental separada e não um novo banco importado no aplicativo.
- Esta é uma conferência de fontes, cobertura, localização e retificações, com releitura direcionada do item48/2024. **Não é uma segunda leitura editorial independente de todos os450 enunciados e figuras.** A identidade dos PDFs confirma quais fontes foram usadas, mas não prova por si só que toda classificação pedagógica seja indiscutível.
- Os arquivos anexados não incluem segunda fase ou anos anteriores a 2022; esta conferência não lhes atribui uma revisão nova.

## Validação

O gerador FUVEST foi executado, mantendo 1.135 registros em 20 cadernos. Os JSON público e interno coincidem byte a byte. A comparação com o estado anterior exige que apenas a nota `reviewNote` de `fuvest-2024-f1:48` tenha mudado entre as questões; o hash do arquivo editorial de 2024 também se atualiza no manifesto. Contagens, demais fichas e metadados dos cadernos permanecem iguais.

Testes focais `node --import tsx --test src/lib/fuvestIncidence.test.ts src/lib/examEvidence.test.ts`: 11 aprovados, zero falhas. `git diff --check` aprovado. Não houve alteração de código de interface ou cálculo; não se apresenta uma nova execução integral de lint/build/navegador como parte desta correção editorial.
