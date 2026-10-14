# Fontes adicionais verificadas para expansão de questões

Consulta: **14/10/2026 UTC**. Pesquisa primária conforme `.agents/skills/research/SKILL.md`. Este relatório é o único arquivo do repositório alterado por esta pesquisa; PDFs/textos ficam em `/tmp/expansao-bancas/`. Não foram copiados dados pessoais, apostilas ou resoluções de cursos.

## Resultado operacional

**Quatro pares oficiais disponíveis: UNESP 2025, FAMERP 2025, UNIFESP 2025 e ENEM 2022 (D2/CD5 amarelo regular). ENEM 2025 tem caderno recuperado, mas seu gabarito continua bloqueado: não usar respostas 2022 na prova 2025.**

A descoberta efetiva é a aba pública **Documentos**, além da aba Provas e Gabaritos que exige login. O [JavaScript oficial](https://www.vunesp.com.br/Scripts/bundles/projeto.min.js?v=dfaf5f1e) monta `/projeto/{sigla}/documento` no host `documento.vunesp.com.br`. Esse endpoint respondeu 200 e lista cadernos e gabaritos com o rótulo **versão de divulgação à imprensa**. Não é necessário entrar em conta de candidato para estes arquivos públicos.

## Identidade dos pares objetivos

| Instituição/edição | Identidade e escopo confirmado no PDF | Índice primário |
|---|---|---|
| UNESP 2025 | Primeira fase; 001 Conhecimentos Gerais; versão 1; 15/11/2024; 90 objetivas A–E; português e inglês | https://documento.vunesp.com.br/projeto/VNSP2404/documento |
| FAMERP 2025 | Dia 1; 001 Conhecimentos Gerais; versão 1; 12/12/2024; 80 objetivas A–E; português e inglês | https://documento.vunesp.com.br/projeto/FMRP2401/documento |
| UNIFESP 2025 | Dia 1; 001 Língua Portuguesa, Língua Inglesa e Redação; versão 1; 19/12/2024; 25 objetivas A–E e proposta de redação. Só as 25 objetivas são candidatas à importação. | https://documento.vunesp.com.br/projeto/UFSP2401/documento |

Esses documentos pertencem ao processo ordinário indicado; nenhum é rotulado reaplicação. O ano da edição é **2025**, embora as datas de aplicação sejam em 2024. A UNIFESP objetiva deste par **não contém questões objetivas de biologia/química**: o outro dia é de conhecimentos específicos discursivos e não deve virar alternativas inventadas.

### URLs primárias dos arquivos

**FAMERP**

- Caderno de Questões - Prova de Conhecimentos Gerais - (versão de divulgação à imprensa) - Atenção candidato acesse sua versão de prova na Área do Candidato: https://documento.vunesp.com.br/documento/stream/NjY1MTk1Nw%3d%3d
- Gabarito - Prova de Conhecimentos Gerais - (versão de divulgação à imprensa) - Atenção candidato acesse sua versão de prova na Área do Candidato: https://documento.vunesp.com.br/documento/stream/NjY1MTk1MA%3d%3d

**UNESP**

- Caderno de Questões - Prova de Conhecimentos Gerais - (versão de divulgação à imprensa) - Atenção candidato acesse sua versão de prova na Área do Candidato: https://documento.vunesp.com.br/documento/stream/NjU5MzI0Mg%3d%3d
- Gabarito - Prova de Conhecimentos Gerais - (versão de divulgação à imprensa) - Atenção candidato acesse sua versão de prova na Área do Candidato: https://documento.vunesp.com.br/documento/stream/NjU5MzIzOA%3d%3d

**UNIFESP**

- Caderno de Questões - Prova de Língua Portuguesa, Língua Inglesa e Redação - (versão de divulgação à imprensa) - Atenção candidato acesse sua versão de prova na Área do Candidato: https://documento.vunesp.com.br/documento/stream/NjY1NzAwMw%3d%3d
- Gabarito - Prova de Língua Portuguesa, Língua Inglesa e Redação - (versão de divulgação à imprensa) - Atenção candidato acesse sua versão de prova na Área do Candidato: https://documento.vunesp.com.br/documento/stream/NjY1Njk5OQ%3d%3d

### Verificação de bytes

Todos os seis arquivos abaixo responderam HTTP 200, começam por `%PDF` e permitem `pdftotext -layout`.

| Arquivo | Caminho temporário | Bytes | SHA-256 |
|---|---|---:|---|
| UNESP prova-oficial | `/tmp/expansao-bancas/unesp/prova-oficial.pdf` | 2884780 | `b2702765445da4a833b6fa06bad063b8d9b4fb9c00773a6f5184f178e43266fa` |
| UNESP gabarito | `/tmp/expansao-bancas/unesp/gabarito.pdf` | 111408 | `a70664a5827116c0b90dc3b187c13fe97d942c76ef9660c9812ef36da0ecceaf` |
| FAMERP prova-oficial | `/tmp/expansao-bancas/famerp/prova-oficial.pdf` | 1467187 | `a5972bd6c1903350e9033e0a0da253eb503f63c33601a06e0cd0983acd3cd290` |
| FAMERP gabarito | `/tmp/expansao-bancas/famerp/gabarito.pdf` | 108049 | `e0ad3b858d1b6b570c87fb41e174b2b19318185d9d9ae53934764d6ecf6aa964` |
| UNIFESP prova-oficial | `/tmp/expansao-bancas/unifesp/prova-oficial.pdf` | 1125718 | `962508178f10fd97e78d1155a6f5fe5ce62d709cd677261d38f79b5617d8af20` |
| UNIFESP gabarito | `/tmp/expansao-bancas/unifesp/gabarito.pdf` | 114309 | `9a22a33dabb7f7b9e8d7a245aceceaf170806f007e41475bc4acc55d6d73d4a7` |

**Diferença crítica FAMERP:** o caderno recuperado do Git LFS (`/tmp/expansao-bancas/famerp/prova.pdf`, 1.467.085 bytes, SHA-256 `49ece631ef5178f62ce5fcc434f2cb6c98b66e8c625cfa46ab89ae6484731d5c`) tem alternativas em ordem diferente do caderno público atual de imprensa. Exemplo verificável: questão 1, “no peito do eu lírico” é C no arquivo LFS e A no PDF primário de imprensa. **Usar `prova-oficial.pdf` com `gabarito.pdf`; não emparelhar o LFS com esse gabarito.**

UNESP e UNIFESP têm cadernos oficiais idênticos em tamanho/SHA ao LFS. A identidade de versão é sustentada pelo par de imprensa no mesmo índice oficial e pelo gabarito V1, não pelo nome genérico do arquivo local.

Os gabaritos contêm respectivamente 90, 80 e 25 pares explícitos número–letra; todos A–E, sem asteriscos, traços ou rótulos de anulada. Nos índices completos consultados não há gabarito retificado ou comunicado de anulação identificado pelos títulos; retificações de edital não são retificações de respostas. Isso comprova o conteúdo público atual, **não acesso a decisões individuais da Área do Candidato**. Preservar hashes e revalidar o índice antes do lote final.

## ENEM: caderno recuperado, resposta primária bloqueada

O [índice oficial 2025 do INEP](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2025) respondeu 200 e lista o par regular impresso D2/CD5:

- Prova: https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD5.pdf
- Gabarito: https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD5.pdf

O download direto do gabarito respondeu **503**, inclusive tentativas com query/Referer; HTTP simples expirou. O servidor de API do repositório institucional `riep.inep.gov.br` também retornou 503. Gabaritos 2024/2022 do mesmo domínio não resolveram o bloqueio. Não utilizar uma página de curso como confirmação final.

Recuperado unicamente o objeto LFS da prova: `/tmp/expansao-bancas/enem/prova.pdf`, **3.122.986 bytes**, SHA-256 `6cf3a0361035f86710be6fd8ff6b6848aa99c98fe71730d8ade1ca4ce4f1e560`, igual ao ponteiro local. A capa confirma **ENEM 2025, 2º dia, caderno 5 amarelo**, 90 questões **91–180**, natureza 91–135 e matemática 136–180, cinco alternativas. Não há idioma estrangeiro no dia 2. O índice o situa na aplicação regular; D3/D4 não são equivalentes. Anuladas **não verificadas**, pois o gabarito primário não foi obtido. ENEM 2026 ainda não aconteceu nesta data.

## Proveniência da recuperação LFS

Foram baixados somente quatro objetos específicos, nunca todo o LFS, sob `https://media.githubusercontent.com/media/anajumorandii-eng/My-App/main/provas%20brutas/`:

- `ENEM/2025/ENEM_2025_dia_2_caderno_amarelo.pdf`
- `UNESP/2025/UNESP_2025_1a_fase.pdf`
- `FAMERP/2025/FAMERP_2025_dia_1.pdf`
- `UNIFESP/2025/UNIFESP_2025_prova_objetiva.pdf`

Todos confirmaram `%PDF`, tamanho e SHA-256 dos respectivos ponteiros. Os scripts locais usam IDs Google Drive para UNESP/FAMERP/UNIFESP; esses IDs não são por si uma fonte oficial. A recuperação ficou validada adicionalmente pelos PDFs primários acima para UNESP/UNIFESP; FAMERP deve usar o novo caderno primário, por causa da ordem de alternativas.

O acervo institucional UNIFESP `https://ingresso.unifesp.br/vestibulares-anteriores` retornou 403, mas o processo oficial Vunesp UFSP2401 e seu endpoint público resolveram o acesso. Os arquivos 2024 rotulados reaplicação não foram usados.

## Próximo lote dirigido

Há fontes verificáveis para selecionar 10–18 questões de cada uma das **três** instituições liberadas. Manter prova/gabarito V1 e número explícito, conferir figuras/fórmulas/textos compartilhados e deduplicar contra o banco. UNIFESP oferece apenas português/inglês neste conjunto. Não converter prova discursiva, nem renumerar ENEM 91–180 como 1–90. O lote ENEM pode usar o par **2022 D2/CD5** verificado abaixo, excluindo a questão 175 anulada. Nenhuma resposta foi presumida nesta pesquisa.


## Complemento ENEM: par primário 2022 recuperado no RIEP

A continuidade da pesquisa encontrou **prova e gabarito oficiais completos da edição 2022, dia 2, caderno 5 amarelo, aplicação regular impressa/1ª aplicação**. Não é reaplicação/PPL nem versão digital. O [item do RIEP](https://riep.inep.gov.br/items/56e52b5e-9782-4b09-aa4c-51f38d72497a) identifica o **Inep como autor e editor** e lista os dois arquivos. O [índice oficial 2022](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2022) confirma D2/CD5 amarelo na seção regular. O próprio rodapé do caderno diz “1ª Aplicação ENEM 2022”.

| Documento | URL primária efetivamente acessível | Arquivo local | Bytes | SHA-256 |
|---|---|---|---:|---|
| Prova 2022 D2/CD5 | https://riep.inep.gov.br/bitstreams/481e4c70-e485-4d0b-ac11-82746e24bc16/download | `/tmp/expansao-bancas/enem/2022-prova-oficial.pdf` | 7.058.477 | `068a960ff3fde64d89484995f1a323676c354ad1efa27c109f09a4bb90619756` |
| Gabarito 2022 D2/CD5 | https://riep.inep.gov.br/bitstreams/06c1b02d-a528-4f3d-beb2-8db7048158a7/download | `/tmp/expansao-bancas/enem/2022-gabarito-riep.pdf` | 211.394 | `2aca83d7cf5e990f63318a525883d2e77ba2d2baf815566efb96287dbf631b11` |

Ambos responderam **200**, começam por `%PDF`, permitem `pdftotext -layout`; a prova tem 32 páginas e o gabarito uma. O gabarito respondeu também pelo endpoint equivalente `https://riep.inep.gov.br/server/api/core/bitstreams/06c1b02d-a528-4f3d-beb2-8db7048158a7/content`, com os mesmos bytes/hash. A busca genérica do repositório tinha retornado 503; os **bitstreams concretos descobertos pelo item** resolveram o bloqueio. Nenhum espelho de curso foi utilizado.

Textos para edição: `/tmp/expansao-bancas/enem/2022-prova-oficial.txt` e `/tmp/expansao-bancas/enem/2022-gabarito.txt`. A prova cobre natureza **91–135** e matemática **136–180**, 90 questões com cinco alternativas A–E; não há idioma estrangeiro no dia 2. A tabela de gabarito foi conferida: 90 números explícitos e únicos, **89 letras A–E e questão 175 “Anulado”**. Excluir 175 e registrar o descarte. As colunas são faixas da mesma versão (natureza/matemática), não versões distintas.

Este amarelo 2022 é diferente do **azul 2022** existente no acervo local. Não usar gabarito amarelo com caderno azul, nem combinar ano 2022 com a prova 2025 preservada. O par foi obtido diretamente do repositório institucional e não exige recuperação adicional de LFS.

### Tentativas adicionais registradas

Índices oficiais **2024, 2023 e 2022** foram consultados, todos 200; HTMLs preservados em `/tmp/expansao-bancas/enem/indice-{ano}.html`. URLs de gabaritos regulares obtidas desses índices, testadas e retornando 503:

- https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD1.pdf
- https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD7.pdf
- https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD1.pdf
- https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD7.pdf
- https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD1.pdf
- https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD7.pdf

Tentativas do padrão legado `/educacao_basica/enem/provas/{ano}_GB_impresso_D2_CD5.pdf` para 2024/2023/2022 também deram 503; **não foram consideradas URLs confirmadas pelo índice**, apenas teste de fallback. A busca de notícias/imagens primárias INEP/MEC não encontrou outra tabela de respostas verificável; o par RIEP 2022 dispensou esse caminho.

O [item RIEP 2023](https://riep.inep.gov.br/items/75be0df5-ba4c-42fa-9bec-347f92130afb) lista gabarito dia1 amarelo, mas o bitstream `4856d28d-13ae-4e11-9bcb-39216d0c59e0` redirecionou à página “Por favor entre no RIEP” na consulta do navegador. Não se alegou acesso a esse gabarito. A edição 2022 foi preferida por disponibilizar um par primário integral, sem adivinhar respostas.
