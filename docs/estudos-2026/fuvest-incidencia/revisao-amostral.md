# Revisão amostral do corpus FUVEST 2022–2026

Revisão:18/10/2026. Sessenta itens, doze por edição. Conferência independente de integração, sem dupla recodificação integral dos 685 registros.

## Seleção e escopo

Semente identificadora: `fuvest-audit-v1-fixed-strata-2026-10-18`. Seleção determinística pré-fixada:1ªfase 01,16,31,46,61,76; dia 1 P 03/P 08; dia 2 B 02/Q 03 (Medicina) e H 04/M 05 (fora do subconjunto). Total:60, incluindo 10 itens de Medicina. Não é amostra aleatória e não permite estimar uma taxa global de erro.

Foram lidos os enunciados reais e comparados identidade, página, matéria/tópico, síntese, estratégia e armadilha. Páginas com gráficos, imagens e fórmulas necessárias foram renderizadas e inspecionadas. Os hashes dos 15 PDFs coincidiram com os declarados. Não se refez a solução integral dos 60 itens nem a auditoria de todos os gabaritos.

## Resultado e correções

Estado atual: 60 pass; 0 fail; 0 uncertain. Pass significa que não foi detectada divergência material no escopo, não que exista classificação única ou ausência de outros erros.

- **fuvest-2023-f 1:61** — inicial:`uncertain`; O comando permite inferir herbivoria pela distribuição da defesa química, sem pedir mecanismo evolutivo; Ecologia é candidata primária mais direta. Recomendação: Reavaliar primária Ecologia, Evolução associada e confiança média; ou explicitar a ambiguidade se mantida. Estado:`corrected`.
- **fuvest-2026-f 1:46** — inicial:`fail`; A comparação com escultura barroca é operação expressamente exigida; Arte estava ausente das áreas associadas. Recomendação: Incluir Arte mantendo Literatura primária e confiança média. Estado:`corrected`.
- **fuvest-2025-f 2-dia 2:M 05** — inicial:`fail`; Apenas interpretação textual omitia cálculo e modelagem/divisibilidade realmente necessários. Recomendação: Incluir calculo e modelagem. Estado:`corrected`.
- **fuvest-2025-f 2-dia 2:Q 03** — inicial:`fail`; Representações de Lewis e tautômeros requerem aplicação conceitual e representação molecular. Recomendação: Incluir aplicacao_conceitual e/ou modelagem. Estado:`corrected`.

## Motor de incidência

Oito verificações executáveis passaram: exclusões, denominador por matéria, restrição de confiança no numerador, preservação do denominador, zero anual, deduplicação de subassunto no item,12/36 no recorte Medicina e isolamento de fase. A revisão motivou reforços de validação de fases, unicidade, páginas e tópicos associados no gerador.

O denominador é a quantidade de questões com aquela matéria principal no recorte. Pares são coocorrências de áreas, inclusive possíveis pares entre duas secundárias; não representam uma medida da intensidade da interdisciplinaridade. Subassuntos coexistem e suas porcentagens não são aditivas. Um ano sem denominador da matéria não se confunde com tópico ausente num ano observado.

## Itens conferidos

