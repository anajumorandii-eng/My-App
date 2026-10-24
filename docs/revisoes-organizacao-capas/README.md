# Revisões: organização da página e capa junto do conteúdo

Base: `origin/main` após as PRs #355 e #356. Foram preservados o salvamento do PDF na conta, sua identidade por guia/versão e a recuperação da mesma capa na biblioteca.

## Correções

- A capa padrão de revisão deixa de recortar a ilustração em um medalhão circular e de acrescentar os cartões que produziam o aspecto de espelho. A arte passa a aparecer inteira, sem contorno elíptico. Permanecem moldura, fontes, cores e identificação CRIVO, bem como os detalhes que distinguem edições. O pedido ao serviço de ilustração também orienta a evitar espelhos, reflexos e medalhões.
- Uma revisão recém-gerada inicia automaticamente a preparação da capa e do PDF, usando o mesmo componente dos Aprofundamentos/Estratégias. Não exige outro clique em Exportar. Abrir uma revisão antiga continua consultando o arquivo salvo; não dispara uma nova ilustração automaticamente. Durante o preparo, as configurações não podem mudar o conteúdo em impressão.
- O exportador aguarda o carregamento do renderizador de texto/matemática antes de capturar o conteúdo. Assim, a geração automática não captura a fórmula como texto provisório. Cancelamento e limite de espera mantêm a possibilidade de tentar novamente sem apagar o guia.
- A configuração do resumo é recolhida após gerar ou abrir um material. Há acesso direto à biblioteca e ação para configurar nova revisão. O roteiro geral fica recolhido fora da fila, sem resetar o tempo que a estudante escolheu. Guias e instruções auxiliares ficam em área expansível. A navegação entre recursos continua preservando atividades abertas.

## Validação

- Componentes: preparo automático habilitado somente para a nova versão; recuperar biblioteca sem regenerar; aguardar matemática; PDF com capa/índice/texto; impressão sem medalhão/recorte; retenção de atividades; roteiro mantém o tempo escolhido ao trocar de recurso.
- Chromium em 390 e 834 px: resumo salvo aberto com configuração e roteiro recolhidos, recuperação ativa com respostas fechadas, fórmulas legíveis e ausência de rolagem horizontal. Capturas em `evidencias/` usam apenas material sintético.
- Navegador com geração controlada: o envio de um texto novo dispara automaticamente o PDF, sem clique em Exportar; o formulário se recolhe e as respostas continuam separadas. Nenhum dado foi gravado em conta real.
- O PDF em `evidencias/revisao-sintetica.pdf` foi renderizado pelo componente real do servidor a partir do HTML produzido pelo exportador real e teve a capa conferida visualmente. A imagem não é recortada como espelho; o restante do padrão editorial CRIVO foi preservado.
- Os testes de navegador usam identidade e respostas controladas localmente; não enviam estudos a uma conta real nem certificam uma geração externa de imagem. O comportamento do serviço indisponível continua sendo usar a capa padrão inteira e preservar o texto.

## Arquivos já salvos

PDFs existentes continuam abrindo com sua capa original, conforme a correção anterior de persistência. Para substituir uma capa antiga, use **Gerar novo PDF**. Novas revisões seguem o preparo automático e o padrão corrigido. Não houve exclusão ou regeneração em massa de arquivos da conta.
