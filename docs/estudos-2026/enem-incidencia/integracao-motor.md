# Fontes do ENEM no motor de geração

As fichas oficiais já chegavam ao cliente por `loadStudyPacket`. As análises das oito aulas, padrões de resolução e classificação das apostas permaneciam somente na documentação. Agora `server/ai/enemStudySources.ts` seleciona essas evidências no servidor, após validar o pedido, e `routes.ts` as inclui no prompt efetivamente enviado ao provedor.

O caminho atende revisões/resumos, estratégias simples e combinadas, aprofundamentos que usam `review-tip`, explicações de conteúdo e roteiros de podcast quando ENEM é solicitado explicitamente. As fontes EH são devolvidas em `serverSources`; as telas existentes de revisão, estratégia, aprofundamento e podcast já as persistem junto do material.

A seleção respeita a matéria e os nomes de tópicos do catálogo. Seleção explícita de outras bancas, seleção vazia e revisão exclusivamente de anexos não recebem estas fontes. Com recorte de capítulo, as estatísticas continuam identificadas como assunto inteiro e não são acrescentadas questões ou aulas de tópico inteiro. O contexto adicional é limitado a 8.000 caracteres e as análises de questões são explicitamente marcadas como recortes sem enunciado integral.

São três naturezas distintas de evidência: estimativa histórica de 2018–2025, análise editorial de questões oficiais de 2022–2025 e síntese dos arquivos enviados. As 131 apostas são descritas apenas por contagens classificadas, sem copiar seus enunciados nem tratá-las como previsão validada. O prompt exige citações EH, condições de uso dos atalhos e distinção entre essas fontes. Não há garantia de acerto ou cobrança.

`npm run build` executa automaticamente `scripts/buildEnemStudyGuidance.mjs`, que prepara `src/data/enemStudyGuidance.json` a partir dos dois documentos de análise. O teste verifica seus hashes e a presença das oito gravações documentadas. A fonte é a síntese editorial já versionada, não uma nova leitura integral das gravações. Histórico e incidência continuam vindo dos dados publicados do aplicativo; as contagens das apostas vêm da classificação existente.

O contexto passa a participar do prompt e, portanto, da identidade de cache da geração. Materiais pessoais já salvos não são apagados nem reescritos em lote: a integração vale para gerar ou atualizar o material. Nenhuma chamada a um provedor real foi necessária para os testes: a rota foi exercitada com um provedor simulado, verificando o prompt recebido e as fontes devolvidas.
