# Entrega D — óptica e ondas

## Escopo
- `summary-fisica-lentes-esfericas-estudo-grafico`
- `summary-fisica-equacao-do-fabricante-de-lentes-e-associacao-de-lentes`
- `summary-fisica-ondulatoria-ondas-eletromagneticas`
- `summary-fisica-intensidade-sonora`

## Correções
Lentes: ambos os raios, imagem real/virtual e prolongamentos são legíveis com relógio zero, em movimento normal e reduzido. O relógio destaca um trecho sobre o traçado completo. A construção conserva Gauss e os controles de posição/tipo. Associação: raios completos, foco equivalente na posição assinada `240 + 400/V`, indicação afocal e foco fora da janela. Meio/curvatura/segunda lente preservados.

Onda eletromagnética: eixo x de propagação, y de E e z de B explicitados em perspectiva oblíqua. Ambos os vetores usam a mesma amostra senoidal em cada posição; amplitudes normalizadas sem escala física comum. Som e corda existentes preservados.

Intensidade sonora: fonte pontual isotrópica, esfera de área `4πr²`, raio ao observador, potência constante 8 W, intensidade `P/A`, curva `β(r) = 10 log₁₀(I/I₀)` e marcador ligado ao controle. Hipóteses sem absorção e `I₀ = 10⁻¹² W/m²` explícitas. Leituras numéricas mostram área e nível sonoro; intensidade passa a quatro casas para não aparecer como zero em 8 m. Demais fenômenos do instrumento preservados.

## Verificação
Testes novos em `src/views/visual-boards/OpticsWavesFidelity.test.tsx`: seis casos. O root observou RED de todos os seis antes da implementação, cobrindo raios iniciais normal/reduzido, associação e afocal, fase/projeção E/B e intensidade/área/dB em 1, 2 e 8 m, com queda de 6,02 dB ao dobrar r.

Comando centralizado:
`npx vitest run src/views/visual-boards/OpticsWavesFidelity.test.tsx src/views/visual-boards/LensMechanism.test.tsx src/views/visual-instruments/WavesInstrument.test.tsx`

GREEN UI observado pelo root: os seis novos casos e os testes originais de LensMechanism/WavesInstrument passaram. O teste Node antigo de wavesLab expôs a mudança da posição da intensidade: ordem original P/I restaurada e área/nível acrescentados depois. Expectativa antiga arredondada 0,2 W/m² substituída por cobertura quantitativa em 1/2/4/8 m com tolerâncias da precisão exibida, incluindo leitura positiva no extremo. Reexecução Node, TypeScript/build e validação em navegador/capturas: aguardando execução centralizada do root. Nenhum runner ou servidor iniciado por esta frente; nenhum commit/publicação.

## Ajustes após smoke mobile reduzido
O root identificou colisões entre imagem e 2F′ e entre β(dB) e tick 120. Rótulos corrigidos localmente: imagem real fica pelo menos em y=280 (ou 32 unidades abaixo da ponta, para imagens mais altas); título do eixo β vai para y=168, separado dos ticks e do raio. Nenhum wrapper ou fonte global alterado. Revalidação visual centralizada pendente.
