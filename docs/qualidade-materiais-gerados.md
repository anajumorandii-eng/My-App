# Aprofundamentos e revisões gerados

O contrato pedagógico compartilhado fica em `server/ai/studyMaterialQuality.ts`.
Ele orienta cobertura compatível com o título, mecanismos, condições de validade,
exemplos resolvidos e treino independente progressivo. A seleção de banca, etapa
e profundidade continua soberana. Novas instruções se aplicam às próximas gerações;
textos antigos são preservados e precisam de nova geração para receber conteúdo novo.
O contrato orienta a geração; não certifica qualidade editorial de uma resposta.

Blocos Markdown `study-visual` aceitam JSON validado com fluxos ou barras.
O renderizador usa elementos locais, texto acessível e SVG para barras, sem
executar marcação fornecida pela IA. Formatos inadequados ao assunto devem ser
substituídos por comparação tabular, conforme o contrato. Não há promessa de
ilustração anatômica ou gráfico temporal a partir de um fluxo.

O mesmo leitor recolhe o gabarito final nos aprofundamentos e revisões. A cópia
de impressão o abre em bloco final e mantém figuras e referências. Conteúdo bruto
dos painéis de fontes continua disponível para inspeção na tela, mas não integra
o PDF. A versão do cache de PDF mudou para evitar reutilizar exportações antigas.
Arquivos baixados anteriormente não são alterados.

## Exclusão da biblioteca

O leitor de aprofundamentos e a lista de revisões permitem excluir um material
após confirmação, com cancelamento, estado de espera e nova tentativa após falha.
O progresso, os demais guias e os materiais editoriais não são apagados.

A exclusão substitui o registro por um marcador sem texto ou pacote de fontes,
na coleção já existente da conta e no cache do navegador. Ele impede que uma
leitura atrasada restaure a versão excluída. Gravações da conta usam transação e
comparação de versão para também impedir sobrescrita por salvamento atrasado.
Uma geração posterior com a mesma chave pode substituir o marcador.

Sem conta, uma falha do armazenamento local impede confirmar a exclusão. Com
conta, falha da transação mantém o material disponível. O recurso exclui a entrada
da biblioteca; PDFs previamente baixados ou armazenados no serviço de arquivos
não são expurgados por esta operação. Nenhuma exclusão é executada sobre dados
reais durante os testes.

## Verificação

Testes cobrem confirmação/cancelamento, falha da conta, troca de abas, leitura e
gravação atrasadas, nova geração, preservação de progresso, renderização dos
visuais e exclusão de OCR bruto apenas na cópia de impressão. A verificação local
no navegador usa material didático sintético, em 1366 e 390 pixels de largura,
e exportação pelo renderizador real de PDF. Isso verifica funcionamento e layout;
a qualidade de uma geração real exige leitura do material produzido.
