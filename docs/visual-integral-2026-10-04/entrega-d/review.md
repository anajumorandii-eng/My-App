# Revisão independente — Entrega D / Física F2–F3

Revisão de código em 2026-10-04, base informada `7d169534`. Fontes: manifesto de 21 capítulos, alterações de código e relatórios das frentes e contrato `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`. Referências abaixo são relativas à raiz do worktree e correspondem ao código lido nesta revisão.

**Parecer:** mecanismos novos resolvem os achados originais do manifesto no nível de código, com uma correção física importante ainda necessária na revalidação da prancha existente de Newton. Não substitui a aprovação visual integrada que o root está conduzindo.

## Critical

Nenhum encontrado.

## Important

### I1 — Subida do elevador não implica normal maior que peso

- **Referência:** `src/views/visual-boards/NewtonBoard.tsx:94`.
- **Reprodução concreta:** abrir “As Leis de Newton” e ler a relação “No elevador / N − P = m·a / subindo / N > P”. O estado inicial já a apresenta; não depende de controles.
- **Efeito:** ensina a inferir aceleração a partir do sentido da velocidade. Um elevador subindo com velocidade constante tem N=P; subindo e freando tem N<P. N>P exige aceleração para cima, independentemente do sentido do movimento.
- **Correção proposta:** trocar a condição por “acelerando para cima” (com eixo positivo para cima, já implícito em N−P=m·a).
- **Origem:** preexistente, identificado agora porque Newton consta expressamente no manifesto como item a revalidar. Não é regressão introduzida neste diff.

## Minor

### M1 — Entidade HTML literal no extremo a/λ = 0,5

- **Referência:** `src/views/visual-instruments/PhysicsRemainingInstrument.tsx:169`.
- **Reprodução concreta:** no capítulo de difração/polarização/ressonância, levar a/λ ao mínimo 0,5. O ramo JSX devolve a string JavaScript `'a &lt; λ: sem mínimo'`; React apresenta `&lt;` literalmente.
- **Efeito:** defeito de apresentação da desigualdade; a leitura numérica externa e a conclusão física “sem primeiro mínimo” estão corretas.
- **Correção proposta:** usar `'a < λ: sem mínimo'` nessa string.

### M2 — A proporção geométrica da fenda não corresponde ao a/λ mostrado

- **Referências:** `src/views/visual-instruments/PhysicsRemainingInstrument.tsx:156`, `:161–164`.
- **Reprodução concreta:** em a/λ=1, frentes incidentes ficam em x=36/61/86/111 (λ desenhado=25 unidades), mas a abertura entre hastes vale 10+9×1=19 unidades. Em a/λ=5, abertura=55 e λ=25, portanto proporção visual=2,2, embora o controle declare 5.
- **Efeito:** a leitura qualitativa (fenda mais larga, menor espalhamento) e o ângulo calculado continuam corretos, mas medir/comparar visualmente a abertura com as frentes conduz a outra razão. A cena não explicita essa diferença de escalas.
- **Correção proposta:** usar uma escala geométrica comum (por exemplo, abertura proporcional a 25×ratio, com layout adequado) ou declarar claramente fenda/frentes esquemáticas e sem escala comum. Não é necessário alterar a fórmula angular, que já trata corretamente a<λ.

## Resolução/revalidação dos 21 itens do manifesto

