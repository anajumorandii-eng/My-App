# Entrega D — Fenômenos ondulatórios e física quântica

## Escopo

- `summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia`
- `summary-fisica-nocoes-basicas-de-fisica-quantica`

Arquivos: `src/views/visual-instruments/PhysicsRemainingInstrument.tsx`, `src/lib/physicsRemainingLab.ts` e respectivos testes. Os demais IDs, incluindo gerador/receptor/magnetismo da entrega F1, permanecem preservados.

## Mecanismos

O capítulo ondulatório agora mostra três painéis simultâneos, com papel/contornos/tinta e cores do kit. Difração preserva fenda, frentes incidentes e espalhamento: a largura geométrica acompanha a/λ, o primeiro mínimo acompanha asin(λ/a), e a<λ declara ausência de primeiro mínimo. O controle existente a/λ permanece 0,5…5 em passos de 0,5.

Polarização contém dois filtros vistos de frente, eixos de transmissão, direções do campo antes/depois e bloqueio com filtros cruzados. Um controle independente ajusta 0…90° em passos de 15°, com I/I₀=cos²θ, sendo I₀ a intensidade após o primeiro filtro. A amplitude gráfica é proporcional à raiz da intensidade, e sua direção acompanha o analisador.

Ressonância contém mola, massa, força periódica externa e curva de amplitude do oscilador amortecido. O controle f/f₀ percorre 0,5…1,5 em passos de 0,1; A/A₀ = [(1−r²)²+(2ζr)²]⁻¹/², ζ=0,1, A₀=F₀/k. Em f=f₀ a amplitude é 5A₀. A curva deixa visível o pico próximo de f₀, sem sugerir amplitude infinita.

A quântica separa dois painéis: átomo idealizado inicialmente em E₀ e superfície metálica. O átomo tem ΔE₀₁=6h·10¹⁴ Hz e ΔE₀₂=10h·10¹⁴ Hz; apenas f=6 ou10×10¹⁴ Hz produz seta/transição. Outros valores mantêm o elétron em E₀. Níveis sem escala vertical e largura de linha desprezada são explícitos; cada ajuste reinicia em E₀. No metal, φ=3 eV e emissão depende de hf≥φ, com Kₘáx=hf−φ. Em toda a faixa f=3…12 o desenho e as leituras discriminam absorção ressonante e emissão fotoelétrica.

Movimento apenas interpola a orientação do analisador e a posição do bloco quando os respectivos controles mudam. `initial={false}` conserva o estado final no primeiro quadro; movimento reduzido usa duração zero. As cenas permanecem completas sem reprodução.

## Testes e evidências

RED observado pelo agente principal antes de implementação: dois novos testes DOM falharam por ausência de polarização/ressonância e transições discretas; testes node falharam por ausência de leituras de absorção/fotoelétrico e por atribuir primeiro mínimo a a<λ.

Comandos delegados ao agente principal (nenhum runner iniciado nesta frente):

- `node --import tsx --test src/lib/physicsRemainingLab.test.ts`
- `npx vitest run src/views/visual-instruments/PhysicsRemainingInstrument.test.tsx --maxWorkers=1`

GREEN, TypeScript/build e captura no navegador: aguardando validação centralizada. Testes DOM percorrem extremos da polarização, resposta em f=f₀, difração em a/λ=0,5/1/5 e cada frequência quântica de3 a12; o teste pré-existente de todos os capítulos passa a selecionar o controle principal a/λ quando existem três controles.

## Limites da validação

Nenhum servidor, browser, instalação, commit ou push foi realizado nesta frente, conforme brief. SVGs altos (320×810 e320×520) preservam leitura dos mecanismos em celular sem miniaturizar três fenômenos dentro de um único quadro320×300. A inspeção responsiva/temas/console/rede e respectivas capturas precisa ser confirmada pelo agente principal antes da aprovação visual.
