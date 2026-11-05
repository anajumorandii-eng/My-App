# Revisão editorial da fila — ENEM 2018–2025

> Registro histórico. A continuação de 05/11 e a resolução dos dez adiamentos estão em [RESOLUCAO-TAXONOMIA.md](RESOLUCAO-TAXONOMIA.md).

A auditoria inicial da PR #410 foi mesclada. Esta continuação processa a fila de 784 classificações automáticas e cinco reservas já registradas, preservando o currículo fornecido, os IDs e o conteúdo das questões.

## Resultado

- **789 entradas examinadas individualmente**: 779 com decisão registrada e 10 adiadas por falta de enquadramento curricular seguro.
- **575 registros do banco receberam alteração de matéria, tópico ou capítulo.** Nenhum outro campo foi alterado; a comparação integral com a etapa anterior foi executada antes da gravação do resumo.
- Decisões: **201 confirmações**, **548 propostas de correção** e **30 ressalvas de capítulo**. Três ressalvas já existentes foram reconfirmadas sem mudar o registro; as demais 27 integram as 575 alterações.
- O banco mantém **1.440 posições, 1.430 válidas e dez anuladas**. A nova fila tem **88 registros**: inclui ressalvas de confiança, lacunas de capítulo e os adiamentos, sem somá-los como grupos independentes.
- Restam **9 classificações de origem automática sem decisão segura**. Um dos dez adiamentos já era uma reserva editorial anterior, por isso os dois números diferem.

## Método e limites

As leituras foram divididas por disciplinas e integradas com segunda leitura de casos de fronteira. O comando e as alternativas determinaram o conhecimento exigido; citar um autor, uma data, um material químico ou um cenário esportivo não bastou para decidir o tópico. Foram usadas somente as 105 entradas e os 612 capítulos do currículo existente.

Os registros distinguem **404 leituras do texto nativo/transcrito conferido**, **268 leituras de texto com figura** e **107 conferências visuais de página**. Os 32 PDFs de prova/chave foram baixados e seus SHA-256 conferidos com o manifesto. A metodologia de cada item consta na ficha; não se alega leitura visual integral de todas as páginas nem dupla codificação humana.

As 79 classificações com confiança média continuam sinalizadas na fila. Correção de tópico não equivale a validação definitiva de todo o conteúdo ou da transcrição. Os dez casos adiados mantêm seus rótulos anteriores provisórios para compatibilidade; suas contagens não devem ser tratadas como prova de enquadramento curricular concluído. Não houve leitura ou gravação de Firestore remoto nem migração de tentativas dos estudantes.

## Exemplos de decisões verificadas

|Questão amarela|Decisão|Razão|
|---|---|---|
|2019/D1/82|Biologia → Ecologia → Controle Biológico|A solução para perda de polinizadores por inseticidas é manejo biológico de pragas; a classificação anterior em filosofia medieval era indevida.|
|2021/D1/50|Filosofia Moderna, capítulo em aberto|A árvore de Descartes expressa unidade das ciências; não é crítica de valores de Nietzsche, nem um comando sobre dúvida hiperbólica.|
|2018/D1/19 e 2020/D1/44|Sociologia → Desigualdade de Gênero|O futebol é o cenário; o comando pede naturalização da exclusão e desigualdade remuneratória.|
|2022/D1/83|Geografia → Dinâmica Climática|O mapa e o comando pedem baixa nebulosidade como explicação da radiação solar, não composição da matriz elétrica.|
|2021/D1/47|Brasil Império, sem capítulo estritamente periodizado|A prática escravista urbana atravessa os séculos XVIII/XIX e a fonte cita 1808–1850; não cabe restringi-la ao Segundo Reinado.|
|2020/D2/176|Matemática → Introdução às Técnicas de Contagem|Contagem por partição disjunta e complemento: somente A = 200 − 20 − 110.|
|2021/D2/149|Física → Grandezas Físicas e Operações com Vetores|O comando determina uma unidade derivada por análise dimensional; não se alegou necessidade de operar vetores.|

## Os dez adiamentos

