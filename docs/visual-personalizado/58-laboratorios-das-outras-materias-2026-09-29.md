# Laboratório para as doze matérias do Hoje (29/09/2026)

A Ana Júlia pediu: "Faça o laboratório dos outros". Até aqui só Física,
Biologia, Química e Matemática tinham cena no cartão do Hoje; as outras oito
abas mostravam o Núcleo do Crivo.

## O que cada matéria ganhou

A regra que valeu para as quatro primeiras continua: a cena mostra ciência de
verdade, e a conta mora num módulo puro, conferido no `node:test`. Nada foi
inventado para preencher a tela.

| Matéria | Laboratório | Módulo | O que o teste garante |
| --- | --- | --- | --- |
| História | Os períodos do Brasil em proporção, com o escolhido ampliado à frente | `periodosDoBrasil.ts` | Períodos contíguos; marcos dentro do período; Colônia acima de 50% |
| Geografia | Globo iluminado pelo Sol na data, com a cidade | `estacoesDoAno.ts` | 12 h nos equinócios e no Equador; Sol a pino em São Paulo em 21/12; dezembro e junho espelhados |
| Português | Frase em blocos, com a função de cada termo e o tipo de predicado | `analiseSintatica.ts` | Complementos coerentes com a transitividade; objeto indireto com preposição; termos recompõem a frase |
| Literatura | Verso em tipos móveis, uma sílaba poética por tipo | `escansao.ts` | Sílabas recompõem o verso letra a letra; última tônica é a última sílaba contada; metro certo |
| Redação | As cinco competências do ENEM como pilhas de folhas de 40 pontos | `competenciasEnem.ts` | 5 × 200 = 1.000; só níveis de 40; a C5 conta os elementos da intervenção |
| Filosofia | A caverna de Platão, com a sombra calculada | `caverna.ts` | Semelhança de triângulos: a sombra é D/d vezes o objeto |
| Sociologia | Dez colunas, uma por décimo da população, com a fatia da renda | `desigualdade.ts` | Fatias somam 1; o Gini da curva é o dobro da área, conferido por integração |
| Atualidades | Efeito estufa: CO₂ e forçamento radiativo | `efeitoEstufa.ts` | 0 no pré-industrial; 3,71 W/m² no dobro; cada dobro soma o mesmo |

Onde a cena simplifica, a própria tela avisa:

- **Sociologia:** as colunas seguem uma curva modelo com o Gini escolhido, não
  a repartição medida de um país. Por isso a cena não escreve porcentagem por
  décimo.
- **Atualidades:** temperatura só aparece no dobro, onde o IPCC dá uma faixa.
  O número de ondas de calor é esquema, e a medida está na leitura.
- **Geografia:** a conta é geométrica, sem a refração da atmosfera.
- **Redação:** é simulação, não a nota dela.

Os números de referência saem dos resumos do próprio app: Gini da Suécia
(0,28), dos EUA (0,41) e do Brasil (0,52), e CO₂ de 280 e 420 ppm.

## Por que não emprestar peças

Todas as cenas usam o mesmo estúdio (`estudio3d.ts`) e o mesmo renderizador
compartilhado da correção de travamento. Duas decisões vieram daí:

- **Nenhuma cena acrescenta luz.** A chama da caverna é um halo, não uma luz
  pontual. Uma luz a mais muda o conjunto de luzes e obriga o renderizador a
  recompilar os programas, que é o travamento na troca de aba recém-tirado.
- **Um gancho só, `usarCena`, monta e desmonta toda cena nova.** Montar,
  cair na reserva sem WebGL, seguir o tema e desmontar eram repetidos à mão em
  cada componente. Com doze cenas, uma divergência viraria defeito de uma
  matéria só.

Texto nas faces dos blocos (palavra, sílaba) é desenhado em canvas
(`faceDeTexto`), sem fundo, sobre a face iluminada. Com dez sílabas lado a lado
em rótulo HTML, os rótulos disputavam espaço.

## O que a conferência pegou

Todas as capturas foram feitas **clicando as abas do Hoje**, no claro e no
escuro, a 390 e a 1180 de largura. Em seguida, cada controle foi trocado e a
leitura comparada com o módulo. Estes defeitos passaram por lint e testes e só
apareceram na captura:

- **História:** "1500" aparecia duas vezes, e "hoje" encostava em "1808". Os
  rótulos das pontas da faixa de trás saíram; a nota explica a escala.
- **Literatura:** no celular, o tipo alto da fileira da frente ("ver") cobria
  a tônica de trás ("que‿ar"). Resolvido com as fileiras mais separadas e a
  câmera mais alta. Os rótulos "última tônica" e "não conta" desceram para a
  mesa, porque em cima caíam sobre a outra fileira.
- **Português e Literatura:** no celular a frase e o verso quebram em duas
  fileiras. O decassílabo quebra na 6ª sílaba, onde o heroico tem a cesura.
  Numa fileira só, a letra nos blocos ficava ilegível.
- **Redação:** com a espessura real, as pilhas eram baixas demais para
  distinguir 120 de 160. As folhas foram engrossadas, e os rótulos C1…C5, que
  ficavam atrás das pilhas, foram para a frente.
- **Sociologia:** "igualdade" colava em "10% mais pobres"; agora fica sobre o
  próprio traço. "perto do de Brasil" virou "perto do Gini do Brasil".

Leituras conferidas depois de trocar o controle:

| Laboratório | Controle | Leitura |
| --- | --- | --- |
| Geografia | Porto Alegre em 21/6 | 10 h 04 min de dia claro e Sol a 36,5° |
| Filosofia | Estátua a 1 m do fogo | Sombra de 3 m (×6) |
| Atualidades | CO₂ a 560 ppm | 3,71 W/m² |
| Redação | C2 em 200 | Total de 680 |

Capturas em `screenshots/laboratorios-2026-09-29/`.
