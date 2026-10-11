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