|ID|PDF/página|Evidência decisiva|Estado|
|---|---|---|---|
|fuvest-2022-f 1:01|[p.2](https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_tipo_V.pdf#page=2)|Recessividade ligada ao X, prevalência regional da deficiência G 6 PD e população exposta à cloroquina.|pass|
|fuvest-2022-f 1:16|[p.6](https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_tipo_V.pdf#page=6)|Gráfico relaciona pressão, velocidade e área nos vasos; alternativa correta depende das trocas capilares.|pass|
|fuvest-2022-f 1:31|[p.10](https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_tipo_V.pdf#page=10)|Representação chinesa alterna símbolos por posição decimal do número 91625.|pass|
|fuvest-2022-f 1:46|[p.13](https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_tipo_V.pdf#page=13)|Comando em português pede localizar solução de restaurantes no texto inglês sobre entregas.|pass|
|fuvest-2022-f 1:61|[p.17](https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_tipo_V.pdf#page=17)|Mapa com curvas de nível, vegetação e observador orientado para nordeste deve ser associado à paisagem.|pass|
|fuvest-2022-f 1:76|[p.22](https://www.fuvest.br/wp-content/uploads/fuvest_2022_primeira_fase_tipo_V.pdf#page=22)|Predominância de Al 3+, hidróxido precipitado e aluminato varia com p H; anfoterismo é decisivo.|pass|
|fuvest-2022-d 1:P 03|[p.4](https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_1.pdf#page=4)|Canção Ela desatinou: oposição de universos emocionais e dois desenvolvimentos do gerúndio ambíguo.|pass|
|fuvest-2022-d 1:P 08|[p.8](https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_1.pdf#page=8)|Discurso de Rubem Braga sobre ética e perfil de Julião Tavares exige leitura de Angústia.|pass|
|fuvest-2022-d 2:B 02|[p.20](https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_2.pdf#page=20)|Cladograma pede característica derivada, monofilia e origens independentes da multicelularidade.|pass|
|fuvest-2022-d 2:Q 03|[p.16](https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_2.pdf#page=16)|Lewis do SO 2, reações da chuva ácida e massa de Ca O calculada a partir do enxofre no carvão.|pass|
|fuvest-2022-d 2:H 04|[p.34](https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_2.pdf#page=34)|Fundação Palmares: nome, criação em 1988 e políticas antirracistas de memória/inclusão.|pass|
|fuvest-2022-d 2:M 05|[p.6](https://www.fuvest.br/wp-content/uploads/fuvest_2022_segunda_fase_dia_2.pdf#page=6)|Interseções entre circunferência e parábola y=ax²+1 e condição para três pontos comuns.|pass|
|fuvest-2023-f 1:01|[p.2](https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf#page=2)|Conceito de interseccionalidade é aplicado aos dados de raça/gênero no mercado de trabalho.|pass|
|fuvest-2023-f 1:16|[p.6](https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf#page=6)|Pesca no entorno de Galápagos: risco de resíduos e retirada acima da reposição dos estoques.|pass|
|fuvest-2023-f 1:31|[p.10](https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf#page=10)|Hume: impossibilidade de ideia de sabor sem impressão sensorial correspondente.|pass|
|fuvest-2023-f 1:46|[p.14](https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf#page=14)|Reversibilidade entre comandar e obedecer na pólis remete à isonomia dos cidadãos.|pass|
|fuvest-2023-f 1:61|[p.19](https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf#page=19)|Mapa de plantas com ou sem defesa química permite inferir menor herbivoria na cidade; mecanismo evolutivo não é diretamente pedido.|pass|
|fuvest-2023-f 1:76|[p.23](https://www.fuvest.br/wp-content/uploads/fuvest2023_primeira_fase_prova_V.pdf#page=23)|Lagarto correndo na água depende de reação vertical à força das patas, e não de flutuação estática.|pass|
|fuvest-2023-f 2-d 1:P 03|[p.4](https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_1.pdf#page=4)|Paulo Freire: metáfora financeira em educação bancária e efeito de repetição de já não.|pass|
|fuvest-2023-f 2-d 1:P 08|[p.8](https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_1.pdf#page=8)|Romanceiro da Inconfidência articula Tiradentes, ambição/injustiça/covardia e consequências éticas.|pass|
|fuvest-2023-f 2-d 2:B 02|[p.20](https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_2.pdf#page=20)|ADH, especialização do epitélio renal e néfrons de roedores de habitats diferentes.|pass|
|fuvest-2023-f 2-d 2:Q 03|[p.16](https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_2.pdf#page=16)|Síntese peptídica com EDC/DCC, interações com água e mols de sulfato no método Kjeldahl.|pass|
|fuvest-2023-f 2-d 2:H 04|[p.34](https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_2.pdf#page=34)|Tropicália: artista, características e diferenças para canções de protesto e Jovem Guarda.|pass|
|fuvest-2023-f 2-d 2:M 05|[p.6](https://www.fuvest.br/wp-content/uploads/fuvest_2023_segunda_fase_dia_2.pdf#page=6)|Desigualdades normativas e número inteiro de degraus determinam dimensões e limites da tangente.|pass|
|fuvest-2024-f 1:01|[p.2](https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf#page=2)|Verso de Conceição Evaristo usa quilombos como metáfora da resistência coletiva atual.|pass|
|fuvest-2024-f 1:16|[p.6](https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf#page=6)|Dois irmãos: distinguir suspeita da paternidade de Nael de reconhecimento explícito.|pass|
|fuvest-2024-f 1:31|[p.13](https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf#page=13)|Volume retirado de cilindro horizontal exige segmento circular; fração da altura não é fração do volume.|pass|
|fuvest-2024-f 1:46|[p.18](https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf#page=18)|Mapa histórico da cafeicultura mostra avanço para oeste e formação da rede ferroviária/portuária.|pass|
|fuvest-2024-f 1:61|[p.23](https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf#page=23)|Gráfico relaciona aridez e balanço de radiação à biomassa/biodiversidade e aos biomas.|pass|
|fuvest-2024-f 1:76|[p.29](https://www.fuvest.br/wp-content/uploads/fuvest2024_primeira_fase_prova_V.pdf#page=29)|Texto situa aproximação Cuba/URSS e solidariedade ao movimento negro dos EUA na Guerra Fria.|pass|
|fuvest-2024-f 2-dia 1:P 03|[p.4](https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_1dia.pdf#page=4)|Humanidade/sub-humanidade: formação lexical e reescrita com correlação temporal no passado.|pass|
|fuvest-2024-f 2-dia 1:P 08|[p.8](https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_1dia.pdf#page=8)|Quincas Borba: mediocridade de Rubião e articulação de tragédia/farsa na loucura da personagem.|pass|
|fuvest-2024-f 2-dia 2:B 02|[p.20](https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_2dia.pdf#page=20)|Mariposas antes/depois da industrialização: seleção direcional, predação e distribuição fenotípica.|pass|
|fuvest-2024-f 2-dia 2:Q 03|[p.16](https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_2dia.pdf#page=16)|Balão volumétrico: incerteza relativa, aquecimento da solução e variação dep H por diluição dez vezes.|pass|
|fuvest-2024-f 2-dia 2:H 04|[p.34](https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_2dia.pdf#page=34)|Capa de Fela Kuti articula pan-africanismo, consciência negra e emancipação pós-colonial.|pass|
|fuvest-2024-f 2-dia 2:M 05|[p.6](https://www.fuvest.br/wp-content/uploads/fuvest2024_segunda_fase_prova_2dia.pdf#page=6)|Triângulo delimitado por eixos e x+y=4 gira em torno de três retas; sólidos de revolução.|pass|
|fuvest-2025-f 1:01|[p.2](https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf#page=2)|Textos de Kopenawa/Glicéria e manto tupinambá conectam arte, colonialidade e resistência cultural.|pass|
|fuvest-2025-f 1:16|[p.8](https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf#page=8)|Aplicar tabela de inclinações a cada segmento de uma rampa; altura/comprimento é razão decisiva.|pass|
|fuvest-2025-f 1:31|[p.14](https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf#page=14)|Coral e alga trocam benefícios; perda de recifes elimina habitat, proteção e alimento.|pass|
|fuvest-2025-f 1:46|[p.19](https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf#page=19)|Valor energético de sementes decorre de suas reservas para o embrião vegetal.|pass|
|fuvest-2025-f 1:61|[p.24](https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf#page=24)|Versos ingleses sobre penas/pesos aludem às experiências galileanas de queda de corpos.|pass|
|fuvest-2025-f 1:76|[p.28](https://www.fuvest.br/wp-content/uploads/fuvest2025_primeira_fase_prova_V1.pdf#page=28)|Volume e área lateral respondem de modo diferente à redução do raio e à redução da altura.|pass|
|fuvest-2025-f 2-dia 1:P 03|[p.3](https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia1.pdf#page=3)|Quincas Borba e fotografia de 1888 exigem distinguir posição do autor e ambivalência de Rubião.|pass|
|fuvest-2025-f 2-dia 1:P 08|[p.5](https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia1.pdf#page=5)|Crônica futebolística pede explicar conotação/personificação e formação humorística de palavras por sufixação.|pass|
|fuvest-2025-f 2-dia 2:B 02|[p.3](https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf#page=3)|Biomas vizinhos do Cerrado, sazonalidade climática e retroalimentação savanização/aquecimento.|pass|
|fuvest-2025-f 2-dia 2:Q 03|[p.40](https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf#page=40)|Desenho de Erlenmeyer, Lewis de hidrocarbonetos mínimos e tautomeria enol/carbonila.|pass|
|fuvest-2025-f 2-dia 2:H 04|[p.26](https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf#page=26)|Propaganda de sabão veicula racismo pseudocientífico; comando inclui rivalidade colonial na África do Sul.|pass|
|fuvest-2025-f 2-dia 2:M 05|[p.35](https://www.fuvest.br/wp-content/uploads/fuvest2025_prova_2fase_dia2.pdf#page=35)|Sequência n/2^b:PA, casas decimais e integridade da soma exigem cálculo e divisibilidade.|pass|
|fuvest-2026-f 1:01|[p.2](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf#page=2)|Paráfrase deve preservar concessão, finalidade e caráter possível da trapaça narrada por Caetano.|pass|
|fuvest-2026-f 1:16|[p.8](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf#page=8)|Just-in-time é interpretado como trabalho sob demanda na organização de plataformas.|pass|
|fuvest-2026-f 1:31|[p.14](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf#page=14)|Na OH dissolvido pela umidade neutraliza acidez; não atua como sódio metálico de sacrifício.|pass|
|fuvest-2026-f 1:46|[p.21](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf#page=21)|Comparação explícita da escultura barroca Cristo Cachorro com a despersonalização moderna de O Cristo cigano.|pass|
|fuvest-2026-f 1:61|[p.27](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf#page=27)|Efeito fotoelétrico: aumentar frequência aumenta energia cinética para mesma função trabalho.|pass|
|fuvest-2026-f 1:76|[p.33](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf#page=33)|Audiograma e definição logarítmica permitem obter razão de intensidades pela diferença em decibéis.|pass|
|fuvest-2026-f 2-d 1:P 03|[p.4](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-prova.pdf#page=4)|Comparar memória como tormento em Telles e missão de escrevivência em Evaristo.|pass|
|fuvest-2026-f 2-d 1:P 08|[p.8](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia1-prova.pdf#page=8)|Imagens escolares do século XIX e Opúsculo humanitário exigem discutir exclusão educacional de gênero/etnia.|pass|
|fuvest-2026-f 2-d 2:B 02|[p.3](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf#page=3)|Hidrocarbonetos, lipossolubilidade, entrada pela membrana e detoxificação emperoxissomos/REL nofígado.|pass|
|fuvest-2026-f 2-d 2:Q 03|[p.40](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf#page=40)|Desinfetantes: reação estrutural, deslocamento com acidificação e Lewis/geometria/polaridade de NCl 3.|pass|
|fuvest-2026-f 2-d 2:H 04|[p.26](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf#page=26)|Abelardo: transmissão medieval do saber, autonomia universitária e autoridade intelectual do mestre.|pass|
|fuvest-2026-f 2-d 2:M 05|[p.35](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-prova.pdf#page=35)|Luminária no vértice de pirâmide inscrita no cubo: distância ao piso, arestas e projeção ortogonal.|pass|

## Limites

- Seleção sistemática com os mesmos números por edição não assegura representatividade de todas as disciplinas ou dificuldades.
- Pass indica ausência de divergência material detectada no escopo conferido; não é garantia de solução/categorização única.
- Os mesmos enunciados admitem primárias distintas em questões interdisciplinares; casos discutíveis permanecem descritos.
- As estratégias são orientações editoriais; não constituem rubricas oficiais de pontuação.

Os detalhes estruturados, hashes das versões das classificações e registros antes/depois das ressalvas constam em `revisao-amostral.json`.
