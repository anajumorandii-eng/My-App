# Navegação no iPad — 03/10/2026

Base conferida: `25cafa0d`, após as PRs #247 (seis mecanismos de Biologia/Química) e #248 (reprodução de podcasts). Ambas incorporadas e com checks aprovados. Na consulta inicial, a PR #249 (seleção de Mendel e interpretação de Gibbs) estava aberta. A estudante a incorporou em 03/10/2026 às 17:50:32 UTC; a PR #250 foi então atualizada sobre a main `f89ab5af` (merge `ee1a6e6f` mais atualização automática de continuidade), preservando essas correções e resolvendo o conflito documental de continuidade. O deploy Cloud Run da main também estava aprovado.

## Problema e correção

As capturas da estudante mostravam a lateral expandida sobre o título, os cartões e os botões. O problema foi reproduzido em `mycrivo.com`, em 1280 px: a lateral terminava em x=234, mas a página começava em x=72. A grade mantinha sua primeira coluna fixa mesmo quando o trilho expandia.

A coluna da composição de produção agora acompanha a largura efetiva do trilho. Não depende de uma segunda medida de expansão em JavaScript. A gaveta móvel continua sobreposta intencionalmente, com seu fundo de bloqueio.

A conferência adicional encontrou o cabeçalho excedendo a largura disponível em 901 px: o documento chegava a mais de 1040 px, com Personalizar e tema fora da tela. Entre 901 e 1200 px, o topo agora prioriza esses controles; as rotas principais permanecem disponíveis na lateral. A regressão mede também a largura total do documento, tanto com a lateral aberta quanto recolhida.

A imagem da marca respondeu corretamente na conferência atual; não foi possível comprovar a causa específica da falha anterior no Safari. Quando seu carregamento falha, agora aparece a marca SVG já existente no aplicativo, em vez de um ícone de imagem quebrada.

A revisão do teclado também encontrou foco permanecendo atrás da gaveta. Agora a abertura move o foco para o menu, Tab/Shift+Tab permanecem nele, Escape fecha e devolve o foco, e a página fica inerte enquanto o menu está aberto. Girar para uma largura desktop fecha o estado da gaveta e restaura a rolagem.

## Evidências e limites

- Regressões da sobreposição e da marca indisponível foram observadas falhando antes das correções.
- A regressão da entrada de foco na gaveta também falhou antes da correção.
- `tests/e2e/ipad-navigation.spec.ts` cobre 901, 1024, 1280, 1366 e 1440 px nos dois temas; expandir, recolher, recarregar; imagem indisponível; e gavetas em 390, 834 e 900 px com teclado e rotação para 1366 px.
- Capturas em 1280 px registram a lateral e a página alinhadas em x=234, com largura total de documento de 1280 px.
- [Tema claro](1280-light.png) e [tema escuro](1280-dark.png).
- Verificação em Chromium do ambiente, com movimento reduzido. Não representa execução no Safari físico nem certificação integral de acessibilidade.
- Sem alteração de histórico, autenticação, dados privados, preferências de estudo ou aprovação editorial.

## Próximas prioridades atuais

Não repetir os seis casos científicos já incorporados pela PR #247. As correções de Mendel/Gibbs da PR #249 já estão na main e foram preservadas nesta branch. A próxima revisão de mecanismos continua em Física: Lenz, Doppler e telescópio, consultando os achados originais e o código atual. Depois, tratar os estouros e contrastes ainda confirmados nas telas. O guia de troca de conta da PR #246 é um registro anterior: sua fila de Biologia/Química foi atendida por trabalho posterior.

## Validação inicial da entrega

`npm test` passou com 806 testes Node e 891 Vitest (150 arquivos), total de 1.697. A primeira execução foi interrompida após um timeout do contrato de pares dos instrumentos enquanto a matriz de navegador também estava ativa; a execução seguinte concluiu sem falhas. A limitação de recursos exige evitar concorrência excessiva, sem enfraquecer o contrato testado. Build de produção e matriz de cobertura também passaram; a matriz de cobertura não sofreu alterações.

A matriz final de navegador passou com 14 casos, incluindo a nova verificação de largura total. O cabeçalho estreito foi observado falhando antes do ajuste e passando depois. `git diff --check` não acusou erros.

## Atualização após a integração da PR #249

A branch da PR #250 incorpora a main atualizada e preserva integralmente os arquivos científicos de Mendel/Gibbs. O conflito foi somente documental; os dois registros de continuidade foram mantidos. TypeScript e a suíte completa passaram: 806 testes Node e 895 Vitest (150 arquivos), total de 1.701.

O build de produção também passou após a sincronização. Os arquivos de aplicação e testes foram comparados com a árvore já validada e permanecem idênticos; a atualização automática adicional altera apenas o estado documental.
