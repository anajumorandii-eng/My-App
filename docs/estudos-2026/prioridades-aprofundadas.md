# Prioridades aprofundadas — integração de 18/10/2026

O explorador FUVEST amplia a aba atual com 14 áreas de preparação, incluindo Arte e Educação Física. São 105 assuntos do currículo cadastrado e quatro roteiros complementares, com 628 capítulos. Cada assunto possui aplicação autoral e critérios específicos de conferência. A cobertura do roteiro não certifica equivalência integral ao programa oficial.

A busca ignora acentos e encontra assunto ou capítulo. O seletor de fase altera o roteiro de treino e consulta somente os recortes completos da FUVEST cadastrados naquela fase. Cada resultado identifica edição, fase, contagem, denominador da matéria e link da prova oficial. Zero ocorrência em um recorte completo é diferente de ausência de recorte. Uma amostra selecionada não sustenta percentual.

## Integração com a base atual

A implementação preserva `ExamEvidencePanel`, `examEvidenceCounts.json`, `completeTopicEvidence`, os pesos pessoais de bancas e os modos de estudo atuais. Não restaura os percentuais legados do Anglo, que foram removidos da apresentação e do cálculo na branch principal. Não altera a regra editorial de redução por tamanho da amostra ou os denominadores existentes.

O painel de evidências permanece disponível abaixo dos roteiros com os recortes e análises de questões de outras bancas. A classificação por assunto é editorial do Crivo; a prova vinculada é oficial. Não se somam percentuais de fases, edições ou bases diferentes. O ranking pessoal e a consulta ao roteiro continuam separados: abrir a tela não registra domínio.

## Profundidade e limites

Os roteiros apresentam capítulos, pré-requisitos, habilidades da área, integração entre conceitos, aplicação específica, critérios de conferência e orientações para desenvolvimento objetivo ou discursivo. São propostas autorais de treino, não enunciados oficiais, respostas esperadas nem rubricas oficiais. Na segunda fase, conferir componentes da carreira e unidade no guia do ciclo. Redação começa em produção discursiva.

Arte e Educação Física têm quatro roteiros complementares, ainda sem integração ao diagnóstico, domínio persistido ou banco de questões. A interface identifica a limitação e não cria links para tópicos inexistentes no banco.

Permanece pendente a expansão e revisão de uma série histórica longa e o levantamento por capítulo e habilidade. Os recortes completos existentes não devem ser descritos como cobertura de todas as edições. Mudanças de programa e formato limitam comparações entre ciclos.

## Fontes

- [Programa FUVEST 2027](https://www.fuvest.br/wp-content/uploads/fuvest2027-programa-vestibular.pdf): competências, habilidades e objetos de conhecimento.
- [Portal do vestibular](https://www.fuvest.br/vestibular-da-usp/): edital, guia e componentes por carreira.
- [Acervo oficial 2026](https://www.fuvest.br/acervo-vestibular-2026/): provas e respostas esperadas.

Os capítulos partem das apostilas cadastradas; Arte e Educação Física usam uma síntese dos eixos do programa. Essas fontes não constituem uma tabela oficial de probabilidades.

## Verificação

Testes de interação cobrem busca sem acento, troca de fase, links, áreas complementares e modalidade discursiva de Redação. A verificação de integridade exige capítulos e aplicações para cada assunto. Validar também os testes existentes das evidências, das prioridades e da tela, TypeScript e build após integração.
