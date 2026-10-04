# Entrega D — frente térmica

## Cobertura

- `fis-termologia-calor`: temperatura versus calor e unidades; equivalência Celsius/Fahrenheit/Kelvin e conversões; condução com partículas em sólido, convecção com circulação/gravidade/aquecimento e irradiação atravessando vácuo. Curva de aquecimento, seleção sensível/latente e diagnóstico preservados.
- `summary-fisica-primeira-lei-da-termodinamica`: gás/cilindro/pistão, Q recebido com seta entrando e W com seta saindo/entrando segundo sinal; sem seta fictícia em W=0; ΔU positivo/nulo/negativo. Pistão responde à mudança de sinal com motion/react, respeitando movimento reduzido. Convenção escrita na cena.
- `summary-fisica-maquinas-termicas-e-ciclo-de-carnot`: fontes quente/fria, máquina cíclica e fluxos Qh/Qc/W, balanço ΔU ciclo=0. Ciclo T×S completo com quatro etapas nomeadas: duas expansões e duas compressões, isotermas e adiabáticas. Área do ciclo representa trabalho; temperaturas em Kelvin e reversibilidade declaradas.

## Hipóteses e fidelidade

- Primeira lei: Q=+12 J fixo; W é trabalho feito pelo gás, ΔU=Q−W. Cilindro esquemático, sem inferir pressão/volume quantitativos da figura. Controle W de −4 a 16 J preservado.
- Carnot: modelo ideal reversível sem atrito. Para preservar o controle Qc de 1 a 18 J, Qh=20 J e Th=600 K são fixos; Tc=Th·Qc/Qh=30Qc K é derivada, não outro parâmetro independente. Toda a faixa tem 0<Tc<Th. η=1−Qc/Qh=1−Tc/Th. ΔS=Qh/Th=1/30 J/K; área T×S=(Th−Tc)ΔS=20−Qc J. Adiabáticas reversíveis são isentrópicas. Máquinas reais ficam abaixo do limite entre as mesmas fontes.
- Aquecimento: água pura a 1 atm, Q em escala esquemática; patamares a 0°C/100°C. Removida inferência quantitativa sobre largura do patamar, pois o desenho não representa razão 540/80. Mudança de fase reorganiza interações intermoleculares; moléculas de água permanecem intactas. Cinco parcelas explícitas correspondem a gelo −20°C até vapor 140°C.
- Convecção ilustrada é natural sob gravidade: expansão térmica reduz densidade do fluido aquecido, que sobe. Irradiação independe de meio material.

## Arquivos próprios

- `src/lib/thermoLab.ts`
- `src/lib/thermoLab.test.ts`
- `src/views/visual-instruments/ThermoInstrument.tsx`
- `src/views/visual-instruments/ThermoInstrument.test.tsx`
- `src/views/visual-instruments/ThermalMechanisms.tsx` (novo)
- `src/views/visual-boards/CalorimetryBoard.tsx`
- `src/views/visual-boards/CalorimetryBoard.test.tsx` (novo)

Nenhum registry, BoardShell, conteúdo rev2 ou arquivo compartilhado alterado. APIs/IDs/limites/valores iniciais dos controles preservados; leituras Kelvin acrescentadas após leituras existentes.

## Verificação

Os testes foram escritos antes da implementação. Root confirmou RED: falta de leitura 600 K no node, falta dos fluxos/Carnot nos dois testes UI e ausência da distinção calor/temperatura no teste calorimétrico.

Comandos centralizados no root, sem runners concorrentes nesta frente:

```sh
node --import tsx --test src/lib/thermoLab.test.ts
npx vitest run src/views/visual-instruments/ThermoInstrument.test.tsx src/views/visual-boards/CalorimetryBoard.test.tsx
```

Cobertura de extremos: primeira lei W=−4/0/12/16 J, direção de entrada/saída e W nulo; Carnot Qc=1/8/18 J nos SVGs e toda a faixa inteira 1..18 nos balanços/temperaturas/rendimento. Transferências têm setas concretas, circulação e meio explicitados, completos na renderização estática.

GREEN, TypeScript, build e verificação visual integrada/capturas ainda pendentes de execução centralizada pelo root. Não há alegação de aprovação visual local; não foram iniciados servidor, instalação ou browser nesta frente.

## Reparação após smoke visual

O smoke 390 px com movimento reduzido (`browser-smoke.json`) detectou colisão entre o nome do eixo T(K) e a marca 600 no diagrama Carnot. O nome foi elevado de y=285 para y=270, acima do início do eixo em y=281, sem alterar dados/escala/ciclo. O root cuida do enquadramento e legibilidade dos SVGs calorimétricos via PhysicsDrawingWindow. Nenhum runner executado nesta reparação; revalidação visual centralizada ainda necessária.
