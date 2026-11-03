# Seleção de banca no podcast

O controle de banca estava no final das configurações de vozes, com o nome
“Foco de vestibular”. Além disso, `board` na URL prevalecia permanentemente
sobre a escolha do painel, podendo carregar fontes e enviar bancas diferentes
da preferência exibida em `settings.exam`.

**Banca do podcast** agora fica no início da seleção do conteúdo. Oferece
Fuvest, Unicamp, Unesp, Famerp, Unifesp, ENEM e bancas adicionais do perfil.
A opção Geral permanece disponível para o conjunto de bancas pessoais ou as
origens disponíveis quando não há bancas confirmadas.

Uma escolha específica governa as três partes do fluxo:

1. O carregamento das fontes recebe somente a banca escolhida e é atualizado
   ao trocar de banca. A geração aguarda as novas fontes quando há tópico selecionado.
2. O pedido de roteiro envia a mesma banca em `exam` e em `targetBoards`.
   O servidor dá precedência à escolha explícita, inclusive para clientes antigos
   que enviem uma lista contraditória. O prompt exige foco exclusivo, sem distribuir
   o tempo entre outras provas e sem inventar evidências ou frequência de cobrança.
3. A escolha permanece em `settings.exam` e `targetBoards` do episódio salvo.
   Alterar o painel depois não muda o foco de um episódio anterior.

A banca do link preenche o seletor, mas uma troca explícita remove esse parâmetro
mantendo os outros parâmetros do estudo. A preferência feita no seletor usa o
mecanismo existente de gravação de `podcastSettings` no perfil conectado.
Grafias antigas são normalizadas; COMVEST corresponde a Unicamp e VUNESP não
é convertida arbitrariamente em Unesp ou Famerp.

## Validação

- Testes de interface: banca exclusiva no pedido, recarregamento das fontes,
  configuração preservada no episódio, troca da banca recebida por link,
  restauração da preferência antiga e retorno ao modo Geral.
- Testes do servidor: prioridade da banca explícita sobre uma lista conflitante,
  orientação de foco exclusivo e compatibilidade com pedidos gerais/antigos.
- Navegador Chromium em 1440×1000, 834×1112 e 390×844: seleção pelo link,
  troca explícita, foco Geral, opções sem duplicidade, foco de teclado e ausência
  de rolagem horizontal. Capturas: [computador](desktop.png), [tablet](tablet.png)
  e [celular](mobile.png).

As capturas foram feitas sem conta real. O pedido e a gravação do episódio
foram validados com respostas controladas; não foi feita nova geração paga
de roteiro ou áudio em produção. Vozes, reprodução e episódios existentes
mantêm os mesmos fluxos.

Verificações concluídas: `npm run lint`, suíte completa `npm test` com dois
workers de interface e `npm run build`. Foram aprovados 1.319 testes de servidor
e bibliotecas e 3.388 de interface; um teste foi ignorado pela configuração
existente. O build conserva os avisos de tamanho dos bundles.

## Arquivos

- `src/views/Podcast.tsx`: seletor visível, leitura da URL e recorte das fontes.
- `src/features/podcast/PodcastSettingsPanel.tsx`: remoção do controle duplicado.
- `src/lib/podcastConfig.ts`: normalização compartilhada das bancas.
- `server/ai/validation.ts` e `prompts.ts`: recorte exclusivo no servidor.
- Testes de configuração, interface e personalização do roteiro.

Sem publicação automática nesta entrega.
