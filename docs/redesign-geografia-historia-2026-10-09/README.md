# Geografia e História — redesenho da experiência visual

A entrega retoma o checkpoint da PR #288, na mesma conta e a pedido da usuária. Abrange a apresentação de 63 capítulos de Geografia e 49 de História. Preserva os mapas, perfis, processos e cenas autorais de cada capítulo e adiciona comparação entre recortes, fontes recolhíveis e acesso direto ao diagnóstico.

## O que mudou

- Objetos de navegação em relevo com gradientes: terreno, mapa, chuva, rio, cidade, rede, cultivo, energia, navio, fábrica, documento, fortificação e urna. A escolha considera o assunto. Rotação/fusos usam globo; República da Espada usa fortificação; Estado Novo usa documento, evitando sugerir uma urna eleitoral.
- Apresentação de Humanas com hierarquia, cartões e espaçamento adaptados da referência Notion do Design & Motion Kit. As cores, os fundos e o sistema tipográfico ativo do Crivo são preservados. Os ícones são orientação, não substitutos da representação do fenômeno.
- Nas cenas do componente `HistoriaGeografia`, os recortes aparecem antes da figura. A comparação permite escolher A/B diferentes, ler suas afirmações e alternar uma única prancha entre eles. Não duplica SVGs nem apresenta a ordem de seleção como cronologia ou causalidade.
- Fontes de cada recorte podem ser abertas junto à afirmação. São os mesmos trechos e seções já vinculados ao capítulo.
- O percurso de conceitos é recolhível e aparece somente em Explorar. Selecionar usa os mesmos IDs, estados e callbacks do diagnóstico existente; não grava aprendizado por clique. O recolhimento evita repetir toda a informação do mapa na abertura.
- Selecionar um conceito dentro do modo foco sai da ampliação antes de abrir o inspetor. A figura permanece montada, com seus controles preservados; o painel não fica preso fora do diálogo inerte.
- A grade de recortes no celular aceita rótulos longos sem aumentar a largura da página. O pan permanece dentro da prancha para manter as anotações legíveis.

## Alcance e limites

Este redesenho modifica a apresentação e as interações dos artefatos existentes. Não é a criação de 112 simulações novas, nem uma reescrita integral do conteúdo das matérias. A cobertura real da comparação, por ID, está no registro de navegador: ela é oferecida nas cenas atendidas pelo componente correspondente, não nos instrumentos/experimentos com mecanismos próprios.

A revisão funcional não promove aprovação no inventário pedagógico formal e não encerra pendências editoriais históricas. Nenhum merge ou publicação no site é automático.

## Validação

- [Registro individual dos 112 capítulos](registro-112-capitulos.json): 224 verificações capítulo/tema, com 448 configurações de largura/tema e abertura/saída de foco. Claro: 1.440 e 360 px. Escuro: 834 e 390 px. Zero falhas finais. Uma navegação que excedeu o prazo foi repetida nos dois temas com abertura direta e passou.
- Comparação A/B em 103 cenas, com 748 seleções de recorte e 542 opções B exercitadas nos dois temas. Os nove demais capítulos preservam seu experimento, prancha ou instrumento específico.
- Todos os 112 percursos foram conferidos: quantidade/IDs de conceitos, seleção por teclado, estado inicial sem promoção e ausência do percurso em Testar/Reconstruir. Testar também oculta a prancha.
- [Casos de acessibilidade e movimento](acessibilidade-e-movimento.json): 12 capítulos representativos, três larguras e dois temas, 72 estados. Claro com movimento reduzido e escuro com movimento normal. Seleção de conceito a partir do foco, ciclo de Tab/Shift+Tab, Escape e fontes conferidos. 24 checagens axe sem violações; nenhum erro de execução/console ou recurso essencial com falha registrado nesses casos.
- Após o ajuste final dos rótulos, [os 112 layouts no celular](layouts-celular-final.json) foram novamente conferidos a 360 px no tema escuro, sem transbordamento e com alvos de recorte de pelo menos 44 px. As medidas são feitas após estabilizar a mudança de largura.
- [Galeria e rede](rede-e-galeria.json): 12 capturas de abertura; nenhum erro de página ou resposta HTTP com falha para documento, script ou stylesheet.
- Testes direcionados: 46 testes em quatro arquivos, aprovados. Suíte completa: 2.349 testes aprovados (943 de modelos/servidor e 1.406 de interface em 184 arquivos). Lint/verificação de tipos e build de produção aprovados.

O checkpoint anterior e seu ZIP permanecem históricos em `docs/continuidade-geografia-historia-2026-10-09/`.

## Novas telas

As capturas mostram o modo foco. No celular, a prancha mantém pan interno para que as anotações não precisem ser reduzidas a letras ilegíveis.

| Capítulo | Computador | Celular escuro |
| --- | --- | --- |
| Relevo Brasileiro | [Abrir](capturas/gallery-summary-geografia-relevo-brasileiro-light.png) | [Abrir](capturas/gallery-summary-geografia-relevo-brasileiro-dark.png) |
| Dinâmica Climática | [Abrir](capturas/gallery-summary-geografia-dinamica-climatica-light.png) | [Abrir](capturas/gallery-summary-geografia-dinamica-climatica-dark.png) |
| Cartografia Digital | [Abrir](capturas/gallery-summary-geografia-cartografia-digital-light.png) | [Abrir](capturas/gallery-summary-geografia-cartografia-digital-dark.png) |
| Revolução Francesa | [Abrir](capturas/gallery-summary-historia-revolucao-francesa-light.png) | [Abrir](capturas/gallery-summary-historia-revolucao-francesa-dark.png) |
| Guerra Fria | [Abrir](capturas/gallery-summary-historia-guerra-fria-light.png) | [Abrir](capturas/gallery-summary-historia-guerra-fria-dark.png) |
| Antiguidade Clássica: o Mundo Romano | [Abrir](capturas/gallery-summary-historia-antiguidade-classica-o-mundo-romano-light.png) | [Abrir](capturas/gallery-summary-historia-antiguidade-classica-o-mundo-romano-dark.png) |

As [demais capturas](capturas/) documentam comparação, fontes e controles dos 12 casos de acessibilidade.
