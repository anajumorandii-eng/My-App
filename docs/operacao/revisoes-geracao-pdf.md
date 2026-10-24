# Revisões: falhas de texto, capa e PDF

## Diagnóstico de 24/10/2026

As falhas são independentes. Uma resposta sem recuperação ativa ou gabarito separado era descartada pelo cliente; o texto agora permanece como rascunho, sem ser salvo ou exportado como revisão concluída. Ele deve ser copiado antes de sair, trocar o recorte ou iniciar outra tentativa. Uma interrupção do streaming também preserva os trechos recebidos.

A geração de capa pode receber HTTP 429. O cliente informa o limite e, quando presente, o prazo de `Retry-After`. Não repete automaticamente uma chamada de imagem, evitando novas cobranças. Falhas de capa não descartam o texto nem impedem o PDF provisório. Repetir apenas a renderização de um PDF mantém a ilustração já preparada.

Os registros do serviço confirmaram encerramento por memória durante `/api/study-pdf`: 1.062 MiB utilizados contra limite total de 1.024 MiB. O contêiner do aplicativo foi ajustado de 512 MiB para 2 GiB; o auxiliar permaneceu com 512 MiB. A atualização preserva os demais campos do contêiner e usa a versão de configuração para evitar sobrescrever uma atualização concorrente. Isso aumenta o custo potencial de execução. Nos próximos deployments, preservar esses limites; não restaurar o aplicativo para 512 MiB.

A renderização já limita a um PDF por processo. Aumentar memória não garante que todo documento caberá: acompanhar novos encerramentos e latência, sem declarar resolução de uma falha de texto a partir de uma resposta HTTP bem-sucedida do PDF.

## Desenvolvimento das revisões

As orientações por profundidade foram reforçadas a partir dos princípios didáticos dos materiais de Tutora Vestibular Medicina, Atualidades Estratégicas e análise literária fornecidos pela usuária. A revisão rápida mantém raciocínio compacto, mas completo. A estratégica desenvolve intuição, conceito, mecanismo e condições de uso; os exemplos explicitam o ponto de decisão, uma abordagem tentadora que falha e a conferência. A aprofundada acrescenta reconstrução guiada, variação de estratégia e transferência independente, com critério observável de domínio no gabarito.

A seleção de bancas e etapas prevalece sobre prioridades das habilidades. Perguntas ao professor, incidência presumida e diagnósticos pessoais sem evidência não são importados. Atualidades continua delimitada às fontes datadas, sem pesquisa ao vivo. As instruções alteram novas gerações, não reescrevem materiais salvos. Testes de composição de instruções não garantem a qualidade pedagógica de toda resposta produzida pelo provedor.
