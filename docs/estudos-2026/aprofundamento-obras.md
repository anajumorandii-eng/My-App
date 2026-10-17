# Aprofundamento de obras gerado na hora

Resumo e estratégia de obras oferecem um botão de geração para o escopo atual: obra completa ou unidade publicada. A geração reutiliza o streaming autenticado de `review-tip`, com modo literário específico, fontes do dossiê publicado e reflexão pessoal existente. A banca pode ser escolhida ou usar as metas pessoais disponíveis, sem presumir inscrição ou cobrança.

O modo literário exige indício textual, recurso formal, efeito e relação com o conjunto; inclui hipóteses contrastantes, prioridades de releitura, construção de resposta e recuperação ativa por explicação escrita ou oral. O resultado é identificado como guia pessoal gerado por IA e não altera a publicação editorial.

Os guias usam a biblioteca e a persistência existentes. A chave distingue obra, unidade e banca; os metadados permitem voltar à obra e ao recorte correto. O texto anterior permanece salvo se a geração falhar ou retornar vazia. O leitor oferece fontes, impressão/PDF e nova tentativa de salvar na conta quando necessário.

A seleção de fontes mantém introdução e análise publicadas como contexto do conjunto, acrescenta a síntese publicada da unidade e limita as passagens à unidade escolhida. Referências extensas são marcadas como recortes e respeitam o limite de contexto existente. A seleção padrão de fontes de áudio da obra permanece igual.

Validação: testes do pacote de fontes, prompt literário, geração e persistência no componente, recuperação pela biblioteca, escopo de leitura e impressão. O streaming é simulado nos testes; a qualidade de uma resposta real e o acesso com credenciais pessoais não são certificados por esses testes.

Resultados: TypeScript e build de produção passaram. A suíte completa passou com 1.143 testes Node e 3.214 testes de interface em 240 arquivos. A auditoria de navegação existente passou em quatro combinações de tela/tema, com 16 estados sem violações automáticas de acessibilidade, erro de página ou transbordamento horizontal.
