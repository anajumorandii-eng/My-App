# Auditoria editorial — FUVEST 2017, primeira fase

Revisão em 21/10/2026 por leitura de fonte, em editor único. Foram classificadas as 90 questões da primeira fase, versão V, aplicada em 27/11/2016. A capa e os rodapés confirmam V. Não se classificaram segunda fase, manual do candidato ou outras versões como provas adicionais. Não houve dupla revisão integral.

## Fontes e identidade dos arquivos

- Prova oficial: https://www.fuvest.br/wp-content/uploads/fuvest_2017_1fase_prova_V.pdf — 2594366 bytes, 28 páginas. SHA-256 `e97b60971d68951a4cb03e75d007961051581850f602fb1845731283febd4f8b`.
- Gabarito oficial: https://www.fuvest.br/wp-content/uploads/fuvest_2017_1fase_prova_gab.pdf — 124982 bytes, uma página. SHA-256 `37b8e66a62e2effaaa18a2b34a56d412b87c6f70e3866ee3dfb6abf9756f2943`.
- Acervo: https://www.fuvest.br/acervo-vestibular-2017.

Hashes recalculados sobre os PDFs locais e comparados ao inventário oficial de fontes. Leu-se a coluna PROVA V do gabarito, com 90 respostas A–E, numeradas de 01 a 90. Nenhuma anulação é indicada nessa chave. Não se pressupõe que a ausência de marcação nessa fonte prove ausência de toda retificação histórica externa.

## Cobertura e contagens

90 fichas, números únicos e consecutivos, todas incluídas; nenhuma exclusão. Páginas físicas 1-based: as questões ficam nas páginas 2–27; capa 1 e contracapa 28.

- Biologia: 10.
- Física: 12.
- Geografia: 13.
- História: 13.
- Inglês: 5.
- Literatura: 6.
- Matemática: 11.
- Português: 9.
- Química: 11.

## Leitura e inspeção visual

Leitura integral do texto extraído em layout com conferência visual das 28 páginas renderizadas pelo pdftoppm, apresentadas em sete folhas de contato de quatro páginas. Foram vistos o cartaz de Picasso (p. 2), a amoreira e o excerto de Mayombe (p. 5), fachada e interior da igreja barroca (p. 6), fotografia de plantas (p. 7), manuscrito de Perceval (p. 8), rotas comerciais e tabela industrial (p. 9), fotografia do refugiado (p. 10), evolução do Sena (p. 12), anamorfoses e perfil geológico (p. 13), gráfico setorial e jornal sobre retirantes (p. 14), mapa de favelas (p. 15), tabela patrimonial e saneamento da Guanabara (p. 16), pirâmides etárias, heredogramas e tabelas (p. 17), circulação dos peixes e organelas (p. 18), gráficos e vetores do decaimento (p. 19), fios, rótulos e perfis de onda (p. 20), prisma e potencial de ligação do ozônio (p. 21), tabela de pH, equações da pirita e pilhas (p. 22), montagens experimentais e modificação da superfície de vidro (p. 23), tabela termoquímica, célula a combustível e curvas de hemoglobina (p. 24), estruturas de L-Dopa e dopamina (p. 25), paralelepípedo e figura de áreas (p. 26), retângulo com interseções e fórmulas matemáticas (p. 27).

## Decisões editoriais e ambiguidades

- Português e Literatura foram separados: 04, 05 e 10 exigem contexto de obras; 14–15 exigem Mayombe e comparação com Capitães da Areia; 18 exige a relação de Claro enigma com o projeto modernista. Já 06, 11 e 12 podem ser resolvidas por análise do excerto, sem conhecimento do romance integral, e ficaram em Português.
- 13 ficou em História: o conteúdo discriminante são as Ligas Camponesas e sua cronologia; Vidas secas oferece a situação inicial. 24 ficou em História medieval pelo documento cavaleiresco. 25 ficou em História antiga por tratar da organização cívica da pólis sem autor filosófico específico.
- 17 é fronteira entre História da arte e Português; História colonial é principal, com Português secundário, confiança média. As proposições cobram estética barroca e a resposta exige confrontá-la com o poema.
- 31 é reflexão sobre memória e relato histórico, alocada em História contemporânea por aproximação; 32 é projeto cultural regionalista de 1926 com forte componente de leitura textual. Ambos têm confiança média e notas próprias.
- 34 não encontra tópico adequado na taxonomia: Revolução Neolítica e história da alimentação ficaram em História, topicId nulo e tema humano específico. Não se forçou a Pré-História em Idade Antiga.
- 03 e 09 foram abrigadas em Domínio da Norma Culta por ausência de tópicos próprios para história do léxico e morfologia; o conteúdo específico está nos subtemas e notas.
- 37 tem comércio de armas como assunto decisivo e cartografia secundária. 39 usa geologia aplicada ao Brasil. 45 exige localização e bioma; a referência à arqueologia não foi contada como segunda matéria.
- 64 é Física Moderna com Matemática secundária pelo cálculo exponencial. 68 é Física Moderna pela relação entre energia de fóton e frequência, embora situado no contexto do ozônio.
- 72 ficou em Estequiometria: pede conversão de perda de massa em volume, não velocidade de reação. 76 combina eletroquímica e corrente elétrica; 77 combina equilíbrio e fisiologia; 79 combina decomposição de bicarbonato e fermentação. 90 combina extremos trigonométricos e a relação isotérmica pressão-volume. As relações secundárias foram registradas somente quando necessárias.

## Limitações e validação

A extração de texto apresenta caracteres de controle em fórmulas, expoentes e alguns nomes de vértices; as páginas renderizadas permitiram recuperar a leitura das expressões matemáticas e químicas, sem inventar dados pela posição das questões. A página 26 foi também ampliada individualmente para conferir o ângulo HAF da questão 81. As folhas de contato permitem inspecionar as figuras; não constituem uma resolução comentada completa nem avaliação independente de cada alternativa.

Validação executada após gravação: JSON parseável; exatamente uma prova e 90 fichas; sequência 01–90 única; páginas dentro das 28 páginas; topicIds existentes e compatíveis com a matéria principal, com a exceção explícita de topicId nulo na questão 34; IDs secundários existentes; campos editoriais e listas de estratégia preenchidos, com dois passos específicos por questão. As 90 letras da coluna V do gabarito foram extraídas e conferidas quanto à cobertura. Nenhuma ficha foi excluída.
