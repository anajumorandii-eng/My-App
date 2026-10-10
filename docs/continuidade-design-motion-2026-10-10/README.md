# Continuidade — Design & Motion Kit

Base: `3200ea9b67eb00fdb867b287b9d2fed2ba162765`. Retomada autorizada após a auditoria dos 613 capítulos. As PRs #293, #294 e #295 já estão mescladas e não devem ser reaplicadas.

## Correções

- `fis-termologia-calor`: acrescentada explicação de calor latente, condições de pureza/pressão/equilíbrio e exemplo de fusão. A dica agora aponta para a explicação pertinente; preservadas as escalas e os mecanismos de transferência.
- `summary-biologia-poriferos-e-cnidarios`: ensinada a simbiose dos corais com zooxantelas. Pergunta, prática e critérios distinguem risco de morte e possibilidade de recuperação. Os critérios dos coanócitos cobram corrente de água e captura de alimento separadamente.
- `summary-historia-a-montagem-da-colonizacao`: texto e recortes reconhecem coexistência regional da escravização indígena e africana, interesses comerciais e trabalho compulsório nos aldeamentos. A balança de condições necessárias foi substituída por fatores contextualizados e comparação Nordeste/São Vicente. Removida a origem exclusivamente calcária atribuída ao massapé.
- `summary-historia-a-crise-do-antigo-sistema-colonial`: o controle compartilhado de recortes respeita palavras inteiras, com coluna única até 420 px. Mantidos tamanho de toque e navegação por teclado.

Os três capítulos com mudanças pedagógicas passam da revisão editorial 2 para 3. IDs de capítulo e material permanecem iguais; apenas seções e recuperação destes capítulos pedem nova leitura. Nenhum dado pessoal ou progresso persistido foi modificado. As outras entradas editoriais permanecem iguais à base.

## Referências consultadas

Sínteses autorais, sem reprodução de questões oficiais. As fontes abaixo sustentam as correções indicadas; não certificam integralmente os capítulos.

- [OpenStax — Phase Change and Latent Heat](https://openstax.org/books/physics/pages/11-3-phase-change-and-latent-heat): energia e mudança de fase.
- [NOAA — Zooxanthellae](https://oceanservice.noaa.gov/education/tutorial_corals/coral02_zooxanthellae.html) e [Coral bleaching](https://oceanservice.noaa.gov/facts/coral_bleach.html): nutrição, branqueamento e recuperação.
- [UFF — Revolta contra os jesuítas](https://www.historia.uff.br/impressoesrebeldes/revolta/revolta-de-moradores-contra-os-jesuitas/): persistência do cativeiro indígena em São Vicente no século XVII e diferenças regionais.
- [Arquivo Nacional — Aldeamento de índios](https://www.gov.br/arquivonacional/pt-br/sites_eventos/sites-tematicos-1/central-de-conteudo-glossario/letra-a/abome): controle colonial e disputa pelo trabalho.
- [Biblioteca Nacional — Tráfico e comércio](https://bndigital.bn.gov.br/dossies/trafico-de-escravos-no-brasil/escravidao-no-brasil/trafico-e-comercio-de-escravos/): redes comerciais, lucros e fluxos regionais.
- [Embrapa — Textura do solo](https://www.webambiente.cnptia.embrapa.br/webambiente/wiki/doku.php?id=webambiente:textura): caracterização argilosa do massapé.

Design & Motion Kit: referências Claude/Miro e guias Fancy, React Bits e COBE consultados na auditoria. Mantidos Newsreader/Inter, papel, tinta, paleta e objetos do Crivo. O movimento da seleção acompanha o recorte em foco; não representa peso causal. O estado estático permanece completo com movimento reduzido. Nenhuma dependência visual adicional foi necessária.

## Continuidade pendente

A auditoria estrutural abrange 613 capítulos; esta correção trata os achados confirmados, não aprova pedagogicamente os 613. Os 81 estados em validação e os 532 não revisados permanecem preservados. Os demais candidatos da triagem lexical e as pendências bibliográficas anteriores continuam sujeitos a revisão manual por ID. O avaliador de palavras-chave é aproximado e não interpreta semanticamente toda resposta.

Não reaplicar correções mescladas nem promover estados formais por contagem de testes. Próxima etapa: revisar os demais candidatos e pendências por capítulo, com fontes e estados visuais quando necessários. Sem merge automático.

## Validação e evidências

A estrutura dos 613 capítulos permanece consistente (14 matérias, zero divergências e nenhum fallback). A validação de navegador posterior às correções abrange 15 IDs e 12 configurações: 360/834/1440 px, claro/escuro e movimento normal/reduzido, totalizando 180 casos aprovados. Ela verifica SVG, console, controles de toque, seleção por teclado, comparação, inspetor e alternância entre Explorar/Testar/Reconstruir.

Também passaram 90 casos de legibilidade de recortes e 64 estados de colonização, incluindo 390 px e os quatro recortes por teclado. Os oito pares de contraste dos blocos de colonização têm mínimo de 7,19:1.

[Resultados e hashes de código](evidencias/revisao.json), [180 casos de navegador](evidencias/navegador-180.json), [legibilidade](evidencias/recortes-90.json), [estados de colonização](evidencias/colonizacao-64.json), [contraste](evidencias/contraste-8.json) e [manifesto das dez capturas inspecionadas](evidencias/capturas.json). Foram inspecionadas as quatro aberturas corrigidas em 360/escuro e 1440/claro, além das duas pranchas completas de colonização. As pranchas completas usam viewport alto para exportação; os demais casos verificam a navegação nas dimensões normais.

Os 943 testes de lógica e 87 testes focados passaram. A suíte ampla encontrou uma dependência do horário no teste de cronômetro: a passagem pela meia-noite de Brasília mudava o dia de estudo durante o avanço de relógio simulado. A falha foi reproduzida às 23h59 e o horário de teste foi fixado em meio-dia; os 17 testes de sessão passaram. Nenhum comportamento de produção do cronômetro foi alterado. O teste de resposta longa usa colagem para manter o fluxo de envio/correção sem simular cada caractere sob concorrência.

O ambiente perdeu temporariamente a conexão durante a verificação. As capturas e os resultados de navegador foram recuperados integralmente; a suíte ampla foi reiniciada após estabilizar os testes. TypeScript e build foram concluídos. A execução final passou nos 1.524 testes dos 186 arquivos, sem falhas; [log final](evidencias/suite-ampla-1524.log).

### Reproduzir a auditoria seletiva

Execute da raiz do repositório com dependências instaladas, build atualizado e `vite preview` na porta 3003. Os scripts usam dados locais de teste. `capturar.cjs` exige `CRIVO_AUDIT_WIDTH`, `CRIVO_AUDIT_THEME` e `CRIVO_AUDIT_MOTION`; repita as três larguras, os dois temas e as duas preferências de movimento. `CRIVO_VISUAL_URL` e os diretórios de saída são configuráveis. `recortes.cjs`, `colonizacao.cjs` e `contraste.cjs` reproduzem as verificações complementares. Use uma prévia estável para evitar mudanças do build durante a captura.

[Galeria das capturas](GALERIA.md). Os testes editoriais estão em `src/data/continuityGeography.test.ts`, já executado pelo CI do repositório.
