> As capturas completas citadas neste parecer estão no pacote local `/workspace/crivo-visual-review-2026-10-02/humanas-redacao/`; não foram todas adicionadas ao repositório. Ver o relatório principal para evidências selecionadas e os limites de cobertura.

Revisão visual de Filosofia, Sociologia, Redação e Atualidades — 02/10/2026

121 capítulos inspecionados no desenho central de desktop e celular, com comparação das fontes: 81 redesenhar e 40 ajustar. Nenhum capítulo recebeu aprovação editorial. Os 40 ajustes preservam estruturas pedagogicamente pertinentes; não significam que todas as animações, diagnósticos e estados tenham sido aprovados.

O harness completou 726 configurações (390/768/1440 × claro/escuro), 242 capturas centrais claras, passagem pelos três modos e um controle visível por capítulo. Não ocorreram falhas de capítulo ou exceções de página; há um erro SVG real em Solidariedade: rect rx="undefined" (motion.rect recebe rx apenas por animate), registrado em browser.json e no finding por ID. Todos os capítulos foram vistos nas seis folhas grandes (desktop e celular lado a lado), com capturas individuais adicionais nos casos de Nietzsche, meio-termo, materialismo histórico, intervenção viável e competências. As referências obrigatórias foram consultadas; a imagem desktop de termodinâmica foi examinada para hierarquia e cena explicativa.

Os problemas principais são de representação: diagramas podem ser relevantes, mas nomes sobre pilares vazios ou folhas com linhas não mostram os mecanismos que o conteúdo exige. A ausência de colisões automáticas não foi utilizada como aprovação. O fundo caderno e movimento reduzido são a configuração solicitada, não defeitos imputados aos capítulos.

Exemplos confirmados:

- Nietzsche, Sócrates e Hegel usam MovimentoDialetico. Dois círculos trocam lugar e o terceiro rótulo permanece abaixo. A genealogi­a histórica, o questionamento que leva à aporia e a transformação que cancela/preserva/eleva não ganham representação própria. Evidência: folhas 03/04, capturas individuais, src/views/topic-scenes/families/MovimentoDialetico.tsx e data/filosofia.ts. Não foi presumido que todas as Humanas usam círculos.
- Meio-termo: a escada Falta→Meio→Excesso sugere avanço crescente. A fonte diferencia coragem de dois vícios e rejeita média automática. Exige régua bilateral contextual, não subida ao excesso.
- Materialismo histórico: as camadas incluem “Efeito de retorno”, mas o componente desenha apenas vínculo da base para cima. Representar retorno efetivo, em vez de nomeá-lo como camada superior.
- Redação tem mecanismos novos e distintos, confirmados em coerência interna, concessão, refutação e quatro intervenções. Eles não foram classificados como o antigo esquema EIXO→TESE. Necessitam exemplos textuais completos e, na viabilização, o quinto elemento de detalhamento exigido na própria fonte.
- Introdução, conclusão e estrutura dissertativa reutilizam quem lê/voz/função/efeito. Coesão, leitura de gráfico, dados e revisão reutilizam fonte A→leitura→texto. Os desenhos não exibem tese/parágrafos, antecedente/pronome, conectivo, gráfico/dado ou texto editado, respectivamente. Há recomendação específica por ID em capitulos.json.
- Os 16 capítulos de repertório e análise por domínio trocam ícone e legenda sobre LENTE→TESE/EIXO→TESE. O conteúdo de ambiente, corpo, educação, violência, cidadania, cultura e mídia deve organizar exemplo e vínculo, e não apenas trocar glifo.
- COP30 distingue registro/contexto/avaliação, mas as três folhas centrais sem conteúdo não mostram Belém, atores, negociação, decisão e limites. O dossiê deve organizar visualmente esse caso datado.
- Competências: overflow pequeno real em 390 px: scrollWidth392, borda da prancha/jornada392,22. Evidência dirigida em overflow-validation.json e overflow-full-390.jpg. Não foi confundido com o footer presente no recorte produzido após scroll da captura. Carrosséis locais, cujos cartões ficam fora do viewport, não foram todos tratados como overflow da página.

Fontes comparadas: catalog.json com capítulos/seções/artefato atual; src/views/topic-scenes/data/{filosofia,sociologia}.ts, famílias de cena; src/views/visual-instruments/{WritingInstrument,WritingMechanismScenes,CurrentAffairsDossier}.tsx; src/lib/writingInstrumentLab.ts; src/views/topic-experiments/TopicExperiment.tsx; docs/visual/PADRAO-VISUAL-OBRIGATORIO.md e referências aprovadas. Caminhos completos e evidência por ID estão no JSON.

