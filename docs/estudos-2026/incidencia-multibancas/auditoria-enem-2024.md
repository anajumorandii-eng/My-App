# Auditoria editorial — ENEM 2024

Edição concluída em 22/10/2026: aplicação regular impressa, amarelo CD2 (dia 1) e CD5 (dia 2), opção Inglês. 180 objetivas e uma proposta de redação, sem duplicar Espanhol, cores, aplicações ou subitens. Classificação editorial única, sem dupla revisão integral independente. A contagem não representa peso TRI.

## Fontes e integridade

Os quatro PDFs foram baixados novamente nesta retomada; SHA-256 integralmente conferidos contra `fontes-descobertas-2021-2026.json`. Provas com 32 páginas físicas, incluindo capa como página 1; chaves com uma página cada.

|Documento|Fonte|SHA-256|
|---|---|---|
|D1 CD2|https://riep.inep.gov.br/bitstreams/71aaf57d-a5b7-4300-bd8b-fcf2ec490570/download|`d35ce001b6e6fb978d68c3d4c57f2d08ff8a4eb36487f3dd1696fba831b24a9a`|
|Chave D1|https://riep.inep.gov.br/bitstreams/01f19cf0-4be9-48df-9a29-f5fe33bbae07/download|`e1198aa21e9f04e81ceb314848bab39189fd314b27e2b8dac70a7a662defeb1d`|
|D2 CD5, espelho identificado Curso Objetivo|https://www.curso-objetivo.br/vestibular/resolucao-comentada/enem/2024/2dia/enem2024_2dia_prova_amarelo.pdf|`44a324acab3b3922293f06b6ee08c90696c00ba82c0357e9e803b15d80b0ea24`|
|Chave D2|https://riep.inep.gov.br/bitstreams/109a33f5-e556-4e51-b9e3-8e0bdf3353d8/download|`342edd1d18c0266812b9e379c7b9b2ebfcdd739857445bd03cf3c55951861297`|

O espelho de D2 não é apresentado como domínio oficial. As chaves INEP foram lidas em extração com layout, respeitando a coluna Inglês nas 01–05; as 180 respostas foram pareadas às fichas. A chave CD5 marca somente 102 como anulada. A redação R tem resposta e URL/hash de gabarito nulos.

## Leitura e inspeção visual

O checkpoint anterior documentou leitura textual integral das 180 questões e da proposta, com inspeção das figuras decisivas. Suas 91 fichas D1 foram preservadas e revistas nos casos editoriais anotados. Nesta retomada foram relidas integralmente as 90 questões D2, incluindo alternativas, e redigidas suas fichas próprias, sem consultar resoluções do espelho. A extração raw recuperou a ordem das colunas, enquanto a extração layout contém grandes espaços de artefatos gráficos.

Todas as páginas físicas 2–31 do D2 foram efetivamente vistas em folhas de contato renderizadas por PyMuPDF. Foram conferidos: amebas e pH (2); tirinha, estruturas dos pesticidas e tubos (3); linhas de campo e alternativas (4); grafeno e Otto (5); correnteza, movimento e vetores do Calvin (6); fitorremediação (7); circuitos LED e lâmpadas (8); nimesulida e centro de massa (9); cladograma e raios do mirascópio (10); célula microbiana (11); ciclos e emissão de gases (12); nível sonoro, aquecedor e fluxograma sanitário (13); corais e heredogramas (15); tabelas e fórmulas (16–17); polias e triângulo (18); senoides (19); câmeras e áreas (20); cifra e logaritmo (21); cilindros e tendência (22); tanque e gráficos (23); setor circular (24); cartaz e unidades (25); barras e projeções (26); teclas (27); composição de gráficos (28); trapézio (29); colunas e balança comercial (30); racionais, exponencial e raízes cúbicas (31). Página 14 é textual. Os pormenores numéricos foram cruzados com o texto; não se inferiram questões por posição.

