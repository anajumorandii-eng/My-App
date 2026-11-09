# Capas elaboradas do Crivo

A direção de arte compartilhada em `server/ai/coverArtDirection.ts` orienta
capa individual, contracapa e arte conjunta de livreto: gravura fina,
aquarela luminosa, texturas e estudos em camadas, com verde, vinho e dourado
contidos. Esse acabamento vale para todas as matérias, incluindo Linguagens,
Redação, Filosofia e Sociologia. O detalhamento deve desenvolver o recorte escolhido, sem acrescentar
objetos de outras matérias para preencher espaço.

`buildCoverPairVisualBrief` define cenas complementares para Genética geral
(DNA/cromatina na frente e estudos botânicos de Mendel atrás), replicação do
DNA, herança mendeliana, Geometria plana e semelhança de triângulos. Os recortes
específicos continuam substituindo o tópico amplo; os demais temas conservam
as orientações existentes e recebem o acabamento compartilhado.

A ilustração permanece transparente. O aplicativo continua desenhando
títulos, moldura, divisor central e rodapés. As regiões reservadas e as
coordenadas da arte conjunta não mudam. As composições de revisão e
aprofundamento, a variação por edição, a autenticação, o provedor, a quota e
o reaproveitamento de PDFs salvos permanecem no fluxo existente.

Verificação focada:

```sh
node --import tsx --test src/lib/coverPairVisualBrief.test.ts server/ai/coverImages.test.ts src/lib/bookletPdf.test.ts
```

Os testes verificam o contrato enviado ao gerador e a composição nativa do
PDF. Não certificam a qualidade visual de uma imagem nova: essa avaliação
depende de gerar e inspecionar a arte. Esta alteração não publica o aplicativo
nem substitui PDFs já salvos; o estilo será solicitado nas novas gerações
após a integração e publicação.
