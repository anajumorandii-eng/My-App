# Lote de Redação e Leitura — conferência e análise (27/09/2026)

Este documento é o registro exigido pela regra de entrega do padrão visual
(`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`). A auditoria de origem é a
`34-auditoria-geral-redacao-leitura.md`.

As capturas estão em `screenshots/lote-redacao-leitura-2026-09-27/`:

- `redacao-mecanismos/`: os três estados das 11 fichas;
- `leitura/`: os dois estados dos 11 capítulos;
- `redacao-dominios/`: os 16 capítulos de recorte e repertório.

A aprovação editorial de cada prancha é da Ana Júlia. Este documento é a
conferência técnica.

## Lote 1 — onze fichas com a cena errada

Onze fichas caíam na cena `theme`, que desenha "EIXO amplo → delimitar →
TESE focada" com a legenda fixa "fator → consequência → posição". Essa cena
descreve recorte de tema, e nenhuma das onze trata disso.

Agora cada ficha desenha o próprio mecanismo nos três estados da oficina: o
defeito, a correção e o vínculo conferido (`WritingMechanismScenes.tsx`). Os
textos curtos vêm dos exemplos do próprio `writingInstrumentLab.ts`.

| Ficha | O que a cena mostra |
| --- | --- |
| Coerência interna | Causa → consequência → resposta. No salto, "desigualdade" vai direto para "campanha" e a consequência fica vazia. |
| Quase-lógica | Dois casos que parecem iguais. A condição decisiva difere (≟) até o critério comum ficar à vista (=). |
| Concessão | Gangorra: sem retorno, a objeção é o único peso e o lado dela desce; com o "mas", o peso volta para a tese. |
| Refutação | "ESTÁ ERRADO" carimbado sem razão, contra a rachadura na premissa com o critério que a derruba. |
| Clareza | Um período com quatro encaixes e termos vagos, contra duas unidades sujeito → relação → complemento. |
| Intervenção (4 fichas) | Agente → ação → meio → finalidade. É a mesma estrutura de propósito, porque o objeto é o mesmo; muda o elemento que quebra: o agente abstrato, o meio ausente, a ação que não responde à causa, o meio que sai do limite da dignidade. |
| Direitos individuais | "Liberdade" solta, contra o titular protegido por uma garantia da interferência arbitrária. |
| Direitos sociais | O grupo alcançado sem quem assegure o direito, contra prestação pública + participação. |

A gangorra saiu primeiro com a inclinação trocada: o lado vazio descia. Agora
desce o lado que tem peso.

## Lote 2 — legendas que cortavam

- "um recorte por vez, com profundidade" saía "profundida" no quadro de 320.
- "repertório só vale quando vira prova" encostava na borda.

As duas foram quebradas em duas linhas. As caixas novas quebram o texto por
palavra na própria largura (`sceneKit.tsx`).

## Lote 3 — Leitura com objeto próprio

Os 11 capítulos tinham rótulos certos, mas dividiam três formas genéricas:
fileira de caixas, degraus e caixa com círculo. Cada um passou a desenhar o
objeto de leitura (`ReadingMechanismScenes.tsx`).

| Capítulo | Objeto |
| --- | --- |
| Os dois níveis da leitura | Página com a pista localizada pela lupa, contra duas pistas que convergem numa inferência fora do texto. |
| Intertextualidade | Texto A e texto B; a citação passa reconhecível, a paródia volta deslocada. |
| Gêneros textuais | Notícia (manchete, colunas, fonte) e artigo de opinião (uma voz, a tese). |
| Gêneros narrativos | A cena: narrador-personagem dentro ("eu"), observador de fora ("ele", "ela"). |
| Não verbais | O quadro: destaque por centro, cor e escala; ausência pelo corte. |
| Funções da linguagem | Emissor → mensagem → destinatário e o referente; acende o polo da função em foco. |
| Função poética | Versos em blocos: o mesmo som volta; a palavra fora do lugar previsto. |
| Figuras | Metáfora como qualidade que atravessa de um campo a outro; ironia como o dito contra a situação. |
| Distorções | A projeção, o que "eu já achava", sem evidência; contra a hipótese que volta às marcas do texto. |
| Textos cômicos | Tira em três quadros: a regra se arma, a virada desloca. |
| TDIC | A ferramenta sozinha, contra a ferramenta ligada a uso, acesso, trabalho e poder. |

## Lote 4 — domínio visível em recorte e repertório

Recorte de tema e lente de repertório são o mesmo mecanismo em oito
domínios, e a régua permite objeto compartilhado. Mas nada na cena dizia de
que domínio se tratava. Os 16 capítulos ganharam um ícone do domínio entre as
duas caixas: ambiente, trabalho, abstrato, corpo, violência, cidadania,
cultura e mídia.

## Como foi conferido

- **Cursor:** percorrido de ponta a ponta em todos os capítulos tocados (11 +
  11 + 16), em 1440 claro e 390 escuro, medindo texto sobre texto e texto fora
  do quadro.
  - Achados na medição, todos corrigidos: exemplos longos em caixas estreitas
    e legendas que saíam pela direita.
  - Achados só na captura, porque a medição não compara texto com forma, todos
    corrigidos:
    - caixas da clareza encostadas, com as setas escondidas;
    - "grupo alcançado" saindo da caixa;
    - o meio deslocado caindo sobre o rodapé;
    - o rótulo "centro, cor, escala" transbordando o círculo.
- **Teste novo** (`WritingReadingScenes.test.tsx`):
  - nenhuma das onze fichas volta a desenhar "delimitar";
  - nenhum desenho se repete entre capítulos;
  - o defeito e a correção são desenhos diferentes.
- **Varredura:** Redação, Entendimento de Texto e Atualidades (fim deste
  documento).

## Pendente

- **Levar o `TopicExperiment` para dentro do `BoardShell`** (lote 5). Ele
  atende `argument` e `cohesion` neste grupo e mais 9 capítulos fora dele.
  Isso é decisão de arquitetura: o `experiment` deixaria de ser uma
  representação separada. Precisa da Ana Júlia antes.
- **Cena `prompt`** (2 capítulos): a auditoria a chamou de "o desenho mais
  pobre do lote", sem erro de conteúdo.
- Aprovação editorial de todas as cenas acima.
