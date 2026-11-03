# Roteiro acompanhando a reprodução

O player oferece **Acompanhar roteiro**: cada fala ou parágrafo recebe destaque conforme o tempo do áudio. Tocar no trecho busca sua posição sem iniciar uma reprodução pausada. A leitura pode seguir automaticamente; rolar manualmente ou navegar pelo teclado interrompe o acompanhamento, com retorno pelo botão **Voltar ao trecho atual**. Roteiro integral, download e referências continuam disponíveis.

## Sincronização e compatibilidade

As marcações usam a quantidade real de amostras PCM de cada fala sintetizada, incluindo as pausas entre elas. Não há estimativa por contagem de palavras nem cronômetro separado do elemento de áudio. Pausar, acelerar e buscar preservam a correspondência com `currentTime`.

O serviço inclui as marcações num chunk RIFF `crvo`, preservado no cache do servidor. A chave do áudio agregado mudou; o cache pago por fala mantém sua chave. Um narrador usa parágrafos separados. O cliente valida as marcações e sua correspondência com o roteiro, acumula posições entre respostas e mantém URL e marcações juntas no cache da sessão. O áudio final para reprodução/download continua WAV PCM convencional.

Respostas sem marcações usam os limites reais dos trechos de áudio disponíveis, com menor granularidade. Um áudio já aberto sem marcações mantém o roteiro integral, sem simular acompanhamento. A troca de conta limpa áudio e marcações.

## Verificação

- Testes de duração PCM, metadados inválidos, pausas, composição de respostas e reutilização do cache de síntese.
- Testes do player: pausa, avanço/retorno, velocidade, troca de episódio, leitura livre, retomada, roteiro anterior ao áudio e compatibilidade sem marcações.
- Teste da aba completa com geração simulada, abertura pela lista e reuso de áudio e marcações em cache.
- Chromium com WAV PCM reproduzível de 24 segundos e roteiro sintético: reprodução real, mudança automática do destaque, busca pausada e velocidade 2× em 1440×1000, 834×1112 e 390×844; ausência de transbordamento horizontal.
- Inspeção visual das capturas abaixo com os estilos do projeto.

As chamadas pagas do provedor de voz não foram executadas nesta validação; a síntese usa respostas PCM controladas nos testes. As capturas são de conteúdo sintético, sem dados de estudantes.

[Computador](desktop.png) · [Tablet](tablet.png) · [Celular](mobile.png)

Verificações finais: `npm run lint` sem erros; `npm test -- -- --maxWorkers=2` com 1.324 testes Node aprovados (um ignorado) e 3.395 testes de interface aprovados em 262 arquivos; `npm run build` concluído. O build mantém os avisos existentes de bundles grandes e os testes de interface emitem avisos do ambiente simulado sobre `scrollTo`; não houve falha. O teste adicional da aba/cache também passou isoladamente (15 testes no arquivo).