Também foram reabertas as páginas D1 1–3, 7–10, 16, 19–20, 24 e 28: identificação de caderno e Inglês, interface ambiental, citações, carta, campanha, pinhole, esculturas, diadema, Visconti, coletânea da redação, Dubai, gráfico de inundações e capas do DIP. Os demais itens D1 conservam a leitura integral documentada no checkpoint, sem alegar nova leitura independente integral nesta sessão.

## Decisões editoriais

- 06/16/34/43: fronteira com Educação Física. Mantido Português, com confiança média e justificativa: inferência de relações explícitas, sem técnica motora adicional. Cultura corporal preservada no subassunto; esta escolha não equivale a ausência de Educação Física na prova.
- Arte: 11/15/19/20/32/39/80 têm matéria própria e topicId nulo, pois falta tópico específico na taxonomia; não foram escondidas em Português.
- 29 compara teses e ficou em Português, não Arte apenas por seu tema. 36 foi corrigida para Português: pede a organização do texto de apresentação (contextualização e explicitação do foco), não a escola literária de Machado. A alteração preserva sua estratégia específica.
- 49/66/75: aproximações curriculares explicitadas. Quine/Carnap não são existencialistas; o excerto de Foucault não foi atribuído a Platão; a história de Russell exige indução, não pertencimento do autor ao empirismo moderno.
- 77: preserva a chave B, mas a nota distingue regra de ouro e universalização kantiana, que não são conceitualmente idênticas.
- 53: tectônica sul-americana aproximada de Geografia Física do Brasil; não se restringiu o conteúdo ao território brasileiro. 54/84 mantidas em História, com fronteira Sociologia registrada.
- 92: separação de mistura por filtração aproximada de Química Inorgânica por não haver tópico próprio. 98: níveis eletrônicos em Química, sem reação nuclear. 101: eletrostática, sem supor semirreações que a fonte não fornece.
- 102: `mcΔT = 168000 J` e `Pt = 126000 J`, rendimento 4/3. Não inverter a razão para fabricar 75%. Mantida excluída conforme chave oficial.
- 108 está no bloco Natureza, mas é Matemática: a razão industrial já é dada e só exige porcentagem/proporção; não foi atribuída estequiometria por posição. 112 combina ácido-base e estrutura orgânica. 122 exige comparar sentidos redox nos ciclos, com Biologia secundária.
- 127: a perda de biodiversidade aquática reduz predadores das larvas; a estratégia não foi reduzida à aproximação de pessoas e mosquitos.
- 116/121: formulações gerais das alternativas foram limitadas em nota, sem ensinar exclusividade da lactação em placentários nem afirmar que todo composto carbonado é orgânico.
- 149: as alternativas pressupõem 25 deslocamentos não triviais da cifra; a exclusão da identidade não é totalmente explícita no texto. 170: a chave toma 60% do faturamento de bebidas como lucro; base contábil não explicitada. Confiança média em ambos.

## Contagens e validação

181 unidades: Matemática 46, Português 26, Biologia 17, Física 16, Geografia 13, História 11, Filosofia 11, Química 11, Sociologia 9, Literatura 8, Arte 7, Inglês 5, Redação 1. Natureza conserva 45 itens por bloco de caderno, embora um tenha matéria principal Matemática. São 158 fichas de confiança alta e 23 média; nenhuma baixa. Uma anulada, 180 unidades incluídas contando a redação.

Validação executada: JSON parseável; duas provas, 91+90 unidades; números 01–180 e R únicos; páginas válidas; estratégias com ao menos dois passos, resumo, justificativa, habilidade, armadilha e subassuntos preenchidos; IDs existentes e compatíveis com a matéria (Literatura/Redação respeitam studyArea); associações existentes; notas nas 23 ressalvas; Inglês apenas cinco; anulação única 102; chave pareada das 180 objetivas; redação sem chave objetiva. A edição pode entrar no gerador apenas quando as demais edições exigidas também estiverem completas. Ainda não há agregação nem integração runtime nesta retomada.
