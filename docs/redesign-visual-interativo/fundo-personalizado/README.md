# Fundo personalizado do Crivo

O fundo Caderno passa a compor um mapa de ideias: quatro ramificações curvas, cartões de papel em relevo, ícone com volume no centro e esboços da matéria. A composição usa o quadro visual do Miro como referência consultada pelo Design & Motion Kit; as cores, fontes e materiais foram adaptados ao sistema editorial do Crivo.

As anotações são próprias de cada uma das 14 matérias. Gramática, Entendimento de Texto, Língua Inglesa, Filosofia e Sociologia recebem conteúdo específico, em vez de recorrer às fórmulas gerais das Ciências. As conexões agrupam ideias da matéria, sem indicar relações causais ou domínio adquirido.

Em **Personalizar → Fundo**, Caderno mostra o mapa; Papel mantém a textura sem desenhos. Aurora, Grade e Liso continuam disponíveis. A escolha existente é preservada e as mudanças continuam persistidas na mesma chave de preferências.

O fundo é decorativo, fica fora da árvore acessível e não recebe cliques. A interação funcional permanece nas cenas, mapas de capítulo e controles. Apenas o modo de efeitos Completo revela as conexões uma vez, em 850 ms. Suave, Mínimo e a preferência do sistema por movimento reduzido não animam o fundo. No celular, o mapa fica mais discreto.

As amostras e o relatório de navegação acompanham esta entrega. A amostra isolada mostra apenas o fundo, ocultando os elementos da interface durante a captura; não representa uma tela nova do produto.

## Capturas

[Computador](capturas/desktop.png) · [Celular](capturas/celular.png) · [Escuro](capturas/escuro.png) · [Amostra isolada](capturas/amostra-isolada.png)

## Verificação no navegador

14 matérias com mapa e ícone próprios; computador (1440 px), celular (390 px), temas claro e escuro, escolha de fundos e recarga com a opção Papel persistida. O modo Completo também foi conferido com movimento reduzido: nenhuma animação do mapa. Duas checagens automatizadas do painel Personalizar, uma por tema, terminaram sem violações. Uma descrição de efeitos com contraste abaixo do mínimo foi corrigida. Ver [relatório](verificacao.json) e [persistência e movimento](preferencias.json).

Validação do projeto: `npm run lint`, `npm test` e `npm run build` aprovados. **2.337 testes passaram**: 938 de servidor/dados e 1.399 de componentes, em 183 arquivos. O build mantém seus avisos de tamanho de chunks e de módulos importados tanto estática quanto dinamicamente.
