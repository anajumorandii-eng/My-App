# Entrega D — 21 capítulos de Física F2/F3

Retomada do checkpoint `f3e519df` do PR #259, com base em `7d169534ecbcf5448d2a0b34eb4085eade40e67b`. Registro UTC: 05/10/2026; 04/10/2026 no horário da usuária. Escopo: F2 (11 capítulos) e F3 (10), sem repetição das entregas A/B/C já integradas. [Manifesto](manifest.json) · [Galeria](GALERIA.md) · [Evidência do navegador](browser-evidence.json).

## Mecanismos e correções

As cenas tratam referencial/percurso, componentes da aceleração, tipos de força, Newton, terceira lei, movimento vertical, MHS, trabalho/energia, dissipação, geração elétrica, equilíbrio, dilatação, calor/transferência, Primeira Lei, Carnot, lentes, campos eletromagnéticos, intensidade sonora, difração/polarização/ressonância e quantização/fotoelétrico. Objetos, vetores, hipóteses, escalas e consequências correspondem ao próprio capítulo; o mecanismo completo permanece disponível sem reproduzir uma animação.

A retomada corrigiu o mínimo intrínseco do grid que fazia calorimetria produzir uma página de 521 px em tela de 390 px. O desenho largo permanece na janela de rolagem interna, com operação por teclado. Os wrappers de calorimetria e corpos interagindo passaram a ocupar a área da figura no desktop; a regra genérica os colocava na coluna dos controles, deixando papel vazio e recortando a cena. Calorimetria recebeu composição própria centralizada e perdeu duas notas externas redundantes que sobrepunham a dica de rolagem; os rótulos e fórmulas da curva continuam presentes.

A revisão independente encontrou espiras do MHS atrás da parede nos extremos negativos. Em x = −5, chegavam a 8 unidades, embora a parede estivesse em 30. A mola agora permanece entre a parede e a face do bloco em toda a faixa; a regressão geométrica foi observada falhar e depois passar. O teste verifica limites, ligação ao bloco e ordem dos pontos, além das regressões de força/velocidade/energia já existentes.

A conferência visual corrigiu colisões em corpos interagindo, movimento vertical, dilatação e intensidade sonora. O tablet exigiu espaçamento adicional entre equação e leitura no movimento vertical. Em 360 px, seis cenas tinham fonte efetiva de 10,8875 px; o ajuste para 13,5 unidades preserva o mínimo de 11 px sem alterar os valores físicos. A condição correta de aceleração do elevador e a escala comum da fenda/frentes da difração, corrigidas antes do checkpoint, foram preservadas.

## Verificação de navegador

Chromium na build de produção, 390/834/1366 × 1000 px, claro/escuro, movimento normal/reduzido: 12 configurações de todos os 21 IDs. A checagem adicional percorreu os 21 em 360 × 1000 px, nos dois temas e com movimento reduzido. Evidência final consolidada: **14 configurações, 1.860 estados e 1.868 estados SVG**, sem overflow de página, corte de rótulo, colisão ou fonte abaixo do mínimo nos estados verificados.

A execução integral inicial passou em oito configurações e encontrou uma colisão no movimento vertical nas quatro de tablet. Depois das correções, os três capítulos de layout foram reexecutados nas 12 configurações; as seis cenas cujo tamanho de fonte mudou também foram reexecutadas nas 12. A evidência conserva a execução inicial e substitui, por ID, os estados dos capítulos alterados pelos da última execução aprovada. Isso evita apresentar a rodada inicial com falhas como uma execução inteiramente verde.

Foram exercitados estado inicial, extremos e zero dos controles, escolha de situações, deslocamento da origem, pan por teclado, convergentes/divergentes em todas as posições e energias 3/6/8/10 na comparação quântica. As aberturas de Testar/Reconstruir são verificadas com fixtures locais, sem envio de respostas na conta real.

O teste de faces usa o papel acessível correto (`tab`) e aguarda a saída do artefato anterior ao navegar entre capítulos. Assim, o título novo não faz o teste operar os controles da prancha anterior durante a transição. Em 360/390/834, dois temas e duas preferências de movimento, os 16 capítulos com BoardShell completaram **192 idas e voltas Essencial/Relações por teclado**: relação visível, cena recolhida, retorno à figura e página contida. Os outros cinco capítulos usam cenas próprias, sem essas abas.

As 63 capturas da galeria registram o estado inicial em celular claro e desktop claro/escuro. Barras fixas são ocultadas apenas para capturar; as regras de layout do produto permanecem ativas. Durante as capturas definitivas, o serviço externo e o Git responderam 503 no ambiente. As famílias públicas do próprio aplicativo foram carregadas de um cache temporário do repositório `google/fonts`, com pesos/estilos preservados; os binários não são versionados. A origem do cache está em [font-cache-provenance.json](font-cache-provenance.json). Fontes efetivamente carregadas são registradas em [capture-evidence.json](capture-evidence.json); os testes também registram as famílias carregadas, em vez de certificar tipografia apenas por `document.fonts.check()`.

## Verificação final e fila

`npm run lint`, `npm run build` e `npm test` passaram: **888 testes Node + 1.055 Vitest = 1.943 testes**, sem falhas. `npm run visual:matrix` passou em 13 testes e `npm run visual:quality` em quatro, sem delta nos relatórios gerados. A regressão de compressão da mola passou em seis testes dirigidos.

Após revisão e inspeção, os 21 IDs foram tratados nesta proposta. A fila passa a **138 tratados, 160 pendentes e 315 preservados**, mantendo 613 IDs e oito lotes restantes. Permanecem 140 resumos pendentes, 470 registros na revisão 2 e dois na revisão 3; nenhuma aprovação editorial formal foi promovida. O script de integridade verifica JSON, CSV, fontes e evidências. A fila publicada na branch depende da integração do PR para chegar a main.

## Limites

Evidência de Chromium e fixtures locais. Safari/iPad físico e fluxos autenticados não foram certificados. Os IDs, textos editoriais, revisões, progresso e chaves de persistência foram preservados. O tratamento dos achados não promove aprovação editorial formal. O PR permanece rascunho e não será mesclado automaticamente.
