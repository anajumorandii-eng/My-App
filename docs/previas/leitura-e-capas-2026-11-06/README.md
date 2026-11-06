# Checkpoint: leitura ilustrada e capas integradas

A estudante pediu para salvar o trabalho porque os limites da sessão estão acabando. Este checkpoint é um rascunho e não deve ser confundido com uma entrega visual aprovada.

## Direção vigente e retomada

**Leitura:** a direção editorial foi bem recebida, mas deve ficar mais bonita, com imagens geradas, inspiração de caderno digital/Cornell e identidade do Crivo. A aplicação na tela de leitura depende de aprovação. A prévia usa marfim contínuo, verde, vinho, aquarela temática, marcadores e abas. Ocultar a navegação libera efetivamente a largura; o menu Aa muda o tamanho do texto e a cor de toda a página. O aplicativo ainda usa o leitor anterior: nenhum componente de leitura foi alterado neste checkpoint.

Abra [leitura.html](leitura.html) junto de `literatura-aquarela.png`. A fonte está incluída no HTML. Ver [com núcleos](leitura-com-nucleos.png) e [em largura inteira](leitura-largura-inteira.png). O conteúdo de Literatura é demonstrativo do layout e não substitui o conteúdo curricular.

**Livreto:** a PR 424 gerava capa e contracapa em chamadas independentes; os PDFs enviados pela estudante mostraram duas artes isoladas. A primeira tentativa de correção criou uma faixa horizontal com globo flutuante, e foi explicitamente rejeitada. NÃO retomar esse desenho.

A referência vigente é [referencia-capas-aprovada.png](referencia-capas-aprovada.png): duas composições verticais, paisagem mais alta à esquerda, globo em suporte de latão à direita, respiro para os títulos e uma ligação suave pelas nuvens. A integração é delicada; não transforma tudo numa paisagem horizontal. Ver o [exemplo recomposto](capas-exemplo-composto.png) e sua [camada com transparência](capas-camada-transparente.png).

## Código em rascunho

- `side: spread` pede uma única imagem com ambas as cenas planejadas juntas. O prompt fixa as regiões verticais e o espaço transparente para os títulos, adaptando os motivos ao assunto e subtópico.
- `bookletCoverSpread.ts` aplica a camada inteira sobre a face externa, com um único sistema de coordenadas, papel marfim e tipografia nativa incorporada. O PDF comum e o miolo são preservados.
- `BookletPdf` carrega as fontes ao gerar o livreto e usa a composição conjunta. Sem serviço ou arte válida, mantém o PDF comum e permite tentar novamente.
- As fontes TTF Cormorant e Playfair foram derivadas dos WOFF já licenciados no projeto. As licenças OFL correspondentes permanecem em `src/assets/print/fonts/`. Cormorant deve ser incorporada integralmente: a redução de glifos usada na primeira tentativa apagava letras após espaços na renderização. A conferência deve incluir a imagem renderizada, não só texto extraído.

## Verificação e próximos passos

Os testes específicos de servidor/PDF e de interface passaram, incluindo passagem da arte pela dobra, texto nativo, fontes incorporadas, recusa de arte vertical, geração única e nova tentativa. Lint e build passaram. A suíte completa está sendo concluída antes do envio deste checkpoint; registrar seu resultado no fim deste arquivo.

O protótipo de leitura foi conferido no Chromium em 1280 px, iPad em retrato e celular. Foram verificados expansão real da área de texto, temas, tamanho da fonte, links, Escape e ausência de rolagem horizontal.

O exemplo privado de Climatologia manteve as dez faces e as nove faces internas com texto idêntico ao PDF enviado. Os PDFs enviados e os textos extraídos permanecem fora do repositório público. Somente a face externa genérica, sem dados pessoais, foi salva como imagem para revisão.

Para retomar: conferir a composição com a referência acima, pedir validação da leitura ilustrada e concluir a revisão visual do livreto antes de mesclar. Não tratar a faixa horizontal rejeitada como direção aprovada. As artes de exemplo não devem ser usadas como capa fixa de todos os assuntos.

## Imagens da prévia

Geradas pela ferramenta de imagem integrada, com transparência preservada. A aquarela de leitura pede livro aberto, caneta vinho, página em movimento e paisagem urbana brasileira, em gravura fina e aquarela suave, sem pessoas, rótulos, moldura ou fundo opaco. A camada das capas foi extraída da referência aprovada, preservando posições, volumes verticais, suporte do globo e ligação pelas nuvens, removendo somente textos, molduras e papel para permitir composição nativa. São ativos de prévia, não uma nova biblioteca genérica de imagens do aplicativo.

### Resultado final das verificações do checkpoint

`npm run lint` e `npm run build` concluíram com sucesso. `npm test` aprovou 1.363 testes de servidor/bibliotecas (um teste ignorado) e 3.429 testes de interface em 270 arquivos. A suíte de interface levou 477 segundos. Nenhuma falha. O checkpoint permanece em rascunho para validação visual; esses resultados não constituem aprovação do design.
