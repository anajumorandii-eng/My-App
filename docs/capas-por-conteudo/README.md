# Capas orientadas pelo conteúdo

## Achados e correção

O pedido de ilustração já enviava matéria, tópico e recorte, mas não continha
uma restrição explícita a personificações genéricas. Para linguagem, o texto
era amplo e não diferenciava sintaxe, formação de palavras, comunicação ou
relações de sentido antes da direção estética. A arte padrão de Português e
redação também reutilizava a prancha de Literatura.

A prancha padrão inspecionada contém uma máscara teatral, não uma mulher.
Não recebemos o PDF específico mencionado pela estudante; por isso não é
possível atribuir aquela figura a uma resposta particular do provedor.

`buildCoverVisualBrief` agora acrescenta, antes da estética:

- O recorte mais específico, preservado como dado, com orientação visual própria.
- Grupos de frases, dependências e marcas editoriais em sintaxe; peças
  tipográficas e famílias em formação de palavras; correspondências entre
  trechos em interpretação; meios e relações de comunicação nas funções da linguagem.
- Proibição de mulher, homem, leitor, musa, rosto, retrato, busto ou silhueta
  como alegoria de linguagem, gramática e redação.
- Para outras matérias, figuras humanas somente quando exigidas pelo próprio
  conteúdo: personagem, pessoa, população ou processo humano pertinente.
- Conferência de relevância de cada objeto em relação ao tópico e aos recortes;
  a banca e o tipo do material não determinam os objetos.

O recorte específico prevalece sobre o inventário do tópico amplo. Recortes
combinados recebem os motivos correspondentes; um recorte personalizado não
é trocado pelo inventário genérico da matéria. Sem recorte específico,
“Visão geral” e “Tópico completo” remetem ao tópico/obra.

Português e redação agora usam uma [arte padrão própria](padrao-linguagem.jpg),
sem máscara ou figura humana. Ela é uma alternativa neutra para quando a
personalização não está disponível, não uma ilustração personalizada de cada
capítulo. A arte de Literatura continua preservada. O provedor, o modelo,
o endpoint, as quotas, a diagramação e os textos das capas não foram alterados.

## Verificação visual e limites

Foram exportados e inspecionados exemplos A4 de sintaxe, morfologia,
comunicação, redação e obra literária, preservando os metadados e o conteúdo.
São exemplos sintéticos; nenhum arquivo privado da estudante foi publicado.

Uma [prévia de sintaxe](previa-sintaxe.webp) foi gerada com o
[pedido produzido pelo servidor](prompt-sintaxe.txt), usando a ferramenta
integrada de imagens. Ela representa agrupamentos de orações, relações de
dependência e anotações, sem pessoas. A prévia foi inserida no exportador real
para conferir a composição da capa ([PDF de exemplo](exemplo-sintaxe.pdf)). Isso valida visualmente a orientação,
mas não equivale a uma chamada ao provedor configurado em produção.

Os testes cobrem prioridade do recorte, diferenças de motivos entre tópicos,
recorte personalizado, escopo completo, instruções nos dois tipos de material,
figuras humanas pertinentes em outras matérias e seleção da nova arte padrão.

PDFs já arquivados não são apagados nem refeitos automaticamente. Após a
publicação, **Gerar novo PDF** faz uma nova edição com a orientação atualizada.

Verificações do projeto: lint, **4.701 testes aprovados** (um ignorado pela
configuração existente) e build concluídos. O build conserva os avisos de
tamanho dos bundles.

## Arte e reprodução

A arte padrão foi preparada pela ferramenta integrada de imagens, sem CLI.
Os dois pedidos de edição estão em [prompts da arte](prompts-arte.md).

- `src/assets/print/atlas-language.webp`: matriz com transparência preservada.
- `src/assets/print/atlas-language.jpg`: versão preparada para impressão sobre
  o papel CRIVO, pelo mesmo processamento de `scripts/prepare-print-art.mjs`.
- `src/lib/coverVisualBrief.ts`: orientação semântica compartilhada com o servidor.
- `server/ai/coverImages.ts`: inclusão da orientação antes da direção de arte.
- `src/lib/printCoverArt.ts`: seleção da alternativa própria de linguagem.

Esta entrega é uma alteração em branch/PR, sem publicação automática.
