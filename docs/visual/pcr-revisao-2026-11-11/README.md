# PCR: resultado, pausa e controles — 11/11/2026

Revisão da cena integrada na PR #440, sobre `origin/main` em
`e709dbfb943839f7054ee397ae2322c8adfddbf6`.

## Comportamento

- Os dois cenários comparam a mesma grandeza: **novas fitas sintetizadas**,
  duas com primers e zero sem primers. O texto distingue as fitas originais
  das novas, sem sugerir que o DNA inicial desaparece.
- Trocar o cenário atualiza também o detalhe que já estava aberto.
- Ao concluir a extensão, a polimerase desaparece e o ponto de interesse passa
  a **Nova fita**, com âncora e explicação correspondentes.
- A opacidade é calculada por ordem de síntese: `clamp(extension × 24 − ordem)`.
  Os 24 nucleotídeos após cada primer ficam inteiramente visíveis ao final.
- A pausa manual conserva síntese, separação, calor, partículas e câmera no
  estado corrente; retomar continua desse ponto. Girar e aproximar continuam
  disponíveis. Trocar explicitamente de etapa ou cenário durante a pausa
  apresenta diretamente o resultado escolhido.
- Movimento reduzido é independente da pausa manual: apresenta o estado final,
  mantém a experiência estática e identifica o controle como **Movimento
  reduzido**. A preferência é acompanhada ao vivo; desativá-la preserva a
  escolha de pausa manual que existia antes.

## Composição

Cores, fontes, etapas, perguntas e integração com os modos do capítulo foram
preservadas. Até 1023 px, a casca reserva 88 px mais a área segura abaixo dos
controles, para a barra fixa do aplicativo. A molécula mantém seu centro.
A altura mínima passa a 812 px no celular e 908 px no tablet, acrescida da
área segura; acima de 1023 px continua em 820 px. No modo foco, sem barra
sobreposta, a reserva adicional é retirada. Botões também têm margem de
rolagem para permanecer alcançáveis ao navegar por teclado.

## Conferência

`node scripts/verify-pcr-immersion.mjs` valida a página real em 360×800,
390×844, 834×1112 e 1366×900. Para outro servidor, definir `CRIVO_URL`.

O roteiro percorre previsões certas e erradas, síntese completa, mudança de
cenário com detalhe aberto, duas tintas e saída para Testar. Na animação normal,
compara capturas reais do canvas antes e depois de uma espera durante a pausa:
os quadros precisam ser idênticos. Depois verifica a conclusão da síntese e a
mudança de etiqueta. Também altera a preferência de movimento ao vivo.

Os centros dos botões do trilho e rodapé são conferidos com `elementFromPoint`
com o fim da cena na área útil da tela, para detectar cobertura pela barra
fixa. As quatro larguras não tiveram estouro horizontal, erros de execução ou
respostas HTTP de erro na sessão local. Medições em
[browser-results.json](browser-results.json).

Capturas da página com o detalhe aberto e zoom de inspeção:

- [Celular, caderno](mobile-390-caderno.png)
- [Celular, noite](mobile-390-noite.png)
- [iPad, caderno](ipad-caderno.png)
- [iPad, noite](ipad-noite.png)

Os testes unitários cobrem a unidade de comparação, o detalhe contextual,
a identificação da fita pronta em movimento reduzido, a visibilidade das bases
e a conservação do progresso ao pausar.

Esta revisão complementa a especificação proposta na PR #441, ainda aberta
quando o trabalho começou. Ela não altera aquela branch nem duplica os ajustes
ali propostos para comentários e tamanho das ferramentas.

Verificação final:

- `npm run lint`: passou.
- `npm test`: 1.393 testes de servidor passaram, um ignorado; 276 arquivos de
  interface e 3.479 testes passaram.
- `npm run build`: passou, com o aviso de tamanho dos chunks.
- `npx vitest run src/views/visual-immersive`: 18 testes passaram.
- `node scripts/verify-pcr-immersion.mjs`: passou nas quatro larguras.

A suíte geral emitiu avisos do ambiente para cache de fontes e `scrollTo` no
jsdom, sem falhas de teste. A conferência da página real não registrou erros
de execução ou respostas HTTP de erro.
