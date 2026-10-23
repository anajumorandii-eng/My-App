# Resumos de revisão por banca

A Central de Revisão oferece **Criar resumo por banca** e o recurso
**Resumo de revisão por banca**. O formulário seleciona matéria, tópico,
capítulo opcional e uma banca explícita. A consulta direta também está disponível
em `/resumos-revisao`; dentro da central, o fluxo permanece na mesma aba.

A geração reutiliza `/api/ai/review-tip` com `guideMode: review-summary` e as
fontes do recorte selecionado. O prompt próprio organiza conceitos, fórmulas e
condições, cobrança observada, pegadinhas, três perguntas sem resposta imediata
e critérios separados. Sem evidência específica da banca, deve declarar a lacuna.
Não há imagens de páginas nem marcação automática de revisão concluída.

O salvamento reutiliza a coleção privada `users/{uid}/strategyGuides` e o cache
existente. O campo opcional `kind: review-summary` e a chave com esse prefixo
separam os materiais da biblioteca de aprofundamentos, sem migrar ou apagar
os guias antigos. Matéria, tópico, capítulo e banca compõem a identidade do resumo;
regenerar substitui a versão desse mesmo recorte. A biblioteca permite filtrar
por matéria e banca e reabrir o texto salvo.

Falhas de geração não salvam rascunhos incompletos nem apagam versões anteriores.
A troca de conta desmonta a sessão e descarta a resposta pendente da conta antiga.
A interface informa falhas de cache/sincronização e permite tentar salvar novamente.

As correções de extração de AS1 e espaçamento/expoentes das análises de questões
integram a mesma entrega. PDFs, páginas e OCR bruto das apostilas não são parte da
publicação. O registro de Geometria contém somente recortes conceituais recompostos
e conferidos, sem dados pessoais ou transcrição integral dos materiais.
