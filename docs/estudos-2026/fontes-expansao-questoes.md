# Fontes para expansão de questões reais

Consulta: **13/10/2026 UTC**. Pesquisa conforme `.agents/skills/research/SKILL.md`. Somente este relatório foi editado; downloads de prova e gabarito ficaram em `/tmp`. Nenhum conteúdo pessoal ou resolução de apostila foi copiado.

## Achados locais decisivos

- Os **58 arquivos `.pdf` em `provas brutas/` são ponteiros Git LFS**, não documentos PDF disponíveis para extração. `pdftotext` nesses arquivos falha. O caminho existir não comprova que os bytes da prova estejam disponíveis.
- Os downloads oficiais FUVEST 2026 V1 e UNICAMP 2026 Q/X coincidem **exatamente** com tamanho e SHA-256 registrados nos ponteiros locais; portanto são fontes verificadas para recuperar esses dois documentos sem baixar o LFS inteiro.
- Na fotografia do banco durante a consulta, `public/questions.json` tinha 2.887 registros; 1.245 com `examSource`, muitos sem ano. A mera existência desse campo não comprova origem primária: foi observado registro ENEM com URL secundária. Havia 40 registros identificados como FUVEST 2026 e 90 como FUVEST 2025. Esses números podem mudar durante a implementação paralela.
- `scripts/sync_gabaritos.py` baixa PDFs e extrai texto, mas não os importa. A CLI `scripts/extrair-questoes-oficiais.ts` está fixada em FUVEST, A–E e marcador `{NN}`. Não serve diretamente para Comvest A–D.

## FUVEST: oportunidade imediatamente verificável

