# Livreto salvo por material e conta

O livreto final passa a ser persistido como o PDF comum, incluindo a arte integrada e a imposição de impressão. Ao abrir o material, `BookletPdf` consulta o arquivo salvo. Abrir e baixar reutilizam os mesmos bytes, sem renderizar o miolo ou gerar imagens. Uma resposta 404 habilita a geração sob demanda; falha de leitura oferece recuperação e não dispara outra geração.

`DeepeningPdf` fornece a mesma identidade estável usada pelo PDF comum, baseada na conta, material, revisão e tipo. O servidor deriva uma chave separada para o livreto e usa o armazenamento privado existente. O arquivo comum não é sobrescrito. O livreto continua independente de uma nova edição do PDF comum; sua substituição acontece pelo botão “Gerar novo livreto”.

`GET /api/study-pdf/saved/:documentId/booklet` devolve o PDF exato e o número de folhas. `PUT` no mesmo endereço recebe até 25 MB de PDF binário, após autenticação, valida a estrutura de folhas A4 em paisagem e grava o arquivo. A conta dona delimita tanto a leitura quanto a escrita. A gravação preserva os bytes recebidos; não há nova renderização ou geração de capa no servidor.

A interface só informa que o livreto está salvo após a gravação concluir. Falhas ao salvar mantêm o arquivo preparado para nova tentativa sem repaginar nem gerar outra imagem. Durante uma substituição, os links da versão anterior continuam acessíveis; a URL só é trocada após salvar a nova versão. A geração explícita de outra edição renova a identidade da arte. PDFs já baixados não são alterados.

Os testes cobrem recuperação após remontagem, ausência de geração automática, falha de leitura, repetição do salvamento com o mesmo arquivo, substituição explícita, identidade compartilhada na biblioteca, persistência dos bytes, isolamento entre contas e entre formatos, falha de armazenamento e rejeição de PDFs inválidos.

## Formatos de impressão

O comportamento atual distingue capa integrada e capa separada. A opção integrada preserva o endpoint PDF existente; a separada usa `?mode=separate` e salva atomicamente Capa e Miolo em um pacote privado. A biblioteca recupera cada opção sem geração automática. Os metadados da montagem permitem mostrar as contagens de folhas e brancos também após reabrir. Arquivos antigos recebem identificação explícita e podem ter a montagem corrigida mantendo a arte. Consulte [LIVRETO-IMPRESSAO.md](LIVRETO-IMPRESSAO.md) para a sequência de leitura, validação e instruções por arquivo.