Limites: inspeção visual integral dos desenhos centrais claros em 390/1440; tablet e escuro medidos, não examinados visualmente em todos os recortes. Efeitos mínimos e prefers-reduced-motion. Não testados todos os estados dos seletores de intervalo, todas as animações/recortes, zoom/pan, teclado, drag/drop ou integração completa ao Caderno de Erros. O controle escolhido automaticamente pode ser um botão de conceito, e não o seletor que altera a cena. As sugestões relativas aos estados corrigidos foram conferidas na fonte e não afirmadas como observação visual de todos esses estados.

| Matéria | Ajustar | Redesenhar |
|---|---:|---:|
| Filosofia | 12 | 23 |
| Sociologia | 13 | 14 |
| Redação | 15 | 43 |
| Atualidades | 0 | 1 |

| Capítulo | Veredito |
|---|---|
| COP30 em Belém: avanços, limites e leitura de prova | redesenhar |
| A Dissertação no Vestibular: Mitos e Verdades | redesenhar |
| O que se Avalia na Dissertação: Competências e Habilidades | ajustar |
| Organizando as Ideias: Brainstorm e Mind Maps | ajustar |
| Projeto de Texto em Favor da Progressão Textual | ajustar |
| Repertório: o Diferencial de Redações de Sucesso | ajustar |
| Qual Será o Tema deste Ano: Grandes Eixos Temáticos | redesenhar |
| Diferentes Graus de Adequação à Proposta | redesenhar |
| Tangenciamento e Fuga: a Fronteira do Tema | redesenhar |
| Gêneros e sua Relação com a Estrutura do Texto | redesenhar |
| Estrutura Clássica do Texto Dissertativo | redesenhar |
| Lendo a Coletânea: a Apreensão de Sentidos I | redesenhar |
| Lendo a Coletânea: a Apreensão de Sentidos II | redesenhar |
| Lendo a Coletânea: a Compreensão e o Texto Autoral I | redesenhar |
| Lendo a Coletânea: a Compreensão e o Texto Autoral II | redesenhar |
| Incrementando o Repertório: Meio Ambiente | redesenhar |
| Analisando Tema de Redação: Meio Ambiente | redesenhar |
| Incrementando o Repertório: Educação e Trabalho | redesenhar |
| Analisando Tema de Redação: Educação e Trabalho | redesenhar |
| Incrementando o Repertório: Temas Abstratos | redesenhar |
| Analisando Tema Abstrato de Redação | redesenhar |
| Incrementando o Repertório: Corpo, Saúde e Sexualidade | redesenhar |
| Analisando Tema de Redação: Corpo, Saúde e Sexualidade | redesenhar |
| Incrementando o Repertório: Violência, Leis e Punição | redesenhar |
| Analisando Tema de Redação: Violência, Leis e Punição | redesenhar |
| Incrementando o Repertório: Cidadania e Poder | redesenhar |
| Analisando Tema de Redação: Cidadania e Poder | redesenhar |
| Incrementando o Repertório: Arte, Cultura e Relações Sociais | redesenhar |
| Analisando o Tema de Redação: Arte, Cultura e Relações Sociais | redesenhar |
| Incrementando o Repertório: Mídia e Sociedade | redesenhar |
| Analisando Tema de Redação: Mídia e Sociedade | redesenhar |
| Parágrafo de Introdução: Delimitando a Opinião | redesenhar |
| Parágrafo de Introdução: como Contextualizar | redesenhar |
| Argumentação: Auditório Particular e Universal | redesenhar |
| Argumentação Quase-Lógica e Efeito de Verdade | ajustar |
| Argumentação e Coerência Interna | ajustar |
| Argumentação e Coerência Externa | redesenhar |
| Recursos Argumentativos: Dados Numéricos e Exemplos | redesenhar |
| Recursos Argumentativos: Vozes Prestigiadas | redesenhar |
| Ressalvando o Ponto de Vista Contrário | ajustar |
| Refutando o Ponto Contrário | ajustar |
| Recursos Argumentativos: Interdiscursividade e Intertextualidade | redesenhar |
| Recursos Argumentativos: Temas de Redação já Analisados | redesenhar |
| Recursos Argumentativos: Fatos da Atualidade | redesenhar |
| Recursos Argumentativos: Múltiplos Domínios do Saber | redesenhar |
| Conclusão por Síntese ou Retomada da Tese | redesenhar |
| Conclusão: Sumarização, Focalização e Expressividade | redesenhar |
| Proposta de Intervenção: Atores Sociais e Cidadania | ajustar |
| Proposta de Intervenção: Viabilização e Inovação | ajustar |
| Proposta de Intervenção: Coerência Argumentativa | ajustar |
| Proposta de Intervenção: Respeito aos Direitos Humanos | ajustar |
| Recursos de Coesão Referencial no Texto Dissertativo | redesenhar |
| Recursos de Coesão Sequencial no Texto Dissertativo | redesenhar |
| Coesão no Texto Dissertativo: Análise de Problemas | redesenhar |
| Recursos Linguísticos: Norma, Clareza e Expressividade | ajustar |
| Os Direitos Humanos de 1ª Geração: Direitos Individuais | ajustar |
| Os Direitos Humanos de 2ª e 3ª Geração: Direitos Sociais, Coletivos e Difusos | ajustar |
| Redações Nota 1000: Trunfos a Inspirar | redesenhar |
| Redações na Mídia: como Aprimorar | redesenhar |
| O Nascimento da Filosofia: do Mito ao Logos | ajustar |
| Os Filósofos da Physis: Tales, Anaximandro e Anaxímenes | redesenhar |
| Heráclito e Parmênides: o Ser e o Devir | redesenhar |
| Os Sofistas e a Crise da Verdade | redesenhar |
| O Método Socrático e a Maiêutica | redesenhar |
| A Teoria das Ideias de Platão | redesenhar |
| O Mito da Caverna | redesenhar |
| A Alegoria da Linha Dividida e o Conhecimento | ajustar |
| Lógica e Metafísica Aristotélicas | redesenhar |
| A Ética a Nicômaco e a Doutrina do Meio-Termo | redesenhar |
| Política Aristotélica: o Homem como Animal Político | redesenhar |
| Patrística e Santo Agostinho | redesenhar |
| Escolástica e Santo Tomás de Aquino | ajustar |
| A Relação entre Fé e Razão | redesenhar |
| Descartes e o Método: a Dúvida Hiperbólica | ajustar |
| Racionalismo Continental: Espinosa e Leibniz | redesenhar |
| Empirismo Britânico: Locke, Berkeley e Hume | redesenhar |
| A Crítica de Hume à Causalidade | redesenhar |
| Hobbes e o Estado de Natureza | ajustar |
| Locke e os Direitos Naturais | ajustar |
| Rousseau e a Vontade Geral | ajustar |
| O Ideal Iluminista de Razão e Progresso | redesenhar |
| A Crítica da Razão Pura | redesenhar |
| A Ética Kantiana e o Imperativo Categórico | ajustar |
| Hegel e a Dialética | redesenhar |
| O Materialismo Histórico | ajustar |
| Alienação e Mais-Valia | redesenhar |
| A Luta de Classes na Filosofia Marxista | ajustar |
| Nietzsche e a Crítica aos Valores Morais | redesenhar |
| O Existencialismo de Sartre | ajustar |
| A Escola de Frankfurt e a Indústria Cultural | ajustar |
| Foucault e as Relações de Poder | redesenhar |
| Justiça e Direitos Humanos | redesenhar |
| Ética Aplicada e Bioética | redesenhar |
| Filosofia Política Contemporânea | redesenhar |
| O Contexto Histórico do Surgimento da Sociologia | redesenhar |
| O que é o Fato Social | ajustar |
| Sociologia e Senso Comum | redesenhar |
| Solidariedade Mecânica e Solidariedade Orgânica | ajustar |
| Anomia e Coesão Social | ajustar |
| Educação e Socialização em Durkheim | ajustar |
| Modo de Produção e Estrutura Social | ajustar |
| Ideologia e Alienação | ajustar |
| A Luta de Classes na Análise Sociológica | redesenhar |
| Tipos de Ação Social | redesenhar |
| Dominação e Poder em Weber | redesenhar |
| Ética Protestante e o Espírito do Capitalismo | ajustar |
| Cultura e Etnocentrismo | redesenhar |
| Identidade e Diferença | ajustar |
| Multiculturalismo e Relativismo Cultural | redesenhar |
| Classes Sociais e Mobilidade Social | ajustar |
| Desigualdade Racial no Brasil | redesenhar |
| Desigualdade de Gênero | ajustar |
| Divisão Social do Trabalho | redesenhar |
| Transformações no Mundo do Trabalho | redesenhar |
| Precarização e Uberização do Trabalho | ajustar |
| Movimentos Sociais Clássicos e Contemporâneos | redesenhar |
| Cidadania e Direitos | ajustar |
| Democracia e Participação Política | redesenhar |
| Globalização Econômica e Cultural | redesenhar |
| O Estado-Nação na Era Global | redesenhar |
| A Sociedade da Informação | ajustar |
