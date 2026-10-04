# Entrega C — 24 pranchas de Filosofia e Sociologia

Base: `120c7b9dfb6d22e71bf3d499b60319ae57c81d62`, após a integração da Entrega B em #256 e a correção de contraste de #257. Escopo: H1, 16 capítulos de Filosofia e oito de Sociologia. [Manifesto dos 24 IDs](manifest.json) · [Galeria](GALERIA.md) · [Evidência do navegador](browser-evidence.json).

## O que mudou

Os dois pilares genéricos deram lugar a situações próprias: a experiência de uma xícara em Kant, cópias e Forma em Platão, relógios sem transmissão causal em Leibniz, comparação de currículos diante de uma barreira institucional e especialização numa padaria. Cada desenho contém objeto, operação, relações e consequências, com anotação manuscrita e limites das analogias explícitos. A escolha acompanha uma relação por cor e traço; todas as outras posições continuam legíveis, sem associar altura a mérito.

O estado inicial mostra o mecanismo inteiro. Botões nativos permitem selecionar e reverter o foco, consultar o lastro literal e percorrer o desenho largo por teclado. A política existente de movimento reduzido é respeitada. A composição nova é vinculada exclusivamente aos 24 IDs: o fallback das demais matérias, `BoardShell`, chaves de persistência e histórico de tentativas permanecem no contrato atual.

## Conteúdo e revisão

Os oito resumos de Sociologia receberam 40 seções originais, de 981 a 1.097 caracteres, com seis armadilhas corrigidas e dois problemas resolvidos por capítulo, na revisão 2. A recuperação sobre abolição foi qualificada: perguntar por desigualdade não eliminada não equivale a negar toda mudança histórica. Os 18 trechos de lastro foram vinculados literalmente aos novos textos.

Dois defeitos concretos de Filosofia foram corrigidos com revisão 3 isolada: a imparcialidade em Rawls não legitima qualquer distribuição; em Kant, causalidade distingue ordem objetiva de mera sequência de percepções. As formas da sensibilidade e as categorias do entendimento aparecem separadas no desenho. Os outros 602 registros editoriais foram preservados integralmente, incluindo os 14 demais textos filosóficos H1.

A revisão independente do conjunto encontrou dois pontos importantes e dois menores; todos foram corrigidos num único passe. Além dos dois pontos acima, foram retiradas pontas manuais redundantes das setas de Sociologia e delimitado o alcance da Lei 10.639/2003 ao ensino fundamental e médio, público e privado. Regressões dos mecanismos e das duas correções conceituais foram observadas falhar antes da implementação e passaram depois.

## Verificação visual

A matriz de produção percorreu os 24 capítulos em 390/834/1366 px, claro/escuro e movimento normal/reduzido: **12 configurações, 1.656 estados SVG e 48 aberturas de Testar/Reconstruir**. Verificou estado inicial, cada posição, reversão, seleção por teclado, página contida, rolagem interna, fonte mínima efetiva de 11 px, limites e colisões de glifos. Não houve erro de execução, rótulo cortado, colisão ou fonte abaixo do mínimo nos estados verificados.

A primeira conferência detectou a regra global que substituía Kalam e o rótulo “resultado a investigar” fora da área SVG. A fonte foi preservada por regra específica; o rótulo foi quebrado em duas linhas sem reduzir seu tamanho. As falhas iniciais estão registradas na evidência consolidada. A legenda de mais-valia foi ajustada para declarar uma escala horária comum, sem depender de pixels físicos; seu capítulo foi reconferido nas 12 configurações após esse ajuste.

As capturas da galeria ocultam apenas as barras fixas da interface. O celular preserva o desenho largo em uma janela de rolagem indicada; essa rolagem foi exercitada por teclado. A escala efetiva das barras de mais-valia é medida em duas larguras e dois temas: jornada absoluta 10/8 da base, tempo necessário relativo 2/4 e jornada relativa igual à base.

## Verificação final

TypeScript e build passaram. A suíte integral final passou em **885 testes Node + 1.031 Vitest (1.916)**, com 159 arquivos de interface e nenhuma falha. Testes, compilação e navegador foram executados em sequência. As matrizes visual e de qualidade passaram em 13 e quatro verificações, respectivamente.

Foram inspecionadas 96 capturas finais dos 24 capítulos; 36 imagens acompanham a [galeria](GALERIA.md). A repetição final de mais-valia passou em mais 72 estados nas 12 configurações.

A fila validada mantém 613 IDs: **117 achados tratados, 181 pendentes e 315 mecanismos preservados**, distribuídos em dez lotes restantes. Dos 612 resumos aprofundados, 470 estão na revisão 2, dois na revisão 3 e 140 ainda precisam de aprofundamento. As duas revisões 3 corrigem falhas concretas em Kant e Rawls; os demais textos filosóficos foram preservados.

## Limites do registro

A evidência corresponde a Chromium e fixtures locais. Safari/iPad físico e fluxos autenticados não foram certificados. O tratamento dos achados H1 não altera os vereditos da auditoria histórica nem promove aprovação editorial formal.
