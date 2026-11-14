# Geometria molecular em Canvas 2D — conferência de 14/11/2026

A cena de geometria molecular foi refeita seguindo a referência de
biotecnologia/PCR escolhida pela Ana Júlia: Canvas 2D com projeção de volume,
esferas, leitura por etapas e as tintas caderno/noite. A mudança abrange somente
`summary-quimica-geometria-molecular`; a expansão para outros capítulos não faz
parte desta entrega.

## O que a cena mostra

| Etapa | Leitura | Relação explicada |
| --- | --- | --- |
| Linear | 180° | Duas nuvens do CO₂ ficam em lados opostos |
| Trigonal | 120° | Três nuvens do BF₃ dividem um plano |
| Tetraedro | 109,5° | Quatro nuvens do CH₄ ocupam o espaço |
| Pirâmide | 107° | O par livre do NH₃ comprime as ligações |
| Polar | 104,5° / μ = 0 | H₂O polar e CO₂ apolar: soma dos dipolos |

Ângulos, moléculas e polaridade continuam derivados de
`src/lib/geometriaMolecular.ts` e `vseprStages.ts`. O desenho específico fica em
`vseprCanvas.ts`, reaproveitando `useImmersiveCanvas`, `ImmersiveShell`, sprites,
fundo e etiqueta compartilhados com as cenas 2D. Nenhum contexto WebGL é
solicitado nesta rota. O estúdio do Hoje permanece como no `main`.

## Composição e correções verificadas

A revisão independente encontrou dois defeitos na primeira versão da troca:

- O palco empilhava título, leitura, molécula, etiqueta e descrição. A cena
  inicial tinha 1.055 px no celular de 390 px e 1.246 px no desktop de 1366 px.
  O novo enquadramento usa a faixa lateral no desktop/tablet e a área livre
  no celular, com descrições e previsões curtas. A etiqueta aproveita o espaço
  anterior ao texto, em vez de criar uma faixa vazia adicional.
- Ligações dianteiras atravessavam os símbolos químicos. Os segmentos agora
  terminam na superfície projetada das esferas, considerando inclusive as
  pontas arredondadas, e os símbolos são pintados por último.

A segunda revisão na produção não encontrou desvio pendente nesses pontos.
Alturas iniciais medidas em `responsive-measures.json`:

| Janela | Altura da cena |
| --- | ---: |
| 360 px | 895 px |
| 390 px | 877 px |
| 768 px | 891 px |
| 1366 px | 820 px |

Na referência PCR, a cena tem 812 px na janela de 390 px. Abrir detalhes pode
acrescentar altura para preservar o objeto e a legibilidade, sem comprimir o
desenho ou cobrir controles.

## Conferência em navegador

`scripts/verify-molecule-immersion.mjs` foi executado contra o build de
produção, com Chromium instalado no executor. Resultado bruto em
`browser-results.json` e capturas nesta pasta.

Foram conferidas 12 combinações: 360×800, 390×844, 834×1112 e 1366×900,
cada uma em claro, escuro e claro com movimento reduzido.

Em todas elas:

- um canvas na cena, solicitações de contexto somente `2d`;
- cinco desenhos distintos, com câmera e fundo congelados para a comparação;
- leituras 180°, 120°, 109,5°, 107° e 104,5°, e CO₂ com μ = 0;
- giro por botão e arraste, aproximação e inspeção funcionais;
- previsão incorreta acompanhada da explicação e mudança de etapa;
- quadro preservado com pausa ou movimento reduzido;
- ausência de sobreposição entre ferramentas, etiqueta, título, leitura,
  descrição e previsão, inclusive após abrir detalhes;
- ausência de estouro horizontal e trilho/rodapé alcançáveis com a navegação
  fixa do aplicativo presente;
- câmera alcançada com Tab e foco visível; ferramentas de 44×44 px;
- fluxo existente até o desafio real: Continuar na leitura → última etapa da
  leitura → Testar o que aprendi;
- nenhum erro de execução ou de carregamento de recurso não relacionado à API.

O callback opcional `onPractice` também tem teste de componente. A integração
atual das cenas, incluindo PCR, usa a saída pela leitura; este PR preserva esse
fluxo.

## Medições complementares de acesso

Os probes `core` e `focus` da skill `ux-ui-audit`, quando disponibilizados ao
roteiro por `CRIVO_UX_PROBES`, registraram nomeação dos controles, tamanho,
estouro e contraste de foco após Tab real. O foco medido tem 2 px, com razão
3,11:1 no caderno e 9,23:1 na noite.

Não houve falha de contraste classificada como certa pelo probe. Fundos com
gradiente foram marcados como indeterminados, portanto isso não certifica
contraste de todos os textos. Entre esses alertas estão os numerais pequenos
das etapas, com estimativa de 3,55:1 sobre a cor do papel, herdados da folha de
estilo compartilhada com PCR. Não se declara conformidade WCAG completa.

## Capturas

- [Celular: tetraedro](celular-claro-etapa-3.png)
- [Desktop: tetraedro](desktop-claro-etapa-3.png)
- [Celular: comparação com CO₂](celular-escuro-co2.png)

Capturas de uma região mais alta que a janela podem incluir a navegação fixa do
aplicativo no meio da imagem. O alcance dos controles foi medido com a região
rolada até eles, separadamente das capturas.

## Testes de código

`npm run lint`, `npm run build` e `npm test` concluíram com sucesso nesta
branch: 1.401 testes de servidor/bibliotecas e 3.527 testes de interface em
281 arquivos, sem falhas ou skips. Os testes de PDF usaram Chromium real.
O teste das pontas arredondadas das ligações falhou antes da correção e passou
depois dela; há cobertura também para projeção, enquadramento, pares livres,
dipolos e o callback opcional de prática.

## Limites

- Sem teste em iPad físico ou Safari: fluidez, aquecimento e bateria exigem o
  aparelho real.
- Os fundos aurora/grade não receberam conferência específica.
- A revisão visual e os testes não substituem a aprovação editorial da Ana Júlia.
