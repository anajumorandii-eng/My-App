# Fontes primárias — Unicamp 2025, primeira fase Q/Z

Verificação em 14/10/2026, antes da expansão do banco. O ano 2025 identifica a edição do vestibular; os PDFs oficiais foram produzidos em outubro de 2024.

## Fontes e integridade

A [página oficial da Comvest para o Vestibular 2025](https://www.comvest.unicamp.br/ingresso-2025/vestibular-2025/) liga diretamente os documentos abaixo na seção da primeira fase.

| Documento oficial | Páginas | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| [Prova Q e Z](https://www.comvest.unicamp.br/vest2025/F1/f12025Q_Z.pdf) | 23 | 6477811 | `41564e9bbd20e03a9b62356c0ccf29b6070bf615b9ac8ecfe660021548cd0710` |
| [Gabarito FINAL Q e Z](https://www.comvest.unicamp.br/wp-content/uploads/2024/10/QZ_gabarito_2025_FINAL_site.pdf) | 1 | 52356 | `26cc09a657c54357a84fbe23a6e8af34eb150c6a0012556929a481bf29a3f008` |

Os arquivos baixados começam respectivamente com `%PDF-1.4` e `%PDF-1.5`; `pdfinfo` confirmou as páginas e tamanhos. Cópias temporárias: `/tmp/expansao-unicamp-2025/f12025Q_Z.pdf` e `/tmp/expansao-unicamp-2025/QZ_gabarito_2025_FINAL_site.pdf`. Extrações: `prova.txt` (layout), `prova-colunas.txt` (cada coluna separada) e `gabarito.txt` no mesmo diretório.

## Quantidade, alternativas e anulação

As instruções na página 1 da [prova oficial](https://www.comvest.unicamp.br/vest2025/F1/f12025Q_Z.pdf#page=1) afirmam 72 questões e quatro alternativas por questão. A extração por colunas encontrou exatamente os rótulos QUESTÃO 1 a QUESTÃO 72 e 72 ocorrências de cada marcador `a)`, `b)`, `c)`, `d)`. A prova Q e Z é publicada em um único PDF e usa um único gabarito.

O [gabarito FINAL](https://www.comvest.unicamp.br/wp-content/uploads/2024/10/QZ_gabarito_2025_FINAL_site.pdf) marca **53 com asterisco, anulada**. A nota declara: “De acordo com o Art.27 da Resolução do Vestibular Unicamp 2025, a pontuação (1 ponto) será atribuída a todos os candidatos presentes.” As demais 71 entradas têm letra A–D. A questão 53 não deve receber uma letra correta inventada nem participar de treino com correção convencional. A página da edição consultada não expõe aviso textual de outra retificação; a referência usada é o arquivo explicitamente FINAL, e não um gabarito preliminar.

Gabarito final por número:

```text
01 B 02 B 03 A 04 C 05 D 06 B 07 D 08 D 09 B 10 A 11 B 12 B
13 A 14 B 15 B 16 D 17 C 18 D 19 A 20 B 21 D 22 C 23 D 24 B
25 D 26 D 27 B 28 D 29 A 30 D 31 B 32 D 33 B 34 A 35 B 36 C
37 D 38 A 39 D 40 B 41 D 42 C 43 D 44 A 45 C 46 C 47 A 48 A
49 B 50 A 51 A 52 C 53 ANULADA 54 B 55 B 56 B 57 D 58 A 59 B 60 A
61 D 62 B 63 B 64 D 65 C 66 A 67 C 68 C 69 A 70 B 71 B 72 D
```

## Textos e figuras compartilhados

A [prova oficial](https://www.comvest.unicamp.br/vest2025/F1/f12025Q_Z.pdf) explicita estes grupos; cada questão independente precisa conservar seu contexto:

| Questões | Página física do PDF | Contexto |
| --- | ---: | --- |
| 5 e 6 | 4 | “Leia o texto e observe a figura a seguir para responder às questões 5 e 6”: texto e figura compartilhados. |
| 9 e 10 | 5–6 | Texto comum começa na página 5, antes das questões da página 6. |
| 13 e 14 | 7 | Texto comum às duas questões. |
| 18 e 19 | 8–9 | Texto 1 comum na página 8; a questão 19 pede também o texto 2 e retomar o texto 1. |
| 35 e 36 | 14 | Texto comum às duas questões. |
| 37 e 38 | 14–15 | Texto comum na página 14; questão 38 segue na página 15. |

Além desses grupos, figuras, gráficos, fórmulas e tabelas presentes no original podem ser indispensáveis mesmo quando não há indicação de texto comum. A extração em texto não substitui a revisão visual das páginas. A prova usa duas colunas: extrair a página inteira em ordem de linhas intercala trechos de questões diferentes.

## Checagem prévia de duplicação

No `public/questions.json` anterior ao lote, havia 2959 registros, 578 com “unicamp” em algum campo. Não havia registro identificado por `examSource.year: 2025` nem ID `unicamp_2025_*`. O banco contém 72 registros `unicamp_2026_*`, cujas URLs incluem 2025 (ano de aplicação); buscar apenas a substring “2025” não identifica a edição corretamente.

Comparou-se o texto normalizado da prova com os enunciados e alternativas de todo o banco (acentos removidos; letras minúsculas). A busca inicial por sequências de sete palavras encontrou apenas trechos genéricos em `ap_bio_unicamp_044` (instrução de preencher lacunas) e `ap_lit_unicamp_008` (referência bibliográfica a Niketche). A inspeção dos respectivos enunciados mostrou que não correspondem às questões desta prova. Uma segunda busca por sequências de seis palavras nas alternativas não encontrou nenhum registro com correspondência em duas ou mais alternativas. **Não foi identificada duplicação substantiva nesta checagem textual**; esse resultado é evidência de triagem, não prova de ausência de toda paráfrase ou item baseado apenas em imagem.
