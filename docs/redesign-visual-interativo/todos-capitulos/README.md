# Aplicação visual a todos os capítulos

A camada editorial e as ferramentas de exploração chegam aos 613 capítulos das 14 matérias. Cada capítulo conserva seu artefato próprio e suas medidas, relações, citações e evidências. Não foram criadas cenas genéricas para substituir os mecanismos existentes.

## O que muda em todos os capítulos

- Moldura de exploração com ícone de objeto por assunto e modo “Explorar em foco”. A ampliação mantém a mesma instância da cena: medidas e casos selecionados não são reiniciados.
- No foco, o fundo fica inativo, a rolagem é isolada e o teclado permanece dentro da cena. Escape e o botão de saída restauram a interface e o foco.
- Materiais em papel, vidro e metal com cores legíveis no claro e no escuro. Os objetos esféricos e as figuras do kit compartilhado ganham luz e volume; gráficos e diagramas mantêm sua geometria.
- Ícones de navegação específicos para ondas, circuitos, termometria, átomos, DNA, plantas, globo, História, Filosofia, Sociologia e Linguagens, além dos sólidos de Matemática. Eles identificam assuntos; não representam domínio ou diagnóstico.
- O mapa expansível e a leitura guiada têm identificadores distintos ao trocar de capítulo. Isso corrige a permanência do mapa anterior causada por chaves iguais entre componentes irmãos.

As vistas espaciais giráveis de sólidos, moléculas e DNA das entregas anteriores continuam disponíveis. Esta entrega aplica a composição e as ferramentas a todo o currículo; não declara 613 simulações 3D novas nem aprovação pedagógica individual dos artefatos.

Os controles com descrições extensas passam a reservar uma linha para a explicação, sem comprimi-la entre o rótulo e o valor. O modelo espacial também está disponível no capítulo de Geometria Molecular, junto dos diagramas de suas sete geometrias.

## Inventário

| Matéria | Capítulos | Artefatos preservados |
| --- | ---: | --- |
| Matemática | 83 | experiment: 1 · instrument: 71 · board: 11 |
| Física | 85 | board: 14 · instrument: 63 · scene: 8 |
| Química | 48 | board: 7 · scene: 18 · instrument: 23 |
| Biologia | 72 | experiment: 1 · scene: 34 · board: 10 · instrument: 27 |
| Atualidades | 1 | instrument: 1 |
| Geografia | 63 | experiment: 1 · scene: 58 · instrument: 4 |
| História | 49 | scene: 45 · instrument: 3 · board: 1 |
| Língua Inglesa | 17 | instrument: 17 |
| Redação | 58 | instrument: 57 · experiment: 1 |
| Gramática | 26 | instrument: 25 · experiment: 1 |
| Literatura | 37 | instrument: 36 · experiment: 1 |
| Entendimento de Texto | 12 | instrument: 12 |
| Filosofia | 35 | experiment: 1 · scene: 16 · instrument: 18 |
| Sociologia | 27 | scene: 8 · instrument: 18 · experiment: 1 |

A correspondência exata entre capítulo, artefato primário e ícone está em [inventario.json](inventario.json). A contagem mede cobertura, não aprovação editorial.

## Verificação

A revisão funcional abre cada capítulo no navegador em 1440 e 390 pixels, verifica o artefato esperado, o mapa completo, a ausência de vazamento horizontal e a conservação da mesma cena ao entrar e sair do foco. Uma revisão por matéria também cobre Testar, Reconstruir, teclado e temas claro/escuro.

Os relatórios finais e as capturas acompanham a PR. A continuidade registra os limites e o estado de cada verificação.

Resultado da varredura: **613 de 613 capítulos aprovados nas verificações funcionais**, em duas larguras de tela (1.226 verificações), com zero falhas finais. A mesma cena permanece no DOM ao entrar e sair do foco. Detalhes por capítulo em [verificacao-613-capitulos.json](verificacao-613-capitulos.json).

As 14 matérias passaram na revisão dos modos de estudo e da navegação por teclado. Foram realizadas 28 checagens automatizadas de acessibilidade, com zero violações encontradas no escopo da aba Visual, nos temas claro e escuro. Ver [acessibilidade-14-materias.json](acessibilidade-14-materias.json). Essa amostragem de temas e acessibilidade é por matéria; não é uma certificação individual de acessibilidade dos 613 capítulos.

## Capturas por matéria

[Física](capturas/fisica.png) · [Atualidades](capturas/atualidades.png) · [Biologia](capturas/biologia.png) · [Geografia](capturas/geografia.png) · [História](capturas/historia.png) · [Língua Inglesa](capturas/lingua-inglesa.png) · [Redação](capturas/redacao.png) · [Gramática](capturas/gramatica.png) · [Literatura](capturas/literatura.png) · [Entendimento de Texto](capturas/entendimento-de-texto.png) · [Matemática](capturas/matematica.png) · [Química](capturas/quimica.png) · [Filosofia](capturas/filosofia.png) · [Sociologia](capturas/sociologia.png)

Também disponível: [Língua Inglesa no celular](capturas/lingua-inglesa-mobile.png).

Validação do projeto: `npm run lint`, `npm test` e `npm run build` aprovados. A suíte passou com **2.337 testes** (938 de servidor/dados e 1.399 de componentes, em 183 arquivos). O build mantém o aviso de tamanho de alguns chunks; não impede a compilação.
