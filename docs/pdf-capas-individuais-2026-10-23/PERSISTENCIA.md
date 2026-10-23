# PDF e capa salvos na biblioteca

O PDF concluído ficava apenas num cache de memória com quatro entradas. Ao recarregar a página, o arquivo desaparecia; na revisão, o estado local de exportação também escondia as ações ao reabrir um resumo.

Agora a geração autenticada salva o arquivo PDF completo num objeto privado do Firebase Storage, antes de anunciar que está pronto. O caminho separa as contas pelo hash do identificador autenticado. A chave do documento usa material, guia e versão, sem depender do título de apresentação de cada tela.

Ao abrir um material salvo, o componente consulta o arquivo existente e oferece Abrir PDF / Salvar PDF. Na revisão, se nenhum PDF foi gerado, aguarda o comando de exportação. Gerar novo PDF substitui explicitamente a edição salva. O texto e os filtros da biblioteca continuam no armazenamento existente de guias.

Uma falha de consulta oferece tentar novamente sem solicitar outra capa. Uma falha ao salvar não anuncia o PDF como pronto, mantém a preparação da capa para nova tentativa e preserva o objeto anterior. Leituras não consomem o limite de renderizações. O bucket é `FIREBASE_STORAGE_BUCKET`, quando informado, ou `storageBucket` de `firebase-applet-config.json`.

## Verificação

- Rota HTTP com armazenamento controlado: bytes idênticos na recuperação, separação de contas, autenticação, falhas de leitura/gravação e preservação da edição anterior.
- Componente: recuperação de sessão anterior sem gerar imagem/PDF, indisponibilidade sem geração acidental, primeira exportação explícita e ida da geração à biblioteca com títulos diferentes.
- Fluxos de revisão, aprofundamento e obras; renderizador real do PDF preservado.
- Chromium com o componente real e a rota real de PDF: exportar, recarregar completamente a página, recuperar o arquivo, gerar outra edição, recarregar e recuperar a nova edição. Os hashes SHA-256 dos arquivos permaneceram idênticos em cada recuperação; apenas duas renderizações ocorreram. Autenticação e armazenamento foram simulados com uma conta e arquivos sintéticos, sem acessar dados reais.

Arquivos gerados antes desta alteração e perdidos ao fechar a sessão não podem ser recuperados retroativamente. Os próximos PDFs gerados por uma conta autenticada usam a persistência. O bucket de produção não é alterado nem exercitado pelos testes locais; os testes simulam somente a dependência de armazenamento.
