# Ciências: cenas com profundidade

Depois da integração dos mapas e dos sólidos de Matemática, esta entrega refina três cenas específicas, na ordem Física → Química → Biologia. A linguagem continua em papel editorial, vinho, vidro e metal, com SVG responsivo e controles acessíveis. Não há dependência nova nem animação ornamental contínua.

## Física — transformação adiabática

O cilindro ganha paredes com isolamento visível, boca elíptica, base metálica, vidro translúcido e partículas esféricas. Selecionar expansão ou compressão continua movimentando placa, haste e punho como uma peça única. A transformação mantém Q = 0 e as leituras existentes da primeira lei. Os materiais usam IDs por instância para evitar referências cruzadas entre SVGs.

## Química — polaridade das ligações e moléculas

Um modelo espacial permite escolher CO₂, BF₃, CH₄, NH₃ e H₂O e girar a vista por controle de teclado ou toque. As direções, os ângulos, os pares livres e a soma vetorial vêm do módulo de geometria molecular existente. A rotação não muda a geometria nem a polaridade. As ligações terminam na superfície dos átomos; regiões eletrônicas de pares livres são diferenciadas e explicadas.

O diagrama original de ligações e dipolos permanece disponível abaixo do modelo, junto com os conceitos e citações do resumo. A soma representa ligações equivalentes de ligantes iguais, não um cálculo de momento em debye. As esferas não representam raios atômicos em escala.

## Biologia — ácidos nucleicos

A vista “Dupla-hélice 3D” permite girar o DNA com botões e reutiliza o mesmo seletor de bases de “Pareamento”. Alternar as vistas conserva a base, o DNA complementar, o RNA transcrito e as pontes de hidrogênio. O modelo de DNA-B usa aproximadamente dez pares por volta, explicita que a sequência é ilustrativa e destaca o par escolhido. O desenho anotado de pareamento continua disponível para ler DNA e RNA lado a lado.

## Verificação e limite da entrega

Os testes específicos verificam a invariância da geometria e da polaridade sob rotação, a preservação da base entre vistas e a independência dos materiais do pistão. A revisão no navegador inclui controles, temas, movimento reduzido, console e larguras de 390, 834 e 1440 pixels. Os resultados finais de lint, suíte completa, build e acessibilidade constam da PR e do relatório desta pasta.

Esta entrega melhora três cenas, preservando o restante dos artefatos. Não promove aprovação pedagógica formal por contagem de testes.

[Capturas](capturas/) · [Continuidade](CONTINUIDADE.json)

Resultado: lint e build de produção aprovados, 2.334 testes aprovados e nenhuma violação nas seis checagens automatizadas de acessibilidade (três capítulos × dois temas), no escopo da aba Visual. Relatórios: [verificação](verificacao.json) e [acessibilidade](acessibilidade.json).

[Desktop: Física](capturas/fisica.png) · [Química](capturas/quimica.png) · [Biologia](capturas/biologia.png)

[Celular: Física](capturas/fisica-celular.png) · [Química](capturas/quimica-celular.png) · [Biologia](capturas/biologia-celular.png) · [Tema escuro](capturas/biologia-escuro.png)