[Acervo oficial 2026](https://www.fuvest.br/acervo-vestibular-2026/) respondeu HTTP 200 e lista os quatro cadernos, gabarito e provas de segunda fase.

| Documento | URL e verificação |
|---|---|
| Primeira fase V1 | https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf — HTTP 200, `%PDF`, 8.019.288 bytes; SHA-256 `93b417ad6ea7e81a3b6adc46337920fd71c213306849846723f13583074f9025`, igual ao ponteiro local. |
| Gabarito 2026 | https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-gabarito.pdf — HTTP 200, `%PDF`, 218.795 bytes. Documento retificado em 25/11/2025; tabelas V1–V4. |
| Gabarito 2025 | https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf — HTTP 200, `%PDF`. |
| Gabarito 2024 | https://www.fuvest.br/wp-content/uploads/fuvest2024_gabarito_primeira_fase.pdf — HTTP 200, `%PDF`. |
| Gabarito 2023 | https://www.fuvest.br/wp-content/uploads/fuvest2023_gabarito_primeira_fase.pdf — HTTP 200, `%PDF`. |

Cadernos V2–V4 e segunda fase estão **listados** no acervo, mas não foram baixados nesta consulta. Exemplos: `fuvest2026-fase1-prova-V2.pdf`, `fuvest2026-fase2-dia1-prova.pdf`, `fuvest2026-fase2-dia2-prova.pdf`, sob o mesmo diretório `wp-content/uploads/`.

**Emparelhamento:** V1 usa coluna 0 no parser existente, V2 coluna 1 etc. V1 questão 3 aparece `*`, anulada; o número correspondente muda por versão. Excluir anuladas, preservando o registro do descarte. A edição **2026 foi aplicada em 23/11/2025**: não trocar o ano da edição pelo ano civil. FUVEST 2026 tem 90 questões; não confundir com a mudança para 80 na edição 2027.

## UNICAMP/Comvest: pares e índices mudam entre anos

[Índice oficial 2026](https://www.comvest.unicamp.br/ingresso-2026/vestibular-2026/provas-e-gabaritos-vestibular-2026/) respondeu HTTP 200 e lista quatro pares de cadernos/gabaritos, provas discursivas e respostas esperadas.

| Edição | Par de prova e resposta verificado ou listado |
|---|---|
| 2026 | Prova Q/X https://www.comvest.unicamp.br/vest2026/F1/f12026Q_X.pdf — baixada HTTP 200, `%PDF`, 8.732.984 bytes, SHA-256 `8f6955a3d2b373bfdfa872c6dfbf1396e0bf15a938d1eaedf14c626c7e12b253`, igual ao ponteiro local. Gabarito https://www.comvest.unicamp.br/wp-content/uploads/2025/10/Q_X-gabarito.pdf — baixado HTTP 200, `%PDF`. Outros pares R/Y, S/Z, T/W listados. |
| 2025 | [Índice oficial](https://www.comvest.unicamp.br/ingresso-2025/vestibular-2025/) HTTP 200 lista Q/Z, R/W, S/X, T/Y. Q/Z prova `https://www.comvest.unicamp.br/vest2025/F1/f12025Q_Z.pdf` (listada); gabarito `https://www.comvest.unicamp.br/wp-content/uploads/2024/10/QZ_gabarito_2025_FINAL_site.pdf` (baixado HTTP 200, `%PDF`). |
| 2024 | [Índice oficial](https://www.comvest.unicamp.br/ingresso-2024/vestibular-2024/) HTTP 200 lista Q/Y, R/Z, S/W, T/X. Prova Q/Y `https://www.comvest.unicamp.br/vest2024/F1/f12024Q_Y.pdf` (listada); gabarito `https://www.comvest.unicamp.br/wp-content/uploads/2023/10/Q_Y.pdf` (baixado HTTP 200, `%PDF`). |
| 2023 | [Índice efetivo de provas](https://www.comvest.unicamp.br/ingresso-2023/vestibular-2023/provas/) HTTP 200 lista Q/Z, R/Y, S/X, T/W, inclusive `/vest2023/F1/f12023Q_Z.pdf`. **Não foi encontrado gabarito nessa página**; não importar respostas por inferência. |

**Defeito concreto no sincronizador:** os índices com sufixo `provas-e-gabaritos-vestibular-2025/`, `-2024/` e `-2023/` retornam 404. Além disso, o gabarito 2024 `Q_Y.pdf` tem rótulo “Provas Q e Y”: não contém “gabarito” no href nem no texto. O filtro atual o perde mesmo quando o índice correto é fornecido. Usar a seção semântica “Gabaritos” do índice e confirmar conteúdo do PDF.

Comvest 2026 tem **72 questões, quatro alternativas A–D**. O arquivo local `gabaritos/UNICAMP/UNICAMP-2026_Provas_Q_e_X.txt` corresponde ao PDF oficial. As quatro colunas da tabela Q/X são faixas **1–18, 19–36, 37–54, 55–72 da mesma versão**, não versões distintas. O parser FUVEST exige oito pares por linha e não aceita essa tabela. Emparelhar número explícito; a ordem de extração pode mudar em páginas com colunas.

### Discursivas oficiais úteis para revisão

O índice Comvest 2026 lista respostas esperadas da própria banca:

- https://www.comvest.unicamp.br/wp-content/uploads/2025/12/Respostas-Esperadas_Dia-2_CBS.pdf
- https://www.comvest.unicamp.br/wp-content/uploads/2025/12/Respostas-Esperadas_Dia-1.pdf
- https://www.comvest.unicamp.br/wp-content/uploads/2025/12/Expectativa-Banca_RED_FINAL.pdf

São oportunidades para critérios de resposta e análise de erro, mas foram apenas **listadas**, não analisadas integralmente. Não convertê-las automaticamente em alternativas nem chamar uma resposta esperada de rubrica quantitativa sem conferir o documento.

## ENEM: índices primários acessíveis, arquivos bloqueados nesta sessão

Os índices oficiais [2023](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2023), [2024](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2024) e [2025](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2025) responderam HTTP 200 e listam pares `PV`/`GB` por dia/caderno. Exemplos **listados**, mas downloads retornaram HTTP 503:

- `https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD1.pdf`
- `https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD1.pdf`
- `https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD1.pdf`
- `https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD1.pdf`

O índice `/2026` retornou 404; a prova regular de 2026 ainda não ocorreu na data da consulta. Não anunciar questões reais ENEM 2026 disponíveis.

**Riscos:** cor e número do caderno, dia, aplicação regular/reaplicação/PPL e idioma estrangeiro precisam integrar a identidade. O índice 2025 inclui D3/D4, além de D1/D2; esses documentos não são outro nome para o mesmo dia regular. Os cinco números iniciais de inglês/espanhol exigem tratamento explícito. Não combinar gabarito azul com caderno amarelo pelo número da questão.

## UNESP e FAMERP: links oficiais, arquivos ainda sem acesso

Os manifestos locais apontam para os processos oficiais abaixo. Nesta consulta, **FMRP2501 e VNSP2504** responderam HTTP 200, mas “Provas e Gabaritos” direciona a `/AreaCandidato/Posicionar/<processo>/ProvaGabarito`, não a um PDF público direto. Os códigos anteriores são do manifesto local, não tiveram acesso revalidado nesta rodada:

| Edição | FAMERP | UNESP |
|---|---|---|
| 2023 | https://www.vunesp.com.br/FMRP2201 | https://www.vunesp.com.br/VNSP2206 |
| 2024 | https://www.vunesp.com.br/FMRP2301 | https://www.vunesp.com.br/VNSP2303 |
| 2025 | https://www.vunesp.com.br/FMRP2401 | https://www.vunesp.com.br/VNSP2404 |
| 2026 | https://www.vunesp.com.br/FMRP2501 | https://www.vunesp.com.br/VNSP2504 |

Não houve gabarito PDF primário acessível confirmado para importar novas respostas dessas duas provas. Os ponteiros locais não resolvem esse problema. Não tratar “VUNESP” como exame único: a organizadora atende instituições e formatos diferentes.

## UNIFESP

[Acervo institucional](https://ingresso.unifesp.br/vestibulares-anteriores) retornou **403**. Não houve confirmação independente de gabaritos 2023–2026. O conjunto local contém `UNIFESP_2024_dia_2_reaplicacao.pdf`: esse nome sinaliza outra aplicação, que deve permanecer distinta da original. Nenhum PDF real foi recuperado nesta rodada.

## Requisitos de qualidade antes de expandir

1. Registrar **instituição, edição, fase/dia, aplicação, versão, idioma, número, URL da prova e URL do gabarito**. A estrutura atual só guarda banca/ano/URL e perde distinções essenciais; a CLI usa a URL do gabarito como única fonte.
2. Deduplicar por identidade completa e também por conteúdo normalizado. `FUVEST 2026 questão 15 V1` pode já estar em registro sem ano ou com alternativa reordenada. Normalizar aliases COMVEST/UNICAMP; manter UNESP e FAMERP separados de VUNESP.
3. Validar correspondência de caderno antes de importar. Usar gabarito retificado, guardar anuladas e descartes no relatório de importação. O número da questão deve vir do documento, nunca da posição de extração.
4. Conferir visualmente questões candidatas com fórmulas, unidades, colunas, textos compartilhados e figuras. O filtro de palavras visuais existente é conservador, mas não detecta todo diagrama sem legenda. Não completar imagem ou fórmula ausente por memória.
5. Separar questão objetiva com gabarito verificável de questão discursiva com critérios oficiais e de exercício autoral. Não classificar a solução produzida por IA como resolução oficial da banca.
6. Evitar resolver a indisponibilidade oficial com cópia de apostila. Importar primeiro os cadernos primários efetivamente acessíveis e analisar o ganho por tópico antes de buscar volume indiscriminado.

**Prioridade recomendada:** recuperar FUVEST2026 V1 e Comvest2026 Q/X a partir dos PDFs de SHA confirmado, extrair texto preservando layout, emparelhar gabaritos já disponíveis e produzir lote revisável com descartes e deduplicação. Depois corrigir descoberta de Comvest2024/2025; ENEM e provas Vunesp/Unifesp dependem de acesso efetivo às respostas oficiais.