- **enem_completo_2018_d1_q052**: Epicuro e temperança pertencem à filosofia helenística. O catálogo atual não tem tópico-pai de helenismo nem Epicurismo; confirmar Aristóteles seria falsa atribuição. Necessária decisão de taxonomia, preservando a questão e a chave C.
- **enem_completo_2022_d1_q061**: Sêneca trata de estoicismo e moderação das paixões diante da morte. Não há tópico-pai de filosofia helenística/estoicismo no currículo fixo; não confirmar Sócrates/Platão apenas por ser filosofia antiga.
- **enem_completo_2018_d1_q060**: O comando caracteriza a própria atividade filosófica (rigor e questionamento), mas o catálogo não possui introdução à Filosofia nem tópico-pai epistemológico contemporâneo defensável para esse objeto; América Espanhola está incorreta.
- **enem_completo_2019_d1_q087**: O comando exige a distinção maquiaveliana entre moral pessoal e eficácia política na modernidade. Falta tópico-pai de filosofia política moderna/Maquiavel; classificar em política contemporânea ou em contratualismo apenas aproximaria teorias diferentes.
- **enem_completo_2018_d1_q011**: Exige distinguir valores olímpicos e paralímpicos na conduta esportiva, sobretudo respeito e fair play. Não há tópico de Educação Física nem capítulo de ética esportiva no catálogo; interpretar o texto não autoriza classificá-lo em Barroco.
- **enem_completo_2019_d1_q008**: O comando pede compreender a espetacularização esportiva como distorção da experiência de ser atleta pela mídia. O currículo não tem Educação Física/cultura corporal; não há capítulo específico coerente, apesar de haver leitura audiovisual secundária.
- **enem_completo_2019_d1_q018**: O arco, a flecha e a lança são reinterpretados pela regulamentação competitiva dos Jogos dos Povos Indígenas. O foco é esportivização de práticas corporais; falta tópico-pai de Educação Física, portanto não há classificação curricular segura.
- **enem_completo_2019_d1_q031**: A identificação de anorexia e bulimia depende de conhecimentos sobre distúrbios da imagem corporal e saúde. Não há capítulo correspondente em Português nem tópico de Educação Física; não convém confirmar por simples interpretação textual.
- **enem_completo_2022_d1_q018**: A criação do mountainboard adapta snowboard a terrenos sem neve, exemplificando criatividade e ressignificação espacial em atividades de aventura. Falta tópico de Educação Física/práticas corporais, não havendo capítulo curricular fiel.
- **enem_completo_2023_d1_q043**: A inclusão de juntos no lema olímpico associa excelência e cooperatividade, exigindo reconhecer valores do esporte. Falta tópico de Educação Física/olimpismo no catálogo; não é justificável encaixá-la numa escola literária.

Esses casos precisam de uma decisão sobre a taxonomia: não se criaram tópicos ou capítulos fictícios para fazer a fila desaparecer. Os capítulos nulos das demais reservas têm tópicos-pais substantivos, mas falta um recorte exato na grade.

## O que mudou no retrato de cobertura

Há agora **256/612 capítulos sem questão válida classificada**. A retirada de vínculos falsos revelou lacunas antes mascaradas. Os 58 capítulos de redação continuam separados da necessidade de questões objetivas. Ausência de classificação principal não demonstra ausência de toda habilidade secundária.

Relatórios de incidência, planilha, JSON completo e cópia de prioridades pessoais do app foram regenerados com o método estatístico existente. As aplicações regulares permanecem completas; ampliar PPL/reaplicações é uma etapa diferente, que exige fontes, chaves e identidades próprias.

## Rastreabilidade e reprodução

- [Cobertura atual por tópico e capítulo](README.md).
- [Resumo estruturado, IDs alterados e hashes das fichas](revisao-editorial-resumo.json).
- [Fichas editoriais por disciplina](../../scripts/data/enem-revisao-editorial-2026-11-04).

```bash
npm run audit:enem-review
npx tsx scripts/aplicar-reclassificacao-enem.mts
npx tsx scripts/import-enem-complete.ts
npm run audit:enem
```

As simulações de reclassificação e importação precisam propor zero alterações após integração. O validador confere os 789 IDs da fila original, a unicidade de cada decisão, as fontes, a chave, os capítulos e o hash de conteúdo por questão.

## Validação final desta continuação

- Validador completo: 789 IDs atribuídos, 779 decisões e dez adiamentos; sete fichas com hashes estáveis e fontes compatíveis com o manifesto.
- Comparação integral antes/depois: apenas `subject`, `topicId` e `chapter` alterados em 575 registros. O hash dos demais campos das 1.440 posições foi conferido e registrado no resumo.
- Reclassificação e importação em simulação: zero alterações propostas após integrar; auditoria sem violações estruturais e sem divergência do lote.
- CSVs lidos integralmente: 612 linhas de capítulos e 88 registros na fila atual. Planilha e estatísticas regeneradas.
- `npm run lint`: sem erros.
- `npm test -- -- --maxWorkers=2`: 1.340 testes Node aprovados (um ignorado) e 3.402 testes de interface aprovados em 264 arquivos.
- `npm run build`: concluído. Permanecem os avisos de bundles grandes e os avisos de `scrollTo` do ambiente simulado, sem falhas.
