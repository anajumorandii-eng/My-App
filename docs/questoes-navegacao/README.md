# Questões: navegação livre e tempo opcional

A tela passa a usar uma coluna, sem o painel lateral “Este treino”.
“Questão anterior” e “Próxima questão” funcionam antes da resposta e param
nos limites do recorte. Pular não registra tentativa; voltar preserva a
alternativa respondida durante o treino. “Reiniciar treino” permite começar
outra rodada.

“Usar cronômetro (opcional)” começa desligado. Responder não depende de
iniciar a contagem. Tentativas sem medição não gravam duração nem meta.

## Conferência no navegador

Capturas da rota real `/questoes` em Chromium: celular 390×844, tablet
834×1112 e desktop 1366×900. Navegação de ida e volta e ativação do cronômetro
conferidas; nenhuma rolagem horizontal nesses tamanhos. O painel removido
não ocupa mais espaço. Capturas feitas sem conta, com banco local (a
sincronização remota não está disponível nesse ambiente).

A barra móvel fixa permanece sobre a janela ao rolar, comportamento anterior
à alteração. Os novos controles estão no fluxo e quebram em linhas no celular.

Validação automatizada cobre resposta sem medição, pulo sem efeitos no
domínio, limites de navegação e restauração sem tentativa duplicada, além
das regressões de filtros, diagnóstico e cronômetro.
