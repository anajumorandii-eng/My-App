# Auditoria atual da aba Visual e protocolo de paralelização

Data: 2026-09-19  
Base: `origin/main` em `7fbe518`

## Contrato

As cinco imagens de `referencias-aprovadas/`,
`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md` e a regra do Núcleo Instrumental
são vinculantes: matéria define universo e movimento; tópico define o artefato;
estado pedagógico define o comportamento. `contentAtlas`, `anchorScene`,
instrumento, prancha autoral e experimento são camadas diferentes e não podem
ser contabilizados como equivalentes.

## Cobertura observada

| Recorte | Capítulos | Mecanismo além do atlas | Só atlas/lacuna |
| --- | ---: | ---: | ---: |
| Física, Química, Biologia e Matemática | 288 | 124 | 164 |
| Humanidades e Linguagens | 325 | 136 | 189 |
| **Total** | **613** | **260** | **353** |

O total reúne sobreposições e maturidades distintas: 250 `anchorScene`, 11
experimentos e uma sobreposição observada. Não equivale a 260 pranchas
autorais. Em particular, as 127 cenas de Humanidades/Linguagens usam oito
componentes de família e não devem ser anunciadas como 127 pranchas específicas.

Fungos é uma correção prioritária: a família `tipologia` preserva o conteúdo,
mas não representa micélio, hifas, absorção e reprodução no nível exigido pelas
referências.

## Achados e decisão de fundação

1. `Visual` montava prancha, percurso, cena/experimento, cadeia e formulários
   como blocos concorrentes; Introdução à Ecologia tem experimento e cena.
2. `BoardShell` é útil para contraste, mas não pode ser o contrato universal.
3. `Visual.css` tem 2.136 linhas e overrides repetidos; expansões paralelas não
   devem editar a casca simultaneamente.
4. Tabs precisavam do contrato completo de teclado e o inspetor lateral não
   deveria se anunciar como diálogo modal no desktop.
5. Registros são eager; divisão/lazy loading permanece um próximo passo antes
   da expansão ampla.

A fundação define uma representação principal exclusiva por capítulo:
experimento de ID exato, prancha, instrumento, cena-âncora ou fallback. Isso
elimina a competição visual sem mascarar as lacunas de cobertura.

## Paralelização segura

### Etapa 1 — casca serial

Uma sessão é dona de `Visual.tsx`, `Visual.css`, `BoardShell`, `VisualJourney`,
`ConceptChain`, inspetor e registros. Ela fecha arbitragem e acessibilidade.

### Etapa 2 — padrões-ouro paralelos

- Física: adiabática e Newton.
- Ciências da Vida/Química: fotossíntese e modelos atômicos.
- Humanidades/Linguagens: Independência e Projeto de Texto.
- QA: referências, temas, breakpoints, teclado, redução de movimento, console,
  rede e capturas.

Cada sessão possui somente os componentes de suas pranchas; registros centrais
continuam com a integradora.

## Gate de entrega

Uma prancha só conta quando comprova fidelidade às cinco referências,
Explorar/Testar/Reconstruir no mesmo artefato, vínculo exclusivo ao capítulo,
temas claro e escuro, desktop e 360–390 px, teclado, alternativa ao arrastar,
movimento reduzido, foco, ausência de overflow e console/rede limpos.
