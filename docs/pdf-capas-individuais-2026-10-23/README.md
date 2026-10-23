# Capas individuais dos PDFs

Revisões e aprofundamentos usavam a mesma ilustração padrão por matéria. O cache do PDF também não distinguia o tipo de material.

A revisão agora tem composição de medalhão e cartões de recuperação, cores próprias e a tríade Recordar / Conectar / Aplicar. Quando disponível, o serviço de ilustração recebe uma direção específica de revisão. Cada geração tem uma edição própria, inclusive na capa padrão usada quando o serviço está indisponível. O cache distingue material e título.

O botão **Gerar novo PDF** prepara outra edição e solicita outra ilustração quando o serviço está habilitado. Abrir, salvar e reabrir um arquivo pronto preservam o PDF. Uma tentativa após falha na conversão reutiliza a arte já preparada.

## Verificação

- Regressões para revisão versus aprofundamento, duas edições do mesmo conteúdo, isolamento do cache e geração explícita de outro PDF.
- Testes de contrato da especificação de capa e do serviço de imagens.
- Três PDFs de conteúdo sintético gerados pelo renderizador real de Chromium: um aprofundamento e duas revisões. Edições e composições distintas; imagem embutida renderizada e capa conferida visualmente.
- A geração externa de imagens foi simulada nos testes; a verificação real de PDF usou a composição padrão local.

O texto de estudo e a estrutura de índice não foram alterados.

![Capa de revisão renderizada no PDF de conteúdo sintético](revisao.png)