| Capítulo / ID abreviado | Resultado da revisão estática |
| --- | --- |
| Calor, temperatura e mudanças de estado (`fis-termologia-calor`) | Resolvido em `CalorimetryBoard`: distingue grandezas/unidades/escalas; condução, circulação sob gravidade e radiação no vácuo; curva com dois patamares e escala Q declaradamente esquemática. Cinco parcelas térmicas e interações intermoleculares corretas. |
| Cinemática escalar: conceitos fundamentais | Resolvido por desvio exato de `KinematicsBoard` para `KinematicsConceptBoard`: A=−1, B=4, C=1; percurso 5+3=8 m e Δs=2 m; mover origem a −2 altera posições e conserva diferenças. Escala geométrica de 30 unidades/m consistente. |
| Aceleração vetorial | Resolvido em `PhysicsFidelityTopics`: velocidade tangente, aceleração radial para o centro e tangencial nos casos acelerados; MRU tem a=0. As quatro situações permanecem simultaneamente visíveis. |
| Força e seus tipos | Resolvido em `FisicaMecanismos`: peso/normal/tração/atrito/mola preservam opacidade e seleção. Direções coerentes e comprimentos explicitamente não representam módulos. |
| As leis de Newton | Prancha central radial e laboratório do carrinho continuam presentes; F/m e Δs=½at² coerentes, inclusive F=0. **I1 impede aprovação física integral enquanto não corrigido.** Captura desktop integral deve incluir a prancha central e suas relações, conforme achado original. |
| Corpos interagindo / transmissores de força | Resolvido em `PhysicsMechanismScenes`: duas forças do fio sobre blocos explicitamente não constituem um par; reações de A e B sobre o fio apontam em sentidos opostos às correspondentes ações. |
| Movimentos em plano vertical | Resolvido em `MechanicsFidelityScenes`: peso e normal distintos no topo/fundo; Ntop=v²/3−10, vfund²=vtop²+120 e Nfund=vtop²/3+50. Quando Ntop exigida<0, normal desenhada retirada e impossibilidade de contato declarada. Conservação restrita a antes da perda de contato. |
| MHS | Resolvido: F=−4x, A=5, m=1, v=2√(25−x²), U=2x² e K=50−U. F desaparece em x=0; v desaparece em ±5; ramo da velocidade explicitamente para a direita. Energia total 50 J e barras em mesma escala. |
| Trabalho e energia potencial | Resolvido: elevação quase estática com início/fim na mesma vertical, cota h vinculada à posição, peso para baixo; ΔU=20h, Wpeso=−20h e ΔK=0, inclusive h=0. |
| Sistemas conservativos/não conservativos | Resolvido: deslocamento à direita, atrito à esquerda, W=−4fat, Kfinal=40−4fat e energia interna=4fat. Faixa 0…10 N garante K≥0; em zero não há seta fictícia, em 10 N toda energia inicial transforma-se em interna ao final dos 4 m. |
| Obtenção de energia elétrica | Resolvido em `FisicaMecanismos`: reservatório/queda, combustão/vapor, vento, fissão/vapor e fotovoltaica têm objetos próprios selecionáveis; turbina/gerador distinguidos da conversão fotovoltaica. |
| Estática | Resolvido: três quadros agora totalmente legíveis; braços 28/56 e F₁=2F₂ satisfazem torques opostos; contraexemplo apresenta binário com força resultante zero e torque não nulo. |
| Dilatação/contração térmica | Resolvido em `PhysicsFidelityTopics`: comprimentos/áreas/volumes inicial/final, líquido/recipiente e γaparente; ΔL=1 mm para os valores dados; isotropia, pequenas dilatações e exagero visual explícitos. |
| Primeira lei da termodinâmica | Resolvido em `ThermalMechanisms`: Q=+12 entrando, W positivo saindo/negativo entrando; W=0 sem seta; ΔU=12−W, com casos positivo/nulo/negativo. Pistão responde ao sinal e não pretende representar volume quantitativo. |
| Máquinas térmicas/Carnot | Resolvido: fontes, máquina, fluxos Qh/Qc/W; Th=600 K, Tc=30Qc, Qh=20 J, W=20−Qc. T×S horário com duas isotermas e duas isentrópicas, ΔS=1/30 J/K; área corresponde a W, 0<Tc<Th na faixa inteira. |
| Lentes: estudo gráfico | Resolvido em `LensMechanism`: raios completos e imagem/prolongamentos opacos desde clock=0. Convergente/divergente e objeto no foco preservam construção correta; animação acrescenta destaque sobre construção estática. |
| Fabricante/associação de lentes | Resolvido em `LensPowerMechanism`: raios completos desde clock=0; foco assinado x=240+400/V, afocal sem foco finito, indicação quando sai da janela; vergência e mudança de sinal coerentes. |
| Ondas eletromagnéticas | Resolvido em `WaveMechanism`: x/y/z identificados, projeção oblíqua declarada, E/B calculados a partir da mesma amostra/fase e amplitudes normalizadas sem escala comum de unidades. |
| Intensidade sonora | Resolvido em `WavesInstrument`/`wavesLab`: P=8 W, área esférica, r, I=P/A, curva β(r) e referência I₀. I em 8 m permanece positiva (0,0099 W/m²); dobrar r reduz β aproximadamente 6,02 dB. |
| Difração, polarização e ressonância | Mecanismos agora separados e simultâneos. θ=asin(λ/a), ausência de primeiro mínimo para a<λ, Malus com I₀ após primeiro filtro e amplitude proporcional a √I; resposta amortecida com ζ=0,1 e A(f₀)=5A₀, sem infinito. **M1/M2 pendentes.** |
| Noções de física quântica | Resolvido: átomo reinicia em E₀, só frequências 6/10 coincidem exatamente com transições; níveis declarados sem escala e largura desprezada. Fotoelétrico separado, φ=3 eV, emissão para hf≥φ e Kmax=hf−φ; frequência 8 emite no metal sem absorção no átomo. |

## Limites e evidência

Não executei testes, build, lint ou navegador, nem modifiquei produção, conforme pedido. Resultados de 87 testes UI/21 Node/build/lint foram informados pelo root e não são uma execução independente desta revisão. Examinei testes novos para entender seu alcance: cobrem presença e valores/sinais relevantes, mas não provam, sozinhos, fidelidade visual, ausência de cortes, contraste ou sobreposição.

A validação de browser, inclusive tamanhos 360–390/tablet/desktop, temas, movimento/redução, fontes, pan, seleção/diagnóstico, modos Testar/Reconstruir, console/rede e capturas integrais, permanece sob responsabilidade da execução integrada em andamento. Ausência dessa execução local não foi convertida em severidade artificial. Esta revisão não afirma aprovação visual final.

## Correções posteriores à revisão

I1: condição corrigida para “acelerando para cima”, com regressão observada falhar e depois passar. M1: string corrigida para `<`. M2: abertura alterada para `25×ratio`, na mesma escala das frentes incidentes (25). Conferência visual após estas alterações ainda pendente.
