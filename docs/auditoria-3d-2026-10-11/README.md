# Auditoria dos 186 capítulos com modelo 3D — 11/10/2026

Critérios pedidos pela Ana Júlia: 3D integrado sem botão, movimento, interação que se possa mexer, imersivo. Roteiro `auditar.cjs` (Chromium, 1440 px, main `7b8b2ce`); dados por ID em `resultado.json`.

| Critério | Resultado |
| --- | --- |
| Abre sem botão | 180 sim; **6 não**: `geografia-movimentos-da-terra` ("Explorar estações 3D") e 5 de Matemática com alternância "Objeto 3D" (cubos/paralelepípedos, prismas, pirâmides, sólidos de revolução, razões entre volumes) |
| Gira (arraste/teclado) | 185/185 |
| Movimento | **89 de 185 estáticos** (24 do lote ciências-56, 15 anteriores, 14 espacial-21, 12 lote-20, 9 química, 8 física, 7 biologia) |
| Parâmetro muda o 3D | 22 em que o controle principal só muda a projeção 2D |
| Objeto próprio | **4 capítulos de gases** (gases ideais, trabalho do gás, 1ª lei, 1ª lei aplicada) mostram o mesmo cilindro e a mesma leitura; só o título muda |
| Imersão (inspeção visual) | Maioria em traço fino sem superfícies, sombra ou profundidade; objeto ocupa pouco do palco. Alguns são gráficos 2D dentro do quadro 3D (Carnot, curva de aquecimento, gerador, receptor, Kirchhoff) |
| Cabe no quadro | 17 desenhos com elementos medidos além do viewBox (Química orgânica e Biologia molecular) — conferir |

Nenhum erro de página. Conclusão: os 186 cumprem "girar", mas não cumprem integralmente "sem botão", "movimento" e "imersivo".

## Depois da correção (mesmo roteiro, `resultado-pos-correcao.json`)

| Critério | Antes | Depois |
| --- | --- | --- |
| 3D atrás de botão | 6 | 0 (os dois "botões" restantes da medição são etapas numeradas da prancha) |
| Sem movimento | 89 | 0 — modelos de percurso mantêm o percurso; os demais percorrem o parâmetro ou giram por inteiro, sempre iniciados pela estudante, com pausa e movimento reduzido |
| Gases com desenho repetido | 4 | 0 — partículas (estado), área sob p×V (trabalho), balanço Q/ΔU/W (1ª lei), quatro transformações (particulares) |
| Erros de página | 0 | 0 |

Acabamento: palco comum (`SpatialStage`) com luz de estúdio, perspectiva leve, ordenação de profundidade, faces com gradiente e sombreamento pela luz, esferas com brilho especular, piso em grade que se dissolve, sombras de contato e rótulos em pílula; painel com controle segmentado, trilhos preenchidos, números tabulares e leitura em cartão. Sólidos de Matemática e DNA deixaram de ficar cobertos pelo desenho 2D.
