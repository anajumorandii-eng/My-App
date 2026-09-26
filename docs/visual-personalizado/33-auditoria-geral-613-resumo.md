# Auditoria geral dos 613 capítulos da aba Visual

Data: 26/09/2026. Depois de fechar História e Geografia (112 capítulos: 110 já com cena autoral redesenhada, 2 só ajustados — Coordenadas Geográficas e Independência), sete agentes auditaram em paralelo os 501 capítulos restantes, um grupo por matéria ou par de matérias afins. Mesma régua aprovada em 25/09 (cena própria, relação central nomeada, fiel ao resumo, movimento que explica, nada emprestado, três modos intactos, conferência no navegador). Nada em `src/` foi alterado nesta rodada — só leitura de código, captura no navegador e relatório. Os sete relatórios completos estão nos documentos 34 a 40 deste diretório; capturas em `screenshots/auditoria-geral-2026-09-26/<grupo>/`.

## Resultado, por grupo

| Grupo | Capítulos | Manter | Ajustar | Redesenhar | Doc |
| --- | ---: | ---: | ---: | ---: | --- |
| Redação, Entendimento de Texto, Atualidades | 71 | 25 | 35 | 11 | 34 |
| Gramática, Língua Inglesa, Literatura | 80 | 29 | 19 | 32 | 35 |
| Matemática | 83 | 71 | 5 | 7 | 36 |
| Física | 85 | 64 | 3 | 18 | 37 |
| Química | 48 | 22 | 19 | 7 | 38 |
| Biologia | 72 | 23 | 29 | 20 | 39 |
| Filosofia, Sociologia | 62 | 2 | 1 | 59 | 40 |
| **Total (sem História/Geografia)** | **501** | **236 (47%)** | **111 (22%)** | **154 (31%)** | |

Somando os 112 de História e Geografia (110 redesenhados, 2 ajustados, 0 pendentes), a aba Visual tem hoje 613 capítulos: 236 (38%) mantidos como estão, 113 (18%) classificados como ajustes e 264 (43%) classificados como redesenho. Os 110 redesenhos de História e Geografia já foram entregues; 154 dos demais seguem pendentes. Os totais são classificações da auditoria, não o estado atual de entrega.

Matemática é a matéria mais bem resolvida (71 de 83 mantêm). Filosofia e Sociologia é a mais crítica: só 2 dos 62 capítulos passam na régua como estão.

## Causa comum: motores genéricos que trocam só o texto

O mesmo padrão que a auditoria de História e Geografia identificou como o defeito mais grave (a mesma estrutura desenhada para capítulos diferentes) aparece em quase todo grupo, com peso desigual:

- **`Tipologia.tsx`, `CadeiaDeDerivacao.tsx`, `EscalaDeGraus.tsx`, `ContrasteDePosicoes.tsx`, `CamadasDeDeterminacao.tsx`, `MovimentoDialetico.tsx`, `CriteriosConjuntivos.tsx`, `GradeDeEixos.tsx`** (as oito famílias de cena "puras", sem instrumento por trás): atingem praticamente todos os 59 capítulos a redesenhar de Filosofia/Sociologia, 18 de Biologia e vários de Química. `Tipologia.tsx` não desenha nenhum SVG — é só uma grade de cartões de texto (achado da auditoria de Química, confirmado pela de Biologia).
- **Instrumentos com "diagrama por `config.diagram`"**: `ChemistryInstrument` (10 de 18 capítulos caem em 3 diagramas compartilhados), `WritingInstrument` (as 57 fichas de Redação por 5 cenas), `LiteraryTraitBoard` (22 capítulos) e `LiteraryAuthorBoard` (6), `DynamicsInstrument`, `OrbitalInstrument`, `VectorsInstrument` e `EnergyInstrument` em Física, `QuantitiesBoard` em Matemática (5 capítulos), `ReadingBoard` (11 capítulos, sem risco de conteúdo, só sem desenho).

## Defeitos que são bug, não só estética — corrigir antes de qualquer redesenho

Vários grupos acharam capítulos que abrem a **cena de outro capítulo**, ou mostram conteúdo **incoerente com o próprio resumo** — isso é regressão funcional, não falta de acabamento:

- **Matemática**: `mat-probabilidade-contagem` abre a prancha "Arranjo ou combinação" (falso casamento por palavra-chave "contagem"); `trigonometria-no-triangulo-retangulo` abre o círculo trigonométrico (raio 1, capítulo errado); três capítulos de `CartesianBoard` (Inversão de Funções, Estudo do Sinal, Transformações em Gráficos) mostram até o **título errado na tela**.
- **Física**: `OrbitalInstrument` renderiza a mesma cena, byte a byte, para 3 dos 4 capítulos que atende (gravitação, dinâmica circular, órbitas — nenhum mostra órbita real). `LensBoard` faz o mesmo entre "Lentes: Estudo Gráfico" e "Estudo Analítico das Lentes".
- **Biologia**: os ids `air-pollution` e `climate-pops` não têm `case` em `BiologyRemainingInstrument.tsx` e caem no `default` — telas idênticas para poluição do ar e aquecimento global.
- **Redação**: a cena "tema" do `WritingInstrument` mostra sempre o texto fixo "EIXO amplo/TESE focada", coerente só com 8 dos 19 capítulos que a usam; nos outros 11 (Coerência Interna, Refutação etc.) o mecanismo mostrado não é o do capítulo.
- **Literatura**: 4 dos 8 capítulos marcados como cena autoral no inventário de Literatura caem numa função genérica (`Landscape`) que desenha a mesma ilustração para pares de capítulos diferentes. Eles não integram a contagem de 39/288 pranchas de Biologia, Física, Química e Matemática no CLAUDE.md.
- **Filosofia**: Nietzsche e o Método Socrático usam a família `movimento-dialetico` (dois círculos que se fundem numa síntese, modelo hegeliano) para processos que **contradizem essa própria lógica** — a forma emprestada distorce o conteúdo, não só deixa de ilustrá-lo.

