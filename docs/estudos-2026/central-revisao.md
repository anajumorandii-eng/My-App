# Central de revisão

Retomada em 14/10/2026 do último pedido da sessão compartilhada. A implementação final daquela sessão não estava no workspace, numa branch remota ou numa PR; esta entrega reconstrói a central sobre a main após #326.

## Uso

Revisões reúne 21 recursos: fila com adição manual, questões reais, caderno de erros, resumos, flashcards, visual, obras, redação, discursivas, estratégias, prioridades, recuperação, diagnóstico, tutor, podcast, laboratório, agenda, plano, reta final, sessão e evolução. Guia e caderno PDF da Unicamp ficam acessíveis no topo.

O seletor abre uma atividade de cada vez. Recursos são carregados na primeira escolha; os visitados permanecem montados ao alternar. Cada atividade mantém seus parâmetros de navegação. Links entre recursos abrem na central; links de obras também abrem o dossiê. Nova aba usa um endereço compartilhável da central. Trocar de conta limpa as atividades abertas.

O roteiro consulta agenda e objetivos existentes, usa horários de São Paulo e apenas janelas ainda disponíveis, dando preferência às reservadas para revisão. Exclui dia de prova e limita a véspera conforme o mecanismo existente. Distingue objetiva, discursiva e redação. A Unicamp recebe destaque quando é a próxima prova confirmada entre as bancas e fases ativas, sem substituir os objetivos pessoais por um foco fixo.

Cada bloco apresenta ação e critério de conferência. O roteiro não registra conclusão, aumenta domínio ou preenche automaticamente a agenda. O seletor de duração é um teto para a sessão sugerida; as janelas podem oferecer menos minutos.

## Atualização entre recursos

Gravações confirmadas de domínio, erros, objetivos e agenda notificam as instâncias abertas da mesma conta. Alterações de resumos são compartilhadas por operação e as gravações das atividades abertas são serializadas por conta; confirmação antiga não substitui edição mais recente. A navegação não remonta os formulários das outras atividades. Dados de demonstração e tópicos iniciais nunca estudados não são contados como revisões pessoais vencidas.

## Limites

A retenção das atividades vale enquanto a central permanecer aberta. Sair ou recarregar mantém apenas o que o próprio recurso já salva. Abrir um dossiê troca a página do catálogo dentro de Obras; as fichas literárias continuam com o salvamento existente. Atividades em execução, como áudio e cronômetro, continuam abertas ao alternar.

Notificações de atualização desta entrega são locais à janela atual e à conta ativa, sem prometer sincronização em tempo real entre dispositivos. Autenticação e IA continuam sujeitas às condições existentes. O teste no navegador usou demonstração, pois o ambiente não possui OAuth configurado.

## Verificação da retomada

- Node: `npm run test:node`, 1.084 testes aprovados.
- Interface: 225 arquivos e 3.153 testes executados. Na rodada completa, 3.152 passaram e um teste de `visual-instruments/registry.test.ts` excedeu 15 segundos sob concorrência com a compilação. A reexecução isolada do arquivo passou nos 31 testes, com o mesmo limite. As regressões finais de navegação real, gravações ordenadas, leituras atrasadas e cores também passaram.
- `npm run lint`, `npm run build` e `git diff --check`: aprovados. A compilação mantém os avisos já existentes de tamanho de chunks.
- `npm run visual:matrix`: aprovado, sem alterações na matriz; continuidade de Geografia: 160 testes aprovados.
- Navegador: central em 390×844 e 834×1112, sem erro de página ou rolagem horizontal; primeira versão da redação e banca Unicamp preservadas ao abrir Questões e voltar. Seleção dos 21 recursos sem exceções. [Captura no celular](evidencias-central/celular.png).
- Dossiê: contrato coberto por teste com a rota externa real e dados simulados; acesso direto no navegador confirmou a página de detalhe. Conteúdo remoto das obras não foi reavaliado neste ambiente.
