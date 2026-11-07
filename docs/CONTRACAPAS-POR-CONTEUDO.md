# Capa e contracapa vinculadas ao conteúdo

Os prompts de contracapa e de capas integradas incluíam um exemplo completo de climatologia em todas as disciplinas. Mesmo com a ressalva de seguir o tópico, esse exemplo introduzia montanhas, bacia hidrográfica e vegetação em materiais de população e urbanização.

`buildCoverPairVisualBrief` agora seleciona as duas cenas e sua ligação antes de aplicar o estilo. Usa o mesmo recorte específico de `buildCoverVisualBrief`; rótulos como “Visão geral” recorrem ao tópico ou à obra. As regras concretas de Geografia são selecionadas somente nessa disciplina e somente quando correspondem ao recorte. Em população e urbanização, a contracapa prioriza relações entre gerações, moradia, bairros, mobilidade e infraestrutura pertinentes ao problema. A cena climática aprovada é enviada apenas para o recorte climático.

Nos demais conteúdos, a cena complementar deve desenvolver uma estrutura, relação, contexto, aplicação ou consequência do mesmo assunto. O prompt não oferece inventários de outro tema como exemplo. Cada lado precisa justificar seus motivos pelo conteúdo; a paleta e a ligação visual não bastam para justificar uma cena sem relação com o material.

A arte continua sendo uma única composição transparente, com duas cenas distintas ligadas na dobra, tipografia nativa e posições reservadas. Não há geração adicional, alteração do texto ou troca de artes em PDFs já baixados. É necessário gerar um novo livreto para receber o novo direcionamento.

Os testes verificam o par população/urbanização, a preservação do recorte climático, a precedência de migrações sobre um tópico amplo, recortes livres e outras disciplinas. Também exercitam os prompts e a requisição real ao adaptador com uma única imagem transparente. Esses testes verificam o contexto enviado ao serviço; a interpretação visual continua dependente da geração de imagem.