## Regressão ao anti-padrão do `.webp`

O CLAUDE.md documenta como corrigido o caso de cenas raster transparentes (`adiabatic-piston.webp`, `knowledge-landscape.webp`). A auditoria de Física achou que **voltou a acontecer**: `NewtonBoard` e `AdiabaticBoard` hoje renderizam `<img>`/`<motion.img>` de arquivos `*-atlas.webp` em vez de SVG. No caso do pistão, o SVG completo (`AdiabaticPiston`, com anotações) ainda existe no código, comentado — a correção é uma linha, trocar o que está sendo chamado.

## Capítulos sem nenhum desenho

- **Estática** (Física): zero elementos SVG, só três cartões de texto expansíveis com as condições de equilíbrio.
- Os capítulos em `Tipologia.tsx` (tabela periódica, radioatividade, composição da matéria, química inorgânica, combustíveis fósseis, efeitos coligativos, entre outros em Biologia e Filosofia/Sociologia): nenhum tem `<svg>`.

## Bugs de renderização com localização exata

- `GradeDeEixos.tsx:24` usa `viewBox="0 0 220 220"`, mas `.tc-label` (`TopicScene.css:78`) tem `font-size:18px` calibrado para os viewBoxes de 480 das outras famílias — o texto estoura, ilegível, em `summary-quimica-equilibrios-ionicos-ii` (achado de Química) e nos 2 capítulos de Filosofia/Sociologia que usam a família (achado independente do outro grupo).
- `ContrasteDePosicoes.tsx:25,35`: rótulos de três posições colidem e vazam do viewBox com nomes longos (reproduzido em capítulos de Filosofia e em "Evolução Biológica" de Biologia).
- `DynamicsInstrument.tsx:2` e `VectorsInstrument.tsx:2` cortam texto em `slice(0,180)` sem reticências, diferente dos outros 9 arquivos de instrumento (`slice(0,176)+'…'`) — corta palavras pela metade.
- Erros de console (`Expected length, "undefined"`) em elementos `motion.circle`/`rect`/`path` sem valor inicial — achado de forma independente em Química, Física e Biologia, sinal de um problema mais amplo em como vários instrumentos inicializam formas com framer-motion.

## Documentação do próprio projeto desatualizada

- CLAUDE.md, seção "Pranchas manipuláveis", lista como faltantes os instrumentos de plano analítico, figura plana, sólido, contagem/probabilidade, matriz e estatística — todos já existem (achado de Matemática, com linha exata em `visual-instruments/registry.ts`).
- O inventário de Literatura deve distinguir suas quatro cenas próprias dos quatro usos compartilhados de `Landscape`; a contagem 39/288 do CLAUDE.md é de outras matérias.

## O que está bem

- **Nenhuma invenção de conteúdo** foi encontrada por amostragem contra `deepSummaryContent.json` em nenhum dos sete grupos — o problema dominante é ausência de desenho ou desenho genérico, não fidelidade.
- Nenhum erro de página nem rolagem lateral a 390px nos 501 capítulos (varredura automática completa em cada grupo).
- Matemática e os instrumentos de Gramática/Inglês são o padrão a seguir: cena própria por capítulo, com defeitos pequenos e localizados.

## Próximos passos propostos

1. **Corrigir os bugs de conteúdo errado** (Matemática ×2, Física (Orbital, Lens), Biologia (2 casos), listados acima) — são baratos e prioritários porque a estudante vê o capítulo errado, não só uma cena feia.
2. **Reconectar o SVG do pistão adiabático** e decidir o destino da ilustração raster de Newton.
3. **Corrigir os bugs transversais de renderização** (fonte da `GradeDeEixos`, colisão da `ContrasteDePosicoes`, truncamento sem reticências) num PR pequeno — melhora vários capítulos de matérias diferentes de uma vez.
4. **Redesenhar em lotes por matéria.** A ordem de implementação foi ajustada a pedido da Ana Júlia: começar por Matemática (7 classificados para redesenho), que tem menos pendências; seguir com os demais grupos após verificação de cada lote. Filosofia/Sociologia (59) concentra a maior quantidade de cenas genéricas.
5. **Corrigir a documentação** (CLAUDE.md) nos dois pontos listados acima.

A aprovação editorial de cada capítulo continua sendo só da Ana Júlia — este documento é auditoria técnica, não aprovação.

## Correções posteriores à auditoria

- As regressões raster de Newton e do pistão adiabático foram corrigidas no PR #221.
- O registro deixou de atribuir a prancha de arranjos à introdução à probabilidade e o círculo unitário à trigonometria no triângulo retângulo. Na primeira etapa, ambos apareceram como lacunas explícitas. Agora receberam pranchas próprias: uma grade de pares ordenados com critério de divisor comum e um triângulo retângulo com razões entre lados. Ainda aguardam avaliação editorial; não são redesenhos aprovados.
- Poluição do ar e o capítulo sobre aquecimento global, POPs e biorremediação agora têm mecanismos visuais distintos no instrumento de Biologia. Ainda requerem avaliação editorial do capítulo completo.
- As classificações da tabela acima são a fotografia da auditoria por capítulo; não foram reduzidas automaticamente por essas correções pontuais.
