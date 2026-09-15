# Correção de personalização — 15/09/2026

## Problema confirmado

A versão 8d62f5b usava fragmentos dos títulos para rotular desenhos genéricos. Havia curvas sem significado quantitativo, associação inadequada entre alguns tópicos e fórmulas e animações internas que ignoravam movimento reduzido. A auditoria retornava `topicVisual: true` para todos os registros sem avaliar esses problemas.

O pedido da usuária exige **todos os tópicos**, incluindo Humanidades e Linguagens. O comentário do registro legado que atribuía à usuária a exclusão dessas matérias foi corrigido.

## Alterações

- Removidos todos os seletores e desenhos da antiga camada TopicVisual. Nenhuma curva, mapa territorial ou fórmula é inventada a partir de palavras do título.
- Leitura em foco, opcional: os trechos conservam integralmente o texto editorial; é possível selecionar, fixar e comparar. Teste de preservação percorre todas as seções dos 613 capítulos.
- Onze experiências selecionadas exclusivamente pelo ID do capítulo. Não são automaticamente emprestadas para os outros tópicos da mesma matéria.
- O laboratório fica no fluxo de Explorar e mantém seu estado ao trocar de etapa. Testar continua retirando a consulta.
- Motion utiliza os tokens existentes. Sem animação infinita. Movimento reduzido usa duração zero. Controles nativos ou botões com estado acessível permitem interação por teclado.

| Capítulo | Representação e interação | Limite |
|---|---|---|
| Coordenadas geográficas | Esfera projetada, paralelo, meridiano, ponto e distância longitudinal calculada ao mudar latitude/longitude | Modelo esférico, hemisfério frontal |
| Potências e radicais | Fatores 2 agrupados, expoentes e produto calculados | Demonstra produto de potências de mesma base; não cobre todos os radicais |
| Introdução à Ecologia | População, comunidade, ambiente e biosfera revelados por escala | Seleção de níveis; bioma não representado |
| Mito ao logos | Raio e critérios de aceitação, comparação e inspeção explícita | Não afirma desaparecimento histórico do mito |
| Solidariedade mecânica/orgânica | Semelhanças e funções conectadas pela interdependência | Exemplos esquemáticos |
| Fatores de textualidade | Conector muda frase, relação desenhada e interpretação | Microexemplo de coesão e coerência |
| Variação linguística | Mesmo pedido muda interlocutor, registro e forma de mensagem | Variação de registro, não catálogo de variedades |
| Introdução à História | Carta, objeto e depoimento com perguntas específicas | Tipos de fonte, não artefatos históricos reproduzidos |
| Inglês: taxonomy and terminology | Afirmações selecionáveis distinguem explícito, inferência e extrapolação | Microtexto original |
| Texto literário e não literário | Contraste entre informação e personificação | Figura de linguagem não basta para classificar literatura |
| Projeto de texto e progressão | Tese, argumento, análise e retomada com exemplo completo | Uma estrutura possível |

## Cobertura honesta e continuidade

Esta correção **não conclui** a encomenda de todas as pranchas, ícones e animações personalizadas dos 613 tópicos. A leitura em foco não conta como ilustração autoral. O relatório registra a disponibilidade real das duas famílias de cenas; a validação abaixo não certifica cientificamente todo o catálogo nem fidelidade total às cinco referências.

Priorizar os capítulos sem `anchorScene` e sem `interactiveExperiment`. Para cada um: definir o mecanismo/contraste real, criar composição e símbolos próprios, documentar hipóteses, implementar interação pedagógica, verificar com teclado/movimento reduzido e registrar capturas. Não voltar ao atalho de cores e palavras sobre o mesmo desenho.

## Verificação

- Testes de fonte: preservação integral de todas as seções, IDs distintos e vínculo dos laboratórios a capítulos existentes.
- Testes de comportamento: coordenadas/hemisférios, multiplicação, critérios filosóficos e conectores; regressão de Explorar/Testar/Reconstruir e mecanismos anteriores.
- Navegador real: 11 experiências acionadas; Geografia em desktop escuro e celular claro, demais experiências em celular claro. Nenhum overflow horizontal nos casos medidos. Console sem erros no final da sequência.
- Capturas em `screenshots/laboratorios/`. `qa-observacoes.json` contém o subconjunto com coleta estruturada; as demais verificações estão descritas acima. Capturas são evidência de amostras, não validação de todos os 613 tópicos.
- Resultado: TypeScript, 35 testes focados e build de produção aprovados. Permanece o aviso anterior de chunks acima de 500 kB.
- Geografia: medidos quadros intermediário e final da coordenada SVG do ponto (`motion-geografia.json`). O navegador também confirmou que Testar remove os laboratórios e Reconstruir abre sem overflow.
- A composição completa com movimento reduzido precisa de validação visual adicional em navegador; nesta alteração o comportamento está implementado pelo token de duração zero.
