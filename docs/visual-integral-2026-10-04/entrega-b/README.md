# Entrega B — Inglês e Entendimento de Texto

29 capítulos: 17 de Língua Inglesa e 12 de Entendimento de Texto. Base de integração: `f9b7e12f`, após o redesenho integral de História e Geografia (#255).

Cada capítulo apresenta um objeto próprio de leitura, pistas destacadas, um esquema da relação interpretada e um achado manuscrito. O controle alterna três situações em Inglês e duas operações em Entendimento. Taxonomy e Textualidade usam agora seus instrumentos específicos, preservando os IDs publicados. Trechos de leitura são exemplos originais; os contextos científicos são explicitamente didáticos.

Os 29 resumos foram aprofundados para revisão editorial 2: 145 seções de 945–1.088 caracteres, práticas e pegadinhas corrigidas, com recuperação alinhada à seção de exercícios. Os outros 583 registros do conteúdo aprofundado permaneceram iguais à base. Chaves de armazenamento, tentativas anteriores e IDs dos capítulos foram preservados.

## Revisão e correções

A revisão independente dos 29 textos corrigiu nove generalizações ou ambiguidades de gramática/interpretação. A revisão final da integração encontrou a paródia apontando para B em vez de C, a ironia desenhada sobre uma situação diferente da passagem e a anotação de calorias descrevendo a direção oposta à seta. As três foram corrigidas; regressões conferem a relação entre documento e desenho.

A validação inicial do navegador detectou 2 pixels de largura excedente no celular, corrigidos permitindo quebra no mostrador da condição. A conferência das capturas encontrou uma regra antiga de grade que deslocava o desenho de leitura para a coluna estreita; as cenas de Inglês/Entendimento agora ocupam a primeira coluna desde 621 px. O desenho de leitura permanece acessível por rolagem interna e teclado no celular e deve aparecer completo no desktop.

## Evidências

- [Manifesto dos 29 IDs/configurações](manifest.json).
- [Resultados do navegador por capítulo e estado](browser-evidence.json).
- [Galeria das composições](GALERIA.md).

A matriz Chromium usa 390/834/1.366 px, temas claro/escuro e movimento normal/reduzido. Confere passagens, pistas, achados, registro efetivo, contenção da página, limites/colisões dos textos SVG, fonte mínima efetiva de 11 px e extremos Home/End. Nos 29 capítulos, abre Testar/Reconstruir e retorna a Explorar na configuração móvel clara com movimento reduzido. Não envia respostas nem altera conta real. Capturas incluem o objeto, o desenho e a anotação; barras fixas são ocultadas apenas na captura.

Resultado consolidado: **12 configurações, 1.944 estados SVG e 58 aberturas de Testar/Reconstruir**, sem cortes, colisões ou fonte abaixo do mínimo nos estados verificados. As 75 capturas estáticas foram inspecionadas; 31 acompanham a galeria. A execução de 12 configurações teve dez sucessos e duas interrupções: tempo limite de carregamento inicial em tablet escuro e medição imediata de largura zero durante uma transição no desktop claro. Ambas as configurações completas passaram na repetição com um worker; a medição agora aguarda o elemento conectado e a mesma largura mínima, sem aumentar o limite de tempo. As ocorrências iniciais estão preservadas na evidência consolidada.

A fila validada mantém os 613 IDs: 93 achados tratados, 205 pendentes e 315 mecanismos preservados; 148 resumos ainda sem revisão 2.

## Verificação final

- `npm run lint`: sem erros.
- `npm run build`: produção compilada; avisos de chunks grandes permanecem.
- `npm test -- -- --maxWorkers=1`: 870 testes Node + 1.001 Vitest, **1.871 sucessos**, 154 arquivos de interface, sem falhas. Os limites originais de tempo foram mantidos; testes, compilação e navegador rodaram em sequência.
- `npm run visual:matrix`: 13 testes; matriz sincronizada com os dois instrumentos novos.
- `npm run visual:quality`: quatro testes; apenas artefatos de Taxonomy/Textualidade sincronizados, sem alterar status de aprovação.
- `node scripts/validar-fila-visual.mjs`: 613 IDs e 148 vínculos editoriais íntegros, fontes e evidências existentes.

A primeira suíte geral identificou o teste que ainda esperava o experimento antigo de Textualidade e o inventário versionado desatualizado para os dois novos instrumentos. O teste agora verifica o registro publicado e o reparo de coerência; o inventário foi regenerado. Ambos passaram dirigidamente e na suíte completa final.

## Limites

O tratamento dos achados LG2 não promove aprovação editorial integral nem altera os vereditos da auditoria histórica. A verificação utiliza Chromium e fixtures locais; Safari/iPad físico, fluxos autenticados, contraste formal e desempenho continuam frentes separadas. Nenhum merge automático.
