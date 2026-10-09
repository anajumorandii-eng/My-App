# Redesign editorial do Crivo

A estrutura anterior misturava fontes tecnológicas, textura de papel forte,
camadas de vidro e cartões com sombras sobrepostas. A proposta usa uma hierarquia
editorial: papel neutro, títulos em Newsreader, textos em Inter, linhas discretas
e ação principal em vinho. O Design & Motion Kit informou a direção de canvas
quente, títulos serifados, espaçamento e superfícies; os valores foram adaptados
à identidade já existente do Crivo.

## O que mudou

- A navegação lateral reúne as rotas por intenção, com nomes de grupo visíveis
  e acessíveis. Ela começa expandida quando não existe preferência salva;
  preferências existentes de recolhimento continuam valendo.
- A tela Hoje dá destaque ao tópico e ao próximo bloco, com a data em São Paulo,
  a agenda do dia e os sinais reais da decisão.
- Papel e Caderno usam superfícies opacas claras ou escuras, sem vidro nem
  sombras de folhas empilhadas. Os demais fundos personalizados continuam
  disponíveis, com a nova estrutura e tipografia de navegação.
- O cartão separa texto, laboratório e métricas. O palco do laboratório tem altura
  definida para evitar realimentação de tamanho entre canvas e grid.
- O quadro do laboratório é preservado entre desenhos sob demanda, para que
  recompor o cartão não deixe os rótulos sem a cena.
- Transições existentes permanecem finitas e respeitam movimento reduzido.
  O cartão reduzido não passa pelas variantes de transformação da entrada.
- Há um atalho de teclado para pular ao conteúdo, e o avatar abre Perfil.

Questões, resumos, dados da estudante, recomendações, persistência e chaves de
armazenamento não foram alterados. Não foram adicionadas dependências.

## Verificação

Os resultados finais de lint, testes, build e navegação são registrados na PR.
A conferência visual usa dados de demonstração; não é evidência de progresso
real da estudante. Fontes foram verificadas pelo carregamento dos FontFace,
sem depender apenas de `document.fonts.check()`.
