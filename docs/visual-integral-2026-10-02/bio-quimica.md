> As capturas completas citadas neste parecer estão no pacote local `/workspace/crivo-visual-review-2026-10-02/bio-quimica/`; não foram todas adicionadas ao repositório. Ver o relatório principal para evidências selecionadas e os limites de cobertura.

# Biologia e Química — revisão Visual, 02/10/2026

Revisão somente leitura de 72 capítulos de Biologia e 48 de Química. Os veredictos por ID estão em [capitulos.json](capitulos.json). A classificação `manter` vale para a representação examinada e não constitui aprovação editorial completa do capítulo.

## Evidência e limites

O harness testa seis configurações por capítulo: 390, 768 e 1440 px, em claro e escuro. Salva recortes centrais claros de 390/1440 px, abre Explorar/Testar/Reconstruir e aciona o primeiro botão visível. Usa fundo caderno, efeitos mínimos e movimento reduzido. `browser.json` registra as medições; `screens/` contém os recortes; `sheets/01.jpg` a `05.jpg` permitem a inspeção comparativa de todos os IDs, complementada por imagens individuais nos casos suspeitos.

Isso não certifica a página inteira, contraste visual escuro por capítulo, todos os estados de seleção, exercício completo, movimento causal pleno, diagnóstico no inspetor, persistência no Caderno de Erros ou reconstrução por arraste/clique/teclado. A inspeção de conteúdo confronta o resumo atual exportado em `catalog.json` com o mecanismo e seu código; não substitui revisão científica integral de toda a redação.

A referência vinculante foi `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`, com inspeção das referências aprovadas de fotossíntese móvel e termodinâmica desktop. O requisito usado foi representar um mecanismo/objeto/relação específico, e não apenas exibir SVG ou copiar aparência ornamental. Os esquemas de pressão, escala de pKa, Punnett e cruzamento de eixos foram julgados pela relação que expõem.

As 720 configurações terminaram sem falha de navegação, erro runtime/console, overflow de página, imagem quebrada, colisão de textos ou controle sem nome. Houve quatro medições de recorte no mesmo rótulo Br, confirmadas visualmente em desktop; não foram descartadas como falso positivo. Resultado: **114 manter, 3 ajustar, 3 redesenhar**. Todas as 240 imagens centrais foram inspecionadas pelas cinco folhas finais, com confirmação individual dos casos suspeitos.

## Casos confirmados

| Capítulo | Veredicto | Evidência e motivo |
|---|---|---|
| Segunda Lei de Mendel e Interação Gênica | Redesenhar — alta | [Imagem](screens/summary-biologia-segunda-lei-de-mendel-e-interacao-genica-1440-light.jpg): Punnett 3:1; `MendelBoard.tsx` permite 9:3:3:1, mas não epistasia. Conteúdo atual: via de pigmento e F2 9:7. Criar mecanismo de interação entre loci. |
| Sangue e Imunologia | Redesenhar — alta | [Imagem](screens/summary-biologia-sangue-e-imunologia-1440-light.jpg): apenas ABO. `BloodTypeBoard.tsx` descreve doador/receptor O/AB. O resumo atual trata imunidade e vacina versus soro; precisa expor anticorpos próprios, memória e anticorpos prontos. |
| Termoquímica II | Redesenhar — alta | [Imagem](screens/summary-quimica-termoquimica-ii-1440-light.jpg): Hess, −40+(−60)=−100 kJ. `ThermochemBoard.tsx:9` escolhe Hess para II. O capítulo atual II é entropia/Gibbs/espontaneidade; Hess pertence ao I. |
| Carboidratos e Lipídios | Ajustar — média | [Imagem](screens/summary-biologia-composicao-quimica-celular-carboidratos-e-lipidios-1440-light.jpg): quatro quadros de carboidratos. `BiologiaFenomenos.tsx:599` não oferece lipídios; adicionar uma relação estrutural/funcional desses compostos ou sinalizar claramente o recorte. |
| Interpretando Reações Orgânicas | Ajustar — média | [Imagem](screens/summary-quimica-interpretando-reacoes-organicas-1440-light.jpg): rótulo Br corta o r à direita. Quatro medições a768/1440 claro/escuro apontam 4–5px fora do SVG. `QuimicaOrganica.tsx`, ramo Adição, posiciona Br em x211 num viewBox220 sem âncora central; preservar o símbolo inteiro. |
| Segunda Lei de Mendel | Ajustar — média | [Imagem](screens/summary-biologia-segunda-lei-de-mendel-1440-light.jpg): estado inicial é monohíbrido 3:1. `MendelBoard.tsx:21` só ativa dois pares após seleção direita. Iniciar no di-híbrido 9:3:3:1 para explicitar o mecanismo específico do capítulo. |

## Exemplos específicos preserváveis

Fotossíntese distingue tilacoides/Calvin e origem do oxigênio; coração desenha cavidades e circuitos; enzimas articulam encaixe e barreira energética; ligação gênica expõe cromossomos, distância e recombinantes; PCR mostra temperaturas e duplicação; gases distinguem recipiente rígido e seringa; balanceamento conserva entidades; esterificação e biodiesel têm estruturas e relações próprias. A fonte atual direciona cenas de família para desenhos específicos, portanto `artifact=tipologia` ou `cadeia-de-derivacao` no catálogo não significa automaticamente uma cena genérica.

Foi descartada uma suspeita de troca entre Citoplasma I e II causada por folha montada com capturas anteriores. As imagens individuais atuais e `visual-instruments/registry.ts:325–326` alinham I à rota de secreção e II ao citoesqueleto, coerentes com as seções atuais. Rodapés fixos eventualmente vistos em recortes são limite da captura/scroll; não foram registrados como obstrução funcional sem confirmação de página inteira.

## Fontes confrontadas

- `src/views/visual-boards/registry.ts`, `PhotosynthesisBoard.tsx`, `MendelBoard.tsx`, `BloodTypeBoard.tsx`, `ThermochemBoard.tsx` e mecanismos associados.
- `src/views/visual-instruments/registry.ts`, `BiologyRemainingInstrument.tsx`, `BiologyMechanismScenes.tsx`, `BiologyInstrument.tsx`, `ChemistryInstrument.tsx`, `ChemistryMechanisms.tsx`, `ElectrochemistryInstrument.tsx` e configurações em `src/lib/`.
- `src/views/topic-scenes/TopicScene.tsx`, famílias `BiologiaFenomenos`, `BiologiaFisiologia`, `BiologiaProcessos`, `EcologyCycles`, `EcologySystems`, `QuimicaFenomenos`, `QuimicaOrganica`, `QuimicaTipologia`, `GradeDeEixos` e dados de Biologia/Química.
- `src/views/topic-experiments/TopicExperiment.tsx` para Introdução à Ecologia.
- `catalog.json`: resumos atuais, seções, associação ativa e artefatos ignorados.
