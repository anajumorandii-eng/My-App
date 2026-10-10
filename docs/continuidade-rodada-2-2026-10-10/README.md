# Continuidade — rodada 2

Base: `8b6b0a43`, após integração do PR #297. Rodada ampliada para **oito capítulos de Física**, mais uma correção do avaliador compartilhado. Os 613 capítulos continuam no catálogo; esta rodada não constitui aprovação pedagógica integral.

| Capítulo | Correção |
| --- | --- |
| O Movimento Circular | Igualdade das velocidades nas bordas pressupõe ausência de deslizamento; distingue módulo constante e direção variável da aceleração, com componente tangencial quando a rapidez varia. |
| As Leis de Newton | Igualdade da tração requer também roldana ideal; identifica os pares de reação do peso e da normal. |
| Dinâmica do Movimento Circular | Distingue componente centrípeta e resultante total; outras escolhas de eixos são válidas; pergunta explicita curva plana, rapidez constante e ausência de derrapagem. |
| Trabalho e Energia: Trabalho de uma Força | A normal pode realizar trabalho numa plataforma móvel; o exemplo de levantamento não afirma que apenas o peso atua. |
| Hidrostática: Densidade e Pressão | Corrige a explicação do paradoxo hidrostático considerando forças nas paredes; distingue pressão manométrica de absoluta no texto e na pergunta. |
| Trabalho da Força de Pressão do Gás | Área no diagrama da pressão do gás exige processo quase estático; distingue pressão externa em processo irreversível; corrige a posição do trecho de expansão no ciclo horário. |
| Campo Elétrico | Módulo usa valor absoluto da carga fonte; linha de campo não determina, em geral, a trajetória da carga. |
| Capacitores | Igualdade das cargas em série explicita nós intermediários neutros e capacitores inicialmente descarregados; distingue inserção de dielétrico com fonte conectada e capacitor isolado. |

Somente esses oito capítulos passam da revisão editorial 2 para 3. Mantidos IDs de capítulos e materiais. As novas revisões deixam de contar seções antigas como lidas; nenhum progresso persistido é apagado. Títulos de seções, lastro das cenas e estados formais de revisão permanecem preservados.

## Avaliador

Foi reproduzido um defeito: a remoção de palavras curtas produzia uma lista vazia e `every()` aprovava critérios como `2`, `50` ou `0,5` mesmo com resposta vazia. Além disso, a busca por substring aceitava `100` dentro de `1000` ou `-100`. A correção exige tokens presentes no caminho lexical e compara critérios puramente numéricos com valores completos, considerando sinal e separador decimal. A avaliação continua aproximada: não interpreta semanticamente toda frase nem converte automaticamente todas as notações científicas.

## Fontes e design

Foram consultadas as seções OpenStax sobre [movimento circular](https://openstax.org/books/university-physics-volume-1/pages/4-4-uniform-circular-motion), [forças](https://openstax.org/books/university-physics-volume-1/pages/5-6-common-forces), [trabalho](https://openstax.org/books/university-physics-volume-1/pages/7-1-work), [pressão](https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure), [trabalho termodinâmico](https://openstax.org/books/university-physics-volume-2/pages/3-2-work-heat-and-internal-energy), [campo elétrico](https://openstax.org/books/university-physics-volume-2/pages/5-4-electric-field) e [capacitores associados](https://openstax.org/books/university-physics-volume-2/pages/8-2-capacitors-in-series-and-in-parallel). [Registro de mudanças e fontes](evidencias/alteracoes.json).

Design & Motion Kit: preservadas as adaptações Claude/Miro à identidade editorial do Crivo, com hierarquia, controles de toque, teclado e estado completo em movimento reduzido. Rótulos da correia, da cena circular e da prancha hidrostática também explicitam as condições do modelo, sem alterar mecanismos ou controles. As correções desta rodada são de conteúdo e avaliação; não exigem novas dependências Fancy, COBE ou React Bits.

## Continuidade

Os 81 capítulos em validação e 532 não revisados continuam com os mesmos estados formais. A triagem lexical não foi convertida em lista automática de erros: perguntas de transferência podem usar números diferentes dos exemplos, desde que o método seja ensinado. Próxima rodada: demais candidatos de Física, Biologia e Geografia, confirmados por leitura e fontes. Sem merge automático.

## Validação

TypeScript e build passaram. A suíte ampla passou nos 1.524 testes dos 186 arquivos; os 945 testes Node passaram. A validação focada final passou nos 42 testes editoriais/lastro, além dos 19 de mecanismos e avaliação e dos 15 da tela de estudo. Respostas completas são aceitas nos oito capítulos; sem o resultado numérico, a transferência permanece bloqueada. Resposta vazia não valida nenhum critério de recuperação no catálogo.

A estrutura dos 613 capítulos mantém 8 experimentos, 43 pranchas, 375 instrumentos, 187 cenas e nenhum fallback. A matriz gerada permanece igual à base. A auditoria de navegador cobre os oito capítulos em 360/834/1440 px, claro/escuro e movimento normal/reduzido: 96 casos, incluindo teclado, controles de toque, SVG, comparação, inspetor e alternância de modos.

[Resultado de navegador](evidencias/navegador-96.json) e [registro da validação](evidencias/validacao.json). As capturas selecionadas estão em [Galeria](GALERIA.md). Para reproduzir, execute `node docs/continuidade-rodada-2-2026-10-10/capturar.cjs atual` com uma prévia estável na porta 3003 e as variáveis `CRIVO_AUDIT_WIDTH`, `CRIVO_AUDIT_THEME`, `CRIVO_AUDIT_MOTION`, `CRIVO_VISUAL_URL`, `CRIVO_VISUAL_AUDIT_DIR` e `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Repita as 12 configurações; use saída fora da árvore observada pelo servidor. Os resultados atuais usam Chromium local.

### Consistência da checagem de tipos

A primeira execução do CI falhou com `TS2339` na inferência do resultado de `String.match()` com uma lista vazia. O erro foi reproduzido num checkout limpo dos arquivos versionados; a anotação explícita `string[]` resolveu a falha sem alterar a comparação em execução. O lint local também estava incluindo 197 arquivos de build em `dist/` e 28 arquivos temporários de auditoria em `work/`. O `tsconfig.json` agora exclui essas duas pastas, mantendo a checagem dos arquivos de produto. A validação foi repetida no checkout limpo e no diretório de trabalho; oito testes do avaliador passaram após o ajuste.
