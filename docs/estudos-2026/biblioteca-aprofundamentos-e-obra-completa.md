# Biblioteca de aprofundamentos e escopo das obras

## Organização dos guias

Os aprofundamentos gerados em Estratégias passam a ter uma biblioteca própria em `/aprofundamentos`, acessível pelo menu “Meus aprofundamentos” e por um atalho compacto na estratégia. A lista inteira de guias deixa de ocupar o topo do fluxo. O guia do recorte em estudo continua disponível junto ao botão de geração; depois de concluído, pode ser aberto diretamente na biblioteca.

A biblioteca oferece busca sem diferenciação de acentos, filtros por matéria e banca, ordenação por data ou assunto e páginas de 12 cartões. Nomes equivalentes de banca são reunidos, e o filtro inclui guias multibanca que tenham a origem registrada. A leitura usa uma tela própria, preserva os filtros ao voltar e oferece impressão/PDF, fontes salvas e retorno ao contexto da estratégia.

Não há nova coleção, cópia paralela ou migração: são reutilizados `crivo:strategy-guides:v1:<conta>` e a coleção `users/<uid>/strategyGuides`. As cópias locais e remotas são conciliadas por chave e data, preservando a versão mais recente. Cada conta continua isolada. Um guia concluído em outra atividade atualiza a biblioteca aberta por notificação local, sem recarregar. Falha ao carregar a conta mantém disponíveis as cópias locais e oferece nova tentativa.

## Obra completa e unidades

Resumo e estratégia de obra começam em “Visão geral da obra completa”. Essa visão usa a síntese e a análise integral publicadas do dossiê, ou o roteiro estratégico da obra como conjunto. Não escolhe silenciosamente a primeira unidade.

O seletor “Escopo do estudo da obra” oferece, além da obra completa, os capítulos, contos e demais unidades publicadas. Ao escolher uma unidade, o conteúdo mostra o resumo específico, observações formais e passagens comentadas. A estratégia liga essa leitura à construção de uma resposta. O botão de retorno restaura a visão geral.

O parâmetro `unidade` preserva a seleção ao recarregar e ao alternar entre resumo e estratégia da mesma obra. Trocar de obra no explorador limpa a unidade anterior. Unidade inexistente ou não publicada leva à visão geral, com aviso. A impressão identifica o escopo escolhido. O critério editorial de publicação permanece em vigor: unidades e evidências em revisão não são expostas.

## Verificação

Testes de comportamento cobrem preservação de guias antigos, leitura e impressão separadas, filtros e paginação, separação por conta, falha da nuvem, conclusão em outra atividade, visão geral por padrão, unidade opcional e recuperação por endereço. `scripts/audit-guide-library.mjs` percorre o fluxo com 40 guias sintéticos no armazenamento local, nas larguras 390 e 1366 e nos temas claro/escuro, sem autenticar, gerar conteúdo ou gravar dados na conta.

A verificação no navegador passou nas quatro combinações de tema/tela, com 16 estados sem violações automáticas de acessibilidade ou transbordamento horizontal. Os 40 guias sintéticos permaneceram no armazenamento após navegação e recarga. Evidências resumidas em `biblioteca-aprofundamentos-verificacao.json`. O navegador usa o explorador público “Por obra”; o catálogo remoto de `/obras/:slug` não foi acessado com credenciais pessoais. Resumo e troca de abas da obra também são cobertos pelos testes do componente.

TypeScript, build de produção e suíte completa passaram: 1.141 testes Node e 3.209 testes de interface em 239 arquivos. Também foi fixado o relógio simulado de um teste de disponibilidade da agenda que dependia da hora de execução, sem alterar o comportamento de produção.
